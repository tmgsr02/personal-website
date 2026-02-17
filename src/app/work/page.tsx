import React from 'react';
import { projects } from '@/content/site';
import SectionHeaderStrip from '@/components/SectionHeaderStrip';
import ProjectCard from '@/components/ProjectCard';
import LeatherFooter from '@/components/LeatherFooter';

export default function WorkPage() {
  return (
    <>
      <SectionHeaderStrip
        kicker="Portfolio"
        title="All Projects"
        variant="orange"
      />

      <div className="container py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>

      <LeatherFooter />
    </>
  );
}
