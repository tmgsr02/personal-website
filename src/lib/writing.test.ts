import { describe, it, expect } from 'vitest';
import { getAllEssays, getEssayBySlug } from '@/lib/writing';

describe('getAllEssays', () => {
  it('finds every migrated essay', () => {
    const essays = getAllEssays();
    expect(essays.length).toBe(4);
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
});
