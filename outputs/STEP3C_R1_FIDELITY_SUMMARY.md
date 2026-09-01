# STEP 3C-R1 — Home reference fidelity correction

Completed on 2026-09-01. Scope stops at the corrected STEP 3C Home; STEP 3D was not started.

## 1. Interrupted-state audit

The interrupted run had successfully written the first structural correction pass:

- H01 used a real photographic Hero, the audited rounded media frame, and the required `JR FANK / PHOTOGRAPHER & / FILMMAKER` role structure.
- H02 used three controlled editorial lines with three inline photographic placements.
- H03–H05 retained the existing route-scoped choreography while abstract stand-ins were replaced with photographic media.
- Project palettes had become compact five-segment strips.
- Five original, temporary, project-owned mock-photo sets and their responsive manifest entries were present.
- Baseline screenshots existed, but final matched-state captures, comparisons, the R1 report, final regression, and a correction commit did not.

No completed media generation or existing H01–H05 work was repeated or reverted.

## 2. Previous H01/H02 fidelity mistakes

The earlier STEP 3C pass had applied the severity model too permissively:

- H01 was an abstract visual proxy with role-copy metrics and departure behavior that did not reproduce the Reference macro composition.
- H02 had a semantically similar introduction but not the Reference's three-line editorial sentence, inline-photo count, text/image relationship, or biography rhythm.
- H03–H05 still contained abstract stand-ins and palette dots even where the Reference clearly used photography and compact color strips.

Under the STEP 3C-R1 definitions, the earlier H01/H02 state was P1, not acceptable semantic similarity.

## 3. Sections corrected

### H01 fidelity assessment

- Dominant photographic media, rounded viewport card, navigation-to-media gap, title overlay, and three-line desktop role hierarchy now match the Reference macro structure.
- Entrance uses the audited card scale and masked title reveal; departure preserves the large media frame and moves/fades the copy rather than inventing a shrinking-card effect.
- Mobile now uses a content-driven, left-aligned three-line structure: `JR FANK / PHOTOGRAPHER / & FILMMAKER`, matching the Reference's responsive role hierarchy instead of wrapping into four centered lines.
- Traditional Chinese remains a restrained secondary layer and does not control the main geometry.
- Assessment: P1 structure resolved; remaining differences are the owned identity, licensed-font metrics, and temporary photo subject.

### H02 fidelity assessment

- Three controlled editorial lines now contain exactly three photographic inline glyphs at measured portrait/portrait/landscape proportions.
- Inline media, line wrapping, display scale, biography width/density, negative space, Chinese support line, and `READ MY STORY` CTA were tightened against the matched Reference states.
- Text and media reveal separately with the audited word/image stagger relationship; no circle, blob, capsule, CSS drawing, or abstract substitute remains.
- Assessment: the previous major P1 composition failure is resolved. Remaining drift is legal font construction and project-owned copy width.

### H03–H05 fidelity assessment

- H03/H04 retain their original paired-media sticky choreography, central metadata/title/CTA stack, rounded media, long section cadence, and compact segmented palettes.
- Mobile paired media was reduced and moved outward to restore the Reference's clear central editorial column.
- H05 retains one dominant 16:9 poster, three photographic satellites, centered metadata/title, play affordance, and trailing CTA.
- Assessment: macro composition and media relationships are aligned. Intermediate mobile silhouettes have small P3 timing/crop differences; protected subject matter is intentionally not reproduced.

## 4. Invented visual language removed

- H01/H02 contain real raster photography in every observed photographic role.
- Abstract Hero fields, decorative blobs/circles/capsules, palette dots, and non-evidenced extra bilingual paragraphs were removed from the Home composition.
- The remaining Hero shade is a functional contrast overlay over photography, not a substitute visual asset.
- No Reference production asset, proprietary SVG, aperture animation, biography, project copy, or commercial font was copied.

## 5. Reference vs Local evidence

Source truth:

- `reference/desktop/1440x900/home/000.jpg` through `100.jpg`
- `reference/mobile/390x844/home/000.jpg` through `100.jpg`

Local captures:

- Raw desktop: `outputs/step3c-r1-validation/final-desktop/`
- Comparison-normalized desktop: `outputs/step3c-r1-validation/final-desktop-normalized/`
- Mobile: `outputs/step3c-r1-validation/final-mobile/`

True combined comparisons:

- Desktop checkpoints: `outputs/step3c-r1-validation/comparisons/desktop/`
- Mobile checkpoints: `outputs/step3c-r1-validation/comparisons/mobile/`
- Desktop contact sheet: `outputs/step3c-r1-validation/comparisons/desktop-reference-local-contact-sheet.jpg`
- Mobile contact sheet: `outputs/step3c-r1-validation/comparisons/mobile-reference-local-contact-sheet.jpg`

The browser CSS viewport was verified at 1440 x 900 with 1440 px scroll width. The in-app capture surface emitted 1391 x 900 desktop rasters; raw files are preserved and comparison-only copies were normalized to 1440 x 900. Mobile source and Local captures are both native 390 x 844.

## 6. Matched-state checkpoint notes

| Checkpoint | Desktop comparison | Mobile comparison |
| ---: | --- | --- |
| 0% | H01 frame, title area, radius, and chrome align; owned wordmark/photo differ. | H01 card and left-aligned three-line role hierarchy align; owned title is shorter. |
| 10% | H01 departure exposes H02 at the same macro phase; photographic crop differs. | Hero exit and H02 lead-in align; title/photo content differs. |
| 20% | H02 editorial lines, three inline images, biography, and CTA occupy the corresponding state. | H02 is settled with comparable display/body density and the same three-glyph structure. |
| 30% | H03 paired media enter around the central project column at the corresponding phase. | H03 begins with outward media and preserved central whitespace. |
| 40% | H03 media/title/metadata/palette composition matches the sticky center state. | H03 shows the same flanking-image/central-title relationship without crowding. |
| 50% | H03 exits and H04 enters with comparable long-form negative space. | H03 exit cadence is preserved; photo crop and exact edge silhouette differ slightly. |
| 60% | H04 paired-media entry corresponds; owned imagery changes color weight. | H04 begins in the correct section phase; Local flanking images arrive slightly later (P3). |
| 70% | H04 centered title, flanking media, CTA, and strip palette align. | H04 center state preserves the Reference's narrow editorial title column. |
| 80% | H04 exit and H05 approach correspond; image subject drives minor crop differences. | H04 exit/H05 title lead-in follows the same sequence. |
| 90% | H05 main poster and satellite system occupies the equivalent motion-preview state. | H05 title/poster/satellites reproduce the same hierarchy; subjects differ intentionally. |
| 100% | H05 exit and footer/contact arrival align structurally. | CTA, contact card, social controls, and footer metadata arrive in the corresponding state. |

## 7. Remaining P1/P2/P3 issues

- Remaining P1: none.
- Accepted P2 — fonts: Cormorant Garamond, IBM Plex Sans, and Noto Sans TC cannot exactly reproduce Roslindale, Mint Grotesk, and the Reference/system Traditional Chinese metrics.
- Accepted P2 — media: original mock photography reproduces aspect ratio, crop role, tone, and visual mass, not protected Reference subjects or final project art direction.
- P3 — project-owned identity, project titles, biography, contact details, and bilingual strings have different lexical widths.
- P3 — a few intermediate mobile H03/H04 edge silhouettes and H05 satellite crops differ slightly at identical normalized scroll percentages.

There is no remaining actionable P0/P1/P2 issue within the authorized font/media scope. `design-qa.md` records `final result: passed`.

## 8. Runtime regression result

Pass.

- Repeated Home → Stills → Home, Home → Motion → Home, Home → About → Home, and Home → Stills case study → Home transitions retained one route-content surface and one transition overlay without DOM growth.
- The existing global runtime providers were not modified. Source ownership remains one Lenis instance, one GSAP ticker driver, and one route scope; Home still creates exactly five standard-motion ScrollTriggers and no reduced-motion triggers.
- Browser Back restored Home to `scrollY: 1754` after leaving at 1752; Forward returned to About at `scrollY: 0`.
- Dark/light F-stop behavior passed, including cross-route persistence and stable white Hero overlay text (`rgb(243, 246, 250)`) in light mode.
- Desktop/mobile labels passed (`F/24` and visible `F/23` respectively).
- Mobile menu passed the audited x=24, y=64, 342 x 326 geometry, link order, focus trap, inert state, Escape close, focus restoration, and scroll release.
- Reduced motion rendered H01/H02 content at opacity 1 with no transforms and reached the destination route within the 250 ms observation window.
- Production console review returned zero warnings, errors, or hydration messages.
- Horizontal overflow was zero at both primary viewports.

## 9. `npm run check` and static export

Pass.

- Strict TypeScript: pass.
- Content/media validation: 2 placeholder projects and 12 media assets.
- Next.js optimized build: pass.
- Static/SSG generation: 11 pages.
- HTTP 200 from `out/`: `/`, `/about/`, `/stills/`, `/stills/project-01/`, `/motion/`, `/motion/project-01/`, `/robots.txt`, and `/sitemap.xml`.

## 10. Mock-media limitations

- The five new Home media sets are original, temporary, project-owned visual stand-ins created only for spatial/fidelity validation.
- They cover dark full-width Hero, cool portrait, high-detail waterfall portrait, warm portrait, and wide cinematic-rain roles.
- Responsive files are JPEG/WebP only, contain no RAW/private master, and expose no EXIF/IPTC/XMP profile data through the generated derivatives.
- R2 remains disconnected. Final owned photography/video and the later production manifest may change crop weight and must be revalidated at the same checkpoints.

## 11. Font limitations

- No Roslindale or Mint Grotesk files were obtained or copied.
- Replaceable tokens remain `--font-display`, `--font-sans`, and `--font-tc`.
- Cormorant Garamond is less condensed/optically dense than Roslindale despite calibrated tracking; IBM Plex Sans differs from Mint's grotesk construction; Noto Sans TC differs subtly in character density.
- Licensed replacements will require a final line-break, cap-height, and navigation-width check.

## 12. Repository safety review

Pass.

- No `.env` file, Cloudflare/R2 credential, private key, secret value, copied commercial font binary, RAW/private master, or production Giulia Gartner asset was staged.
- New public media hashes do not match any Reference evidence file.
- No invalid AVIF derivative, generated cache, `.next`, `out`, or `work/` artifact was committed.
- The 11 MiB validation directory is intentional QA evidence; the 2.9 MiB mock-media directory is the intentional development baseline.
- `git diff --check` passed.

## 13. Commit

- Completed correction implementation and validation commit: `60c7964e39a916871f057d70fb1a18cb065b3085`
- Subject: `fix: correct home reference fidelity`
- This report is committed immediately afterward so it can record the stable correction commit hash without a self-referential hash.

## 14. Stop point

STEP 3C-R1 is complete and ready for human visual review. STEP 3D was not started.
