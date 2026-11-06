/* يدبّر الأمر — solar system → house in the rain → light (720×1280, 13.9 s).
 * Timings, positions and colours measured frame-by-frame from the source video. */
(function () {
  'use strict';
  const { svg, html, kf, prog, ease, clamp, lerp, sketch, rng } = R;

  const C = {
    bg: '#1e140b', cream: '#f7ede2', text: '#fff6eb', en: '#9f9286', dim: '#887c71', brand: '#867c70',
    yellow: '#f8d52a', hill: '#2b2219', hatch: '#3a3128', house: '#292011', rain: '#6d6259', cloud: '#c3b6a8',
    sun: '#fad42e', tan: '#cea054', ice: '#98abb6', moonW: '#eee5d6',
  };
  const GLOW = '0 0 10px rgba(248,213,42,.55)';

  function boilPath(parent, pts, attrs, seed, opts = {}) {
    const vars = [0, 1, 2].map((k) => sketch(pts, Object.assign({ amp: 1.0, step: 18, seed: seed * 13 + k * 101 }, opts)));
    const p = svg('path', Object.assign({ d: vars[0], fill: 'none', stroke: C.cream, 'stroke-width': 3.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, attrs), parent);
    p.__vars = vars;
    return p;
  }
  function boil(p, t) {
    const k = Math.floor(t / 0.24) % 3;
    if (p.__k !== k) { p.setAttribute('d', p.__vars[k]); p.__k = k; }
  }
  const cloudD = (cx, cy, w, h) => {
    const x0 = cx - w / 2, x1 = cx + w / 2, b = cy + h / 2;
    return `M${x0 + h * 0.3},${b} Q${x0 - h * 0.05},${b} ${x0},${b - h * 0.32} Q${x0 + h * 0.05},${cy - h * 0.12} ${x0 + w * 0.2},${cy - h * 0.08}
      Q${x0 + w * 0.26},${cy - h * 0.58} ${x0 + w * 0.43},${cy - h * 0.4} Q${x0 + w * 0.56},${cy - h * 0.75} ${x0 + w * 0.7},${cy - h * 0.3}
      Q${x1 + h * 0.05},${cy - h * 0.35} ${x1},${b - h * 0.25} Q${x1},${b} ${x1 - h * 0.3},${b} Z`;
  };

  function setup(stage) {
    const root = svg('svg', { width: 720, height: 1280, viewBox: '0 0 720 1280' }, stage);
    const defs = svg('defs', {}, root);
    defs.innerHTML = `
      <pattern id="hatch3" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
        <rect width="12" height="12" fill="${C.hill}"/><line x1="0" y1="0" x2="0" y2="12" stroke="${C.hatch}" stroke-width="2"/></pattern>
      <radialGradient id="houseGlow"><stop offset="0" stop-color="#d9a91c" stop-opacity=".75"/><stop offset=".45" stop-color="#9c7414" stop-opacity=".38"/><stop offset="1" stop-color="#5a420c" stop-opacity="0"/></radialGradient>
      <linearGradient id="cone3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8bd2a" stop-opacity=".22"/><stop offset="1" stop-color="#e8bd2a" stop-opacity=".38"/></linearGradient>
      <radialGradient id="winGlow"><stop offset=".55" stop-color="#fad430" stop-opacity=".55"/><stop offset="1" stop-color="#fad430" stop-opacity="0"/></radialGradient>
      <radialGradient id="sunGlow"><stop offset=".5" stop-color="#fad42e" stop-opacity=".25"/><stop offset="1" stop-color="#fad42e" stop-opacity="0"/></radialGradient>`;

    const r = rng(7);

    // ================= scene A: solar system =================
    const solar = svg('g', {}, root);
    // diagonal band of tiny stars
    for (let i = 0; i < 46; i++) {
      const u = r();
      const x = lerp(30, 700, u) + (r() - 0.5) * 30, y = lerp(400, 740, u) + (r() - 0.5) * 34;
      svg('circle', { cx: x, cy: y, r: 0.8 + r() * 1.4, fill: '#d8cfc4', opacity: 0.25 + r() * 0.6 }, solar);
    }
    const CX = 360, CY = 586;
    const orbits = [[80, 46], [140, 66], [206, 98]];
    orbits.forEach(([rx, ry]) => svg('ellipse', { cx: CX, cy: CY, rx, ry, fill: 'none', stroke: '#7b6f63', 'stroke-width': 1.3, 'stroke-dasharray': '3 4' }, solar));
    svg('circle', { cx: CX, cy: CY, r: 48, fill: 'url(#sunGlow)' }, solar);
    const rays = svg('g', {}, solar);
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      svg('line', { x1: CX + Math.cos(a) * 35, y1: CY + Math.sin(a) * 35, x2: CX + Math.cos(a) * 46, y2: CY + Math.sin(a) * 46, stroke: k % 3 ? '#e8c440' : '#f6dc6a', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: k % 2 ? 0.75 : 1 }, rays);
    }
    svg('circle', { cx: CX, cy: CY, r: 25, fill: C.sun, stroke: '#ffe98a', 'stroke-width': 1.5 }, solar);
    const planets = [
      { rx: 80, ry: 46, a0: 165, w: 74, node: svg('circle', { r: 6.5, fill: C.moonW }, solar) },
      { rx: 140, ry: 66, a0: -136, w: 48, node: svg('circle', { r: 10.5, fill: C.tan, stroke: '#e3c08a', 'stroke-width': 1.5 }, solar) },
      { rx: 206, ry: 98, a0: -62, w: 34, node: (() => {
        const g = svg('g', {}, solar);
        svg('circle', { r: 13.5, fill: C.ice, stroke: '#c9d6dc', 'stroke-width': 1.5 }, g);
        svg('ellipse', { rx: 24, ry: 5, fill: 'none', stroke: '#c9d6dc', 'stroke-width': 1.8 }, g);
        return g;
      })() },
      { rx: 236, ry: 112, a0: 126, w: 22, node: svg('circle', { r: 5, fill: C.moonW }, solar) },
    ];

    // ================= scene B: house in the rain =================
    const sceneB = svg('g', {}, root);
    const zoomG = svg('g', {}, sceneB);
    const houseGlow = svg('ellipse', { cx: 360, cy: 640, rx: 270, ry: 260, fill: 'url(#houseGlow)', opacity: 0 }, zoomG);
    const cone = svg('polygon', { points: '338,380 382,380 404,582 316,582', fill: 'url(#cone3)', opacity: 0 }, zoomG);
    const beamLine = svg('line', { x1: 360, x2: 360, y1: 380, y2: 582, stroke: '#edc429', 'stroke-width': 3.2, opacity: 0 }, zoomG);
    const stars = [];
    for (let i = 0; i < 14; i++) {
      const sx = 60 + r() * 600, sy = 395 + r() * 230;
      if (Math.abs(sx - 360) < 70) continue;
      stars.push({ n: svg('circle', { cx: sx, cy: sy, r: 1.4 + r() * 1.6, fill: r() < 0.25 ? '#c0583f' : '#c9bfb4' }, zoomG), ph: r() * 6, sp: 1 + r() * 2 });
    }
    // rain (behind house/hill)
    const rainG = svg('g', { stroke: C.rain, 'stroke-width': 2, 'stroke-linecap': 'round' }, zoomG);
    const drops = [];
    for (let i = 0; i < 46; i++) drops.push({ n: svg('line', { x1: 0, y1: 0, x2: -3, y2: 14 }, rainG), x: 40 + r() * 640, y0: r(), sp: 0.85 + r() * 0.3 });
    // clouds + moon
    const moon = svg('path', { d: 'M0,-21 A21,21 0 1 0 0,21 A15,17 0 1 1 0,-21Z', fill: C.cream, transform: 'translate(500,483)' }, zoomG);
    const clouds = [
      { cx: 165, cy: 497, w: 140, h: 50, vx: -9, out: -1 },
      { cx: 286, cy: 457, w: 118, h: 40, vx: -10, out: -1 },
      { cx: 499, cy: 535, w: 178, h: 60, vx: 10, out: 1 },
    ].map((c) => Object.assign(c, { n: svg('path', { d: cloudD(0, 0, c.w, c.h), fill: 'rgba(255,240,225,.07)', stroke: C.cloud, 'stroke-width': 3, 'stroke-linejoin': 'round' }, zoomG) }));
    // hill
    const hillPts = [];
    for (let i = 0; i <= 40; i++) { const u = i / 40, x = lerp(40, 680, u); hillPts.push([x, 678 + 92 * Math.pow(Math.abs(u - 0.5) * 2, 1.75)]); }
    svg('path', { d: 'M40,772 ' + hillPts.map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + ' L680,772Z', fill: 'url(#hatch3)' }, zoomG);
    const hill = boilPath(zoomG, hillPts, { 'stroke-width': 3.6 }, 1, { amp: 0.8, step: 40 });
    // house
    svg('path', { d: 'M313,624 L360,586 L407,624 L407,679 L313,679Z', fill: C.house }, zoomG);
    const winFill = svg('rect', { x: 342, y: 628, width: 36, height: 30, fill: '#fad430', opacity: 0 }, zoomG);
    const winGlow = svg('rect', { x: 332, y: 618, width: 56, height: 50, rx: 14, fill: 'url(#winGlow)', opacity: 0 }, zoomG);
    const winTint = svg('rect', { x: 342, y: 628, width: 36, height: 30, fill: '#8a6a3c', opacity: 0 }, zoomG);
    const walls = [
      boilPath(zoomG, [[313, 624], [313, 679]], {}, 2),
      boilPath(zoomG, [[407, 624], [407, 679]], {}, 3),
      boilPath(zoomG, [[302, 626], [360, 581], [418, 626]], { 'stroke-width': 4.2 }, 4, { amp: 0.6 }),
      boilPath(zoomG, [[308, 621], [360, 588], [412, 621]], { 'stroke-width': 2 }, 5, { amp: 0.6 }),
    ];
    const winFrame = svg('rect', { x: 342, y: 628, width: 36, height: 30, fill: 'none', stroke: C.cream, 'stroke-width': 2.6 }, zoomG);
    const winCross = svg('path', { d: 'M360,628 V658 M342,643 H378', stroke: C.cream, 'stroke-width': 2.4, fill: 'none' }, zoomG);
    const strokes = [hill, ...walls];

    // ================= text =================
    const verse = Caption.line({ parent: stage, y: 281, size: 34, font: '"Amiri Quran"', color: C.text, gap: 0.3, fit: 467,
      words: ['﴿', 'يُدَبِّرُ', 'ٱلْأَمْرَ', 'مِنَ', 'ٱلسَّمَآءِ', 'إِلَى', { w: 'ٱلْأَرْضِ', color: C.yellow, glow: GLOW }, '﴾'] });
    const verseEn = Caption.line({ parent: stage, y: 339, size: 19, font: '"Patrick Hand"', color: C.en, dir: 'ltr', gap: 0.3, fit: 440,
      words: ['“He', 'arranges', 'every', 'matter', 'from', 'the', 'heavens', 'to', 'the', { w: 'earth”', color: C.yellow }] });
    const source = Caption.line({ parent: stage, y: 369, size: 15, font: 'Amiri', color: C.dim, gap: 0.3, fit: 88, words: ['سورة', 'السجدة', '·', '٥'] });

    const AR = { font: 'Amiri', weight: 700, color: C.text, gap: 0.42 };
    const EN = { font: '"Patrick Hand"', color: C.en, dir: 'ltr', gap: 0.34 };
    const Y = (w) => ({ w, color: C.yellow, glow: GLOW });
    const caps = [
      { ar: Caption.line(Object.assign({ parent: stage, y: 842, size: 34, fit: 387, words: ['من', 'تولّى', 'تدبير', 'هذا', Y('الكون'), 'بأسره...'] }, AR)),
        en: Caption.line(Object.assign({ parent: stage, y: 883, size: 19, fit: 340, words: ['The', 'One', 'who', 'arranges', 'this', 'entire', Y('universe...')] }, EN)),
        tA: { times: [1.25, 1.38, 1.52, 1.65, 1.88, 2.15], out: 3.82, outDur: 0.14 },
        tE: { times: [1.62, 1.65, 1.72, 1.78, 1.85, 1.92, 2.02], out: 3.82, outDur: 0.14 } },
      { ar: Caption.line(Object.assign({ parent: stage, y: 842, size: 34, fit: 264, words: ['لا', 'يُعجزه', 'تدبير', Y('شأنك...')] }, AR)),
        en: Caption.line(Object.assign({ parent: stage, y: 883, size: 19, fit: 314, words: ['is', 'never', 'unable', 'to', 'arrange', Y('your'), 'affairs...'] }, EN)),
        tA: { times: [4.25, 4.38, 4.52, 4.78], out: 6.62, outDur: 0.14 },
        tE: { times: [4.62, 4.65, 4.72, 4.78, 4.85, 4.98, 5.08], out: 6.62, outDur: 0.14 } },
      { ar: Caption.line(Object.assign({ parent: stage, y: 842, size: 34, fit: 273, words: ['ولا', 'يخفى', 'عليه', Y('ضعفك...')] }, AR)),
        en: Caption.line(Object.assign({ parent: stage, y: 883, size: 19, fit: 353, words: ['and', 'your', Y('weakness'), 'is', 'never', 'hidden', 'from', 'Him...'] }, EN)),
        tA: { times: [7.05, 7.18, 7.32, 7.55], out: 9.22, outDur: 0.14 },
        tE: { times: [7.42, 7.48, 7.58, 7.72, 7.78, 7.82, 7.88, 7.95], out: 9.22, outDur: 0.14 } },
      { ar: Caption.line(Object.assign({ parent: stage, y: 842, size: 34, fit: 409, words: ['فوّض', 'أمرك', { w: 'إليه...', html: `<span style="color:${C.yellow};text-shadow:${GLOW}">إليه</span>...` }, 'وأحسن', Y('ظنّك'), 'به'] }, AR)),
        en: Caption.line(Object.assign({ parent: stage, y: 883, size: 19, fit: 416, words: ['so', 'entrust', 'your', 'affairs', 'to', { w: 'Him...', html: `<span style="color:${C.yellow}">Him</span>...` }, 'and', 'think', Y('well'), 'of', 'Him'] }, EN)),
        tA: { times: [9.65, 9.78, 10.05, 10.28, 10.55, 10.82] },
        tE: { times: [10.02, 10.08, 10.12, 10.18, 10.25, 10.35, 10.48, 10.55, 10.65, 10.78, 10.85] } },
    ];

    return {
      render(t) {
        strokes.forEach((p) => boil(p, t));

        // ---- solar system ----
        const sA = ease.outQuad(prog(t, 0.28, 0.75)) * (1 - ease.inQuad(prog(t, 4.08, 4.3)));
        solar.style.display = sA <= 0.001 ? 'none' : '';
        solar.setAttribute('opacity', sA.toFixed(3));
        const s0 = lerp(0.92, 1, ease.outCubic(prog(t, 0.28, 0.9)));
        const zs = s0 * kf(t, [[3.85, 1], [3.9, 1.15], [3.95, 1.44], [4.0, 1.7], [4.05, 2.0], [4.1, 2.24], [4.15, 2.9], [4.2, 3.5], [4.35, 4.6]]);
        solar.setAttribute('transform', `translate(586,600) scale(${zs.toFixed(4)}) translate(-586,-600)`);
        rays.setAttribute('transform', `rotate(${(t * 18).toFixed(2)} ${CX} ${CY})`);
        planets.forEach((p) => {
          const a = ((p.a0 + p.w * (t - 2)) * Math.PI) / 180;
          p.node.setAttribute('transform', `translate(${(CX + Math.cos(a) * p.rx).toFixed(2)},${(CY + Math.sin(a) * p.ry).toFixed(2)})`);
        });

        // ---- house scene ----
        const bA = ease.outQuad(prog(t, 3.92, 4.12));
        sceneB.style.display = bA <= 0.001 ? 'none' : '';
        sceneB.setAttribute('opacity', bA.toFixed(3));
        const bs = kf(t, [[3.92, 0.62], [4.05, 0.78], [4.15, 0.875], [4.3, 0.94], [4.55, 1]], ease.outQuad);
        const zz = 1 + 0.28 * ease.inOutCubic(prog(t, 7.1, 7.8));
        sceneB.setAttribute('transform', `translate(360,654) scale(${bs.toFixed(4)}) translate(-360,-654)`);
        zoomG.setAttribute('transform', `translate(360,657) scale(${zz.toFixed(4)}) translate(-360,-657)`);

        // clouds drift, then leave
        const leave = ease.inQuad(prog(t, 9.7, 10.5));
        clouds.forEach((c) => {
          const x = c.cx + c.vx * (t - 5) + c.out * 420 * leave;
          c.n.setAttribute('transform', `translate(${x.toFixed(1)},${c.cy})`);
          c.n.setAttribute('opacity', (1 - ease.inQuad(prog(t, 10.1, 10.5))).toFixed(3));
        });
        // rain
        const rainA = 1 - ease.inQuad(prog(t, 9.7, 10.1));
        rainG.setAttribute('opacity', rainA.toFixed(3));
        if (rainA > 0) drops.forEach((d) => {
          const y = 430 + (((d.y0 + t * 0.9 * d.sp) % 1) * 300);
          d.n.setAttribute('transform', `translate(${(d.x - (y - 430) * 0.18).toFixed(1)},${y.toFixed(1)})`);
        });

        // light
        const bl = prog(t, 9.83, 9.92);
        beamLine.setAttribute('opacity', bl > 0 ? '1' : '0');
        beamLine.setAttribute('y2', String(lerp(380, 582, ease.outQuad(bl))));
        cone.setAttribute('opacity', (ease.inOutQuad(prog(t, 10.2, 10.8)) * (0.62 + 0.08 * Math.sin(t * 2))).toFixed(3));
        const wl = ease.outQuad(prog(t, 10.4, 10.62));
        winFill.setAttribute('opacity', wl.toFixed(3));
        winGlow.setAttribute('opacity', wl.toFixed(3));
        winFrame.setAttribute('opacity', (1 - wl * 0.85).toFixed(3));
        winTint.setAttribute('opacity', (ease.inOutQuad(prog(t, 7.25, 7.6)) * 0.6 * (1 - wl)).toFixed(3));
        const g = 0.62 * ease.inOutQuad(prog(t, 10.5, 11.2)) * (0.86 + 0.14 * Math.cos((t - 11.2) * 1.25));
        houseGlow.setAttribute('opacity', g.toFixed(3));
        const st = ease.outQuad(prog(t, 10.2, 10.7));
        stars.forEach((s) => s.n.setAttribute('opacity', (st * (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph)))).toFixed(3)));
        moon.setAttribute('transform', 'translate(500,483)');

        // ---- text ----
        verse.render(t, { times: [0.17, 0.33, 0.47, 0.57, 0.67, 0.83, 1.07, 1.33] });
        verseEn.render(t, { times: [0.62, 0.65, 0.72, 0.78, 0.85, 0.92, 0.98, 1.02, 1.08, 1.22] });
        source.render(t, { times: [1.12, 1.12, 1.12, 1.12], dur: 0.25 });
        caps.forEach((c) => { c.ar.render(t, c.tA); c.en.render(t, c.tE); });
      },
    };
  }

  const ticks = [[0.154, -22], [0.288, -20], [0.415, -24], [0.549, -25], [0.613, -28], [0.677, -21], [0.793, -25], [0.851, -26], [0.973, -26],
    [1.031, -27], [1.333, -22], [1.391, -22], [1.518, -24], [1.611, -27], [1.733, -25], [1.791, -26], [1.849, -26], [1.907, -21], [1.971, -25],
    [2.168, -20], [4.38, -24], [4.52, -24], [4.734, -24], [4.781, -20], [4.85, -24], [4.914, -23], [5.08, -26], [7.18, -24], [7.32, -24], [7.55, -24],
    [7.654, -25], [7.712, -21], [7.77, -24], [7.834, -24], [7.95, -26], [9.78, -24], [10.05, -23], [10.28, -24], [10.55, -24], [10.83, -22]];
  const sounds = [
    { t: 0.2, type: 'bed', dur: 2.9, gain: -28 },
    { t: 3.62, type: 'swell', dur: 0.95, rise: 0.6, gain: -7, low: 60 },
    { t: 4.5, type: 'rain', dur: 8.55, gain: -27, density: 7, dropGain: -30 },
    { t: 7.05, type: 'swell', dur: 0.8, rise: 0.35, gain: -18, low: 80 },
    { t: 9.75, type: 'swell', dur: 0.7, rise: 0.42, gain: -6, low: 65 },
    { t: 10.25, type: 'twinkle', dur: 0.8, density: 9, gain: -20 },
    { t: 0.253, type: 'ping', gain: -7 },
    { t: 1.254, type: 'ping', gain: -7 },
    { t: 4.254, type: 'ping', gain: -12 },
    { t: 7.055, type: 'ping', gain: -10 },
    { t: 9.654, type: 'ping', gain: -8 },
    ...ticks.map(([t, g]) => ({ t: t + 0.02, type: 'tick', gain: g + 17 })),
  ];

  Reel.run({
    id: 'yudabbir', title: 'يدبّر الأمر', width: 720, height: 1280, duration: 13.93, fps: 30, background: C.bg,
    fonts: ['700 40px Amiri', '400 40px Amiri', '400 40px "Amiri Quran"', '400 20px "Patrick Hand"', '400 16px Inter'],
    original: '../../media/yudabbir.m4a',
    setup, sounds,
  });
})();
