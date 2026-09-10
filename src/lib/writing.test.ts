import { describe, it, expect } from 'vitest';
import { getAllEssays, getEssayBySlug } from '@/lib/writing';

describe('getAllEssays', () => {
  it('finds every migrated, non-draft essay', () => {
    const essays = getAllEssays();
    expect(essays.length).toBe(3);
  });

  it('excludes a draft essay (empty body) from the index', () => {
    // 2026-goals-and-aspirations.mdx has real frontmatter but a bare "##"
    // body, dated newest — it must not appear in getAllEssays(), even
    // though the file stays on disk untouched.
    const slugs = getAllEssays().map((e) => e.slug);
    expect(slugs).not.toContain('2026-goals-and-aspirations');
  });

  it('sorts newest first', () => {
    const dates = getAllEssays().map((e) => new Date(e.date).getTime());
    const sorted = [...dates].sort((a, b) => b - a);
    expect(dates).toEqual(sorted);
  });

  it('gives every essay a non-empty title and slug', () => {
    for (const essay of getAllEssays()) {
      expect(essay.slug).not.toBe('');
      expect(essay.title).toBeTruthy();
    }
  });
});

describe('getEssayBySlug', () => {
  it('returns content for a known slug', () => {
    const essay = getEssayBySlug('early-warning-systems');
    expect(essay).not.toBeNull();
    expect(essay?.content.length).toBeGreaterThan(0);
  });

  it('returns null for an unknown slug', () => {
    expect(getEssayBySlug('does-not-exist')).toBeNull();
  });

  it('does not traverse outside the writing directory', () => {
    expect(getEssayBySlug('../../../etc/passwd')).toBeNull();
  });

  it('rejects a traversing slug even when it resolves to a real essay', () => {
    // Without isSafeSlug this path.join()s straight back into WRITING_DIR and
    // returns a real essay, so this case fails loudly if the guard is ever
    // removed — unlike a traversal to a file that does not exist, which would
    // pass for the wrong reason.
    expect(getEssayBySlug('../writing/early-warning-systems')).toBeNull();
  });
});
