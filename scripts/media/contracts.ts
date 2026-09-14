import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { isAbsolute, normalize, resolve } from 'node:path';

import { z } from 'zod';

export const IMAGE_WIDTHS = [640, 1280, 1920, 2560, 3200] as const;
export const IMAGE_FORMATS = ['avif', 'webp', 'jpg'] as const;
export const CACHE_CONTROL = 'public, max-age=31536000, immutable';

export const mediaRoleSchema = z.enum([
  'hero',
  'cover',
  'gallery',
  'rail',
  'poster',
  'satellite',
  'filmstrip',
  'bts',
  'preview',
  'full-film',
  'about',
  'social',
]);

const bilingualTextSchema = z.object({
  en: z.string().trim().min(1),
  zhHant: z.string().trim().min(1).optional(),
});

const intakeBaseSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/),
  scope: z.enum(['home', 'stills', 'motion', 'about', 'site']),
  project: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  role: mediaRoleSchema,
  source: z.string().trim().min(1),
  title: bilingualTextSchema.optional(),
  description: bilingualTextSchema.optional(),
  order: z.number().int().nonnegative().optional(),
});

const imageIntakeSchema = intakeBaseSchema.extend({
  kind: z.literal('image'),
  alt: z.string().trim().min(1),
  focalPoint: z.object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) }).optional(),
  dominantColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  allow3200: z.boolean().default(false),
});

const videoIntakeSchema = intakeBaseSchema.extend({
  kind: z.literal('video'),
  role: z.enum(['preview', 'full-film']),
  posterId: z.string().regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  duration: z.number().positive(),
  audioPolicy: z.enum(['muted-preview-user-gesture-full-audio', 'muted-preview-muted-full']),
  hasAudio: z.boolean(),
  approvedWebDerivative: z.literal(true),
});

export const mediaCatalogSchema = z.object({
  version: z.literal(1),
  generatedAt: z.string().datetime({ offset: true }),
  release: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  baseManifest: z.string().default('src/generated/media-manifest.json'),
  assets: z.array(z.discriminatedUnion('kind', [imageIntakeSchema, videoIntakeSchema])),
}).superRefine((catalog, context) => {
  const ids = new Set<string>();
  for (const [index, asset] of catalog.assets.entries()) {
    if (ids.has(asset.id)) {
      context.addIssue({ code: 'custom', path: ['assets', index, 'id'], message: `Duplicate media ID: ${asset.id}` });
    }
    ids.add(asset.id);
    if (asset.kind === 'video') {
      if (asset.role === 'preview' && asset.hasAudio) {
        context.addIssue({ code: 'custom', path: ['assets', index, 'hasAudio'], message: 'Preview video must not contain an audio stream.' });
      }
      if (asset.role === 'full-film' && asset.hasAudio && asset.audioPolicy !== 'muted-preview-user-gesture-full-audio') {
        context.addIssue({ code: 'custom', path: ['assets', index, 'audioPolicy'], message: 'Full-film audio requires the explicit user-gesture audio policy.' });
      }
    }
  }
});

export type MediaCatalog = z.infer<typeof mediaCatalogSchema>;
export type MediaIntake = MediaCatalog['assets'][number];
export type ImageIntake = Extract<MediaIntake, { kind: 'image' }>;
export type VideoIntake = Extract<MediaIntake, { kind: 'video' }>;

export interface UploadObject {
  readonly key: string;
  readonly localPath: string;
  readonly bytes: number;
  readonly sha256: string;
  readonly contentType: 'image/avif' | 'image/webp' | 'image/jpeg' | 'video/mp4';
  readonly cacheControl: typeof CACHE_CONTROL;
}

export interface UploadPlan {
  readonly version: 1;
  readonly manifestPath: string;
  readonly objects: readonly UploadObject[];
}

export function parseCliArgs(argv: readonly string[]): Map<string, string | true> {
  const parsed = new Map<string, string | true>();
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item?.startsWith('--')) continue;
    const key = item.slice(2);
    const next = argv[index + 1];
    if (next && !next.startsWith('--')) {
      parsed.set(key, next);
      index += 1;
    } else {
      parsed.set(key, true);
    }
  }
  return parsed;
}

export function cliString(args: Map<string, string | true>, key: string, fallback?: string): string {
  const value = args.get(key);
  if (typeof value === 'string') return value;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing required --${key} value.`);
}

export function assertRepositoryRelative(path: string, label: string): void {
  const normalized = normalize(path);
  if (isAbsolute(path) || normalized === '..' || normalized.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`)) {
    throw new Error(`${label} must be a repository-relative path: ${path}`);
  }
}

export function repositoryPath(path: string): string {
  assertRepositoryRelative(path, 'Path');
  return resolve(process.cwd(), path);
}

const ignoredMediaRoots = ['.media-work/', 'work/', 'media-source/masters/', 'media-source/prepared/'];
const ignoredGeneratedRoots = ['.media-work/', 'work/', 'media-source/prepared/', 'public/mock-media/v1/'];

function hasRoot(path: string, roots: readonly string[]): boolean {
  const normalized = normalize(path).replaceAll('\\', '/').replace(/^\.\//, '');
  return roots.some((root) => normalized.startsWith(root));
}

function assertGitIgnored(path: string, label: string): void {
  try {
    execFileSync('git', ['check-ignore', '--quiet', '--no-index', path], { stdio: 'ignore' });
  } catch {
    throw new Error(`${label} must be covered by the repository ignore policy: ${path}`);
  }
}

export function assertSafeMediaSource(path: string, allowTrackedMock = false): void {
  assertRepositoryRelative(path, 'Media source');
  const normalized = normalize(path).replaceAll('\\', '/').replace(/^\.\//, '');
  if (allowTrackedMock && normalized.startsWith('public/mock-media/') && !normalized.startsWith('public/mock-media/v1/')) return;
  if (!hasRoot(normalized, ignoredMediaRoots)) {
    throw new Error(`Production media source must be inside an ignored intake/work root: ${path}`);
  }
  assertGitIgnored(normalized, 'Production media source');
}

export function assertSafeGeneratedPath(path: string): void {
  assertRepositoryRelative(path, 'Generated media path');
  const normalized = normalize(path).replaceAll('\\', '/').replace(/^\.\//, '');
  if (!hasRoot(normalized, ignoredGeneratedRoots)) {
    throw new Error(`Generated media must stay inside an ignored preparation/preview root: ${path}`);
  }
  assertGitIgnored(normalized, 'Generated media path');
}

export async function readCatalog(path: string): Promise<MediaCatalog> {
  assertRepositoryRelative(path, 'Catalog');
  const raw = JSON.parse(await readFile(repositoryPath(path), 'utf8')) as unknown;
  return mediaCatalogSchema.parse(raw);
}

export function sha256(bytes: Uint8Array | string): string {
  return createHash('sha256').update(bytes).digest('hex');
}

export function semanticLeaf(id: string): string {
  return id.split('.').at(-1)?.replace(/[^a-z0-9-]/g, '-') ?? id;
}

export function assertSemanticSource(source: string): void {
  const filename = source.split('/').at(-1) ?? source;
  if (/(?:^|[-_.])(img|dsc)[-_.]?\d+/i.test(filename)) {
    throw new Error(`Camera filename is not permitted in media intake: ${filename}`);
  }
}

export function objectPrefix(asset: MediaIntake): string {
  return `v1/${asset.scope}/${asset.project}/${asset.role}`;
}

export function mimeForExtension(extension: string): UploadObject['contentType'] {
  if (extension === 'avif') return 'image/avif';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'jpg') return 'image/jpeg';
  if (extension === 'mp4') return 'video/mp4';
  throw new Error(`Unsupported media extension: ${extension}`);
}
