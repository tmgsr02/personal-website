import type { MDXComponents } from 'mdx/types';

export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="mb-4 mt-10 font-display text-[var(--h2)] text-ink-blue first:mt-0"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mb-3 mt-8 font-display text-[var(--h3)] text-ink-blue"
      {...props}
    />
  ),
  p: (props) => (
    <p className="mb-4 font-body text-[17px] leading-relaxed" {...props} />
  ),
  ul: (props) => (
    <ul
      className="mb-4 list-disc space-y-2 pl-6 font-body text-[17px] leading-relaxed"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mb-4 list-decimal space-y-2 pl-6 font-body text-[17px] leading-relaxed"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="mb-4 border-l border-rule pl-5 font-body text-[17px] italic leading-relaxed text-muted"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded-sm bg-paper-2 px-1.5 py-0.5 font-mono text-[0.9em]"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="mb-4 overflow-x-auto rounded-sm bg-paper-2 p-4 font-mono text-[17px] leading-relaxed"
      {...props}
    />
  ),
  a: (props) => (
    <a
      className="text-accent underline underline-offset-2 transition-opacity duration-micro ease-enter hover:opacity-70"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-t border-rule" />,
};
