import type { Metadata } from 'next';

import { PlaceholderPage } from '@/components/sections/placeholder-page';
import { siteConfig } from '@/content';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Home',
  description: 'Bilingual photography and film portfolio foundation.',
  path: '/',
});

export default function HomePage() {
  return (
    <PlaceholderPage
      site={siteConfig}
      eyebrow="FOUNDATION 01"
      title="PHOTOGRAPHY & FILM"
      titleZh="作品集"
      location="HONG KONG"
      locationZh="香港"
      mediaId="site.home-hero"
      cta={{ label: 'VIEW STILLS', href: '/stills/' }}
    />
  );
}
