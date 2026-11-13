# Musiques de bibliothèque

Depuis le 13/11/2026, un post peut porter un morceau lo-fi de **Mixkit** (mixkit.co/free-stock-music) au lieu d'une piste composée par `outils/musique.mjs`. TanPib trouvait la piste composée du Reel d'ouverture de la bêta « vraiment BOF » et a demandé une bibliothèque en ligne.

## La licence

« Mixkit Stock Music Free License », lue sur mixkit.co/license le 13/11/2026 :

- **autorisé** : les posts vidéo sur les réseaux sociaux, les publicités en ligne, les vidéos YouTube, les podcasts, en usage commercial ou non, gratuitement, sans crédit à afficher ;
- **interdit** : les CD et DVD, la télévision et la radio, les jeux vidéo ; remixer un morceau ou l'intégrer à une piste uniquement musicale ; le revendiquer ou l'enregistrer auprès d'un service de gestion de droits ;
- en cas de réclamation de droits sur une plateforme : transmettre le détail à team@mixkit.co.

Conséquence pour ce dépôt, qui est public : **le fichier audio n'y entre jamais**. Il est téléchargé dans `musiques/` (ignoré par git) et ne sort que mixé dans une vidéo.

## S'en servir

```sh
sh outils/piste.sh 767                      # télécharge musiques/mixkit-767.mp3 et affiche son chemin
sh outils/accroche.sh <vidéo sans accroche> <entrée> "$(sh outils/piste.sh 767)" videos/<date>-<slug>.mp4
sh outils/accroche.sh <vidéo sans accroche> <entrée> "$(sh outils/piste.sh 763)@31.75" videos/<date>-<slug>.mp4   # à partir de 31,75 s
sh outils/mixer.sh <vidéo> "$(sh outils/piste.sh 135)" <sortie.mp4>   # remixe une vidéo déjà montée
```

Le numéro est celui de l'adresse du morceau sur Mixkit. Le mixage reste le même que pour nos pistes : environ −18 LUFS, fondu d'entrée et de sortie.

## Les morceaux

Tempo et entrée de la batterie mesurés sur le fichier (analyse du 13/11/2026), ambiance d'après les étiquettes de Mixkit.

| N° | Titre | Auteur | Tempo | Début conseillé | Ambiance | Utilisé dans |
|---|---|---|---|---|---|---|
| 767 | Lo-Fi 05 | Lily J | 85 BPM | 0 s | détendu, positif | essai A du Reel du 14/11 |
| 763 | Lo-Fi 01 | Lily J | 75 BPM | 31,75 s (la basse entre à 32 s) | détendu, chaleureux | essai B du Reel du 14/11 |
| 135 | Sleepy Cat | Alejandro Magaña (A. M.) | 67,5 BPM | 0 s | posé, mélodique | essai C du Reel du 14/11 |
| 764 | Lo-Fi 02 | Lily J | 82 BPM | 23 s (la batterie entre à 23,5 s) | détendu, un peu décalé | — |
| 97 | Dim The Lights | Ahjay Stelino | 70 BPM | 0 s | détendu, insistant | — |
| 282 | Sweet September | Arulo | 76 BPM | 11 s | calme, hip-hop doux | — |

Écartés : Lo-Fi 03 (jazz à cuivres, ambiance « sensuelle »), Lo-Fi 04 (43 s d'introduction).

Pixabay, l'autre grande bibliothèque gratuite, refuse les téléchargements depuis le conteneur (403). Incompetech et Free Music Archive sont accessibles, mais leurs morceaux demandent un crédit affiché (CC BY) ou ont une licence à vérifier un par un.
