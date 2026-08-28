import type { Metadata } from 'next';

import { PlaceholderPage } from '@/components/sections/placeholder-page';
import { motionProjects, siteConfig } from '@/content';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Motion',
  description: 'Motion index foundation.',
  path: '/motion/',
});

export default function MotionPage() {
  const project = motionProjects[0];
  if (!project) {
    return null;
  }
  return (
    <PlaceholderPage
      site={siteConfig}
      eyebrow="MOTION INDEX"
      title="MOTION 01"
      titleZh="動態影像"
      location={project.location.en}
      locationZh={project.location.zhHant ?? ''}
      mediaId={project.posterId}
      cta={{ label: 'PROJECT 01', href: `/motion/${project.slug}/` }}
    />
  );
}
