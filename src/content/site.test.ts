import { describe, it, expect } from 'vitest';
import {
  siteConfig,
  experience,
  projects,
  fieldNotes,
  capabilities,
  nowItems,
} from '@/content/site';

describe('site content', () => {
  it('lists the five experience entries from the reference plates', () => {
    expect(experience.map((e) => e.org)).toEqual([
      'Wesco',
      'Chime',
      'Deloitte',
      'Carnegie Mellon',
      'Morehouse',
    ]);
  });

  it('gives every experience entry a unique slug', () => {
    const slugs = experience.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('keeps experience and project slugs disjoint', () => {
    // /work/[slug] resolves against both arrays; an overlapping slug would
    // render two <h1>s on that route and emit a duplicate static param.
    const experienceSlugs = new Set(experience.map((e) => e.slug));
    const projectSlugs = new Set(projects.map((p) => p.slug));
    const overlap = [...experienceSlugs].filter((slug) =>
      projectSlugs.has(slug)
    );
    expect(overlap).toEqual([]);
  });

  it('only references projects that exist', () => {
    const projectSlugs = new Set(projects.map((p) => p.slug));
    for (const entry of experience) {
      for (const slug of entry.projects) {
        expect(projectSlugs.has(slug)).toBe(true);
      }
    }
  });

  it('has exactly four capabilities, each with an existing plate', () => {
    expect(capabilities).toHaveLength(4);
    for (const cap of capabilities) {
      expect(cap.icon).toMatch(/^\/engravings\/cap-[a-z-]+\.webp$/);
    }
  });

  it('has field notes with unique ids', () => {
    const ids = fieldNotes.map((n) => n.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has a now line and at least one now item', () => {
    expect(siteConfig.nowLine.length).toBeGreaterThan(0);
    expect(nowItems.length).toBeGreaterThan(0);
  });
});
