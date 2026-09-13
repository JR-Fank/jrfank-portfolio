# STEP 3E-B Motion case-study approval summary

**STEP 3E-B — HUMAN APPROVED**

## Identity and scope

- Repository: `JR-Fank/jrfank-portfolio`.
- Branch: `step3e-motion`; `main` remains unchanged at the approved STEP 3D baseline.
- Starting approval/handoff commit: `f24c466affbba4ddaa892519c0fda7857cb28bb6`.
- B1 playback-foundation checkpoint: `08eab961fcccafb2fd64881159c01c988c0093a8`.
- B2 complete-case checkpoint: `3bbb4704cf638296e20372574d21a7a27cfd3fba`.
- Human-approved B3 candidate: `6801ea21446dddd27d4e3120713d52a614a72c93`.
- Validation finalized 2026-09-13, Asia/Shanghai.
- Scope is STEP 3E-B only. The human-approved STEP 3E-A Motion Index was not reopened or recalibrated, `main` was not merged, and no later phase was started.

## Shared case system

All five Motion placeholders are replaced by one typed, data-driven case renderer:

1. After Rain — `/motion/after-rain/`
2. Tidal Signal — `/motion/tidal-signal/`
3. Night Passage — `/motion/night-passage/`
4. Drift Line — `/motion/drift-line/`
5. Mineral Air — `/motion/mineral-air/`

The dynamic route remains a thin Server Component with `dynamicParams = false`, `generateStaticParams()`, static metadata, `notFound()` handling, and server-side mapping of the current project's Explore More cards. Interactive work remains in focused client leaves under one keyed route boundary; the Motion Index still serializes only its approved `slug`, `identity`, and `index` payload.

Every case now renders the shared oversized title/entrance, rounded film hero, poster/preview/full-film playback controller, Watch and floating Pause/Resume controls, bilingual project information, two opposed filmstrip rows, centered credits, eight-image Behind the Scenes sequence, Motion-specific Explore More, and the global contact footer.

## Playback and temporary media

The hero uses one native `<video>` with these explicit states:

```text
poster
preview-loading
preview-playing
film-loading
film-playing
film-paused
error
```

Poster is always the first and fallback visual. Preview is muted, looping and inline; reduced motion remains poster-first. Watch is a semantic button and is the only path that assigns the full-film source. It resets playback, applies the declared audio policy, calls `play()`, and waits for native source-matched metadata/playback events before entering the enlarged film presentation. Pause, Resume, waiting, ended, error, Retry, route-scope disposal and React unmount are native-event/resource-cleanup paths rather than optimistic UI booleans.

B3 review tightened three details before final QA: film framing now begins only after native `playing`; queued media events are guarded by the active source URL and request generation; and idempotent media cleanup is registered directly with the route animation scope so route leave pauses, removes listeners and releases the source before navigation.

No final project-owned films were supplied. Two small authorized development-only H.264 MP4s were derived from existing project mock imagery:

- preview: 960×540, 4 seconds, 15,744 bytes, no audio;
- full film: 960×540, 8 seconds, 170,074 bytes, no audio.

They are distinct semantic media entries and use `muted-preview-muted-full` for all five temporary projects. This proves the architecture without claiming production film or audio approval. P1 remains final project-owned preview/full-film sources plus the approved per-project audio policy.

## Filmstrip, credits, BTS and Explore More

- Filmstrip: two data-driven 16:9 rows share one scroll-scrubbed timeline; their measured tracks move in opposite directions and reverse exactly. Base media stays in meaningful DOM order; visual duplicate sets are `aria-hidden` and use empty alt text.
- Credits: centered bilingual roles and names come from `MotionCredit`; optional external URLs use semantic anchors with safe `rel` values. Development credits remain explicitly temporary.
- BTS: exactly one pinned stage and one master GSAP timeline. Eight named labels (`bts-01` through `bts-08`) drive overlapping position, scale and opacity transitions without per-image triggers, nested pins, or React state on scroll. Geometry uses viewport, frame and decoded-image measurements with `invalidateOnRefresh`.
- Reduced BTS: no pin, artificial scroll stage or Motion case ScrollTrigger; all eight images render in normal vertical order.
- Explore More: an independent Motion Splide instance uses `perPage: 2` on desktop and `1` at ≤767 px, `perMove: 1`, loop, left focus, 16 px gap, free drag, snap, and no controls. Current project is excluded. Capture-phase delegation sends both authored and Splide-cloned links through the shared route-transition overlay, and route cleanup fully destroys Splide.

The intentional standard-motion case count is two ScrollTriggers: one filmstrip timeline and one pinned BTS master timeline. The global runtime remains one Lenis instance, one GSAP ticker driver, and one route scope.

## Browser validation

All browser work used installed Google Chrome through the Playwright CLI at 100% zoom. No blocking browser failure remained.

| Area | Evidence/result |
| --- | --- |
| Fixed viewport matrix | 13/13 passed: 1440×900, 1280×800, 1024×768, 992×800, 991×800, 820×1180, 768×1024, 767×1024, 600×900, 479×844, 430×932, 390×844 and 360×800. |
| Five-case smoke | All five cases passed at 1440×900 and 390×844: 10/10 route/viewport combinations contained hero, synopsis, two filmstrip rows, credits, eight BTS images, Explore More and footer. |
| Deep primary case | After Rain was inspected section by section at 1440×900 and 390×844, including poster/playing hero, synopsis, filmstrips, credits, BTS, Explore More and footer. |
| Overflow | No document/body horizontal overflow at any fixed viewport, either live-resize sequence, reduced-motion sample or case smoke. |
| Hero live resize | One document completed 1440→1180→1024→992→991→820→768→767→600→479→430→390→360→1440 with the player present; geometry remained finite and returned to the desktop composition. |
| BTS live resize | The same no-reload sequence passed while the BTS pin was active. It kept one pin/master timeline, finite transforms and correct spacing across every breakpoint. |
| BTS duration/reverse | Total measured stage was 5,400 px at 1440×900 (600vh) and 3,376 px at 390×844 (400vh). Eight beats advanced with overlap; reverse scrub reconstructed earlier states and returned to beat 1. |
| Filmstrip | Rows moved in opposite directions; forward/reverse/restored transform samples matched, with four accessible base frames and four inert duplicate frames per row in the development data. |
| Network | Fresh route load requested preview only; full-film request count was 0 before Watch. Watch initiated the full-film request and native `playing` began near time zero. |
| Playback | Muted preview, Watch, native confirmed playing, Pause, Resume, practical loading/waiting, full-film error/Retry and preview-error poster fallback all passed. |
| Route leave/Back | Old video was paused and detached; `src` removed; `networkState = 0`, `readyState = 0`, time reset and no MP4 request remained active. Back created a new preview element without another full-film request. |
| Reduced motion | Fresh reduced context made 0 MP4 requests and had 0 Lenis, 0 ticker, 0 trigger and 0 pin. Poster, controls and all eight BTS images remained usable in normal flow. |
| Explore More | Two desktop/one mobile slide geometry, mouse drag, real mobile touch swipe, current exclusion, original-link overlay and cloned-link overlay all passed. |
| Theme/accessibility | Dark desktop F/24, dark mobile F/23 and light F/1.4 passed; Motion media filters remained `none`. Watch/Pause/Resume keyboard activation, focus-visible, labels, alts and semantic links passed. |
| Lifecycle | Three exact route cycles plus Back/Forward retained one Lenis, one ticker and one scope. Motion Index stayed at five triggers; Motion cases stayed at two. Controller listeners returned 7→0 on leave; observer, Splide and timer counts showed no cycle growth. |
| Motion Index protection | Regression smoke found five stages, five triggers, zero video/iframe behavior change and zero overflow. Its approved source files were not edited. |

The detached test object retains a stale `currentSrc` string after source removal, which is native element bookkeeping rather than an active resource: it is paused and detached, has no `src` attribute, reports empty network/readiness states, has no active request, and retains zero application playback-controller handlers.

## Build and static export

The single final-candidate `npm run check` passed without retry:

- TypeScript: passed.
- Content validation: 4 Stills projects, 5 Motion projects, 5 static Motion routes and 24 media assets; the five `temporary-development` messages are the intentional replacement notices, not errors.
- Next.js 16.3.3 optimized production build: passed.
- Static generation: **18/18 entries**.
- Exported Motion HTML: `/motion/` plus all five Motion case routes. Direct `out/` probes confirmed `index.html` for After Rain, Tidal Signal, Night Passage, Drift Line and Mineral Air.
- No SSR dependency or API route was introduced.

## Remaining priorities

- **P0:** none.
- **P1:** final project-owned Motion preview/full-film sources and an owner-approved audio policy are not supplied. The development full film intentionally contains no audio, so production full-audio behavior is architecturally supported but not production-certified.
- **P2:** all five bilingual identities, dates, locations, synopses, credits, poster/filmstrip/BTS selections and licensed final display/UI fonts remain temporary or unapproved. Final media will require crop, focal-point and timing recalibration.
- **P3:** asset-dependent micro-spacing/crops and the brief dark frame visible inside the approved global route-overlay transition remain review polish. Chrome automation and 25 fps recordings do not certify physical iOS/Safari address-bar, decoding, autoplay or touch behavior; a physical-device pass remains required before production launch. The detached element's stale `currentSrc` string is recorded above, with verified empty network state and no application-handler leak.

## Local review artifacts

- Desktop Chrome recording: `/Users/jr-fank/Code/jrfank-portfolio/output/playwright/step3e-b/STEP3E_B_MOTION_CASES_DESKTOP_1440x900.webm` — 1440×900, 25 fps, 56.52 seconds.
- Mobile Chrome recording: `/Users/jr-fank/Code/jrfank-portfolio/output/playwright/step3e-b/STEP3E_B_MOTION_CASES_MOBILE_390x844.webm` — 390×844, 25 fps, 31.48 seconds.
- Full ignored QA evidence and reproduction scripts: `/Users/jr-fank/Code/jrfank-portfolio/output/playwright/step3e-b/`.

STEP 3E-B passed final human visual review at candidate `6801ea21446dddd27d4e3120713d52a614a72c93`. Together with the previously approved STEP 3E-A Motion Index, STEP 3E — MOTION EXPERIENCE is human-approved. This approval does not certify temporary film/audio as production assets or authorize another phase.
