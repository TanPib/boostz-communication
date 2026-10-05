# Boostz — communication

Les vidéos et visuels publiés sur les comptes Instagram (@boostz.app) et TikTok de Boostz.

Ce dépôt est public exprès : Metricool, qui programme les publications, récupère chaque vidéo par son lien direct (`raw.githubusercontent.com`). Un fichier déposé ici est donc accessible à quiconque a son lien, avant même sa date de publication.

## Organisation

- `TYPES.md` : les types de publication (le menu), les règles pour varier, et l'historique de ce qui a été publié.
- `gabarits/` : les sources HTML de chaque type de post, avec les polices, les dos de cartes et les emblèmes du design system.
- `outils/musique.mjs`, `mixer.sh`, `story-video.sh` : la musique originale des vidéos et les stories vidéo des carrousels.
- `outils/cotes.py` et `.github/workflows/cotes.yml` : le relevé des cotes Cardmarket, le 1er et le 16 du mois, pour la série « Les 10 cotes qui bougent ».
- `donnees/cotes/` : les relevés et les classements qui en sortent.
- `images/` et `videos/` : les fichiers publiés, nommés par date de publication.

## Contenu

| Fichier | Publication prévue | Format |
| --- | --- | --- |
| `videos/2026-10-16-lancement-stickers.mp4` | ven. 16/10/2026, 10 h — Instagram, TikTok, Facebook, stories | 9:16, 1080 × 1920, 31 s, musique originale, style stickers de l'onboarding |
| `videos/2026-10-16-lancement.mp4` | remplacée le 05/10/2026 par la version stickers ; sa fin y est reprise | 9:16, 1080 × 1920, 21 s, sans son |
| `images/2026-10-22-analyse-mega-dracaufeu-x-stickers/` | jeu. 22/10/2026, 10 h — Instagram, TikTok, Facebook | carrousel 4:5, 5 JPEG 1080 × 1350, style stickers, plus `story.jpg` |
| `videos/2026-10-22-story-mega-dracaufeu-x.mp4` | jeu. 22/10/2026, 10 h — story Instagram et Facebook | 9:16, 8 s, musique originale |
| `images/2026-10-22-analyse-mega-dracaufeu-x/` | remplacé le 05/10/2026 par la version stickers | carrousel 4:5, 5 JPEG 1080 × 1350 |
| `videos/2026-10-25-choisis-ton-combattant-8s.mp4` | dim. 25/10/2026, 10 h — Instagram, TikTok, Facebook, stories | 9:16, 1080 × 1920, 8 s, musique originale |
| `videos/2026-11-04-1-chance-sur-96-stickers.mp4` | lun. 9/11/2026, 10 h — Instagram, TikTok, Facebook, stories | 9:16, 1080 × 1920, 22,6 s, musique originale, style stickers |
| `videos/2026-11-04-1-chance-sur-96-clair.mp4` | remplacée le 05/10/2026 par la version stickers | 9:16, 1080 × 1920, 22,6 s, thème clair, sans son |
| `videos/2026-11-15-fonction-etat.mp4` | dim. 15/11/2026, 10 h — Instagram, TikTok, Facebook, stories | 9:16, 1080 × 1920, 10 s, musique originale |
| `images/2026-11-24-mythe-tigre-spectral/` | mar. 24/11/2026, 10 h — Instagram, TikTok, Facebook | carrousel 4:5, 5 JPEG 1080 × 1350, style stickers, plus `story.jpg` |
| `videos/2026-11-24-story-tigre-spectral.mp4` | mar. 24/11/2026, 10 h — story Instagram et Facebook | 9:16, 8 s, musique originale |
| `videos/2026-11-27-black-friday.mp4` | ven. 27/11/2026, 10 h — Instagram, TikTok, Facebook, stories | 9:16, 1080 × 1920, 10 s, musique originale |

Les fichiers sont nommés par leur date de publication. Chaque vidéo publiée porte une musique originale, composée en code par `outils/musique.mjs` et mixée bas (`outils/mixer.sh`) : TikTok et Facebook n'ont pas d'API de musique pour les vidéos. Les Reels Instagram reçoivent en plus une piste de la bibliothèque Instagram.

Les visuels de cartes reprennent l'illustration officielle de la carte, qui reste la propriété de son éditeur (The Pokémon Company, Upper Deck et Blizzard Entertainment pour le Tigre spectral). Les cotes affichées sont datées sur chaque visuel.
