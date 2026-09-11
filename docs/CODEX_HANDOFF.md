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

- **STEP 3D — STILLS: APPROVED and squash-merged into `main`.**
- Approved source branch: `step3d-stills`.
- Approved candidate: `2b146ad14ecb3d093aea3d0797798b2c2b555b2d`.
- Stable approval commit: `feat: approve step 3d stills experience`; stable tag: `step3d-stills`.
- The phase branch retains WIP/checkpoint history. The stable promotion preserves the approved application files.
- `npm run check` and the 14/14-page static export pass. Existing approved browser evidence and recordings remain authoritative; promotion does not repeat browser validation.
- Historical Home/About baseline: STEP 3C-R4 at `e4cf461f6e0b4f437a28f04629ae07864d86a67b`, tagged `step3c-r4-responsive`.
- Home/About responsive validation covers 360–1920 px and no-reload live resize.
- Global runtime baseline: one Lenis instance, one ticker, one route scope; Home 5 triggers, Stills index 4, Stills case 1, About 2. Reduced motion retains 0 Lenis, 0 ticker, 1 route scope and 0 triggers.

Completed STEP 3D systems: Stills index; four placeholder Stills cases; editorial case renderer; asymmetric galleries; sticky mini rail; active IntersectionObserver tracking; numeric/`#last` hash navigation; history restoration; Explore More; fluid responsive behavior and live resize; reduced motion; lifecycle validation; static export.

Known P1/P2/P3 limitations are recorded in `docs/PROJECT_STATE.md` and must remain visible in future work.

## Unresolved production items

- P1: temporary Home Hero footage must be replaced with the user's final footage before production release.
- P2: final licensed display/UI fonts; final bilingual identity/copy; user photography archive; Stills palette/grain polish; asset-specific hero layering; case crop/spacing polish.

Approval does not resolve these items or the P3 and validation limitations in `docs/PROJECT_STATE.md` and the STEP 3D fidelity report.

## Next major phase

STEP 3D is approved and merged. The next major phase is STEP 3E. **STEP 3E must NOT begin in this promotion conversation.** A future fresh session may start it only with explicit user authorization and a dedicated phase branch from the approved `main` baseline.

Read `../outputs/STEP3D_STILLS_SUMMARY.md` and `../outputs/STEP3D_STILLS_FIDELITY.md` for the preserved candidate evidence, local recordings and remaining issues. Their awaiting-approval wording and the historical not-started sentence in unchanged `AGENTS.md` are superseded by this approval record. Do not restart STEP 3D or deploy automatically.

For a fresh session, the user should only need to say: open `jrfank-portfolio`, read `AGENTS.md`, `docs/PROJECT_STATE.md`, and `docs/CODEX_HANDOFF.md`, inspect Git, and execute the requested STEP. The historical transcript is not required.
