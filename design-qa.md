# STEP 3C-R2 Design QA

## Comparison target

- Source visual truth: `reference/desktop/1440x900/home/030.jpg` through `080.jpg`, `reference/mobile/390x844/home/050.jpg` through `070.jpg`, the STEP 1 interaction evidence, and the supplied 60 fps review observations.
- Rendered implementation: `http://localhost:4173/` from the checked static export.
- Desktop implementation evidence: `outputs/step3c-r2-validation/final/desktop/`.
- Mobile implementation evidence: `outputs/step3c-r2-validation/final/mobile/`.
- True combined comparisons: `outputs/step3c-r2-validation/comparisons/desktop/`.
- State: dark theme, menu closed, forward and reverse project scroll, plus H02 normal/hover/release.

## Viewport and normalization

- Desktop source: 1440 x 900 pixels at a 1440 x 900 CSS viewport, density 1.
- Desktop implementation: CSS viewport verified at 1440 x 900 with no horizontal overflow. The in-app capture surface emitted 1392 x 900 JPEG rasters; comparison-only copies were normalized to 1440 x 900 before side-by-side composition.
- Mobile source and implementation: 390 x 844 pixels at a 390 x 844 CSS viewport, density 1; no normalization was required.
- Document dimensions remain 6661 px desktop and 5066 px mobile, retaining the audited section cadence.

## Full-view comparison evidence

- Desktop project-motion contact sheet: `outputs/step3c-r2-validation/comparisons/desktop-project-motion-contact-sheet.jpg`.
- Individual Reference/Local comparisons cover H03 entry, H03 center, project overlap, H04 entry, H04 center, and H04 exit/H05 entry.

## Focused comparison evidence

- H02 normal/hover/release: `outputs/step3c-r2-validation/final/desktop/h02-normal.jpg`, `h02-hover-1.jpg`, `h02-hover-2.jpg`, `h02-hover-3.jpg`, and `h02-release.jpg`.
- Forward project trajectory: `outputs/step3c-r2-validation/final/desktop/forward-*.jpg`.
- Reverse project trajectory: `outputs/step3c-r2-validation/final/desktop/reverse-*.jpg`.
- Mobile project trajectory: `outputs/step3c-r2-validation/final/mobile/`.

Focused evidence was required because a static normalized-scroll contact sheet hid the long no-motion interval reported in the 60 fps review. The final pass therefore measured media coordinates at short forward and reverse scroll increments in addition to judging screenshots.

## Required fidelity surfaces

- Fonts and typography: the R1 substitute font stack, line breaks, title hierarchy, and metadata density are unchanged. Licensed Roslindale/Mint metric differences remain an accepted external constraint.
- Spacing and layout rhythm: H01/H02 geometry, 205 svh desktop and 134 svh mobile project heights, sticky 100 svh stage, media radii, and central title column remain unchanged. Only the scroll-to-transform mapping changed.
- Colors and tokens: normalized blank-region sampling returned a Reference median near RGB 19/20/22. The prior Local median was 16/17/19; the corrected Local median is 18/19/21. The dark token changed from `#0e1012` to `#111315`, with the matching transition/nav dark surfaces updated. Light mode remains `#e8e5f0` and Hero overlay copy remains white.
- Image quality and asset fidelity: all R1 original project-owned mock photographs and crops are unchanged. No new production asset, CSS/SVG substitute, or copied Reference asset was introduced.
- Copy and content: all project-owned English and Traditional Chinese strings remain content-driven and unchanged.
- Interaction states: all three H02 images scale to 1.8 without changing their 64 x 80, 64 x 80, and 120 x 80 layout boxes. Enter is 380 ms and release is 460 ms with a power3-out-equivalent cubic curve; z-index remains elevated through release.
- Accessibility/responsiveness: hover is gated by `(hover: hover) and (pointer: fine)`. Reduced motion clears Home transforms and keeps every section visible. Desktop and mobile have zero horizontal overflow.

## Findings

- No actionable P0 issue remains.
- No actionable P1 issue remains. The project dead-scroll interval and abrupt A-to-B handoff are resolved.
- No actionable P2 motion issue remains.
- Accepted P2 constraints: substitute font metrics and temporary owned mock-photo subjects remain different from the protected Reference materials.
- P3: exact image-edge silhouettes differ because Local uses different photographic subjects/aspect crops, and ScrollTrigger scrub smoothing can trail a very fast wheel impulse by a fraction of a second. Slow continuous and reverse input remain spatially continuous.

## Comparison history

### Pass 0 — R1 motion baseline

- P1: each project timeline ran for 2.0 normalized units, but side-media entry ended at 0.62 and exit did not begin until 1.38. Across the audited 205 svh desktop section this created about 970 px of document travel with unchanged side-media transforms.
- P1: adjacent projects overlapped only at the late exit/entry boundary, after the frozen interval, making the handoff read as a threshold change in motion.
- P1: H02 photographic glyphs had no hover enlargement.
- P2: the rendered dark background was about three RGB levels darker than the normalized Reference blank regions.

### Pass 1 — continuous project architecture

- Fix: replaced split entry/hold/exit tweens with one continuous start-to-end spatial trajectory for each side image.
- Fix: project triggers now run from `top bottom` to `bottom top` with `scrub: 0.45`; no GSAP pin or pin spacing is used. CSS sticky remains solely as the central/stage anchor.
- Fix: adjacent H03/H04 active ranges overlap by one viewport (900 px desktop, 844 px mobile), so outgoing and incoming media coexist and reconstruct identically in reverse.
- Post-fix evidence: every sampled 149–200 px desktop step and 189–191 px mobile reverse step changed the active media coordinates; no constant-value interval remained.

### Pass 2 — hover, tone, and final visual comparison

- Fix: separated H02 scroll entrance transforms from hover transforms with an inner scaler, avoiding competing transform owners and text reflow.
- Fix: calibrated hover to 1.8 scale, 380 ms enter, 460 ms leave, centered origin, retained clipping radius, and delayed z-index release.
- Fix: updated the measured dark token and revalidated light mode.
- Post-fix evidence: combined Reference/Local project frames, five H02 states, desktop/mobile forward and reverse trajectories, and runtime regression all pass.

## Runtime verification

- Home source ownership remains one Lenis provider, one GSAP ticker driver, and one route scope. Global runtime source files were not modified.
- Home retains five standard-motion ScrollTriggers: Hero departure, H02 reveal, H03, H04, and H05. Reduced motion creates no Home scroll transforms.
- Repeated Home/Stills/Home, Home/Motion/Home, Home/About/Home, and Home/case/Home cycles retained one route-content root, one transition overlay, ten body children, and no horizontal growth.
- Back restored Home to scrollY 1497 after leaving at 1496; Forward returned to About at scrollY 0.
- Theme persistence, white light-mode Hero copy, desktop/mobile F-stop labels, mobile menu 24/64/342 x 326 geometry, link order, Escape close, and focus restoration pass.
- Reduced motion rendered all Hero/project elements at opacity 1 with no transforms and completed the tested route change within the 250 ms observation window.
- Production console review returned zero warnings, errors, or hydration messages.
- `npm run check` passed strict TypeScript, content validation, optimized build, and all 11 static/SSG pages. Eight tested export URLs returned HTTP 200.

## Implementation checklist

- [x] Remove all project dead-scroll intervals.
- [x] Preserve continuous forward and reverse spatial motion.
- [x] Make outgoing/incoming project media overlap without a content swap or opacity-only transition.
- [x] Add non-reflowing pointer hover for all three H02 images.
- [x] Correct the measured dark background tone and recheck light mode.
- [x] Validate desktop, mobile, reduced motion, routes, theme, menu, console, and static export.

final result: passed
