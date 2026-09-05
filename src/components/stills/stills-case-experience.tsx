'use client';

import { useEffect, useRef } from 'react';

import { setupStillsCaseAnimations } from '@/animations/stills/stills';
import { SiteFooter } from '@/components/chrome/site-footer';
import { MediaPicture } from '@/components/media/media-picture';
import { RouteAnimationBoundary, useRouteAnimationScope } from '@/components/runtime/route-animation-boundary';
import type { ProjectBlock, SiteConfig, StillProject } from '@/content';

import { EditorialBlock } from './editorial-blocks';
import { ExploreMore } from './explore-more';
import { GallerySequence } from './gallery-sequence';

interface StillsCaseExperienceProps {
  readonly project: StillProject;
  readonly exploreProjects: readonly StillProject[];
  readonly site: SiteConfig;
}

function Hero({ project }: { readonly project: StillProject }) {
  return (
    <section className="stills-case-hero" aria-labelledby="stills-case-title" data-stills-case-hero>
      <div className="stills-case-title-wrap">
        <h1 id="stills-case-title" data-stills-case-title>
          <span>{project.title.en}</span>
          {project.title.zhHant ? <span lang="zh-Hant">{project.title.zhHant}</span> : null}
        </h1>
      </div>
      <div className="stills-case-hero-frame">
        <div className="stills-case-hero-layer stills-case-hero-layer-base" data-stills-hero-layer>
          <MediaPicture id={project.coverId} className="stills-case-hero-picture" imageClassName="stills-media-image" size="page-wide" loading="eager" />
        </div>
        <div className="stills-case-hero-layer stills-case-hero-layer-front" data-stills-hero-layer aria-hidden="true">
          <MediaPicture id={project.coverId} className="stills-case-hero-picture" imageClassName="stills-media-image" size="page-wide" loading="eager" alt="" />
        </div>
      </div>
    </section>
  );
}

function Introduction({ project }: { readonly project: StillProject }) {
  const words = project.summary.en.split(' ');
  return (
    <section className="stills-case-intro" aria-label="Project introduction">
      <p className="stills-project-meta">
        <span>{project.year}</span>
        <span>{project.location.en}</span>
        {project.location.zhHant ? <span lang="zh-Hant">{project.location.zhHant}</span> : null}
      </p>
      <div className="stills-case-summary" data-stills-text-reveal>
        <p aria-label={project.summary.en}>
          {words.map((word, index) => (
            <span data-stills-reveal-word aria-hidden="true" key={`${word}-${index}`}>{word}{index < words.length - 1 ? ' ' : ''}</span>
          ))}
        </p>
        {project.summary.zhHant ? <p lang="zh-Hant">{project.summary.zhHant}</p> : null}
      </div>
    </section>
  );
}

function StillsCaseRoute({ project, exploreProjects, site }: StillsCaseExperienceProps) {
  const rootRef = useRef<HTMLElement>(null);
  const scope = useRouteAnimationScope();

  useEffect(() => {
    let cancelled = false;
    const prepare = async () => {
      const criticalImages = Array.from(rootRef.current?.querySelectorAll<HTMLImageElement>('img[data-preload="critical"]') ?? []);
      await Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        ...criticalImages.map((image) => image.complete ? image.decode().catch(() => undefined) : new Promise<void>((resolve) => {
          const settle = () => resolve();
          image.addEventListener('load', settle, { once: true });
          image.addEventListener('error', settle, { once: true });
        })),
      ]);
      if (!cancelled && rootRef.current) {
        setupStillsCaseAnimations(rootRef.current, scope);
      }
    };
    void prepare();
    return () => {
      cancelled = true;
    };
  }, [scope]);

  const renderSequence = (block: Extract<ProjectBlock, { readonly type: 'imageSequence' }>) => (
    <GallerySequence mediaIds={block.mediaIds} key={block.id} />
  );

  return (
    <main ref={rootRef} className="stills stills-case" data-route-content data-stills-case-root>
      <Hero project={project} />
      <Introduction project={project} />
      <div className="stills-case-blocks">
        {project.blocks.map((block) => <EditorialBlock block={block} renderSequence={renderSequence} key={block.id} />)}
      </div>
      <ExploreMore projects={exploreProjects} />
      <SiteFooter site={site} />
    </main>
  );
}

export function StillsCaseExperience(props: StillsCaseExperienceProps) {
  return (
    <RouteAnimationBoundary>
      <StillsCaseRoute {...props} />
    </RouteAnimationBoundary>
  );
}
