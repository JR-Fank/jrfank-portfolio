# JRFANK Portfolio Operating Contract

## Project

This is a high-fidelity personal photography portfolio based on the interaction and layout behavior of the current Giulia Gartner site. Final identity, photography, video, biography, and copy must be project-owned.

## Primary rule

Reference fidelity takes precedence over creative reinterpretation.

## Required reading before editing

1. Read this file.
2. Read `docs/PROJECT_STATE.md`.
3. Read `docs/CODEX_HANDOFF.md`.
4. Read the architecture and fidelity reports relevant to the requested phase.
5. Inspect `git status`, recent history, and the current branch.
6. Implement only the explicitly requested phase.

The repository is authoritative. Do not depend on old chat history.

## Never

- Copy Giulia Gartner photography, video, biography, production assets, or source code.
- Copy commercial font files from the Reference. Roslindale and Mint Grotesk require legal licenses.
- Invent effects unsupported by Reference evidence.
- Add WebGL, 3D, canvas particles, or comparable complexity without demonstrated need.
- Turn the experience into a generic portfolio template.
- Start the next major STEP automatically.
- Commit secrets, credentials, private media masters, or private EXIF.
- Deploy production infrastructure without explicit instruction.

## Technology

- Next.js App Router and TypeScript
- Static export to `out/`
- GSAP and ScrollTrigger
- One app-wide Lenis instance
- Cloudflare Pages planned for hosting
- Cloudflare R2 planned for production media

## Validated global rules

- Exactly one Lenis instance and one GSAP ticker driver in standard motion.
- One route-scoped animation lifecycle with no lifecycle growth.
- Persistent F-stop theme behavior.
- Audited menu timing and route-transition overlay.
- Complete reduced-motion fallback.
- Global systems must not be casually refactored. Document the reason before changing one.

## Responsive rules

Reference structural breakpoints are 991, 767, and 479 px. Intermediate desktop behavior must remain fluid rather than being hard-coded only for validated screenshots. ProjectStage geometry must be refresh-aware and derived from current viewport/element measurements.

## Stable baseline

STEP 3C-R4 is the validated functional baseline at commit `e4cf461f6e0b4f437a28f04629ae07864d86a67b`, tagged `step3c-r4-responsive`. STEP 3D has not started.

## Branch and approval workflow

`main` represents the latest human-approved stable state. Start each future major phase on a dedicated branch, for example `step3d-stills`. Complete implementation, validation, human review, corrections, and the final phase commit there. Merge to `main` only after approval. Do not perform major experimental work directly on `main`.

Future major phases should normally begin in a fresh Codex conversation. The new session should read this file, `docs/PROJECT_STATE.md`, and `docs/CODEX_HANDOFF.md`, inspect Git, then execute only the requested STEP. Do not paste or require the full historical conversation.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
