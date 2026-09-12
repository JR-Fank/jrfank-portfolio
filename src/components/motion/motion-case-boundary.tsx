'use client';

import type { ReactNode } from 'react';

import { RouteAnimationBoundary } from '@/components/runtime/route-animation-boundary';

export function MotionCaseBoundary({ children, routeKey }: { readonly children: ReactNode; readonly routeKey: string }) {
  return <RouteAnimationBoundary key={routeKey}>{children}</RouteAnimationBoundary>;
}
