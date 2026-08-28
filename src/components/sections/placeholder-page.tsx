import type { MediaId, SiteConfig } from '@/content/types';
import { SiteFooter } from '@/components/chrome/site-footer';
import { MediaPicture } from '@/components/media/media-picture';
import { TransitionLink } from '@/components/primitives/transition-link';
import { RouteAnimationBoundary } from '@/components/runtime/route-animation-boundary';

interface PlaceholderPageProps {
  readonly site: SiteConfig;
  readonly eyebrow: string;
  readonly title: string;
  readonly titleZh: string;
  readonly location: string;
  readonly locationZh: string;
  readonly mediaId: MediaId;
  readonly cta?: { readonly label: string; readonly href: string };
  readonly portrait?: boolean;
}

export function PlaceholderPage({
  site,
  eyebrow,
  title,
  titleZh,
  location,
  locationZh,
  mediaId,
  cta,
  portrait = false,
}: PlaceholderPageProps) {
  return (
    <RouteAnimationBoundary>
      <div data-route-content>
        <main>
          <section className={`placeholder-hero${portrait ? ' placeholder-hero-portrait' : ''}`}>
            <MediaPicture id={mediaId} className="placeholder-media" imageClassName="placeholder-media-image" loading="eager" size="page-wide" />
            <div className="placeholder-shade" aria-hidden="true" />
            <div className="placeholder-copy">
              <span className="placeholder-eyebrow">{eyebrow}</span>
              <h1><span lang="zh-Hant">{titleZh}</span><span>{title}</span></h1>
              <p><span>{location}</span><span lang="zh-Hant">{locationZh}</span></p>
              {cta ? <TransitionLink className="outline-pill placeholder-cta" href={cta.href}>{cta.label}</TransitionLink> : null}
            </div>
          </section>
          <section className="foundation-marker" aria-label="Foundation placeholder">
            <p lang="zh-Hant">頁面內容將於後續階段製作。</p>
            <p>PAGE CONTENT ARRIVES IN A LATER PHASE.</p>
          </section>
        </main>
        <SiteFooter site={site} />
      </div>
    </RouteAnimationBoundary>
  );
}
