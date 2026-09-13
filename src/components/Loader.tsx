"use client";

/** Adapted from the user's NamePreloader prototype. Geometry and timing are
 * measured independently of the website palette and font family. */
import { useCallback, useLayoutEffect, useRef } from 'react';
import { lockIntroScroll } from '@/lib/opening-intro';

type Props = { onComplete: () => void };

const DOTLESS = "\u0131";

const T = {
  lead: 100,
  rise: 600,
  gapAfterRise: 150,
  fall: 520,
  recoil: 150,
  burst: 420,
  burstStagger: 22,
  holdAfterBurst: 160,
  settle: 620,
  settleStagger: 16,
  holdAfterSettle: 90,
  dotFall: 340,
  dotUp: 130,
  dotDown: 170,
  holdBeforeItalic: 120,
  italic: 480,
  holdAfterItalic: 180,
  glow: 130,
  collapse: 820,
};

const outCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const inQuad = (t: number) => t * t;
const outBack = (t: number) =>
  1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);

type Frame = { x: number; y: number; s?: number; o?: number; r?: number };

export default function Loader({ onComplete }: Props) {
  const callbackRef = useRef(onComplete);
  useLayoutEffect(() => { callbackRef.current = onComplete; }, [onComplete]);
  const rootRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

  /** Non-null while a run is in flight; identity doubles as a cancel token. */
  const runToken = useRef<object | null>(null);
  const doneRef = useRef(false);
  const releaseRef = useRef<(() => void) | null>(null);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    runToken.current = null;
    releaseRef.current?.();
    releaseRef.current = null;
    rootRef.current?.close();
    callbackRef.current();
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const probe = probeRef.current;
    const dot = dotRef.current;
    const flash = flashRef.current;
    const skipBtn = skipRef.current;
    if (!root || !stage || !probe || !dot || !flash) return;
    doneRef.current = false;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) { finish(); return; }
    try { root.showModal(); } catch { finish(); return; }
    releaseRef.current = lockIntroScroll();
    const fontStack = getComputedStyle(root).fontFamily;
    const word1 = 'Miguel';
    const word2 = 'Twahirwa';
    const dotIndexInWord2 = 4;
    const baseFontSize = 132;
    const minFontSize = 18;
    const fillRatio = 0.86;
    const wordGapEm = 0.28;
    const ink = 'var(--ink-blue)';

    // Every scheduled task belongs to this mount, including Strict Mode runs.
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const frames = new Set<number>();
    const later = (callback: () => void, ms: number) => {
      const id = setTimeout(() => { timers.delete(id); callback(); }, ms);
      timers.add(id);
      return id;
    };
    const sleep = (ms: number) => new Promise<void>((resolve) => later(resolve, ms));
    const raf = (callback: FrameRequestCallback) => {
      const id = requestAnimationFrame((now) => { frames.delete(id); callback(now); });
      frames.add(id);
    };
    let watchdog: ReturnType<typeof setTimeout> | undefined;

    const W1 = word1;
    const W2 =
      word2.slice(0, dotIndexInWord2) + DOTLESS + word2.slice(dotIndexInWord2 + 1);

    type L = {
      el: HTMLDivElement;
      up: HTMLSpanElement;
      it: HTMLSpanElement | null;
      adv: number;
    };
    let letters: L[] = [];

    /* Shared interpolation math; each active glyph owns its frame callback. */

    const tween = (
      el: HTMLElement,
      from: Frame,
      to: Frame,
      dur: number,
      ease: (t: number) => number,
      delay = 0,
      token?: object
    ) =>
      new Promise<void>((res) => {
        const start = performance.now() + delay;
        const p0 = (v: number | undefined, f: number) => (v === undefined ? f : v);
        const frame = (now: number) => {
          if (token && runToken.current !== token) return res();
          const p = Math.min(Math.max((now - start) / dur, 0), 1);
          const e = ease(p);
          const x = from.x + (to.x - from.x) * e;
          const y = from.y + (to.y - from.y) * e;
          const s = p0(from.s, 1) + (p0(to.s, 1) - p0(from.s, 1)) * e;
          const o = p0(from.o, 1) + (p0(to.o, 1) - p0(from.o, 1)) * e;
          const r = p0(from.r, 0) + (p0(to.r, 0) - p0(from.r, 0)) * e;
          el.style.opacity = String(o);
          el.style.transform = `translate3d(${x}px,${y}px,0) scale(${s}) rotate(${r}deg)`;
          el.dataset.x = String(x);
          el.dataset.y = String(y);
          el.dataset.s = String(s);
          el.dataset.r = String(r);
          if (p < 1) raf(frame);
          else res();
        };
        raf(frame);
      });

    const at = (el: HTMLElement): Frame => ({
      x: parseFloat(el.dataset.x || "0"),
      y: parseFloat(el.dataset.y || "0"),
      s: parseFloat(el.dataset.s || "1"),
      o: parseFloat(el.style.opacity || "1"),
      r: parseFloat(el.dataset.r || "0"),
    });

    /* ---------- kerned offsets from a real text run ---------- */

    const measureRun = (text: string, italic: boolean, F: number) => {
      probe.style.fontFamily = fontStack;
      probe.style.fontStyle = italic ? "italic" : "normal";
      probe.style.fontSize = `${F}px`;
      probe.textContent = text;
      const node = probe.firstChild!;
      const range = document.createRange();
      const offsets: number[] = [];
      for (let i = 0; i < text.length; i++) {
        range.setStart(node, 0);
        range.setEnd(node, i);
        offsets.push(i === 0 ? 0 : range.getBoundingClientRect().width);
      }
      range.setStart(node, 0);
      range.setEnd(node, text.length);
      const total = range.getBoundingClientRect().width;
      const adv = offsets.map((o, i) =>
        (i + 1 < text.length ? offsets[i + 1] : total) - o
      );
      return { offsets, total, adv };
    };

    /* ---------- isolate the i's dot by diffing "i" against "ı" ---------- */

    const measureDotInk = (italic: boolean, F: number) => {
      const W = Math.ceil(F * 2);
      const H = Math.ceil(F * 2.2);
      const PX = Math.round(F * 0.5);
      const PY = Math.round(F * 1.4);
      const c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error('Canvas measurement unavailable');
      ctx.font = `${italic ? "italic " : ""}400 ${F}px ${fontStack}`;
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#fff";

      const m = ctx.measureText("x");
      const xh = m.actualBoundingBoxAscent || F * 0.45;
      const ascent = m.fontBoundingBoxAscent || F * 0.78;
      const descent = m.fontBoundingBoxDescent || F * 0.22;
      const capH = ctx.measureText("H").actualBoundingBoxAscent || F * 0.7;

      ctx.clearRect(0, 0, W, H);
      ctx.fillText("i", PX, PY);
      const a = ctx.getImageData(0, 0, W, H).data;
      ctx.clearRect(0, 0, W, H);
      ctx.fillText(DOTLESS, PX, PY);
      const b = ctx.getImageData(0, 0, W, H).data;

      // The dot is the only difference above the x-height.
      const cut = Math.floor(PY - xh * 1.02);
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, n = 0;
      for (let y = 0; y < cut; y++) {
        for (let x = 0; x < W; x++) {
          const i = (y * W + x) * 4 + 3;
          if (Math.abs(a[i] - b[i]) > 40) {
            n++;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      const ok = n > 8 && maxX - minX < F * 0.35 && maxY - minY < F * 0.35;
      return {
        ok,
        dx: ok ? (minX + maxX) / 2 - PX : F * 0.11,
        dy: ok ? (minY + maxY) / 2 - PY : -F * 0.6,
        size: ok ? Math.max(maxX - minX + 1, maxY - minY + 1) : Math.max(10, F * 0.12),
        ascent,
        descent,
        capH,
      };
    };

    const buildGlyphs = () => {
      stage.innerHTML = "";
      letters = [];
      const all = W1 + W2;
      for (let i = 0; i < all.length; i++) {
        const isWord2 = i >= W1.length;
        const el = document.createElement("div");
        el.className = "np-glyph";
        el.style.fontFamily = fontStack;
        el.style.color = ink;
        const up = document.createElement("span");
        up.className = "np-up";
        up.textContent = all[i];
        el.appendChild(up);
        let it: HTMLSpanElement | null = null;
        if (isWord2) {
          it = document.createElement("span");
          it.className = "np-it";
          it.textContent = all[i];
          el.appendChild(it);
        }
        stage.appendChild(el);
        letters.push({ el, up, it, adv: 0 });
      }
    };

    const measure = () => {
      const vw = root.clientWidth;
      const vh = root.clientHeight;

      // Optical-size axes mean width is not linear in font-size, so converge
      // on a fit instead of scaling once from a single measurement.
      const target = vw * fillRatio;
      let F = baseFontSize;
      let t1 = measureRun(W1, false, F);
      let t2u = measureRun(W2, false, F);
      let t2i = measureRun(W2, true, F);
      let gap = F * wordGapEm;

      for (let pass = 0; pass < 5; pass++) {
        t1 = measureRun(W1, false, F);
        t2u = measureRun(W2, false, F);
        t2i = measureRun(W2, true, F);
        gap = F * wordGapEm;
        const widest = t1.total + gap + Math.max(t2u.total, t2i.total);
        if (widest <= target || F <= minFontSize) break;
        F = Math.max(minFontSize, (F * target) / widest);
      }

      t1 = measureRun(W1, false, F);
      t2u = measureRun(W2, false, F);
      t2i = measureRun(W2, true, F);
      gap = F * wordGapEm;
      letters.forEach((L) => (L.el.style.fontSize = `${F}px`));

      const inkUp = measureDotInk(false, F);
      const inkIt = measureDotInk(true, F);

      const baselineInBox =
        (F - (inkUp.ascent + inkUp.descent)) / 2 + inkUp.ascent;
      const y = vh / 2 + inkUp.capH / 2 - baselineInBox;

      const positions = (t2: typeof t2u) => {
        const total = t1.total + gap + t2.total;
        const x0 = (vw - total) / 2;
        const out: number[] = [];
        for (let i = 0; i < W1.length; i++) out.push(x0 + t1.offsets[i]);
        const w2x = x0 + t1.total + gap;
        for (let j = 0; j < W2.length; j++) out.push(w2x + t2.offsets[j]);
        return out;
      };

      const adv = t1.adv.concat(t2u.adv);
      letters.forEach((L, i) => (L.adv = adv[i]));

      return {
        vw,
        vh,
        y,
        F,
        dIdx: W1.length + dotIndexInWord2,
        upright: positions(t2u),
        italic: positions(t2i),
        baselineInBox,
        inkUp,
        inkIt,
      };
    };

    const collapseInto = (x: number, y: number, token: object) => {
      skipBtn?.classList.remove("np-on");
      root.style.transition = "none";
      root.style.clipPath = `circle(150% at ${x}px ${y}px)`;
      void root.offsetWidth;
      root.style.transition = `clip-path ${T.collapse}ms cubic-bezier(0.4,0,0.2,1)`;
      root.style.clipPath = `circle(0% at ${x}px ${y}px)`;
      later(() => {
        if (runToken.current === token) finish();
      }, T.collapse + 60);
    };

    /* ---------- the sequence ---------- */

    const play = async () => {
      const token = {};
      runToken.current = token;
      if (watchdog) { clearTimeout(watchdog); timers.delete(watchdog); }
      watchdog = later(() => { if (runToken.current === token) finish(); }, 8500);
      root.style.transition = 'none';
      root.style.clipPath = '';
      flash.style.animation = 'none';
      stage.classList.remove('np-shaking');
      skipBtn?.classList.remove('np-on');
      dot.style.opacity = '0';

      try {
        buildGlyphs();
        // Load both real cuts before probing. A late font never changes geometry
        // halfway through the sequence, and a failed load dismisses the intro.
        await Promise.race([
          Promise.all([
            document.fonts.load(`400 ${baseFontSize}px ${fontStack}`, W1 + W2),
            document.fonts.load(`italic 400 ${baseFontSize}px ${fontStack}`, W2),
          ]),
          sleep(1800).then(() => { throw new Error('Font loading timed out'); }),
        ]);
        if (runToken.current !== token) return;

        const M = measure();
        const { F, vw, vh } = M;
        const cx = vw / 2;
        const cy = vh / 2;
        const w1len = W1.length;

        const dotSize = M.inkUp.size;
        dot.style.width = `${dotSize}px`;
        dot.style.height = `${dotSize}px`;
        dot.style.opacity = "0";
        dot.style.boxShadow = "none";
        dot.style.transition = "none";

        letters.forEach((L) => {
          L.el.style.opacity = "0";
          L.el.dataset.x = "0";
          L.el.dataset.y = "0";
          L.el.dataset.s = "1";
          if (L.it) {
            L.up.style.transition = "none";
            L.it.style.transition = "none";
            L.up.style.opacity = "1";
            L.it.style.opacity = "0";
          }
        });

        later(() => {
          if (runToken.current === token) skipBtn?.classList.add("np-on");
        }, 700);

        await sleep(T.lead);
        if (runToken.current !== token) return;

        // 1. First letter rises from below, decelerating.
        const first = letters[0];
        const firstX = cx - first.adv / 2;
        await tween(
          first.el,
          { x: firstX, y: vh + 80, s: 3.6, o: 0.45 },
          { x: firstX, y: M.y, s: 1.18, o: 1 },
          T.rise,
          outCubic,
          0,
          token
        );
        if (runToken.current !== token) return;

        await sleep(T.gapAfterRise);
        if (runToken.current !== token) return;

        // 2. Second word's first letter falls, accelerating into the collision.
        const second = letters[w1len];
        const secondX = cx - second.adv / 2 + F * 0.16;
        second.el.style.opacity = "1";
        await tween(
          second.el,
          { x: secondX, y: -F * 1.6 },
          { x: secondX, y: M.y },
          T.fall,
          inQuad,
          0,
          token
        );
        if (runToken.current !== token) return;

        // 3. Impact.
        flash.style.left = `${cx - 6}px`;
        flash.style.top = `${cy - 6}px`;
        flash.style.animation = "none";
        void flash.offsetWidth;
        flash.style.animation = "np-flash 480ms ease-out forwards";
        stage.classList.remove("np-shaking");
        void stage.offsetWidth;
        stage.classList.add("np-shaking");
        later(() => stage.classList.remove("np-shaking"), 380);

        const kick = F * 0.38;
        await Promise.all([
          tween(first.el, at(first.el), { x: firstX - kick, y: M.y, s: 1.28 }, T.recoil, outCubic, 0, token),
          tween(second.el, at(second.el), { x: secondX + kick, y: M.y, s: 1.28 }, T.recoil, outCubic, 0, token),
        ]);
        if (runToken.current !== token) return;

        // 4. Everything else bursts out of the impact point.
        const rest = letters.filter((_, i) => i !== 0 && i !== w1len);
        const n = rest.length;
        await Promise.all(
          rest.map((L, k) => {
            const angle =
              ((-90 + (k + 0.5) * (360 / n) + (Math.random() - 0.5) * 14) * Math.PI) / 180;
            const dist = F * 1.4 + Math.random() * F;
            const bx = Math.min(Math.max(cx + Math.cos(angle) * dist - L.adv / 2, 10), vw - L.adv - 10);
            const by = Math.min(Math.max(cy + Math.sin(angle) * dist - F * 0.5, 10), vh - F - 10);
            return tween(
              L.el,
              { x: cx - L.adv / 2, y: M.y, s: 0.28, o: 0, r: (Math.random() - 0.5) * 70 },
              { x: bx, y: by, s: 1.06, o: 1, r: (Math.random() - 0.5) * 22 },
              T.burst,
              outCubic,
              k * T.burstStagger,
              token
            );
          })
        );
        if (runToken.current !== token) return;

        await sleep(T.holdAfterBurst);
        if (runToken.current !== token) return;

        // 5. Settle into kerned position, overshooting slightly.
        await Promise.all(
          letters.map((L, i) =>
            tween(
              L.el,
              at(L.el),
              { x: M.upright[i], y: M.y, s: 1, o: 1, r: 0 },
              T.settle,
              outBack,
              i * T.settleStagger,
              token
            )
          )
        );
        if (runToken.current !== token) return;

        await sleep(T.holdAfterSettle);
        if (runToken.current !== token) return;

        // 6. The dot falls onto the dotless i and bounces.
        const dx = M.upright[M.dIdx] + M.inkUp.dx - dotSize / 2;
        const dy = M.y + M.baselineInBox + M.inkUp.dy - dotSize / 2;

        dot.style.opacity = "1";
        await tween(dot, { x: dx, y: -dotSize * 4 }, { x: dx, y: dy }, T.dotFall, inQuad, 0, token);
        if (runToken.current !== token) return;
        await tween(dot, { x: dx, y: dy, s: 1.25 }, { x: dx, y: dy - F * 0.11, s: 1 }, T.dotUp, outCubic, 0, token);
        if (runToken.current !== token) return;
        await tween(dot, { x: dx, y: dy - F * 0.11 }, { x: dx, y: dy }, T.dotDown, inQuad, 0, token);
        if (runToken.current !== token) return;

        await sleep(T.holdBeforeItalic);
        if (runToken.current !== token) return;

        // 7. Surname cross-fades to true italic; the whole name re-centres.
        const dx2 = M.italic[M.dIdx] + M.inkIt.dx - dotSize / 2;
        const dy2 = M.y + M.baselineInBox + M.inkIt.dy - dotSize / 2;

        letters.forEach((L) => {
          if (!L.it) return;
          L.up.style.transition = "opacity 260ms ease";
          L.it.style.transition = "opacity 260ms ease";
        });
        raf(() => {
          if (runToken.current !== token) return;
          letters.forEach((L) => {
            if (!L.it) return;
            L.up.style.opacity = "0";
            L.it!.style.opacity = "1";
          });
        });

        await Promise.all([
          ...letters.map((L, i) =>
            tween(L.el, at(L.el), { x: M.italic[i], y: M.y, s: 1, o: 1, r: 0 }, T.italic, outCubic, 0, token)
          ),
          tween(dot, at(dot), { x: dx2, y: dy2 }, T.italic, outCubic, 0, token),
        ]);
        if (runToken.current !== token) return;

        await sleep(T.holdAfterItalic);
        if (runToken.current !== token) return;

        // 8. The dot ignites, then the curtain collapses into it.
        dot.style.transition = "box-shadow 520ms ease-out";
        dot.style.boxShadow = '0 0 28px 10px color-mix(in srgb, var(--ink-blue) 25%, transparent), 0 0 64px 26px color-mix(in srgb, var(--ink-blue) 12%, transparent)';
        await sleep(T.glow);
        if (runToken.current !== token) return;

        collapseInto(dx2 + dotSize / 2, dy2 + dotSize / 2, token);
      } catch {
        // A superseded run must never dismiss the current run.
        if (runToken.current === token) finish();
      }
    };

    const preferenceChanged = () => { if (reduced.matches) finish(); };
    reduced.addEventListener('change', preferenceChanged);
    // Refit only if the layout viewport really changes; ignore mobile browser
    // chrome height changes. A fresh run cancels the previous run by identity.
    let width = root.clientWidth;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const resized = () => {
      if (doneRef.current || root.clientWidth === width) return;
      width = root.clientWidth;
      runToken.current = null;
      root.style.transition = 'none';
      root.style.clipPath = '';
      if (resizeTimer) { clearTimeout(resizeTimer); timers.delete(resizeTimer); }
      resizeTimer = later(() => { void play(); }, 150);
    };
    window.addEventListener('resize', resized);
    void play();

    return () => {
      runToken.current = null;
      timers.forEach(clearTimeout);
      frames.forEach(cancelAnimationFrame);
      reduced.removeEventListener('change', preferenceChanged);
      window.removeEventListener('resize', resized);
      root.close();
      releaseRef.current?.();
      releaseRef.current = null;
    };
  }, [finish]);

  return (
    <dialog
      ref={rootRef}
      aria-label="Introduction — Miguel Twahirwa"
      onCancel={(event) => { event.preventDefault(); finish(); }}
      className="name-preloader fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none overflow-hidden border-0 bg-paper p-0 font-display text-ink-blue backdrop:bg-transparent"
    >
      <div aria-hidden="true">
        <div ref={stageRef} className="np-stage" />
        <div ref={probeRef} className="np-probe" />
        <div ref={flashRef} className="np-flash" />
        <div ref={dotRef} className="np-dot" />
        <div className="np-grain" />
      </div>
      <button
        ref={skipRef}
        autoFocus
        type="button"
        onClick={finish}
        className="np-skip absolute bottom-[max(24px,env(safe-area-inset-bottom))] right-6 z-[2] min-h-11 px-2 font-mono text-xs text-ink-blue focus-visible:outline-ink-blue"
      >Skip intro ↗</button>
    </dialog>
  );
}
