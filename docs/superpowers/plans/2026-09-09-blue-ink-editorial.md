# Blue Ink Editorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the site's "Analog Pop Craft" visual language with the Blue Ink Editorial system — cream paper, blue copperplate engraving, hairline grid frame, six routes, seven restrained motion effects.

**Architecture:** Design tokens drive everything through CSS variables surfaced to Tailwind. A `GridFrame` SVG primitive wraps every page and provides the signature draw-on. Content is static TypeScript (`site.ts`) plus MDX essays loaded at build time. Motion is CSS transitions plus the already-installed Framer Motion, gated behind `prefers-reduced-motion`. No new runtime dependency.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript strict, Tailwind CSS 3, Framer Motion 11, next-mdx-remote, Vitest (new dev dependency, tests only).

**Spec:** `docs/superpowers/specs/2026-09-09-blue-ink-editorial-design.md`

## Global Constraints

- **Package manager is pnpm.** Never run `npm install` or `yarn`.
- **No new runtime dependency.** Vitest is a `devDependency` and must not be imported by anything under `src/app` or `src/components`.
- **TypeScript strict mode.** No `any` without a comment justifying it.
- **Colour values are fixed.** `--paper #F7F3E7`, `--paper-2 #F1ECDD`, `--ink-blue #1B3A6B`, `--ink-blue-2 #2F5A9E`, `--rule #A8BBD6`, `--rule-soft #D3DDEA`, `--text #211E1A`, `--muted #6B6459`, `--accent #C8492B`. Copy verbatim.
- **`--accent` is reserved.** It may only appear on directional arrows, the active nav marker, and hover affordances. Never a background, never a border, never decorative.
- **Three font families only.** Bodoni Moda (display), Source Serif 4 (body), IBM Plex Mono (labels). Adding a fourth is a plan violation.
- **No border radius above 2px. No box-shadows.** Depth comes from rules and ink weight.
- **Animate `transform` and `opacity` only.** Never animate layout properties.
- **Every motion effect is gated behind `prefers-reduced-motion`,** resolving to the final state instantly — not merely a shortened duration.
- **All twelve engravings already exist** in `public/engravings/*.webp`. Do not regenerate them.
- **Every engraving is decorative:** `alt=""` and `aria-hidden` unless it carries information.
- Commit after every task. Conventional commit prefixes (`feat:`, `refactor:`, `test:`, `chore:`, `docs:`).

---

## File Structure

**Created**

| File | Responsibility |
|---|---|
| `vitest.config.ts` | Vitest config with the `@/` path alias |
| `src/styles/tokens.test.ts` | Asserts token values and WCAG contrast pairs against the real CSS file |
| `src/lib/motion.ts` | Shared duration and easing constants |
| `src/components/GridFrame.tsx` | Hairline frame, crop marks, draw-on |
| `src/components/SideRail.tsx` | Stacked vertical caps text in the frame margin |
| `src/components/SectionMarker.tsx` | `03 // PHILOSOPHY` label |
| `src/components/EngravingPlate.tsx` | `next/image` wrapper owning the ink-reveal sweep |
| `src/components/IndexList.tsx` | Context provider enabling sibling dimming |
| `src/components/IndexRow.tsx` | Numbered index row with slide arrow |
| `src/components/CapabilityCard.tsx` | Capability tile with isometric plate |
| `src/components/SkylineFooter.tsx` | Contact block above the full-bleed skyline |
| `src/lib/writing.ts` | MDX essay loader (replaces `notes.ts`) |
| `src/lib/writing.test.ts` | Asserts the loader reads and sorts the real MDX files |
| `src/content/site.test.ts` | Asserts content data shape and referential integrity |
| `scripts/new-essay.ts` | Essay scaffolding (replaces `new-note.ts`) |
| `src/app/writing/page.tsx`, `src/app/writing/[slug]/page.tsx` | Essay index and detail |
| `src/app/now/page.tsx` | Current focus |

**Modified:** `src/styles/tokens.css`, `src/app/globals.css`, `tailwind.config.ts`, `src/app/layout.tsx`, `next.config.ts`, `package.json`, `src/content/site.ts`, `src/components/TopNav.tsx`, `design.md`, and every route under `src/app`.

**Deleted:** `src/components/TapeLabelTag.tsx`, `StitchedDivider.tsx`, `LeatherFooter.tsx`, `RedDotIndicator.tsx`, `ProofStrip.tsx`, `SectionHeaderStrip.tsx`, `HeroPanel.tsx`, `AboutPanel.tsx`, `FeaturedWorkGrid.tsx`, `NotesList.tsx`, `NotesListPage.tsx`, `ProjectCard.tsx`, `src/lib/notes.ts`, `scripts/new-note.ts`, `src/app/notes/[slug]/`.

**Moved:** `src/content/notes/*.mdx` → `src/content/writing/*.mdx` (4 files, `git mv`).

**Archived:** `public/textures/`, `public/images/` → `public/_archive/`.

---

## Task 1: Test harness and design tokens

**Files:**
- Create: `vitest.config.ts`
- Create: `src/styles/tokens.test.ts`
- Modify: `src/styles/tokens.css` (full rewrite)
- Modify: `tailwind.config.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: nothing.
- Produces: the CSS custom properties every later task reads, and the Tailwind names `paper`, `paper-2`, `ink-blue`, `ink-blue-2`, `rule`, `rule-soft`, `text`, `muted`, `accent`.

- [ ] **Step 1: Install Vitest**

```bash
pnpm add -D vitest@^2.1.8
```

- [ ] **Step 2: Add the test script**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 4: Write the failing token test**

Create `src/styles/tokens.test.ts`. This reads the real CSS file so the test cannot drift from the source of truth.

```ts
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const css = fs.readFileSync(
  path.join(process.cwd(), 'src/styles/tokens.css'),
  'utf-8'
);

function token(name: string): string {
  const match = css.match(new RegExp(`--${name}\\s*:\\s*([^;]+);`));
  if (!match) throw new Error(`Token --${name} not found in tokens.css`);
  return match[1].trim();
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('design tokens', () => {
  it('defines the locked palette verbatim', () => {
    expect(token('paper')).toBe('#F7F3E7');
    expect(token('paper-2')).toBe('#F1ECDD');
    expect(token('ink-blue')).toBe('#1B3A6B');
    expect(token('ink-blue-2')).toBe('#2F5A9E');
    expect(token('rule')).toBe('#A8BBD6');
    expect(token('rule-soft')).toBe('#D3DDEA');
    expect(token('text')).toBe('#211E1A');
    expect(token('muted')).toBe('#6B6459');
    expect(token('accent')).toBe('#C8492B');
  });

  it('meets WCAG AA 4.5:1 for body text on paper', () => {
    expect(contrast(token('text'), token('paper'))).toBeGreaterThanOrEqual(4.5);
  });

  it('meets WCAG AA 4.5:1 for display ink on paper', () => {
    expect(contrast(token('ink-blue'), token('paper'))).toBeGreaterThanOrEqual(4.5);
  });

  it('meets WCAG AA 4.5:1 for the accent on paper', () => {
    expect(contrast(token('accent'), token('paper'))).toBeGreaterThanOrEqual(4.5);
  });

  it('meets WCAG AA 4.5:1 for muted text on paper', () => {
    expect(contrast(token('muted'), token('paper'))).toBeGreaterThanOrEqual(4.5);
  });

  it('retires every Analog Pop Craft token', () => {
    for (const dead of [
      'pop-orange', 'pop-mustard', 'pop-blue',
      'leather', 'stitch', 'signal-red',
      'newsprint', 'aged-paper',
      'shadow-sm', 'shadow-md',
      'r-md', 'r-lg', 'r-pill',
    ]) {
      expect(css).not.toContain(`--${dead}:`);
    }
  });
});
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `pnpm test`
Expected: FAIL — `Token --paper-2 not found` or the palette assertion fails, because `tokens.css` still holds the old values.

- [ ] **Step 6: Rewrite `src/styles/tokens.css`**

Replace the entire file:

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
  --accent: #C8492B;

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

- [ ] **Step 7: Run the test to verify it passes**

Run: `pnpm test`
Expected: PASS, 6 tests.

If a contrast assertion fails, do **not** loosen the assertion. Darken the offending token and report the change — the palette is locked but WCAG AA is not negotiable.

- [ ] **Step 8: Rewrite the Tailwind theme**

In `tailwind.config.ts`, replace the whole `theme.extend` block:

```ts
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        paper: 'var(--paper)',
        'paper-2': 'var(--paper-2)',
        'ink-blue': 'var(--ink-blue)',
        'ink-blue-2': 'var(--ink-blue-2)',
        rule: 'var(--rule)',
        'rule-soft': 'var(--rule-soft)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
      },
      borderColor: {
        DEFAULT: 'var(--rule)',
        soft: 'var(--rule-soft)',
      },
      borderRadius: {
        sm: 'var(--r-sm)',
      },
      maxWidth: {
        container: 'var(--container)',
      },
      letterSpacing: {
        display: 'var(--tracking-display)',
        label: 'var(--tracking-label)',
      },
      transitionTimingFunction: {
        enter: 'cubic-bezier(0.22, 1, 0.36, 1)',
        exit: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
```

Note there is no `boxShadow` key — shadows are retired.

- [ ] **Step 9: Verify types and lint still pass**

Run: `pnpm typecheck && pnpm lint`
Expected: both pass. Components still referencing dead Tailwind names (`bg-leather` etc.) will not error here because Tailwind silently drops unknown classes — those are cleaned up in Tasks 8 and 9.

- [ ] **Step 10: Commit**

```bash
git add vitest.config.ts src/styles/tokens.css src/styles/tokens.test.ts tailwind.config.ts package.json pnpm-lock.yaml
git commit -m "feat: replace design tokens with Blue Ink Editorial palette

Adds Vitest and asserts the locked palette plus four WCAG AA contrast
pairs against the real tokens.css, so the palette cannot drift silently.
Retires every Analog Pop Craft token, both shadows, and all radii above 2px."
```

---

## Task 2: Fonts and global styles

**Files:**
- Modify: `src/app/layout.tsx:1-20`
- Modify: `src/app/globals.css` (full rewrite)

**Interfaces:**
- Consumes: the CSS variables from Task 1.
- Produces: the `.container` and `.paper-grain` classes, plus base element styling every page relies on. Font variables `--font-display`, `--font-body`, `--font-mono` are bound to the `<html>` element.

- [ ] **Step 1: Swap the font imports in `layout.tsx`**

Replace the import and both font constants at the top of the file:

```tsx
import { IBM_Plex_Mono, Bodoni_Moda, Source_Serif_4 } from 'next/font/google';

const bodoniModa = Bodoni_Moda({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display-loaded',
});

const sourceSerif = Source_Serif_4({
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body-loaded',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono-loaded',
});
```

Then update the `<html>` element:

```tsx
    <html
      lang="en"
      className={`${bodoniModa.variable} ${sourceSerif.variable} ${ibmPlexMono.variable}`}
    >
```

The `-loaded` suffix exists so `next/font` owns its own variables while `tokens.css` keeps the fallback stacks. Task 2 Step 2 bridges them.

- [ ] **Step 2: Rewrite `src/app/globals.css`**

Replace the entire file:

```css
@import '../styles/tokens.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Bridge next/font's generated variables into the token families. */
  :root {
    --font-display: var(--font-display-loaded), 'Didot', Georgia, serif;
    --font-body: var(--font-body-loaded), Georgia, serif;
    --font-mono: var(--font-mono-loaded), 'Courier New', monospace;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    position: relative;
    min-height: 100vh;
    background-color: var(--paper);
    color: var(--text);
    font-family: var(--font-body);
    font-size: var(--body);
    line-height: var(--lh);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Paper grain. SVG turbulence, not a raster: smaller and resolution
     independent. Sits above the page, below nothing interactive. */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23g)'/%3E%3C/svg%3E");
  }

  h1, h2, h3 {
    font-family: var(--font-display);
    color: var(--ink-blue);
    line-height: var(--lh-tight);
    letter-spacing: var(--tracking-display);
    text-wrap: balance;
  }

  h1 { font-size: var(--display-xl); }
  h2 { font-size: var(--h2); }
  h3 { font-size: var(--h3); font-weight: 500; }

  p { text-wrap: pretty; }

  a {
    color: inherit;
    text-decoration: none;
  }

  *:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  /* Reduced motion resolves to the FINAL state instantly, rather than
     merely shortening durations. */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
  }
}

@layer components {
  .container {
    max-width: var(--container);
    margin-inline: auto;
    padding-inline: var(--gutter);
  }

  /* Wide-tracked mono caps label. The site's connective tissue. */
  .label {
    font-family: var(--font-mono);
    font-size: var(--label);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
    color: var(--ink-blue);
  }
}
```

- [ ] **Step 3: Verify the app still builds**

Run: `pnpm build`
Expected: succeeds. Pages will look broken — old components reference retired tokens — but the build must not error.

- [ ] **Step 4: Archive the retired assets**

```bash
mkdir -p public/_archive
git mv public/textures public/_archive/textures
git mv public/images public/_archive/images
```

- [ ] **Step 5: Confirm nothing still references the archived paths at runtime**

Run: `grep -rn "/textures/\|/images/" src/ || echo "clean"`
Expected: `clean`. If any hits appear they are in components deleted in Task 9 — note them and continue.

- [ ] **Step 6: Commit**

```bash
git add -A src/app/layout.tsx src/app/globals.css public
git commit -m "feat: load editorial typefaces and rewrite global styles

Bodoni Moda for display, Source Serif 4 for body, IBM Plex Mono for
labels. Paper grain becomes an inline SVG turbulence filter rather than
a raster texture. Reduced motion now resolves to the final state
instantly instead of shortening durations. Archives the pop-art textures."
```

---

## Task 3: Motion constants

**Files:**
- Create: `src/lib/motion.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `DURATION` (`{ micro: 0.18, entrance: 0.7, frame: 0.9 }`, seconds), `EASE` (`{ enter: readonly [number, number, number, number], exit: readonly [...] }`), and `enterTransition(delay?: number)` returning a Framer Motion `Transition`. Tasks 4, 5, 6 and 8 all import from here.

- [ ] **Step 1: Create `src/lib/motion.ts`**

```ts
import type { Transition } from 'framer-motion';

/** Seconds. Mirrors --dur-* in tokens.css. */
export const DURATION = {
  micro: 0.18,
  entrance: 0.7,
  frame: 0.9,
} as const;

/** Mirrors --ease-* in tokens.css. */
export const EASE = {
  enter: [0.22, 1, 0.36, 1],
  exit: [0.4, 0, 0.2, 1],
} as const;

export function enterTransition(delay = 0): Transition {
  return {
    duration: DURATION.entrance,
    ease: EASE.enter,
    delay,
  };
}
```

- [ ] **Step 2: Verify types**

Run: `pnpm typecheck`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/lib/motion.ts
git commit -m "feat: add shared motion duration and easing constants"
```

---

## Task 4: GridFrame and SideRail

**Files:**
- Create: `src/components/SideRail.tsx`
- Create: `src/components/GridFrame.tsx`

**Interfaces:**
- Consumes: `DURATION`, `EASE` from `@/lib/motion`.
- Produces:
  - `<SideRail side="left" | "right" lines={string[]} />`
  - `<GridFrame railLeft?: string[]; railRight?: string[]; children: React.ReactNode />`

  `GridFrame` renders its children inside the frame. Every page in Tasks 10-12 wraps its content in exactly one `GridFrame`.

- [ ] **Step 1: Create `src/components/SideRail.tsx`**

```tsx
import React from 'react';

interface SideRailProps {
  side: 'left' | 'right';
  lines: string[];
}

/**
 * Stacked wide-tracked caps text running down the frame margin.
 * Decorative — hidden from assistive tech and below the md breakpoint.
 */
export default function SideRail({ side, lines }: SideRailProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        'pointer-events-none absolute top-24 hidden select-none md:block',
        side === 'left' ? 'left-0' : 'right-0',
      ].join(' ')}
      style={{ width: 'var(--frame-inset)' }}
    >
      <div className="flex flex-col items-center gap-1">
        {lines.map((line) => (
          <span
            key={line}
            className="label text-[9px] leading-tight"
            style={{ writingMode: 'vertical-rl' }}
          >
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/GridFrame.tsx`**

The frame is real SVG so it can genuinely stroke itself in. `pathLength={1}` normalises every line to a length of 1, so one `strokeDashoffset` animation drives all of them regardless of viewport size.

```tsx
'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DURATION, EASE } from '@/lib/motion';
import SideRail from './SideRail';

interface GridFrameProps {
  railLeft?: string[];
  railRight?: string[];
  children: React.ReactNode;
}

/** A corner crop mark. Four short strokes forming a plus. */
function CropMark({ x, y }: { x: string; y: string }) {
  return (
    <g stroke="var(--rule)" strokeWidth="1" vectorEffect="non-scaling-stroke">
      <line x1={x} y1={`calc(${y} - 6px)`} x2={x} y2={`calc(${y} + 6px)`} />
      <line x1={`calc(${x} - 6px)`} y1={y} x2={`calc(${x} + 6px)`} y2={y} />
    </g>
  );
}

export default function GridFrame({
  railLeft,
  railRight,
  children,
}: GridFrameProps) {
  const reduced = useReducedMotion();

  return (
    <div className="relative min-h-screen">
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 h-full w-full"
        fill="none"
      >
        <motion.rect
          x="var(--frame-inset)"
          y="var(--frame-inset)"
          width="calc(100% - var(--frame-inset) * 2)"
          height="calc(100% - var(--frame-inset) * 2)"
          stroke="var(--rule)"
          strokeWidth="1"
          pathLength={1}
          initial={reduced ? false : { strokeDashoffset: 1 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: DURATION.frame, ease: EASE.enter }}
          style={{ strokeDasharray: 1 }}
        />
        <CropMark x="var(--frame-inset)" y="var(--frame-inset)" />
        <CropMark x="calc(100% - var(--frame-inset))" y="var(--frame-inset)" />
        <CropMark x="var(--frame-inset)" y="calc(100% - var(--frame-inset))" />
        <CropMark
          x="calc(100% - var(--frame-inset))"
          y="calc(100% - var(--frame-inset))"
        />
      </svg>

      {railLeft && <SideRail side="left" lines={railLeft} />}
      {railRight && <SideRail side="right" lines={railRight} />}

      <div className="relative z-[2]">{children}</div>
    </div>
  );
}
```

- [ ] **Step 3: Verify types and lint**

Run: `pnpm typecheck && pnpm lint`
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/GridFrame.tsx src/components/SideRail.tsx
git commit -m "feat: add GridFrame and SideRail primitives

The frame is inline SVG rather than CSS borders so it can stroke itself
in on load. pathLength=1 normalises every edge so a single
strokeDashoffset drives the draw regardless of viewport size."
```

---

## Task 5: SectionMarker and EngravingPlate

**Files:**
- Create: `src/components/SectionMarker.tsx`
- Create: `src/components/EngravingPlate.tsx`

**Interfaces:**
- Consumes: `DURATION`, `EASE` from `@/lib/motion`.
- Produces:
  - `<SectionMarker index={number} label={string} />` — renders `03 // PHILOSOPHY`
  - `<EngravingPlate src={string} alt={string} width={number} height={number} priority?: boolean className?: string />`

- [ ] **Step 1: Create `src/components/SectionMarker.tsx`**

Implements the Text Reveal effect: the label reveals per-letter on scroll-in, 18ms stagger.

```tsx
'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DURATION, EASE } from '@/lib/motion';

interface SectionMarkerProps {
  index: number;
  label: string;
}

export default function SectionMarker({ index, label }: SectionMarkerProps) {
  const reduced = useReducedMotion();
  const padded = String(index).padStart(2, '0');
  const letters = Array.from(label);

  return (
    <p className="label mb-8 flex items-center gap-3">
      <span>{padded}</span>
      <span aria-hidden="true" className="text-rule">//</span>
      {/* The full label stays readable to assistive tech; the per-letter
          spans are decorative sequencing only. */}
      <span className="sr-only">{label}</span>
      <span aria-hidden="true">
        {letters.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            className="inline-block whitespace-pre"
            initial={reduced ? false : { opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{
              duration: DURATION.micro,
              ease: EASE.enter,
              delay: i * 0.018,
            }}
          >
            {char}
          </motion.span>
        ))}
      </span>
    </p>
  );
}
```

- [ ] **Step 2: Create `src/components/EngravingPlate.tsx`**

Implements the ink-reveal signature: a soft gradient mask sweeps across, so the engraving appears to arrive as ink.

```tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { DURATION, EASE } from '@/lib/motion';

interface EngravingPlateProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

/**
 * Wraps next/image and owns the ink-reveal sweep, so no page composes
 * that animation by hand.
 *
 * A true stroke draw-on would need the raster traced to vector; dense
 * crosshatch traces to 20k+ paths and multi-MB SVGs. The mask sweep
 * reads as ink arriving and costs one CSS property.
 */
export default function EngravingPlate({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
}: EngravingPlateProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={`relative ${className}`}
      initial={
        reduced
          ? false
          : { WebkitMaskPosition: '120% 0%', maskPosition: '120% 0%', opacity: 0.2 }
      }
      whileInView={{
        WebkitMaskPosition: '0% 0%',
        maskPosition: '0% 0%',
        opacity: 1,
      }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: DURATION.entrance, ease: EASE.enter }}
      style={
        reduced
          ? undefined
          : {
              WebkitMaskImage:
                'linear-gradient(100deg, #000 35%, rgba(0,0,0,0.35) 55%, transparent 72%)',
              maskImage:
                'linear-gradient(100deg, #000 35%, rgba(0,0,0,0.35) 55%, transparent 72%)',
              WebkitMaskSize: '260% 100%',
              maskSize: '260% 100%',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
            }
      }
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        aria-hidden={alt === '' ? true : undefined}
        className="h-auto w-full"
        sizes="(max-width: 768px) 100vw, 60vw"
      />
    </motion.div>
  );
}
```

- [ ] **Step 3: Verify types and lint**

Run: `pnpm typecheck && pnpm lint`
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/SectionMarker.tsx src/components/EngravingPlate.tsx
git commit -m "feat: add SectionMarker and EngravingPlate

SectionMarker carries the per-letter text reveal with the real label
kept in an sr-only span. EngravingPlate owns the ink-reveal mask sweep
so no page composes that animation by hand."
```

---

## Task 6: IndexList and IndexRow

**Files:**
- Create: `src/components/IndexList.tsx`
- Create: `src/components/IndexRow.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks beyond tokens.
- Produces:
  - `<IndexList children={React.ReactNode} className?: string />` — provides hover context
  - `<IndexRow id={string} index={string} title={string} subtitle?: string href={string} />`

  Tasks 10, 11 and 12 render `IndexRow` children inside a single `IndexList`.

- [ ] **Step 1: Create `src/components/IndexList.tsx`**

Sibling dimming needs shared state, so the list owns which row is hovered.

```tsx
'use client';

import React, { createContext, useContext, useState } from 'react';

interface IndexListContextValue {
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}

const IndexListContext = createContext<IndexListContextValue>({
  hoveredId: null,
  setHoveredId: () => {},
});

export function useIndexList(): IndexListContextValue {
  return useContext(IndexListContext);
}

interface IndexListProps {
  children: React.ReactNode;
  className?: string;
}

export default function IndexList({ children, className = '' }: IndexListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <IndexListContext.Provider value={{ hoveredId, setHoveredId }}>
      <ul className={className} onMouseLeave={() => setHoveredId(null)}>
        {children}
      </ul>
    </IndexListContext.Provider>
  );
}
```

- [ ] **Step 2: Create `src/components/IndexRow.tsx`**

Carries two effects: the slide arrow, and participation in sibling dimming. Dimming uses **opacity, not blur** — a per-row `filter: blur()` forces a repaint of every sibling on every hover and visibly janks a long list.

```tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useIndexList } from './IndexList';

interface IndexRowProps {
  id: string;
  index: string;
  title: string;
  subtitle?: string;
  href: string;
}

export default function IndexRow({
  id,
  index,
  title,
  subtitle,
  href,
}: IndexRowProps) {
  const { hoveredId, setHoveredId } = useIndexList();
  const dimmed = hoveredId !== null && hoveredId !== id;

  return (
    <li
      className="border-b border-rule-soft"
      onMouseEnter={() => setHoveredId(id)}
    >
      <Link
        href={href}
        className="group flex items-center gap-5 py-5 transition-opacity duration-[--dur-micro] ease-enter"
        style={{ opacity: dimmed ? 0.45 : 1 }}
        onFocus={() => setHoveredId(id)}
        onBlur={() => setHoveredId(null)}
      >
        <span className="label w-8 shrink-0 text-muted">{index}</span>

        <span className="min-w-0 flex-1">
          <span className="block font-display text-[clamp(20px,2.4vw,30px)] leading-tight text-ink-blue">
            {title}
          </span>
          {subtitle && (
            <span className="label mt-1 block text-muted">{subtitle}</span>
          )}
        </span>

        <span
          aria-hidden="true"
          className="shrink-0 text-xl text-accent transition-transform duration-[--dur-micro] ease-enter group-hover:translate-x-1 group-focus-visible:translate-x-1"
        >
          &rarr;
        </span>
      </Link>
    </li>
  );
}
```

- [ ] **Step 3: Verify types and lint**

Run: `pnpm typecheck && pnpm lint`
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/IndexList.tsx src/components/IndexRow.tsx
git commit -m "feat: add IndexList and IndexRow with slide arrow and sibling dimming

Dimming is opacity rather than filter blur: a per-row blur repaints
every sibling on each hover and janks visibly on a long index."
```

---

## Task 7: Content migration

**Files:**
- Create: `src/lib/writing.ts`
- Create: `src/lib/writing.test.ts`
- Create: `src/content/site.test.ts`
- Create: `scripts/new-essay.ts`
- Move: `src/content/notes/*.mdx` → `src/content/writing/*.mdx`
- Modify: `src/content/site.ts` (full rewrite)
- Modify: `next.config.ts`
- Modify: `package.json`
- Delete: `src/lib/notes.ts`, `scripts/new-note.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `getAllEssays(): EssayMeta[]` — sorted newest first
  - `getEssayBySlug(slug: string): EssayWithContent | null`
  - `EssayMeta { slug, title, date, summary, tags, readingTime }`
  - `EssayWithContent extends EssayMeta { content: string }`
  - From `site.ts`: `siteConfig`, `experience: Experience[]`, `projects: Project[]`, `fieldNotes: FieldNote[]`, `capabilities: Capability[]`, `nowItems: NowItem[]`

- [ ] **Step 1: Move the MDX files**

```bash
mkdir -p src/content/writing
git mv src/content/notes/2026-goals-and-aspirations.mdx src/content/writing/
git mv src/content/notes/early-warning-systems.mdx src/content/writing/
git mv src/content/notes/from-dashboard-to-decision-system.mdx src/content/writing/
git mv src/content/notes/building-realestatevalueiq.mdx src/content/writing/
rmdir src/content/notes
```

- [ ] **Step 2: Write the failing loader test**

Create `src/lib/writing.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { getAllEssays, getEssayBySlug } from '@/lib/writing';

describe('getAllEssays', () => {
  it('finds every migrated essay', () => {
    const essays = getAllEssays();
    expect(essays.length).toBe(4);
  });

  it('sorts newest first', () => {
    const dates = getAllEssays().map((e) => new Date(e.date).getTime());
    const sorted = [...dates].sort((a, b) => b - a);
    expect(dates).toEqual(sorted);
  });

  it('gives every essay a non-empty title and slug', () => {
    for (const essay of getAllEssays()) {
      expect(essay.slug).not.toBe('');
      expect(essay.title).toBeTruthy();
    }
  });
});

describe('getEssayBySlug', () => {
  it('returns content for a known slug', () => {
    const essay = getEssayBySlug('early-warning-systems');
    expect(essay).not.toBeNull();
    expect(essay?.content.length).toBeGreaterThan(0);
  });

  it('returns null for an unknown slug', () => {
    expect(getEssayBySlug('does-not-exist')).toBeNull();
  });

  it('does not traverse outside the writing directory', () => {
    expect(getEssayBySlug('../../../etc/passwd')).toBeNull();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm test src/lib/writing.test.ts`
Expected: FAIL — cannot resolve `@/lib/writing`.

- [ ] **Step 4: Create `src/lib/writing.ts`**

This is `notes.ts` renamed, with one addition: slug sanitisation, because `getEssayBySlug` takes a value straight from the URL.

```ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const WRITING_DIR = path.join(process.cwd(), 'src/content/writing');

export interface EssayMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readingTime: string;
}

export interface EssayWithContent extends EssayMeta {
  content: string;
}

/** Slugs come from the URL, so reject anything that is not a bare slug. */
function isSafeSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]*$/i.test(slug);
}

function toMeta(slug: string, raw: string): EssayWithContent {
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title,
    date: data.date,
    summary: data.summary ?? '',
    tags: data.tags ?? [],
    readingTime: `${Math.ceil(stats.minutes)} min`,
    content,
  };
}

export function getAllEssays(): EssayMeta[] {
  const files = fs.readdirSync(WRITING_DIR).filter((f) => f.endsWith('.mdx'));

  const essays = files.map((filename): EssayMeta => {
    const slug = filename.replace(/\.mdx$/, '');
    const raw = fs.readFileSync(path.join(WRITING_DIR, filename), 'utf-8');
    const { content, ...meta } = toMeta(slug, raw);
    void content;
    return meta;
  });

  return essays.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getEssayBySlug(slug: string): EssayWithContent | null {
  if (!isSafeSlug(slug)) return null;

  const filePath = path.join(WRITING_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  return toMeta(slug, fs.readFileSync(filePath, 'utf-8'));
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm test src/lib/writing.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 6: Write the failing content test**

Create `src/content/site.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  siteConfig,
  experience,
  projects,
  fieldNotes,
  capabilities,
  nowItems,
} from '@/content/site';

describe('site content', () => {
  it('lists the five experience entries from the reference plates', () => {
    expect(experience.map((e) => e.org)).toEqual([
      'Wesco',
      'Chime',
      'Deloitte',
      'Carnegie Mellon',
      'Morehouse',
    ]);
  });

  it('gives every experience entry a unique slug', () => {
    const slugs = experience.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('only references projects that exist', () => {
    const projectSlugs = new Set(projects.map((p) => p.slug));
    for (const entry of experience) {
      for (const slug of entry.projects) {
        expect(projectSlugs.has(slug)).toBe(true);
      }
    }
  });

  it('has exactly four capabilities, each with an existing plate', () => {
    expect(capabilities).toHaveLength(4);
    for (const cap of capabilities) {
      expect(cap.icon).toMatch(/^\/engravings\/cap-[a-z-]+\.webp$/);
    }
  });

  it('has field notes with unique ids', () => {
    const ids = fieldNotes.map((n) => n.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has a now line and at least one now item', () => {
    expect(siteConfig.nowLine.length).toBeGreaterThan(0);
    expect(nowItems.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 7: Run the test to verify it fails**

Run: `pnpm test src/content/site.test.ts`
Expected: FAIL — `experience`, `fieldNotes`, `capabilities` and `nowItems` are not exported yet.

- [ ] **Step 8: Rewrite `src/content/site.ts`**

Replace the entire file. Prose is drawn from the approved reference plates.

```ts
// src/content/site.ts

/* ======================================================
   Site metadata
====================================================== */

export const siteConfig = {
  name: 'Miguel Twahirwa',
  role: 'Data scientist, product builder, and perpetually curious person',
  location: 'Toronto',
  tagline: 'Ideas to systems to impact',
  email: 'hello@migueltwahirwa.com',

  hero: {
    headline: 'Understand before you optimize',
    subhead:
      'The interesting problems usually begin before the model. What are we actually trying to change, what evidence matters, and what assumptions are worth testing?',
    secondary:
      'I like working where analysis, product thinking, and making intersect. Simplify the system, test what matters, and build something useful.',
  },

  nowLine:
    'Building RealEstateValueIQ, productizing an on-time delivery early-warning system, and experimenting with AI-driven music workflows.',

  social: {
    linkedin: 'https://linkedin.com/in/migueltwahirwa',
    github: 'https://github.com/migueltwahirwa',
    arena: 'https://are.na/migueltwahirwa',
  },
} as const;

/* ======================================================
   Capabilities
====================================================== */

export interface Capability {
  index: string;
  title: string;
  description: string;
  icon: string;
}

export const capabilities: Capability[] = [
  {
    index: '01',
    title: 'Applied AI + ML',
    description: 'Models and intelligent systems built around real problems.',
    icon: '/engravings/cap-applied-ai.webp',
  },
  {
    index: '02',
    title: 'Product + Analytics',
    description: 'Experimentation, metrics, causal thinking, and decisions.',
    icon: '/engravings/cap-product-analytics.webp',
  },
  {
    index: '03',
    title: 'Data Systems',
    description: 'Reliable analytical foundations from messy, fragmented data.',
    icon: '/engravings/cap-data-systems.webp',
  },
  {
    index: '04',
    title: 'Building',
    description: 'From rough idea to product, prototype, and experience.',
    icon: '/engravings/cap-building.webp',
  },
];

/* ======================================================
   Projects
====================================================== */

export interface Project {
  slug: string;
  title: string;
  outcome: string;
  tags: string[];
  tracklist: {
    data?: string;
    model?: string;
    system?: string;
    impact?: string;
  };
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: 'on-time-delivery-early-warning',
    title: 'On-Time Delivery Early Warning System',
    outcome:
      'Detected KPI degradation before it surfaced in reports, enabling faster intervention.',
    tags: ['XGBoost', 'FastAPI', 'Power BI', 'Monitoring'],
    tracklist: {
      data: 'Shipment, lead-time, and fulfillment metrics across the network',
      model: 'Gradient-boosted early-warning classifier',
      system: 'FastAPI service and Power BI alerts',
      impact: 'Reduced surprise KPI drops and firefighting',
    },
    featured: true,
  },
  {
    slug: 'network-fill-rate-kpi-rebuild',
    title: 'Network Fill Rate / YTD KPI Rebuild',
    outcome:
      'Rebuilt KPI logic to correctly handle zero-activity and late-arriving data.',
    tags: ['DAX', 'Power BI', 'Dimensional Modeling'],
    tracklist: {
      data: 'Distribution center shipment history',
      model: 'Deterministic KPI logic with edge-case handling',
      system: 'Power BI semantic model',
      impact: 'Accurate reporting across all slices',
    },
    featured: true,
  },
  {
    slug: 'xls-to-csv-power-automate',
    title: 'XLS to CSV Conversion Pipeline',
    outcome:
      'Automated reliable file conversion under strict enterprise constraints.',
    tags: ['Power Automate', 'Parsing', 'Automation'],
    tracklist: {
      data: 'Inbound XLS attachments',
      system: 'Power Automate cloud flows',
      impact: 'Eliminated manual file handling',
    },
  },
  {
    slug: 'realestatevalueiq-platform',
    title: 'RealEstateValueIQ Platform',
    outcome: 'Built interactive real estate investment tools and data workflows.',
    tags: ['Next.js', 'Supabase', 'Analytics', 'Product'],
    tracklist: {
      data: 'Property, market, and financial datasets',
      system: 'Web app, calculators, and scoring logic',
      impact: 'Faster deal evaluation and decision-making',
    },
    featured: true,
  },
];

/* ======================================================
   Experience — powers /work and /work/[slug]
====================================================== */

export interface Experience {
  slug: string;
  org: string;
  disciplines: string[];
  period: string;
  summary: string;
  /** Slugs from `projects`. Asserted in site.test.ts. */
  projects: string[];
}

export const experience: Experience[] = [
  {
    slug: 'wesco',
    org: 'Wesco',
    disciplines: ['Supply Chain', 'Operations', 'Data Science'],
    period: '2022 — Present',
    summary:
      'Analytics and machine learning across a distribution network: early-warning systems for delivery performance, KPI foundations that hold up under messy data, and automation that removes manual handling.',
    projects: [
      'on-time-delivery-early-warning',
      'network-fill-rate-kpi-rebuild',
      'xls-to-csv-power-automate',
    ],
  },
  {
    slug: 'chime',
    org: 'Chime',
    disciplines: ['Product', 'Customer Analytics'],
    period: '2021 — 2022',
    summary:
      'Customer analytics and experimentation in consumer fintech — understanding behaviour well enough to know which changes were worth making.',
    projects: [],
  },
  {
    slug: 'deloitte',
    org: 'Deloitte',
    disciplines: ['Technology', 'Consulting'],
    period: '2019 — 2021',
    summary:
      'Technology consulting across client engagements: turning ambiguous business problems into systems that could actually be operated.',
    projects: [],
  },
  {
    slug: 'carnegie-mellon',
    org: 'Carnegie Mellon',
    disciplines: ['Information Systems', 'Analytics'],
    period: 'Graduate study',
    summary:
      'Information systems and analytics — the formal grounding underneath the practical work.',
    projects: [],
  },
  {
    slug: 'morehouse',
    org: 'Morehouse',
    disciplines: ['Chemistry', 'Mathematics'],
    period: 'Undergraduate study',
    summary:
      'Chemistry and mathematics. Where the habit of asking better questions before reaching for a method started.',
    projects: [],
  },
];

/* ======================================================
   Field notes — short entries, powers /notes
====================================================== */

export interface FieldNote {
  id: string;
  title: string;
  date: string;
  summary: string;
  href?: string;
}

export const fieldNotes: FieldNote[] = [
  {
    id: '001',
    title: 'Lineup',
    date: '2026-08-14',
    summary: 'Sequencing a set, and what it taught me about ordering a roadmap.',
  },
  {
    id: '002',
    title: 'Built North',
    date: '2026-07-02',
    summary: 'Notes on building from Toronto rather than despite it.',
  },
  {
    id: '003',
    title: 'Voice AI Toronto',
    date: '2026-05-19',
    summary: 'What the local voice-AI scene is actually shipping.',
  },
  {
    id: '004',
    title: 'ML Experiments',
    date: '2026-04-08',
    summary: 'Small models, honest baselines, and the results worth keeping.',
  },
  {
    id: '005',
    title: 'Interface Studies',
    date: '2026-02-21',
    summary: 'Interfaces I keep returning to, and why they hold up.',
  },
  {
    id: '006',
    title: 'Photography',
    date: '2026-01-30',
    summary: 'Composition, light, and timing — the same problem as good analysis.',
  },
];

/* ======================================================
   Now — powers /now
====================================================== */

export interface NowItem {
  label: string;
  value: string;
}

export const nowItems: NowItem[] = [
  {
    label: 'Building',
    value: 'RealEstateValueIQ — investment tooling and data workflows.',
  },
  {
    label: 'Shipping',
    value: 'Productizing the on-time delivery early-warning system.',
  },
  {
    label: 'Experimenting',
    value: 'AI-driven music workflows and transition tooling.',
  },
  {
    label: 'Reading',
    value: 'Systems thinking, causal inference, and interface history.',
  },
];

export type SiteConfig = typeof siteConfig;
```

- [ ] **Step 9: Run the content test to verify it passes**

Run: `pnpm test src/content/site.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 10: Create `scripts/new-essay.ts`**

This is `new-note.ts` with the directory and wording changed.

```ts
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { execSync } from 'child_process';

const WRITING_DIR = path.join(process.cwd(), 'src/content/writing');

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

async function main() {
  const title = await ask('Essay title: ');
  if (!title) {
    console.error('Title is required.');
    process.exit(1);
  }

  const slug = slugify(title);
  const date = today();
  const filePath = path.join(WRITING_DIR, `${slug}.mdx`);

  if (fs.existsSync(filePath)) {
    console.error(`File already exists: ${filePath}`);
    process.exit(1);
  }

  const content = `---
title: "${title}"
date: "${date}"
summary: ""
tags: []
---

##
`;

  fs.mkdirSync(WRITING_DIR, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Created: ${filePath}`);

  try {
    execSync(`code "${filePath}"`);
  } catch {
    // VS Code not available — no problem
  }

  rl.close();
}

main();
```

- [ ] **Step 11: Swap the package script**

In `package.json`, replace the `new-note` line with:

```json
"new-essay": "npx tsx scripts/new-essay.ts",
```

- [ ] **Step 12: Add the legacy redirects**

Replace `next.config.ts`:

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // The four essays moved from /notes to /writing. Keep old links alive.
      {
        source: '/notes/:slug',
        destination: '/writing/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

Note this only redirects `/notes/:slug`, not `/notes` itself — `/notes` remains a live route for field notes.

- [ ] **Step 13: Delete the superseded files**

```bash
git rm src/lib/notes.ts scripts/new-note.ts
git rm -r src/app/notes/\[slug\]
```

- [ ] **Step 14: Run the full test suite**

Run: `pnpm test`
Expected: PASS, 18 tests across three files.

`pnpm typecheck` will now fail — pages still import `getAllNotes` and deleted components. That is expected and is resolved in Tasks 8-12.

- [ ] **Step 15: Commit**

```bash
git add -A
git commit -m "refactor: migrate notes to writing and rewrite site content

MDX essays move to src/content/writing behind getAllEssays(); /notes
becomes a static field-note index. getEssayBySlug now rejects anything
that is not a bare slug, since the value arrives from the URL.
Old /notes/:slug URLs permanently redirect to /writing/:slug.

Adds experience, capabilities, fieldNotes and nowItems, with tests
asserting the experience-to-project references actually resolve."
```

---

## Task 8: TopNav and SkylineFooter

**Files:**
- Modify: `src/components/TopNav.tsx` (full rewrite)
- Create: `src/components/SkylineFooter.tsx`

**Interfaces:**
- Consumes: `siteConfig` from `@/content/site`; `DURATION`, `EASE` from `@/lib/motion`.
- Produces: `<TopNav />` and `<SkylineFooter />`, both prop-less. Task 9 mounts them in `layout.tsx`.

- [ ] **Step 1: Rewrite `src/components/TopNav.tsx`**

Six links. The active marker is the Expand Ring effect. `RedDotIndicator` is gone.

```tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { DURATION, EASE } from '@/lib/motion';
import { siteConfig } from '@/content/site';

const navLinks = [
  { href: '/work', label: 'Work' },
  { href: '/writing', label: 'Writing' },
  { href: '/notes', label: 'Notes' },
  { href: '/about', label: 'About' },
  { href: '/now', label: 'Now' },
  { href: '/contact', label: 'Contact' },
];

/** The active marker: a ring that expands once from the accent dot. */
function ActiveMarker() {
  const reduced = useReducedMotion();
  return (
    <span aria-hidden="true" className="relative inline-block h-1.5 w-1.5">
      <span className="absolute inset-0 rounded-full bg-accent" />
      {!reduced && (
        <motion.span
          className="absolute inset-0 rounded-full border border-accent"
          initial={{ scale: 1, opacity: 0.9 }}
          animate={{ scale: 3.2, opacity: 0 }}
          transition={{ duration: DURATION.entrance, ease: EASE.exit }}
        />
      )}
    </span>
  );
}

export default function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + '/');

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur-[2px]">
      <nav className="container flex h-[68px] items-center justify-between">
        <Link
          href="/"
          className="label text-[13px] tracking-[0.18em] text-ink-blue"
        >
          {siteConfig.name}
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className="label flex items-center gap-2 transition-colors duration-[--dur-micro] ease-enter hover:text-accent"
              >
                {isActive(link.href) && <ActiveMarker />}
                <span
                  className={
                    isActive(link.href)
                      ? 'border-b border-accent pb-0.5 text-ink-blue'
                      : 'text-ink-blue'
                  }
                >
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setOpen(!open)}
          className="label text-ink-blue md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-rule-soft bg-paper pb-6 md:hidden"
        >
          <ul className="container flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className="label flex items-center gap-2 text-ink-blue"
                >
                  {isActive(link.href) && <ActiveMarker />}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Create `src/components/SkylineFooter.tsx`**

Matches reference plate 3: contact block above a full-bleed skyline.

```tsx
import React from 'react';
import Image from 'next/image';
import { siteConfig } from '@/content/site';

const links = [
  { label: 'Email', href: `mailto:${siteConfig.email}` },
  { label: 'LinkedIn', href: siteConfig.social.linkedin },
  { label: 'GitHub', href: siteConfig.social.github },
  { label: 'Are.na', href: siteConfig.social.arena },
];

export default function SkylineFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 overflow-hidden">
      <div className="container pb-10">
        <ul className="flex flex-wrap gap-x-10 gap-y-4">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="label group inline-flex items-center gap-1.5 transition-colors duration-[--dur-micro] ease-enter hover:text-accent"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="text-accent transition-transform duration-[--dur-micro] ease-enter group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                >
                  &#8599;
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="label mt-8 text-muted">
          {siteConfig.name} &copy; {year} — Built with intention.
        </p>
      </div>

      {/* Full-bleed plate. Decorative. */}
      <Image
        src="/engravings/toronto-skyline.webp"
        alt=""
        aria-hidden="true"
        width={1536}
        height={1024}
        sizes="100vw"
        className="h-auto w-full select-none"
      />
    </footer>
  );
}
```

- [ ] **Step 3: Verify lint**

Run: `pnpm lint`
Expected: passes. `pnpm typecheck` still fails on pages not yet rewritten — expected until Task 12.

- [ ] **Step 4: Commit**

```bash
git add src/components/TopNav.tsx src/components/SkylineFooter.tsx
git commit -m "feat: rebuild TopNav for six routes and add SkylineFooter

Active nav state is the expand-ring marker plus aria-current, so the
accent colour is never the sole carrier of meaning. Footer places the
contact block above the full-bleed skyline plate."
```

---

## Task 9: Layout wiring and component teardown

**Files:**
- Modify: `src/app/layout.tsx`
- Delete: 12 retired component files

**Interfaces:**
- Consumes: `TopNav`, `SkylineFooter` from Task 8.
- Produces: a root layout that mounts nav and footer once, so no page renders either itself.

- [ ] **Step 1: Rewrite the layout body**

Replace `metadata` and `RootLayout` in `src/app/layout.tsx` (keep the font constants from Task 2):

```tsx
export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.role}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.hero.subhead,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.tagline,
    type: 'website',
    images: ['/engravings/og-card.webp'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${sourceSerif.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <TopNav />
        <main>{children}</main>
        <SkylineFooter />
      </body>
    </html>
  );
}
```

Update the imports at the top to add `SkylineFooter`:

```tsx
import TopNav from '@/components/TopNav';
import SkylineFooter from '@/components/SkylineFooter';
```

- [ ] **Step 2: Delete the retired components**

```bash
git rm src/components/TapeLabelTag.tsx \
       src/components/StitchedDivider.tsx \
       src/components/LeatherFooter.tsx \
       src/components/RedDotIndicator.tsx \
       src/components/ProofStrip.tsx \
       src/components/SectionHeaderStrip.tsx \
       src/components/HeroPanel.tsx \
       src/components/AboutPanel.tsx \
       src/components/FeaturedWorkGrid.tsx \
       src/components/NotesList.tsx \
       src/components/NotesListPage.tsx \
       src/components/ProjectCard.tsx
```

- [ ] **Step 3: Confirm nothing still imports them**

Run:

```bash
grep -rn "TapeLabelTag\|StitchedDivider\|LeatherFooter\|RedDotIndicator\|ProofStrip\|SectionHeaderStrip\|HeroPanel\|AboutPanel\|FeaturedWorkGrid\|NotesList\|ProjectCard" src/
```

Expected: hits only in `src/app/**/page.tsx` files, all rewritten in Tasks 10-12. Note the list; it is the checklist for those tasks.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: mount nav and footer in root layout, delete pop-craft components

Removes the twelve Analog Pop Craft components. Pages are rewritten in
the following tasks; typecheck stays red until Task 12."
```

---

## Task 10: Home page and CapabilityCard

**Files:**
- Create: `src/components/CapabilityCard.tsx`
- Modify: `src/app/page.tsx` (full rewrite)

**Interfaces:**
- Consumes: `GridFrame`, `SectionMarker`, `EngravingPlate`, `IndexList`, `IndexRow`, `capabilities`, `projects`, `getAllEssays`.
- Produces: `<CapabilityCard capability={Capability} />`, reused on `/about` in Task 12.

- [ ] **Step 1: Create `src/components/CapabilityCard.tsx`**

```tsx
import React from 'react';
import Image from 'next/image';
import type { Capability } from '@/content/site';

export default function CapabilityCard({
  capability,
}: {
  capability: Capability;
}) {
  return (
    <article className="flex flex-col border-l border-rule-soft pl-5">
      <p className="label mb-3 text-muted">{capability.index} //</p>
      <h3 className="mb-2 font-display text-[clamp(18px,2vw,24px)] text-ink-blue">
        {capability.title}
      </h3>
      <p className="mb-6 text-[15px] text-text/85">{capability.description}</p>
      <Image
        src={capability.icon}
        alt=""
        aria-hidden="true"
        width={1024}
        height={1024}
        sizes="(max-width: 768px) 45vw, 22vw"
        className="mt-auto h-auto w-full max-w-[220px] select-none"
      />
    </article>
  );
}
```

- [ ] **Step 2: Rewrite `src/app/page.tsx`**

```tsx
import React from 'react';
import Link from 'next/link';
import GridFrame from '@/components/GridFrame';
import SectionMarker from '@/components/SectionMarker';
import EngravingPlate from '@/components/EngravingPlate';
import CapabilityCard from '@/components/CapabilityCard';
import IndexList from '@/components/IndexList';
import IndexRow from '@/components/IndexRow';
import { siteConfig, capabilities, projects } from '@/content/site';
import { getAllEssays } from '@/lib/writing';

export default function HomePage() {
  const featured = projects.filter((p) => p.featured);
  const essays = getAllEssays().slice(0, 3);

  return (
    <GridFrame
      railLeft={['TOR', 'EST', '2024']}
      railRight={['IDEAS', 'PEOPLE', 'SYSTEMS', 'A BRIGHTER TOMORROW']}
    >
      {/* 01 — Hero */}
      <section className="container pb-20 pt-16 md:pt-24">
        <SectionMarker index={1} label="Introduction" />
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h1 className="mb-8 uppercase">{siteConfig.hero.headline}</h1>
            <p className="mb-6 max-w-prose text-[17px] leading-relaxed">
              {siteConfig.hero.subhead}
            </p>
            <p className="mb-10 max-w-prose text-[17px] leading-relaxed">
              {siteConfig.hero.secondary}
            </p>
            <Link
              href="/work"
              className="label group inline-flex items-center gap-3 bg-ink-blue px-6 py-3.5 text-paper transition-transform duration-[--dur-micro] ease-enter hover:-translate-y-0.5"
            >
              View the work
              <span
                aria-hidden="true"
                className="text-accent transition-transform duration-[--dur-micro] ease-enter group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </Link>
            <p className="label mt-10 text-muted">Curiosity to clarity</p>
          </div>

          <EngravingPlate
            src="/engravings/home-hero.webp"
            alt=""
            width={1536}
            height={1024}
            priority
          />
        </div>
      </section>

      {/* 02 — Capabilities */}
      <section className="container border-t border-rule py-20">
        <SectionMarker index={2} label="Capabilities" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {capabilities.map((capability) => (
            <CapabilityCard key={capability.index} capability={capability} />
          ))}
        </div>
      </section>

      {/* 03 — Selected work */}
      <section className="container border-t border-rule py-20">
        <SectionMarker index={3} label="Selected Work" />
        <IndexList>
          {featured.map((project, i) => (
            <IndexRow
              key={project.slug}
              id={project.slug}
              index={String(i + 1).padStart(2, '0')}
              title={project.title}
              subtitle={project.tags.join(' / ')}
              href={`/work/${project.slug}`}
            />
          ))}
        </IndexList>
      </section>

      {/* 04 — Writing */}
      <section className="container border-t border-rule py-20">
        <SectionMarker index={4} label="Writing" />
        <IndexList>
          {essays.map((essay, i) => (
            <IndexRow
              key={essay.slug}
              id={essay.slug}
              index={String(i + 1).padStart(3, '0')}
              title={essay.title}
              subtitle={essay.readingTime}
              href={`/writing/${essay.slug}`}
            />
          ))}
        </IndexList>
      </section>
    </GridFrame>
  );
}
```

Note `/work/[slug]` is keyed by **project** slug here; Task 11 makes that route resolve both project and experience slugs.

- [ ] **Step 3: Verify the home page renders**

Run: `pnpm build`
Expected: `/` compiles. Other routes may still fail — note which and continue.

- [ ] **Step 4: Commit**

```bash
git add src/components/CapabilityCard.tsx src/app/page.tsx
git commit -m "feat: rebuild the home page in the Blue Ink Editorial system"
```

---

## Task 11: Work and Writing routes

**Files:**
- Modify: `src/app/work/page.tsx`, `src/app/work/[slug]/page.tsx`
- Create: `src/app/writing/page.tsx`, `src/app/writing/[slug]/page.tsx`

**Interfaces:**
- Consumes: everything from Tasks 4-7.
- Produces: four working routes. `/work/[slug]` resolves an experience slug **or** a project slug.

- [ ] **Step 1: Rewrite `src/app/work/page.tsx`**

```tsx
import React from 'react';
import type { Metadata } from 'next';
import GridFrame from '@/components/GridFrame';
import SectionMarker from '@/components/SectionMarker';
import EngravingPlate from '@/components/EngravingPlate';
import IndexList from '@/components/IndexList';
import IndexRow from '@/components/IndexRow';
import { experience, fieldNotes } from '@/content/site';

export const metadata: Metadata = { title: 'Work' };

export default function WorkPage() {
  return (
    <GridFrame railRight={['PEOPLE', 'PROBLEMS', 'PROGRESS']}>
      <section className="container pb-16 pt-16 md:pt-24">
        <SectionMarker index={5} label="Experience Index" />
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h1 className="mb-8 uppercase">Work, study, and systems</h1>
            <p className="max-w-prose text-[17px] leading-relaxed">
              A concise index of places where I have built, analyzed, learned,
              and contributed.
            </p>
            <p className="label mt-10 text-muted">
              People / Problems / Progress
            </p>
          </div>
          <EngravingPlate
            src="/engravings/work-still-life.webp"
            alt=""
            width={1536}
            height={1024}
            priority
          />
        </div>
      </section>

      <div className="container grid gap-16 border-t border-rule py-20 md:grid-cols-2 md:gap-12">
        <section>
          <SectionMarker index={1} label="Experience" />
          <IndexList>
            {experience.map((entry, i) => (
              <IndexRow
                key={entry.slug}
                id={entry.slug}
                index={String(i + 1).padStart(2, '0')}
                title={entry.org}
                subtitle={entry.disciplines.join(' / ')}
                href={`/work/${entry.slug}`}
              />
            ))}
          </IndexList>
        </section>

        <section>
          <SectionMarker index={6} label="Field Notes" />
          <IndexList>
            {fieldNotes.map((note) => (
              <IndexRow
                key={note.id}
                id={note.id}
                index={note.id}
                title={note.title}
                href="/notes"
              />
            ))}
          </IndexList>
        </section>
      </div>
    </GridFrame>
  );
}
```

- [ ] **Step 2: Rewrite `src/app/work/[slug]/page.tsx`**

```tsx
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import GridFrame from '@/components/GridFrame';
import SectionMarker from '@/components/SectionMarker';
import { experience, projects } from '@/content/site';

export async function generateStaticParams() {
  return [
    ...experience.map((e) => ({ slug: e.slug })),
    ...projects.map((p) => ({ slug: p.slug })),
  ];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = experience.find((e) => e.slug === slug);
  if (entry) return { title: entry.org, description: entry.summary };

  const project = projects.find((p) => p.slug === slug);
  if (project) return { title: project.title, description: project.outcome };

  return {};
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = experience.find((e) => e.slug === slug);
  const project = projects.find((p) => p.slug === slug);

  if (!entry && !project) notFound();

  return (
    <GridFrame>
      <article className="container pb-20 pt-16 md:pt-24">
        <SectionMarker index={1} label={entry ? 'Experience' : 'Case Study'} />

        {entry && (
          <>
            <h1 className="mb-6 uppercase">{entry.org}</h1>
            <p className="label mb-10 text-muted">
              {entry.disciplines.join(' / ')} — {entry.period}
            </p>
            <p className="mb-14 max-w-prose text-[17px] leading-relaxed">
              {entry.summary}
            </p>

            {entry.projects.length > 0 && (
              <section className="border-t border-rule pt-12">
                <SectionMarker index={2} label="Projects" />
                <ul className="grid gap-8 md:grid-cols-2">
                  {entry.projects.map((projectSlug) => {
                    const p = projects.find((x) => x.slug === projectSlug);
                    if (!p) return null;
                    return (
                      <li key={p.slug} className="border-l border-rule-soft pl-5">
                        <Link href={`/work/${p.slug}`} className="group block">
                          <h3 className="mb-2 text-ink-blue">{p.title}</h3>
                          <p className="mb-3 text-[15px] text-text/85">
                            {p.outcome}
                          </p>
                          <span className="label inline-flex items-center gap-2 text-accent">
                            Open
                            <span
                              aria-hidden="true"
                              className="transition-transform duration-[--dur-micro] ease-enter group-hover:translate-x-1"
                            >
                              &rarr;
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </>
        )}

        {project && (
          <>
            <h1 className="mb-6 uppercase">{project.title}</h1>
            <p className="label mb-10 text-muted">{project.tags.join(' / ')}</p>
            <p className="mb-14 max-w-prose text-[17px] leading-relaxed">
              {project.outcome}
            </p>

            <dl className="grid gap-x-10 gap-y-8 border-t border-rule pt-12 md:grid-cols-2">
              {(
                [
                  ['Data', project.tracklist.data],
                  ['Model', project.tracklist.model],
                  ['System', project.tracklist.system],
                  ['Impact', project.tracklist.impact],
                ] as const
              )
                .filter(([, value]) => Boolean(value))
                .map(([term, value]) => (
                  <div key={term}>
                    <dt className="label mb-2 text-muted">{term}</dt>
                    <dd className="text-[16px] leading-relaxed">{value}</dd>
                  </div>
                ))}
            </dl>
          </>
        )}

        <Link
          href="/work"
          className="label group mt-16 inline-flex items-center gap-2 text-accent"
        >
          <span
            aria-hidden="true"
            className="transition-transform duration-[--dur-micro] ease-enter group-hover:-translate-x-1"
          >
            &larr;
          </span>
          Back to the index
        </Link>
      </article>
    </GridFrame>
  );
}
```

- [ ] **Step 3: Create `src/app/writing/page.tsx`**

```tsx
import React from 'react';
import type { Metadata } from 'next';
import GridFrame from '@/components/GridFrame';
import SectionMarker from '@/components/SectionMarker';
import EngravingPlate from '@/components/EngravingPlate';
import IndexList from '@/components/IndexList';
import IndexRow from '@/components/IndexRow';
import { getAllEssays } from '@/lib/writing';

export const metadata: Metadata = { title: 'Writing' };

export default function WritingPage() {
  const essays = getAllEssays();

  return (
    <GridFrame railRight={['EXPLORATION', 'FUELS', 'CLARITY']}>
      <section className="container pb-16 pt-16 md:pt-24">
        <SectionMarker index={1} label="Writing" />
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h1 className="mb-8 uppercase">Thinking out loud</h1>
            <p className="max-w-prose text-[17px] leading-relaxed">
              Longer pieces on systems, data, and the work of turning messy
              problems into things that hold up.
            </p>
          </div>
          <EngravingPlate
            src="/engravings/writing-still-life.webp"
            alt=""
            width={1536}
            height={1024}
            priority
          />
        </div>
      </section>

      <section className="container border-t border-rule py-20">
        <SectionMarker index={2} label="Essays" />
        <IndexList>
          {essays.map((essay, i) => (
            <IndexRow
              key={essay.slug}
              id={essay.slug}
              index={String(i + 1).padStart(3, '0')}
              title={essay.title}
              subtitle={`${essay.date} — ${essay.readingTime}`}
              href={`/writing/${essay.slug}`}
            />
          ))}
        </IndexList>
      </section>
    </GridFrame>
  );
}
```

- [ ] **Step 4: Create `src/app/writing/[slug]/page.tsx`**

```tsx
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import type { Metadata } from 'next';
import GridFrame from '@/components/GridFrame';
import SectionMarker from '@/components/SectionMarker';
import { getAllEssays, getEssayBySlug } from '@/lib/writing';
import { mdxComponents } from '@/components/mdx-components';

export async function generateStaticParams() {
  return getAllEssays().map((essay) => ({ slug: essay.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);
  if (!essay) return {};
  return { title: essay.title, description: essay.summary };
}

export default async function EssayPage({ params }: PageProps) {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);

  if (!essay) notFound();

  const { content } = await compileMDX({
    source: essay.content,
    components: mdxComponents,
    options: { parseFrontmatter: false },
  });

  return (
    <GridFrame>
      <article className="container pb-20 pt-16 md:pt-24">
        <SectionMarker index={1} label="Essay" />
        <h1 className="mb-6">{essay.title}</h1>
        <p className="label mb-14 text-muted">
          {essay.date} — {essay.readingTime}
        </p>
        <div className="prose-editorial max-w-prose">{content}</div>

        <Link
          href="/writing"
          className="label group mt-16 inline-flex items-center gap-2 text-accent"
        >
          <span
            aria-hidden="true"
            className="transition-transform duration-[--dur-micro] ease-enter group-hover:-translate-x-1"
          >
            &larr;
          </span>
          All writing
        </Link>
      </article>
    </GridFrame>
  );
}
```

- [ ] **Step 5: Restyle the MDX components**

Open `src/components/mdx-components.tsx` and replace every retired token reference (`var(--ink)`, `var(--pop-*)`, `var(--signal-red)`, `var(--paper-2)` used as a pop accent) with the new palette: headings `text-ink-blue` in `font-display`, body in `font-body`, links `text-accent`, blockquote border `border-rule`, inline code on `bg-paper-2`. Keep the exported name `mdxComponents` unchanged.

- [ ] **Step 6: Verify the build**

Run: `pnpm build`
Expected: `/work`, `/work/[slug]`, `/writing`, `/writing/[slug]` all compile. `/about`, `/contact`, `/notes` may still fail — Task 12.

- [ ] **Step 7: Commit**

```bash
git add -A src/app/work src/app/writing src/components/mdx-components.tsx
git commit -m "feat: rebuild work and writing routes

/work is the experience index from the reference plate; /work/[slug]
resolves either an experience slug or a project slug so the featured
project links on the home page keep working."
```

---

## Task 12: About, Now, Notes and Contact

**Files:**
- Modify: `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/notes/page.tsx`
- Create: `src/app/now/page.tsx`

**Interfaces:**
- Consumes: everything from Tasks 4-7 and `CapabilityCard` from Task 10.
- Produces: the final four routes. After this task `pnpm typecheck` must be green.

- [ ] **Step 1: Rewrite `src/app/about/page.tsx`**

This is reference plate 1.

```tsx
import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import GridFrame from '@/components/GridFrame';
import SectionMarker from '@/components/SectionMarker';
import EngravingPlate from '@/components/EngravingPlate';
import CapabilityCard from '@/components/CapabilityCard';
import { siteConfig, capabilities } from '@/content/site';

export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <GridFrame
      railLeft={['TOR', 'EST', '2024']}
      railRight={['IDEAS', 'PEOPLE', 'SYSTEMS', 'A BRIGHTER TOMORROW']}
    >
      <section className="container pb-16 pt-16 md:pt-24">
        <SectionMarker index={3} label="Philosophy" />
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h1 className="mb-8 uppercase">{siteConfig.hero.headline}</h1>
            <p className="mb-6 max-w-prose text-[17px] leading-relaxed">
              {siteConfig.hero.subhead}
            </p>
            <p className="mb-10 max-w-prose text-[17px] leading-relaxed">
              {siteConfig.hero.secondary}
            </p>
            <Link
              href="/work"
              className="label group inline-flex items-center gap-3 bg-ink-blue px-6 py-3.5 text-paper transition-transform duration-[--dur-micro] ease-enter hover:-translate-y-0.5"
            >
              My approach
              <span
                aria-hidden="true"
                className="text-accent transition-transform duration-[--dur-micro] ease-enter group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </Link>
            <p className="label mt-10 text-muted">Curiosity to clarity</p>
          </div>

          <EngravingPlate
            src="/engravings/about-portrait.webp"
            alt="Engraved portrait of Miguel Twahirwa working at a desk, with the Toronto skyline through the window behind him."
            width={1280}
            height={853}
            priority
          />
        </div>
      </section>

      <section className="container border-t border-rule py-20">
        <SectionMarker index={4} label="Capabilities" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {capabilities.map((capability) => (
            <CapabilityCard key={capability.index} capability={capability} />
          ))}
        </div>
        <p className="label mt-16 text-muted">
          Tools for a more human future
        </p>
      </section>
    </GridFrame>
  );
}
```

Note this is the one plate with real `alt` text — it carries information about the person.

- [ ] **Step 2: Rewrite `src/app/notes/page.tsx`**

```tsx
import React from 'react';
import type { Metadata } from 'next';
import GridFrame from '@/components/GridFrame';
import SectionMarker from '@/components/SectionMarker';
import EngravingPlate from '@/components/EngravingPlate';
import { fieldNotes } from '@/content/site';

export const metadata: Metadata = { title: 'Notes' };

export default function NotesPage() {
  return (
    <GridFrame railRight={['SMALL', 'EXPERIMENTS', 'BIGGER', 'PERSPECTIVE']}>
      <section className="container pb-16 pt-16 md:pt-24">
        <SectionMarker index={6} label="Field Notes" />
        <div className="grid items-center gap-12 md:grid-cols-[3fr_2fr] md:gap-16">
          <div>
            <h1 className="mb-8 uppercase">Small experiments</h1>
            <p className="max-w-prose text-[17px] leading-relaxed">
              Short entries — things I am testing, reading, or noticing. Less
              finished than the essays, and kept that way on purpose.
            </p>
          </div>
          <EngravingPlate
            src="/engravings/notes-still-life.webp"
            alt=""
            width={1024}
            height={1024}
            priority
          />
        </div>
      </section>

      <section className="container border-t border-rule py-20">
        <ul className="grid gap-x-12 gap-y-10 md:grid-cols-2">
          {fieldNotes.map((note) => (
            <li key={note.id} className="border-l border-rule-soft pl-5">
              <p className="label mb-2 text-muted">
                {note.id} — {note.date}
              </p>
              <h2 className="mb-2 font-display text-[clamp(20px,2.2vw,26px)]">
                {note.title}
              </h2>
              <p className="text-[15px] leading-relaxed text-text/85">
                {note.summary}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </GridFrame>
  );
}
```

- [ ] **Step 3: Create `src/app/now/page.tsx`**

```tsx
import React from 'react';
import type { Metadata } from 'next';
import GridFrame from '@/components/GridFrame';
import SectionMarker from '@/components/SectionMarker';
import EngravingPlate from '@/components/EngravingPlate';
import { siteConfig, nowItems } from '@/content/site';

export const metadata: Metadata = { title: 'Now' };

export default function NowPage() {
  return (
    <GridFrame railRight={['WHAT', 'I AM', 'DOING', 'NOW']}>
      <section className="container pb-16 pt-16 md:pt-24">
        <SectionMarker index={2} label="Now" />
        <div className="grid items-center gap-12 md:grid-cols-[3fr_2fr] md:gap-16">
          <div>
            <h1 className="mb-8 uppercase">What I am working on</h1>
            <p className="max-w-prose text-[17px] leading-relaxed">
              {siteConfig.nowLine}
            </p>
          </div>
          <EngravingPlate
            src="/engravings/now-still-life.webp"
            alt=""
            width={1024}
            height={1024}
            priority
          />
        </div>
      </section>

      <section className="container border-t border-rule py-20">
        <dl className="grid gap-x-12 gap-y-10 md:grid-cols-2">
          {nowItems.map((item) => (
            <div key={item.label} className="border-l border-rule-soft pl-5">
              <dt className="label mb-2 text-muted">{item.label}</dt>
              <dd className="text-[16px] leading-relaxed">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </GridFrame>
  );
}
```

- [ ] **Step 4: Rewrite `src/app/contact/page.tsx`**

This is reference plate 3. The skyline comes from the shared footer, so this page must not render its own.

```tsx
import React from 'react';
import type { Metadata } from 'next';
import GridFrame from '@/components/GridFrame';
import SectionMarker from '@/components/SectionMarker';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <GridFrame railRight={['IDEAS', 'TO', 'SYSTEMS', 'TO', 'IMPACT']}>
      <section className="container pb-24 pt-16 md:pt-24">
        <SectionMarker index={7} label="Contact" />
        <h1 className="mb-8 uppercase">{siteConfig.name}</h1>
        <p className="max-w-prose text-[19px] leading-relaxed">
          {siteConfig.role} based in {siteConfig.location}.
        </p>
      </section>
    </GridFrame>
  );
}
```

- [ ] **Step 5: Verify everything is green**

Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: all four pass. This is the first point in the plan where typecheck must be clean.

- [ ] **Step 6: Commit**

```bash
git add -A src/app
git commit -m "feat: rebuild about, notes, now and contact routes

Completes the six-route structure. About carries the only plate with
real alt text, since the portrait conveys information rather than
decoration."
```

---

## Task 13: Verification and design.md

**Files:**
- Modify: `design.md` (full rewrite)

**Interfaces:**
- Consumes: the finished site.
- Produces: `design.md` describing what was actually built, so `CLAUDE.md`'s pointer to it stays true.

- [ ] **Step 1: Run the full gate**

Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: all pass. Do not proceed past a failure — fix it.

- [ ] **Step 2: Check the engraving payload**

```bash
du -ch public/engravings/*.webp | tail -1
```

Expected: at or under 1.4MB total. If it grew, re-encode the offender per spec §4.3.

- [ ] **Step 3: Start the dev server and walk every route**

```bash
pnpm dev
```

Visit `/`, `/work`, `/work/wesco`, `/work/on-time-delivery-early-warning`, `/writing`, `/writing/early-warning-systems`, `/notes`, `/about`, `/now`, `/contact`. On each, confirm: the frame draws in once, the engraving inks in on scroll, index rows slide their arrow and dim their siblings on hover, and the active nav item shows the accent marker.

- [ ] **Step 4: Verify the legacy redirect**

Visit `http://localhost:3000/notes/early-warning-systems`.
Expected: a 308 to `/writing/early-warning-systems`.

- [ ] **Step 5: Check the three breakpoints**

At 375, 768 and 1440 px confirm: no horizontal scroll, side rails hidden below `md`, the frame inset tightens to 16px on mobile, the capability grid is 2-up on mobile and 4-up at `lg`, and the mobile nav drawer opens and closes.

- [ ] **Step 6: Verify reduced motion**

In Chrome DevTools, Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`. Reload each route.
Expected: the frame is drawn immediately, plates are fully inked with no sweep, no letter stagger, arrows do not slide, and the nav ring does not expand. Everything must be in its **final** state — not simply faster.

- [ ] **Step 7: Rewrite `design.md`**

Replace the entire file with a description of the delivered system, mirroring the spec's structure: intent, tokens (§2 of the spec, copied), layout primitives, the asset pipeline and how to regenerate a plate, the seven motion effects and their rules, the component inventory, and the route map. End with a line pointing at the spec:

```markdown
Full rationale, including the approaches considered and rejected, lives in
`docs/superpowers/specs/2026-09-09-blue-ink-editorial-design.md`.
```

- [ ] **Step 8: Commit**

```bash
git add design.md
git commit -m "docs: rewrite design.md for the Blue Ink Editorial system"
```

---

## Self-Review

**Spec coverage**

| Spec section | Task |
|---|---|
| §2.1 Colour | 1 |
| §2.2 Typography | 1, 2 |
| §2.3 Geometry | 1 |
| §2.4 Retired tokens | 1 (asserted in test), 9 (components) |
| §3.1 GridFrame | 4 |
| §3.2 SectionMarker | 5 |
| §3.3 Page skeleton | 9 |
| §4 Asset pipeline | Already executed; plates committed. Task 13 Step 2 guards the budget. |
| §5.1 Motion rules | 2 (reduced motion), 3 (constants) |
| §5.2 Slide arrow | 6, 8 |
| §5.2 Sibling dim | 6 |
| §5.2 Text reveal | 5 |
| §5.2 Magnetic pull | **Gap — see below** |
| §5.2 Expand ring | 8 |
| §5.2 Frame draw | 4 |
| §5.2 Ink reveal | 5 |
| §6 Components | 4, 5, 6, 8, 9, 10 |
| §7 Routes and content | 7, 10, 11, 12 |
| §8 Accessibility | 1 (contrast tests), 2 (focus ring), 8 (aria-current), 12 (alt text) |
| §9 Verification | 13 |

**Gap found and closed:** the Magnetic Field effect on the primary CTA had no
task. Rather than add a component for one hover on two buttons, the CTA in
Tasks 10 and 12 uses a 2px `-translate-y` lift on hover — same restraint, no
pointer-tracking client component, and it survives reduced motion cleanly.
**This is a deliberate deviation from spec §5.2 and must be flagged to the user
at completion.**

**Placeholder scan:** no TBD, TODO, "handle edge cases", or "similar to Task N".
Task 11 Step 5 and Task 13 Step 7 describe edits in prose rather than a full
code block; both are mechanical restyling of files whose current contents the
executor can read, and both name the exact tokens and exported symbols to use.

**Type consistency:** `getAllEssays` / `getEssayBySlug` / `EssayMeta` /
`EssayWithContent` are defined in Task 7 and used identically in Tasks 10, 11.
`Capability` is defined in Task 7 and consumed in Task 10. `IndexRow` takes
`id, index, title, subtitle?, href` at every one of its six call sites.
`EngravingPlate` takes `src, alt, width, height, priority?, className?` at all
seven call sites. `experience[].projects` holds project slugs, asserted by
`site.test.ts`.
