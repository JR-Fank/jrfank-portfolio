# Codex Handoff

This repository is the durable source of truth. A new Codex session must not rely on previous chat history.

## Before editing

1. Read `AGENTS.md`.
2. Read `docs/PROJECT_STATE.md`.
3. Read the architecture, Reference-audit, interaction, and fidelity documents relevant to the requested phase.
4. Inspect `git status` and recent `git log` history.
5. Confirm the current branch and stable tag.
6. Only then implement the explicitly requested STEP.

## Current baseline

- **STEP 3E-A — MOTION INDEX: HUMAN APPROVED on `step3e-motion`; not merged to `main`.**
- Human-approved implementation candidate: `9bd2b2a1a320e348a2650cca0dd171db86c43d01`.
- The current approval/handoff documentation commit is the correct branch tip for a fresh STEP 3E-B session.
- Motion Index structure and STEP 3E-A-R1 pacing are human-approved from the corrected desktop/mobile recordings.
- Final production document heights: 6,463 px at 1440×900 and 5,269 px at 390×844.
- Poster-only Motion Index behavior remains authoritative: no index autoplay/video, iframe or full-film request.
- Five data-driven Motion projects and routes exist, but all remain explicitly temporary development content.
- P1 final project-owned preview/full-film sources and the approved audio policy remain unresolved.
- The STEP 3E-A branch passes `npm run check`, responsive/live-resize and lifecycle validation; static export is 18/18.
- Motion Index runtime baseline: one Lenis, one ticker, one route scope and five ScrollTriggers. Reduced motion remains 0 Lenis, 0 ticker, one route scope and 0 triggers.
- `main` remains at the approved STEP 3D baseline `f2fd298f295ea1862cec45f10f204d429379bfc0`.
- **STEP 3D — STILLS: APPROVED and squash-merged into `main`.**
- Approved source branch: `step3d-stills`.
- Approved candidate: `2b146ad14ecb3d093aea3d0797798b2c2b555b2d`.
- Stable approval commit: `feat: approve step 3d stills experience`; stable tag: `step3d-stills`.
- The phase branch retains WIP/checkpoint history. The stable promotion preserves the approved application files.
- `npm run check` and the 14/14-page static export pass. Existing approved browser evidence and recordings remain authoritative; promotion does not repeat browser validation.
- Historical Home/About baseline: STEP 3C-R4 at `e4cf461f6e0b4f437a28f04629ae07864d86a67b`, tagged `step3c-r4-responsive`.
- Home/About responsive validation covers 360–1920 px and no-reload live resize.
- Global runtime baseline: one Lenis instance, one ticker, one route scope; Home 5 triggers, Stills index 4, Stills case 1, About 2. Reduced motion retains 0 Lenis, 0 ticker, 1 route scope and 0 triggers.

Completed STEP 3E-A systems: independent Motion schema/validator; five temporary-development projects; M01 introduction; M02–M06 poster stages; main poster plus three satellites; approved title presets, play/CTA treatment and mobile bleed; continuous reversible parallax; approved R1 pacing; responsive/live-resize, reduced-motion and lifecycle behavior; static export.

Previously approved STEP 3D systems: Stills index; four placeholder Stills cases; editorial case renderer; asymmetric galleries; sticky mini rail; active IntersectionObserver tracking; numeric/`#last` hash navigation; history restoration; Explore More; fluid responsive behavior and live resize; reduced motion; lifecycle validation; static export.

Known P1/P2/P3 limitations are recorded in `docs/PROJECT_STATE.md` and must remain visible in future work.

## Unresolved production items

- P1: temporary Home Hero footage must be replaced with the user's final footage before production release.
- P1: final project-owned Motion preview/full-film sources and the approved audio policy remain unresolved.
- P2: final licensed display/UI fonts; final bilingual identity/copy; user photography archive; Stills palette/grain polish; asset-specific hero layering; case crop/spacing polish.
- P2: the five Motion projects remain temporary development content; final identity, credits, posters/satellites and production media are not supplied.

Approval does not resolve these items or the P3 and validation limitations in `docs/PROJECT_STATE.md` and the STEP 3D fidelity report.

## Next subphase

STEP 3E-B is next. **Do not start it in the STEP 3E-A approval turn.** A fresh explicitly authorized session should continue from the approval/handoff tip of `step3e-motion`, read the required project and Motion architecture documents, verify Git, and implement only the requested STEP 3E-B scope. Do not restart or redesign the approved Motion Index, merge `main`, or mark temporary films/audio production-ready.

Read `../outputs/STEP3E_A_MOTION_INDEX_SUMMARY.md` and `../outputs/STEP3E_A_MOTION_INDEX_FIDELITY.md` for the human-approved structure, R1 measurements, recordings and remaining Motion production issues. STEP 3D evidence remains in its corresponding reports. The historical not-started sentence in unchanged `AGENTS.md` is superseded by `docs/PROJECT_STATE.md`. Do not restart STEP 3D/STEP 3E-A or deploy automatically.

For a fresh STEP 3E-B session, the user should only need to say: open `jrfank-portfolio`, read `AGENTS.md`, `docs/PROJECT_STATE.md`, `docs/CODEX_HANDOFF.md` and the relevant Motion architecture/fidelity documents, inspect Git, and execute only STEP 3E-B. The historical transcript is not required.
