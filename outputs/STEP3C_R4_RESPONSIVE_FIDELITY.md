# STEP 3C-R4 — Fluid Responsive and Live Resize Fidelity

## Result

STEP 3C-R4 passes the required 360–1920 px fixed-viewport matrix, a no-reload 1440 → 360 → 1440 live-resize cycle, resize-while-active ProjectStage validation, forward/reverse motion sampling, R3 regression checks, runtime/lifecycle checks, `npm run check`, and static export verification.

The validated global runtime architecture remains unchanged. No new Lenis instance, GSAP ticker, route scope, resize listener, animation breakpoint, or global subsystem was introduced. STEP 3D was not started.

## Root cause

ProjectStage used fixed `xPercent` endpoints of `-138%` and `138%`. Those distances scale only with the media element width, while the required exit distance depends on the current stage/viewport width, the media's current offset, and the media width. Because desktop media was also capped at 600 px, a transform calibrated near 1440 px could leave part of a photograph onscreen at wider viewports and could become stale after live resize.

The same timelines did not opt into `invalidateOnRefresh`, so viewport-dependent values were not guaranteed to be recomputed when the existing controlled resize lifecycle refreshed ScrollTrigger. Broad two-axis `overflow: clip` and discontinuous small-screen type sizes made intermediate-width failures harder to distinguish from intentional clipping.

## ProjectStage responsive geometry

Fixed horizontal percentages were replaced with function-based pixel geometry measured from the current stage and element boxes:

```text
overshoot = clamp(16px, stage width × 0.02, 44px)
close offset = min(media width × 0.34, stage width × 0.22)
left exit = -(left offset + left width + overshoot)
right exit = stage width - right offset + overshoot
```

The left/right timelines retain the R2/R3 progression, rotations, vertical tracks, `scrub: 0.45`, overlap, reversible direction, and non-collapsing bottom state. Only the horizontal measurement source changed. Function values are recalculated by GSAP after refresh and both ProjectStage triggers now use `invalidateOnRefresh: true`.

Detailed forward samples at 1920×1080, 992×800, 991×800, 767×1024, 390×844, and 360×800 were strictly monotonic: left x decreased at every sample and right x increased at every sample. Both items were fully beyond their viewport edges at progress 0.98. Reverse scrolling returned both items to the progress-0.40 coordinates with a measured 0 px round-trip delta at every sampled width. No dead-scroll plateau or bottom re-collapse was observed.

## Media sizing

Project media now preserves large editorial scale while varying continuously:

```css
/* desktop / compact desktop */
width: clamp(400px, 42vw, 680px);
height: min(80svh, 760px);

/* structural mobile layout at 767px */
width: clamp(240px, 58vw, 440px);
height: 60svh;
max-height: 540px;
```

Measured examples were 680×760 at 1920×1080, 605×720 at 1440×900, 416×640 at 991×800, 440×540 at 767×1024, 240×506 at 390×844, and 240×480 at 360×800. The allowed 767 px structural change retains stronger side-media tension rather than shrinking the composition into a conventional centered column.

## Fluid typography and overflow

- Home mobile Hero: `clamp(3rem, 9.9vw, 5rem)`.
- Home project titles: `clamp(3.65rem, 9.8vw, 5.6rem)`.
- Home motion heading: `clamp(3.8rem, 9.9vw, 5.5rem)`.
- About Hero: `clamp(7.5rem, 12vw, 14rem)` generally and `clamp(6rem, 22vw, 7.5rem)` in the mobile composition.
- About statement: `clamp(4.2rem, 10.6vw, 5.1rem)`.
- About story heading: 3.5rem in the mobile composition.
- About information headings: `clamp(4rem, 9.4vw, 4.5rem)`.

Redundant 479 px font jumps were removed. Existing content-driven line groups and the audited 991/767/479 structural breakpoints remain; no additional arbitrary breakpoint set was added.

`.home` and `.about` now clip only accidental horizontal overflow and keep vertical overflow visible. Media wrappers still clip their own rounded image surfaces, which is intentional. The About film strip may extend inside its controlled window, but the document itself remains exactly viewport width.

## ScrollTrigger refresh and matchMedia strategy

The existing global resize provider remains the single owner of resize work. It coalesces browser resize events through one animation frame, calls `Lenis.resize()`, then calls `ScrollTrigger.refresh()`. R4 adds no new resize listener or debounce system.

ProjectStage values are functions of current DOM geometry and use `invalidateOnRefresh: true`. The two About scroll timelines now also invalidate their measurements on refresh. The existing `gsap.matchMedia()` division between standard and reduced motion remains sufficient; width modes are handled by fluid CSS plus the three audited structural breakpoints, so no duplicate desktop/tablet/mobile animation timelines were introduced.

## Fixed viewport matrix

Every row passed Home and About. Home criteria included document overflow, navigation collision, Hero/video state, active H03 side-media visibility, center-copy containment, and finite transforms. About criteria included zero document overflow, navigation collision, all A01–A09 sections, and contained editorial information headings.

| Viewport | Home | About | Document overflow | Navigation collision |
| --- | --- | --- | --- | --- |
| 1920×1080 | PASS | PASS | 0 px | none |
| 1680×1050 | PASS | PASS | 0 px | none |
| 1536×960 | PASS | PASS | 0 px | none |
| 1440×900 | PASS | PASS | 0 px | none |
| 1366×768 | PASS | PASS | 0 px | none |
| 1280×800 | PASS | PASS | 0 px | none |
| 1180×820 | PASS | PASS | 0 px | none |
| 1100×800 | PASS | PASS | 0 px | none |
| 1024×768 | PASS | PASS | 0 px | none |
| 992×800 | PASS | PASS | 0 px | none |
| 991×800 | PASS | PASS | 0 px | none |
| 820×1180 | PASS | PASS | 0 px | none |
| 768×1024 | PASS | PASS | 0 px | none |
| 767×1024 | PASS | PASS | 0 px | none |
| 600×900 | PASS | PASS | 0 px | none |
| 479×844 | PASS | PASS | 0 px | none |
| 430×932 | PASS | PASS | 0 px | none |
| 390×844 | PASS | PASS | 0 px | none |
| 360×800 | PASS | PASS | 0 px | none |

The desktop navigation retained the left primary group, centered wordmark, and right utility/F-stop group through 992 px without overlap. The audited compact structure activated at 991 px and remained collision-free.

## Live resize while inside H03

The same browser page was positioned at H03 progress 0.42 and resized without reload through:

```text
1440 → 1366 → 1280 → 1180 → 1100 → 1024 → 992 → 991 → 900 → 820
→ 768 → 767 → 600 → 479 → 430 → 390 → 360
→ 390 → 430 → 479 → 600 → 767 → 768 → 820 → 900 → 991 → 992
→ 1024 → 1100 → 1180 → 1280 → 1366 → 1440
```

The page held `scrollY: 1891` throughout. The structural switch moved normalized H03 progress from 0.420 to 0.449 as the section height changed, which is expected, but refreshed transforms remained synchronized. At every step:

- both side images remained present and intentionally visible;
- both transforms were finite and recomputed;
- center copy remained inside the viewport;
- document overflow remained 0 px;
- no stale sticky state, sudden media loss, dead-scroll interval, or duplicate trigger appeared;
- reverse resizing restored the same visible geometry at matching widths.

At 1440 px each side retained 529.6 px of visible width at the active sample. At 360 px each retained 141.4 px. The reverse samples returned the same values.

## Trigger and lifecycle counts

Dev-only diagnostics were validated after the local dependency cache was warmed. One first attempt hit an OS filesystem `ETIMEDOUT` reading a local dependency; the application portion of that failed request was 39 ms and it produced no application diagnostic. The successful diagnostics run then reported:

- Home: 1 Lenis instance, 1 GSAP ticker driver, 1 active route scope, exactly 5 ScrollTriggers.
- About: 1 Lenis instance, 1 GSAP ticker driver, 1 active route scope, exactly 2 ScrollTriggers.
- All 33 forward/reverse live-resize samples: exactly 5 Home ScrollTriggers.
- Three Home → About → Home cycles: `5 / 2 / 5 / 2 / 5 / 2 / 5`, with Lenis/ticker/scope fixed at `1 / 1 / 1`.
- Reduced motion: `0 / 0 / 1 / 0` for Lenis/ticker/scope/triggers.
- Returning to standard motion: `1 / 1 / 1 / 5`.

No lifecycle growth was found.

## R3 regression

- Hero expansion remains 650–1650 ms, `scale(0.28) → scale(1)`.
- Title line windows remain 1150–1450, 1550–1850, and 1850–2060 ms.
- Title blur remains 10 px → 0 px; all lines resolve sharp.
- All three H02 media glyphs remain layout-stable and reach scale 1.8 after 280 ms.
- Enter blur remains 0 → 9 → 0 px; hover-out remains 200 ms with transient 0 → 6 → 0 px blur.
- Hero video remained autoplaying, muted, looping, `playsInline`, ready state 4, with poster/fallback markup retained.
- Back/Forward restored Home to the measured scrollY 700 and About to 0.
- Light F-stop theme switched to `#e8e5f0`, persisted across reload, and reset correctly.
- Mobile menu made route content inert, focused the first menu link, closed with Escape, and restored trigger focus.
- Reduced motion showed content at opacity 1 with no entrance transforms or CSS animation.
- About retained all A01–A09 sections at all 19 viewports.
- Production console warnings/errors, runtime exceptions, hydration errors: 0.

## Check and static export

`npm run check` passes:

- `tsc --noEmit`;
- content/media validation: 2 placeholder projects and 13 media assets;
- optimized Next.js 16.3.3 compile;
- TypeScript build phase;
- 11/11 static/SSG pages.

`.next/export-detail.json` reports `"success": true`. The final export was generated at 2026-09-04 19:19:52 local time. The exported `/`, `/about/`, `/motion/`, `/motion/project-01/`, `/stills/`, and `/stills/project-01/` routes each returned HTTP 200. A post-build Chrome smoke run loaded Home and all nine About sections with zero console/runtime issues.

## Validation recordings

- `outputs/STEP3C_R4_LIVE_RESIZE_1440_TO_360_TO_1440.mp4`
  - H.264 High, 1440×900, yuv420p, 25 fps, 36.00 seconds, 4,172,581 bytes.
  - SHA-256: `8ed06d89c94c1ecf2773dfb158da252b3951474ab5e6b88be727fcfe920ae9ba`.
  - Shows H03 active through the full 1440 → 360 → 1440 in-place resize cycle.
- `outputs/STEP3C_R4_MOTION_1440x900.mp4`
  - H.264 High, 1440×900, yuv420p, 25 fps, 39.16 seconds, 9,597,435 bytes.
  - SHA-256: `b57c49d0c569b96f412eeea99f6ffa5bb840f0588ea260fd2657bfbb843743de`.
  - Shows current Hero/H02, all three inline-media interactions, slow H03/H04 forward travel, project transition, and reverse travel.

Both files decode without ffmpeg errors. The live-resize file keeps a 1440×900 recording raster; gray matte at narrower page viewports is the recorder's fixed canvas, not document overflow.

## Remaining P1 / P2 / P3 issues

- P0: none.
- Responsive P1: none; the disappearing/stale ProjectStage media defect is resolved.
- Remaining content P1: the Hero loop is still clearly marked temporary project-owned validation media; final user-supplied footage is required before production release.
- P2: Cormorant Garamond, IBM Plex Sans, and Noto Sans TC remain legal replaceable substitutes; their metrics are not identical to Roslindale, Mint Grotesk, and the final licensed Traditional Chinese choice.
- P2: final identity copy and the complete approved photography archive remain unavailable; final assets may require line-break and image-specific color recalibration.
- P3: project-owned mock subjects and silhouettes necessarily differ from protected Reference photography.
- P3: both validation recordings are 25 fps evidence rather than the 59.92 fps source-reference cadence; human review should still judge final micro-easing in live Chrome.

## Safety audit

The final changed set contains only the six scoped TypeScript/CSS files, this report, and the two required validation recordings. It contains no Reference production asset, copied commercial font, `.env` file, Cloudflare/R2 credential, token, private key, RAW/private media master, EXIF location data, or unexpected generated cache/junk. Temporary validation scripts, original recorder streams, contact sheets, `.next`, and `out` remain ignored.

Final commit hash: supplied in the final handoff because a commit cannot embed its own resulting hash without changing that hash.

## Stop point

STEP 3C-R4 implementation and validation are complete. Work stops here for human review. STEP 3D has not started.
