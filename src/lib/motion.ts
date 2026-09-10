import type { Transition } from 'framer-motion';

/** Seconds. Mirrors --dur-* in tokens.css. */
export const DURATION = {
  micro: 0.18,
  entrance: 0.7,
  frame: 0.9,
} as const;

/**
 * Mirrors --ease-* in tokens.css.
 *
 * Deliberately NOT `as const`: that would produce a readonly tuple, which
 * is not assignable to Framer Motion's `Transition['ease']` and fails
 * typecheck wherever EASE.enter/EASE.exit are passed straight into a
 * `transition` prop.
 */
export const EASE: {
  enter: [number, number, number, number];
  exit: [number, number, number, number];
} = {
  enter: [0.22, 1, 0.36, 1],
  exit: [0.4, 0, 0.2, 1],
};

export function enterTransition(delay = 0): Transition {
  return {
    duration: DURATION.entrance,
    ease: EASE.enter,
    delay,
  };
}
