import type { CSSProperties } from 'react';

import type { MediaId } from '@/content/types';
import { getImageSources, type ImageSizePreset } from '@/lib/media';

interface MediaPictureProps {
  readonly id: MediaId;
  readonly className?: string;
  readonly imageClassName?: string;
  readonly size?: ImageSizePreset;
  readonly loading?: 'eager' | 'lazy';
  readonly alt?: string;
}

export function MediaPicture({
  id,
  className,
  imageClassName,
  size = 'page-wide',
  loading = 'lazy',
  alt,
}: MediaPictureProps) {
  const resolved = getImageSources(id, size);
  const { asset } = resolved;
  const focalPoint = asset.focalPoint ?? { x: 0.5, y: 0.5 };
  const style = {
    aspectRatio: `${asset.width} / ${asset.height}`,
    backgroundColor: asset.dominantColor,
    '--media-focal-x': `${focalPoint.x * 100}%`,
    '--media-focal-y': `${focalPoint.y * 100}%`,
  } as CSSProperties;

  return (
    <picture className={className} data-media-id={id} style={style}>
      {resolved.sources.map((source) => (
        <source key={source.format} type={`image/${source.format}`} srcSet={source.srcSet} sizes={resolved.sizes} />
      ))}
      <img
        className={imageClassName}
        src={resolved.src}
        alt={alt ?? asset.alt}
        width={asset.width}
        height={asset.height}
        sizes={resolved.sizes}
        loading={loading}
        fetchPriority={loading === 'eager' ? 'high' : 'auto'}
        decoding="async"
        data-preload={loading === 'eager' ? 'critical' : undefined}
      />
    </picture>
  );
}
