# Animation Architecture Specification

Status: Step 2 specification only  
Baseline: the audited interaction behaviors in `INTERACTIONS.md`; no new transition language is introduced

## 1. Motion principles

- Motion clarifies page structure and preserves the reference's cinematic pacing.
- Base layout and content remain correct without JavaScript.
- GSAP owns time, transforms, and opacity; CSS owns layout, color tokens, and stable interactive states.
- One Lenis instance and one GSAP ticker integration exist for the whole app.
- Each route owns one disposable animation scope.
- Breakpoint changes rebuild only the animations whose geometry changes.
- Reduced motion is a complete alternative path, not a blanket `animation: none` afterthought.
- No FLIP continuity, WebGL, Three.js, or canvas is needed by the audited behavior.

## 2. Module layout

```text
src/animations/
  core/
    gsap.ts                 register plugins once
    lenis.ts                create/destroy app-wide Lenis
    scope.ts                route scope and cleanup contract
    match-media.ts          audited breakpoint queries
    preload.ts              Level 1/2/3 readiness
    route-transition.ts     navigation state machine
    reduced-motion.ts       capability preference
  shared/
    text-reveal.ts
    media-reveal.ts
    parallax.ts
    hover.ts
    menu.ts
    theme-aperture.ts
    footer.ts
  home/
    hero.ts
    introduction.ts
    featured-stills.ts
    featured-motion.ts
  stills/
    index-stages.ts
    case-hero.ts
    gallery.ts
    gallery-rail.ts
    explore-more.ts
  motion/
    index-stages.ts
    case-hero.ts
    playback.ts
    filmstrip.ts
    bts.ts
    explore-more.ts
  about/
    hero.ts
    story.ts
    credentials.ts
```

Animation modules export setup functions that accept element refs and typed options, then return cleanup. They do not import content, resolve media, or search globally for generic selectors.

## 3. Ownership and lifecycle

### 3.1 Route scope contract

Each route client shell creates a GSAP context rooted at its page element and registers all page-specific resources in one scope:

```text
RouteAnimationScope
  ├─ GSAP context/timelines
  ├─ ScrollTriggers
  ├─ matchMedia branches
  ├─ IntersectionObservers
  ├─ ResizeObservers
  ├─ split-text wrappers
  ├─ media event listeners
  └─ optional timers
```

Cleanup order:

1. stop route-specific input and observers;
2. pause route-owned videos;
3. revert GSAP context and breakpoint branches;
4. restore split text to semantic source markup;
5. cancel timers and pending noncritical decoding callbacks;
6. clear route registration from the persistent controller.

The route transition controller requests this cleanup before `router.push()`. React unmount cleanup remains a second line of defense and must be idempotent.

### 3.2 Persistent resources

Only these survive navigation:

- global navigation/menu controller;
- theme provider and original aperture timeline;
- route overlay;
- one Lenis instance;
- one preload coordinator;
- the GSAP ticker callback used to advance Lenis.

Persistent resources must never hold direct references to departed page nodes.

## 4. GSAP and Lenis integration

Register ScrollTrigger exactly once in `animations/core/gsap.ts`. Create Lenis once inside the persistent client runtime with the Step 1 behavior as the calibration baseline:

- interpolation enabled for fine-pointer desktop;
- `smoothTouch: false`;
- touch multiplier approximately 1.5 as audited;
- anchors handled explicitly so gallery hashes use the site scroll controller;
- wheel/touch input ignored while a route leave is locked.

Drive Lenis from GSAP's ticker so there is only one animation clock:

```text
gsap ticker time (seconds)
  → convert to milliseconds
  → lenis.raf()
  → Lenis scroll event
  → ScrollTrigger.update()
```

Call `ScrollTrigger.refresh()` only after:

- Level 1 media decode/readiness;
- required fonts load;
- initial route layout commits;
- a material resize or breakpoint change;
- a video reframe changes geometry.

Do not refresh on every image load, scroll event, or ResizeObserver callback. Batch invalidations into the next animation frame.

## 5. Breakpoint architecture

Use `gsap.matchMedia()` with the exact behavior bands:

```text
(min-width: 992px)
(min-width: 768px) and (max-width: 991px)
(min-width: 480px) and (max-width: 767px)
(max-width: 479px)
(prefers-reduced-motion: reduce)
```

CSS media queries use the same limits. Export query constants from one source so CSS documentation and JS do not drift.

Breakpoint changes may replace timeline distances, pin lengths, gallery rail width, stage heights, menu mode, and type split measurements. They must not replace content or theme state.

Use input capability queries separately:

- `(hover: hover) and (pointer: fine)` enables palette/magnetic hover behavior;
- coarse pointers receive direct tap behavior and no hover-only offset;
- smooth touch remains disabled even on a wide touch device.

## 6. Route transition state machine

The audited behavior is a simple full-viewport color overlay with approximately 1,000 ms delayed navigation. Use one persistent overlay, not per-route elements.

```text
idle
  └─ valid internal navigation
      → leaving
         ├─ lock duplicate navigation
         ├─ stop Lenis/input
         ├─ overlay covers viewport
         └─ dispose current route scope
      → navigating at ~1000 ms
         └─ router.push(href)
      → entering when pathname changes
         ├─ reset scroll unless destination includes hash
         ├─ wait for destination Level 1 readiness
         ├─ initialize destination route scope
         ├─ reveal/remove overlay
         └─ resume Lenis/input
      → idle
```

### 6.1 Link interception rules

Transition only ordinary primary-button navigation to another internal route. Bypass for:

- external URLs;
- `mailto:` and `tel:`;
- downloads;
- modified clicks and non-primary pointer buttons;
- links targeting another browsing context;
- same-page fragment links;
- browser back/forward, which runs an abbreviated entrance path after `popstate`/pathname change.

If a second eligible link is activated while leaving, ignore it until the current transition resolves. If navigation fails, restore the overlay and controls to `idle` and retain the current page.

### 6.2 Timing

Treat 1,000 ms as the audited navigation delay. The overlay cover animation may complete within that window; the actual route push happens at the audited delay. Destination media readiness can lengthen the covered state, but a visible timeout/fallback must prevent a permanent curtain.

Reduced motion shortens the transition to a brief opacity cover and removes the artificial one-second delay while retaining navigational feedback.

## 7. F-stop/theme animation

The F-stop is global theme state, not a content filter.

### 7.1 State and labels

- dark desktop label: `F/24`;
- dark collapsed/mobile label: `F/23`;
- light label: `F/1.4`;
- storage key: `portfolio-theme`;
- DOM authority: `html.theme-light`.

CSS chooses the dark label by the 991 px breakpoint; JavaScript does not duplicate a “mobile theme” state.

### 7.2 Visual transition

On activation:

1. set `data-theme-transitioning` on `<html>`;
2. reverse or play a one-second aperture ring timeline;
3. toggle the theme class and semantic color variables;
4. persist the value;
5. remove the transient flag when color/aperture motion completes.

Use a newly authored inline SVG aperture with a small number of blade/ring elements and GSAP transforms. Do not copy the reference Lottie JSON. The original asset can reproduce the observed behavior without a Lottie runtime dependency.

The control remains operable during page scroll but is locked during the central part of a route leave so overlay colors cannot change mid-transition.

## 8. Navigation and mobile menu

Desktop links use CSS hover/focus states plus small GSAP accent movement only where the reference requires it.

At ≤991 px, the menu is a persistent overlay/panel:

- open button sets `aria-expanded` and records the prior focus;
- panel becomes visible before entrance motion begins;
- focus is trapped among actionable elements;
- Escape and close control reverse the timeline;
- selecting a route closes the menu into the route-transition cover;
- cleanup restores body/input state and focus when remaining on the route.

Use transform/opacity animations. The underlying page becomes inert while the menu is open. Do not use scroll position hacks on body; ask Lenis to stop and resume.

## 9. Text reveal system

The reference uses line-based reveals with rotation/vertical movement. Implement an accessible enhancement:

1. keep the semantic source text in the DOM;
2. after fonts are ready, create visual line wrappers within the same accessible text tree or hide only duplicate visual clones;
3. reveal lines using transform and opacity;
4. rebuild on font change, breakpoint change, or width change that materially changes wrapping;
5. restore original markup on cleanup.

Do not split Traditional Chinese by naive whitespace. Use browser-measured line wrapping; if individual glyph animation is ever required, segment with `Intl.Segmenter` using `zh-Hant` and remeasure.

Reduced motion renders the final text immediately without rotation or clipping.

## 10. Page-specific choreography

### 10.1 Home

**Hero:** Level 1 poster is visible immediately. Once fonts and hero media are ready, reveal the title/logo and poster/reel mask in the audited order. Preview video may replace the poster after it can play; poster remains beneath it.

**Introduction:** trigger line reveals on entry with one controlled stagger. Do not create a ScrollTrigger per word.

**Featured Stills:** CSS defines paired geometry. A section timeline applies restrained opposing vertical transforms to the images and reveals labels/titles.

**Featured Motion:** poster/preview receives scroll-linked scale/translation; the full film is never requested.

### 10.2 Stills index

Each project stage registers with one route-level controller rather than independent global scroll handlers. The controller determines current project, palette treatment, title reveal, and cover transform from normalized stage progress.

Palette hover is enabled only on fine pointers. The project remains navigable by its title/card link without hover.

### 10.3 Motion index

Cards use poster-first rendering and attach muted preview sources only near intersection. Intersection exit pauses preview playback. GSAP controls card transforms and typography; native video events control readiness/error.

### 10.4 About

Portrait/video, large name typography, story collage, and credential directory use separate section timelines. The collage may overlap through CSS grid and transforms, but its base reading order remains logical.

## 11. Stills gallery and thumbnail rail

This interaction needs coordinated DOM APIs, not only GSAP.

### 11.1 Structure

- Each gallery image is a semantic section with stable fragment ID `#1`, `#2`, ….
- The rail is a navigation list with real fragment links.
- Images reserve intrinsic space from the manifest.
- Desktop rail is about 70 px; compact rail is 48 px at ≤479 px.

### 11.2 Active item

One IntersectionObserver watches gallery items using a center-weighted root margin. When multiple items intersect, select the item whose visual center is closest to the viewport's calibrated focus line. Update `aria-current`, rail styling, and the URL fragment with `history.replaceState` only if that does not create history spam.

The active/hover thumbnail lifts approximately 32 px in 3D, gains its border, and loses its tint. GSAP can animate that presentation, while IntersectionObserver remains the state authority.

### 11.3 Rail activation

On click:

1. prevent the browser's abrupt default jump;
2. update the semantic fragment;
3. ask Lenis to scroll to the target in approximately 0.5 seconds;
4. move focus only when activation came from keyboard and the destination needs an announced context;
5. let IntersectionObserver confirm active state.

With reduced motion or without Lenis, use native `scrollIntoView` with instant/auto behavior.

## 12. Motion playback controller

Use a React state machine around one native `<video>` presentation; GSAP animates the frame, not playback truth.

```text
poster
preview-loading
preview-playing
film-loading
film-playing
film-paused
error
```

Rules:

- Poster is always the first visual and fallback.
- Preview is muted, looping, `playsInline`, and may autoplay only after readiness.
- Watch is a real button. Its user gesture loads/selects the full source, resets current time, enables approved audio, and calls `play()`.
- The frame enlarges/repositions through a GSAP timeline matching the audited playing state.
- Floating pause/resume becomes available only after film playback starts.
- The control state follows `play`, `pause`, `ended`, `waiting`, and `error` events, not optimistic button clicks.
- On route leave, pause first, then detach source/listeners during scope cleanup.

Do not hide native failure. If full playback fails, return to poster with a clear retry or approved external-open action.

## 13. Motion filmstrip and BTS sequence

### 13.1 Filmstrip

Filmstrip base layout is accessible horizontal/overlapping media in DOM order. A ScrollTrigger timeline translates it through the viewport based on measured content width. Measurements occur after image decoding. Mobile may replace horizontal travel with the audited stacked/condensed progression.

### 13.2 Behind the Scenes

The audited BTS stage is approximately 5,400 px on desktop and 400 vh at ≤479 px. Treat those as calibration baselines, not blind constants.

Implementation contract:

- one pinned stage per BTS section;
- one master timeline with named labels for every media beat;
- base DOM order matches narrative order;
- breakpoint functions calculate start/end transforms from container/media dimensions;
- images are decoded before the first refresh;
- no nested pinning;
- `anticipatePin`/pin spacing chosen once after browser testing;
- mobile Safari viewport changes use stable `svh`/`dvh` measurements and debounced refresh;
- reduced motion renders a normal vertical sequence with no pin.

Do not create one ScrollTrigger per BTS image. A single master timeline makes timing reviewable and cleanup reliable.

## 14. Explore More carousels

Use Splide 4 because the audited reference already uses it and it provides tested drag, clone, loop, keyboard, and accessibility behavior.

Stills:

- >767 px: 3 cards per page;
- ≤767 px: 2;
- ≤478/479 px: 1.

Motion:

- >767 px: 2 cards per page;
- ≤767 px: 1.

Keep card entrances and hover details in GSAP/CSS. Let Splide own track movement. Mount on route setup and destroy completely on route cleanup. Reduced motion disables decorative entrance motion but keeps carousel interaction.

## 15. Preload coordination with animation

Every route declares a finite Level 1 readiness set. The coordinator resolves when:

- critical images have loaded and decoded or failed to poster/color fallback;
- critical video has poster readiness, not full playback readiness;
- required fonts have settled;
- layout has committed one frame.

Route entrance and the first ScrollTrigger refresh wait for this promise. A timeout releases the route with fallbacks and logs a development warning; it never strands the overlay.

Level 2 preloading uses observers and does not block. Level 3 remains native lazy behavior.

## 16. Reduced-motion behavior matrix

| Behavior | Standard | Reduced motion |
|---|---|---|
| Lenis | desktop interpolation | native scrolling |
| Route transition | overlay + ~1 s delay | brief cover, no artificial delay |
| Text | clipped rotation/translation | immediate/fade-only reveal |
| Parallax/scrub | enabled | final static position |
| Pinned BTS | long master timeline | normal vertical media flow |
| Aperture | one-second blade/ring motion | instant state or short opacity |
| Carousel | drag/keyboard + entrances | drag/keyboard, no decorative entrances |
| Video preview | muted autoplay when allowed | poster by default; explicit play |

Content, controls, focus order, and navigation remain identical.

## 17. Performance rules

- Animate only transforms, opacity, and carefully bounded clip-path/masks.
- Use `will-change` only shortly before active motion and remove it afterward.
- Batch DOM reads before writes; do not read layout inside an `onUpdate` loop.
- Use one master ScrollTrigger per complex section where possible.
- Pause offscreen preview video and release full-film resources on route exit.
- Avoid continuous pointer tracking on touch/coarse devices.
- Lazy-load route-specific animation modules.
- Development mode exposes a diagnostic count of ScrollTriggers, observers, tickers, and active videos.

## 18. Test and acceptance plan

### 18.1 Automated

- route transition state tests: ordinary, modified, hash, external, rapid double activation, back/forward, failure;
- theme bootstrap and persistence tests at desktop and mobile labels;
- gallery observer selection and fragment navigation;
- video state/event/error tests;
- reduced-motion behavior tests;
- component unmount leaves no registered scope resources;
- Playwright interaction captures at audited desktop/mobile viewports.

### 18.2 Manual

- compare motion timing against the 12 interaction captures;
- scrub slowly through Home, Stills index, Stills cases, Motion cases, and About;
- test Safari iOS viewport changes, Chrome Android touch, trackpad, wheel, keyboard, and tab visibility changes;
- throttle network to validate posters, route cover fallback, and no early full-film download;
- navigate repeatedly and confirm stable ScrollTrigger/observer counts.

## 19. Known risks

- font changes invalidate line splitting and every scroll measurement;
- large decoded images can exceed mobile memory even when network bytes are reasonable;
- autoplay policies can vary, so poster-first behavior is mandatory;
- route transitions can deadlock if readiness has no timeout;
- pinning can jump after mobile address-bar changes;
- IntersectionObserver thresholds alone can flicker with very tall gallery images;
- Strict Mode development remounting will expose non-idempotent setup/cleanup.

These risks are implementation priorities, not reasons to add more libraries.

