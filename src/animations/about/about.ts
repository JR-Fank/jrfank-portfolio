import { updateDiagnostics } from '@/animations/core/diagnostics';
import { getGsap, getScrollTrigger } from '@/animations/core/gsap';
import type { RouteAnimationScope } from '@/animations/core/route-scope';

type AboutMotionContext = {
  readonly standard: boolean;
  readonly reduce: boolean;
};

export function setupAboutAnimations(root: HTMLElement, scope: RouteAnimationScope): void {
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
        const conditions = context.conditions as AboutMotionContext;
        const hero = root.querySelector<HTMLElement>('[data-about-hero]');
        const heroTitle = root.querySelector<HTMLElement>('[data-about-hero-title]');
        const heroPortrait = root.querySelector<HTMLElement>('[data-about-hero-portrait]');
        const filmSection = root.querySelector<HTMLElement>('[data-about-film-section]');
        const filmStrip = root.querySelector<HTMLElement>('[data-about-film-strip]');

        if (conditions.reduce) {
          gsap.set([heroTitle, heroPortrait, filmStrip].filter(Boolean), { clearProps: 'all' });
          updateDiagnostics({ scrollTriggers: scrollTrigger.getAll().length });
          return;
        }

        if (!conditions.standard) {
          return;
        }

        if (hero && heroTitle && heroPortrait) {
          gsap
            .timeline({ defaults: { ease: 'power2.out' } })
            .fromTo(heroTitle, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.15 }, 0)
            .fromTo(heroPortrait, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 1.15 }, 0.08);

          gsap
            .timeline({
              scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.6,
              },
            })
            .to(heroTitle, { yPercent: -24, ease: 'none' }, 0)
            .to(heroPortrait, { yPercent: -48, ease: 'none' }, 0);
        }

        if (filmSection && filmStrip) {
          gsap.fromTo(
            filmStrip,
            { xPercent: 9, yPercent: 10, rotate: -2.2 },
            {
              xPercent: -21,
              yPercent: -6,
              rotate: -1.2,
              ease: 'none',
              scrollTrigger: {
                trigger: filmSection,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.55,
              },
            },
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
