import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const css = fs.readFileSync(
  path.join(process.cwd(), 'src/styles/tokens.css'),
  'utf-8'
);

function token(name: string): string {
  const match = css.match(new RegExp(`--${name}\\s*:\\s*([^;]+);`));
  if (!match) throw new Error(`Token --${name} not found in tokens.css`);
  return match[1].trim();
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('design tokens', () => {
  it('defines the locked palette verbatim', () => {
    expect(token('paper')).toBe('#F7F3E7');
    expect(token('paper-2')).toBe('#F1ECDD');
    expect(token('ink-blue')).toBe('#1B3A6B');
    expect(token('ink-blue-2')).toBe('#2F5A9E');
    expect(token('rule')).toBe('#A8BBD6');
    expect(token('rule-soft')).toBe('#D3DDEA');
    expect(token('text')).toBe('#211E1A');
    expect(token('muted')).toBe('#6B6459');
    // Darkened from the brief's #C8492B: that value fails the WCAG AA 4.5:1
    // contrast assertion below (4.26:1 against --paper). Per the controller's
    // contrast-gate instruction, the token was darkened to #BE4528 (4.65:1)
    // and this literal updated to match tokens.css, the source of truth.
    expect(token('accent')).toBe('#BE4528');
  });

  it('meets WCAG AA 4.5:1 for body text on paper', () => {
    expect(contrast(token('text'), token('paper'))).toBeGreaterThanOrEqual(4.5);
  });

  it('meets WCAG AA 4.5:1 for display ink on paper', () => {
    expect(contrast(token('ink-blue'), token('paper'))).toBeGreaterThanOrEqual(4.5);
  });

  it('meets WCAG AA 4.5:1 for the accent on paper', () => {
    expect(contrast(token('accent'), token('paper'))).toBeGreaterThanOrEqual(4.5);
  });

  it('meets WCAG AA 4.5:1 for muted text on paper', () => {
    expect(contrast(token('muted'), token('paper'))).toBeGreaterThanOrEqual(4.5);
  });

  it('retires every Analog Pop Craft token', () => {
    for (const dead of [
      'pop-orange', 'pop-mustard', 'pop-blue',
      'leather', 'stitch', 'signal-red',
      'newsprint', 'aged-paper',
      'shadow-sm', 'shadow-md',
      'r-md', 'r-lg', 'r-pill',
    ]) {
      expect(css).not.toContain(`--${dead}:`);
    }
  });
});
