# Nouvelle icône BoostZ (31/10/2026)

L'éventail agrandi sur un fond violet à halo, le Z du logo « BoostZ » en violet uni et ses trois Z fantômes. Source : `gabarits/icone-finale.html`. Le choix est expliqué dans `images/icone-reseaux/etude/`.

## Les fichiers

| Fichier | Taille | Pour quoi |
|---|---|---|
| `reseaux/profil-1080.png` et `.jpg` | 1080² | Photo de profil Instagram, TikTok, Facebook, Linktree |
| `reseaux/discord-512.png` | 512² | Icône du serveur Discord |
| `appli/icon.png` | 1024², opaque | `expo.icon` : l'icône iPhone, et la base des tailles générées par Expo |
| `appli/adaptive-icon.png` | 432², fond transparent | Android, couche avant (`adaptiveIcon.foregroundImage`) |
| `appli/adaptive-icon-monochrome.png` | 432², blanc sur transparent, Z évidé | Android 13+, icônes thématisées (`adaptiveIcon.monochromeImage`) |
| `appli/store/ic_launcher_background-432.png` | 432², opaque | Android, couche de fond avec le halo (`adaptiveIcon.backgroundImage`) |
| `appli/store/play-store-512.png` | 512², opaque | Fiche Play Store, à téléverser à la main |
| `appli/store/ic_launcher_legacy-192.png` | 192² | Repli pour les Android d'avant 8.0 (Expo le génère aussi) |
| `site/favicon-32.png`, `site/favicon-192.png` | 32², 192² | Favicon de boostz.fr |
| `site/icone-app-180.png`, `site/icone-app-512.png` | 180², 512² | `apple-touch-icon` et logo schema.org de boostz.fr |

## Contrôles faits

- Les icônes d'app et de store sont opaques, plein cadre, sans coin arrondi ni ombre : iOS et Android appliquent leur propre masque.
- La couche avant Android tient dans la zone sûre : point opaque le plus éloigné à 0,296 du côté, pour une limite de 0,306 (66 dp sur 108). L'éventail y est donc à la taille de l'ancienne icône, pas agrandi. C'est le masque du lanceur qui le cadre.
- Si l'on garde la couleur unie au lieu de l'image de fond, la valeur est `#7C3AED`, et seul le halo est perdu.

## Refaire les exports

```sh
node outils/icone-couches.mjs "$PWD/gabarits/icone-finale.html" <dossier> 1
# carre.png → les PNG opaques, mis à l'échelle en lanczos, format rgb24
# avant.png → adaptive-icon.png (rgba)
# mono.png  → ffmpeg -vf "scale=432:432,format=rgba,geq=r=255:g=255:b=255:a='alpha(X,Y)*r(X,Y)/255'"
# fond.png  → ic_launcher_background-432.png
```
