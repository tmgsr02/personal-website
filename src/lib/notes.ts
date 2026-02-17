import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const NOTES_DIR = path.join(process.cwd(), 'src/content/notes');

export interface NoteMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readingTime: string;
}

export interface NoteWithContent extends NoteMeta {
  content: string;
}

export function getAllNotes(): NoteMeta[] {
  const files = fs.readdirSync(NOTES_DIR).filter((f) => f.endsWith('.mdx'));

  const notes = files.map((filename): NoteMeta => {
    const slug = filename.replace(/\.mdx$/, '');
    const raw = fs.readFileSync(path.join(NOTES_DIR, filename), 'utf-8');
    const { data, content } = matter(raw);
    const stats = readingTime(content);

    return {
      slug,
      title: data.title,
      date: data.date,
      summary: data.summary,
      tags: data.tags ?? [],
      readingTime: `${Math.ceil(stats.minutes)} min`,
    };
  });

  return notes.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getNoteBySlug(slug: string): NoteWithContent | null {
  const filePath = path.join(NOTES_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title,
    date: data.date,
    summary: data.summary,
    tags: data.tags ?? [],
    readingTime: `${Math.ceil(stats.minutes)} min`,
    content,
  };
}
