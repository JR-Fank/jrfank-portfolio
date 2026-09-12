# STEP 3E-A Motion Index fidelity approval

**STEP 3E-A — MOTION INDEX: HUMAN APPROVED**

## Review basis

This review compares the local Motion Index with the audited Reference architecture and captured desktop/mobile sequences. It does not compare project photography subject matter: all local images are authorized development media, while Reference production media must not be copied. Functional browser passes are evidence of behavior, not proof of visual identity or human approval.

**STEP 3E-A-R1 — pacing correction:** human review accepted the structure, requested additional project-stage breathing room, and approved the corrected desktop/mobile recordings. R1 changes vertical duration only; the intro, media dimensions, satellite placement, title preset system, play/CTA treatment, mobile bleed, content/schema and global runtime architecture remain unchanged.

The relevant Reference architecture is a centered editorial introduction followed by five observed project stages (M02–M06). Each stage combines one dominant roughly 16:9 poster, three smaller offset parallax frames, date/location metadata, a large title, play treatment and a direct case-study CTA. Metadata/title/composition trade vertical position between stages. Mobile is a separate composition with a roughly 109 vw main image, persistent satellite frames and direct touch CTA. The index remains poster-based and does not autoplay video.

## Explicit comparison

| Category | Reference evidence | Local STEP 3E-A | Priority/status |
| --- | --- | --- | --- |
| Intro scale and spacing | Centered editorial title and longer centered statement. At 390×844 the audited intro is about 721 px high and its title about 89.7 px. | Desktop uses a 100 svh centered intro; compact uses 86 svh (about 726 px at 390×844). The title resolves to about 82 px before substitute-font metric differences, with bilingual copy below. Structure and vertical duration are close; exact type silhouette is not. | **P2 open:** licensed/final font metrics and optical spacing require owner review. |
| Main poster geometry | One dominant 16:9-ish image. The first 390 px stage measured roughly 426×339 px and bled beyond both edges. | Desktop is 65 vw capped at 937 px with 16:9 ratio. At ≤767 px it is 109 vw (about 425 px at 390) with deliberate edge bleed, 28 px radius and clipped document overflow. Main poster stayed visible in all 70 midpoint samples. | **Matched structurally. P2 open:** final poster crop/focal point and subject weight depend on final media. |
| Satellite positions | Three smaller frames remain present around the main poster and move at independent rates/axes; touch does not hide them. | Exactly three authored satellites use independent x/y/rotation vectors and responsive offsets. All three were visible in 70/70 midpoint samples and 55/55 live-resize samples. Compact CTA overlap was corrected to 0 px² at 479/430/390/360 widths. | **Matched structurally. P2 open:** final-image luminance may require asset-specific offset tuning. |
| Title placement | Metadata/title trade vertical position with the composition so consecutive stages alternate rhythm. | Finite `title-above`, `title-below` and `title-split` presets alternate across five projects. Titles/metadata were contained at all midpoints. The compact next-title collision was corrected to 0 px visible intersection at all four targeted widths. | **Matched structurally. P2 open:** substitute-font width and optical baseline differ from the licensed Reference type. |
| Scroll trajectory | Transform-first continuous parallax; central media dominates while satellites move independently. Motion is long, ease-out/settled and never springy. | One scrubbed GSAP timeline per stage moves main y/scale and three satellite x/y/rotation vectors. R1 preserves the approved travel geometry by measuring it from the unchanged inner frame while the outer stage provides the longer active range. All 30 focused sequences moved continuously and reversed correctly. `invalidateOnRefresh` recalculates current geometry. | **Functional match. P3 open:** continuous micro-easing/settling remains a human-eye judgment. |
| Mobile bleed | First-stage main image extends beyond both viewport edges; satellites stay visible and CTA stays direct. | Main poster is 109 vw with negative/edge satellite offsets. The page clips composition overflow without document overflow. All five compact stages retained main poster, three satellites and CTA; 390×844 recording confirms the recomposition across multiple projects. | **Matched. P3 open:** final media may change the preferred bleed/focal position. |
| Play treatment | Hover scales play icon 1→1.1; glow reaches opacity 1 with 12 px blur over 200 ms using the audited cubic-bezier. CTA remains available on touch. | Measured hover/focus values are play 1→1.1 and glow 1→1.08, opacity 0→1, blur 12 px. Desktop play is 58 px and mobile 50 px; poster and CTA are semantic links, so hover is not required for entry. | **Matched behavior. P3 open:** icon weight and glow intensity require visual sign-off. |
| Stage duration | Audited total Motion index height: 6,436 px at 1440×900 and 5,281 px at 390×844. Long spans are part of the site's identity. | Corrected production export measures **6,463 px at 1440×900** and **5,269 px at 390×844**: +27 px/+0.42% desktop and -12 px/-0.23% mobile versus Reference. The five outer stages carry the added distance; intro/footer are unchanged and the inner visual frame retains its accepted dimensions. | **Target met and human-approved:** both measurements are inside the requested ±2% tolerance. |

## Responsive and runtime fidelity

The R1 fixed matrix covers 1440×900, 991×800, 767×1024, 479×844, 390×844 and 360×800. No fixed-width sample showed page overflow, disappearing satellites, non-finite transforms, title/CTA collision, CTA/satellite collision or duplicate Motion triggers. Every sampled stage responded throughout the longer range and reconstructed direction on reverse. The no-reload 1440→991→767→479→390→360→1440 sequence kept all 35 stage samples valid in one document and finished with the desktop composition restored.

Reduced motion preserves the editorial hierarchy rather than substituting an empty or flattened card: all posters, 15 satellites, titles, metadata and CTAs stay present; Motion transforms clear and no Motion-specific trigger is required. Theme presentation preserves the approved desktop F/24, collapsed F/23 and F/1.4 labels without applying image filters.

Three repeated route cycles and Back/Forward traversal retained the approved global runtime counts. This validates cleanup and reuse of the existing Lenis, GSAP ticker, route scope, transition overlay, theme, navigation and preload systems; it does not reopen their STEP 3D approval.

## Severity classification

### P0

None. No broken route, missing stage, horizontal overflow, invalid transform, autoplay/video leak, unhandled runtime error or build/export failure remains in the collected evidence.

### P1

Final project-owned preview/full-film media and approved audio behavior are absent by design. The schema makes that status explicit, and the index never requests those sources. STEP 3E-A is approved as a poster-only foundation, but the broader Motion experience cannot be called production-ready until those assets exist and are validated in the future case-study phase.

### P2

- R1 meets the numeric duration tolerance and the corrected handoff cadence is human-approved.
- Licensed display/sans fonts are unavailable, so exact word width, stroke contrast and optical baselines cannot match the Reference yet.
- Bilingual identity/copy, dates, locations, credits and final media sequence remain provisional.
- Final poster/satellite assets will require crop, focal-point, luminance and possibly per-project position recalibration.

### P3

- Current scrub cadence, satellite clearance and adjacent-stage handoff are human-approved; reassess only if final replacement media changes the composition materially.
- Play icon weight, glow density, title optical centering and asset-dependent micro-spacing remain polish.
- Chrome automation and 25 fps WebM recordings are review evidence, not physical iOS/Safari or pixel-identical certification.

## Acceptance mapping

- Generic Motion placeholder removed: **pass**.
- Five data-driven project stages: **pass**.
- Main poster plus three correctly persistent satellites: **pass and human-approved**.
- No autoplay/video on index: **pass**.
- Continuous forward and reverse motion: **pass**.
- Deliberate mobile recomposition: **pass and human-approved**.
- No horizontal page overflow: **pass**.
- Stable global lifecycle: **pass**.
- All Motion routes statically exported: **pass**.
- No Reference media or commercial fonts copied: **pass**.

STEP 3E-A is human-approved at candidate `9bd2b2a1a320e348a2650cca0dd171db86c43d01`. Poster-only index behavior remains authoritative; the five Motion projects remain temporary development content and the P1 final films/audio policy remains unresolved. STEP 3E-B is next but has not started. This approval does not authorize merging `main`.
