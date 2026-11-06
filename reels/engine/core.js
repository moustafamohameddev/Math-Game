/* Core helpers shared by every scene: math, easing, keyframes, seeded RNG,
 * DOM/SVG builders and "hand-drawn" path utilities.
 * Everything is a pure function of time so any frame can be rendered exactly. */
(function (global) {
  'use strict';

  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const prog = (t, a, b) => (b <= a ? (t >= a ? 1 : 0) : clamp((t - a) / (b - a)));

  const ease = {
    linear: (x) => x,
    inQuad: (x) => x * x,
    outQuad: (x) => 1 - (1 - x) * (1 - x),
    inOutQuad: (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2),
    inCubic: (x) => x * x * x,
    outCubic: (x) => 1 - Math.pow(1 - x, 3),
    inOutCubic: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    outQuart: (x) => 1 - Math.pow(1 - x, 4),
    inOutSine: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
    outSine: (x) => Math.sin((x * Math.PI) / 2),
    inSine: (x) => 1 - Math.cos((x * Math.PI) / 2),
    outExpo: (x) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x)),
    outBack: (x) => {
      const c1 = 1.70158, c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    },
  };

  /** Keyframe interpolation. keys = [[t, value], ...]; value may be a number or array. */
  function kf(t, keys, e = ease.linear) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      if (t <= keys[i][0]) {
        const [t0, v0] = keys[i - 1];
        const [t1, v1] = keys[i];
        const ef = keys[i][2] || e;
        const p = ef(prog(t, t0, t1));
        return Array.isArray(v0) ? v0.map((v, j) => lerp(v, v1[j], p)) : lerp(v0, v1, p);
      }
    }
    return keys[keys.length - 1][1];
  }

  /** Deterministic PRNG (mulberry32). */
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const SVGNS = 'http://www.w3.org/2000/svg';
  function setAttrs(node, attrs) {
    for (const k in attrs) {
      const v = attrs[k];
      if (v == null) continue;
      if (k === 'text') node.textContent = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
      else node.setAttribute(k, v);
    }
    return node;
  }
  function svg(tag, attrs = {}, parent) {
    const n = setAttrs(document.createElementNS(SVGNS, tag), attrs);
    if (parent) parent.appendChild(n);
    return n;
  }
  function html(tag, attrs = {}, parent) {
    const n = setAttrs(document.createElement(tag), attrs);
    if (parent) parent.appendChild(n);
    return n;
  }

  /** Smooth path through points (Catmull-Rom -> cubic Bezier). */
  function smoothPath(pts, closed = false) {
    if (pts.length < 2) return '';
    const P = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
    let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
    for (let i = 1; i < P.length - 2; i++) {
      const p0 = P[i - 1], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
    }
    return closed ? d + 'Z' : d;
  }

  /** Resample a polyline so consecutive points are ~step px apart. */
  function resample(pts, step) {
    const out = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      const L = Math.hypot(x1 - x0, y1 - y0);
      const n = Math.max(1, Math.round(L / step));
      for (let k = 1; k <= n; k++) out.push([lerp(x0, x1, k / n), lerp(y0, y1, k / n)]);
    }
    return out;
  }

  /** Hand-drawn wobble: perpendicular low-frequency noise along a polyline. */
  function wobble(pts, { amp = 1.2, step = 14, seed = 1, closed = false } = {}) {
    const r = rng(seed);
    const R = resample(pts, step);
    let phase = r() * 10, drift = 0;
    return R.map((p, i) => {
      if ((!closed && (i === 0 || i === R.length - 1))) return p;
      const a = R[Math.max(0, i - 1)], b = R[Math.min(R.length - 1, i + 1)];
      let nx = -(b[1] - a[1]), ny = b[0] - a[0];
      const L = Math.hypot(nx, ny) || 1;
      nx /= L; ny /= L;
      drift = drift * 0.6 + (r() - 0.5) * 0.8;
      const o = amp * (Math.sin(phase + i * 0.9) * 0.6 + drift);
      return [p[0] + nx * o, p[1] + ny * o];
    });
  }

  /** Hand-drawn path string from polyline points. */
  function sketch(pts, opts = {}) {
    return smoothPath(wobble(pts, opts), !!opts.closed);
  }

  /** Sample a function-defined curve into points. */
  function curve(fn, n = 40) {
    const pts = [];
    for (let i = 0; i <= n; i++) pts.push(fn(i / n));
    return pts;
  }

  /** Stroke draw-on helper: p in [0,1]. Caches path length. */
  function drawOn(path, p, reverse = false) {
    if (path.__len == null) path.__len = path.getTotalLength() + 1;
    const L = path.__len;
    path.style.strokeDasharray = `${L} ${L}`;
    path.style.strokeDashoffset = String(reverse ? -L * (1 - p) : L * (1 - p));
    path.style.visibility = p <= 0 ? 'hidden' : 'visible';
  }

  function show(node, on) {
    node.style.display = on ? '' : 'none';
  }

  global.R = Object.assign(global.R || {}, {
    clamp, lerp, prog, ease, kf, rng, svg, html, setAttrs, smoothPath, resample, wobble, sketch, curve, drawOn, show, SVGNS,
  });
})(window);
