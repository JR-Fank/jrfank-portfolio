import type { MediaId } from './types';

export interface AboutInfoRow {
  readonly primary: string;
  readonly secondary?: string;
  readonly meta?: string;
  readonly href?: string;
}

export interface AboutInfoGroup {
  readonly id: 'A05' | 'A06' | 'A07' | 'A08';
  readonly title: string;
  readonly titleZh: string;
  readonly enabled: boolean;
  readonly rows: readonly AboutInfoRow[];
}

export interface AboutContent {
  readonly hero: {
    readonly line1: string;
    readonly line2: string;
    readonly portraitId: MediaId;
  };
  readonly intro: {
    readonly primary: string;
    readonly secondary: string;
    readonly stripMediaIds: readonly MediaId[];
  };
  readonly statement: {
    readonly title: readonly [string, string];
    readonly titleZh: string;
    readonly body: string;
    readonly bodyZh: string;
  };
  readonly story: {
    readonly mediaId: MediaId;
    readonly paragraphs: readonly string[];
    readonly companionZh: string;
  };
  readonly information: readonly AboutInfoGroup[];
}

export const aboutContent = {
  hero: {
    line1: 'JR',
    line2: 'FANK',
    portraitId: 'about.portrait',
  },
  intro: {
    primary: 'A working image practice shaped by observation, movement, and the details that remain after a place has changed.',
    secondary: '以觀察、移動與地方變化後留下的細節，構成持續發展中的影像實踐。',
    stripMediaIds: [
      'home.r1.ice-boat',
      'home.r1.hero',
      'home.r1.warm-tree',
      'home.r1.rain-film',
      'site.light-detail',
      'home.r1.waterfall',
    ],
  },
  statement: {
    title: ['WHAT I', 'CHOOSE TO KEEP.'],
    titleZh: '留下那些差點被時間帶走的畫面。',
    body: 'The work begins with attention: to weather, distance, gesture, and the changing rhythm of a place. This temporary editorial copy defines layout only and remains ready for the final project story.',
    bodyZh: '暫用文字僅用於版面與雙語節奏測試，待正式故事內容確認後替換。',
  },
  story: {
    mediaId: 'home.r1.ice-boat',
    paragraphs: [
      'This page is a replaceable editorial framework for a future first-person story. It does not claim a biography, achievement, client relationship, or personal history that has not been supplied.',
      'The final narrative can hold the photographer’s relationship with still and moving image, travel, process, and visual philosophy without changing this section architecture.',
    ],
    companionZh: '此處為可替換的長篇故事框架，不代表尚未提供或核准的個人經歷。',
  },
  information: [
    {
      id: 'A05',
      title: 'TOOLS / CAMERAS',
      titleZh: '工具與器材',
      enabled: true,
      rows: [
        { primary: 'STILL IMAGE SYSTEM', secondary: 'DETAILS PENDING APPROVAL', meta: '01' },
        { primary: 'MOVING IMAGE SYSTEM', secondary: 'DETAILS PENDING APPROVAL', meta: '02' },
        { primary: 'FIELD RECORDING', secondary: 'DETAILS PENDING APPROVAL', meta: '03' },
      ],
    },
    {
      id: 'A06',
      title: 'SELECTED SERIES',
      titleZh: '系列選集',
      enabled: true,
      rows: [
        { primary: 'HARBOUR STUDIES', secondary: 'PROJECT-OWNED DEVELOPMENT SERIES', meta: '2026' },
        { primary: 'QUIET CURRENT', secondary: 'PROJECT-OWNED DEVELOPMENT SERIES', meta: '2026' },
        { primary: 'AFTER RAIN', secondary: 'PROJECT-OWNED DEVELOPMENT SERIES', meta: '2026' },
      ],
    },
    {
      id: 'A07',
      title: 'NOTES / FEATURES',
      titleZh: '筆記與專題',
      enabled: true,
      rows: [
        { primary: 'EDITORIAL NOTES', secondary: 'CONTENT TO BE APPROVED', meta: '—' },
        { primary: 'PROCESS JOURNAL', secondary: 'CONTENT TO BE APPROVED', meta: '—' },
      ],
    },
    {
      id: 'A08',
      title: 'ELSEWHERE',
      titleZh: '其他平台',
      enabled: true,
      rows: [
        { primary: 'INSTAGRAM', secondary: 'HANDLE PENDING APPROVAL', meta: '—' },
        { primary: 'VIMEO', secondary: 'PROFILE PENDING APPROVAL', meta: '—' },
      ],
    },
  ],
} satisfies AboutContent;
