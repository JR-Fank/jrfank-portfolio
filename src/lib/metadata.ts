import type { Metadata } from 'next';

import { getSocialImage } from './media';

export const siteIndexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE === 'true';
export const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';

export function createPageMetadata({
  title,
  description,
  path,
  socialImageId = 'site.social-default',
}: {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly socialImageId?: string;
}): Metadata {
  const canonical = new URL(path, siteUrl).toString();
  const socialImage = getSocialImage(socialImageId);
  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: siteIndexable, follow: siteIndexable },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonical,
      images: [{ url: socialImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage],
    },
  };
}
