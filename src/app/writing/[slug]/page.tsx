import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import type { Metadata } from 'next';
import GridFrame from '@/components/GridFrame';
import SectionMarker from '@/components/SectionMarker';
import { getAllEssays, getEssayBySlug } from '@/lib/writing';
import { mdxComponents } from '@/components/mdx-components';

export async function generateStaticParams() {
  return getAllEssays().map((essay) => ({ slug: essay.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);
  if (!essay) return {};
  return { title: essay.title, description: essay.summary };
}

export default async function EssayPage({ params }: PageProps) {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);

  if (!essay) notFound();

  const { content } = await compileMDX({
    source: essay.content,
    components: mdxComponents,
    options: { parseFrontmatter: false },
  });

  return (
    <GridFrame>
      <article className="container pb-20 pt-16 md:pt-24">
        <SectionMarker index={1} label="Essay" />
        <h1 className="mb-6">{essay.title}</h1>
        <p className="label mb-14 text-muted">
          {essay.date} — {essay.readingTime}
        </p>
        <div className="max-w-prose">{content}</div>

        <Link
          href="/writing"
          className="label group mt-16 inline-flex items-center gap-2 text-accent"
        >
          <span
            aria-hidden="true"
            className="transition-transform duration-micro ease-enter group-hover:-translate-x-1"
          >
            &larr;
          </span>
          All writing
        </Link>
      </article>
    </GridFrame>
  );
}
