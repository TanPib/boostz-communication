// Composes a short original track for a post and writes it as a WAV file.
//
//   node outils/musique.mjs <style> <seconds> <out.wav>
//
// Everything is synthesised here, so no third-party audio ever reaches a post.
// Each style is a soft, unhurried loop: a chord progression played by an
// electric piano and a pad, a round sine bass, quiet drums, and a melodic layer
// (bells, a music box or soft chiptune) that sets the mood of the post. The mix
// is normalised to about -18 LUFS with fades by ffmpeg afterwards (mixer.sh).
import fs from 'fs';

const [style, secondsArg, out] = process.argv.slice(2);
if (!style || !secondsArg || !out) throw new Error('usage: node outils/musique.mjs <style> <seconds> <out.wav>');
const SR = 44100;
const DUR = Number(secondsArg) + 1.5; // room for the reverb tail; trimmed when mixing
const N = Math.ceil(DUR * SR);
const L = new Float32Array(N), R = new Float32Array(N);

const midi = (n) => 440 * 2 ** ((n - 69) / 12);
const NOTE = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
const QUAL = { maj7: [0, 4, 7, 11], m7: [0, 3, 7, 10], m9: [0, 3, 7, 10, 14], '7': [0, 4, 7, 10], '9': [0, 4, 7, 10, 14], '6': [0, 4, 7, 9], sus: [0, 5, 7, 10], add9: [0, 4, 7, 14], madd9: [0, 3, 7, 14], '': [0, 4, 7], m: [0, 3, 7] };
const chord = (name) => { const [, r, q] = name.match(/^([A-G][b#]?)(.*)$/); return { root: NOTE[r], tones: QUAL[q] }; };

// Styles: tempo, progression (one chord per bar), key octave, and which layers play.
const STYLES = {
  lancement:   { bpm: 96, prog: ['Fmaj7', 'Am7', 'Dm7', 'Bbmaj7'], lead: 'bells', drums: 1, bright: 1 },
  combattant:  { bpm: 108, prog: ['C', 'Am', 'F', 'G'], lead: 'chip', drums: 1, bright: .8 },
  lorcana:     { bpm: 84, prog: ['Dmaj7', 'Bm7', 'Gmaj7', 'A6'], lead: 'musicbox', drums: .6, bright: .9 },
  etat:        { bpm: 86, prog: ['Ebmaj7', 'Cm7', 'Abmaj7', 'Bbsus'], lead: 'keys', drums: .9, bright: .7 },
  blackfriday: { bpm: 98, prog: ['Am7', 'D9', 'Gmaj7', 'Cmaj7'], lead: 'bells', drums: 1, bright: .8 },
  dracaufeu:   { bpm: 90, prog: ['Em9', 'Cmaj7', 'G', 'D'], lead: 'keys', drums: .8, bright: .8 },
  tigre:       { bpm: 80, prog: ['Amadd9', 'Fmaj7', 'C', 'G'], lead: 'musicbox', drums: .5, bright: .9 },
  halloween:   { bpm: 82, prog: ['Am', 'Fmaj7', 'Dm7', 'E'], lead: 'musicbox', drums: .5, bright: .7 },
  sortie:      { bpm: 100, prog: ['Cmaj7', 'Em7', 'Fmaj7', 'G6'], lead: 'bells', drums: 1, bright: 1 },
  erreurs:     { bpm: 104, prog: ['F', 'Dm', 'Bbmaj7', 'C'], lead: 'chip', drums: .9, bright: .8 },
  lexique:     { bpm: 88, prog: ['Gmaj7', 'Em7', 'Cmaj7', 'D6'], lead: 'keys', drums: .7, bright: .9 },
  echange:     { bpm: 92, prog: ['Dmaj7', 'F#m7', 'Gmaj7', 'A6'], lead: 'keys', drums: .9, bright: .9 },
  noel:        { bpm: 90, prog: ['Cmaj7', 'Am7', 'Fmaj7', 'G6'], lead: 'bells', drums: .6, bright: 1 },
  protege:     { bpm: 84, prog: ['Ebmaj7', 'Gm7', 'Abmaj7', 'Bb6'], lead: 'keys', drums: .6, bright: .8 },
  contrefacon: { bpm: 88, prog: ['Em7', 'Cmaj7', 'Am7', 'B'], lead: 'keys', drums: .8, bright: .7 },
  records:     { bpm: 96, prog: ['Fmaj7', 'Dm7', 'Bbmaj7', 'C6'], lead: 'bells', drums: 1, bright: 1 },
  nouvelan:    { bpm: 98, prog: ['Gmaj7', 'Bm7', 'Cmaj7', 'D6'], lead: 'bells', drums: 1, bright: 1 },
};
const S = STYLES[style];
if (!S) throw new Error(`unknown style ${style}: ${Object.keys(STYLES).join(', ')}`);
const BEAT = 60 / S.bpm, BAR = 4 * BEAT;

// Deterministic noise, so the same command always gives the same file.
let seed = 1234567;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

const add = (t0, buf, pan = 0, gain = 1) => {
  const i0 = Math.floor(t0 * SR), gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < buf.length && i0 + i < N; i++) if (i0 + i >= 0) { L[i0 + i] += buf[i] * gl; R[i0 + i] += buf[i] * gr; }
};
const env = (t, a, d, len, rel) => (t < a ? t / a : t < len ? Math.exp(-(t - a) / d) : Math.exp(-(len - a) / d) * Math.max(0, 1 - (t - len) / rel));

// Electric piano: a sine with a gentle FM bell on the attack.
const epiano = (f, len, vel) => {
  const n = Math.floor((len + .8) * SR), b = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR, mod = Math.sin(2 * Math.PI * f * 2 * t) * 1.2 * Math.exp(-t * 6);
    b[i] = vel * env(t, .005, 1.1, len, .6) * (Math.sin(2 * Math.PI * f * t + mod) + .15 * Math.sin(4 * Math.PI * f * t)); }
  return b;
};
// Pad: three detuned triangle-ish voices, low-passed, slow attack.
const pad = (f, len, vel) => {
  const n = Math.floor((len + 1) * SR), b = new Float32Array(n); let lp = 0;
  const k = 1 - Math.exp(-2 * Math.PI * (900 + 900 * S.bright) / SR);
  for (let i = 0; i < n; i++) { const t = i / SR; let s = 0;
    for (const d of [-.08, 0, .07]) { const ph = (f * (1 + d / 100 * 6) * t) % 1; s += 1 - 4 * Math.abs(ph - .5); }
    lp += k * (s / 3 - lp); b[i] = vel * lp * Math.min(1, t / .6) * (t < len ? 1 : Math.max(0, 1 - (t - len))); }
  return b;
};
const bass = (f, len, vel) => {
  const n = Math.floor((len + .2) * SR), b = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR; b[i] = vel * env(t, .01, .9, len, .15) * (Math.sin(2 * Math.PI * f * t) + .2 * Math.sin(4 * Math.PI * f * t)); }
  return b;
};
const bell = (f, vel) => {
  const n = Math.floor(2.2 * SR), b = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR; b[i] = vel * Math.exp(-t * 2.4) * Math.min(1, t / .003) * (Math.sin(2 * Math.PI * f * t) + .35 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t * 4) + .2 * Math.sin(2 * Math.PI * f * 5.4 * t) * Math.exp(-t * 8)); }
  return b;
};
const musicbox = (f, vel) => {
  const n = Math.floor(1.6 * SR), b = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR; b[i] = vel * Math.exp(-t * 3.2) * Math.min(1, t / .002) * (Math.sin(2 * Math.PI * f * t) + .5 * Math.sin(2 * Math.PI * f * 3 * t) * Math.exp(-t * 7)); }
  return b;
};
// Soft chiptune: a 25 % pulse through a low-pass, so it stays round.
const chip = (f, len, vel) => {
  const n = Math.floor((len + .05) * SR), b = new Float32Array(n); let lp = 0; const k = 1 - Math.exp(-2 * Math.PI * 2200 / SR);
  for (let i = 0; i < n; i++) { const t = i / SR, ph = (f * t) % 1; lp += k * ((ph < .25 ? 1 : -.33) - lp); b[i] = vel * lp * env(t, .004, .35, len, .05); }
  return b;
};
const kick = (vel) => {
  const n = Math.floor(.35 * SR), b = new Float32Array(n); let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / SR; ph += 2 * Math.PI * (48 + 70 * Math.exp(-t * 28)) / SR; b[i] = vel * Math.sin(ph) * Math.exp(-t * 9); }
  return b;
};
const hat = (vel) => {
  const n = Math.floor(.08 * SR), b = new Float32Array(n); let prev = 0;
  for (let i = 0; i < n; i++) { const t = i / SR, x = rnd(); b[i] = vel * (x - prev) * .5 * Math.exp(-t * 60); prev = x; }
  return b;
};
const snap = (vel) => { // a brushed rim instead of a snare
  const n = Math.floor(.2 * SR), b = new Float32Array(n); let lp = 0;
  for (let i = 0; i < n; i++) { const t = i / SR; lp += .35 * (rnd() - lp); b[i] = vel * (lp * Math.exp(-t * 22) + .3 * Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t * 30)); }
  return b;
};

const bars = Math.ceil(DUR / BAR);
for (let bar = 0; bar < bars; bar++) {
  const t0 = bar * BAR, c = chord(S.prog[bar % S.prog.length]);
  const base = 48 + c.root + (c.root > 6 ? -12 : 0); // keep chords between C3 and F#4
  const voicing = c.tones.slice(0, 4).map((x) => base + 12 + x);
  if (S.lead !== 'chip') {
    voicing.forEach((n, j) => add(t0, pad(midi(n), BAR, .035), j % 2 ? .4 : -.4));
    // Piano comping: on beat 1 and the "and" of 2, slightly strummed.
    for (const [b, v] of [[0, .13], [1.5, .09], [3, .06]]) voicing.forEach((n, j) => add(t0 + b * BEAT + j * .012, epiano(midi(n), BEAT * .9, v), (j - 1.5) * .2));
  } else {
    voicing.slice(0, 3).forEach((n, j) => add(t0, pad(midi(n), BAR, .04), j % 2 ? .4 : -.4));
  }
  // Bass: root on 1, fifth on the "and" of 3.
  add(t0, bass(midi(base - 12), BEAT * 2.2, .13));
  add(t0 + 2.5 * BEAT, bass(midi(base - 12 + 7), BEAT * 1.2, .09));
  // Melodic layer: an arpeggio over the chord, varied every other bar.
  const arp = [0, 1, 2, 3, 2, 1, 3, 2].map((k) => base + 24 + c.tones[k % c.tones.length]);
  if (S.lead === 'bells') arp.forEach((n, k) => { if (k % 2 === 0 || bar % 2) add(t0 + k * BEAT / 2, bell(midi(n), .13), k % 2 ? .5 : -.5); });
  if (S.lead === 'musicbox') arp.forEach((n, k) => add(t0 + k * BEAT / 2, musicbox(midi(n + (bar % 2 && k === 7 ? 2 : 0)), .14), Math.sin(k) * .6));
  if (S.lead === 'chip') arp.forEach((n, k) => add(t0 + k * BEAT / 2, chip(midi(n - 12), BEAT * .4, .12), k % 2 ? .3 : -.3));
  if (S.lead === 'keys') [0, 2, 1, 3].forEach((k, j) => add(t0 + (j * 2 + 1) * BEAT / 2, epiano(midi(base + 24 + c.tones[k]), BEAT * .6, .1), .3));
  // Drums: kick on 1 and 3 (plus a pickup), rim on 2 and 4, quiet off-beat hats.
  const d = S.drums;
  if (bar > 0 || DUR < 12) { // long tracks open with one bar of keys alone
    for (const b of [0, 2, 2.75]) add(t0 + b * BEAT, kick(.14 * d));
    for (const b of [1, 3]) add(t0 + b * BEAT, snap(.09 * d), .1);
    for (let k = 0; k < 8; k++) add(t0 + k * BEAT / 2 + (k % 2 ? BEAT * .06 : 0), hat((k % 2 ? .05 : .025) * d), .3);
  }
}

// A small stereo reverb (four combs and two all-passes per side), mixed low.
const reverb = (x, off) => {
  const y = new Float32Array(N);
  for (const dl of [1557, 1617, 1491, 1422].map((v) => v + off)) { const buf = new Float32Array(dl); let p = 0, lp = 0;
    for (let i = 0; i < N; i++) { const o = buf[p]; lp = o * .7 + lp * .3; buf[p] = x[i] + lp * .8; y[i] += o * .25; p = (p + 1) % dl; } }
  for (const dl of [556, 441].map((v) => v + off)) { const buf = new Float32Array(dl); let p = 0;
    for (let i = 0; i < N; i++) { const o = buf[p], v = y[i] + o * .5; buf[p] = v; y[i] = o - v * .5; p = (p + 1) % dl; } }
  return y;
};
const rl = reverb(L, 0), rr = reverb(R, 23);
let peak = 0;
for (let i = 0; i < N; i++) { L[i] += rl[i] * .28; R[i] += rr[i] * .28; peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); }

const pcm = Buffer.alloc(44 + N * 4);
pcm.write('RIFF', 0); pcm.writeUInt32LE(36 + N * 4, 4); pcm.write('WAVEfmt ', 8); pcm.writeUInt32LE(16, 16);
pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(2, 22); pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 4, 28);
pcm.writeUInt16LE(4, 32); pcm.writeUInt16LE(16, 34); pcm.write('data', 36); pcm.writeUInt32LE(N * 4, 40);
const g = .8 / peak;
for (let i = 0; i < N; i++) { pcm.writeInt16LE(Math.round(Math.tanh(L[i] * g) * 32000), 44 + i * 4); pcm.writeInt16LE(Math.round(Math.tanh(R[i] * g) * 32000), 46 + i * 4); }
fs.writeFileSync(out, pcm);
console.log(style, DUR.toFixed(1) + ' s ->', out);
