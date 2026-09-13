# Personal Website Design Spec — "Blue Ink Editorial"

**Supersedes:** "Analog Pop Craft" (pop-art crops, burlap, leather, red dot).

## 1. Intent

A single-ink editorial system: cream paper, blue copperplate engraving, and a
hairline grid frame that makes each page read as a printed plate rather than a
web page. The site's audience is senior engineers, technical hiring managers,
and product-minded builders — not recruiter keyword scanning or mass-market
personal branding. If an element draws attention without adding clarity, it is
removed.

**Success criterion:** a visitor should feel they are holding a well-set book,
not browsing a template.

## 2. Design tokens

The full contents of `src/styles/tokens.css`, reproduced here so this document
never drifts from the shipped values:

```css
:root {
  /* Colour — ground */
  --paper: #F7F3E7;
  --paper-2: #F1ECDD;

  /* Colour — ink */
  --ink-blue: #1B3A6B;
  --ink-blue-2: #2F5A9E;
  --text: #211E1A;
  --muted: #6B6459;

  /* Colour — rules */
  --rule: #A8BBD6;
  --rule-soft: #D3DDEA;

  /* Colour — accent. Arrows, active state, hover affordance ONLY. */
  --accent: #BE4528;

  /* Typography — families */
  --font-display: 'Bodoni Moda', 'Didot', Georgia, serif;
  --font-body: 'Source Serif 4', Georgia, serif;
  --font-mono: 'IBM Plex Mono', 'Courier New', monospace;

  /* Typography — scale */
  --display-xl: clamp(48px, 7vw, 104px);
  --display-l: clamp(36px, 4.5vw, 64px);
  --h2: clamp(24px, 2.6vw, 34px);
  --h3: 20px;
  --body: 17px;
  --small: 14px;
  --label: 11px;

  /* Typography — rhythm */
  --lh-tight: 0.94;
  --lh: 1.55;
  --tracking-display: -0.02em;
  --tracking-label: 0.22em;

  /* Geometry */
  --r-sm: 2px;
  --hairline: 1px;
  --frame-inset: 16px;
  --container: 1240px;
  --gutter: clamp(20px, 4vw, 56px);

  /* Motion */
  --dur-micro: 180ms;
  --dur-entrance: 700ms;
  --dur-frame: 900ms;
  --ease-enter: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-exit: cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 768px) {
  :root {
    --frame-inset: 40px;
  }
}
```

**The accent rule** (inherits the old "red dot is sacred" discipline):
`--accent` appears only on directional arrows, the active nav marker, and
hover affordances. It is never a background, never a border, never
decorative.

**Why `--accent` is `#BE4528` and not the spec's `#C8492B`:** the spec's
original value measured 4.26:1 contrast against `--paper`, short of the
project's WCAG AA 4.5:1 commitment. It was darkened during implementation to
`#BE4528` (4.65:1) to clear that bar. `--accent` is never the sole carrier of
meaning regardless — arrows and active states also change position or weight.

**Retired:** `--pop-orange`, `--pop-mustard`, `--pop-blue`, `--leather*`,
`--stitch*`, `--signal-red`, `--newsprint`, `--aged-paper`, `--shadow-sm`,
`--shadow-md`, `--r-md`, `--r-lg`, `--r-pill`, Archivo Black, and both shadow
tokens. Depth comes from rules and ink weight only; radii above 2px are
retired because the direction is printed, not soft.

Three families, three jobs, no fourth: `--font-display` (Bodoni Moda) for
headlines, `--font-body` (Source Serif 4) for paragraphs, `--font-mono` (IBM
Plex Mono) for wide-tracked caps labels, section markers, and rail text. All
three load through `next/font/google` in `src/app/layout.tsx` with
`display: swap`, subset `latin`, and are bridged into the token names as
`--font-display-loaded` etc. in `src/app/globals.css` (deliberately outside
`@layer base`, since unlayered declarations beat layered ones regardless of
source order — inside a layer this bridge would lose to `tokens.css`).

## 3. Layout primitives

### 3.1 GridFrame (`src/components/GridFrame.tsx`)

The signature structural primitive, composed by every route's page component
(it is not in the root layout, so each route mounts and animates its own
frame).

- A hairline `--rule` rectangle, rendered as a `fixed`-positioned inline
  `<svg>` inset by `var(--frame-inset)` from the viewport edge, `pathLength`
  animated via `stroke-dashoffset` so it can draw itself in.
- The `<svg>` box's `width`/`height` are explicit `calc()` lengths, not
  `auto` — since `<svg>` is a CSS replaced element, `top+right+bottom+left`
  with `width/height: auto` does not stretch it to fill the inset gap the way
  it would a plain `<div>`; it falls back to the 300×150px UA default size
  instead. Sizing it explicitly sidesteps that.
- `+` crop marks at each corner, built as CSS (not SVG, since SVG geometry
  attributes cannot resolve `var(--frame-inset)`).
- Optional `SideRail` children carrying stacked, wide-tracked vertical mono
  caps text (`railLeft` / `railRight` props), hidden below `768px`.
- Below `768px` the frame inset tightens from `40px` to `16px` (the
  `@media (min-width: 768px)` block in `tokens.css`) and the rails drop; the
  frame rectangle and corner marks remain at every size.

### 3.2 SectionMarker (`src/components/SectionMarker.tsx`)

`04.1 // PHILOSOPHY` — a place number, a `//` separator, and a mono caps
section name, wide-tracked, in `--ink-blue`. The full label is kept in a
`sr-only` span for assistive tech; the per-letter spans used for the reveal
animation are `aria-hidden`.

**Chapters — the nav is the table of contents.** Each nav item is a chapter,
numbered by its position in `chapters` (`src/content/site.ts`):
`01 Work · 02 Writing · 03 Notes · 04 About · 05 Now · 06 Contact`. The nav
itself stays unnumbered — plain labels read cleaner in the bar — so these
numbers surface only in section markers, and the nav's order is what ties
them together.

A section marker reads *chapter.section*. The chapter is the route's nav
position; the section is the marker's position on the page, from 1. Detail
pages take their parent's chapter, so `/work/wesco` reads `01.x` — matching
the nav, which marks Work active there. A number says **where you are, not
where the content came from**: Field Notes on `/work` is `01.2`, not `03`.
That one rule means numbers never run backwards on a page, the chapter
prefix always matches the active nav item, and reordering `chapters`
renumbers the whole site.

The home page is the **contents page**, chapter `00`. It opens with
`00 // INTRODUCTION`; every block after it previews one chapter and carries
that chapter's bare number, in ascending order — `01 // SELECTED WORK`,
`02 // WRITING`, `04 // CAPABILITIES`. Gaps are expected: a contents page
highlights, it does not list everything. Adding or moving a home block means
keeping the blocks in chapter order.

Pages never type a number. Markers take
`chapter={chapterNumber('/about')} section={1}`, and
`src/lib/chapters.test.ts` reads every page's source to hold that line: a
literal `chapter={4}`, a marker borrowing another route's chapter, sections
out of order, or home blocks out of chapter order all fail the suite.

**Numbering rule — places take two digits, items take three.** A section
marker names a *place*: a two-digit chapter, optionally followed by a
one-digit section (`04`, `04.1`). A counter on a list item — an `IndexRow`, a
capability card, a field note — counts an *item* and is always three digits
(`001`). The widths differ on purpose, so a marker and the first row beneath
it never read as the same number. The formats come from
`src/lib/numbering.ts` (`placeNumber`, `sectionNumber`, `itemNumber`), which
throw on a value that would not fit its width; never zero-pad a counter
inline. Field note ids are the one hand-written counter, because they also
anchor `/notes#<id>` links and must stay stable — `site.test.ts` enforces
their width.

### 3.3 Page skeleton

```
RootLayout (src/app/layout.tsx)
  TopNav                        name mark left, six chapter links right, accent active marker
  main
    <route page>
      GridFrame
        Section (SectionMarker + content)
        ...
  SkylineFooter                 full-bleed engraving, contact links above it
```

`TopNav` and `SkylineFooter` live in the root layout and persist across
client-side navigations; `GridFrame` and its contents are per-route and remount
on every navigation, which is what lets the frame-draw and ink-reveal
entrances replay on every page visit.

## 4. Asset pipeline

Twelve engraving plates live in `public/engravings/` as WebP. Total payload:
**1.3MB**, under the 1.4MB budget.

| File | Size | Used by |
|---|---|---|
| `home-hero.webp` | 1536×1024 | `/` hero |
| `about-portrait.webp` | 1280×853 (downscaled) | `/about` hero — likeness |
| `work-still-life.webp` | 1536×1024 | `/work` hero |
| `writing-still-life.webp` | 1536×1024 | `/writing` hero |
| `notes-still-life.webp` | 1024×1024 | `/notes` hero |
| `now-still-life.webp` | 1024×1024 | `/now` hero |
| `toronto-skyline.webp` | 1536×1024 | `SkylineFooter`, full-bleed, every route |
| `cap-applied-ai.webp` | 1024×1024 | Capabilities grid |
| `cap-product-analytics.webp` | 1024×1024 | Capabilities grid |
| `cap-data-systems.webp` | 1024×1024 | Capabilities grid |
| `cap-building.webp` | 1024×1024 | Capabilities grid |
| `og-card.webp` | 1536×1024 | Social metadata |

**Paper grain** is not a generated asset. It is an inline SVG `feTurbulence`
filter in `globals.css` (`body::after`, 3.5% opacity) — smaller and
resolution-independent.

**Style:** single ink `#1B3A6B` on cream `#F7F3E7`, light open hatching with
cream showing through, no second colour, no text/lettering/signature/
watermark/drawn border, wide shot with the full subject visible.

**Regenerating a plate:** `scripts/generate-assets.ts` is the committed source
of truth for the generation and optimisation process that produced the
committed set. It holds a typed manifest of all twelve assets — name, size,
and prompt — plus the locked style block, and shells out to Codex's
`image_gen` tool per plate via `codex exec`.

- `pnpm generate-assets` regenerates the full set of twelve.
- `pnpm generate-assets <name> [<name> ...]` regenerates one or more named
  plates (e.g. `pnpm generate-assets toronto-skyline`) without touching the
  rest.
- Generation fans out in parallel batches of four rather than looping
  serially — one generation is roughly half an hour of wall clock, so twelve
  in series is not acceptable.
- It never overwrites an existing shipped plate silently: if
  `public/engravings/<name>.webp` already exists, the asset is skipped with a
  warning unless `--overwrite` is passed explicitly.
- It is a one-shot authoring tool, run by hand, and is deliberately never
  part of `pnpm build`.

Each generated PNG is converted to WebP with `cwebp` (`sips` cannot write
WebP on this machine) and the PNG is discarded. Quality steps down 82 → 74 →
66 → 58 at full size first; only once that ladder is exhausted does the
script downscale the plate and restart the ladder, because quality loss on
these line drawings shows as hatching mush long before it shows as softness.
Budget: under 180KB per plate, under 1.4MB for the full set.

Three calibration findings from the original probe are encoded directly in
the script's locked style block, since losing any of them silently changes
the house style: Codex crops tight by default, so the style block spells out
a wide shot with generous margin; Codex renders heavier than the reference
plates, so the style block insists on light, open, airy hatching rather than
a dark woodcut; and a single 1024² PNG lands around 2.4MB uncompressed, which
is why the WebP conversion step is mandatory rather than optional.

The `about-portrait` prompt is meant to reference source photographs in
`assets/reference-portraits/`, which is `.gitignore`d — the source photos are
never committed or deployed, only the derived engraving.

## 5. Motion

Seven effects, informed by Emil Kowalski's discipline. All implemented with
CSS transitions and the already-installed Framer Motion — no new dependency.

**Rules** (`src/lib/motion.ts` holds `DURATION` and `EASE`, mirroring the
`--dur-*` / `--ease-*` tokens):

- 180ms for micro-interactions (`DURATION.micro`); 700–900ms for the two
  entrance moments (`DURATION.entrance`, `DURATION.frame`) only.
- Enter `cubic-bezier(0.22, 1, 0.36, 1)`; exit `cubic-bezier(0.4, 0, 0.2, 1)`.
- Animate `transform`, `opacity`, and colour — never layout properties. This
  is what the constraint actually means and what shipped: `SkylineFooter` and
  `TopNav` legitimately use `transition-colors` (e.g. the focused `IndexRow`
  title shifting to `--accent`), and both are compositor-friendly.
- Every Framer-driven effect calls `useReducedMotion()` and branches to its
  **final** state instantly (not a shortened animation) when it reports true.
- **A reduced-motion branch may vary animation *values* only — never the
  element tree.** `useReducedMotion()` returns `null` on the server and its
  real value on the client's first render, so any branch that adds or removes
  a DOM node makes SSR and the client's first render diverge and React
  discards that segment. Give both branches the same elements and collapse
  `hidden`/`shown` (or `initial`/`animate`) onto the same values when reduced.
  Never reach for a `useEffect`-set `mounted` flag instead: it paints the
  animated state and then corrects, which is a visible flash.
- As a second line of defence, `globals.css` carries a blanket
  `@media (prefers-reduced-motion: reduce)` rule that sets
  `animation: none !important; transition: none !important;` on every
  element, which covers the plain-CSS effects (slide arrow, row emphasis, the
  footer link nudge) that don't call the hook individually.
- Because the reveals are Framer-driven, the plates, section labels and the
  frame are all invisible without JavaScript. A `<noscript>` block in
  `src/app/layout.tsx` forces `.engraving-image`, `.engraving-veil`,
  `.section-letter` and `.frame-rect` to their end states. Any new
  Framer-driven reveal needs a stable class and a matching rule there.

| Effect | Component | Trigger | Behaviour |
|---|---|---|---|
| Frame draw | `GridFrame` | Page load | The frame `<rect>` strokes itself in via `stroke-dashoffset`, 900ms |
| Ink reveal | `EngravingPlate` | Plate scroll-in (`whileInView`, once) | Image fades 0.25→1 opacity under a paper-coloured gradient veil that slides off to the right, 700ms |
| Text reveal | `SectionMarker` | Section enter (`whileInView`, once) | Mono caps label reveals per letter, 18ms stagger, 180ms each |
| Slide arrow | `IndexRow`, footer links, CTA buttons | Row/link hover or focus | `→` translates 4px, plain CSS `transition-transform` |
| Row emphasis | `IndexList` + `IndexRow` | Index list hover or focus | The focused row's title shifts to `--accent` (4.649:1 on `--paper`, clears AA) via `IndexListContext` tracking the hovered/focused row id; siblings stay at full opacity. Dimming sibling *text* was tried and measured: at any opacity dim enough to read as a dim, title/subtitle/arrow all drop below AA 4.5:1, and `onFocus` makes that dim persistent for a keyboard user — a contrast floor, not a taste choice, so the effect is inverted instead. Decorative arrows (`aria-hidden`) may still dim; they carry no contrast obligation |
| Expand ring | `TopNav`'s `ActiveMarker` | Active route | A `--accent` ring scales from 1→3.2 and fades out once from the active nav dot. Under reduced motion the ring is **still rendered**, with `animate` set equal to `initial` so it sits static on the dot. Do not "simplify" this by omitting the element: `useReducedMotion()` returns `null` on the server and its real value on the client's first render, so a structural branch makes SSR and client DOM diverge and React discards the segment. Every reduced-motion branch in this codebase varies animation *values* only, never the element tree — see the Rules above |
| CTA lift | Primary CTA buttons (`/` and `/about`) | Hover | A 2px `-translate-y` lift, plain CSS |

**Deviation from spec, flagged at completion:** the spec's §5.2 calls for a
"Magnetic pull" effect on the primary CTA (button drifts toward the cursor,
capped at 4px). The shipped CTAs use the 2px `-translate-y` lift listed above
instead — same restraint, no pointer-tracking client component, and it
survives reduced motion without special-casing. This was a deliberate
substitution made during implementation, not an oversight.

**Why a mask sweep and not a traced SVG draw-on for engravings:** a true
`stroke-dashoffset` draw-on would require tracing the rasters to vector. Dense
crosshatch traces to 20,000+ paths and multi-megabyte SVGs, which fails the
performance budget outright. The mask sweep reads as ink arriving, costs one
CSS property, and works on any raster. The GridFrame *is* real SVG, so it gets
the genuine draw-on — that's where the budget is spent.

## 6. Components

`src/components/`:

- **`GridFrame`** — see §3.1.
- **`SectionMarker`** — see §3.2.
- **`SideRail`** — stacked vertical mono caps text in the frame margin,
  `hidden md:block`, `aria-hidden`, rendered by `GridFrame`.
- **`IndexList`** / **`IndexRow`** — the workhorse list primitive. `IndexList`
  provides `IndexListContext` (`hoveredId`, `setHoveredId`); `IndexRow` takes
  `id, index, title, subtitle?, href`, renders a three-digit item number
  (`itemNumber()`, see §3.2), title, optional subtitle, and a trailing accent
  arrow, and participates in row emphasis through the shared context.
- **`EngravingPlate`** — wraps `next/image` and owns the §5 ink reveal, so no
  page composes that animation by hand. Takes
  `src, alt, width, height, priority?, className?, sizes?`. `sizes` defaults
  to `(max-width: 768px) 100vw, 60vw`, the right ratio for a plate in a
  `md:grid-cols-2` hero; `/now` and `/notes` pass
  `(max-width: 768px) 100vw, 40vw` since their heroes sit in the `2fr` of a
  `md:grid-cols-[3fr_2fr]` layout instead.
- **`CapabilityCard`** — a three-digit item number (see §3.2), title,
  description, and a capability icon plate; used in the 2-up/4-up
  capabilities grid on `/` and `/about`.
- **`SkylineFooter`** — contact links (Email, LinkedIn, GitHub, Are.na) above
  the full-bleed `toronto-skyline` plate. Lives in the root layout.
- **`TopNav`** — sticky header with six unnumbered chapter links rendered
  from `chapters` in `site.ts` (their order sets every section number — see
  §3.2), a mobile drawer below `md`, and the `ActiveMarker` expand-ring on
  the active route. Lives in the root layout.
- **`mdx-components.tsx`** — heading, paragraph, list, blockquote, code, and
  link styling for essay MDX content.

**Deleted from the retired direction:** `TapeLabelTag`, `StitchedDivider`,
`LeatherFooter`, `RedDotIndicator` — its role (marking the active/current
item) moved into `IndexRow`'s arrow and `TopNav`'s `ActiveMarker`.

## 7. Routes and content

Six nav items — `WORK / WRITING / NOTES / ABOUT / NOW / CONTACT` — across ten
routes:

| Route | Content |
|---|---|
| `/` | The contents page (§3.2): introduction `00`, featured work `01`, selected writing `02`, capabilities grid `04` (2-up mobile, 4-up at `lg`) |
| `/work` | Experience index (Wesco, Chime, Deloitte, Carnegie Mellon, Morehouse) alongside a Field Notes index |
| `/work/[slug]` | Experience detail or project case study, resolved from the same `experience`/`projects` data in `src/content/site.ts` |
| `/writing` | Long-form essay index |
| `/writing/[slug]` | Essay, rendered from MDX via `compileMDX` |
| `/notes` | Short dated field notes — a static list from `site.ts`, not MDX |
| `/about` | Philosophy plate + capabilities grid |
| `/now` | Current focus, definition-list layout |
| `/contact` | Name, role, and location above the root layout's `SkylineFooter` |

**Writing vs. Notes** are deliberately distinct. Writing is long-form and
slug-routed, backed by MDX files in `src/content/writing/*.mdx` and loaded
through `src/lib/writing.ts` (`getAllEssays`, `getEssayBySlug`, exporting
`EssayMeta` / `EssayWithContent`). Notes are short, dated log entries defined
directly as a `FieldNote[]` array in `site.ts` — no MDX loader.

**Drafts.** An essay whose body is empty after stripping frontmatter and
whitespace (e.g. a scaffolded file with just a bare `##` heading) is a draft.
`getAllEssays()` excludes drafts from every index — `/writing`, the home
page's `02 // WRITING` block, and `generateStaticParams` (so the route
simply isn't built). The file itself is never touched: it stays on disk,
under version control, and editable — finishing it is enough to make it
appear everywhere automatically. `toMeta()` also throws at build time if an
essay's `title` or `date` frontmatter is missing or malformed, naming the
offending file, rather than silently rendering an empty heading or sorting
by `NaN`.

**Legacy redirect:** `next.config.ts` 308-redirects `/notes/:slug` to
`/writing/:slug`, so the four essays that used to live under `/notes` keep
their old links working. `/notes` itself is unaffected by this rule — it's a
live route (the field-notes list), not a redirect target.

## 8. Accessibility

WCAG 2.1 AA.

- `--ink-blue` on `--paper` and `--text` on `--paper` both clear 4.5:1;
  `--accent` on `--paper` clears 4.5:1 at its shipped `#BE4528` value (see §2).
- `--accent` is never the sole carrier of meaning — arrows and active states
  also change position or weight.
- Focus rings: `2px solid var(--accent)` with `2px` offset, set globally via
  `*:focus-visible` in `globals.css`.
- The GridFrame, crop marks, side rails, and every purely decorative
  engraving (hero plates, capability icons, the footer skyline) carry
  `aria-hidden` with empty `alt`. `about-portrait`, the one content-bearing
  plate, carries real descriptive alt text.
- All six nav items are keyboard-navigable, including inside the mobile
  drawer; the active item carries `aria-current="page"`.
- A skip link (`.skip-link` in `globals.css`) is the first focusable element
  in `<body>`, visually hidden until focused, linking to `<main id="main">`
  in `src/app/layout.tsx` — so keyboard users can bypass the seven nav links
  that precede content on every route.
- A `<noscript>` style block in `layout.tsx` forces engraving plates
  (`.engraving-image` / `.engraving-veil`) and `SectionMarker` labels
  (`.section-letter`) to their final revealed state, since Framer's
  `whileInView` reveals never fire without JS — a failed JS chunk should not
  hide the entire visual direction from a sighted visitor. Assistive tech is
  unaffected either way: `SectionMarker`'s full label lives in a permanent
  `sr-only` span.

## 9. Verification

Per `CLAUDE.md`:

- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all pass.
- Every route renders and was checked against this spec's intent.
- Responsive behaviour checked structurally at the `md` (768px) and `lg`
  (1024px) Tailwind breakpoints: side rails (`hidden md:block`), the frame
  inset media query in `tokens.css`, the capabilities grid
  (`grid-cols-2 lg:grid-cols-4`), and the mobile nav drawer toggle.
- `prefers-reduced-motion: reduce` is honoured by every Framer-driven effect
  individually (each checks `useReducedMotion()` and renders its final state)
  and backstopped by a global CSS rule disabling all `animation`/`transition`.
- Total engraving payload: 1.3MB, under the 1.4MB budget.

Full rationale, including the approaches considered and rejected, lives in
`docs/superpowers/specs/2026-09-09-blue-ink-editorial-design.md`.
