import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/content/site';
import RedDotIndicator from './RedDotIndicator';

export default function HeroPanel() {
  const { headline, subhead, nowLine, ctas } = siteConfig.hero;

  return (
    <section className="container py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: H1 + subhead + CTAs + "● Now: …" */}
        <div>
          <h1 className="font-[var(--font-display)] text-[var(--h1)] leading-[var(--lh-tight)] mb-6">
            {headline}
          </h1>

          <p className="text-[var(--h3)] text-[var(--ink-2)] font-mono mb-8 leading-relaxed">
            {subhead}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-8">
            {ctas.map((cta) => (
              <Link
                key={cta.href}
                href={cta.href}
                className={
                  cta.variant === 'primary'
                    ? 'px-6 py-3 bg-[var(--ink)] text-[var(--paper)] font-mono text-sm rounded-[var(--r-md)] hover:bg-[var(--ink-2)] transition-colors'
                    : 'px-6 py-3 border-2 border-[var(--ink)] text-[var(--ink)] font-mono text-sm rounded-[var(--r-md)] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors'
                }
              >
                {cta.label}
              </Link>
            ))}
          </div>

          {/* Now Line */}
          <div className="flex items-center gap-3 font-mono text-[var(--small)] text-[var(--muted)]">
            <RedDotIndicator mode="inline" />
            <span>
              <strong className="text-[var(--ink)]">Now:</strong> {nowLine}
            </span>
          </div>
        </div>

        {/* Right: pop-art image crop in "comic frame" (3px ink border, radius r-lg) */}
        <div className="relative">
          <div className="border-[3px] border-[var(--ink)] rounded-[var(--r-lg)] overflow-hidden aspect-square relative">
            <Image
              src="/images/pop-room.png"
              alt="Pop art styled workspace"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
