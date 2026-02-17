import type { Metadata } from 'next';
import { IBM_Plex_Mono, Archivo_Black } from 'next/font/google';
import './globals.css';
import TopNav from '@/components/TopNav';
import { siteConfig } from '@/content/site';

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-mono',
});

const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
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
    <html lang="en" className={`${ibmPlexMono.variable} ${archivoBlack.variable}`}>
      <body>
        <TopNav />
        <main>{children}</main>
      </body>
    </html>
  );
}
