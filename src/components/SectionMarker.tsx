'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DURATION, EASE } from '@/lib/motion';
import { sectionNumber } from '@/lib/numbering';

interface SectionMarkerProps {
  /** The route's chapter — always `chapterNumber('<route>')`, never a
   *  literal. See design.md §3.2. */
  chapter: number;
  /** Position on the page, from 1. Omitted only on home blocks, which
   *  stand for a whole chapter. */
  section?: number;
  label: string;
}

export default function SectionMarker({
  chapter,
  section,
  label,
}: SectionMarkerProps) {
  const reduced = useReducedMotion();
  const number = sectionNumber(chapter, section);
  const letters = Array.from(label);

  return (
    <p className="label mb-8 flex items-center gap-3">
      <span>{number}</span>
      <span aria-hidden="true" className="text-rule">{'//'}</span>
      {/* The full label stays readable to assistive tech; the per-letter
          spans are decorative sequencing only. */}
      <span className="sr-only">{label}</span>
      <span aria-hidden="true">
        {letters.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            // section-letter: stable hook for the <noscript> rule in
            // layout.tsx — see G1.
            className="section-letter inline-block whitespace-pre"
            // Stable object shape across both branches — only the target
            // value varies — so this only ever produces an attribute-level
            // difference, never a type-level one. See GridFrame for the
            // same principle.
            initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{
              duration: DURATION.micro,
              ease: EASE.enter,
              delay: i * 0.018,
            }}
          >
            {char}
          </motion.span>
        ))}
      </span>
    </p>
  );
}
