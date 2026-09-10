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
