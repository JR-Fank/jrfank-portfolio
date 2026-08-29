# STEP 3C HOME Design QA

## Comparison set

- Source: `docs/reference/normalized/home/desktop/` and `docs/reference/normalized/home/mobile/`
- Source contact sheets: `work/step3c-inspection/reference-home-desktop-contact.jpg`, `work/step3c-inspection/reference-home-mobile-contact.jpg`
- Implementation: `http://localhost:3000/`
- Implementation captures: `work/step3c-qa/desktop/`, `work/step3c-qa/mobile/`
- Paired comparisons: `work/step3c-qa/desktop-source-vs-local.jpg`, `work/step3c-qa/mobile-source-vs-local.jpg`

## Viewports, density, and states

- Primary desktop: 1440 × 900, device scale 1, dark theme, 0–100% in 10% increments.
- Primary mobile: 390 × 844, device scale 1, dark theme, 0–100% in 10% increments.
- Secondary responsive checks: 1920 × 1080, 1280 × 800, and 393 × 852.
- Theme state: dark and light F-stop states checked on the Hero; image-overlay copy remains fixed high-contrast white.
- Motion state: standard motion and emulated `prefers-reduced-motion: reduce`.
- Navigation state: desktop navigation, mobile menu closed/open, internal route transitions, browser Back/Forward.

## Comparison history

| ID | Priority | Finding | Resolution | Result |
| --- | --- | --- | --- | --- |
| DQA-01 | P1 | Initial Home animation setup registered zero triggers after React development remount. | Reset the existing route scope's disposed flag on mount; no timing or driver changes. | passed |
| DQA-02 | P1 | The first intro draft used a split desktop grid and did not match the Reference's centered editorial block. | Recentered the headline, bilingual support copy, and CTA; retained content-driven strings. | passed |
| DQA-03 | P1 | Paired project media arrived one checkpoint after the Reference and did not remain visually stable through the long stage. | Added a sticky, viewport-height stage inside each measured section and recalibrated the existing scrub timeline. | passed |
| DQA-04 | P1 | Light-theme media-overlay contrast could inherit theme ink. | Hero overlay copy is explicitly held at `#f3f6fa` in both themes. | passed |
| DQA-05 | P2 | Initial CDP captures reflected the host display's 2× backing density, producing misleading half-scale comparisons. | Captured at 2× and normalized to the requested CSS viewport dimensions before comparison. | passed |
| DQA-06 | P2 | Local display metrics and authorized mock media cannot exactly reproduce Roslindale widths or the photographic visual weight of the Reference. | Kept the locked legal font tokens and media resolver; recorded the residual limitation instead of distorting geometry. | accepted |

## Final findings

- The six-stage desktop and independently composed mobile sequence match the Reference's observed order, negative-space rhythm, sticky paired-image phases, motion handoff, and footer arrival.
- All P0 and P1 findings are resolved.
- Remaining differences are limited to legal substitute-font metrics, project-owned copy widths, and authorized mock-media subject matter.
- No horizontal overflow was measured at any required viewport.

final result: passed
