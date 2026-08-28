import type { Metadata } from 'next';

import { PlaceholderPage } from '@/components/sections/placeholder-page';
import { siteConfig } from '@/content';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'About',
  description: 'About page foundation.',
  path: '/about/',
});

export default function AboutPage() {
  return (
    <PlaceholderPage
      site={siteConfig}
      eyebrow="ABOUT"
      title="ABOUT"
      titleZh="關於"
      location="HONG KONG"
      locationZh="香港"
      mediaId="about.portrait"
      portrait
    />
  );
}
