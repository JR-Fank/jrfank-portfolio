import { z } from 'zod';

import manifestJson from '@/generated/media-manifest.json';
import type { ImageMediaAsset, MediaAsset, MediaFormat, MediaId, VideoMediaAsset } from '@/content/types';

const mediaVariantSchema = z.object({
  width: z.number().positive(),
  format: z.enum(['avif', 'webp', 'jpg', 'mp4']),
  key: z.string().min(1),
  bytes: z.number().nonnegative(),
  hash: z.string().min(1),
});

const imageAssetSchema = z.object({
  kind: z.literal('image'),
  id: z.string().min(1),
  width: z.number().positive(),
  height: z.number().positive(),
  aspectRatio: z.number().positive(),
  alt: z.string(),
  dominantColor: z.string().optional(),
  focalPoint: z.object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) }).optional(),
  variants: z.array(mediaVariantSchema).min(1),
});

const videoAssetSchema = z.object({
  kind: z.literal('video'),
  id: z.string().min(1),
  width: z.number().positive(),
  height: z.number().positive(),
  aspectRatio: z.number().positive(),
  duration: z.number().nonnegative(),
  posterId: z.string().min(1),
  variants: z.array(mediaVariantSchema),
});

const manifestSchema = z.object({
  version: z.literal(1),
  generatedAt: z.string(),
  sourceFingerprint: z.string().min(1),
  assets: z.record(z.string(), z.discriminatedUnion('kind', [imageAssetSchema, videoAssetSchema])),
});

const manifest = manifestSchema.parse(manifestJson);

export type ImageSizePreset = 'viewport' | 'page-wide' | 'half' | 'third' | 'rail-thumb' | 'card';

export interface ResolvedImageSources {
  readonly asset: ImageMediaAsset;
  readonly src: string;
  readonly sources: readonly { readonly format: Extract<MediaFormat, 'avif' | 'webp'>; readonly srcSet: string }[];
  readonly sizes: string;
}

const sizePresets: Record<ImageSizePreset, string> = {
  viewport: '100vw',
  'page-wide': '(max-width: 479px) calc(100vw - 48px), (max-width: 767px) calc(100vw - 64px), (max-width: 991px) calc(100vw - 96px), calc(100vw - 128px)',
  half: '(max-width: 767px) 100vw, 50vw',
  third: '(max-width: 479px) 100vw, (max-width: 991px) 50vw, 33vw',
  'rail-thumb': '(max-width: 479px) 48px, 74px',
  card: '(max-width: 479px) 100vw, (max-width: 767px) 50vw, 33vw',
};

function mediaBaseUrl(): string {
  return process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? '/mock-media';
}

function joinMediaUrl(base: string, key: string): string {
  return `${base.replace(/\/$/, '')}/${key.replace(/^\//, '')}`;
}

function asMediaAsset(asset: z.infer<typeof imageAssetSchema> | z.infer<typeof videoAssetSchema>): MediaAsset {
  return asset;
}

export function getMedia(id: MediaId): MediaAsset {
  const asset = manifest.assets[id];
  if (!asset) {
    throw new Error(`Unknown media ID: ${id}`);
  }
  return asMediaAsset(asset);
}

export function getImageAsset(id: MediaId): ImageMediaAsset {
  const asset = getMedia(id);
  if (asset.kind !== 'image') {
    throw new Error(`Media ID is not an image: ${id}`);
  }
  return asset;
}

export function getVideoAsset(id: MediaId): VideoMediaAsset {
  const asset = getMedia(id);
  if (asset.kind !== 'video') {
    throw new Error(`Media ID is not a video: ${id}`);
  }
  return asset;
}

function srcSetFor(asset: ImageMediaAsset, format: 'avif' | 'webp' | 'jpg'): string {
  return asset.variants
    .filter((variant) => variant.format === format)
    .sort((first, second) => first.width - second.width)
    .map((variant) => `${joinMediaUrl(mediaBaseUrl(), variant.key)} ${variant.width}w`)
    .join(', ');
}

export function getImageSources(id: MediaId, size: ImageSizePreset): ResolvedImageSources {
  const asset = getImageAsset(id);
  const jpegVariants = asset.variants
    .filter((variant) => variant.format === 'jpg')
    .sort((first, second) => first.width - second.width);
  const fallback = jpegVariants.at(-1) ?? asset.variants.at(-1);

  if (!fallback) {
    throw new Error(`Image has no variants: ${id}`);
  }

  const sources = (['avif', 'webp'] as const)
    .map((format) => ({ format, srcSet: srcSetFor(asset, format) }))
    .filter((source) => source.srcSet.length > 0);

  return {
    asset,
    src: joinMediaUrl(mediaBaseUrl(), fallback.key),
    sources,
    sizes: sizePresets[size],
  };
}

export function getSocialImage(id: MediaId): string {
  const asset = getImageAsset(id);
  const fallback = asset.variants.find((variant) => variant.format === 'jpg') ?? asset.variants[0];
  if (!fallback) {
    throw new Error(`Social image has no variants: ${id}`);
  }

  const mediaOrigin = process.env.MEDIA_URL ?? mediaBaseUrl();
  const resolved = joinMediaUrl(mediaOrigin, fallback.key);
  if (/^https?:\/\//.test(resolved)) {
    return resolved;
  }
  return new URL(resolved, process.env.SITE_URL ?? 'http://localhost:3000').toString();
}

export function listMediaIds(): readonly string[] {
  return Object.keys(manifest.assets);
}
