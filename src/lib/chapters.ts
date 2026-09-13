import { chapters } from '@/content/site';

/**
 * A route's chapter number: its 1-based position in the nav (`chapters` in
 * src/content/site.ts). The home page is the cover, chapter 0.
 *
 * Pass a chapter's base route. Detail pages use their parent's —
 * `/work/[slug]` calls `chapterNumber('/work')` — matching how TopNav marks
 * the parent active there.
 *
 * Throws on any other route, so a typo like `chapterNumber('/abuot')` fails
 * the static build instead of shipping a wrong number.
 */
export function chapterNumber(href: string): number {
  if (href === '/') return 0;
  const index = chapters.findIndex((chapter) => chapter.href === href);
  if (index === -1) {
    throw new Error(`chapterNumber: '${href}' is not a nav chapter`);
  }
  return index + 1;
}
