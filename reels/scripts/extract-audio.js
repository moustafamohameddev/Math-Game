#!/usr/bin/env node
/* Extract the soundtrack of a source video into media/<id>.m4a so the player's
 * "الصوت الأصلي" (original audio) option and `render --audio original` can use it.
 * The file stays on your machine (media/ is git-ignored).
 *   npm run extract-audio -- path/to/video.mp4 sabr */
'use strict';
const { ROOT, SCENES, args, need, run, path, fs } = require('./lib');

(async () => {
  need('ffmpeg');
  const [video, id] = args()._;
  if (!video || !id) {
    console.log(`usage: npm run extract-audio -- <video-file> <${SCENES.join('|')}>`);
    process.exit(1);
  }
  const dir = path.join(ROOT, 'media');
  fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, `${id}.m4a`);
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.resolve(video), '-vn', '-c:a', 'aac', '-b:a', '192k', out]);
  console.log('wrote', path.relative(process.cwd(), out));
})().catch((e) => { console.error(e.message); process.exit(1); });
