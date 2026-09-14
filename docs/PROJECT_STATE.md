# Project State

Stable-state update: **PRODUCTION MEDIA FOUNDATION — APPROVED**. The human-approved `production-media` candidate at `e628abf2a0b73282e217d440faef5661ad5aef46` is squash-promoted to `main` as `feat: establish production media foundation`. The repository now contains the approved typed media intake, deterministic image/manifest preparation, video validation, immutable R2 publishing, safety guards, and Cloudflare/Admin architecture contracts. No Cloudflare resource was created, no R2 request was made, no production binary was committed, and no route or content selection was switched away from `/mock-media` during promotion.

Stable-state update: STEP 3E — MOTION EXPERIENCE has passed final human visual review. The approved `step3e-motion` source branch is squash-promoted to `main`; its detailed implementation and checkpoint history remains on the phase branch. The Home/About measurements below remain historical validation evidence.

## Current status

- **PRODUCTION MEDIA FOUNDATION — APPROVED and squash-promoted to `main`.**
- Approved source branch: `production-media`; approved candidate: `e628abf2a0b73282e217d440faef5661ad5aef46`.
- Foundation verification passes `npm run check`, including the unchanged 18/18 static export, manifest/content validation, client secret scan, and production-binary tracking guard.
- Real Cloudflare resources/domains, final production media, an actual R2 publish, the final content switch, and the future protected Online Admin remain unresolved.
- **STEP 3E — MOTION EXPERIENCE: HUMAN APPROVED**.
- **STEP 3E-A — MOTION INDEX: HUMAN APPROVED**.
- **STEP 3E-B — MOTION CASES: HUMAN APPROVED**.
- Approved source branch: `step3e-motion`.
- Human-approved STEP 3E-A candidate: `9bd2b2a1a320e348a2650cca0dd171db86c43d01`.
- Human-approved STEP 3E-B candidate: `6801ea21446dddd27d4e3120713d52a614a72c93`.
- Motion Index structure and STEP 3E-A-R1 pacing are approved.
- Final measured Motion Index height: 6,463 px at 1440×900 and 5,269 px at 390×844.
- The poster-only Motion Index policy remains authoritative: no index autoplay/video, iframe or full-film request.
- All five Motion projects remain explicitly temporary development content.
- Motion cases, playback, filmstrips, credits, Behind the Scenes and Explore More behavior are approved.
- P1 final project-owned films and approved audio policy remain unresolved.
- Stable baseline: the `main` squash-promotion commit `feat: approve step 3e motion experience`, tagged `step3e-motion`.
- **STEP 3D — STILLS: APPROVED**.
- Approved source branch: `step3d-stills`.
- Approved candidate: `2b146ad14ecb3d093aea3d0797798b2c2b555b2d`.
- Stable baseline: the `main` squash-promotion commit `feat: approve step 3d stills experience`, tagged `step3d-stills`.
- The source branch retains the implementation, WIP and checkpoint history. Promotion preserves the approved application files without further implementation or visual changes.
- STEP 3C-R4 remains the historical Home/About baseline at `e4cf461f6e0b4f437a28f04629ae07864d86a67b`, tagged `step3c-r4-responsive`.
- `../outputs/STEP3D_STILLS_SUMMARY.md` and `../outputs/STEP3D_STILLS_FIDELITY.md` retain the approved candidate's validation evidence. Their candidate/awaiting-approval wording is historical; this approval record supersedes it.

## Completed phases

1. STEP 1 — Reference Audit
2. STEP 2 — Architecture
3. STEP 3A — Foundation
4. STEP 3B — Global Experience
5. STEP 3B.5 — Baseline Lock
6. STEP 3C — Home
7. STEP 3C-R1 — Visual correction
8. STEP 3C-R2 — Motion correction
9. STEP 3C-R3 — First-entry, hover, and About
10. STEP 3C-R4 — Fluid responsive behavior and live resize
11. STEP 3D — Stills (human-approved and merged)
12. STEP 3E-A — Motion content foundation and Motion Index (human-approved)
13. STEP 3E-B — Motion cases (human-approved and merged as part of STEP 3E)
14. Production Media Foundation (human-approved and squash-promoted)

## Approved Production Media Foundation systems

- Typed, Git-tracked media intake catalog with constrained roles and bilingual metadata.
- Sharp image preparation with orientation normalization, sRGB conversion, private metadata removal, and no upscaling.
- Semantic immutable object keys containing content hashes.
- AVIF, WebP, and JPEG production derivatives on the approved width ladder.
- Deterministic production manifest candidate and upload-plan tooling.
- H.264/yuv420p/faststart video command planning and ffprobe validation with explicit audio policy.
- Credential-free R2 publish dry-run.
- Conditional immutable R2 publishing with atomic `If-None-Match: *` creation and exact remote verification.
- Client-output secret scanning and repository binary tracking guards.
- Cloudflare Pages/R2 owner operations documentation.
- Separate future protected Online Admin architecture contract.

The foundation approval does not create or configure Cloudflare resources, publish media, supply final production assets, switch current content away from `/mock-media`, or authorize the Online Admin subphase. `../outputs/PRODUCTION_MEDIA_FOUNDATION_SUMMARY.md` preserves the approved candidate evidence; its awaiting-review label is historical and is superseded by this approval record.

## Approved STEP 3E systems

- Independent typed Motion content/schema foundation and validator.
- Five data-driven temporary-development Motion projects and static routes.
- Poster-only Motion Index with no index autoplay/video, iframe or full-film request.
- M01 introduction and M02–M06 project stages.
- One main poster plus three visible satellites per stage.
- Approved title presets, play/CTA treatment and deliberate mobile bleed.
- Continuous reversible parallax and STEP 3E-A-R1 stage pacing.
- Final production document heights of 6,463 px at 1440×900 and 5,269 px at 390×844.
- Responsive/live-resize, reduced-motion, lifecycle and 18/18 static-export validation.
- Five shared data-driven Motion case-study routes.
- One native poster/preview/full-film playback controller; full-film source assignment is deferred until Watch.
- Native-event-driven Watch, Pause, Resume and Retry behavior with route-leave media cleanup.
- Two opposed filmstrip rows and content-driven bilingual credits.
- One pinned Behind the Scenes stage with one eight-beat master timeline.
- Reduced-motion Behind the Scenes content in normal document flow.
- Motion Explore More with two desktop cards and one mobile card, including authored and cloned route-transition links.
- Motion case responsive/live-resize behavior and lifecycle/resource cleanup.

The approved STEP 3E-A implementation candidate is `9bd2b2a1a320e348a2650cca0dd171db86c43d01`; the approved STEP 3E-B candidate is `6801ea21446dddd27d4e3120713d52a614a72c93`. See the STEP 3E-A and STEP 3E-B reports in `../outputs/` for preserved validation and fidelity evidence. The phase branch retains the detailed A/B/checkpoint history; the stable `main` promotion is one squash commit containing the approved application tree.

## Approved STEP 3D systems

- Stills index.
- Four placeholder Stills cases and the editorial case renderer.
- Asymmetric galleries and sticky mini rail.
- Active IntersectionObserver tracking.
- Numeric and `#last` hash navigation with history restoration.
- Explore More carousel and case navigation.
- Fluid responsive behavior, including live resize.
- Reduced-motion fallback.
- Lifecycle validation.
- Static export.

Existing approved browser evidence remains authoritative: 13 Stills index viewports, four desktop/mobile cases, direct hash and history checks, desktop drag/mobile touch swipe, and a 25-sample no-reload 1440→360→1440 resize sweep. The existing desktop/mobile recordings are preserved; promotion does not repeat browser validation.

## Validated Home behavior

### Hero

- Expansion: 650–1650 ms.
- Scale: 0.28 → 1.
- Temporary Hero footage autoplays muted, inline, and looped with a poster/fallback.

### Typography

- Line 1: 1150–1450 ms.
- Line 2: 1550–1850 ms.
- Line 3: 1850–2060 ms.
- Moving blur: 10 px → 0 px.

### H02 inline-image hover

- Scale: 1 → 1.8.
- Hover-in: 280 ms.
- Blur pulse: 0 → 9 px → 0.
- Hover-out: 200 ms with a transient 6 px blur.
- Layout boxes do not reflow.

### ProjectStage

- Continuous, scrub-reversible outward motion.
- No dead-scroll plateau.
- No bottom re-collapse.
- Downward path: close/center → outward → beyond the left/right viewport edges.
- Reverse path follows the exact motion back toward the entry state.
- Horizontal travel uses current stage/element geometry and recalculates on ScrollTrigger refresh.

## Responsive baseline

- Fluid range: 360–1920 px.
- Reference structural breakpoints: 991, 767, and 479 px.
- Nineteen fixed viewport sizes passed on Home and About.
- No-reload 1440 → 360 → 1440 live resize passed.
- Resize while H03 was active passed.
- No horizontal page overflow, stale transforms, disappearing project media, dead scroll, or duplicate triggers was found.

See `../outputs/STEP3C_R4_RESPONSIVE_FIDELITY.md` for formulas, the viewport matrix, and detailed evidence.

## Runtime baseline

| Route/mode | Lenis | GSAP ticker | Route scope | ScrollTriggers |
| --- | ---: | ---: | ---: | ---: |
| Home | 1 | 1 | 1 | 5 |
| About | 1 | 1 | 1 | 2 |
| Motion index | 1 | 1 | 1 | 5 |
| Motion case | 1 | 1 | 1 | 2 |
| Stills index | 1 | 1 | 1 | 4 |
| Stills case | 1 | 1 | 1 | 1 |
| Reduced motion | 0 | 0 | 1 | 0 |

Repeated route and resize cycles showed no lifecycle growth. Menu, route overlay, F-stop theme persistence, Back/Forward restoration, and reduced-motion behavior are validated global systems.

## Build baseline

- `npm run check`: passes at the approved STEP 3E-B candidate and on the stable STEP 3E `main` promotion.
- Static export: passes.
- Static pages generated: 18/18, including the Motion Index and all five temporary Motion routes.
- Approved STEP 3D browser samples: 0 page errors and 0 collected console errors in the recorded checks.
- Historical R4 browser evidence: 0 production console errors/warnings, runtime exceptions and hydration errors. These counts are preserved from the R4 validation, not re-certified during promotion.

## Current known issues

### P1

- Temporary project-owned Hero footage must be replaced by the user's real footage before production release.
- Final project-owned Motion preview/full-film sources remain unresolved.
- The owner-approved per-project Motion audio policy remains unresolved.

### P2

- Final licensed display and UI fonts remain unresolved; current fonts are legal substitutes.
- Final bilingual Motion identity, copy and credits remain unapproved.
- The user's final photography archive has not been supplied.
- All five Motion projects remain temporary development content; their final media selections and production sources are not supplied.
- Stills palette and grain polish remains.
- Asset-specific hero layering remains.
- Case crop and spacing polish remains.
- The approved evidence does not fully certify live OS reduced-motion switching or cold-network first-frame behavior; these validation limits remain recorded in the STEP 3D fidelity report.

### P3

- Final asset-dependent crops, micro-spacing and cadence polish remain.
- The brief covered frame during the approved global route transition remains polish.
- Physical iOS/Safari validation remains required before production launch.
- Project-owned mock-media subjects differ from Reference photography.
- STEP 3D validation recordings use 25 fps, below the Reference capture cadence; continuous micro-easing has qualitative human approval rather than a new quantitative timing certification.

Do not omit or silently redefine these limitations in future phase reports.

## Protected boundaries

- Reference fidelity outranks invention.
- Do not copy protected Reference content or commercial font files.
- Do not connect R2 or deploy Cloudflare until explicitly requested.
- Do not alter validated global interaction systems without first documenting a demonstrated need.
- Do not begin the next major phase automatically.

## Documentation map

- `AGENTS.md` — permanent operating contract.
- `CODEX_HANDOFF.md` — short fresh-session checklist.
- `DECISIONS.md` — durable architecture and product decisions.
- `ARCHITECTURE.md` and `ANIMATION_ARCHITECTURE.md` — implementation architecture.
- `REFERENCE_AUDIT.md` and `INTERACTIONS.md` — authoritative Reference evidence.
- `DEPLOYMENT.md` and `MEDIA_ARCHITECTURE.md` — planned Pages/R2 topology.
- `../outputs/STEP3C_R4_RESPONSIVE_FIDELITY.md` — latest Home/About fidelity validation.
- `../outputs/STEP3D_STILLS_SUMMARY.md` and `../outputs/STEP3D_STILLS_FIDELITY.md` — approved STEP 3D candidate evidence and remaining limitations.
- `../outputs/STEP3E_A_MOTION_INDEX_SUMMARY.md` and `../outputs/STEP3E_A_MOTION_INDEX_FIDELITY.md` — human-approved STEP 3E-A structure, R1 pacing, measurements and remaining Motion production limitations.
- `../outputs/STEP3E_B_MOTION_CASES_SUMMARY.md` and `../outputs/STEP3E_B_MOTION_CASES_FIDELITY.md` — human-approved STEP 3E-B implementation, validation, fidelity evidence and remaining production limitations.

## Next phase

The Production Media Foundation is complete and human-approved. No subsequent production-media operation is authorized. Do not create/change Cloudflare resources, publish to R2, switch content to production media, or begin the Online Admin subphase without fresh explicit authorization. STEP 3E remains complete and human-approved; do not restart it or silently treat temporary films/audio as production-ready.

The unchanged AGENTS.md sentence that STEP 3D has not started describes the original R4 baseline and is superseded by this approved project-state record. The STEP 3D and STEP 3E reports remain durable evidence; their status is superseded by the explicit approval records above where applicable.
