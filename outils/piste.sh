#!/bin/sh
# Downloads a Mixkit track by its number into musiques/ (gitignored) and
# prints its path, for outils/mixer.sh and outils/accroche.sh:
#
#   sh outils/accroche.sh <video> <entry> "$(sh outils/piste.sh 767)" <out.mp4>
#   sh outils/accroche.sh <video> <entry> "$(sh outils/piste.sh 763)@31.75" <out.mp4>
#
# The number is the one in the track's address on mixkit.co/free-stock-music.
# Mixkit's Stock Music Free License (read on 13/11/2026) allows social media
# video posts and online ads, commercial or not, with no credit; it forbids
# remixing a track, a music-only use and claiming it. So a track only ever
# leaves this folder inside a video: never commit the audio file itself (the
# repository is public). Record each track used in MUSIQUES.md.
set -e
id=$1
root=$(cd "$(dirname "$0")/.." && pwd)
mkdir -p "$root/musiques"
out="$root/musiques/mixkit-$id.mp3"
[ -s "$out" ] || curl -fsS -m 120 -A "Mozilla/5.0 (X11; Linux x86_64)" -o "$out" "https://assets.mixkit.co/music/$id/$id.mp3"
echo "$out"
