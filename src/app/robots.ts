import type { MetadataRoute } from 'next';

import { siteIndexable, siteUrl } from '@/lib/metadata';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: siteIndexable ? { userAgent: '*', allow: '/' } : { userAgent: '*', disallow: '/' },
    sitemap: siteIndexable ? new URL('/sitemap.xml', siteUrl).toString() : undefined,
  };
}
