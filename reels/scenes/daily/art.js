/* Illustration library for the daily reels.
 * Every prop is hand-drawn line art in the style of the original reels and lives
 * in the art area of a 720×1280 frame (centre x = 360, ground line y = 720).
 *   const art = Art.make(name, group, theme)   ->  art.render(local, t)
 * `local` = seconds since the prop appeared (it draws itself in during the first
 * second, then idles); `t` = absolute scene time (for boiling / looping motion).
 * Art.sfx(name, t0, dur) returns the sound events that belong to the prop. */
(function (global) {
  'use strict';
  const { svg, prog, ease, clamp, lerp, sketch, smoothPath, rng } = R;
  let uid = 0;

  // ---------- helpers ----------
  function stroke(g, pts, th, attrs = {}, seed = 1, opts = {}) {
    const vars = [0, 1, 2].map((k) => sketch(pts, Object.assign({ amp: 1.0, step: 16, seed: seed * 13 + k * 101 }, opts)));
    const p = svg('path', Object.assign({ d: vars[0], fill: 'none', stroke: th.ink, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1 }, attrs), g);
    p.__vars = vars;
    return p;
  }
  function boil(p, t) {
    if (!p.__vars) return;
    const k = Math.floor(t / 0.24) % 3;
    if (p.__k !== k) { p.setAttribute('d', p.__vars[k]); p.__k = k; }
  }
  function reveal(p, v) {
    p.style.strokeDasharray = '1 1';
    p.style.strokeDashoffset = String(1 - clamp(v));
    p.style.visibility = v <= 0.002 ? 'hidden' : 'visible';
  }
  function pop(node, v, cx, cy) {
    const s = v <= 0 ? 0 : ease.outBack(clamp(v));
    node.setAttribute('transform', `translate(${cx},${cy}) scale(${s.toFixed(3)}) translate(${-cx},${-cy})`);
    node.style.display = v <= 0 ? 'none' : '';
  }
  function groundLine(g, th, seed = 2, x0 = 110, x1 = 610) {
    return stroke(g, [[x0, 720], [(x0 * 2 + x1) / 3, 721], [(x0 + x1 * 2) / 3, 719], [x1, 720]], th, { 'stroke-width': 2.6 }, seed, { amp: 0.7, step: 40 });
  }
  function glowDot(g, th, r = 13) {
    const d = svg('g', {}, g);
    svg('circle', { r: r * 2.6, fill: th.accent, opacity: 0.18, style: 'filter:blur(9px)' }, d);
    svg('circle', { r, fill: th.accent, stroke: th.dotRing, 'stroke-width': 2.4 }, d);
    return d;
  }
  const cloudD = (cx, cy, w, h) => {
    const x0 = cx - w / 2, x1 = cx + w / 2, b = cy + h / 2;
    return `M${x0 + h * 0.3},${b} Q${x0 - h * 0.05},${b} ${x0},${b - h * 0.32} Q${x0 + h * 0.05},${cy - h * 0.12} ${x0 + w * 0.2},${cy - h * 0.08}
      Q${x0 + w * 0.26},${cy - h * 0.58} ${x0 + w * 0.43},${cy - h * 0.4} Q${x0 + w * 0.56},${cy - h * 0.75} ${x0 + w * 0.7},${cy - h * 0.3}
      Q${x1 + h * 0.05},${cy - h * 0.35} ${x1},${b - h * 0.25} Q${x1},${b} ${x1 - h * 0.3},${b} Z`;
  };
  const star4 = (s) => `M0,${-s}Q0,0 ${s},0Q0,0 0,${s}Q0,0 ${-s},0Q0,0 0,${-s}Z`;

  const P = {};

  // ---------- hourglass: sand runs down ----------
  P.hourglass = (g, th) => {
    const CX = 360, TOP = 481, NECK = 598, BOT = 703;
    const half = (s) => 5 + 59 * Math.pow(Math.max(0, Math.cos((s * Math.PI) / 2)), 1.3);
    const topW = (y) => half(clamp((y - TOP) / (NECK - TOP))), botW = (y) => half(clamp((BOT - y) / (BOT - NECK)));
    const wall = (side) => { const pts = []; for (let y = TOP; y <= NECK; y += 6) pts.push([CX + side * topW(y), y]); for (let y = NECK + 6; y <= BOT; y += 6) pts.push([CX + side * botW(y), y]); pts.push([CX + side * botW(BOT), BOT]); return pts; };
    const L = wall(-1), Rr = wall(1), id = 'hgclip' + uid++;
    svg('clipPath', { id }, g).appendChild(svg('path', { d: smoothPath([...L, ...Rr.slice().reverse()], true) }));
    const ground = groundLine(g, th, 3);
    const sand = svg('g', { 'clip-path': `url(#${id})` }, g);
    const top = svg('path', { fill: th.sand }, sand), pile = svg('path', { fill: th.sand }, sand);
    svg('rect', { x: CX - 6, y: 589, width: 12, height: 9, fill: th.sand }, sand);
    const stream = svg('line', { x1: CX, x2: CX, y1: 597, y2: 700, stroke: th.sand, 'stroke-width': 3, 'stroke-dasharray': '6 4', 'stroke-linecap': 'round' }, g);
    svg('rect', { x: 268, y: 465, width: 183, height: 15, fill: th.soft }, g);
    svg('rect', { x: 268, y: 704, width: 183, height: 16, fill: th.soft }, g);
    const parts = [stroke(g, L, th, {}, 4, { step: 22 }), stroke(g, Rr, th, {}, 5, { step: 22 }),
      stroke(g, [[278, 481], [277, 590], [278, 703]], th, {}, 6), stroke(g, [[441, 481], [442, 590], [441, 703]], th, {}, 7),
      stroke(g, [[268, 480], [268, 465], [451, 465], [451, 480], [268, 480]], th, {}, 8, { amp: 0.6 }),
      stroke(g, [[268, 720], [268, 704], [451, 704], [451, 720]], th, {}, 9, { amp: 0.6 })];
    return {
      render(l, t) {
        [ground, ...parts].forEach((p) => boil(p, t));
        reveal(ground, ease.inOutCubic(prog(l, 0, 0.6)));
        reveal(parts[4], prog(l, 0.1, 0.45)); reveal(parts[5], prog(l, 0.15, 0.5));
        reveal(parts[0], prog(l, 0.35, 0.8)); reveal(parts[1], prog(l, 0.35, 0.8));
        reveal(parts[2], prog(l, 0.55, 0.95)); reveal(parts[3], prog(l, 0.6, 1.0));
        const a = ease.outQuad(prog(l, 0.75, 1.1));
        sand.setAttribute('opacity', a.toFixed(3));
        const ys = lerp(505, 591, clamp((l - 0.9) / 9));
        const pts = []; for (let y = ys; y <= NECK + 2; y += 3) pts.push([CX - topW(y) + 1, y]);
        top.setAttribute('d', `M${pts[0][0]},${ys} Q${CX},${ys + 6} ${2 * CX - pts[0][0]},${ys} ` + pts.map(([x, y]) => `L${(2 * CX - x).toFixed(1)},${y.toFixed(1)}`).join(' ') + ' ' + pts.slice().reverse().map(([x, y]) => `L${x.toFixed(1)},${y.toFixed(1)}`).join(' ') + 'Z');
        const Hh = 64 * clamp((ys - 505) / 86) + 2;
        let d = `M${CX - 66},${BOT + 2}`;
        for (let i = 0; i <= 30; i++) { const dx = -66 + (132 * i) / 30; d += ` L${(CX + dx).toFixed(1)},${(BOT + 1 - Hh * Math.pow(Math.max(0, 1 - (dx / 66) ** 2), 0.9)).toFixed(1)}`; }
        pile.setAttribute('d', d + 'Z');
        stream.setAttribute('y2', String(Math.max(600, BOT - Hh)));
        stream.style.strokeDashoffset = String(-t * 55);
        stream.setAttribute('opacity', a.toFixed(3));
      },
    };
  };

  // ---------- flower: grows and blooms ----------
  P.flower = (g, th) => {
    const ground = groundLine(g, th, 11);
    const sway = svg('g', {}, g);
    const stem = stroke(sway, [[360, 720], [362, 690], [357, 655], [360, 618]], th, { 'stroke-width': 3.2 }, 12, { amp: 0.6, step: 10 });
    const leafD = 'M0,0 Q16,-14 34,-5 Q18,9 0,0Z';
    const leafA = svg('path', { d: leafD, fill: th.leaf, stroke: th.ink, 'stroke-width': 2, transform: 'translate(360,684) rotate(195)' }, sway);
    const leafB = svg('path', { d: leafD, fill: th.leaf, stroke: th.ink, 'stroke-width': 2, transform: 'translate(359,664) rotate(-20)' }, sway);
    const head = svg('g', {}, sway);
    for (let k = 0; k < 6; k++) svg('ellipse', { cx: 0, cy: -15, rx: 9.5, ry: 13, fill: th.petal, stroke: th.ink, 'stroke-width': 2, transform: `rotate(${k * 60})` }, head);
    svg('circle', { r: 9, fill: th.center, stroke: th.ink, 'stroke-width': 2 }, head);
    return {
      render(l, t) {
        boil(ground, t); boil(stem, t);
        reveal(ground, ease.inOutCubic(prog(l, 0, 0.5)));
        reveal(stem, ease.outQuad(prog(l, 0.25, 0.85)));
        pop(leafA, prog(l, 0.6, 0.8), 360, 684); if (l > 0.6) leafA.setAttribute('transform', `translate(360,684) rotate(195) scale(${ease.outBack(prog(l, 0.6, 0.8)).toFixed(3)})`);
        pop(leafB, prog(l, 0.7, 0.9), 359, 664); if (l > 0.7) leafB.setAttribute('transform', `translate(359,664) rotate(-20) scale(${ease.outBack(prog(l, 0.7, 0.9)).toFixed(3)})`);
        const hp = prog(l, 0.85, 1.15);
        head.style.display = hp <= 0 ? 'none' : '';
        head.setAttribute('transform', `translate(360,606) rotate(${(t * 12) % 360}) scale(${(hp <= 0 ? 0 : ease.outBack(hp)).toFixed(3)})`);
        sway.setAttribute('transform', `rotate(${(1.6 * Math.sin(t * 1.3)).toFixed(2)} 360 720)`);
      },
    };
  };

  // ---------- rain: cloud with falling rain ----------
  P.rain = (g, th) => {
    const r = rng(21);
    const ground = groundLine(g, th, 22);
    const rain = svg('g', { stroke: th.rain, 'stroke-width': 2.2, 'stroke-linecap': 'round' }, g);
    const drops = [];
    for (let i = 0; i < 30; i++) drops.push({ n: svg('line', { x1: 0, y1: 0, x2: -3, y2: 14 }, rain), x: 285 + r() * 160, y0: r(), sp: 0.9 + r() * 0.25 });
    const cloud = svg('path', { d: cloudD(360, 522, 200, 70), fill: th.cloudFill, stroke: th.cloud, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    return {
      render(l, t) {
        boil(ground, t);
        reveal(ground, ease.inOutCubic(prog(l, 0, 0.5)));
        const c = ease.outBack(prog(l, 0, 0.35));
        cloud.setAttribute('transform', `translate(${(4 * Math.sin(t * 0.8)).toFixed(2)},0) translate(360,522) scale(${c.toFixed(3)}) translate(-360,-522)`);
        const a = ease.outQuad(prog(l, 0.35, 0.6));
        rain.setAttribute('opacity', a.toFixed(3));
        if (a > 0) drops.forEach((d) => {
          const y = 565 + (((d.y0 + l * 1.25 * d.sp) % 1) * 150);
          d.n.setAttribute('transform', `translate(${(d.x - (y - 565) * 0.2).toFixed(1)},${y.toFixed(1)})`);
        });
      },
    };
  };

  // ---------- house: a window lights up ----------
  P.house = (g, th) => {
    const hill = [];
    for (let i = 0; i <= 30; i++) { const u = i / 30, x = lerp(120, 600, u); hill.push([x, 690 + 32 * Math.pow(Math.abs(u - 0.5) * 2, 1.8)]); }
    svg('path', { d: 'M120,724 ' + hill.map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + ' L600,724Z', fill: th.soft }, g);
    const hillP = stroke(g, hill, th, { 'stroke-width': 3.2 }, 31, { amp: 0.7, step: 30 });
    const glow = svg('circle', { cx: 360, cy: 652, r: 70, fill: th.accent, opacity: 0, style: 'filter:blur(22px)' }, g);
    svg('path', { d: 'M318,632 L360,598 L402,632 L402,690 L318,690Z', fill: th.panel }, g);
    const win = svg('rect', { x: 344, y: 640, width: 32, height: 28, fill: th.accent, opacity: 0 }, g);
    const walls = [stroke(g, [[318, 630], [318, 690]], th, {}, 32), stroke(g, [[402, 630], [402, 690]], th, {}, 33),
      stroke(g, [[306, 634], [360, 592], [414, 634]], th, { 'stroke-width': 3.8 }, 34, { amp: 0.5 })];
    const frame = svg('path', { d: 'M344,640 h32 v28 h-32Z M360,640 V668 M344,654 H376', fill: 'none', stroke: th.ink, 'stroke-width': 2.4 }, g);
    return {
      render(l, t) {
        [hillP, ...walls].forEach((p) => boil(p, t));
        reveal(hillP, ease.inOutCubic(prog(l, 0, 0.6)));
        walls.forEach((p, i) => reveal(p, ease.outQuad(prog(l, 0.3 + i * 0.12, 0.7 + i * 0.12))));
        frame.style.opacity = prog(l, 0.7, 0.9).toFixed(3);
        const w = ease.outQuad(prog(l, 1.3, 1.6)) * (0.9 + 0.1 * Math.sin(t * 3));
        win.setAttribute('opacity', w.toFixed(3));
        glow.setAttribute('opacity', (w * 0.45).toFixed(3));
      },
    };
  };

  // ---------- stairs: a dot climbs step by step ----------
  P.stairs = (g, th) => {
    const pts = [[260, 720], [260, 688], [302, 688], [302, 656], [344, 656], [344, 624], [386, 624], [386, 592], [428, 592], [428, 560], [470, 560], [470, 720]];
    svg('path', { d: 'M' + pts.map((p) => p.join(',')).join(' L') + 'Z', fill: th.soft }, g);
    const ground = groundLine(g, th, 41);
    const line = stroke(g, pts, th, { 'stroke-width': 3.2 }, 42, { amp: 0.5, step: 20 });
    const trail = svg('path', { d: 'M' + pts.slice(1, 11).map((p) => p.join(',')).join(' L'), fill: 'none', stroke: th.accent, 'stroke-width': 3.6, 'stroke-linejoin': 'round', pathLength: 1 }, g);
    const dot = glowDot(g, th);
    const levels = [706, 674, 642, 610, 578, 546], xs = [228, 281, 323, 365, 407, 449];
    return {
      render(l, t) {
        boil(ground, t); boil(line, t);
        reveal(ground, ease.inOutCubic(prog(l, 0, 0.45)));
        reveal(line, ease.inOutQuad(prog(l, 0.15, 0.7)));
        const f = clamp((l - 0.9) / 2.0) * 5, k = Math.min(4, Math.floor(f)), fr = Math.min(1, f - k);
        const x = lerp(xs[k], xs[k + 1], ease.inOutQuad(fr)), y = lerp(levels[k], levels[k + 1], ease.inOutQuad(fr)) - 14 * Math.sin(Math.PI * fr);
        dot.setAttribute('transform', `translate(${x.toFixed(1)},${(f >= 5 ? levels[5] : y).toFixed(1)}) scale(${ease.outBack(prog(l, 0.5, 0.75)).toFixed(3)})`);
        reveal(trail, clamp((x - 260) / 210));
      },
    };
  };

  // ---------- shield: a ring of light pushes rocks away ----------
  P.shield = (g, th) => {
    const r = rng(51);
    const ground = groundLine(g, th, 52);
    const ring = svg('circle', { cx: 360, cy: 694, r: 0, fill: th.accent, 'fill-opacity': 0.07, stroke: th.accent, 'stroke-width': 3.2 }, g);
    const dot = glowDot(g, th);
    dot.setAttribute('transform', 'translate(360,706)');
    const rocks = [];
    for (let i = 0; i < 8; i++) {
      const rg = svg('g', { opacity: 0 }, g), n = 6, rad = 13 + r() * 5, pts = [];
      for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2 + r() * 0.3; pts.push([Math.cos(a) * rad * (0.85 + r() * 0.25), Math.sin(a) * rad * (0.85 + r() * 0.25)]); }
      svg('path', { d: smoothPath(pts, true), fill: th.soft, stroke: th.rock, 'stroke-width': 2.2 }, rg);
      svg('path', { d: `M0,0 L${-rad * 0.45},${-rad * 0.2} M0,0 L${rad * 0.4},${-rad * 0.3} M0,0 L0,${rad * 0.5}`, stroke: th.rock, 'stroke-width': 1.6, 'stroke-linecap': 'round' }, rg);
      const ang = (-160 + i * 20 + r() * 8) * Math.PI / 180;
      rocks.push({ g: rg, ang, t0: 0.7 + i * 0.13, spin: (r() - 0.5) * 300, from: 260 + r() * 60 });
    }
    return {
      render(l, t) {
        boil(ground, t);
        reveal(ground, ease.inOutCubic(prog(l, 0, 0.45)));
        dot.setAttribute('transform', `translate(360,706) scale(${ease.outBack(prog(l, 0.1, 0.35)).toFixed(3)})`);
        const rr = 80 * ease.outBack(prog(l, 0.35, 0.6)) * (1 + 0.03 * Math.sin(t * 4));
        ring.setAttribute('r', Math.max(0, rr).toFixed(2));
        rocks.forEach((k) => {
          const u = l - k.t0;
          if (u <= 0) { k.g.setAttribute('opacity', 0); return; }
          const dIn = clamp(u / 0.35), dOut = clamp((u - 0.35) / 0.6);
          const dist = u < 0.35 ? lerp(k.from, 92, ease.inQuad(dIn)) : lerp(92, 190, ease.outQuad(dOut));
          const a = k.ang + (u < 0.35 ? 0 : 0.35 * dOut);
          k.g.setAttribute('opacity', (u < 0.35 ? dIn : 1 - dOut).toFixed(3));
          k.g.setAttribute('transform', `translate(${(360 + Math.cos(a) * dist).toFixed(1)},${(694 + Math.sin(a) * dist).toFixed(1)}) rotate(${(k.spin * u).toFixed(1)})`);
        });
      },
    };
  };

  // ---------- heart: draws, fills, beats ----------
  P.heart = (g, th) => {
    const hp = []; for (let i = 0; i <= 60; i++) { const a = (i / 60) * Math.PI * 2; hp.push([16 * Math.pow(Math.sin(a), 3), -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a))]); }
    const pts = hp.map(([x, y]) => [360 + x * 5.6, 598 + y * 5.6]);
    const beat = svg('g', {}, g);
    const halo = svg('path', { d: smoothPath(pts, true), fill: th.accent, opacity: 0, style: 'filter:blur(18px)' }, beat);
    const fill = svg('path', { d: smoothPath(pts, true), fill: th.accent, opacity: 0 }, beat);
    const line = stroke(beat, [...pts, pts[1]], th, { 'stroke-width': 3.4 }, 61, { amp: 0.8, step: 14 });
    return {
      render(l, t) {
        boil(line, t);
        reveal(line, ease.inOutQuad(prog(l, 0, 0.8)));
        const f = ease.outQuad(prog(l, 0.75, 1.1));
        fill.setAttribute('opacity', (f * 0.92).toFixed(3));
        halo.setAttribute('opacity', (f * 0.4).toFixed(3));
        const b = l > 1.1 ? Math.pow(Math.max(0, Math.sin((l - 1.1) * Math.PI / 0.55)), 8) : 0;
        beat.setAttribute('transform', `translate(360,610) scale(${(1 + 0.06 * b).toFixed(4)}) translate(-360,-610)`);
      },
    };
  };

  // ---------- moon: crescent and twinkling stars ----------
  P.moon = (g, th) => {
    const r = rng(71);
    const stars = [];
    for (let i = 0; i < 13; i++) {
      const x = 170 + r() * 380, y = 470 + r() * 230;
      if (Math.hypot(x - 410, y - 570) < 80) continue;
      stars.push({ n: svg('path', { d: star4(3 + r() * 4), fill: i % 4 ? th.ink : th.accent, transform: `translate(${x.toFixed(1)},${y.toFixed(1)})` }, g), t0: 0.25 + r() * 0.9, ph: r() * 6, sp: 1.5 + r() * 2 });
    }
    const halo = svg('circle', { cx: 410, cy: 572, r: 70, fill: th.moon, opacity: 0, style: 'filter:blur(24px)' }, g);
    const moon = svg('path', { d: 'M0,-50 A50,50 0 1 0 0,50 A36,40 0 1 1 0,-50Z', fill: th.moon }, g);
    return {
      render(l, t) {
        const m = ease.outBack(prog(l, 0, 0.45));
        moon.setAttribute('transform', `translate(410,572) rotate(${(-8 + 4 * Math.sin(t * 0.7)).toFixed(2)}) scale(${m.toFixed(3)})`);
        halo.setAttribute('opacity', (0.22 * ease.outQuad(prog(l, 0.2, 0.7))).toFixed(3));
        stars.forEach((s) => s.n.setAttribute('opacity', (prog(l, s.t0, s.t0 + 0.2) * (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph)))).toFixed(3)));
      },
    };
  };

  // ---------- sun: rises over the horizon ----------
  P.sun = (g, th) => {
    const id = 'sunclip' + uid++;
    svg('clipPath', { id }, g).appendChild(svg('rect', { x: 0, y: 0, width: 720, height: 719 }));
    const sky = svg('g', { 'clip-path': `url(#${id})` }, g);
    const halo = svg('circle', { r: 95, fill: th.accent, opacity: 0.25, style: 'filter:blur(26px)' }, sky);
    const rays = svg('g', {}, sky);
    for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; svg('line', { x1: Math.cos(a) * 58, y1: Math.sin(a) * 58, x2: Math.cos(a) * 76, y2: Math.sin(a) * 76, stroke: th.accent, 'stroke-width': 3.4, 'stroke-linecap': 'round', opacity: k % 2 ? 0.7 : 1 }, rays); }
    const disc = svg('circle', { r: 44, fill: th.accent, stroke: th.dotRing, 'stroke-width': 2 }, sky);
    const ground = groundLine(g, th, 81);
    return {
      render(l, t) {
        boil(ground, t);
        reveal(ground, ease.inOutCubic(prog(l, 0, 0.5)));
        const y = lerp(770, 615, ease.outCubic(prog(l, 0.2, 1.3)));
        [halo, disc].forEach((n) => { n.setAttribute('cx', 360); n.setAttribute('cy', y.toFixed(1)); });
        const rs = ease.outBack(prog(l, 0.9, 1.3));
        rays.setAttribute('transform', `translate(360,${y.toFixed(1)}) rotate(${(t * 14).toFixed(1)}) scale(${rs.toFixed(3)})`);
      },
    };
  };

  // ---------- seed: a sprout grows from the soil ----------
  P.seed = (g, th) => {
    const ground = groundLine(g, th, 91);
    svg('path', { d: 'M318,720 Q360,700 402,720Z', fill: th.soft, stroke: th.ink, 'stroke-width': 2.4 }, g);
    const seed = svg('ellipse', { cx: 360, cy: 711, rx: 8, ry: 5.5, fill: th.sand, stroke: th.ink, 'stroke-width': 1.8 }, g);
    const stem = stroke(g, [[360, 708], [363, 680], [357, 650], [360, 618]], th, { 'stroke-width': 3, stroke: th.stem }, 92, { amp: 0.5, step: 10 });
    const leafD = 'M0,0 Q18,-16 40,-6 Q20,10 0,0Z';
    const lA = svg('path', { d: leafD, fill: th.leaf, stroke: th.ink, 'stroke-width': 2 }, g);
    const lB = svg('path', { d: leafD, fill: th.leaf, stroke: th.ink, 'stroke-width': 2 }, g);
    const bud = svg('circle', { cx: 360, cy: 612, r: 7, fill: th.petal, stroke: th.ink, 'stroke-width': 2 }, g);
    return {
      render(l, t) {
        boil(ground, t); boil(stem, t);
        reveal(ground, ease.inOutCubic(prog(l, 0, 0.45)));
        seed.setAttribute('opacity', prog(l, 0.2, 0.35).toFixed(3));
        reveal(stem, ease.outQuad(prog(l, 0.45, 1.5)));
        const a = ease.outBack(prog(l, 1.3, 1.7)), b = ease.outBack(prog(l, 1.4, 1.8));
        const sw = 3 * Math.sin(t * 1.4);
        lA.setAttribute('transform', `translate(360,630) rotate(${(-25 + sw).toFixed(1)}) scale(${a.toFixed(3)})`);
        lB.setAttribute('transform', `translate(360,640) rotate(${(205 - sw).toFixed(1)}) scale(${b.toFixed(3)})`);
        lA.style.display = a <= 0 ? 'none' : ''; lB.style.display = b <= 0 ? 'none' : '';
        pop(bud, prog(l, 1.9, 2.2), 360, 612);
      },
    };
  };

  // ---------- door: opens and light pours out ----------
  P.door = (g, th) => {
    const ground = groundLine(g, th, 101);
    const beam = svg('polygon', { points: '314,720 406,720 470,772 250,772', fill: th.accent, opacity: 0, style: 'filter:blur(6px)' }, g);
    const inside = svg('rect', { x: 314, y: 562, width: 92, height: 158, fill: th.panel }, g);
    const light = svg('rect', { x: 314, y: 562, width: 92, height: 158, fill: th.accent, opacity: 0 }, g);
    const halo = svg('rect', { x: 290, y: 540, width: 140, height: 200, rx: 40, fill: th.accent, opacity: 0, style: 'filter:blur(26px)' }, g);
    const panel = svg('g', {}, g);
    svg('rect', { x: 314, y: 562, width: 92, height: 158, fill: th.door, stroke: th.ink, 'stroke-width': 2.4 }, panel);
    svg('circle', { cx: 394, cy: 645, r: 4, fill: th.ink }, panel);
    const frame = stroke(g, [[306, 720], [306, 554], [414, 554], [414, 720]], th, { 'stroke-width': 3.6 }, 102, { amp: 0.6 });
    return {
      render(l, t) {
        boil(ground, t); boil(frame, t);
        reveal(ground, ease.inOutCubic(prog(l, 0, 0.45)));
        reveal(frame, ease.inOutQuad(prog(l, 0.15, 0.6)));
        const show = prog(l, 0.45, 0.6);
        [inside, panel].forEach((n) => n.setAttribute('opacity', show.toFixed(3)));
        const o = ease.inOutCubic(prog(l, 0.9, 1.6));
        panel.setAttribute('transform', `translate(314,0) scale(${(1 - 0.8 * o).toFixed(3)},1) translate(-314,0)`);
        const flick = 0.92 + 0.08 * Math.sin(t * 5);
        light.setAttribute('opacity', (o * flick).toFixed(3));
        beam.setAttribute('opacity', (o * 0.38).toFixed(3));
        halo.setAttribute('opacity', (o * 0.35).toFixed(3));
      },
    };
  };

  // ---------- lantern: swings and glows ----------
  P.lantern = (g, th) => {
    const sw = svg('g', {}, g);
    const chain = stroke(sw, [[360, 440], [360, 505]], th, { 'stroke-width': 2.4 }, 111, { amp: 0.3 });
    const body = svg('g', {}, sw);
    const glow = svg('circle', { cx: 360, cy: 560, r: 70, fill: th.accent, opacity: 0, style: 'filter:blur(24px)' }, body);
    svg('path', { d: 'M344,505 h32 l10,12 h-52Z', fill: th.panel, stroke: th.ink, 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, body);
    const flame = svg('path', { d: 'M360,540 Q374,560 360,585 Q346,560 360,540Z', fill: th.accent, opacity: 0 }, body);
    svg('path', { d: 'M336,517 h48 Q394,560 384,603 h-48 Q326,560 336,517Z', fill: th.accent, 'fill-opacity': 0.08, stroke: th.ink, 'stroke-width': 2.8, 'stroke-linejoin': 'round' }, body);
    svg('path', { d: 'M360,517 V603 M336,560 H384', stroke: th.ink, 'stroke-width': 1.6, opacity: 0.6 }, body);
    svg('path', { d: 'M334,603 h52 l-8,12 h-36Z', fill: th.panel, stroke: th.ink, 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, body);
    return {
      render(l, t) {
        boil(chain, t);
        reveal(chain, ease.outQuad(prog(l, 0, 0.3)));
        body.setAttribute('opacity', ease.outQuad(prog(l, 0.2, 0.55)).toFixed(3));
        const f = ease.outQuad(prog(l, 0.7, 1.0)) * (0.85 + 0.15 * Math.sin(t * 6.3));
        flame.setAttribute('opacity', f.toFixed(3));
        glow.setAttribute('opacity', (f * 0.5).toFixed(3));
        sw.setAttribute('transform', `rotate(${(4 * Math.sin(t * 1.5)).toFixed(2)} 360 440)`);
      },
    };
  };

  // ---------- book: opens and shines ----------
  P.book = (g, th) => {
    const rays = svg('g', {}, g);
    const rayEls = [];
    for (let k = 0; k < 7; k++) { const a = (-150 + k * 20) * Math.PI / 180; rayEls.push(svg('line', { x1: 360 + Math.cos(a) * 60, y1: 610 + Math.sin(a) * 60, x2: 360 + Math.cos(a) * 120, y2: 610 + Math.sin(a) * 120, stroke: th.accent, 'stroke-width': 3.2, 'stroke-linecap': 'round', pathLength: 1 }, rays)); }
    const halo = svg('ellipse', { cx: 360, cy: 600, rx: 110, ry: 60, fill: th.accent, opacity: 0, style: 'filter:blur(24px)' }, g);
    const pages = svg('g', {}, g);
    svg('path', { d: 'M360,632 Q300,606 244,618 V700 Q300,690 360,712Z', fill: th.page, stroke: th.ink, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, pages);
    svg('path', { d: 'M360,632 Q420,606 476,618 V700 Q420,690 360,712Z', fill: th.page, stroke: th.ink, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, pages);
    for (let i = 0; i < 4; i++) {
      svg('path', { d: `M262,${640 + i * 15} Q306,${630 + i * 15} 346,${646 + i * 15}`, stroke: th.ink, 'stroke-width': 1.6, fill: 'none', opacity: 0.55 }, pages);
      svg('path', { d: `M458,${640 + i * 15} Q414,${630 + i * 15} 374,${646 + i * 15}`, stroke: th.ink, 'stroke-width': 1.6, fill: 'none', opacity: 0.55 }, pages);
    }
    const ground = groundLine(g, th, 121);
    return {
      render(l, t) {
        boil(ground, t);
        reveal(ground, ease.inOutCubic(prog(l, 0, 0.45)));
        const o = ease.outBack(prog(l, 0.15, 0.6));
        pages.setAttribute('transform', `translate(360,712) scale(${o.toFixed(3)},${Math.min(1, o).toFixed(3)}) translate(-360,-712)`);
        rayEls.forEach((r, k) => { reveal(r, ease.outQuad(prog(l, 0.8 + k * 0.06, 1.1 + k * 0.06))); r.setAttribute('opacity', (0.75 + 0.25 * Math.sin(t * 2.4 + k)).toFixed(3)); });
        halo.setAttribute('opacity', (0.35 * ease.outQuad(prog(l, 0.8, 1.3))).toFixed(3));
      },
    };
  };

  // ---------- tree: canopy grows and bears fruit ----------
  P.tree = (g, th) => {
    const ground = groundLine(g, th, 131);
    const trunk = stroke(g, [[360, 720], [358, 680], [361, 640], [360, 610]], th, { 'stroke-width': 5, stroke: th.trunk }, 132, { amp: 0.6, step: 12 });
    const br1 = stroke(g, [[360, 660], [330, 630]], th, { 'stroke-width': 3.4, stroke: th.trunk }, 133);
    const br2 = stroke(g, [[361, 645], [392, 618]], th, { 'stroke-width': 3.4, stroke: th.trunk }, 134);
    const blobs = [[360, 560, 46], [318, 590, 38], [404, 588, 38], [338, 540, 32], [388, 540, 32]].map(([x, y, r], i) => ({ n: svg('circle', { cx: x, cy: y, r, fill: th.leaf, stroke: th.ink, 'stroke-width': 2.4 }, g), x, y, t0: 0.6 + i * 0.12 }));
    const fruits = [[340, 565], [380, 580], [360, 530], [312, 598], [405, 552], [392, 604]].map(([x, y], i) => ({ n: svg('circle', { cx: x, cy: y, r: 6, fill: th.accent, stroke: th.ink, 'stroke-width': 1.6 }, g), x, y, t0: 1.5 + i * 0.1 }));
    return {
      render(l, t) {
        [ground, trunk, br1, br2].forEach((p) => boil(p, t));
        reveal(ground, ease.inOutCubic(prog(l, 0, 0.45)));
        reveal(trunk, ease.outQuad(prog(l, 0.15, 0.6)));
        reveal(br1, prog(l, 0.45, 0.65)); reveal(br2, prog(l, 0.5, 0.7));
        blobs.forEach((b) => pop(b.n, prog(l, b.t0, b.t0 + 0.3), b.x, b.y));
        fruits.forEach((f) => pop(f.n, prog(l, f.t0, f.t0 + 0.2), f.x, f.y));
      },
    };
  };

  // ---------- orbit: a light with things circling it ----------
  P.orbit = (g, th) => {
    const ring = svg('circle', { cx: 360, cy: 600, r: 110, fill: 'none', stroke: th.ink, 'stroke-width': 1.4, 'stroke-dasharray': '3 6', opacity: 0 }, g);
    const halo = svg('circle', { cx: 360, cy: 600, r: 120, fill: th.accent, opacity: 0, style: 'filter:blur(30px)' }, g);
    const dot = glowDot(g, th, 15);
    const sats = [0, 1, 2].map((i) => svg('path', { d: star4(i === 1 ? 11 : 9), fill: th.accent }, g));
    return {
      render(l, t) {
        dot.setAttribute('transform', `translate(360,600) scale(${ease.outBack(prog(l, 0, 0.35)).toFixed(3)})`);
        ring.setAttribute('opacity', (0.8 * ease.outQuad(prog(l, 0.3, 0.6))).toFixed(3));
        halo.setAttribute('opacity', (0.3 * ease.outQuad(prog(l, 0.3, 0.9)) * (0.85 + 0.15 * Math.sin(t * 1.6))).toFixed(3));
        sats.forEach((s, i) => {
          const a = ((i * 120 - 90 + 30 * l) * Math.PI) / 180, v = ease.outBack(prog(l, 0.6 + i * 0.15, 0.85 + i * 0.15));
          s.setAttribute('transform', `translate(${(360 + Math.cos(a) * 110).toFixed(1)},${(600 + Math.sin(a) * 110).toFixed(1)}) rotate(${(l * 40).toFixed(1)}) scale(${v.toFixed(3)})`);
        });
      },
    };
  };

  // ---------- arch: a mihrab with a hanging lamp ----------
  P.arch = (g, th) => {
    const archPts = (w, top) => {
      const pts = [[360 - w, 720], [360 - w, 600]];
      for (let i = 1; i <= 12; i++) { const u = i / 12; pts.push([360 - w + w * Math.sin((u * Math.PI) / 2), 600 - (600 - top) * Math.pow(u, 1.15)]); }
      for (let i = 11; i >= 0; i--) { const u = i / 12; pts.push([360 + w - w * Math.sin((u * Math.PI) / 2), 600 - (600 - top) * Math.pow(u, 1.15)]); }
      pts.push([360 + w, 720]);
      return pts;
    };
    const ground = groundLine(g, th, 141);
    svg('path', { d: smoothPath(archPts(58, 505)) + ' Z', fill: th.soft, opacity: 0.85 }, g);
    const halo = svg('circle', { cx: 360, cy: 590, r: 60, fill: th.accent, opacity: 0, style: 'filter:blur(20px)' }, g);
    const chain = stroke(g, [[360, 515], [360, 560]], th, { 'stroke-width': 2 }, 142, { amp: 0.2 });
    const lamp = svg('g', { opacity: 0 }, g);
    svg('path', { d: 'M346,560 h28 l8,10 Q376,600 360,606 Q344,600 338,570Z', fill: th.accent, 'fill-opacity': 0.25, stroke: th.ink, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, lamp);
    const flame = svg('path', { d: 'M360,572 Q368,584 360,596 Q352,584 360,572Z', fill: th.accent, opacity: 0 }, lamp);
    const outer = stroke(g, archPts(80, 482), th, { 'stroke-width': 3.4 }, 143, { amp: 0.6, step: 18 });
    const inner = stroke(g, archPts(58, 505), th, { 'stroke-width': 2.4 }, 144, { amp: 0.5, step: 18 });
    const rug = svg('rect', { x: 318, y: 710, width: 84, height: 9, rx: 2, fill: th.accent, opacity: 0 }, g);
    return {
      render(l, t) {
        [ground, outer, inner, chain].forEach((p) => boil(p, t));
        reveal(ground, ease.inOutCubic(prog(l, 0, 0.45)));
        reveal(outer, ease.inOutQuad(prog(l, 0.1, 0.85)));
        reveal(inner, ease.inOutQuad(prog(l, 0.3, 1.0)));
        reveal(chain, prog(l, 0.8, 0.95));
        lamp.setAttribute('opacity', prog(l, 0.9, 1.1).toFixed(3));
        const f = ease.outQuad(prog(l, 1.1, 1.4)) * (0.85 + 0.15 * Math.sin(t * 6));
        flame.setAttribute('opacity', f.toFixed(3));
        halo.setAttribute('opacity', (0.5 * f).toFixed(3));
        rug.setAttribute('opacity', (0.75 * prog(l, 1.0, 1.3)).toFixed(3));
        lamp.setAttribute('transform', `rotate(${(2.5 * Math.sin(t * 1.4)).toFixed(2)} 360 515)`);
        chain.setAttribute('transform', `rotate(${(2.5 * Math.sin(t * 1.4)).toFixed(2)} 360 515)`);
      },
    };
  };

  // ---------- path: a road leading to a light on the horizon ----------
  P.path = (g, th) => {
    const horizon = stroke(g, [[110, 560], [360, 561], [610, 560]], th, { 'stroke-width': 2.2 }, 151, { amp: 0.5, step: 40 });
    const halo = svg('circle', { cx: 360, cy: 552, r: 70, fill: th.accent, opacity: 0, style: 'filter:blur(22px)' }, g);
    const sun = svg('circle', { cx: 360, cy: 556, r: 0, fill: th.accent }, g);
    const bend = (u) => 34 * Math.sin(u * Math.PI * 1.2) * (1 - u);
    const curve = (side) => R.curve((u) => [360 + side * lerp(9, 150, Math.pow(u, 1.4)) + bend(u), lerp(561, 720, u)], 24);
    svg('rect', { x: 110, y: 561, width: 500, height: 159, fill: th.leaf, opacity: 0.32 }, g);
    svg('path', { d: 'M' + [...curve(-1), ...curve(1).reverse()].map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' L') + 'Z', fill: th.soft }, g);
    const left = stroke(g, curve(-1), th, { 'stroke-width': 3 }, 152, { amp: 0.6 });
    const right = stroke(g, curve(1), th, { 'stroke-width': 3 }, 153, { amp: 0.6 });
    const mid = svg('path', { d: smoothPath(R.curve((u) => [360 + bend(u), lerp(562, 720, u)], 24)), fill: 'none', stroke: th.accent, 'stroke-width': 4, 'stroke-dasharray': '12 12', 'stroke-linecap': 'round', opacity: 0 }, g);
    [[205, 548, 26], [250, 552, 18], [500, 549, 24], [535, 553, 16]].forEach(([x, y, r]) => svg('path', { d: `M${x - r},${y + 12} Q${x},${y - r} ${x + r},${y + 12}Z`, fill: th.leaf, stroke: th.ink, 'stroke-width': 2, opacity: 0.9 }, g));
    const ground = groundLine(g, th, 154, 90, 630);
    g.appendChild(halo); g.appendChild(sun);
    const dot = glowDot(g, th, 9);
    return {
      render(l, t) {
        [horizon, left, right, ground].forEach((p) => boil(p, t));
        reveal(ground, ease.inOutCubic(prog(l, 0, 0.4)));
        reveal(horizon, ease.inOutCubic(prog(l, 0.1, 0.5)));
        reveal(left, ease.inOutQuad(prog(l, 0.25, 0.9))); reveal(right, ease.inOutQuad(prog(l, 0.3, 0.95)));
        mid.setAttribute('opacity', prog(l, 0.9, 1.1).toFixed(3));
        mid.style.strokeDashoffset = String(t * 30);
        const s = ease.outBack(prog(l, 1.0, 1.4));
        sun.setAttribute('r', (24 * s).toFixed(2));
        sun.setAttribute('cy', (560 - 18 * ease.outCubic(prog(l, 1.0, 2.2))).toFixed(1));
        halo.setAttribute('cy', sun.getAttribute('cy'));
        halo.setAttribute('opacity', (0.55 * prog(l, 1.0, 1.5) * (0.85 + 0.15 * Math.sin(t * 2))).toFixed(3));
        const w = clamp((l - 1.2) / 3.5), u = 1 - ease.inOutQuad(w);
        dot.setAttribute('transform', `translate(${(360 + bend(u)).toFixed(1)},${lerp(572, 708, u).toFixed(1)}) scale(${(ease.outBack(prog(l, 0.9, 1.2)) * lerp(0.5, 1, u)).toFixed(3)})`);
      },
    };
  };

  // ---------- scale: a good deed tips the balance ----------
  P.scale = (g, th) => {
    const ground = groundLine(g, th, 161);
    const post = stroke(g, [[360, 712], [360, 520]], th, { 'stroke-width': 4 }, 162, { amp: 0.4 });
    svg('path', { d: 'M332,720 L360,700 L388,720Z', fill: th.soft, stroke: th.ink, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, g);
    const beamG = svg('g', {}, g);
    svg('line', { x1: 268, y1: 524, x2: 452, y2: 524, stroke: th.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, beamG);
    svg('circle', { cx: 360, cy: 524, r: 7, fill: th.accent, stroke: th.ink, 'stroke-width': 2 }, g);
    const pan = (x) => {
      const pg = svg('g', {}, g);
      svg('path', { d: `M${x},0 L${x - 34},62 M${x},0 L${x + 34},62`, stroke: th.ink, 'stroke-width': 1.8 }, pg);
      svg('path', { d: `M${x - 42},62 Q${x},92 ${x + 42},62Z`, fill: th.soft, stroke: th.ink, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, pg);
      return pg;
    };
    const pL = pan(268), pR = pan(452);
    const good = svg('g', { opacity: 0 }, pR);
    svg('circle', { cx: 452, cy: 46, r: 22, fill: th.accent, opacity: 0.35, style: 'filter:blur(8px)' }, good);
    svg('path', { d: `M452,${30}Q452,46 468,46Q452,46 452,62Q452,46 436,46Q452,46 452,30Z`, fill: th.accent }, good);
    return {
      render(l, t) {
        [ground, post].forEach((p) => boil(p, t));
        reveal(ground, ease.inOutCubic(prog(l, 0, 0.4)));
        reveal(post, ease.outQuad(prog(l, 0.15, 0.5)));
        const show = ease.outQuad(prog(l, 0.4, 0.7));
        [beamG, pL, pR].forEach((n) => n.setAttribute('opacity', show.toFixed(3)));
        good.setAttribute('opacity', ease.outQuad(prog(l, 1.1, 1.4)).toFixed(3));
        const tip = -7 + 17 * ease.outBack(prog(l, 1.35, 2.0)) + 0.8 * Math.sin(t * 1.8);
        const a = (tip * Math.PI) / 180;
        beamG.setAttribute('transform', `rotate(${tip.toFixed(2)} 360 524)`);
        pL.setAttribute('transform', `translate(${(-92 * (Math.cos(a) - 1)).toFixed(2)},${(524 - 92 * Math.sin(a)).toFixed(2)})`);
        pR.setAttribute('transform', `translate(${(92 * (Math.cos(a) - 1)).toFixed(2)},${(524 + 92 * Math.sin(a)).toFixed(2)})`);
      },
    };
  };

  // ---------- sounds that belong to each prop ----------
  const SFX_OF = {
    hourglass: (t0, d) => [{ t: t0 + 0.9, type: 'rain', dur: Math.min(d, 6) - 0.9, gain: -44, density: 4, dropGain: -36, low: 2500 }],
    flower: (t0) => [{ t: t0 + 0.85, type: 'pop', gain: -16, freq: 700 }, { t: t0 + 0.9, type: 'twinkle', dur: 0.35, gain: -22 }],
    rain: (t0, d) => [{ t: t0 + 0.3, type: 'rain', dur: d - 0.3, gain: -27, density: 9, dropGain: -28 }],
    house: (t0) => [{ t: t0 + 1.25, type: 'swell', dur: 0.55, rise: 0.25, gain: -15, low: 90 }],
    stairs: (t0) => [0, 1, 2, 3, 4].map((k) => ({ t: t0 + 0.9 + k * 0.4 + 0.18, type: 'tick', gain: -10, freq: 2400 + k * 300 })),
    shield: (t0) => [{ t: t0 + 0.3, type: 'whoosh', dur: 0.42, rise: 0.2, gain: -9 }, ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ t: t0 + 1.05 + i * 0.13, type: 'tick', gain: -12, freq: 1800 }))],
    heart: (t0, d) => { const ev = [{ t: t0 + 0.75, type: 'swell', dur: 0.45, rise: 0.2, gain: -16, low: 70 }]; for (let k = 0; k < Math.floor((d - 1.1) / 0.55); k += 2) ev.push({ t: t0 + 1.1 + k * 0.55, type: 'pop', gain: -20, freq: 180 }); return ev; },
    moon: (t0) => [{ t: t0 + 0.25, type: 'twinkle', dur: 1.0, gain: -22, density: 10 }],
    sun: (t0) => [{ t: t0 + 0.2, type: 'swell', dur: 1.2, rise: 0.9, gain: -13, low: 60 }],
    seed: (t0) => [{ t: t0 + 1.3, type: 'pop', gain: -18, freq: 520 }, { t: t0 + 1.9, type: 'pop', gain: -18, freq: 760 }],
    door: (t0) => [{ t: t0 + 0.9, type: 'whoosh', dur: 0.7, rise: 0.45, gain: -11 }, { t: t0 + 1.5, type: 'twinkle', dur: 0.6, gain: -20 }],
    lantern: (t0) => [{ t: t0 + 0.7, type: 'pop', gain: -18, freq: 900 }, { t: t0 + 0.75, type: 'twinkle', dur: 0.5, gain: -22 }],
    book: (t0) => [{ t: t0 + 0.15, type: 'whoosh', dur: 0.3, rise: 0.12, gain: -16 }, { t: t0 + 0.8, type: 'twinkle', dur: 0.6, gain: -20 }],
    tree: (t0) => [0, 1, 2, 3, 4].map((i) => ({ t: t0 + 0.6 + i * 0.12, type: 'pop', gain: -20, freq: 400 + i * 80 })),
    arch: (t0) => [{ t: t0 + 1.1, type: 'pop', gain: -18, freq: 820 }, { t: t0 + 1.15, type: 'twinkle', dur: 0.5, gain: -22 }],
    path: (t0) => [{ t: t0 + 1.0, type: 'swell', dur: 0.6, rise: 0.35, gain: -14, low: 80 }],
    scale: (t0) => [{ t: t0 + 1.1, type: 'twinkle', dur: 0.35, gain: -20 }, { t: t0 + 1.4, type: 'whoosh', dur: 0.4, rise: 0.15, gain: -16 }, { t: t0 + 1.75, type: 'tick', gain: -8, freq: 1500 }],
    orbit: (t0) => [{ t: t0, type: 'swell', dur: 0.7, rise: 0.3, gain: -12, low: 80 }, { t: t0 + 0.6, type: 'twinkle', dur: 0.6, gain: -20 }],
  };

  global.Art = {
    names: Object.keys(P),
    make(name, g, th) {
      if (!P[name]) throw new Error(`Unknown art "${name}". Available: ${Object.keys(P).join(', ')}`);
      return P[name](g, th);
    },
    sfx(name, t0, dur) { return (SFX_OF[name] || (() => []))(t0, dur); },
  };
})(window);
