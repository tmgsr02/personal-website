# Opening animation

`Loader.tsx` adapts the user's supplied `NamePreloader` React prototype. The
intro uses actual M and T glyphs for the collision, the supplied interpolation
curves and delays, radial letter scattering, kerned assembly, a falling dot,
true italic surname, and a circular curtain collapse centred on that dot.

The visual adaptation uses the local site's Bodoni Moda, `--paper`,
`--ink-blue`, and existing paper grain. The homepage copy, composition and
engraving remain intact. Bodoni's real italic cut is loaded alongside its
upright cut; the ending does not synthesize a skewed upright font.

## Mechanics retained from the prototype

- Measure whole text runs with DOM Ranges to retain the font's kerning when
  positioning individual glyphs. Measure upright and italic separately, and
  re-centre the complete name as the surname changes cut.
- Fit the wider of the two compositions to 86% of the viewport, iteratively
  reducing the 132px starting size. The word gap is 0.28em.
- Rise from below at scale 3.6 to 1.18 with cubic deceleration; pause; accelerate
  T downward with quadratic easing into M. Recoil by 0.38em at scale 1.28.
- Burst remaining letters radially from the collision with randomized angle,
  distance and rotation; 22ms stagger. Hold, then settle using the supplied
  back-overshoot curve and 16ms stagger.
- Use a dotless i in **Twahirwa** (index 4 within the surname). Diff the ink of
  `i` and `ı` on canvas to measure the dot for both real font cuts. Drop it from
  above the screen, rebound, then move it with the italic stem.
- Crossfade upright/italic surname glyphs over 260ms while their measured
  positions move over 480ms. The dot glows in blue, then the paper curtain
  shrinks into its centre over 820ms.

The supplied millisecond timing constants are preserved at the top of
`Loader.tsx`. Nominal choreography is about 5.7 seconds, plus font readiness
and frame scheduling. The prototype's timing supersedes the previous
four-second SVG-monogram version.

## Integration and cleanup

```tsx
const [loaded, setLoaded] = useState(false);
return <>{!loaded && <Loader onComplete={() => setLoaded(true)} />}</>;
```

The adapted component retains the prototype's requestAnimationFrame
interpolator. It owns its DOM glyph stage; React owns the surrounding dialog
and lifecycle. Rotation is retained between tweens to prevent a snap when the
scattered letters begin settling. A final measurement at the fitted font size
keeps the rendered size and geometry in agreement.

The existing `OpeningIntro` integration owns homepage/session eligibility and
development replay. It returns focus to the homepage heading after completion.
Use `/?intro=replay` or **Replay intro** in development. Repeat visits, fragment
navigation, history restoration, non-home routes, unavailable storage and
reduced motion bypass the opening.

A native modal dialog contains keyboard focus. Skip and Escape dismiss
immediately. The body and document's previous overflow values are restored on
finish or unmount. Every timer and frame callback is cleaned up; cancellation
tokens prevent an old run from changing a newer replay. Width changes restart
with fresh measurements; browser chrome height changes do not restart playback.

Both font cuts are requested before measurement, with a 1.8-second timeout.
A failed font/measurement step dismisses the intro. Each run has an independent
8.5-second ceiling. The pre-hydration cover still fails open after three seconds
if React never mounts. Reduced motion enabled mid-sequence dismisses immediately.
No custom cursor or prototype page content is added to the website.

## Verification

- TypeScript, ESLint, all 33 Vitest tests and the production build pass.
- Compared the supplied HTML prototype and the adaptation in the browser.
- Reviewed collision, radial burst, settling, falling dot, true italic finish
  and circular reveal on desktop and mobile; checked name fit down to 320px.
- Checked Escape, Skip, scroll restoration and heading focus after dismissal.
- A fresh production visit played the intro; a repeat reload bypassed it.
