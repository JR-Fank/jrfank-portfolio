import type { MetadataRoute } from 'next';

import { motionProjects, stillProjects } from '@/content';
import { siteIndexable, siteUrl } from '@/lib/metadata';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteIndexable) {
    return [];
  }
  const paths = [
    '/',
    '/stills/',
    ...stillProjects.map((project) => `/stills/${project.slug}/`),
    '/motion/',
    ...motionProjects.map((project) => `/motion/${project.slug}/`),
    '/about/',
  ];
  return paths.map((path) => ({ url: new URL(path, siteUrl).toString() }));
}
