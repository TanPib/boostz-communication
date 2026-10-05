// Films reel.html frame by frame under Playwright's fake clock, so the
// onboarding's own setInterval/Animated timers advance exactly 1/30 s per frame.
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import fs from 'fs';
const [mode = 'stills', list = '0'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
const errs = []; p.on('pageerror', (e) => errs.push(String(e))); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
await p.clock.install({ time: 0 });
await p.goto('file://' + process.cwd() + '/reel.html');
await p.evaluate(() => document.fonts.ready);
await p.clock.runFor(100);
const total = await p.evaluate(() => window.TOTAL);
const wanted = mode === 'stills' ? list.split(',').map(Number) : null;
const n = Math.round((mode === 'stills' ? Math.max(...wanted) : total) * 30);
const out = mode === 'stills' ? 'stills' : 'frames';
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out);
for (let i = 0; i <= n; i++) {
  await p.evaluate((t) => { window.__t = t; }, i / 30);
  await p.clock.runFor(1000 / 30);
  if (mode === 'video') await p.screenshot({ path: `${out}/f${String(i).padStart(4, '0')}.png` });
  else if (wanted.some((t) => Math.round(t * 30) === i)) await p.screenshot({ path: `${out}/t${(i / 30).toFixed(1)}.png` });
}
console.log('total', total.toFixed(2), 's', errs.slice(0, 5));
await b.close();
