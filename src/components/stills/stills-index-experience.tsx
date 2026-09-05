'use client';

import { useEffect, useRef } from 'react';

import { setupStillsIndexAnimations, STILLS_INDEX_SECTION_MAP } from '@/animations/stills/stills';
import { SiteFooter } from '@/components/chrome/site-footer';
import { MediaPicture } from '@/components/media/media-picture';
import { TransitionLink } from '@/components/primitives/transition-link';
import { RouteAnimationBoundary, useRouteAnimationScope } from '@/components/runtime/route-animation-boundary';
import type { SiteConfig, StillProject } from '@/content';

interface StillsIndexExperienceProps {
  readonly projects: readonly StillProject[];
  readonly site: SiteConfig;
}

function IndexProjectStage({ project, index }: { readonly project: StillProject; readonly index: number }) {
  const sectionId = `S${String(index + 2).padStart(2, '0')}`;
  const eager = index === 0;

  return (
    <section
      className="stills-index-project"
      data-stills-index-stage
      data-stills-section={sectionId}
      data-state-sequence={STILLS_INDEX_SECTION_MAP.projectStage.states.join(' ')}
      aria-labelledby={`${sectionId}-title`}
    >
      <div className="stills-index-project-sticky" data-stills-index-sticky>
        <div className="stills-index-media stills-index-media-left" data-index-side="left" aria-hidden="true">
          <MediaPicture id={project.index.mediaIds[0]} imageClassName="stills-media-image" size="half" loading={eager ? 'eager' : 'lazy'} alt="" />
        </div>
        <div className="stills-index-media stills-index-media-right" data-index-side="right" aria-hidden="true">
          <MediaPicture id={project.index.mediaIds[1]} imageClassName="stills-media-image" size="half" loading={eager ? 'eager' : 'lazy'} alt="" />
        </div>
        <div className="stills-index-project-copy" data-index-center>
          <p className="stills-project-meta">
            <span>{project.year}</span>
            <span>{project.location.en}</span>
            {project.location.zhHant ? <span lang="zh-Hant">{project.location.zhHant}</span> : null}
          </p>
          <h2 id={`${sectionId}-title`}>
            <span className="stills-index-title-en">
              {project.title.en.split(' ').map((word) => <span key={word}>{word}</span>)}
            </span>
            {project.title.zhHant ? <span className="stills-project-title-zh" lang="zh-Hant">{project.title.zhHant}</span> : null}
          </h2>
          <TransitionLink className="outline-pill stills-index-cta" href={`/stills/${project.slug}/`}>VIEW CASE STUDY</TransitionLink>
          <ul className="stills-palette" aria-label={`${project.title.en} colour palette`}>
            {project.index.palette.map((color) => (
              <li key={color} style={{ backgroundColor: color }}>
                <span>{color}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function StillsIndexRoute({ projects, site }: StillsIndexExperienceProps) {
  const rootRef = useRef<HTMLElement>(null);
  const scope = useRouteAnimationScope();

  useEffect(() => {
    let cancelled = false;
    const prepare = async () => {
      await document.fonts?.ready;
      if (!cancelled && rootRef.current) {
        setupStillsIndexAnimations(rootRef.current, scope);
      }
    };
    void prepare();
    return () => {
      cancelled = true;
    };
  }, [scope]);

  return (
    <main ref={rootRef} className="stills stills-index" data-route-content data-stills-index-root>
      <section
        className="stills-index-intro"
        data-stills-section={STILLS_INDEX_SECTION_MAP.introduction.id}
        data-state-sequence={STILLS_INDEX_SECTION_MAP.introduction.states.join(' ')}
        aria-labelledby="stills-index-title"
      >
        <h1 id="stills-index-title" data-stills-index-title>Stills</h1>
        <div className="stills-index-intro-copy" data-stills-index-copy>
          <p>Photography holds a fleeting moment long enough to notice its shape, atmosphere, and silence.</p>
          <p lang="zh-Hant">攝影把短暫留在眼前，讓光線、空氣與沉默成為可以閱讀的形狀。</p>
        </div>
      </section>
      {projects.map((project, index) => <IndexProjectStage project={project} index={index} key={project.slug} />)}
      <SiteFooter site={site} />
    </main>
  );
}

export function StillsIndexExperience(props: StillsIndexExperienceProps) {
  return (
    <RouteAnimationBoundary>
      <StillsIndexRoute {...props} />
    </RouteAnimationBoundary>
  );
}
