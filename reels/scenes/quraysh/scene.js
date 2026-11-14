/* سورة قريش — visual tafsir collage (720×1280, 25.2 s).
 * Each verse appears as it is recited, followed by small illustrations of its meaning.
 * Positions and appearance times were measured from the source video; the pictures
 * are original vector drawings. Recitation: media/quraysh.m4a (extract-audio). */
(function () {
  'use strict';
  const { html, prog, ease, rng } = R;
  const W = 720, H = 1280, HANDLE = 'mostafamohamed6003';
  const CAMEL = 'M2,60 L6,38 Q4,24 12,20 L14,10 Q18,2 24,8 L26,16 Q34,18 38,26 Q44,10 54,12 Q62,14 64,24 Q72,26 76,34 L82,36 L80,42 L74,42 L72,60 L67,60 L66,44 Q56,50 44,46 L42,60 L37,60 L36,46 Q26,46 20,40 L14,60 L9,60 L12,40 L7,60 Z';
  const camel = (x, y, s, fill, load) => `<g transform="translate(${x},${y}) scale(${-s},${s})"><path d="${CAMEL}" fill="${fill}"/>${load ? `<path d="M36,24 q10,-16 22,-2 l2,10 h-26z" fill="${load}"/>` : ''}</g>`;
  const box = (x, y, w, h, f, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" stroke="#7a5a3a" stroke-width="1.5"/>${extra}`;
  const win = (x, y) => `<rect x="${x}" y="${y}" width="9" height="13" fill="#5b4a3a"/>`;
  const kaaba = (x, y, w, h) => `<g transform="translate(${x},${y})"><path d="M0,${h * 0.08} L${w * 0.62},0 L${w},${h * 0.07} L${w},${h * 0.93} L${w * 0.3},${h} L0,${h * 0.9}Z" fill="#17161a"/><path d="M${w * 0.3},${h * 0.16} L${w * 0.3},${h} L${w},${h * 0.93} L${w},${h * 0.07}Z" fill="#232228"/>
    <path d="M0,${h * 0.3} L${w * 0.3},${h * 0.36} L${w},${h * 0.28} L${w},${h * 0.37} L${w * 0.3},${h * 0.46} L0,${h * 0.39}Z" fill="#c9a23c"/><path d="M${w * 0.06},${h * 0.52} l${w * 0.14},${h * 0.03} v${h * 0.4} l-${w * 0.14},-${h * 0.03}z" fill="#d4ad45" stroke="#8a6a1c"/></g>`;

  const ART = {
    caravan: `<svg width="405" height="185" viewBox="0 0 405 185"><defs><filter id="rough"><feTurbulence baseFrequency=".04" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="14"/></filter></defs>
      <path d="M10,60 Q120,20 260,30 Q380,36 398,90 Q400,160 300,172 Q150,186 30,168 Q0,120 10,60Z" fill="#e9cf8f" filter="url(#rough)"/><path d="M20,120 Q200,90 390,125 L380,160 Q200,180 30,160Z" fill="#dcb96c" opacity=".7"/>
      ${box(40, 34, 46, 34, '#e8d3a6', win(52, 44) + win(68, 44))}${box(96, 22, 40, 40, '#dcc08c', win(108, 32))}${box(146, 36, 50, 30, '#ead9b0', win(160, 44))}${box(300, 26, 36, 34, '#e2c894', win(312, 36))}
      <path d="M92,32 q-6,-22 -22,-22 q14,2 18,22 M92,32 q8,-24 24,-20 q-16,0 -20,20" stroke="#4d7a3a" stroke-width="4" fill="none"/><rect x="340" y="10" width="7" height="50" fill="#e2c894" stroke="#7a5a3a"/>
      ${kaaba(212, 6, 62, 54)}
      ${[0, 1, 2, 3, 4, 5].map((i) => camel(120 + i * 52, 104 - i * 8, 0.6 - i * 0.045, '#b98a52', ['#7a3f2c', '#5f6f4a', '#8c5a33'][i % 3])).join('')}
      <g transform="translate(22,112)"><path d="M0,58 L6,14 Q10,0 18,12 L26,58Z" fill="#f1e6cf" stroke="#7a5a3a"/><circle cx="13" cy="6" r="7" fill="#c98f62"/><path d="M5,2 q8,-10 17,0 l2,10 h-20z" fill="#fff"/><path d="M-4,10 L-2,60" stroke="#6b4a2e" stroke-width="2.5"/></g></svg>`,
    sun: `<svg width="84" height="84" viewBox="0 0 84 84"><defs><radialGradient id="sg" cx="40%" cy="38%"><stop offset="0" stop-color="#ff9a3c"/><stop offset=".6" stop-color="#f2591c"/><stop offset="1" stop-color="#d93f10"/></radialGradient><filter id="st"><feTurbulence baseFrequency=".12" numOctaves="3" seed="8"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 .75  0 0 0 0 .2  0 0 0 .5 0"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs><circle cx="42" cy="42" r="41" fill="url(#sg)"/><circle cx="42" cy="42" r="41" filter="url(#st)"/></svg>`,
    house: `<svg width="228" height="215" viewBox="0 0 228 215"><path d="M6,200 H222" stroke="#b9ac96" stroke-width="6"/>${box(34, 26, 110, 176, '#efe6d2')}${box(140, 62, 70, 140, '#e3d8c0')}<path d="M26,26 h126 l-6,-10 h-114z" fill="#b5673f"/><rect x="34" y="2" width="12" height="18" fill="#cfc4ad" stroke="#7a5a3a"/>
      <path d="M10,110 h30 v92 h-30z M10,128 h30 M10,150 h30 M10,172 h30 M24,110 v92" fill="#c9bca2" stroke="#8f8068"/><rect x="62" y="56" width="26" height="36" fill="#6f7d86" stroke="#5b3a22" stroke-width="3"/><path d="M75,56 v36 M62,74 h26" stroke="#5b3a22" stroke-width="2"/>
      <rect x="56" y="140" width="46" height="62" fill="#9a5a34" stroke="#5b3a22" stroke-width="3"/><path d="M79,140 v62" stroke="#5b3a22" stroke-width="2"/><path d="M152,150 q20,-30 40,0 v52 h-40z" fill="#8a6a4a" stroke="#5b3a22" stroke-width="3"/><rect x="150" y="84" width="22" height="30" fill="#6f7d86" stroke="#5b3a22" stroke-width="3"/><path d="M140,118 h74" stroke="#4a3a2a" stroke-width="3"/>
      ${[148, 166, 184, 200].map((x) => `<circle cx="${x}" cy="110" r="8" fill="#5d8a45"/>`).join('')}<circle cx="24" cy="94" r="14" fill="#6c9a50"/><circle cx="210" cy="190" r="10" fill="#6c9a50"/><circle cx="118" cy="190" r="9" fill="#6c9a50"/></svg>`,
    post: `<svg width="60" height="205" viewBox="0 0 60 205"><rect x="22" y="0" width="16" height="190" rx="3" fill="#c98f52" stroke="#2a1c10" stroke-width="3"/><path d="M8,198 l6,-20 l5,14 l5,-18 l5,18 l6,-16 l5,14 l6,-12 l4,20z" fill="#6fae3c" stroke="#3d6b20" stroke-width="1.5"/></svg>`,
    signTop: `<svg width="142" height="50" viewBox="0 0 142 50"><path d="M4,4 h106 l28,21 l-28,21 h-106z" fill="#f3e3b8" stroke="#2a1c10" stroke-width="3.5" stroke-linejoin="round"/></svg>`,
    signBot: `<svg width="142" height="46" viewBox="0 0 142 46"><path d="M138,4 h-106 l-28,19 l28,19 h106z" fill="#f3e3b8" stroke="#2a1c10" stroke-width="3.5" stroke-linejoin="round"/></svg>`,
    camels: `<svg width="258" height="62" viewBox="0 0 258 62"><g transform="translate(0,18)"><path d="M3,44 L7,14 Q10,2 16,12 L20,44Z" fill="#2b1836"/><circle cx="11.5" cy="8" r="5" fill="#2b1836"/></g>${[0, 1, 2, 3].map((i) => camel(92 + i * 56, 8, 0.66, '#2b1836', '#2b1836')).join('')}</svg>`,
    cloud: `<svg width="175" height="75" viewBox="0 0 175 75"><defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef4fb"/><stop offset="1" stop-color="#8fa8c8"/></linearGradient></defs><path d="M30,62 Q4,62 6,42 Q8,26 30,28 Q34,8 60,10 Q74,-4 98,6 Q124,0 132,22 Q164,20 168,42 Q170,62 142,62Z" fill="url(#cg)" stroke="#7f95b3" stroke-width="1.5"/></svg>`,
    city: `<svg width="215" height="265" viewBox="0 0 215 265"><defs><filter id="rough2"><feTurbulence baseFrequency=".05" numOctaves="2" seed="5"/><feDisplacementMap in="SourceGraphic" scale="10"/></filter></defs><path d="M20,120 Q100,90 200,130 L208,250 Q110,268 14,240Z" fill="#eadfd0" filter="url(#rough2)"/>
      ${box(78, 6, 56, 92, '#c9805e', win(88, 20) + win(112, 20) + win(100, 50))}${box(40, 48, 50, 60, '#f1e9dc', win(52, 60) + win(70, 60))}${box(120, 66, 60, 60, '#f1e9dc', win(132, 78) + win(156, 78))}${box(16, 100, 62, 70, '#d99a78', win(28, 114) + win(52, 114))}${box(74, 108, 70, 64, '#f4ede2', win(88, 122) + win(116, 122))}${box(140, 120, 58, 74, '#cf8a66', win(152, 134) + win(176, 134))}${box(30, 166, 70, 70, '#f1e9dc', win(44, 180) + win(72, 180))}${box(98, 170, 64, 76, '#d99a78', `<rect x="122" y="212" width="14" height="34" fill="#8a4a2c"/>`)}${box(158, 190, 46, 60, '#f4ede2', win(172, 204))}</svg>`,
    woman: `<svg width="178" height="122" viewBox="0 0 178 122"><path d="M52,104 Q120,90 176,108 L150,120 Q90,124 44,118Z" fill="#b98a6a" stroke="#8a6248"/><path d="M12,112 Q4,60 34,30 Q36,6 54,6 Q72,8 70,32 Q96,60 92,112Z" fill="#c69372" stroke="#8a6248" stroke-width="1.5"/><path d="M40,34 Q54,44 68,34" stroke="#a57658" fill="none" stroke-width="2"/></svg>`,
    man: `<svg width="100" height="132" viewBox="0 0 100 132"><ellipse cx="50" cy="124" rx="46" ry="7" fill="#b98a6a"/><path d="M10,120 Q30,104 76,112 Q96,118 88,128 L14,128Z" fill="#3f6fa8"/><path d="M22,112 Q12,60 34,38 L58,36 Q74,60 70,112Z" fill="#f3f3f1" stroke="#b9b9b4"/><circle cx="42" cy="22" r="14" fill="#d6a47c"/><path d="M27,18 Q30,2 46,4 Q58,6 57,18Z" fill="#2b2b33"/><path d="M58,52 L78,30 L84,18 L90,22 L86,36 L68,66Z" fill="#f3f3f1" stroke="#b9b9b4"/><path d="M80,20 l4,-12 l6,2 l-2,14z" fill="#d6a47c"/><path d="M52,56 L70,38 L76,26 L80,30 L76,42 L60,68Z" fill="#fafaf8" stroke="#b9b9b4"/></svg>`,
    kaaba: `<svg width="200" height="172" viewBox="0 0 200 172">${kaaba(0, 0, 200, 172)}</svg>`,
    food: `<svg width="196" height="168" viewBox="0 0 196 168"><ellipse cx="98" cy="118" rx="96" ry="48" fill="#b9aea0" stroke="#7d7468" stroke-width="3"/><ellipse cx="98" cy="114" rx="88" ry="42" fill="#d8d0c4"/>
      <path d="M60,40 q20,-34 52,-24 q26,10 20,40 q-40,16 -72,-16z" fill="#ead29a" stroke="#b8975a" stroke-width="2"/><path d="M72,30 l40,22 M92,18 l26,30" stroke="#c9a868" stroke-width="2"/>
      ${[[40, 78, 30, '#7fae4a', '#4d7a2c'], [152, 76, 30, '#d9772e', '#a84a18'], [98, 88, 22, '#f4f1ea', '#cfcabd'], [58, 128, 38, '#e2622a', '#b0401a'], [140, 130, 38, '#e9b63a', '#c18a1e']].map(([x, y, r, c, d]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.62}" fill="#f6f2ea" stroke="#9a9186" stroke-width="2.5"/><ellipse cx="${x}" cy="${y - 2}" rx="${r * 0.82}" ry="${r * 0.48}" fill="${c}"/><circle cx="${x - r * 0.3}" cy="${y - 4}" r="${r * 0.14}" fill="${d}"/><circle cx="${x + r * 0.25}" cy="${y}" r="${r * 0.14}" fill="${d}"/><circle cx="${x}" cy="${y - 8}" r="${r * 0.1}" fill="#4d7a2c"/>`).join('')}</svg>`,
    soldier: `<svg width="166" height="218" viewBox="0 0 190 250"><g fill="#0c0c0e"><path d="M84,30 Q88,6 120,8 Q150,10 154,28 L164,34 L84,36Z"/><ellipse cx="120" cy="52" rx="27" ry="30"/><rect x="104" y="74" width="32" height="26"/><path d="M60,104 Q120,84 172,108 Q190,170 188,250 L22,250 Q22,170 30,128 Q36,108 60,104Z"/><path d="M36,132 L6,96 L20,84 L62,112Z"/><path d="M8,98 L74,44 L88,52 L24,108Z"/><path d="M70,46 l22,-8 l6,12 l-22,8z"/></g><path d="M168,168 l12,-10 v8 l-12,10z M168,182 l12,-10 v8 l-12,10z" fill="#d9d9d9"/></svg>`,
  };

  // [id, x, y, t0, dur, kind]  kind: pop | wipe | drop
  const ITEMS = [
    ['caravan', 60, 115, 1.5, 1.5, 'wipe'], ['post', 332, 432, 3.75, 0.7, 'drop'], ['signTop', 300, 432, 3.8, 0.5, 'pop'], ['signBot', 284, 490, 4.0, 0.5, 'pop'],
    ['camels', 238, 644, 4.3, 0.55, 'wipe'], ['cloud', 490, 356, 4.05, 0.6, 'pop'], ['city', 478, 438, 5.0, 0.6, 'pop'], ['house', 18, 468, 7.7, 0.5, 'pop'], ['sun', 30, 354, 8.0, 0.6, 'pop'],
    ['man', 320, 900, 10.6, 0.4, 'pop'], ['woman', 150, 870, 10.85, 0.4, 'pop'], ['kaaba', 435, 830, 11.8, 1.0, 'pop'], ['food', 310, 1108, 17.05, 0.8, 'pop'], ['soldier', 4, 1062, 20.4, 0.5, 'pop'],
  ];
  const VERSES = [
    ['لِإِيلَٰفِ قُرَيْشٍ ۝١', 706, 116, 0.25, 1.7], ['إِۦلَٰفِهِمْ رِحْلَةَ ٱلشِّتَآءِ وَٱلصَّيْفِ ۝٢', 716, 296, 3.45, 1.5],
    ['فَلْيَعْبُدُوا۟ رَبَّ هَٰذَا ٱلْبَيْتِ ۝٣', 672, 760, 10.2, 0.55], ['ٱلَّذِىٓ أَطْعَمَهُم مِّن جُوعٍ وَءَامَنَهُم مِّنْ خَوْفٍۭ ۝٤', 692, 1046, 14.7, 0.65],
  ];
  const LABELS = [['اليمن', 300, 436, 142, 50, 6.1], ['بلاد الشام', 290, 492, 142, 46, 8.3]];

  function setup(stage) {
    // paper
    const cv = html('canvas', { width: W, height: H }, stage), g = cv.getContext('2d'), r = rng(4);
    Object.assign(cv.style, { position: 'absolute', left: 0, top: 0 });
    const gr = g.createRadialGradient(360, 520, 100, 360, 640, 900); gr.addColorStop(0, '#dcd3c2'); gr.addColorStop(1, '#c9c0ae'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const im = g.getImageData(0, 0, W, H); for (let i = 0; i < im.data.length; i += 4) { const n = (r() - 0.5) * 16; im.data[i] += n; im.data[i + 1] += n; im.data[i + 2] += n; } g.putImageData(im, 0, 0);
    g.strokeStyle = 'rgba(90,80,60,.35)'; g.lineWidth = 1; for (let i = 0; i < 260; i++) { const x = r() * W, y = r() * H, a = r() * 6.28, l = 2 + r() * 9; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l, y + Math.sin(a + 1) * l, x + Math.cos(a) * l * 2, y + Math.sin(a) * l * 2); g.stroke(); }

    const bas = html('div', { class: 'basmala', text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ' }, stage);
    const hd = html('div', { class: 'handle', text: '@' + HANDLE }, stage);
    const els = ITEMS.map(([id, x, y, t0, dur, kind]) => { const el = html('div', { class: 'el', html: ART[id] }, stage); el.style.left = x + 'px'; el.style.top = y + 'px'; return { el, t0, dur, kind }; });
    const rainEl = html('div', { class: 'el' }, stage); Object.assign(rainEl.style, { left: '500px', top: '425px', width: '180px', height: '150px', overflow: 'hidden' });
    const drops = []; for (let i = 0; i < 26; i++) { const d = html('div', {}, rainEl); Object.assign(d.style, { position: 'absolute', width: '3px', height: '9px', borderRadius: '2px', background: '#5f8fd0', left: 10 + r() * 150 + 'px' }); drops.push([d, r(), 0.7 + r() * 0.5]); }
    const labs = LABELS.map(([txt, x, y, w, h, t0]) => { const el = html('div', { class: 'el', text: txt, dir: 'rtl' }, stage); Object.assign(el.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', lineHeight: h + 'px', textAlign: 'center', font: '700 25px "Aref Ruqaa",Amiri,serif', color: '#1c130a' }); return { el, t0 }; });
    const vs = VERSES.map(([txt, right, y, t0, dur]) => { const el = html('div', { class: 'verse', text: txt }, stage); el.style.right = W - right + 'px'; el.style.top = y + 'px'; return { el, t0, dur }; });

    return {
      render(t) {
        bas.style.opacity = ease.outQuad(prog(t, 0.3, 1.2)).toFixed(3);
        hd.style.opacity = (0.9 * ease.outQuad(prog(t, 9, 10))).toFixed(3);
        els.forEach((e) => {
          const p = prog(t, e.t0, e.t0 + e.dur);
          e.el.style.visibility = p <= 0 ? 'hidden' : 'visible';
          if (e.kind === 'wipe') { e.el.style.clipPath = `inset(-10px -10px -10px ${(100 * (1 - ease.outQuad(p))).toFixed(1)}%)`; e.el.style.opacity = Math.min(1, p * 3).toFixed(3); }
          else if (e.kind === 'drop') { e.el.style.clipPath = `inset(0 0 ${(100 * (1 - ease.outQuad(p))).toFixed(1)}% 0)`; }
          else { const q = ease.outBack(Math.min(1, p * 1.4)); e.el.style.opacity = Math.min(1, p * 2.5).toFixed(3); e.el.style.transform = `scale(${(0.6 + 0.4 * q).toFixed(3)})`; e.el.style.filter = p < 1 ? `blur(${(4 * (1 - p)).toFixed(1)}px)` : 'none'; }
        });
        const ra = prog(t, 5.3, 5.9); rainEl.style.opacity = ra.toFixed(3);
        drops.forEach(([d, ph, sp]) => { d.style.top = (((ph + t * sp * 0.9) % 1) * 150).toFixed(1) + 'px'; });
        labs.forEach((l) => { const p = prog(t, l.t0, l.t0 + 0.45); l.el.style.opacity = p.toFixed(3); l.el.style.transform = `scale(${(0.7 + 0.3 * ease.outBack(p)).toFixed(3)})`; });
        vs.forEach((v) => { const p = ease.outQuad(prog(t, v.t0, v.t0 + v.dur)); v.el.style.visibility = p <= 0 ? 'hidden' : 'visible'; v.el.style.clipPath = `inset(-30px -30px -30px ${(100 * (1 - p)).toFixed(1)}%)`; });
      },
    };
  }

  const sounds = [{ t: 0.2, type: 'pad', dur: 24.6, gain: -22, notes: [146.83, 220, 293.66] },
    ...VERSES.map((v) => ({ t: v[3], type: 'swell', dur: 0.8, rise: 0.4, gain: -15, low: 90 })),
    ...ITEMS.map((i) => ({ t: i[3] + 0.05, type: 'pop', gain: -15, freq: 520 + (i[1] % 5) * 60 })), { t: 5.3, type: 'rain', dur: 3, gain: -30, density: 8, dropGain: -32 }];

  Reel.run({ id: 'quraysh', title: 'سورة قريش', width: W, height: H, duration: 25.19, fps: 30, background: '#d3cab9', loop: false,
    fonts: ['400 34px "Amiri Quran"', '700 28px "Aref Ruqaa"', '600 15px "Saira Condensed"', '700 20px Amiri'],
    original: '../../media/quraysh.m4a', preferOriginal: true, setup, sounds });
})();
