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
