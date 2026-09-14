# Production media intake contract

`catalog.json` is the Git-tracked, human-editable source of production media intent. Binary masters never live in this directory in Git: place authorized local inputs under ignored `media-source/masters/` or reference another repository-relative, ignored work path.

The catalog records semantic facts only:

- stable media `id`, `scope`, `project`, and `role`;
- source path used by the operator;
- English/Traditional Chinese title or description where supplied;
- image alt text, optional focal point/dominant color, and an explicit 3200 px approval;
- video poster, dimensions, duration, preview/full-film role, audio policy, and confirmation that the input is an approved web derivative;
- optional editorial order.

Allowed roles are `hero`, `cover`, `gallery`, `rail`, `poster`, `satellite`, `filmstrip`, `bts`, `preview`, `full-film`, `about`, and `social`. Layout coordinates, percentages, CSS, animation values, camera filenames, and absolute local paths are rejected.

`generatedAt` is deliberately authored rather than generated from the wall clock, so identical catalog/source inputs produce identical derivatives, object keys, fingerprints, and candidate manifests. `baseManifest` lets a release replace named entries without making the application query R2.

The checked-in examples are non-production fixtures:

- `examples/mock-image.json` safely exercises intake and Sharp inspection against an existing project-owned mock image.
- `examples/mock-upload-plan.json` safely exercises the credential-free R2 publish dry-run. It never contacts Cloudflare.

Normal flow:

```bash
npm run media:prepare -- --catalog media-source/catalog.json --dry-run
npm run media:prepare -- --catalog media-source/catalog.json
npm run media:validate -- --manifest .media-work/media-manifest.candidate.json
npm run media:publish -- --plan .media-work/upload-plan.json --dry-run
# Only after owner authorization and secrets are present:
npm run media:publish -- --plan .media-work/upload-plan.json --apply
```

Image preparation normalizes orientation, converts to sRGB, strips source metadata, prevents upscaling, and writes AVIF/WebP/JPEG derivatives at the approved 640/1280/1920/2560 ladder. 3200 px is opt-in per asset. It never sharpens, denoises, or performs a generative edit.

Video transcoding is an explicit operator step. `media:video:plan` prints non-executing ffmpeg commands; `media:video:validate` requires ffprobe and verifies H.264, yuv420p, dimensions, duration, preview audio policy, and faststart before `media:prepare` accepts a prepared MP4.
