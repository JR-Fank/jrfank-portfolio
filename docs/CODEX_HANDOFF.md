# Codex Handoff

This repository is the durable source of truth. A new Codex session must not rely on previous chat history.

Current branch-scoped phase: **PRODUCTION MEDIA FOUNDATION CANDIDATE — AWAITING REVIEW** on `production-media`. The implementation is repository-only and has not created Cloudflare resources, contacted R2, committed production binaries, changed approved routes, or merged to `main`. Read `outputs/PRODUCTION_MEDIA_FOUNDATION_SUMMARY.md`, `docs/PRODUCTION_MEDIA_SETUP.md`, and `docs/ADMIN_MEDIA_ARCHITECTURE.md` before any continuation. Publishing, Cloudflare setup, final-media replacement, merge, and the future Admin require separate authorization.

## Before editing

1. Read `AGENTS.md`.
2. Read `docs/PROJECT_STATE.md`.
3. Read the architecture, Reference-audit, interaction, and fidelity documents relevant to the requested phase.
4. Inspect `git status` and recent `git log` history.
5. Confirm the current branch and stable tag.
6. Only then implement the explicitly requested STEP.

## Current baseline

- **STEP 3E — MOTION EXPERIENCE: HUMAN APPROVED and squash-promoted to `main`.**
- **STEP 3E-A — MOTION INDEX: HUMAN APPROVED.**
- **STEP 3E-B — MOTION CASES: HUMAN APPROVED.**
- Human-approved STEP 3E-A candidate: `9bd2b2a1a320e348a2650cca0dd171db86c43d01`.
- Human-approved STEP 3E-B candidate: `6801ea21446dddd27d4e3120713d52a614a72c93`.
- Approved source branch: `step3e-motion`; stable approval commit: `feat: approve step 3e motion experience`; stable tag: `step3e-motion`.
- Motion Index structure and STEP 3E-A-R1 pacing are human-approved from the corrected desktop/mobile recordings.
- Final production document heights: 6,463 px at 1440×900 and 5,269 px at 390×844.
- Poster-only Motion Index behavior remains authoritative: no index autoplay/video, iframe or full-film request.
- Five data-driven Motion projects and routes exist, but all remain explicitly temporary development content.
- P1 final project-owned preview/full-film sources and the approved audio policy remain unresolved.
- The approved STEP 3E candidate and stable promotion pass `npm run check`; static export is 18/18.
- Runtime baseline: one Lenis, one ticker and one route scope; Motion Index has five ScrollTriggers and Motion cases have two. Reduced motion remains 0 Lenis, 0 ticker, one route scope and 0 triggers.
- **STEP 3D — STILLS: APPROVED and squash-merged into `main`.**
- Approved source branch: `step3d-stills`.
- Approved candidate: `2b146ad14ecb3d093aea3d0797798b2c2b555b2d`.
- Stable approval commit: `feat: approve step 3d stills experience`; stable tag: `step3d-stills`.
- The phase branch retains WIP/checkpoint history. The stable promotion preserves the approved application files.
- `npm run check` and the 14/14-page static export pass. Existing approved browser evidence and recordings remain authoritative; promotion does not repeat browser validation.
- Historical Home/About baseline: STEP 3C-R4 at `e4cf461f6e0b4f437a28f04629ae07864d86a67b`, tagged `step3c-r4-responsive`.
- Home/About responsive validation covers 360–1920 px and no-reload live resize.
- Global runtime baseline: one Lenis instance, one ticker, one route scope; Home 5 triggers, Stills index 4, Stills case 1, About 2. Reduced motion retains 0 Lenis, 0 ticker, 1 route scope and 0 triggers.

Completed STEP 3E systems: independent Motion schema/validator; five Motion Index projects; poster-only Motion Index; approved R1 pacing; five shared Motion case-study routes; native poster/preview/full-film playback controller; full film deferred until Watch; Watch/Pause/Resume/Retry; opposed filmstrip rows; content-driven credits; one pinned BTS stage; one eight-beat BTS master timeline; reduced-motion normal-flow BTS; Motion Explore More 2→1; responsive/live-resize behavior; lifecycle/resource cleanup; static export.

Previously approved STEP 3D systems: Stills index; four placeholder Stills cases; editorial case renderer; asymmetric galleries; sticky mini rail; active IntersectionObserver tracking; numeric/`#last` hash navigation; history restoration; Explore More; fluid responsive behavior and live resize; reduced motion; lifecycle validation; static export.

Known P1/P2/P3 limitations are recorded in `docs/PROJECT_STATE.md` and must remain visible in future work.

## Unresolved production items

- P1: temporary Home Hero footage must be replaced with the user's final footage before production release.
- P1: final project-owned Motion preview/full-film sources and the approved audio policy remain unresolved.
- P2: final licensed display/UI fonts; final bilingual Motion identity/copy/credits; user photography archive; Stills palette/grain polish; asset-specific hero layering; case crop/spacing polish.
- P2: the five Motion projects remain temporary development content; final Motion media selections and production sources are not supplied.

Approval does not resolve these items or the P3 asset-dependent crops/micro-spacing/cadence polish, brief covered route-transition frame, and physical iOS/Safari validation recorded in `docs/PROJECT_STATE.md` and the fidelity reports.

## Next phase

STEP 3E is complete. No subsequent phase is authorized. A future phase must start only in a fresh explicitly authorized session after reading the required project documents and verifying Git. Do not restart or redesign the approved Motion experience, mark temporary films/audio production-ready, or deploy automatically.

Read the STEP 3E-A and STEP 3E-B summary/fidelity reports in `../outputs/` for the human-approved structure, measurements, recordings and remaining Motion production issues. STEP 3D evidence remains in its corresponding reports. The historical not-started sentence in unchanged `AGENTS.md` is superseded by `docs/PROJECT_STATE.md`.

For a future phase, the user should only need to say: open `jrfank-portfolio`, read `AGENTS.md`, `docs/PROJECT_STATE.md`, `docs/CODEX_HANDOFF.md` and the relevant architecture/fidelity documents, inspect Git, and execute only the explicitly authorized phase. The historical transcript is not required.
