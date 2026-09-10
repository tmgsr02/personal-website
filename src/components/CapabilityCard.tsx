import React from 'react';
import Image from 'next/image';
import type { Capability } from '@/content/site';

export default function CapabilityCard({
  capability,
}: {
  capability: Capability;
}) {
  return (
    <article className="flex flex-col border-l border-rule-soft pl-5">
      <p className="label mb-3 text-muted">
        {capability.index} {'//'}
      </p>
      {/* h2, not h3: promoted so the page's heading levels don't skip a
          level (h1 -> h3 previously). Font size and weight are pinned
          explicitly so promoting the tag doesn't inherit h2's larger
          default scale — the visual hierarchy is unchanged. */}
      <h2 className="mb-2 font-display text-[clamp(18px,2vw,24px)] font-medium text-ink-blue">
        {capability.title}
      </h2>
      <p className="mb-6 text-[15px] text-muted">{capability.description}</p>
      <Image
        src={capability.icon}
        alt=""
        aria-hidden="true"
        width={1024}
        height={1024}
        sizes="(max-width: 768px) 45vw, 22vw"
        className="mt-auto h-auto w-full max-w-[220px] select-none"
      />
    </article>
  );
}
