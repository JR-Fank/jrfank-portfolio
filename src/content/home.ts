import type { MediaId } from './types';

export type HomeIntroSegment =
  | { readonly type: 'text'; readonly value: string }
  | { readonly type: 'media'; readonly mediaId: MediaId; readonly shape: 'portrait' | 'landscape' };

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
    readonly titleZh: string;
    readonly mediaId: MediaId;
  };
  readonly intro: {
    readonly accessibleHeading: string;
    readonly segments: readonly HomeIntroSegment[];
    readonly headingZh: string;
    readonly body: string;
    readonly bodyZh: string;
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
    title: ['JRFANK', 'PHOTOGRAPHY', '& FILMS'],
    titleZh: '攝影與影像',
    mediaId: 'site.home-hero',
  },
  intro: {
    accessibleHeading: 'Between harbour light and distant weather, the work began.',
    segments: [
      { type: 'text', value: 'BETWEEN' },
      { type: 'media', mediaId: 'stills.project-01.cover', shape: 'portrait' },
      { type: 'text', value: 'HARBOUR LIGHT AND' },
      { type: 'media', mediaId: 'about.portrait', shape: 'portrait' },
      { type: 'text', value: 'DISTANT WEATHER, THE WORK BEGAN.' },
      { type: 'media', mediaId: 'site.light-detail', shape: 'landscape' },
    ],
    headingZh: '在海港的光與遙遠天氣之間，影像開始。',
    body: 'JRFANK is an independent photography and film practice working between Hong Kong and Tokyo, following landscape, movement, and quiet human traces.',
    bodyZh: '以香港與東京為座標，記錄風景、移動與安靜的人之痕跡。',
    cta: 'ABOUT THE STUDIO',
    href: '/about/',
  },
  featuredStills: [
    {
      id: 'H03',
      date: 'MARCH 2026',
      location: { en: 'HONG KONG', zhHant: '香港' },
      title: ['HARBOUR', 'STUDIES'],
      titleZh: '港灣習作',
      href: '/stills/project-01/',
      cta: 'SEE CASE STUDY',
      mediaIds: ['stills.project-01.cover', 'site.light-detail'],
      palette: ['#14242d', '#315a68', '#7f9da4', '#d7d9d2', '#d3b17e'],
      direction: 'standard',
    },
    {
      id: 'H04',
      date: 'JULY 2026',
      location: { en: 'TOKYO', zhHant: '東京' },
      title: ['QUIET', 'CURRENT'],
      titleZh: '靜流',
      href: '/stills/project-01/',
      cta: 'SEE CASE STUDY',
      mediaIds: ['about.portrait', 'site.home-hero'],
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
    mainMediaId: 'motion.project-01.poster',
    satelliteMediaIds: ['site.home-hero', 'about.portrait', 'site.light-detail'],
  },
} satisfies HomeContent;
