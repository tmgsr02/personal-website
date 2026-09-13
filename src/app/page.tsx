import React from 'react';
import Link from 'next/link';
import GridFrame from '@/components/GridFrame';
import SectionMarker from '@/components/SectionMarker';
import EngravingPlate from '@/components/EngravingPlate';
import CapabilityCard from '@/components/CapabilityCard';
import IndexList from '@/components/IndexList';
import IndexRow from '@/components/IndexRow';
import { siteConfig, capabilities, projects } from '@/content/site';
import { getAllEssays } from '@/lib/writing';
import { itemNumber } from '@/lib/numbering';

export default function HomePage() {
  const featured = projects.filter((p) => p.featured);
  const essays = getAllEssays().slice(0, 3);
  const [primaryAction, secondaryAction] = siteConfig.hero.actions;

  return (
    <GridFrame
      railLeft={['TOR', 'EST', '2024']}
      railRight={['IDEAS', 'PEOPLE', 'SYSTEMS', 'A BRIGHTER TOMORROW']}
    >
      {/* 01 — Hero */}
      <section id="introduction" className="container scroll-mt-24 pb-20 pt-16 md:pt-24">
        <SectionMarker index={1} label="Introduction" />
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            {/* Sentence case at --display-l, not the global --display-xl caps:
                each line is one whole sentence, and at xl in caps they wrap
                mid-sentence into four lines and push the actions off-screen. */}
            <h1 data-intro-arrival="heading" data-intro-heading tabIndex={-1} className="mb-8 text-[length:var(--display-l)]">
              {siteConfig.hero.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            {siteConfig.hero.body.map((paragraph, i) => (
              <p
                key={i}
                data-intro-arrival="body"
                className={`max-w-prose text-[17px] leading-relaxed ${
                  i === siteConfig.hero.body.length - 1 ? 'mb-10' : 'mb-6'
                }`}
              >
                {paragraph}
              </p>
            ))}
            <div data-intro-arrival="actions" className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href={primaryAction.href}
                className="label group inline-flex items-center gap-3 bg-ink-blue px-6 py-3.5 text-paper transition-transform duration-micro ease-enter hover:-translate-y-0.5"
              >
                {primaryAction.label}
                <span
                  aria-hidden="true"
                  className="text-accent transition-transform duration-micro ease-enter group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </Link>
              <Link
                href={secondaryAction.href}
                className="label group inline-flex items-center gap-3 border-b border-rule py-3.5 transition-colors duration-micro ease-enter hover:border-ink-blue"
              >
                {secondaryAction.label}
                <span
                  aria-hidden="true"
                  className="text-accent transition-transform duration-micro ease-enter group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </Link>
            </div>
            <p data-intro-arrival="caption" className="label mt-10 text-muted">Curiosity to clarity</p>
          </div>

          <div data-intro-arrival="artwork">
            <EngravingPlate
              src="/engravings/home-hero.webp"
              alt=""
              width={1536}
              height={1024}
              priority
              animateReveal={false}
            />
          </div>
        </div>
      </section>

      {/* 02 — Capabilities */}
      <section id="capabilities" className="container scroll-mt-24 border-t border-rule py-20">
        <SectionMarker index={2} label="Capabilities" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {capabilities.map((capability) => (
            <CapabilityCard key={capability.index} capability={capability} />
          ))}
        </div>
      </section>

      {/* 03 — Selected work */}
      <section id="work" className="container scroll-mt-24 border-t border-rule py-20">
        <SectionMarker index={3} label="Selected Work" />
        <IndexList>
          {featured.map((project, i) => (
            <IndexRow
              key={project.slug}
              id={project.slug}
              index={itemNumber(i + 1)}
              title={project.title}
              subtitle={project.tags.join(' / ')}
              href={`/work/${project.slug}`}
            />
          ))}
        </IndexList>
      </section>

      {/* 04 — Writing */}
      <section id="writing" className="container scroll-mt-24 border-t border-rule py-20">
        <SectionMarker index={4} label="Writing" />
        <IndexList>
          {essays.map((essay, i) => (
            <IndexRow
              key={essay.slug}
              id={essay.slug}
              index={itemNumber(i + 1)}
              title={essay.title}
              subtitle={essay.readingTime}
              href={`/writing/${essay.slug}`}
            />
          ))}
        </IndexList>
      </section>
    </GridFrame>
  );
}
