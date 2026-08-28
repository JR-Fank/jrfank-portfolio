# Giulia Gartner Reference Audit

Audit date: 2026-08-28 (Asia/Shanghai)  
Reference: https://www.giuligartner.com/  
Scope: STEP 1 only. This document describes the public reference; it does not authorize reuse of its media, biography, logo, font files, or brand copy.

## 1. Evidence and method

- The site was operated in a real Chromium browser with Playwright, not inferred from HTML alone.
- Audited routes: Home, Stills, Motion, About, three Stills case studies, and two Motion case studies.
- Viewports: 1920×1080, 1440×900, 1280×800, 390×844, and 393×852.
- Each audited route was sampled at 0%, 10%, …, 100% scroll depth.
- 495 normalized page screenshots and 12 interaction screenshots were saved under `reference/`.
- DOM geometry, computed typography, live state, localStorage, loaded media behavior, source CSS, and public scripts were checked.
- Dark mode was the baseline unless a screenshot explicitly names `light`.

Screenshot structure:

```text
reference/
  desktop/{1920x1080,1440x900,1280x800}/{route}/{000..100}.jpg
  mobile/{390x844,393x852}/{route}/{000..100}.jpg
  interactive/*.jpg
```

The nine captured route keys are `home`, `stills`, `motion`, `about`, `stills-visit-greenland`, `stills-inspired-by-iceland`, `stills-cayuga-collection`, `motion-pandore`, and `motion-satisfy`.

## 2. Executive findings

1. The visual system is editorial rather than application-like: one dark or pale canvas, a fixed 64 px navigation strip, oversized condensed serif display type, very small uppercase metadata, and large media fields with 24–64 px insets.
2. Most depth comes from long scroll spans, paired images entering from opposite edges, sticky mini-galleries, horizontal filmstrip movement, and scale/position changes. There is no custom cursor and no Three.js/WebGL requirement.
3. The route transition is simpler than the brief implies. Every internal non-hash link uses the same full-viewport color overlay and a 1,000 ms delayed navigation. No image-continuity transition was observed.
4. The F-stop is a persistent theme control. It changes canvas/text colors and theme-specific treatments; it is not a photographic blur or depth-of-field filter.
5. The live control is inconsistent by breakpoint: desktop reads `F/24 / F/1.4`, while the collapsed mobile control reads `F/23 / F/1.4`.
6. Stills and Motion index cards are fundamentally different. Stills cards occupy very long vertical stages with paired portrait media, while Motion cards use a central cinematic composition with three smaller parallax frames.
7. Mobile is a re-composition. It changes card heights, media ratios, nav behavior, headline size, gallery width, sticky-rail width, and Motion case-study video geometry; it is not a scaled desktop.

## 3. Global visual system

### 3.1 Color and surface

| State | Canvas | Primary text/accent | Other treatment |
|---|---:|---:|---|
| Dark / F-stop closed | `#0e1012` | `#f3f6fa` | Grain overlay; translucent dark nav background |
| Light / F-stop open | `#e8e5f0` | `#1a4572` | White page-transition and menu panel; nav background at 0.75 opacity |

- Theme color transition: 500 ms ease; the temporary `transition` class is removed after 750 ms.
- The surface has a subtle full-page grain texture. It must remain low contrast and pointer-transparent.
- Buttons use current text color, a 1 px current-color border, pill rounding, and a very low-opacity fill on hover.

### 3.2 Typography

The live site loads commercial faces from its own CDN:

- Display: Roslindale Display Condensed Regular, weight 400.
- UI/body: Mint Grotesk Medium 500 and Bold 700.

These files must not be copied or redistributed. A later implementation must use legally licensed substitutes and independently define Traditional Chinese fallbacks.

Measured at 1440×900:

| Role | Family | Size / line-height | Other |
|---|---|---:|---|
| Home/display H1 | Roslindale | 108 / 108 px | uppercase presentation |
| General H2/project title | Roslindale | 98 / 98 px | usually centered |
| General H3 | Roslindale | 80 / 80 px | editorial sentence case |
| Footer/display H4 | Roslindale | 42 / 54.6 px | 0.84 px tracking, uppercase |
| Body copy | Mint Grotesk | 16 / 25.6 px | weight 500 |
| Nav and labels | Mint Grotesk | 10–11 / 11–13 px | uppercase |
| About display | Roslindale | 180 / 162 px | 0.9 line-height |

Mobile examples at 390×844:

- Stills/Motion page title: 89.7 / 98.67 px.
- About name: 93.6 / 84.24 px.
- About section headings: 50.7 / 50.7 px.
- Several hero/display rules are viewport-relative (`vw`) and change at 991, 767, and 479 px.

### 3.3 Spacing and shape

- Desktop container inset: 64 px.
- Tablet inset: 48 px.
- Small/mobile inset: 32 px, then 24 px at ≤479 px.
- Fixed navigation height: 64 px.
- Primary media radius: about 32 px desktop; 12–30 px depending on mobile context.
- Desktop Home hero at 1440×900: x 64, y 64, width 1312, height 772.
- Footer at 1440×900 is approximately 433 px high and includes a centered contact action plus a three-part lower metadata row.

### 3.4 Breakpoint model

| Range | Reference behavior |
|---|---|
| >991 px | Desktop inline navigation, 64 px page insets, desktop card geometry |
| 768–991 px | Collapsed nav/menu, 48 px insets, tablet media widths |
| 480–767 px | Mobile stacking, 32 px insets, single-column case galleries |
| ≤479 px | 24 px insets, largest viewport-relative type, 48 px gallery rail, taller cards |

## 4. Global chrome

### Navigation

- Fixed to the viewport and always above content.
- Desktop: logo centered; left group `STILLS / MOTION / ABOUT`; right group `INSTAGRAM / EMAIL / F-stop`.
- Logo is a custom wordmark. Its dot layers lift by 2 px and 4 px on hover.
- Desktop nav pill height is 32 px; the F-stop measured 78×32 px at x 1290, y 16 on 1440×900.
- At ≤991 px the inline link groups disappear. The logo stays left; F-stop and Menu stay right.

### Mobile menu

- Webflow collapse duration: 700 ms.
- Opens below the 64 px nav into a viewport-height blurred overlay.
- At 390 px the menu content panel begins near x 24, is about 342 px wide, uses a large rounded rectangle, and vertically centers five links.
- Link order: Stills, Motion, About, Instagram, Email.
- Dark mode uses the dark panel; light mode uses white. Underlying hero remains visible around and below the panel.
- The Menu label rolls to Close; the button remains at the upper-right.

### Footer

- `GET IN TOUCH` label over a large outlined email field.
- Hover changes the helper line to `CLICK TO COPY`; clicking changes it to `COPIED ✨`.
- Lower row: identity/year left, social pills center, credit right; mobile stacks and centers the row.

## 5. HOME audit

Measured scroll height: 6663 px at 1440×900; approximately 5085–5170 px at 390×844 depending on loaded state.

### H01 — Full-viewport reel hero

Layout:

- Section: 100 vh desktop; 95 vh with 600 px minimum on tiny mobile.
- Desktop media card: 64 px inset, 1312×772 px at 1440×900, rounded 32 px, overflow hidden.
- Background is an autoplaying, muted, looping cover video.
- Five display fragments form the centered title and allow line wrapping independent of semantic text.
- Mobile keeps a tall rounded media card with 24 px horizontal inset and moves the type into a tighter multi-line stack.

Entrance:

- Card initial scale is 0 and expands into place.
- Title fragments begin at `translateY(100%)`, about 16° rotation, and 8–12 px blur, then settle into place in a staggered sequence.
- Navigation stays fixed and visually separate from the card reveal.

Scroll:

- The hero exits normally; it is not pinned.
- Video continues while the rest of the page scrolls.

### H02 — Origin/introduction

Layout:

- Desktop y 900–1636, height 736 px.
- Large serif sentence is centered and interleaves three small photographs as typographic glyphs.
- Three measured image sizes at 1440: 64×80, 64×80, and 120×80 px.
- Supporting paragraph and outlined CTA sit beneath with narrow line length.

Animation:

- Sentence words rotate in from -90° on the X axis.
- Small images rise and drift at different rates to punctuate the line.
- Supporting content follows after the headline rather than entering simultaneously.

### H03 — Featured Still: Visit Greenland

Layout:

- First half of a 3760 px Stills block.
- Centered date/location, large two-line title, CTA, then a five-color horizontal palette.
- Two tall images occupy opposite sides. At the center of the stage each is roughly 600×720 px at 1440.

Scroll choreography:

- Images translate from outside opposite viewport edges toward the title, overlap the viewport edge, then separate again.
- Each image has independent vertical/parallax travel; title and metadata remain the stable visual anchor.
- Palette appears as a compact strip; its colors are interactive on hover.

### H04 — Featured Still: Cayuga Collection

- Repeats the H03 system with different cropping and offsets, preserving the long breathing interval.
- Alternating image sides avoid a mechanical card-list rhythm.
- The second project flows directly into Motion; there is no grid or card chrome.

### H05 — Featured Motion: Pandore

Layout:

- Desktop y 5332–6231, height about 899 px; internal motion list height about 771 px.
- Main cinematic image is approximately 937×524 px.
- Three smaller frames surround it (about 299–345 px wide) and use independent parallax.
- Central play button, metadata, title, and CTA remain readable above the composition.

Animation:

- The three satellites drift on different axes/rates while the central media remains dominant.
- Hover scales the play icon and adds a blurred glow.
- The index itself uses images; there were no `<video>` elements on `/motion`.

### H06 — Footer/contact

- Follows immediately after Motion.
- Large central email action dominates; small utility data remains at the bottom edge.
- No extra promotional section or card grid is present.

## 6. STILLS index audit

Measured scroll height: 14,029 px at 1440×900 and 9084 px at 390×844.

### S01 — Editorial introduction

- Desktop intro header is followed by seven project stages.
- Title `Stills` is centered in large display type; the explanatory paragraph is centered below with compact measure.
- Mobile header height is about 600 px; the title measured 89.7 px and the project list begins around y 536.
- Intro paragraph uses the same word-rotation reveal as case-study copy.

### S02–S08 — Project stages

Current order:

1. Visit Greenland
2. Inspired by Iceland
3. Follow The Tracks
4. Cayuga Collection
5. The Pill
6. TIJN Eyewear
7. Travel Alberta

Desktop behavior:

- Each stage occupies about 1800 px / 200 vh.
- Metadata, title, CTA, and palette are centered.
- A pair of portrait/near-portrait photographs moves through the stage from opposite sides.
- Large negative space is intentional; only one project should read as active at a time.

Mobile behavior:

- Project stage is 134 vh.
- First card at 390 px measured 390×1131 px.
- Main visible image was about 312×506 px and may bleed beyond the left/right viewport edge.
- Title stays centered over or between the two moving images, with the palette below.
- The user never depends on hover to identify or enter a project.

## 7. MOTION index audit

Measured scroll height: 6436 px at 1440×900 and 5281 px at 390×844.

### M01 — Editorial introduction

- Centered title and a longer centered statement.
- Mobile header height about 721 px; title measured 89.7 px.

### M02–M06 — Motion project stages

Current order:

1. Pandore
2. Satisfy Running
3. Amelia
4. Nuances of Noise
5. The Girl With The Yellow Jacket

Layout and movement:

- Each project uses one main 16:9-ish image plus three smaller parallax frames.
- Metadata and title trade vertical position with the image composition so consecutive items alternate rhythm.
- On mobile the first stage measured about 550 px high; its main image extended beyond both viewport edges and measured roughly 426×339 px.
- Small frames remain visible on touch as composition, not hidden hover previews.
- Play icon/CTA provides the case-study entry point. Index media is poster imagery, not autoplay video.

## 8. ABOUT audit

Measured scroll height: 6204 px at 1440×900 and 8246 px at 390×844.

### A01 — Name and portrait/video

- Desktop header height 1152 px.
- `Giulia` and `Gartner` are stacked at 180/162 px and overlap a narrow 400×700 px vertical video beginning near y 478.
- Mobile header is about 882 px; name is 93.6/84.24 px; video becomes 342×598.5 px and begins near x 24.
- Theme changes the portrait treatment via warm/cool layered media on supported sections.

### A02 — Story collage

- Desktop height about 1785 px, overflow hidden.
- Starts with a horizontally moving strip of mixed-aspect photos.
- Below, a two-column composition pairs a large portrait with several paragraphs and a large `Let's create…` display line.
- The gallery strip is much wider than the viewport and moves diagonally/horizontally with scroll.
- Mobile reorders into a single readable story while retaining the moving strip.

### A03 — Credentials directory

- Desktop height about 2835 px; mobile about 4326 px.
- Four subsections: brands, awards/nominations, press, podcasts.
- Desktop uses a 4-column logic with an oversized sticky heading on the left and compact rows/logos on the right.
- Mobile centers each section heading and stacks its data.
- Award rows translate their title +16 px and tags -16 px on hover while the divider fades and a low-opacity background appears.

## 9. STILLS case studies

### Shared structure

1. Oversized title plus rounded hero image.
2. Date/location and concise editorial description.
3. Asymmetric image sequence with varied width, ratio, and horizontal offset.
4. Sticky miniature image rail at the right.
5. `Explore More` looping drag carousel excluding the current project.
6. Global contact footer.

At 1440 px, title size is 108/108 px. The hero occupies the 64 px inset container; gallery images are intentionally irregular rather than standardized blocks.

The right thumbnail rail is about 70 px wide desktop and 48 px at ≤479 px. Current/hover thumbnail lifts in 3D by 32 px, gains a border, and loses its color overlay. Hash navigation uses `#1`…`#10` and the page declares a 0.5 second scroll time.

### CS-S1 — Visit Greenland

| Metric | Desktop 1440×900 | Mobile 390×844 |
|---|---:|---:|
| Scroll height | 9049 px | 4660 px |
| Visible story images | 7 | 7 |
| Hero stage | 1898 px high | tall title + edge-to-edge hero |
| Intro | 449 px | expanded centered copy |
| Story gallery | 5463 px | single-column, 16 px gaps |

- Desktop image widths range roughly 849–1097 px and alternate left, center, and right alignment.
- The hero is a layered base image + transparent overlay, both initially translated 50% downward before entrance.
- Mobile removes the hero's lower corner radii where it meets the page edge and turns every story image into a full-column composition.

### CS-S2 — Inspired by Iceland

| Metric | Desktop 1440×900 | Mobile 390×844 |
|---|---:|---:|
| Scroll height | 11,851 px | 6803 px |
| Visible story images | 10 | 10 |

- Longest of the sampled Stills stories.
- Uses a broad mix of landscape, square-ish, and portrait frames; the waterfall frame becomes a major visual anchor.
- Rail progress clearly outlines the active miniature as the associated image crosses the viewing zone.

### CS-S3 — Cayuga Collection

| Metric | Desktop 1440×900 | Mobile 390×844 |
|---|---:|---:|
| Scroll height | 4766 px | 4551 px |
| Visible story images | 9 | 9 |

- Denser, shorter story than the other two.
- Alternates warm color work with black-and-white frames.
- Uses overlaps between successive wide images rather than large blank gaps.

### Explore More — Stills

- Splide 4.1.3.
- Desktop: 3 cards per page; ≤767 px: 2; ≤478 px: 1.
- Loop, one-card move, focus left, 16 px gap, free drag + snap, no arrows, no pagination.
- Track overflow remains visible; active drag uses grabbing cursor.

## 10. MOTION case studies

### Shared structure

1. Viewport-height rounded video hero with title and `WATCH VIDEO`.
2. Date/location plus project synopsis.
3. Two continuously opposed filmstrip rows.
4. Centered credits.
5. Very long pinned Behind-the-Scenes section.
6. Motion `Explore More` loop carousel.
7. Global footer.

The Vimeo iframe uses `?background=1`, which autoplays muted and loops as a background. Clicking Watch resets time to zero, unmutes, and adds `playing` classes that enlarge/reframe the video. A floating pause/resume control becomes available after entering playback.

### CS-M1 — Pandore

| Metric | Desktop 1440×900 | Mobile 390×844 |
|---|---:|---:|
| Scroll height | 9470 px | 7205 px |
| Hero | 900 px | tall rounded card, 130% initial ratio |
| Filmstrip | 545 px | stacked/tighter frames |
| BTS stage | 5400 px | 400 vh at ≤479 px |
| BTS images | 8 | 8 |

- Desktop iframe is over-scaled to cover: measured 2160×1080 centered at x -360, y -90.
- BTS pins a framed image while the eight images translate vertically through it; split `Behind / the / scenes` typography masks the image above and below.
- Mobile video width changes from about 230 vw to 160 vw in playing state; hero ratio changes from 130% to 90%.

### CS-M2 — Satisfy Running

| Metric | Desktop 1440×900 | Mobile 390×844 |
|---|---:|---:|
| Scroll height | 9439 px | 7174 px |
| BTS stage | 5400 px | 400 vh at ≤479 px |
| BTS images | 8 | 8 |

- Reuses the same motion template and timing with different credits, filmstrip, and BTS imagery.
- The repeated geometry confirms this should be data-driven rather than page-specific animation code.

### Explore More — Motion

- Desktop: 2 cards per page; ≤767 px: 1.
- Same loop/free-drag/snap/16 px gap/no-controls configuration as Stills.
- Current project is excluded.

## 11. Scroll and animation system

### Smooth scrolling

The live configuration is:

```text
duration: 1.5
easing: 1 - 2^(-10t), with t=1 clamped to 1
direction: vertical
smooth: true
smoothTouch: false
touchMultiplier: 1.5
```

### Text reveal

- SplitType creates word and character spans.
- Trigger 1 resets when the element leaves backward past `top bottom`.
- Trigger 2 plays at `top 85%`.
- Words rotate X from -90° to 0 with transform perspective 1000, duration 0.8 s, `power2.out`, and total stagger 0.8 s.
- No scrub is used for this reveal.

### Webflow scroll-linked movement

The image pairing, parallax cards, sticky gallery progression, filmstrips, and BTS sequence are driven by Webflow IX2 scroll interactions. They continuously update transform/opacity rather than using CSS layout properties. Reimplementation should preserve that transform-first model and name independent timelines by page/section.

### Motion character

- Easing is mostly ease-out/expo-like, with physical-looking settling rather than spring bounce.
- Scroll spans are deliberately long. Compressing them would change the identity of the site more than small pixel differences.
- Reveals favor translation, scale, rotation, blur, opacity, and masking. No particle, neon, glass, or 3D scene effects were observed.

## 12. Responsive conclusions

- The fixed nav and F-stop stay reachable at all sizes.
- Desktop inline nav becomes the rounded overlay menu at ≤991 px.
- Mobile titles use independent wrapping and larger viewport-relative sizing.
- Stills cards reduce from ~200 vh to 134 vh; their images become narrower but continue to bleed offscreen.
- Case-study gallery becomes one column; every image wrapper resets to width 100% while the miniature rail shrinks to 48 px.
- Motion header poster/video is more vertically cropped on mobile and changes geometry when playback begins.
- BTS height reduces from 600 vh desktop (`5400 px` at a 900 px viewport) to 400 vh on tiny mobile.
- Explore More changes 3→2→1 cards for Stills and 2→1 for Motion.
- Touch does not run smooth Lenis interpolation (`smoothTouch: false`); native touch remains responsive with multiplier 1.5.

## 13. Reference gaps and risks

- The public site's desktop F-stop label is F/24, while mobile is F/23. The build phase needs an explicit product decision: preserve this live inconsistency for fidelity or normalize to F/23 as the brief says.
- The site does not expose a custom reduced-motion branch in the inspected scripts. The future build should add one without altering the default choreography.
- Vimeo produced intermittent console/network errors during automated captures. Poster fallback is required so the layout never becomes blank when third-party playback fails.
- The current sitemap omits `/motion/pandore` even though the live index and Home link to it.
- Commercial reference fonts must be substituted or separately licensed.
- Captured screenshots are audit evidence only and must never ship as portfolio assets.

## 14. STEP 1 completion assessment

Aligned/verified:

- Information architecture and current project inventory.
- Desktop/tablet/mobile breakpoints and measured geometry.
- Home, indexes, About, three Stills stories, two Motion stories.
- Menu, F-stop, hover, scroll, gallery rail, Motion playback, route transition, Explore More, copy-email, and footer.
- Screenshot evidence at all requested dimensions and scroll depths.

Deferred by the brief:

- Architecture and schema decisions.
- Any Next.js/GSAP/Lenis implementation.
- Local placeholder media creation.
- Reference-vs-local comparison and fidelity scoring.

