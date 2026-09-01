'use client';

import { Play } from '@phosphor-icons/react';
import { useEffect, useRef } from 'react';

import { setupHomeAnimations } from '@/animations/home/home';
import { SiteFooter } from '@/components/chrome/site-footer';
import { MediaPicture } from '@/components/media/media-picture';
import { TransitionLink } from '@/components/primitives/transition-link';
import { RouteAnimationBoundary, useRouteAnimationScope } from '@/components/runtime/route-animation-boundary';
import type { HomeContent, HomeFeaturedStill, SiteConfig } from '@/content';
import { getVideoSources } from '@/lib/media';

interface HomeExperienceProps {
  readonly content: HomeContent;
  readonly site: SiteConfig;
}

function HomeHero({ content }: { readonly content: HomeContent['hero'] }) {
  const media = getVideoSources(content.videoMediaId);

  return (
    <section className="home-hero" data-home-section="H01" aria-labelledby="home-hero-title">
      <div className="home-hero-card" data-home-hero-card>
        <video
          className="home-hero-media home-media-image"
          data-home-hero-video
          data-preload="critical"
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          poster={media.poster}
          aria-hidden="true"
          tabIndex={-1}
        >
          {media.sources.map((source) => <source src={source.src} type={`video/${source.format}`} key={source.src} />)}
        </video>
        <div className="home-hero-shade" aria-hidden="true" />
        <div className="home-hero-copy">
          <h1 id="home-hero-title" aria-label={`${content.title.join(' ')} ${content.titleZh}`}>
            {content.title.map((line, index) => (
              <span className={`home-hero-line-window home-hero-line-window-${index + 1}`} key={line} aria-hidden="true">
                <span data-home-hero-display-line>
                  <span className="home-hero-line-desktop">{line}</span>
                  <span className="home-hero-line-mobile">{content.titleMobile[index]}</span>
                </span>
              </span>
            ))}
          </h1>
          <span className="home-hero-zh" lang="zh-Hant" data-home-hero-zh aria-hidden="true">{content.titleZh}</span>
        </div>
      </div>
    </section>
  );
}

function HomeIntro({ content }: { readonly content: HomeContent['intro'] }) {
  return (
    <section className="home-intro" data-home-section="H02" aria-labelledby="home-intro-title">
      <div className="home-intro-heading-wrap">
        <h2 id="home-intro-title" className="home-intro-heading" aria-label={content.accessibleHeading}>
          {content.lines.map((line, lineIndex) => (
            <span className="home-intro-line" key={`line-${lineIndex}`}>
              {line.map((segment, segmentIndex) =>
                segment.type === 'text' ? (
                  <span className="home-intro-piece" data-home-intro-piece data-home-intro-text aria-hidden="true" key={`${segment.value}-${segmentIndex}`}>
                    {segment.value}
                  </span>
                ) : (
                  <span
                    className={`home-intro-inline-media home-intro-inline-media-${segment.shape}`}
                    data-home-intro-piece
                    data-home-intro-media
                    aria-hidden="true"
                    key={`${segment.mediaId}-${segmentIndex}`}
                  >
                    <span className="home-intro-inline-media-scaler">
                      <MediaPicture id={segment.mediaId} imageClassName="home-media-image" size="rail-thumb" alt="" />
                    </span>
                  </span>
                ),
              )}
            </span>
          ))}
        </h2>
        <p className="home-intro-zh" lang="zh-Hant" data-home-intro-support>{content.headingZh}</p>
      </div>
      <div className="home-intro-support" data-home-intro-support>
        <p>{content.body}</p>
        <TransitionLink className="outline-pill home-intro-cta" href={content.href}>{content.cta}</TransitionLink>
      </div>
    </section>
  );
}

function FeaturedStill({ project }: { readonly project: HomeFeaturedStill }) {
  return (
    <section
      className="home-featured-still"
      data-home-section={project.id}
      data-home-featured-still
      data-direction={project.direction}
      aria-labelledby={`${project.id}-title`}
    >
      <div className="home-still-stage">
        <div className="home-still-media home-still-media-left" data-home-still="left" aria-hidden="true">
          <MediaPicture id={project.mediaIds[0]} imageClassName="home-media-image" size="half" alt="" />
        </div>
        <div className="home-still-media home-still-media-right" data-home-still="right" aria-hidden="true">
          <MediaPicture id={project.mediaIds[1]} imageClassName="home-media-image" size="half" alt="" />
        </div>
        <div className="home-still-center" data-home-still="center">
          <p className="home-project-meta">
            <span>{project.date}</span>
            <span>{project.location.en}</span>
            <span lang="zh-Hant">{project.location.zhHant}</span>
          </p>
          <h2 id={`${project.id}-title`}>
            <span>{project.title[0]}</span>
            <span>{project.title[1]}</span>
            <span className="home-project-title-zh" lang="zh-Hant">{project.titleZh}</span>
          </h2>
          <TransitionLink className="outline-pill home-project-cta" href={project.href}>{project.cta}</TransitionLink>
          <ul className="home-project-palette" aria-label={`${project.title.join(' ')} colour palette`}>
            {project.palette.map((color) => (
              <li key={color} style={{ backgroundColor: color }}><span className="sr-only">{color}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FeaturedMotion({ content }: { readonly content: HomeContent['featuredMotion'] }) {
  return (
    <section className="home-motion" data-home-section="H05" aria-labelledby="H05-title">
      <div className="home-motion-heading">
        <p className="home-project-meta">
          <span>{content.date}</span>
          <span>{content.location.en}</span>
          <span lang="zh-Hant">{content.location.zhHant}</span>
        </p>
        <h2 id="H05-title">{content.title}<span lang="zh-Hant">{content.titleZh}</span></h2>
      </div>
      <div className="home-motion-main" data-home-motion-main>
        <MediaPicture id={content.mainMediaId} imageClassName="home-media-image" size="page-wide" alt="" />
        <Play className="home-motion-play" size={40} weight="fill" aria-hidden="true" />
      </div>
      {content.satelliteMediaIds.map((mediaId, index) => (
        <div className={`home-motion-satellite home-motion-satellite-${index + 1}`} data-home-motion-satellite aria-hidden="true" key={mediaId}>
          <MediaPicture id={mediaId} imageClassName="home-media-image" size="third" alt="" />
        </div>
      ))}
      <TransitionLink className="outline-pill home-motion-cta" href={content.href}>{content.cta}</TransitionLink>
    </section>
  );
}

function HomeRoute({ content, site }: HomeExperienceProps) {
  const rootRef = useRef<HTMLElement>(null);
  const scope = useRouteAnimationScope();

  useEffect(() => {
    let cancelled = false;
    const prepare = async () => {
      const root = rootRef.current;
      const criticalVideo = root?.querySelector<HTMLVideoElement>('video[data-preload="critical"]');
      const videoReady = criticalVideo && criticalVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
        ? new Promise<void>((resolve) => {
            const settle = () => {
              criticalVideo.removeEventListener('loadeddata', settle);
              criticalVideo.removeEventListener('error', settle);
              resolve();
            };
            criticalVideo.addEventListener('loadeddata', settle, { once: true });
            criticalVideo.addEventListener('error', settle, { once: true });
          })
        : Promise.resolve();
      await Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        Promise.race([videoReady, new Promise<void>((resolve) => setTimeout(resolve, 3500))]),
      ]);
      if (!cancelled && root) {
        await criticalVideo?.play().catch(() => undefined);
        setupHomeAnimations(root, scope);
      }
    };
    void prepare();
    return () => {
      cancelled = true;
    };
  }, [scope]);

  return (
    <main ref={rootRef} className="home" data-route-content data-home-root>
      <HomeHero content={content.hero} />
      <HomeIntro content={content.intro} />
      {content.featuredStills.map((project) => <FeaturedStill project={project} key={project.id} />)}
      <FeaturedMotion content={content.featuredMotion} />
      <SiteFooter site={site} />
    </main>
  );
}

export function HomeExperience(props: HomeExperienceProps) {
  return (
    <RouteAnimationBoundary>
      <HomeRoute {...props} />
    </RouteAnimationBoundary>
  );
}
