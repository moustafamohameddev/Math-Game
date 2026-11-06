/* الحمد لله — kinetic Arabic calligraphy (1276×718, 15.1 s).
 * Phrase boxes, colours, fades and the blind / iris transitions were measured
 * frame-by-frame from the source video. The original soundtrack is a vocal
 * nasheed: extract it locally with `npm run extract-audio` to hear it; the
 * synth mode plays a soft pad with transition swells instead. */
(function () {
  'use strict';
  const { svg, html, kf, prog, ease, clamp, lerp } = R;

  const W = 1276, H = 718;
  const CREAM = { bg: '#f0ead7', text: '#02222d', shadow: 'drop-shadow(5px 6px 4px rgba(20,30,30,.34))' };
  const TEAL = { bg: '#00212b', text: '#f1e7d5', gold: '#d9bd83', shadow: 'drop-shadow(5px 6px 5px rgba(0,0,0,.55))' };

  /** Ink box of a string (em units, relative to centre-anchor / alphabetic baseline). */
  const cache = new Map();
  function ink(text, font) {
    const key = text + '|' + font;
    if (cache.has(key)) return cache.get(key);
    const S = 100, c = document.createElement('canvas');
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.font = `700 ${S}px ${font}`;
    const adv = ctx.measureText(text).width;
    c.width = Math.ceil(adv + 2 * S); c.height = 3 * S;
    ctx.font = `700 ${S}px ${font}`; ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText(text, c.width / 2, 2 * S);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1;
    for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
      if (d[(y * c.width + x) * 4 + 3] > 80) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
    const r = { l: (x0 - c.width / 2) / S, r: (x1 + 1 - c.width / 2) / S, t: (y0 - 2 * S) / S, b: (y1 + 1 - 2 * S) / S };
    cache.set(key, r);
    return r;
  }

  /** SVG text whose ink fills a measured box [x0, x1, y0, y1].
   * A '~' marks where the calligrapher stretched the word (kashida): the number of
   * tatweels is chosen so the word gets the original's proportions. */
  function phrase(parent, text, box, attrs = {}) {
    const font = attrs.font || 'Amiri';
    const [x0, x1, y0, y1] = box;
    const bw = x1 - x0, bh = y1 - y0;
    if (text.includes('~')) {
      let best = null;
      for (let n = 0; n <= 40; n++) {
        const cand = text.replace('~', 'ـ'.repeat(n));
        const m = ink(cand, font);
        const err = Math.abs((m.r - m.l) / (m.b - m.t) - bw / bh);
        if (!best || err < best.err) best = { cand, err };
      }
      text = best.cand;
    }
    const b = ink(text, font);
    const size = Math.min(bw / (b.r - b.l), (bh / (b.b - b.t)) * 1.45);
    const x = (x0 + x1) / 2 - ((b.l + b.r) / 2) * size;
    const y = (y0 + y1) / 2 - ((b.t + b.b) / 2) * size;
    // a thin same-colour stroke gives the heavier pen of the original lettering
    const el = svg('text', { x: x.toFixed(2), y: y.toFixed(2), 'font-size': size.toFixed(2), 'font-family': font, 'font-weight': 700, 'text-anchor': 'middle', direction: 'rtl',
      fill: attrs.fill, stroke: attrs.fill, 'stroke-width': (size * 0.022).toFixed(2), 'stroke-linejoin': 'round' }, parent);
    el.textContent = text;
    return el;
  }

  // ---------------- timeline (seconds) ----------------
  const SCENES = [
    // theme, base fade-in [a,b], base fade-out [a,b], phrases
    { theme: CREAM, show: [0, 1.365], in: [0, 0.45], out: [1.0, 1.36], phrases: [] },
    { theme: TEAL, show: [1.365, 4.715], in: [1.38, 1.58], out: [4.12, 4.7], flick: [1.97, 2.1, 2.7],
      phrases: [
        { t: 'عَدَدَ خَلْقِهِ', box: [524, 821, 271, 383], gold: true, at: 2.76, dur: 0.2 },
        { t: 'وَزِنَةَ عَرْشِهِ', box: [506, 835, 413, 535], gold: true, at: 3.8, dur: 0.2 },
      ] },
    { theme: CREAM, show: [4.715, 7.885], in: [4.72, 5.05], out: [7.55, 7.88],
      phrases: [
        { t: 'حَمْدًا', box: [699, 844, 289, 364], at: 5.2, dur: 0.23 },
        { t: 'كَـ~ثِيرًا', box: [501, 790, 180, 293], at: 5.7, dur: 0.23 },
        { t: 'طَيِّبًا', box: [539, 672, 289, 375], at: 6.3, dur: 0.23 },
        { t: 'مُبَارَكًا', box: [665, 834, 408, 501], at: 6.87, dur: 0.2 },
        { t: 'فِيـ~هِ', box: [506, 640, 411, 498], at: 7.32, dur: 0.12 },
      ] },
    { theme: TEAL, show: [7.885, 12.885], in: [8.12, 8.62], out: [12.3, 12.84],
      phrases: [
        { t: 'مِلْءَ السَّمَاوَاتِ', box: [510, 861, 271, 375], gold: true, at: 8.8, dur: 0.4 },
        { t: 'وَمِلْءَ', box: [755, 867, 412, 514], gold: true, at: 9.77, dur: 0.13 },
        { t: 'الْأَرَاضِينَ', box: [517, 742, 412, 521], gold: true, at: 10.17, dur: 0.13 },
        { t: 'وَمِلْءَ', box: [822, 1027, 479, 631], gold: true, at: 10.93, dur: 0.14, big: true },
        { t: 'مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ', box: [252, 800, 528, 649], at: 11.2, dur: 0.3, white: true },
      ] },
    { theme: CREAM, show: [12.885, 99], in: [12.95, 13.2], out: [99, 99],
      phrases: [
        { t: 'حَمْدًا لَا', box: [525, 740, 273, 363], at: 13.93, dur: 0.24 },
        { t: 'يُحْصَى', box: [532, 742, 413, 502], at: 14.63, dur: 0.24 },
      ] },
  ];

  function setup(stage) {
    const layers = SCENES.map((sc) => {
      const g = html('div', { class: 'scene' }, stage);
      Object.assign(g.style, { position: 'absolute', inset: '0', background: sc.theme.bg, overflow: 'hidden' });
      const root = svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, g);
      if (sc.theme === CREAM) {
        // faint blurred "ghost" lettering in the paper background
        const ghost = svg('g', { opacity: 0.55, style: 'filter:blur(9px)' }, root);
        phrase(ghost, 'حَمْدًا كَثِيرًا طَيِّبًا', [430, 900, 200, 300], { fill: '#fbf8ee' });
        phrase(ghost, 'مُبَارَكًا فِيهِ حَمْدًا', [150, 1130, 505, 600], { fill: '#fbf8ee' });
      }
      // base: ٱلْحَمْدُ لِلَّهِ with a long kashida (ink box measured: x 311–960, y 290–426)
      const baseG = svg('g', { style: `filter:${sc.theme.shadow}` }, root);
      const base = phrase(baseG, 'الْحَ~مْدُ لِلَّهِ', [311, 960, 290, 426], { fill: sc.theme.text });
      const phr = sc.phrases.map((p) => {
        const fill = p.big ? '#c4c08c' : p.gold ? TEAL.gold : p.white ? '#f4f8fb' : sc.theme.text;
        const pg = svg('g', { style: `filter:${sc.theme.shadow}` }, root);
        const el = phrase(pg, p.t, p.box, { fill });
        return Object.assign({ g: pg, el }, p);
      });
      return { sc, g, baseG, base, phr };
    });

    // transition masks (black bars)
    const bars = html('div', { class: 'bars' }, stage);
    Object.assign(bars.style, { position: 'absolute', inset: '0', pointerEvents: 'none' });
    const barEls = [];
    for (let i = 0; i < 8; i++) {
      const b = html('div', {}, bars);
      Object.assign(b.style, { position: 'absolute', left: '0', width: W + 'px', background: '#010002', display: 'none' });
      barEls.push(b);
    }
    function setBars(list) {
      barEls.forEach((b, i) => {
        const r = list[i];
        if (!r || r[1] <= r[0]) { b.style.display = 'none'; return; }
        b.style.display = 'block'; b.style.top = r[0] + 'px'; b.style.height = r[1] - r[0] + 'px';
      });
    }
    /** venetian blinds: strips of `period` px starting at `offset`, revealed top→down by h px */
    function blinds(offset, period, h) {
      const out = [];
      for (let top = offset - period; top < H; top += period) out.push([Math.max(0, top + h), Math.min(H, top + period)]);
      return out;
    }

    return {
      render(t) {
        layers.forEach((L) => {
          const sc = L.sc;
          const on = t >= sc.show[0] && t < sc.show[1];
          L.g.style.display = on ? 'block' : 'none';
          if (!on) return;
          let a = ease.inOutQuad(prog(t, sc.in[0], sc.in[1])) * (1 - ease.inOutQuad(prog(t, sc.out[0], sc.out[1])));
          if (sc.flick) a *= 1 - (ease.inQuad(prog(t, sc.flick[0], sc.flick[1])) - ease.outQuad(prog(t, sc.flick[1], sc.flick[2])));
          const outA = 1 - ease.inOutQuad(prog(t, sc.out[0], sc.out[1]));
          L.baseG.style.opacity = a.toFixed(3);
          L.phr.forEach((p) => {
            const q = ease.outQuad(prog(t, p.at, p.at + p.dur));
            p.g.style.opacity = (q * outA).toFixed(3);
            const blur = 6 * (1 - q);
            p.g.style.filter = `${sc.theme.shadow}${blur > 0.05 ? ` blur(${blur.toFixed(2)}px)` : ''}`;
            p.g.style.display = q <= 0 ? 'none' : '';
          });
        });

        // transitions
        if (t >= 1.365 && t < 1.6) setBars(blinds(76, 283.5, Math.max(2, (t - 1.368) * 1240)));
        else if (t >= 7.885 && t < 8.07) { const h = 27 + Math.max(0, t - 7.9) * 2280; setBars([[0, Math.max(0, 359 - h)], [Math.min(H, 359 + h), H]]); }
        else if (t >= 12.885 && t < 13.53) setBars(blinds(108, 250, Math.max(4, (t - 12.885) * 390)));
        else setBars([]);
      },
    };
  }

  // Synth fallback (the original is a vocal track): a soft pad per scene + swells on cuts.
  const sounds = [
    { t: 0.0, type: 'pad', dur: 1.5, gain: -26, notes: [146.83, 220, 293.66] },
    { t: 1.3, type: 'whoosh', dur: 0.4, gain: -16 },
    { t: 1.4, type: 'pad', dur: 3.4, gain: -26, notes: [130.81, 196, 261.63] },
    { t: 2.76, type: 'twinkle', dur: 0.3, gain: -26, density: 12 },
    { t: 3.8, type: 'twinkle', dur: 0.3, gain: -26, density: 12 },
    { t: 4.6, type: 'swell', dur: 0.45, rise: 0.15, gain: -18 },
    { t: 4.72, type: 'pad', dur: 3.2, gain: -26, notes: [146.83, 220, 293.66] },
    ...[5.2, 5.7, 6.3, 6.87, 7.32].map((t) => ({ t, type: 'twinkle', dur: 0.25, gain: -27, density: 12 })),
    { t: 7.82, type: 'whoosh', dur: 0.4, gain: -14 },
    { t: 8.0, type: 'pad', dur: 4.9, gain: -26, notes: [110, 164.81, 220, 277.18] },
    ...[8.8, 9.77, 10.17, 10.93, 11.2].map((t) => ({ t, type: 'twinkle', dur: 0.3, gain: -26, density: 12 })),
    { t: 12.8, type: 'whoosh', dur: 0.6, rise: 0.3, gain: -15 },
    { t: 12.9, type: 'pad', dur: 2.2, gain: -26, notes: [146.83, 220, 293.66] },
    ...[13.93, 14.63].map((t) => ({ t, type: 'twinkle', dur: 0.3, gain: -27, density: 12 })),
  ];

  Reel.run({
    id: 'alhamdulillah', title: 'الحمد لله', width: W, height: H, duration: 15.13, fps: 30, background: CREAM.bg,
    fonts: ['700 40px Amiri'],
    original: '../../media/alhamdulillah.m4a', preferOriginal: true,
    setup, sounds,
  });
})();
