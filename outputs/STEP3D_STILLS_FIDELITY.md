# STEP 3D Stills fidelity review

**STEP 3D CANDIDATE — AWAITING HUMAN APPROVAL**

Branch: `step3d-stills`. This review continues checkpoint `160fc1ff41392527db36aa68adb932f3e324326b`; implementation and QA fixes are checkpointed at `0531f54`. The candidate HEAD is the commit containing the completed reports, resolved from `git rev-parse step3d-stills`; human approval is not implied.

## Method and evidence

Functional checks ran in installed Chrome against the development server. The continuous desktop and mobile recordings ran against the production static export. Reference review used the repository's existing desktop/mobile Stills and Visit Greenland captures, `REFERENCE_AUDIT.md`, and `INTERACTIONS.md`; no Reference production content was imported.

Visual judgments below are based on inspected Local/Reference images and sampled recording frames, not inferred from test success. Human review of the continuous motion recordings remains required. Different project counts and owned mock subjects prevent a meaningful page-wide pixel score or identical normalized scroll positions.

## Findings

| Reference behavior | Local behavior | Severity | Fix/status |
| --- | --- | --- | --- |
| Buildable static portfolio | Initial current-checkpoint typecheck failed: the validator accessed `block.id` after TypeScript narrowed the invalid branch to `never`. | P0 | Resolved by capturing the sequence ID before narrowing. No runtime validation rule was removed. |
| Long Stills stages, centered title, paired photographs rising and travelling outward | Four content-driven stages retain the opposing image composition, continuous scrub and reverse reconstruction. All 13 requested viewport sizes were sampled. | No P1 found in sampled stage behavior | Retained existing implementation and prior vertical-timing fixes. |
| Spacious title/metadata/CTA/palette composition; broad palette strip | Local metadata and controls are more compact; palette is narrower and segmented, with width/hex hover rather than the Reference overlay treatment. | P2 | Open for human fidelity judgment; no invented replacement effect added. |
| Roslindale/Mint typography and project-specific case/title wrapping | Legal Cormorant/IBM Plex/Noto substitutes and bilingual owned titles have different stroke weight, metrics, case and wrapping. | P2 | Retained approved substitute system. Final licensed-font and copy decisions remain open. |
| Low-contrast grain in the dark canvas | The existing Stills stylesheet suppresses the body grain on Stills routes. | P2 | Existing branch difference recorded, not silently treated as an exact match. |
| Large title above a rounded layered hero | Local hero preserves title/media hierarchy and rising layers; desktop hero begins about 42 px higher in the inspected first viewport. The two layers reuse one mock image rather than a separately authored transparent foreground. | P2 | Structure usable; asset-dependent separation and spacing remain for review. |
| Asymmetric galleries and project-specific overlaps/density | All four cases render their authored block order, pairs/triptych/offsets and five-item active galleries. Desktop uses five repeating width/alignment presets; mobile stacks with 16 px gaps. Some sequences breathe more than the Reference. | P2 | No missing/duplicated rendered blocks found. Final archive and project-specific rhythm still require approval. Repeated media across an editorial block and its authored gallery is content reuse, not duplicate rendering. |
| Sticky right miniature rail, active border, untinted active image and 32 px depth | Local desktop rail is 74 px; mobile rail 48 px. One current thumbnail tracks sampled forward/reverse movement; hover/focus presentation remains distinct from current state. | No P1 found in completed rail checks | Direct hashes, nonlinear activation, history and keyboard focus verified. |
| Gallery navigation around 0.5 seconds; stable deep links | Shared Lenis target scrolling, numeric fragments and `#last` reach their targets; Back/Back/Forward restores selected hashes and scroll positions. | No P1 found in completed navigation checks | Prior readiness bounds and history handling retained. Cold-network frame-by-frame proof of zero pre-readiness flash was not collected. |
| Explore More: 3/2/1 cards, looping free drag and snap | Splide implements the documented configuration; original navigation and mobile touch swipe were observed in production recordings. A 25-sample resize sweep preserved 3/2/1 cards and desktop drag moved the track. A focused fresh-export check confirmed a cloned anchor invokes the shared overlay and reaches the next case after its delegated handler was moved ahead of Splide's click cancellation. | No P1 found in completed carousel checks | Whole runtime harness navigation timeout is recorded separately; it is not a passing run. |
| Home/About validated motion and global lifecycle | Application components/animation/CSS for Home/About were not changed in this finishing pass. Three route cycles retain Home 5, Stills 4, Case 1, About 2 triggers and 1/1/1 Lenis/ticker/scope. | No new P1 found | Prior baseline remains protected. This is a scoped regression check, not a re-certification of every R4 timing measurement. |
| Reduced-motion content and usable navigation | Fresh reduced-motion case load keeps content/rail usable, keyboard focus lands on the selected figure, and diagnostics read 0 Lenis / 0 ticker / 1 scope / 0 triggers. | Pass for tested preference-at-load path | Live OS preference switching without reload is not fully certified; the existing shared provider initializes Lenis at mount. |

## Remaining severity register

- **P0:** none open after the build fix.
- **P1 (production content, retained baseline):** Home Hero footage remains temporary; user-supplied final footage is required before production release. No new technically actionable Stills P1 was identified in the completed evidence.
- **P2:** substitute-font metrics/licensing, unapproved bilingual/identity copy and final archive; compact index spacing/palette treatment; suppressed Stills grain; mock hero layering; case crop/spacing rhythm; live preference-switch behavior and cold-network first-frame behavior are not fully certified.
- **P3:** asset-dependent micro-spacing/crop polish, mock subjects/silhouettes differ from protected Reference photography, and recordings are 25 fps rather than the Reference's higher cadence. Final micro-easing needs live human review.

## Human review material

- `outputs/STEP3D_DESKTOP_1440x900.mp4`: continuous production Chrome capture, 1440×900, 100% zoom, 185 seconds, 25 fps, H.264 MP4.
- `outputs/STEP3D_MOBILE_390x844.mp4`: production Chrome mobile emulation, 390×844, 86.68 seconds, 25 fps, H.264 MP4; includes touch swipe.
- Local detailed screenshots and original CLI logs: `output/playwright/` (locally excluded from Git).
- Durable numeric evidence: `outputs/step3d-validation/results.json`.

Recordings remain local and are not committed. They demonstrate an implementation candidate, not human approval or production deployment. No merge to `main` and no STEP 3E work is authorized by this report.
