import React from 'react';
import { interests } from '@/content/site';

export default function AboutPanel() {
  return (
    <section className="container py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: About Text */}
        <div>
          <h2 className="font-[var(--font-display)] text-[var(--h2)] mb-6">
            A bit about me
          </h2>
          <div className="space-y-4 text-[var(--body)] text-[var(--ink-2)] font-mono leading-relaxed">
            <p>
              I&apos;m a data scientist who fell in love with building products. For the past 6+ years,
              I&apos;ve been in the supply chain trenches, using ML and data tools to solve real business problems.
            </p>
            <p>
              I believe the best data science happens when you understand the domain deeply and
              can ship solutions that people actually use. That&apos;s why I focus on the full stack:
              from SQL queries to production pipelines to user-facing dashboards.
            </p>
            <p>
              When I&apos;m not optimizing inventory algorithms, I&apos;m probably on a basketball court,
              hunting for records, or building side projects that scratch my own itches.
            </p>
          </div>
        </div>

        {/* Right: Interest Tiles (Comic Panels) */}
        <div className="grid grid-cols-2 gap-4">
          {interests.map((interest) => (
            <div
              key={interest.title}
              className="border-2 border-[var(--ink)] rounded-[var(--r-md)] p-6 bg-[var(--paper)] hover:bg-[var(--paper-2)] transition-colors"
            >
              <div className="text-4xl mb-3">{interest.icon}</div>
              <h3 className="font-[var(--font-display)] text-[var(--h3)] mb-2 leading-tight">
                {interest.title}
              </h3>
              <p className="text-[var(--small)] text-[var(--muted)] font-mono">
                {interest.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
