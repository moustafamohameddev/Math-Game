/* سورة الانفطار ٦–٨ — visual tafsir collage (720×1280, 28.2 s), same style as the Quraysh reel.
 * Verses are revealed word by word in time with the recitation (media/infitar.m4a);
 * all pictures are original vector drawings. */
(function () {
  'use strict';
  const { html, prog, ease, rng, clamp } = R;
  const W = 720, H = 1280, HANDLE = 'mostafamohamed6003', OUT = 'stroke="#2a1c10" stroke-width="2.5" stroke-linejoin="round"';

  const HEAD = {
    hair: (c) => `<path d="M24,36 Q22,10 45,10 Q68,10 66,36 Q58,22 45,24 Q32,22 24,36Z" fill="${c || '#2b1b12'}"/>`,
    ghutra: () => `<path d="M23,36 Q24,8 45,8 Q66,8 67,36 L72,74 Q58,62 61,38 Q45,24 29,38 Q32,62 18,74Z" fill="#fbf7ee" ${OUT}/><path d="M26,24 Q45,15 64,24" stroke="#16110c" stroke-width="4" fill="none"/>`,
    kufi: (c) => `<path d="M26,28 Q28,6 45,6 Q62,6 64,28Z" fill="${c || '#f1ead8'}" ${OUT}/>`,
    turban: () => `<ellipse cx="45" cy="18" rx="25" ry="13" fill="#f4efe2" ${OUT}/><path d="M24,20 Q45,8 66,20 M28,26 Q45,16 62,26" stroke="#b9ac96" stroke-width="2" fill="none"/><path d="M29,44 Q45,74 61,44 Q45,54 29,44Z" fill="#d9d4cc" stroke="#8f8a80"/>`,
  };
  /** A small standing figure, 90×200 box. */
  function human({ skin, cloth, head = 'hair', hc, hijab, sash }) {
    const face = `<circle cx="38" cy="36" r="2.2" fill="#2a1c10"/><circle cx="52" cy="36" r="2.2" fill="#2a1c10"/><path d="M39,45 Q45,50 51,45" stroke="#2a1c10" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    return `<ellipse cx="45" cy="194" rx="34" ry="5" fill="rgba(60,45,25,.22)"/><ellipse cx="32" cy="190" rx="11" ry="6" fill="#3a2a1e"/><ellipse cx="58" cy="190" rx="11" ry="6" fill="#3a2a1e"/>
      <path d="M20,74 Q8,112 14,142 M70,74 Q82,112 76,142" stroke="${cloth}" stroke-width="13" stroke-linecap="round" fill="none"/><circle cx="14" cy="146" r="6.5" fill="${skin}"/><circle cx="76" cy="146" r="6.5" fill="${skin}"/>
      <path d="M22,70 Q45,52 68,70 L77,186 Q45,196 13,186Z" fill="${cloth}" ${OUT}/>${sash ? `<path d="M19,118 Q45,128 71,118 L72,130 Q45,140 18,130Z" fill="${sash}"/>` : ''}
      ${hijab ? `<path d="M20,40 Q20,8 45,8 Q70,8 70,40 Q76,76 62,88 L28,88 Q14,76 20,40Z" fill="${hijab}" ${OUT}/><ellipse cx="45" cy="38" rx="15" ry="17" fill="${skin}"/>` : `<circle cx="45" cy="36" r="20" fill="${skin}" ${OUT}/>${HEAD[head](hc)}`}${face}`;
  }
  const fig = (o, w = 90, h = 200) => `<svg width="${w}" height="${h}" viewBox="0 0 90 200">${human(o)}</svg>`;
  const arrow = `<svg width="70" height="40" viewBox="0 0 70 40"><path d="M66,26 Q36,2 10,22" stroke="#7a5a3a" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="1 9"/><path d="M20,10 L6,24 L24,28" stroke="#7a5a3a" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const PEOPLE = [
    { skin: '#e9b98a', cloth: '#f6f1e6', head: 'ghutra' }, { skin: '#f0c8a4', cloth: '#7a9a8c', hijab: '#c9805e' }, { skin: '#6b4226', cloth: '#d9a441', head: 'kufi', hc: '#2f6b4f', sash: '#2f6b4f' },
    { skin: '#d8a070', cloth: '#5f7fae', head: 'turban' }, { skin: '#f3d3b4', cloth: '#b5546a', head: 'hair', hc: '#7a3b1a' },
  ];

  const ART = {
    man: `<svg width="118" height="262" viewBox="0 0 90 200">${human({ skin: '#e2ad7c', cloth: '#3f6f8f', head: 'hair', sash: '#2c4f68' })}</svg>`,
    q1: `<svg width="46" height="60" viewBox="0 0 46 60"><text x="23" y="48" text-anchor="middle" font-family="Amiri,serif" font-weight="700" font-size="58" fill="#b23b2e" stroke="#fff" stroke-width="1.5">؟</text></svg>`,
    coins: `<svg width="150" height="130" viewBox="0 0 150 130"><ellipse cx="75" cy="122" rx="70" ry="7" fill="rgba(60,45,25,.2)"/>
      <path d="M78,56 Q60,40 70,26 L104,26 Q114,40 96,56 Q132,74 124,108 Q118,122 87,122 Q54,122 50,108 Q44,74 78,56Z" fill="#b9874a" ${OUT}/><path d="M70,26 Q87,36 104,26 L100,16 Q87,22 74,16Z" fill="#8f6233" ${OUT}/><path d="M72,56 Q87,62 102,56" stroke="#5b3a22" stroke-width="4" fill="none"/>
      <circle cx="87" cy="90" r="15" fill="#f2c94c" stroke="#a87a18" stroke-width="2.5"/><circle cx="87" cy="90" r="9" fill="none" stroke="#a87a18" stroke-width="2"/>
      ${[[26, 112], [26, 102], [26, 92], [50, 114], [128, 114], [128, 104]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="20" ry="7" fill="#f2c94c" stroke="#a87a18" stroke-width="2.5"/>`).join('')}</svg>`,
    phone: `<svg width="92" height="150" viewBox="0 0 92 150"><rect x="6" y="4" width="80" height="142" rx="14" fill="#23262e" ${OUT}/><rect x="13" y="16" width="66" height="112" rx="5" fill="#3d86c6"/>
      <path d="M46,62 q-18,-22 -22,-4 q-2,14 22,30 q24,-16 22,-30 q-4,-18 -22,4z" fill="#ff5d6c" stroke="#fff" stroke-width="2.5"/><circle cx="62" cy="34" r="11" fill="#ff3b30"/><text x="62" y="39" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="14" fill="#fff">99</text>
      <rect x="22" y="104" width="48" height="7" rx="3.5" fill="#cfe4f6"/><rect x="34" y="134" width="24" height="5" rx="2.5" fill="#6b707c"/></svg>`,
    castle: `<svg width="150" height="150" viewBox="0 0 150 150"><ellipse cx="75" cy="142" rx="72" ry="7" fill="rgba(60,45,25,.2)"/><rect x="22" y="62" width="106" height="80" fill="#efe2c4" ${OUT}/><rect x="8" y="40" width="34" height="102" fill="#e3d2ac" ${OUT}/><rect x="108" y="40" width="34" height="102" fill="#e3d2ac" ${OUT}/>
      <path d="M4,40 L25,10 L46,40Z M104,40 L125,10 L146,40Z" fill="#b5546a" ${OUT}/><path d="M50,62 Q75,22 100,62Z" fill="#d9a441" ${OUT}/><path d="M62,142 v-34 q13,-18 26,0 v34z" fill="#8f5a34" ${OUT}/>
      ${[[18, 60], [118, 60], [18, 92], [118, 92], [38, 80], [98, 80]].map(([x, y]) => `<rect x="${x}" y="${y}" width="13" height="18" rx="6" fill="#6c8fb0" stroke="#2a1c10" stroke-width="1.5"/>`).join('')}<path d="M75,26 v-18 l14,6 l-14,6" fill="#3f8f5f" stroke="#2a1c10" stroke-width="2"/></svg>`,
    light: `<svg width="250" height="250" viewBox="0 0 250 250"><defs><radialGradient id="lg"><stop offset="0" stop-color="#fffdf2"/><stop offset=".35" stop-color="#ffe9a0" stop-opacity=".95"/><stop offset="1" stop-color="#ffd76a" stop-opacity="0"/></radialGradient></defs>
      ${Array.from({ length: 16 }, (_, i) => `<path d="M125,125 L${(125 + 122 * Math.cos(i * Math.PI / 8 - 0.07)).toFixed(1)},${(125 + 122 * Math.sin(i * Math.PI / 8 - 0.07)).toFixed(1)} L${(125 + 122 * Math.cos(i * Math.PI / 8 + 0.07)).toFixed(1)},${(125 + 122 * Math.sin(i * Math.PI / 8 + 0.07)).toFixed(1)}Z" fill="#f6cf5a" opacity="${i % 2 ? 0.35 : 0.6}"/>`).join('')}
      <circle cx="125" cy="125" r="96" fill="url(#lg)"/><circle cx="125" cy="125" r="34" fill="#fffbe6"/></svg>`,
    drop: `<svg width="62" height="78" viewBox="0 0 62 78"><path d="M31,4 Q56,38 54,52 Q52,74 31,74 Q10,74 8,52 Q6,38 31,4Z" fill="#5aa2de" ${OUT}/><path d="M20,50 Q20,62 30,64" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`,
    wheat: `<svg width="62" height="86" viewBox="0 0 62 86"><path d="M31,84 V22" stroke="#a87a18" stroke-width="4"/>${[0, 1, 2, 3].map((i) => `<path d="M31,${62 - i * 13} q-20,-4 -18,-20 q16,2 18,20z M31,${62 - i * 13} q20,-4 18,-20 q-16,2 -18,20z" fill="#e8b93a" stroke="#8f6212" stroke-width="2"/>`).join('')}<path d="M31,24 q-8,-12 0,-22 q8,10 0,22z" fill="#e8b93a" stroke="#8f6212" stroke-width="2"/></svg>`,
    heart: `<svg width="76" height="70" viewBox="0 0 76 70"><path d="M38,24 q-18,-28 -30,-6 q-6,20 30,46 q36,-26 30,-46 q-12,-22 -30,6z" fill="#e2504c" ${OUT}/><path d="M6,40 h18 l6,-12 l8,22 l7,-14 l4,4 h21" stroke="#fff" stroke-width="3.5" fill="none" stroke-linejoin="round" stroke-linecap="round"/></svg>`,
    clay: `<svg width="150" height="150" viewBox="0 0 150 150"><ellipse cx="75" cy="140" rx="72" ry="7" fill="rgba(60,45,25,.2)"/><path d="M6,138 Q20,92 58,84 Q104,78 144,138Z" fill="#9a6a44" ${OUT}/><path d="M34,118 q20,-14 40,-4 M82,104 q20,0 34,18" stroke="#6f472a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M75,8 Q96,38 94,50 Q92,68 75,68 Q58,68 56,50 Q54,38 75,8Z" fill="#5aa2de" ${OUT}/><path d="M66,48 Q66,58 74,60" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>`,
    embryo: `<svg width="150" height="150" viewBox="0 0 150 150"><defs><radialGradient id="eg" cx="45%" cy="40%"><stop offset="0" stop-color="#ffd9d2"/><stop offset="1" stop-color="#e58f8a"/></radialGradient></defs><circle cx="75" cy="75" r="68" fill="url(#eg)" stroke="#a8504c" stroke-width="3"/><circle cx="75" cy="75" r="58" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-dasharray="4 7"/>
      <path d="M92,52 Q116,84 92,108 Q70,124 52,104 Q44,88 60,84 Q72,84 72,96" stroke="#f6c6a6" stroke-width="24" fill="none" stroke-linecap="round"/><circle cx="84" cy="50" r="21" fill="#f6c6a6" stroke="#b9805e" stroke-width="2"/><path d="M76,48 q4,3 8,0" stroke="#7a4a30" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M62,84 Q36,78 40,112" stroke="#b5546a" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`,
    upright: `<svg width="160" height="210" viewBox="0 0 160 210"><circle cx="80" cy="104" r="78" fill="none" stroke="#a8946c" stroke-width="2.5" stroke-dasharray="6 6"/><rect x="18" y="34" width="124" height="160" fill="none" stroke="#a8946c" stroke-width="2.5" stroke-dasharray="6 6"/><path d="M80,4 V206" stroke="#c9805e" stroke-width="2" stroke-dasharray="3 6"/><g transform="translate(35,8)">${human({ skin: '#e2ad7c', cloth: '#f6f1e6', head: 'hair' })}</g></svg>`,
    arrow, arrow2: arrow,
    ...Object.fromEntries(PEOPLE.map((p, i) => ['p' + i, fig(p, [96, 88, 102, 92, 80][i], [213, 196, 227, 204, 178][i])])),
    finger: `<svg width="118" height="118" viewBox="0 0 118 118"><ellipse cx="59" cy="59" rx="50" ry="56" fill="#f1e6cf" ${OUT}/>${[44, 36, 28, 20, 12, 5].map((r, i) => `<path d="M${59 - r},${86 - i * 2} Q${59 - r - 2},${40 - r * 0.6} 59,${46 - r} Q${59 + r + 2},${40 - r * 0.6} ${59 + r},${86 - i * 2}" stroke="#3f6f8f" stroke-width="3.2" fill="none" stroke-linecap="round"/>`).join('')}<path d="M59,62 v30" stroke="#3f6f8f" stroke-width="3.2" stroke-linecap="round"/></svg>`,
    frame: `<svg width="118" height="118" viewBox="0 0 118 118"><rect x="5" y="5" width="108" height="108" rx="6" fill="#d9a441" ${OUT}/><rect x="17" y="17" width="84" height="84" fill="#f6efe0" stroke="#2a1c10" stroke-width="2"/><circle cx="59" cy="50" r="16" fill="#cbb89a"/><path d="M29,101 Q32,70 59,70 Q86,70 89,101Z" fill="#cbb89a"/></svg>`,
  };

  // [id, x, y, t0, dur, entrance, idle]
  const PX = [596, 482, 362, 250, 142], PY = [925, 942, 911, 934, 960];
  const ITEMS = [
    ['light', 438, 150, 8.9, 1.2, 'fade', 'pulse'], ['man', 290, 200, 3.7, 0.5, 'pop', 'breathe'], ['q1', 262, 196, 5.95, 0.35, 'pop', 'float'], ['q1', 398, 182, 6.25, 0.35, 'pop', 'float'],
    ['coins', 20, 338, 6.56, 0.5, 'pop', 'breathe'], ['phone', 168, 270, 7.0, 0.45, 'wipeD', 'sway'], ['castle', 34, 176, 7.4, 0.5, 'wipeD', ''],
    ['drop', 452, 400, 9.9, 0.4, 'pop', 'float'], ['wheat', 536, 394, 10.4, 0.4, 'pop', 'sway'], ['heart', 610, 404, 10.9, 0.4, 'pop', 'beat'],
    ['clay', 532, 610, 14.06, 0.5, 'pop', ''], ['arrow', 448, 660, 15.2, 0.3, 'wipeR', ''], ['embryo', 288, 610, 15.38, 0.6, 'grow', 'pulse'], ['arrow2', 208, 660, 16.85, 0.3, 'wipeR', ''], ['upright', 36, 572, 17.02, 0.6, 'wipeD', 'breathe'],
    ...PEOPLE.map((p, i) => ['p' + i, PX[i] - 20, PY[i], 21.08 + i * 0.55, 0.4, 'pop', 'breathe']),
    ['frame', 190, 1150, 23.94, 0.5, 'wipeL', ''], ['finger', 412, 1150, 26.04, 0.9, 'wipeD', 'pulse'],
  ];
  // [text, right edge, y, font px, word start times…, end]
  const VERSES = [
    ['يَٰٓأَيُّهَا ٱلْإِنسَٰنُ مَا غَرَّكَ بِرَبِّكَ ٱلْكَرِيمِ ۝٦', 704, 92, 36, [0.6, 3.7, 5.98, 6.56, 7.72, 8.96, 11.6]],
    ['ٱلَّذِى خَلَقَكَ فَسَوَّىٰكَ فَعَدَلَكَ ۝٧', 704, 510, 38, [13.06, 14.06, 15.38, 17.02, 18.0]],
    ['فِىٓ أَىِّ صُورَةٍ مَّا شَآءَ رَكَّبَكَ ۝٨', 704, 836, 38, [18.46, 19.28, 21.08, 22.32, 23.94, 26.04, 27.3]],
  ];

  function setup(stage) {
    const cv = html('canvas', { width: W, height: H }, stage), g = cv.getContext('2d'), r = rng(9);
    Object.assign(cv.style, { position: 'absolute', left: 0, top: 0 });
    const gr = g.createRadialGradient(360, 520, 100, 360, 640, 900); gr.addColorStop(0, '#dcd3c2'); gr.addColorStop(1, '#c9c0ae'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const im = g.getImageData(0, 0, W, H); for (let i = 0; i < im.data.length; i += 4) { const n = (r() - 0.5) * 16; im.data[i] += n; im.data[i + 1] += n; im.data[i + 2] += n; } g.putImageData(im, 0, 0);
    g.strokeStyle = 'rgba(90,80,60,.35)'; g.lineWidth = 1; for (let i = 0; i < 260; i++) { const x = r() * W, y = r() * H, a = r() * 6.28, l = 2 + r() * 9; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l, y + Math.sin(a + 1) * l, x + Math.cos(a) * l * 2, y + Math.sin(a) * l * 2); g.stroke(); }

    const bas = html('div', { class: 'basmala', text: 'سُورَةُ ٱلِٱنفِطَارِ' }, stage);
    const hd = html('div', { class: 'handle', text: '@' + HANDLE }, stage);
    const els = ITEMS.map(([id, x, y, t0, dur, kind, idle], i) => { const el = html('div', { class: 'el', html: ART[id] }, stage); el.style.left = x + 'px'; el.style.top = y + 'px'; return { el, t0, dur, kind, idle, ph: i * 1.7 }; });
    const vs = VERSES.map(([txt, right, y, px, ts]) => { const el = html('div', { class: 'verse', text: txt }, stage); el.style.right = W - right + 'px'; el.style.top = y + 'px'; el.style.fontSize = px + 'px'; return { el, ts }; });

    return {
      render(t) {
        bas.style.opacity = ease.outQuad(prog(t, 0.2, 1.0)).toFixed(3);
        hd.style.opacity = (0.9 * ease.outQuad(prog(t, 12, 13))).toFixed(3);
        els.forEach((e) => {
          const p = prog(t, e.t0, e.t0 + e.dur), q = ease.outQuad(p), st = e.el.style, pc = (v) => (100 * v).toFixed(1) + '%';
          st.visibility = p <= 0 ? 'hidden' : 'visible';
          let tf = '', op = 1, clip = 'none', fl = 'none';
          if (e.kind === 'wipeR') { clip = `inset(-12px -12px -12px ${pc(1 - q)})`; op = Math.min(1, p * 3); }
          else if (e.kind === 'wipeL') { clip = `inset(-12px ${pc(1 - q)} -12px -12px)`; op = Math.min(1, p * 3); }
          else if (e.kind === 'wipeD') { clip = `inset(-12px -12px ${pc(1 - q)} -12px)`; op = Math.min(1, p * 3); }
          else if (e.kind === 'grow') { clip = `circle(${pc(0.05 + 0.8 * q)} at 50% 50%)`; op = Math.min(1, p * 2.5); tf = `scale(${(0.85 + 0.15 * q).toFixed(3)})`; }
          else if (e.kind === 'fade') { op = q; tf = `scale(${(0.8 + 0.2 * q).toFixed(3)})`; }
          else { const k = ease.outBack(Math.min(1, p * 1.3)); op = Math.min(1, p * 2.5); tf = `scale(${(0.35 + 0.65 * k).toFixed(3)})`; if (p < 1) fl = `blur(${(3 * (1 - p)).toFixed(1)}px)`; }
          const u = Math.max(0, t - e.t0), w = Math.min(1, u / 0.6), s1 = Math.sin(u * 2.1 + e.ph), s2 = Math.sin(u * 3.3 + e.ph * 2);
          if (e.idle === 'pulse') tf += ` rotate(${(e.el.firstChild.width.baseVal.value > 200 ? u * 9 : 0).toFixed(1)}deg) scale(${(1 + 0.04 * s1 * w).toFixed(3)})`;
          else if (e.idle === 'float') tf += ` translate(${(3 * s2 * w).toFixed(1)}px,${(5 * s1 * w).toFixed(1)}px) rotate(${(6 * s2 * w).toFixed(1)}deg)`;
          else if (e.idle === 'sway') { st.transformOrigin = '50% 100%'; tf += ` rotate(${(3 * s1 * w).toFixed(2)}deg)`; }
          else if (e.idle === 'beat') { const b = Math.pow(Math.abs(Math.sin(u * 3.6)), 6); tf += ` scale(${(1 + 0.14 * b * w).toFixed(3)})`; }
          else if (e.idle === 'breathe') { st.transformOrigin = '50% 100%'; tf += ` scale(${(1 + 0.008 * s1 * w).toFixed(4)},${(1 + 0.016 * s1 * w).toFixed(4)})`; }
          st.clipPath = clip; st.opacity = op.toFixed(3); st.transform = tf || 'none'; st.filter = fl;
        });
        vs.forEach((v) => {
          const ts = v.ts, n = ts.length; let f = 0;
          for (let i = 0; i < n; i++) if (t >= ts[i]) f = (i + ease.outQuad(clamp((t - ts[i]) / Math.min(0.8, (ts[i + 1] || ts[i] + 0.8) - ts[i]), 0, 1))) / n;
          v.el.style.visibility = f <= 0 ? 'hidden' : 'visible'; v.el.style.clipPath = `inset(-30px -30px -30px ${(100 * (1 - f)).toFixed(1)}%)`;
        });
      },
    };
  }

  const sounds = [{ t: 0.2, type: 'pad', dur: 27.5, gain: -22, notes: [146.83, 220, 293.66] },
    ...VERSES.map((v) => ({ t: v[4][0], type: 'swell', dur: 0.8, rise: 0.4, gain: -15, low: 90 })),
    ...ITEMS.map((i) => ({ t: i[3] + 0.05, type: 'pop', gain: -15, freq: 520 + (i[1] % 5) * 60 }))];

  Reel.run({ id: 'infitar', title: 'سورة الانفطار', width: W, height: H, duration: 28.16, fps: 30, background: '#d3cab9', loop: false,
    fonts: ['400 34px "Amiri Quran"', '700 28px "Aref Ruqaa"', '600 15px "Saira Condensed"', '700 20px Amiri'],
    original: '../../media/infitar.m4a', preferOriginal: true, setup, sounds });
})();
