'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/content/site';
import RedDotIndicator from './RedDotIndicator';
import StitchedDivider from './StitchedDivider';

const footerLinks = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/notes', label: 'Notes' },
  { href: '/contact', label: 'Contact' },
];

export default function LeatherFooter() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <footer className="mt-24">
      <StitchedDivider />

      {/* Leather background section */}
      <div className="relative bg-[var(--leather)] text-[var(--paper)] py-12">
        {/* Leather texture overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'url(/textures/leather-stitch.png)',
            backgroundRepeat: 'repeat',
            mixBlendMode: 'overlay',
          }}
        />

        <div className="container relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left: Links */}
            <div>
              <h3 className="font-[var(--font-display)] text-[var(--h3)] mb-6">
                Navigate
              </h3>
              <ul className="space-y-3">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 font-mono text-sm hover:text-[var(--paper-2)] transition-colors"
                      onMouseEnter={() => setHoveredLink(link.href)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      {hoveredLink === link.href && <RedDotIndicator mode="hover" />}
                      <span className="hover:underline">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Contact & Social */}
            <div>
              <h3 className="font-[var(--font-display)] text-[var(--h3)] mb-6">
                Connect
              </h3>
              <div className="space-y-3 font-mono text-sm">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="block hover:text-[var(--paper-2)] hover:underline transition-colors"
                >
                  {siteConfig.email}
                </a>
                <div className="flex gap-4 mt-4">
                  <a
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--paper-2)] transition-colors"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={siteConfig.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--paper-2)] transition-colors"
                  >
                    GitHub
                  </a>
                  <a
                    href={siteConfig.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--paper-2)] transition-colors"
                  >
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-[var(--leather-2)] text-center">
            <p className="text-[var(--small)] font-mono text-[var(--paper-2)] opacity-70">
              © {new Date().getFullYear()} {siteConfig.name}. Handcrafted with care.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
