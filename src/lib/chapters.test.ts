import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { chapters } from '@/content/site';
import { chapterNumber } from './chapters';

describe('chapterNumber', () => {
  it('numbers each chapter by its 1-based position in the nav', () => {
    chapters.forEach((chapter, i) => {
      expect(chapterNumber(chapter.href)).toBe(i + 1);
    });
  });

  it('treats the home page as the cover, chapter 0', () => {
    expect(chapterNumber('/')).toBe(0);
  });

  it('refuses a route that is not a chapter, including detail routes', () => {
    // Detail pages pass their parent's route, never their own.
    expect(() => chapterNumber('/abuot')).toThrow();
    expect(() => chapterNumber('/work/wesco')).toThrow();
  });

  it('gives every chapter a distinct route', () => {
    // A duplicated href would silently hand the second copy the first
    // copy's number.
    const hrefs = chapters.map((c) => c.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});

/* ------------------------------------------------------------------
   Page source scan

   Section numbers are only trustworthy if no page types one by hand —
   hand-typed `index={5}` values are exactly how the site ended up
   running 05 / 01 / 06. So, the way tokens.test.ts reads tokens.css,
   this reads every page's source and checks each <SectionMarker>.
------------------------------------------------------------------ */

interface Marker {
  /** The route given to chapterNumber(), or null when the chapter was not
   *  written as chapter={chapterNumber('<route>')} — e.g. a literal 4. */
  route: string | null;
  section: number | undefined;
  raw: string;
}

function parseMarkers(source: string): Marker[] {
  const tags = source.match(/<SectionMarker\b[\s\S]*?\/>/g) ?? [];
  return tags.map((raw) => {
    const chapter = raw.match(/\bchapter=\{chapterNumber\('([^']*)'\)\}/);
    const section = raw.match(/\bsection=\{(\d+)\}/);
    return {
      route: chapter ? chapter[1] : null,
      section: section ? Number(section[1]) : undefined,
      raw,
    };
  });
}

describe('parseMarkers', () => {
  it('reads the route and section from a marker', () => {
    const src = `<SectionMarker chapter={chapterNumber('/about')} section={2} label="Capabilities" />`;
    expect(parseMarkers(src)).toMatchObject([{ route: '/about', section: 2 }]);
  });

  it('reads a marker whose props span several lines', () => {
    const src = `<SectionMarker\n  chapter={chapterNumber('/work')}\n  section={1}\n  label="Experience"\n/>`;
    expect(parseMarkers(src)).toMatchObject([{ route: '/work', section: 1 }]);
  });

  it('flags a hand-typed chapter number', () => {
    // The case this whole scan exists for: a literal must not pass.
    const [marker] = parseMarkers(
      `<SectionMarker chapter={4} section={1} label="About" />`
    );
    expect(marker.route).toBeNull();
  });
});

const APP_DIR = path.join(process.cwd(), 'src/app');

function findPages(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return findPages(full);
    return entry.name === 'page.tsx' ? [full] : [];
  });
}

/** `src/app/work/[slug]/page.tsx` → `/work`; `src/app/page.tsx` → `/`. */
function routeOf(file: string): string {
  const [first] = path.relative(APP_DIR, path.dirname(file)).split(path.sep);
  return first ? `/${first}` : '/';
}

const pages = findPages(APP_DIR)
  .map((file) => ({
    file: path.relative(process.cwd(), file),
    route: routeOf(file),
    markers: parseMarkers(fs.readFileSync(file, 'utf-8')),
  }))
  .filter((page) => page.markers.length > 0);

const home = pages.find((page) => page.route === '/');
const chapterPages = pages.filter((page) => page.route !== '/');

describe('section markers in page source', () => {
  it('finds every page it is meant to guard', () => {
    // Without this, a moved directory or a renamed component would make
    // the scan match nothing and every check below pass vacuously.
    expect(home).toBeDefined();
    expect(chapterPages.map((page) => page.route)).toEqual(
      expect.arrayContaining(chapters.map((c) => c.href))
    );
  });

  describe.each(chapterPages.map((page) => [page.file, page] as const))(
    '%s',
    (_file, page) => {
      it("takes every marker's chapter from its own route", () => {
        for (const marker of page.markers) {
          expect(marker.route, `wrong or hand-typed chapter: ${marker.raw}`).toBe(
            page.route
          );
        }
      });

      it('numbers its sections 1, 2, 3… in page order', () => {
        expect(page.markers.map((m) => m.section)).toEqual(
          page.markers.map((_, i) => i + 1)
        );
      });
    }
  );

  describe('home page — the contents page', () => {
    const markers = home?.markers ?? [];

    it('opens with the cover, 00 // INTRODUCTION', () => {
      expect(markers[0]?.route).toBe('/');
    });

    it('previews chapters in ascending chapter order', () => {
      for (const marker of markers) {
        expect(marker.route, `hand-typed chapter: ${marker.raw}`).not.toBeNull();
      }
      const numbers = markers.map((m) => chapterNumber(m.route as string));
      numbers.slice(1).forEach((n, i) => {
        expect(n, `home block ${i + 2} is out of chapter order`).toBeGreaterThan(
          numbers[i]
        );
      });
    });

    it('gives home blocks bare chapter numbers, never sections', () => {
      // Each home block stands for a whole chapter: `01`, not `01.1`.
      for (const marker of markers) {
        expect(marker.section, marker.raw).toBeUndefined();
      }
    });
  });
});
