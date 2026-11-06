/* Calligraphy helpers: measure the real ink of Arabic text and fit it into a box,
 * with optional kashida ('~' marks where the word is stretched). */
(function (global) {
  'use strict';
  const { svg } = global.R;

  const cache = new Map();
  /** Ink box of a string in em units, relative to centre anchor / alphabetic baseline. */
  function ink(text, font, weight = 700) {
    const key = text + '|' + font + '|' + weight;
    if (cache.has(key)) return cache.get(key);
    const S = 100, c = document.createElement('canvas');
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.font = `${weight} ${S}px ${font}`;
    const adv = ctx.measureText(text).width;
    c.width = Math.ceil(adv + 2 * S); c.height = 3 * S;
    ctx.font = `${weight} ${S}px ${font}`; ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText(text, c.width / 2, 2 * S);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1;
    for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
      if (d[(y * c.width + x) * 4 + 3] > 80) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
    const r = x1 < 0 ? { l: -0.5, r: 0.5, t: -0.7, b: 0.2 } : { l: (x0 - c.width / 2) / S, r: (x1 + 1 - c.width / 2) / S, t: (y0 - 2 * S) / S, b: (y1 + 1 - 2 * S) / S };
    cache.set(key, r);
    return r;
  }

  /** Expand '~' into the number of tatweels that gives the wanted width/height ratio. */
  function stretch(text, font, ratio, max = 40) {
    if (!text.includes('~')) return text;
    let best = null;
    for (let n = 0; n <= max; n++) {
      const cand = text.replace('~', 'ـ'.repeat(n));
      const m = ink(cand, font);
      const err = Math.abs((m.r - m.l) / (m.b - m.t) - ratio);
      if (!best || err < best.err) best = { cand, err };
    }
    return best.cand;
  }

  /** SVG <text> whose ink fits a box [x0, x1, y0, y1] (centred, never overflowing). */
  function phrase(parent, text, box, attrs = {}) {
    const font = attrs.font || 'Amiri';
    const [x0, x1, y0, y1] = box;
    const bw = x1 - x0, bh = y1 - y0;
    text = stretch(text, font, attrs.ratio || bw / bh);
    const b = ink(text, font);
    const size = Math.min(bw / (b.r - b.l), (bh / (b.b - b.t)) * (attrs.hScale || 1.45));
    const x = (x0 + x1) / 2 - ((b.l + b.r) / 2) * size;
    const y = (y0 + y1) / 2 - ((b.t + b.b) / 2) * size;
    const el = svg('text', {
      x: x.toFixed(2), y: y.toFixed(2), 'font-size': size.toFixed(2), 'font-family': font, 'font-weight': 700, 'text-anchor': 'middle', direction: 'rtl',
      fill: attrs.fill, stroke: attrs.fill, 'stroke-width': (size * (attrs.weight ?? 0.022)).toFixed(2), 'stroke-linejoin': 'round',
    }, parent);
    el.textContent = text;
    el.__size = size;
    return el;
  }

  /** Venetian-blind bars: strips of `period` px from `offset`, each revealed top→down by h px. */
  function blinds(H, offset, period, h) {
    const out = [];
    for (let top = offset - period; top < H; top += period) out.push([Math.max(0, top + h), Math.min(H, top + period)]);
    return out;
  }

  global.Calli = { ink, stretch, phrase, blinds };
})(window);
