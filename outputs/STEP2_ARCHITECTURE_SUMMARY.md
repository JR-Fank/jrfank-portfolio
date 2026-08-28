# Step 2 — Architecture & Implementation Specification Summary

Step 2 is complete. Step 1 was treated as authoritative and was not repeated. No application implementation, media upload, infrastructure mutation, or new reference capture was performed.

## Specifications delivered

- [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md)
- [`docs/MEDIA_ARCHITECTURE.md`](../docs/MEDIA_ARCHITECTURE.md)
- [`docs/CONTENT_SCHEMA.md`](../docs/CONTENT_SCHEMA.md)
- [`docs/ANIMATION_ARCHITECTURE.md`](../docs/ANIMATION_ARCHITECTURE.md)
- [`docs/DEPLOYMENT.md`](../docs/DEPLOYMENT.md)

## 1. Hardest five interactions

1. **Motion BTS long-scroll sequence** — the audited 5,400 px desktop / 400 vh compact stage requires stable pinning, media readiness, and responsive recalculation.
2. **Stills gallery and thumbnail rail** — active-item detection, fragment navigation, variable image ratios, fixed rail behavior, and Lenis scrolling must stay synchronized.
3. **Motion hero playback** — poster, muted preview, full film, audio permission, loading/error state, reframe, and pause/resume need one deterministic native-video controller.
4. **Global route-transition lifecycle** — the simple overlay still has to coordinate the 1,000 ms delay, animation teardown, route change, scroll reset, critical-media readiness, and rapid repeat clicks.
5. **Persistent F-stop/theme switch** — it must initialize before paint, preserve state across routes, show `F/24` desktop and `F/23` mobile before switching to `F/1.4`, and animate an original one-second aperture graphic.

## 2. Pure DOM + GSAP interactions

Use semantic DOM/CSS plus GSAP/ScrollTrigger for:

- Home hero, introduction, featured Stills, and featured Motion choreography;
- Stills/Motion index stages and palette presentation;
- About portrait, collage, and credentials;
- text/media reveals, parallax, filmstrip transforms, menu, footer, hovers;
- the full-screen route overlay;
- the original inline-SVG aperture animation.

No Three.js, WebGL, canvas renderer, GSAP Flip, or page-transition framework is justified.

## 3. Interactions requiring special implementation

- Stills rail: IntersectionObserver + real fragment links + Lenis `scrollTo` + GSAP presentation.
- Smooth scroll: one app-wide Lenis instance synchronized with the GSAP ticker and ScrollTrigger.
- Explore More: Splide 4 for loop/drag/keyboard/accessibility, with GSAP limited to decorative motion.
- Motion playback: native HTMLMediaElement state machine, poster fallback, explicit user-gesture audio.
- Critical readiness: central three-level preload coordinator using image decoding and video readiness.
- Long BTS: one measured, breakpoint-specific pinned master timeline; reduced motion becomes normal vertical flow.

## 4. Recommended framework

Use **Next.js App Router + TypeScript as a static site generator**, with:

```text
output: 'export'
trailingSlash: true
```

Why: it emits static HTML per project, gives route-level metadata/canonical/social previews, generates the finite slug set through `generateStaticParams()`, and retains a persistent client shell for GSAP/Lenis transitions. Vite React can match the visuals but needs another prerender/metadata layer to regain the required route behavior.

The recommended runtime dependencies are Next/React, GSAP + ScrollTrigger, Lenis, Splide 4, and Zod. No global state library, CMS SDK, UI framework, or server adapter is needed.

## 5. Recommended directory structure

```text
docs/                         specifications and audit
public/
  mock-media/                 development-only representative assets
  fonts/ icons/ _headers
scripts/
  validate-content.ts
  media/                      future preparation/upload scripts
src/
  app/                        static App Router pages and metadata
  animations/                 core, shared, home, stills, motion, about
  components/                 chrome, media, primitives, route sections
  content/                    site, home, about, stills, motion, schema
  generated/media-manifest.json
  lib/media.ts                sole media URL resolver
  styles/                     tokens, globals, typography, utilities
reference/                    Step 1 evidence; never imported/deployed
```

## 6. Cloudflare Pages fit

**Yes, fully for the stated scope.** Build with `npm run build`, publish `out/`, connect the GitHub `main` branch, and attach the custom domain. No Worker, Pages Function, OpenNext adapter, VPS, SSR, ISR, API, database, or long-lived server is required.

This answer changes if “private” means application-level authentication or if future scope adds request-time features. An unlisted or `noindex` static site is not access-controlled.

## 7. R2 media structure

Use immutable, content-hashed keys with semantic prefixes:

```text
v1/stills/{project}/{asset}/{asset}-{width}-{hash}.{avif|webp|jpg}
v1/motion/{project}/poster/...
v1/motion/{project}/preview/{asset}-{hash}.mp4
v1/motion/{project}/film/{asset}-{hash}.mp4
v1/motion/{project}/{frames|bts}/...
v1/about/...
v1/site/{home|social}/...
v1/manifests/media-manifest-v1-{hash}.json
```

Never expose camera filenames, never encode display order in IDs, and never overwrite hashed objects. Serve the bucket through `media.example.com`; disable the production `r2.dev` URL.

## 8. Image pipeline

The future pipeline is:

```text
owned master
→ semantic ID inventory
→ orientation/dimension/color validation
→ sRGB normalization
→ 640/1280/1920/2560 variants; rare approved hero at 3200
→ AVIF/WebP/JPEG encoding without upscaling
→ private EXIF removal; approved copyright retention
→ hash/dominant-color/blur/dimension manifest
→ decode and contact-sheet QA
→ immutable R2 upload
→ custom-domain header/CORS/range verification
```

The browser uses an explicit `<picture>` component backed by the manifest. Every image has known intrinsic dimensions and a semantic size preset, preventing CLS without a runtime image optimizer.

## 9. Biggest technical risks

1. Font metric drift changes line wrapping and all downstream scroll geometry.
2. Unfinalized media ratios, crops, focal points, codecs, and durations block faithful tuning.
3. Long pinned Motion sequences can jump after fonts/media/mobile viewport changes.
4. Persistent App Router layouts can leak ScrollTriggers, observers, RAF callbacks, and video listeners without strict scopes.
5. Incorrect R2 MIME, CORS, immutable cache metadata, MP4 fast-start, or byte-range behavior can make valid media fail in production.
6. A later request-time Next.js feature would break the Pages-only static topology.

## 10. Missing before coding for production fidelity

- approved route/project list, public order, and bilingual copy;
- licensed Roslindale/Mint files or approval of a legal substitute bakeoff;
- owned photography/video masters and rights confirmation;
- final alt text, captions, credits, and copyright;
- approved dark/light palette and confirmation that desktop `F/24` vs mobile `F/23` is intentionally preserved;
- final site domain and media subdomain;
- OG selections/crops and media focal points;
- Motion poster frames, audio policy, durations, credits, and full-film availability;
- contact email and external links;
- decision whether “private” means unlisted/noindex or real access control.

Safe scaffolding can begin with mock content and `/public/mock-media/`, but production calibration and launch should wait for these inputs.

## Architecture outcome

The recommended build is deliberately static and narrow: typed local content, finite audited composition blocks, server-rendered-at-build route shells, client-only animation leaves, a single animation lifecycle, a single media resolver, and fully decoupled Pages/R2 releases.

