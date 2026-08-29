import type { Metadata } from 'next';

import { HomeExperience } from '@/components/home/home-experience';
import { homeContent, siteConfig } from '@/content';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Home',
  description: 'JRFANK is an independent bilingual photography and film practice working between Hong Kong and Tokyo.',
  path: '/',
});

export default function HomePage() {
  return <HomeExperience content={homeContent} site={siteConfig} />;
}
