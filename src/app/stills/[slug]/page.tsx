import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PlaceholderPage } from '@/components/sections/placeholder-page';
import { getStillProject, siteConfig, stillProjects } from '@/content';
import { createPageMetadata } from '@/lib/metadata';

type Props = { readonly params: Promise<{ readonly slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return stillProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getStillProject(slug);
  if (!project) {
    return {};
  }
  return createPageMetadata({
    title: project.seo.title,
    description: project.seo.description,
    path: `/stills/${project.slug}/`,
    socialImageId: project.seo.socialImageId,
  });
}

export default async function StillProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getStillProject(slug);
  if (!project) {
    notFound();
  }
  return (
    <PlaceholderPage
      site={siteConfig}
      eyebrow="STILLS PROJECT"
      title={project.title.en}
      titleZh={project.title.zhHant ?? ''}
      location={project.location.en}
      locationZh={project.location.zhHant ?? ''}
      mediaId={project.coverId}
      portrait
      cta={{ label: 'BACK TO STILLS', href: '/stills/' }}
    />
  );
}
