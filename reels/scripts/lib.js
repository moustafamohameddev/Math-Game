/* Shared helpers for the Node scripts (render / compare / extract-audio). */
'use strict';
const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn, spawnSync } = require('child_process');
const { serve, ROOT } = require('../server');

const SCENES = ['alhamdulillah', 'sabr', 'yudabbir', 'istighfar', 'qatra'];

function args(argv = process.argv.slice(2)) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=');
      out[k] = v !== undefined ? v : (argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true);
    } else out._.push(a);
  }
  return out;
}

function need(cmd) {
  const r = spawnSync(cmd, ['-version'], { stdio: 'ignore' });
  if (r.error) {
    console.error(`\n✖ "${cmd}" is required but was not found in PATH. Install ffmpeg: https://ffmpeg.org/download.html\n`);
    process.exit(1);
  }
}

function loadPlaywright() {
  try {
    return require('playwright');
  } catch (e) {
    console.error('\n✖ This script needs Playwright:  npm install  (then: npx playwright install chromium)\n');
    process.exit(1);
  }
}

function startServer() {
  return new Promise((resolve) => {
    const srv = http.createServer(serve).listen(0, '127.0.0.1', () => resolve({ srv, port: srv.address().port }));
  });
}

/** Page path for a target: a scene id, or "daily:<script-id>" for a daily reel. */
function targetPath(id) {
  if (id.startsWith('qatra:')) { const [sid, story, count] = id.slice(6).split('@'); return `/scenes/qatra/index.html?s=${encodeURIComponent(sid)}${story ? '&story=' + story : ''}${count ? '&count=' + count : ''}&capture=1`; }
  if (id.startsWith('daily:')) return `/scenes/daily/index.html?s=${encodeURIComponent(id.slice(6))}&capture=1`;
  if (!SCENES.includes(id)) {
    console.error(`Unknown scene "${id}". Choose one of: ${SCENES.join(', ')}, or daily:<script-id>`);
    process.exit(1);
  }
  return `/scenes/${id}/index.html?capture=1`;
}

/** Open a scene in capture mode. Returns {page, info, close, shot(t, file)} */
async function openScene(id, { scale = 1 } = {}) {
  const { chromium } = loadPlaywright();
  const { srv, port } = await startServer();
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 400, height: 400 }, deviceScaleFactor: scale });
  page.on('pageerror', (e) => console.error('[page]', e.message));
  await page.goto(`http://127.0.0.1:${port}${targetPath(id)}`);
  await page.waitForFunction(() => window.__reelReady === true, null, { timeout: 60000 });
  const info = await page.evaluate(() => window.__reel.info);
  await page.setViewportSize({ width: info.width, height: info.height });
  const shot = async (t, file) => {
    await page.evaluate((tt) => window.__reel.seek(tt), t);
    return page.screenshot({ path: file, clip: { x: 0, y: 0, width: info.width, height: info.height }, type: 'png' });
  };
  const close = async () => { await browser.close(); srv.close(); };
  return { page, info, shot, close, port };
}

/** Run a command to completion (stdout/stderr inherited). */
function run(cmd, argv) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, argv, { stdio: ['ignore', 'inherit', 'inherit'] });
    p.on('error', reject);
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited with ${code}`))));
  });
}

module.exports = { SCENES, ROOT, args, need, loadPlaywright, openScene, startServer, run, path, fs, spawn };
