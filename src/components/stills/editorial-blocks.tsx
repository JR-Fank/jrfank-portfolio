import type { ReactNode } from 'react';

import { MediaPicture } from '@/components/media/media-picture';
import type { ProjectBlock } from '@/content';
import { getVideoSources, type ImageSizePreset } from '@/lib/media';

type SequenceBlock = Extract<ProjectBlock, { readonly type: 'imageSequence' }>;

function blockClass(block: ProjectBlock, extra?: string): string {
  return [
    'stills-block',
    `stills-block-${block.type}`,
    `stills-block-top-${block.topSpace ?? 'standard'}`,
    `stills-block-bottom-${block.bottomSpace ?? 'standard'}`,
    `stills-block-theme-${block.theme ?? 'inherit'}`,
    extra,
  ].filter(Boolean).join(' ');
}

function sizeFor(width: 'viewport' | 'page-wide' | 'large' | 'medium' | 'small'): ImageSizePreset {
  if (width === 'viewport' || width === 'page-wide' || width === 'large') {
    return 'page-wide';
  }
  return width === 'medium' ? 'half' : 'third';
}

function Caption({ text }: { readonly text?: { readonly en: string; readonly zhHant?: string } }) {
  if (!text) {
    return null;
  }
  return (
    <figcaption className="stills-block-caption">
      <span>{text.en}</span>
      {text.zhHant ? <span lang="zh-Hant">{text.zhHant}</span> : null}
    </figcaption>
  );
}

function RevealLine({ text }: { readonly text: string }) {
  return (
    <span aria-label={text} data-stills-text-reveal>
      {text.split(' ').map((word, index) => (
        <span data-stills-reveal-word aria-hidden="true" key={`${word}-${index}`}>{word}{index < text.split(' ').length - 1 ? ' ' : ''}</span>
      ))}
    </span>
  );
}

function VideoBlock({ block }: { readonly block: Extract<ProjectBlock, { readonly type: 'video' }> }) {
  const media = getVideoSources(block.mediaId);
  return (
    <figure className={blockClass(block, `stills-block-width-${block.width} stills-block-align-${block.align ?? 'center'}`)}>
      <video
        className="stills-block-video"
        controls={block.mode === 'film-player'}
        autoPlay={block.mode === 'preview-loop'}
        muted={block.mode === 'preview-loop'}
        loop={block.mode === 'preview-loop'}
        playsInline
        preload="metadata"
        poster={media.poster}
      >
        {media.sources.map((source) => <source src={source.src} type={`video/${source.format}`} key={source.src} />)}
      </video>
      <Caption text={block.caption} />
    </figure>
  );
}

export function EditorialBlock({
  block,
  renderSequence,
}: {
  readonly block: ProjectBlock;
  readonly renderSequence: (block: SequenceBlock) => ReactNode;
}) {
  switch (block.type) {
    case 'hero':
      return null;
    case 'fullBleed':
      return (
        <figure className={blockClass(block, `stills-block-height-${block.height}`)}>
          <MediaPicture id={block.mediaId} className="stills-block-picture" imageClassName="stills-media-image" size="viewport" />
          <Caption text={block.caption} />
        </figure>
      );
    case 'landscape':
      return (
        <figure className={blockClass(block, `stills-block-width-${block.width} stills-block-align-${block.align ?? 'center'}`)}>
          <MediaPicture id={block.mediaId} className="stills-block-picture" imageClassName="stills-media-image" size={sizeFor(block.width)} />
          <Caption text={block.caption} />
        </figure>
      );
    case 'portrait':
      return (
        <figure className={blockClass(block, `stills-block-width-${block.width} stills-block-align-${block.align}`)}>
          <MediaPicture id={block.mediaId} className="stills-block-picture" imageClassName="stills-media-image" size={sizeFor(block.width)} />
          <Caption text={block.caption} />
        </figure>
      );
    case 'imagePair':
      return (
        <figure className={blockClass(block, `stills-block-gap-${block.gap} stills-block-pair-${block.ratio} stills-block-items-${block.align} stills-block-mobile-${block.mobile}`)}>
          {block.mediaIds.map((mediaId) => (
            <MediaPicture id={mediaId} className="stills-block-picture" imageClassName="stills-media-image" size="half" key={mediaId} />
          ))}
          <Caption text={block.caption} />
        </figure>
      );
    case 'imageTriptych':
      return (
        <figure className={blockClass(block, `stills-block-gap-${block.gap} stills-block-triptych-${block.arrangement} stills-block-mobile-${block.mobile}`)}>
          {block.mediaIds.map((mediaId) => (
            <MediaPicture id={mediaId} className="stills-block-picture" imageClassName="stills-media-image" size="third" key={mediaId} />
          ))}
        </figure>
      );
    case 'offsetImage':
      return (
        <figure className={blockClass(block, `stills-block-width-${block.width} stills-block-align-${block.align} stills-block-offset-${block.offset}`)}>
          <MediaPicture id={block.mediaId} className="stills-block-picture" imageClassName="stills-media-image" size={sizeFor(block.width)} />
          <Caption text={block.caption} />
        </figure>
      );
    case 'smallImage':
      return (
        <figure className={blockClass(block, `stills-block-width-small stills-block-align-${block.align} stills-block-offset-${block.offset ?? 'none'}`)}>
          <MediaPicture id={block.mediaId} className="stills-block-picture" imageClassName="stills-media-image" size="third" />
          <Caption text={block.caption} />
        </figure>
      );
    case 'imageSequence':
      return block.activeRail ? renderSequence(block) : (
        <section className={blockClass(block, `stills-sequence-${block.presentation} stills-block-gap-${block.gap}`)} aria-label="Photography sequence">
          {block.mediaIds.map((mediaId, index) => (
            <MediaPicture id={mediaId} className="stills-block-picture" imageClassName="stills-media-image" size="page-wide" key={`${mediaId}-${index}`} />
          ))}
        </section>
      );
    case 'video':
      return <VideoBlock block={block} />;
    case 'caption':
      return (
        <aside className={blockClass(block, `stills-block-width-${block.width} stills-block-align-${block.align}`)}>
          <p>{block.text.en}</p>
          {block.text.zhHant ? <p lang="zh-Hant">{block.text.zhHant}</p> : null}
        </aside>
      );
    case 'text':
      return (
        <section className={blockClass(block, `stills-block-width-${block.width} stills-block-align-${block.align}`)}>
          {block.heading ? (
            <h2>
              <RevealLine text={block.heading.en} />
              {block.heading.zhHant ? <span className="stills-block-heading-zh" lang="zh-Hant">{block.heading.zhHant}</span> : null}
            </h2>
          ) : null}
          <div className="stills-block-text-body">
            {block.body.map((paragraph, index) => (
              <div key={`${paragraph.en}-${index}`}>
                <p>{paragraph.en}</p>
                {paragraph.zhHant ? <p lang="zh-Hant">{paragraph.zhHant}</p> : null}
              </div>
            ))}
          </div>
        </section>
      );
    case 'spacer':
      return <div className={blockClass(block, `stills-block-spacer-${block.size}`)} aria-hidden="true" />;
  }
}
