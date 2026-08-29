# STEP 3C HOME Fidelity Log

## Validation basis

The normalized STEP 1 Home screenshots remained authoritative. Local captures were produced at 1440 × 900 for 0%, 10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90%, and 100%, plus the same sequence at 390 × 844. Source and local contact sheets were compared together after normalizing capture density.

## Issue log

| ID | Reference behavior | Initial local behavior | Severity | Cause | Fix | Status |
| --- | --- | --- | --- | --- | --- | --- |
| H-001 | Home owns its route motion and creates it after route entry. | Development remount left the reused route scope disposed, so Home created zero ScrollTriggers. | P0 | The validated scope did not reset its internal disposed flag when React remounted it. | Reset the flag in `mount()`; repeated route cycles now hold at five Home triggers and zero elsewhere. | resolved |
| H-002 | Intro is a centered editorial statement with inline images and compact supporting copy. | First pass split the headline and copy into two desktop columns. | P1 | Layout interpretation was too literal rather than checkpoint-led. | Rebuilt H02 as a centered composition while retaining bilingual project-owned content. | resolved |
| H-003 | Paired images remain composed around the center title for a long scroll phase. | Images moved through normal document space and were late at the 30% and 60% checkpoints. | P1 | Media lacked a viewport-stable inner stage. | Added one CSS-sticky stage per project section and recalibrated the existing scrub motion. | resolved |
| H-004 | Hero image-overlay text stays legible in both F-stop themes. | Theme inheritance risked blue light-theme ink over the dark image. | P1 | Overlay text did not have an explicit image-safe color. | Locked Hero overlay copy to `#f3f6fa`; measured light theme still reports that value. | resolved |
| H-005 | Mobile is independently recomposed rather than scaled down. | Early paired media placement showed too little of each image at mobile checkpoints. | P1 | Desktop document-flow positioning was carrying into mobile. | Used a mobile-specific 60svh media height, 18svh top position, 80vw width, and edge offsets. | resolved |
| H-006 | Reference display face has Roslindale metrics and weight distribution. | Cormorant Garamond is slightly lighter and differs in cap width and serif shape. | P2 | Commercial Reference font is not licensed for this project. | Kept the STEP 3B.5 legal substitute and replaceable `--font-display` token; avoided geometric distortion. | accepted |
| H-007 | Reference photography supplies high-detail natural color and subject weight. | Authorized local mock media is more abstract and cannot reproduce subject-dependent crop balance. | P2 | Reference production assets cannot be copied and final project media is not supplied. | Used the existing resolver, known dimensions, focal points, realistic aspect ratios, and varied authorized assets. | accepted |
| H-008 | Reference biography and project names establish exact line lengths. | Project-owned bilingual placeholders produce different text widths. | P3 | Copying the Reference identity and biography is prohibited. | Kept concise replaceable content in `src/content/home.ts` and matched hierarchy rather than protected wording. | accepted |
| H-009 | Reference footer email has a longer visual measure. | `HELLO@EXAMPLE.COM` produces a narrower dashed contact control. | P3 | Final contact identity is not supplied. | Preserved the audited footer structure and made the address content-driven. | accepted |

## Final checkpoint assessment

- P0 unresolved: 0
- P1 unresolved: 0
- P2 unresolved: 2 accepted fidelity limitations
- P3 unresolved: 2 accepted content limitations
- Desktop section sequence and total height: 6661px at 1440 × 900, within 2px of the audited 6663px Reference.
- Mobile section sequence and total height: 5066px at 390 × 844, within the audited mobile capture range.
- Expected Home ScrollTriggers: 5 standard motion, 0 reduced motion.
