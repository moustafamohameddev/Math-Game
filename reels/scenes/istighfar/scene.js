/* الاستغفار — rain revives a flower, a shield, a staircase, and an orbit (720×1280, 13.0 s).
 * Timings, positions and colours measured frame-by-frame from the source video. */
(function () {
  'use strict';
  const { svg, html, kf, prog, ease, clamp, lerp, sketch, rng } = R;

  const C = {
    bg: '#060f1f', yellow: '#fcd525', cream: '#f8f9f3', sub: '#8c96ac', en: '#8991a6', brand: '#757e92',
    line: '#9aa3ab', cloudFill: '#18233b', cloud: '#6b7690', rain: '#8a9ab5', gray: '#8a93a8', leaf: '#8fa582',
    rockFill: '#111b30', rock: '#8792ac', stairFill: '#16213a', stairHatch: '#26344f', stairLine: '#e6e2d8',
  };
  const GLOW = '0 0 10px rgba(252,213,37,.55)';
  const DOT = { x: 360, y: 703 };

  function setup(stage) {
    const root = svg('svg', { width: 720, height: 1280, viewBox: '0 0 720 1280' }, stage);
    const defs = svg('defs', {}, root);
    defs.innerHTML = `
      <radialGradient id="halo"><stop offset=".35" stop-color="#fcd525" stop-opacity=".55"/><stop offset="1" stop-color="#fcd525" stop-opacity="0"/></radialGradient>
      <radialGradient id="orbGlow"><stop offset="0" stop-color="#d8b52a" stop-opacity=".62"/><stop offset=".55" stop-color="#8a7420" stop-opacity=".32"/><stop offset="1" stop-color="#3a3414" stop-opacity="0"/></radialGradient>
      <pattern id="hatch4" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
        <rect width="11" height="11" fill="${C.stairFill}"/><line x1="0" y1="0" x2="0" y2="11" stroke="${C.stairHatch}" stroke-width="1.6"/></pattern>
      <filter id="soft4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
    const r = rng(11);

    // ---------------- ground ----------------
    const groundD = sketch([[80, 720], [250, 721], [460, 719], [640, 720]], { amp: 0.8, step: 30, seed: 3 });
    const ground = svg('path', { d: groundD, fill: 'none', stroke: C.line, 'stroke-width': 2.4, 'stroke-linecap': 'round', pathLength: 1 }, root);

    // ---------------- orbit (final) ----------------
    const orbit = svg('g', { opacity: 0 }, root);
    svg('circle', { cx: 360, cy: 600, r: 132, fill: 'url(#orbGlow)' }, orbit);
    svg('circle', { cx: 360, cy: 600, r: 113, fill: 'none', stroke: '#8e8a6a', 'stroke-width': 1.4, 'stroke-dasharray': '3 5' }, orbit);
    const sparks = [];
    for (let i = 0; i < 16; i++) sparks.push(svg('circle', { r: 2, fill: C.yellow, opacity: 0 }, root));

    // ---------------- cloud + rain ----------------
    const cloud = svg('path', { d: 'M402,542 Q382,542 383,524 Q384,508 402,507 Q404,484 428,485 Q440,466 462,470 Q478,452 500,462 Q518,470 516,490 Q536,494 535,516 Q534,542 512,542Z', fill: C.cloudFill, stroke: C.cloud, 'stroke-width': 3, 'stroke-linejoin': 'round', opacity: 0 }, root);
    const rainG = svg('g', { stroke: C.rain, 'stroke-width': 2.2, 'stroke-linecap': 'round', opacity: 0 }, root);
    const drops = [];
    for (let i = 0; i < 26; i++) drops.push({ n: svg('line', { x1: 0, y1: 0, x2: -3, y2: 14 }, rainG), x: 392 + r() * 140, y0: r(), sp: 0.9 + r() * 0.25 });

    // ---------------- flower (wilted → revived) ----------------
    const flower = svg('g', { opacity: 0 }, root);
    const stem = svg('path', { fill: 'none', stroke: C.cream, 'stroke-width': 3, 'stroke-linecap': 'round' }, flower);
    const leafA = svg('path', { d: 'M0,0 Q14,-12 30,-4 Q16,8 0,0Z', 'stroke-width': 2, 'stroke-linejoin': 'round' }, flower);
    const leafB = svg('path', { d: 'M0,0 Q14,-12 30,-4 Q16,8 0,0Z', 'stroke-width': 2, 'stroke-linejoin': 'round' }, flower);
    const head = svg('g', {}, flower);
    const petals = [];
    for (let k = 0; k < 6; k++) petals.push(svg('ellipse', { 'stroke-width': 2 }, head));
    const hc = svg('circle', { 'stroke-width': 2 }, head);
    const headHalo = svg('circle', { r: 30, fill: 'url(#halo)', opacity: 0 }, flower);
    flower.insertBefore(headHalo, head);

    // ---------------- shield ring + rocks ----------------
    const ring = svg('circle', { cx: 360, cy: 693, r: 75, fill: 'rgba(252,213,37,.07)', stroke: C.yellow, 'stroke-width': 3.2, opacity: 0, filter: 'url(#soft4)' }, root);
    const rocks = [];
    for (let i = 0; i < 13; i++) {
      const g = svg('g', { opacity: 0 }, root);
      const n = 6, rad = 17 + r() * 6, pts = [];
      for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2 + r() * 0.3; const rr = rad * (0.85 + r() * 0.25); pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
      svg('path', { d: R.smoothPath(pts, true), fill: C.rockFill, stroke: C.rock, 'stroke-width': 2.4 }, g);
      svg('path', { d: `M0,0 L${-rad * 0.45},${-rad * 0.2} M0,0 L${rad * 0.4},${-rad * 0.3} M0,0 L${rad * 0.05},${rad * 0.5}`, stroke: C.rock, 'stroke-width': 1.8, fill: 'none', 'stroke-linecap': 'round' }, g);
      const trail = svg('path', { d: `M${-rad - 6},-6 h-12 M${-rad - 4},2 h-16 M${-rad - 7},9 h-9`, stroke: C.rock, 'stroke-width': 2, 'stroke-linecap': 'round', opacity: 0.8 }, g);
      rocks.push({ g, trail, t0: 4.28 + i * 0.06 + r() * 0.04, r0: 120 + r() * 40, r1: 215 + r() * 70, spin: (r() - 0.5) * 60, fadeAt: 5.15 + r() * 0.35 });
    }

    // ---------------- stairs ----------------
    const stairs = svg('g', { opacity: 0 }, root);
    const stairPts = [[279, 720], [279, 687], [321, 687], [321, 653], [362, 653], [362, 620], [404, 620], [404, 586], [445, 586], [445, 554], [486, 554], [486, 720]];
    const stairFill = svg('path', { d: 'M' + stairPts.map((p) => p.join(',')).join(' L') + 'Z', fill: 'url(#hatch4)', opacity: 0 }, stairs);
    const stairLine = svg('path', { d: sketch(stairPts, { amp: 0.6, step: 20, seed: 5 }), fill: 'none', stroke: C.stairLine, 'stroke-width': 3.2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', pathLength: 1 }, stairs);
    const trail = svg('path', { d: 'M' + stairPts.slice(1, 11).map((p) => p.join(',')).join(' L'), fill: 'none', stroke: C.yellow, 'stroke-width': 3.6, 'stroke-linejoin': 'round', pathLength: 1 }, stairs);
    const levels = [702, 671, 637, 604, 570, 538];

    // ---------------- dot ----------------
    const dotHalo = svg('circle', { r: 46, fill: 'url(#halo)', opacity: 0 }, root);
    const dot = svg('circle', { r: 15, fill: C.yellow, stroke: '#fff3c0', 'stroke-width': 2.4, filter: 'url(#soft4)' }, root);

    // ---------------- orbit icons ----------------
    const icon = (build) => { const g = svg('g', { opacity: 0 }, root); build(g); return g; };
    const iStairs = icon((g) => svg('path', { d: 'M-21,14 V6 H-8 V-3 H5 V-13 H21 V14Z', fill: C.yellow, stroke: '#fff3c0', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g));
    const iFlower = icon((g) => {
      for (let k = 0; k < 5; k++) svg('ellipse', { cx: 0, cy: -9.5, rx: 7, ry: 9.5, fill: C.yellow, stroke: '#fff3c0', 'stroke-width': 1.2, transform: `rotate(${k * 72})` }, g);
      svg('circle', { r: 5.5, fill: '#fff6cf' }, g);
    });
    const iShield = icon((g) => svg('path', { d: 'M0,-19 C7,-14 13,-13 19,-13 C19,4 11,14 0,20 C-11,14 -19,4 -19,-13 C-13,-13 -7,-14 0,-19Z', fill: C.yellow, stroke: '#fff3c0', 'stroke-width': 1.5 }, g));
    const icons = [{ g: iFlower, a: -71, t0: 9.6 }, { g: iShield, a: 49, t0: 9.8 }, { g: iStairs, a: 168, t0: 9.95 }];

    // ---------------- text ----------------
    const title = Caption.line({ parent: stage, y: 312, size: 52, font: 'Amiri', weight: 700, color: C.yellow, fit: 182, words: [{ w: 'الاستغفار', glow: '0 0 14px rgba(252,213,37,.5)' }] });
    const sub = Caption.letters({ parent: stage, text: 'Istighfar · seeking forgiveness', y: 367, font: '"Patrick Hand"', size: 20.5, color: C.sub });
    const AR = { font: 'Amiri', weight: 700, color: C.cream, gap: 0.42 };
    const EN = { font: '"Patrick Hand"', color: C.en, dir: 'ltr', gap: 0.34 };
    const Y = (w) => ({ w, color: C.yellow, glow: GLOW });
    const part = (w, yel, rest) => ({ w, html: `<span style="color:${C.yellow};text-shadow:${GLOW}">${yel}</span>${rest}` });
    const partPre = (w, pre, yel, rest) => ({ w, html: `${pre}<span style="color:${C.yellow};text-shadow:${GLOW}">${yel}</span>${rest}` });
    const caps = [
      { ar: Caption.line(Object.assign({ parent: stage, y: 842, size: 34, fit: 228, words: ['الاستغفار', part('ينفع...', 'ينفع', '...')] }, AR)),
        en: Caption.line(Object.assign({ parent: stage, y: 888, size: 20, fit: 178, words: ['Istighfar', Y('benefits'), 'you...'] }, EN)),
        tA: { times: [1.25, 1.52], out: 3.55, outDur: 0.14 }, tE: { times: [1.55, 1.72, 1.85], out: 3.55, outDur: 0.14 } },
      { ar: Caption.line(Object.assign({ parent: stage, y: 842, size: 34, fit: 107, words: [partPre('ويدفع...', 'و', 'يدفع', '...')] }, AR)),
        en: Caption.line(Object.assign({ parent: stage, y: 888, size: 20, fit: 201, words: ['it', Y('shields'), 'you', 'from', 'harm...'] }, EN)),
        tA: { times: [4.07], out: 6.05, outDur: 0.14 }, tE: { times: [4.32, 4.42, 4.52, 4.6, 4.68], out: 6.05, outDur: 0.14 } },
      { ar: Caption.line(Object.assign({ parent: stage, y: 842, size: 34, fit: 99, words: [partPre('ويرفع...', 'و', 'يرفع', '...')] }, AR)),
        en: Caption.line(Object.assign({ parent: stage, y: 888, size: 20, fit: 159, words: ['it', Y('raises'), 'you', 'higher...'] }, EN)),
        tA: { times: [6.58], out: 8.82, outDur: 0.12 }, tE: { times: [6.82, 6.92, 7.02, 7.12], out: 8.82, outDur: 0.12 } },
      { ar: Caption.line(Object.assign({ parent: stage, y: 842, size: 34, fit: 366, words: ['أستغفر', Y('الله'), 'العظيم', 'وأتوب', 'إليه'] }, AR)),
        en: Caption.line(Object.assign({ parent: stage, y: 888, size: 20, fit: 501, words: ['I', 'seek', 'forgiveness', 'from', { w: 'Allah,', html: `<span style="color:${C.yellow}">Allah</span>,` }, 'the', 'Almighty,', 'and', 'I', 'repent', 'to', 'Him'] }, EN)),
        tA: { times: [9.35, 9.62, 9.92, 10.05, 10.18] }, tE: { times: [9.75, 9.78, 9.82, 9.88, 9.98, 10.12, 10.18, 10.25, 10.35, 10.38, 10.42, 10.48] } },
    ];

    function setFlower(p, t) {
      // p: 0 = wilted (grey, drooping) → 1 = revived (yellow, upright)
      const hx = lerp(470, 437, p), hy = lerp(666, 610, p);
      const c1x = lerp(436, 434, p), c1y = lerp(690, 680, p), c2x = lerp(448, 437, p), c2y = lerp(662, 640, p);
      stem.setAttribute('d', `M433,720 C${c1x},${c1y} ${c2x},${c2y} ${hx},${hy}`);
      const pr = lerp(6.5, 9.5, p), pd = lerp(8, 13, p);
      const pf = p < 0.5 ? C.bg : C.yellow, ps = p < 0.5 ? C.gray : '#fff3c0';
      const mix = ease.inOutQuad(clamp((p - 0.35) / 0.4));
      petals.forEach((e, k) => {
        const a = (k / 6) * 360 + lerp(20, 0, p);
        e.setAttribute('cx', 0); e.setAttribute('cy', -pd); e.setAttribute('rx', pr * 0.8); e.setAttribute('ry', pr);
        e.setAttribute('transform', `rotate(${a})`);
        e.setAttribute('fill', mix > 0.5 ? C.yellow : '#1a2238'); e.setAttribute('stroke', mix > 0.5 ? '#fff3c0' : C.gray);
        e.style.opacity = '1';
      });
      hc.setAttribute('r', lerp(5, 8, p)); hc.setAttribute('fill', mix > 0.5 ? '#f6f1e2' : '#1a2238'); hc.setAttribute('stroke', mix > 0.5 ? '#fff3c0' : C.gray);
      head.setAttribute('transform', `translate(${hx},${hy}) rotate(${lerp(35, 0, p)}) scale(${lerp(0.95, 1, p)})`);
      headHalo.setAttribute('cx', hx); headHalo.setAttribute('cy', hy); headHalo.setAttribute('opacity', (mix * 0.8).toFixed(3));
      const lf = mix > 0.5 ? C.leaf : '#3a4256', ls = mix > 0.5 ? '#e8ecdf' : C.gray;
      leafA.setAttribute('fill', lf); leafA.setAttribute('stroke', ls);
      leafB.setAttribute('fill', lf); leafB.setAttribute('stroke', ls);
      leafA.setAttribute('transform', `translate(${lerp(438, 435, p)},${lerp(684, 668, p)}) rotate(${lerp(150, 200, p)}) scale(${lerp(0.75, 1, p)})`);
      leafB.setAttribute('transform', `translate(${lerp(434, 435, p)},${lerp(700, 690, p)}) rotate(${lerp(30, -20, p)}) scale(${lerp(0.75, 1, p)})`);
      stem.setAttribute('stroke', mix > 0.5 ? '#eef0e8' : C.gray);
    }

    return {
      render(t) {
        // ground
        const gp = ease.inOutQuad(prog(t, 0.3, 0.82));
        ground.style.strokeDasharray = '1 1'; ground.style.strokeDashoffset = String(1 - gp);

        // cloud, rain, flower
        cloud.setAttribute('opacity', (ease.outQuad(prog(t, 0.95, 1.2)) * (1 - ease.inQuad(prog(t, 3.0, 3.35)))).toFixed(3));
        const rainA = ease.outQuad(prog(t, 1.35, 1.55)) * (1 - prog(t, 2.75, 2.95));
        rainG.setAttribute('opacity', rainA.toFixed(3));
        if (rainA > 0) drops.forEach((d) => {
          const y = 548 + (((d.y0 + (t - 1.35) * 1.35 * d.sp) % 1) * 170);
          d.n.setAttribute('transform', `translate(${(d.x - (y - 548) * 0.22).toFixed(1)},${y.toFixed(1)})`);
        });
        flower.setAttribute('opacity', (ease.outQuad(prog(t, 0.95, 1.18)) * (1 - ease.inQuad(prog(t, 3.68, 3.95)))).toFixed(3));
        if (t > 0.9 && t < 4) setFlower(ease.inOutCubic(prog(t, 2.35, 2.8)), t);

        // dot path
        let dx = DOT.x, dy = DOT.y;
        if (t >= 6.38) dx = lerp(360, 259, ease.inOutQuad(prog(t, 6.38, 6.62)));
        if (t >= 6.95) {
          const x = lerp(259, 465, clamp((t - 6.95) / (8.5 - 6.95)));
          const f = (x - 259) / 41.2, k = Math.min(4, Math.floor(f)), fr = Math.min(1, f - k);
          dx = x;
          dy = lerp(levels[k], levels[k + 1], ease.inOutQuad(fr)) - 13 * Math.sin(Math.PI * fr);
          if (t >= 8.5) dy = levels[5];
        }
        if (t >= 8.9) { const q = ease.inOutCubic(prog(t, 8.9, 9.4)); dx = lerp(465, 360, q); dy = lerp(538, 599, q); }
        const ds = ease.outBack(prog(t, 0.55, 0.85));
        dot.setAttribute('transform', `translate(${dx.toFixed(2)},${dy.toFixed(2)}) scale(${ds.toFixed(3)})`);
        dot.style.display = ds <= 0 ? 'none' : '';
        const halo = Math.max(ease.outQuad(prog(t, 8.45, 8.75)) * (1 - prog(t, 9.0, 9.3)), 0);
        dotHalo.setAttribute('transform', `translate(${dx.toFixed(2)},${dy.toFixed(2)})`);
        dotHalo.setAttribute('opacity', halo.toFixed(3));

        // shield ring + rocks
        const rg = ease.outBack(prog(t, 4.15, 4.38));
        ring.setAttribute('r', (75 * Math.max(0, rg)).toFixed(2));
        ring.setAttribute('opacity', (prog(t, 4.15, 4.2) * (1 - ease.inQuad(prog(t, 6.28, 6.5)))).toFixed(3));
        rocks.forEach((k) => {
          // rocks swirl counter-clockwise around the shield: enter at the right,
          // fly over the top, come down on the left, then slow down and fade
          const tau = Math.max(0, t - k.t0);
          const fade = 1 - ease.inQuad(prog(t, k.fadeAt, k.fadeAt + 0.45));
          const vis = t > k.t0 ? fade * prog(t, k.t0, k.t0 + 0.06) : 0;
          k.g.setAttribute('opacity', vis.toFixed(3));
          if (vis <= 0) return;
          const deg = -10 - 230 * Math.min(tau, 0.8) - 70 * clamp(tau - 0.8, 0, 1.2) * (1 - 0.4 * clamp(tau - 0.8, 0, 1.2));
          const a = (deg * Math.PI) / 180;
          const rad = lerp(k.r0, k.r1, ease.outQuad(clamp(tau / 0.5)));
          const x = 360 + Math.cos(a) * rad, y = 690 + Math.sin(a) * rad;
          k.g.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(deg - 90 + k.spin).toFixed(1)})`);
          k.trail.setAttribute('opacity', (0.8 * (1 - clamp(tau / 1.1))).toFixed(3));
        });

        // stairs
        const sa = prog(t, 6.55, 6.6) * (1 - ease.inQuad(prog(t, 8.82, 9.0)));
        stairs.setAttribute('opacity', sa.toFixed(3));
        const sl = ease.inOutQuad(prog(t, 6.55, 6.88));
        stairLine.style.strokeDasharray = '1 1'; stairLine.style.strokeDashoffset = String(1 - sl);
        stairFill.setAttribute('opacity', ease.outQuad(prog(t, 6.7, 6.95)).toFixed(3));
        const tp = t < 6.95 ? 0 : clamp((dx - 279) / (486 - 279)) * 1.02;
        trail.style.strokeDasharray = '1 1'; trail.style.strokeDashoffset = String(1 - clamp(tp));
        trail.style.visibility = tp > 0 ? 'visible' : 'hidden';

        // orbit
        const oa = ease.outQuad(prog(t, 9.35, 9.65));
        orbit.setAttribute('opacity', (oa * (0.9 + 0.1 * Math.sin(t * 1.6))).toFixed(3));
        sparks.forEach((s, i) => {
          const p = prog(t, 9.62, 10.05);
          const a = (i / sparks.length) * Math.PI * 2 + t * 0.6;
          const rr = lerp(30, 70, ease.outQuad(p));
          s.setAttribute('cx', (360 + Math.cos(a) * rr).toFixed(1)); s.setAttribute('cy', (600 + Math.sin(a) * rr).toFixed(1));
          s.setAttribute('opacity', (p > 0 && p < 1 ? Math.sin(Math.PI * p) * 0.8 : 0).toFixed(3));
        });
        icons.forEach((ic) => {
          const s = ease.outBack(prog(t, ic.t0, ic.t0 + 0.22));
          const ang = ((ic.a + 26 * (t - 10)) * Math.PI) / 180;
          ic.g.setAttribute('opacity', prog(t, ic.t0, ic.t0 + 0.08).toFixed(3));
          ic.g.setAttribute('transform', `translate(${(360 + Math.cos(ang) * 113).toFixed(1)},${(600 + Math.sin(ang) * 113).toFixed(1)}) scale(${Math.max(0, s).toFixed(3)})`);
        });

        // text
        title.render(t, { times: [0.36], dur: 0.3 });
        sub.render(t, { start: 0.75, span: 0.22, dur: 0.06 });
        caps.forEach((c) => { c.ar.render(t, c.tA); c.en.render(t, c.tE); });
      },
    };
  }

  const ticks = [[0.421, -35], [0.59, -31], [0.775, -29], [0.903, -31], [1.542, -21], [1.611, -25], [1.669, -25], [1.85, -26],
    [4.32, -26], [4.42, -26], [4.52, -27], [4.6, -27], [4.68, -27], [6.82, -26], [6.92, -25], [7.02, -27], [7.12, -27],
    [9.62, -24], [9.889, -25], [10.005, -26], [10.057, -23], [10.127, -25], [10.185, -22], [10.249, -23], [10.307, -24], [10.365, -26]];
  const sounds = [
    { t: 0.3, type: 'scribble', dur: 0.75, gain: -22 },
    { t: 0.254, type: 'ping', gain: -8 },
    { t: 1.252, type: 'ping', gain: -6 },
    { t: 3.953, type: 'ping', gain: -7 },
    { t: 6.452, type: 'ping', gain: -6 },
    { t: 9.353, type: 'ping', gain: -8 },
    { t: 1.45, type: 'rain', dur: 1.45, gain: -23, density: 10, dropGain: -26 },
    { t: 2.52, type: 'swell', dur: 0.4, rise: 0.22, gain: -10, low: 90 },
    { t: 4.12, type: 'whoosh', dur: 0.42, rise: 0.2, gain: -8 },
    { t: 4.75, type: 'rain', dur: 0.9, gain: -26, density: 22, dropGain: -18, low: 1500 },
    { t: 6.4, type: 'whoosh', dur: 0.3, rise: 0.12, gain: -16 },
    ...[6.8, 7.2, 7.52, 7.86, 8.18].map((t) => ({ t, type: 'scribble', dur: 0.16, gain: -20, freq: 3000 })),
    { t: 8.45, type: 'swell', dur: 0.7, rise: 0.45, gain: -12, low: 70 },
    { t: 9.38, type: 'swell', dur: 0.7, rise: 0.3, gain: -11, low: 80 },
    { t: 9.62, type: 'twinkle', dur: 0.5, density: 14, gain: -20 },
    ...ticks.map(([t, g]) => ({ t: t + 0.02, type: 'tick', gain: g + 17 })),
  ];

  Reel.run({
    id: 'istighfar', title: 'الاستغفار', width: 720, height: 1280, duration: 13.02, fps: 30, background: C.bg,
    fonts: ['700 40px Amiri', '400 20px "Patrick Hand"', '400 16px Inter'],
    original: '../../media/istighfar.m4a',
    setup, sounds,
  });
})();
