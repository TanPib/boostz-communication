#!/bin/sh
# Turns a carousel's 9:16 story image into an 8 s story video with its music,
# so the story announcing a carousel carries sound like the Reels do.
#
#   sh outils/story-video.sh <story.jpg> <style> <out.mp4>
set -e
img=$1; style=$2; out=$3
tmp=$(mktemp -d)
ffmpeg -loglevel error -y -loop 1 -framerate 30 -i "$img" -t 8 -vf "scale=1080:1920,format=yuv420p" \
  -c:v libx264 -crf 18 -preset slow "$tmp/muet.mp4"
sh "$(dirname "$0")/mixer.sh" "$tmp/muet.mp4" "$style" "$out"
rm -rf "$tmp"
