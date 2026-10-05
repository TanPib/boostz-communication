# Planning du 16 octobre au 30 décembre 2026

Un post tous les 3 jours, sans interruption, depuis le premier post (16/10) : avant la sortie de l'appli comme après (demandé le 05/10/2026). 26 posts jusqu'au 30/12, publiés le même jour sur Instagram, TikTok et Facebook, avec leur story. Le rythme continue en janvier : le planning du mois suivant s'écrit avant la fin du mois en cours. Validé le 05/10/2026 ; Claude produit et programme sans redemander. Le style visuel est partout celui des stickers de l'onboarding.

## Repris le 05/10/2026 (nuit) : fait

- **Musique** : chaque vidéo porte une piste originale composée en code (`outils/musique.mjs`, un style par post, mixée vers −18 LUFS par `outils/mixer.sh`). Posts TikTok, Facebook et stories des Reels du 16/10, 25/10, 09/11, 15/11 et 27/11 mis à jour (média seul). Les Reels Instagram gardent leur piste Instagram.
- **Reel Facebook du lancement (16/10)** : créé, même légende que le Reel Instagram.
- **Story du Dracaufeu (22/10)** : remplacée par une vidéo de 8 s avec musique (`outils/story-video.sh`).
- **N° 14, Tigre spectral (24/11)** : rendu, vérifié slide par slide, programmé sur Instagram, TikTok (`autoAddMusic`), Facebook et en story vidéo.
- **Historique** : `TYPES.md` et `README.md` à jour.
- **Rappels** : recréés pour la session qui a fait ce travail, les anciens désactivés.

Trois principes, demandés par l'utilisateur :
- **Les 8 TCG ont tous leurs posts**, pas seulement Pokémon et Lorcana.
- **Les sorties d'extension d'abord** : l'annonce avant la sortie, ou le jour même.
- **Les temps forts du calendrier et les grosses news TCG** prennent la place d'un post qui n'est pas lié à une date.

## Le calendrier

| N° | Date | Format | Type (`TYPES.md`) | Sujet | Jeu | État |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | ven. 16/10, 10 h | Reel | 11 Annonce | Lancement : « boostZ ta collection » | les 8 | ✅ programmé |
| 2 | lun. 19/10, 10 h | carrousel | 2 Cotes qui bougent | Édition n° 1 : relevés du 03/10 au 16/10 | Pokémon | relevé auto le 16/10 |
| 3 | jeu. 22/10, 10 h | carrousel | 1 Analyse de carte | Méga-Dracaufeu X ex | Pokémon | ✅ programmé |
| 4 | dim. 25/10, 10 h | Reel | 8 Choisis ton combattant | « Tu joues lequel ? », raccourci à 8 s | les 8 | ✅ programmé (8 s) |
| 5 | mer. 28/10, 10 h | carrousel | 15 Sortie d'extension | Hyperia City (chapitre 14, sorti le 23/10) : les 10 cartes qui valent le plus | Lorcana | à produire |
| 6 | sam. 31/10, 18 h | Reel | 16 Thème | Halloween : une carte qui fait peur par jeu, et sa cote | Pokémon, Magic, One Piece, Lorcana, Yu-Gi-Oh! | à produire |
| 7 | mar. 03/11, 10 h | carrousel | 2 Cotes qui bougent | Édition n° 2 : du 16/10 au 01/11 | One Piece | à produire |
| 8 | ven. 06/11, 10 h | carrousel | 15 Sortie d'extension | Delta Reign sort aujourd'hui (ME06, en anglais) | Pokémon | à produire |
| 9 | lun. 09/11, 10 h | Reel | 3 1 chance sur N | 1 chance sur 96 d'avoir une enchantée | Lorcana | ✅ programmé |
| 10 | jeu. 12/11, 10 h | carrousel | 15 Sortie d'extension | Vendredi, deux sorties : Magnificent Maestros et Magic × Star Trek | Yu-Gi-Oh!, Magic | à produire |
| 11 | dim. 15/11, 10 h | Reel | 12 Fonction à la loupe | Estime l'état de tes cartes | les 8 | ✅ programmé |
| 12 | mer. 18/11, 10 h | carrousel | 2 Cotes qui bougent | Édition n° 3 : du 01/11 au 16/11 | Magic | à produire |
| 13 | sam. 21/11, 10 h | Reel | 15 Sortie d'extension | Sorti hier : OP18 et Star Wars Unlimited Icons | One Piece, Star Wars Unlimited | à produire |
| 14 | mar. 24/11, 10 h | carrousel | 13 Mythe ou réalité | « Une carte s'est vendue 5 250 \$… pour un tigre qui n'existe pas » | Warcraft | ✅ programmé |
| 15 | ven. 27/11, 10 h | Reel | 16 Thème | Black Friday : « Promo ou pas ? » | les 8 | ✅ programmé |
| 16 | lun. 30/11, 10 h | carrousel | 14 Tu préfères ? | La chase de Brightness of Hope (FB11) contre celle de Magnificent Maestros | Dragon Ball, Yu-Gi-Oh! | à produire |

**Les 8 jeux.**
- Pokémon : 3 posts (2, 3, 8).
- Lorcana, One Piece, Magic, Yu-Gi-Oh! : 2 chacun.
- Star Wars Unlimited, Dragon Ball, Warcraft : 1 chacun.
- Les 8 ensemble : 4 posts (1, 4, 11, 15), plus le n° 6 qui en réunit 5.

**La série des cotes change de jeu à chaque édition**, toujours sur 15 jours, et toujours juste après son relevé. Les sources :
- Pokémon : notre relevé Cardmarket.
- One Piece et Magic : l'historique quotidien du dépôt public `novaoc/rarebox-data`, qui donne leurs cotes TCGplayer jour par jour (optcgapi, Scryfall).
- Yu-Gi-Oh!, Star Wars Unlimited, Dragon Ball : à brancher sur le relevé automatique (tcgcsv, depuis GitHub) avant leur premier tour.

**Types.** 10 types sur 16 posts. Nouveaux :
- 15 Sortie d'extension, l'annonce avant ou le jour même ;
- 16 Thème, pour Halloween et Black Friday ;
- 12 Fonction à la loupe ;
- 13 Mythe ou réalité ;
- 14 Tu préfères ?.

**Rythme.** 7 Reels et 9 carrousels. Ils alternent, sauf aux deux endroits où une date l'impose (19-22/10, 03-06/11).

**Heures.** 10 h, le meilleur créneau TikTok du compte, sauf Halloween à 18 h.

**News TCG.** À chaque rappel programmé, Claude cherche les grosses actus des 8 jeux : annonce d'extension, réédition, record de vente, ban. Une news importante prend la place du prochain post qui n'est lié à aucune date (11, 14, 15 ou 16) ; le post remplacé passe en décembre.

## Décembre (posts 17 à 26)

Écrit le 05/10/2026 pour que le rythme ne s'arrête pas au 30/11. Même logique : les sorties d'abord, les 8 jeux, l'alternance Reel et carrousel, 10 h.

| N° | Date | Format | Type (`TYPES.md`) | Sujet | Jeu | État |
| --- | --- | --- | --- | --- | --- | --- |
| 17 | jeu. 03/12, 10 h | Reel | 15 Sortie d'extension | Demain : Glorious Victors (sortie le 04/12) | Yu-Gi-Oh! | à produire |
| 18 | dim. 06/12, 10 h | carrousel | 2 Cotes qui bougent | Édition n° 4 : du 21/11 au 05/12 (historique Lorcast via `rarebox-data`) | Lorcana | à produire |
| 19 | mer. 09/12, 10 h | Reel | 3 1 chance sur N | Les chances de tirer une manga rare | One Piece | à produire |
| 20 | sam. 12/12, 10 h | carrousel | 5 Même carte, trois langues | Une carte en FR, EN et JP : trois cotes | Pokémon | à produire |
| 21 | mar. 15/12, 10 h | Reel | 12 Fonction à la loupe | L'échange : la valeur de chaque côté | les 8 | à produire |
| 22 | ven. 18/12, 10 h | carrousel | 15 Sortie d'extension | FB12 sort aujourd'hui | Dragon Ball | à produire |
| 23 | lun. 21/12, 10 h | Reel | 16 Thème | Noël : une carte à glisser sous le sapin par jeu, et sa cote | Pokémon, Magic, One Piece, Lorcana, Star Wars Unlimited | à produire |
| 24 | jeu. 24/12, 10 h | carrousel | 7 Classeur panoramique | Une double page de leaders | Star Wars Unlimited | à produire |
| 25 | dim. 27/12, 10 h | Reel | 9 Pub Boostz | Après les boosters de Noël : « regarde sa cote avant de vendre ou d'échanger » | les 8 | à produire |
| 26 | mer. 30/12, 10 h | carrousel | 16 Thème | 2026 en 5 ventes records, une par jeu, chacune sourcée | Pokémon, Magic, One Piece, Lorcana, Warcraft | à produire |

- **Sortie de l'appli** : le jour où sa date est connue, un post « Annonce » (type 11) prend la place du post sans date le plus proche (19, 20, 21, 24, 25 ou 26), qui glisse en janvier.
- **Dates à reconfirmer une semaine avant** : Yu-Gi-Oh! Glorious Victors le 04/12 ([tcgalerts](https://www.tcgalerts.net/yugioh/calendar/), [vintageccg](https://www.vintageccg.com/ccg-news/tcg-release-schedule-2026-2027/)), Dragon Ball FB12 le 18/12. Un set spécial Pokémon est attendu en décembre sans date ([Beckett](https://www.beckett.com/news/2026-tcg-release-dates-checklists-and-set-information/)) : s'il sort, il remplace le n° 20.
- **Types sur décembre** : 8 différents. Jeux : chacun des 8 au moins une fois entre novembre et décembre, Star Wars Unlimited et Warcraft compris.


## Le contenu, post par post

Légendes en brouillon. Les chiffres entre crochets sortent des données le jour de la production ; rien n'est publié sans source datée sur le visuel. 5 hashtags par réseau, adaptés à chaque jeu.

### 2 · Les 10 cotes qui bougent, n° 1, Pokémon — lun. 19/10
- **Déroulé :** couverture « Les 10 cotes qui ont le plus bougé, en 13 jours », le compte à rebours du 10e au 1er (la carte, son prix avant et après, la hausse ou la baisse), le récap à enregistrer.
- **Données :** le relevé automatique du 16/10 contre celui du 03/10.
- **Légende :** « 📈📉 Les 10 cartes Pokémon dont la cote a le plus bougé en deux semaines. La n° 1 a pris [X] % 😮 Enregistre le récap : dans 15 jours, c'est au tour de One Piece. »
- **Hashtags :** `#pokemontcg #cartespokemon #cotepokemon #collectionpokemon #pokemonfr`

### 4 · Choisis ton combattant — dim. 25/10
- ✅ Programmé, raccourci à 8 s le 05/10.

### 5 · Hyperia City : les 10 cartes qui valent le plus — mer. 28/10
- **Déroulé :** couverture « Hyperia City est sorti : ses 10 cartes les plus chères à J+5 », un rang par slide, le récap.
- **Données :** cotes TCGplayer de Lorcast (via `rarebox-data`), converties en euros et datées.
- **Légende :** « Chapitre 14 sorti, les prix tombent 👀 Voici les 10 cartes d'Hyperia City qui valent le plus pour l'instant. Tu as pull laquelle ? »
- **Hashtags :** `#disneylorcana #lorcana #lorcanafr #hyperiacity #tcgcollection`

### 6 · Halloween : une carte qui fait peur par jeu — sam. 31/10, 18 h
- **Déroulé (Reel, ~12 s) :** cinq cartes « monstres » en stickers, une par jeu, chacune avec sa cote : un Pokémon Spectre, une créature d'horreur Magic, un pirate fantôme One Piece, une méchante Disney Lorcana, un monstre Démon Yu-Gi-Oh!. Fin « Joyeux Halloween 🎃 ».
- **Données :** relevé Cardmarket (Pokémon), `rarebox-data` (Magic, One Piece, Lorcana), relevé tcgcsv (Yu-Gi-Oh!, s'il est branché à temps ; sinon 4 jeux).
- **Légende :** « 🎃 Cinq cartes qui font peur… surtout à ton portefeuille. Laquelle tu mettrais dans ton classeur ce soir ? »
- **Hashtags :** `#halloween #tcg #pokemontcg #mtg #onepiececardgame`

### 7 · Les 10 cotes qui bougent, n° 2, One Piece — mar. 03/11
- Même format que le n° 2, sur One Piece, du 16/10 au 01/11 (historique `rarebox-data`).
- **Hashtags :** `#onepiececardgame #onepiecetcg #onepiecefr #tcgcollection #collectionneur`

### 8 · Delta Reign sort aujourd'hui — ven. 06/11
- **Déroulé (carrousel, 5 slides) :** « Delta Reign sort aujourd'hui (en anglais) » ; ce qu'il y a dedans (nombre de cartes, raretés) ; les 3 cartes que tout le monde va chasser ; le prix d'un booster et d'un display ; « Suis leur cote dès les premiers jours sur Boostz ».
- **Données :** annonces officielles et fiches du set, datées ; pas de cote avant qu'elle existe.
- **Légende :** « 🔥 Delta Reign sort aujourd'hui en anglais. Les 3 cartes à chasser, le prix d'un display… et toi, tu ouvres ou tu attends que la cote retombe ? »
- **Hashtags :** `#pokemontcg #deltareign #megaevolution #cartespokemon #pokemon`

### 9 · 1 chance sur 96 — lun. 09/11
- ✅ Programmé le 09/11 (décalé pour laisser le 06/11 à Delta Reign). Revérifier les cotes des enchantées, qui datent du 25/09.

### 10 · Vendredi, deux sorties : Magnificent Maestros et Magic × Star Trek — jeu. 12/11
- **Déroulé (carrousel, 5 slides) :** « Demain, deux sorties » ; Yu-Gi-Oh! Magnificent Maestros (ce qu'il y a dedans, les cartes attendues) ; Magic × Star Trek (les 60 ans de Star Trek, les cartes attendues) ; prix d'un booster de chaque ; « Tu ouvres lequel ? ».
- **Données :** annonces officielles, datées.
- **Légende :** « 🖖 vs 🎻 Demain, Yu-Gi-Oh! sort Magnificent Maestros et Magic sort son set Star Trek. Tu ouvres lequel en premier ? »
- **Hashtags :** `#yugioh #mtg #magicthegathering #startrek #tcg`

### 11 · Fonction à la loupe : estime l'état de tes cartes — dim. 15/11
- **Déroulé (Reel, ~10 s) :** la carte au scan (recto, verso), les quatre critères en stickers (coins, bords, surface, centrage), la note estimée, « Trois analyses offertes tous les 30 jours ». Valeurs d'exemple, comme la vidéo de lancement ; une pré-estimation, pas une note officielle.
- **Légende :** « Avant de l'envoyer en gradation, demande à Boostz ce qu'il en pense 🔎 »
- **Hashtags :** `#gradingcards #psa #tcgcollection #cartesacollectionner #collectionneur`

### 12 · Les 10 cotes qui bougent, n° 3, Magic — mer. 18/11
- Même format, sur Magic, du 01/11 au 16/11 (historique Scryfall via `rarebox-data`). Le set Star Trek, sorti le 13/11, n'y entre que s'il a deux relevés.
- **Hashtags :** `#mtg #magicthegathering #mtgfr #mtgfinance #tcgcollection`

### 13 · Sorti hier : OP18 et Star Wars Unlimited Icons — sam. 21/11
- **Déroulé (Reel, ~12 s) :** deux boosters en stickers s'ouvrent l'un après l'autre : OP18 The Dominance of God, puis Icons 2027 Edition (le mini-set de Star Wars Unlimited). Pour chacun, les 3 cartes à chasser et leurs premiers prix.
- **Données :** premières cotes TCGplayer (relevé tcgcsv), datées du jour.
- **Légende :** « Deux sorties hier : OP18 pour One Piece, Icons pour Star Wars Unlimited 🏴‍☠️✨ Les cartes qui valent déjà le plus. »
- **Hashtags :** `#onepiececardgame #op18 #starwarsunlimited #swu #tcg`

### 14 · Mythe ou réalité : « Une carte du TCG World of Warcraft valait un vrai tigre » — mar. 24/11
- **Déroulé (carrousel, 5 slides) :** l'affirmation en grand ; le TCG World of Warcraft (2006-2013) et ses cartes « loot » qui débloquaient un objet dans le jeu vidéo ; le Tigre spectral, monture rarissime ; ce qu'elles se sont vendues (faits sourcés et datés) ; le verdict, puis « Warcraft fait partie des 8 TCG de Boostz ».
- **Données :** articles et ventes publiques, chacun avec sa source.
- **Légende :** « Mythe ou réalité ? 🐯 Une carte à collectionner qui valait… un tigre. Swipe pour la réponse. »
- **Hashtags :** `#worldofwarcraft #wowtcg #warcraft #tcg #collectionneur`

### 15 · Black Friday : « Promo ou pas ? » — ven. 27/11
- **Déroulé (Reel, ~10 s) :** une étiquette « −30 % » en sticker se décolle et révèle la vraie cote, puis « Avant d'acheter en promo, regarde sa cote ». Exemple présenté comme tel, sauf vraie promo sourcée le jour même.
- **Légende :** « Black Friday : −30 %… sur un prix gonflé ? 🤔 Avant de craquer, regarde la cote. Boostz arrive bientôt. »
- **Hashtags :** `#blackfriday #tcg #pokemontcg #bonplan #collectionneur`

### 16 · Tu préfères ? Dragon Ball contre Yu-Gi-Oh! — lun. 30/11
- **Déroulé (carrousel, 3 slides) :** la carte la plus recherchée de Brightness of Hope (Fusion World FB11, sorti le 16/10) face à celle de Magnificent Maestros, à moins de 10 % d'écart de prix ; leur cote et leur rareté ; « Tu prends laquelle ? ».
- **Données :** relevé tcgcsv (TCGplayer), en euros et daté.
- **Légende :** « Même prix, deux jeux. Goku ou… ? 👈👉 Tu prends laquelle ? »
- **Hashtags :** `#dragonballsuper #fusionworld #yugioh #tcg #collectionneur`

## Sources des dates de sortie

Relevées le 05/10/2026, à reconfirmer une semaine avant chaque post :
- Dragon Ball Fusion World FB11 le 16/10 ([db-fusionworld.com](https://db-fusionworld.com/en/articles/bandai-next-plan-report-upcoming-dragon-ball-super-fusion-world-releases)).
- Lorcana Hyperia City le 23/10, One Piece EB05 le 30/10, Pokémon Delta Reign le 06/11, Magic × Star Trek le 13/11, OP18 le 20/11 ([pokezenith](https://www.pokezenith.com/content/51-calendrier-sorties-tcg-2026), [Maison du Booster](https://maisondubooster.com/pages/calendrier-sorties-tcg)).
- Yu-Gi-Oh! Magnificent Maestros le 13/11 ([ICv2](https://icv2.com/articles/news/view/63153/new-yu-gi-oh-tcg-booster-set-revealed)).
- Star Wars Unlimited : Homeworlds en octobre, Icons 2027 Edition le 20/11 ([ICv2](https://icv2.com/articles/news/view/61111/fantasy-flight-reveals-2026-star-wars-unlimited-releases), [tcgalerts](https://www.tcgalerts.net/star-wars/calendar/)).
