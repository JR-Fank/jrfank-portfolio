import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { MotionCaseExperience } from '@/components/motion/motion-case-experience';
import { getMotionProject, motionProjects, siteConfig } from '@/content';
import { createPageMetadata } from '@/lib/metadata';

type Props = { readonly params: Promise<{ readonly slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return motionProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getMotionProject(slug);
  if (!project) {
    return {};
  }
  return createPageMetadata({
    title: project.seo.title,
    description: project.seo.description,
    path: `/motion/${project.slug}/`,
    socialImageId: project.seo.socialImageId,
  });
}

export default async function MotionProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getMotionProject(slug);
  if (!project) {
    notFound();
  }
  return <MotionCaseExperience project={project} site={siteConfig} />;
}
