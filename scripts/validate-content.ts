import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { motionProjects, siteConfig, stillProjects } from '../src/content';
import type { BilingualText, ProjectBlock } from '../src/content/types';
import { getMedia, listMediaIds } from '../src/lib/media';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const motionLayouts = new Set(['title-above', 'title-below', 'title-split']);
const motionAccents = new Set(['warm-amber', 'water-blue', 'forest-green', 'rain-violet', 'mineral-silver']);
const mockMediaRoot = join(process.cwd(), 'public', 'mock-media');

function assertBilingual(label: string, text: BilingualText): void {
  if (!text.en.trim() || !text.zhHant?.trim()) {
    throw new Error(`${label} requires both English and Traditional Chinese text.`);
  }
}

function assertMockVariantFiles(mediaId: string): void {
  const asset = getMedia(mediaId);
  for (const variant of asset.variants) {
    if (!existsSync(join(mockMediaRoot, variant.key))) {
      throw new Error(`Referenced mock-media variant does not exist: ${mediaId} -> ${variant.key}`);
    }
  }
}

function assertMotionImage(mediaId: string, context: string): void {
  const asset = getMedia(mediaId);
  if (asset.kind !== 'image') {
    throw new Error(`${context} must resolve to an image: ${mediaId}`);
  }
  if (asset.width <= 0 || asset.height <= 0 || asset.aspectRatio <= 0) {
    throw new Error(`${context} requires valid intrinsic dimensions: ${mediaId}`);
  }
  const alt = asset.alt.trim();
  if (alt.length < 8 || /^(image|photo|placeholder)$/i.test(alt)) {
    throw new Error(`${context} requires meaningful alt text: ${mediaId}`);
  }
  const imageVariants = asset.variants.filter((variant) => variant.format !== 'mp4');
  const widths = new Set(imageVariants.map((variant) => variant.width));
  if (widths.size < 2) {
    throw new Error(`${context} requires responsive image widths: ${mediaId}`);
  }
  const formats = new Set(imageVariants.map((variant) => variant.format));
  if (!formats.has('avif') || !formats.has('webp') || !formats.has('jpg')) {
    throw new Error(`${context} requires AVIF, WebP, and JPEG variants: ${mediaId}`);
  }
  assertMockVariantFiles(mediaId);
}

function assertActualVideo(mediaId: string, context: string): void {
  const asset = getMedia(mediaId);
  if (asset.kind !== 'video') {
    throw new Error(`${context} must resolve to a video: ${mediaId}`);
  }
  if (asset.duration <= 0) {
    throw new Error(`${context} requires a positive manifest duration: ${mediaId}`);
  }
  const renditions = asset.variants.filter((variant) => variant.format === 'mp4');
  if (renditions.length === 0) {
    throw new Error(`${context} requires an actual MP4 rendition: ${mediaId}`);
  }
  assertMockVariantFiles(mediaId);
}

function mediaIdsFromBlock(block: ProjectBlock): readonly string[] {
  switch (block.type) {
    case 'imagePair':
    case 'imageTriptych':
    case 'imageSequence':
      return block.mediaIds;
    case 'caption':
    case 'text':
    case 'spacer':
      return [];
    default:
      return [block.mediaId];
  }
}

const routeKeys = new Set<string>();

for (const project of stillProjects) {
  if (!slugPattern.test(project.slug)) {
    throw new Error(`Invalid project slug: ${project.slug}`);
  }
  const routeKey = `${project.kind}/${project.slug}`;
  if (routeKeys.has(routeKey)) {
    throw new Error(`Duplicate project route: ${routeKey}`);
  }
  routeKeys.add(routeKey);

  getMedia(project.seo.socialImageId);
  const exploreMore = project.exploreMore ?? [];
  if (new Set(exploreMore).size !== exploreMore.length || exploreMore.some((slug) => slug === project.slug || !stillProjects.some((candidate) => candidate.slug === slug))) {
    throw new Error(`Invalid Explore More references in ${project.slug}.`);
  }

  const stillMediaIds = new Set<string>([project.coverId, ...project.index.mediaIds]);
  const blockIds = new Set<string>();
  let heroCount = 0;
  let activeRailCount = 0;
  for (const block of project.blocks) {
    if (blockIds.has(block.id)) {
      throw new Error(`Duplicate block ID in ${project.slug}: ${block.id}`);
    }
    blockIds.add(block.id);
    if (block.type === 'hero') {
      heroCount += 1;
    }
    if (block.type === 'imageSequence' && block.activeRail) {
      const sequenceId = block.id;
      if (block.presentation !== 'vertical') throw new Error(`Active rails require a vertical sequence: ${project.slug}/${sequenceId}`);
      activeRailCount += 1;
    }
    mediaIdsFromBlock(block).forEach((mediaId) => stillMediaIds.add(mediaId));
  }
  if (heroCount !== 1 || project.blocks[0]?.type !== 'hero') {
    throw new Error(`Stills project ${project.slug} requires exactly one first-position hero.`);
  }
  if (activeRailCount > 1) {
    throw new Error(`Stills project ${project.slug} has more than one active gallery rail.`);
  }
  for (const mediaId of stillMediaIds) {
    const asset = getMedia(mediaId);
    if (asset.kind !== 'image') {
      throw new Error(`Stills media must be an image: ${mediaId}`);
    }
    const formats = new Set(asset.variants.map((variant) => variant.format));
    if (!formats.has('avif') || !formats.has('webp') || !formats.has('jpg')) {
      throw new Error(`Stills image requires AVIF, WebP, and JPEG variants: ${mediaId}`);
    }
  }
}

const motionSlugs = new Set<string>();
const motionNumbers = new Set<string>();
const temporaryMotionNotes: string[] = [];

for (const project of motionProjects) {
  if (!slugPattern.test(project.slug)) {
    throw new Error(`Invalid Motion slug: ${project.slug}`);
  }
  if (motionSlugs.has(project.slug)) {
    throw new Error(`Duplicate Motion slug: ${project.slug}`);
  }
  motionSlugs.add(project.slug);

  const routeKey = `${project.kind}/${project.slug}`;
  if (routeKeys.has(routeKey)) {
    throw new Error(`Duplicate project route: ${routeKey}`);
  }
  routeKeys.add(routeKey);

  assertBilingual(`${project.slug} title`, project.identity.title);
  assertBilingual(`${project.slug} location`, project.identity.location);
  assertBilingual(`${project.slug} date`, project.identity.date);
  assertBilingual(`${project.slug} index description`, project.index.description);
  assertBilingual(`${project.slug} synopsis`, project.caseStudy.synopsis);
  assertBilingual(`${project.slug} BTS heading`, project.caseStudy.behindTheScenes.heading);
  if (!/^\d{4}$/.test(project.identity.year)) {
    throw new Error(`Motion year must be four digits: ${project.slug}`);
  }

  if (motionNumbers.has(project.index.number)) {
    throw new Error(`Duplicate Motion index number: ${project.index.number}`);
  }
  motionNumbers.add(project.index.number);
  if (!motionLayouts.has(project.index.layout)) {
    throw new Error(`Invalid Motion index layout: ${project.slug}/${project.index.layout}`);
  }
  if (project.index.accent && !motionAccents.has(project.index.accent)) {
    throw new Error(`Invalid Motion accent: ${project.slug}/${project.index.accent}`);
  }
  if (project.index.satelliteMediaIds.length !== 3) {
    throw new Error(`Motion index requires exactly three satellites: ${project.slug}`);
  }
  if (new Set(project.index.satelliteMediaIds).size !== 3 || project.index.satelliteMediaIds.includes(project.index.posterId)) {
    throw new Error(`Motion index satellites must be unique and distinct from the poster: ${project.slug}`);
  }
  assertMotionImage(project.index.posterId, `${project.slug} index poster`);
  project.index.satelliteMediaIds.forEach((mediaId) => assertMotionImage(mediaId, `${project.slug} index satellite`));

  const playback = project.caseStudy.hero;
  assertMotionImage(playback.posterId, `${project.slug} case hero poster`);
  if (playback.previewId && playback.fullFilmId && playback.previewId === playback.fullFilmId && !playback.allowSharedPreviewAndFull) {
    throw new Error(`Motion preview and full film must use distinct IDs: ${project.slug}`);
  }

  if (playback.assetPolicy === 'production-ready') {
    if (!Number.isFinite(playback.durationSeconds) || playback.durationSeconds <= 0) {
      throw new Error(`Production-ready Motion requires a positive duration: ${project.slug}`);
    }
    assertActualVideo(playback.previewId, `${project.slug} production preview`);
    assertActualVideo(playback.fullFilmId, `${project.slug} production full film`);
  } else {
    assertBilingual(`${project.slug} temporary replacement note`, playback.replacementNote);
    if (playback.durationSeconds !== undefined && (!Number.isFinite(playback.durationSeconds) || playback.durationSeconds <= 0)) {
      throw new Error(`Temporary Motion duration must be positive when provided: ${project.slug}`);
    }
    if (playback.previewId) assertActualVideo(playback.previewId, `${project.slug} temporary preview`);
    if (playback.fullFilmId) assertActualVideo(playback.fullFilmId, `${project.slug} temporary full film`);
    const missing = [!playback.previewId ? 'preview' : undefined, !playback.fullFilmId ? 'full film' : undefined].filter(Boolean).join(' and ');
    temporaryMotionNotes.push(`${project.slug}: ${missing ? `missing ${missing}; ` : ''}${playback.replacementNote.en}`);
  }

  if (project.caseStudy.filmstripRows.length !== 2) {
    throw new Error(`Motion case requires exactly two filmstrip rows: ${project.slug}`);
  }
  if (new Set(project.caseStudy.filmstripRows.map((row) => row.id)).size !== 2) {
    throw new Error(`Motion filmstrip row IDs must be unique: ${project.slug}`);
  }
  if (new Set(project.caseStudy.filmstripRows.map((row) => row.direction)).size !== 2) {
    throw new Error(`Motion filmstrip rows must travel in opposing directions: ${project.slug}`);
  }
  for (const row of project.caseStudy.filmstripRows) {
    if (!slugPattern.test(row.id) || row.mediaIds.length < 3) {
      throw new Error(`Invalid Motion filmstrip row: ${project.slug}/${row.id}`);
    }
    row.mediaIds.forEach((mediaId) => assertMotionImage(mediaId, `${project.slug} filmstrip ${row.id}`));
  }

  if (project.caseStudy.behindTheScenes.mediaIds.length !== 8) {
    throw new Error(`Audited Motion BTS requires exactly eight images: ${project.slug}`);
  }
  project.caseStudy.behindTheScenes.mediaIds.forEach((mediaId) => assertMotionImage(mediaId, `${project.slug} BTS`));

  if (project.caseStudy.credits.length === 0) {
    throw new Error(`Motion credits cannot be empty: ${project.slug}`);
  }
  for (const credit of project.caseStudy.credits) {
    assertBilingual(`${project.slug} credit role`, credit.role);
    if (!credit.name.trim()) {
      throw new Error(`Motion credit names cannot be empty: ${project.slug}`);
    }
    if (credit.url) {
      const url = new URL(credit.url);
      if (url.protocol !== 'https:') throw new Error(`Motion credit URLs must use HTTPS: ${project.slug}`);
    }
  }

  const exploreMore = project.caseStudy.exploreMore;
  if (new Set(exploreMore).size !== exploreMore.length || exploreMore.some((slug) => slug === project.slug || !motionProjects.some((candidate) => candidate.slug === slug))) {
    throw new Error(`Invalid Motion Explore More references in ${project.slug}.`);
  }

  const socialAsset = getMedia(project.seo.socialImageId);
  if (socialAsset.kind !== 'image') {
    throw new Error(`Motion social image must resolve to an image: ${project.slug}`);
  }
}

const staticMotionRoutes = motionProjects.map((project) => `/motion/${project.slug}/`);
if (staticMotionRoutes.length !== motionProjects.length || new Set(staticMotionRoutes).size !== motionProjects.length) {
  throw new Error('Motion routes cannot be statically enumerated without duplicates.');
}

for (const item of siteConfig.navigation) {
  if (!item.label.en.trim() || !item.href.trim()) {
    throw new Error('Navigation items require a label and href.');
  }
}

const ids = listMediaIds();
if (new Set(ids).size !== ids.length) {
  throw new Error('Media manifest contains duplicate IDs.');
}

for (const note of temporaryMotionNotes) {
  console.log(`[temporary-development] ${note}`);
}
console.log(`Validated ${stillProjects.length} Stills projects, ${motionProjects.length} Motion projects, ${staticMotionRoutes.length} static Motion routes, and ${ids.length} media assets.`);
