// Renders gabarits/icone-finale.html layer by layer on a transparent page
// (rendu.mjs cannot: it keeps the dark ground) and prints how far the Android
// foreground reaches from the centre, against the 66/108 safe zone.
//   node outils/icone-couches.mjs "$PWD/gabarits/icone-finale.html" <out dir> [k of the foreground]
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
const [page, out, ka = '1'] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 1200 } });
await p.goto('file://' + page + '?ka=' + ka); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
for (const el of await p.$$('.p')) { const id = await el.getAttribute('id'); await el.screenshot({ path: `${out}/${id}.png`, omitBackground: true }); }
// farthest opaque pixel of the foreground from the centre, as a share of the side
const r = await p.evaluate(async () => { const img = new Image(); img.src = document.querySelector('#avant svg') ? 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(document.querySelector('#avant svg'))))) : ''; await img.decode(); const c = document.createElement('canvas'); c.width = c.height = 540; const x = c.getContext('2d'); x.drawImage(img, 0, 0, 540, 540); const d = x.getImageData(0, 0, 540, 540).data; let m = 0; for (let j = 0; j < 540; j++) for (let i = 0; i < 540; i++) if (d[(j * 540 + i) * 4 + 3] > 8) m = Math.max(m, Math.hypot(i - 269.5, j - 269.5)); return m / 540; });
console.log('max radius / side', r.toFixed(4), '(safe zone 0.3056)');
await b.close();
