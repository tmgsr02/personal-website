'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { NoteMeta } from '@/lib/notes';
import RedDotIndicator from '@/components/RedDotIndicator';

interface NotesListPageProps {
  notes: NoteMeta[];
}

export default function NotesListPage({ notes }: NotesListPageProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="space-y-1">
      {notes.map((note, index) => (
        <Link
          key={note.slug}
          href={`/notes/${note.slug}`}
          className="block py-6 border-b border-[var(--border)] hover:bg-[var(--paper-2)] transition-colors px-4 -mx-4 rounded-[var(--r-sm)]"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="flex items-start gap-4">
            {/* Red dot on hover */}
            <div className="mt-1.5 w-2">
              {hoveredIndex === index && <RedDotIndicator mode="hover" />}
            </div>

            <div className="flex-1">
              {/* Date */}
              <time className="text-[var(--small)] font-mono text-[var(--muted)] uppercase tracking-wide">
                {new Date(note.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>

              {/* Title */}
              <h2 className="font-[var(--font-display)] text-[var(--h3)] mt-2 mb-2 leading-tight">
                {note.title}
              </h2>

              {/* Summary */}
              <p className="text-[var(--body)] text-[var(--ink-2)] font-mono">
                {note.summary}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
