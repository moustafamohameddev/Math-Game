/* الصبر — hourglass reel (720×1280, 17.1 s).
 * Timings, positions and colours were measured frame-by-frame from the source video. */
(function () {
  'use strict';
  const { svg, html, kf, prog, ease, clamp, lerp, sketch, smoothPath, drawOn, rng } = R;

  const C = {
    bg: '#fcfcfc', ink: '#2b1d11', title: '#351f00', sub: '#615e58', brand: '#a3a19b',
    hl: '#fade61', sand: '#e5ac15', stream: '#e9b632', plate: '#ede1cd', hatch: '#d9cbb2',
    petal: '#f8d22c', center: '#efa417', leaf: '#a3a679', glow: '250,214,80',
  };

  // ---------- hourglass geometry ----------
  const CX = 360, TOP = 481, NECK = 598, BOT = 703;
  const half = (s) => 5 + 59 * Math.pow(Math.max(0, Math.cos((s * Math.PI) / 2)), 1.3);
  const topW = (y) => half(clamp((y - TOP) / (NECK - TOP)));
  const botW = (y) => half(clamp((BOT - y) / (BOT - NECK)));
  const wallPts = (side) => {
    const pts = [];
    for (let y = TOP; y <= NECK; y += 6) pts.push([CX + side * topW(y), y]);
    for (let y = NECK + 6; y <= BOT; y += 6) pts.push([CX + side * botW(y), y]);
    pts.push([CX + side * botW(BOT), BOT]);
    return pts;
  };

  /** Hand-drawn stroke with 3 "boiling" variants. */
  function boilPath(parent, pts, attrs, seed, opts = {}) {
    const vars = [0, 1, 2].map((k) => sketch(pts, Object.assign({ amp: 1.1, step: 16, seed: seed * 13 + k * 101 }, opts)));
    const p = svg('path', Object.assign({ d: vars[0], fill: 'none', stroke: C.ink, 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1 }, attrs), parent);
    p.__vars = vars;
    return p;
  }
  function boil(p, t) {
    const k = Math.floor(t / 0.24) % 3;
    if (p.__k !== k) { p.setAttribute('d', p.__vars[k]); p.__k = k; }
  }
  function reveal(p, v) {
    p.style.strokeDasharray = '1 1';
    p.style.strokeDashoffset = String(1 - v);
    p.style.visibility = v <= 0.002 ? 'hidden' : 'visible';
  }

  function setup(stage) {
    const root = svg('svg', { width: 720, height: 1280, viewBox: '0 0 720 1280' }, stage);
    const defs = svg('defs', {}, root);
    defs.innerHTML = `
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="rgb(${C.glow})" stop-opacity=".55"/>
        <stop offset=".55" stop-color="rgb(${C.glow})" stop-opacity=".22"/>
        <stop offset="1" stop-color="rgb(${C.glow})" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="rgb(${C.glow})" stop-opacity=".75"/>
        <stop offset=".45" stop-color="rgb(${C.glow})" stop-opacity=".35"/>
        <stop offset="1" stop-color="rgb(${C.glow})" stop-opacity=".12"/>
      </linearGradient>
      <radialGradient id="inner" cx="50%" cy="52%" r="55%">
        <stop offset="0" stop-color="#f9d65e" stop-opacity=".9"/>
        <stop offset=".6" stop-color="#fbe9a6" stop-opacity=".55"/>
        <stop offset="1" stop-color="#fdf3cf" stop-opacity=".35"/>
      </radialGradient>
      <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="7" height="7" fill="${C.plate}"/><line x1="0" y1="0" x2="0" y2="7" stroke="${C.hatch}" stroke-width="1.6"/>
      </pattern>
      <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>`;

    // interior outline polygon of the glass (used for clipping sand / tint)
    const L = wallPts(-1), Rr = wallPts(1);
    const interior = smoothPath([...L, ...Rr.slice().reverse()], true);
    svg('clipPath', { id: 'glassClip' }, defs).appendChild(svg('path', { d: interior }));

    // ---- background light ----
    const beam = svg('polygon', { points: '332,380 388,380 452,722 268,722', fill: 'url(#beam)', opacity: 0 }, root);
    const glow = svg('ellipse', { cx: CX, cy: 592, rx: 178, ry: 178, fill: 'url(#glow)', opacity: 0 }, root);

    // ---- ground ----
    const ground = boilPath(root, [[99, 719], [250, 720], [420, 719], [620, 720]], { 'stroke-width': 2.6 }, 1, { amp: 0.7, step: 40 });

    // ---- hourglass (pulses around its base) ----
    const hg = svg('g', {}, root);
    const tint = svg('path', { d: interior, fill: 'url(#inner)', opacity: 0 }, hg);
    const sandG = svg('g', { 'clip-path': 'url(#glassClip)' }, hg);
    const topSand = svg('path', { fill: C.sand }, sandG);
    const neckSand = svg('rect', { x: CX - 6, y: 589, width: 12, height: 9, fill: C.sand }, sandG);
    const pile = svg('path', { fill: C.sand }, sandG);
    const stream = svg('line', { x1: CX, x2: CX, y1: 597, y2: 700, stroke: C.stream, 'stroke-width': 3, 'stroke-dasharray': '6 4', 'stroke-linecap': 'round' }, hg);
    const reflect = boilPath(hg, [[306, 503], [310, 522], [320, 548]], { stroke: '#c9c4bf', 'stroke-width': 2 }, 7, { amp: 0.3 });

    const plateTopFill = svg('rect', { x: 268, y: 465, width: 183, height: 15, fill: 'url(#hatch)' }, hg);
    const plateBotFill = svg('rect', { x: 268, y: 704, width: 183, height: 16, fill: 'url(#hatch)' }, hg);
    const wallL = boilPath(hg, L, {}, 3, { amp: 0.9, step: 22 });
    const wallR = boilPath(hg, Rr, {}, 4, { amp: 0.9, step: 22 });
    const postL = boilPath(hg, [[278, 481], [277, 590], [278, 703]], {}, 5, { amp: 1.3, step: 18 });
    const postR = boilPath(hg, [[441, 481], [442, 590], [441, 703]], {}, 6, { amp: 1.3, step: 18 });
    const pTopA = boilPath(hg, [[268, 480], [268, 465], [451, 465], [451, 480]], {}, 8, { amp: 0.8 });
    const pTopB = boilPath(hg, [[268, 480], [451, 480]], {}, 9, { amp: 0.8 });
    const pBotA = boilPath(hg, [[268, 720], [268, 704], [451, 704], [451, 720]], {}, 10, { amp: 0.8 });
    const pBotB = boilPath(hg, [[268, 720], [451, 720]], {}, 11, { amp: 0.8 });
    const strokes = [ground, wallL, wallR, postL, postR, pTopA, pTopB, pBotA, pBotB, reflect];

    // ---- sparkles inside the glow ----
    const r = rng(42);
    const sparkG = svg('g', { opacity: 0 }, root);
    const sparks = [];
    for (let i = 0; i < 64; i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 165;
      const star = r() < 0.3;
      const s = star ? 3 + r() * 2.5 : 1.3 + r() * 2.2;
      const node = star
        ? svg('path', { d: `M0,${-s}Q0,0 ${s},0Q0,0 0,${s}Q0,0 ${-s},0Q0,0 0,${-s}Z`, fill: '#e6b030' }, sparkG)
        : svg('circle', { r: s, fill: i % 3 ? '#efbf3c' : '#e3a126' }, sparkG);
      sparks.push({ node, x: CX + Math.cos(a) * d, y: 590 + Math.sin(a) * d * 1.05, ph: r() * 6.28, sp: 0.6 + r() * 1.6, drift: 6 + r() * 14, base: 0.55 + r() * 0.45 });
    }

    // ---- tally marks ----
    const tallyG = svg('g', {}, root);
    function tallyGroup(x0, y0, times, breakAt, seed) {
      const rr = rng(seed);
      const xs = [x0, x0 + 11.5, x0 + 23, x0 + 35];
      const marks = xs.map((x, i) => ({
        p: boilPath(tallyG, [[x + 1, y0], [x, y0 + 22], [x + 1.5, y0 + 44]], { 'stroke-width': 3.2 }, seed + i, { amp: 1, step: 12 }),
        cx: x, cy: y0 + 22, t: times[i],
      }));
      marks.push({ p: boilPath(tallyG, [[x0 - 7, y0 + 36], [x0 + 19, y0 + 22], [x0 + 48, y0 + 8]], { 'stroke-width': 3.2 }, seed + 9, { amp: 1, step: 14 }), cx: x0 + 20, cy: y0 + 22, t: times[4] });
      marks.forEach((m) => { m.rot = (rr() - 0.5) * 50; m.dy = -10 - rr() * 22; m.dx = (rr() - 0.5) * 16; m.delay = rr() * 0.12; });
      return { marks, breakAt };
    }
    const tallies = [
      tallyGroup(143, 577, [2.0, 2.43, 2.85, 3.27, 3.7], 8.7, 100),
      tallyGroup(537, 577, [4.1, 4.53, 4.95, 5.37, 5.79], 8.8, 200),
      tallyGroup(143, 637, [6.2, 6.62, 7.04, 7.46, 7.88], 8.98, 300),
    ];

    // ---- flowers ----
    const flowerG = svg('g', {}, root);
    function flower(x, headY, scale, t0, seed) {
      const g = svg('g', {}, flowerG);
      const stemPts = [[x, 720], [x + 1.5, 700], [x - 0.5, 680], [x, headY + 4]];
      const stem = boilPath(g, stemPts, { 'stroke-width': 2.6 }, seed, { amp: 0.6, step: 10 });
      const leafY = lerp(720, headY, 0.38);
      const leaf = svg('path', { d: `M${x + 1},${leafY} q9,-9 20,-4 q-8,9 -20,4z`, fill: C.leaf, stroke: C.ink, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, g);
      const head = svg('g', {}, g);
      const pr = 6.2 * scale, pd = 8.5 * scale;
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * 360 - 90;
        svg('ellipse', { cx: 0, cy: -pd, rx: pr * 0.85, ry: pr, fill: C.petal, stroke: C.ink, 'stroke-width': 1.7, transform: `rotate(${a + 90})` }, head);
      }
      svg('circle', { r: 4.6 * scale, fill: C.center, stroke: C.ink, 'stroke-width': 1.6 }, head);
      return { g, stem, leaf, head, x, headY, t0 };
    }
    const flowers = [
      flower(170, 659, 1.05, 12.83, 31), flower(220, 669, 0.85, 12.97, 32), flower(500, 666, 0.85, 13.17, 33),
      flower(550, 658, 1.05, 13.37, 34), flower(117, 673, 0.8, 13.57, 35), flower(603, 673, 0.8, 13.7, 36),
    ];

    // ---- text ----
    const titleHl = html('div', { class: 'title-hl' }, stage);
    const title = html('div', { class: 'title', text: 'الصبر', dir: 'rtl' }, stage);
    const sub = Caption.letters({ parent: stage, text: 'Sabr · patience', y: 377, font: '"Patrick Hand"', size: 23, color: C.sub });

    const AR = { font: 'Amiri', weight: 700, color: C.title, hl: [-4, 21], gap: 0.42, hlPadX: 5 };
    const EN = { font: '"Patrick Hand"', color: C.sub, dir: 'ltr', gap: 0.34, hl: [-1, 10], hlPadX: 3 };
    const caps = [
      {
        ar: Caption.line(Object.assign({ parent: stage, y: 846, size: 36, words: ['حين', 'يطول', { w: 'الانتظار...', hl: true }], fit: 259 }, AR)),
        en: Caption.line(Object.assign({ parent: stage, y: 887, size: 21, words: ['When', 'the', { w: 'waiting', hl: true }, 'grows', 'long...'], fit: 277 }, EN)),
        tA: { times: [1.6, 1.72, 1.96], hlTimes: [2.42], hlDur: 0.3, out: 4.4 },
        tE: { times: [1.96, 2.02, 2.18, 2.32, 2.39], hlTimes: [2.62], hlDur: 0.3, out: 4.4 },
      },
      {
        ar: Caption.line(Object.assign({ parent: stage, y: 846, size: 36, words: ['ويراك', { w: 'ترضى', hl: true }, 'وتصبر...'], fit: 260 }, AR)),
        en: Caption.line(Object.assign({ parent: stage, y: 887, size: 21, words: ['and', 'He', 'sees', 'you', { w: 'content', hl: true }, 'and', 'patient...'], fit: 347 }, EN)),
        tA: { times: [4.8, 5.08, 5.32], hlTimes: [5.52], hlDur: 0.3, out: 7.52 },
        tE: { times: [5.16, 5.22, 5.29, 5.36, 5.52, 5.66, 5.72], hlTimes: [5.95], hlDur: 0.3, out: 7.52 },
      },
      {
        ar: Caption.line(Object.assign({ parent: stage, y: 852, size: 36, font: '"Amiri Quran"', weight: 400, color: C.title, hl: [-12, 21], gap: 0.4, hlPadX: 5,
          words: ['﴿', 'إِنَّمَا', 'يُوَفَّى', 'الصَّابِرُونَ', 'أَجْرَهُم', { w: 'بِغَيْرِ', hl: true }, { w: 'حِسَابٍ', hl: true, joinPrev: true }, '﴾'], fit: 473 })),
        en: Caption.line(Object.assign({ parent: stage, y: 909, size: 21, words: ['“Only', 'the', 'patient', 'will', 'be', 'given', 'their', 'reward', { w: 'without', hl: true }, { w: 'measure”', hl: true, joinPrev: true }], fit: 497 }, EN)),
        src: Caption.line({ parent: stage, y: 947, size: 16, font: 'Amiri', color: '#a8a39c', words: ['سورة', 'الزمر', '·', '١٠'], dir: 'rtl', gap: 0.3 }),
        tA: { times: [8.0, 8.16, 8.33, 8.47, 8.63, 8.79, 8.93, 9.08], hlTimes: [9.32, 9.48], hlDur: 0.17, out: 11.9 },
        tE: { times: [8.6, 8.66, 8.73, 8.79, 8.86, 8.92, 8.97, 9.03, 9.1, 9.16], hlTimes: [9.58, 9.74], hlDur: 0.16, out: 11.9 },
        tS: { times: [9.25, 9.29, 9.33, 9.37], out: 11.9 },
      },
      {
        ar: Caption.line(Object.assign({ parent: stage, y: 846, size: 36, words: ['فيُرضيك', { w: 'بما', hl: true }, { w: 'تتمنّى', hl: true, joinPrev: true }], fit: 189 }, AR)),
        en: Caption.line(Object.assign({ parent: stage, y: 887, size: 21, words: ['and', 'He', 'pleases', 'you', 'with', { w: 'what', hl: true }, { w: 'you', hl: true, joinPrev: true }, { w: 'wished', hl: true, joinPrev: true }, { w: 'for', hl: true, joinPrev: true }], fit: 402 }, EN)),
        tA: { times: [12.5, 12.74, 12.8], hlTimes: [13.25, 13.42], hlDur: 0.18 },
        tE: { times: [12.86, 12.93, 13.0, 13.07, 13.13, 13.2, 13.25, 13.3, 13.35], hlTimes: [13.69, 13.79, 13.88, 13.98], hlDur: 0.1 },
      },
    ];

    return {
      render(t) {
        // strokes boil
        strokes.forEach((p) => boil(p, t));
        tallies.forEach((g) => g.marks.forEach((m) => boil(m.p, t)));
        flowers.forEach((f) => boil(f.stem, t));

        // intro drawing
        reveal(ground, ease.inOutCubic(prog(t, 0.2, 0.93)));
        const pt = ease.inOutQuad(prog(t, 0.3, 0.7)), pb = ease.inOutQuad(prog(t, 0.4, 0.87));
        reveal(pTopA, pt); reveal(pTopB, pt); reveal(pBotA, pb); reveal(pBotB, pb);
        const gw = ease.inOutQuad(prog(t, 0.67, 1.2));
        reveal(wallL, gw); reveal(wallR, gw);
        reveal(postL, ease.inOutQuad(prog(t, 0.93, 1.43)));
        reveal(postR, ease.inOutQuad(prog(t, 1.03, 1.53)));
        reveal(reflect, ease.outQuad(prog(t, 1.15, 1.4)));

        // sand
        const sandA = ease.outQuad(prog(t, 1.0, 1.45));
        sandG.setAttribute('opacity', sandA.toFixed(3));
        const ys = kf(t, [[1.0, 503], [1.5, 516], [5, 558], [8.5, 591]]);
        const pts = [];
        for (let y = ys; y <= NECK + 2; y += 3) pts.push([CX - topW(y) + 1, y]);
        const rpts = pts.map(([x, y]) => [2 * CX - x, y]).reverse();
        const dip = 3;
        topSand.setAttribute('d', `M${pts[0][0]},${ys} Q${CX},${ys + dip * 2} ${rpts[rpts.length - 1][0]},${ys} ` +
          rpts.map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + ' ' + pts.slice().reverse().map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + 'Z');
        const frac = clamp((ys - 516) / (591 - 516));
        const Hh = 64 * frac, Rw = 66;
        let d = `M${CX - Rw},${BOT + 2}`;
        for (let i = 0; i <= 40; i++) {
          const dx = -Rw + (2 * Rw * i) / 40;
          const y = BOT + 1 - Hh * Math.pow(Math.max(0, 1 - (dx / Rw) ** 2), 0.9);
          d += ` L${(CX + dx).toFixed(1)},${y.toFixed(1)}`;
        }
        pile.setAttribute('d', d + 'Z');
        const apex = BOT + 1 - Hh;
        stream.setAttribute('y2', String(Math.max(600, apex)));
        stream.style.strokeDashoffset = String(-t * 55);
        stream.setAttribute('opacity', (lerp(0.55, 1, sandA) * (1 - prog(t, 8.6, 8.8))).toFixed(3));

        // light
        const beamA = ease.inOutQuad(prog(t, 5.2, 5.6)) * (1 - ease.inQuad(prog(t, 8.6, 8.85)));
        const breathe = 0.85 + 0.15 * Math.sin((t - 5.6) * 1.6);
        beam.setAttribute('opacity', (beamA * breathe * 0.5).toFixed(3));
        const glowA = ease.inOutQuad(prog(t, 8.85, 9.6)) * (0.82 + 0.18 * Math.sin(t * 1.4));
        glow.setAttribute('opacity', glowA.toFixed(3));
        tint.setAttribute('opacity', Math.max(beamA * 0.75, glowA * 0.95).toFixed(3));
        sparkG.setAttribute('opacity', ease.outQuad(prog(t, 8.85, 9.6)).toFixed(3));
        if (t > 8.8) sparks.forEach((s) => {
          const tw = 0.5 + 0.5 * Math.sin(t * s.sp * 3 + s.ph);
          s.node.setAttribute('transform', `translate(${s.x.toFixed(1)},${(s.y - ((t - 8.8) * s.drift) % 40).toFixed(1)})`);
          s.node.setAttribute('opacity', (s.base * (0.35 + 0.65 * tw)).toFixed(3));
        });

        // pulse
        const sc = 1 + 0.04 * (ease.outCubic(prog(t, 8.6, 8.78)) - ease.inOutSine(prog(t, 9.13, 9.47)));
        hg.setAttribute('transform', `translate(${CX},722) scale(${sc.toFixed(4)}) translate(${-CX},-722)`);

        // tallies
        tallies.forEach((g) => g.marks.forEach((m) => {
          reveal(m.p, ease.outQuad(prog(t, m.t, m.t + 0.08)));
          const bl = prog(t, g.breakAt + m.delay, g.breakAt + m.delay + 0.36);
          const b = ease.outQuad(bl);
          if (bl > 0) {
            m.p.setAttribute('transform', `translate(${(m.dx * b).toFixed(2)},${(m.dy * b).toFixed(2)}) rotate(${(m.rot * b).toFixed(2)} ${m.cx} ${m.cy})`);
            m.p.style.opacity = (1 - bl).toFixed(3);
          } else { m.p.removeAttribute('transform'); m.p.style.opacity = '1'; }
        }));

        // flowers
        flowers.forEach((f) => {
          const s = ease.outQuad(prog(t, f.t0, f.t0 + 0.5));
          reveal(f.stem, s);
          f.leaf.style.opacity = prog(t, f.t0 + 0.2, f.t0 + 0.3).toFixed(3);
          const hp = prog(t, f.t0 + 0.52, f.t0 + 0.74);
          const hs = hp <= 0 ? 0 : ease.outBack(hp);
          f.head.setAttribute('transform', `translate(${f.x},${f.headY}) scale(${hs.toFixed(3)})`);
          f.head.style.display = hp <= 0 ? 'none' : '';
        });

        // title block
        const ta = ease.outQuad(prog(t, 0.36, 0.62));
        title.style.opacity = ta.toFixed(3);
        title.style.filter = ta < 1 ? `blur(${(6 * (1 - ta)).toFixed(2)}px)` : 'none';
        title.style.transform = `translate(-50%,-50%) translateY(${(4 * (1 - ta)).toFixed(2)}px)`;
        titleHl.style.transform = `scaleX(${ease.inOutQuad(prog(t, 0.67, 1.0)).toFixed(3)})`;
        sub.render(t, { start: 0.75, span: 0.16, dur: 0.06 });

        // captions
        caps.forEach((c) => {
          c.ar.render(t, c.tA);
          c.en.render(t, c.tE);
          if (c.src) c.src.render(t, c.tS);
        });
      },
    };
  }

  // ---------- sound design (onsets measured from the original track) ----------
  const ticks = [
    [0.33, -31], [0.49, -34], [0.69, -29], [0.86, -36], [1.07, -41], [1.25, -30], [1.37, -34],
    [1.76, -24], [1.89, -22], [2.02, -21], [2.12, -25], [2.19, -28], [2.26, -26], [2.33, -28],
    [4.96, -22], [5.09, -20], [5.18, -25], [5.39, -26], [5.46, -25], [5.53, -22], [5.6, -26], [5.74, -27],
    [8.18, -22], [8.33, -24], [8.48, -26], [8.64, -26], [8.8, -27], [8.94, -27], [9.09, -28],
    [12.68, -22], [12.81, -31], [12.95, -24], [13.0, -28], [13.09, -23], [13.15, -28], [13.29, -26], [13.35, -28],
    [13.48, -36, 4700], [13.53, -31], [13.66, -38, 4500], [13.71, -31], [13.84, -36, 4400], [14.01, -36, 4500], [14.2, -38, 4400],
  ];
  const sounds = [
    { t: 0.2, type: 'bed', dur: 8.2, gain: -35 },
    { t: 9.0, type: 'bed', dur: 1.35, gain: -41 },
    { t: 12.5, type: 'bed', dur: 1.9, gain: -52 },
    { t: 0.25, type: 'scribble', dur: 1.3, gain: -16 },
    { t: 0.203, type: 'ping', gain: -7 },
    { t: 1.602, type: 'ping', gain: -6 },
    { t: 4.804, type: 'ping', gain: -6 },
    { t: 8.004, type: 'ping', gain: -6 },
    { t: 12.502, type: 'ping', gain: -6 },
    ...[2.0, 2.43, 2.85, 3.27, 3.7, 4.1, 4.53, 4.95, 5.37, 5.79, 6.2, 6.62, 7.04, 7.46, 7.88].map((t) => ({ t, type: 'scribble', dur: 0.1, gain: -28, freq: 3600 })),
    { t: 8.3, type: 'swell', dur: 0.68, rise: 0.52, gain: -6, low: 65 },
    { t: 8.95, type: 'twinkle', dur: 1.4, density: 11, gain: -12 },
    ...ticks.map(([t, g, f]) => ({ t, type: 'tick', gain: g + 17, freq: f })),
  ];

  Reel.run({
    id: 'sabr', title: 'الصبر', width: 720, height: 1280, duration: 17.13, fps: 30, background: C.bg,
    fonts: ['700 40px Amiri', '400 40px "Amiri Quran"', '400 20px "Patrick Hand"', '400 16px Inter'],
    original: '../../media/sabr.m4a',
    setup, sounds,
  });
})();
