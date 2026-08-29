import { updateDiagnostics } from '@/animations/core/diagnostics';
import { getGsap, getScrollTrigger } from '@/animations/core/gsap';
import type { RouteAnimationScope } from '@/animations/core/route-scope';

type HomeMotionContext = {
  readonly standard: boolean;
  readonly reduce: boolean;
};

function setupFeaturedStill(section: HTMLElement, reverse: boolean): void {
  const gsap = getGsap();
  const left = section.querySelector<HTMLElement>('[data-home-still="left"]');
  const right = section.querySelector<HTMLElement>('[data-home-still="right"]');
  const center = section.querySelector<HTMLElement>('[data-home-still="center"]');
  if (!left || !right || !center) {
    return;
  }

  const direction = reverse ? -1 : 1;
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 82%',
      end: 'bottom 3%',
      scrub: 0.8,
    },
  });

  timeline
    .fromTo(
      left,
      { xPercent: -118 * direction, yPercent: 14, rotate: -5 * direction },
      { xPercent: -5 * direction, yPercent: 0, rotate: -1.2 * direction, ease: 'none', duration: 0.62 },
      0,
    )
    .fromTo(
      right,
      { xPercent: 118 * direction, yPercent: -10, rotate: 5 * direction },
      { xPercent: 5 * direction, yPercent: 0, rotate: 1.2 * direction, ease: 'none', duration: 0.62 },
      0,
    )
    .fromTo(center, { opacity: 0.14, scale: 0.94 }, { opacity: 1, scale: 1, ease: 'none', duration: 0.48 }, 0.12)
    .to(left, { xPercent: 118 * direction, yPercent: -10, rotate: 4 * direction, ease: 'none', duration: 0.62 }, 1.38)
    .to(right, { xPercent: -118 * direction, yPercent: 12, rotate: -4 * direction, ease: 'none', duration: 0.62 }, 1.38)
    .to(center, { opacity: 0.12, scale: 0.95, ease: 'none', duration: 0.48 }, 1.5);
}

export function setupHomeAnimations(root: HTMLElement, scope: RouteAnimationScope): void {
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
        const conditions = context.conditions as HomeMotionContext;
        const hero = root.querySelector<HTMLElement>('[data-home-section="H01"]');
        const heroCard = root.querySelector<HTMLElement>('[data-home-hero-card]');
        const heroLines = gsap.utils.toArray<HTMLElement>('[data-home-hero-line]', root);
        const intro = root.querySelector<HTMLElement>('[data-home-section="H02"]');
        const introPieces = gsap.utils.toArray<HTMLElement>('[data-home-intro-piece]', root);
        const introSupport = gsap.utils.toArray<HTMLElement>('[data-home-intro-support]', root);
        const featuredSections = gsap.utils.toArray<HTMLElement>('[data-home-featured-still]', root);
        const motion = root.querySelector<HTMLElement>('[data-home-section="H05"]');
        const motionMain = root.querySelector<HTMLElement>('[data-home-motion-main]');
        const motionSatellites = gsap.utils.toArray<HTMLElement>('[data-home-motion-satellite]', root);

        if (conditions.reduce) {
          gsap.set([heroCard, ...heroLines, ...introPieces, ...introSupport, ...featuredSections, motionMain, ...motionSatellites], {
            clearProps: 'all',
          });
          updateDiagnostics({ scrollTriggers: scrollTrigger.getAll().length });
          return;
        }

        if (!conditions.standard) {
          return;
        }

        if (hero && heroCard && heroLines.length > 0) {
          gsap
            .timeline({ defaults: { ease: 'power3.out' } })
            .fromTo(heroCard, { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.25 })
            .fromTo(
              heroLines,
              { yPercent: 116, rotate: 7, filter: 'blur(10px)' },
              { yPercent: 0, rotate: 0, filter: 'blur(0px)', duration: 1.08, stagger: 0.1 },
              0.17,
            );

          gsap
            .timeline({
              scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.65,
              },
            })
            .to(heroCard, { scale: 0.88, yPercent: 11, borderRadius: 48, ease: 'none' }, 0)
            .to(heroLines, { yPercent: -34, opacity: 0, stagger: 0.03, ease: 'none' }, 0.08);
        }

        if (intro && introPieces.length > 0) {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: intro,
                start: 'top 76%',
                toggleActions: 'play none none reverse',
              },
            })
            .fromTo(
              introPieces,
              { yPercent: 75, rotateX: -78, opacity: 0, transformOrigin: '50% 100%' },
              { yPercent: 0, rotateX: 0, opacity: 1, duration: 0.92, stagger: 0.045, ease: 'power3.out' },
            )
            .fromTo(introSupport, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.08 }, 0.36);
        }

        featuredSections.forEach((section) => setupFeaturedStill(section, section.dataset.direction === 'reverse'));

        if (motion && motionMain) {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: motion,
                start: 'top 70%',
                end: 'bottom 10%',
                scrub: 0.8,
              },
            })
            .fromTo(motionMain, { scale: 0.64, yPercent: 38 }, { scale: 1, yPercent: 0, ease: 'none' }, 0)
            .fromTo(
              motionSatellites,
              { scale: 0.72, opacity: 0, yPercent: 50 },
              { scale: 1, opacity: 1, yPercent: 0, stagger: 0.08, ease: 'none' },
              0.16,
            );
        }

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
