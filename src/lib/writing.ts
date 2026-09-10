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

function toMeta(slug: string, raw: string): EssayWithContent {
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title,
    date: data.date,
    summary: data.summary ?? '',
    tags: data.tags ?? [],
    readingTime: `${Math.ceil(stats.minutes)} min`,
    content,
  };
}

export function getAllEssays(): EssayMeta[] {
  const files = fs.readdirSync(WRITING_DIR).filter((f) => f.endsWith('.mdx'));

  const essays = files.map((filename): EssayMeta => {
    const slug = filename.replace(/\.mdx$/, '');
    const raw = fs.readFileSync(path.join(WRITING_DIR, filename), 'utf-8');
    const { content, ...meta } = toMeta(slug, raw);
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
