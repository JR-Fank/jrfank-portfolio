import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { StillsCaseExperience } from '@/components/stills/stills-case-experience';
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
  const requested = project.exploreMore ?? [];
  const exploreProjects = requested
    .map((relatedSlug) => getStillProject(relatedSlug))
    .filter((related): related is NonNullable<typeof related> => Boolean(related && related.slug !== project.slug));
  return <StillsCaseExperience project={project} exploreProjects={exploreProjects} site={siteConfig} />;
}
