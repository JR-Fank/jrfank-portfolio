# STEP 3C-R3 — Home Fidelity and Runtime Report

## Motion correction result

| Area | Before R3 | R3 result | Why |
| --- | --- | --- | --- |
| First-entry ownership | Client GSAP entrance could begin after hydration | Deterministic CSS entrance; GSAP retains scroll choreography | Matches cold-entry timing and prevents duplicate entrance control |
| Hero expansion | Smaller initial scale and later start | Centered `0.28 → 1`, 650–1650 ms | Matches the recorded small-frame phase |
| Display reveal | Longer/later line movement | Independent 300/300/210 ms masked tracks | Matches 1.15–2.06 s authoritative sequence |
| Moving blur | Limited vertical reveal | `10px → 0` blur with supporting opacity | Matches blurred movement resolving rapidly to sharp type |
| Inline hover | Slower CSS hover pulse | 280 ms enter, 200 ms leave, WAAPI blur pulse | Matches the authoritative transient-blur timing and reliable cancellation |
| Project stages | Validated R2 shared scrub model | Unchanged and regression-tested | Prevents dead-scroll and bottom collapse from returning |

Motion review verdict: **Approve.** Timing is bounded, cancellable, reduced-motion safe, hover-capability gated, and transform-based. No loop, duplicated ticker, or new global animation subsystem was added.

## Actual values

- Background token: `--canvas: #101114`.
- Chrome: 550 ms delay, 420 ms duration.
- Hero expansion: 650 ms delay, 1000 ms duration, `scale(0.28) → scale(1)`.
- Line 1: 1150–1450 ms.
- Line 2: 1550–1850 ms.
- Line 3: 1850–2060 ms.
- Text blur: 10 px → 2 px at 68% → 0 px.
- Hover-in: scale 1 → 1.8, 280 ms; blur 0 → 9 → 0 px.
- Hover-out: scale 1.8 → 1, 200 ms; blur 0 → 6 → 0 px.
- Hero video: autoplay, muted, `playsInline`, loop, poster/fallback; playback and advancing `currentTime` verified.

## Runtime regression

- Production console errors/warnings: 0.
- Page/runtime exceptions: 0.
- Hydration errors: 0.
- Home diagnostics: 1 Lenis instance, 1 GSAP ticker driver, 1 active route scope, 5 Home ScrollTriggers.
- About diagnostics: 1 Lenis instance, 1 GSAP ticker driver, 1 active route scope, 2 About ScrollTriggers.
- Repeated Home → About cycles held trigger counts at `5 / 2 / 5 / 2 / 5`; route scopes and root count remained 1.
- Back/Forward: Home returned to measured scrollY 700; About returned to scrollY 0.
- Theme: light mode persisted across reload and reset correctly; sampled light canvas `#e8e5f0`.
- Menu: mobile panel stayed inside 390 px viewport, first item received focus, route content became inert, Escape closed it and restored trigger focus.
- Reduced motion: 0 Lenis instances, 0 ticker drivers, 0 ScrollTriggers; content remained visible and overflow-free.
- F-stop: desktop control and mobile `F/23` label verified.

## Build and export

- `npm run check`: PASS (`tsc --noEmit`, content validation, production build).
- Static export: PASS; 11 routes generated, including `/` and `/about/`.
- Production HTTP smoke check: `/`, `/about/`, `/stills/`, and `/motion/` returned 200.
- Validation video: `outputs/STEP3C_R3_VALIDATION_1440x900.mp4`
- Video properties: H.264, 1440×900, 25 fps, 22.4 seconds, 5,297,944 bytes.
- SHA-256: `d62eebfe2917872cae79cbb999c54455ede80d0da0d0a4ddc6d74e888f3a3e19`

## Remaining issues

- P0: none.
- P1: the Hero loop remains clearly temporary project-owned motion-validation media; final user footage is still required. The current display font remains a legal substitute, not Roslindale Condensed.
- P2: final identity copy and complete photography archive are not approved; these may change line metrics and image-specific color balance.
- P3: final micro-calibration can follow once licensed typography and final footage are available.

## Safety audit

The changed set contains no Reference production asset, commercial font file, Cloudflare credential, secret, private media master, GPS tag, or unexpected generated artifact. The new portrait files contain no embedded format tags. Temporary Playwright scripts and build caches remain ignored.

Commit hash: supplied in the final handoff because a commit cannot contain its own hash.
