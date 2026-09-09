import type { Metadata } from 'next';
import { IBM_Plex_Mono, Bodoni_Moda, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import TopNav from '@/components/TopNav';
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
  title: `${siteConfig.name} - ${siteConfig.tagline}`,
  description: siteConfig.hero.subhead,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.tagline,
    type: 'website',
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
      </body>
    </html>
  );
}
