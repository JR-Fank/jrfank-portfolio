import { MediaPicture } from '@/components/media/media-picture';
import type { BilingualText, MediaId } from '@/content/types';

interface MotionBehindScenesProps {
  readonly heading: BilingualText;
  readonly mediaIds: readonly [MediaId, MediaId, MediaId, MediaId, MediaId, MediaId, MediaId, MediaId];
  readonly projectSlug: string;
}

export function MotionBehindScenes({ heading, mediaIds, projectSlug }: MotionBehindScenesProps) {
  const titleId = `motion-bts-title-${projectSlug}`;
  return (
    <section className="motion-bts" aria-labelledby={titleId} data-motion-bts data-motion-animation-images>
      <div className="motion-bts-stage" data-motion-bts-stage>
        <h2 id={titleId} className="motion-bts-heading">
          <span className="sr-only">{heading.en}</span>
          <span className="motion-bts-title motion-bts-title-top" data-motion-bts-title="top" aria-hidden="true">BEHIND</span>
          <span className="motion-bts-title motion-bts-title-bottom" data-motion-bts-title="bottom" aria-hidden="true">THE SCENES</span>
        </h2>
        {heading.zhHant ? <p className="motion-bts-title-zh" lang="zh-Hant">{heading.zhHant}</p> : null}
        <div className="motion-bts-frame" data-motion-bts-frame>
          <ol className="motion-bts-media-list">
            {mediaIds.map((mediaId, index) => (
              <li className="motion-bts-media" data-motion-bts-item data-bts-index={index + 1} key={`${mediaId}-${index}`}>
                <MediaPicture
                  id={mediaId}
                  className="motion-bts-picture"
                  imageClassName="motion-bts-image"
                  size="page-wide"
                />
                <span className="motion-bts-counter" aria-hidden="true">{String(index + 1).padStart(2, '0')} / 08</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
