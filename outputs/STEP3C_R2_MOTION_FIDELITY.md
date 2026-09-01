# STEP 3C-R2 — Authoritative motion fidelity correction

Completed on 2026-09-01 against the corrected 59.92 fps Reference recording. This update supersedes the earlier R2 interpretation. Scope stops at Home motion correction; STEP 3D was not started.

## 1. Exact root cause of the previous dead scroll

The original H03/H04 timeline used two separated side-media tween windows inside a 2.0-unit timeline:

- entry: `0.00–0.62`;
- no side-media tween: `0.62–1.38`;
- exit: `1.38–2.00`.

The empty 0.76-unit interval mapped to roughly 970 px of desktop document travel across the 205 svh sticky project section. Both media transforms therefore stayed constant while the page kept scrolling. Lenis smoothing did not cause the plateau; it only exposed a structurally empty GSAP interval.

The first R2 pass removed that interval but interpreted the motion as cross-through travel. The new full recording proved that model wrong: the left image must always continue left, the right image must always continue right, and neither image may collapse toward the center at the bottom.

## 2. Final shared ProjectStage architecture

H03 and H04 now use one shared, direction-independent choreography:

```text
section: 205svh desktop / 134svh mobile
stage: CSS sticky, top 0, height 100svh
ScrollTrigger: top bottom → bottom top
scrub: 0.45
GSAP pin / pinSpacing: absent
```

Horizontal movement occupies the complete normalized `0.00–1.00` trigger range with `ease: none`:

```text
physical left media:  xPercent +34 → -138
physical right media: xPercent -34 → +138
```

Both images enter below the viewport close to the center. Vertical entry resolves during the first 0.32 of progress, while X continues linearly through the full range. After entry, each image keeps drifting upward while moving farther outward. At the bottom, left remains left/offscreen and right remains right/offscreen; no shrink, fade-primary exit, second collapse, threshold swap, or bottom snap exists.

The center metadata/title/CTA/palette reaches full readability by progress 0.20, remains stable through the editorial middle, and fades only as the sticky section leaves. H03 and H04 use identical motion code; project content is the only difference.

## 3. Forward and reverse scroll result

Pass at 1440 × 900 and 390 × 844.

Desktop H03 checkpoints show monotonic outward travel:

| Approx. project progress | Left x | Right x | Visible state |
|---:|---:|---:|---|
| 0.00 | 289 | 514 | below viewport, close/overlapping |
| 0.24 | 45 | 764 | entered and separating |
| 0.50 | -215 | 1030 | separated at side edges |
| 0.67 | -394 | 1214 | outgoing at far edges; H04 begins below |
| 0.90 | -626 | 1451 | fully offscreen outward |

H04 reconstructs the same geometry. At the H03/H04 overlap boundary, H03 remains near the outer edges while H04 is entering below and close to center. At H04/H05, the side media remains outward while H05 enters naturally from below.

Reverse-scroll checkpoints reproduced their forward coordinates within 1–3 px after scrub settling:

- H04 at scrollY 4641.5 forward: approximately `x -473 / 1294`;
- H04 at scrollY 4645.5 reverse: approximately `x -475 / 1297`;
- H04 at scrollY 3951.5 forward: approximately `x -217 / 1032`;
- H04 at scrollY 3956 reverse: approximately `x -220 / 1035`.

The reverse path is therefore the same continuous mapping: offscreen/outward → inward → close only near the section entry. No sampled range retained constant X coordinates, so the previous dead-scroll plateau is absent.

Evidence: `outputs/step3c-authoritative-motion/desktop/h03-*.png`, `h04-*.png`, and `reverse-*.png`; mobile evidence is under `outputs/step3c-authoritative-motion/mobile/`.

## 4. Hero initial-load choreography

The Hero is now a real `<video>` surface with a poster fallback. The initial DOM/CSS state is a centered frame at scale `0.14` on the audited charcoal canvas.

```text
0.00s: small centered playing video frame; chrome and display lines hidden
1.42s: chrome begins, 0.58s, power3.out
1.45s: Hero frame expands from scale 0.14 to 1.00
1.45–2.45s: spatial expansion, 1.00s, power3.out
2.33s: Traditional Chinese support line begins, 0.52s
~3.00s: complete entrance state
```

The video is already playing while the card expands. The implementation uses `autoplay`, `muted`, `playsInline`, `loop`, `preload="auto"`, a manifest-resolved MP4 source, and the authorized coastal mock image as poster/fallback. Playback checks returned `paused: false`, `readyState: 4`, and increasing `currentTime`.

Temporary Hero media: `public/mock-media/home-r1/hero-video/hero-coast-loop-1280-mockr2.mp4` (H.264, 1280 × 720, 8 seconds, 1.42 MB). It is a project-owned camera-motion loop derived from the authorized coastal mock photograph. It is explicitly non-final and does not claim to be captured footage.

## 5. Masked Hero typography reveal

The three display lines retain separate overflow-hidden windows and rise independently from `translateY(108%)` to `0`:

```text
line 1 start: 1.72s
line 2 start: 1.99s
line 3 start: 2.26s
duration: 0.70s each
stagger: 0.27s
ease: cubic-bezier(.215, .61, .355, 1), calibrated power3.out character
```

The first line starts before the Hero expansion completes. There is no whole-heading fade, rotation, or blur substitute. Reduced motion removes the animations and reveals all lines immediately.

## 6. H02 inline-image hover

All three inline images retain their layout boxes, so text never reflows. The inner scaler owns pointer motion while the parent continues to own the scroll entrance transform.

```text
scale: 1.00 → 1.80
enter: 320ms
enter ease: cubic-bezier(.215, .61, .355, 1)
blur: 0 → 7px at 32% (~102ms) → 0 by 320ms
mouseleave scale: 420ms with the same curve
mouseleave filter settling: 160ms
hover z-index: 8; release delay: 460ms
transform origin: 50% 50%
```

Measured line rectangles were identical before, during, and after hover. The blur pulse resolves to a sharp enlarged image, the scaler cannot capture pointer events, and mouseleave returns every scaler/filter/z-index to its base state.

Evidence: `outputs/step3c-authoritative-motion/desktop/h02-*.png` and the validation recording.

## 7. Background correction

The authoritative dark canvas is now:

```text
--canvas: #101114
--transition-surface: #101114
--nav-surface: rgb(16 17 20 / 78%)
dark theme-color: #101114
```

Light mode remains `#e8e5f0`; Hero overlay copy remains `rgb(243 246 250)` in both themes.

## 8. Runtime regression result

Pass on the optimized static production build.

- Repeated Home/About/Home, Home/Stills/Home, and Home/Motion/Home cycles retained one route-content root, one active route-scope wrapper, one transition overlay, eleven body children, and zero horizontal growth.
- The global Lenis provider, GSAP ticker driver, route-scope owner, transition provider, menu state machine, and theme provider source files were not modified.
- Browser Back restored Home to the exact tested scrollY 700; Forward returned to About at scrollY 0.
- Dark/light F-stop behavior and cross-route persistence pass. Light-mode Hero copy remains white. Desktop and mobile labels remain F/24 and F/23.
- Mobile menu remains x 24, y 64, 342 × 326 with Stills focused on open, Escape close, and trigger-focus restoration.
- Reduced motion reports the media query active, clears Hero/project transforms, leaves opacity at 1, and produces zero horizontal overflow.
- Production console review returned zero errors, warnings, or hydration messages.

## 9. Code, export, and asset-safety result

`npm run check` passes strict TypeScript, content/media validation, the optimized Next.js 16.3.3 build, and all eleven static/SSG pages. The updated manifest validates thirteen media assets.

The static server returned HTTP 200 for `/`, `/about/`, `/stills/`, `/stills/project-01/`, `/motion/`, `/motion/project-01/`, `/robots.txt`, `/sitemap.xml`, and the Hero MP4.

Safety review passes:

- no unauthorized Reference production asset was added;
- no Roslindale, Mint Grotesk, or other copied commercial font binary exists;
- no `.env`, Cloudflare/R2 credential, private key, token, RAW/private media master, or private EXIF data is present;
- `.next`, `out`, local caches, and temporary recording frames remain ignored;
- the new binaries are the intentional project-owned Hero mock loop, the required Chrome validation video, and QA evidence captures.

## 10. Validation recording

`outputs/STEP3C_R2_VALIDATION_1440x900.mp4`

- Chrome layout viewport: 1440 × 900;
- visual scale: 1.0 / 100%;
- output raster: 1440 × 900 H.264;
- duration: 18.17 seconds;
- sampled walkthrough: 218 exact-size Chrome frames at 12 fps;
- includes full refresh, Hero entrance/video/title reveal, all three H02 hovers, slow H03/H04 forward travel, H04/H05 transition, and reverse travel back to the H03 entry range.

The 12 fps output is a browser-screenshot validation sequence rather than a native 60 fps screen recording. It is sufficient to review direction, continuity, overlap, and state timing; final micro-easing judgment remains a human-review item.

## 11. Remaining P1 / P2 / P3 issues

- P1: none found in the implemented motion architecture.
- P2: the Hero MP4 is a temporary still-derived camera-motion loop, not final moving footage.
- P2: Cormorant Garamond and IBM Plex Sans remain legal temporary substitutes; Cormorant is not visually equivalent to Roslindale Condensed despite replaceable tokens and approximate width calibration.
- P2: the validation video is 12 fps sampled evidence, so a human should judge the final micro-easing in the live Chrome preview as well as the recording.
- P3: project-owned mock subjects and edge silhouettes differ from protected Reference photography.
- P3: `scrub: 0.45` can visibly trail an unusually fast wheel impulse for a fraction of a second; the required slow forward and reverse paths remain continuous and deterministic.
- H05 was not redesigned because the corrected evidence did not identify an H05 regression.

## Stop point

STEP 3C-R2 implementation and automated validation are complete. The pass is stopped for human video review. STEP 3D was not started.
