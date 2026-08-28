# Media Architecture Specification

Status: Step 2 specification only  
Goal: keep code and media independent while preserving deterministic layout, responsive delivery, and static hosting

## 1. Architecture decision

The application references media by semantic ID. It never stores production binary paths in page components and never detects image dimensions at runtime.

```text
content block → media ID → generated manifest → central resolver → environment base URL
```

Development resolves to `/mock-media`. Production resolves to the R2 custom domain such as `https://media.example.com`. The same media IDs and manifest shape are used in both environments.

Production photography, video, and derived variants do not enter Git. Git contains:

- content metadata;
- a generated manifest with object keys, formats, dimensions, sizes, hashes, and accessibility metadata;
- tiny representative mock assets under `public/mock-media/`;
- preparation and validation scripts once those are implemented.

## 2. Environment contract

```dotenv
# Public, compiled into the static client bundle
NEXT_PUBLIC_MEDIA_BASE_URL=/mock-media

# Build-time canonical origins
SITE_URL=http://localhost:3000
MEDIA_URL=/mock-media
```

Production:

```dotenv
NEXT_PUBLIC_MEDIA_BASE_URL=https://media.example.com
SITE_URL=https://portfolio.example.com
MEDIA_URL=https://media.example.com
```

`MEDIA_URL` is used in build-time metadata and validation. `NEXT_PUBLIC_MEDIA_BASE_URL` is used by client components. A build assertion requires them to describe the same production origin. No origin may be hard-coded in content or components.

R2 credentials are upload-only secrets and never use the `NEXT_PUBLIC_` prefix:

```text
R2_ACCOUNT_ID
R2_BUCKET
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
```

They are not required for a normal site build.

## 3. Stable object-key model

R2 is flat object storage; the following “folders” are key prefixes. Use lowercase ASCII kebab-case for slugs and IDs. The stable semantic portion precedes a content hash; replacing bytes creates a new immutable key.

```text
v1/
  stills/
    visit-greenland/
      cover/
        visit-greenland-cover-1280-a1b2c3d4.avif
        visit-greenland-cover-1280-a1b2c3d4.webp
        visit-greenland-cover-1280-a1b2c3d4.jpg
      icefjord-dawn/
        icefjord-dawn-640-f47ac10b.avif
        icefjord-dawn-1280-9a86e20c.avif
        icefjord-dawn-1920-11ddf111.avif
        icefjord-dawn-2560-44e5d202.avif
  motion/
    pandore/
      poster/
      preview/
        pandore-preview-960-1fe384c2.mp4
      film/
        pandore-film-1080p-bf83aa11.mp4
      frames/
      bts/
  about/
    portrait/
    story/
  site/
    home/
    social/
  manifests/
    media-manifest-v1-<hash>.json
```

Rules:

- Never use camera filenames (`DSC_0042`, `IMG_8931`) in public keys.
- Never encode layout order in a media ID. Reordering content must not rename or reupload media.
- Never overwrite a hashed object. Publish new bytes at a new key, update the manifest, then remove the old object only after a retention window.
- Keep source/master files outside the public bucket or under a non-public bucket. The production delivery bucket contains web derivatives only.
- A media ID is stable across environments even when its resolved key differs.

## 4. Manifest contract

The generated manifest is committed at `src/generated/media-manifest.json` so the static build is deterministic and does not query R2.

Conceptual shape:

```ts
type MediaManifest = {
  version: 1;
  generatedAt: string;
  sourceFingerprint: string;
  assets: Record<MediaId, ImageAsset | VideoAsset>;
};

type ImageAsset = {
  kind: 'image';
  id: MediaId;
  width: number;
  height: number;
  aspectRatio: number;
  alt: string;
  dominantColor?: `#${string}`;
  blurDataURL?: string;
  focalPoint?: { x: number; y: number };
  variants: Array<{
    width: 640 | 1280 | 1920 | 2560 | 3200;
    format: 'avif' | 'webp' | 'jpg';
    key: string;
    bytes: number;
    hash: string;
  }>;
};

type VideoAsset = {
  kind: 'video';
  id: MediaId;
  width: number;
  height: number;
  aspectRatio: number;
  duration: number;
  posterId: MediaId;
  preview?: VideoRendition;
  film?: VideoRendition;
};
```

`aspectRatio` is stored for validation/convenience, but width and height remain authoritative. The build rejects missing variants, duplicate IDs, nonexistent poster references, and aspect mismatches beyond a small encoding tolerance.

The public hashed manifest is optional operational output. The frontend imports the committed manifest and does not fetch it at runtime.

## 5. Central resolver

`src/lib/media.ts` is the only layer allowed to concatenate a media base URL and object key. It provides four conceptual operations:

```text
getMedia(id)                  validated manifest entry
getImageSources(id, options)  AVIF/WebP/JPEG srcsets + intrinsic ratio
getVideoSources(id, mode)     poster/preview/full URLs + metadata
getSocialImage(id)            absolute build-time URL for metadata
```

Resolver output includes:

- absolute or site-relative `src`;
- one `srcset` per available format;
- intrinsic width, height, and aspect ratio;
- the approved `sizes` string or size preset;
- alt text, dominant color, focal point, and blur placeholder;
- preload eligibility.

Page components do not know about `v1/`, project prefixes, hashes, or file extensions.

## 6. Responsive image delivery

### 6.1 Required widths

Generate these widths without upscaling:

- 640 px;
- 1280 px;
- 1920 px;
- 2560 px;
- 3200 px only for rare, approved full-bleed desktop heroes whose source can support it.

For sources narrower than a target, omit the larger target and record the actual maximum. Portrait assets use the same width ladder; do not create a separate height ladder.

### 6.2 Formats

- AVIF: first `<source>` for photographic assets where visual QA passes.
- WebP: second `<source>`.
- JPEG: fallback `<img>` for broad compatibility and social assets where required.
- PNG/SVG: interface assets only when transparency/vector content justifies them.

Because production derivatives are prepared ahead of time in R2, do not depend on Next.js' runtime image optimizer. A `MediaPicture` component renders explicit `<picture>` sources from the manifest. This is a deliberate exception to a default `next/image` path: it preserves AVIF/WebP/JPEG negotiation and keeps image delivery completely independent of a server or third-party optimizer.

The fallback `<img>` always has numeric `width` and `height`, responsive CSS, `decoding="async"`, an accurate `sizes` contract, and lazy loading unless marked critical.

### 6.3 Size presets

Content selects a semantic preset; it cannot supply arbitrary `sizes` strings.

| Preset | Browser sizing intent |
|---|---|
| `viewport` | `100vw` |
| `page-wide` | 100vw mobile; viewport minus audited insets desktop |
| `half` | 100vw mobile; approximately 50vw desktop |
| `third` | 100vw compact; 50vw tablet; approximately 33vw desktop |
| `rail-thumb` | 48 px compact; 58–74 px desktop |
| `card` | 100vw compact; 50vw tablet; carousel-card width desktop |

Layout CSS and the `sizes` mapping must be changed together. Visual regression and network inspection verify that the selected resource is not materially oversized.

## 7. Image preparation pipeline

This section specifies later scripts; it does not implement them.

```text
owned master
  → inventory + semantic ID mapping
  → read orientation and dimensions
  → normalize orientation/color profile to sRGB
  → validate minimum resolution and crop/focal point
  → create width variants without upscaling
  → encode AVIF/WebP/JPEG
  → strip private EXIF; optionally retain approved copyright fields
  → calculate hash, dominant color, blur placeholder, bytes
  → decode-test every derivative
  → write manifest and upload plan
  → upload immutable keys
  → HEAD/GET verify custom-domain responses
```

Recommended implementation tools for Step 3:

- Node/TypeScript + Sharp/libvips for raster processing;
- `exiftool` or Sharp metadata inspection for privacy checks;
- a perceptual QA contact sheet for each project;
- AWS S3 SDK, `rclone`, or Wrangler for R2 upload.

Starting quality values—not immutable rules—may be AVIF 55, WebP 78, and JPEG 84. Photography must be compared at 100% and at final display size. Gradients, fine foliage, skin texture, and dark noise may require per-asset overrides recorded in source metadata, not hidden in the processing script.

### 7.1 EXIF policy

Default to removing GPS, camera serial number, creator workstation paths, thumbnails, and other private metadata. Retain only explicitly approved copyright/artist data. Store public captions and credits in content, not only in EXIF.

### 7.2 Color policy

Normalize web derivatives to sRGB and embed the profile when needed for consistency. Flag wide-gamut masters for visual comparison before conversion. Never silently apply automatic “enhancement,” denoise, sharpening, or generative edits.

## 8. Video architecture

### 8.1 Three assets per featured film

1. **Poster:** responsive still image variants in AVIF/WebP/JPEG.
2. **Preview:** short, heavily compressed, muted loop used on indexes/hero backgrounds; no audio track.
3. **Full film:** case-study-only progressive MP4 with audio when authorized.

No full film URL is rendered on Home or Motion index. This prevents browser preload heuristics from downloading it.

### 8.2 Encoding baseline

- MP4 container with H.264 video for broad browser support.
- AAC audio for full films; no audio stream in previews.
- `yuv420p` pixel format and web-compatible dimensions.
- `faststart`/moov atom at the beginning for progressive playback.
- Preview target: short loop, muted, conservative resolution/bitrate.
- Full-film target: at least one approved 1080p rendition; add lower renditions only if real playback testing justifies a selector or adaptive streaming.

Plain progressive MP4 is preferred for this low-traffic portfolio. HLS/DASH and a streaming service add operational complexity and are not required until full films, audience scale, or network testing prove otherwise.

### 8.3 Native playback state machine

```text
poster → preview-loading → preview-playing
                      ↘ preview-error → poster
user Watch → film-loading → film-playing ↔ film-paused
                       ↘ film-error → poster + retry/open fallback
```

`preload="metadata"` is the maximum default for full films. Preview autoplay requires `muted`, `playsInline`, and fallback handling. Audio starts only after the explicit Watch gesture. Route cleanup pauses the element, removes listeners, and releases any no-longer-needed source.

## 9. Three-level preload strategy

### Level 1 — critical

Loaded before the route entrance completes:

- logo/interface SVG;
- exact fonts needed above the fold;
- route hero/poster;
- first visible gallery image or first index stage.

Use HTML preload hints only for the known LCP image and essential fonts. Too many preloads are a failure.

### Level 2 — next viewport

Scheduled after Level 1 and initial interaction readiness:

- media likely to enter within roughly the next 1–1.5 viewports;
- the next gallery item and adjacent rail thumbnails;
- the next carousel slide;
- preview video only when its stage is near.

Use IntersectionObserver with a generous root margin and `image.decode()` before a reveal depends on the pixels.

### Level 3 — lazy

Everything else uses native lazy loading or is attached only near intersection. Full films remain metadata-only until the user explicitly requests playback.

The route transition waits only for Level 1. Levels 2 and 3 never block navigation.

## 10. R2 delivery configuration

### 10.1 Public access

- Delivery bucket is private by default, then exposed only through `media.example.com` as an R2 custom domain.
- Disable the `r2.dev` public development URL for production.
- Configure Cloudflare Cache for the custom domain; R2's custom domain is the production delivery path.

### 10.2 Object metadata

Every upload sets an accurate `Content-Type` and:

```text
Cache-Control: public, max-age=31536000, immutable
```

This is safe because filenames are content-hashed and never overwritten. Optional public manifest files use short cache settings or unique hashed names; the application itself does not fetch them at runtime.

### 10.3 CORS

Set bucket CORS for the production site and local development origins:

- allowed origins: `https://portfolio.example.com`, approved preview origin pattern if feasible, and `http://localhost:3000` during development;
- allowed methods: `GET`, `HEAD`;
- allowed headers: only those actually sent;
- expose: `Content-Length`, `Content-Range`, `Accept-Ranges`, `ETag`, `Cache-Control` when browser code needs them;
- max age: an approved long value.

When CORS changes after objects were cached, purge the media hostname so stale responses do not hide the new headers.

### 10.4 Video response verification

Before launch, verify through the custom domain—not only the S3 endpoint—that:

- MIME types are correct;
- seeking works;
- byte-range requests return expected partial responses;
- `Content-Length`, `Accept-Ranges`, and `Content-Range` behave correctly;
- playback starts before full download;
- cache headers survive 200 and range responses;
- cross-origin poster/video access works from the Pages domain.

## 11. Release flow and rollback

Media release:

1. prepare and validate derivatives locally or in a dedicated media job;
2. generate an upload plan and next manifest;
3. upload only missing hashed objects;
4. verify representative objects through `media.example.com`;
5. commit the manifest/content change to Git;
6. let Pages build the code release;
7. retain previous objects for a rollback window.

Code rollback selects an earlier Pages deployment whose bundled manifest still references retained objects. Because object keys are immutable, rollback does not require a media mutation.

Never delete objects merely because they are absent from the newest manifest. A separate garbage-collection report must confirm that no retained release references them.

## 12. Media validation failures that block a build

- content references an unknown media ID;
- image lacks width/height or all required fallback formats;
- variant width exceeds the source width;
- variant aspect ratios disagree;
- two media IDs resolve to the same semantic key accidentally;
- production manifest contains `/mock-media` paths;
- object key is unhashed or contains a camera filename;
- full film is referenced by a Home or index component;
- poster ID points to video or video ID points to image incorrectly;
- social image is not suitable for 1200 × 630 presentation;
- missing/empty alt text for meaningful photography, unless explicitly marked decorative.

## 13. Risks and mitigations

| Risk | Mitigation |
|---|---|
| R2 upload and code build get coupled | No credentials in Pages; manifest is the only handoff |
| CDN serves stale replaced asset | Never replace; hash filenames |
| Blank video hero | Always render poster first and preserve it on error |
| Layout shift | Manifest dimensions and aspect-ratio boxes |
| Oversized downloads | finite width ladder + audited `sizes` presets |
| EXIF privacy leak | explicit strip/retain policy and validation report |
| Broken cross-origin playback | custom-domain CORS/range smoke test before launch |
| Git repository bloat | masters and production derivatives stay outside Git |

## 14. Official platform references

- R2 public buckets and custom domains: <https://developers.cloudflare.com/r2/buckets/public-buckets/>
- R2 CORS: <https://developers.cloudflare.com/r2/buckets/cors/>
- R2 upload methods and metadata: <https://developers.cloudflare.com/r2/objects/upload-objects/>
- Cloudflare cache with R2: <https://developers.cloudflare.com/cache/interaction-cloudflare-products/r2/>

