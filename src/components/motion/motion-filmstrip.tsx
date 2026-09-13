import { MediaPicture } from '@/components/media/media-picture';
import type { MotionFilmstripRow } from '@/content/types';

function FilmstripSet({ row, clone }: { readonly row: MotionFilmstripRow; readonly clone: boolean }) {
  return (
    <ul
      className="motion-filmstrip-set"
      aria-hidden={clone || undefined}
      data-motion-filmstrip-set={clone ? 'clone' : 'base'}
    >
      {row.mediaIds.map((mediaId, index) => (
        <li className="motion-filmstrip-frame" key={`${row.id}-${clone ? 'clone' : 'base'}-${mediaId}-${index}`}>
          <MediaPicture
            id={mediaId}
            className="motion-filmstrip-picture"
            imageClassName="motion-filmstrip-image"
            size="half"
            alt={clone ? '' : undefined}
          />
        </li>
      ))}
    </ul>
  );
}

export function MotionFilmstrip({ rows, projectSlug }: { readonly rows: readonly [MotionFilmstripRow, MotionFilmstripRow]; readonly projectSlug: string }) {
  const titleId = `motion-filmstrip-title-${projectSlug}`;
  return (
    <section className="motion-filmstrip" aria-labelledby={titleId} data-motion-filmstrip data-motion-animation-images>
      <div className="motion-filmstrip-heading">
        <p className="motion-filmstrip-label">SELECTED FRAMES</p>
        <h2 id={titleId}>A FILM IN MOTION</h2>
      </div>
      <div className="motion-filmstrip-rows">
        {rows.map((row) => (
          <div className="motion-filmstrip-row" data-motion-filmstrip-row data-direction={row.direction} key={row.id}>
            <div className="motion-filmstrip-track" data-motion-filmstrip-track>
              {row.direction === 'reverse' ? <FilmstripSet row={row} clone /> : null}
              <FilmstripSet row={row} clone={false} />
              {row.direction === 'forward' ? <FilmstripSet row={row} clone /> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
