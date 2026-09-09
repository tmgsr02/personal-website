# Blue Ink Editorial — Design Spec

**Date:** 2026-09-09
**Status:** Approved (design), pending implementation plan
**Supersedes:** `design.md` ("Analog Pop Craft")

---

## 1. Intent

Replace the site's "Analog Pop Craft" visual language (pop-art crops, burlap,
leather, red dot) with a single-ink editorial system: cream paper, blue
copperplate engraving, and a hairline grid frame that makes each page read as a
printed plate rather than a web page.

The audience and decision filter in `CLAUDE.md` are unchanged. This spec only
changes what the site looks like, what it is built from, and how it moves.

**Success criterion, restated for this direction:** a visitor should feel they
are holding a well-set book, not browsing a template. If an element draws
attention without adding clarity, it is removed.

## 2. Design tokens

Sampled from the three approved reference plates. These replace the whole of
`src/styles/tokens.css`.

### 2.1 Colour

| Token | Value | Role |
|---|---|---|
| `--paper` | `#F7F3E7` | Page ground |
| `--paper-2` | `#F1ECDD` | Recessed bands, table stripes |
| `--ink-blue` | `#1B3A6B` | Display type, primary ink, engraving |
| `--ink-blue-2` | `#2F5A9E` | Secondary ink, illustration midtone |
| `--rule` | `#A8BBD6` | Hairline rules, crop marks, dividers |
| `--rule-soft` | `#D3DDEA` | Table hairlines, disabled rules |
| `--text` | `#211E1A` | Body copy |
| `--muted` | `#6B6459` | Captions, metadata, de-emphasised rows |
| `--accent` | `#C8492B` | Arrows, active state, hover affordance |

**The accent rule (inherits the old "red dot is sacred" discipline):**
`--accent` appears only on directional arrows, the active nav marker, and hover
affordances. It is never a background, never a border, never decorative.

### 2.2 Typography

Three families, three jobs. No fourth family may be added.

| Token | Family | Job |
|---|---|---|
| `--font-display` | Bodoni Moda | Headlines. High-contrast Didone matching the reference plates. |
| `--font-body` | Source Serif 4 | Body copy, paragraphs, note prose. |
| `--font-mono` | IBM Plex Mono | Wide-tracked caps labels, section markers, page numbers, rail text, UI. |

All three load through `next/font/google` with `display: swap`, subset `latin`.

Scale:

```
--display-xl : clamp(48px, 7vw, 104px)   /* page headline, --lh 0.94, tracking -0.02em */
--display-l  : clamp(36px, 4.5vw, 64px)
--h2         : clamp(24px, 2.6vw, 34px)
--h3         : 20px
--body       : 17px                       /* serif body, --lh 1.55 */
--small      : 14px
--label      : 11px                       /* mono caps, tracking 0.22em */
--lh-tight   : 0.94
--lh         : 1.55
```

### 2.3 Geometry

Radii above 2px are retired; the direction is printed, not soft.

```
--r-sm     : 2px
--hairline : 1px
--frame-inset-desktop : 40px
--frame-inset-mobile  : 16px
--container : 1240px
--gutter    : clamp(20px, 4vw, 56px)
```

Both shadow tokens are removed. Depth comes from rules and ink weight only.

### 2.4 Retired

`--pop-orange`, `--pop-mustard`, `--pop-blue`, `--leather*`, `--stitch*`,
`--signal-red`, `--newsprint`, `--aged-paper`, `--shadow-sm`, `--shadow-md`,
`--r-md`, `--r-lg`, `--r-pill`, Archivo Black.

`tailwind.config.ts` colour/shadow/radius maps are rewritten to match §2.

## 3. Layout system

### 3.1 GridFrame

The signature structural primitive, present on every route.

- Hairline `--rule` border inset `--frame-inset-*` from the viewport edge.
- `+` crop marks at each corner and at rule intersections.
- Vertical side rails carrying stacked, wide-tracked mono caps text
  (e.g. `IDEAS / PEOPLE / SYSTEMS / A BRIGHTER TOMORROW`).
- Rendered as inline **SVG**, not CSS borders, so the frame can stroke itself in
  (§5). Cost target: under 2KB.
- Below `768px` the rails drop and the inset tightens; the frame itself stays.

### 3.2 SectionMarker

`03 // PHILOSOPHY` — a two-part mono caps label: zero-padded index, `//`
separator, section name. Wide tracking, `--ink-blue`. Every major section on
every page carries one, numbered continuously down the page.

### 3.3 Page skeleton

```
GridFrame
  TopNav                     name mark left, six links right, accent active marker
  main
    Section (SectionMarker + content)
    ...
  SkylineFooter              full-bleed engraving, contact block above it
```

## 4. Asset pipeline

### 4.1 Generation

`scripts/generate-assets.ts` is the committed source of truth. It holds one
prompt per asset and shells out to `codex exec --skip-git-repo-check
--dangerously-bypass-approvals-and-sandbox "<prompt>"`, instructing Codex to use
its `imagegen` skill and the built-in `image_gen` tool.

Every prompt is composed as `LOCKED_STYLE + SUBJECT + SAVE_INSTRUCTION` so all
plates read as one hand. The locked style block specifies: single ink `#1B3A6B`
on cream `#F7F3E7`; light, open, airy hatching with cream showing through; no
second colour; no text, lettering, signature, watermark or drawn border; wide
shot with the full subject visible and generous margin.

Three findings from the calibration probe are encoded in that block and must not
be dropped:

1. Codex crops tight by default — the explicit "wide shot, entire subject
   visible, generous margin" clause is required.
2. Codex renders heavier than the references — the "light, open, airy, not a
   dark woodcut" clause is required.
3. A single 1024² PNG is ~2.4MB — see §4.3.

**Concurrency.** One generation takes roughly half an hour of wall clock.
The script fans out into parallel background jobs rather than looping; twelve
serial generations is not an acceptable build step. The script is a one-shot
authoring tool, never part of `pnpm build`.

### 4.2 Manifest

| File | Size | Used by |
|---|---|---|
| `home-hero` | 1536×1024 | `/` hero |
| `about-portrait` | 1536×1024 | `/about` hero — likeness |
| `work-still-life` | 1536×1024 | `/work` hero |
| `writing-still-life` | 1536×1024 | `/writing` hero |
| `notes-still-life` | 1024×1024 | `/notes` hero |
| `now-still-life` | 1024×1024 | `/now` hero |
| `toronto-skyline` | 1536×1024 | Footer, full-bleed, every route |
| `cap-applied-ai` | 1024×1024 | Capabilities grid |
| `cap-product-analytics` | 1024×1024 | Capabilities grid |
| `cap-data-systems` | 1024×1024 | Capabilities grid |
| `cap-building` | 1024×1024 | Capabilities grid |
| `og-card` | 1536×1024 | Social metadata |

Output: `public/engravings/`.

**Paper grain** is deliberately *not* generated. It is an inline SVG
`feTurbulence` filter at very low opacity — smaller, sharper, and resolution
independent.

### 4.3 Optimisation

Post-generation, each PNG is converted to WebP at quality 82 and the PNG is
discarded. Budget: **under 180KB per plate**, under 1.4MB for the full set.
An asset that cannot meet the budget is regenerated, not shipped oversized.

### 4.4 Likeness

The `about-portrait` prompt first calls `view_image` on three source photographs
in `assets/reference-portraits/`, then generates. That directory is
**gitignored** — the source photographs are never committed or deployed. Only
the derived engraving ships.

## 5. Motion

Informed by Emil Kowalski's discipline and five patterns from the Amicro
reference the user supplied. All are implemented natively with CSS and the
already-installed Framer Motion; **no new dependency is added.**

### 5.1 Rules

- Duration 150–220ms for micro-interactions; 600–900ms for the two entrance
  moments only.
- Enter `cubic-bezier(0.22, 1, 0.36, 1)`; exit `cubic-bezier(0.4, 0, 0.2, 1)`.
- Animate `transform` and `opacity` only. Never animate layout properties.
- Every effect is gated behind `prefers-reduced-motion`, which resolves to the
  final state instantly rather than merely shortening the duration.

### 5.2 Inventory

| Effect | Trigger | Behaviour | Source pattern |
|---|---|---|---|
| Slide arrow | Row/CTA hover | `→` translates 4px right, fills `--accent` | Amicro Slide Arrow |
| Sibling dim | Index list hover | Non-hovered rows drop to 45% opacity. **Opacity, not blur** — filter blur is too expensive per-row | Amicro Focus Blur |
| Text reveal | Section enter | Mono caps kicker reveals per-letter, 18ms stagger | Amicro Text Reveal |
| Magnetic pull | Primary CTA hover | Button drifts toward cursor, **capped at 4px** | Amicro Magnetic Field |
| Expand ring | Nav active | Accent ring expands once from the active marker | Amicro Expand Ring |
| **Frame draw** | Page load | GridFrame strokes itself in via `stroke-dashoffset`, ~900ms | signature |
| **Ink reveal** | Plate scroll-in | Engraving appears under a soft gradient mask sweep, ~700ms | signature |

### 5.3 Why mask sweep and not traced SVG

A true `stroke-dashoffset` draw-on for the engravings would require tracing the
rasters to vector. Dense crosshatch traces to 20,000+ paths and multi-megabyte
SVGs, which fails the performance budget outright. The mask sweep reads as ink
arriving, costs one CSS property, and works on any raster.

The frame *is* real SVG, so it gets the genuine draw-on. That is where the
budget is spent.

## 6. Components

**New:** `GridFrame`, `SectionMarker`, `IndexRow`, `EngravingPlate`, `SideRail`,
`SkylineFooter`, `CapabilityCard`.

**Rewritten:** `TopNav`, `HeroPanel`, `AboutPanel`, `NotesList`, `ProjectCard`,
`FeaturedWorkGrid`, `SectionHeaderStrip` → folded into `SectionMarker`,
`ProofStrip`.

**Deleted:** `TapeLabelTag`, `StitchedDivider`, `LeatherFooter`,
`RedDotIndicator` (its role moves into `IndexRow` and `TopNav`).

`EngravingPlate` wraps `next/image` and owns the §5 ink reveal, so no page
composes that animation by hand.

`IndexRow` is the workhorse: zero-padded number, title, optional subtitle,
trailing arrow, hover slide, and participation in sibling dimming via a shared
list context.

## 7. Routes and content

Six routes. `WORK / WRITING / NOTES / ABOUT / NOW / CONTACT`.

| Route | Content |
|---|---|
| `/` | Hero, capabilities grid, featured work, selected writing |
| `/work` | Experience index — Wesco, Chime, Deloitte, Carnegie Mellon, Morehouse |
| `/work/[slug]` | Case study |
| `/writing` | Long-form essays. The four existing MDX pieces move here. |
| `/writing/[slug]` | Essay |
| `/notes` | Short dated field notes — Lineup, Built North, Voice AI Toronto, ML Experiments, Interface Studies, Photography |
| `/about` | Philosophy plate + capabilities, per reference plate 1 |
| `/now` | Current focus, single column |
| `/contact` | Contact block above the full-bleed skyline, per reference plate 3 |

**Writing vs Notes.** These are deliberately distinct, mirroring the two indexes
in reference plate 2 (`01 // EXPERIENCE` and `06 // FIELD NOTES`). Writing is
long-form and slug-routed; Notes are short, dated log entries. The existing MDX
loader moves from `/notes` to `/writing`; `/notes` is a new static list in
`site.ts`.

`src/content/site.ts` is rewritten around the real index above.

The MDX pipeline moves wholesale from notes to writing:

- `src/content/notes/*.mdx` → `src/content/writing/*.mdx` (all four pieces)
- `src/lib/notes.ts` → `src/lib/writing.ts`; `getAllNotes()` → `getAllEssays()`,
  `Note` → `Essay`
- `scripts/new-note.ts` → `scripts/new-essay.ts`, scaffolding into the new
  directory; the `pnpm new-note` script becomes `pnpm new-essay`
- `/notes` gets a new static `fieldNotes[]` array in `site.ts` and no MDX loader

Legacy `/notes/[slug]` URLs redirect to `/writing/[slug]` via `next.config.ts`
so the four existing pieces keep working links.

## 8. Accessibility

Unchanged targets: WCAG 2.1 AA.

- `--ink-blue` on `--paper` and `--text` on `--paper` both clear 4.5:1; the
  contrast pairs are asserted in the implementation plan, not assumed.
- `--accent` is never the sole carrier of meaning — arrows and active states
  also change position or weight.
- Focus rings become `2px solid var(--accent)` with `2px` offset.
- The GridFrame and every engraving are decorative: `aria-hidden`, empty `alt`.
  Content plates carry real alt text.
- Six nav items must remain keyboard navigable and usable in the mobile drawer.

## 9. Verification

Per `CLAUDE.md`, before the work is considered complete:

- `pnpm typecheck` passes
- `pnpm lint` passes
- `pnpm build` succeeds
- Every route rendered and visually compared against the reference plates
- Responsive behaviour checked at 375 / 768 / 1440
- `prefers-reduced-motion: reduce` verified to remove all seven effects
- Total engraving payload under 1.4MB

## 10. Out of scope

- CMS, backend, database, auth — the site stays static.
- Dark mode. The direction is a printed cream plate; there is no dark variant.
- Any new runtime dependency.
