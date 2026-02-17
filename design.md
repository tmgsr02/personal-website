# Personal Website Design Spec — "Analog Pop Craft"

Goal: Build a personal website that feels handcrafted and unique: paper-first editorial layout + pop-art hero moments + tactile textures (paper/burlap/leather) + a tiny red-dot "signal" indicator. Must show excellent craftsmanship, strong typography, and clean accessibility.

## 1) Tech + Constraints
- Framework: Next.js (App Router) + TypeScript
- Styling: Tailwind CSS + CSS variables (tokens)
- Animation: Framer Motion (respect prefers-reduced-motion)
- Image optimization: next/image
- No heavy UI frameworks. Keep custom components.
- Lighthouse targets: Performance 90+, Accessibility 95+

## 2) Visual DNA (Non-negotiables)
1. Paper is the default background.
2. Textures are subtle (5–12% opacity) using overlay pseudo-elements.
3. One loud element per viewport (either pop-art crop OR bold color strip).
4. Red dot is sacred: ONLY used for active/now/live/focus/hover indicators.
5. Use mono for body/UI; a bold display font for headlines.

## 3) Assets (You MUST wire these in)
Create folder: /public/textures and /public/images

Place these (user-provided) images in public:
- /public/textures/paper-fiber.png
- /public/textures/burlap.png
- /public/textures/leather-stitch.png
- /public/images/pop-room.png
- /public/images/boombox.png
- /public/images/red-dot.png (or recreate as CSS dot)

If any asset is missing, use a temporary placeholder and leave a TODO note.

## 4) Design Tokens (CSS variables)
Implement in: src/styles/tokens.css and import it in src/app/globals.css

:root tokens (do not freestyle; can add if necessary):

- --paper: #F3EBDD
- --paper-2: #EDE2D1
- --ink: #151515
- --ink-2: #2B2B2B
- --muted: #6A6A6A

- --pop-orange: #D94A2A
- --pop-mustard: #E4B12C
- --pop-blue: #2E5BFF

- --leather: #4B2A1F
- --leather-2: #6A3B2A
- --stitch: #D7B07A

- --signal-red: #FF3B30

- --border: rgba(21,21,21,0.12)
- --border-strong: rgba(21,21,21,0.22)

- --shadow-sm: 0 2px 8px rgba(0,0,0,0.08)
- --shadow-md: 0 10px 24px rgba(0,0,0,0.14)

- --r-sm: 10px
- --r-md: 16px
- --r-lg: 22px
- --r-pill: 999px

- --container: 1120px

Typography:
- --font-mono: IBM Plex Mono
- --font-display: Archivo Black (or fallback)
- --h1: clamp(40px, 5vw, 64px)
- --h2: clamp(28px, 3.2vw, 40px)
- --h3: 22px
- --body: 16px
- --small: 13px
- --lh-tight: 1.05
- --lh: 1.5

## 5) Global Styling Rules
Implement in globals.css:
- Body background: paper base + paper-fiber texture overlay at 6–10% opacity.
- Default text color: --ink
- Use max-width container with padding
- Focus rings: 2px outline in --signal-red (visible on keyboard nav)
- Reduced motion: disable parallax and cursor-follow effects

Texture overlay pattern:
- Use ::before pseudo-element with background-image: url(/textures/paper-fiber.png)
- opacity: 0.08; mix-blend-mode: multiply; pointer-events: none;

## 6) Components (Must build these exactly)
Create components in src/components:

### 6.1 RedDotIndicator
- A tiny red dot (6–8px) used for:
  - active nav item
  - hover on links (appears to the left)
  - “Now:” line
  - scroll spy (active section)
- Build as a reusable component:
  - <RedDotIndicator mode="inline|nav|hover" />

### 6.2 TopNav
- Left: Name mark (mono) + optional small red dot
- Right: links: Work, About, Notes, Contact
- Active link: red dot + underline
- Mobile: hamburger → paper drawer
- Sticky with subtle border bottom

### 6.3 SectionHeaderStrip
- A clipped print strip header with a bold background:
  - variants: orange | mustard | blue | ink
- Includes small mono kicker + large title

### 6.4 TapeLabelTag
- Cassette label style chip:
  - background: --paper-2
  - border: --border-strong
  - font: mono uppercase
  - occasional slight rotation (-1deg) but not all

### 6.5 ProjectCard
- Paper-lift card on a burlap panel background (panel belongs to the grid container)
- Content:
  - Title
  - Outcome one-liner
  - Tags (TapeLabelTag)
  - “Tracklist” bullets: Data / Model / System / Impact
  - CTA: “Open case study →”
- Hover: lift + stronger shadow + show red dot near CTA

### 6.6 FeaturedWorkGrid
- Section header + grid of 3–4 ProjectCards
- Grid responsive:
  - desktop: 3 columns if space, else 2
  - mobile: 1 column

### 6.7 ProofStrip
- Thin newspaper/footer-like band with mono text:
  “6+ yrs • Data Science + Supply Chain • SQL/Python • Power BI • Product-minded • Builder”
- Paper-2 background, top/bottom border

### 6.8 StitchedDivider
- Horizontal divider with a thin leather strip and stitch line effect
- Can be CSS-based; optionally overlay leather-stitch texture at low opacity

### 6.9 AboutPanel
- Left: short about paragraph
- Right: 4 interest tiles framed like comic panels:
  - Basketball
  - DJ/Music
  - Photography
  - Startups/Building
- Tiles: 2px ink border, subtle halftone option (very light)

### 6.10 NotesList
- List 3–5 notes with date, title, one-liner
- Hover: row highlights and red dot appears

### 6.11 LeatherFooter
- Leather texture background, stitched divider at top
- Links + email
- Text color: paper
- Hover states still use red dot

## 7) Pages + Routes
App Router pages:
- / (Home) — implements the full homepage structure
- /work — project list + filters (TapeLabelTag)
- /work/[slug] — case study template (problem/approach/results + “tracklist sidebar”)
- /about — stitched timeline spine
- /notes — list of notes
- /contact — minimal, black-ish panel with red-dot focus

## 8) Homepage Layout (Exact order)
1) TopNav
2) HeroPanel:
   - Left: H1 + subhead + CTAs + “● Now: …”
   - Right: pop-art image crop in “comic frame” (3px ink border, radius r-lg)
3) FeaturedWorkGrid (with SectionHeaderStrip)
4) ProofStrip
5) AboutPanel (preceded by StitchedDivider)
6) NotesList (SectionHeaderStrip)
7) LeatherFooter

## 9) Content Model (Use placeholder but structured)
Create src/content/site.ts with:
- name, tagline, nowLine, social links
- featuredProjects[] (title, outcome, tags, tracklist, slug)
- notes[] (title, date, summary, slug)

Claude should implement with static TS data first (no CMS).

## 10) Interaction & Motion
- Hover on cards: slight translateY(-2px) + shadow-md
- Link hover: show red dot + underline animate in
- Hero parallax: optional, subtle; must disable in reduced motion
- No distracting animations

## 11) Accessibility & Quality
- Keyboard navigable nav + drawer
- Visible focus states
- Proper heading hierarchy
- All images have alt text
- Use semantic sections: header/main/footer, nav, article
- Reduced motion support

## 12) Acceptance Criteria
- The site visually matches: paper-first, tactile textures, pop hero moment, red dot system.
- Components exist as separate files and are reusable.
- Mobile works well and looks intentional (not just stacked desktop).
- Lighthouse targets met or close with clear notes if not.

---
End of spec.
