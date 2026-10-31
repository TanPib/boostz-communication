Nouvelle icône de l'application BoostZ, validée par moi le 31/10/2026. Elle doit être dans le prochain build Android (Play Store) et iPhone (TestFlight), idéalement avant la bêta du 14/11. Les réseaux sociaux et le site passent à la même icône : l'appli doit suivre.

Le dessin : le même éventail de trois cartes, agrandi, sur un fond violet à halo. Le Z est celui du logo (Outfit incliné), en violet uni, avec ses trois Z fantômes bleu, violet et rose, légers. Ne remplis jamais le Z avec le dégradé.

1. Télécharge les fichiers depuis le dépôt public de la communication. Ils respectent déjà `mobile/assets/ICONES.md` : plein cadre, sans coin arrondi ni ombre, icônes de store opaques, couche avant transparente dans la zone sûre (point le plus éloigné à 0,296 du côté pour une limite de 0,306), monochrome blanc avec le Z évidé.
   Base : https://raw.githubusercontent.com/TanPib/boostz-communication/main/images/icone-reseaux/finale/appli/
   - `icon.png` (1024², opaque) → `mobile/assets/icon.png`
   - `adaptive-icon.png` (432², transparent) → `mobile/assets/adaptive-icon.png`
   - `adaptive-icon-monochrome.png` (432²) → `mobile/assets/adaptive-icon-monochrome.png`
   - `store/play-store-512.png` → `mobile/assets/store/play-store-512.png`
   - `store/ic_launcher_background-432.png` → `mobile/assets/store/ic_launcher_background-432.png`
   - `store/ic_launcher_legacy-192.png` → `mobile/assets/store/ic_launcher_legacy-192.png`
   Vérifie après téléchargement les dimensions, l'opacité de `icon.png` et de `play-store-512.png`, et la zone sûre de la couche avant, avec la méthode de mesure décrite dans `ICONES.md` (jimp).

2. Le fond Android a maintenant un halo. Dans `mobile/app.json`, sous `expo.android.adaptiveIcon`, remplace `"backgroundColor": "#7C3AED"` par `"backgroundImage": "./assets/store/ic_launcher_background-432.png"`. Si tu as une raison de garder la couleur unie (poids, compatibilité), garde `#7C3AED` et dis-le moi : seul le halo est perdu.

3. Mets à jour `mobile/assets/ICONES.md` : nouveau motif, fond en image au lieu de la couleur, nouvelles mesures du jour.

4. Fais-le sur les deux lignes de version, comme le prévoit le CLAUDE.md du dépôt : sur `main`, puis fusionne `main` dans `feat/expo-sdk-57` dans le worktree avant le build store. Commits en anglais, `git add` des seuls fichiers touchés, `git pull --rebase` avant de pousser.

5. L'icône est native et change l'empreinte : une OTA ne suffit pas, il faut un nouveau build. Prépare le build Play Store selon la recette de `boostz-dev/PLAY-STORE/` : `versionCode` suivant, build local (ou EAS si le quota est revenu le 01/11), empreinte ajoutée dans `mobile/scripts/builds-locaux.json`, note de version dans `mobile/src/constants/releases.js` (« Nouvelle icône »). Prépare aussi le build iPhone pour TestFlight. Ne lance jamais `eas update` à la main.

6. Mets la to-do de la console à jour (`node scripts/todo.mjs`), avec une ligne « Nouvelle icône dans le build store et TestFlight », et le prompt de ce qui reste si tu ne finis pas.

7. À la fin, dis-moi ce que je dois faire à la main :
   - téléverser `play-store-512.png` dans la Play Console (Fiche principale › Icône de l'application) ;
   - envoyer le build ;
   - tout ce qui concerne App Store Connect.
