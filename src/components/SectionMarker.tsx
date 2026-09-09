'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DURATION, EASE } from '@/lib/motion';

interface SectionMarkerProps {
  index: number;
  label: string;
}

export default function SectionMarker({ index, label }: SectionMarkerProps) {
  const reduced = useReducedMotion();
  const padded = String(index).padStart(2, '0');
  const letters = Array.from(label);

  return (
    <p className="label mb-8 flex items-center gap-3">
      <span>{padded}</span>
      <span aria-hidden="true" className="text-rule">{'//'}</span>
      {/* The full label stays readable to assistive tech; the per-letter
          spans are decorative sequencing only. */}
      <span className="sr-only">{label}</span>
      <span aria-hidden="true">
        {letters.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            className="inline-block whitespace-pre"
            initial={reduced ? false : { opacity: 0, y: 4 }}
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
