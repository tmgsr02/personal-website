import React from 'react';
import type { Metadata } from 'next';
import GridFrame from '@/components/GridFrame';
import SectionMarker from '@/components/SectionMarker';
import { chapterNumber } from '@/lib/chapters';
import EngravingPlate from '@/components/EngravingPlate';
import IndexList from '@/components/IndexList';
import IndexRow from '@/components/IndexRow';
import { getAllEssays } from '@/lib/writing';
import { itemNumber } from '@/lib/numbering';

export const metadata: Metadata = { title: 'Writing' };

export default function WritingPage() {
  const essays = getAllEssays();

  return (
    <GridFrame railRight={['EXPLORATION', 'FUELS', 'CLARITY']}>
      <section className="container pb-16 pt-16 md:pt-24">
        <SectionMarker chapter={chapterNumber('/writing')} section={1} label="Writing" />
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
        <SectionMarker chapter={chapterNumber('/writing')} section={2} label="Essays" />
        <IndexList>
          {essays.map((essay, i) => (
            <IndexRow
              key={essay.slug}
              id={essay.slug}
              index={itemNumber(i + 1)}
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
