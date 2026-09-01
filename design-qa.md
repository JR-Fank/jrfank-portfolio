# STEP 3C-R1 Design QA

## Comparison target

- Source visual truth: `reference/desktop/1440x900/home/000.jpg` through `100.jpg`, and `reference/mobile/390x844/home/000.jpg` through `100.jpg`.
- Rendered implementation: `http://localhost:4173/` from the checked static export.
- Desktop implementation evidence: `outputs/step3c-r1-validation/final-desktop/`.
- Mobile implementation evidence: `outputs/step3c-r1-validation/final-mobile/`.
- True side-by-side evidence: `outputs/step3c-r1-validation/comparisons/desktop/` and `outputs/step3c-r1-validation/comparisons/mobile/`.
- State: dark theme, menu closed, route idle, Home scroll checkpoints 0% through 100% in 10% increments.

## Viewport and normalization

- Desktop source: 1440 x 900 pixels at a 1440 x 900 CSS viewport, density 1.
- Desktop implementation: browser CSS viewport verified as 1440 x 900 with `scrollWidth === 1440`; the in-app capture surface emitted 1391 x 900 raster frames. Those raw frames are retained, and comparison-only copies in `final-desktop-normalized/` were normalized to 1440 x 900.
- Mobile source and implementation: 390 x 844 pixels at a 390 x 844 CSS viewport, density 1; no normalization was required.
- Desktop scroll height: 6661 pixels. Mobile scroll height: 5066 pixels. Captures use the same normalized 0%–100% document progress as the Reference evidence.

## Full-view comparison evidence

- Desktop contact sheet: `outputs/step3c-r1-validation/comparisons/desktop-reference-local-contact-sheet.jpg`.
- Mobile contact sheet: `outputs/step3c-r1-validation/comparisons/mobile-reference-local-contact-sheet.jpg`.
- Individual combined comparisons are retained for all 22 viewport/checkpoint combinations.

## Focused comparison evidence

- H01 desktop/mobile: `comparisons/desktop/000-reference-local.jpg`, `comparisons/mobile/000-reference-local.jpg`.
- H02 entrance and settled states: desktop/mobile `010-reference-local.jpg` and `020-reference-local.jpg`.
- H03/H04 paired-media choreography: desktop/mobile `030` through `080` comparisons.
- H05 and footer arrival: desktop/mobile `090-reference-local.jpg` and `100-reference-local.jpg`.

Focused comparisons were required because the full contact sheets make display-font metrics, inline-media proportions, mobile title wrapping, palette geometry, and satellite-image placement too small to judge reliably.

## Required fidelity surfaces

- Fonts and typography: the calibrated Cormorant Garamond, IBM Plex Sans, and Noto Sans TC token stack preserves the Reference hierarchy and current line structure. Roslindale/Mint construction and optical density remain an accepted non-actionable P2 until licensed originals are supplied.
- Spacing and layout rhythm: H01–H05 retain the audited viewport heights, dominant gutters, sticky stages, central title columns, media radii, and negative-space cadence. The mobile H01 line structure and H03/H04 clear center column were corrected in the final pass.
- Colors and visual tokens: dark/light tokens, white media-overlay copy, compact five-segment project palettes, and theme-aware chrome match the observed functional roles.
- Image quality and asset fidelity: every Reference photographic role is represented by original project-owned raster mock media with responsive WebP/JPEG derivatives. No abstract CSS/SVG stand-in remains in H01 or H02. Subject matter is intentionally different and accepted until final owned media is supplied.
- Copy and content: identity, biography, project names, metadata, and bilingual copy are project-owned and content-driven. Their different lexical widths are intentional and remain replaceable.

## Findings

- No actionable P0 issues remain.
- No actionable P1 issues remain.
- No actionable P2 issues remain within the authorized media/font scope.
- Accepted P2 constraint: substitute display/UI/Traditional Chinese fonts cannot exactly reproduce licensed Roslindale/Mint/system metrics.
- Accepted P2 constraint: temporary original mock photographs reproduce geometry and crop weight, not protected Reference subjects or final project art direction.
- P3: some identity/project-copy widths and the exact intermediate mobile scroll-phase silhouettes differ slightly from the Reference while preserving the same section choreography.

## Comparison history

### Pass 0 — interrupted baseline

- Earlier finding: H01 used an abstract visual field and incorrect role-copy metrics; H02 used a different editorial composition; H03–H05 included abstract stand-ins; palette dots did not match the compact strips.
- Fix: replaced H01 with a dominant photographic Hero, rebuilt H02 as three controlled editorial lines with three inline photographs, replaced H03–H05 stand-ins with original photographic mock media, and changed project palettes to compact segmented strips.
- Evidence: `baseline-desktop/`, `baseline-mobile/`, and the corresponding `final-*` captures.

### Pass 1 — matched-state correction

- P1: mobile H01 centered and wrapped the role copy into four visual lines instead of the Reference-like left-aligned three-line structure.
- P2: H02 heading and biography density were visibly too small, especially at 390 x 844.
- P1: mobile H03/H04 images were too wide and crowded the central editorial title column.
- Fix: added content-driven mobile Hero line breaks, left-aligned the mobile Hero copy, increased H02 display/body metrics, and reduced/repositioned mobile paired-media widths to restore the central column.
- Post-fix evidence: `comparisons/mobile/000-reference-local.jpg`, `020-reference-local.jpg`, `040-reference-local.jpg`, and `060-reference-local.jpg`.

### Pass 2 — final verification

- H01–H05 were re-captured at every 10% desktop and mobile checkpoint.
- No wrong architecture, unusable interaction, clearly different macro composition, or actionable spacing/scale/crop/timing mismatch remains.
- Remaining differences are the accepted font/media constraints and P3 copy/phase polish listed above.

## Runtime verification

- Repeated Home to Stills, Motion, About, and Stills case-study lifecycles returned to one Home root, one route-content surface, and one transition overlay without DOM growth.
- Browser Back restored Home from About to `scrollY` 1754 after leaving at 1752; Forward returned to About at the top.
- Desktop and mobile F-stop states passed, including light-theme Hero contrast and cross-route persistence.
- Mobile menu passed audited geometry, focus trap, inert state, Escape close, focus restoration, and F/23 label behavior.
- Reduced motion showed H01/H02 content at opacity 1 with no transforms and completed the tested route change within the 250 ms observation window.
- Browser console review returned zero warnings, errors, or hydration messages.
- `npm run check` passed typecheck, content validation, optimized build, and all 11 static/SSG pages.

## Implementation checklist

- [x] Resolve all P0 and P1 structural fidelity findings.
- [x] Resolve technically reasonable P2 scale, spacing, wrapping, and crop findings.
- [x] Validate 1440 x 900 and 390 x 844 at all required checkpoints.
- [x] Verify route, theme, menu, reduced-motion, Back/Forward, console, and static-export behavior.
- [x] Preserve project-owned content and legally generated/authorized media only.

final result: passed
