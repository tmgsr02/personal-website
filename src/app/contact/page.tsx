'use client';

import React, { useState } from 'react';
import { siteConfig } from '@/content/site';
import SectionHeaderStrip from '@/components/SectionHeaderStrip';
import RedDotIndicator from '@/components/RedDotIndicator';
import LeatherFooter from '@/components/LeatherFooter';

export default function ContactPage() {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <>
      <SectionHeaderStrip
        kicker="Get in Touch"
        title="Let's Talk"
        variant="ink"
      />

      <div className="container py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[var(--ink)] text-[var(--paper)] rounded-[var(--r-lg)] p-8 md:p-12">
            {/* Intro */}
            <div className="mb-12">
              <p className="text-[var(--h3)] font-mono leading-relaxed mb-6">
                I&apos;m always open to interesting conversations about data science, supply chain,
                product building, or potential collaborations.
              </p>
              <p className="text-[var(--body)] font-mono opacity-80">
                Drop me a line and I&apos;ll get back to you soon.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6 mb-12">
              <div>
                <h3 className="font-[var(--font-display)] text-[var(--h3)] mb-4">Email</h3>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-3 font-mono text-[var(--body)] hover:text-[var(--signal-red)] transition-colors group"
                  onMouseEnter={() => setFocusedField('email')}
                  onMouseLeave={() => setFocusedField(null)}
                >
                  {focusedField === 'email' && <RedDotIndicator mode="hover" />}
                  <span className="group-hover:underline">{siteConfig.email}</span>
                </a>
              </div>

              <div>
                <h3 className="font-[var(--font-display)] text-[var(--h3)] mb-4">Social</h3>
                <div className="space-y-3">
                  <a
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 font-mono text-[var(--body)] hover:text-[var(--signal-red)] transition-colors group"
                    onMouseEnter={() => setFocusedField('linkedin')}
                    onMouseLeave={() => setFocusedField(null)}
                  >
                    {focusedField === 'linkedin' && <RedDotIndicator mode="hover" />}
                    <span className="group-hover:underline">LinkedIn</span>
                  </a>

                  <a
                    href={siteConfig.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 font-mono text-[var(--body)] hover:text-[var(--signal-red)] transition-colors group"
                    onMouseEnter={() => setFocusedField('github')}
                    onMouseLeave={() => setFocusedField(null)}
                  >
                    {focusedField === 'github' && <RedDotIndicator mode="hover" />}
                    <span className="group-hover:underline">GitHub</span>
                  </a>

                  <a
                    href={siteConfig.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 font-mono text-[var(--body)] hover:text-[var(--signal-red)] transition-colors group"
                    onMouseEnter={() => setFocusedField('twitter')}
                    onMouseLeave={() => setFocusedField(null)}
                  >
                    {focusedField === 'twitter' && <RedDotIndicator mode="hover" />}
                    <span className="group-hover:underline">Twitter</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Best For */}
            <div className="border-t border-[var(--paper-2)] border-opacity-20 pt-8">
              <h3 className="font-[var(--font-display)] text-[var(--body)] mb-4 opacity-80">
                Best for:
              </h3>
              <ul className="space-y-2 font-mono text-[var(--small)] opacity-70">
                <li>• Consulting or freelance opportunities</li>
                <li>• Technical discussions about ML in supply chain</li>
                <li>• Collaboration on interesting projects</li>
                <li>• Just saying hi</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <LeatherFooter />
    </>
  );
}
