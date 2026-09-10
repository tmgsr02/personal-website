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
            sizes="(max-width: 768px) 100vw, 40vw"
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
