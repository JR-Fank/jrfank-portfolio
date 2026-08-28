'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import { updateDiagnostics } from '@/animations/core/diagnostics';
import { getGsap } from '@/animations/core/gsap';
import { disposeActiveRouteScope } from '@/animations/core/route-scope';

import { usePreload } from './preload-provider';
import { useSmoothScroll } from './smooth-scroll-provider';

export type TransitionPhase = 'idle' | 'leaving' | 'navigating' | 'entering';

interface RouteTransitionContextValue {
  readonly phase: TransitionPhase;
  readonly navigate: (href: string) => void;
}

const RouteTransitionContext = createContext<RouteTransitionContextValue | null>(null);

export function RouteTransitionProvider({ children }: { readonly children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { recheck, setTransitioning } = usePreload();
  const { setLocked, scrollToTop, resize } = useSmoothScroll();
  const [phase, setPhaseState] = useState<TransitionPhase>('idle');
  const phaseRef = useRef<TransitionPhase>('idle');
  const previousPath = useRef<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const watchdogTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setPhase = useCallback((nextPhase: TransitionPhase) => {
    phaseRef.current = nextPhase;
    setPhaseState(nextPhase);
    updateDiagnostics({ transitionPhase: nextPhase });
  }, []);

  const resetTransition = useCallback(() => {
    const overlay = overlayRef.current;
    if (overlay) {
      getGsap().to(overlay, { opacity: 0, duration: 0.25, overwrite: true });
    }
    setTransitioning(false);
    setLocked('route-transition', false);
    setPhase('idle');
  }, [setLocked, setPhase, setTransitioning]);

  const navigate = useCallback(
    (href: string) => {
      if (phaseRef.current !== 'idle') {
        return;
      }

      const target = new URL(href, window.location.href);
      if (target.origin !== window.location.origin || target.pathname === window.location.pathname) {
        return;
      }

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const overlay = overlayRef.current;
      const navigationDelay = reducedMotion ? 120 : 1000;
      setPhase('leaving');
      setTransitioning(true);
      setLocked('route-transition', true);

      if (overlay) {
        getGsap().to(overlay, {
          opacity: 1,
          duration: reducedMotion ? 0.12 : 0.5,
          ease: reducedMotion ? 'none' : 'power2.inOut',
          overwrite: true,
        });
      }

      navigationTimer.current = setTimeout(() => {
        disposeActiveRouteScope();
        setPhase('navigating');
        router.push(`${target.pathname}${target.search}${target.hash}`, { scroll: false });
      }, navigationDelay);

      watchdogTimer.current = setTimeout(() => {
        if (phaseRef.current !== 'idle') {
          resetTransition();
        }
      }, 6000);
    },
    [resetTransition, router, setLocked, setPhase, setTransitioning],
  );

  useEffect(() => {
    if (previousPath.current === null) {
      previousPath.current = pathname;
      return;
    }
    if (previousPath.current === pathname) {
      return;
    }
    previousPath.current = pathname;

    if (phaseRef.current !== 'navigating' && phaseRef.current !== 'leaving') {
      void recheck();
      return;
    }

    setPhase('entering');
    scrollToTop();
    const enter = async () => {
      await recheck();
      resize();
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const overlay = overlayRef.current;
      if (!overlay) {
        resetTransition();
        return;
      }
      getGsap().to(overlay, {
        opacity: 0,
        delay: reducedMotion ? 0 : 0.1,
        duration: reducedMotion ? 0.12 : 1,
        ease: reducedMotion ? 'none' : 'power2.inOut',
        overwrite: true,
        onComplete: resetTransition,
      });
    };
    void enter();
  }, [pathname, recheck, resetTransition, resize, scrollToTop, setPhase]);

  useEffect(
    () => () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
      }
      if (watchdogTimer.current) {
        clearTimeout(watchdogTimer.current);
      }
      setLocked('route-transition', false);
    },
    [setLocked],
  );

  return (
    <RouteTransitionContext.Provider value={{ phase, navigate }}>
      {children}
      <div
        ref={overlayRef}
        className="route-transition-overlay"
        data-phase={phase}
        aria-hidden="true"
      />
    </RouteTransitionContext.Provider>
  );
}

export function useRouteTransition(): RouteTransitionContextValue {
  const context = useContext(RouteTransitionContext);
  if (!context) {
    throw new Error('useRouteTransition must be used inside RouteTransitionProvider.');
  }
  return context;
}
