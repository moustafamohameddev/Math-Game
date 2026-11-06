/* Daily reel templates. A script (see daily/scripts.js) is turned into a full
 * Reel config: layout, timing and sound design are all derived from the text.
 *   illustrated  — generic illustrated reel (720×1280)
 *   sabr | yudabbir | istighfar | alhamdulillah — the four original reels with new text */
(function (global) {
  'use strict';
  const { svg, html, prog, ease, clamp, lerp, rng } = R;

  const THEMES = {
    light: { mode: 'marker', bg: '#fcfcfc', ink: '#2b1d11', title: '#351f00', text: '#351f00', sub: '#615e58', en: '#605c55', ref: '#a8a39c', hl: '#fade61',
      accent: '#f2bd24', sand: '#e5ac15', soft: '#ede1cd', leaf: '#a3a679', petal: '#f8d22c', center: '#efa417', moon: '#e5ac15', panel: '#e6d6b8', door: '#c9a77a',
      page: '#fffaf0', rain: '#9a958e', cloud: '#2b1d11', cloudFill: '#f4efe6', rock: '#6f665c', stem: '#2b1d11', trunk: '#5b4128', dotRing: '#fff3c0', glow: '250,214,80' },
    brown: { mode: 'glow', bg: '#1e140b', ink: '#f7ede2', title: '#f8d52a', text: '#fff6eb', sub: '#887c71', en: '#9f9286', ref: '#887c71',
      accent: '#f8d52a', sand: '#f0c43a', soft: '#2b2219', leaf: '#8fa582', petal: '#f8d52a', center: '#f6f1e2', moon: '#f7ede2', panel: '#292011', door: '#3a2f24',
      page: '#3a3128', rain: '#6d6259', cloud: '#c3b6a8', cloudFill: 'rgba(255,240,225,.07)', rock: '#a59a8e', stem: '#eef0e8', trunk: '#c3b6a8', dotRing: '#fff3c0', glow: '248,213,42' },
    navy: { mode: 'glow', bg: '#060f1f', ink: '#e6e2d8', title: '#fcd525', text: '#f8f9f3', sub: '#8c96ac', en: '#8991a6', ref: '#757e92',
      accent: '#fcd525', sand: '#f2c832', soft: '#16213a', leaf: '#8fa582', petal: '#fcd525', center: '#f6f1e2', moon: '#f8f9f3', panel: '#111b30', door: '#1d2a47',
      page: '#1d2a47', rain: '#8a9ab5', cloud: '#6b7690', cloudFill: '#18233b', rock: '#8792ac', stem: '#eef0e8', trunk: '#aab3c4', dotRing: '#fff3c0', glow: '252,213,37' },
    olive: { mode: 'glow', bg: '#0e1a15', ink: '#eef0e6', title: '#f2c84b', text: '#f4f6ee', sub: '#8fa396', en: '#93a59a', ref: '#7d8f84',
      accent: '#f2c84b', sand: '#e8bd3e', soft: '#18291f', leaf: '#9dbb8a', petal: '#f2c84b', center: '#f6f1e2', moon: '#f4f6ee', panel: '#13221a', door: '#1f3428',
      page: '#1f3428', rain: '#7f988a', cloud: '#a9bcae', cloudFill: 'rgba(230,255,240,.06)', rock: '#9fb1a5', stem: '#eef0e6', trunk: '#b9c7bc', dotRing: '#fff3c0', glow: '242,200,75' },
    rose: { mode: 'marker', bg: '#fbf5f0', ink: '#3a2420', title: '#4a2a24', text: '#4a2a24', sub: '#8a6f68', en: '#86706a', ref: '#b39d96', hl: '#f6c7b2',
      accent: '#e8896a', sand: '#e8a27f', soft: '#f1dfd4', leaf: '#a9b48f', petal: '#f2a488', center: '#d9705a', moon: '#e8896a', panel: '#f0dcd0', door: '#d9b29f',
      page: '#fffaf6', rain: '#b29e97', cloud: '#3a2420', cloudFill: '#f7ece6', rock: '#8a6f68', stem: '#3a2420', trunk: '#6a4a3e', dotRing: '#fff1e8', glow: '232,137,106' },
  };

  /** The account handle shown on every daily video (set `brand` in daily/scripts.js). */
  function brandMark(stage, y, color, accent, t0, width = 720) {
    const name = (global.DAILY && DAILY.brand) || '';
    if (!name) return { render() {} };
    const el = html('div', { class: 'brand-mark', dir: 'ltr' }, stage);
    Object.assign(el.style, { position: 'absolute', left: '0', width: width + 'px', top: y + 'px', transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '7px',
      font: '500 17px Inter, system-ui, sans-serif', letterSpacing: '1.4px', color, zIndex: 4, whiteSpace: 'nowrap' });
    const dot = html('span', {}, el);
    Object.assign(dot.style, { width: '7px', height: '7px', borderRadius: '50%', background: accent, display: 'inline-block' });
    html('span', { text: '@' + name.replace(/^@/, '') }, el);
    return { render(t) { el.style.opacity = ease.outQuad(prog(t, t0, t0 + 0.4)).toFixed(3); } };
  }

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  /** "text with *highlighted* words" → Caption.line word specs. */
  function words(text, th, mode) {
    const toks = text.split(/\s+/).filter(Boolean);
    const glow = `0 0 10px rgba(${th.glow},.55)`;
    return toks.map((tok, i) => {
      const m = /^([^*]*)\*(.+?)\*(.*)$/.exec(tok);
      if (!m) return tok;
      const [, pre, hl, post] = m;
      const plain = pre + hl + post;
      if (mode === 'marker') return { w: plain, hl: true, joinPrev: i > 0 && toks[i - 1].includes('*') };
      return { w: plain, html: `${esc(pre)}<span style="color:${th.accent};text-shadow:${glow}">${esc(hl)}</span>${esc(post)}` };
    });
  }
  const countHl = (specs) => specs.filter((s) => typeof s === 'object' && s.hl).length;

  // =====================================================================
  // illustrated
  // =====================================================================
  function illustrated(sc) {
    const th = THEMES[sc.theme] || THEMES.light;
    const beats = sc.beats;
    const BEAT = sc.beatDur || 3.2;
    const S = (i) => 1.6 + i * BEAT;
    const V = S(beats.length);
    const duration = +(V + 5.4).toFixed(2);

    // art segments (consecutive beats with the same art share one drawing)
    const artOf = beats.map((b) => b.art);
    artOf.push(sc.verse.art || artOf[artOf.length - 1]);
    const segs = [];
    artOf.forEach((name, i) => {
      const from = i === 0 ? 0.3 : S(i) - 0.15;
      if (segs.length && segs[segs.length - 1].name === name) return;
      if (segs.length) segs[segs.length - 1].to = from;
      segs.push({ name, from, to: duration + 1 });
    });

    // word timings
    const tim = beats.map((b, i) => {
      const s = S(i), nA = b.ar.split(/\s+/).filter(Boolean).length, nE = b.en.split(/\s+/).filter(Boolean).length;
      const ta = Array.from({ length: nA }, (_, k) => s + k * 0.16);
      const te = Array.from({ length: nE }, (_, k) => s + 0.38 + k * 0.07);
      return { s, ta, te, out: S(i + 1) - 0.25 };
    });
    const vA = sc.verse.ar.split(/\s+/).filter(Boolean).length + 2, vE = sc.verse.en.split(/\s+/).filter(Boolean).length;
    const vta = Array.from({ length: vA }, (_, k) => V + k * 0.15);
    const vte = Array.from({ length: vE }, (_, k) => V + 0.55 + k * 0.06);

    function setup(stage) {
      const root = svg('svg', { width: 720, height: 1280, viewBox: '0 0 720 1280' }, stage);
      const defs = svg('defs', {}, root);
      defs.innerHTML = `<radialGradient id="litGlow"><stop offset="0" stop-color="rgb(${th.glow})" stop-opacity=".55"/><stop offset=".55" stop-color="rgb(${th.glow})" stop-opacity=".2"/><stop offset="1" stop-color="rgb(${th.glow})" stop-opacity="0"/></radialGradient>`;
      const lit = svg('circle', { cx: 360, cy: 610, r: 200, fill: 'url(#litGlow)', opacity: 0 }, root);
      const segEls = segs.map((sg) => { const g = svg('g', {}, root); return Object.assign(sg, { g, art: Art.make(sg.name, g, th) }); });
      const r = rng(sc.id.length * 31 + 7);
      const sparks = [];
      const sparkG = svg('g', { opacity: 0 }, root);
      for (let i = 0; i < 40; i++) {
        const a = r() * Math.PI * 2, d = 40 + Math.sqrt(r()) * 170;
        const s = r() < 0.3 ? svg('path', { d: `M0,-4Q0,0 4,0Q0,0 0,4Q0,0 -4,0Q0,0 0,-4Z`, fill: th.accent }, sparkG) : svg('circle', { r: 1.3 + r() * 1.8, fill: th.accent }, sparkG);
        sparks.push({ s, x: 360 + Math.cos(a) * d, y: 610 + Math.sin(a) * d, ph: r() * 6, sp: 1 + r() * 2, drift: 6 + r() * 12 });
      }

      // title + subtitle
      const marker = th.mode === 'marker';
      const title = Caption.line({ parent: stage, y: 322, size: 64, font: 'Amiri', weight: 700, color: marker ? th.title : th.title, maxWidth: 560,
        words: [marker ? { w: sc.title, hl: true } : { w: sc.title, glow: `0 0 14px rgba(${th.glow},.5)` }], hlEm: [-0.08, 0.6], hlColor: th.hl, gap: 0.3 });
      const sub = Caption.letters({ parent: stage, text: sc.subtitle || '', y: 377, font: '"Patrick Hand"', size: 22, color: th.sub });
      const brand = brandMark(stage, 222, th.sub, th.accent, 0.15);

      // beats
      const AR = { font: 'Amiri', weight: 700, color: th.text, gap: 0.42, maxWidth: 600, hlEm: [-0.12, 0.58], hlColor: th.hl, hlPadX: 5 };
      const EN = { font: '"Patrick Hand"', color: th.en, dir: 'ltr', gap: 0.34, maxWidth: 630, hlEm: [-0.05, 0.48], hlColor: th.hl, hlPadX: 3 };
      const caps = beats.map((b, i) => {
        const ar = Caption.line(Object.assign({ parent: stage, y: 846, size: 36, words: words(b.ar, th, th.mode) }, AR));
        const en = Caption.line(Object.assign({ parent: stage, y: 889, size: 21, words: words(b.en, th, th.mode) }, EN));
        const T = tim[i];
        const nHa = countHl(ar.words.map((w) => w.spec)), nHe = countHl(en.words.map((w) => w.spec));
        const ha = T.ta[T.ta.length - 1] + 0.25, he = T.te[T.te.length - 1] + 0.22;
        return { ar, en,
          tA: { times: T.ta, hlTimes: Array.from({ length: nHa }, (_, k) => ha + k * 0.13), hlDur: 0.24, out: T.out, outDur: 0.14 },
          tE: { times: T.te, hlTimes: Array.from({ length: nHe }, (_, k) => he + k * 0.1), hlDur: 0.2, out: T.out, outDur: 0.14 } };
      });
      // closing verse
      const vWords = ['﴿', ...words(sc.verse.ar, th, th.mode), '﴾'];
      const verse = Caption.line({ parent: stage, y: 850, size: 38, font: '"Amiri Quran"', weight: 400, color: th.text, gap: 0.36, maxWidth: 640, hlEm: [-0.3, 0.55], hlColor: th.hl, hlPadX: 5, words: vWords });
      const verseEn = Caption.line({ parent: stage, y: 910, size: 21, font: '"Patrick Hand"', color: th.en, dir: 'ltr', gap: 0.3, maxWidth: 640, hlEm: [-0.05, 0.48], hlColor: th.hl, hlPadX: 3, words: words(sc.verse.en, th, th.mode) });
      const ref = Caption.line({ parent: stage, y: 950, size: 16, font: 'Amiri', color: th.ref, gap: 0.3, words: sc.verse.ref.split(/\s+/) });
      const nVa = countHl(verse.words.map((w) => w.spec)), nVe = countHl(verseEn.words.map((w) => w.spec));
      const vha = vta[vta.length - 1] + 0.3, vhe = vte[vte.length - 1] + 0.25;

      return {
        render(t) {
          // art
          segEls.forEach((sg) => {
            const a = ease.outQuad(prog(t, sg.from - 0.05, sg.from + 0.2)) * (1 - ease.inQuad(prog(t, sg.to - 0.25, sg.to - 0.02)));
            sg.g.style.display = a <= 0.001 ? 'none' : '';
            if (a <= 0.001) return;
            sg.g.setAttribute('opacity', a.toFixed(3));
            sg.art.render(t - sg.from, t);
          });
          const L = ease.inOutQuad(prog(t, V - 0.35, V + 0.5));
          lit.setAttribute('opacity', (L * (0.85 + 0.15 * Math.sin(t * 1.5))).toFixed(3));
          sparkG.setAttribute('opacity', ease.outQuad(prog(t, V, V + 0.8)).toFixed(3));
          if (t > V) sparks.forEach((p) => {
            p.s.setAttribute('transform', `translate(${p.x.toFixed(1)},${(p.y - ((t - V) * p.drift) % 30).toFixed(1)})`);
            p.s.setAttribute('opacity', (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * p.sp * 2.4 + p.ph))).toFixed(3));
          });
          // text
          brand.render(t);
          title.render(t, { times: [0.36], dur: 0.28, hlTimes: [0.67], hlDur: 0.33 });
          sub.render(t, { start: 0.75, span: 0.2, dur: 0.06 });
          caps.forEach((c) => { c.ar.render(t, c.tA); c.en.render(t, c.tE); });
          verse.render(t, { times: vta, hlTimes: Array.from({ length: nVa }, (_, k) => vha + k * 0.14), hlDur: 0.2 });
          verseEn.render(t, { times: vte, hlTimes: Array.from({ length: nVe }, (_, k) => vhe + k * 0.1), hlDur: 0.18 });
          ref.render(t, { times: ref.words.map(() => V + 1.3), dur: 0.3 });
        },
      };
    }

    function sounds() {
      const ev = [{ t: 0.2, type: 'bed', dur: duration - 0.5, gain: -42 }, { t: 0.2, type: 'ping', gain: -7 }];
      tim.forEach((T) => {
        ev.push({ t: T.s, type: 'ping', gain: -6 });
        T.ta.slice(1).forEach((x) => ev.push({ t: x + 0.02, type: 'tick', gain: -9 }));
        T.te.forEach((x, k) => { if (k % 2 === 0) ev.push({ t: x + 0.02, type: 'tick', gain: -13 }); });
      });
      ev.push({ t: V - 0.55, type: 'swell', dur: 0.75, rise: 0.55, gain: -7, low: 65 });
      ev.push({ t: V, type: 'ping', gain: -7 });
      vta.slice(1).forEach((x, k) => { if (k % 2 === 0) ev.push({ t: x + 0.02, type: 'tick', gain: -11 }); });
      ev.push({ t: V + 0.2, type: 'twinkle', dur: 1.6, density: 10, gain: -15 });
      segs.forEach((sg) => {
        ev.push({ t: sg.from, type: 'scribble', dur: 0.7, gain: -21 });
        ev.push(...Art.sfx(sg.name, sg.from, Math.min(sg.to, duration) - sg.from));
      });
      return ev;
    }

    return { width: 720, height: 1280, duration, background: th.bg, setup, sounds };
  }

  // =====================================================================
  // helpers used by the four original reels in "variant" mode
  // (same visuals as the originals, new text from a script)
  // =====================================================================
  const nWords = (s) => s.split(/\s+/).filter(Boolean).length;
  function beatTimes(b, s) {
    return {
      ta: Array.from({ length: nWords(b.ar) }, (_, k) => s + k * 0.15),
      te: Array.from({ length: nWords(b.en) }, (_, k) => s + 0.36 + k * 0.065),
    };
  }
  /** Build caption pairs for beats starting at `starts` (seconds), fading at `outs`. */
  function autoCaps(stage, beats, starts, outs, o) {
    return beats.map((b, i) => {
      const T = beatTimes(b, starts[i]);
      const ar = Caption.line(Object.assign({ parent: stage, y: o.yA, size: o.sizeA, words: words(b.ar, o.th, o.mode) }, o.AR));
      const en = Caption.line(Object.assign({ parent: stage, y: o.yE, size: o.sizeE, words: words(b.en, o.th, o.mode) }, o.EN));
      const nHa = countHl(ar.words.map((w) => w.spec)), nHe = countHl(en.words.map((w) => w.spec));
      const ha = T.ta[T.ta.length - 1] + 0.3, he = T.te[T.te.length - 1] + 0.25;
      const out = outs[i] == null ? undefined : outs[i];
      return { ar, en, T,
        tA: { times: T.ta, hlTimes: Array.from({ length: nHa }, (_, k) => ha + k * 0.15), hlDur: 0.25, out, outDur: 0.14 },
        tE: { times: T.te, hlTimes: Array.from({ length: nHe }, (_, k) => he + k * 0.1), hlDur: 0.2, out, outDur: 0.14 } };
    });
  }
  /** Tick sounds for a set of word times. */
  function ticksFor(times, gain = -8, every = 1) {
    return times.filter((_, k) => k % every === 0).map((t) => ({ t: t + 0.02, type: 'tick', gain }));
  }
  const VARIANT_TYPES = ['sabr', 'yudabbir', 'istighfar', 'alhamdulillah'];

  // =====================================================================
  function pick(list) {
    const q = new URLSearchParams(location.search);
    if (q.get('s')) return list.find((x) => x.id === q.get('s'));
    let day = q.has('day') ? parseInt(q.get('day'), 10) : null;
    if (day == null) {
      const d = q.get('date') ? new Date(q.get('date') + 'T00:00:00Z') : new Date();
      day = Math.floor((Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - Date.parse(DAILY.start + 'T00:00:00Z')) / 864e5);
    }
    return list[((day % list.length) + list.length) % list.length];
  }

  function run() {
    const sc = pick(DAILY.scripts);
    if (!sc) { document.body.textContent = 'Script not found'; return; }
    if (VARIANT_TYPES.includes(sc.template)) {
      // reuse the original reel with the script's text
      global.VARIANT = sc;
      const s = document.createElement('script');
      s.src = `../${sc.template}/scene.js`;
      document.body.appendChild(s);
      return;
    }
    const cfg = illustrated(sc);
    Reel.run(Object.assign(cfg, {
      id: 'daily-' + sc.id, title: sc.title || sc.base.replace('~', ''), fps: 30,
      fonts: ['700 40px Amiri', '400 40px Amiri', '400 40px "Amiri Quran"', '400 20px "Patrick Hand"', '500 17px Inter'],
    }));
  }

  const FONTS = ['700 40px Amiri', '400 40px Amiri', '400 40px "Amiri Quran"', '400 20px "Patrick Hand"', '500 17px Inter'];
  global.Templates = { THEMES, illustrated, run, pick, words, countHl, brandMark, beatTimes, autoCaps, ticksFor, FONTS };
})(window);
