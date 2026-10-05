// The launch Reel's middle part, drawn by the onboarding's own scenes.
// Time comes from window.__t (seconds), advanced by the capture script under a
// fake clock, so the scenes' own timers and the camera stay in step.
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SCENES } from './mobile/src/components/intro/scenes';
import IntroTrack from './mobile/src/components/intro/IntroTrack';
import DriftCards from './mobile/src/components/intro/DriftCards';
import BoostZFanLogo from './mobile/src/components/BoostZFanLogo';
import { IntroMotionContext } from './mobile/src/components/intro/introMotion';
import { INTRO_SLIDES, INTRO_STEP_MS } from './mobile/src/lib/introSlides';
import { TABLE, INK, MUTED } from './mobile/src/components/intro/introPalette';

const S = 1080 / 390;
const PAN = 0.7, HOLD = 0.9;
// Planche (index in the onboarding) and the Reel's own words for it.
const PLAN = [
  [1, '8 TCG.\nUne seule app.', 'Choisis tes jeux et ta langue. Boostz fait le reste.'],
  [2, 'Ta collection\net sa valeur', 'Cartes et scellés, leur valeur totale et son évolution.'],
  [4, 'La cote de tes\ncartes et scellés', 'En français, en anglais et en japonais.'],
  [6, 'Estime l’état\nde tes cartes', 'Coins, bords, surface et centrage, en une photo.'],
  [7, 'Échange entre\ncollectionneurs', 'Vois qui a ce que tu cherches, discute, fixe un RDV.'],
  [8, 'La commu\nprès de chez toi', 'Tournois, brocantes, boutiques et le forum de ton département.']
];
const START = [];
let acc = 0;
for (const [i] of PLAN) { START.push(acc); acc += INTRO_SLIDES[i].steps * INTRO_STEP_MS / 1000 + HOLD; }
window.TOTAL = acc;
const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

function Reel() {
  const [t, setT] = useState(0);
  useEffect(() => { const id = setInterval(() => setT(window.__t || 0), 1000 / 60); return () => clearInterval(id); }, []);
  // The camera reaches scene k at START[k]; it leaves the previous one PAN earlier.
  let pos = 0;
  START.forEach((s, k) => { if (k > 0) pos += ease((t - (s - PAN)) / PAN); });
  const active = START.reduce((a, s, k) => (t >= s - PAN / 2 ? k : a), 0);
  return (
    <IntroMotionContext.Provider value={{ reduceMotion: false }}>
      <div style={{ position: 'absolute', inset: 0, background: TABLE, overflow: 'hidden' }}>
        <DriftCards scale={S} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: PLAN.length * 1080, height: 1920, transform: `translateX(${-pos * 1080}px)` }}>
          {PLAN.map(([i, title, sub], k) => {
            const Scene = SCENES[i];
            return (
              <div key={i} style={{ position: 'absolute', left: k * 1080, top: 0, width: 1080, height: 1920 }}>
                <div style={{ position: 'absolute', left: 0, top: 120, width: 390, height: 480, transform: `scale(${S})`, transformOrigin: '0 0' }}>
                  <IntroTrack index={k} />
                  <Scene active={k === active} />
                </div>
                <div style={{ position: 'absolute', left: 66, top: 1470, width: 950 }}>
                  <div style={{ fontFamily: 'Outfit_800ExtraBold', fontSize: 84, lineHeight: '92px', color: INK, whiteSpace: 'pre-line' }}>{title}</div>
                  <div style={{ fontFamily: 'Exo_400Regular', fontSize: 40, lineHeight: '58px', color: MUTED, marginTop: 22 }}>{sub}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', left: 66, top: 62 }}><BoostZFanLogo size={52} tone="dark" /></div>
      </div>
    </IntroMotionContext.Provider>
  );
}
createRoot(document.getElementById('root')).render(<Reel />);
