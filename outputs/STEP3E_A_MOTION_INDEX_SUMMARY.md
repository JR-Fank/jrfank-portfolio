# STEP 3E-A Motion Index candidate

**STEP 3E-A CANDIDATE — AWAITING HUMAN APPROVAL**

## Identity and scope

- Repository: `JR-Fank/jrfank-portfolio`.
- Branch: `step3e-motion`; `main` remains at the approved STEP 3D baseline `f2fd298f295ea1862cec45f10f204d429379bfc0`.
- Foundation checkpoint: `b98d669b2d739b1daa3259c37f6be235f7700baa`.
- Motion Index checkpoint: `4031bf2846778584671bd12975fc616d753a1ebf`.
- Compact composition correction: `9e3027c07794c7ca4ea29a7892747100eafc6235`.
- Candidate HEAD: the phase-branch commit containing this report. Resolve it with `git log -1 --format=%H -- outputs/STEP3E_A_MOTION_INDEX_SUMMARY.md`; a commit cannot embed its own final hash.
- Validation finalized 2026-09-12, Asia/Shanghai.
- Scope is STEP 3E-A only: Motion content foundation and Motion Index. STEP 3D was not reopened, approved global systems were not refactored, and STEP 3E-B was not started.

## Content and schema foundation

Motion now has its own typed content model rather than reusing the Stills block union. The model separates identity, index composition, case-study data, playback readiness, filmstrip rows, credits, behind-the-scenes sequence, Explore More links and SEO. Index layout is constrained to a finite authored preset union, and playback readiness is a discriminated union between `temporary-development` and `production-ready` states.

Five original bilingual development projects are defined:

1. After Rain — `/motion/after-rain/`
2. Tidal Signal — `/motion/tidal-signal/`
3. Night Passage — `/motion/night-passage/`
4. Drift Line — `/motion/drift-line/`
5. Mineral Air — `/motion/mineral-air/`

The content validator checks unique slugs and index numbers, valid media IDs, exactly three satellite IDs per index stage, finite layout/accent values, complete temporary-media replacement notes, playback source policy, filmstrip/BTS media, credits, Explore More relationships and SEO. It reports absent final films as explicit `temporary-development` notices instead of treating them as production-ready media.

The existing authorized mock-media manifest is reused. No Reference photography, Reference video, commercial font file, secret or private media master was added. The index client receives only each project's `slug`, `identity` and `index` data; case-study/BTS payloads are not serialized into the index bundle.

## Motion Index implementation

The generic placeholder at `/motion/` is replaced by:

- M01 editorial introduction with bilingual copy.
- M02–M06 data-driven project stages.
- One dominant poster and exactly three visible satellite frames per stage.
- Alternating `title-above`, `title-below` and `title-split` compositions.
- Date/location metadata, bilingual title, accessible poster link, central play treatment and direct CTA.
- Poster-only index media: no `<video>`, iframe, preview autoplay or full-film request.
- Transform-first GSAP motion with one ScrollTrigger per stage, measured viewport/element distances, `invalidateOnRefresh`, forward/reverse continuity and route-scoped cleanup.
- Deliberate tablet/mobile/compact recomposition, including main-poster bleed and visible satellites on touch.
- Complete reduced-motion presentation with no Motion-specific ScrollTrigger required for comprehension.

The final compact correction increased usable stage depth and moved the third satellite away from the CTA. It also made image-readiness cleanup idempotent and narrowed the client data boundary.

## Browser validation

All browser work used the installed Google Chrome in headed mode through the Playwright CLI wrapper.

| Area | Evidence/result |
| --- | --- |
| Fixed viewport matrix | 14/14 sizes passed: 1920×1080, 1440×900, 1280×800, 1024×768, 992×800, 991×800, 820×1180, 768×1024, 767×1024, 600×900, 479×844, 430×932, 390×844 and 360×800. |
| Stage composition | Across 70 calibrated stage midpoints: 70/70 main posters visible; 70/70 had exactly three visible satellites; 70/70 had usable CTAs, contained title/metadata, four loaded images and finite transforms. |
| Index media policy | 14/14 viewports contained zero video and zero iframe. Production export checks at 1440×900 and 390×844 also contained zero video and zero iframe. |
| Overflow | No document-level horizontal overflow at any of the 14 fixed viewports, any of the 11 live-resize widths or either production-export check. |
| Scroll continuity | Every stage was sampled at progress 0.18→0.50→0.82→0.50→0.18. All 280 intervals moved, every sequence reversed direction and measured transform-vector travel remained finite. |
| Live resize | One document completed 1440→1180→992→991→820→767→600→479→390→360→1440 without reload. Across 55 stage samples, media/satellites stayed visible, transforms stayed finite and runtime counts stayed stable. |
| Compact correction | At 479×844, 430×932, 390×844 and 360×800, the next title's visible midpoint intersection is now 0 px and the final-stage CTA/satellite overlap area is 0 px². |
| Hover/focus | Play scale measured 1→1.1; glow measured scale 1→1.08 and opacity 0→1 with 12 px blur. Keyboard focus exposed the same treatment with `:focus-visible`. |
| Theme | Desktop dark showed F/24, mobile dark F/23 and light F/1.4. Motion image filters remained `none`. |
| Reduced motion | At 1440×900 and 390×844, 5/5 stages and 15/15 satellites remained visible, all CTAs remained usable, 40/40 Motion media transforms were `none`, and runtime was 0 Lenis / 0 ticker / 1 route scope / 0 triggers. |
| Lifecycle | Three Home→Motion→After Rain placeholder→Motion→Home cycles plus Back/Forward completed with one DOM route scope. Motion stayed at 1 Lenis / 1 ticker / 1 scope / 5 triggers; the placeholder had 0 triggers. No page/console errors or linear listener/observer growth was observed. |
| Production export smoke | The exported `/motion/` returned all five stages in Chrome with no overflow or embedded video/iframe. Measured document heights were 5,833 px at 1440×900 and 4,931 px at 390×844. The production mobile session reported zero console errors. |

## Build and static export

The single final-candidate `npm run check` passed without a retry:

- TypeScript: passed.
- Content validation: 4 Stills projects, 5 Motion projects, 5 static Motion routes and 22 media assets validated.
- Next.js optimized production build: passed.
- Static generation: 18/18 entries.
- Exported Motion HTML: `/motion/` plus all five project routes.

The five expected `temporary-development` notices identify missing/replacement film sources; they are the intentional asset policy for STEP 3E-A, not validator failures.

## Remaining priorities

- **P0:** none.
- **P1:** final project-owned Motion preview/full-film sources and approved sound policy are not supplied. They are intentionally not requested or rendered by the Motion Index, but production readiness cannot be claimed without them.
- **P2:** final bilingual titles, locations, descriptions, credits, poster/satellite selections, crops and licensed display/sans font choices still require owner approval. The local index remains about 9.4% shorter than the audited desktop Reference and 6.6% shorter on 390×844; human review should decide whether to lengthen stage pacing.
- **P3:** asset-dependent satellite offsets, title optical alignment, play-glow nuance and continuous scrub/easing cadence remain human-review polish. Browser automation and recordings do not establish pixel-identical fidelity.

## Local review artifacts

- Desktop Chrome recording: `/Users/jr-fank/Code/jrfank-portfolio/output/playwright/step3e-a/STEP3E_A_MOTION_INDEX_DESKTOP_1440x900.webm` — 1440×900 viewport at 100% zoom, 43.92 s; Playwright's recorder proportionally encodes the capture at 800×500.
- Mobile Chrome recording: `/Users/jr-fank/Code/jrfank-portfolio/output/playwright/step3e-a/STEP3E_A_MOTION_INDEX_MOBILE_390x844.webm` — 390×844 viewport, 16.92 s; Playwright's recorder proportionally encodes the capture at 368×800.
- Detailed screenshots, numeric results, CLI logs and QA scripts remain under `/Users/jr-fank/Code/jrfank-portfolio/output/playwright/step3e-a/` and are excluded from Git.

Stop here for human review. Do not merge `main`, deploy, or begin STEP 3E-B automatically.
