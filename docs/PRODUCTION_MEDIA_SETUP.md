# Production Media Setup — Cloudflare Pages and R2

Status: owner-run setup required; no Cloudflare resource was created or changed by the foundation phase.

## 1. Resource topology

GitHub remains canonical for the static application, `media-source/catalog.json`, `src/generated/media-manifest.json`, and media tooling. Cloudflare Pages builds the repository without querying R2. A Cloudflare R2 delivery bucket stores only immutable web derivatives and is served through a custom media hostname.

Do not choose the final site hostname, media hostname, bucket name, or account ID until the owner confirms them. The examples below use documentation placeholders only.

## 2. Create the R2 delivery bucket

1. In the Cloudflare Dashboard, open **R2 Object Storage** and create one delivery bucket in the account that manages the intended media-domain DNS zone.
2. Choose and record the real bucket name outside Git until configuration is approved.
3. Keep the bucket private during setup. Do not upload masters; only validated AVIF, WebP, JPEG, and MP4 derivatives belong in the delivery bucket.
4. Create an R2 API token scoped to object read/write for this bucket only. Store it in the authorized local or CI secret store.

Upload-only runtime secret names:

```text
R2_ACCOUNT_ID
R2_BUCKET
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
```

These values are never Pages variables, never browser values, never committed, and never prefixed `NEXT_PUBLIC_`. Normal validation and site builds do not need them.

## 3. Attach the custom media domain

1. Open **R2 Object Storage → bucket → Settings → Custom Domains → Add**.
2. Select the owner-approved media hostname. Its DNS zone must be in the same Cloudflare account as the bucket.
3. Wait for the custom-domain certificate and status to become active.
4. Use the custom domain for production verification and delivery. The `r2.dev` URL is development-only and rate-limited; disable it for production in the bucket settings or with `wrangler r2 bucket dev-url disable <BUCKET_NAME>` after replacing the placeholder locally.

The custom domain is required for Cloudflare Cache and security controls. Do not place an `r2.dev` URL in the committed manifest or Pages environment.

## 4. Configure CORS

Apply bucket CORS using the confirmed production site origin, the selected preview policy, and the local development origin. Replace placeholders before applying:

```json
[
  {
    "AllowedOrigins": [
      "https://portfolio.example.com",
      "https://preview.example.com",
      "http://localhost:3000"
    ],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["Range"],
    "ExposeHeaders": [
      "Accept-Ranges",
      "Cache-Control",
      "Content-Length",
      "Content-Range",
      "ETag"
    ],
    "MaxAgeSeconds": 86400
  }
]
```

Do not assume wildcard subdomains are accepted as browser CORS origins. Prefer a fixed preview custom domain or list exact approved origins. If CORS changes after objects have been cached, purge the media hostname cache before retesting so stale headers do not hide the new policy.

## 5. Cache and object headers

Every repository-published object has a content hash in its key and must carry:

```text
Content-Type: image/avif | image/webp | image/jpeg | video/mp4
Cache-Control: public, max-age=31536000, immutable
x-amz-meta-sha256: <full SHA-256 from upload plan>
```

The publisher performs `HEAD`, uploads only missing keys, refuses mismatched existing objects, and performs a second `HEAD` after upload. Never overwrite a hashed object. Configure/cache through the custom media domain, then verify image responses plus MP4 progressive start, seek, range responses, MIME type, CORS, and cache headers through that hostname.

## 6. Cloudflare Pages project

1. In **Workers & Pages**, import the GitHub repository.
2. Select the **Next.js (Static HTML Export)** framework preset.
3. Set production branch to `main` only after the phase branch has been reviewed and separately approved for merge.
4. Set install command to `npm ci`, build command to `npm run check`, and output directory to `out`.
5. Configure production and preview values only after the owner chooses domains:

```dotenv
SITE_URL=https://portfolio.example.com
MEDIA_URL=https://media.example.com
NEXT_PUBLIC_MEDIA_BASE_URL=https://media.example.com
NEXT_PUBLIC_SITE_INDEXABLE=false
```

`MEDIA_URL` and `NEXT_PUBLIC_MEDIA_BASE_URL` must match. The latter is public by design; it is only an origin. No R2 credential or bucket/account identifier belongs in Pages.

6. Keep the existing development values for local mock mode:

```dotenv
SITE_URL=http://localhost:3000
MEDIA_URL=/mock-media
NEXT_PUBLIC_MEDIA_BASE_URL=/mock-media
NEXT_PUBLIC_SITE_INDEXABLE=false
```

7. Confirm the build emits all 18 static entries to `out/` and creates no Function/Worker/runtime artifact.

## 7. Owner publish sequence

1. Add final project-owned media metadata to the catalog and keep source binaries in ignored local storage.
2. Run preparation in dry-run, then prepare derivatives and review the candidate manifest/upload plan.
3. Validate images visually and validate every prepared video with ffprobe.
4. Run R2 publishing in dry-run.
5. Only with explicit owner authorization, load the four upload secrets and run `media:publish -- --apply`.
6. Verify the uploaded objects through the custom media domain.
7. Copy/review the candidate into `src/generated/media-manifest.json`, update content media IDs, and commit only metadata/manifest/code.
8. Review the Pages preview. Merge to `main` only after human approval.

Rollback selects an earlier Git/Pages manifest while retaining immutable objects for the agreed retention window. Object deletion is a separate garbage-collection operation and is not part of publishing or rollback.
