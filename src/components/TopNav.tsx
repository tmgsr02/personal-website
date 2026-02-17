'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RedDotIndicator from './RedDotIndicator';

const navLinks = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/notes', label: 'Notes' },
  { href: '/contact', label: 'Contact' },
];

export default function TopNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-[var(--paper)] border-b border-[var(--border)]">
      <nav className="container h-[72px] flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* Logo/Name */}
          <Link href="/" className="flex items-center gap-2 font-mono font-semibold text-[var(--ink)]">
            <RedDotIndicator mode="nav" />
            <span>Miguel Twahirwa</span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
              const isHovered = hoveredLink === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 font-mono text-sm text-[var(--ink)] hover:text-[var(--ink-2)] transition-colors"
                    onMouseEnter={() => setHoveredLink(link.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {(isActive || isHovered) && <RedDotIndicator mode="hover" />}
                    <span className={isActive ? 'border-b-2 border-[var(--ink)]' : ''}>
                      {link.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[var(--ink)]"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Paper drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--paper)] border-b border-[var(--border)] pb-4">
          <ul className="container flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 font-mono text-sm text-[var(--ink)]"
                  >
                    {isActive && <RedDotIndicator mode="nav" />}
                    <span className={isActive ? 'border-b-2 border-[var(--ink)]' : ''}>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
