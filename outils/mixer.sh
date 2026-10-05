#!/bin/sh
# Embeds an original track (outils/musique.mjs) in a video, mixed low.
#
#   sh outils/mixer.sh <video.mp4> <style> <out.mp4>
#
# The track is cut to the video's length, faded in and out, and normalised to
# about -18 LUFS, so it sits under the visuals instead of over them. The video
# stream is copied untouched.
set -e
in=$1; style=$2; out=$3
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
tmp=$(mktemp -d)
node "$(dirname "$0")/musique.mjs" "$style" "$dur" "$tmp/piste.wav"
fade=$(echo "$dur" | awk '{ printf "%.2f", ($1 > 12 ? 2 : 1.2) }')
start=$(echo "$dur $fade" | awk '{ printf "%.2f", $1 - $2 }')
ffmpeg -loglevel error -y -i "$in" -i "$tmp/piste.wav" -map 0:v -map 1:a -c:v copy \
  -af "highpass=f=45,atrim=0:$dur,afade=t=in:d=0.6,afade=t=out:st=$start:d=$fade,loudnorm=I=-18:TP=-2:LRA=7,aresample=44100" \
  -c:a aac -b:a 160k -t "$dur" -movflags +faststart "$out"
rm -rf "$tmp"
echo "$out"
