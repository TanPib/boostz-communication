#!/bin/sh
# Extracts the onboarding scenes from boostz-mobile's main branch next to this
# script, then applies the two Reel-only changes. Run from this folder:
#   sh prepare.sh /path/to/boostz-mobile && node build.mjs && node capture.mjs video
# build.mjs takes its node_modules (react-native-web, react-native-svg, esbuild)
# from /home/user/boostz-mobile/mobile, so `npm install` must have run there.
set -e
rm -rf mobile
git -C "$1" archive origin/main mobile/src | tar -x
# Communication says 8 TCG: Animal Crossing's chip goes, Warcraft takes the row.
python3 - <<'PY'
p = 'mobile/src/components/intro/scenes/Scene02Jeux.js'
s = open(p, encoding='utf-8').read()
s = s.replace("  { name: 'Animal Crossing', x: 76, y: 208, rot: -2 },\n  { name: 'Warcraft', x: 216, y: 208, rot: 3 }", "  { name: 'Warcraft', x: 150, y: 208, rot: 3 }")
open(p, 'w', encoding='utf-8').write(s)
# The app steps every 650 ms for a reader who swipes; the Reel plays six scenes in 31 s.
p = 'mobile/src/lib/introSlides.js'
s = open(p, encoding='utf-8').read()
open(p, 'w', encoding='utf-8').write(s.replace('export const INTRO_STEP_MS = 650;', 'export const INTRO_STEP_MS = 380;'))
PY
