import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import GridFrame from '@/components/GridFrame';
import SectionMarker from '@/components/SectionMarker';
import { chapterNumber } from '@/lib/chapters';
import { experience, projects } from '@/content/site';

export async function generateStaticParams() {
  return [
    ...experience.map((e) => ({ slug: e.slug })),
    ...projects.map((p) => ({ slug: p.slug })),
  ];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = experience.find((e) => e.slug === slug);
  if (entry) return { title: entry.org, description: entry.summary };

  const project = projects.find((p) => p.slug === slug);
  if (project) return { title: project.title, description: project.outcome };

  return {};
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = experience.find((e) => e.slug === slug);
  const project = projects.find((p) => p.slug === slug);

  if (!entry && !project) notFound();

  return (
    <GridFrame>
      <article className="container pb-20 pt-16 md:pt-24">
        <SectionMarker chapter={chapterNumber('/work')} section={1} label={entry ? 'Experience' : 'Case Study'} />

        {entry && (
          <>
            <h1 className="mb-6 uppercase">{entry.org}</h1>
            <p className="label mb-10 text-muted">
              {entry.disciplines.join(' / ')} — {entry.period}
            </p>
            <p className="mb-14 max-w-prose text-[17px] leading-relaxed">
              {entry.summary}
            </p>

            {entry.projects.length > 0 && (
              <section className="border-t border-rule pt-12">
                <SectionMarker chapter={chapterNumber('/work')} section={2} label="Projects" />
                <ul className="grid gap-8 md:grid-cols-2">
                  {entry.projects.map((projectSlug) => {
                    const p = projects.find((x) => x.slug === projectSlug);
                    if (!p) return null;
                    return (
                      <li key={p.slug} className="border-l border-rule-soft pl-5">
                        <Link href={`/work/${p.slug}`} className="group block">
                          {/* h2, not h3: promoted so the page's heading
                              levels don't skip a level. Size and weight
                              pinned to h3's former values (20px / 500) so
                              the visual hierarchy is unchanged. */}
                          <h2 className="mb-2 text-[20px] font-medium text-ink-blue">
                            {p.title}
                          </h2>
                          <p className="mb-3 text-[15px] text-muted">
                            {p.outcome}
                          </p>
                          <span className="label inline-flex items-center gap-2 text-accent">
                            Open
                            <span
                              aria-hidden="true"
                              className="transition-transform duration-micro ease-enter group-hover:translate-x-1"
                            >
                              &rarr;
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </>
        )}

        {project && (
          <>
            <h1 className="mb-6 uppercase">{project.title}</h1>
            <p className="label mb-10 text-muted">{project.tags.join(' / ')}</p>
            <p className="mb-14 max-w-prose text-[17px] leading-relaxed">
              {project.outcome}
            </p>

            <dl className="grid gap-x-10 gap-y-8 border-t border-rule pt-12 md:grid-cols-2">
              {(
                [
                  ['Data', project.tracklist.data],
                  ['Model', project.tracklist.model],
                  ['System', project.tracklist.system],
                  ['Impact', project.tracklist.impact],
                ] as const
              )
                .filter(([, value]) => Boolean(value))
                .map(([term, value]) => (
                  <div key={term}>
                    <dt className="label mb-2 text-muted">{term}</dt>
                    <dd className="text-[16px] leading-relaxed">{value}</dd>
                  </div>
                ))}
            </dl>
          </>
        )}

        <Link
          href="/work"
          className="label group mt-16 inline-flex items-center gap-2 text-accent"
        >
          <span
            aria-hidden="true"
            className="transition-transform duration-micro ease-enter group-hover:-translate-x-1"
          >
            &larr;
          </span>
          Back to the index
        </Link>
      </article>
    </GridFrame>
  );
}
