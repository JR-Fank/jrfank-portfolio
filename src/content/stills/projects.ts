import type { StillProject } from '../types';

export const stillProjects = [
  {
    kind: 'stills',
    slug: 'project-01',
    title: { zhHant: '專案 01', en: 'PROJECT 01', order: 'zh-en' },
    location: { zhHant: '香港', en: 'HONG KONG', order: 'en-zh' },
    year: '2026',
    summary: { zhHant: '內容待定。', en: 'CONTENT PENDING.', order: 'zh-en' },
    coverId: 'stills.project-01.cover',
    palette: ['#14242d', '#6d8892', '#d4b78e'],
    seo: {
      title: 'Project 01 — Stills',
      description: 'Neutral stills project placeholder.',
      socialImageId: 'site.social-default',
    },
    blocks: [
      { id: 'opening', type: 'hero', mediaId: 'stills.project-01.cover', height: 'viewport' },
    ],
  },
] satisfies readonly StillProject[];

export function getStillProject(slug: string): StillProject | undefined {
  return stillProjects.find((project) => project.slug === slug);
}
