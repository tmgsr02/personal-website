import React from 'react';
import { notFound } from 'next/navigation';
import { projects } from '@/content/site';
import TapeLabelTag from '@/components/TapeLabelTag';
import LeatherFooter from '@/components/LeatherFooter';

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

interface CaseStudyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <article className="container py-12 md:py-20">
        {/* Header */}
        <header className="mb-12">
          <h1 className="font-[var(--font-display)] text-[var(--h1)] mb-4 leading-tight">
            {project.title}
          </h1>
          <p className="text-[var(--h3)] text-[var(--ink-2)] font-mono mb-6">
            {project.outcome}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <TapeLabelTag key={tag} label={tag} rotate={index % 3 === 0} />
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="font-[var(--font-display)] text-[var(--h2)] mb-4">Problem</h2>
              <div className="prose prose-lg font-mono text-[var(--ink-2)] leading-relaxed">
                {project.tracklist.data && (
                  <p>
                    Working with {project.tracklist.data.toLowerCase()}, the challenge was to build a system
                    that could {project.outcome.toLowerCase().replace(/\.$/, '')} while maintaining reliability
                    and actionable insights for the team.
                  </p>
                )}
              </div>
            </section>

            <section>
              <h2 className="font-[var(--font-display)] text-[var(--h2)] mb-4">Approach</h2>
              <div className="prose prose-lg font-mono text-[var(--ink-2)] leading-relaxed">
                {project.tracklist.model && (
                  <p className="mb-4">
                    <strong>Model:</strong> {project.tracklist.model}
                  </p>
                )}
                {project.tracklist.system && (
                  <p>
                    <strong>System:</strong> {project.tracklist.system}
                  </p>
                )}
              </div>
            </section>

            <section>
              <h2 className="font-[var(--font-display)] text-[var(--h2)] mb-4">Results</h2>
              <div className="prose prose-lg font-mono text-[var(--ink-2)] leading-relaxed">
                {project.tracklist.impact && (
                  <p>{project.tracklist.impact}</p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar: Tracklist */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-[var(--paper-2)] border-2 border-[var(--ink)] rounded-[var(--r-lg)] p-6">
              <h3 className="font-[var(--font-display)] text-[var(--h3)] mb-6">
                Tracklist
              </h3>

              <div className="space-y-4 text-[var(--small)] font-mono">
                {project.tracklist.data && (
                  <div>
                    <span className="block text-[var(--muted)] uppercase tracking-wide mb-1">
                      Data
                    </span>
                    <span className="text-[var(--ink-2)]">{project.tracklist.data}</span>
                  </div>
                )}
                {project.tracklist.model && (
                  <div>
                    <span className="block text-[var(--muted)] uppercase tracking-wide mb-1">
                      Model
                    </span>
                    <span className="text-[var(--ink-2)]">{project.tracklist.model}</span>
                  </div>
                )}
                {project.tracklist.system && (
                  <div>
                    <span className="block text-[var(--muted)] uppercase tracking-wide mb-1">
                      System
                    </span>
                    <span className="text-[var(--ink-2)]">{project.tracklist.system}</span>
                  </div>
                )}
                {project.tracklist.impact && (
                  <div>
                    <span className="block text-[var(--muted)] uppercase tracking-wide mb-1">
                      Impact
                    </span>
                    <span className="text-[var(--ink-2)]">{project.tracklist.impact}</span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </article>

      <LeatherFooter />
    </>
  );
}
