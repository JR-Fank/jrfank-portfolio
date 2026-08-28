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
  readonly variants: readonly MediaVariant[];
}

export type MediaAsset = ImageMediaAsset | VideoMediaAsset;

export type WidthPreset = 'viewport' | 'page-wide' | 'large' | 'medium' | 'small';
export type Alignment = 'start' | 'center' | 'end';
export type GapPreset = 'tight' | 'standard' | 'wide';

interface ProjectBlockBase {
  readonly id: string;
  readonly topSpace?: 'none' | 'small' | 'standard' | 'large';
  readonly bottomSpace?: 'none' | 'small' | 'standard' | 'large';
}

export type ProjectBlock =
  | (ProjectBlockBase & { readonly type: 'hero'; readonly mediaId: MediaId; readonly height: 'viewport' | 'tall' | 'natural' })
  | (ProjectBlockBase & { readonly type: 'fullBleed'; readonly mediaId: MediaId; readonly height: 'viewport' | 'tall' | 'natural' })
  | (ProjectBlockBase & { readonly type: 'landscape'; readonly mediaId: MediaId; readonly width: WidthPreset; readonly align?: Alignment })
  | (ProjectBlockBase & { readonly type: 'portrait'; readonly mediaId: MediaId; readonly width: 'large' | 'medium' | 'small'; readonly align: Alignment })
  | (ProjectBlockBase & { readonly type: 'imagePair'; readonly mediaIds: readonly [MediaId, MediaId]; readonly gap: GapPreset })
  | (ProjectBlockBase & { readonly type: 'imageTriptych'; readonly mediaIds: readonly [MediaId, MediaId, MediaId]; readonly gap: GapPreset })
  | (ProjectBlockBase & { readonly type: 'offsetImage'; readonly mediaId: MediaId; readonly align: 'start' | 'end'; readonly offset: 'small' | 'medium' | 'large' })
  | (ProjectBlockBase & { readonly type: 'smallImage'; readonly mediaId: MediaId; readonly align: Alignment })
  | (ProjectBlockBase & { readonly type: 'imageSequence'; readonly mediaIds: readonly [MediaId, MediaId, ...MediaId[]]; readonly presentation: 'vertical' | 'filmstrip' | 'overlap' })
  | (ProjectBlockBase & { readonly type: 'video'; readonly mediaId: MediaId; readonly mode: 'preview-loop' | 'film-player'; readonly width: WidthPreset })
  | (ProjectBlockBase & { readonly type: 'caption'; readonly text: BilingualText; readonly align: Alignment })
  | (ProjectBlockBase & { readonly type: 'text'; readonly heading?: BilingualText; readonly body: readonly BilingualText[]; readonly align: Alignment })
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
  readonly palette: readonly [string, string, ...string[]];
  readonly blocks: readonly ProjectBlock[];
}

export type MotionPlayback =
  | { readonly provider: 'unconfigured' }
  | { readonly provider: 'vimeo'; readonly videoId: string }
  | { readonly provider: 'r2'; readonly mediaId: MediaId };

export interface MotionProject extends ProjectBase {
  readonly kind: 'motion';
  readonly posterId: MediaId;
  readonly previewId?: MediaId;
  readonly playback: MotionPlayback;
  readonly blocks: readonly ProjectBlock[];
}
