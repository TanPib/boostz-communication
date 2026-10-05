# boostz-communication

Social media for Boostz (TCG collection app): the Instagram (@boostz.app) and TikTok ("Boostz") posts, their source templates, and the price data some of them need. The app itself lives in `TanPib/boostz-mobile`. The user is French and writes in French; everything published is French, while code and comments are English.

This repo is **public on purpose**: Metricool fetches each image and video from its `raw.githubusercontent.com` URL. Anything committed is readable before its publication date.

## Autonomy

On 05/10/2026 the user gave standing approval for every action in this work: producing, scheduling, moving and replacing Metricool posts, and changing the communication site. Do not ask before acting; report what was done. `PLANNING.md` is the approved plan to produce, in date order. Start with its "À reprendre" section when there is one.

## "Fais-moi une publication"

When the user asks for a post without saying which kind, this is the workflow:

1. Read `TYPES.md` (the menu, the rotation rules, the history) and the Metricool calendar (`getScheduledPosts`, brand `7193220`, timezone `Europe/Paris`) for posts not yet in the history.
2. Show the menu as a table: number, type, format, trend, last published. Recommend two or three, using the rotation rules: alternate Reel and carousel, don't repeat the last type, vary the game. Let the user pick a number and, optionally, a subject.
3. Build it from the type's template in `gabarits/` (edit the content in place; git keeps the previous edition). Render with `cd gabarits && node rendu.mjs <page>.html images|plans|video`. **Look at every slide or still yourself** and fix overlaps, clipping and orphan words before showing anything.
4. Send the slides with SendUserFile and iterate until the user approves.
5. Export: carousel slides as **JPEG**, because the Instagram and TikTok APIs refuse PNG for photos (`ffmpeg -i x.png -pix_fmt yuvj444p -q:v 2 x.jpg`, 4:4:4 so thin coloured text survives), into `images/<publication date>-<slug>/1-…jpg`. Videos as H.264 MP4 into `videos/<date>-<slug>.mp4`. Commit only those paths, push, then check every raw URL answers 200 before scheduling.
6. Pick the slot: no other post the same day, weekdays 10:00 by default (TikTok's best slot for the account is Thursday 10:00, second peak 18:00; Instagram has no data yet). Check `getBestTimeToPostByNetwork` for TikTok.
7. Schedule **one post per network** (`createScheduledPost`), so each carries its own hashtags: Instagram type `POST` (carousel) or `REEL`, with alt text per image; TikTok always with `tiktokData.title` (required, ≤ 90 characters), `autoAddMusic: true` for photo posts; **Facebook** (asked on 05/10/2026) `facebookData.type` `POST` for a carousel, `REEL` for a video, same caption as Instagram. `autoPublish: true`, `isAiGenerated: false` (the visuals are hand-coded layouts, the card art is official).
   Then **one story post for Instagram and Facebook together**, at the same time, with no text (`instagramData.type` and `facebookData.type` `STORY`): the video itself for a Reel; for a carousel, a 9:16 image from `gabarits/story-post.html` (add an entry, export `images/<date>-<slug>/story.jpg`). TikTok stories cannot be scheduled through Metricool's API.
8. Add the post to the history in `TYPES.md` and to the table in `README.md`, commit, push.

Never overwrite a scheduled post with `updateScheduledPost` without reading it first: the user edits them by hand in Metricool (they add the Instagram music themselves, which the API only supports on Reels).

## What the user has asked for, every time

- **Decorations never touch text**: the dashed path and the ghost card outlines go in empty space, never across a sentence, a source line or the wordmark (05/10/2026: a source line on the Charizard post was crossed). Check it on every slide and still.
- **Music on every post, every network** (05/10/2026): cool, soft, never aggressive, matching the post's style. TikTok and Facebook have no music API for videos, so the track is **embedded in the MP4**, mixed low (about −18 LUFS, fade in and out). Instagram Reels also get a library track via `audioConfiguration` (`videoVolume: 0`). Carousels: TikTok `autoAddMusic: true`; Instagram and Facebook carousels cannot get music through the API (the user adds Instagram's by hand). Stories announcing a carousel are exported as a short MP4 (the story image + music) so they carry sound. Runway music generation needs a paid plan (refused 05/10/2026): compose original tracks in code instead, never third-party audio.

- **Real figures only**, each dated and sourced in a line at the bottom of the visual. No invented price history, no curve with made-up points: two records make a two-point line. A mockup with example figures says so on the slide ("MAQUETTE · CHIFFRES D'EXEMPLE").
- **No chips or pills** (rounded labels with a border). Plain coloured text instead.
- **The app's own card backs** (`gabarits/assets/dos-<game>.svg`) whenever a card back is drawn.
- **8 TCG**, never 9: Animal Crossing is not mentioned in communication.
- French card vocabulary: "enchantée" (not "enchanted"), the French card names (Méga-Dracaufeu, not Mega Charizard).
- Slow enough to read: animations were slowed down twice on request.
- The closing line under the wordmark: "Ton compagnon TCG, bientôt sur ton téléphone". The call to follow: "Abonne-toi pour ne rien manquer" (never "pour l'avoir en premier").

## Templates (`gabarits/`)

Plain HTML pages, one per type, sharing `fonts/` (OFL fonts: Outfit for the wordmark, Poppins, Exo, DM Sans, Sora), `assets/` (card backs, game emblems, flags, fan logo, app icon), `shots/` (real app screenshots) and `posts-emblems.js`. A carousel page draws one `.p` element per slide; a video page exposes `window.TOTAL` and a deterministic `window.render(t)`.

- The wordmark is HTML text in Outfit 800 with the gradient Z and its three ghost Zs (`wordmark()` in every page). Never put the Z in an SVG `<text>` loaded through `<img>`: it cannot reach the web font and falls back to a serif.
- Design tokens: dark backgrounds `#0B0812 → #131020 → #1B1330 → #150E22`, light `#FFFFFF → #F6F4FA`; accent `#C4B5FD` (dark) / `#7C3AED` (light); brand gradient `#FF4FA0 → #8B3DFF → #3AA9FF`; up `#5FD3A3`, down `#F0899A`; game colours e.g. Pokémon `#F5C93B`, Lorcana `#35C6BC`.
- `rendu.mjs` imports Playwright from `/opt/node-tools/node_modules/playwright` (the cloud container's copy, with Chromium preinstalled). Outputs go to `gabarits/sortie/`, which is gitignored.

## Data

- **Price movers** (`donnees/cotes/pokemon/`): `.github/workflows/cotes.yml` runs `outils/cotes.py` on the 1st and the 16th of each month (or by hand: Actions › Cotes › Run workflow). It records the Cardmarket figures of every Pokémon card from TCGdex, then writes `top-<date>.json` with the 10 biggest moves since the previous record and their card images. For the template: `echo "window.TOP = $(cat ../donnees/cotes/pokemon/top-<date>.json);" > cotes-donnees.js`.
- **Network from the cloud container**: only `raw.githubusercontent.com` and git over HTTPS get out. TCGdex, Cardmarket, TCGplayer, Scryfall and the image CDNs are blocked here, but reachable from GitHub Actions, which is why the price records run there. Card images for posts: the `images/` folder written by the workflow, or `type-null/PTCG-database` (Pokémon, English scans; blobless clone, then check out one file).
- WebSearch works; WebFetch is mostly blocked. Quote figures from search results only with their source and date.

## Repo conventions

Commit messages in English, imperative sentence case, no prefix, a body explaining why. `git add <paths>`, never `-A`. Push to `main`.
