# Project State

Stable-baseline update: STEP 3D has passed human review and is approved and squash-merged into `main`. The Home/About measurements below remain historical validation evidence.

## Current status

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
| Stills index | 1 | 1 | 1 | 4 |
| Stills case | 1 | 1 | 1 | 1 |
| Reduced motion | 0 | 0 | 1 | 0 |

Repeated route and resize cycles showed no lifecycle growth. Menu, route overlay, F-stop theme persistence, Back/Forward restoration, and reduced-motion behavior are validated global systems.

## Build baseline

- `npm run check`: passes.
- Static export: passes.
- Static pages generated: 14/14, including all four Stills cases (the historical R4 export generated 11/11).
- Approved STEP 3D browser samples: 0 page errors and 0 collected console errors in the recorded checks.
- Historical R4 browser evidence: 0 production console errors/warnings, runtime exceptions and hydration errors. These counts are preserved from the R4 validation, not re-certified during promotion.

## Current known issues

### P1

- Temporary project-owned Hero footage must be replaced by the user's real footage before production release.

### P2

- Final licensed display and UI fonts remain unresolved; current fonts are legal substitutes.
- Final bilingual identity and copy remain unapproved.
- The user's final photography archive has not been supplied.
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

## Next major phase

STEP 3D — STILLS is approved and merged into `main`. The next major phase is STEP 3E. STEP 3E must not begin in this promotion conversation; start it only in a fresh session with explicit user authorization and a dedicated phase branch.

The unchanged AGENTS.md sentence that STEP 3D has not started describes the original R4 baseline and is superseded by this approved project-state record. The historical candidate reports remain evidence, not the current approval status.
