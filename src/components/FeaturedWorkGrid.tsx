import React from 'react';
import { projects } from '@/content/site';
import SectionHeaderStrip from './SectionHeaderStrip';
import ProjectCard from './ProjectCard';

export default function FeaturedWorkGrid() {
  const featuredProjects = projects.filter(p => p.featured);

  return (
    <section className="my-16 md:my-24">
      <SectionHeaderStrip
        kicker="Selected Projects"
        title="Featured Work"
        variant="orange"
      />

      {/* Burlap background panel */}
      <div className="relative mt-12 py-8">
        {/* Burlap texture overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'url(/textures/burlap.png)',
            backgroundRepeat: 'repeat',
            mixBlendMode: 'multiply',
          }}
        />

        {/* Grid */}
        <div className="container relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
