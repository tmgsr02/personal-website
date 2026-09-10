'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { DURATION, EASE } from '@/lib/motion';

interface EngravingPlateProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

/**
 * Wraps next/image and owns the ink-reveal, so no page composes that
 * animation by hand.
 *
 * A true stroke draw-on would need the raster traced to vector; dense
 * crosshatch traces to 20k+ paths and multi-MB SVGs, which fails the
 * performance budget. This reads as ink arriving and costs one transform.
 */
export default function EngravingPlate({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, 60vw',
}: EngravingPlateProps) {
  const reduced = useReducedMotion();

  const image = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      aria-hidden={alt === '' ? true : undefined}
      className="h-auto w-full"
      sizes={sizes}
    />
  );

  // The element tree is identical whether or not motion is reduced — only
  // the variant VALUES differ. Structurally omitting the inner div/veil
  // here would give SSR (which always sees reduced === null, i.e. the
  // non-reduced tree) a different child count than a reduced-motion
  // client's first render, which is exactly the hydration mismatch this
  // component used to have.
  const imageVariants = reduced
    ? { hidden: { opacity: 1 }, shown: { opacity: 1 } }
    : { hidden: { opacity: 0.25 }, shown: { opacity: 1 } };

  const veilVariants = reduced
    ? { hidden: { x: '104%', opacity: 0 }, shown: { x: '104%', opacity: 0 } }
    : { hidden: { x: '0%', opacity: 1 }, shown: { x: '104%', opacity: 0 } };

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '-60px' }}
    >
      {/* engraving-image / engraving-veil: stable hooks for the
          <noscript> rule in layout.tsx, which forces the reveal's END
          state so a failed JS chunk doesn't ship an invisible plate
          behind an opaque paper veil forever — see G1. */}
      <motion.div
        className="engraving-image"
        variants={imageVariants}
        transition={{ duration: DURATION.entrance, ease: EASE.enter }}
      >
        {image}
      </motion.div>

      {/* The ink sweep: a paper-coloured veil translating off to the right.
          Feathered so the leading edge dissolves rather than wipes. All
          three stops derive from --paper via color-mix so a token change
          can't leave a wrong-coloured band mid-gradient. */}
      <motion.div
        aria-hidden="true"
        className="engraving-veil pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(100deg, var(--paper) 38%, color-mix(in srgb, var(--paper) 65%, transparent) 60%, color-mix(in srgb, var(--paper) 0%, transparent) 80%)',
        }}
        variants={veilVariants}
        transition={{ duration: DURATION.entrance, ease: EASE.enter }}
      />
    </motion.div>
  );
}
