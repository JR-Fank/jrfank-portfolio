# JRFANK Online Admin — Checkpoint A

This package is a separate Cloudflare Worker plus Static Assets application. It does not change the public Next.js static export, and it contains no R2 upload, GitHub write, content edit, publish, or deploy workflow.

## What exists

- Protected read-only Worker APIs under `/api/*`.
- Cloudflare Access JWT verification using `cf-access-jwt-assertion`, `TEAM_DOMAIN`, and `POLICY_AUD`.
- A responsive, keyboard-accessible Admin shell for Dashboard, Home, Stills, Motion, About, Media Library, and Publish / Changes.
- Repository-build snapshots imported from `../src/content/` and `../src/generated/media-manifest.json`.
- Manifest search/filter controls and read-only rendition metadata.
- An explicit loopback-only local mock mode.

## Local review

From the repository root:

```bash
npm install
cp admin/.dev.vars.example admin/.dev.vars
npm run admin:dev
```

Open the loopback URL printed by Wrangler. The browser sends a non-secret local-mode marker only on a loopback hostname. The Worker accepts it only when both `ADMIN_ENVIRONMENT=local` and `ADMIN_AUTH_MODE=local-mock` are explicitly set in `.dev.vars`.

Delete `admin/.dev.vars` or return `ADMIN_AUTH_MODE` to `access` when local review is complete. `.dev.vars` is ignored and must never be committed.

## Verification

```bash
npm run admin:check
npm run check
```

The Admin check runs TypeScript, authentication/API tests, a Wrangler dry-run bundle, and a browser/Worker secret-value scan. It does not deploy a Worker. The root check separately proves the approved portfolio still exports as a static application.

## Production boundary

There is deliberately no `deploy` script. `workers_dev` and preview URLs are disabled, no route is configured, and the committed Worker name is a local-only placeholder. Do not create a Cloudflare resource until the owner supplies and approves:

1. the final Admin hostname and Worker name;
2. a Cloudflare Access self-hosted application covering the entire Admin hostname;
3. an owner-only Access policy;
4. the real Access team issuer (`TEAM_DOMAIN`);
5. the Access application audience (`POLICY_AUD`).

The hostname-level Access policy protects the static shell. The Worker independently verifies Access JWT signature, issuer, audience, lifetime, and subject for every `/api/*` request. Production remains fail-closed when either required binding is missing or invalid.

See `../docs/ONLINE_ADMIN_SETUP.md` for the owner-run configuration contract. No Cloudflare action is authorized by this package.
