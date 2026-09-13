import type { Metadata } from 'next';

import { MotionIndexExperience } from '@/components/motion/motion-index-experience';
import { motionProjects, siteConfig } from '@/content';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Motion',
  description: 'A bilingual index of motion studies and project films.',
  path: '/motion/',
});

export default function MotionPage() {
  const indexProjects = motionProjects.map(({ slug, identity, index }) => ({ slug, identity, index }));
  return <MotionIndexExperience projects={indexProjects} site={siteConfig} />;
}
