export type ThemeState = 'dark' | 'light';

export type MediaId = string;

export interface BilingualText {
  readonly zhHant?: string;
  readonly en: string;
  readonly order?: 'zh-en' | 'en-zh';
}

export interface NavigationItem {
  readonly label: BilingualText;
  readonly href: string;
  readonly external?: boolean;
  readonly placement: 'primary' | 'utility' | 'menu';
}

export interface SiteConfig {
  readonly name: string;
  readonly navigation: readonly NavigationItem[];
  readonly contact: {
    readonly email: string;
    readonly copyright: string;
    readonly credit: string;
    readonly social: readonly NavigationItem[];
  };
}

export type MediaFormat = 'avif' | 'webp' | 'jpg' | 'mp4';
export type ImageVariantWidth = 640 | 1280 | 1920 | 2560 | 3200;

export interface MediaVariant {
  readonly width: number;
  readonly format: MediaFormat;
  readonly key: string;
  readonly bytes: number;
  readonly hash: string;
}

interface MediaAssetBase {
  readonly id: MediaId;
  readonly width: number;
  readonly height: number;
  readonly aspectRatio: number;
}

export interface ImageMediaAsset extends MediaAssetBase {
  readonly kind: 'image';
  readonly alt: string;
  readonly dominantColor?: string;
  readonly focalPoint?: { readonly x: number; readonly y: number };
  readonly variants: readonly MediaVariant[];
}

export interface VideoMediaAsset extends MediaAssetBase {
  readonly kind: 'video';
  readonly duration: number;
  readonly posterId: MediaId;
  readonly role?: 'preview' | 'full-film';
  readonly audioPolicy?: MotionAudioPolicy;
  readonly hasAudio?: boolean;
  readonly variants: readonly MediaVariant[];
}

export type MediaAsset = ImageMediaAsset | VideoMediaAsset;

export type WidthPreset = 'viewport' | 'page-wide' | 'large' | 'medium' | 'small';
export type Alignment = 'start' | 'center' | 'end';
export type GapPreset = 'tight' | 'standard' | 'wide';
export type MobileFlow = 'stack' | 'preserve-pair' | 'horizontal-scroll';

interface ProjectBlockBase {
  readonly id: string;
  readonly theme?: 'inherit' | 'dark' | 'light';
  readonly topSpace?: 'none' | 'small' | 'standard' | 'large';
  readonly bottomSpace?: 'none' | 'small' | 'standard' | 'large';
}

export type ProjectBlock =
  | (ProjectBlockBase & { readonly type: 'hero'; readonly mediaId: MediaId; readonly titleMode?: 'overlay' | 'below'; readonly height: 'viewport' | 'tall' | 'natural'; readonly treatment?: 'none' | 'theme-tint' })
  | (ProjectBlockBase & { readonly type: 'fullBleed'; readonly mediaId: MediaId; readonly height: 'viewport' | 'tall' | 'natural'; readonly caption?: BilingualText })
  | (ProjectBlockBase & { readonly type: 'landscape'; readonly mediaId: MediaId; readonly width: Exclude<WidthPreset, 'small'>; readonly align?: Alignment; readonly caption?: BilingualText })
  | (ProjectBlockBase & { readonly type: 'portrait'; readonly mediaId: MediaId; readonly width: 'large' | 'medium' | 'small'; readonly align: Alignment; readonly caption?: BilingualText })
  | (ProjectBlockBase & { readonly type: 'imagePair'; readonly mediaIds: readonly [MediaId, MediaId]; readonly ratio: 'equal' | 'left-wide' | 'right-wide'; readonly align: 'top' | 'center' | 'bottom'; readonly gap: GapPreset; readonly mobile: MobileFlow; readonly caption?: BilingualText })
  | (ProjectBlockBase & { readonly type: 'imageTriptych'; readonly mediaIds: readonly [MediaId, MediaId, MediaId]; readonly arrangement: 'equal' | 'center-tall' | 'outer-tall'; readonly gap: GapPreset; readonly mobile: MobileFlow })
  | (ProjectBlockBase & { readonly type: 'offsetImage'; readonly mediaId: MediaId; readonly width: 'large' | 'medium'; readonly align: 'start' | 'end'; readonly offset: 'small' | 'medium' | 'large'; readonly caption?: BilingualText })
  | (ProjectBlockBase & { readonly type: 'smallImage'; readonly mediaId: MediaId; readonly align: Alignment; readonly offset?: 'none' | 'small'; readonly caption?: BilingualText })
  | (ProjectBlockBase & { readonly type: 'imageSequence'; readonly mediaIds: readonly [MediaId, MediaId, ...MediaId[]]; readonly presentation: 'vertical' | 'filmstrip' | 'overlap'; readonly gap: GapPreset; readonly activeRail?: boolean })
  | (ProjectBlockBase & { readonly type: 'video'; readonly mediaId: MediaId; readonly mode: 'preview-loop' | 'film-player'; readonly width: WidthPreset; readonly align?: Alignment; readonly caption?: BilingualText })
  | (ProjectBlockBase & { readonly type: 'caption'; readonly text: BilingualText; readonly align: Alignment; readonly width: 'medium' | 'small' })
  | (ProjectBlockBase & { readonly type: 'text'; readonly heading?: BilingualText; readonly body: readonly BilingualText[]; readonly align: Alignment; readonly width: 'large' | 'medium' | 'small' })
  | (ProjectBlockBase & { readonly type: 'spacer'; readonly size: 'small' | 'medium' | 'large' | 'viewport' });

interface ProjectBase {
  readonly slug: string;
  readonly title: BilingualText;
  readonly location: BilingualText;
  readonly year: string;
  readonly summary: BilingualText;
  readonly seo: {
    readonly title: string;
    readonly description: string;
    readonly socialImageId: MediaId;
  };
}

export interface StillProject extends ProjectBase {
  readonly kind: 'stills';
  readonly coverId: MediaId;
  readonly index: {
    readonly number: string;
    readonly mediaIds: readonly [MediaId, MediaId];
    readonly palette: readonly [string, string, ...string[]];
    readonly featured: boolean;
  };
  readonly blocks: readonly ProjectBlock[];
  readonly exploreMore?: readonly string[];
}

export type MotionIndexLayout = 'title-above' | 'title-below' | 'title-split';

export type MotionAccent =
  | 'warm-amber'
  | 'water-blue'
  | 'forest-green'
  | 'rain-violet'
  | 'mineral-silver';

export type MotionAudioPolicy =
  | 'muted-preview-user-gesture-full-audio'
  | 'muted-preview-muted-full';

interface MotionPlaybackBase {
  readonly posterId: MediaId;
  readonly previewId?: MediaId;
  readonly fullFilmId?: MediaId;
  readonly audioPolicy: MotionAudioPolicy;
  readonly allowSharedPreviewAndFull?: true;
}

export type MotionPlayback =
  | (MotionPlaybackBase & {
      readonly assetPolicy: 'temporary-development';
      readonly durationSeconds?: number;
      readonly replacementNote: BilingualText;
    })
  | (MotionPlaybackBase & {
      readonly assetPolicy: 'production-ready';
      readonly previewId: MediaId;
      readonly fullFilmId: MediaId;
      readonly durationSeconds: number;
    });

export interface MotionCredit {
  readonly role: BilingualText;
  readonly name: string;
  readonly url?: string;
}

export interface MotionFilmstripRow {
  readonly id: string;
  readonly direction: 'forward' | 'reverse';
  readonly mediaIds: readonly [MediaId, MediaId, MediaId, ...MediaId[]];
}

export interface MotionProjectInput {
  readonly kind: 'motion';
  readonly slug: string;
  readonly identity: {
    readonly title: BilingualText;
    readonly location: BilingualText;
    readonly year: string;
    readonly date: BilingualText;
  };
  readonly index: {
    readonly number: string;
    readonly description: BilingualText;
    readonly posterId: MediaId;
    readonly satelliteMediaIds: readonly [MediaId, MediaId, MediaId];
    readonly layout: MotionIndexLayout;
    readonly accent?: MotionAccent;
    readonly featured: boolean;
  };
  readonly caseStudy: {
    readonly hero: MotionPlayback;
    readonly synopsis: BilingualText;
    readonly filmstripRows: readonly [MotionFilmstripRow, MotionFilmstripRow];
    readonly credits: readonly [MotionCredit, ...MotionCredit[]];
    readonly behindTheScenes: {
      readonly heading: BilingualText;
      readonly mediaIds: readonly [MediaId, MediaId, MediaId, MediaId, MediaId, MediaId, MediaId, MediaId];
      readonly arrangement: 'audited-long-scroll';
    };
    readonly exploreMore: readonly string[];
  };
  readonly seo: {
    readonly title: string;
    readonly description: string;
    readonly socialImageId: MediaId;
  };
}

export interface MotionProject extends MotionProjectInput {
  /** Read aliases retained until the STEP 3E-B route renderer adopts the nested Motion contract. */
  readonly title: BilingualText;
  readonly location: BilingualText;
  readonly year: string;
  readonly date: BilingualText;
  readonly summary: BilingualText;
  readonly posterId: MediaId;
}
