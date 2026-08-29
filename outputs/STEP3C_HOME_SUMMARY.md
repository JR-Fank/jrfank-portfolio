# STEP 3C HOME Summary

## 1. Home section architecture

| Section | Height at 1440 × 900 | Function | Motion contract |
| --- | ---: | --- | --- |
| H01 | 900px / 100svh | Full-viewport Hero card, bilingual identity | entrance timeline plus scrubbed scale/departure |
| H02 | 738px / 82svh | Centered inline-media editorial introduction | one non-scrub reveal trigger |
| H03 | 1845px / 205svh | First selected-stills sticky paired-image stage | one scrubbed paired-media trigger |
| H04 | 1845px / 205svh | Second selected-stills sticky paired-image stage | one scrubbed paired-media trigger |
| H05 | 900px / 100svh | Poster-led Motion preview with satellite images | one scrubbed composition trigger |
| H06 | 433px | Existing contact footer and social controls | no Home trigger |

The desktop total is 6661px. At 390 × 844 the independent mobile composition uses 100svh, 105svh, 134svh, 134svh, 68svh, and the existing 500px footer for a 5066px total.

## 2. Components created or modified

- Created `src/content/home.ts` for all Home identity, bilingual copy, project metadata, routes, palettes, and media IDs.
- Created `src/components/home/home-experience.tsx` for H01–H05 and reuse of the locked footer.
- Created `src/animations/home/home.ts` for route-scoped Home motion.
- Created `src/styles/home.css` for measured desktop/mobile composition.
- Replaced only the root Home placeholder in `src/app/page.tsx`; Stills, Motion, About, and case-study pages remain placeholders.
- Added Phosphor's legal React icon package for the motion play icon.
- Updated project-owned placeholder identity and site metadata to JRFANK.
- Made one surgical global lifecycle correction in `RouteAnimationScope.mount()`: a remounted scope is reusable under React development remount. No global timings, easing, Lenis integration, menu behavior, route-transition behavior, or theme behavior changed.

## 3. Animations implemented

- Hero card scale/opacity entrance and staggered masked line reveal.
- Scrubbed Hero departure with scale, vertical shift, and copy exit.
- Inline intro text/media reveal using transform and opacity.
- Two long sticky paired-image previews with opposing entry, meet, hold, and exit phases.
- Motion poster scale/vertical arrival plus three satellite reveals.
- Reduced motion clears animated transforms and shows all content without Home ScrollTriggers.

No canvas, WebGL, autoplay film, shader, independent requestAnimationFrame loop, or global animation timeline was added.

## 4. ScrollTrigger count

- Standard-motion Home: exactly 5.
- Standard-motion non-Home route: exactly 0.
- Returning Home after Stills, Motion, About, and placeholder case-study routes: exactly 5 every time.
- Reduced-motion Home: exactly 0.
- No count growth was observed across repeated navigation.

## 5. Responsive behavior

- Primary comparisons completed at 1440 × 900 and 390 × 844.
- Secondary checks completed at 1920 × 1080, 1280 × 800, and 393 × 852.
- Measured horizontal overflow was zero at all secondary sizes (`scrollWidth === viewport width`).
- Mobile uses its own Hero type scale, section heights, sticky media size/offsets, motion composition, menu, and F-stop label rather than a reduced desktop layout.

## 6. Theme behavior

- Dark and light F-stop states passed.
- Light tokens resolve to canvas `#e8e5f0` and ink `#1a4572`.
- Hero image-overlay text remains stable `rgb(243, 246, 250)` in light mode.
- Theme switching retains one route scope and five standard-motion Home triggers.
- Existing menu and footer theme transitions remain unchanged.

## 7. Visual QA results

- Compared desktop at every 10% checkpoint from 0% through 100%.
- Compared the same complete sequence at 390 × 844.
- Verified Hero, intro, both selected-stills phases, Motion preview, and footer arrival together with the normalized Reference contact sheets.
- All P0 and P1 findings are resolved. `design-qa.md` records `final result: passed`.

Representative captures are stored in `outputs/screenshots/`.

## 8. Remaining P1/P2/P3 differences

- Unresolved P1: none.
- P2: Cormorant Garamond remains lighter and metrically different from Roslindale.
- P2: authorized abstract mock media cannot reproduce subject-dependent photographic crop weight.
- P3: project-owned titles, biography, email, and identity have different line lengths from the protected Reference content.

## 9. Runtime regression results

- Home → Stills → Home: passed, trigger sequence 5 → 0 → 5.
- Home → Motion → Home: passed, trigger sequence 5 → 0 → 5.
- Home → About → Home: passed, trigger sequence 5 → 0 → 5.
- Home → placeholder Case Study → Home: passed, trigger sequence 5 → 0 → 5.
- One Lenis instance, one GSAP ticker driver, and one active route scope remained constant in standard motion.
- Reduced motion correctly disabled Lenis/ticker drivers and all Home ScrollTriggers while retaining visible content.
- Browser Back restored Home to `scrollY: 1760` with five triggers; Forward restored About with zero Home triggers.
- Mobile menu expanded/collapsed correctly; desktop/mobile F-stop labels remained correct.
- Browser runtime log review found zero warnings, errors, or hydration messages.

## 10. Static export result

`npm run check` passed: content validation, TypeScript, optimized build, and 11 static/SSG pages all completed successfully. A local static server returned HTTP 200 for Home, About, Stills, Stills case study, Motion, Motion case study, robots, and sitemap routes from `out/`.

## 11. Performance concerns

- Hero is the only eager Home image and retains the existing critical preload marker.
- Remaining Home images are lazy-loaded through the existing resolver and responsive source sets.
- No full film is loaded on Home.
- Scroll-time motion is transform/opacity based; no uncontrolled layout-measurement loop was introduced.
- Reusing the intentionally small seven-asset mock manifest repeats a few images; final media should broaden the set without making every asset eager.

## 12. Font-related fidelity limitations

The locked legal substitutes remain Cormorant Garamond, IBM Plex Sans, and Noto Sans TC through replaceable `--font-display`, `--font-sans`, and `--font-tc` tokens. Roslindale and Mint Grotesk were not copied. Exact cap widths, serif contrast, and some line breaks remain license-dependent.

## 13. Media-related fidelity limitations

Only authorized local mock media is used. No Giulia Gartner photography, video, copy, or proprietary source asset was added. The existing media resolver preserves manifest dimensions, aspect ratios, responsive sources, dominant colors, focal points, loading priority, and stable DOM. R2 remains disconnected.

## 14. Final git commit

The dedicated commit is `feat: implement high-fidelity home experience` (the commit containing this report; its exact hash is reported in the completion handoff).

## 15. Blockers before Stills implementation

There is no technical Home blocker. Before production content work, the project still needs final owned identity/copy, licensed originals if the commercial font metrics are required, authorized final photography/video, and the later R2 manifest. STEP 3C stops here and does not start Stills.
