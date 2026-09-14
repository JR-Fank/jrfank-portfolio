import { aboutContent, homeContent, motionProjects, siteConfig, stillProjects } from '../../src/content/index';
import type { ProjectBlock } from '../../src/content/types';
import manifestJson from '../../src/generated/media-manifest.json';

interface ManifestVariant {
  readonly width: number;
  readonly format: string;
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
  readonly alt?: string;
  readonly dominantColor?: string;
  readonly focalPoint?: { readonly x: number; readonly y: number };
  readonly duration?: number;
  readonly posterId?: string;
  readonly role?: string;
  readonly audioPolicy?: string;
  readonly hasAudio?: boolean;
  readonly variants: readonly ManifestVariant[];
}

interface Manifest {
  readonly version: number;
  readonly generatedAt: string;
  readonly sourceFingerprint: string;
  readonly assets: Readonly<Record<string, ManifestAsset>>;
}

const manifest = manifestJson as Manifest;

export const MEDIA_ROLES = [
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
] as const;

export type MediaRole = typeof MEDIA_ROLES[number];

interface MediaUsage {
  readonly role: MediaRole;
  readonly location: string;
  readonly project?: string;
}

const usagesById = new Map<string, MediaUsage[]>();

function addUsage(id: string, usage: MediaUsage): void {
  const usages = usagesById.get(id) ?? [];
  if (!usages.some((candidate) => candidate.role === usage.role && candidate.location === usage.location)) usages.push(usage);
  usagesById.set(id, usages);
}

addUsage(homeContent.hero.videoMediaId, { role: 'hero', location: 'src/content/home.ts → hero.videoMediaId', project: 'home' });
for (const [lineIndex, line] of homeContent.intro.lines.entries()) {
  for (const segment of line) {
    if (segment.type === 'media') addUsage(segment.mediaId, { role: 'gallery', location: `src/content/home.ts → intro.lines[${lineIndex}].mediaId`, project: 'home' });
  }
}
for (const featured of homeContent.featuredStills) {
  for (const mediaId of featured.mediaIds) addUsage(mediaId, { role: 'cover', location: `src/content/home.ts → featuredStills.${featured.id}.mediaIds`, project: featured.href.split('/').filter(Boolean).at(-1) });
}
addUsage(homeContent.featuredMotion.mainMediaId, { role: 'poster', location: 'src/content/home.ts → featuredMotion.mainMediaId', project: homeContent.featuredMotion.href.split('/').filter(Boolean).at(-1) });
for (const mediaId of homeContent.featuredMotion.satelliteMediaIds) {
  addUsage(mediaId, { role: 'satellite', location: 'src/content/home.ts → featuredMotion.satelliteMediaIds', project: homeContent.featuredMotion.href.split('/').filter(Boolean).at(-1) });
}

for (const project of stillProjects) {
  addUsage(project.coverId, { role: 'cover', location: `src/content/stills/projects.ts → ${project.slug}.coverId`, project: project.slug });
  for (const mediaId of project.index.mediaIds) addUsage(mediaId, { role: 'cover', location: `src/content/stills/projects.ts → ${project.slug}.index.mediaIds`, project: project.slug });
  addUsage(project.seo.socialImageId, { role: 'social', location: `src/content/stills/projects.ts → ${project.slug}.seo.socialImageId`, project: project.slug });
  for (const rawBlock of project.blocks) {
    const block = rawBlock as ProjectBlock;
    const location = `src/content/stills/projects.ts → ${project.slug}.blocks.${block.id}`;
    if (block.type === 'hero') addUsage(block.mediaId, { role: 'hero', location, project: project.slug });
    else if (block.type === 'video') addUsage(block.mediaId, { role: block.mode === 'preview-loop' ? 'preview' : 'full-film', location, project: project.slug });
    else if ('mediaId' in block && typeof block.mediaId === 'string') addUsage(block.mediaId, { role: 'gallery', location, project: project.slug });
    else if ('mediaIds' in block && Array.isArray(block.mediaIds)) {
      for (const mediaId of block.mediaIds) {
        addUsage(mediaId, { role: 'gallery', location, project: project.slug });
        if (block.type === 'imageSequence' && block.activeRail) addUsage(mediaId, { role: 'rail', location: `${location}.activeRail`, project: project.slug });
      }
    }
  }
}

for (const project of motionProjects) {
  addUsage(project.index.posterId, { role: 'poster', location: `src/content/motion/projects.ts → ${project.slug}.index.posterId`, project: project.slug });
  for (const mediaId of project.index.satelliteMediaIds) addUsage(mediaId, { role: 'satellite', location: `src/content/motion/projects.ts → ${project.slug}.index.satelliteMediaIds`, project: project.slug });
  addUsage(project.caseStudy.hero.posterId, { role: 'poster', location: `src/content/motion/projects.ts → ${project.slug}.caseStudy.hero.posterId`, project: project.slug });
  if (project.caseStudy.hero.previewId) addUsage(project.caseStudy.hero.previewId, { role: 'preview', location: `src/content/motion/projects.ts → ${project.slug}.caseStudy.hero.previewId`, project: project.slug });
  if (project.caseStudy.hero.fullFilmId) addUsage(project.caseStudy.hero.fullFilmId, { role: 'full-film', location: `src/content/motion/projects.ts → ${project.slug}.caseStudy.hero.fullFilmId`, project: project.slug });
  for (const row of project.caseStudy.filmstripRows) {
    for (const mediaId of row.mediaIds) addUsage(mediaId, { role: 'filmstrip', location: `src/content/motion/projects.ts → ${project.slug}.filmstripRows.${row.id}`, project: project.slug });
  }
  for (const mediaId of project.caseStudy.behindTheScenes.mediaIds) addUsage(mediaId, { role: 'bts', location: `src/content/motion/projects.ts → ${project.slug}.behindTheScenes.mediaIds`, project: project.slug });
  addUsage(project.seo.socialImageId, { role: 'social', location: `src/content/motion/projects.ts → ${project.slug}.seo.socialImageId`, project: project.slug });
}

addUsage(aboutContent.hero.portraitId, { role: 'about', location: 'src/content/about.ts → hero.portraitId', project: 'about' });
for (const mediaId of aboutContent.intro.stripMediaIds) addUsage(mediaId, { role: 'about', location: 'src/content/about.ts → intro.stripMediaIds', project: 'about' });
addUsage(aboutContent.story.mediaId, { role: 'about', location: 'src/content/about.ts → story.mediaId', project: 'about' });

function inferredRole(asset: ManifestAsset): MediaRole | undefined {
  const leaf = asset.id.split('.').at(-1);
  return MEDIA_ROLES.find((role) => role === leaf)
    ?? (asset.kind === 'video' && asset.role && MEDIA_ROLES.includes(asset.role as MediaRole) ? asset.role as MediaRole : undefined);
}

export const CONTENT_SNAPSHOT = {
  version: 1,
  readOnly: true,
  source: {
    mode: 'repository-build-snapshot',
    contentRoot: 'src/content/',
    manifestPath: 'src/generated/media-manifest.json',
    manifestVersion: manifest.version,
    manifestGeneratedAt: manifest.generatedAt,
    sourceFingerprint: manifest.sourceFingerprint,
  },
  site: {
    name: siteConfig.name,
    navigation: siteConfig.navigation,
    contact: siteConfig.contact,
  },
  sections: {
    home: homeContent,
    stills: stillProjects.map((project) => ({
      slug: project.slug,
      title: project.title,
      location: project.location,
      year: project.year,
      summary: project.summary,
      coverId: project.coverId,
      index: project.index,
      blockCount: project.blocks.length,
      exploreMore: project.exploreMore ?? [],
    })),
    motion: motionProjects.map((project) => ({
      slug: project.slug,
      identity: project.identity,
      index: project.index,
      hero: project.caseStudy.hero,
      synopsis: project.caseStudy.synopsis,
      filmstripRowCount: project.caseStudy.filmstripRows.length,
      creditCount: project.caseStudy.credits.length,
      behindTheScenesCount: project.caseStudy.behindTheScenes.mediaIds.length,
      exploreMore: project.caseStudy.exploreMore,
    })),
    about: aboutContent,
  },
} as const;

function scopeForId(id: string): string {
  const scope = id.split('.')[0];
  return scope && ['home', 'stills', 'motion', 'about', 'site'].includes(scope) ? scope : 'other';
}

export const MEDIA_LIBRARY = Object.values(manifest.assets)
  .map((asset) => {
    const usages = usagesById.get(asset.id) ?? [];
    const inferred = inferredRole(asset);
    const roles = [...new Set([...usages.map((usage) => usage.role), ...(inferred ? [inferred] : [])])];
    const projects = [...new Set(usages.flatMap((usage) => usage.project ? [usage.project] : []))];
    return {
      id: asset.id,
      kind: asset.kind,
      scope: scopeForId(asset.id),
      roles,
      projects,
      usageLocations: usages.map((usage) => usage.location),
      recordStatus: 'repository snapshot',
      publishStatus: 'Not recorded',
      createdAt: 'Not recorded',
      updatedAt: 'Not recorded',
      bilingualMetadata: {
        en: asset.alt?.trim() || 'Not recorded',
        zhHant: 'Not recorded',
      },
      preview: {
        mode: 'metadata-fallback',
        reason: 'Isolated Admin assets do not copy portfolio mock or production media.',
        color: asset.dominantColor ?? null,
        posterId: asset.posterId ?? null,
      },
      width: asset.width,
      height: asset.height,
      aspectRatio: asset.aspectRatio,
      ...(asset.alt !== undefined ? { alt: asset.alt } : {}),
      ...(asset.dominantColor !== undefined ? { dominantColor: asset.dominantColor } : {}),
      ...(asset.focalPoint !== undefined ? { focalPoint: asset.focalPoint } : {}),
      ...(asset.duration !== undefined ? { duration: asset.duration } : {}),
      ...(asset.posterId !== undefined ? { posterId: asset.posterId } : {}),
      ...(asset.role !== undefined ? { manifestRole: asset.role } : {}),
      ...(asset.audioPolicy !== undefined ? { audioPolicy: asset.audioPolicy } : {}),
      ...(asset.hasAudio !== undefined ? { hasAudio: asset.hasAudio } : {}),
      variantCount: asset.variants.length,
      variantBytes: asset.variants.reduce((total, variant) => total + variant.bytes, 0),
      variants: asset.variants,
    };
  })
  .sort((first, second) => first.id.localeCompare(second.id));

export type MediaLibraryEntry = typeof MEDIA_LIBRARY[number];
