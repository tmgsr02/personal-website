import React from 'react';

export default function StitchedDivider() {
  return (
    <div className="relative w-full h-6 my-12">
      {/* Leather strip base */}
      <div className="absolute inset-0 bg-[var(--leather)] rounded-sm" />

      {/* Leather texture overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none rounded-sm"
        style={{
          backgroundImage: 'url(/textures/leather-stitch.png)',
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Top stitch line */}
      <div className="absolute top-1 left-4 right-4 h-px flex justify-between">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={`top-${i}`}
            className="w-2 h-0.5 bg-[var(--stitch)] rounded-full"
          />
        ))}
      </div>

      {/* Bottom stitch line */}
      <div className="absolute bottom-1 left-4 right-4 h-px flex justify-between">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={`bottom-${i}`}
            className="w-2 h-0.5 bg-[var(--stitch)] rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
