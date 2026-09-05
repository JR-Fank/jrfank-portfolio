import { motionProjects, siteConfig, stillProjects } from '../src/content';
import type { ProjectBlock } from '../src/content/types';
import { getMedia, listMediaIds } from '../src/lib/media';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

const projects = [...stillProjects, ...motionProjects];
const routeKeys = new Set<string>();

for (const project of projects) {
  if (!slugPattern.test(project.slug)) {
    throw new Error(`Invalid project slug: ${project.slug}`);
  }

  const routeKey = `${project.kind}/${project.slug}`;
  if (routeKeys.has(routeKey)) {
    throw new Error(`Duplicate project route: ${routeKey}`);
  }
  routeKeys.add(routeKey);

  getMedia(project.seo.socialImageId);
  if (project.kind === 'stills') {
    if (new Set(project.exploreMore).size !== project.exploreMore.length || project.exploreMore.some((slug) => slug === project.slug || !stillProjects.some((candidate) => candidate.slug === slug))) {
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
        if (block.presentation !== 'vertical') throw new Error(`Active rails require a vertical sequence: ${project.slug}/${block.id}`);
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
  for (const block of project.blocks) {
    for (const mediaId of mediaIdsFromBlock(block)) {
      getMedia(mediaId);
    }
  }
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

console.log(`Validated ${projects.length} placeholder projects and ${ids.length} media assets.`);
