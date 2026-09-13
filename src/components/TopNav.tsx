'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { DURATION, EASE } from '@/lib/motion';
import { siteConfig, chapters } from '@/content/site';
import { chapterNumber } from '@/lib/chapters';
import { placeNumber } from '@/lib/numbering';

/** The active marker: a ring that expands once from the accent dot. */
function ActiveMarker() {
  const reduced = useReducedMotion();
  // Always render the ring — SSR (reduced === null) always emits it, so
  // conditionally omitting it on the client's first render (when reduced
  // resolves to true) would be a structural hydration mismatch. When
  // reduced, animate to the same values as initial so it's present but
  // static instead of absent.
  const initial = { scale: 1, opacity: 0.9 };
  const animate = reduced ? initial : { scale: 3.2, opacity: 0 };
  return (
    <span aria-hidden="true" className="relative inline-block h-1.5 w-1.5">
      <span className="absolute inset-0 rounded-full bg-accent" />
      <motion.span
        className="absolute inset-0 rounded-full border border-accent"
        initial={initial}
        animate={animate}
        transition={{ duration: DURATION.entrance, ease: EASE.exit }}
      />
    </span>
  );
}

export default function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + '/');

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper">
      <nav className="container flex h-[68px] items-center justify-between">
        <Link
          href="/"
          className="label text-[13px] tracking-[0.18em] text-ink-blue"
        >
          {siteConfig.name}
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {chapters.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className="label flex items-center gap-2 transition-colors duration-micro ease-enter hover:text-accent"
              >
                {isActive(link.href) && <ActiveMarker />}
                {/* Chapter number: nav position is the numbering every
                    section marker uses (design.md §3.2). lg and up only —
                    six numbered labels overflow the bar at 768px.
                    aria-hidden keeps the link's accessible name "Work",
                    not "01 Work". */}
                <span aria-hidden="true" className="hidden text-muted lg:inline">
                  {placeNumber(chapterNumber(link.href))}
                </span>
                <span
                  className={
                    isActive(link.href)
                      ? 'border-b border-accent pb-0.5 text-ink-blue'
                      : 'text-ink-blue'
                  }
                >
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setOpen(!open)}
          className="label text-ink-blue md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-rule-soft bg-paper pb-6 md:hidden"
        >
          <ul className="container flex flex-col gap-4 pt-4">
            {chapters.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className="label flex items-center gap-2 text-ink-blue"
                >
                  {isActive(link.href) && <ActiveMarker />}
                  <span aria-hidden="true" className="text-muted">
                    {placeNumber(chapterNumber(link.href))}
                  </span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
