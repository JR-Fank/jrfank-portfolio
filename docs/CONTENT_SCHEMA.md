# Content Schema Specification

Status: Step 2 specification only  
Purpose: define the finite, typed content model required to reproduce the audited portfolio without creating a universal page builder

## 1. Principles

1. Content is local, typed, versioned data under `src/content/`.
2. Photography and video are referenced only by semantic media ID.
3. Stills and Motion are separate project types because their narratives and media behavior differ.
4. Traditional Chinese and English are composed together. There is no locale route and no language-toggle state.
5. Layout freedom is constrained to audited block types and named presets. Content cannot inject arbitrary CSS, HTML, React, or GSAP configuration.
6. Every project route, index card, sitemap entry, metadata record, and Explore More card is derived from the same project object.
7. Ordering belongs to content arrays and block arrays. It never belongs to filenames.
8. Zod validates external/runtime shape at build time; TypeScript `satisfies` preserves authoring feedback.

## 2. File organization

```text
src/content/
  schema.ts
  site.ts
  home.ts
  about.ts
  stills/
    visit-greenland.ts
    inspired-by-iceland.ts
    cayuga-collection.ts
    index.ts
  motion/
    pandore.ts
    satisfy-running.ts
    index.ts
  index.ts
```

One project per file keeps changes reviewable. `index.ts` files export validated, ordered arrays and lookup maps. No content file imports a component.

## 3. Shared primitives

The following TypeScript is normative schema notation, not implementation code.

```ts
type Slug = string;      // lowercase kebab-case, unique within project kind
type BlockId = string;   // lowercase kebab-case, unique within a project
type MediaId = string;   // semantic ID present in the media manifest

type BilingualText = {
  zhHant?: string;
  en: string;
  order?: 'zh-en' | 'en-zh';
};

type RichText = Array<
  | { type: 'paragraph'; text: BilingualText }
  | { type: 'credit'; role: BilingualText; name: string }
  | { type: 'lineBreak' }
>;

type Link = {
  label: BilingualText;
  href: string;
  external?: boolean;
};

type Seo = {
  title: string;
  description: string;
  socialImageId: MediaId;
  noindex?: boolean;
};
```

`zhHant` is optional only where the approved art direction genuinely contains English-only text, such as a brand or film title. It must not be omitted as a shortcut for unfinished copy.

Rich text is intentionally small. If a case study later needs arbitrary editorial markup, add one evidenced node type rather than accepting raw HTML.

## 4. Media references and display presets

```ts
type ImageRef = {
  id: MediaId;
  altOverride?: string;
  focalPointOverride?: { x: number; y: number };
};

type VideoRef = {
  id: MediaId;
  title: BilingualText;
};

type WidthPreset =
  | 'viewport'
  | 'page-wide'
  | 'large'
  | 'medium'
  | 'small';

type Alignment = 'start' | 'center' | 'end';
type GapPreset = 'tight' | 'standard' | 'wide';
type OffsetPreset = 'none' | 'small' | 'medium' | 'large';
type MobileFlow = 'stack' | 'preserve-pair' | 'horizontal-scroll';
```

These presets map to tested CSS tokens. Do not expose arbitrary width percentages, pixel offsets, `object-position` strings, class names, or inline styles in content.

## 5. Photography project

```ts
type PhotographyProject = {
  kind: 'stills';
  slug: Slug;
  title: BilingualText;
  eyebrow?: BilingualText;
  location?: BilingualText;
  year: string;
  client?: string;
  summary: BilingualText;
  cover: ImageRef;
  index: {
    number: string;
    palette: [string, string, ...string[]];
    featured: boolean;
  };
  seo: Seo;
  blocks: PhotographyBlock[];
  exploreMore?: Slug[];
};
```

`exploreMore` is an optional editorial override. If absent, deterministic ordering selects adjacent published projects without selecting the current slug.

## 6. Photography block union

Every block shares:

```ts
type BlockBase<T extends string> = {
  type: T;
  id: BlockId;
  theme?: 'inherit' | 'dark' | 'light';
  topSpace?: 'none' | 'small' | 'standard' | 'large';
  bottomSpace?: 'none' | 'small' | 'standard' | 'large';
};
```

The union is closed:

```ts
type PhotographyBlock =
  | HeroBlock
  | FullBleedBlock
  | LandscapeBlock
  | PortraitBlock
  | ImagePairBlock
  | ImageTriptychBlock
  | OffsetImageBlock
  | SmallImageBlock
  | ImageSequenceBlock
  | VideoBlock
  | CaptionBlock
  | TextBlock
  | SpacerBlock;
```

### 6.1 Hero

```ts
type HeroBlock = BlockBase<'hero'> & {
  media: ImageRef;
  titleMode: 'overlay' | 'below';
  height: 'viewport' | 'tall' | 'natural';
  treatment?: 'none' | 'theme-tint';
};
```

Rules: exactly one, always the first block, and its media must match the route's approved hero/cover relationship.

### 6.2 Full bleed

```ts
type FullBleedBlock = BlockBase<'fullBleed'> & {
  media: ImageRef;
  height: 'natural' | 'viewport' | 'tall';
  caption?: BilingualText;
};
```

### 6.3 Landscape

```ts
type LandscapeBlock = BlockBase<'landscape'> & {
  media: ImageRef;
  width: Exclude<WidthPreset, 'small'>;
  align?: Alignment;
  caption?: BilingualText;
};
```

### 6.4 Portrait

```ts
type PortraitBlock = BlockBase<'portrait'> & {
  media: ImageRef;
  width: 'large' | 'medium' | 'small';
  align: Alignment;
  caption?: BilingualText;
};
```

### 6.5 Image pair

```ts
type ImagePairBlock = BlockBase<'imagePair'> & {
  media: [ImageRef, ImageRef];
  ratio: 'equal' | 'left-wide' | 'right-wide';
  align: 'top' | 'center' | 'bottom';
  gap: GapPreset;
  mobile: MobileFlow;
  caption?: BilingualText;
};
```

### 6.6 Image triptych

```ts
type ImageTriptychBlock = BlockBase<'imageTriptych'> & {
  media: [ImageRef, ImageRef, ImageRef];
  arrangement: 'equal' | 'center-tall' | 'outer-tall';
  gap: GapPreset;
  mobile: MobileFlow;
};
```

### 6.7 Offset image

```ts
type OffsetImageBlock = BlockBase<'offsetImage'> & {
  media: ImageRef;
  width: 'large' | 'medium';
  align: 'start' | 'end';
  offset: Exclude<OffsetPreset, 'none'>;
  caption?: BilingualText;
};
```

The offset preset means a named composition measured from the reference; it is not a free pixel value.

### 6.8 Small image

```ts
type SmallImageBlock = BlockBase<'smallImage'> & {
  media: ImageRef;
  align: Alignment;
  offset?: 'none' | 'small';
  caption?: BilingualText;
};
```

### 6.9 Image sequence

```ts
type ImageSequenceBlock = BlockBase<'imageSequence'> & {
  media: [ImageRef, ImageRef, ...ImageRef[]];
  presentation: 'vertical' | 'filmstrip' | 'overlap';
  gap: GapPreset;
  activeRail?: boolean;
};
```

`activeRail: true` is reserved for the audited Stills case gallery pattern and invokes the gallery rail behavior. It is not a general carousel switch.

### 6.10 Video

```ts
type VideoBlock = BlockBase<'video'> & {
  media: VideoRef;
  mode: 'preview-loop' | 'film-player';
  width: WidthPreset;
  align?: Alignment;
  caption?: BilingualText;
};
```

Stills projects may use video only if owned material calls for it. `film-player` is normally reserved for Motion projects and must never appear on an index.

### 6.11 Caption

```ts
type CaptionBlock = BlockBase<'caption'> & {
  text: BilingualText;
  align: Alignment;
  width: 'medium' | 'small';
};
```

### 6.12 Text

```ts
type TextBlock = BlockBase<'text'> & {
  heading?: BilingualText;
  body: RichText;
  align: Alignment;
  width: 'large' | 'medium' | 'small';
};
```

### 6.13 Spacer

```ts
type SpacerBlock = BlockBase<'spacer'> & {
  size: 'small' | 'medium' | 'large' | 'viewport';
};
```

Use a spacer only when the audited composition contains intentional empty rhythm that cannot belong to the neighboring block. A project with many spacers should be rejected in review.

## 7. Motion project schema

Motion cases are not forced into the photography block system.

```ts
type MotionProject = {
  kind: 'motion';
  slug: Slug;
  title: BilingualText;
  eyebrow?: BilingualText;
  year: string;
  client?: string;
  summary: BilingualText;
  index: {
    number: string;
    poster: ImageRef;
    preview: VideoRef;
    featured: boolean;
  };
  film: {
    video: VideoRef;
    poster: ImageRef;
    durationLabel: string;
    director?: string;
    audio: boolean;
  };
  frames: [ImageRef, ImageRef, ...ImageRef[]];
  behindTheScenes?: {
    heading: BilingualText;
    media: [ImageRef, ImageRef, ...ImageRef[]];
    arrangement: 'audited-long-scroll';
  };
  credits: Array<{
    role: BilingualText;
    name: string;
    url?: string;
  }>;
  seo: Seo;
  exploreMore?: Slug[];
};
```

The index contains only a poster and preview. `film.video` is read only by the case-study route. The single `audited-long-scroll` BTS arrangement intentionally prevents content authors from inventing new pinning systems.

## 8. Home schema

```ts
type HomeContent = {
  seo: Seo;
  hero: {
    reel: VideoRef;
    poster: ImageRef;
    title: BilingualText;
  };
  introduction: {
    eyebrow?: BilingualText;
    heading: BilingualText;
    body: RichText;
  };
  featured: Array<
    | { kind: 'stills'; project: Slug; treatment: 'paired' | 'single' }
    | { kind: 'motion'; project: Slug; treatment: 'poster-preview' }
  >;
};
```

Featured project resolution joins against the canonical project arrays. It does not duplicate titles, covers, routes, or descriptions.

## 9. About and site schema

```ts
type AboutContent = {
  seo: Seo;
  name: string;
  portrait: ImageRef | VideoRef;
  introduction: BilingualText;
  story: Array<{
    text: BilingualText;
    media?: ImageRef;
    treatment: 'text' | 'image-left' | 'image-right' | 'overlap';
  }>;
  credentials: Array<{
    group: BilingualText;
    items: string[];
  }>;
};

type SiteContent = {
  name: string;
  defaultSeo: Seo;
  navigation: Array<{ label: BilingualText; href: string }>;
  contact: {
    email: string;
    links: Link[];
    copyright: string;
  };
};
```

Navigation route values are validated against the known route inventory. External social/contact links remain in site content.

## 10. Example photography project

This example demonstrates authoring shape with placeholder media IDs only.

```ts
export const visitGreenland = {
  kind: 'stills',
  slug: 'visit-greenland',
  title: { zhHant: '格陵蘭', en: 'Visit Greenland', order: 'zh-en' },
  location: { zhHant: '格陵蘭', en: 'Greenland' },
  year: '2024',
  summary: {
    zhHant: '待核准的繁體中文專案摘要。',
    en: 'Approved English project summary required.',
  },
  cover: { id: 'stills.visit-greenland.cover' },
  index: {
    number: '01',
    palette: ['#0e1012', '#9aa9b5', '#e8e5f0'],
    featured: true,
  },
  seo: {
    title: 'Visit Greenland — Photography',
    description: 'Approved description required.',
    socialImageId: 'social.visit-greenland',
  },
  blocks: [
    {
      type: 'hero',
      id: 'opening',
      media: { id: 'stills.visit-greenland.hero' },
      titleMode: 'overlay',
      height: 'viewport',
    },
    {
      type: 'imagePair',
      id: 'ice-and-sea',
      media: [
        { id: 'stills.visit-greenland.ice-dawn' },
        { id: 'stills.visit-greenland.boat' },
      ],
      ratio: 'left-wide',
      align: 'center',
      gap: 'standard',
      mobile: 'stack',
    },
    {
      type: 'imageSequence',
      id: 'gallery',
      media: [
        { id: 'stills.visit-greenland.gallery-01' },
        { id: 'stills.visit-greenland.gallery-02' },
      ],
      presentation: 'vertical',
      gap: 'wide',
      activeRail: true,
    },
  ],
} satisfies PhotographyProject;
```

Placeholder bilingual text is permitted during scaffolding but a production validator rejects known placeholder markers.

## 11. Validation rules

### 11.1 Repository-wide

- every published project slug is unique;
- every route generated from content is unique and URL-safe;
- every media ID exists and matches the expected kind;
- every SEO social image exists;
- all required English and Traditional Chinese fields are non-placeholder;
- navigation and featured references resolve;
- no external URL uses plain HTTP in production;
- sitemap and indexes are generated from the same published arrays.

### 11.2 Photography projects

- exactly one hero block and it is first;
- block IDs are unique within the project;
- pair and triptych tuple lengths are exact;
- an active gallery rail appears at most once;
- media is not duplicated accidentally within the same sequence;
- layout preset is valid for its block type;
- `theme: light`/`dark` is exceptional and requires design review because the global F-stop theme remains authoritative.

### 11.3 Motion projects

- index preview is not the same object as the full film;
- preview has no audio stream;
- full film has an approved poster and duration;
- BTS contains enough items for the audited sequence or is omitted entirely;
- credit links, when present, are valid absolute URLs;
- full film ID is never emitted by an index serializer.

## 12. Publishing states

To keep the schema small, projects use repository state rather than a mini-CMS workflow:

- unpublished projects are not exported from their kind's `index.ts`;
- published projects appear in the ordered export;
- an optional `seo.noindex` supports a review-only route but does not make it private;
- Git history and pull requests provide editorial review.

Do not add `draft`, `scheduled`, permissions, preview tokens, or admin fields unless a real workflow requires them later.

## 13. Content-to-page mapping

| Content source | Consumers |
|---|---|
| `site.ts` | root metadata, nav, menu, footer, contact/copyright |
| `home.ts` | Home composition and Home SEO |
| `about.ts` | About composition and About SEO |
| Stills project | Stills index stage, case route, sitemap, Explore More, Home feature |
| Motion project | Motion index card, case route, sitemap, Explore More, Home feature |
| media manifest | every media component, social metadata, preload hints, validation |

No consumer copies a project title or route into a second data source.

## 14. Explicitly out of scope

- arbitrary page-builder grids;
- Markdown/MDX components chosen by content authors;
- raw HTML;
- arbitrary CSS values or animation durations in content;
- runtime CMS fetching;
- localization routing;
- user-generated content;
- authenticated previews;
- analytics fields;
- automatic AI captions or translations.

## 15. Inputs required before production content entry

- final project list, public order, and route slugs;
- approved bilingual names, summaries, captions, credits, and alt text;
- project year/location/client metadata;
- final media inventory mapped to semantic IDs;
- Home featured-project selection;
- About story and credentials;
- SEO descriptions and social-image selections;
- copyright, email, and external links.

