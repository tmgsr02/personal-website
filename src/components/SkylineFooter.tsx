import React from 'react';
import Image from 'next/image';
import { siteConfig } from '@/content/site';

const links = [
  { label: 'Email', href: `mailto:${siteConfig.email}` },
  { label: 'LinkedIn', href: siteConfig.social.linkedin },
  { label: 'GitHub', href: siteConfig.social.github },
  { label: 'Are.na', href: siteConfig.social.arena },
];

export default function SkylineFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 overflow-hidden">
      <div className="container pb-10">
        <ul className="flex flex-wrap gap-x-10 gap-y-4">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="label group inline-flex items-center gap-1.5 transition-colors duration-micro ease-enter hover:text-accent"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="text-accent transition-transform duration-micro ease-enter group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                >
                  &#8599;
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="label mt-8 text-muted">
          {siteConfig.name} &copy; {year} — Built with intention.
        </p>
      </div>

      {/* Full-bleed plate. Decorative. */}
      <Image
        src="/engravings/toronto-skyline.webp"
        alt=""
        aria-hidden="true"
        width={1536}
        height={1024}
        sizes="100vw"
        className="h-auto w-full select-none"
      />
    </footer>
  );
}
