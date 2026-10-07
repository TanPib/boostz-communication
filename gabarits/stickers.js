// Shared helpers for the sticker-style posts (the onboarding look): flat dark
// table, white outlines, hard offset shadows, a dashed path, ghost card
// outlines. A carousel page calls carousel(slides); a Reel page calls
// reel(html, total) and marks each animated element with data attributes.
// Load posts-emblems.js first.
const SHADOW = '#05040A', VSOFT = '#C4B5FD', DARK = '#1A1424', DONE = '#5FD3A3', SUN = '#FCD34D',
  VIOLET = '#7C3AED', PINK = '#F0899A', BLUE = '#3AA9FF', INK = '#F5F2FB';
const GAMES = {
  pokemon: ['POKÉMON', '#F5C93B'], onepiece: ['ONE PIECE', '#F2706C'], lorcana: ['LORCANA', '#35C6BC'],
  yugioh: ['YU-GI-OH!', '#B189E8'], magic: ['MAGIC', '#C0A183'], starwarsunlimited: ['STAR WARS UNLIMITED', '#A9B2C4'],
  dragonball: ['DRAGON BALL', '#F58A4E'], wow: ['WARCRAFT', '#58A6DD'],
};
const ALL8 = Object.keys(GAMES);

document.head.insertAdjacentHTML('beforeend', `<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #000; color: ${INK}; font-family: Exo; }
  .p { position: relative; overflow: hidden; width: 1080px; height: 1350px; margin-bottom: 20px; background: #131020; }
  .reel { position: relative; overflow: hidden; width: 1080px; height: 1920px; background: #131020; }
  .abs { position: absolute; }
  .h { font-family: Outfit; font-weight: 800; line-height: 1.02; letter-spacing: -1px; }
  .ui { font-family: Poppins; font-weight: 700; }
  .lab { font-family: 'DM Sans'; font-weight: 700; letter-spacing: 4px; }
  .mut { color: #A8A2B8; }
  .acc { color: ${VSOFT}; }
  .word { font-family: Outfit; font-weight: 800; line-height: 1; }
  .grad { background: linear-gradient(135deg, #FF4FA0 0%, #8B3DFF 55%, #3AA9FF 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .st { position: absolute; background: #1D1730; border: 6px solid ${INK}; border-radius: 36px; box-shadow: 12px 12px 0 ${SHADOW}; }
  .src { position: absolute; left: 70px; right: 70px; bottom: 34px; font-family: Exo; font-size: 20px; line-height: 1.35; color: rgba(255,255,255,.42); }
  .reel .src { bottom: 290px; font-size: 24px; text-align: center; }
</style>`);

const emblemSvg = (id, c, size) => `<svg width="${size}" height="${size}" viewBox="0 0 48 48">${EMBLEMS[id].replace(/COLOR/g, c)}</svg>`;
const wordmark = (size) => `<div style="display:flex;align-items:baseline;transform:skewX(-8deg)"><span class="word" style="font-size:${size}px;color:#fff">boost</span><span style="position:relative;display:inline-block">`
  + [['#3AA9FF', -0.59, .12], ['#8B3DFF', -0.39, .2], ['#FF4FA0', -0.185, .3]].map(([c, l, o]) => `<span class="word" style="font-size:${size}px;position:absolute;top:0;left:${l * size}px;color:${c};opacity:${o}">Z</span>`).join('')
  + `<span class="word grad" style="font-size:${size}px;position:relative;color:transparent">Z</span></span></div>`;
// A sticker: a box with a white outline and a hard shadow. o: {fill, r, z, id, attrs}.
const st = (x, y, w, h, inner, o = {}) => `<div ${o.id ? `id="${o.id}"` : ''} ${o.attrs || ''} class="st" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${o.fill ? 'background:' + o.fill + ';' : ''}transform:rotate(${o.r || 0}deg);${o.z ? 'z-index:' + o.z + ';' : ''}">${inner}</div>`;
const disc = (x, y, d, fill, inner, r = 0, attrs = '') => `<div ${attrs} class="abs" style="left:${x}px;top:${y}px;width:${d}px;height:${d}px;border-radius:50%;background:${fill};border:6px solid ${INK};box-shadow:12px 12px 0 ${SHADOW};display:flex;align-items:center;justify-content:center;transform:rotate(${r}deg);z-index:4">${inner}</div>`;
const emblemDisc = (game, d) => `<div style="width:${d}px;height:${d}px;border-radius:50%;background:${GAMES[game][1]};border:5px solid ${INK};box-shadow:8px 8px 0 ${SHADOW};display:flex;align-items:center;justify-content:center;flex:none">${emblemSvg(game, DARK, d * .58)}</div>`;
const ghosts = (list) => list.map(([x, y, w, r]) => `<div class="abs ghost" data-r="${r}" style="left:${x}px;top:${y}px;width:${w}px;height:${w * 1.4}px;border:4px solid rgba(255,255,255,.14);border-radius:${w * .16}px;transform:rotate(${r}deg)"><div style="width:60%;height:6px;margin:${w * .1}px auto 0;border-radius:3px;background:rgba(255,255,255,.14)"></div></div>`).join('');
// Seasonal icons (asked on 06/10/2026: discreet, drawn in our style, one or two
// per seasonal post at most). Flat fills, the white outline and the hard shadow
// of the stickers. list: [[name, x, y, size, rotation]]. In a Reel they bob in
// place. Place them in empty bands: they never touch text.
const starPts = (cx, cy, R, r, n) => Array.from({ length: n * 2 }, (_, i) => { const a = Math.PI * i / n - Math.PI / 2, d = i % 2 ? r : R; return `${(cx + d * Math.cos(a)).toFixed(1)},${(cy + d * Math.sin(a)).toFixed(1)}`; }).join(' ');
const ICONS = {
  // Two speech bubbles, for the community posts (Discord, 07/10/2026).
  bulles: `<path d="M12 20 Q12 12 20 12 L62 12 Q70 12 70 20 L70 46 Q70 54 62 54 L34 54 L20 66 L22 54 L20 54 Q12 54 12 46 Z" fill="${VIOLET}"/><path d="M40 44 Q40 38 46 38 L82 38 Q88 38 88 44 L88 68 Q88 74 82 74 L80 74 L82 86 L68 74 L46 74 Q40 74 40 68 Z" fill="${PINK}"/><g fill="${INK}" stroke="none"><circle cx="54" cy="56" r="4"/><circle cx="64" cy="56" r="4"/><circle cx="74" cy="56" r="4"/></g>`,
  citrouille: `<path d="M46 27 L47 11 Q53 7 59 10 L55 27 Z" fill="${DONE}"/><ellipse cx="31" cy="59" rx="21" ry="29" fill="#F58A4E"/><ellipse cx="69" cy="59" rx="21" ry="29" fill="#F58A4E"/><ellipse cx="50" cy="59" rx="21" ry="31" fill="#F58A4E"/>
    <path d="M35 51 L45 51 L40 41 Z M55 51 L65 51 L60 41 Z M33 63 Q50 82 67 63 Q50 72 33 63 Z" fill="${DARK}" stroke="none"/>`,
  fantome: `<path d="M22 88 L22 46 Q22 13 50 13 Q78 13 78 46 L78 88 L68 79 L59 88 L50 79 L41 88 L32 79 Z" fill="${VSOFT}"/>
    <g fill="${DARK}" stroke="none"><ellipse cx="40" cy="45" rx="5" ry="7"/><ellipse cx="60" cy="45" rx="5" ry="7"/><ellipse cx="50" cy="63" rx="5" ry="6"/></g>`,
  sapin: `<rect x="43" y="78" width="14" height="14" fill="#C0A183"/><path d="M50 18 L76 50 L63 50 L84 80 L16 80 L37 50 L24 50 Z" fill="${DONE}"/>
    <g stroke="none"><circle cx="42" cy="64" r="4.5" fill="${PINK}"/><circle cx="60" cy="70" r="4.5" fill="${SUN}"/><circle cx="53" cy="44" r="4.5" fill="${BLUE}"/></g>
    <polygon points="${starPts(50, 15, 12, 5, 5)}" fill="${SUN}"/>`,
  cadeau: `<rect x="17" y="46" width="66" height="42" rx="4" fill="${PINK}"/><rect x="12" y="33" width="76" height="16" rx="4" fill="${PINK}"/>
    <rect x="44" y="33" width="12" height="55" fill="${SUN}"/><path d="M50 33 Q30 8 25 25 Q28 34 50 33 Z M50 33 Q70 8 75 25 Q72 34 50 33 Z" fill="${SUN}"/>`,
  etincelle: `<polygon points="${starPts(44, 56, 36, 10, 4)}" fill="${SUN}"/><polygon points="${starPts(80, 20, 14, 4, 4)}" fill="${BLUE}"/><circle cx="18" cy="20" r="6" fill="${PINK}"/>`,
  etiquette: `<path d="M8 50 L34 20 L88 20 Q92 20 92 24 L92 76 Q92 80 88 80 L34 80 Z" fill="${PINK}"/><circle cx="30" cy="50" r="6" fill="#131020"/>
    <text x="64" y="64" text-anchor="middle" font-family="Outfit" font-weight="800" font-size="40" fill="${DARK}" stroke="none">%</text>`,
};
const deco = (list) => list.map(([name, x, y, size, r = 0]) => `<svg class="abs deco" data-r="${r}" width="${size}" height="${size}" viewBox="0 0 100 100" style="left:${x}px;top:${y}px;overflow:visible;transform:rotate(${r}deg);filter:drop-shadow(8px 8px 0 ${SHADOW});z-index:1"><g stroke="${INK}" stroke-width="5" stroke-linejoin="round">${ICONS[name]}</g></svg>`).join('');
// The dashed path runs across the slides of a carousel. On each slide, y puts
// its centre line in an empty band and amp flattens its waves to fit the band.
const TRACK = 'M-20 760 C200 700 300 820 540 780 S900 640 1080 700 S1400 860 1620 800 S1980 600 2160 680 S2500 900 2700 820 S3060 640 3240 720 S3600 880 3780 820 S4140 640 4320 700 S4700 860 4900 800 S5300 700 5420 740 S5800 860 6000 800 S6300 680 6500 740 S6900 860 7100 800 S7500 680 7700 740 S8100 860 8300 800 S8700 700 8900 740 S9300 860 9500 800 S9900 680 10100 740 S10500 860 10700 800 S11100 700 11300 740 S11700 860 11900 800';
const track = (k, y = 760, amp = 1) => `<svg class="abs" width="1080" height="1350" viewBox="${k * 1080} 0 1080 1350" style="left:0;top:0"><g transform="translate(0 ${y}) scale(1 ${amp}) translate(0 -760)"><path d="${TRACK}" fill="none" stroke="rgba(196,181,253,.55)" stroke-width="${14 / Math.sqrt(amp)}" stroke-dasharray="26 36" stroke-linecap="round" vector-effect="non-scaling-stroke" style="stroke-width:14px"/></g></svg>`;
// Kicker on the left, game (or "les 8 jeux") on the right.
const head = (kicker, game, sub) => {
  const right = game === 'all'
    ? `<div style="text-align:right"><div class="lab" style="font-size:21px;letter-spacing:5px;color:${VSOFT}">LES 8 TCG</div>${sub ? `<div style="font-weight:600;font-size:24px;color:rgba(245,242,251,.75);margin-top:2px">${sub}</div>` : ''}</div>`
    : game ? `<div style="text-align:right"><div class="lab" style="font-size:21px;letter-spacing:5px;color:${GAMES[game][1]}">${GAMES[game][0]}</div>${sub ? `<div style="font-weight:600;font-size:24px;color:rgba(245,242,251,.75);margin-top:2px">${sub}</div>` : ''}</div>${emblemDisc(game, 76)}` : '';
  return `<div class="abs lab" style="left:70px;top:66px;font-size:24px;letter-spacing:6px;color:${VSOFT}">${kicker}</div>
  <div class="abs" style="right:70px;top:46px;display:flex;align-items:center;gap:20px;z-index:5">${right}</div>`;
};
// A real card scan in a sticker frame (aspect 1:1.4 unless h is given).
const card = (img, x, y, w, r = 0, z = 2, o = {}) => `<div ${o.attrs || ''} class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${o.h || w * 1.4}px;transform:rotate(${r}deg);border:8px solid ${INK};border-radius:${w * .05}px;overflow:hidden;box-shadow:16px 16px 0 ${SHADOW};z-index:${z};background:#000">
  <img src="${img}" style="width:100%;height:100%;display:block;object-fit:${o.fit || 'cover'};object-position:${o.pos || 'center'}">${o.over || ''}</div>`;
const back = (game, x, y, w, r = 0, z = 1, attrs = '') => `<div ${attrs} class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${w * 1.4}px;transform:rotate(${r}deg);border:6px solid ${INK};border-radius:${w * .07}px;overflow:hidden;box-shadow:12px 12px 0 ${SHADOW};z-index:${z}"><img src="assets/dos-${game}.svg" style="width:100%;height:100%;display:block;object-fit:cover"></div>`;
const src = (text) => `<div class="src">${text}</div>`;
// The closing lines change when the app launches (14/01/2027): a page published after that
// sets window.PUB to its publication date ('YYYY-MM-DD') before drawing them.
const launched = () => (window.PUB || '') >= '2027-01-14';
const TAGLINE = () => `Ton compagnon TCG, ${launched() ? 'disponible' : 'bientôt'} sur ton téléphone`;
const CALL = () => launched() ? 'Télécharge Boostz, lien en bio' : 'Abonne-toi pour ne rien manquer';
const closing = (top, size = 100) => `<div class="abs" style="left:0;top:${top}px;width:1080px;display:flex;justify-content:center">${wordmark(size)}</div>
  <div class="abs mut" style="left:0;top:${top + size * 1.35}px;width:1080px;text-align:center;font-weight:600;font-size:38px">${TAGLINE()}</div>
  <div class="abs ui" style="left:0;top:${top + size * 1.35 + 95}px;width:1080px;text-align:center;font-size:34px;color:${VSOFT}">${CALL()}</div>`;
const eur = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(2).replace('.', ',')).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' €';
const usd = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(2).replace('.', ',')).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' $';

// Carousel: slides is a list of [id, html].
const carousel = (slides) => { document.body.innerHTML = slides.map(([id, html]) => `<div class="p" id="${id}">${html}</div>`).join(''); };

// Reel: html holds every element of the video. An element with data-at="t"
// appears at t seconds ("stick": lands like a sticker; "rise": slides up;
// "fade"), and with data-out="t" leaves. data-r is its resting rotation.
// Ghost outlines drift; a path with id "draw" is revealed over the first 2.4 s.
const clamp = (x) => Math.max(0, Math.min(1, x));
const out3 = (x) => 1 - Math.pow(1 - clamp(x), 3);
const backEase = (x) => { x = clamp(x); const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
function reel(html, total) {
  document.body.innerHTML = `<div class="reel" id="stage">${html}</div>`;
  window.TOTAL = total;
  const els = [...document.querySelectorAll('[data-at]')];
  const gs = [...document.querySelectorAll('.ghost')];
  const ds = [...document.querySelectorAll('.deco')];
  window.render = (t) => {
    gs.forEach((g, i) => { g.style.transform = `translateX(${t * (5 + i)}px) rotate(${+g.dataset.r + Math.sin(t / 2 + i) * 3}deg)`; });
    ds.forEach((d, i) => { d.style.transform = `translateY(${Math.sin(t * 1.6 + i * 1.3) * 10}px) rotate(${+d.dataset.r + Math.sin(t + i) * 5}deg)`; });
    const dr = document.getElementById('drawRect'); if (dr) dr.setAttribute('width', 1100 * out3(t / 2.4));
    for (const el of els) {
      const at = +el.dataset.at, kind = el.dataset.kind || 'stick', r = +(el.dataset.r || 0);
      const outT = el.dataset.out ? +el.dataset.out : Infinity;
      const leave = out3((t - outT) / .35);
      let op = 0, tf = '';
      if (kind === 'stick') {
        const p = clamp((t - at) / .32);
        op = clamp(p / .2);
        tf = `translateY(${-50 * (1 - out3(p))}px) rotate(${r + 10 * (1 - out3(p))}deg) scale(${1.3 - .3 * backEase(p)})`;
      } else if (kind === 'rise') {
        const p = out3((t - at) / .45); op = p; tf = `translateY(${36 * (1 - p)}px) rotate(${r}deg)`;
      } else {
        op = out3((t - at) / .5); tf = `rotate(${r}deg)`;
      }
      if (leave > 0) { op *= 1 - leave; tf += ` translateY(${-30 * leave}px)`; }
      el.style.opacity = op; el.style.transform = tf;
    }
  };
  window.render(0);
}
// The Reel's dashed path, drawn in over the first seconds.
const reelPath = (d = 'M-20 1720 C160 1660 300 1800 520 1740 S860 1640 1100 1710') => `<svg class="abs" width="1080" height="1920" style="left:0;top:0"><defs><clipPath id="draw"><rect id="drawRect" x="0" y="0" width="0" height="1920"/></clipPath></defs>
  <path clip-path="url(#draw)" d="${d}" fill="none" stroke="rgba(196,181,253,.55)" stroke-width="14" stroke-dasharray="26 36" stroke-linecap="round"/></svg>`;
const A = (at, out, r = 0, kind = 'stick') => `data-at="${at}" ${out != null ? `data-out="${out}"` : ''} data-r="${r}" data-kind="${kind}"`;
