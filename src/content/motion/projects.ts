import type { MotionProject, MotionProjectInput } from '../types';

const btsSequence = [
  'stills.mock.reservoir',
  'stills.mock.tidal-flats',
  'stills.mock.rain-passage',
  'stills.mock.deep-water',
  'stills.mock.ice-drift',
  'stills.mock.warm-tree',
  'stills.mock.waterfall',
  'stills.mock.rain-window',
] as const;

function defineMotionProject(project: MotionProjectInput): MotionProject {
  return {
    ...project,
    title: project.identity.title,
    location: project.identity.location,
    year: project.identity.year,
    date: project.identity.date,
    summary: project.caseStudy.synopsis,
    posterId: project.caseStudy.hero.posterId,
  };
}

export const motionProjects: readonly MotionProject[] = [
  defineMotionProject({
    kind: 'motion',
    slug: 'after-rain',
    identity: {
      title: { zhHant: '雨後餘光', en: 'AFTER RAIN', order: 'en-zh' },
      location: { zhHant: '香港島', en: 'HONG KONG ISLAND', order: 'en-zh' },
      year: '2026',
      date: { zhHant: '2026年10月', en: 'OCTOBER 2026', order: 'en-zh' },
    },
    index: {
      number: '01',
      description: { zhHant: '玻璃上的雨痕，把港口夜色切成緩慢移動的光。', en: 'Rain on glass divides the harbour night into slowly moving light.', order: 'en-zh' },
      posterId: 'motion.project-01.poster',
      satelliteMediaIds: ['stills.mock.rain-passage', 'stills.mock.rain-window', 'stills.mock.deep-water'],
      layout: 'title-below',
      accent: 'warm-amber',
      featured: true,
    },
    caseStudy: {
      hero: {
        assetPolicy: 'temporary-development',
        posterId: 'motion.project-01.poster',
        audioPolicy: 'muted-preview-user-gesture-full-audio',
        replacementNote: { zhHant: '正式預覽與完整影片尚待專案自有素材取代。', en: 'The preview and full film await final project-owned footage.', order: 'en-zh' },
      },
      synopsis: {
        zhHant: '一段以雨、車窗與遠處海面為線索的臨時動態習作；目前只用自有示意影像驗證敘事節奏。',
        en: 'A temporary motion study following rain, vehicle windows, and distant water, using owned mock imagery only to test narrative rhythm.',
        order: 'en-zh',
      },
      filmstripRows: [
        { id: 'rain-near', direction: 'forward', mediaIds: ['stills.mock.rain-passage', 'stills.mock.rain-window', 'stills.mock.deep-water', 'stills.mock.reservoir'] },
        { id: 'rain-far', direction: 'reverse', mediaIds: ['stills.mock.salt-flat', 'stills.mock.warm-tree', 'stills.mock.ice-drift', 'stills.mock.waterfall'] },
      ],
      credits: [
        { role: { zhHant: '創作習作', en: 'CREATIVE STUDY', order: 'en-zh' }, name: 'JRFANK' },
        { role: { zhHant: '素材狀態', en: 'MEDIA STATUS', order: 'en-zh' }, name: 'TEMPORARY DEVELOPMENT MEDIA' },
      ],
      behindTheScenes: { heading: { zhHant: '幕後片段', en: 'BEHIND THE SCENES', order: 'en-zh' }, mediaIds: btsSequence, arrangement: 'audited-long-scroll' },
      exploreMore: ['tidal-signal', 'night-passage'],
    },
    seo: { title: 'After Rain — Motion', description: 'A temporary bilingual motion study built from project-owned mock imagery.', socialImageId: 'site.social-default' },
  }),
  defineMotionProject({
    kind: 'motion',
    slug: 'tidal-signal',
    identity: {
      title: { zhHant: '潮汐訊號', en: 'TIDAL SIGNAL', order: 'en-zh' },
      location: { zhHant: '大嶼山', en: 'LANTAU', order: 'en-zh' },
      year: '2026',
      date: { zhHant: '2026年8月', en: 'AUGUST 2026', order: 'en-zh' },
    },
    index: {
      number: '02',
      description: { zhHant: '退潮後的銀色水道，短暫標記出陸地與海的界線。', en: 'Silver channels briefly mark the boundary between land and sea.', order: 'en-zh' },
      posterId: 'stills.mock.tidal-flats',
      satelliteMediaIds: ['stills.mock.salt-flat', 'stills.mock.reservoir', 'stills.mock.deep-water'],
      layout: 'title-above',
      accent: 'water-blue',
      featured: false,
    },
    caseStudy: {
      hero: {
        assetPolicy: 'temporary-development',
        posterId: 'stills.mock.tidal-flats',
        audioPolicy: 'muted-preview-user-gesture-full-audio',
        replacementNote: { zhHant: '正式潮汐影片與聲音尚未提供。', en: 'Final tidal footage and sound have not yet been supplied.', order: 'en-zh' },
      },
      synopsis: {
        zhHant: '從潮溝、鹽痕與遠處人物之間尋找節拍的臨時電影練習，沒有使用任何外部作品或客戶素材。',
        en: 'A temporary film exercise finding rhythm among tidal channels, salt traces, and distant figures, without external or client material.',
        order: 'en-zh',
      },
      filmstripRows: [
        { id: 'ebb-lines', direction: 'forward', mediaIds: ['stills.mock.tidal-flats', 'stills.mock.salt-flat', 'stills.mock.deep-water', 'stills.mock.reservoir'] },
        { id: 'shore-lines', direction: 'reverse', mediaIds: ['stills.mock.ice-drift', 'stills.mock.waterfall', 'stills.mock.warm-tree', 'stills.mock.rain-window'] },
      ],
      credits: [
        { role: { zhHant: '創作習作', en: 'CREATIVE STUDY', order: 'en-zh' }, name: 'JRFANK' },
        { role: { zhHant: '素材狀態', en: 'MEDIA STATUS', order: 'en-zh' }, name: 'TEMPORARY DEVELOPMENT MEDIA' },
      ],
      behindTheScenes: {
        heading: { zhHant: '幕後片段', en: 'BEHIND THE SCENES', order: 'en-zh' },
        mediaIds: [btsSequence[1], btsSequence[7], btsSequence[3], btsSequence[5], btsSequence[0], btsSequence[6], btsSequence[4], btsSequence[2]],
        arrangement: 'audited-long-scroll',
      },
      exploreMore: ['night-passage', 'drift-line'],
    },
    seo: { title: 'Tidal Signal — Motion', description: 'A temporary bilingual coastal motion study using authorized mock media.', socialImageId: 'site.social-default' },
  }),
  defineMotionProject({
    kind: 'motion',
    slug: 'night-passage',
    identity: {
      title: { zhHant: '夜行通道', en: 'NIGHT PASSAGE', order: 'en-zh' },
      location: { zhHant: '九龍', en: 'KOWLOON', order: 'en-zh' },
      year: '2026',
      date: { zhHant: '2026年6月', en: 'JUNE 2026', order: 'en-zh' },
    },
    index: {
      number: '03',
      description: { zhHant: '騎行者穿過藍色時刻，城市只留下濕地與回聲。', en: 'A rider crosses the blue hour while the city leaves wet ground and echoes.', order: 'en-zh' },
      posterId: 'stills.mock.rain-passage',
      satelliteMediaIds: ['stills.mock.rain-window', 'stills.mock.warm-tree', 'stills.mock.salt-flat'],
      layout: 'title-split',
      accent: 'rain-violet',
      featured: false,
    },
    caseStudy: {
      hero: {
        assetPolicy: 'temporary-development',
        posterId: 'stills.mock.rain-passage',
        audioPolicy: 'muted-preview-muted-full',
        replacementNote: { zhHant: '正式夜景影片仍在等待專案素材。', en: 'The final night film is still awaiting project footage.', order: 'en-zh' },
      },
      synopsis: {
        zhHant: '以通道、反光與短暫人物動作構成的臨時無聲習作，用來測試案例頁的觀看節奏。',
        en: 'A temporary silent study of passages, reflections, and brief human movement, created to test the case-study viewing rhythm.',
        order: 'en-zh',
      },
      filmstripRows: [
        { id: 'blue-hour', direction: 'forward', mediaIds: ['stills.mock.rain-passage', 'stills.mock.rain-window', 'stills.mock.reservoir', 'stills.mock.deep-water'] },
        { id: 'late-light', direction: 'reverse', mediaIds: ['stills.mock.warm-tree', 'stills.mock.waterfall', 'stills.mock.salt-flat', 'stills.mock.ice-drift'] },
      ],
      credits: [
        { role: { zhHant: '創作習作', en: 'CREATIVE STUDY', order: 'en-zh' }, name: 'JRFANK' },
        { role: { zhHant: '素材狀態', en: 'MEDIA STATUS', order: 'en-zh' }, name: 'TEMPORARY DEVELOPMENT MEDIA' },
      ],
      behindTheScenes: {
        heading: { zhHant: '幕後片段', en: 'BEHIND THE SCENES', order: 'en-zh' },
        mediaIds: [btsSequence[2], btsSequence[7], btsSequence[5], btsSequence[6], btsSequence[1], btsSequence[3], btsSequence[0], btsSequence[4]],
        arrangement: 'audited-long-scroll',
      },
      exploreMore: ['drift-line', 'mineral-air'],
    },
    seo: { title: 'Night Passage — Motion', description: 'A temporary bilingual city motion study using project-owned mock imagery.', socialImageId: 'site.social-default' },
  }),
  defineMotionProject({
    kind: 'motion',
    slug: 'drift-line',
    identity: {
      title: { zhHant: '漂移線', en: 'DRIFT LINE', order: 'en-zh' },
      location: { zhHant: '北海道', en: 'HOKKAIDO', order: 'en-zh' },
      year: '2026',
      date: { zhHant: '2026年3月', en: 'MARCH 2026', order: 'en-zh' },
    },
    index: {
      number: '04',
      description: { zhHant: '小船與浮冰在平靜水面上，留下兩條速度不同的軌跡。', en: 'A small boat and drifting ice leave two differently paced lines across still water.', order: 'en-zh' },
      posterId: 'stills.mock.ice-drift',
      satelliteMediaIds: ['stills.mock.deep-water', 'stills.mock.reservoir', 'stills.mock.waterfall'],
      layout: 'title-below',
      accent: 'forest-green',
      featured: false,
    },
    caseStudy: {
      hero: {
        assetPolicy: 'temporary-development',
        posterId: 'stills.mock.ice-drift',
        previewId: 'home.r1.hero-video',
        audioPolicy: 'muted-preview-user-gesture-full-audio',
        replacementNote: { zhHant: '目前預覽只作開發測試；正式預覽與完整影片均待取代。', en: 'The current preview is development-only; both preview and full film await replacement.', order: 'en-zh' },
      },
      synopsis: {
        zhHant: '以水面距離與冬季緩慢位移為主題的臨時動態研究，現有短片只驗證載入和播放交接。',
        en: 'A temporary motion study of distance and slow winter movement; the present loop exists only to validate loading and playback handoff.',
        order: 'en-zh',
      },
      filmstripRows: [
        { id: 'drift-near', direction: 'forward', mediaIds: ['stills.mock.ice-drift', 'stills.mock.deep-water', 'stills.mock.reservoir', 'stills.mock.salt-flat'] },
        { id: 'drift-far', direction: 'reverse', mediaIds: ['stills.mock.waterfall', 'stills.mock.tidal-flats', 'stills.mock.rain-window', 'stills.mock.warm-tree'] },
      ],
      credits: [
        { role: { zhHant: '創作習作', en: 'CREATIVE STUDY', order: 'en-zh' }, name: 'JRFANK' },
        { role: { zhHant: '素材狀態', en: 'MEDIA STATUS', order: 'en-zh' }, name: 'TEMPORARY DEVELOPMENT MEDIA' },
      ],
      behindTheScenes: {
        heading: { zhHant: '幕後片段', en: 'BEHIND THE SCENES', order: 'en-zh' },
        mediaIds: [btsSequence[4], btsSequence[3], btsSequence[0], btsSequence[6], btsSequence[1], btsSequence[7], btsSequence[5], btsSequence[2]],
        arrangement: 'audited-long-scroll',
      },
      exploreMore: ['mineral-air', 'after-rain'],
    },
    seo: { title: 'Drift Line — Motion', description: 'A temporary bilingual winter motion study with an explicitly provisional preview.', socialImageId: 'site.social-default' },
  }),
  defineMotionProject({
    kind: 'motion',
    slug: 'mineral-air',
    identity: {
      title: { zhHant: '礦物之風', en: 'MINERAL AIR', order: 'en-zh' },
      location: { zhHant: '新界', en: 'NEW TERRITORIES', order: 'en-zh' },
      year: '2025',
      date: { zhHant: '2025年12月', en: 'DECEMBER 2025', order: 'en-zh' },
    },
    index: {
      number: '05',
      description: { zhHant: '淺色地表、靜水與風，把空曠景觀收成一段短句。', en: 'Pale ground, still water, and wind compress an open landscape into a short phrase.', order: 'en-zh' },
      posterId: 'stills.mock.salt-flat',
      satelliteMediaIds: ['stills.mock.tidal-flats', 'stills.mock.warm-tree', 'stills.mock.ice-drift'],
      layout: 'title-above',
      accent: 'mineral-silver',
      featured: false,
    },
    caseStudy: {
      hero: {
        assetPolicy: 'temporary-development',
        posterId: 'stills.mock.salt-flat',
        audioPolicy: 'muted-preview-user-gesture-full-audio',
        replacementNote: { zhHant: '正式景觀影片、聲音與時長尚待確認。', en: 'Final landscape film, sound, and duration remain to be confirmed.', order: 'en-zh' },
      },
      synopsis: {
        zhHant: '一段關於空白、微風與地表紋理的臨時動態草稿；不主張任何尚未發生的委託或成果。',
        en: 'A temporary motion draft about negative space, wind, and surface texture, making no claim to an unconfirmed commission or outcome.',
        order: 'en-zh',
      },
      filmstripRows: [
        { id: 'mineral-light', direction: 'forward', mediaIds: ['stills.mock.salt-flat', 'stills.mock.tidal-flats', 'stills.mock.ice-drift', 'stills.mock.reservoir'] },
        { id: 'mineral-shadow', direction: 'reverse', mediaIds: ['stills.mock.warm-tree', 'stills.mock.deep-water', 'stills.mock.rain-passage', 'stills.mock.waterfall'] },
      ],
      credits: [
        { role: { zhHant: '創作習作', en: 'CREATIVE STUDY', order: 'en-zh' }, name: 'JRFANK' },
        { role: { zhHant: '素材狀態', en: 'MEDIA STATUS', order: 'en-zh' }, name: 'TEMPORARY DEVELOPMENT MEDIA' },
      ],
      behindTheScenes: {
        heading: { zhHant: '幕後片段', en: 'BEHIND THE SCENES', order: 'en-zh' },
        mediaIds: [btsSequence[7], btsSequence[1], btsSequence[5], btsSequence[4], btsSequence[6], btsSequence[0], btsSequence[3], btsSequence[2]],
        arrangement: 'audited-long-scroll',
      },
      exploreMore: ['after-rain', 'tidal-signal'],
    },
    seo: { title: 'Mineral Air — Motion', description: 'A temporary bilingual landscape motion draft using authorized mock imagery.', socialImageId: 'site.social-default' },
  }),
];

export function getMotionProject(slug: string): MotionProject | undefined {
  return motionProjects.find((project) => project.slug === slug);
}
