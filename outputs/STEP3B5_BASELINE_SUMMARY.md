# STEP 3B.5 — Baseline lock before Home

Completed on 2026-08-28. STEP 3C Home was not started.

## 1. Git repository initialized

- Git was initialized in the actual project root on branch `main`.
- First/root baseline commit: `9b23bb34c383d7239db19fffaf7094b009c5f243`
- Commit subject: `chore: lock validated step 3 foundation baseline`
- No GitHub or other Git remote is configured.
- The baseline commit contains the application source, documentation, outputs, intentional local mock-media derivatives, and required Reference browser-capture evidence.

This summary is recorded after the root commit so it can contain that commit's final, stable hash.

## 2. Files excluded by `.gitignore`

The repository excludes:

- dependencies and generated application output: `node_modules/`, `.next/`, `out/`;
- local environment/deployment files: `.env`, `.env.*`, `.dev.vars`, `.dev.vars.*`, while explicitly retaining `.env.example`;
- temporary validation and local caches: `work/`, `.playwright-cli/`, `*.tsbuildinfo`, `*.log`, `.cache/`, `.turbo/`, `.vercel/`, `.wrangler/`, `coverage/`, `playwright-report/`, `test-results/`;
- OS/editor metadata: `.DS_Store`, `Thumbs.db`, `*.swp`, `*.swo`.

The following remain intentionally trackable: `docs/`, `outputs/`, `reference/`, `src/`, scripts, configuration, and `public/mock-media/`.

## 3. Secret and asset safety check

Result: pass.

- No credentials, access tokens, private keys, Cloudflare credentials, or non-local service endpoints are tracked.
- `.env.local` is ignored. The tracked `.env.example` contains localhost and `/mock-media` values only.
- The only secret-like variable name found in tracked text is the documentation placeholder `R2_SECRET_ACCESS_KEY`; no value is present.
- No `.woff`, `.woff2`, `.ttf`, `.otf`, or `.eot` font binaries are tracked. Roslindale and Mint Grotesk were not downloaded or copied.
- No RAW/master media formats, private media masters, or production downloads are tracked.
- No Giulia Gartner production assets exist outside `reference/`. That directory contains 507 small JPEG browser captures retained solely as the required fidelity evidence, not source media or downloadable masters.
- Project mock derivatives contain no embedded metadata profiles and were generated or derived from project-owned neutral test media.
- The staged baseline contained no files larger than 10 MiB.
- `npm audit` reported zero vulnerabilities.

## 4. Temporary font decision

The temporary production tokens are:

| Token | Temporary face | Role |
|---|---|---|
| `--font-display` | Cormorant Garamond 400 | display headings and menu display text |
| `--font-sans` | IBM Plex Sans 500/700 | navigation, metadata, controls, and body UI |
| `--font-tc` | Noto Sans TC 500 | Traditional Chinese |

All are supplied through Fontsource packages under the SIL Open Font License. The packages remain replaceable at the token/import boundary if licensed originals are supplied later. Bodoni Moda and Work Sans remain development-only comparison candidates used by the fixture.

Official license/provenance references:

- Cormorant: <https://github.com/CatharsisFonts/Cormorant>
- IBM Plex: <https://github.com/IBM/plex>
- Noto: <https://github.com/notofonts/noto-docs/blob/main/docs/website/use.md>
- Bodoni Moda comparison candidate: <https://github.com/google/fonts/blob/main/ofl/bodonimoda/OFL.txt>

## 5. Font-metric fixture and limitations

`outputs/STEP3B5_TYPOGRAPHY_FIXTURE.html` compares the exact audited Reference hero strings `GIULIA GARTNER`, `PHOTOGRAPHER &`, and `FILMMAKER`, plus representative navigation, project-title, metadata, and Traditional Chinese samples. It waits for font loading and reports measured browser widths. `outputs/step3b5-typography-fixture.png` is the visual record.

Reference target widths at 108 px were estimated from the audited 1440 px screenshot as approximately 690 px, 771 px, and 506 px. Results:

| Candidate | `GIULIA GARTNER` | `PHOTOGRAPHER &` | `FILMMAKER` | Width difference from Reference |
|---|---:|---:|---:|---:|
| Bodoni Moda, raw | 954.9 px | 1037.4 px | 664.3 px | +31% to +38% |
| Cormorant Garamond, raw | 877.1 px | 968.3 px | 605.5 px | +20% to +27% |
| Cormorant Garamond, calibrated | 725.9 px | 817.1 px | 508.3 px | +0.4% to +6.0% |
| macOS Bodoni 72, raw | 818.4 px | 884.2 px | 579.9 px | +14.6% to +18.6% |

The calibrated display treatment uses `letter-spacing: -0.1em` and lining numerals. IBM Plex Sans produced navigation-pill widths of 61.9 px for Stills, 69.1 px for Motion, and 62.9 px for About, closely matching the audited Reference geometry.

Remaining limitations:

- Cormorant Garamond still differs from Roslindale in serif construction, cap character, x-height, stroke contrast, and optical density. Its metric fit depends on aggressive negative tracking.
- IBM Plex Sans has more technical/humanist details than Mint Grotesk even though the tested navigation widths are compatible.
- Noto Sans TC differs subtly from the Reference/system Traditional Chinese face in character proportions and density.
- Final Home line breaks must be rechecked if licensed originals replace these substitutes.

## 6. Aperture/static-mark decision

The existing static aperture/f-stop mark is retained. Its observed visual function is reproduced with original project geometry; no proprietary Reference asset was copied. No aperture-ring animation, Lottie asset, or inferred motion was introduced. The static mark is not a blocker for STEP 3C.

## 7. Content and media readiness

- Identity and bilingual placeholder copy remain project-owned, content-driven data. No Giulia Gartner biography or project copy was copied.
- R2 is not connected; media continues to resolve from authorized local mock derivatives.
- The manifest now validates seven media assets and covers the required composition range:
  - landscape/full-width/dark: `site.home-hero`;
  - portrait: Stills cover and About portrait;
  - motion poster: `motion.project-01.poster`;
  - light/high-detail landscape: `site.light-detail`.
- The light/high-detail source was generated with the built-in ImageGen tool as original, project-bound mock media. Prompt intent: an original high-key, high-detail salt-flat editorial landscape with pale mineral textures, shallow reflective water, distant low mountains, no people, no text, no identifiable landmark, and no named artist style. Checked-in AVIF/WebP/JPEG derivatives were resized and stripped of metadata.

## 8. Frozen global runtime regression result

The STEP 3 interaction baseline remains unchanged. No validated runtime provider, lifecycle owner, transition timing, menu timing, theme state machine, scroll behavior, or reduced-motion branch was refactored during STEP 3B.5. Changes were limited to font package/import/token selection, calibrated display typography, the additional neutral mock-media asset, its manifest entry, and validation evidence.

Post-change browser regression passed three Playwright suites:

- desktop route lifecycle, theme persistence, font resolution, responsive overflow, and Back/Forward restoration;
- 390 × 844 mobile menu labels, focus trap, inert state, scroll release, theme behavior, and exact 342 × 326 panel geometry at x=24/y=64;
- reduced motion with Lenis and the GSAP ticker driver disabled before and after navigation.

Stable development diagnostics after repeated route transitions:

| Diagnostic | Result |
|---|---:|
| Lenis instances | 1 |
| GSAP ticker drivers | 1 |
| Active route scopes | 1 |
| ScrollTriggers | 0 |
| Preload state | `ready` |
| Transition phase | `idle` |

Reduced-motion diagnostics remained 0 Lenis instances and 0 GSAP ticker drivers. Browser consoles reported zero errors and zero warnings, including zero hydration errors.

`npm run check` passed strict TypeScript, content/media validation, and the Next.js 16.3.3 optimized static build. Eleven static pages were generated. `/`, both index routes, both placeholder project routes, `/about/`, `/robots.txt`, and `/sitemap.xml` each returned HTTP 200 from `out/`.

## Baseline-lock conclusion

STEP 3B.5 is complete. The validated STEP 3 global systems are frozen as the regression baseline. STEP 3C Home has not started.
