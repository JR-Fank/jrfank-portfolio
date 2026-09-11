# Project State

Phase-branch update: STEP 3D candidate, awaiting human approval. The Home/About baseline below remains historical validation evidence.

## Current status

- STEP 3C-R4 is complete and validated.
- STEP 3D implementation exists on `step3d-stills`; this branch contains a validation candidate awaiting human approval. See `../outputs/STEP3D_STILLS_SUMMARY.md` and `../outputs/STEP3D_STILLS_FIDELITY.md`.
- Validated functional baseline: `e4cf461f6e0b4f437a28f04629ae07864d86a67b`.
- Stable tag: `step3c-r4-responsive`.
- A later `main` commit may contain documentation and repository-handoff changes only; the R4 tag remains the exact functional baseline.

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
| Reduced motion | 0 | 0 | 1 | 0 |

Repeated route and resize cycles showed no lifecycle growth. Menu, route overlay, F-stop theme persistence, Back/Forward restoration, and reduced-motion behavior are validated global systems.

## Build baseline

- `npm run check`: passes.
- Static export: passes.
- Exported routes: 11/11.
- Production console errors/warnings: 0.
- Runtime exceptions: 0.
- Hydration errors: 0.

## Current known issues

### P1

- Temporary project-owned Hero footage must be replaced by the user's real footage before production release.

### P2

- The display and UI fonts are legal substitutes; the final licensed display-font decision remains open.
- Final bilingual copy is not approved.
- The final photography archive has not been supplied.

### P3

- Final asset-dependent micro-spacing remains.
- Project-owned mock-media subjects differ from Reference photography.
- Validation recordings may use a lower frame rate than the Reference capture.

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

## Next major phase

STEP 3D — STILLS is implemented on this phase branch and awaits human visual approval of the candidate. Continue from the current branch state and reports; do not restart it. Do not merge to `main` or begin STEP 3E without explicit authorization. The unchanged AGENTS.md sentence that STEP 3D has not started describes the original R4 baseline and is superseded for branch status by this section.
