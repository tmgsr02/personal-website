import React from 'react';

interface SideRailProps {
  side: 'left' | 'right';
  lines: string[];
}

/**
 * Stacked wide-tracked caps text running down the frame margin.
 * Decorative — hidden from assistive tech and below the md breakpoint.
 */
export default function SideRail({ side, lines }: SideRailProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        'pointer-events-none absolute top-24 hidden select-none md:block',
        side === 'left' ? 'left-0' : 'right-0',
      ].join(' ')}
      style={{ width: 'var(--frame-inset)' }}
    >
      <div className="flex flex-col items-center gap-1">
        {lines.map((line) => (
          <span
            key={line}
            className="label text-[9px] leading-tight"
            style={{ writingMode: 'vertical-rl' }}
          >
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
