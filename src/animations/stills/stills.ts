import { updateDiagnostics } from '@/animations/core/diagnostics';
import { getGsap, getScrollTrigger } from '@/animations/core/gsap';
import type { RouteAnimationScope } from '@/animations/core/route-scope';

type MotionContext = { readonly standard: boolean; readonly reduce: boolean };

export const STILLS_INDEX_SECTION_MAP = {
  introduction: { id: 'S01', states: ['waiting', 'entering', 'settled'] },
  projectStage: { idPrefix: 'S', states: ['approaching', 'centered', 'departing'] },
} as const;

function setupIndexStage(section: HTMLElement): void {
  const gsap = getGsap();
  const stage = section.querySelector<HTMLElement>('[data-stills-index-sticky]');
  const left = section.querySelector<HTMLElement>('[data-index-side="left"]');
  const right = section.querySelector<HTMLElement>('[data-index-side="right"]');
  const center = section.querySelector<HTMLElement>('[data-index-center]');
  if (!stage || !left || !right || !center) {
    return;
  }

  const overshoot = () => Math.min(48, Math.max(18, stage.clientWidth * 0.025));
  const closeOffset = (element: HTMLElement) => Math.min(element.offsetWidth * 0.42, stage.clientWidth * 0.24);
  const leftExit = () => -(left.offsetLeft + left.offsetWidth + overshoot());
  const rightExit = () => stage.clientWidth - right.offsetLeft + overshoot();

  gsap
    .timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.55,
        invalidateOnRefresh: true,
      },
    })
    .fromTo(left, { x: () => closeOffset(left), yPercent: 102, rotate: -2.8 }, { x: leftExit, yPercent: -18, rotate: -0.6, ease: 'none' }, 0)
    .fromTo(right, { x: () => -closeOffset(right), yPercent: 112, rotate: 2.6 }, { x: rightExit, yPercent: -10, rotate: 0.8, ease: 'none' }, 0)
    .fromTo(center, { opacity: 0.12, scale: 0.975 }, { opacity: 1, scale: 1, duration: 0.22, ease: 'none' }, 0.18)
    .to(center, { opacity: 0.12, scale: 0.98, duration: 0.2, ease: 'none' }, 0.76);
}

export function setupStillsIndexAnimations(root: HTMLElement, scope: RouteAnimationScope): void {
  const gsap = getGsap();
  const scrollTrigger = getScrollTrigger();

  scope.run(() => {
    const media = gsap.matchMedia();
    media.add(
      {
        standard: '(prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const conditions = context.conditions as MotionContext;
        const introTitle = root.querySelector<HTMLElement>('[data-stills-index-title]');
        const introCopy = root.querySelector<HTMLElement>('[data-stills-index-copy]');
        const stages = gsap.utils.toArray<HTMLElement>('[data-stills-index-stage]', root);

        if (conditions.reduce) {
          gsap.set([introTitle, introCopy, ...stages].filter(Boolean), { clearProps: 'all' });
          updateDiagnostics({ scrollTriggers: scrollTrigger.getAll().length });
          return;
        }
        if (!conditions.standard) {
          return;
        }

        gsap
          .timeline({ defaults: { ease: 'power2.out' } })
          .fromTo(introTitle, { yPercent: 28, rotateX: -16, opacity: 0 }, { yPercent: 0, rotateX: 0, opacity: 1, duration: 0.9 }, 0.12)
          .fromTo(introCopy, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.46);

        stages.forEach(setupIndexStage);
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

export function setupStillsCaseAnimations(root: HTMLElement, scope: RouteAnimationScope): void {
  const gsap = getGsap();
  const scrollTrigger = getScrollTrigger();

  scope.run(() => {
    const media = gsap.matchMedia();
    media.add(
      {
        standard: '(prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const conditions = context.conditions as MotionContext;
        const heroTitle = root.querySelector<HTMLElement>('[data-stills-case-title]');
        const heroLayers = gsap.utils.toArray<HTMLElement>('[data-stills-hero-layer]', root);
        const revealGroups = gsap.utils.toArray<HTMLElement>('[data-stills-text-reveal]', root);

        if (conditions.reduce) {
          gsap.set([heroTitle, ...heroLayers, ...revealGroups].filter(Boolean), { clearProps: 'all' });
          updateDiagnostics({ scrollTriggers: scrollTrigger.getAll().length });
          return;
        }
        if (!conditions.standard) {
          return;
        }

        gsap
          .timeline({ defaults: { ease: 'power2.out' } })
          .fromTo(heroTitle, { yPercent: 32, rotateX: -12, opacity: 0 }, { yPercent: 0, rotateX: 0, opacity: 1, duration: 0.88 }, 0.08)
          .fromTo(heroLayers, { yPercent: 50 }, { yPercent: 0, duration: 1.18, stagger: 0.05, ease: 'power3.out' }, 0.26);

        revealGroups.forEach((group) => {
          const words = gsap.utils.toArray<HTMLElement>('[data-stills-reveal-word]', group);
          if (words.length === 0) {
            return;
          }
          gsap.fromTo(
            words,
            { rotateX: -90, opacity: 0, transformOrigin: '50% 100%', transformPerspective: 1000 },
            {
              rotateX: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.8 / words.length,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: group,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            },
          );
        });

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
