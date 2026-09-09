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
      sizes="(max-width: 768px) 100vw, 60vw"
    />
  );

  // Reduced motion resolves to the final state, not a faster animation.
  if (reduced) {
    return <div className={`relative ${className}`}>{image}</div>;
  }

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '-60px' }}
    >
      <motion.div
        variants={{ hidden: { opacity: 0.25 }, shown: { opacity: 1 } }}
        transition={{ duration: DURATION.entrance, ease: EASE.enter }}
      >
        {image}
      </motion.div>

      {/* The ink sweep: a paper-coloured veil translating off to the right.
          Feathered so the leading edge dissolves rather than wipes. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(100deg, var(--paper) 38%, rgba(247, 243, 231, 0.65) 60%, rgba(247, 243, 231, 0) 80%)',
        }}
        variants={{
          hidden: { x: '0%', opacity: 1 },
          shown: { x: '104%', opacity: 0 },
        }}
        transition={{ duration: DURATION.entrance, ease: EASE.enter }}
      />
    </motion.div>
  );
}
