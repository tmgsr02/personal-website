'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/content/site';
import TapeLabelTag from './TapeLabelTag';
import RedDotIndicator from './RedDotIndicator';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className="relative bg-[var(--paper)] border-2 border-[var(--ink)] rounded-[var(--r-lg)] p-6 shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Title */}
      <h3 className="text-[var(--h3)] font-[var(--font-display)] mb-3 leading-tight">
        {project.title}
      </h3>

      {/* Outcome */}
      <p className="text-[var(--body)] text-[var(--ink-2)] mb-4 leading-relaxed">
        {project.outcome}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.tags.map((tag, index) => (
          <TapeLabelTag key={tag} label={tag} rotate={index % 3 === 0} />
        ))}
      </div>

      {/* Tracklist */}
      <div className="space-y-2 mb-6 text-[var(--small)] font-mono">
        <h4 className="uppercase tracking-wide text-[var(--muted)] mb-3">Tracklist</h4>
        {project.tracklist.data && (
          <div>
            <span className="text-[var(--muted)]">Data:</span>{' '}
            <span className="text-[var(--ink-2)]">{project.tracklist.data}</span>
          </div>
        )}
        {project.tracklist.model && (
          <div>
            <span className="text-[var(--muted)]">Model:</span>{' '}
            <span className="text-[var(--ink-2)]">{project.tracklist.model}</span>
          </div>
        )}
        {project.tracklist.system && (
          <div>
            <span className="text-[var(--muted)]">System:</span>{' '}
            <span className="text-[var(--ink-2)]">{project.tracklist.system}</span>
          </div>
        )}
        {project.tracklist.impact && (
          <div>
            <span className="text-[var(--muted)]">Impact:</span>{' '}
            <span className="text-[var(--ink-2)]">{project.tracklist.impact}</span>
          </div>
        )}
      </div>

      {/* CTA */}
      <Link
        href={`/work/${project.slug}`}
        className="inline-flex items-center gap-2 font-mono text-[var(--small)] text-[var(--ink)] hover:text-[var(--signal-red)] transition-colors group"
      >
        {isHovered && <RedDotIndicator mode="hover" />}
        <span className="group-hover:underline">Open case study →</span>
      </Link>
    </article>
  );
}
