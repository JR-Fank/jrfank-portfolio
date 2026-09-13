# STEP 3E-B Motion case-study fidelity review

**STEP 3E-B — HUMAN APPROVED**

## Review basis

This review compares the shared local Motion case system with the audited Reference structure, geometry and interaction evidence in `docs/REFERENCE_AUDIT.md`, `docs/INTERACTIONS.md`, `docs/ARCHITECTURE.md` and `docs/ANIMATION_ARCHITECTURE.md`. It does not compare subject matter: Reference production media and commercial fonts were not copied. Local films, stills, identity, synopsis and credits remain authorized temporary development content.

The Reference used Vimeo background/full-film playback. The repository contract intentionally replaces it with one native `<video>` presentation and a React state machine. Native media events own playback truth; GSAP/CSS own framing and section choreography. This architecture difference is approved by the STEP 3E-B brief and is not a fidelity defect.

## Explicit comparison

| Category | Reference evidence | Local STEP 3E-B | Priority/status |
| --- | --- | --- | --- |
| Title and hero geometry | Oversized editorial case title above a viewport-scale rounded media field. Desktop is broad and cinematic; compact is independently composed rather than scaled desktop. | One shared hero uses large display type, rounded viewport media and breakpoint-specific geometry. Deep checks at 1440×900 and 390×844 plus the 13-size matrix retained title/media hierarchy without overflow. | **Structurally matched. P2:** exact type silhouette and project-specific optical spacing await licensed fonts/final identity. |
| Poster/background preview | Poster is the reliable first/fallback visual; Reference background Vimeo autoplays muted and loops. | Poster is immediately available underneath one native video. Standard motion may load a muted looping preview; reduced motion requests no preview and stays poster-first. Preview failure clears the source and returns to usable poster/Watch state. | **Functional match under approved native architecture. P1:** final preview footage absent. |
| Watch transition | User action resets film to zero, enables the approved audio mode, starts playback and then enlarges/reframes the presentation. | Full source is assigned only on Watch. A B3 correction keeps the initial frame through `film-loading`; source-generation-matched native `playing` is required before the film presentation enlarges. First captured playing time was approximately 0.0004 s. | **Matched interaction and corrected event order. P1:** production audio behavior unapproved. |
| Playing-state frame | Desktop enlarges/reframes. Tiny mobile moves from roughly 230vw/130% to 160vw/90%. | Desktop broadens the rounded frame. At 390×844 the measured video relationship moves approximately 230vw→160vw and the card ratio 130%→90%; the 14-step live resize restored both compact and desktop geometry. | **Calibration matched. P3:** final footage may require focal/crop adjustment. |
| Floating playback control | Roughly 64×64 px circular translucent/blurred control; stronger hover; Pause/Resume semantics. | Desktop control is 64×64 px, compact 58×58 px, blurred/translucent, focus-visible and keyboard operable. It appears only after confirmed film start and reflects native Pause/Resume/waiting state. | **Matched.** |
| Synopsis spacing | Date/location lead into a spacious editorial synopsis below the hero. Bilingual content must not flatten the hierarchy. | Date/location remain small metadata; large English synopsis leads, with Traditional Chinese as a quieter secondary composition. Desktop/mobile deep screenshots preserve substantial separation. | **Structurally matched. P2:** temporary text and substitute metrics await owner approval. |
| Filmstrip direction/speed/gaps | Two continuous 16:9-ish rows with small gaps; one travels left, one right; transforms remain seamless and reversible. | One measured GSAP timeline drives two rows in opposite directions. Gaps are 8–13 px responsive. Forward/reverse samples restored the same transforms; duplicate visual sets are hidden from accessibility APIs and no document overflow occurred. | **Functional match. P3:** final images may change perceived speed/crop weight. |
| Credits hierarchy | Centered editorial credits with role and name; links are optional. | Shared centered section renders bilingual roles and names from `MotionCredit`; external URLs are semantic and use `noopener noreferrer`. | **Matched structure. P2:** development crew names/roles are not final credits. |
| BTS total duration | Sampled desktop stage approximately 600vh/5,400 px; tiny mobile approximately 400vh. | Measured total is exactly 5,400 px at 1440×900 and 3,376 px at 390×844 (600vh/400vh). Active-pin live resize stayed valid across all 14 widths. | **Matched calibration.** |
| BTS frame geometry | One centered pinned visual field; eight images progress through it; frame responds to viewport and media aspect. | One pinned stage uses frame, viewport and decoded-image measurements with `invalidateOnRefresh`. It kept finite geometry from 1440→360→1440 without stale pin spacing or disappearing media. | **Matched architecture. P3:** physical mobile-Safari viewport behavior is not certified. |
| BTS transition cadence | Images overlap through positional travel, scale and opacity/mask movement; not an abrupt slideshow; reverse scroll reconstructs state. | One master timeline contains labels `bts-01`…`bts-08`. Each beat overlaps outgoing/incoming travel, scale and opacity; forward progression reached 08/08 and reverse returned to prior beats/beat 1. No per-image trigger, nested pin or scroll-tick React state exists. | **Matched interaction. P3:** qualitative cadence remains for human visual approval. |
| Behind the Scenes title masks | Top/bottom fragments compose “Behind the Scenes” around the active frame. | Separate masked `BEHIND` and `THE SCENES` fragments frame the media while a semantic full heading remains available to assistive technology. | **Matched concept. P3:** final font metrics may alter mask alignment. |
| Mobile BTS | Compact duration is shorter, frame/title recompose for the narrow viewport, and content remains legible. | Compact uses 400vh with one pin in standard motion and a narrow editorial frame. At reduced motion the pin and artificial height disappear and all eight images become a normal readable vertical sequence. | **Matched plus accessible fallback.** |
| Explore More 2→1 | Motion carousel shows two cards on desktop and one at ≤767; loop/free drag/snap/16 px gap/no controls; current excluded. | Measured 648 px cards in a 1,312 px track on desktop and 350/350 px at mobile. Mouse drag and real touch swipe passed. Authored and cloned links both enter the shared route overlay and current project is excluded. | **Matched behavior.** |
| Footer transition | Every case ends in the global contact footer and case-to-case navigation uses the same page overlay. | One shared `SiteFooter` closes every route. Case-to-case, Back and index navigation used the approved persistent overlay. Recordings show a brief dark covered frame before the next hero, consistent with the global transition system. | **Functionally matched. P3:** dark covered frame remains human-review polish, not a route failure. |

## Responsive, accessibility and lifecycle fidelity

The fixed matrix passed all requested sizes from 1440×900 through 360×800. Both hero-present and active-BTS no-reload sequences crossed 992/991, 768/767 and 480/479 structural edges and returned to 1440 without overflow, non-finite transforms, stale pin spacing or trigger duplication.

Watch, Pause/Resume and Retry are real buttons with visible keyboard focus and meaningful labels. Essential project text is outside the video. Filmstrip base sets and all BTS media retain meaningful order/alts, while decorative duplicates are inert. Reduced motion creates no Motion case ScrollTrigger or automatic preview request and preserves all content and controls.

Three exact Home→Motion Index→Motion case cycles plus case navigation and Back/Forward kept one Lenis instance, one GSAP ticker driver and one route scope. The approved Motion Index stayed at five triggers; a standard Motion case intentionally has two. Playback-controller handlers returned from seven while mounted to zero after leave; observer, Splide and timer counts did not grow.

## Playback/network authority

Fresh case load made zero full-film requests. Watch initiated the full-film request only after the user gesture. Native `playing`, `pause`, `waiting`, `ended` and `error` states drive the interface; queued events are rejected unless active source URL, request generation and media readiness agree.

Route leave pauses and releases the old element before route navigation. The isolated probe found `src` removed, `networkState = 0`, `readyState = 0`, `currentTime = 0`, no in-flight MP4 request and zero application playback handlers. The detached object may retain a stale native `currentSrc` string; because its network/readiness states are empty and no request/handler remains, this is documented as native bookkeeping rather than a playback leak.

## Severity classification

### P0

None. No broken Motion route, eager full-film request, false native playing state, missing section, horizontal overflow, duplicate/nested BTS pin, irreversible scrub, lifecycle growth, reduced-motion content loss, build failure or approved Motion Index regression remains in the collected evidence.

### P1

- Final project-owned preview/full-film sources are not supplied.
- Final per-project audio policy is not approved. Development uses `muted-preview-muted-full`, and the temporary full film contains no audio; `muted-preview-user-gesture-full-audio` is supported by the controller but not production-certified.

### P2

- All five Motion identities, dates, locations, synopses, credits and media selections remain temporary development content.
- Licensed final display/UI fonts remain unresolved, so exact title width, stroke contrast, credit metrics and mask alignment cannot match the commercial Reference typography.
- Final media will require crop, focal-point, luminance and potentially cadence recalibration before production approval.

### P3

- BTS cadence, filmstrip perceived speed, masked-title optical alignment and asset-dependent micro-spacing remain human-eye polish even though functional geometry/reversal passed.
- A brief dark frame is visible during the existing global route-overlay transition; navigation and destination rendering remain correct.
- The detached video's stale `currentSrc` bookkeeping string is retained as a documented non-active observation; network state, request state and application listeners are clean.
- Chrome automation and 25 fps WebM recordings are review evidence, not physical iOS/Safari certification. Mobile address-bar changes, platform decoding/autoplay differences and physical touch behavior still require device testing.

## Final gate and evidence

The single final `npm run check` passed without retry: TypeScript, content validation, Next.js 16.3.3 optimized production build and static generation all passed. The exact generation count is **18/18**. All five Motion case `index.html` files are present in `out/`; no SSR or API route is required.

- Desktop recording: `/Users/jr-fank/Code/jrfank-portfolio/output/playwright/step3e-b/STEP3E_B_MOTION_CASES_DESKTOP_1440x900.webm`.
- Mobile recording: `/Users/jr-fank/Code/jrfank-portfolio/output/playwright/step3e-b/STEP3E_B_MOTION_CASES_MOBILE_390x844.webm`.
- Full local QA evidence: `/Users/jr-fank/Code/jrfank-portfolio/output/playwright/step3e-b/`.

STEP 3E-B passed final human visual review at candidate `6801ea21446dddd27d4e3120713d52a614a72c93`. Together with the previously approved STEP 3E-A Motion Index, STEP 3E — MOTION EXPERIENCE is human-approved. This review does not certify temporary film/audio as production assets or authorize another phase.
