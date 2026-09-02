# STEP 3C-R3 — Read My Story / About

## Route and section architecture

The Home `READ MY STORY` CTA uses the validated transition link and now resolves to the statically exported `/about/` route.

1. A01 — About hero: data-driven two-line name and manifest-backed vertical portrait.
2. A02 — Compact bilingual introduction and scroll-driven mixed-aspect film strip.
3. A03 — Large display statement with restrained Traditional Chinese companion and compact narrative.
4. A04 — Sticky lifestyle image with long-form story framework.
5. A05 — Tools / Cameras information system.
6. A06 — Selected Series list.
7. A07 — Notes / Features list.
8. A08 — Elsewhere links list.
9. A09 — Existing content-driven contact footer.

The lower sections use shared data-driven groups with an `enabled` flag, so an unapproved category can be hidden or replaced without rewriting the layout. They use editorial headings, thin rules, rows, and negative space—no cards, dashboards, bento grid, or glass UI.

## About entrance and scroll architecture

- Hero title entrance: 1.15 seconds, y 24 px → 0 and opacity 0 → 1.
- Portrait entrance: begins at 80 ms and settles by approximately 1.23 seconds, y 34 px → 0 and opacity 0 → 1.
- Measured samples showed title/portrait still settling at 350 ms, nearly settled at 750 ms, and visually stable by 1.15–1.25 seconds.
- Hero scroll: one scrubbed timeline moves the title upward by 24% and the portrait upward by 48%, preserving portrait-over-title stacking.
- Film strip: one ScrollTrigger maps vertical progress continuously to `xPercent 9 → -21`, `yPercent 10 → -6`, and rotation `-2.2° → -1.2°`, with scrub 0.55.
- About-specific ScrollTrigger count: 2. Both belong to the route scope and are destroyed on route leave.

## Responsive validation

- 1440×900: all nine sections, portrait/title overlap, horizontal film movement, sticky story media, information lists, and footer visually checked.
- 390×844: distinct stacked geometry, taller mixed-aspect strip, non-sticky story image, two-column row reduction, and 0 px horizontal overflow.
- Breakpoint checks: 991, 767, and 479 px all rendered nine sections with 0 px horizontal overflow.
- Mobile page height at 390×844: 8,360 px; the route remained continuously scrollable with no dead interval.

## Media and content status

The About portrait is a new, original temporary mock generated with OpenAI image generation: a fictional East Asian creative professional in a natural monochrome 35 mm coastal editorial portrait, with no resemblance request, logo, or copied Reference asset. Production variants are manifest-backed at 640 and 1024 px in JPEG and WebP:

- `public/mock-media/about/portrait-r3/about-portrait-640-mockr3.jpg`
- `public/mock-media/about/portrait-r3/about-portrait-1024-mockr3.jpg`
- `public/mock-media/about/portrait-r3/about-portrait-640-mockr3.webp`
- `public/mock-media/about/portrait-r3/about-portrait-1024-mockr3.webp`

The film strip and story image reuse authorized project mock media. They are sufficient to validate landscape/portrait rhythm but are not the final archive.

Still requiring user approval:

- First-person biography/story copy.
- Final bilingual identity and voice.
- Real tools/cameras, series, notes/features, and external-profile data.
- Contact and social values already held in the site content model.
- Final portrait, BTS, strip, and lifestyle photography.
- Licensed display typography if Roslindale Condensed is later supplied.

No Giulia Gartner biography, production image, social URL, or proprietary source asset was copied.

## Global validation

- `npm run check`: PASS.
- Static `/about/` export and production request: PASS.
- Production console/hydration issues: 0.
- Lifecycle cycling: PASS; About creates 2 local ScrollTriggers and leaves no growth.
- Menu, F-stop, Back/Forward, reduced motion, desktop, mobile, and audited breakpoints: PASS.
- Review video: `outputs/STEP3C_R3_VALIDATION_1440x900.mp4`.

Remaining priorities: P0 none; P1 final footage/display license; P2 approved copy and final media; P3 asset-specific micro-spacing after those inputs arrive.

Commit hash: supplied in the final handoff because a commit cannot contain its own hash.
