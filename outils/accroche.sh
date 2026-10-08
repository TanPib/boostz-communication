#!/bin/sh
# Puts a Reel's hook (gabarits/accroche.html#<entry>: 1.5 s held, then its content leaving in 0.4 s
# handing over) in front of its video, dissolving into the video's first
# frames instead of a hard cut, and re-mixes the track over the whole length.
#
#   sh outils/accroche.sh <video.mp4> <entry> <music style> <out.mp4>
#
# Run it on the video without a hook: run twice, the hook would appear twice.
# The video's own audio is dropped and outils/mixer.sh lays the track again.
# It also writes the cover, the hook's settled last frame, to
# images/couvertures/<out name>.jpg (videoThumbnailUrl in Metricool).
set -e
in=$1; entry=$2; style=$3; out=$4
root=$(cd "$(dirname "$0")/.." && pwd)
tmp=$(mktemp -d)
(cd "$root/gabarits" && node rendu.mjs "accroche.html#$entry" video >/dev/null && node rendu.mjs "accroche.html#$entry" plans 1.45 >/dev/null)
ffmpeg -loglevel error -y -i "$root/gabarits/sortie/accroche-$entry.mp4" -i "$in" \
  -filter_complex "[0:v]fps=30,format=yuv420p,setsar=1[a];[1:v]fps=30,format=yuv420p,setsar=1[b];[a][b]xfade=transition=fade:duration=0.45:offset=1.75[v]" \
  -map "[v]" -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -profile:v high -movflags +faststart "$tmp/video.mp4"
sh "$root/outils/mixer.sh" "$tmp/video.mp4" "$style" "$out" >/dev/null
mkdir -p "$root/images/couvertures"
cover="$root/images/couvertures/$(basename "$out" .mp4).jpg"
ffmpeg -loglevel error -y -i "$root/gabarits/sortie/accroche-$entry/plans/t1.45.png" -pix_fmt yuvj444p -q:v 2 "$cover"
rm -rf "$tmp"
echo "$out $cover"
