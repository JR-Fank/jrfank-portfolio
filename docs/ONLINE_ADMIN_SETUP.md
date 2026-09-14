# Online Admin Setup — Checkpoint A

Status: implementation candidate for human review; no Cloudflare resource, hostname, Access application, route, secret, R2 object, or GitHub integration has been created.

## 1. Checkpoint boundary

Checkpoint A adds a separate `admin/` package containing a Cloudflare Worker runtime and Static Assets frontend. It does not add a runtime to the public Next.js portfolio. The portfolio remains an independent static export under `out/`.

Implemented:

- editorial/utilitarian Admin shell and navigation for Dashboard, Home, Stills, Motion, About, Media Library, and Publish / Changes;
- read-only repository-build content snapshot sourced from `src/content/`;
- read-only media inventory sourced from `src/generated/media-manifest.json`;
- kind, scope, fixed-role, and free-text filtering;
- explicit missing-field treatment (`Not recorded`) and repository snapshot status;
- role and usage-location derivation from named content fields, retained as arrays because one asset can serve multiple usages;
- Cloudflare Access JWT verification for every `/api/*` request;
- explicit loopback-only local mock mode;
- tests, dry-run Worker bundling, and browser/static secret checks.

Not implemented or authorized:

- content editing or reordering;
- file selection or upload;
- R2 bindings, authorization, reads, writes, listing, deletion, or deployment;
- GitHub App/token bindings, commits, branches, pull requests, or merges;
- Pages previews or production promotion;
- an audit database, publish state machine, or live status;
- any Cloudflare resource or DNS change.

The Publish / Changes page is actionless. `DRAFT`, `UPLOADED`, `VALIDATED`, `PREVIEW READY`, `PUBLISHED`, and `ERROR` are displayed only as reserved future vocabulary; they are not assigned to current records.

## 2. Runtime topology

```text
Public portfolio
  Next.js 16.3.3 static export → out/ → independent static hosting

Online Admin
  protected Admin hostname (future owner configuration)
    → Cloudflare Access protects all static and API paths
    → Worker Static Assets serves admin/public/
    → /api/* runs Worker first
       → Worker verifies cf-access-jwt-assertion
       → read-only bundled repository snapshot
```

`admin/wrangler.jsonc` uses:

- `assets.directory: "./public"`;
- `assets.binding: "ASSETS"`;
- `not_found_handling: "single-page-application"`;
- `run_worker_first: ["/api/*"]`;
- compatibility date `2026-09-14`;
- `workers_dev: false` and `preview_urls: false`;
- no routes and no deploy script.

The configured Worker name is explicitly a local-only placeholder. It must be replaced only as part of a separately authorized owner deployment.

## 3. Access contract

Production mode is fail-closed:

```text
ADMIN_ENVIRONMENT=production
ADMIN_AUTH_MODE=access
TEAM_DOMAIN=<owner Access team domain or HTTPS issuer>
POLICY_AUD=<owner Access application audience>
```

`TEAM_DOMAIN` and `POLICY_AUD` are declared as required runtime secrets in Wrangler configuration. They are not browser values and are not committed with real data. Although an Access audience is an identifier rather than an R2/GitHub credential, keeping both values runtime-only prevents accidental coupling to the static frontend.

For every API request, the Worker:

1. reads only `cf-access-jwt-assertion` as the authentication token;
2. normalizes `TEAM_DOMAIN` to an HTTPS issuer origin;
3. downloads that issuer's `/cdn-cgi/access/certs` JWKS and caches it for five minutes in the isolate;
4. permits only RS256 with a matching key ID;
5. verifies the JWT signature with Web Crypto;
6. requires exact issuer and `POLICY_AUD` audience matches;
7. validates expiry, optional not-before, and optional issued-at claims with a 60-second clock tolerance;
8. requires a non-empty subject;
9. returns a generic `401` without disclosing verification details on any failure.

The Cloudflare Access application must cover the entire future Admin hostname, not only `/api/*`, so the static shell is also protected. The Worker check is an independent second boundary for the API. Direct Worker development and preview URLs remain disabled in the committed configuration.

## 4. Explicit local mock

Install workspace dependencies, create the ignored local variables file from its safe example, and start the local Worker:

```bash
npm install
cp admin/.dev.vars.example admin/.dev.vars
npm run admin:dev
```

Open the loopback URL printed by Wrangler. Local mock identity is accepted only when all of these are true:

- `ADMIN_ENVIRONMENT=local`;
- `ADMIN_AUTH_MODE=local-mock`;
- the request URL hostname is loopback (`localhost`, a `.localhost` name, `127.0.0.1`, or `::1`);
- the browser explicitly sends `x-admin-local-mock: true`.

The static client sends that non-secret marker only on loopback. It has no effect when production uses `ADMIN_AUTH_MODE=access`. Missing or partially configured local variables fail closed.

`admin/.dev.vars` is ignored. Do not place R2 credentials, GitHub credentials, real Access values, or any other secret in a tracked file.

## 5. Read-only API

| Route | Result |
| --- | --- |
| `GET /api/session` | Minimal verified identity, auth mode, read-only flag, checkpoint |
| `GET /api/content` | Repository-build snapshot of Home, Stills, Motion, About, and site metadata |
| `GET /api/media` | Manifest inventory with filter metadata and fixed role vocabulary |

`/api/media` accepts `q`, `kind`, `scope`, `role`, and `limit` (1–100). The fixed role vocabulary is `hero`, `cover`, `gallery`, `rail`, `poster`, `satellite`, `filmstrip`, `bts`, `preview`, `full-film`, `about`, and `social`; `unassigned` is an inspection filter for records with no derived role. Invalid filters return `400`.

All authenticated non-GET API requests return `405`. Unknown authenticated API routes return `404`. Every API response is private/no-store and receives noindex, nosniff, frame-denial, no-referrer, and restrictive CSP headers. No cross-origin API permission is added.

## 6. Snapshot and preview limitations

The Worker bundles a build-time view imported directly from the repository's content modules and committed media manifest. It does not query GitHub or R2 at runtime, so it cannot become newer without a reviewed code build.

Roles and usage locations are derived only from explicit content fields such as `coverId`, `posterId`, `previewId`, `fullFilmId`, block media references, filmstrip rows, BTS arrays, and SEO social-image references. A media record therefore uses `roles[]`, `projects[]`, and `usageLocations[]`. Where project association, bilingual metadata, created/updated time, or publish status is absent, the UI says `Not recorded`; it does not infer a timestamp or claim a deployment state.

The isolated Admin asset package does not copy the portfolio's mock media and never bundles production media. Checkpoint A therefore uses a visible scope/kind color fallback and exposes poster relationships from the manifest rather than requesting thumbnails. A later thumbnail design needs a separately approved protected-delivery policy; it must not silently make private or unpublished media public.

## 7. Verification commands

```bash
npm run admin:check
npm run check
```

`admin:check` runs TypeScript, Node tests, `wrangler deploy --dry-run`, and a bundle scan. The dry-run builds locally and does not create or change a Cloudflare resource. The root `check` remains the public portfolio's independent static-export regression gate.

## 8. Owner setup gate

Before any real deployment, stop and obtain explicit owner approval for:

1. final Worker name and the requested Admin hostname, `admin.401688.xyz`;
2. Cloudflare account/zone and the hostname DNS plan;
3. Access application and owner-only policy;
4. real `TEAM_DOMAIN` and `POLICY_AUD` runtime values;
5. preview URL policy and whether preview URLs remain disabled;
6. operational log retention and emergency access recovery;
7. an end-to-end Access test on the protected hostname.

Only after those decisions may an authorized operator replace placeholders, create resources, configure runtime values, attach a route, and deploy. Checkpoint A itself provides no authorization to do so.

## 9. Future owner-run Cloudflare Access setup

The following is an exact future runbook, not an instruction to execute during Checkpoint A. The owner must first authorize the Cloudflare account, zone, hostname, identity, and deployment operation.

1. Confirm that `401688.xyz` is active in the intended Cloudflare account and that the operator is working in that exact account. Record the selected account and zone outside public/browser configuration; do not guess an account ID.
2. In **Zero Trust → Access → Applications**, choose **Add an application → Self-hosted**.
3. Give the application an owner-approved name and add exactly one public hostname: `admin.401688.xyz`, with no path restriction. Protecting only `/api/*` is insufficient because the Static Assets shell must also require Access.
4. Choose the shortest practical owner session duration. Do not enable a public bypass, `Everyone` include rule, or an unauthenticated path for the shell or API.
5. Add an owner-only Allow policy. The Include rule must identify the owner's exact approved identity, such as one verified email address or one owner-only identity-provider group. If a group is used, inspect its current membership before saving it. Do not use an email domain rule when only one owner is intended.
6. Keep service-token or bypass policies absent unless a later machine-client requirement receives separate review. A browser owner session needs the identity-provider Allow policy, not a shared secret in JavaScript.
7. Save the application, then copy its Application Audience (`AUD`) value for `POLICY_AUD`. Obtain the existing Access team domain from **Zero Trust → Settings** for `TEAM_DOMAIN`; store the issuer as the exact HTTPS team origin expected in the token.
8. Before the Worker hostname becomes reachable, confirm the Access application still covers `admin.401688.xyz/*` and the owner-only policy is first in the intended evaluation order.
9. After the separately authorized Worker deployment, use a private browser session to prove: an unauthenticated visit is intercepted by Access; the approved owner can sign in; an unapproved identity cannot; `/api/session` succeeds only after Access; expired/wrong-audience/missing assertions fail at the Worker API.
10. Record the chosen session duration, owner identity rule, emergency recovery owner, and test result in private operations records. Do not record a JWT, identity-provider token, or secret value in Git or screenshots.

Access protects the hostname; the Worker JWT verifier remains mandatory defense in depth. A valid Cloudflare edge session without a JWT accepted by the Worker must not produce Admin API data.

## 10. Future custom domain and Worker deployment sequence

No command in this section was run by Checkpoint A. After Access is configured and the owner explicitly authorizes deployment:

1. Start from the reviewed `online-admin` checkpoint commit, verify the exact repository/branch/remote, and rerun `npm ci`, `npm run admin:check`, and `npm run check`.
2. Replace the placeholder Worker name in `admin/wrangler.jsonc` with the owner-approved stable name.
3. Add the future Custom Domain route in Wrangler configuration only after account/zone confirmation:

   ```json
   {
     "routes": [
       {
         "pattern": "admin.401688.xyz",
         "custom_domain": true
       }
     ]
   }
   ```

   Use the Workers Custom Domains flow; do not invent a zone/account ID or manually point an unrelated DNS record at a Worker. The Custom Domain operation should create/associate the required DNS and certificate state in the confirmed zone.
4. Keep `workers_dev: false`, `preview_urls: false`, Static Assets configuration, and `run_worker_first: ["/api/*"]` unchanged unless a later review approves a different exposure model.
5. From the confirmed Cloudflare account, set `TEAM_DOMAIN` and `POLICY_AUD` as Worker runtime secrets. Enter their real values interactively or through the approved secret store; do not place them in shell history, a committed `.env`, CI logs, or command arguments.
6. Run a final `wrangler deploy --dry-run` and inspect the bindings and asset count. A dry run is not the deployment approval.
7. Only after a separate final confirmation, run Wrangler deploy against `admin/wrangler.jsonc`. Checkpoint A deliberately supplies no `deploy` npm script so deployment remains an explicit owner operation.
8. Wait for the Worker Custom Domain certificate and route to become active. Verify that neither a `workers.dev` URL nor a preview URL exposes the Admin.
9. Execute the Access checks from Section 9, the three read-only API checks, static security-header checks, desktop/mobile navigation checks, and a zero-console-error pass on `https://admin.401688.xyz`.
10. Record the deployed Git commit and Worker deployment identifier. Do not label it production-approved until the owner accepts the protected result.

If Access cannot intercept the hostname, the audience is wrong, the Worker cannot validate its token, or a direct Worker URL is reachable, stop and remove/disable the new route or roll back the Worker deployment. Do not weaken JWT verification to make the test pass.

## 11. Complete server-only configuration and secret-name contract

The names below are the stable contract. Values are never committed, embedded in Static Assets, exposed by an API, copied to local storage, or given a browser-public prefix such as `NEXT_PUBLIC_` or `VITE_`.

| Name | Timing | Storage and purpose |
| --- | --- | --- |
| `ADMIN_ENVIRONMENT` | Checkpoint A | Non-secret Worker variable; production must be `production` |
| `ADMIN_AUTH_MODE` | Checkpoint A | Non-secret Worker variable; production must be `access` |
| `TEAM_DOMAIN` | Checkpoint A deployment | Required Worker secret; exact Cloudflare Access HTTPS issuer |
| `POLICY_AUD` | Checkpoint A deployment | Required Worker secret; exact Access application audience |
| `ADMIN_MEDIA_BUCKET` | Future R2 checkpoint | Native Worker R2 binding name, not a secret; bind only the owner-approved Admin staging/intake bucket |
| `R2_ACCOUNT_ID` | Future direct-upload checkpoint | Server-only Worker secret used only by the signing backend |
| `R2_BUCKET` | Future direct-upload checkpoint | Server-only bucket identifier; must match the single approved bucket |
| `R2_ACCESS_KEY_ID` | Future direct-upload checkpoint | Server-only, bucket-scoped R2 API credential |
| `R2_SECRET_ACCESS_KEY` | Future direct-upload checkpoint | Server-only, bucket-scoped R2 API credential |
| `GITHUB_APP_ID` | Future Git checkpoint | Server-only GitHub App identifier/configuration |
| `GITHUB_APP_INSTALLATION_ID` | Future Git checkpoint | Server-only installation identifier, limited to this repository |
| `GITHUB_APP_PRIVATE_KEY` | Future Git checkpoint | Server-only GitHub App private key |
| `GITHUB_TOKEN` | Future initial alternative only | Server-only fine-grained personal access token; mutually exclusive with App authentication |
| `GITHUB_OWNER` | Future Git checkpoint | Non-secret server configuration; exact owner from the verified repository |
| `GITHUB_REPOSITORY` | Future Git checkpoint | Non-secret server configuration; exact repository name |
| `GITHUB_BASE_BRANCH` | Future Git checkpoint | Non-secret server configuration; normally `main` after verification |

Checkpoint A requires only the first four names and implements no R2/GitHub consumer. Future bindings or secrets must not be added early “for convenience.” R2 upload credentials must remain distinct from the existing public portfolio build, which continues to require no R2 credential.

## 12. Future R2 binding and least-privilege model

The preferred future trusted-runtime access is one `ADMIN_MEDIA_BUCKET` Worker binding to a dedicated Admin staging/intake bucket. It must not grant account administration, bucket creation, DNS, Pages, unrelated-bucket, or Cloudflare user-management access. Worker code must expose only schema-constrained operations and must never accept a caller-supplied arbitrary bucket name or object key.

If the separately approved design retains direct browser-to-R2 upload, the trusted Worker may also need `R2_ACCOUNT_ID`, `R2_BUCKET`, `R2_ACCESS_KEY_ID`, and `R2_SECRET_ACCESS_KEY` to sign a single request. Create an R2 API token restricted to object read/write for the one approved bucket only. Do not grant account-wide administration or access to source/master/unrelated buckets. Because the platform's object-write scope may include destructive operations, the application must additionally contain no delete endpoint, no unconditional overwrite, and no way to sign an existing key.

Each future authorization must bind all of the following server-validated facts:

- authenticated owner identity;
- one normalized content SHA-256;
- one server-derived immutable key below the approved `v1/<scope>/<project>/<role>/...` vocabulary;
- one allowlisted MIME type and exact signed request headers;
- one owner-approved maximum byte size;
- one object creation attempt with overwrite protection;
- an expiry measured in minutes, never hours; the initial ceiling should be five minutes and should be shortened if real upload testing permits;
- one audit correlation ID that is not a credential.

The backend must verify the uploaded object, length, content type, and checksum before any manifest/PR work. An uploaded object whose Git change is rejected remains an unreferenced immutable candidate subject to the later retention/garbage-collection policy; it must not be overwritten or silently published.

## 13. Delivery CORS versus future upload CORS

The existing delivery CORS contract remains read-only: portfolio/approved preview origins, `GET` and `HEAD`, optional `Range`, and delivery/range response headers. Do not add `PUT`, Admin origins, or signing headers to that existing rule during Checkpoint A.

A later direct-upload checkpoint would add a separate, tightly scoped rule for the exact Admin origin. The proposed initial delta is:

```json
[
  {
    "AllowedOrigins": ["https://admin.401688.xyz"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["Content-Type", "x-amz-meta-sha256"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 300
  }
]
```

This is a future design contract, not active bucket configuration. The presigned authorization must expire in no more than 300 seconds initially, be valid for one server-derived immutable key, and sign the same `Content-Type` and `x-amz-meta-sha256` headers the browser sends. Do not allow `*` origins, methods, or headers. Do not add `POST`, `DELETE`, arbitrary `x-amz-*`, or portfolio origins to the upload rule. If resumable video later requires other methods or headers, reopen the security/CORS design and add only the exact protocol surface proven necessary.

Prefer a separate staging/intake bucket and upload rule. If the owner approves a single bucket instead, retain delivery and upload as distinct origin/method rules and verify that the public portfolio origin cannot perform a write and that the Admin origin does not receive broader delivery privileges than required. Purge cached delivery responses only when an actual CORS/configuration change requires it.

## 14. Future GitHub integration

GitHub remains the durable content/manifest source. A GitHub App is the recommended long-term integration because its installation can be restricted to this repository and it can mint short-lived installation tokens.

Recommended App setup after a separate Git checkpoint authorization:

1. Create an owner-controlled GitHub App with no public installation requirement.
2. Grant repository **Metadata: read**, **Contents: read and write**, and **Pull requests: read and write** only. Do not grant Administration, Actions, Secrets, Deployments, Members, or organization-wide permissions unless a demonstrated later operation requires one.
3. Install the App only on the verified `JRFank/jrfank-portfolio` repository.
4. Store `GITHUB_APP_ID`, `GITHUB_APP_INSTALLATION_ID`, and `GITHUB_APP_PRIVATE_KEY` only in the trusted Worker secret store.
5. Mint short-lived installation tokens server-side. Never return an installation token or App key to the browser.
6. Allow only server-generated branch names, allowlisted repository paths, schema-validated JSON/TypeScript changes, and pull-request creation. Never accept an arbitrary owner/repository/ref/path/commit SHA from the browser.
7. Prohibit force push, direct `main` writes, merge, release, tag, workflow, secret, and repository-setting operations.

An initial fine-grained `GITHUB_TOKEN` is an acceptable temporary alternative only when the owner explicitly chooses it. Limit it to the single repository, set an expiration, and grant only Metadata read, Contents read/write, and Pull requests read/write. Store it as a Worker secret, rotate/revoke it when the App replaces it, and never configure the token and App as silent fallbacks for each other.

## 15. Future staging, preview, and explicit publish workflow

Checkpoint A displays the vocabulary but implements none of these transitions. A future workflow must be monotonic, auditable, and owner-controlled:

1. **DRAFT** — validated semantic metadata/order changes exist only in Admin working state; no production reference changes.
2. **UPLOADED** — immutable candidate derivatives exist under one hashed key in the approved staging/intake flow; upload verification is still incomplete.
3. **VALIDATED** — checksum, type, dimensions/duration, schema, role, privacy/metadata, and visual review gates pass. Failure moves to **ERROR**, never to an overwrite.
4. Create a server-generated branch from the freshly verified `main`, commit only allowlisted catalog/manifest/content paths, and open a pull request. Never push directly to `main`.
5. Make validated immutable objects available to the separately approved preview delivery path without changing current production content selection.
6. **PREVIEW READY** — the pull request's Cloudflare Pages preview has passed build checks and the owner has a specific preview URL/commit to review. A successful upload alone cannot earn this state.
7. Owner reviews content, media, responsive behavior, and diff. Revisions create new immutable objects/commits; they do not rewrite published keys or silently amend an approved commit.
8. An explicit owner Publish confirmation authorizes merge of that exact reviewed pull request/commit. No scheduled, background, “save,” upload, or validation event may auto-merge.
9. After merge, the existing Pages production pipeline builds `main`. **PUBLISHED** is recorded only after the production deployment and required smoke checks succeed.
10. Any failed stage becomes **ERROR** with a non-secret diagnostic and retry path. The last known-good production deployment and manifest remain selected.

Preview and production domains, CORS, indexing, and Access policies remain separate. A preview is review evidence, not publication approval.

## 16. Rollback and recovery

- **Portfolio code/content:** roll back to a previously verified Cloudflare Pages deployment or revert the manifest/content commit through Git. Immutable objects referenced by that release must remain available.
- **Media:** select a retained earlier manifest. Never overwrite a hashed object and never delete objects as part of rollback. Orphan/superseded cleanup requires a separate reachability report, retention window, and owner approval.
- **Admin Worker:** redeploy the previous known-good checkpoint commit to the same protected custom domain. Keep the Access application enforced during rollback.
- **Access incident:** remove the affected identity/policy, revoke sessions where supported, and restore an owner-only policy before re-enabling the route. Do not add a public bypass as recovery.
- **R2 credential incident:** revoke/rotate the bucket-scoped credentials, disable upload authorization, preserve read-only delivery, and reconcile audit/object records before resuming.
- **GitHub credential incident:** revoke the App installation token/key or fine-grained token, disable Git mutation endpoints, inspect branches/pull requests, and rotate before resuming.
- **Partial publish:** do not advance state. Keep the last known-good production release, record **ERROR**, and resume from the first unverified transition with the same immutable evidence.

## 17. Security model for future checkpoints

The durable security model is defense in depth:

- Cloudflare Access authenticates the owner before any Admin static or API response.
- The Worker independently verifies Access JWT signature, issuer, audience, lifetime, and subject on every API request.
- The browser receives content data and narrowly scoped operation results, never Cloudflare, R2, or GitHub credentials.
- Runtime secrets remain server-only; the public portfolio build has none.
- All future mutation endpoints require same-origin enforcement, a reviewed CSRF strategy, content-type/body-size limits, schema validation, idempotency, audit IDs, and explicit authorization per transition.
- Finite role/scope/project vocabularies and server-derived object/repository paths replace arbitrary strings.
- Immutable object creation and no-overwrite behavior preserve rollback evidence.
- Git review and an exact preview precede explicit publication; upload/save never means publish.
- Logs must exclude JWTs, secret values, signed URLs, private keys, source masters, private EXIF, and raw request bodies. Retention and access require owner approval.
- Static portfolio availability and behavior remain independent from Admin, Access, GitHub, and R2 write availability.

Checkpoint A proves only the read-only repository implementation and local/mock authentication tests described above. Every future write control, binding, CORS rule, external identity policy, and deployment requires fresh implementation, review, verification, and owner authorization.
