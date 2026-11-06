#!/usr/bin/env node
/* Side-by-side check against the source video: original | recreation | difference.
 *   npm run compare -- sabr path/to/original.mp4
 *   npm run compare -- sabr original.mp4 --times 0.5,1.2,3
 *   npm run compare -- sabr original.mp4 --from 0 --to 5 --step 0.25 --width 240
 * Writes compare/<id>.png */
'use strict';
const { ROOT, args, need, openScene, path, fs, spawn } = require('./lib');

function grab(video, t, file, w, h) {
  return new Promise((res, rej) => {
    const p = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(t), '-i', video, '-frames:v', '1', '-vf', `scale=${w}:${h}`, file]);
    p.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg failed at ' + t))));
  });
}

(async () => {
  need('ffmpeg');
  const a = args();
  const [id, video] = a._;
  if (!id || !video) {
    console.log('usage: npm run compare -- <scene-id> <original.mp4> [--times 1,2,3 | --from 0 --to 5 --step 0.5] [--width 240]');
    process.exit(1);
  }
  const { info, shot, close, page } = await openScene(id);
  let times;
  if (a.times) times = String(a.times).split(',').map(Number);
  else {
    const from = Number(a.from ?? 0), to = Number(a.to ?? info.duration - 0.05), step = Number(a.step ?? 1);
    times = [];
    for (let t = from; t <= to + 1e-6; t += step) times.push(+t.toFixed(4));
  }
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'reel-cmp-'));
  const rows = [];
  for (const t of times) {
    // BMP: ffmpeg's PNGs carry colour chunks that the browser would colour-manage
    const o = path.join(tmp, `o_${t}.bmp`), r = path.join(tmp, `r_${t}.png`);
    await grab(path.resolve(video), t, o, info.width, info.height);
    await shot(t, r);
    rows.push({ t, o: fs.readFileSync(o).toString('base64'), r: fs.readFileSync(r).toString('base64') });
  }
  const W = Number(a.width) || (info.width > info.height ? 420 : 240);
  const H = Math.round((W * info.height) / info.width);
  const cell = (b64, mime = 'png') => `<div class="c" style="width:${W}px;height:${H}px"><img src="data:image/${mime};base64,${b64}"></div>`;
  const htmlDoc = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;background:#222;font:12px monospace;color:#fff;display:flex;flex-wrap:wrap;gap:10px;padding:10px;width:max-content;max-width:${(W * 3 + 30) * 2 + 20}px}
    .row{display:flex;flex-direction:column;gap:3px}.trip{display:flex;gap:3px}
    .c{position:relative;overflow:hidden;background:#000}.c img{position:absolute;inset:0;width:100%;height:100%}
    .d img+img{mix-blend-mode:difference}</style>
    ${rows.map((r) => `<div class="row"><div>t=${r.t}s  original | recreation | diff</div><div class="trip">${cell(r.o, 'bmp')}${cell(r.r)}<div class="c d" style="width:${W}px;height:${H}px"><img src="data:image/bmp;base64,${r.o}"><img src="data:image/png;base64,${r.r}"></div></div></div>`).join('')}`;
  await page.setViewportSize({ width: 1600, height: 800 });
  await page.setContent(htmlDoc);
  const outDir = path.join(ROOT, 'compare');
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.resolve(a.out || path.join(outDir, `${id}.png`));
  await page.screenshot({ path: out, fullPage: true });
  await close();
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('wrote', path.relative(process.cwd(), out));
})().catch((e) => { console.error(e); process.exit(1); });
