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
      <h3 className="mb-2 font-display text-[clamp(18px,2vw,24px)] text-ink-blue">
        {capability.title}
      </h3>
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
