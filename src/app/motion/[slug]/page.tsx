import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PlaceholderPage } from '@/components/sections/placeholder-page';
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
  return (
    <PlaceholderPage
      site={siteConfig}
      eyebrow="MOTION PROJECT"
      title={project.title.en}
      titleZh={project.title.zhHant ?? ''}
      location={project.location.en}
      locationZh={project.location.zhHant ?? ''}
      mediaId={project.posterId}
      cta={{ label: 'BACK TO MOTION', href: '/motion/' }}
    />
  );
}
