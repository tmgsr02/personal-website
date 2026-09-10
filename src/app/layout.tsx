import type { Metadata } from 'next';
import { IBM_Plex_Mono, Bodoni_Moda, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import TopNav from '@/components/TopNav';
import SkylineFooter from '@/components/SkylineFooter';
import { siteConfig } from '@/content/site';

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
        {/* Framer's whileInView reveals never fire without JS, which
            would otherwise ship every engraving plate stuck at 0.25
            opacity behind an opaque paper veil, and every SectionMarker
            label stuck at 0 opacity — invisible to a sighted no-JS
            visitor (assistive tech is unaffected; the sr-only label
            survives). Force both to their end state. `!important` in an
            author stylesheet beats a normal (non-!important) inline
            style, which is how Framer sets these. */}
        <noscript>
          <style>{`
            .engraving-image { opacity: 1 !important; }
            .engraving-veil { opacity: 0 !important; transform: translateX(104%) !important; }
            .section-letter { opacity: 1 !important; transform: none !important; }
          `}</style>
        </noscript>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <TopNav />
        <main id="main">{children}</main>
        <SkylineFooter />
      </body>
    </html>
  );
}
