'use client';

import Lenis from 'lenis';
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';

import { updateDiagnostics } from '@/animations/core/diagnostics';
import { getGsap, getScrollTrigger } from '@/animations/core/gsap';

interface SmoothScrollContextValue {
  readonly setLocked: (reason: string, locked: boolean) => void;
  readonly scrollToTop: () => void;
  readonly scrollToTarget: (target: HTMLElement, options?: { readonly duration?: number; readonly immediate?: boolean }) => void;
  readonly resize: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

export function SmoothScrollProvider({ children }: { readonly children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const lockReasons = useRef(new Set<string>());

  const setLocked = useCallback((reason: string, locked: boolean) => {
    if (locked) {
      lockReasons.current.add(reason);
    } else {
      lockReasons.current.delete(reason);
    }
    if (lockReasons.current.size > 0) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, []);

  const scrollToTop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  const scrollToTarget = useCallback((target: HTMLElement, options?: { readonly duration?: number; readonly immediate?: boolean }) => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (lenisRef.current && !reducedMotion) {
      const position = window.scrollY + target.getBoundingClientRect().top - Math.max(80, (window.innerHeight - target.offsetHeight) / 2);
      lenisRef.current.scrollTo(position, {
        duration: options?.duration ?? 0.5,
        immediate: options?.immediate ?? false,
        force: true,
      });
      return;
    }
    target.scrollIntoView({ behavior: options?.immediate || reducedMotion ? 'auto' : 'smooth', block: 'center' });
  }, []);

  const resize = useCallback(() => {
    lenisRef.current?.resize();
    getScrollTrigger().refresh();
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      updateDiagnostics({ lenisInstances: 0, gsapTickerDrivers: 0 });
      return;
    }

    const lenis = new Lenis({
      duration: 1.5,
      easing: (time: number) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      orientation: 'vertical',
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.5,
      autoRaf: false,
    });
    lenisRef.current = lenis;
    if (lockReasons.current.size > 0) {
      lenis.stop();
    }

    const gsap = getGsap();
    const scrollTrigger = getScrollTrigger();
    const updateScrollTrigger = () => scrollTrigger.update();
    const tick = (time: number) => lenis.raf(time * 1000);
    let resizeFrame: number | null = null;
    const onResize = () => {
      if (resizeFrame !== null) {
        cancelAnimationFrame(resizeFrame);
      }
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = null;
        resize();
      });
    };

    lenis.on('scroll', updateScrollTrigger);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    window.addEventListener('resize', onResize, { passive: true });
    updateDiagnostics({ lenisInstances: 1, gsapTickerDrivers: 1 });

    return () => {
      window.removeEventListener('resize', onResize);
      if (resizeFrame !== null) {
        cancelAnimationFrame(resizeFrame);
      }
      gsap.ticker.remove(tick);
      lenis.off('scroll', updateScrollTrigger);
      lenis.destroy();
      lenisRef.current = null;
      updateDiagnostics({ lenisInstances: 0, gsapTickerDrivers: 0 });
    };
  }, [resize]);

  return <SmoothScrollContext.Provider value={{ setLocked, scrollToTop, scrollToTarget, resize }}>{children}</SmoothScrollContext.Provider>;
}

export function useSmoothScroll(): SmoothScrollContextValue {
  const context = useContext(SmoothScrollContext);
  if (!context) {
    throw new Error('useSmoothScroll must be used inside SmoothScrollProvider.');
  }
  return context;
}
