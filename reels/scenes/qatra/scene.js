/* مئة قطرة — 100 drops of istighfar turn a desert into a garden (720×1280, 113.1 s).
 * The world is one flat painting drawn on a canvas; the camera path, the counter
 * rhythm, the milestones and every flower's place and moment were measured from
 * the source video (see data.js). The UI is an HTML layer on top. */
(function () {
  'use strict';
  const { html, prog, ease, clamp, lerp, kf, rng } = R;
  const D = window.QATRA, P = D.cam.p;
  const W = 720, H = 1280, DUR = 113.1;
  const HANDLE = 'mostafamohamed6003';
  const TICK = (n) => 5.033 + n;                       // counter shows n from this moment
  const sm = (t, a, b) => ease.inOutQuad(prog(t, a, b));
  const mix = (c1, c2, k) => `rgb(${c1.map((v, i) => Math.round(lerp(v, c2[i], k))).join(',')})`;
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  function camera(t) {
    const i = clamp(t / D.cam.dt, 0, D.cam.s.length - 1), a = Math.floor(i), b = Math.min(a + 1, D.cam.s.length - 1), f = i - a;
    return { s: lerp(D.cam.s[a], D.cam.s[b], f), x: lerp(D.cam.x[a], D.cam.x[b], f), y: lerp(D.cam.y[a], D.cam.y[b], f) };
  }

  // ---------------- static world data ----------------
  const TREES = [[2, 845, 197, 44.2], [75, 765, 112, 40.7], [201.5, 744, 80, 46.2], [284, 730, 54, 50.5], [478.5, 735, 69, 48.5], [598, 784, 154, 38.2], [710.5, 757, 109, 52.5]]
    .map(([x, b, h, tg], i) => ({ x, b, h, tg, i }));
  const CANOPY = [[-0.21, -1.15, 0.24], [0.18, -1.15, 0.27], [-0.38, -0.8, 0.23], [0.37, -0.8, 0.22], [0, -0.66, 0.27]];
  const STREAM_L = [[1028, 279, 18], [1045, 281, 46], [1060, 279, 47], [1075, 290, 55], [1090, 302, 54], [1105, 308, 51], [1120, 300, 57], [1135, 287, 62], [1150, 270, 67], [1165, 252, 69], [1180, 235, 68], [1195, 219, 70], [1210, 203, 71], [1225, 189, 70], [1240, 178, 71], [1255, 169, 69], [1270, 160, 70], [1300, 146, 70]];
  const STREAM_R = [[1028, 442, 25], [1045, 455, 40], [1060, 470, 39], [1075, 478, 36], [1090, 470, 41], [1105, 456, 42], [1120, 447, 40], [1135, 451, 42], [1150, 469, 52], [1165, 490, 57], [1180, 514, 56], [1195, 533, 52], [1210, 548, 50], [1225, 560, 50], [1240, 569, 52], [1255, 578, 51], [1270, 587, 53], [1300, 604, 53]];
  const FL = { r: ['#a8232f', '#cf4a57'], w: ['#fbf7ee', '#f0c046'], y: ['#f4d04f', '#e8922e'], o: ['#f2b56b', '#f8dc86'], p: ['#f29aa5', '#f6d27a'], v: ['#b9a0dc', '#f3d27a'] };
  const VERSES = [
    { n: 25, ar: 'يُرْسِلِ السَّمَاءَ عَلَيْكُم', gold: 'مِّدْرَارًا', en: '“He will send down abundant rain upon you.”', ref: '— Nuh 71:11 —' },
    { n: 50, ar: 'وَيَجْعَل لَّكُمْ', gold: 'جَنَّاتٍ', en: '“…and grant you gardens.”', ref: '— Nuh 71:12 —' },
    { n: 75, ar: 'وَيَجْعَل لَّكُمْ', gold: 'أَنْهَارًا', en: '“…and grant you rivers.”', ref: '— Nuh 71:12 —' },
    { n: 100, ar: 'اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ', gold: 'غَفَّارًا', en: '“Seek your Lord’s forgiveness — He is ever Forgiving.”', ref: '— Nuh 71:10 —' },
  ];
  const MILE = [[25, 490, 'المطر', 'Rain'], [50, 360, 'الجنات', 'Gardens'], [75, 230, 'الأنهار', 'Rivers'], [100, 100, 'المغفرة', 'Forgiveness']];

  function setup(stage) {
    const cv = html('canvas', { width: W, height: H }, stage);
    Object.assign(cv.style, { position: 'absolute', left: 0, top: 0 });
    const g = cv.getContext('2d');
    const r0 = rng(77);

    // pre-generated bits
    const grain = document.createElement('canvas'); grain.width = grain.height = 256;
    { const c = grain.getContext('2d'), im = c.createImageData(256, 256); for (let i = 0; i < im.data.length; i += 4) { const v = 128 + (r0() - 0.5) * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 26; } c.putImageData(im, 0, 0); }
    const cracks = []; for (let i = 0; i < 120; i++) { const x = -60 + r0() * 840, y = 735 + Math.pow(r0(), 0.8) * 560, k = 0.5 + (y - 700) / 600, pts = [[x, y]]; let a = r0() * 6.28; for (let j = 0; j < 3 + (r0() * 3 | 0); j++) { a += (r0() - 0.5) * 1.8; const l = (8 + r0() * 16) * k; pts.push([pts[j][0] + Math.cos(a) * l, pts[j][1] + Math.sin(a) * l * 0.35]); } cracks.push(pts); }
    const tufts = []; for (let i = 0; i < 420; i++) tufts.push([-60 + r0() * 840, 740 + Math.pow(r0(), 0.75) * 550, r0()]);
    const clouds = [[70, 440, 90, 26], [250, 505, 130, 30], [520, 555, 150, 32], [660, 600, 110, 26], [380, 610, 90, 20], [-20, 600, 80, 22]];
    const stormC = []; for (let i = 0; i < 16; i++) stormC.push([-80 + r0() * 880, 455 + r0() * 170, 110 + r0() * 120, 34 + r0() * 30]);
    const rain = []; for (let i = 0; i < 150; i++) rain.push([r0() * 900 - 90, r0(), 0.8 + r0() * 0.5, 16 + r0() * 22]);
    const stones = []; for (let i = 0; i < 32; i++) { const a = (i / 32) * 6.283 + 0.1, sn = Math.sin(a); stones.push({ x: 361 + 177 * Math.cos(a), y: 966.5 + 59.5 * sn, rx: 6.2 + 1.5 * (sn + 1) + r0(), ry: 4.6 + 1.0 * (sn + 1) + r0() * 0.6 }); }
    stones.sort((a, b) => a.y - b.y);
    TREES.forEach((T) => {
      const rr = rng(100 + T.i), br = [];
      const grow = (x, y, a, l, w, d) => { const x2 = x + Math.sin(a) * l, y2 = y - Math.cos(a) * l; br.push([x, y, x2, y2, w]); if (d > 0) { grow(x2, y2, a - 0.45 - rr() * 0.3, l * 0.62, w * 0.62, d - 1); grow(x2, y2, a + 0.4 + rr() * 0.35, l * 0.66, w * 0.62, d - 1); } };
      grow(T.x, T.b, (rr() - 0.5) * 0.12, T.h * 0.47, Math.max(3, T.h * 0.048), 2);
      T.br = br;
      T.flecks = CANOPY.map(() => [0, 1, 2, 3, 4].map(() => [(rr() - 0.5) * 1.3, (rr() - 0.5) * 1.3, rr() * 3]));
      T.fruit = []; for (let k = 0; k < 13; k++) { const c = CANOPY[k % 5], a = rr() * 6.28, d = Math.sqrt(rr()) * 0.8; T.fruit.push([T.x + (c[0] + Math.cos(a) * d * c[2]) * T.h, T.b + (c[1] + Math.sin(a) * d * c[2]) * T.h, 65.5 + rr() * 2.2]); }
    });
    const birds = []; for (let i = 0; i < 6; i++) birds.push({ t0: 82.5 + i * 2.2 + r0() * 2, y: 520 + r0() * 150, x: r0() * 700, v: 14 + r0() * 14, ph: r0() * 6 });
    const DROPX = [-4, 50, -57];

    const ell = (x, y, rx, ry) => { g.beginPath(); g.ellipse(x, y, Math.max(0, rx), Math.max(0, ry), 0, 0, 6.2832); };
    const soft = (x, y, rx, ry, col, a, inner = 0.2) => { g.save(); g.translate(x, y); g.scale(rx, ry); const gr = g.createRadialGradient(0, 0, inner, 0, 0, 1); gr.addColorStop(0, rgba(col, a)); gr.addColorStop(1, rgba(col, 0)); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 1, 0, 6.2832); g.fill(); g.restore(); };
    function stream(pts, pY, wk, t) {
      if (pY <= pts[0][0]) return;
      const use = pts.filter((p) => p[0] <= pY + 15);
      g.beginPath();
      use.forEach((p, i) => { const y = Math.min(p[0], pY), w = p[2] * wk * (p[0] > pY - 20 ? clamp((pY - p[0] + 20) / 20 + 0.25, 0.25, 1) : 1); i ? g.lineTo(p[1] - w / 2, y) : g.moveTo(p[1] - w / 2, y); });
      use.slice().reverse().forEach((p) => { const y = Math.min(p[0], pY), w = p[2] * wk * (p[0] > pY - 20 ? clamp((pY - p[0] + 20) / 20 + 0.25, 0.25, 1) : 1); g.lineTo(p[1] + w / 2, y); });
      g.closePath(); g.fillStyle = '#6599c0'; g.fill(); g.strokeStyle = 'rgba(60,110,150,.55)'; g.lineWidth = 1.5; g.stroke();
      g.save(); g.beginPath(); use.forEach((p, i) => (i ? g.lineTo(p[1], Math.min(p[0], pY)) : g.moveTo(p[1], p[0] + 6)));
      g.setLineDash([9, 13]); g.lineDashOffset = -t * 26; g.strokeStyle = 'rgba(225,240,250,.8)'; g.lineWidth = 2; g.stroke(); g.restore();
    }
    function flower(f, t) {
      const [x, y, r, c, t0] = f, p = prog(t, t0, t0 + 0.4); if (p <= 0) return;
      const s = ease.outBack(p) * r, col = FL[c];
      g.strokeStyle = '#4f7a3c'; g.lineWidth = Math.max(1, r * 0.16); g.beginPath(); g.moveTo(x, y + s * 0.4); g.lineTo(x + s * 0.1, y + s * 1.9); g.stroke();
      g.fillStyle = '#6f9a4c'; ell(x + s * 0.55, y + s * 1.3, s * 0.5, s * 0.22); g.fill();
      if (c === 'r') { g.fillStyle = col[0]; ell(x, y, s, s); g.fill(); g.fillStyle = col[1]; ell(x - s * 0.12, y - s * 0.1, s * 0.62, s * 0.62); g.fill(); g.fillStyle = '#8d1b27'; ell(x - s * 0.05, y - s * 0.02, s * 0.3, s * 0.3); g.fill(); return; }
      g.fillStyle = col[0];
      for (let k = 0; k < 5; k++) { const a = k * 1.2566 - 1.57; ell(x + Math.cos(a) * s * 0.55, y + Math.sin(a) * s * 0.55, s * 0.5, s * 0.5); g.fill(); }
      g.fillStyle = col[1]; ell(x, y, s * 0.32, s * 0.32); g.fill();
    }
    function tree(T, t, gk) {
      const lf = prog(t, T.tg, T.tg + 1.7), col = mix([123, 82, 50], [114, 85, 63], gk);
      soft(T.x + T.h * 0.12, T.b + 3, T.h * 0.5 * (1 + lf * 0.6), T.h * 0.07 * (1 + lf), [70, 60, 40], 0.22 + 0.1 * lf);
      g.strokeStyle = col; g.lineCap = 'round';
      T.br.forEach((b, i) => { if (lf >= 1 && i > 0) return; g.lineWidth = b[4] * (i === 0 ? 1 + lf * 0.6 : 1); g.beginPath(); g.moveTo(b[0], b[1]); g.lineTo(b[2], b[3]); g.stroke(); });
      if (lf <= 0) return;
      CANOPY.forEach((c, k) => {
        const q = ease.outBack(clamp(lf * 1.6 - k * 0.12)); if (q <= 0) return;
        const cx = T.x + c[0] * T.h, cy = T.b + c[1] * T.h * (0.55 + 0.45 * q), rr = c[2] * T.h * q;
        const gr = g.createRadialGradient(cx - rr * 0.35, cy - rr * 0.4, rr * 0.1, cx, cy, rr);
        gr.addColorStop(0, '#9cc474'); gr.addColorStop(0.5, '#6fa655'); gr.addColorStop(1, '#3f7639');
        g.fillStyle = gr; ell(cx, cy, rr, rr); g.fill();
        g.fillStyle = 'rgba(190,220,150,.55)'; T.flecks[k].forEach((f) => { g.save(); g.translate(cx + f[0] * rr * 0.6, cy + f[1] * rr * 0.6); g.rotate(f[2]); ell(0, 0, rr * 0.11, rr * 0.05); g.fill(); g.restore(); });
      });
      T.fruit.forEach((f) => { const q = ease.outBack(prog(t, f[2], f[2] + 0.35)); if (q <= 0) return; const rr = Math.max(2.2, T.h * 0.033) * q; g.fillStyle = '#d8452f'; ell(f[0], f[1], rr, rr); g.fill(); g.fillStyle = 'rgba(255,170,140,.7)'; ell(f[0] - rr * 0.3, f[1] - rr * 0.3, rr * 0.35, rr * 0.35); g.fill(); });
    }

    function world(t) {
      const gk = sm(t, 40.3, 42.6);                               // desert → garden
      const st = sm(t, 27.4, 28.2) * (1 - sm(t, 34.9, 36.1));     // storm
      // sky
      let gr = g.createLinearGradient(0, -60, 0, 720);
      gr.addColorStop(0, mix([221, 212, 195], [222, 214, 200], gk)); gr.addColorStop(0.62, mix([220, 204, 178], [224, 212, 188], gk)); gr.addColorStop(0.84, mix([222, 193, 150], [237, 215, 178], gk)); gr.addColorStop(1, mix([222, 183, 146], [213, 211, 184], gk));
      g.fillStyle = gr; g.fillRect(-200, -200, 1200, 930);
      clouds.forEach((c, i) => soft(c[0] + Math.sin(t * 0.05 + i) * 14, c[1], c[2], c[3], [250, 244, 232], 0.75));
      soft(577, 627, 46, 46, [255, 240, 205], 0.55 * sm(t, 19, 23));
      // sun rays behind the big tree
      const ray = 0.1 * sm(t, 60, 64) + 0.42 * sm(t, 105.2, 106.4);

      // mountains + dunes
      g.fillStyle = mix([226, 188, 152], [198, 198, 180], gk); g.beginPath(); g.moveTo(170, 722); g.bezierCurveTo(260, 690, 300, 652, 350, 658); g.bezierCurveTo(410, 664, 450, 700, 560, 722); g.fill();
      g.fillStyle = mix([228, 196, 155], [206, 214, 172], gk); g.beginPath(); g.moveTo(-80, 722); g.bezierCurveTo(-20, 680, 90, 680, 190, 722); g.fill(); g.beginPath(); g.moveTo(430, 722); g.bezierCurveTo(540, 690, 660, 690, 800, 740); g.lineTo(430, 740); g.fill();
      // ground
      gr = g.createLinearGradient(0, 712, 0, 1290); gr.addColorStop(0, '#e5c499'); gr.addColorStop(0.16, '#d7ab7a'); gr.addColorStop(0.58, '#ba8e61'); gr.addColorStop(1, '#9c6e4a');
      g.fillStyle = gr; g.fillRect(-200, 712, 1200, 700);
      if (gk < 1) { g.strokeStyle = `rgba(120,78,45,${0.55 * (1 - gk)})`; g.lineWidth = 1.4; cracks.forEach((c) => { g.beginPath(); c.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke(); }); }
      const pr = kf(t, [[11.6, [0, 0]], [13, [228, 92]], [16.2, [232, 96]], [17.2, [250, 102]], [19.2, [392, 128]], [22, [400, 150]], [26, [410, 168]], [30, [412, 178]]]);
      if (pr[0] > 0 && gk < 1) { g.save(); g.translate(360, 980); g.scale(pr[0], pr[1]); const q = g.createRadialGradient(0, 0, 0.55, 0, 0, 1); q.addColorStop(0, 'rgba(154,172,94,1)'); q.addColorStop(0.7, 'rgba(150,168,92,.92)'); q.addColorStop(1, 'rgba(150,168,92,0)'); g.fillStyle = q; g.beginPath(); g.arc(0, 0, 1, 0, 6.2832); g.fill(); g.restore(); }
      if (gk > 0) { gr = g.createLinearGradient(0, 712, 0, 1290); gr.addColorStop(0, '#cfd8a9'); gr.addColorStop(0.12, '#b0c284'); gr.addColorStop(0.33, '#98b46d'); gr.addColorStop(0.67, '#7c9a58'); gr.addColorStop(1, '#56743e'); g.globalAlpha = gk; g.fillStyle = gr; g.fillRect(-200, 712, 1200, 700); g.globalAlpha = 1; }
      const tk = Math.max(gk, sm(t, 13, 20) * 0.9);
      if (tk > 0) { g.strokeStyle = `rgba(70,105,50,${0.5 * tk})`; g.lineWidth = 1.2; tufts.forEach((f) => { const inPatch = ((f[0] - 360) / pr[0]) ** 2 + ((f[1] - 980) / pr[1]) ** 2 < 0.6; if (gk < 0.5 && !inPatch) return; const k = 0.5 + (f[1] - 720) / 500; g.beginPath(); g.moveTo(f[0] - 2 * k, f[1]); g.lineTo(f[0] - 1 * k, f[1] - 6 * k); g.moveTo(f[0] + 2 * k, f[1]); g.lineTo(f[0] + 2.5 * k, f[1] - 5 * k); g.stroke(); }); }
      TREES.forEach((T) => tree(T, t, gk));
      // streams
      const wk = lerp(0.62, 1, sm(t, 40, 74));
      stream(STREAM_L, lerp(1028, 1300, prog(t, 20.2, 23.6)), wk, t);
      stream(STREAM_R, lerp(1028, 1300, prog(t, 83.7, 88.6)), 1, t);
      // pool
      soft(361, 975, 215, 80, [90, 60, 35], 0.25, 0.75);
      gr = g.createLinearGradient(0, 915, 0, 1020); gr.addColorStop(0, '#5f3d28'); gr.addColorStop(1, '#84593b'); g.fillStyle = gr; ell(360, 967.5, 172, 52.5); g.fill();
      const wr = kf(t, [[5.0, 0], [5.08, 50], [5.2, 55], [6, 77], [7, 99], [8, 117], [9, 131], [10, 142.5], [11, 151], [12, 157], [13, 161], [14, 163.5], [16, 166], [19, 170]]);
      if (wr > 0) {
        const wy = 969 + (165 - Math.min(165, wr)) * 0.09, ry = wr * 0.288;
        g.save(); ell(359, wy, wr, ry); g.clip();
        gr = g.createLinearGradient(0, wy - ry, 0, wy + ry); gr.addColorStop(0, '#7fb2da'); gr.addColorStop(0.5, '#6aa3d2'); gr.addColorStop(1, '#5890c4'); g.fillStyle = gr; g.fillRect(150, 900, 420, 140);
        g.strokeStyle = 'rgba(215,235,248,.65)'; g.lineWidth = 1.1; for (let k = -3; k <= 3; k++) { g.beginPath(); g.moveTo(180, wy + k * ry * 0.27 + Math.sin(t * 1.3 + k) * 0.8); g.lineTo(540, wy + k * ry * 0.27 + Math.sin(t * 1.3 + k + 2) * 0.8); g.stroke(); }
        soft(359 + wr * 0.45, wy - ry * 0.35, wr * 0.42, ry * 0.3, [255, 255, 255], 0.6);
        // ripples from recent drops
        for (let n = Math.max(1, Math.floor(t - 5.033) - 1); n <= 100 && TICK(n) + 0.24 <= t; n++) { const u = (t - TICK(n) - 0.24) / 0.9; if (u > 1) continue; g.strokeStyle = `rgba(255,255,255,${0.9 * (1 - u)})`; g.lineWidth = 1.6; ell(P[0] + DROPX[n % 3], wy + 2, 5 + 30 * u, (5 + 30 * u) * 0.3); g.stroke(); }
        g.restore();
        g.strokeStyle = 'rgba(70,45,30,.8)'; g.lineWidth = 2; ell(359, wy, wr, ry); g.stroke();
      }
      stones.forEach((s) => { soft(s.x + 1, s.y + s.ry * 0.7, s.rx * 1.3, s.ry * 0.8, [70, 50, 30], 0.35); const q = g.createLinearGradient(0, s.y - s.ry, 0, s.y + s.ry); q.addColorStop(0, '#e6d8c2'); q.addColorStop(0.55, '#d6c3a6'); q.addColorStop(1, '#b9a383'); g.fillStyle = q; ell(s.x, s.y, s.rx, s.ry); g.fill(); });
      D.flowers.forEach((f) => flower(f, t));
      if (ray > 0) { g.save(); g.translate(590, 640); g.rotate(t * 0.03); for (let k = 0; k < 16; k++) { g.rotate(6.2832 / 16); g.beginPath(); g.moveTo(0, 0); g.lineTo(-95, 1500); g.lineTo(95, 1500); g.closePath(); g.fillStyle = `rgba(255,251,228,${ray * (k % 2 ? 0.75 : 1)})`; g.fill(); } g.restore(); soft(590, 640, 120, 120, [255, 250, 225], ray * 0.8); }
      // storm
      if (st > 0) {
        g.fillStyle = `rgba(120,122,140,${0.36 * st})`; g.fillRect(-200, -200, 1200, 1700);
        stormC.forEach((c, i) => soft(c[0] + Math.sin(t * 0.2 + i) * 25, c[1], c[2], c[3], [92, 94, 116], 0.6 * st));
        g.strokeStyle = `rgba(235,240,250,${0.42 * st})`; g.lineWidth = 1.5; g.beginPath();
        rain.forEach((d) => { const y = 380 + ((d[1] + t * d[2] * 1.5) % 1) * 950; g.moveTo(d[0], y); g.lineTo(d[0] - d[3] * 0.12, y + d[3]); }); g.stroke();
        const fl = Math.max(0, 1 - Math.abs(t - 28.25) / 0.12, 0.7 * (1 - Math.abs(t - 28.5) / 0.1)); if (fl > 0) { g.fillStyle = `rgba(255,255,255,${0.3 * fl})`; g.fillRect(-200, -200, 1200, 1700); }
      }
      // birds
      g.strokeStyle = 'rgba(80,60,45,.8)'; g.lineWidth = 1.6;
      birds.forEach((b) => { if (t < b.t0) return; const x = -40 + ((b.x + (t - b.t0) * b.v) % 800), y = b.y + Math.sin(t * 0.7 + b.ph) * 10, fl = Math.sin(t * 7 + b.ph) * 4; g.beginPath(); g.moveTo(x - 11, y - 3 + fl); g.quadraticCurveTo(x - 5, y - 8 - fl, x, y); g.quadraticCurveTo(x + 5, y - 8 - fl, x + 11, y - 3 + fl); g.stroke(); });
    }

    function drops(t, cam) {
      const n = Math.floor(t - 5.033 + 0.07); if (n < 1 || n > 100) return;
      const dt = t - TICK(n); if (dt > 0.2425 || t < 5.9) return;
      const wx = P[0] + DROPX[n % 3], sx = (wx - P[0]) * cam.s + cam.x;
      const y0 = Math.max(533, cam.y - 386 * cam.s), y1 = cam.y, f = Math.pow(clamp(dt / 0.2425), 2.3), y = lerp(y0, y1, f), k = cam.s * (dt < 0 ? clamp((dt + 0.07) / 0.05) : 1);
      const w = 7 * k, h = (6.5 + 4.5 * clamp(dt / 0.12)) * k;
      g.beginPath(); g.moveTo(sx, y - h * 1.25); g.bezierCurveTo(sx + w * 1.5, y, sx + w, y + h, sx, y + h); g.bezierCurveTo(sx - w, y + h, sx - w * 1.5, y, sx, y - h * 1.25);
      const q = g.createLinearGradient(0, y - h, 0, y + h); q.addColorStop(0, '#cfe3f3'); q.addColorStop(1, '#86b6de'); g.fillStyle = q; g.fill();
    }

    // ---------------- UI (HTML) ----------------
    const ui = html('div', { id: 'ui', dir: 'ltr' }, stage);
    ui.innerHTML = `
      <div class="brandbox"><div class="b-ar" dir="rtl">مئة قطرة</div><div class="b-line"><i></i></div><div class="b-en">100 Drops · Astaghfirullah</div><div class="b-h">${HANDLE}</div></div>
      <div id="intro"><div class="i1" dir="rtl"><span>قبل أن</span> <span class="gold">تُكمل</span> <span>التمرير...</span></div><div class="i2" dir="rtl">100 اســتغفار</div><div class="rule" style="top:322px;left:134px;width:466px"></div><div class="i3">100 × Astaghfirullah</div><div class="i4">One drop for each — say it with us.</div></div>
      <div id="main"><div class="title" dir="rtl">أَســـتَغْفِرُ اللهَ</div><div class="rule" style="top:245px;left:165px;width:401px"></div><div class="t-en">Astaghfirullah</div><div class="t-sub">I seek Allah’s forgiveness</div>
        <div id="dim"><div class="count"><span id="num">0</span><span class="of"> / 100</span></div>
        <div class="track"></div><div class="fill" id="fill"></div>${MILE.map((m, i) => `<div class="dot" id="dot${i}" style="left:${m[1]}px"></div><div class="lab" style="left:${m[1]}px"><b dir="rtl">${m[2]}</b><span>${m[3]}</span></div>`).join('')}</div>
        <div id="veil"></div>
        ${VERSES.map((v, i) => `<div class="verse" id="v${i}"><div class="v-ar" dir="rtl"><span>${v.ar}</span> <span class="gold">${v.gold}</span></div><div class="rule" style="top:48px;left:152px;width:428px"></div><div class="v-en">${v.en}</div><div class="v-ref">${v.ref}</div></div>`).join('')}</div>
      <div id="end"><div class="e0" dir="rtl">100 قطرة.</div><div class="e1" dir="rtl">100 قطرة</div><div class="rule" style="top:322px;left:232px;width:268px"></div><div class="e2">100 drops</div><div class="e3">The Prophet (peace be upon him) sought Allah’s forgiveness a hundred times a day.</div><div class="e4">— Sahih Muslim 2702 —</div><div class="e5" dir="rtl">احفظه · وردّده غدًا</div><div class="e6">Save this · say it again tomorrow</div></div>`;
    const $ = (s) => ui.querySelector(s);
    const fit = (el, w) => { const cur = el.getBoundingClientRect().width / (stage.getBoundingClientRect().width / W || 1); if (cur > 0) el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) * w) / cur + 'px'; };
    fit($('.title'), 378); fit($('.i2'), 428); fit($('.e1'), 212);
    const black = html('div', {}, stage); Object.assign(black.style, { position: 'absolute', inset: 0, background: '#000', pointerEvents: 'none' });
    const num = $('#num'), fill = $('#fill'), intro = $('#intro'), main = $('#main'), end = $('#end'), dim = $('#dim'), veil = $('#veil');
    const i1 = [...ui.querySelectorAll('.i1 span')];

    return {
      render(t) {
        const cam = camera(t);
        g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
        g.setTransform(cam.s, 0, 0, cam.s, cam.x - P[0] * cam.s, cam.y - P[1] * cam.s);
        world(t);
        g.setTransform(1, 0, 0, 1, 0, 0);
        drops(t, cam);
        const hz = g.createLinearGradient(0, 0, 0, 640); hz.addColorStop(0, 'rgba(221,212,196,.96)'); hz.addColorStop(0.45, 'rgba(220,208,188,.82)'); hz.addColorStop(0.68, 'rgba(220,206,184,.5)'); hz.addColorStop(0.84, 'rgba(220,204,180,.18)'); hz.addColorStop(1, 'rgba(220,204,180,0)');
        g.fillStyle = hz; g.fillRect(0, 0, W, 640);
        g.globalCompositeOperation = 'overlay'; g.fillStyle = g.createPattern(grain, 'repeat'); g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over';

        black.style.opacity = Math.max(1 - sm(t, 0.05, 0.62), sm(t, 112.3, 113.05)).toFixed(3);
        // intro
        const io = 1 - sm(t, 4.6, 5.0);
        intro.style.opacity = io.toFixed(3); intro.style.display = io <= 0 ? 'none' : '';
        i1.forEach((s, k) => { s.style.opacity = ease.outQuad(prog(t, 0.75 + k * 0.25, 1.0 + k * 0.25)).toFixed(3); });
        $('.i2').style.opacity = sm(t, 1.25, 1.6).toFixed(3); intro.querySelector('.rule').style.opacity = sm(t, 1.4, 1.8).toFixed(3);
        $('.i3').style.opacity = sm(t, 1.5, 1.9).toFixed(3);
        $('.i4').style.clipPath = `inset(0 ${(100 * (1 - prog(t, 1.1, 2.5))).toFixed(1)}% 0 0)`;
        // main UI
        const mo = sm(t, 5.02, 5.45) * (1 - sm(t, 108.3, 108.8));
        main.style.opacity = mo.toFixed(3); main.style.display = mo <= 0 ? 'none' : '';
        const n = clamp(Math.floor(t - 5.033), 0, 100);
        if (num.__n !== n) { num.textContent = n; num.__n = n; }
        const pulse = n > 0 ? 1 + 0.07 * (1 - prog(t, TICK(n), TICK(n) + 0.18)) : 1;
        num.style.transform = `scale(${pulse.toFixed(3)})`;
        const fp = n === 0 ? 0 : n - 1 + ease.outQuad(prog(t, TICK(n), TICK(n) + 0.3));
        fill.style.left = 620 - 5.2 * Math.max(fp, 0.25 * mo) + 'px'; fill.style.width = 5.2 * Math.max(fp, 0.25 * mo) + 'px';
        let vshow = 0;
        MILE.forEach((m, i) => { const on = sm(t, TICK(m[0]) + 0.05, TICK(m[0]) + 0.3); const d = $('#dot' + i); d.style.background = on > 0.5 ? '#c08a2a' : '#bfae94'; d.style.transform = `translate(-50%,-50%) scale(${(1 + 0.4 * on).toFixed(3)})`; d.style.boxShadow = `0 0 ${12 * on}px ${4 * on}px rgba(224,170,60,${0.55 * on})`; });
        VERSES.forEach((v, i) => {
          const a = TICK(v.n) + 0.2, b = i === 3 ? 108.3 : a + 4.25, o = sm(t, a, a + 0.35) * (1 - sm(t, b, b + 0.4)), el = $('#v' + i);
          el.style.opacity = o.toFixed(3); el.style.display = o <= 0 ? 'none' : ''; vshow = Math.max(vshow, o);
          const sp = el.querySelectorAll('.v-ar span'); sp[1].style.opacity = sm(t, a + 0.45, a + 0.8).toFixed(3);
          el.querySelector('.v-en').style.opacity = sm(t, a + 0.5, a + 0.9).toFixed(3); el.querySelector('.v-ref').style.opacity = sm(t, a + 0.7, a + 1.1).toFixed(3);
        });
        dim.style.opacity = (1 - 0.45 * vshow).toFixed(3); veil.style.opacity = (0.75 * vshow).toFixed(3);
        // end card
        const eo = sm(t, 108.9, 109.5);
        end.style.opacity = eo.toFixed(3); end.style.display = eo <= 0 ? 'none' : '';
        ['.e1', '.rule', '.e2', '.e3', '.e4', '.e5', '.e6'].forEach((s, k) => { end.querySelector(s).style.opacity = sm(t, 109.2 + k * 0.22, 109.6 + k * 0.22).toFixed(3); });
      },
    };
  }

  // ---------------- sound ----------------
  function sounds() {
    const ev = [{ t: 0.3, type: 'swell', dur: 1.3, rise: 0.9, gain: -16, low: 70 }, { t: 0.4, type: 'bed', dur: 112, gain: -40, low: 300, high: 2500 },
      { t: 27.6, type: 'swell', dur: 2.6, rise: 0.5, gain: -4, low: 42, body: 1.6 }, { t: 27.9, type: 'rain', dur: 7.9, gain: -24, density: 14, dropGain: -30 },
      { t: 5.0, type: 'whoosh', dur: 1.2, rise: 0.7, gain: -18 }];
    for (let n = 1; n <= 100; n++) { const t = TICK(n) + 0.24; ev.push({ t, type: 'pop', gain: -11, freq: 1250 + (n % 3) * 120 }, { t: t + 0.01, type: 'tick', gain: -14, freq: 5200, dur: 0.05 }); }
    [25, 50, 75, 100].forEach((n) => ev.push({ t: TICK(n) + 0.1, type: 'swell', dur: 1.0, rise: 0.45, gain: -13, low: 90 }, { t: TICK(n) + 0.3, type: 'twinkle', dur: 1.1, density: 10, gain: -18 }));
    for (let t = 44; t < 107; t += 2.6) ev.push({ t: t + (Math.sin(t * 7) + 1) * 0.6, type: 'twinkle', dur: 0.5, density: 12, gain: t > 80 ? -22 : -27 });
    return ev;
  }

  Reel.run({
    id: 'qatra', title: 'مئة قطرة', width: W, height: H, duration: DUR, fps: 30, background: '#000', loop: false,
    fonts: ['700 40px Amiri', '400 40px Amiri', '400 30px "Amiri Quran"', '400 20px "EB Garamond"', '500 20px "EB Garamond"', '600 20px "Saira Condensed"', '400 26px "Aref Ruqaa"'],
    original: '../../media/qatra.m4a', preferOriginal: true,
    setup, sounds,
  });
})();
