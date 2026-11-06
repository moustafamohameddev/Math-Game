/* Reel player: fixed-size stage scaled to the window, a deterministic
 * timeline (render(t) is a pure function of time), synced Web Audio SFX,
 * optional original soundtrack, and a capture API used by the Node scripts. */
(function (global) {
  'use strict';
  const { html, clamp } = global.R;

  const params = new URLSearchParams(location.search);
  const CAPTURE = params.has('capture');

  function fmt(t) {
    const s = Math.max(0, t);
    return `${Math.floor(s / 60)}:${(s % 60).toFixed(2).padStart(5, '0')}`;
  }

  class Reel {
    constructor(cfg) {
      this.cfg = Object.assign({ fps: 30, loop: true, background: '#000', fonts: [] }, cfg);
      this.t = clamp(parseFloat(params.get('t') || '0') || 0, 0, this.cfg.duration);
      this.playing = false;
      this.mode = params.get('sound') || 'synth';
      this.ac = null;
      this.bus = null;
      this.audioEl = null;
      this.hasOriginal = false;
    }

    async init() {
      const c = this.cfg;
      document.title = c.title || document.title;
      document.body.classList.add(CAPTURE ? 'capture' : 'interactive');
      this.viewport = html('div', { id: 'viewport' }, document.body);
      this.stage = html('div', { id: 'stage' }, this.viewport);
      Object.assign(this.stage.style, { width: c.width + 'px', height: c.height + 'px', background: c.background });

      // Fonts must be ready before the first frame so measurements are right.
      // Google Fonts split fonts by unicode-range, so load with Arabic + Latin
      // sample text or only the Latin subset would be fetched.
      const SAMPLE = 'aZ09 الحمد لله ٱلْأَرْضِ ﴿﴾ ١٠ …“”·';
      try {
        await Promise.all(c.fonts.map((f) => document.fonts.load(f, SAMPLE)));
        await document.fonts.ready;
      } catch (e) { /* offline: fall back to system fonts */ }

      this.scene = c.setup(this.stage, this) || {};
      this.sounds = (typeof c.sounds === 'function' ? c.sounds() : c.sounds || []).slice().sort((a, b) => a.t - b.t);

      if (!CAPTURE) this.buildUI();
      this.fit();
      addEventListener('resize', () => this.fit());
      this.render(this.t);

      global.__reel = {
        info: { width: c.width, height: c.height, duration: c.duration, fps: c.fps, id: c.id },
        seek: (t) => { this.t = t; this.render(t); return t; },
        audioWav: () => this.renderAudio(),
      };
      global.__reelReady = true;
      if (!CAPTURE && params.has('autoplay')) this.play();
    }

    fit() {
      const c = this.cfg;
      const barH = CAPTURE ? 0 : (this.bar ? this.bar.offsetHeight : 0);
      const W = innerWidth, H = innerHeight - barH;
      const s = CAPTURE ? 1 : Math.min(W / c.width, H / c.height);
      this.stage.style.transform = `scale(${s})`;
      this.stage.style.left = CAPTURE ? '0px' : (W - c.width * s) / 2 + 'px';
      this.stage.style.top = CAPTURE ? '0px' : (H - c.height * s) / 2 + 'px';
      this.viewport.style.height = H + 'px';
    }

    render(t) {
      this.t = t;
      if (this.scene.render) this.scene.render(t);
      if (this.timeEl) {
        this.timeEl.textContent = `${fmt(t)} / ${fmt(this.cfg.duration)}`;
        if (!this.scrubbing) this.range.value = String(t);
        this.playBtn.textContent = this.playing ? '❚❚' : '▶';
      }
    }

    // ---------------- audio ----------------
    ensureAudio() {
      if (!this.ac) {
        const AC = global.AudioContext || global.webkitAudioContext;
        this.ac = new AC({ latencyHint: 'interactive' });
        this.master = this.ac.createDynamicsCompressor();
        this.master.threshold.value = -3;
        this.master.ratio.value = 8;
        this.master.connect(this.ac.destination);
      }
      return this.ac;
    }

    startSound(t) {
      this.stopSound();
      if (this.mode === 'off') return;
      if (this.mode === 'original' && this.audioEl) {
        this.audioEl.currentTime = t;
        this.audioEl.play().catch(() => {});
        return;
      }
      const ac = this.ensureAudio();
      this.bus = ac.createGain();
      this.bus.connect(this.master);
      SFX.schedule(ac, this.bus, this.sounds, t, this.ctxStart);
    }

    stopSound() {
      if (this.bus) {
        const b = this.bus;
        try { b.gain.setTargetAtTime(0, this.ac.currentTime, 0.015); } catch (e) {}
        setTimeout(() => b.disconnect(), 120);
        this.bus = null;
      }
      if (this.audioEl) this.audioEl.pause();
    }

    async renderAudio() {
      const c = this.cfg, sr = 44100;
      const oac = new OfflineAudioContext(2, Math.ceil(sr * c.duration), sr);
      const comp = oac.createDynamicsCompressor();
      comp.threshold.value = -3; comp.ratio.value = 8;
      comp.connect(oac.destination);
      SFX.schedule(oac, comp, this.sounds, 0, 0);
      const buf = await oac.startRendering();
      const bytes = new Uint8Array(SFX.toWav(buf));
      let bin = '';
      for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
      return btoa(bin);
    }

    // ---------------- transport ----------------
    now() {
      if (!this.playing) return this.t;
      if (this.mode === 'original' && this.audioEl && !this.audioEl.paused) return this.audioEl.currentTime;
      if (this.ac && this.mode !== 'off') return this.startT + Math.max(0, this.ac.currentTime - this.ctxStart);
      return this.startT + (performance.now() - this.perfStart) / 1000;
    }

    play() {
      if (this.playing) return;
      if (this.t >= this.cfg.duration - 0.01) this.t = 0;
      if (this.overlay) this.overlay.remove(), (this.overlay = null);
      const ac = this.mode === 'synth' ? this.ensureAudio() : null;
      if (ac && ac.state !== 'running') ac.resume();
      this.startT = this.t;
      this.perfStart = performance.now();
      this.ctxStart = ac ? ac.currentTime + 0.06 : 0;
      this.playing = true;
      this.startSound(this.t);
      const loop = () => {
        if (!this.playing) return;
        let t = this.now();
        if (t >= this.cfg.duration) {
          if (this.loopOn) {
            this.playing = false; this.stopSound(); this.t = 0; this.play();
            return;
          }
          t = this.cfg.duration; this.pause();
        }
        this.render(t);
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
      this.render(this.t);
    }

    pause() {
      if (!this.playing) return;
      this.t = this.now();
      this.playing = false;
      cancelAnimationFrame(this.raf);
      this.stopSound();
      this.render(this.t);
    }

    seek(t) {
      const was = this.playing;
      if (was) this.pause();
      this.render(clamp(t, 0, this.cfg.duration));
      if (was) this.play();
    }

    setMode(m) {
      const was = this.playing;
      if (was) this.pause();
      this.mode = m;
      if (was) this.play();
    }

    // ---------------- UI ----------------
    buildUI() {
      const c = this.cfg;
      this.loopOn = c.loop;
      const bar = (this.bar = html('div', { id: 'bar', dir: 'ltr' }, document.body));
      const back = html('a', { class: 'btn', href: '../../index.html', title: 'كل الفيديوهات', text: '⌂' }, bar);
      back.setAttribute('aria-label', 'رجوع');
      this.playBtn = html('button', { class: 'btn', title: 'تشغيل / إيقاف (Space)' }, bar);
      this.playBtn.onclick = () => (this.playing ? this.pause() : this.play());
      const restart = html('button', { class: 'btn', title: 'من الأول', text: '⏮' }, bar);
      restart.onclick = () => this.seek(0);
      this.range = html('input', { type: 'range', min: 0, max: c.duration, step: 1 / c.fps, value: this.t }, bar);
      this.range.oninput = () => { this.scrubbing = true; this.seek(parseFloat(this.range.value)); };
      this.range.onchange = () => { this.scrubbing = false; };
      this.timeEl = html('span', { class: 'time' }, bar);

      const sel = html('select', { title: 'الصوت' }, bar);
      [['synth', '🔊 مؤثرات'], ['original', '🎵 الصوت الأصلي'], ['off', '🔇 بدون صوت']].forEach(([v, l]) => {
        const o = html('option', { value: v, text: l }, sel);
        if (v === this.mode) o.selected = true;
      });
      sel.onchange = () => this.setMode(sel.value);
      this.soundSel = sel;

      const loopBtn = html('button', { class: 'btn' + (this.loopOn ? ' on' : ''), title: 'تكرار', text: '⟲' }, bar);
      loopBtn.onclick = () => { this.loopOn = !this.loopOn; loopBtn.classList.toggle('on', this.loopOn); };
      const fs = html('button', { class: 'btn', title: 'ملء الشاشة', text: '⛶' }, bar);
      fs.onclick = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());

      // Original soundtrack (extracted locally with `npm run extract-audio`).
      const origOpt = sel.querySelector('option[value=original]');
      origOpt.disabled = true;
      origOpt.textContent = '🎵 الصوت الأصلي (غير متوفر)';
      if (c.original) {
        const a = new Audio();
        a.preload = 'auto';
        a.addEventListener('canplaythrough', () => {
          this.hasOriginal = true;
          origOpt.disabled = false;
          origOpt.textContent = '🎵 الصوت الأصلي';
          if (c.preferOriginal && this.mode === 'synth' && !params.get('sound')) { this.mode = 'original'; sel.value = 'original'; }
        }, { once: true });
        a.src = c.original;
        this.audioEl = a;
      }
      if (this.mode === 'original' && !this.hasOriginal) this.mode = c.original ? 'original' : 'synth';

      addEventListener('keydown', (e) => {
        if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;
        if (e.code === 'Space') { e.preventDefault(); this.playing ? this.pause() : this.play(); }
        else if (e.code === 'ArrowRight') this.seek(this.t + 1 / c.fps);
        else if (e.code === 'ArrowLeft') this.seek(this.t - 1 / c.fps);
        else if (e.code === 'Home') this.seek(0);
      });

      this.overlay = html('button', { id: 'overlay' }, this.viewport);
      html('span', { class: 'big', text: '▶' }, this.overlay);
      html('span', { text: 'اضغط للتشغيل مع الصوت' }, this.overlay);
      this.overlay.onclick = () => this.play();
    }
  }

  Reel.run = (cfg) => {
    const r = new Reel(cfg);
    const go = () => r.init().catch((e) => { console.error(e); document.body.textContent = 'Error: ' + e.message; });
    document.readyState === 'loading' ? addEventListener('DOMContentLoaded', go) : go();
    return r;
  };

  global.Reel = Reel;
})(window);
