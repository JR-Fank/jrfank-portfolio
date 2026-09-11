import { Play } from '@phosphor-icons/react/Play';

import { MediaPicture } from '@/components/media/media-picture';
import { TransitionLink } from '@/components/primitives/transition-link';
import type { MotionProject } from '@/content';

interface MotionProjectStageProps {
  readonly project: MotionProject;
  readonly index: number;
}

export function MotionProjectStage({ project, index }: MotionProjectStageProps) {
  const sectionNumber = index + 2;
  const sectionId = `M${String(sectionNumber).padStart(2, '0')}`;
  const headingId = `motion-project-${project.slug}`;
  const href = `/motion/${project.slug}/`;
  const linkName = `View ${project.identity.title.en} motion project`;

  return (
    <section
      id={`motion-${sectionId}`}
      className="motion-project-stage"
      data-motion-index-section={sectionId}
      data-motion-index-stage
      data-layout={project.index.layout}
      aria-labelledby={headingId}
    >
      <div className="motion-project-stage-inner">
        <p className="motion-project-meta" data-motion-index-meta>
          <span>{project.identity.date.en}</span>
          <span aria-hidden="true">→</span>
          <span>{project.identity.location.en}</span>
        </p>

        <h2 id={headingId} className="motion-project-title" data-motion-index-title>
          <span>{project.identity.title.en}</span>
          <span lang="zh-Hant">{project.identity.title.zhHant}</span>
        </h2>

        <div className="motion-project-composition" data-motion-index-composition>
          <TransitionLink
            className="motion-project-main"
            href={href}
            aria-label={linkName}
            data-motion-index-main
          >
            <MediaPicture
              id={project.index.posterId}
              className="motion-project-picture"
              imageClassName="motion-project-image"
              size="page-wide"
              loading={index === 0 ? 'eager' : 'lazy'}
              alt={project.identity.title.en}
            />
            <span className="motion-project-play-glow" aria-hidden="true" />
            <span className="motion-project-play" data-motion-index-play aria-hidden="true">
              <Play size={26} weight="fill" />
            </span>
          </TransitionLink>

          {project.index.satelliteMediaIds.map((mediaId, satelliteIndex) => (
            <div
              className={`motion-project-satellite motion-project-satellite-${satelliteIndex + 1}`}
              data-motion-index-satellite
              data-satellite-index={satelliteIndex}
              aria-hidden="true"
              key={`${project.slug}-${mediaId}`}
            >
              <MediaPicture
                id={mediaId}
                className="motion-project-picture"
                imageClassName="motion-project-image"
                size="third"
                alt=""
              />
            </div>
          ))}
        </div>

        <TransitionLink
          className="outline-pill motion-project-cta"
          href={href}
          aria-label={linkName}
          data-motion-index-cta
        >
          View project&nbsp;&nbsp;{project.index.number}
        </TransitionLink>
      </div>
    </section>
  );
}
