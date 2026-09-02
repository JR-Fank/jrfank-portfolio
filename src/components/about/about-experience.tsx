'use client';

import { ArrowUpRight } from '@phosphor-icons/react';
import { useEffect, useRef } from 'react';

import { setupAboutAnimations } from '@/animations/about/about';
import { SiteFooter } from '@/components/chrome/site-footer';
import { MediaPicture } from '@/components/media/media-picture';
import { RouteAnimationBoundary, useRouteAnimationScope } from '@/components/runtime/route-animation-boundary';
import type { AboutContent, AboutInfoGroup, SiteConfig } from '@/content';

interface AboutExperienceProps {
  readonly content: AboutContent;
  readonly site: SiteConfig;
}

function AboutHero({ content }: { readonly content: AboutContent['hero'] }) {
  return (
    <section className="about-hero" data-about-section="A01" data-about-hero aria-labelledby="about-title">
      <div className="about-hero-stage">
        <h1 id="about-title" data-about-hero-title>
          <span>{content.line1}</span>
          <span>{content.line2}</span>
        </h1>
        <div className="about-hero-portrait" data-about-hero-portrait>
          <MediaPicture id={content.portraitId} imageClassName="about-media-image" loading="eager" size="half" />
        </div>
      </div>
    </section>
  );
}

function AboutIntro({ content }: { readonly content: AboutContent['intro'] }) {
  return (
    <section className="about-intro" data-about-section="A02" data-about-film-section aria-labelledby="about-intro-title">
      <div className="about-intro-copy">
        <h2 id="about-intro-title">{content.primary}</h2>
        <p lang="zh-Hant">{content.secondary}</p>
      </div>
      <div className="about-film-window" aria-label="Project-owned working image strip">
        <div className="about-film-strip" data-about-film-strip>
          {content.stripMediaIds.map((mediaId, index) => (
            <div className={`about-film-frame about-film-frame-${(index % 4) + 1}`} key={`${mediaId}-${index}`}>
              <MediaPicture id={mediaId} imageClassName="about-media-image" size={index % 3 === 1 ? 'half' : 'third'} alt="" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutStatement({ content }: { readonly content: AboutContent['statement'] }) {
  return (
    <section className="about-statement" data-about-section="A03" aria-labelledby="about-statement-title">
      <div>
        <h2 id="about-statement-title"><span>{content.title[0]}</span><span>{content.title[1]}</span></h2>
        <p className="about-statement-zh" lang="zh-Hant">{content.titleZh}</p>
      </div>
      <div className="about-statement-body">
        <p>{content.body}</p>
        <p lang="zh-Hant">{content.bodyZh}</p>
      </div>
    </section>
  );
}

function AboutStory({ content }: { readonly content: AboutContent['story'] }) {
  return (
    <section className="about-story" data-about-section="A04" aria-labelledby="about-story-title">
      <div className="about-story-media">
        <MediaPicture id={content.mediaId} imageClassName="about-media-image" size="half" />
      </div>
      <div className="about-story-copy">
        <h2 id="about-story-title">A STORY FRAME,<br />READY TO BECOME YOURS.</h2>
        {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <p className="about-story-zh" lang="zh-Hant">{content.companionZh}</p>
      </div>
    </section>
  );
}

function AboutInformation({ group }: { readonly group: AboutInfoGroup }) {
  if (!group.enabled) {
    return null;
  }

  return (
    <section className="about-information" data-about-section={group.id} aria-labelledby={`${group.id}-title`}>
      <header>
        <h2 id={`${group.id}-title`}>{group.title}</h2>
        <p lang="zh-Hant">{group.titleZh}</p>
      </header>
      <div className="about-information-rows">
        {group.rows.map((row) => {
          const contents = (
            <>
              <span className="about-information-primary">{row.primary}</span>
              <span className="about-information-secondary">{row.secondary}</span>
              <span className="about-information-meta">{row.meta}</span>
              {row.href ? <ArrowUpRight size={18} aria-hidden="true" /> : null}
            </>
          );
          return row.href ? (
            <a href={row.href} target="_blank" rel="noopener noreferrer" key={row.primary}>{contents}</a>
          ) : (
            <div key={row.primary}>{contents}</div>
          );
        })}
      </div>
    </section>
  );
}

function AboutRoute({ content, site }: AboutExperienceProps) {
  const rootRef = useRef<HTMLElement>(null);
  const scope = useRouteAnimationScope();

  useEffect(() => {
    const root = rootRef.current;
    if (root) {
      setupAboutAnimations(root, scope);
    }
  }, [scope]);

  return (
    <main ref={rootRef} className="about" data-route-content data-about-root>
      <AboutHero content={content.hero} />
      <AboutIntro content={content.intro} />
      <AboutStatement content={content.statement} />
      <AboutStory content={content.story} />
      {content.information.map((group) => <AboutInformation group={group} key={group.id} />)}
      <div data-about-section="A09">
        <SiteFooter site={site} />
      </div>
    </main>
  );
}

export function AboutExperience(props: AboutExperienceProps) {
  return (
    <RouteAnimationBoundary>
      <AboutRoute {...props} />
    </RouteAnimationBoundary>
  );
}
