'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { DURATION, EASE } from '@/lib/motion';
import { siteConfig } from '@/content/site';

const navLinks = [
  { href: '/work', label: 'Work' },
  { href: '/writing', label: 'Writing' },
  { href: '/notes', label: 'Notes' },
  { href: '/about', label: 'About' },
  { href: '/now', label: 'Now' },
  { href: '/contact', label: 'Contact' },
];

/** The active marker: a ring that expands once from the accent dot. */
function ActiveMarker() {
  const reduced = useReducedMotion();
  return (
    <span aria-hidden="true" className="relative inline-block h-1.5 w-1.5">
      <span className="absolute inset-0 rounded-full bg-accent" />
      {!reduced && (
        <motion.span
          className="absolute inset-0 rounded-full border border-accent"
          initial={{ scale: 1, opacity: 0.9 }}
          animate={{ scale: 3.2, opacity: 0 }}
          transition={{ duration: DURATION.entrance, ease: EASE.exit }}
        />
      )}
    </span>
  );
}

export default function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + '/');

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur-[2px]">
      <nav className="container flex h-[68px] items-center justify-between">
        <Link
          href="/"
          className="label text-[13px] tracking-[0.18em] text-ink-blue"
        >
          {siteConfig.name}
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className="label flex items-center gap-2 transition-colors duration-micro ease-enter hover:text-accent"
              >
                {isActive(link.href) && <ActiveMarker />}
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
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className="label flex items-center gap-2 text-ink-blue"
                >
                  {isActive(link.href) && <ActiveMarker />}
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
