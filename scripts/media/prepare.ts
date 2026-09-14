import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, relative } from 'node:path';

import sharp, { type Metadata } from 'sharp';

import {
  CACHE_CONTROL,
  IMAGE_FORMATS,
  IMAGE_WIDTHS,
  assertSemanticSource,
  cliString,
  mimeForExtension,
  objectPrefix,
  parseCliArgs,
  readCatalog,
  repositoryPath,
  semanticLeaf,
  sha256,
  type ImageIntake,
  type UploadObject,
  type UploadPlan,
  type VideoIntake,
} from './contracts';
import { validatePreparedVideo } from './video-lib';

interface ManifestVariant {
  readonly width: number;
  readonly format: 'avif' | 'webp' | 'jpg' | 'mp4';
  readonly key: string;
  readonly bytes: number;
  readonly hash: string;
}

interface ManifestAsset {
  readonly kind: 'image' | 'video';
  readonly id: string;
  readonly width: number;
  readonly height: number;
  readonly aspectRatio: number;
  readonly variants: readonly ManifestVariant[];
  readonly alt?: string;
  readonly dominantColor?: string;
  readonly focalPoint?: { readonly x: number; readonly y: number };
  readonly duration?: number;
  readonly posterId?: string;
  readonly role?: 'preview' | 'full-film';
  readonly audioPolicy?: 'muted-preview-user-gesture-full-audio' | 'muted-preview-muted-full';
  readonly hasAudio?: boolean;
}

interface MediaManifest {
  readonly version: 1;
  readonly generatedAt: string;
  readonly sourceFingerprint: string;
  readonly assets: Record<string, ManifestAsset>;
}

function orientedDimensions(metadata: Metadata): { width: number; height: number } {
  if (!metadata.width || !metadata.height) throw new Error('Image is missing intrinsic dimensions.');
  const swapsAxes = metadata.orientation !== undefined && metadata.orientation >= 5 && metadata.orientation <= 8;
  return swapsAxes
    ? { width: metadata.height, height: metadata.width }
    : { width: metadata.width, height: metadata.height };
}

async function encodeImage(sourcePath: string, width: number, format: typeof IMAGE_FORMATS[number]): Promise<Buffer> {
  const pipeline = sharp(sourcePath, { failOn: 'error' })
    .rotate()
    .toColorspace('srgb')
    .resize({ width, withoutEnlargement: true });
  if (format === 'avif') return pipeline.avif({ quality: 55 }).toBuffer();
  if (format === 'webp') return pipeline.webp({ quality: 78 }).toBuffer();
  return pipeline.jpeg({ quality: 84, chromaSubsampling: '4:2:0' }).toBuffer();
}

async function prepareImage(
  asset: ImageIntake,
  outputRoot: string,
  dryRun: boolean,
): Promise<{ entry?: ManifestAsset; objects: UploadObject[]; sourceHash: string }> {
  assertSemanticSource(asset.source);
  const sourcePath = repositoryPath(asset.source);
  const sourceBytes = await readFile(sourcePath);
  const sourceHash = sha256(sourceBytes);
  const metadata = await sharp(sourceBytes, { failOn: 'error' }).metadata();
  const { width, height } = orientedDimensions(metadata);
  const widths = IMAGE_WIDTHS.filter((candidate) => candidate <= width && (candidate !== 3200 || asset.allow3200));
  if (widths.length === 0) throw new Error(`${asset.id} is narrower than the minimum approved 640px width.`);

  console.log(`${dryRun ? '[dry-run] ' : ''}${asset.id}: ${width}x${height}, ${widths.length * IMAGE_FORMATS.length} derivatives, EXIF stripped, sRGB output.`);
  if (dryRun) {
    for (const targetWidth of widths) {
      console.log(`  would prepare ${targetWidth}px: ${IMAGE_FORMATS.join(', ')}`);
    }
    return { objects: [], sourceHash };
  }

  const variants: ManifestVariant[] = [];
  const objects: UploadObject[] = [];
  for (const targetWidth of widths) {
    for (const format of IMAGE_FORMATS) {
      const output = await encodeImage(sourcePath, targetWidth, format);
      const hash = sha256(output);
      const key = `${objectPrefix(asset)}/${semanticLeaf(asset.id)}-${targetWidth}-${hash.slice(0, 12)}.${format}`;
      const localPath = `${outputRoot}/${key}`;
      await mkdir(dirname(repositoryPath(localPath)), { recursive: true });
      await writeFile(repositoryPath(localPath), output);
      variants.push({ width: targetWidth, format, key, bytes: output.byteLength, hash });
      objects.push({ key, localPath, bytes: output.byteLength, sha256: hash, contentType: mimeForExtension(format), cacheControl: CACHE_CONTROL });
    }
  }

  return {
    entry: {
      kind: 'image', id: asset.id, width, height, aspectRatio: width / height,
      alt: asset.alt, dominantColor: asset.dominantColor, focalPoint: asset.focalPoint, variants,
    },
    objects,
    sourceHash,
  };
}

async function prepareVideo(
  asset: VideoIntake,
  outputRoot: string,
  dryRun: boolean,
): Promise<{ entry?: ManifestAsset; objects: UploadObject[]; sourceHash: string }> {
  assertSemanticSource(asset.source);
  if (extname(asset.source).toLowerCase() !== '.mp4') throw new Error(`${asset.id} must reference a prepared MP4 derivative.`);
  const sourcePath = repositoryPath(asset.source);
  const sourceBytes = await readFile(sourcePath);
  const sourceHash = sha256(sourceBytes);
  console.log(`${dryRun ? '[dry-run] ' : ''}${asset.id}: prepared ${asset.role} MP4, ${asset.width}x${asset.height}, ${asset.duration}s, audio=${asset.hasAudio}.`);
  if (dryRun) {
    console.log('  would require ffprobe validation for H.264, yuv420p, dimensions, duration, audio policy, and faststart.');
    return { objects: [], sourceHash };
  }

  await validatePreparedVideo(sourcePath, asset);
  const key = `${objectPrefix(asset)}/${semanticLeaf(asset.id)}-${asset.width}-${sourceHash.slice(0, 12)}.mp4`;
  const localPath = `${outputRoot}/${key}`;
  await mkdir(dirname(repositoryPath(localPath)), { recursive: true });
  await writeFile(repositoryPath(localPath), sourceBytes);
  const variant: ManifestVariant = { width: asset.width, format: 'mp4', key, bytes: sourceBytes.byteLength, hash: sourceHash };
  return {
    entry: {
      kind: 'video', id: asset.id, width: asset.width, height: asset.height,
      aspectRatio: asset.width / asset.height, duration: asset.duration, posterId: asset.posterId,
      role: asset.role, audioPolicy: asset.audioPolicy, hasAudio: asset.hasAudio, variants: [variant],
    },
    objects: [{ key, localPath, bytes: sourceBytes.byteLength, sha256: sourceHash, contentType: 'video/mp4', cacheControl: CACHE_CONTROL }],
    sourceHash,
  };
}

async function main(): Promise<void> {
  const args = parseCliArgs(process.argv.slice(2));
  const catalogPath = cliString(args, 'catalog', 'media-source/catalog.json');
  const outputRoot = cliString(args, 'output', '.media-work/prepared');
  const manifestPath = cliString(args, 'manifest', '.media-work/media-manifest.candidate.json');
  const planPath = cliString(args, 'plan', '.media-work/upload-plan.json');
  const dryRun = args.has('dry-run');
  const catalog = await readCatalog(catalogPath);
  const baseManifest = JSON.parse(await readFile(repositoryPath(catalog.baseManifest), 'utf8')) as MediaManifest;
  const assets = { ...baseManifest.assets };
  const objects: UploadObject[] = [];
  const sourceHashes: string[] = [];

  for (const asset of catalog.assets) {
    const result = asset.kind === 'image'
      ? await prepareImage(asset, outputRoot, dryRun)
      : await prepareVideo(asset, outputRoot, dryRun);
    sourceHashes.push(`${asset.id}:${result.sourceHash}`);
    objects.push(...result.objects);
    if (result.entry) assets[asset.id] = result.entry;
  }

  const sourceFingerprint = sha256(`${JSON.stringify(catalog)}\n${sourceHashes.sort().join('\n')}`);
  if (dryRun) {
    console.log(`[dry-run] ${catalog.assets.length} asset(s) inspected; no derivatives, manifest, or upload plan were written.`);
    console.log(`[dry-run] source fingerprint would be ${sourceFingerprint}.`);
    return;
  }

  const candidate: MediaManifest = { version: 1, generatedAt: catalog.generatedAt, sourceFingerprint, assets };
  const uploadPlan: UploadPlan = { version: 1, manifestPath, objects };
  await mkdir(dirname(repositoryPath(manifestPath)), { recursive: true });
  await mkdir(dirname(repositoryPath(planPath)), { recursive: true });
  await writeFile(repositoryPath(manifestPath), `${JSON.stringify(candidate, null, 2)}\n`);
  await writeFile(repositoryPath(planPath), `${JSON.stringify(uploadPlan, null, 2)}\n`);
  console.log(`Prepared ${objects.length} immutable object(s).`);
  console.log(`Manifest candidate: ${relative(process.cwd(), repositoryPath(manifestPath))}`);
  console.log(`Upload plan: ${relative(process.cwd(), repositoryPath(planPath))}`);
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
