# Project State

Branch-state update: STEP 3E-A — MOTION INDEX has passed final human visual review on `step3e-motion`. `main` remains the approved STEP 3D baseline; STEP 3E-A has not been merged. The Home/About measurements below remain historical validation evidence.

## Current status

- **STEP 3E-A — MOTION INDEX: HUMAN APPROVED**.
- Approved branch: `step3e-motion`.
- Human-approved candidate: `9bd2b2a1a320e348a2650cca0dd171db86c43d01`.
- Motion Index structure and STEP 3E-A-R1 pacing are approved.
- Final measured Motion Index height: 6,463 px at 1440×900 and 5,269 px at 390×844.
- The poster-only Motion Index policy remains authoritative: no index autoplay/video, iframe or full-film request.
- All five Motion projects remain explicitly temporary development content.
- P1 final project-owned films and approved audio policy remain unresolved.
- `main` remains at the approved STEP 3D promotion commit `f2fd298f295ea1862cec45f10f204d429379bfc0`.
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
12. STEP 3E-A — Motion content foundation and Motion Index (human-approved on `step3e-motion`; not merged)

## Approved STEP 3E-A systems

- Independent typed Motion content/schema foundation and validator.
- Five data-driven temporary-development Motion projects and static routes.
- Poster-only Motion Index with no index autoplay/video, iframe or full-film request.
- M01 introduction and M02–M06 project stages.
- One main poster plus three visible satellites per stage.
- Approved title presets, play/CTA treatment and deliberate mobile bleed.
- Continuous reversible parallax and STEP 3E-A-R1 stage pacing.
- Final production document heights of 6,463 px at 1440×900 and 5,269 px at 390×844.
- Responsive/live-resize, reduced-motion, lifecycle and 18/18 static-export validation.

The approved STEP 3E-A implementation candidate is `9bd2b2a1a320e348a2650cca0dd171db86c43d01`. The approval is branch-scoped and does not promote it to `main`. See `../outputs/STEP3E_A_MOTION_INDEX_SUMMARY.md` and `../outputs/STEP3E_A_MOTION_INDEX_FIDELITY.md` for the preserved validation and fidelity evidence.

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
| Stills index | 1 | 1 | 1 | 4 |
| Stills case | 1 | 1 | 1 | 1 |
| Reduced motion | 0 | 0 | 1 | 0 |

Repeated route and resize cycles showed no lifecycle growth. Menu, route overlay, F-stop theme persistence, Back/Forward restoration, and reduced-motion behavior are validated global systems.

## Build baseline

- `npm run check`: passes at the approved STEP 3E-A branch candidate.
- Static export: passes.
- Static pages generated on `step3e-motion`: 18/18, including the Motion Index and all five temporary Motion routes. The approved `main` STEP 3D baseline generated 14/14.
- Approved STEP 3D browser samples: 0 page errors and 0 collected console errors in the recorded checks.
- Historical R4 browser evidence: 0 production console errors/warnings, runtime exceptions and hydration errors. These counts are preserved from the R4 validation, not re-certified during promotion.

## Current known issues

### P1

- Temporary project-owned Hero footage must be replaced by the user's real footage before production release.
- Final project-owned Motion preview/full-film sources and the approved audio policy remain unresolved. The approved Motion Index does not request them.

### P2

- Final licensed display and UI fonts remain unresolved; current fonts are legal substitutes.
- Final bilingual identity and copy remain unapproved.
- The user's final photography archive has not been supplied.
- All five Motion projects remain temporary development content; their final bilingual identity, credits, poster/satellite selections and production media are not supplied.
- Stills palette and grain polish remains.
- Asset-specific hero layering remains.
- Case crop and spacing polish remains.
- The approved evidence does not fully certify live OS reduced-motion switching or cold-network first-frame behavior; these validation limits remain recorded in the STEP 3D fidelity report.

### P3

- Final asset-dependent micro-spacing and crops remain.
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

## Next subphase

STEP 3E-A — MOTION INDEX is human-approved on `step3e-motion` at candidate `9bd2b2a1a320e348a2650cca0dd171db86c43d01`. STEP 3E-B is the next subphase. It must begin only in a fresh session with explicit user authorization, after reading the repository documentation and verifying the current branch/HEAD. Continue from the approval/handoff tip of `step3e-motion`; do not restart STEP 3E-A, merge `main`, or silently treat temporary films/audio as production-ready.

The unchanged AGENTS.md sentence that STEP 3D has not started describes the original R4 baseline and is superseded by this approved project-state record. The STEP 3D and STEP 3E-A reports remain durable evidence; their status is superseded by the explicit approval records above where applicable.
