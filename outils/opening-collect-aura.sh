#!/bin/sh
# Rebrands the PokePotes Collect Aura opening (sources/pokepotes-opening.mp4, a
# TikTok download) for one network: masks the burnt-in "TikTok @pokepotes" mark
# (left until 25.6 s, then bottom right) under a Boostz watermark carrying that
# network's handle, keeps the voice-over up to "nos futurs contenus" (48.2 s, before
# "à bientôt chez PokePotes", timed with the Transcription workflow), freezes the
# last frame before PokePotes' outro and lays gabarits/opening-fin.html over it.
#
#   sh outils/opening-collect-aura.sh <handle without @> <out.mp4>
set -e
handle=$1; out=$2
root=$(cd "$(dirname "$0")/.." && pwd); g="$root/gabarits"
(cd "$g" && node rendu.mjs opening-fin.html alpha >/dev/null \
  && node rendu.mjs "filigrane.html#gauche-$handle" plans 0 >/dev/null \
  && node rendu.mjs "filigrane.html#droite-$handle" plans 0 >/dev/null)
ffmpeg -loglevel error -y -i "$root/sources/pokepotes-opening.mp4" -i "$g/sortie/opening-fin.mov" \
  -i "$g/sortie/filigrane-gauche-$handle/plans/t0.png" -i "$g/sortie/filigrane-droite-$handle/plans/t0.png" -filter_complex "
[0:v]delogo=x=10:y=862:w=216:h=194:enable='lt(t,25.64)',delogo=x=852:y=1440:w=220:h=196:enable='gt(t,25.58)'[d];
[d][2:v]overlay=0:0:enable='lt(t,25.61)'[d2];
[d2][3:v]overlay=0:0:enable='gte(t,25.61)'[m];
[m]trim=0:45.4,setpts=PTS-STARTPTS,fps=30,tpad=stop_mode=clone:stop_duration=4.5,format=yuv420p,setsar=1[a];
[1:v]fps=30,setpts=PTS+45.0/TB,format=rgba[o];
[a][o]overlay=0:0:eof_action=pass,format=yuv420p[v];
[0:a]atrim=0:48.3,asetpts=PTS-STARTPTS,afade=t=out:st=48.02:d=0.28,apad=whole_dur=49.8[au]" \
  -map "[v]" -map "[au]" -t 49.8 -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "$out"
echo "$out"
