# Deployment Specification

Status: Step 2 specification only  
Production topology: GitHub → Cloudflare Pages → custom site domain; media → Cloudflare R2 → custom media domain

## 1. Does Cloudflare Pages fully fit?

**Yes. Cloudflare Pages fully fits the specified portfolio.** The application is a Next.js static export with a finite route inventory and no runtime server requirements. Cloudflare's current Pages guide directly supports the Next.js Static HTML Export preset with `next build` and an `out` build directory.

No Pages Function, Worker, OpenNext adapter, vinext migration, VPS, container, database, or long-lived Node process is required. Adding any request-time feature later—authentication, request-specific headers, cookies, Server Actions, runtime API routes, SSR, ISR, or protected media—would trigger a new architecture review rather than being slipped into this topology.

## 2. Repository and branch model

Recommended minimal model:

- GitHub is the canonical source repository.
- `main` is the production branch.
- Pull requests create Cloudflare Pages preview deployments.
- Merges to `main` create production deployments.
- Cloudflare Pages handles atomic releases and rollback to retained deployments.
- Production media binaries are excluded by `.gitignore`; the generated manifest is committed.

Do not configure a GitHub Action to upload R2 media on every push. Media preparation and publishing is a separate, manually authorized or dedicated workflow.

## 3. Static export configuration

Normative Next.js settings:

```ts
const nextConfig = {
  output: 'export',
  trailingSlash: true,
};
```

The production build must not use:

- dynamic routes without `generateStaticParams()`;
- request-dependent Route Handlers;
- cookies or request headers;
- redirects or rewrites declared through Next.js runtime configuration;
- proxy/middleware;
- ISR or Draft Mode;
- Server Actions;
- intercepting routes;
- default Next.js image optimization.

All project slugs are generated from `src/content/`. Media uses pre-generated variants and the central resolver described in `MEDIA_ARCHITECTURE.md`.

## 4. Package scripts and build gates

Conceptual scripts for the implementation phase:

```json
{
  "scripts": {
    "dev": "next dev",
    "validate": "content and manifest validation",
    "build": "npm run validate && next build",
    "test": "unit tests",
    "test:e2e": "Playwright suite",
    "check": "lint + typecheck + unit tests + build"
  }
}
```

Cloudflare production build:

```text
Install: npm ci
Build:   npm run build
Output:  out
Branch:  main
```

Pin the Node major and package-manager version in the repository. Commit the lockfile. The build must fail on content/schema errors, missing manifest entries, unexpected mock URLs, type errors, or static-export violations.

## 5. Environment variables

### 5.1 Local development

`.env.local`:

```dotenv
SITE_URL=http://localhost:3000
MEDIA_URL=/mock-media
NEXT_PUBLIC_MEDIA_BASE_URL=/mock-media
```

`.env.example` contains names and safe placeholders only.

### 5.2 Cloudflare Pages production

```dotenv
SITE_URL=https://portfolio.example.com
MEDIA_URL=https://media.example.com
NEXT_PUBLIC_MEDIA_BASE_URL=https://media.example.com
```

### 5.3 Preview deployments

Pages preview URLs are variable. Choose one policy before implementation:

- Recommended: preview metadata uses the stable production `SITE_URL`, previews are marked `noindex`, and media CORS permits the relevant preview hostname pattern through a controlled cache/security rule.
- Alternative: maintain a fixed staging custom domain with its own environment values and use it for design approval.

Do not derive canonical URLs from an incoming request because there is no runtime server.

There are no secrets in the Pages build for normal operation. R2 credentials are intentionally absent.

## 6. Cloudflare Pages project setup

1. Create/import the GitHub repository in Workers & Pages.
2. Select **Next.js (Static HTML Export)**.
3. Set production branch to `main`.
4. Set build command to `npm run build` and build directory to `out`.
5. Add the environment variables above separately for production and previews.
6. Deploy to the generated `*.pages.dev` URL and run the smoke suite.
7. Add the final custom domain through the Pages project's Custom domains flow.
8. Configure the preferred-host redirect at Cloudflare DNS/redirect-rule level if both apex and `www` exist.
9. Optionally redirect or restrict the production `*.pages.dev` hostname to avoid a duplicate public origin.

Because `trailingSlash: true` emits directory indexes, Pages can serve routes directly without application rewrites.

## 7. Pages response headers

Place `_headers` in `public/`; Next copies it into `out/` and Pages applies it to static responses.

Recommended initial policy, to be finalized with actual font/media origins:

```text
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Cross-Origin-Opener-Policy: same-origin

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
```

A Content Security Policy is desirable but must be generated only after the final asset sources and inline theme bootstrap strategy are known. Expected directives include:

- `default-src 'self'`;
- `img-src 'self' https://media.example.com data:`;
- `media-src https://media.example.com`;
- `font-src 'self'`;
- `connect-src 'self' https://media.example.com` only if browser media inspection requires it;
- no third-party script origins.

Do not paste a strict CSP before verifying Next's emitted scripts and the pre-hydration theme snippet. Prefer a hashed bootstrap snippet over `'unsafe-inline'` if the final static build process can produce and maintain the hash safely.

Cloudflare `_headers` rules apply to static Pages responses. This architecture has no Pages Functions.

## 8. Cloudflare R2 setup

R2 delivery is a separate procedure:

1. Create a delivery bucket in the same Cloudflare account/zone context as the intended custom domain.
2. Keep the bucket private while preparing it.
3. Upload a small, versioned validation set with accurate `Content-Type` and immutable cache metadata.
4. Connect `media.example.com` under the bucket's Custom Domains setting.
5. Enable the desired Cloudflare cache behavior for that custom domain.
6. Configure bucket CORS for production, development, and the chosen preview policy.
7. Disable `r2.dev` public access for production.
8. Validate images and video through `https://media.example.com`, not only the S3 endpoint.
9. Upload the full derivative set and verify against the generated manifest.

Cloudflare documents that attaching a custom domain is what permits R2 content to use Cloudflare Cache. The custom domain is therefore mandatory, not cosmetic.

## 9. R2 object headers

For content-hashed media:

```text
Content-Type: image/avif | image/webp | image/jpeg | video/mp4
Cache-Control: public, max-age=31536000, immutable
```

Set metadata at upload time. Validate with `HEAD`/`GET` through the custom domain. Never infer MIME type solely from an extension during serving.

The delivery manifest, if published publicly for operational inspection, also uses a content-hashed filename. The app imports its committed copy and does not depend on a short-lived manifest request.

## 10. Media publishing flow

Code and media releases intentionally converge only through a manifest commit:

```text
Media operator
  1. prepares derivatives
  2. reviews contact sheets/encodes
  3. uploads immutable R2 keys
  4. verifies custom-domain responses
  5. commits new manifest + content references

GitHub / Pages
  6. validates manifest/content
  7. exports static site
  8. publishes atomic Pages deployment
```

If Step 5 is reverted, the earlier Pages deployment points to earlier immutable media that remains available. Keep superseded media for a defined rollback window, recommended at least 30 days for this portfolio.

## 11. Cache strategy

| Resource | Location | Versioning | Cache policy |
|---|---|---|---|
| Next JS/CSS chunks | Pages `/_next/static/` | build hash | 1 year, immutable |
| HTML | Pages routes | deployment | Pages/default revalidation behavior; do not force immutable |
| Fonts | Pages `/fonts/` | filename hash/version | 1 year, immutable |
| Icons | Pages `/icons/` | filename hash/version | long immutable when hashed |
| R2 image/video | media custom domain | content hash | 1 year, immutable |
| Public manifest | R2, optional | manifest hash | 1 year, immutable |

Do not use query strings as the primary versioning mechanism. Use hashed object keys.

## 12. DNS and domain plan

Recommended shape:

```text
portfolio.example.com  → Cloudflare Pages
media.example.com      → R2 custom domain
```

If the portfolio uses the apex, attach it through the Pages Custom domains workflow and ensure the zone is managed correctly in Cloudflare. Do not manually point a CNAME at `pages.dev` without associating the domain in the Pages project.

Canonical metadata always uses the chosen public host. Redirect the noncanonical public host at Cloudflare's DNS/Bulk Redirect layer rather than introducing a runtime application layer.

## 13. SEO and discovery

Build-time requirements:

- title template and route-specific titles;
- descriptions;
- canonical URLs from `SITE_URL`;
- favicon and application icons;
- default and per-project Open Graph/Twitter images;
- `sitemap.xml` generated from the same project arrays used by indexes;
- `robots.txt` appropriate to the launch mode;
- meaningful image alt text and video titles;
- valid document headings.

If “private portfolio” means intentionally non-indexed but publicly reachable, set `noindex, nofollow` consistently and omit the public sitemap until launch approval. This is not access control. Real confidentiality requires a separate protection decision and is currently out of scope.

Do not install analytics unless explicitly requested. Performance verification can use local Lighthouse/WebPageTest-style checks and Cloudflare's operational request metrics without adding visitor tracking scripts.

## 14. Deployment verification

### 14.1 Before merge

- lint, typecheck, unit tests, content validation;
- static production build succeeds;
- `out/` contains every approved route and 404;
- no server/Function artifact is required;
- no production URL contains `/mock-media`;
- no production photograph or film exists inside `out/`;
- sitemap routes exactly match published content;
- metadata uses HTTPS canonical/media origins;
- bundle and HTML checks confirm no R2 secret.

### 14.2 Preview smoke test

- root, all indexes, About, one Stills case, one Motion case, and 404;
- direct reload of nested trailing-slash routes;
- internal transition and browser back/forward;
- theme persistence across routes/reload;
- critical media, next-viewport lazy loading, and full-film non-download on indexes;
- menu, gallery hashes, carousel, video play/pause/error fallback;
- reduced motion and keyboard navigation;
- console free of hydration, missing-key, media, and ScrollTrigger warnings.

### 14.3 Production smoke test

- custom site domain certificate and canonical redirect;
- R2 custom media domain certificate;
- response security/cache headers;
- R2 CORS from the production origin;
- AVIF/WebP/JPEG negotiation and correct intrinsic sizes;
- MP4 progressive start, seek, pause/resume, and range responses;
- Open Graph image retrieval by an external validator;
- mobile Safari and Chromium end-to-end route passes.

## 15. Rollback and recovery

### Code rollback

Use Cloudflare Pages deployment rollback to a previously verified deployment. Because the deployment includes its manifest and media is immutable, code rollback is atomic from the site's perspective.

### Media rollback

Do not overwrite objects. Restore by deploying a previous manifest/content commit or a new manifest that points back to retained keys. R2 object deletion is not a rollback mechanism.

### Bad cache metadata

Upload corrected bytes/metadata at a new key, update the manifest, and deploy. Purge the media cache only when configuration changes such as CORS make it necessary; hashed assets should normally never need a purge.

## 16. Operational ownership

Define these roles even if one person holds all of them:

- content owner: approves bilingual copy, project order, captions, and credits;
- rights owner: confirms media and font licenses;
- media operator: prepares, reviews, uploads, and verifies derivatives;
- code maintainer: reviews schema/component/animation changes and Pages deployments;
- launch approver: approves domain, indexing mode, and production switch.

R2 credentials should be scoped to the delivery bucket and stored only in the authorized local/CI secret store. Do not put them in `.env.local` examples, GitHub content, Pages public variables, or the browser.

## 17. When this topology must be reconsidered

Reopen the deployment decision if any of the following becomes a requirement:

- true password/access protection inside the application;
- an editor-facing CMS preview that fetches unpublished content at request time;
- contact forms that must be processed by the site;
- user accounts, comments, search API, or database;
- per-request personalization or geolocation;
- signed/private media delivery;
- video transcoding or adaptive-stream generation on demand;
- ISR or runtime-generated social images.

Until then, adding a Worker or server is unnecessary complexity.

## 18. Official platform references

- Next.js static exports and unsupported features: <https://nextjs.org/docs/app/guides/static-exports>
- Cloudflare Pages static Next.js deployment: <https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/>
- Cloudflare Pages custom domains: <https://developers.cloudflare.com/pages/configuration/custom-domains/>
- Cloudflare Pages headers: <https://developers.cloudflare.com/pages/configuration/headers/>
- Cloudflare R2 public buckets/custom domains: <https://developers.cloudflare.com/r2/buckets/public-buckets/>
- Cloudflare R2 CORS: <https://developers.cloudflare.com/r2/buckets/cors/>
- Cloudflare R2 upload objects: <https://developers.cloudflare.com/r2/objects/upload-objects/>
- Cloudflare Cache with R2: <https://developers.cloudflare.com/cache/interaction-cloudflare-products/r2/>

