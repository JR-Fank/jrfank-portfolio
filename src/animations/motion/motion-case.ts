import { updateDiagnostics } from '@/animations/core/diagnostics';
import { getGsap, getScrollTrigger } from '@/animations/core/gsap';
import type { RouteAnimationScope } from '@/animations/core/route-scope';

type MotionCaseContext = {
  readonly standard: boolean;
  readonly reduce: boolean;
  readonly desktop: boolean;
  readonly tablet: boolean;
  readonly mobile: boolean;
  readonly compact: boolean;
};

function trackTravel(track: HTMLElement): number {
  const baseSet = track.querySelector<HTMLElement>('[data-motion-filmstrip-set="base"]');
  if (!baseSet) return 0;
  const styles = getComputedStyle(track);
  const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
  return baseSet.getBoundingClientRect().width + gap;
}

function setupFilmstrip(root: HTMLElement): void {
  const gsap = getGsap();
  const section = root.querySelector<HTMLElement>('[data-motion-filmstrip]');
  const rows = gsap.utils.toArray<HTMLElement>('[data-motion-filmstrip-row]', section ?? undefined);
  if (!section || rows.length !== 2) return;

  const timeline = gsap.timeline({
    scrollTrigger: {
      id: 'motion-case-filmstrip',
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  rows.forEach((row) => {
    const track = row.querySelector<HTMLElement>('[data-motion-filmstrip-track]');
    if (!track) return;
    const reverse = row.dataset.direction === 'reverse';
    timeline.fromTo(
      track,
      { x: () => reverse ? -trackTravel(track) : 0 },
      { x: () => reverse ? 0 : -trackTravel(track), duration: 1, ease: 'none' },
      0,
    );
  });
}

function setupBehindTheScenes(root: HTMLElement, context: MotionCaseContext): void {
  const gsap = getGsap();
  const section = root.querySelector<HTMLElement>('[data-motion-bts]');
  const stage = section?.querySelector<HTMLElement>('[data-motion-bts-stage]');
  const frame = section?.querySelector<HTMLElement>('[data-motion-bts-frame]');
  const items = gsap.utils.toArray<HTMLElement>('[data-motion-bts-item]', section ?? undefined);
  const titleTop = section?.querySelector<HTMLElement>('[data-motion-bts-title="top"]');
  const titleBottom = section?.querySelector<HTMLElement>('[data-motion-bts-title="bottom"]');
  const firstItem = items[0];
  if (!section || !stage || !frame || !firstItem || !titleTop || !titleBottom || items.length !== 8) return;

  const viewportHeight = () => document.documentElement.clientHeight;
  const viewportWidth = () => document.documentElement.clientWidth;
  const pinDistance = () => viewportHeight() * (context.compact ? 3 : 5);
  const travel = (item: HTMLElement) => {
    const frameHeight = frame.getBoundingClientRect().height;
    const image = item.querySelector<HTMLImageElement>('img');
    const imageRatio = image?.naturalWidth && image.naturalHeight ? image.naturalWidth / image.naturalHeight : 16 / 9;
    const frameRatio = Math.max(0.1, frame.getBoundingClientRect().width / Math.max(1, frameHeight));
    const ratioDelta = Math.min(1, Math.abs(imageRatio - frameRatio));
    return Math.max(38, Math.min(frameHeight * (0.14 + ratioDelta * 0.045), viewportHeight() * 0.19));
  };
  const lateral = (index: number) => Math.min(34, viewportWidth() * 0.024) * (index % 2 === 0 ? -1 : 1);
  const entryScale = (item: HTMLElement) => {
    const image = item.querySelector<HTMLImageElement>('img');
    const ratio = image?.naturalWidth && image.naturalHeight ? image.naturalWidth / image.naturalHeight : 16 / 9;
    return 1.035 + Math.min(0.055, Math.abs(ratio - 16 / 9) * 0.018);
  };

  gsap.set(items, { autoAlpha: 0, x: 0, y: 0, scale: 1 });
  gsap.set(firstItem, { autoAlpha: 1 });

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      id: 'motion-case-bts',
      trigger: section,
      start: 'top top',
      end: () => `+=${pinDistance()}`,
      scrub: 0.72,
      pin: stage,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  master.addLabel('bts-01', 0);
  for (let index = 1; index < items.length; index += 1) {
    const previous = items[index - 1];
    const current = items[index];
    if (!previous || !current) continue;
    const beat = index - 1;
    const transitionStart = beat + 0.38;
    master
      .addLabel(`bts-${String(index + 1).padStart(2, '0')}`, beat + 1)
      .to(previous, {
        autoAlpha: 0,
        x: () => lateral(index - 1) * -0.45,
        y: () => -travel(previous),
        scale: 0.955,
        duration: 0.62,
      }, transitionStart)
      .fromTo(current, {
        autoAlpha: 0,
        x: () => lateral(index),
        y: () => travel(current),
        scale: () => entryScale(current),
      }, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.62,
      }, transitionStart);
  }

  master.to(titleTop, { y: () => -Math.min(22, viewportHeight() * 0.022), duration: 7 }, 0);
  master.to(titleBottom, { y: () => Math.min(22, viewportHeight() * 0.022), duration: 7 }, 0);
  stage.dataset.motionBtsTimeline = '8-beat-master';
}

export function setupMotionCaseAnimations(root: HTMLElement, scope: RouteAnimationScope): void {
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
        const conditions = matchContext.conditions as MotionCaseContext;
        const filmstripTracks = gsap.utils.toArray<HTMLElement>('[data-motion-filmstrip-track]', root);
        const btsStage = root.querySelector<HTMLElement>('[data-motion-bts-stage]');
        const btsItems = gsap.utils.toArray<HTMLElement>('[data-motion-bts-item]', root);
        const btsTitles = gsap.utils.toArray<HTMLElement>('[data-motion-bts-title]', root);

        if (conditions.reduce) {
          gsap.set([...filmstripTracks, btsStage, ...btsItems, ...btsTitles].filter(Boolean), { clearProps: 'all' });
          btsStage?.removeAttribute('data-motion-bts-timeline');
          updateDiagnostics({ scrollTriggers: scrollTrigger.getAll().length });
          return;
        }
        if (!conditions.standard) return;

        setupFilmstrip(root);
        setupBehindTheScenes(root, conditions);
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
