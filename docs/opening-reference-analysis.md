# Frame-by-frame analysis of 0911.mov

Source: `/Users/migueltwahirwa/Desktop/0911.mov`.
159 decoded frames at 30 fps; duration 5.300 seconds; source size 1388 × 1080.
Frames below are zero-based. Times are relative to the start of the recording.
Every frame was inspected in indexed contact sheets. The companion
`opening-reference-analysis.html` embeds all 159 frames and supports stepping,
scrubbing, and original/half/quarter-speed playback.

## Observed choreography

| Frames | Recorded time | What actually happens |
|---|---|---|
| 0–19 | 0.00–0.63 s | Y enters from BELOW, travelling upward while shrinking markedly. It decelerates into position; this is not a gravity fall. |
| 20–30 | 0.67–1.00 s | Y holds alone. This pause is an essential separate beat. |
| 31–41 | 1.03–1.37 s | L enters from the TOP, upright and almost vertically above Y. It accelerates downward rather than easing gently into place. |
| 42–44 | 1.40–1.47 s | L visibly contacts and overlaps Y. The overlap is intentional in the reference; it must not be removed as a spacing defect. |
| 45–50 | 1.50–1.67 s | The initials separate horizontally into YL. Their positions and sizes have a brief spring response; L grows as it joins the pair. |
| 51–67 | 1.70–2.23 s | a, n, dotless i and u appear near the initials together, expand OUTWARD, enlarge and rotate slightly. They slow into a loose arrangement around YL and briefly hold. They do not start outside and fall inward one at a time. |
| 68–75 | 2.27–2.50 s | All letters start converging. Y and L also reposition and shrink, making room for the complete name. |
| 76–91 | 2.53–3.03 s | The name becomes readable, but the letters overshoot their final positions and baseline before returning. The strongest overshoot is around frames 82–83 (2.73–2.77 s). |
| 92–98 | 3.07–3.27 s | The letter bodies have settled. The i remains dotless. |
| 99–108 | 3.30–3.60 s | A separate dot falls from the top, accelerating as it approaches the i. |
| 109–122 | 3.63–4.07 s | The dot rebounds slightly upward and returns to its resting position. |
| 123–139 | 4.10–4.63 s | Liu progressively leans into italic. This is a distinct final transformation, not part of the initial falls. |
| 140–158 | 4.67–5.27 s | The finished name holds. The supplied clip ends here, without showing a homepage reveal. |

## Measured speed and scale

Measurements use bright glyph bounds in the ORIGINAL recording, not CSS
pixels. Browser chrome above y=96 was excluded. Video compression and repeated
captured frames make short-interval values approximate; the video cannot
establish the exact source easing function or spring parameters.

### Y: upward travel with strong deceleration and scale reduction

| Time | Glyph centre y | Visible height |
|---|---:|---:|
| 0.133 s | 883 px | 223 px |
| 0.200 s | 808 px | 194 px |
| 0.300 s | 707 px | 153 px |
| 0.400 s | 626 px | 120 px |
| 0.500 s | 596 px | 109 px |
| 0.600 s | 587 px | 105 px |
| 0.667 s | 585 px | 104 px |

From the first fully visible measurement, Y rises roughly 298 px and shrinks
to 47% of its visible height. Upward speed falls from approximately 1005 px/s
between 0.20–0.30 s to 295 px/s between 0.40–0.50 s, then 90 px/s between
0.50–0.60 s. This is a large, fast entrance followed by a soft stop. The very
first frames are clipped below the viewport, so these measurements do not
capture the complete travel distance or initial size.

### L: accelerating descent followed by contact and separation

The x position remains approximately 747 px before impact. Its visible glyph
height is approximately 87 px during the unobstructed descent.

| Time | Bottom edge of L |
|---|---:|
| 1.033 s | 106 px |
| 1.167 s | 188 px |
| 1.300 s | 377 px |
| 1.367 s | 480 px |

Average downward speed over successive measured intervals is approximately
615, 1418 and 1545 px/s. The increasing speed is the important observation:
the fall should feel gravity-driven. L starts intersecting Y around 1.40 s;
separation becomes visible around 1.50 s. The visible entrance-to-separation
beat lasts about 467 ms. A generic ease-out fall would reverse the observed
speed profile.

After separation, L is about 114 px tall versus 87 px during descent. Y grows
from about 104 to 113 px. The pair settles at this larger size before both
shrink again during full-name assembly.

### Lowercase letters: outward burst, pause, collective convergence

All four lowercase bodies first become visible around frame 51 (1.70 s).
Most outward travel occurs by roughly 1.90 s; it decelerates toward a hold
around 2.10–2.23 s. Their return starts around 2.27 s. This is not an
alphabetical stagger and not four independent gravity falls.

The assembly has a substantial overshoot. For example, the top of a reaches
y=582 at 2.73 s before settling at y=563: roughly 19 px of overshoot, about
28% of that glyph's final visible height. Reducing this to a 2–3 px correction
loses the reference's elastic quality.

### Dot: a second, faster gravity beat

The dot appears at the top around 3.30 s and reaches the i around 3.60 s.
Between 3.433–3.567 s, its top moves from y=210 to y=462: roughly 1890 px/s
on average during that late portion of the fall. Its top reaches about y=515
at impact, rebounds to about y=506, then settles around y=524 by 4.00 s.
The measured bounds include a small glow, so rebound distances are approximate.

## What was wrong in my implementation

1. T started at 0.30 s, whereas L first appears around 1.03 s. I removed most
   of the first initial's solo hold.
2. I used a decelerating entrance for the second initial. The reference
   accelerates into visible contact with the first initial.
3. I separated the initials before contact. The reference visibly overlaps
   them first, then reacts to that contact.
4. My loose letters started in external positions and moved inward. The
   reference first sends them OUT from near the central pair.
5. I introduced a per-letter stagger. The reference introduces the lowercase
   group together and then converges it as a group.
6. I made the settling too small and too short. The reference has roughly
   800 ms from assembly onset to a settled baseline, including clear overshoot.
7. I began the paper reveal at 1.80 s, while the reference is still spreading
   the lowercase letters outward at that time.
8. I treated the final point as a small rule decoration. The reference has a
   separate falling i-dot more than three seconds into the sequence.

## Consequence for the next implementation

Match the acceleration, contact, outward burst, pauses, and spring settling
before adjusting the visual styling. The supplied footage takes about 3.07 s
just to settle the letter bodies, about 4.0 s to finish the dot, and continues
holding through 5.3 s. The original request's under-three-second FULL intro
cannot preserve this reference's actual pacing. The footage does not provide
any timing evidence for the later homepage reveal.

This pass changes only analysis documents. No animation code was changed.
