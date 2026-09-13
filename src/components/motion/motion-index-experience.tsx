'use client';

import { useEffect, useRef } from 'react';

import { setupMotionIndexAnimations } from '@/animations/motion/motion-index';
import { SiteFooter } from '@/components/chrome/site-footer';
import { MotionIndexIntro } from '@/components/motion/motion-index-intro';
import { MotionProjectStage } from '@/components/motion/motion-project-stage';
import { RouteAnimationBoundary, useRouteAnimationScope } from '@/components/runtime/route-animation-boundary';
import type { MotionIndexProject } from '@/components/motion/motion-project-stage';
import type { SiteConfig } from '@/content';

interface MotionIndexExperienceProps {
  readonly projects: readonly MotionIndexProject[];
  readonly site: SiteConfig;
}

function MotionIndexRoute({ projects, site }: MotionIndexExperienceProps) {
  const rootRef = useRef<HTMLElement>(null);
  const scope = useRouteAnimationScope();

  useEffect(() => {
    let cancelled = false;
    let readinessTimer: ReturnType<typeof setTimeout> | null = null;
    let detachImageListeners: (() => void) | null = null;
    let resolveImageReadiness: (() => void) | null = null;

    const settleImageReadiness = () => {
      detachImageListeners?.();
      detachImageListeners = null;
      const resolve = resolveImageReadiness;
      resolveImageReadiness = null;
      resolve?.();
    };

    const disposeReadiness = () => {
      cancelled = true;
      if (readinessTimer) {
        clearTimeout(readinessTimer);
        readinessTimer = null;
      }
      settleImageReadiness();
    };

    scope.addCleanup(disposeReadiness);

    const prepare = async () => {
      const root = rootRef.current;
      const criticalImage = root?.querySelector<HTMLImageElement>('img[data-preload="critical"]');
      const imageReady = new Promise<void>((resolve) => {
        resolveImageReadiness = resolve;
        if (!criticalImage) {
          settleImageReadiness();
          return;
        }
        if (criticalImage.complete) {
          void criticalImage.decode().catch(() => undefined).finally(settleImageReadiness);
          return;
        }

        const settle = () => settleImageReadiness();
        criticalImage.addEventListener('load', settle, { once: true });
        criticalImage.addEventListener('error', settle, { once: true });
        detachImageListeners = () => {
          criticalImage.removeEventListener('load', settle);
          criticalImage.removeEventListener('error', settle);
        };
      });
      const timeoutReady = new Promise<void>((resolve) => {
        readinessTimer = setTimeout(() => {
          readinessTimer = null;
          settleImageReadiness();
          resolve();
        }, 3500);
      });

      await Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        Promise.race([imageReady, timeoutReady]),
      ]);

      if (readinessTimer) {
        clearTimeout(readinessTimer);
        readinessTimer = null;
      }
      settleImageReadiness();

      if (!cancelled && root) {
        setupMotionIndexAnimations(root, scope);
      }
    };

    void prepare();
    return disposeReadiness;
  }, [scope]);

  return (
    <main ref={rootRef} className="motion-index" data-route-content data-motion-index-root>
      <MotionIndexIntro />
      {projects.map((project, index) => (
        <MotionProjectStage project={project} index={index} key={project.slug} />
      ))}
      <SiteFooter site={site} />
    </main>
  );
}

export function MotionIndexExperience(props: MotionIndexExperienceProps) {
  return (
    <RouteAnimationBoundary>
      <MotionIndexRoute {...props} />
    </RouteAnimationBoundary>
  );
}
