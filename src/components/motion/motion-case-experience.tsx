import { SiteFooter } from '@/components/chrome/site-footer';
import { MediaPicture } from '@/components/media/media-picture';
import type { MotionProject, SiteConfig } from '@/content/types';
import { getVideoSources } from '@/lib/media';

import { MotionCaseBoundary } from './motion-case-boundary';
import { MotionFilmHero } from './motion-film-hero';

interface MotionCaseExperienceProps {
  readonly project: MotionProject;
  readonly site: SiteConfig;
}

export function MotionCaseExperience({ project, site }: MotionCaseExperienceProps) {
  const playback = project.caseStudy.hero;
  if (!playback.previewId || !playback.fullFilmId) {
    throw new Error(`Motion case playback sources are incomplete: ${project.slug}`);
  }
  const preview = getVideoSources(playback.previewId).sources[0];
  const fullFilm = getVideoSources(playback.fullFilmId).sources[0];
  if (!preview || !fullFilm) {
    throw new Error(`Motion case playback renditions are missing: ${project.slug}`);
  }

  return (
    <MotionCaseBoundary routeKey={project.slug}>
      <main className="motion motion-case" data-route-content data-motion-case-root data-motion-project={project.slug}>
        <MotionFilmHero
          slug={project.slug}
          titleEn={project.identity.title.en}
          titleZh={project.identity.title.zhHant}
          poster={(
            <MediaPicture
              id={playback.posterId}
              className="motion-film-poster-picture"
              imageClassName="motion-film-poster-image"
              size="viewport"
              loading="eager"
            />
          )}
          previewSrc={preview.src}
          fullFilmSrc={fullFilm.src}
          audioPolicy={playback.audioPolicy}
        />

        <section className="motion-case-introduction" aria-labelledby={`motion-synopsis-${project.slug}`}>
          <div className="motion-case-identity">
            <p>{project.identity.date.en}</p>
            {project.identity.date.zhHant ? <p lang="zh-Hant">{project.identity.date.zhHant}</p> : null}
            <p>{project.identity.location.en}</p>
            {project.identity.location.zhHant ? <p lang="zh-Hant">{project.identity.location.zhHant}</p> : null}
          </div>
          <div className="motion-case-synopsis">
            <p id={`motion-synopsis-${project.slug}`}>{project.caseStudy.synopsis.en}</p>
            {project.caseStudy.synopsis.zhHant ? <p lang="zh-Hant">{project.caseStudy.synopsis.zhHant}</p> : null}
          </div>
        </section>

        <SiteFooter site={site} />
      </main>
    </MotionCaseBoundary>
  );
}
