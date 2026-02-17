import React from 'react';
import { getAllNotes } from '@/lib/notes';
import SectionHeaderStrip from '@/components/SectionHeaderStrip';
import NotesListPage from '@/components/NotesListPage';
import LeatherFooter from '@/components/LeatherFooter';

export default function NotesPage() {
  const notes = getAllNotes();

  return (
    <>
      <SectionHeaderStrip
        kicker="Writing"
        title="All Notes"
        variant="mustard"
      />

      <div className="container py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-[var(--h3)] font-mono text-[var(--ink-2)] mb-12 leading-relaxed">
            Thoughts on data science, supply chain, building products, and whatever else I&apos;m learning.
          </p>

          <NotesListPage notes={notes} />
        </div>
      </div>

      <LeatherFooter />
    </>
  );
}
