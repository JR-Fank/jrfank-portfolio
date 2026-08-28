# Route and Information Architecture Audit

Reference checked: https://www.giuligartner.com/  
Audit date: 2026-08-28

## 1. Primary information architecture

```text
/
├── /stills
│   └── /stills/[slug]
├── /motion
│   └── /motion/[slug]
└── /about
```

The fixed navigation exposes only Stills, Motion, About, Instagram, Email, and the F-stop theme control. Case studies are reached through index/Home cards and Explore More.

## 2. Primary routes

| Route | Reference page type | Audited in depth | Screenshot set |
|---|---|---:|---:|
| `/` | Home/editorial selection | Yes | Yes |
| `/stills` | Photography index | Yes | Yes |
| `/motion` | Film index | Yes | Yes |
| `/about` | Biography/credentials/contact | Yes | Yes |

## 3. Stills routes

Live index order:

| Route | Project | Date | Location | In-depth audit |
|---|---|---|---|---:|
| `/stills/visit-greenland` | Visit Greenland | March 2023 | Greenland | Yes; 7-image story |
| `/stills/inspired-by-iceland` | Inspired by Iceland | January 2020 | Iceland | Yes; 10-image story |
| `/stills/follow-the-tracks` | Follow The Tracks | September 2019 | Mongolia | Route/index verified |
| `/stills/cayuga-collection` | Cayuga Collection | July 2021 | Costa Rica | Yes; 9-image story |
| `/stills/the-pill` | The Pill | August 2020 | Chamonix, France | Route/index verified |
| `/stills/tijn-eyewear` | TIJN Eyewear | 2018–present | Everywhere | Route/index verified |
| `/stills/travel-alberta` | Travel Alberta | January 2020 | Alberta, Canada | Route/index verified |

Shared template contract observed:

```text
title
date
location
description
hero base
hero overlay (optional)
up to 10 images
per-image aspect ratio/alignment preset
Explore More excluding current slug
```

The public reference encodes ten potential image slots with conditional visibility. The future content model can be cleaner, but it must preserve per-image size/alignment rather than treating the story as a uniform gallery.

## 4. Motion routes

Live index order:

| Route | Project | Date | Location | In-depth audit |
|---|---|---|---|---:|
| `/motion/pandore` | Pandore | October 2024 | Gran Canaria | Yes |
| `/motion/satisfy` | Satisfy Running | May 2024 | South Africa | Yes |
| `/motion/amelia` | Amelia | November 2022 | Cornwall, Scotland | Route/index verified |
| `/motion/nuances-of-noise` | Nuances of Noise | September 2021 | Iceland | Route/index verified |
| `/motion/the-girl-with-the-yellow-jacket` | The Girl With The Yellow Jacket | August 2021 | Iceland | Route/index verified |

Shared template contract observed:

```text
title
date
location
description
poster
Vimeo/video source
filmstrip frames row A/B
credits and extra credits
BTS title + image sequence
Explore More excluding current slug
```

## 5. Home route composition

Home is a curated subset, not a duplicate of either index:

```text
hero reel
short introduction → /about
selected Still: Visit Greenland → case study
selected Still: Cayuga Collection → case study
selected Motion: Pandore → case study
contact/footer
```

The selected projects are content-configurable. The future implementation should not hard-wire route-specific animation code to those exact slugs.

## 6. About route composition

```text
name/video hero
origin/story statement
moving photo strip
story/portrait composition
brands
awards and nominations
press
podcasts
contact/footer
```

For the personal portfolio, biography, brand history, awards, press, and media must be replaced with the owner's content or clearly marked local placeholders.

## 7. Route-transition matrix

Observed transition for every internal, non-hash link:

| From | To | Leave | Navigation delay | Enter |
|---|---|---|---:|---|
| Home | Stills | Full-viewport theme overlay | 1000 ms | Overlay fades away + page entrance |
| Home | Motion | Same | 1000 ms | Same |
| Home | About | Same | 1000 ms | Same |
| Stills | Stills case | Same | 1000 ms | Case title/hero entrance |
| Stills case | Stills case | Same via Explore More | 1000 ms | Case title/hero entrance |
| Motion | Motion case | Same | 1000 ms | Video-card entrance |
| Motion case | Motion case | Same via Explore More | 1000 ms | Video-card entrance |
| Mobile menu | Any internal route | Same after link selection | 1000 ms | Destination entrance |

Hash links in Stills galleries are excluded from the route overlay and scroll locally to the selected image.

## 8. External actions

| Action | Destination/behavior |
|---|---|
| Instagram | external tab |
| Email nav | `mailto:` |
| Footer email | copy to clipboard |
| YouTube / Instagram / Twitter footer | external tabs |
| Motion Watch | in-page Vimeo unmute/reframe, not a route |

External links receive `noopener noreferrer` when opened in a new tab.

## 9. Sitemap discrepancy

The public sitemap observed on 2026-08-28 lists the core routes, all seven Stills cases, and four older Motion cases. `/motion/pandore` is linked by the live Home and Motion index but is absent from that sitemap. The future application should generate its sitemap from the same content source as the indexes to avoid this drift.

The sitemap also exposes `/coming-soon` and `/system`; neither belongs to the portfolio's primary information architecture and neither should be recreated without a separate request.

## 10. Proposed route parity for later phases

The requested personal implementation can preserve reference parity with:

```text
app/
  page                       /
  stills/page                /stills
  stills/[slug]/page         /stills/:slug
  motion/page                /motion
  motion/[slug]/page         /motion/:slug
  about/page                 /about
```

This is an audit conclusion only. Architecture/scaffolding remains STEP 3 and was intentionally not started.

