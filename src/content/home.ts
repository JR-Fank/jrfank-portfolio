import type { MediaId } from './types';

export type HomeIntroSegment =
  | { readonly type: 'text'; readonly value: string }
  | { readonly type: 'media'; readonly mediaId: MediaId; readonly shape: 'portrait' | 'landscape' };

export type HomeIntroLine = readonly HomeIntroSegment[];

export interface HomeFeaturedStill {
  readonly id: 'H03' | 'H04';
  readonly date: string;
  readonly location: { readonly en: string; readonly zhHant: string };
  readonly title: readonly [string, string];
  readonly titleZh: string;
  readonly href: string;
  readonly cta: string;
  readonly mediaIds: readonly [MediaId, MediaId];
  readonly palette: readonly [string, string, string, string, string];
  readonly direction: 'standard' | 'reverse';
}

export interface HomeContent {
  readonly hero: {
    readonly title: readonly [string, string, string];
    readonly titleMobile: readonly [string, string, string];
    readonly titleZh: string;
    readonly videoMediaId: MediaId;
  };
  readonly intro: {
    readonly accessibleHeading: string;
    readonly lines: readonly [HomeIntroLine, HomeIntroLine, HomeIntroLine];
    readonly headingZh: string;
    readonly body: string;
    readonly cta: string;
    readonly href: string;
  };
  readonly featuredStills: readonly [HomeFeaturedStill, HomeFeaturedStill];
  readonly featuredMotion: {
    readonly id: 'H05';
    readonly date: string;
    readonly location: { readonly en: string; readonly zhHant: string };
    readonly title: string;
    readonly titleZh: string;
    readonly href: string;
    readonly cta: string;
    readonly mainMediaId: MediaId;
    readonly satelliteMediaIds: readonly [MediaId, MediaId, MediaId];
  };
}

export const homeContent = {
  hero: {
    title: ['JR FANK', 'PHOTOGRAPHER &', 'FILMMAKER'],
    titleMobile: ['JR FANK', 'PHOTOGRAPHER', '& FILMMAKER'],
    titleZh: '攝影師 · 影像創作者',
    videoMediaId: 'home.r1.hero-video',
  },
  intro: {
    accessibleHeading: 'A quiet harbour morning where the work began.',
    lines: [
      [
        { type: 'text', value: 'A' },
        { type: 'media', mediaId: 'home.r1.ice-boat', shape: 'portrait' },
        { type: 'text', value: 'quiet harbour' },
      ],
      [
        { type: 'text', value: 'morning' },
        { type: 'media', mediaId: 'home.r1.warm-tree', shape: 'portrait' },
        { type: 'text', value: 'where the' },
      ],
      [
        { type: 'text', value: 'work began…' },
        { type: 'media', mediaId: 'home.r1.rain-film', shape: 'landscape' },
      ],
    ],
    headingZh: '從一個安靜的海港清晨，影像工作由此開始。',
    body: 'JRFANK is an independent photography and film practice working between Hong Kong and Tokyo, following landscape, movement, and quiet human traces.',
    cta: 'READ MY STORY',
    href: '/about/',
  },
  featuredStills: [
    {
      id: 'H03',
      date: 'MARCH 2026',
      location: { en: 'HONG KONG', zhHant: '香港' },
      title: ['HARBOUR', 'STUDIES'],
      titleZh: '港灣習作',
      href: '/stills/quiet-current/',
      cta: 'SEE CASE STUDY',
      mediaIds: ['home.r1.ice-boat', 'site.light-detail'],
      palette: ['#14242d', '#315a68', '#7f9da4', '#d7d9d2', '#d3b17e'],
      direction: 'standard',
    },
    {
      id: 'H04',
      date: 'JULY 2026',
      location: { en: 'TOKYO', zhHant: '東京' },
      title: ['QUIET', 'CURRENT'],
      titleZh: '靜流',
      href: '/stills/stone-light/',
      cta: 'SEE CASE STUDY',
      mediaIds: ['home.r1.warm-tree', 'home.r1.waterfall'],
      palette: ['#332b35', '#6e6978', '#a99fae', '#d8b88b', '#c9d3d8'],
      direction: 'reverse',
    },
  ],
  featuredMotion: {
    id: 'H05',
    date: 'OCTOBER 2026',
    location: { en: 'HONG KONG', zhHant: '香港' },
    title: 'AFTER RAIN',
    titleZh: '雨後',
    href: '/motion/project-01/',
    cta: 'SEE CASE STUDY',
    mainMediaId: 'home.r1.rain-film',
    satelliteMediaIds: ['home.r1.hero', 'home.r1.ice-boat', 'home.r1.waterfall'],
  },
} satisfies HomeContent;
