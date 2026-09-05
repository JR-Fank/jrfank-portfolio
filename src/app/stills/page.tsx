import type { Metadata } from 'next';

import { StillsIndexExperience } from '@/components/stills/stills-index-experience';
import { siteConfig, stillProjects } from '@/content';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Stills',
  description: 'A bilingual selection of project-owned editorial photography studies.',
  path: '/stills/',
});

export default function StillsPage() {
  return <StillsIndexExperience projects={stillProjects} site={siteConfig} />;
}
