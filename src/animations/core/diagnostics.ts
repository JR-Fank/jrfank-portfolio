export interface PortfolioDiagnostics {
  lenisInstances: number;
  gsapTickerDrivers: number;
  activeRouteScopes: number;
  scrollTriggers: number;
  preloadState: 'idle' | 'loading' | 'ready' | 'transitioning';
  transitionPhase: 'idle' | 'leaving' | 'navigating' | 'entering';
}

declare global {
  interface Window {
    __PORTFOLIO_DEBUG__?: PortfolioDiagnostics;
  }
}

const defaults: PortfolioDiagnostics = {
  lenisInstances: 0,
  gsapTickerDrivers: 0,
  activeRouteScopes: 0,
  scrollTriggers: 0,
  preloadState: 'idle',
  transitionPhase: 'idle',
};

export function updateDiagnostics(patch: Partial<PortfolioDiagnostics>): void {
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') {
    return;
  }
  window.__PORTFOLIO_DEBUG__ = { ...(window.__PORTFOLIO_DEBUG__ ?? defaults), ...patch };
}
