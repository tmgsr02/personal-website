import React from 'react';
import HeroPanel from '@/components/HeroPanel';
import FeaturedWorkGrid from '@/components/FeaturedWorkGrid';
import ProofStrip from '@/components/ProofStrip';
import StitchedDivider from '@/components/StitchedDivider';
import AboutPanel from '@/components/AboutPanel';
import NotesList from '@/components/NotesList';
import LeatherFooter from '@/components/LeatherFooter';
import { getAllNotes } from '@/lib/notes';

export default function HomePage() {
  const notes = getAllNotes();

  return (
    <>
      {/* 1. HeroPanel */}
      <HeroPanel />

      {/* 2. FeaturedWorkGrid (with SectionHeaderStrip) */}
      <FeaturedWorkGrid />

      {/* 3. ProofStrip */}
      <ProofStrip />

      {/* 4. AboutPanel (preceded by StitchedDivider) */}
      <StitchedDivider />
      <AboutPanel />

      {/* 5. NotesList (SectionHeaderStrip) */}
      <NotesList notes={notes} />

      {/* 6. LeatherFooter */}
      <LeatherFooter />
    </>
  );
}
