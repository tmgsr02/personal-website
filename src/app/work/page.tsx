import React from 'react';
import type { Metadata } from 'next';
import GridFrame from '@/components/GridFrame';
import SectionMarker from '@/components/SectionMarker';
import { chapterNumber } from '@/lib/chapters';
import EngravingPlate from '@/components/EngravingPlate';
import IndexList from '@/components/IndexList';
import IndexRow from '@/components/IndexRow';
import { experience, fieldNotes } from '@/content/site';
import { itemNumber } from '@/lib/numbering';

export const metadata: Metadata = { title: 'Work' };

export default function WorkPage() {
  return (
    <GridFrame railRight={['PEOPLE', 'PROBLEMS', 'PROGRESS']}>
      <section className="container pb-16 pt-16 md:pt-24">
        <SectionMarker chapter={chapterNumber('/work')} section={1} label="Experience Index" />
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h1 className="mb-8 uppercase">Work, study, and systems</h1>
            <p className="max-w-prose text-[17px] leading-relaxed">
              A concise index of places where I have built, analyzed, learned,
              and contributed.
            </p>
            <p className="label mt-10 text-muted">
              People / Problems / Progress
            </p>
          </div>
          <EngravingPlate
            src="/engravings/work-still-life.webp"
            alt=""
            width={1536}
            height={1024}
            priority
          />
        </div>
      </section>

      <div className="container grid gap-16 border-t border-rule py-20 md:grid-cols-2 md:gap-12">
        <section>
          <IndexList>
            {experience.map((entry, i) => (
              <IndexRow
                key={entry.slug}
                id={entry.slug}
                index={itemNumber(i + 1)}
                title={entry.org}
                subtitle={entry.disciplines.join(' / ')}
                href={`/work/${entry.slug}`}
              />
            ))}
          </IndexList>
        </section>

        <section>
          <SectionMarker chapter={chapterNumber('/work')} section={2} label="Field Notes" />
          <IndexList>
            {fieldNotes.map((note) => (
              <IndexRow
                key={note.id}
                id={note.id}
                index={note.id}
                title={note.title}
                href={`/notes#${note.id}`}
              />
            ))}
          </IndexList>
        </section>
      </div>
    </GridFrame>
  );
}
