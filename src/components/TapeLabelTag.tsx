import React from 'react';

interface TapeLabelTagProps {
  label: string;
  rotate?: boolean;
}

export default function TapeLabelTag({ label, rotate = false }: TapeLabelTagProps) {
  return (
    <span
      className={`inline-block px-3 py-1 text-[var(--small)] font-mono uppercase tracking-wide bg-[var(--paper-2)] border border-[var(--border-strong)] rounded-[var(--r-sm)] ${
        rotate ? '-rotate-1' : ''
      }`}
    >
      {label}
    </span>
  );
}
