'use client';

import { useEffect, useRef } from 'react';

import { setupMotionIndexAnimations } from '@/animations/motion/motion-index';
import { SiteFooter } from '@/components/chrome/site-footer';
import { MotionIndexIntro } from '@/components/motion/motion-index-intro';
import { MotionProjectStage } from '@/components/motion/motion-project-stage';
import { RouteAnimationBoundary, useRouteAnimationScope } from '@/components/runtime/route-animation-boundary';
import type { MotionProject, SiteConfig } from '@/content';

interface MotionIndexExperienceProps {
  readonly projects: readonly MotionProject[];
  readonly site: SiteConfig;
}

function MotionIndexRoute({ projects, site }: MotionIndexExperienceProps) {
  const rootRef = useRef<HTMLElement>(null);
  const scope = useRouteAnimationScope();

  useEffect(() => {
    let cancelled = false;

    const prepare = async () => {
      const root = rootRef.current;
      const criticalImage = root?.querySelector<HTMLImageElement>('img[data-preload="critical"]');
      const imageReady = criticalImage && !criticalImage.complete
        ? new Promise<void>((resolve) => {
            const settle = () => {
              criticalImage.removeEventListener('load', settle);
              criticalImage.removeEventListener('error', settle);
              resolve();
            };
            criticalImage.addEventListener('load', settle, { once: true });
            criticalImage.addEventListener('error', settle, { once: true });
          })
        : criticalImage?.decode().catch(() => undefined) ?? Promise.resolve();

      await Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        Promise.race([imageReady, new Promise<void>((resolve) => setTimeout(resolve, 3500))]),
      ]);

      if (!cancelled && root) {
        setupMotionIndexAnimations(root, scope);
      }
    };

    void prepare();
    return () => {
      cancelled = true;
    };
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
