# STEP 3 — Foundation + Global Experience handoff

Completed and validated on 2026-08-28. Scope is limited to STEP 3A and STEP 3B. Full Home, Stills, Motion, About, and case-study choreography remains intentionally unimplemented.

## Resume audit

- The workspace is not a Git worktree. `git status`, `git diff`, and parent-directory repository checks all report that no `.git` repository exists, so a baseline diff cannot be reconstructed.
- Files from the interrupted run were present and usable: the complete Next.js application, content/media schemas, runtime providers, mock media, `out/`, and the first six viewport captures had been written successfully.
- The suspected light-theme Hero contrast issue was not a written-code defect. The media-overlay copy was already explicitly `#f3f6fa`; a controlled production render measured full opacity, `rgb(243, 246, 250)`, route phase `idle`, and preload state `ready`. The premature capture was replaced.
- One actual Reference mismatch found during resumed comparison was fixed: the 700 ms menu now opens with ease-out-quart and closes with ease-in-quart.

## 1. Files created or modified for STEP 3

Foundation/configuration:

- `package.json`, `package-lock.json`
- `next.config.ts`, `tsconfig.json`, `next-env.d.ts`
- `.env.example`, `.env.local`, `.gitignore`
- `public/_headers`
- `AGENTS.md` and `CLAUDE.md` contain the Next.js-generated agent guidance added by `next dev`.

Application:

- `src/app/` — static App Router routes, layout, metadata routes, icon, and 404 shell
- `src/content/` — bilingual site/project placeholders and authoritative types
- `src/generated/media-manifest.json`
- `src/lib/media.ts`, `src/lib/metadata.ts`
- `src/animations/core/` — GSAP registration, route scopes, and development diagnostics
- `src/components/runtime/` — preload, theme, smooth-scroll, transition, and route-animation providers
- `src/components/chrome/` — navigation, F-stop control, menu, and footer
- `src/components/media/media-picture.tsx`
- `src/components/primitives/transition-link.tsx`
- `src/components/sections/placeholder-page.tsx`
- `src/styles/` — tokens, typography, and global responsive styling
- `scripts/validate-content.ts`, `scripts/media/README.md`
- `public/mock-media/` — local AVIF/WebP/JPEG development derivatives only

Generated deliverables:

- `out/` — static export
- `outputs/step3-validation/` — production viewport captures
- `outputs/STEP3_FOUNDATION_SUMMARY.md`

## 2. Framework and runtime configuration

- Next.js 16.3.3 App Router, React 19.2.8, strict TypeScript 5.9.
- `output: "export"`, `trailingSlash: true`, and no API routes, Server Actions, SSR dependency, middleware, Functions, Workers, database, or authentication.
- Static paths exist for `/`, `/stills/`, `/stills/project-01/`, `/motion/`, `/motion/project-01/`, and `/about/`.
- Dynamic placeholders use `generateStaticParams` with `dynamicParams = false`.
- `NEXT_PUBLIC_SITE_INDEXABLE=false` produces `Disallow: /` and an empty sitemap while leaving every URL directly accessible.

## 3. Font placeholders

- Display: `Bodoni 72 Smallcaps`, `Bodoni 72`, Didot, Times New Roman, serif.
- UI/body: Helvetica Neue, Helvetica, Arial, sans-serif.
- Traditional Chinese: PingFang TC, Noto Sans TC, Microsoft JhengHei, sans-serif.
- No Roslindale or Mint Grotesk files were downloaded or copied. Tokens allow a licensed replacement without component restructuring.

## 4. Lenis and GSAP lifecycle

- One app-wide Lenis instance, driven by one GSAP ticker callback; Lenis does not run its own RAF.
- Reference configuration is implemented: 1.5 s duration, exponential easing, vertical smooth wheel, `syncTouch: false`, and touch multiplier 1.5.
- Lenis scroll events update ScrollTrigger; media/font readiness and debounced resize refresh layout.
- ScrollTrigger is the only registered GSAP plugin. Flip is not registered.
- Each route owns a cleanup-safe `RouteAnimationScope` for GSAP context, ScrollTriggers, observers, listeners, timers, and RAF handles.
- Development diagnostics expose counts through `window.__PORTFOLIO_DEBUG__`; they are omitted from production.
- Reduced motion disables Lenis/ticker interpolation and shortens the route transition. Measured reduced-motion route entry was 212 ms end-to-end.

## 5. F-stop theme behavior

- Dark tokens: canvas `#0e1012`, ink `#f3f6fa`.
- Light tokens: canvas `#e8e5f0`, ink `#1a4572`.
- Desktop label is F/24; collapsed/mobile label is F/23; light label is F/1.4.
- Theme colors transition for 500 ms; the temporary `transition` class remains through the transition and is removed at 750 ms.
- `localStorage['light-mode']='true'` persists light mode across routes and reload; returning to dark removes the key.
- Hero/media-overlay copy stays white in both themes for contrast.
- The aperture mark is static. No unverified or original aperture simulation was introduced.

## 6. Navigation and menu

- Fixed 64 px navigation with the audited desktop hierarchy and collapsed layout at 991 px.
- Mobile menu geometry at 390 px measured x 24, y 64, width 342, height 326.
- Menu uses a theme-aware panel, 12 px backdrop blur, 700 ms ease-out-quart open, and 700 ms ease-in-quart close.
- Link order is Stills, Motion, About, Instagram, Email.
- Opening focuses Stills, makes route content inert, traps Tab/Shift+Tab, stops Lenis, and preserves scroll position.
- Escape closes the menu, restores focus to the trigger, removes inert state, and releases scrolling.

## 7. Route transition and scroll behavior

Programmatic navigation follows this lifecycle:

```text
link click → Lenis lock + preload transitioning + overlay fade
           → 1000 ms delayed router push
           → dispose old route scope
           → preload/resize new route
           → scroll new route to top
           → overlay fade out → unlock → idle
```

- Dark overlay is `#0e1012`; light overlay is white.
- No FLIP, shared-element morph, or WebGL transition is present.
- A 6 s watchdog prevents transition deadlocks.
- Browser Back/Forward does not force a top reset. A measured Back restored y=520; Forward returned to y=0.

## 8. Preloader and media resolver

- Explicit preload states: `idle`, `loading`, `ready`, `transitioning`.
- Readiness waits for fonts and critical first-viewport images, with decode and a 3.5 s safety timeout. There is no invented visual loader.
- Zod validates the checked-in media manifest and stable asset IDs.
- Asset URLs use the manifest plus `NEXT_PUBLIC_MEDIA_BASE_URL`; components contain no R2 hostname.
- The custom static `<picture>` emits AVIF and WebP `srcset` plus JPEG fallback, intrinsic dimensions, loading intent, focal-point CSS, and predictable DOM.
- Browser validation selected AVIF and reported the manifest dimensions. Motion index markup contains zero `<video>` and zero `<iframe>` elements.
- Motion poster, preview, and playback responsibilities are separated in types; case-study playback is deferred.

## 9. Responsive global behavior

The exact breakpoint checks passed:

| Width | Gutter | Navigation mode |
|---:|---:|---|
| 992 px | 64 px | desktop inline |
| 991 px | 48 px | collapsed menu |
| 768 px | 48 px | collapsed menu |
| 767 px | 32 px | mobile composition |
| 480 px | 32 px | mobile composition |
| 479 px | 24 px | compact mobile |
| 390 px | 24 px | compact mobile, F/23 |

Footer height measures 433 px desktop and 500 px at 390 px. Its helper transitions `GET IN TOUCH` → `CLICK TO COPY` → `COPIED ✨` → reset as expected.

## 10. Static export result

`npm run check` passes:

- strict TypeScript: pass
- content/media validation: 2 placeholder projects and 6 media assets
- optimized build: pass
- 11 static pages generated
- `out/`: generated

Direct HTTP checks returned 200 for every placeholder route, `robots.txt`, and `sitemap.xml`. Static HTML exists at each trailing-slash route. No Functions, Workers, or middleware artifacts exist in `out/`.

## 11. Runtime validation result

The required routes were exercised repeatedly in production and development:

- Home → Stills → placeholder project → Stills
- Home → Motion → placeholder project
- Home → About
- return-to-Home and second-pass repetitions
- browser Back and Forward restoration

Stable development diagnostics after every route:

| Diagnostic | Result |
|---|---:|
| Lenis instances | 1 |
| GSAP ticker drivers | 1 |
| Active route scopes | 1 |
| Route overlays | 1 |
| ScrollTriggers | 0 |
| Preload state | ready |
| Transition phase | idle |

Production and development consoles both reported 0 errors and 0 warnings, including no hydration warnings. No transition deadlocks, scroll-lock leaks, scope growth, RAF duplication, or state loss were observed.

## 12. Visual comparison and remaining differences

Global matches:

- 64 px fixed navigation and 64/48/32/24 px gutter system
- dark/light palette and theme-aware chrome
- desktop/mobile F-stop labels and placement
- 390 px menu panel geometry, hierarchy, blur, rounding, and theme behavior
- simple theme-colored route overlay
- 433 px desktop footer shell and stacked mobile footer

Intentional or unresolved differences:

- The identity, wordmark, email, social metadata, bilingual copy, and all imagery are neutral placeholders, not Reference assets or brand content.
- The fallback display face is visibly wider and less condensed than licensed Roslindale; UI metrics also differ from Mint Grotesk. Font selection remains provisional.
- The Home hero is a static mock `<picture>`, not the Reference autoplay reel. Full hero entrance, title fragment choreography, and every later Home section are STEP 3C work.
- The current static aperture glyph does not reproduce the Reference site's licensed/embedded one-second Lottie ring. An authorized asset or a separately approved clean-room treatment is needed; no animation was invented in this phase.
- Placeholder route shells intentionally do not match the full Stills, Motion, About, or case-study page compositions.
- Mock raster derivatives are for local validation only and do not represent the final R2 crop/color pipeline.

## 13. Technical debt introduced

- Browser validation was executed through Playwright CLI but is not yet committed as a reusable automated test suite.
- Production content and media-manifest generation are manual placeholders; real content validation and R2 publication tooling remain future work.
- The local system-font fallbacks will vary slightly by operating system until licensed/final legal fonts are selected.
- Development diagnostics intentionally cover counts, not a full performance/RAF profiler.
- The workspace has no Git repository, so change history, status, and review diffs are unavailable until version control is initialized by the owner.

## 14. Blockers before STEP 3C Home

No runtime or static-export blocker remains. Before high-fidelity Home implementation, decisions/assets are still needed for:

1. final legally licensed display, UI, and Traditional Chinese font files or approved substitutes;
2. production identity, contact/social values, and bilingual copy;
3. authorized Home reel and image derivatives plus final media-domain/R2 manifest values;
4. an authorized aperture-ring asset or explicit approval to retain the static mark;
5. confirmation that the existing neutral mock content should remain while STEP 3C choreography is built.

## Validation captures

- `step3-validation/desktop-dark-1440x900.png`
- `step3-validation/desktop-light-1440x900.png`
- `step3-validation/desktop-route-overlay-1440x900.png`
- `step3-validation/desktop-footer-1440x900.png`
- `step3-validation/mobile-dark-390x844.png`
- `step3-validation/mobile-light-390x844.png`
- `step3-validation/mobile-menu-390x844.png`
- `step3-validation/mobile-menu-light-390x844.png`
- `step3-validation/mobile-route-overlay-390x844.png`
- `step3-validation/mobile-footer-390x844.png`

STEP 3A and STEP 3B are complete. Stop here pending review; do not begin STEP 3C Home automatically.
