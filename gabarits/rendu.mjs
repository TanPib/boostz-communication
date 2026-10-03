// Renders a template page to PNG images or to an MP4.
//
//   node rendu.mjs <page.html> images                 every .p element -> sortie/<page>/<id>.png
//   node rendu.mjs <page.html> plans 0,2.5,7          a video page at those seconds -> sortie/<page>/plans/
//   node rendu.mjs <page.html> video                  a video page, 30 fps -> sortie/<page>.mp4
//
// Run it from this folder: every page loads fonts/, assets/, shots/ and
// posts-emblems.js by relative path. A video page exposes window.TOTAL (its
// length in seconds) and window.render(t), which draws the frame at time t and
// must be deterministic - the frames are captured one by one, not played.
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { pathToFileURL } from 'url';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const [file, mode = 'images', times = '0'] = process.argv.slice(2);
if (!file) throw new Error('usage: node rendu.mjs <page.html> images|plans|video [t1,t2]');
const name = path.basename(file, '.html');
const out = path.join('sortie', name);
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
// Wide enough for the 3240 px panoramic carousel; element screenshots crop to each slide.
const page = await browser.newPage({ viewport: mode === 'images' ? { width: 3240, height: 1920 } : { width: 1080, height: 1920 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(pathToFileURL(path.resolve(file)).href);
await page.evaluate(() => document.fonts.ready);
// The 16-bit mockup draws its text then pixelates it once the fonts are in.
await page.evaluate(() => window.pixelate && window.pixelate());
await page.waitForTimeout(800);

if (mode === 'images') {
  for (const el of await page.$$('.p')) {
    const id = await el.getAttribute('id');
    await el.screenshot({ path: path.join(out, `${id}.png`) });
  }
} else if (mode === 'plans') {
  fs.mkdirSync(path.join(out, 'plans'), { recursive: true });
  for (const t of times.split(',').map(Number)) {
    await page.evaluate((t) => window.render(t), t);
    await page.screenshot({ path: path.join(out, 'plans', `t${t}.png`) });
  }
} else {
  const frames = path.join(out, 'frames');
  fs.rmSync(frames, { recursive: true, force: true });
  fs.mkdirSync(frames, { recursive: true });
  const n = Math.round((await page.evaluate(() => window.TOTAL)) * 30);
  for (let i = 0; i < n; i++) {
    await page.evaluate((t) => window.render(t), i / 30);
    await page.screenshot({ path: path.join(frames, `f${String(i).padStart(4, '0')}.png`) });
  }
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', '30', '-i', path.join(frames, 'f%04d.png'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-preset', 'slow', '-movflags', '+faststart', `${out}.mp4`]);
  fs.rmSync(frames, { recursive: true, force: true });
}
console.log(errors.length ? errors : 'ok', '->', out);
await browser.close();
