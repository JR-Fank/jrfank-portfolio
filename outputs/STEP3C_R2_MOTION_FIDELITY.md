# STEP 3C-R2 — Motion fidelity / scroll architecture correction

Completed on 2026-09-01. Scope stops at STEP 3C-R2 Home motion correction; STEP 3D was not started.

## 1. Root cause of dead scroll

The P1 failure was structural and independent of Lenis smoothing.

Each H03/H04 timeline previously occupied 2.0 normalized timeline units:

- side-media entry: 0.00–0.62;
- no side-media tween: 0.62–1.38;
- side-media exit: 1.38–2.00.

The ScrollTrigger spanned approximately 2556 px on desktop. The empty 0.76-unit interval therefore mapped to roughly 970 px of document travel while both project images retained the same transforms. The 205 svh CSS-sticky section made this read as a frozen composition followed by a late threshold transition.

Measured R1 evidence confirmed identical side-media coordinates from scrollY 1800 through 2391, with visible movement resuming only near 2791.

## 2. Previous H03–H05 architecture

- H03 and H04 each used a 205 svh desktop / 134 svh mobile section.
- A 100 svh child stage used CSS `position: sticky; top: 0`.
- No GSAP `pin` or `pinSpacing` was used, but the sticky stage plus the long empty timeline interval produced a full-section pinned feeling.
- Separate entry and exit tweens surrounded an unanimated hold.
- H03 and H04 triggers overlapped only late in H03 exit, after the dead interval.
- H05 remained a naturally scrolling 100 svh desktop / 68 svh mobile composition with one route-scoped scrub timeline.

## 3. New H03–H05 architecture

- Section and responsive stage geometry remain unchanged to preserve the validated R1 static composition.
- CSS sticky remains the stable central/stage anchor; GSAP enhances spatial travel rather than adding scroll spacers.
- Each side image now follows one uninterrupted entrance-to-exit trajectory across the full project trigger.
- Center content can remain relatively stable, but side media never enters a static hold.
- H05 remains naturally scrolling and overlaps the end of H04 through its existing trigger range.

## 4. Pinning decision

Full GSAP pinning was not retained or introduced.

- `pin`: absent;
- `pinSpacing`: absent;
- scroll snap/discrete project state: absent;
- CSS sticky: retained for the 100 svh visual anchor because it matches the Reference's stable central-information behavior without adding an artificial spacer.

This is the requested sticky-plus-natural-flow model: document sections remain in normal flow while continuous scrubbed transforms provide the parallax/travel response.

## 5. Exact ScrollTrigger / sticky model

For both H03 and H04:

```text
section height: 205svh desktop / 134svh mobile
stage: position: sticky; top: 0; height: 100svh
ScrollTrigger start: top bottom
ScrollTrigger end: bottom top
scrub: 0.45
pin: false
pinSpacing: false
```

Side-media trajectories use `ease: none` for reversible scroll mapping:

```text
left:
  xPercent -118*direction → +118*direction
  yPercent +24 → -24
  rotate -5*direction → +4*direction

right:
  xPercent +118*direction → -118*direction
  yPercent -20 → +28
  rotate +5*direction → -4*direction
```

Center information fades/scales into its stable interval and leaves from 0.72–1.00. Only the center can hold visually; both side images continue moving for the entire 0.00–1.00 project progress.

Home retains five standard-motion ScrollTriggers: H01 departure, H02 reveal, H03, H04, and H05. Reduced motion applies no Home scroll transforms.

## 6. H02 hover implementation

The existing inline-media element retains its measured layout box and the GSAP entrance transform. A new inner scaler owns hover transform, so scroll entrance and pointer hover never compete for the same `transform` property.

- enabled only inside `@media (hover: hover) and (pointer: fine)`;
- transform-based, centered origin;
- no width/height/layout mutation;
- parent overflow remains visible;
- inner scaler retains rounded clipping;
- hovered element rises to z-index 8;
- z-index release is delayed until the scale-down completes;
- inner scaler ignores pointer events, keeping the original inline box as the reliable hover target.

All three measured layout boxes remained 64 x 80, 64 x 80, and 120 x 80 before, during, and after hover.

## 7. Calibrated hover values

```text
scale: 1.8
transform origin: 50% 50%
mouseenter: 380ms cubic-bezier(.215, .61, .355, 1)
mouseleave: 460ms cubic-bezier(.215, .61, .355, 1)
```

The curve is the CSS equivalent used elsewhere for the audited power3-out interaction character. Captures confirm no text reflow, no clipping, and a clean release for all three images.

Evidence:

- `outputs/step3c-r2-validation/final/desktop/h02-normal.jpg`
- `outputs/step3c-r2-validation/final/desktop/h02-hover-1.jpg`
- `outputs/step3c-r2-validation/final/desktop/h02-hover-2.jpg`
- `outputs/step3c-r2-validation/final/desktop/h02-hover-3.jpg`
- `outputs/step3c-r2-validation/final/desktop/h02-release.jpg`

## 8. Exit-animation model

Opacity is not the primary side-media exit.

Each image continues the same transform trajectory used for entry, crosses its measured central range, keeps independent vertical/parallax travel, and exits through the opposite spatial boundary. Rotation changes gradually across the same progress. This makes entry and exit opposite ends of one reversible path rather than separate state animations.

The title/metadata opacity changes only to manage editorial focus while media remains spatially continuous.

## 9. Project overlap model

With `start: top bottom` and `end: bottom top`, adjacent project triggers overlap by exactly one viewport:

- desktop overlap: 900 px;
- mobile overlap: 844 px.

During that range, H03 media is still physically exiting while H04 media is physically entering. Both project DOM trees remain present, and no swap, crossfade-only handoff, threshold state, or scroll snap exists.

The H04/H05 boundary also overlaps: H04 continues its final spatial exit while H05 begins its existing natural-flow motion entrance.

## 10. Background token before / after

Normalized blank-region sampling across several Reference Home frames returned a stable median near RGB 19/20/22. The previous Local render sampled near RGB 16/17/19.

```text
before token: #0e1012
after token:  #111315
corrected Local rendered median: approximately RGB 18/19/21
Reference rendered median: approximately RGB 19/20/22
```

Matching dark transition and nav surfaces were updated from 14/16/18 to 17/19/21. The resulting charcoal/blue-black remains non-black and is materially closer to the normalized Reference. Light mode remains `#e8e5f0`, and Hero overlay copy remains `rgb(243, 246, 250)`.

## 11. Forward-scroll test

Pass at 1440 x 900 and 390 x 844.

- Desktop H03 was sampled at approximately 149–200 px steps from scrollY 1600 through 3188. Every step changed both active side-media coordinates.
- H03 50%, 75%, overlap, H04 entry, H04 50%, H04 75%, and H04 exit/H05 entry were captured from the checked export.
- Mobile entry/25%/50%/overlap/H04 entry/50%/75%/exit frames show uninterrupted positional travel and zero horizontal overflow.
- No sampled interval reproduced the old constant-transform plateau.

Forward evidence:

- `outputs/step3c-r2-validation/final/desktop/forward-*.jpg`
- `outputs/step3c-r2-validation/final/mobile/`
- `outputs/step3c-r2-validation/comparisons/desktop-project-motion-contact-sheet.jpg`

## 12. Reverse-scroll test

Pass.

The required sequence HARBOUR → QUIET → HARBOUR → QUIET was exercised slowly.

- Desktop reverse checkpoints at H04 75%, H04 50%, H04 entry, overlap, H03 75%, H03 50%, and H03 25% reconstructed the corresponding forward positions within the expected scrub settling tolerance.
- Mobile reverse samples at 189–191 px steps changed active-media coordinates at every step from H04 exit through H03 center.
- No image teleported, title swapped, trigger desynchronized, or media disappeared before leaving the viewport.

Reverse evidence: `outputs/step3c-r2-validation/final/desktop/reverse-*.jpg`.

## 13. Runtime regression result

Pass.

- Global runtime providers were not modified: ownership remains one Lenis instance, one GSAP ticker driver, and one route scope.
- Repeated Home/Stills/Home, Home/Motion/Home, Home/About/Home, and Home/Stills-case/Home cycles retained one route-content root, one transition overlay, ten body children, and zero horizontal growth.
- Back restored Home to scrollY 1497 after leaving at 1496; Forward returned to About at scrollY 0.
- Dark/light F-stop behavior and cross-route persistence pass. Desktop/mobile labels remain F/24 and F/23.
- Mobile menu remains x 24, y 64, 342 x 326 with the audited link order, Escape close, scroll release, and focus restoration.
- Reduced motion shows all Hero/project content at opacity 1 with no transforms and completed the tested route change within the 250 ms observation window.
- Production console review returned zero warnings, errors, or hydration messages.
- No temporary motion diagnostic was committed.

## 14. Static export result

Pass.

- `npm run check`: pass.
- Strict TypeScript: pass.
- Content/media validation: 2 placeholder projects and 12 media assets.
- Optimized Next.js build: pass.
- Static/SSG generation: 11 pages.
- HTTP 200 from `out/`: `/`, `/about/`, `/stills/`, `/stills/project-01/`, `/motion/`, `/motion/project-01/`, `/robots.txt`, and `/sitemap.xml`.

## 15. Remaining P2 / P3 motion differences

- Remaining P1: none.
- Remaining actionable P2 motion issue: none.
- Accepted P2 font constraint: legal substitute fonts do not exactly match Roslindale/Mint metrics.
- Accepted P2 media constraint: temporary original mock photography matches role, geometry, and crop weight rather than protected Reference subjects.
- P3: exact edge silhouettes differ with the owned subjects/crops.
- P3: `scrub: 0.45` can visually trail an unusually fast wheel impulse for a fraction of a second; slow continuous and reverse review remains synchronized and spatially continuous.
- H05 choreography itself was not redesigned because no H05 dead-scroll regression was found; its natural-flow entrance remains the validated R1 structure.

`design-qa.md` records `final result: passed`.

## 16. Repository safety and commit

Safety review passed.

- No `.env` file, Cloudflare/R2 credential, private key, secret value, copied commercial font, RAW/private media master, or new Reference production asset was staged.
- The only new binaries are local browser validation captures and Reference/Local comparison evidence.
- No `.next`, `out`, local cache, or temporary diagnostic artifact was committed.
- `next-env.d.ts` contains the Next 16 build-managed production route-type references and is intentionally tracked per the repository's Next.js agent guidance.
- `git diff --check` passed.

Completed correction implementation and evidence commit:

`8840b83cc5fa587270132425e46b8e9dd214d9d5`

Subject: `fix: correct home motion fidelity`

This summary is committed immediately afterward so it can record the stable implementation hash without a self-referential hash.

## Stop point

STEP 3C-R2 is complete and ready for human 60 fps visual review. STEP 3D was not started.
