import { updateDiagnostics } from '@/animations/core/diagnostics';
import { getGsap, getScrollTrigger } from '@/animations/core/gsap';
import type { RouteAnimationScope } from '@/animations/core/route-scope';

type HomeMotionContext = {
  readonly standard: boolean;
  readonly reduce: boolean;
};

function setupFeaturedStill(section: HTMLElement): void {
  const gsap = getGsap();
  const left = section.querySelector<HTMLElement>('[data-home-still="left"]');
  const right = section.querySelector<HTMLElement>('[data-home-still="right"]');
  const center = section.querySelector<HTMLElement>('[data-home-still="center"]');
  if (!left || !right || !center) {
    return;
  }

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.45,
    },
  });

  timeline
    .fromTo(
      left,
      { xPercent: 34, rotate: -3 },
      { xPercent: -138, rotate: -1, ease: 'none', duration: 1 },
      0,
    )
    .fromTo(
      right,
      { xPercent: -34, rotate: 3 },
      { xPercent: 138, rotate: 1, ease: 'none', duration: 1 },
      0,
    )
    .fromTo(left, { yPercent: 108 }, { yPercent: 0, ease: 'power2.out', duration: 0.32 }, 0)
    .to(left, { yPercent: -14, ease: 'none', duration: 0.68 }, 0.32)
    .fromTo(right, { yPercent: 104 }, { yPercent: 0, ease: 'power2.out', duration: 0.32 }, 0)
    .to(right, { yPercent: -18, ease: 'none', duration: 0.68 }, 0.32)
    .fromTo(center, { opacity: 0.2, scale: 0.98 }, { opacity: 1, scale: 1, ease: 'none', duration: 0.16 }, 0.04)
    .to(center, { opacity: 0.14, scale: 0.98, ease: 'none', duration: 0.2 }, 0.72);
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
        const heroLineWindows = gsap.utils.toArray<HTMLElement>('.home-hero-line-window', root);
        const heroZh = root.querySelector<HTMLElement>('[data-home-hero-zh]');
        const heroVideo = root.querySelector<HTMLVideoElement>('[data-home-hero-video]');
        const intro = root.querySelector<HTMLElement>('[data-home-section="H02"]');
        const introPieces = gsap.utils.toArray<HTMLElement>('[data-home-intro-piece]', root);
        const introText = gsap.utils.toArray<HTMLElement>('[data-home-intro-text]', root);
        const introMedia = gsap.utils.toArray<HTMLElement>('[data-home-intro-media]', root);
        const introSupport = gsap.utils.toArray<HTMLElement>('[data-home-intro-support]', root);
        const featuredSections = gsap.utils.toArray<HTMLElement>('[data-home-featured-still]', root);
        const motion = root.querySelector<HTMLElement>('[data-home-section="H05"]');
        const motionMain = root.querySelector<HTMLElement>('[data-home-motion-main]');
        const motionSatellites = gsap.utils.toArray<HTMLElement>('[data-home-motion-satellite]', root);

        if (conditions.reduce) {
          gsap.set([...heroLineWindows, heroZh, ...introPieces, ...introSupport, ...featuredSections, motionMain, ...motionSatellites], {
            clearProps: 'all',
          });
          updateDiagnostics({ scrollTriggers: scrollTrigger.getAll().length });
          return;
        }

        if (!conditions.standard) {
          return;
        }

        if (hero && heroLineWindows.length > 0) {
          void heroVideo?.play().catch(() => undefined);
          gsap
            .timeline({
              scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.65,
              },
            })
            .to([...heroLineWindows, heroZh].filter(Boolean), { yPercent: -16, opacity: 0, stagger: 0.03, ease: 'none' }, 0.08);
        }

        if (intro && introText.length > 0 && introMedia.length > 0) {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: intro,
                start: 'top 76%',
                toggleActions: 'play none none reverse',
              },
            })
            .fromTo(
              introText,
              { rotateX: -90, opacity: 0, transformOrigin: '50% 100%' },
              { rotateX: 0, opacity: 1, duration: 0.8, stagger: 0.07, ease: 'power2.out' },
            )
            .fromTo(
              introMedia,
              { yPercent: (index) => 48 + index * 18, rotate: (index) => (index - 1) * 3, opacity: 0 },
              { yPercent: 0, rotate: 0, opacity: 1, duration: 0.84, stagger: 0.12, ease: 'power2.out' },
              0.08,
            )
            .fromTo(introSupport, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.08 }, 0.72);
        }

        featuredSections.forEach(setupFeaturedStill);

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
