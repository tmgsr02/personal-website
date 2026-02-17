# Personal Website - "Analog Pop Craft"

A handcrafted personal website built with Next.js, featuring paper-first editorial layout with pop-art moments and tactile textures.

## Design Philosophy

This site combines:
- **Paper-first aesthetics**: Subtle paper fiber textures as the foundation
- **Pop-art hero moments**: Bold, eye-catching image crops in comic-book frames
- **Tactile textures**: Burlap, leather, and stitching details throughout
- **Red dot system**: A sacred signal indicator for active/focus states
- **Editorial typography**: IBM Plex Mono for body text, Archivo Black for headlines

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS variables
- **Animation**: Framer Motion
- **Fonts**: IBM Plex Mono, Archivo Black

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Add texture images**:
   Place the following images in their respective folders:
   - `/public/textures/paper-fiber.png`
   - `/public/textures/burlap.png`
   - `/public/textures/leather-stitch.png`
   - `/public/images/pop-room.png`
   - `/public/images/boombox.png`

   These files are currently placeholders and need to be replaced with actual texture images.

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── public/
│   ├── textures/          # Texture overlays (paper, burlap, leather)
│   └── images/            # Pop-art images and graphics
├── src/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Reusable React components
│   ├── content/           # Static content (site config, projects, notes)
│   └── styles/            # CSS design tokens
└── design.md              # Complete design specification
```

## Key Components

- **RedDotIndicator**: Sacred red dot for active/hover/focus states
- **TopNav**: Sticky navigation with active state indicators
- **HeroPanel**: Homepage hero with pop-art image frame
- **ProjectCard**: Paper-lift cards on burlap background
- **LeatherFooter**: Textured footer with stitched divider
- **SectionHeaderStrip**: Bold color strip section headers
- **TapeLabelTag**: Cassette-label style tags

## Customization

### Content
Edit `/src/content/site.ts` to update:
- Personal information
- Project portfolio
- Blog notes
- Social links

### Design Tokens
All design tokens are in `/src/styles/tokens.css`:
- Colors (paper, ink, pop colors, leather tones)
- Typography (font families, sizes, line heights)
- Spacing (border radius, shadows, container width)

### Pages
- `/` - Homepage with hero, featured work, about, and notes
- `/work` - All projects grid
- `/work/[slug]` - Individual case study template
- `/about` - Timeline and interests
- `/notes` - Blog/notes list
- `/contact` - Contact information

## Performance Targets

- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+

## Accessibility Features

- Keyboard navigation support
- Visible focus states with red outline
- Semantic HTML (header, main, nav, footer, article)
- Proper heading hierarchy
- `prefers-reduced-motion` support

## License

Private project - All rights reserved.
