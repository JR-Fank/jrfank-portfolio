'use client';

import { createContext, useContext, useLayoutEffect, useRef, type ReactNode } from 'react';

import { RouteAnimationScope } from '@/animations/core/route-scope';

const RouteScopeContext = createContext<RouteAnimationScope | null>(null);

export function RouteAnimationBoundary({ children }: { readonly children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<RouteAnimationScope | null>(null);
  if (!scopeRef.current) {
    scopeRef.current = new RouteAnimationScope();
  }

  useLayoutEffect(() => {
    const root = rootRef.current;
    const scope = scopeRef.current;
    if (!root || !scope) {
      return;
    }
    scope.mount(root);
    return () => scope.dispose();
  }, []);

  return (
    <RouteScopeContext.Provider value={scopeRef.current}>
      <div ref={rootRef} data-route-scope="active">
        {children}
      </div>
    </RouteScopeContext.Provider>
  );
}

export function useRouteAnimationScope(): RouteAnimationScope {
  const scope = useContext(RouteScopeContext);
  if (!scope) {
    throw new Error('useRouteAnimationScope must be used inside RouteAnimationBoundary.');
  }
  return scope;
}
