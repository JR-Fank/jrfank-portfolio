# STEP 1 — Reference Audit handoff

Completed on 2026-08-28 against the live public site at https://www.giuligartner.com/.

## Deliverables

- [Reference audit](/Users/jr-fank/Documents/Codex/2026-08-28/files-pasted-by-the-user-giulia/docs/REFERENCE_AUDIT.md)
- [Interaction specification](/Users/jr-fank/Documents/Codex/2026-08-28/files-pasted-by-the-user-giulia/docs/INTERACTIONS.md)
- [Routes and information architecture](/Users/jr-fank/Documents/Codex/2026-08-28/files-pasted-by-the-user-giulia/docs/ROUTES.md)

## Evidence

- 495 normalized route screenshots: nine routes × five requested viewports × eleven scroll positions.
- 12 additional interaction captures for menu, dark/light F-stop state, and route-transition frames.
- Evidence is stored under `reference/desktop/`, `reference/mobile/`, and `reference/interactive/`.

## Main conclusions

- The site is an editorial, transform-driven system with long scroll stages, paired offscreen media, sticky case-study rails, opposed filmstrips, and pinned BTS sequences.
- The F-stop is a persistent theme switch, not a photographic filter. Desktop currently says F/24 while mobile says F/23; both toggle to F/1.4.
- Internal route transitions use the same full-viewport theme-colored fade with a 1000 ms delayed navigation. No image-continuity/FLIP transition was observed.
- Motion index cards are poster compositions rather than autoplay videos. Motion case-study heroes use Vimeo background playback and unmute/reframe on Watch.
- Desktop, tablet, and mobile compose independently at 991, 767, and 479 px breakpoints.
- The reference uses commercial Roslindale and Mint Grotesk files; these must be licensed or replaced, never copied.

## Scope guard

No Next.js project, components, animation modules, or formal portfolio pages were created. Architecture and implementation remain deferred to later steps exactly as requested.

