# STEP 3C-R3 — Authoritative First-Entry Analysis

## Evidence and scope

- Authoritative recording: `/Users/jr-fank/Desktop/录屏2026-09-01 21.00.04.mov`
- Measured source: H.264, 2268×1708, 1500 frames, approximately 59.21 fps, 24.66 seconds.
- Scope retained from R2: ProjectStage progression, global Lenis/GSAP lifecycle, route transitions, menu, F-stop theme control, and static-export architecture.
- No proprietary Reference asset, commercial font file, biography, or production photography was copied into the project.

## Reference timing findings

| Event | Authoritative observation | Implemented timing |
| --- | --- | --- |
| Dark shell | Present before visible content | `#101114` on `html`, `body`, transition surface, and dark theme metadata before hydration |
| Chrome entrance | Begins at about 0.55 s | 550–970 ms; 8 px low-amplitude settlement |
| Hero small frame | Present at about 0.65 s | Initial centered scale `0.28` |
| Hero expansion | About 0.65–1.65 s | 650–1650 ms, transform-only, centered, no layout shift |
| Display line 1 | About 1.15–1.45 s | 1150–1450 ms |
| Display line 2 | About 1.55–1.85 s | 1550–1850 ms |
| Display line 3 | About 1.85–2.05 s | 1850–2060 ms |
| TC companion | Restrained secondary arrival | 2050–2410 ms |

Each display line owns a separate overflow-hidden mask. Its visible track is `translateY(110%) → 0`, `blur(10px) → 0`, and supporting opacity `0.42 → 1`. The lines settle independently and remain sharp.

The first-entry choreography is CSS-owned so its initial state is present in server-rendered HTML and does not wait for client animation setup. GSAP continues to own scrubbed Home scroll behavior only. This removes the prior hydration-dependent entrance delay without introducing a second global ticker or route scope.

## Hover evidence and implementation

- Hover-in scale: `1 → 1.8` in 280 ms.
- Hover-in easing: `cubic-bezier(.23, 1, .32, 1)` (power3-out equivalent).
- Hover-in blur: `0 → 9px → 0`; peak at 54% / approximately 151 ms.
- Hover-out scale: `1.8 → 1` in 200 ms.
- Hover-out blur: `0 → 6px → 0`; peak at 42% / 84 ms.
- Enlarged state ends sharp. Leave state ends small and sharp.
- The outer inline hit area remains 64×80 px during both tracks, so the text line does not reflow and pointer leave is reliable.
- The active image uses z-index 8; the release delay retains that layer for 220 ms.
- Behavior is limited to `(hover: hover) and (pointer: fine)`.

Measured desktop hover samples confirmed scale approximately `1.78` and blur `8.73px` at 140 ms, scale `1.8` and sharp output at 280 ms, then small/sharp output by 220 ms after leave. The outer rectangle was unchanged.

## R2 ProjectStage regression

The shared R2 architecture was not rewritten. Forward sampling across H03 confirmed continuous center/close → outward → offscreen movement with no bottom re-collapse. Reverse sampling at the same progress values produced the same coordinates in reverse order. The outgoing images were outside the viewport near 0.92 progress; there was no dead-scroll plateau.

## First-entry verdict

**Approve for human video review.** No P0 first-entry or hover issue remains. The principal fidelity limitation is the legally substituted display face: Cormorant Garamond is metric-oriented but is not Roslindale Condensed.
