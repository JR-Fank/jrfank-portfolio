# Interaction Specification

Reference: https://www.giuligartner.com/  
Status: live-site behavior observed during STEP 1. Values marked “measured” came from browser state; values marked “source” came from the public page's own CSS/scripts.

## 1. Navigation

### Desktop

- Fixed 64 px strip; logo centered.
- Left links: Stills, Motion, About.
- Right links: Instagram, Email, F-stop.
- All controls are outlined 32 px pills using current color.
- Button hover: pseudo-fill opacity rises to 0.12 with a 200 ms `cubic-bezier(.215,.61,.355,1)` transition.
- Logo hover: first dot `translateY(-2px)`, second dot `translateY(-4px)`.
- Cursor: native pointer. No custom cursor layer was found.

### Tablet/mobile

- Collapse threshold: 991 px.
- Logo left; F-stop and Menu right.
- Menu button rolls `MENU` to `CLOSE` while the nav expands.
- Touch target remains at least the 64 px nav height even when the visible pill is smaller.

## 2. Menu open/close

| Property | Open | Close |
|---|---|---|
| Trigger | Menu click/tap | Close click/tap |
| Duration | 700 ms | 700 ms |
| Easing | ease-out-quart | ease-in-quart |
| Overlay | 100 vh below nav, 12 px backdrop blur | hidden |
| Panel | rounded, theme-aware, centered links | reverses |
| Link order | Stills, Motion, About, Instagram, Email | same |

- At 390 px the nav menu starts at y 64, is viewport-height, and the panel uses 24–28 px side insets.
- Underlying page remains visually present around the rounded panel.
- The active button receives Webflow's `w--open` state.
- Opening does not change the theme or scroll position.
- Route selection runs the normal internal-link transition after menu selection.

Evidence: `reference/interactive/mobile-menu-open-390x844.jpg`.

## 3. F-stop / theme

### Labels

- Desktop current public label: `F/24` ↔ `F/1.4`.
- Mobile current public label: `F/23` ↔ `F/1.4`.

### Click behavior

1. Add `transition` to `<html>`.
2. Toggle `light-mode`.
3. Move the two-line aperture label by `translateY(-100%)` in light mode.
4. Play a one-second aperture-ring Lottie in the matching direction.
5. Transition text/canvas/nav colors for 500 ms ease.
6. Remove `transition` after 750 ms.
7. Store `localStorage['light-mode']='true'` in light mode; remove the item in dark mode.

### Resulting state

| State | Canvas | Text | Stored value |
|---|---|---|---|
| F/24 or F/23 | `#0e1012` | `#f3f6fa` | absent |
| F/1.4 | `#e8e5f0` | `#1a4572` | `true` |

- Persistence was verified across route navigation.
- Photographs are not filtered. Theme-specific warm/cool layered media can crossfade on About; the global control primarily changes color variables and overlays.
- In light mode the menu panel and page-transition become white; the video-card edge gradient changes to pale lavender.

Evidence: `home-dark-1440x900.jpg`, `home-light-1440x900.jpg`.

## 4. Smooth scroll

Source configuration:

```text
duration 1.5 s
exponential ease-out
vertical
smooth desktop true
smoothTouch false
touchMultiplier 1.5
```

- A single requestAnimationFrame loop drives Lenis.
- Hash links in Stills cases use the page's 0.5 s scroll-time hint.
- The future implementation must synchronize ScrollTrigger with Lenis, refresh after media/fonts, and disable interpolation for reduced motion/touch where appropriate.

## 5. Text reveal

Applies to elements carrying `words-rotate-in` + `text-split`.

```text
Trigger: top 85% enters viewport
From: rotationX(-90deg), perspective 1000
To: rotationX(0deg)
Duration: 0.8 s per animation
Stagger: total 0.8 s
Ease: power2.out
Scrub: false
Reset: onLeaveBack at top bottom
```

- Text is hidden until SplitType has created word/character spans, preventing an unstyled flash.
- This reveal is used for long editorial statements on indexes and case-study introductions.

## 6. Hero entrance

### Home

- Media card: scale 0 → 1.
- Display fragments: y 100% → 0, rotation 16° → 0, blur 8–12 px → 0.
- Lines are staggered rather than entering as one block.
- Video is already running under the reveal.

### Stills case

- Title enters above a layered hero.
- Hero base and overlay begin at y 50% and rise together into the rounded frame.
- Hero is eager-loaded; story images below are lazy-loaded.

### Motion case

- Rounded poster/video card fills the first viewport.
- Title and Watch control sit above a dim overlay.
- iframe is oversized to guarantee cover.

## 7. Stills project stage

- Scroll stage: about 200 vh desktop, 134 vh mobile.
- Two media panels travel independently from opposite sides.
- Center content remains the visual anchor: date/location → title → CTA → palette.
- Images enter with rounded corners, pass close to/behind the center group, and leave toward the opposite edge.
- Transform/opacity are used; the page does not animate `top/left` layout on every frame.

### Palette hover

1. Hover the palette strip → all `.photo-cms-palette-color` layers opacity 0 → 1.
2. Hover one color → that color's hex label opacity 0 → 1.
3. Non-hover/touch baseline remains a compact horizontal palette representation.

## 8. Motion index card

- Main poster is surrounded by three smaller offset frames with independent parallax.
- No autoplaying `<video>` exists on the Motion index.
- Hover main poster:
  - play icon scale 1 → 1.1;
  - glow layer blur 12 px and opacity 1;
  - transition 200 ms with `cubic-bezier(.215,.61,.355,1)`.
- CTA stays directly available on touch.

## 9. Link and button hover

- Generic outlined button: low-opacity current-color fill appears.
- Instagram inline link: animated multi-color background sweep; 4 s linear infinite while hovered.
- About awards row:
  - title x 0 → +16 px;
  - tag group x 0 → -16 px;
  - row background opacity → 0.08;
  - divider opacity → 0.
- Footer credit smile swaps neutral `O` glyph for a happy face.
- Footer email helper text rolls between three 18 px-high labels.

## 10. Stills case-study gallery

### Scroll

- Main gallery is an asymmetric CSS grid desktop and one column mobile.
- Each image wrapper uses an independent width/alignment preset.
- The mini rail is sticky on the right and remains visible through the story sequence.

### Rail state

- Links are hash anchors `#1`…`#10`.
- Hover/current state:
  - `translate3d(0,0,32px)` with 1200 px perspective;
  - z-index 9;
  - current-color border;
  - thumbnail overlay opacity 0.
- Non-current thumbnails retain a theme-colored overlay.
- Mobile rail width: 48 px at ≤479 px; desktop thumbnails vary around 58–74 px based on aspect ratio.

## 11. Motion playback

### Background state

- Vimeo URL uses `?background=1`: autoplay, muted, looping background playback.
- Poster image remains available as fallback/initial visual.
- iframe has `allow='autoplay; fullscreen'`.

### Watch click

1. Set current time to 0.
2. Set muted false.
3. Add `playing` to the hero card and Vimeo layer.
4. Reframe/enlarge the player.
5. Reveal the floating circular pause/resume control.

### Pause/resume

- Pause calls Vimeo `pause()`.
- Resume calls Vimeo `play()` and links visually back to the hero.
- Floating control is 64×64 px desktop, blurred/translucent, and gains a slightly stronger fill on hover.
- On tiny mobile the player reframes from about 230 vw to 160 vw and the card ratio changes from 130% to 90%.

## 12. Motion filmstrip and BTS

### Filmstrip

- Two duplicated rows of frames produce seamless horizontal motion.
- One row moves left while the other moves right.
- Frames are 16:9 and separated by small fixed gaps.

### Behind the Scenes

- Desktop stage: 600 vh in sampled pages; tiny mobile: 400 vh.
- Sticky frame remains centered while a vertical list of eight images advances.
- Top/bottom masked title fragments compose `Behind the Scenes` around the active frame.
- Progress is scroll-scrubbed; no next/previous controls.

## 13. Explore More

### Stills

```text
perPage 3
≤767: 2
≤478: 1
```

### Motion

```text
perPage 2
≤767: 1
```

Common Splide settings:

```text
perMove 1
type loop
focus left
gap 16px
drag free
snap true
arrows false
pagination false
track overflow visible
```

- Current project is excluded.
- Mouse drag uses grabbing cursor; touch swiping is the fallback.
- Card contains location, project title, and case-study CTA.

## 14. Route transition

All internal links without a hash share one transition.

### Leave

1. Prevent default navigation.
2. Trigger `.page-transition` click interaction.
3. Full-viewport theme-colored overlay fades from opacity 0 to 1.
4. Measured opacity: about 0.013 at 50 ms, 0.205 at 150 ms, 0.613 at 250 ms.
5. Navigate after 1000 ms.

### Enter

- New page begins covered at opacity 1.
- Measured: still 1 at 100 ms, about 0.989 at 300 ms, about 0.769 at 700 ms, then reaches 0.
- Page-specific entrance animation becomes visible beneath it.

### Consequences

- Home→Stills, Home→Motion, Home→About, index→case, case→case, and menu→route all use the same overlay system.
- No thumbnail-to-hero continuity, FLIP handoff, or route-specific wipe was observed.
- Light mode uses white overlay; dark mode uses the dark canvas.

Evidence: `route-home-to-stills-*` and `route-stills-enter-*`.

## 15. Copy email

- Hover email field: helper rolls `GET IN TOUCH` → `CLICK TO COPY`.
- Click: email is copied by Finsweet CopyClip and helper rolls to `COPIED ✨`.
- Large field remains in place; only helper text and subtle fill/border feedback change.
- Touch uses click directly and does not require hover.

## 16. Responsive and input fallbacks

- Hover-only decoration must never gate navigation or project identity.
- Mobile menu supplies all hidden desktop links.
- Project CTA remains visible.
- Motion preview stays poster-based on indexes.
- Stills rail anchors remain tappable at 48+ px visual width.
- Explore More supports free touch drag.
- Native touch scrolling is retained; smoothTouch is false.
- Future build should add `prefers-reduced-motion`: remove scrub/parallax, shorten route overlay, reveal text without rotation, retain all content and controls.

