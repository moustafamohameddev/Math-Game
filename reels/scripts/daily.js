#!/usr/bin/env node
/* Daily reels.
 *   npm run daily                      -> today's video   (output/daily/<date>-<id>.mp4)
 *   npm run daily -- --date 2026-11-20 -> the video scheduled for that date
 *   npm run daily -- --id tawakkul     -> a specific script
 *   npm run daily -- --all             -> every script
 *   npm run daily -- --list            -> the schedule
 * The schedule starts at DAILY.start (daily/scripts.js) and cycles through the scripts. */
'use strict';
const { ROOT, args, need, path } = require('./lib');
const DAILY = require('../daily/scripts.js');

const DAY = 864e5;
const ymd = (d) => d.toISOString().slice(0, 10);
function forDate(dateStr) {
  const d = Date.parse(dateStr + 'T00:00:00Z');
  const i = Math.floor((d - Date.parse(DAILY.start + 'T00:00:00Z')) / DAY);
  const n = DAILY.scripts.length;
  return DAILY.scripts[((i % n) + n) % n];
}
function today(tz) {
  // date in the given IANA zone (default: Africa/Cairo)
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  return parts;
}

// Counter reels («مئة قطرة» type): every day a new dhikr × story-world combination.
const DHIKR = [['istighfar-100', 33], ['tasbih-33', 33], ['hamd-33', 33], ['salawat-50', 50], ['tahlil-33', 33]];
const WORLDS = ['palms', 'desert', 'lanterns', 'roses', 'tree'];
function counterFor(dateStr) {
  const i = Math.floor((Date.parse(dateStr + 'T00:00:00Z') - Date.parse('2026-11-12T00:00:00Z')) / DAY);
  const k = ((i % 25) + 25) % 25, d = DHIKR[k % 5], w = WORLDS[(k + Math.floor(k / 5) * 2) % 5];
  return { target: `qatra:${d[0]}@${w}@${d[1]}`, name: `${d[0].replace(/-\d+$/, '')}-${w}` };
}

(async () => {
  const a = args();
  if (a.counter) {
    need('ffmpeg');
    const { renderOne } = require('./render');
    const date = a.date || today(a.tz || 'Africa/Cairo'), c = counterFor(date);
    await renderOne(c.target, { out: path.join(ROOT, 'output', 'daily', `${date}-${c.name}.mp4`) });
    return;
  }
  const tz = a.tz || process.env.TZ_DAILY || 'Africa/Cairo';
  if (a.list) {
    const start = Date.parse(DAILY.start + 'T00:00:00Z');
    DAILY.scripts.forEach((s, i) => console.log(`${ymd(new Date(start + i * DAY))}  ${String(i + 1).padStart(2)}  ${s.id.padEnd(16)} ${s.template.padEnd(12)} ${s.title}`));
    console.log(`\n${DAILY.scripts.length} scripts — the list repeats after ${ymd(new Date(start + DAILY.scripts.length * DAY))}`);
    return;
  }
  need('ffmpeg');
  const { renderOne } = require('./render');
  const outDir = path.join(ROOT, 'output', 'daily');
  let jobs;
  if (a.all) jobs = DAILY.scripts.map((s, i) => ({ s, file: `${String(i + 1).padStart(2, '0')}-${s.id}.mp4` }));
  else if (a.id) {
    const s = DAILY.scripts.find((x) => x.id === a.id);
    if (!s) { console.error(`No script "${a.id}". Use --list.`); process.exit(1); }
    jobs = [{ s, file: `${s.id}.mp4` }];
  } else {
    const date = a.date || today(tz);
    const s = forDate(date);
    jobs = [{ s, file: `${date}-${s.id}.mp4` }];
  }
  for (const j of jobs) await renderOne(`daily:${j.s.id}`, { out: path.join(outDir, j.file), fps: a.fps });
})().catch((e) => { console.error(e); process.exit(1); });
