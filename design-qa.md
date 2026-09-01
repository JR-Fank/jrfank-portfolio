# STEP 3C-R2 Design QA — Authoritative motion correction

## Target and evidence

- Visual truth: the corrected 59.92 fps Reference recording plus STEP 1 evidence.
- Production implementation: `http://localhost:4173/` from the static export.
- Desktop evidence: `outputs/step3c-authoritative-motion/desktop/`.
- Mobile evidence: `outputs/step3c-authoritative-motion/mobile/`.
- Required walkthrough: `outputs/STEP3C_R2_VALIDATION_1440x900.mp4`.

## Comparison result

- Hero: small centered playing media frame, delayed chrome, spatial expansion, and three independent masked line reveals now follow the corrected sequence.
- H02: all three inline images use the required 1.8 scale plus transient blur-to-sharp pulse without reflow or pointer loss.
- H03/H04: physical left always continues left and physical right always continues right across the entire trigger. No horizontal plateau, bottom collapse, shrink exit, threshold swap, or direction-specific inversion remains.
- Reverse: matching forward/reverse scroll positions reconstruct within 1–3 px after scrub settling.
- Overlap: outgoing project media remains near the outer edges while the next project enters below; H04 remains outward while H05 enters.
- Color: the authoritative dark token is `#101114`.
- Responsiveness: 1440 × 900 and 390 × 844 both retain zero horizontal overflow.

## Interaction and accessibility result

- Video attributes and live playback pass: autoplay, muted, playsInline, loop, poster, fallback, readyState 4, and increasing currentTime.
- Hover is gated to fine hover pointers; mouseleave reliably restores scale, filter, and z-index.
- Reduced motion removes Hero/project transforms and reveals all content.
- Theme persistence, Hero contrast, menu geometry/focus/Escape behavior, route cycles, Back/Forward restoration, and console/hydration review pass.

## Findings

- P0: none.
- P1: none found in the implemented motion architecture.
- P2: final captured Hero footage is still required; the checked MP4 is an explicit project-owned still-derived stand-in.
- P2: legal substitute fonts remain visibly different from Roslindale Condensed and Mint Grotesk.
- P2: the automated walkthrough is a 12 fps exact-frame Chrome sequence, so final micro-easing remains subject to live/human review.
- P3: mock photographic subjects/crops and exact edge silhouettes differ from the protected Reference.
- P3: very fast wheel impulses can briefly lead the `scrub: 0.45` response; slow forward/reverse review is continuous.

## Verification

- `npm run check`: pass.
- Static/SSG pages generated: 11.
- Tested export routes and Hero MP4: HTTP 200.
- Production console errors/warnings/hydration messages: 0.
- Route-content roots / active route-scope wrappers / overlays after repeated cycles: 1 / 1 / 1.
- Back restoration: exact tested scrollY 700.
- Mobile menu: x24 / y64 / 342 × 326.
- Safety scan: no secrets, commercial fonts, unauthorized Reference assets, private masters, or generated build/cache junk.

final result: implementation passed; human video review pending
