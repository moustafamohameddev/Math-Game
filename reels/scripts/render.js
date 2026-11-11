#!/usr/bin/env node
/* Export a reel to MP4, frame by frame.
 *   npm run render -- sabr
 *   npm run render -- sabr --audio original   (uses media/sabr.m4a)
 *   npm run render -- all
 *   npm run render -- daily:tawakkul          (one of the daily scripts)
 * Options: --fps 30  --audio synth|original|none  --out output/<id>.mp4 */
'use strict';
const { SCENES, ROOT, args, need, openScene, path, fs, spawn } = require('./lib');

async function renderOne(id, a = {}) {
  const { page, info, close } = await openScene(id);
  const fps = Number(a.fps) || info.fps;
  const frames = Math.round(info.duration * fps);
  const outDir = path.join(ROOT, 'output');
  fs.mkdirSync(outDir, { recursive: true });
  const name = id.replace(/^daily:/, 'daily-').replace(/^qatra:/, 'qatra-');
  const out = path.resolve(a.out && (!a._ || a._.length === 1) ? a.out : path.join(outDir, `${name}.mp4`));
  fs.mkdirSync(path.dirname(out), { recursive: true });

  // ---- audio track ----
  const mode = a.audio || 'synth';
  let audioFile = null;
  if (mode === 'synth') {
    const b64 = await page.evaluate(() => window.__reel.audioWav());
    audioFile = path.join(outDir, `${name}.synth.wav`);
    fs.writeFileSync(audioFile, Buffer.from(b64, 'base64'));
  } else if (mode === 'original') {
    const cand = ['m4a', 'mp3', 'wav'].map((e) => path.join(ROOT, 'media', `${id}.${e}`)).find((f) => fs.existsSync(f));
    if (!cand) console.warn(`! media/${id}.m4a not found — run: npm run extract-audio -- <video> ${id}. Rendering without audio.`);
    audioFile = cand || null;
  }

  // ---- video frames piped into ffmpeg ----
  const ff = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-'];
  if (audioFile) ff.push('-i', audioFile);
  ff.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-preset', 'medium');
  if (audioFile) ff.push('-c:a', 'aac', '-b:a', '192k', '-shortest');
  ff.push('-movflags', '+faststart', out);
  const proc = spawn('ffmpeg', ff, { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => proc.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg failed')))));

  const t0 = Date.now();
  for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => window.__reel.seek(t), i / fps);
    const png = await page.screenshot({ clip: { x: 0, y: 0, width: info.width, height: info.height }, type: 'png' });
    if (!proc.stdin.write(png)) await new Promise((r) => proc.stdin.once('drain', r));
    if (i % fps === 0) process.stdout.write(`\r${id}: frame ${i + 1}/${frames}`);
  }
  proc.stdin.end();
  await done;
  await close();
  if (audioFile && mode === 'synth') fs.unlinkSync(audioFile);
  console.log(`\r${id}: ${frames} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s -> ${path.relative(process.cwd(), out)}`);
}

module.exports = { renderOne };

if (require.main === module) {
  (async () => {
    need('ffmpeg');
    const a = args();
    const ids = !a._.length || a._[0] === 'all' ? SCENES : a._;
    for (const id of ids) await renderOne(id, a);
  })().catch((e) => { console.error(e); process.exit(1); });
}
