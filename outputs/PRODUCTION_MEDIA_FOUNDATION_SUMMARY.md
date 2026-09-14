# Production Media Foundation Summary

Final phase label: **PRODUCTION MEDIA FOUNDATION CANDIDATE — AWAITING REVIEW**

## Branch and scope

- Branch: `production-media`, created from clean `main` at `a5c8390028c25bfc10a619b64d0da4f7ce625eb6` and pushed with upstream tracking.
- Main was not edited or merged. No page, route, animation, responsive behavior, content selection, or approved interaction was redesigned.
- No Cloudflare resource was created or changed. No R2 network operation occurred.
- Existing `/mock-media` resolution and the committed 24-asset development manifest remain active, preserving all 18 static entries.

## Tooling added

- `media:prepare`: typed catalog validation plus deterministic Sharp preparation and upload-plan generation.
- `media:validate`: development-compatible current-manifest validation and production-strict validation for any generated `v1/` entry; `--production` is the later all-production gate.
- `media:publish`: local plan/hash/byte validation, default credential-free dry-run, and explicit `--apply` mode using the R2 S3 API.
- `media:video:plan`: prints reviewed ffmpeg command paths without running a transcode.
- `media:video:validate`: uses ffprobe plus an MP4 atom check before a prepared video can enter a manifest candidate.
- `media:verify-client`: scans generated client/static output for the four R2 secret names and any supplied values.
- `media:verify-repository`: rejects tracked files in production master/derivative roots and confines existing tracked binary media to approved mock and historical reference/evidence roots.

Normal `npm run validate`, `npm run build`, and `npm run check` require no Cloudflare credentials.

## Manifest and intake architecture

`src/generated/media-manifest.json` remains the deterministic manifest imported by the static application; the app never queries R2 at build or runtime. `media-source/catalog.json` is the Git-tracked, human-editable intake source. It supports stable media ID, scope/project assignment, constrained role, bilingual title/description, alt, focal point, optional dominant color, editorial order, and explicit 3200 px approval.

Video intake records poster ID, preview/full-film role, width/height, duration, audio policy, actual audio-stream state, and explicit confirmation that the source is an approved web derivative. Optional video manifest fields were added backward-compatibly; all 24 existing manifest entries continue to validate unchanged.

Catalog source paths must be repository-relative. Absolute paths, parent traversal, and camera filenames such as `IMG_1234`/`DSC_0001` are rejected. Layout coordinates are not part of the contract. The authored `generatedAt`, catalog, and source hashes produce a stable source fingerprint; content hashes produce immutable semantic object keys under `v1/<scope>/<project>/<role>/`.

## Image pipeline

The implemented path is: input master → inspect orientation/dimensions → normalize orientation → sRGB → strip source metadata/EXIF → resize without upscaling → AVIF/WebP/JPEG → SHA-256/bytes/object key → manifest candidate and upload plan.

Approved widths are 640, 1280, 1920, and 2560. A 3200 variant requires per-asset `allow3200: true`. Starting encoder qualities remain explicit in code (AVIF 55, WebP 78, JPEG 84). The pipeline does not sharpen, denoise, auto-enhance, crop, or perform generative edits.

The existing mock social image was used for safe verification. Dry-run inspected 1200 × 630 and planned three 640 px formats without writing. A separate ignored work-area execution created all three variants; inspection confirmed 640 × 336, sRGB, and no EXIF for AVIF/WebP/JPEG. The candidate contained 25 assets and validated; the derived upload plan passed a credential-free dry-run. The ignored generated work area was removed from the checkout afterward.

## Video pipeline

The contract distinguishes image poster, muted/no-audio short preview, and full film. The command planner emits H.264/yuv420p/faststart MP4 commands, strips input metadata, and never runs them automatically. Preview always uses `-an`; full-film audio is omitted unless the operator explicitly selects the approved-audio path.

Prepared MP4 intake requires `approvedWebDerivative: true`. Before manifest generation, ffprobe verifies H.264, yuv420p, exact dimensions, declared duration tolerance, and audio-stream policy; the binary check verifies the `moov` atom precedes `mdat`. No production video was transcoded or committed in this phase.

## R2 publish architecture

Dry-run is the default and explicit `--dry-run` is supported. It validates every local file against its plan, requires the full SHA-256 prefix in the immutable key, prints key/type/bytes/hash, reads no credentials, and makes no network request.

Explicit `--apply` is a separately authorized operation. It requires `R2_ACCOUNT_ID`, `R2_BUCKET`, `R2_ACCESS_KEY_ID`, and `R2_SECRET_ACCESS_KEY` only at runtime. For each object it performs `HEAD`; matching objects are verified/skipped, missing objects are uploaded with correct `Content-Type`, `Cache-Control: public, max-age=31536000, immutable`, and SHA-256 metadata, then `HEAD`-verified. Any existing mismatch fails instead of overwriting.

The foundation uses the R2 S3-compatible API, so no Wrangler binding/config with invented bucket or account values was added. Wrangler remains an owner-side option for disabling the production `r2.dev` URL.

## Cloudflare resources and owner setup

The owner must still:

1. Choose the real site domain, media domain, R2 bucket name, and Cloudflare account/zone.
2. Create the delivery bucket and a bucket-scoped object read/write token.
3. Attach a media custom domain from a DNS zone in the same Cloudflare account.
4. Apply exact-origin GET/HEAD CORS, configure/verify cache behavior, and disable production `r2.dev` access.
5. Configure Cloudflare Pages for GitHub, **Next.js (Static HTML Export)**, production branch `main`, `npm ci`, `npm run check`, and output directory `out`.
6. Set the three non-secret production origins in Pages only after domains are chosen.
7. Publish only after separate authorization, verify custom-domain MIME/cache/CORS and MP4 range/seek behavior, commit the reviewed manifest/content change, inspect a Pages preview, then separately approve production.

Exact owner steps and placeholder CORS/environment examples are in `docs/PRODUCTION_MEDIA_SETUP.md`.

## Future online Admin

`docs/ADMIN_MEDIA_ARCHITECTURE.md` defines a later separate protected surface: Cloudflare Access → trusted Admin backend → narrow short-lived upload authorization → direct R2 upload → server-side object verification and GitHub metadata/manifest pull request → Pages preview → owner approval. Browser code never receives R2 or GitHub credentials. The public portfolio remains a static export with no API routes, Pages Functions, Server Actions, SSR, ISR, database, or authentication.

## Secrets contract

- Public/build-time media values: `NEXT_PUBLIC_MEDIA_BASE_URL`, `MEDIA_URL`, and `SITE_URL`.
- Development media values remain `/mock-media`; production examples use safe `example.com` placeholders and are not activated.
- Upload-only runtime names: `R2_ACCOUNT_ID`, `R2_BUCKET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`.
- A validator rejects credential-like `NEXT_PUBLIC_*` names; the built client/static output scan found no upload secret name or supplied secret value.
- No credential value was used, written, logged, or committed.

## Verification evidence

All listed commands exited 0 after the final implementation:

- `npm run typecheck`
- `npm run media:validate` — 24 current assets plus intake catalog, development-compatible mode.
- `npm run media:prepare -- --catalog media-source/examples/mock-image.json --dry-run` — one safe existing mock input inspected; no output written.
- `npm run media:prepare -- --catalog media-source/examples/mock-image.json` — three ignored derivatives, deterministic candidate, and upload plan created for pipeline verification.
- `npm run media:validate -- --manifest .media-work/media-manifest.candidate.json --catalog media-source/examples/mock-image.json` — 25 assets validated, including the generated strict `v1/` entry.
- `npm run media:publish -- --plan .media-work/upload-plan.json --dry-run` — three immutable objects validated/planned; no credentials or network.
- `npm run media:publish -- --plan media-source/examples/mock-upload-plan.json --dry-run` — checked-in dry-run fixture validated without credentials/network.
- `npm run media:video:plan -- --input media-source/masters/example-film.mov --output-prefix media-source/prepared/example-film --preview-seconds 8` — command plan printed; no transcode.
- `npm run check` — typecheck, content/media validation, optimized static build, client secret scan, and tracked-binary guard all passed.
- Next static export: **18/18** generated.
- Client/static scan: 117 files, no R2 credential names or supplied values.
- Git tracking scan: 918 baseline tracked files at the time of the implementation checkpoint; no tracked production master/derivative root and no binary outside approved mock/reference/evidence roots.

## Remaining blockers

- Final project-owned photographs, video masters/approved derivatives, bilingual metadata, alt text, and per-film audio decisions are not supplied.
- Real domains, account, bucket, Access policy, preview policy, credentials, CORS, cache behavior, Pages project, and R2 custom domain are not configured.
- The final media catalog/manifest is not authored and no content ID is switched to production.
- Production custom-domain response, CORS/cache, range/seek, real-network, Pages preview, physical Safari/iOS, and owner visual QA cannot be completed before those inputs/resources exist and are separately authorized.
- The online Admin implementation is a later subphase.

No production release claim is made. **PRODUCTION MEDIA FOUNDATION CANDIDATE — AWAITING REVIEW**
