'use client';

import { Splide } from '@splidejs/splide';
import { useEffect, useRef } from 'react';

import { MediaPicture } from '@/components/media/media-picture';
import { TransitionLink } from '@/components/primitives/transition-link';
import { useRouteAnimationScope } from '@/components/runtime/route-animation-boundary';
import type { StillProject } from '@/content';

export function ExploreMore({ projects }: { readonly projects: readonly StillProject[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scope = useRouteAnimationScope();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || projects.length === 0) {
      return;
    }
    const splide = new Splide(root, {
      type: 'loop',
      perPage: 3,
      perMove: 1,
      focus: 0,
      gap: '16px',
      drag: 'free',
      snap: true,
      arrows: false,
      pagination: false,
      trimSpace: false,
      mediaQuery: 'max',
      breakpoints: {
        767: { perPage: 2 },
        478: { perPage: 1 },
      },
    });
    splide.mount();
    scope.addCleanup(() => splide.destroy(true));
  }, [projects, scope]);

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="stills-explore" aria-labelledby="stills-explore-title" data-stills-explore>
      <p id="stills-explore-title" className="stills-explore-label">EXPLORE MORE</p>
      <div ref={rootRef} className="splide stills-explore-splide" aria-label="More Stills projects">
        <div className="splide__track">
          <ul className="splide__list">
            {projects.map((project) => (
              <li className="splide__slide" key={project.slug}>
                <article className="stills-explore-card">
                  <MediaPicture id={project.coverId} className="stills-explore-picture" imageClassName="stills-media-image" size="card" />
                  <div className="stills-explore-shade" aria-hidden="true" />
                  <div className="stills-explore-copy">
                    <p><span>{project.location.en}</span>{project.location.zhHant ? <span lang="zh-Hant">{project.location.zhHant}</span> : null}</p>
                    <h2>{project.title.en}</h2>
                    <TransitionLink className="outline-pill" href={`/stills/${project.slug}/`}>VIEW CASE STUDY</TransitionLink>
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
