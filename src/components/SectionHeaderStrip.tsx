import React from 'react';

interface SectionHeaderStripProps {
  kicker?: string;
  title: string;
  variant?: 'orange' | 'mustard' | 'blue' | 'ink';
}

export default function SectionHeaderStrip({
  kicker,
  title,
  variant = 'ink'
}: SectionHeaderStripProps) {
  const variantStyles = {
    orange: 'bg-[var(--pop-orange)]',
    mustard: 'bg-[var(--pop-mustard)]',
    blue: 'bg-[var(--pop-blue)]',
    ink: 'bg-[var(--ink)]',
  };

  return (
    <div
      className={`${variantStyles[variant]} text-[var(--paper)] px-6 py-4 md:py-6 -mx-6 md:-mx-8`}
    >
      <div className="container">
        {kicker && (
          <p className="text-[var(--small)] font-mono uppercase tracking-wider mb-2 opacity-90">
            {kicker}
          </p>
        )}
        <h2 className="font-[var(--font-display)] text-[var(--h2)]">{title}</h2>
      </div>
    </div>
  );
}
