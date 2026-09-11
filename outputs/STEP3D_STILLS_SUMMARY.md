# STEP 3D Stills candidate

**STEP 3D CANDIDATE — AWAITING HUMAN APPROVAL**

## Identity

- Repository: `JR-Fank/jrfank-portfolio`.
- Branch: `step3d-stills`; `main` remains unchanged.
- Starting checkpoint: `160fc1ff41392527db36aa68adb932f3e324326b`.
- Validation-progress checkpoint: `0531f54` (pushed before resuming the remaining work).
- Candidate HEAD: the phase-branch commit containing this completed report. Resolve its exact immutable SHA with `git log -1 --format=%H -- outputs/STEP3D_STILLS_SUMMARY.md`. The final delivery records local and remote HEAD; a commit cannot embed its own hash in its content.
- Validation began 2026-09-08 and was finalized after resuming on 2026-09-09, Asia/Shanghai.

## Existing implementation retained

The App Router build-time routes render one Stills index and four typed cases: Quiet Current, Tidal Archive, After Rain and Stone Light. The case renderer uses the existing closed editorial block union, media manifest/resolver and route animation scope. No Stills system was rebuilt, no Home/About animation was rewritten, and no global subsystem was refactored in this finishing pass.

The index combines its bilingual introduction, paired image stages, metadata, title, palette and case links. Existing stage motion uses measured geometry, refresh invalidation and the checkpoint's separate vertical arrival/departure timing. Cases contain layered heroes, editorial reveals, image pairs/triptychs/offsets/captions and asymmetric galleries. Each authored five-image gallery supplies a sticky rail and semantic fragment links. One gallery IntersectionObserver selects the active image; a ResizeObserver schedules recalculation and the focus band is rebuilt on viewport resize. Cleanup is route-scoped.

Numbered hashes and `#last` use bounded font/image readiness and shared Lenis target scrolling. Explicit rail clicks preserve hash history and keyboard focus. Explore More uses Splide loop/free-drag/snap with no arrows or pagination, excluding the current project; cloned anchors are delegated into the existing route overlay.

The only application/build fix in this pass was the TypeScript validator error: save the sequence ID before the invalid branch narrows to `never`. The validation rules remain intact. QA helpers were expanded to preserve executable evidence and avoid synthetic offscreen navigation races.

## Build and static export

The initial clean-checkpoint `npm run check` exposed the validator error. After its fix, TypeScript, content validation (5 total placeholder projects, 22 media assets), production build and static export passed. Next reported **14/14 generated entries**. The export contains **9 content-page URLs**, plus the not-found/error and static metadata entries; there are **12 HTML files including error aliases**. These counts are intentionally distinguished.

Final current-checkpoint verification: `npm run check` passed. TypeScript completed without errors; the content validator confirmed 5 placeholder projects and 22 media assets; Next 16.3.3 completed the optimized production build and statically generated all 14 pages, including all four Stills cases.

## Browser results

| Area | Evidence/result |
| --- | --- |
| Stills index | 13/13 requested sizes, 260 forward/reverse samples, zero horizontal overflow, both photographs visible at every sampled midpoint. |
| Cases | All four routes checked at 1440×900 and 390×844; authored non-hero block counts 5/5/5/4, one separately rendered hero each; no broken loaded images, missing/duplicate rendered blocks or overflow found. |
| Themes | Dark/light case captures at both sizes preserve gallery/media and working F-stop controls. |
| Rail tracking | Slow forward/reverse samples advance 1→2→3→4→5 and back, with no sampled flicker; one active thumbnail in case snapshots. |
| Hash/history | Fresh #1/#3/#last loads on Quiet Current and Tidal Archive reached the correct image and active state. Case A #1→#3→Case B→Back→Back→Forward restored route/hash/scroll/active state. |
| Reduced motion/accessibility | Fresh reduced-motion case: 0 Lenis, 0 ticker, 1 scope, 0 triggers. Rail Enter activation focuses the target figure; meaningful rail labels and 48 px mobile controls are present; content remains visible. |
| Explore More | Production original-card navigation and mobile touch swipe passed; touch track moved from -732 to -1098 px. Desktop recording includes free drag, next-case navigation and Back. The resize sweep retained 3/2/1 cards and moved the desktop track from -2655.94 to -3098.59 px. A focused fresh-export check confirmed a cloned anchor invokes the shared overlay and completes navigation to `/stills/tidal-archive/`; its delegated listener now runs in capture phase before Splide cancels the clone click. |
| Live resize | A single no-reload 1440→360→1440 sweep covered 25 samples across 991/767/479 px structural boundaries. Each sample retained one active rail item, no horizontal overflow, visible gallery media, a sticky rail (74 px desktop, 48 px mobile), and Explore More at 3/2/1 cards. Recalculation selected the closest item at structural transitions; clicking the retained `#3` rail target restored matching hash/current state immediately. |
| Lifecycle | Three Home→Stills→Case A→rail→Case B→Stills→About→Home cycles retained 1 Lenis / 1 ticker / 1 route scope. Trigger counts: Home 5, Stills 4, Cases A/B 1, About 2. Window/document listener maps were identical on corresponding routes in the last two cycles after initial Playwright listener installation. Across all 25 live-resize samples there was exactly one active ResizeObserver watching one target and one active IntersectionObserver watching five gallery items; recalculated focus margins changed with viewport height. |
| Runtime errors | Case sweep and production desktop recording reported no page errors; production desktop capture also collected zero console errors. The final focused clone-transition check also reported zero page errors. |

Index sizes: 1440×900, 1280×800, 1024×768, 992×800, 991×800, 820×1180, 768×1024, 767×1024, 600×900, 479×844, 430×932, 390×844, 360×800.

The monolithic `step3d-runtime.js` run timed out waiting for a synthetic Explore More navigation and **is not recorded as passed**. Separate case/history/lifecycle runs and the production recording successfully exercised original-card navigation. This report relies on those completed results and the isolated resize/clone results rather than silently converting a harness timeout into a pass.

## Fidelity and limitations

See `STEP3D_STILLS_FIDELITY.md` for Reference/Local/severity/status comparisons. Functional QA does not establish exact visual equivalence or human approval.

- **P0:** none open after the typecheck fix.
- **P1:** retained production-content limitation: temporary Home Hero footage must be replaced. No new technically actionable Stills P1 identified in the completed evidence.
- **P2:** substitute-font metrics and licensing; unapproved bilingual/identity copy and final archive; tighter index metadata/CTA/palette spacing and segmented palette treatment; suppressed Stills grain; mock hero layering; case crop/spacing rhythm. Live OS reduced-motion switching and cold-network first-frame behavior are not fully certified.
- **P3:** final asset-dependent micro-spacing/crops, mock subject differences and 25 fps recording cadence. Human review must assess continuous micro-easing.

Home/About component, animation and style source remains unchanged from the starting checkpoint. The regression evidence is scoped to navigation/lifecycle and observed presentation; it does not repeat every historical R4 timing measurement. Chrome mobile emulation/touch is not a physical iOS/Safari device certification. Final content and production infrastructure remain outside this candidate approval.

## Review artifacts and reproduction

- Desktop: `/Users/jr-fank/Documents/ChatGPT/jrfank-portfolio/outputs/STEP3D_DESKTOP_1440x900.mp4` — Chrome production export, 1440×900, 100% zoom, 185 seconds, H.264 MP4, 25 fps.
- Mobile: `/Users/jr-fank/Documents/ChatGPT/jrfank-portfolio/outputs/STEP3D_MOBILE_390x844.mp4` — Chrome mobile emulation, 390×844, 86.68 seconds, H.264 MP4, 25 fps.
- Recordings were reused after resumption: no subsequent site presentation change invalidated them. Videos are local and excluded by repository Git policy.
- Durable numeric evidence: `outputs/step3d-validation/results.json`; final build output alongside it.
- QA procedures: `scripts/qa/step3d-{index,cases,history,listeners,resize}.js`. Pass a function to `playwright-cli run-code` with the local dev server at port 3000. Development diagnostics intentionally do not exist in production bundles.
- Detailed screenshots, original CLI logs and recording procedures remain local in `output/playwright/`, excluded through `.git/info/exclude`.

Stop here for human visual review. STEP 3D is a candidate, not approved; do not merge `main`, deploy, or begin STEP 3E automatically.
