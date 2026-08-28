import type { MotionProject } from '../types';

export const motionProjects = [
  {
    kind: 'motion',
    slug: 'project-01',
    title: { zhHant: '動態專案 01', en: 'MOTION 01', order: 'zh-en' },
    location: { zhHant: '香港', en: 'HONG KONG', order: 'en-zh' },
    year: '2026',
    summary: { zhHant: '內容待定。', en: 'CONTENT PENDING.', order: 'zh-en' },
    posterId: 'motion.project-01.poster',
    previewId: 'motion.project-01.preview',
    playback: { provider: 'unconfigured' },
    seo: {
      title: 'Motion 01 — Film',
      description: 'Neutral motion project placeholder.',
      socialImageId: 'site.social-default',
    },
    blocks: [
      { id: 'opening', type: 'hero', mediaId: 'motion.project-01.poster', height: 'viewport' },
    ],
  },
] satisfies readonly MotionProject[];

export function getMotionProject(slug: string): MotionProject | undefined {
  return motionProjects.find((project) => project.slug === slug);
}
