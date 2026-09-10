# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

---

## Project Intent

### Audience
- Senior engineers and technical hiring managers
- Product-minded data leaders and founders
- Design-aware builders who value clarity and craft

NOT for: recruiter keyword scanning, mass-market personal branding, or "portfolio template" audiences.

### First Impression (5 seconds)
Signal immediately: builds real systems, thinks end-to-end, has taste, ships work that interacts with reality.

If it feels generic, noisy, or over-styled → it has failed.

### Emotional Tone
Calm, confident, deliberate, crafted.

NOT: flashy, loud, salesy, overly clever, startup-landing-page energy.

### Decision Filter
- Fewer elements executed well > more features
- Typography and spacing do most of the work
- If a design choice draws attention without adding clarity → remove it
- Every section must earn its space

### Success Criteria
A thoughtful visitor thinks: "I'd trust this person to own a messy, important problem and turn it into something reliable."

---

## Design Philosophy

Visual intent is defined in `design.md`—follow it closely.

The shipped direction is **"Blue Ink Editorial"**: a single-ink system —
cream paper, blue copperplate engraving, a hairline grid frame — that makes
each page read as a printed plate rather than a web page. It supersedes an
earlier "Analog Pop Craft" direction (pop-art crops, burlap, leather, a red
dot signal); none of that survives in the current codebase or tokens.

- Paper-first editorial layout: cream ground, hairline rules, no textures
- Engraving plates (single-ink line art) as the site's imagery, not photos
- No "red dot" — focus and activity read through an accent-coloured arrow,
  active nav marker, and (per the current index-row treatment) an
  accent-coloured title on the focused row
- Strong typography and clean hierarchy; `design.md` §2 is the source of
  truth for tokens, and this file must never restate token values that could
  drift from it

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + CSS variables (design tokens) |
| Animation | Framer Motion (minimal, respects `prefers-reduced-motion`) |
| Images | next/image |
| Content | MDX files in `src/content/writing/*.mdx` (long-form essays) + static TypeScript data in `src/content/site.ts` (config, experience, projects, capabilities, field notes) |
| Deployment | Vercel-compatible |

No backend, database, auth, CMS, or API layers required.

---

## Commands

This project uses **pnpm**.

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm lint             # Run ESLint
pnpm typecheck        # Run TypeScript compiler
pnpm test             # Run the vitest suite
pnpm new-essay        # Scaffold a new MDX essay under src/content/writing/
pnpm generate-assets  # Regenerate engraving plates — see design.md §4. Do
                       # NOT run this casually: it calls an image-generation
                       # API and takes minutes per plate.
```

---

## Project Structure

```
├── src/app/              # Next.js App Router pages and layouts
├── src/components/       # Reusable React components
├── src/content/          # site.ts (config, experience, projects, field notes) + writing/*.mdx (essays)
├── src/lib/              # Utility modules (writing.ts essay loader, motion.ts tokens, etc.)
├── src/styles/           # Global styles and design tokens (tokens.css)
├── scripts/              # CLI tools (new-essay scaffolding, engraving-plate generation)
├── public/engravings/    # Committed engraving plates (WebP) — see design.md §4
└── design.md             # Visual design specifications
```

Notes (`/notes`, short dated log entries) are a `FieldNote[]` array directly
in `site.ts`, not MDX — only long-form Writing (`/writing`) is MDX-backed.

---

## Workflow

### Before Making Changes
1. Read relevant files before editing—check `design.md` for any visual work
2. For non-trivial changes, outline the approach first
3. Ask clarifying questions before architectural changes

### Code Standards
- TypeScript strict mode—no `any` without justification
- Functional components with hooks only
- Tailwind utilities first; custom CSS only when necessary
- Mobile-first responsive design
- Semantic HTML with proper accessibility (WCAG 2.1 AA)

### Verification
Before considering work complete:
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds
- [ ] Visual output matches design intent
- [ ] Responsive behavior verified