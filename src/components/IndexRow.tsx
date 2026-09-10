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
  const dimmed = hoveredId !== null && hoveredId !== id;

  return (
    <li
      className="border-b border-rule-soft"
      onMouseEnter={() => setHoveredId(id)}
    >
      <Link
        href={href}
        className="group flex items-center gap-5 py-5 transition-opacity duration-micro ease-enter"
        style={{ opacity: dimmed ? 0.45 : 1 }}
        onFocus={() => setHoveredId(id)}
        onBlur={() => setHoveredId(null)}
      >
        <span className="label w-8 shrink-0 text-muted">{index}</span>

        <span className="min-w-0 flex-1">
          <span className="block font-display text-[clamp(20px,2.4vw,30px)] leading-tight text-ink-blue">
            {title}
          </span>
          {subtitle && (
            <span className="label mt-1 block text-muted">{subtitle}</span>
          )}
        </span>

        <span
          aria-hidden="true"
          className="shrink-0 text-xl text-accent transition-transform duration-micro ease-enter group-hover:translate-x-1 group-focus-visible:translate-x-1"
        >
          &rarr;
        </span>
      </Link>
    </li>
  );
}
