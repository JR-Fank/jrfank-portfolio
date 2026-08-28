import type { Metadata } from 'next';

import { PlaceholderPage } from '@/components/sections/placeholder-page';
import { siteConfig, stillProjects } from '@/content';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Stills',
  description: 'Stills index foundation.',
  path: '/stills/',
});

export default function StillsPage() {
  const project = stillProjects[0];
  if (!project) {
    return null;
  }
  return (
    <PlaceholderPage
      site={siteConfig}
      eyebrow="STILLS INDEX"
      title="STILLS 01"
      titleZh="攝影"
      location={project.location.en}
      locationZh={project.location.zhHant ?? ''}
      mediaId={project.coverId}
      portrait
      cta={{ label: 'PROJECT 01', href: `/stills/${project.slug}/` }}
    />
  );
}
