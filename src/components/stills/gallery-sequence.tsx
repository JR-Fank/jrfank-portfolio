'use client';

import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';

import { MediaPicture } from '@/components/media/media-picture';
import { useRouteAnimationScope } from '@/components/runtime/route-animation-boundary';
import { useSmoothScroll } from '@/components/runtime/smooth-scroll-provider';
import type { MediaId } from '@/content/types';

interface GallerySequenceProps {
  readonly mediaIds: readonly [MediaId, MediaId, ...MediaId[]];
}

function scoreItem(item: HTMLElement, focusLine: number): number {
  const rect = item.getBoundingClientRect();
  if (rect.top <= focusLine && rect.bottom >= focusLine) {
    return Math.abs(rect.top + rect.height / 2 - focusLine) * 0.08;
  }
  return Math.min(Math.abs(rect.top - focusLine), Math.abs(rect.bottom - focusLine));
}

export function GallerySequence({ mediaIds }: GallerySequenceProps) {
  const rootRef = useRef<HTMLElement>(null);
  const scope = useRouteAnimationScope();
  const { scrollToTarget } = useSmoothScroll();
  const [activeId, setActiveId] = useState('1');

  const selectClosest = useCallback(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-gallery-item]'));
    const focusLine = window.innerHeight * 0.46;
    const selected = items.reduce<HTMLElement | null>((closest, item) => {
      if (!closest) {
        return item;
      }
      return scoreItem(item, focusLine) < scoreItem(closest, focusLine) ? item : closest;
    }, null);
    if (!selected) {
      return;
    }
    const nextId = selected.id;
    setActiveId((current) => current === nextId ? current : nextId);
    if (window.location.hash && window.location.hash !== `#${nextId}`) {
      window.history.replaceState(window.history.state, '', `#${nextId}`);
    }
  }, []);

  const scrollToHash = useCallback((hash: string, immediate = false) => {
    const id = hash.replace(/^#/, '');
    if (!/^\d+$/.test(id)) {
      return;
    }
    const target = rootRef.current?.querySelector<HTMLElement>(`[id="${id}"]`);
    if (!target) {
      return;
    }
    setActiveId(id);
    scrollToTarget(target, { duration: 0.5, immediate });
  }, [scrollToTarget]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }
    root.dataset.galleryObserver = 'active';
    let frame: number | null = null;
    const scheduleSelection = () => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
      frame = requestAnimationFrame(() => {
        frame = null;
        selectClosest();
      });
    };
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-gallery-item]'));
    const observer = new IntersectionObserver(scheduleSelection, {
      rootMargin: '-38% 0px -46% 0px',
      threshold: [0, 0.01, 0.5],
    });
    items.forEach((item) => observer.observe(item));
    scope.trackObserver(observer);

    const resizeObserver = new ResizeObserver(scheduleSelection);
    resizeObserver.observe(root);
    scope.trackObserver(resizeObserver);

    const onHistory = () => scrollToHash(window.location.hash);
    root.addEventListener('load', scheduleSelection, true);
    window.addEventListener('hashchange', onHistory);
    window.addEventListener('popstate', onHistory);
    scope.addCleanup(() => {
      root.removeEventListener('load', scheduleSelection, true);
      window.removeEventListener('hashchange', onHistory);
      window.removeEventListener('popstate', onHistory);
      root.removeAttribute('data-gallery-observer');
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
    });

    const initialFrame = requestAnimationFrame(() => {
      if (window.location.hash) {
        scrollToHash(window.location.hash, true);
      } else {
        selectClosest();
      }
    });
    scope.trackAnimationFrame(initialFrame);
  }, [scope, scrollToHash, selectClosest]);

  const handleRailClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const target = rootRef.current?.querySelector<HTMLElement>(`[id="${id}"]`);
    if (!target) {
      return;
    }
    const keyboardActivation = event.detail === 0;
    if (window.location.hash !== `#${id}`) {
      window.history.pushState(window.history.state, '', `#${id}`);
    }
    setActiveId(id);
    scrollToTarget(target, { duration: 0.5 });
    if (keyboardActivation) {
      const focusTimer = setTimeout(() => target.focus({ preventScroll: true }), 520);
      scope.trackTimeout(focusTimer);
    }
  };

  return (
    <section ref={rootRef} className="stills-gallery" aria-label="Project photography gallery" data-stills-gallery>
      <div className="stills-gallery-main">
        {mediaIds.map((mediaId, index) => {
          const id = String(index + 1);
          return (
            <figure
              id={id}
              className="stills-gallery-item"
              data-gallery-item
              data-gallery-layout={['wide-start', 'medium-end', 'portrait-center', 'wide-end', 'medium-start'][index % 5]}
              tabIndex={-1}
              key={`${mediaId}-${id}`}
            >
              <MediaPicture id={mediaId} className="stills-gallery-picture" imageClassName="stills-media-image" size="page-wide" />
            </figure>
          );
        })}
      </div>
      <nav className="stills-gallery-rail" aria-label="Gallery photographs">
        <ol>
          {mediaIds.map((mediaId, index) => {
            const id = String(index + 1);
            const active = activeId === id;
            return (
              <li key={`${mediaId}-rail-${id}`}>
                <a
                  href={`#${id}`}
                  className="stills-gallery-thumb"
                  aria-label={`View photograph ${id} of ${mediaIds.length}`}
                  aria-current={active ? 'true' : undefined}
                  data-active={active ? 'true' : 'false'}
                  onClick={(event) => handleRailClick(event, id)}
                >
                  <MediaPicture id={mediaId} imageClassName="stills-media-image" size="rail-thumb" alt="" />
                  <span className="stills-gallery-thumb-overlay" aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </section>
  );
}
