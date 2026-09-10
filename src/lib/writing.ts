import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const WRITING_DIR = path.join(process.cwd(), 'src/content/writing');

export interface EssayMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readingTime: string;
}

export interface EssayWithContent extends EssayMeta {
  content: string;
}

/** Slugs come from the URL, so reject anything that is not a bare slug. */
function isSafeSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]*$/i.test(slug);
}

/**
 * gray-matter's `data` is `any`, so a missing frontmatter field would
 * otherwise silently become `title: undefined` (an empty <h1>, an
 * untitled index row) or `date: undefined` (a `NaN` sort comparator,
 * i.e. arbitrary order). Fail loudly at build time instead, naming the
 * offending file — a build that fails beats a site that renders wrong.
 */
function validateFrontmatter(
  slug: string,
  data: Record<string, unknown>
): { title: string; date: string } {
  if (typeof data.title !== 'string' || data.title.trim() === '') {
    throw new Error(`Essay "${slug}.mdx" is missing a string "title".`);
  }
  if (typeof data.date !== 'string' || Number.isNaN(Date.parse(data.date))) {
    throw new Error(`Essay "${slug}.mdx" is missing a valid "date".`);
  }
  return { title: data.title, date: data.date };
}

function toMeta(slug: string, raw: string): EssayWithContent {
  const { data, content } = matter(raw);
  const { title, date } = validateFrontmatter(slug, data);
  const stats = readingTime(content);

  return {
    slug,
    title,
    date,
    summary: data.summary ?? '',
    tags: data.tags ?? [],
    readingTime: `${Math.ceil(stats.minutes)} min`,
    content,
  };
}

/**
 * A draft is an essay whose body is empty once frontmatter and whitespace
 * are stripped — e.g. a scaffolded file with just a bare `##` heading.
 * Drafts are excluded from every index (see `getAllEssays`) but the file
 * itself is never touched: it stays on disk, editable, and simply isn't
 * "published" until it has content.
 */
function isDraft(content: string): boolean {
  return content.replace(/^#+\s*$/gm, '').trim() === '';
}

export function getAllEssays(): EssayMeta[] {
  const files = fs.readdirSync(WRITING_DIR).filter((f) => f.endsWith('.mdx'));

  const essays = files
    .map((filename): EssayWithContent => {
      const slug = filename.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(WRITING_DIR, filename), 'utf-8');
      return toMeta(slug, raw);
    })
    .filter((essay) => !isDraft(essay.content))
    .map(({ content, ...meta }): EssayMeta => {
      void content;
      return meta;
    });

  return essays.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getEssayBySlug(slug: string): EssayWithContent | null {
  if (!isSafeSlug(slug)) return null;

  const filePath = path.join(WRITING_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  return toMeta(slug, fs.readFileSync(filePath, 'utf-8'));
}
