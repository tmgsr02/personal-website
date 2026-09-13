/**
 * The site's one numbering rule, in one place.
 *
 * Two digits name a PLACE — a chapter or section (`04 // CAPABILITIES`).
 * Three digits count an ITEM in a list (`001  Wesco`, a capability card).
 * The widths differ on purpose: a section marker and the first row beneath
 * it must never read as the same number. Every rendered counter goes
 * through one of these two functions — never an inline `padStart`.
 *
 * Both throw on out-of-range input rather than render a number of the
 * wrong width. Every page that uses them is statically built, so a bad
 * value fails the build instead of shipping.
 */

export function placeNumber(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 99) {
    throw new RangeError(`placeNumber: expected an integer 0–99, got ${n}`);
  }
  return String(n).padStart(2, '0');
}

export function itemNumber(position: number): string {
  if (!Number.isInteger(position) || position < 1 || position > 999) {
    throw new RangeError(
      `itemNumber: expected a 1-based position 1–999, got ${position}`
    );
  }
  return String(position).padStart(3, '0');
}
