import React from 'react';
import SectionHeaderStrip from '@/components/SectionHeaderStrip';
import { interests } from '@/content/site';
import LeatherFooter from '@/components/LeatherFooter';

const timeline = [
  {
    year: '2024',
    title: 'Senior Data Scientist',
    company: 'Supply Chain Co.',
    description: 'Leading ML initiatives for demand forecasting and inventory optimization.',
  },
  {
    year: '2021',
    title: 'Data Scientist',
    company: 'Logistics Firm',
    description: 'Built predictive models for route optimization and cost reduction.',
  },
  {
    year: '2018',
    title: 'Data Analyst',
    company: 'Manufacturing Inc.',
    description: 'Developed dashboards and reporting systems for operations team.',
  },
];

export default function AboutPage() {
  return (
    <>
      <SectionHeaderStrip
        kicker="Background"
        title="About Me"
        variant="blue"
      />

      <div className="container py-12 md:py-20">
        {/* Bio Section */}
        <section className="max-w-3xl mb-16">
          <p className="text-[var(--h3)] font-mono text-[var(--ink-2)] leading-relaxed mb-6">
            I&apos;m a data scientist who loves building products that solve real problems.
          </p>
          <div className="space-y-4 text-[var(--body)] font-mono text-[var(--ink-2)] leading-relaxed">
            <p>
              For the past 6+ years, I&apos;ve been deep in the supply chain world, using machine learning
              and data tools to optimize everything from demand forecasting to inventory management.
            </p>
            <p>
              I believe the best data science happens when you deeply understand the domain and can
              ship solutions that people actually use. That&apos;s why I focus on the full stack: from SQL
              queries to production ML pipelines to user-facing Power BI dashboards.
            </p>
            <p>
              When I&apos;m not building ML models, you&apos;ll find me on a basketball court, digging through
              record crates, capturing moments with my camera, or hacking on side projects that scratch
              my own itches.
            </p>
          </div>
        </section>

        {/* Timeline with Stitched Spine */}
        <section className="mb-16">
          <h2 className="font-[var(--font-display)] text-[var(--h2)] mb-12">Timeline</h2>

          <div className="relative pl-8 md:pl-12">
            {/* Stitched spine line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--leather)] opacity-30" />

            {/* Stitch marks */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-around">
              {timeline.map((_, index) => (
                <div
                  key={index}
                  className="w-3 h-3 bg-[var(--stitch)] rounded-full -translate-x-1"
                />
              ))}
            </div>

            <div className="space-y-12">
              {timeline.map((item) => (
                <div key={item.year} className="relative">
                  <div className="absolute -left-8 md:-left-12 top-0 font-[var(--font-display)] text-[var(--h3)] text-[var(--muted)]">
                    {item.year}
                  </div>
                  <div className="pl-4">
                    <h3 className="font-[var(--font-display)] text-[var(--h3)] mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[var(--body)] text-[var(--muted)] font-mono mb-2">
                      {item.company}
                    </p>
                    <p className="text-[var(--body)] text-[var(--ink-2)] font-mono">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interests */}
        <section>
          <h2 className="font-[var(--font-display)] text-[var(--h2)] mb-8">Beyond Work</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {interests.map((interest) => (
              <div
                key={interest.title}
                className="border-2 border-[var(--ink)] rounded-[var(--r-md)] p-6 bg-[var(--paper)] hover:bg-[var(--paper-2)] transition-colors text-center"
              >
                <div className="text-4xl mb-3">{interest.icon}</div>
                <h3 className="font-[var(--font-display)] text-[var(--body)] mb-2">
                  {interest.title}
                </h3>
                <p className="text-[var(--small)] text-[var(--muted)] font-mono">
                  {interest.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <LeatherFooter />
    </>
  );
}
