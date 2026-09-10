'use client';

import React from 'react';
import Link from 'next/link';
import { useIndexList } from './IndexList';

interface IndexRowProps {
  id: string;
  index: string;
  title: string;
  subtitle?: string;
  href: string;
}

export default function IndexRow({
  id,
  index,
  title,
  subtitle,
  href,
}: IndexRowProps) {
  const { hoveredId, setHoveredId } = useIndexList();
  const focused = hoveredId === id;
  const otherFocused = hoveredId !== null && !focused;

  // Dimming sibling TEXT to signal focus was tried and measured: at any
  // opacity dim enough to read as a dim, title/subtitle/arrow all drop
  // below the WCAG AA 4.5:1 floor (title needs >=0.71 to clear it,
  // subtitle >=0.93, arrow >=0.98 — see IndexRow's fix notes in
  // final-fixes.md D1). That is a contrast floor, not a taste call, so it
  // is not tunable by picking a different number. `filter: blur()` was
  // also considered and rejected: it forces a compositing layer per row,
  // which is real cost multiplied across every row in the list. The
  // effect is inverted instead — emphasise the focused row's title and
  // arrow, leave every sibling at full, always-AA-compliant opacity.
  const handleMouseEnter = () => {
    // Guard against touch: mouseenter is synthesized on tap, and only the
    // list's mouseleave clears it, which can strand a row in the
    // "focused" state on a device with no real hover.
    if (
      typeof window !== 'undefined' &&
      !window.matchMedia('(hover: hover)').matches
    ) {
      return;
    }
    setHoveredId(id);
  };

  return (
    <li className="border-b border-rule-soft" onMouseEnter={handleMouseEnter}>
      <Link
        href={href}
        className="group flex items-center gap-5 py-5"
        onFocus={() => setHoveredId(id)}
        onBlur={() => setHoveredId(null)}
      >
        <span className="label w-8 shrink-0 text-muted">{index}</span>

        <span className="min-w-0 flex-1">
          <span
            className={`block font-display text-[clamp(20px,2.4vw,30px)] leading-tight transition-colors duration-micro ease-enter ${
              focused ? 'text-accent' : 'text-ink-blue'
            }`}
          >
            {title}
          </span>
          {subtitle && (
            <span className="label mt-1 block text-muted">{subtitle}</span>
          )}
        </span>

        <span
          aria-hidden="true"
          className="shrink-0 text-xl text-accent transition-[transform,opacity] duration-micro ease-enter group-hover:translate-x-1 group-focus-visible:translate-x-1"
          style={{ opacity: otherFocused ? 0.45 : 1 }}
        >
          &rarr;
        </span>
      </Link>
    </li>
  );
}
