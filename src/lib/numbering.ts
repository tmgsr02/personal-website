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

/**
 * A section marker's number: the two-digit chapter, optionally followed by
 * a one-digit section — `04` for a home block previewing a whole chapter,
 * `04.1` for the first section on a chapter page. See src/lib/chapters.ts.
 */
export function sectionNumber(chapter: number, section?: number): string {
  const place = placeNumber(chapter);
  if (section === undefined) return place;
  if (!Number.isInteger(section) || section < 1 || section > 9) {
    throw new RangeError(
      `sectionNumber: expected a section 1–9, got ${section}`
    );
  }
  return `${place}.${section}`;
}

export function itemNumber(position: number): string {
  if (!Number.isInteger(position) || position < 1 || position > 999) {
    throw new RangeError(
      `itemNumber: expected a 1-based position 1–999, got ${position}`
    );
  }
  return String(position).padStart(3, '0');
}
