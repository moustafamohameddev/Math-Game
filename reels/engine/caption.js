/* Word-by-word captions with marker highlights (the shared look of the
 * illustrated reels): words fade in from a blur one after another, then a
 * yellow marker sweeps behind the key words (RTL for Arabic, LTR for English). */
(function (global) {
  'use strict';
  const { html, prog, ease } = global.R;

  /** Real ink extents of a word (rasterised once at 100px, cached), in em units. */
  const inkCache = new Map();
  function inkBounds(text, font, weight, dir) {
    const key = [text, font, weight, dir].join('|');
    if (inkCache.has(key)) return inkCache.get(key);
    const S = 100, pad = 100;
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.font = `${weight} ${S}px ${font}`;
    const adv = ctx.measureText(text).width;
    c.width = Math.ceil(adv + pad * 2); c.height = S * 3;
    ctx.font = `${weight} ${S}px ${font}`;
    ctx.direction = dir; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(text, pad, S * 1.5);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    let minX = c.width, maxX = -1;
    for (let x = 0; x < c.width; x++) {
      for (let y = 0; y < c.height; y++) {
        if (d[(y * c.width + x) * 4 + 3] > 60) { if (x < minX) minX = x; if (x > maxX) maxX = x; break; }
      }
    }
    const r = maxX < 0 ? { left: 0, right: adv / S, adv: adv / S } : { left: (minX - pad) / S, right: (maxX + 1 - pad) / S, adv: adv / S };
    inkCache.set(key, r);
    return r;
  }

  /**
   * opts: {parent, words:[string|{w, hl, joinPrev, color, glow}], dir, x, y (centre line), size, font, weight,
   *        color, gap (em), hl:[top,bottom] px relative to centre line, hlColor, hlPadX, fit (target width px)}
   */
  function line(opts) {
    const o = Object.assign({ dir: 'rtl', x: 360, gap: 0.3, hlColor: '#fade61', hl: [0, 20], hlPadX: 3, weight: 400 }, opts);
    const el = html('div', { class: 'cap-line', dir: o.dir }, o.parent);
    let size = o.size;
    const lh = () => Math.round(size * 1.7);
    Object.assign(el.style, {
      position: 'absolute', left: '0', width: '720px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
      whiteSpace: 'nowrap', fontFamily: o.font, color: o.color, fontWeight: o.weight, letterSpacing: o.letterSpacing || 'normal',
    });
    const words = o.words.map((w) => {
      const spec = typeof w === 'string' ? { w } : w;
      const wrap = html('span', { class: 'cap-word' }, el);
      Object.assign(wrap.style, { position: 'relative', display: 'inline-block', padding: `0 ${o.gap / 2}em` });
      let hl = null;
      if (spec.hl) {
        hl = html('span', { class: 'cap-hl' }, wrap);
        Object.assign(hl.style, {
          position: 'absolute', zIndex: 0, background: spec.hlColor || o.hlColor,
          left: `calc(${o.gap / 2}em - ${o.hlPadX}px)`, right: `calc(${o.gap / 2}em - ${o.hlPadX}px)`,
          transformOrigin: o.dir === 'rtl' ? 'right center' : 'left center', transform: 'scaleX(0)',
        });
        if (spec.joinPrev) hl.style[o.dir === 'rtl' ? 'right' : 'left'] = `calc(${-o.gap / 2}em + ${o.hlPadX}px)`;
      }
      const txt = html('span', spec.html ? { html: spec.html } : { text: spec.w }, wrap);
      Object.assign(txt.style, { position: 'relative', zIndex: 1 });
      if (spec.color) txt.style.color = spec.color;
      if (spec.glow) txt.style.textShadow = spec.glow;
      return { el: wrap, hl, spec, txt };
    });

    // Trim each word box to its ink (glyph) bounds so gaps and widths match the
    // pixels measured in the source video, independent of font side-bearings.
    function trimInk() {
      if (o.ink === false) return;
      words.forEach((w) => {
        const b = inkBounds(w.spec.w, o.font, o.weight, o.dir);
        w.txt.style.display = 'inline-block';
        w.txt.style.marginLeft = (-b.left * size).toFixed(2) + 'px';
        w.txt.style.marginRight = (-(b.adv - b.right) * size).toFixed(2) + 'px';
      });
    }
    function layout() {
      el.style.fontSize = size + 'px';
      el.style.lineHeight = lh() + 'px';
      el.style.height = lh() + 'px';
      el.style.top = o.y - lh() / 2 + 'px';
      el.style.transform = `translateX(${o.x - 360}px)`;
      trimInk();
      words.forEach((w) => {
        if (!w.hl) return;
        w.hl.style.top = lh() / 2 + o.hl[0] + 'px';
        w.hl.style.height = o.hl[1] - o.hl[0] + 'px';
      });
    }
    layout();
    if (o.fit) {
      // Scale the font so the line is as wide as in the original video
      // (everything is em-based, so one proportional pass is exact; two for rounding).
      for (let k = 0; k < 2; k++) {
        const w = words.reduce((s, wd) => s + wd.el.getBoundingClientRect().width, 0) - o.gap * size;
        if (w > 0) { size *= o.fit / w; layout(); }
      }
    }

    /** tm: {times:[...] | start+step, dur, blur, hlTimes:[...] | hlStart+hlStep, hlDur, out, outDur} */
    function render(t, tm) {
      const dur = tm.dur ?? 0.2;
      const blur = tm.blur ?? 5;
      const outP = tm.out != null ? ease.inQuad(prog(t, tm.out, tm.out + (tm.outDur ?? 0.22))) : 0;
      const first = tm.times ? tm.times[0] : tm.start;
      const visible = t >= first - 0.001 && outP < 1;
      el.style.visibility = visible ? 'visible' : 'hidden';
      if (!visible) return;
      let hi = 0;
      words.forEach((w, i) => {
        const st = tm.times ? tm.times[i] : tm.start + i * (tm.step ?? 0.13);
        const p = ease.outQuad(prog(t, st, st + dur));
        w.el.style.opacity = (p * (1 - outP)).toFixed(3);
        const b = blur * (1 - p) + (tm.outBlur ?? 3) * outP;
        w.el.style.filter = b > 0.05 ? `blur(${b.toFixed(2)}px)` : 'none';
        if (w.hl) {
          const hs = tm.hlTimes ? tm.hlTimes[hi] : (tm.hlStart ?? 1e9) + hi * (tm.hlStep ?? 0);
          w.hl.style.transform = `scaleX(${ease.inOutQuad(prog(t, hs, hs + (tm.hlDur ?? 0.22))).toFixed(3)})`;
          hi++;
        }
      });
    }
    return { el, words, render, get size() { return size; } };
  }

  /** Letter-by-letter reveal for short Latin subtitles. */
  function letters(opts) {
    const el = html('div', { class: 'cap-letters', dir: 'ltr' }, opts.parent);
    Object.assign(el.style, {
      position: 'absolute', left: '0', width: '720px', top: opts.y + 'px', textAlign: 'center',
      fontFamily: opts.font, fontSize: opts.size + 'px', color: opts.color, whiteSpace: 'pre',
      letterSpacing: opts.letterSpacing || 'normal', transform: 'translateY(-50%)', lineHeight: '1.2',
    });
    const spans = [...opts.text].map((ch) => html('span', { text: ch }, el));
    function render(t, tm) {
      const n = spans.length;
      spans.forEach((s, i) => {
        const st = tm.start + (i / n) * (tm.span ?? 0.3);
        s.style.opacity = ease.outQuad(prog(t, st, st + (tm.dur ?? 0.12))).toFixed(3);
      });
      el.style.visibility = t < tm.start ? 'hidden' : 'visible';
    }
    return { el, render };
  }

  global.Caption = { line, letters };
})(window);
