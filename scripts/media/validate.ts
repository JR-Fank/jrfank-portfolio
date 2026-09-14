import { readFile } from 'node:fs/promises';

import { loadEnvConfig } from '@next/env';
import { z } from 'zod';

import { IMAGE_FORMATS, IMAGE_WIDTHS, assertRepositoryRelative, cliString, parseCliArgs, readCatalog, repositoryPath } from './contracts';

const hashSchema = z.string().min(1);
const variantSchema = z.object({
  width: z.number().int().positive(),
  format: z.enum(['avif', 'webp', 'jpg', 'mp4']),
  key: z.string().trim().min(1),
  bytes: z.number().int().nonnegative(),
  hash: hashSchema,
});
const imageSchema = z.object({
  kind: z.literal('image'),
  id: z.string().trim().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  aspectRatio: z.number().positive(),
  alt: z.string(),
  dominantColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  focalPoint: z.object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) }).optional(),
  variants: z.array(variantSchema).min(1),
});
const videoSchema = z.object({
  kind: z.literal('video'),
  id: z.string().trim().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  aspectRatio: z.number().positive(),
  duration: z.number().nonnegative(),
  posterId: z.string().trim().min(1),
  role: z.enum(['preview', 'full-film']).optional(),
  audioPolicy: z.enum(['muted-preview-user-gesture-full-audio', 'muted-preview-muted-full']).optional(),
  hasAudio: z.boolean().optional(),
  variants: z.array(variantSchema),
});
const manifestSchema = z.object({
  version: z.literal(1),
  generatedAt: z.string().datetime({ offset: true }),
  sourceFingerprint: z.string().trim().min(1),
  assets: z.record(z.string(), z.discriminatedUnion('kind', [imageSchema, videoSchema])),
});

function assertEnvironmentContract(): void {
  const publicMedia = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
  const canonicalMedia = process.env.MEDIA_URL;
  if (Boolean(publicMedia) !== Boolean(canonicalMedia)) {
    throw new Error('NEXT_PUBLIC_MEDIA_BASE_URL and MEDIA_URL must either both be set or both be absent.');
  }
  if (publicMedia !== canonicalMedia) {
    throw new Error('NEXT_PUBLIC_MEDIA_BASE_URL and MEDIA_URL must resolve to the same media base URL.');
  }
  for (const key of Object.keys(process.env)) {
    if (key.startsWith('NEXT_PUBLIC_') && /(?:R2|SECRET|ACCESS_KEY|ACCOUNT_ID|BUCKET)/i.test(key)) {
      throw new Error(`R2 credentials and identifiers must never use a NEXT_PUBLIC_ variable: ${key}`);
    }
  }
}

function assertProductionVariant(variant: z.infer<typeof variantSchema>): void {
  if (!variant.key.startsWith('v1/')) throw new Error(`Production object key must start with v1/: ${variant.key}`);
  if (variant.bytes <= 0) throw new Error(`Production object bytes must be positive: ${variant.key}`);
  if (!/^[a-f0-9]{64}$/.test(variant.hash)) throw new Error(`Production object hash must be SHA-256: ${variant.key}`);
}

async function main(): Promise<void> {
  const args = parseCliArgs(process.argv.slice(2));
  const manifestPath = cliString(args, 'manifest', 'src/generated/media-manifest.json');
  const catalogPath = cliString(args, 'catalog', 'media-source/catalog.json');
  const production = args.has('production');
  assertRepositoryRelative(manifestPath, 'Manifest');
  loadEnvConfig(process.cwd());
  assertEnvironmentContract();
  await readCatalog(catalogPath);

  const raw = JSON.parse(await readFile(repositoryPath(manifestPath), 'utf8')) as unknown;
  const manifest = manifestSchema.parse(raw);
  const objectKeys = new Set<string>();

  for (const [recordId, asset] of Object.entries(manifest.assets)) {
    if (recordId !== asset.id) throw new Error(`Manifest record key and asset ID differ: ${recordId} != ${asset.id}`);
    const ratio = asset.width / asset.height;
    if (Math.abs(ratio - asset.aspectRatio) > 0.001) throw new Error(`Aspect ratio mismatch: ${asset.id}`);
    if (asset.kind === 'image' && !asset.alt.trim()) throw new Error(`Image alt text cannot be empty: ${asset.id}`);

    const productionAsset = asset.variants.length > 0 && asset.variants.every((variant) => variant.key.startsWith('v1/'));
    if (production && !productionAsset) throw new Error(`Production manifest contains a non-production asset: ${asset.id}`);
    for (const variant of asset.variants) {
      assertRepositoryRelative(variant.key, 'Object key');
      if (/(?:^|\/)(?:img|dsc)[-_]?\d+/i.test(variant.key)) throw new Error(`Camera filename is forbidden in object key: ${variant.key}`);
      if (variant.width > asset.width) throw new Error(`Variant upscales beyond intrinsic width: ${asset.id}/${variant.width}`);
      if (objectKeys.has(variant.key)) throw new Error(`Duplicate object key: ${variant.key}`);
      objectKeys.add(variant.key);
      if (asset.kind === 'image' && variant.format === 'mp4') throw new Error(`Image has MP4 variant: ${asset.id}`);
      if (asset.kind === 'video' && variant.format !== 'mp4') throw new Error(`Video has non-MP4 variant: ${asset.id}`);
      if (productionAsset || variant.key.startsWith('v1/')) assertProductionVariant(variant);
    }

    if (asset.kind === 'image' && productionAsset) {
      const widths = new Set(asset.variants.map((variant) => variant.width));
      for (const width of widths) {
        if (!IMAGE_WIDTHS.includes(width as typeof IMAGE_WIDTHS[number])) throw new Error(`Production image uses an unapproved width: ${asset.id}/${width}`);
        const formats = new Set(asset.variants.filter((variant) => variant.width === width).map((variant) => variant.format));
        for (const format of IMAGE_FORMATS) {
          if (!formats.has(format)) throw new Error(`Production image width lacks ${format}: ${asset.id}/${width}`);
        }
      }
    }

    if (asset.kind === 'video') {
      const poster = manifest.assets[asset.posterId];
      if (!poster || poster.kind !== 'image') throw new Error(`Video poster must resolve to an image: ${asset.id}/${asset.posterId}`);
      if (productionAsset) {
        if (asset.variants.length === 0 || !asset.role || !asset.audioPolicy || asset.hasAudio === undefined) {
          throw new Error(`Production video metadata is incomplete: ${asset.id}`);
        }
        if (asset.role === 'preview' && asset.hasAudio) throw new Error(`Production preview must be muted/no-audio: ${asset.id}`);
        if (asset.role === 'full-film' && asset.hasAudio && asset.audioPolicy !== 'muted-preview-user-gesture-full-audio') {
          throw new Error(`Production full-film audio lacks explicit user-gesture policy: ${asset.id}`);
        }
      }
    }
  }

  console.log(`Validated ${Object.keys(manifest.assets).length} manifest assets and media intake catalog (${production ? 'production-strict' : 'development-compatible'} mode).`);
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
