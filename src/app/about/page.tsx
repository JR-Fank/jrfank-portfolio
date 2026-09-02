import type { Metadata } from 'next';

import { AboutExperience } from '@/components/about/about-experience';
import { aboutContent, siteConfig } from '@/content';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'About',
  description: 'A bilingual editorial introduction to the photography and film practice.',
  path: '/about/',
});

export default function AboutPage() {
  return <AboutExperience content={aboutContent} site={siteConfig} />;
}
