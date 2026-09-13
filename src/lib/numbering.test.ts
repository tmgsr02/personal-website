import { describe, it, expect } from 'vitest';
import { placeNumber, itemNumber } from './numbering';

// The site's one numbering rule: two digits name a PLACE (a chapter or
// section — `04 // CAPABILITIES`), three digits count an ITEM in a list
// (`001  Wesco`). The widths differ on purpose, so a section marker and the
// first row beneath it can never read as the same number.

describe('placeNumber', () => {
  it('pads a place to two digits', () => {
    expect(placeNumber(0)).toBe('00');
    expect(placeNumber(4)).toBe('04');
    expect(placeNumber(12)).toBe('12');
  });

  it('refuses anything that would not fit in two digits', () => {
    expect(() => placeNumber(100)).toThrow();
    expect(() => placeNumber(-1)).toThrow();
    expect(() => placeNumber(1.5)).toThrow();
  });
});

describe('itemNumber', () => {
  it('pads a 1-based list position to three digits', () => {
    expect(itemNumber(1)).toBe('001');
    expect(itemNumber(12)).toBe('012');
    expect(itemNumber(999)).toBe('999');
  });

  it('refuses positions that are not 1-based or would overflow three digits', () => {
    expect(() => itemNumber(0)).toThrow();
    expect(() => itemNumber(1000)).toThrow();
    expect(() => itemNumber(2.5)).toThrow();
  });
});
