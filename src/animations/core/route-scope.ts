import { getGsap, getScrollTrigger } from './gsap';
import { updateDiagnostics } from './diagnostics';

type Cleanup = () => void;
type GsapContext = ReturnType<ReturnType<typeof getGsap>['context']>;

let activeScope: RouteAnimationScope | null = null;

export class RouteAnimationScope {
  private cleanups = new Set<Cleanup>();
  private context: GsapContext | null = null;
  private disposed = false;

  mount(root: HTMLElement): void {
    this.disposed = false;
    this.context = getGsap().context(() => undefined, root);
    activeScope?.dispose();
    activeScope = this;
    updateDiagnostics({ activeRouteScopes: 1, scrollTriggers: getScrollTrigger().getAll().length });
  }

  addCleanup(cleanup: Cleanup): Cleanup {
    if (this.disposed) {
      cleanup();
      return cleanup;
    }
    this.cleanups.add(cleanup);
    return cleanup;
  }

  trackObserver(observer: IntersectionObserver | ResizeObserver | MutationObserver): void {
    this.addCleanup(() => observer.disconnect());
  }

  trackTimeout(timeoutId: ReturnType<typeof setTimeout>): void {
    this.addCleanup(() => clearTimeout(timeoutId));
  }

  trackAnimationFrame(frameId: number): void {
    this.addCleanup(() => cancelAnimationFrame(frameId));
  }

  run(setup: () => void): void {
    if (!this.context || this.disposed) {
      return;
    }
    this.context.add(setup);
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    for (const cleanup of Array.from(this.cleanups).reverse()) {
      cleanup();
    }
    this.cleanups.clear();
    this.context?.revert();
    this.context = null;
    if (activeScope === this) {
      activeScope = null;
    }
    updateDiagnostics({ activeRouteScopes: 0, scrollTriggers: getScrollTrigger().getAll().length });
  }
}

export function disposeActiveRouteScope(): void {
  activeScope?.dispose();
}
