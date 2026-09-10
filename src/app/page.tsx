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

export default function HomePage() {
  const featured = projects.filter((p) => p.featured);
  const essays = getAllEssays().slice(0, 3);

  return (
    <GridFrame
      railLeft={['TOR', 'EST', '2024']}
      railRight={['IDEAS', 'PEOPLE', 'SYSTEMS', 'A BRIGHTER TOMORROW']}
    >
      {/* 01 — Hero */}
      <section className="container pb-20 pt-16 md:pt-24">
        <SectionMarker index={1} label="Introduction" />
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h1 className="mb-8 uppercase">{siteConfig.tagline}</h1>
            <p className="mb-6 max-w-prose text-[17px] leading-relaxed">
              {siteConfig.hero.subhead}
            </p>
            <p className="mb-10 max-w-prose text-[17px] leading-relaxed">
              {siteConfig.hero.secondary}
            </p>
            <Link
              href="/work"
              className="label group inline-flex items-center gap-3 bg-ink-blue px-6 py-3.5 text-paper transition-transform duration-micro ease-enter hover:-translate-y-0.5"
            >
              View the work
              <span
                aria-hidden="true"
                className="text-accent transition-transform duration-micro ease-enter group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </Link>
            <p className="label mt-10 text-muted">Curiosity to clarity</p>
          </div>

          <EngravingPlate
            src="/engravings/home-hero.webp"
            alt=""
            width={1536}
            height={1024}
            priority
          />
        </div>
      </section>

      {/* 02 — Capabilities */}
      <section className="container border-t border-rule py-20">
        <SectionMarker index={2} label="Capabilities" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {capabilities.map((capability) => (
            <CapabilityCard key={capability.index} capability={capability} />
          ))}
        </div>
      </section>

      {/* 03 — Selected work */}
      <section className="container border-t border-rule py-20">
        <SectionMarker index={3} label="Selected Work" />
        <IndexList>
          {featured.map((project, i) => (
            <IndexRow
              key={project.slug}
              id={project.slug}
              index={String(i + 1).padStart(2, '0')}
              title={project.title}
              subtitle={project.tags.join(' / ')}
              href={`/work/${project.slug}`}
            />
          ))}
        </IndexList>
      </section>

      {/* 04 — Writing */}
      <section className="container border-t border-rule py-20">
        <SectionMarker index={4} label="Writing" />
        <IndexList>
          {essays.map((essay, i) => (
            <IndexRow
              key={essay.slug}
              id={essay.slug}
              index={String(i + 1).padStart(3, '0')}
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
