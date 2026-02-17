import type { MDXComponents } from 'mdx/types';

export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="font-[var(--font-display)] text-[var(--h2)] mb-4 mt-10 first:mt-0"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="font-[var(--font-display)] text-[var(--h3)] mb-3 mt-8"
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="text-[var(--body)] font-mono text-[var(--ink-2)] leading-relaxed mb-4"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="list-disc pl-6 space-y-2 text-[var(--body)] font-mono text-[var(--ink-2)] leading-relaxed mb-4"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="list-decimal pl-6 space-y-2 text-[var(--body)] font-mono text-[var(--ink-2)] leading-relaxed mb-4"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-[var(--ink)] pl-4 italic text-[var(--body)] font-mono text-[var(--ink-2)] leading-relaxed mb-4"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="bg-[var(--paper-2)] px-1.5 py-0.5 rounded text-[0.9em] font-mono"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="bg-[var(--paper-2)] p-4 rounded-[var(--r-sm)] overflow-x-auto mb-4 text-[var(--body)] font-mono leading-relaxed"
      {...props}
    />
  ),
  a: (props) => (
    <a
      className="underline underline-offset-2 hover:text-[var(--pop-orange)] transition-colors"
      {...props}
    />
  ),
  hr: () => (
    <hr className="border-t border-[var(--border)] my-8" />
  ),
};
