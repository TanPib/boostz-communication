#!/bin/sh
# Turns a carousel into a TikTok video with our own music.
#
#   sh outils/diaporama.sh <images/date-slug> <music style> <out.mp4> [seconds per slide]
#
# Why: a TikTok photo post can only get music through autoAddMusic, which lets
# TikTok pick the track; on 26/10/2026 it put explicit rap on our carousel. So
# on TikTok a carousel goes out as this video instead: each slide (the JPEGs
# 1-…, 2-…, in order) held a few seconds on the dark ground, a short dissolve
# between slides, 9:16, H.264 4:2:0, and an original track from musique.mjs
# mixed low by mixer.sh. The cover is the first slide, so the video opens on it.
set -e
dir=$1; style=$2; out=$3; hold=${4:-4.5}
fade=0.5
tmp=$(mktemp -d)
ls "$dir" | grep -E '^[0-9]+-.*\.jpg$' | sort -n > "$tmp/list"
n=$(wc -l < "$tmp/list")
[ "$n" -ge 2 ] || { echo "need at least two slides in $dir" >&2; exit 1; }
inputs=''; graph=''; i=0
while read -r f; do
  inputs="$inputs -loop 1 -t $hold -i $dir/$f"
  graph="$graph[$i]scale=1080:1350:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0B0812,format=yuv420p,fps=30,setsar=1[v$i];"
  i=$((i + 1))
done < "$tmp/list"
prev=v0; k=1
while [ $k -lt $n ]; do
  off=$(echo "$k $hold $fade" | awk '{ printf "%.2f", $1 * ($2 - $3) }')
  graph="$graph[$prev][v$k]xfade=transition=fade:duration=$fade:offset=$off[x$k];"
  prev=x$k; k=$((k + 1))
done
# shellcheck disable=SC2086
ffmpeg -loglevel error -y $inputs -filter_complex "${graph%;}" -map "[$prev]" \
  -c:v libx264 -pix_fmt yuv420p -profile:v high -crf 20 -r 30 "$tmp/silent.mp4"
sh "$(dirname "$0")/mixer.sh" "$tmp/silent.mp4" "$style" "$out" > /dev/null
rm -rf "$tmp"
echo "$out"
