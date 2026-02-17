import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import { getAllNotes, getNoteBySlug } from '@/lib/notes';
import { mdxComponents } from '@/components/mdx-components';
import TapeLabelTag from '@/components/TapeLabelTag';
import LeatherFooter from '@/components/LeatherFooter';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const notes = getAllNotes();
  return notes.map((note) => ({
    slug: note.slug,
  }));
}

interface NotePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.summary,
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const allNotes = getAllNotes();
  const noteIndex = allNotes.findIndex((n) => n.slug === slug);
  const note = getNoteBySlug(slug);

  if (!note || noteIndex === -1) {
    notFound();
  }

  const { content: mdxContent } = await compileMDX({
    source: note.content,
    components: mdxComponents,
  });

  const prevNote = noteIndex < allNotes.length - 1 ? allNotes[noteIndex + 1] : null;
  const nextNote = noteIndex > 0 ? allNotes[noteIndex - 1] : null;

  return (
    <>
      <article className="container py-12 md:py-20">
        {/* Header */}
        <header className="max-w-3xl mb-12">
          <div className="flex items-center gap-4 mb-6">
            <time className="text-[var(--small)] font-mono text-[var(--muted)] uppercase tracking-wide">
              {new Date(note.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            {note.readingTime && (
              <>
                <span className="text-[var(--muted)]" aria-hidden="true">&middot;</span>
                <span className="text-[var(--small)] font-mono text-[var(--muted)]">
                  {note.readingTime} read
                </span>
              </>
            )}
          </div>

          <h1 className="font-[var(--font-display)] text-[var(--h1)] mb-6 leading-tight">
            {note.title}
          </h1>

          <p className="text-[var(--h3)] text-[var(--ink-2)] font-mono leading-relaxed">
            {note.summary}
          </p>

          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {note.tags.map((tag, index) => (
                <TapeLabelTag key={tag} label={tag} rotate={index % 3 === 0} />
              ))}
            </div>
          )}
        </header>

        {/* Divider */}
        <div className="max-w-3xl border-t-2 border-[var(--ink)] mb-12" />

        {/* Content */}
        <div className="max-w-3xl">
          {mdxContent}
        </div>

        {/* Navigation */}
        <nav className="max-w-3xl mt-16 pt-8 border-t border-[var(--border)]" aria-label="Note navigation">
          <div className="flex justify-between items-start gap-8">
            {prevNote ? (
              <Link
                href={`/notes/${prevNote.slug}`}
                className="group flex-1 min-w-0"
              >
                <span className="text-[var(--small)] font-mono text-[var(--muted)] uppercase tracking-wide">
                  Previous
                </span>
                <p className="font-[var(--font-display)] text-[var(--h3)] mt-1 leading-tight group-hover:text-[var(--pop-orange)] transition-colors truncate">
                  {prevNote.title}
                </p>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {nextNote ? (
              <Link
                href={`/notes/${nextNote.slug}`}
                className="group flex-1 min-w-0 text-right"
              >
                <span className="text-[var(--small)] font-mono text-[var(--muted)] uppercase tracking-wide">
                  Next
                </span>
                <p className="font-[var(--font-display)] text-[var(--h3)] mt-1 leading-tight group-hover:text-[var(--pop-orange)] transition-colors truncate">
                  {nextNote.title}
                </p>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/notes"
              className="text-[var(--small)] font-mono text-[var(--muted)] uppercase tracking-wide hover:text-[var(--ink)] transition-colors"
            >
              &larr; All Notes
            </Link>
          </div>
        </nav>
      </article>

      <LeatherFooter />
    </>
  );
}
