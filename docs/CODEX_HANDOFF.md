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

- STEP 3C-R4 complete.
- Functional baseline commit: `e4cf461f6e0b4f437a28f04629ae07864d86a67b`.
- Stable tag: `step3c-r4-responsive`.
- `npm run check` and 11/11 static routes pass.
- Home/About responsive validation covers 360–1920 px and no-reload live resize.
- Global runtime baseline: one Lenis instance, one ticker, one route scope; Home 5 triggers, About 2.

Known P1/P2/P3 limitations are recorded in `docs/PROJECT_STATE.md` and must remain visible in future work.

## Current phase branch

**STEP 3D CANDIDATE — AWAITING HUMAN APPROVAL**

`step3d-stills` already contains the Stills index, four cases, gallery rail/hash navigation, Explore More and validation work. Read `../outputs/STEP3D_STILLS_SUMMARY.md` and `../outputs/STEP3D_STILLS_FIDELITY.md` for evidence, candidate identity, local recordings and remaining issues. Continue from this branch; do not restart STEP 3D.

This is a phase-branch status update, not human approval. `main` remains the approved R4/handoff baseline. Do not merge, deploy or start STEP 3E automatically. The historical not-started sentence in unchanged AGENTS.md does not describe the current phase-branch implementation.

For a fresh session, the user should only need to say: open `jrfank-portfolio`, read `AGENTS.md`, `docs/PROJECT_STATE.md`, and `docs/CODEX_HANDOFF.md`, inspect Git, and execute the requested STEP. The historical transcript is not required.
