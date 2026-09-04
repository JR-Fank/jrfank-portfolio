# JRFANK Photography Portfolio

High-fidelity personal photography portfolio implemented from audited interaction and layout evidence. The implementation recreates observed behavior while using project-owned identity, copy, mock photography, and temporary video rather than protected Reference content.

## Status

STEP 3C-R4 is complete and validated. STEP 3D — STILLS has not started and must not begin without explicit instruction.

Validated functional baseline: `e4cf461f6e0b4f437a28f04629ae07864d86a67b` (`step3c-r4-responsive`).

## Stack

- Next.js App Router 16
- React 19 and TypeScript
- Static export
- GSAP with ScrollTrigger
- Lenis smooth scrolling
- Zod content/media validation
- Locally hosted open-license substitute fonts

## Local development

Requires Node.js 22 or later.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000/`.

## Validation and build

```bash
npm run validate
npm run typecheck
npm run check
```

`npm run check` runs TypeScript checking, validates content/media, and performs the optimized Next.js build. `next.config.ts` uses `output: 'export'` and `trailingSlash: true`; a successful build writes the complete static site to `out/`. No Node.js application server is required in production.

## Documentation

- [Operating contract](AGENTS.md)
- [Canonical project state](docs/PROJECT_STATE.md)
- [Fresh-session handoff](docs/CODEX_HANDOFF.md)
- [Decision log](docs/DECISIONS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Animation architecture](docs/ANIMATION_ARCHITECTURE.md)
- [Reference audit](docs/REFERENCE_AUDIT.md)
- [Interactions](docs/INTERACTIONS.md)
- [Media architecture](docs/MEDIA_ARCHITECTURE.md)
- [Deployment plan](docs/DEPLOYMENT.md)
- [Latest responsive-fidelity report](outputs/STEP3C_R4_RESPONSIVE_FIDELITY.md)

## Media strategy

Authorized mock assets required for development live under `public/mock-media/`. Large validation recordings are intentionally excluded from the durable repository. Final production photography and video will be prepared separately and served from a planned Cloudflare R2 custom media domain; R2 is not connected yet.

Commercial Reference fonts and Reference production assets must never be copied. Current font tokens use legal, replaceable substitutes until licensed final fonts are supplied.

## Planned deployment

The planned topology is GitHub → Cloudflare Pages for the static `out/` site and Cloudflare R2 for production media. No Cloudflare project, bucket, credentials, or production domain is configured by this handoff.

`main` is the latest human-approved stable branch. Each future major phase should use a dedicated branch, complete validation and human review there, and merge only after approval.
