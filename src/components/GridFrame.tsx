'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DURATION, EASE } from '@/lib/motion';
import SideRail from './SideRail';

interface GridFrameProps {
  railLeft?: string[];
  railRight?: string[];
  children: React.ReactNode;
}

/**
 * A corner crop mark: a small plus built from two hairline elements.
 *
 * Deliberately CSS rather than SVG — the mark sits at a corner defined by
 * var(--frame-inset), and SVG geometry attributes cannot resolve var().
 */
function CropMark({ style }: { style: React.CSSProperties }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none fixed z-0 block h-0 w-0"
      style={style}
    >
      <span className="absolute left-1/2 top-1/2 block h-[13px] w-px -translate-x-1/2 -translate-y-1/2 bg-rule" />
      <span className="absolute left-1/2 top-1/2 block h-px w-[13px] -translate-x-1/2 -translate-y-1/2 bg-rule" />
    </span>
  );
}

const INSET = 'var(--frame-inset)';

export default function GridFrame({
  railLeft,
  railRight,
  children,
}: GridFrameProps) {
  const reduced = useReducedMotion();

  return (
    <div className="relative min-h-screen">
      {/* The frame. The <svg> box carries the inset in CSS; the rect uses
          plain percentage geometry so nothing depends on var() resolving
          inside an SVG attribute. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed z-0"
        style={{
          top: INSET,
          right: INSET,
          bottom: INSET,
          left: INSET,
          width: 'auto',
          height: 'auto',
          overflow: 'visible',
        }}
        fill="none"
      >
        <motion.rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          stroke="var(--rule)"
          strokeWidth="1"
          pathLength={1}
          initial={reduced ? false : { strokeDashoffset: 1 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: DURATION.frame, ease: EASE.enter }}
          style={{ strokeDasharray: 1 }}
        />
      </svg>

      <CropMark style={{ top: INSET, left: INSET }} />
      <CropMark style={{ top: INSET, right: INSET }} />
      <CropMark style={{ bottom: INSET, left: INSET }} />
      <CropMark style={{ bottom: INSET, right: INSET }} />

      {railLeft && <SideRail side="left" lines={railLeft} />}
      {railRight && <SideRail side="right" lines={railRight} />}

      <div className="relative z-[2]">{children}</div>
    </div>
  );
}
