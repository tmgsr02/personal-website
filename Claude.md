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

- Paper-first editorial layout with subtle tactile textures (paper, burlap, leather)
- Pop-art hero moments used sparingly
- Minimal "red dot" signal system for focus and activity
- Strong typography and clean hierarchy

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + CSS variables (design tokens) |
| Animation | Framer Motion (minimal, respects `prefers-reduced-motion`) |
| Images | next/image |
| Content | MDX files (notes) + static TypeScript data (projects, config) |
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
pnpm new-note         # Scaffold a new MDX note
```

---

## Project Structure

```
├── src/app/              # Next.js App Router pages and layouts
├── src/components/       # Reusable React components
├── src/content/          # Static data: site.ts (config/projects) + notes/*.mdx
├── src/lib/              # Utility modules (notes loader, etc.)
├── src/styles/           # Global styles and design tokens
├── scripts/              # CLI tools (new-note scaffolding)
├── public/               # Static assets (images, textures)
└── design.md             # Visual design specifications
```

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
- [ ] `pnpm build` succeeds
- [ ] Visual output matches design intent
- [ ] Responsive behavior verified