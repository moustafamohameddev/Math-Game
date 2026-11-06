/* Procedural sound effects (Web Audio API).
 * Each effect is generated from oscillators + filtered noise, so no audio
 * files are needed. Every function has the signature
 *   fx(ac, out, when, ev, offset)
 * ac      AudioContext or OfflineAudioContext
 * out     destination node
 * when    absolute ac time at which the event starts (already shifted by -offset)
 * ev      the event object from the scene ({t, type, gain, ...})
 * offset  seconds already elapsed into the event (when playback starts mid-event)
 * The same code drives live playback and offline rendering (MP4 export). */
(function (global) {
  'use strict';

  const noiseCache = new WeakMap();
  function noise(ac) {
    let b = noiseCache.get(ac);
    if (!b) {
      const len = Math.floor(ac.sampleRate * 2.5);
      b = ac.createBuffer(1, len, ac.sampleRate);
      const d = b.getChannelData(0);
      let s = 12345;
      for (let i = 0; i < len; i++) {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        d[i] = (s / 0x3fffffff) - 1;
      }
      noiseCache.set(ac, b);
    }
    return b;
  }
  function noiseSrc(ac, when, dur, offset = 0) {
    const src = ac.createBufferSource();
    src.buffer = noise(ac);
    src.loop = true;
    src.loopStart = 0;
    src.loopEnd = src.buffer.duration;
    const start = Math.max(when, ac.currentTime);
    src.start(start, (offset * 0.37 + Math.random() * 0.5) % 2);
    src.stop(start + Math.max(0.01, dur - offset) + 0.05);
    return src;
  }
  const db = (x) => Math.pow(10, x / 20);

  /** Hash a number into a stable pseudo-random value in [0,1). */
  function h(x) {
    const s = Math.sin(x * 12.9898 + 78.233) * 43758.5453;
    return s - Math.floor(s);
  }

  /** Envelope helper. points: [[time, value], ...] relative to `when`. */
  function env(param, when, points, offset = 0) {
    const t0 = when;
    param.cancelScheduledValues(0);
    let first = true;
    for (const [dt, v] of points) {
      const at = t0 + dt;
      if (first) { param.setValueAtTime(v, Math.max(0, at)); first = false; }
      else param.linearRampToValueAtTime(v, Math.max(0, at));
    }
  }

  const FX = {
    /** Short bright UI "blip" — pure sine at 1400 Hz (measured from the originals). */
    ping(ac, out, when, ev, offset) {
      if (offset > 0.05) return;
      const g = ac.createGain();
      const peak = db(ev.gain ?? -6);
      g.gain.setValueAtTime(0, when);
      g.gain.linearRampToValueAtTime(peak, when + 0.004);
      g.gain.exponentialRampToValueAtTime(peak * 0.06, when + 0.075);
      g.gain.exponentialRampToValueAtTime(0.0001, when + 0.13);
      const o = ac.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(ev.freq ?? 1400, when);
      o.connect(g).connect(out);
      o.start(when);
      o.stop(when + 0.16);
      // soft transient click on the attack
      const n = noiseSrc(ac, when, 0.03);
      const hp = ac.createBiquadFilter();
      hp.type = 'highpass'; hp.frequency.value = 2500;
      const ng = ac.createGain();
      ng.gain.setValueAtTime(peak * 0.25, when);
      ng.gain.exponentialRampToValueAtTime(0.0001, when + 0.025);
      n.connect(hp).connect(ng).connect(out);
    },

    /** Pencil tap / soft click used for every word that appears. */
    tick(ac, out, when, ev, offset) {
      if (offset > 0.03) return;
      const seed = (ev.t || 0) * 1000;
      const f = ev.freq ?? 1800 + h(seed) * 4200;
      const peak = db(ev.gain ?? -24);
      const dur = ev.dur ?? 0.035;
      const n = noiseSrc(ac, when, dur + 0.02);
      // broadband click: the originals spread energy over the whole spectrum
      const hp = ac.createBiquadFilter();
      hp.type = 'highpass'; hp.frequency.value = 500;
      const lp = ac.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = Math.min(16000, f * 2.4);
      const g = ac.createGain();
      g.gain.setValueAtTime(0, when);
      g.gain.linearRampToValueAtTime(peak, when + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      n.connect(hp).connect(lp).connect(g).connect(out);
    },

    /** Graphite scratch while a line is being drawn. */
    scribble(ac, out, when, ev, offset) {
      const dur = ev.dur ?? 0.4;
      if (offset >= dur) return;
      const peak = db(ev.gain ?? -34);
      const n = noiseSrc(ac, when, dur, offset);
      const bp = ac.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.value = ev.freq ?? 4200; bp.Q.value = 0.4;
      const g = ac.createGain();
      // stroke-like amplitude flutter
      const steps = Math.max(2, Math.round(dur / 0.05));
      g.gain.setValueAtTime(0, when);
      for (let i = 1; i <= steps; i++) {
        const tt = when + (dur * i) / steps;
        const v = i === steps ? 0 : peak * (0.45 + 0.55 * h(i + (ev.t || 0) * 77));
        g.gain.linearRampToValueAtTime(v, tt);
      }
      n.connect(bp).connect(g).connect(out);
    },

    /** Airy swell: noise rising through a sweeping filter, low body at the peak. */
    swell(ac, out, when, ev, offset) {
      const dur = ev.dur ?? 0.7;
      if (offset >= dur) return;
      const peak = db(ev.gain ?? -14);
      const rise = ev.rise ?? dur * 0.75;
      const n = noiseSrc(ac, when, dur, offset);
      const lp = ac.createBiquadFilter();
      lp.type = 'lowpass'; lp.Q.value = 1.2;
      lp.frequency.setValueAtTime(400, when);
      lp.frequency.exponentialRampToValueAtTime(9000, when + rise);
      lp.frequency.exponentialRampToValueAtTime(600, when + dur);
      const g = ac.createGain();
      g.gain.setValueAtTime(0, when);
      g.gain.linearRampToValueAtTime(peak, when + rise);
      g.gain.linearRampToValueAtTime(0, when + dur);
      n.connect(lp).connect(g).connect(out);
      // low body
      const o = ac.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(ev.low ?? 70, when);
      o.frequency.exponentialRampToValueAtTime((ev.low ?? 70) * 1.6, when + rise);
      const og = ac.createGain();
      og.gain.setValueAtTime(0.0001, when);
      og.gain.exponentialRampToValueAtTime(peak * (ev.body ?? 0.18), when + rise);
      og.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      o.connect(og).connect(out);
      o.start(Math.max(when, ac.currentTime));
      o.stop(when + dur + 0.05);
    },

    /** Quick whoosh (fast swell, brighter, shorter). */
    whoosh(ac, out, when, ev, offset) {
      FX.swell(ac, out, when, Object.assign({ dur: 0.45, rise: 0.22, low: 90, gain: -16 }, ev), offset);
    },

    /** Rain / soft hiss bed with random drops. */
    rain(ac, out, when, ev, offset) {
      const dur = ev.dur ?? 2;
      if (offset >= dur) return;
      const peak = db(ev.gain ?? -40);
      const fade = Math.min(0.25, dur / 4);
      const n = noiseSrc(ac, when, dur, offset);
      const hp = ac.createBiquadFilter();
      hp.type = 'highpass'; hp.frequency.value = ev.low ?? 900;
      const lp = ac.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = ev.high ?? 9000;
      const g = ac.createGain();
      env(g.gain, when, [[0, 0.0001], [fade, peak], [dur - fade, peak], [dur, 0.0001]]);
      n.connect(hp).connect(lp).connect(g).connect(out);
      // drops
      const drops = Math.round(dur * (ev.density ?? 9));
      for (let i = 0; i < drops; i++) {
        const dt = h(i * 3.1 + (ev.t || 0)) * dur;
        if (dt < offset) continue;
        FX.tick(ac, out, when + dt, { t: (ev.t || 0) + dt, gain: (ev.dropGain ?? -40) + h(i) * 6, dur: 0.02 }, 0);
      }
    },

    /** Constant soft ambience (room tone / night air). */
    bed(ac, out, when, ev, offset) {
      FX.rain(ac, out, when, Object.assign({ density: 0, gain: -40 }, ev), offset);
    },

    /** Twinkle: very soft high clicks, for sparkles / stars. */
    twinkle(ac, out, when, ev, offset) {
      const dur = ev.dur ?? 1;
      const n = Math.round(dur * (ev.density ?? 10));
      for (let i = 0; i < n; i++) {
        const dt = h(i * 7.7 + (ev.t || 0) * 3) * dur;
        if (dt < offset) continue;
        FX.tick(ac, out, when + dt, { t: (ev.t || 0) + dt, gain: (ev.gain ?? -40) + h(i * 2) * 5, freq: 6000 + h(i * 5) * 3500, dur: 0.02 }, 0);
      }
    },

    /** Soft pop for things that appear (flowers, icons). */
    pop(ac, out, when, ev, offset) {
      if (offset > 0.05) return;
      const peak = db(ev.gain ?? -22);
      const o = ac.createOscillator();
      o.type = 'sine';
      const f = ev.freq ?? 600;
      o.frequency.setValueAtTime(f * 0.6, when);
      o.frequency.exponentialRampToValueAtTime(f * 1.4, when + 0.06);
      const g = ac.createGain();
      g.gain.setValueAtTime(0, when);
      g.gain.linearRampToValueAtTime(peak, when + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, when + 0.09);
      o.connect(g).connect(out);
      o.start(when); o.stop(when + 0.12);
      FX.tick(ac, out, when, { t: ev.t, gain: (ev.gain ?? -22) - 4 }, 0);
    },

    /** Warm sustained pad (used when an original vocal track is not available). */
    pad(ac, out, when, ev, offset) {
      const dur = ev.dur ?? 4;
      if (offset >= dur) return;
      const peak = db(ev.gain ?? -24);
      const notes = ev.notes ?? [146.83, 220, 293.66];
      const g = ac.createGain();
      const a = Math.min(1.2, dur / 3);
      env(g.gain, when, [[0, 0.0001], [a, peak], [dur - a, peak], [dur, 0.0001]]);
      const lp = ac.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = ev.cutoff ?? 1400; lp.Q.value = 0.5;
      g.connect(lp).connect(out);
      notes.forEach((f, i) => {
        for (const det of [-4, 4]) {
          const o = ac.createOscillator();
          o.type = i === 0 ? 'triangle' : 'sine';
          o.frequency.value = f;
          o.detune.value = det;
          const og = ac.createGain();
          og.gain.value = 1 / (notes.length * 2);
          o.connect(og).connect(g);
          o.start(Math.max(when, ac.currentTime));
          o.stop(when + dur + 0.1);
        }
      });
    },
  };

  /** Schedule a list of events on a context. t0 = scene time at `ctxStart`. */
  function schedule(ac, out, events, t0, ctxStart) {
    for (const ev of events) {
      const fx = FX[ev.type];
      if (!fx) continue;
      const len = ev.dur ?? 0.2;
      if (ev.t + len < t0) continue;
      const offset = Math.max(0, t0 - ev.t);
      // For events already in progress `when` lies in the past; the effects
      // clamp their sources to ac.currentTime and the envelopes stay aligned.
      const when = ctxStart + (ev.t - t0);
      try {
        fx(ac, out, when, ev, offset);
      } catch (e) {
        console.warn('sfx error', ev, e);
      }
    }
  }

  /** Encode an AudioBuffer as a 16-bit PCM WAV (ArrayBuffer). */
  function toWav(buf) {
    const ch = buf.numberOfChannels, sr = buf.sampleRate, n = buf.length;
    const data = new DataView(new ArrayBuffer(44 + n * ch * 2));
    const W = (o, s) => { for (let i = 0; i < s.length; i++) data.setUint8(o + i, s.charCodeAt(i)); };
    W(0, 'RIFF'); data.setUint32(4, 36 + n * ch * 2, true); W(8, 'WAVE'); W(12, 'fmt ');
    data.setUint32(16, 16, true); data.setUint16(20, 1, true); data.setUint16(22, ch, true);
    data.setUint32(24, sr, true); data.setUint32(28, sr * ch * 2, true); data.setUint16(32, ch * 2, true);
    data.setUint16(34, 16, true); W(36, 'data'); data.setUint32(40, n * ch * 2, true);
    const chans = [];
    for (let c = 0; c < ch; c++) chans.push(buf.getChannelData(c));
    let o = 44;
    for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++) {
      const v = Math.max(-1, Math.min(1, chans[c][i]));
      data.setInt16(o, v < 0 ? v * 0x8000 : v * 0x7fff, true); o += 2;
    }
    return data.buffer;
  }

  global.SFX = { FX, schedule, toWav, db };
})(window);
