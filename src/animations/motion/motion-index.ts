import { updateDiagnostics } from '@/animations/core/diagnostics';
import { getGsap, getScrollTrigger } from '@/animations/core/gsap';
import type { RouteAnimationScope } from '@/animations/core/route-scope';

type MotionIndexContext = {
  readonly standard: boolean;
  readonly reduce: boolean;
  readonly desktop: boolean;
  readonly tablet: boolean;
  readonly mobile: boolean;
  readonly compact: boolean;
};

type SatelliteMotion = {
  readonly startX: number;
  readonly endX: number;
  readonly startY: number;
  readonly endY: number;
  readonly startRotate: number;
  readonly endRotate: number;
};

const SATELLITE_MOTION: readonly SatelliteMotion[] = [
  { startX: -0.075, endX: 0.035, startY: 0.09, endY: -0.055, startRotate: -3.2, endRotate: -0.8 },
  { startX: 0.065, endX: -0.025, startY: 0.14, endY: -0.085, startRotate: 2.4, endRotate: 0.5 },
  { startX: -0.03, endX: 0.055, startY: 0.2, endY: -0.035, startRotate: -1.2, endRotate: 1.1 },
] as const;

function setupProjectStage(section: HTMLElement, context: MotionIndexContext): void {
  const gsap = getGsap();
  const stageFrame = section.querySelector<HTMLElement>('.motion-project-stage-inner');
  const main = section.querySelector<HTMLElement>('[data-motion-index-main]');
  const satellites = gsap.utils.toArray<HTMLElement>('[data-motion-index-satellite]', section);
  if (!main || satellites.length !== 3) {
    return;
  }

  const travelScale = context.desktop ? 1 : context.tablet ? 0.84 : context.mobile ? 0.7 : 0.62;
  const stageWidth = () => section.clientWidth * travelScale;
  const stageHeight = () => stageFrame?.clientHeight ?? section.clientHeight;

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 88%',
      end: 'bottom 12%',
      scrub: 0.65,
      invalidateOnRefresh: true,
    },
  });

  timeline.fromTo(
    main,
    { y: () => stageHeight() * 0.065, scale: 0.945 },
    { y: () => stageHeight() * -0.045, scale: 1.018, duration: 1, ease: 'none' },
    0,
  );

  satellites.forEach((satellite, index) => {
    const motion = SATELLITE_MOTION[index];
    if (!motion) {
      return;
    }
    timeline.fromTo(
      satellite,
      {
        x: () => stageWidth() * motion.startX,
        y: () => stageHeight() * motion.startY,
        rotate: motion.startRotate,
      },
      {
        x: () => stageWidth() * motion.endX,
        y: () => stageHeight() * motion.endY,
        rotate: motion.endRotate,
        duration: 1,
        ease: 'none',
      },
      0,
    );
  });
}

export function setupMotionIndexAnimations(root: HTMLElement, scope: RouteAnimationScope): void {
  const gsap = getGsap();
  const scrollTrigger = getScrollTrigger();

  scope.run(() => {
    const media = gsap.matchMedia();
    media.add(
      {
        standard: '(prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
        desktop: '(min-width: 992px)',
        tablet: '(min-width: 768px) and (max-width: 991px)',
        mobile: '(min-width: 480px) and (max-width: 767px)',
        compact: '(max-width: 479px)',
      },
      (matchContext) => {
        const conditions = matchContext.conditions as MotionIndexContext;
        const introTitle = root.querySelector<HTMLElement>('[data-motion-index-section="M01"] [data-motion-index-title]');
        const introCopy = root.querySelector<HTMLElement>('[data-motion-index-intro-copy]');
        const stages = gsap.utils.toArray<HTMLElement>('[data-motion-index-stage]', root);
        const movingMedia = gsap.utils.toArray<HTMLElement>('[data-motion-index-main], [data-motion-index-satellite]', root);

        if (conditions.reduce) {
          gsap.set([introTitle, introCopy, ...movingMedia].filter(Boolean), { clearProps: 'all' });
          updateDiagnostics({ scrollTriggers: scrollTrigger.getAll().length });
          return;
        }
        if (!conditions.standard) {
          return;
        }

        gsap
          .timeline({ defaults: { ease: 'power2.out' } })
          .fromTo(introTitle, { yPercent: 24, rotateX: -12, opacity: 0 }, { yPercent: 0, rotateX: 0, opacity: 1, duration: 0.92 }, 0.08)
          .fromTo(introCopy, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.72 }, 0.42);

        stages.forEach((stage) => setupProjectStage(stage, conditions));
        updateDiagnostics({ scrollTriggers: scrollTrigger.getAll().length });
      },
    );

    scope.addCleanup(() => media.revert());
    const refreshFrame = requestAnimationFrame(() => {
      scrollTrigger.refresh();
      updateDiagnostics({ scrollTriggers: scrollTrigger.getAll().length });
    });
    scope.trackAnimationFrame(refreshFrame);
  });
}
