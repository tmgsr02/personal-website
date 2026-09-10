import React from 'react';
import type { Metadata } from 'next';
import GridFrame from '@/components/GridFrame';
import SectionMarker from '@/components/SectionMarker';
import EngravingPlate from '@/components/EngravingPlate';
import { fieldNotes } from '@/content/site';

export const metadata: Metadata = { title: 'Notes' };

export default function NotesPage() {
  return (
    <GridFrame railRight={['SMALL', 'EXPERIMENTS', 'BIGGER', 'PERSPECTIVE']}>
      <section className="container pb-16 pt-16 md:pt-24">
        <SectionMarker index={6} label="Field Notes" />
        <div className="grid items-center gap-12 md:grid-cols-[3fr_2fr] md:gap-16">
          <div>
            <h1 className="mb-8 uppercase">Small experiments</h1>
            <p className="max-w-prose text-[17px] leading-relaxed">
              Short entries — things I am testing, reading, or noticing. Less
              finished than the essays, and kept that way on purpose.
            </p>
          </div>
          <EngravingPlate
            src="/engravings/notes-still-life.webp"
            alt=""
            width={1024}
            height={1024}
            priority
          />
        </div>
      </section>

      <section className="container border-t border-rule py-20">
        <ul className="grid gap-x-12 gap-y-10 md:grid-cols-2">
          {fieldNotes.map((note) => (
            <li key={note.id} className="border-l border-rule-soft pl-5">
              <p className="label mb-2 text-muted">
                {note.id} — {note.date}
              </p>
              <h2 className="mb-2 font-display text-[clamp(20px,2.2vw,26px)]">
                {note.title}
              </h2>
              <p className="text-[15px] leading-relaxed text-muted">
                {note.summary}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </GridFrame>
  );
}
