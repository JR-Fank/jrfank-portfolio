'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { setupMotionCaseAnimations } from '@/animations/motion/motion-case';
import { RouteAnimationBoundary, useRouteAnimationScope } from '@/components/runtime/route-animation-boundary';

function MotionCaseRouteSetup({ children }: { readonly children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scope = useRouteAnimationScope();

  useEffect(() => {
    let cancelled = false;
    const cancelReadiness = () => {
      cancelled = true;
    };
    scope.addCleanup(cancelReadiness);

    const prepare = async () => {
      const root = rootRef.current;
      if (!root) return;
      const animationImages = Array.from(root.querySelectorAll<HTMLImageElement>('[data-motion-animation-images] img'));
      // These measured sequences sit below the fold; promote them before decode so
      // native lazy-loading cannot leave the route animation setup waiting forever.
      animationImages.forEach((image) => {
        image.loading = 'eager';
      });
      await Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        ...animationImages.map((image) => image.decode().catch(() => undefined)),
      ]);
      if (!cancelled) setupMotionCaseAnimations(root, scope);
    };
    void prepare();
    return cancelReadiness;
  }, [scope]);

  return <div ref={rootRef} data-motion-case-animation-root>{children}</div>;
}

export function MotionCaseBoundary({ children, routeKey }: { readonly children: ReactNode; readonly routeKey: string }) {
  return (
    <RouteAnimationBoundary key={routeKey}>
      <MotionCaseRouteSetup>{children}</MotionCaseRouteSetup>
    </RouteAnimationBoundary>
  );
}
