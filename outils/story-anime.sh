#!/bin/sh
# Builds a post's story (asked on 07/10/2026): its cover, animated by
# gabarits/story-anime.html#<id>, 7 s, with the post's own music.
#
#   sh outils/story-anime.sh <id> <sound> <out.mp4>
#
# <sound> is a video whose first 7 s of audio are reused (the Reel itself, or
# the carousel's previous story video), or a musique.mjs style name.
set -e
id=$1; sound=$2; out=$3
root=$(cd "$(dirname "$0")/.." && pwd)
tmp=$(mktemp -d)
(cd "$root/gabarits" && node rendu.mjs "story-anime.html#$id" video >/dev/null)
cp "$root/gabarits/sortie/story-anime-$id.mp4" "$tmp/muet.mp4"
if [ -f "$sound" ]; then
  ffmpeg -loglevel error -y -i "$sound" -vn -t 7 -c:a pcm_s16le "$tmp/son.wav"
  ffmpeg -loglevel error -y -i "$tmp/muet.mp4" -i "$tmp/son.wav" -map 0:v -map 1:a -c:v copy \
    -af "afade=t=in:d=0.4,afade=t=out:st=5.8:d=1.2,loudnorm=I=-18:TP=-2:LRA=7,aresample=44100" \
    -c:a aac -b:a 160k -t 7 -movflags +faststart "$out"
else
  sh "$root/outils/mixer.sh" "$tmp/muet.mp4" "$sound" "$out" >/dev/null
fi
rm -rf "$tmp"
echo "$out"
