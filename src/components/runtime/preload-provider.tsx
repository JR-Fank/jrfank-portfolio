'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import { updateDiagnostics } from '@/animations/core/diagnostics';

export type PreloadState = 'idle' | 'loading' | 'ready' | 'transitioning';

interface PreloadContextValue {
  readonly state: PreloadState;
  readonly recheck: () => Promise<void>;
  readonly setTransitioning: (transitioning: boolean) => void;
}

const PreloadContext = createContext<PreloadContextValue | null>(null);

function waitForImage(image: HTMLImageElement): Promise<void> {
  if (image.complete) {
    return image.decode?.().catch(() => undefined) ?? Promise.resolve();
  }
  return new Promise((resolve) => {
    const settle = () => {
      image.removeEventListener('load', settle);
      image.removeEventListener('error', settle);
      void (image.decode?.().catch(() => undefined) ?? Promise.resolve()).finally(resolve);
    };
    image.addEventListener('load', settle, { once: true });
    image.addEventListener('error', settle, { once: true });
  });
}

export function PreloadProvider({ children }: { readonly children: ReactNode }) {
  const [state, setState] = useState<PreloadState>('idle');
  const runId = useRef(0);

  const commitState = useCallback((nextState: PreloadState) => {
    setState(nextState);
    document.documentElement.dataset.preloadState = nextState;
    updateDiagnostics({ preloadState: nextState });
  }, []);

  const recheck = useCallback(async () => {
    const currentRun = ++runId.current;
    commitState('loading');
    const images = Array.from(document.querySelectorAll<HTMLImageElement>('img[data-preload="critical"]'));
    const readiness = Promise.all([document.fonts?.ready ?? Promise.resolve(), ...images.map(waitForImage)]);
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const timeout = new Promise<void>((resolve) => {
      timeoutId = setTimeout(resolve, 3500);
    });
    await Promise.race([readiness.then(() => undefined), timeout]);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    if (currentRun === runId.current) {
      commitState('ready');
    }
  }, [commitState]);

  const setTransitioning = useCallback(
    (transitioning: boolean) => commitState(transitioning ? 'transitioning' : 'ready'),
    [commitState],
  );

  useEffect(() => {
    void recheck();
  }, [recheck]);

  return <PreloadContext.Provider value={{ state, recheck, setTransitioning }}>{children}</PreloadContext.Provider>;
}

export function usePreload(): PreloadContextValue {
  const context = useContext(PreloadContext);
  if (!context) {
    throw new Error('usePreload must be used inside PreloadProvider.');
  }
  return context;
}
