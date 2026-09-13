'use client';

import { Splide } from '@splidejs/splide';
import { useEffect, useRef } from 'react';

import { MediaPicture } from '@/components/media/media-picture';
import { TransitionLink } from '@/components/primitives/transition-link';
import { useRouteAnimationScope } from '@/components/runtime/route-animation-boundary';
import { useRouteTransition } from '@/components/runtime/route-transition-provider';
import type { BilingualText, MediaId } from '@/content/types';

export interface MotionExploreProject {
  readonly slug: string;
  readonly title: BilingualText;
  readonly location: BilingualText;
  readonly posterId: MediaId;
}

export function MotionExploreMore({ projects }: { readonly projects: readonly MotionExploreProject[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scope = useRouteAnimationScope();
  const { navigate } = useRouteTransition();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || projects.length === 0) return;

    const splide = new Splide(root, {
      type: 'loop',
      perPage: 2,
      perMove: 1,
      focus: 0,
      gap: '16px',
      drag: 'free',
      snap: true,
      arrows: false,
      pagination: false,
      trimSpace: false,
      mediaQuery: 'max',
      breakpoints: { 767: { perPage: 1 } },
    });
    splide.mount();

    // Splide clones DOM rather than React handlers, so capture delegation owns
    // both authored and cloned case-study links before their bubble handlers.
    const onRouteClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[data-motion-explore-link]');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      navigate(link.pathname);
    };
    root.addEventListener('click', onRouteClick, true);

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      root.removeEventListener('click', onRouteClick, true);
      splide.destroy(true);
    };
    scope.addCleanup(cleanup);
    return cleanup;
  }, [navigate, projects, scope]);

  if (projects.length === 0) return null;

  return (
    <section className="motion-explore" aria-labelledby="motion-explore-title" data-motion-explore>
      <div className="motion-explore-heading">
        <p className="motion-explore-label">NEXT STORIES</p>
        <h2 id="motion-explore-title">EXPLORE MORE</h2>
      </div>
      <div ref={rootRef} className="splide motion-explore-splide" aria-label="More Motion projects">
        <div className="splide__track">
          <ul className="splide__list">
            {projects.map((project) => (
              <li className="splide__slide" key={project.slug}>
                <article className="motion-explore-card">
                  <MediaPicture id={project.posterId} className="motion-explore-picture" imageClassName="motion-explore-image" size="half" />
                  <div className="motion-explore-shade" aria-hidden="true" />
                  <div className="motion-explore-copy">
                    <p>
                      <span>{project.location.en}</span>
                      {project.location.zhHant ? <span lang="zh-Hant">{project.location.zhHant}</span> : null}
                    </p>
                    <h3>{project.title.en}</h3>
                    <TransitionLink className="outline-pill" href={`/motion/${project.slug}/`} data-motion-explore-link>
                      VIEW CASE STUDY
                    </TransitionLink>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
