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
            <h1 className="mb-8 uppercase">{siteConfig.about.headline}</h1>
            <p className="mb-6 max-w-prose text-[17px] leading-relaxed">
              {siteConfig.about.subhead}
            </p>
            <p className="mb-10 max-w-prose text-[17px] leading-relaxed">
              {siteConfig.about.secondary}
            </p>
            <Link
              href="/work"
              className="label group inline-flex items-center gap-3 bg-ink-blue px-6 py-3.5 text-paper transition-transform duration-micro ease-enter hover:-translate-y-0.5"
            >
              My approach
              <span
                aria-hidden="true"
                className="text-accent transition-transform duration-micro ease-enter group-hover:translate-x-1"
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
