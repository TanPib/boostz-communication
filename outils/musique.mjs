// Composes a short original lo-fi track for a post and writes it as a WAV file.
//
//   node outils/musique.mjs <style> <seconds> <out.wav>
//
// Everything is synthesised here, so no third-party audio ever reaches a post.
// The sound is lo-fi hip-hop (asked on 06/10/2026: the previous tracks all
// sounded alike and not "low-fi" enough): a slow swung groove, jazzy ninth
// chords in rootless voicings, a dusty boom-bap kit, a sparse melodic line,
// then the tape and vinyl treatment that makes it lo-fi: drums crushed and
// low-passed, the music ducked under the kick, wow and flutter, a dark master
// filter, vinyl crackle and hiss. Each style picks its own tempo, chords, lead
// instrument, kit and amount of dust, so the posts don't all sound the same.
// The mix is normalised to about -18 LUFS with fades by ffmpeg (mixer.sh).
import fs from 'fs';

const [style, secondsArg, out] = process.argv.slice(2);
if (!style || !secondsArg || !out) throw new Error('usage: node outils/musique.mjs <style> <seconds> <out.wav>');
const SR = 44100;
const DUR = Number(secondsArg) + 1.5; // room for the reverb tail; trimmed when mixing
const N = Math.ceil(DUR * SR);

const midi = (n) => 440 * 2 ** ((n - 69) / 12);
const NOTE = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
const QUAL = {
  maj7: [0, 4, 7, 11], maj9: [0, 4, 7, 11, 14], m7: [0, 3, 7, 10], m9: [0, 3, 7, 10, 14], m11: [0, 3, 7, 10, 14, 17],
  '7': [0, 4, 7, 10], '9': [0, 4, 7, 10, 14], '13': [0, 4, 10, 14, 21], '7b9': [0, 4, 7, 10, 13], '6': [0, 4, 7, 9], '69': [0, 4, 7, 9, 14],
  sus: [0, 5, 7, 10], add9: [0, 4, 7, 14], madd9: [0, 3, 7, 14], m7b5: [0, 3, 6, 10], '': [0, 4, 7], m: [0, 3, 7],
};
const chord = (name) => { const [, r, q] = name.match(/^([A-G][b#]?)(.*)$/); if (!QUAL[q]) throw new Error(`unknown chord ${name}`); return { root: NOTE[r], tones: QUAL[q], minor: q.startsWith('m') && !q.startsWith('maj') }; };

// lead: rhodes | felt | guitar | vibes | musicbox | chip. kit: boombap | halftime | brushes.
// swing: how late the off-beat 16ths fall. cut: master low-pass (Hz). dust: crackle and hiss.
const STYLES = {
  lancement:   { bpm: 84, prog: ['Fmaj9', 'Am9', 'Dm9', 'C69'], lead: 'rhodes', kit: 'boombap', swing: .22, cut: 5200, dust: .6 },
  combattant:  { bpm: 88, prog: ['Cmaj9', 'A7b9', 'Dm9', 'G13'], lead: 'chip', kit: 'boombap', swing: .18, cut: 5600, dust: .5 },
  lorcana:     { bpm: 76, prog: ['Dmaj9', 'Bm9', 'Gmaj9', 'A13'], lead: 'musicbox', kit: 'brushes', swing: .2, cut: 4800, dust: .7 },
  etat:        { bpm: 80, prog: ['Ebmaj9', 'Cm9', 'Fm9', 'Bb13'], lead: 'felt', kit: 'boombap', swing: .24, cut: 4600, dust: .7 },
  blackfriday: { bpm: 86, prog: ['Am9', 'D9', 'Gmaj9', 'Cmaj9'], lead: 'guitar', kit: 'boombap', swing: .2, cut: 5400, dust: .5 },
  dracaufeu:   { bpm: 78, prog: ['Em9', 'Cmaj9', 'Am9', 'B7b9'], lead: 'rhodes', kit: 'halftime', swing: .2, cut: 4800, dust: .6 },
  tigre:       { bpm: 72, prog: ['Amadd9', 'Fmaj9', 'Dm9', 'E7b9'], lead: 'guitar', kit: 'brushes', swing: .26, cut: 4400, dust: .8 },
  halloween:   { bpm: 74, prog: ['Am9', 'Fmaj7', 'Dm9', 'E7b9'], lead: 'musicbox', kit: 'halftime', swing: .22, cut: 4000, dust: 1 },
  sortie:      { bpm: 86, prog: ['Cmaj9', 'Em9', 'Fmaj9', 'G13'], lead: 'vibes', kit: 'boombap', swing: .2, cut: 5800, dust: .5 },
  erreurs:     { bpm: 82, prog: ['Fmaj9', 'Dm9', 'Bbmaj9', 'C13'], lead: 'felt', kit: 'boombap', swing: .22, cut: 5000, dust: .7 },
  lexique:     { bpm: 78, prog: ['Gmaj9', 'Em9', 'Am9', 'D13'], lead: 'rhodes', kit: 'brushes', swing: .24, cut: 5000, dust: .6 },
  echange:     { bpm: 84, prog: ['Dmaj9', 'F#m9', 'Bm9', 'A13'], lead: 'guitar', kit: 'boombap', swing: .2, cut: 5400, dust: .5 },
  noel:        { bpm: 80, prog: ['Cmaj9', 'Am9', 'Dm9', 'G13'], lead: 'vibes', kit: 'brushes', swing: .2, cut: 5200, dust: .8 },
  protege:     { bpm: 76, prog: ['Ebmaj9', 'Gm9', 'Abmaj9', 'Bb69'], lead: 'felt', kit: 'brushes', swing: .24, cut: 4600, dust: .7 },
  contrefacon: { bpm: 80, prog: ['Gm9', 'Ebmaj9', 'Cm9', 'D7b9'], lead: 'guitar', kit: 'halftime', swing: .22, cut: 4400, dust: .8 },
  records:     { bpm: 86, prog: ['Fmaj9', 'Dm9', 'Gm9', 'C13'], lead: 'rhodes', kit: 'boombap', swing: .2, cut: 5600, dust: .5 },
  nouvelan:    { bpm: 82, prog: ['Gmaj9', 'Bm9', 'Cmaj9', 'D13'], lead: 'vibes', kit: 'boombap', swing: .2, cut: 5600, dust: .6 },
};
const S = STYLES[style];
if (!S) throw new Error(`unknown style ${style}: ${Object.keys(STYLES).join(', ')}`);
const BEAT = 60 / S.bpm, BAR = 4 * BEAT, SIX = BEAT / 4;
// A 16th-note step on the swung grid.
const step = (bar, s) => bar * BAR + s * SIX + (s % 2 ? S.swing * SIX : 0);

// Deterministic noise seeded by the style, so the same command gives the same file.
let seed = [...style].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const hum = (ms) => rnd() * ms / 1000;

const bus = () => [new Float32Array(N), new Float32Array(N)];
const MUS = bus(), DRM = bus();
const add = ([L, R], t0, buf, pan = 0, gain = 1) => {
  const i0 = Math.floor(t0 * SR), gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < buf.length && i0 + i < N; i++) if (i0 + i >= 0) { L[i0 + i] += buf[i] * gl; R[i0 + i] += buf[i] * gr; }
};
const lowpass = (b, hz) => { const k = 1 - Math.exp(-2 * Math.PI * hz / SR); let y = 0; for (let i = 0; i < b.length; i++) { y += k * (b[i] - y); b[i] = y; } return b; };
const highpass = (b, hz) => { const k = 1 - Math.exp(-2 * Math.PI * hz / SR); let y = 0; for (let i = 0; i < b.length; i++) { y += k * (b[i] - y); b[i] -= y; } return b; };
const tail = (t, len, rel) => (t < len ? 1 : Math.max(0, 1 - (t - len) / rel));

// Instruments. Each returns a mono buffer starting at the note.
const rhodes = (f, len, vel) => { // FM tine, warm, with a slow tremolo
  const n = Math.floor((len + 1) * SR), b = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR, idx = 1.6 * Math.exp(-t * 5) + .25;
    b[i] = vel * Math.exp(-t * 1.1) * Math.min(1, t / .004) * tail(t, len, .5) * (1 + .18 * Math.sin(2 * Math.PI * 4.6 * t))
      * (Math.sin(2 * Math.PI * f * t + idx * Math.sin(2 * Math.PI * f * t)) + .3 * Math.sin(2 * Math.PI * f * 1.002 * t)); }
  return lowpass(b, 3200);
};
const felt = (f, len, vel) => { // felt piano: soft hammer, highs dying fast
  const n = Math.floor((len + 1.2) * SR), b = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR; let s = 0;
    for (let h = 1; h <= 5; h++) s += Math.sin(2 * Math.PI * f * h * 1.0006 ** h * t) * Math.exp(-t * (1.4 + h * 1.6)) / h;
    b[i] = vel * s * Math.min(1, t / .008) * tail(t, len, .6); }
  return lowpass(b, 2400);
};
const guitar = (f, len, vel) => { // Karplus-Strong nylon pluck
  const n = Math.floor((len + .9) * SR), b = new Float32Array(n), p = Math.max(2, Math.round(SR / f)), ring = new Float32Array(p);
  for (let i = 0; i < p; i++) ring[i] = rnd() * .8;
  let j = 0;
  for (let i = 0; i < n; i++) { const next = (j + 1) % p, v = ring[j]; ring[j] = .4985 * (v + ring[next]); j = next; b[i] = vel * v * tail(i / SR, len, .4); }
  return lowpass(b, 2800);
};
const vibes = (f, len, vel) => {
  const n = Math.floor((len + 1.4) * SR), b = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR;
    b[i] = vel * Math.exp(-t * 1.6) * Math.min(1, t / .003) * (1 + .22 * Math.sin(2 * Math.PI * 5.5 * t)) * (Math.sin(2 * Math.PI * f * t) + .25 * Math.sin(2 * Math.PI * f * 4 * t) * Math.exp(-t * 6)); }
  return lowpass(b, 3600);
};
const musicbox = (f, len, vel) => {
  const n = Math.floor(1.6 * SR), b = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR; b[i] = vel * Math.exp(-t * 3) * Math.min(1, t / .002) * (Math.sin(2 * Math.PI * f * t) + .45 * Math.sin(2 * Math.PI * f * 3 * t) * Math.exp(-t * 7)); }
  return lowpass(b, 3800);
};
const chip = (f, len, vel) => { // a soft pulse, like an old handheld through a tape
  const n = Math.floor((len + .1) * SR), b = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR, ph = (f * t * (1 + .004 * Math.sin(2 * Math.PI * 5 * t))) % 1; b[i] = vel * (ph < .3 ? .7 : -.3) * Math.min(1, t / .006) * Math.exp(-t * 2.2) * tail(t, len, .08); }
  return lowpass(b, 1800);
};
const LEAD = { rhodes, felt, guitar, vibes, musicbox, chip };
const keys = S.lead === 'guitar' || S.lead === 'chip' || S.lead === 'musicbox' ? rhodes : LEAD[S.lead]; // who plays the chords
const bassNote = (f, len, vel) => { // round upright-ish bass, a little slide into the note
  const n = Math.floor((len + .25) * SR), b = new Float32Array(n); let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / SR; ph += 2 * Math.PI * f * (1 - .03 * Math.exp(-t * 30)) / SR;
    b[i] = vel * Math.min(1, t / .012) * Math.exp(-t * 1.4) * tail(t, len, .12) * (Math.sin(ph) + .25 * Math.sin(2 * ph) + .08 * Math.sin(3 * ph)); }
  return lowpass(b, 700);
};

// The dusty kit.
const kick = (vel) => {
  const n = Math.floor(.4 * SR), b = new Float32Array(n); let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / SR; ph += 2 * Math.PI * (46 + 80 * Math.exp(-t * 30)) / SR; b[i] = vel * (Math.sin(ph) * Math.exp(-t * 7.5) + .25 * rnd() * Math.exp(-t * 200)); }
  return lowpass(b, 1800);
};
const snare = (vel, brush = false) => {
  const n = Math.floor((brush ? .32 : .25) * SR), b = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR;
    b[i] = vel * (rnd() * Math.exp(-t * (brush ? 11 : 16)) * (brush ? Math.min(1, t / .02) : 1) + (brush ? 0 : .5 * Math.sin(2 * Math.PI * 185 * t) * Math.exp(-t * 28))); }
  return lowpass(highpass(b, brush ? 900 : 350), brush ? 4200 : 5200);
};
const hat = (vel, open = false) => {
  const n = Math.floor((open ? .3 : .07) * SR), b = new Float32Array(n);
  for (let i = 0; i < n; i++) b[i] = vel * rnd() * Math.exp(-(i / SR) * (open ? 9 : 55));
  return lowpass(highpass(b, 4500), 9000);
};
const KITS = { // 16 steps a bar: kick, snare, ghost snare, hats
  boombap:  { k: [0, 7, 10], s: [4, 12], g: [15], h: [0, 2, 4, 6, 8, 10, 12, 14] },
  halftime: { k: [0, 11], s: [8], g: [14], h: [0, 2, 4, 6, 8, 10, 12, 14] },
  brushes:  { k: [0, 10], s: [4, 12], g: [7, 15], h: [0, 2, 3, 4, 6, 8, 10, 11, 12, 14] },
};

// The song: one bar per chord, an intro bar without drums on longer tracks, and a
// sparse two-bar phrase that comes back with variations.
const bars = Math.ceil(DUR / BAR);
const kickTimes = [];
const scale = chord(S.prog[0]).minor ? [0, 3, 5, 7, 10] : [0, 2, 4, 7, 9];
const tonic = chord(S.prog[0]).root;
const phrase = Array.from({ length: 2 }, () => Array.from({ length: 8 }, () => (rnd() > .35 ? null : Math.floor((rnd() + 1) * 3.5))));
let prevVoicing = null;
for (let bar = 0; bar < bars; bar++) {
  const c = chord(S.prog[bar % S.prog.length]);
  // Rootless voicing kept close to the previous one (smooth voice leading).
  const tones = c.tones.length > 3 ? c.tones.filter((x) => x !== 0) : c.tones;
  let v = tones.map((x) => 57 + ((c.root + x) % 12)).map((n) => (n > 69 ? n - 12 : n)).sort((a, b) => a - b);
  if (prevVoicing) { const shift = Math.round((prevVoicing[0] - v[0]) / 12) * 12; if (Math.abs(shift) === 12) v = v.map((n) => n + shift); }
  prevVoicing = v;
  // Chords: laid back on beat 1, a softer push on the "and" of 2, slightly strummed.
  for (const [s, vel] of [[0, .11], [6, .07]]) v.forEach((n, j) => add(MUS, step(bar, s) + .018 + j * .014 + hum(6), keys(midi(n), s ? BEAT * 1.4 : BEAT * 1.9, vel * (1 + .12 * rnd())), (j - v.length / 2) * .18));
  // Bass: root, a syncopated push, the fifth before the next bar.
  const root = 36 + c.root + (c.root > 7 ? -12 : 0);
  add(MUS, step(bar, 0) + hum(5), bassNote(midi(root), BEAT * 1.6, .14));
  add(MUS, step(bar, 7) + hum(5), bassNote(midi(root), BEAT * .7, .09));
  add(MUS, step(bar, 12) + hum(5), bassNote(midi(root + 7), BEAT * .9, .1));
  // Lead: from the second bar, the phrase in the key's pentatonic, an octave up.
  if (bar > 0 && bar < bars - 1) {
    const p = phrase[bar % 2], lead = LEAD[S.lead];
    p.forEach((deg, k) => { if (deg == null || (bar % 4 === 3 && k > 4)) return;
      const n = 72 + tonic + scale[(deg + (bar % 4 === 2 ? 1 : 0)) % 5] - (tonic > 5 ? 12 : 0);
      add(MUS, step(bar, k * 2) + hum(8), lead(midi(n), BEAT * .8, .1 * (1 + .15 * rnd())), Math.sin(k + bar) * .35); });
  }
  // Drums.
  if (bar > 0 || DUR < 12) {
    const K = KITS[S.kit], brush = S.kit === 'brushes';
    for (const s of K.k) { const t = step(bar, s) + hum(4); add(DRM, t, kick(.42)); kickTimes.push(t); }
    for (const s of K.s) add(DRM, step(bar, s) + hum(6), snare(brush ? .16 : .22, brush), .05);
    for (const s of K.g) if (rnd() > -.2) add(DRM, step(bar, s) + hum(8), snare(.05, brush), .1);
    for (const s of K.h) add(DRM, step(bar, s) + hum(7), hat((s % 4 ? .1 : .14) * (1 + .3 * rnd()), s === 14 && bar % 4 === 3), .3);
  }
}

// Lo-fi treatment. Drums: crushed to 10 bits at a quarter rate, kept below 8 kHz.
for (const ch of DRM) { lowpass(ch, 7000); let hold = 0; for (let i = 0; i < N; i++) { if (i % 4 === 0) hold = Math.round(ch[i] * 512) / 512; ch[i] = hold; } lowpass(ch, 8000); }
// Music ducks under each kick, the "breathing" of a sidechained beat.
const duck = new Float32Array(N).fill(1);
for (const t of kickTimes) { const i0 = Math.floor(t * SR); for (let i = 0; i < .3 * SR && i0 + i < N; i++) if (i0 + i >= 0) duck[i0 + i] = Math.min(duck[i0 + i], 1 - .32 * Math.exp(-(i / SR) * 9)); }
const L = new Float32Array(N), R = new Float32Array(N);
for (let i = 0; i < N; i++) { L[i] = MUS[0][i] * duck[i] + DRM[0][i] * .9; R[i] = MUS[1][i] * duck[i] + DRM[1][i] * .9; }

// A small stereo reverb (four combs and two all-passes per side).
const reverb = (x, off) => {
  const y = new Float32Array(N);
  for (const dl of [1557, 1617, 1491, 1422].map((v) => v + off)) { const buf = new Float32Array(dl); let p = 0, lp = 0;
    for (let i = 0; i < N; i++) { const o = buf[p]; lp = o * .6 + lp * .4; buf[p] = x[i] + lp * .82; y[i] += o * .25; p = (p + 1) % dl; } }
  for (const dl of [556, 441].map((v) => v + off)) { const buf = new Float32Array(dl); let p = 0;
    for (let i = 0; i < N; i++) { const o = buf[p], v = y[i] + o * .5; buf[p] = v; y[i] = o - v * .5; p = (p + 1) % dl; } }
  return y;
};
const rl = reverb(L, 0), rr = reverb(R, 23);
for (let i = 0; i < N; i++) { L[i] += rl[i] * .3; R[i] += rr[i] * .3; }

// Tape: wow (slow) and flutter (fast) as a moving delay, then the dark master filter.
const tape = (x, ph) => {
  const y = new Float32Array(N);
  for (let i = 0; i < N; i++) { const t = i / SR, d = (.006 + .0022 * Math.sin(2 * Math.PI * .55 * t + ph) + .00035 * Math.sin(2 * Math.PI * 6.3 * t)) * SR, p = i - d, a = Math.floor(p), f = p - a;
    y[i] = a >= 0 && a + 1 < N ? x[a] * (1 - f) + x[a + 1] * f : 0; }
  lowpass(y, S.cut); return lowpass(y, S.cut * 1.6);
};
const TL = tape(L, 0), TR = tape(R, .4);
// Vinyl: sparse crackles and a soft hiss, both band-limited.
const crackle = new Float32Array(N), hiss = new Float32Array(N);
for (let i = 0; i < N; i++) { hiss[i] = rnd() * .006 * S.dust; if (rnd() > 1 - 2 * (7 * S.dust) / SR) { const a = rnd() * .09 * S.dust, len = 20 + Math.floor((rnd() + 1) * 60); for (let k = 0; k < len && i + k < N; k++) crackle[i + k] += a * Math.exp(-k / 8) * (k % 2 ? -1 : 1); } }
lowpass(highpass(hiss, 1200), 7000); lowpass(highpass(crackle, 700), 8000);
let peak = 0;
for (let i = 0; i < N; i++) { TL[i] += hiss[i] + crackle[i]; TR[i] += hiss[i] * .9 + crackle[i] * .8; peak = Math.max(peak, Math.abs(TL[i]), Math.abs(TR[i])); }

const pcm = Buffer.alloc(44 + N * 4);
pcm.write('RIFF', 0); pcm.writeUInt32LE(36 + N * 4, 4); pcm.write('WAVEfmt ', 8); pcm.writeUInt32LE(16, 16);
pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(2, 22); pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 4, 28);
pcm.writeUInt16LE(4, 32); pcm.writeUInt16LE(16, 34); pcm.write('data', 36); pcm.writeUInt32LE(N * 4, 40);
// A note outside its chord would turn every sample into NaN and the file into silence.
if (!(peak > 0) || !Number.isFinite(peak)) throw new Error(`style ${style}: the track is silent or invalid`);
const g = 1.1 / peak; // a touch of tape saturation through the tanh
for (let i = 0; i < N; i++) { pcm.writeInt16LE(Math.round(Math.tanh(TL[i] * g) * 30000), 44 + i * 4); pcm.writeInt16LE(Math.round(Math.tanh(TR[i] * g) * 30000), 46 + i * 4); }
fs.writeFileSync(out, pcm);
console.log(style, DUR.toFixed(1) + ' s ->', out);
