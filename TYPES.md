# Types de publication

Dis « fais-moi une publication » : Claude ouvre ce menu, te dit ce qui est tendance et ce qu'on a posté récemment, tu choisis un numéro (avec une carte ou un jeu si tu as une idée), et Claude construit le post, te le montre, puis le programme dans Metricool.

## Le menu

| N° | Type | Format | Tendance | État | Dernière publication |
| --- | --- | --- | --- | --- | --- |
| 1 | **Analyse de carte** | carrousel, 5 slides | 🔥🔥🔥 | prêt | 22/10/2026 · Méga-Dracaufeu X ex (Pokémon) |
| 2 | **Les 10 cotes qui bougent** | carrousel, 12 slides | 🔥🔥🔥 | série, le 1er et le 16 du mois | première édition à venir |
| 3 | **1 chance sur N** | Reel de 22 s, ou carrousel de 5 slides | 🔥🔥🔥 | prêt | 09/11/2026 · enchantée (Lorcana) |
| 4 | **Top 10 d'un set** | carrousel, 11 slides | 🔥🔥🔥 à la sortie d'un set | maquette | jamais |
| 5 | **Même carte, trois langues** | carrousel, 3 à 5 slides | 🔥🔥 | maquette | jamais |
| 6 | **Devine la note** | carrousel, 2 slides | 🔥🔥 | maquette | jamais |
| 7 | **Classeur panoramique** | carrousel, 3 slides qui se suivent | 🔥🔥 | maquette | jamais |
| 8 | **Choisis ton combattant** | Reel, écran de sélection en stickers | 🔥🔥 | prêt | 25/10/2026 · les 8 jeux |
| 9 | **Pub Boostz** | image ou Reel court | 🔥 | maquette | jamais |
| 10 | **Édito** | image, thème clair | 🔥 | maquette | jamais |
| 11 | **Annonce** | Reel | selon l'actu | prêt | 16/10/2026 · lancement |
| 12 | **Fonction à la loupe** | Reel ou carrousel | 🔥🔥 | prêt (`fonction-etat-reel.html`) | 15/11/2026 · l'état des cartes |
| 13 | **Mythe ou réalité** | carrousel, 5 slides | 🔥🔥 | prêt (`mythe-ou-realite.html`) | 24/11/2026 · Tigre spectral (Warcraft) |
| 14 | **Tu préfères ?** | carrousel, 3 slides | 🔥🔥 | à concevoir | jamais |
| 15 | **Sortie d'extension** | carrousel ou Reel | 🔥🔥🔥 | à concevoir | jamais |
| 16 | **Thème** | Reel | 🔥🔥🔥 le jour J | prêt (`black-friday-reel.html`) | 27/11/2026 · Black Friday |
| 17 | **Lexique TCG** | carrousel, 6 à 8 slides | 🔥🔥 | à concevoir | jamais |
| 18 | **Protège ta collection** | carrousel, 5 à 6 slides | 🔥🔥 | à concevoir | jamais |
| 19 | **Repère la contrefaçon** | Reel ou carrousel | 🔥🔥🔥 | à concevoir | jamais |
| 20 | **Erreurs d'impression** | Reel | 🔥🔥🔥 | à concevoir | jamais |

*Prêt* : le gabarit existe, il n'y a plus qu'à changer le sujet. *Maquette* : le design a été proposé une fois, avec des chiffres d'exemple, et sera finalisé au premier usage.

## Pour varier

- **Alterner Reel et carrousel.** Le Reel va chercher des gens qui ne te suivent pas encore ; le carrousel fait commenter et enregistrer ceux qui te suivent déjà.
- **Pas deux fois le même type d'affilée**, sauf la série n° 2 qui a son propre rythme.
- **Varier les jeux.** Les 8 TCG ont tous leurs posts, chaque mois : Pokémon fait le plus d'audience, mais pas plus d'un post sur trois.
- **Une pub Boostz (n° 9) au plus tous les cinq posts.** Les autres types montrent déjà l'app en situation.
- **Des chiffres réels, datés et sourcés sur le visuel.** Rien n'est inventé : sans donnée fiable, on change de sujet.

## Les fiches

### 1 · Analyse de carte
Une carte précise, de la couverture au verdict : « elle vaut combien ? », sa cote et sa version gradée, sa rareté face au prix des boosters, puis « Tu la veux ? Achète-la. ».
- **Il me faut :** une carte, ou je choisis une carte phare d'un set récent.
- **Données :** cote Cardmarket, ventes PSA 10, taux de tirage, prix des displays.
- **Gabarit :** `gabarits/analyse-de-carte.html`
- **Met en avant :** le suivi de cote.

### 2 · Les 10 cotes qui bougent
Les 10 cartes Pokémon dont la cote a le plus évolué en 15 jours : une couverture, un compte à rebours du 10e au 1er (la carte, son prix avant et après, la hausse ou la baisse), puis un récap à enregistrer.
- **Rythme :** le 1er et le 16 de chaque mois. Le relevé tourne tout seul sur GitHub ces jours-là (`.github/workflows/cotes.yml`) et compare au relevé précédent.
- **Il me faut :** rien, le classement sort du relevé.
- **Données :** le prix de vente moyen sur 7 jours de Cardmarket, relevé par Boostz pour toutes les cartes Pokémon via TCGdex (`donnees/cotes/pokemon/`). Une carte entre au classement si elle vaut plus de 10 € et si la tendance Cardmarket va dans le même sens, ce qui écarte une vente isolée.
- **Gabarit :** `gabarits/cotes-qui-bougent.html`
- **Met en avant :** le suivi de cote.

### 3 · 1 chance sur N
La rareté d'une carte rendue visible : N boosters qui s'ouvrent un par un, presque tous vides de la carte voulue, puis le coût de la chasse comparé au prix de la carte seule.
- **Il me faut :** un jeu et une rareté (une enchantée, une illustration spéciale, une manga rare…).
- **Données :** taux de tirage, prix du booster, cote de la carte.
- **Gabarit :** `gabarits/chance-reel-stickers.html` (style stickers), `chance-reel.html` (thème clair), `chance-reel-sombre.html`, `chance-carrousel.html`
- **Met en avant :** « regarde sa cote avant d'ouvrir ».

### 4 · Top 10 d'un set
Les 10 cartes les plus chères d'un set qui vient de sortir. C'est le format qui explose dans la semaine de sortie.
- **Il me faut :** un set, de préférence sorti depuis moins de 15 jours.
- **Données :** pour Pokémon, le relevé du n° 2 donne déjà la cote de toutes les cartes.
- **Gabarit :** maquette `m1a`/`m1b` dans `gabarits/maquettes-references.html`
- **Met en avant :** la cote, et la cote par langue.

### 5 · Même carte, trois langues
Une carte, trois prix : française, anglaise, japonaise. Le débat « japonaise ou anglaise ? » tourne beaucoup en 2026, et c'est une fonction que Boostz est presque seul à proposer.
- **Il me faut :** une carte éditée dans les trois langues.
- **Gabarit :** maquette `n4` dans `gabarits/maquettes-tcg.html`
- **Met en avant :** la cote par langue.

### 6 · Devine la note
Slide 1 : une carte dans le cadre du scan, avec les repères de centrage. « Tu lui donnes combien ? » Slide 2 : la réponse. Fait commenter.
- **Il me faut :** une photo de carte réelle à faire passer au scan.
- **Gabarit :** maquettes `n2a`/`n2b` dans `gabarits/maquettes-tcg.html`
- **Met en avant :** le scan d'état.

### 7 · Classeur panoramique
Une double page de classeur étalée sur trois slides qui se suivent : en swipant, on la parcourt comme une vraie page.
- **Il me faut :** un thème (une génération, un Pokémon, une couleur…).
- **Gabarit :** maquette `n3` dans `gabarits/maquettes-tcg.html`
- **Met en avant :** la collection.

### 8 · Choisis ton combattant
Un écran de sélection de personnage façon 16-bit, avec les 8 TCG. « Tu joues lequel ? » Fait commenter.
- **Gabarit :** maquette `n6` dans `gabarits/maquettes-tcg.html`
- **Met en avant :** les 8 jeux dans une seule app.

### 9 · Pub Boostz
Une promesse et une seule action, comme les pubs de Phygitals ou Courtyard : le booster Boostz, une carte qui en jaillit, « regarde sa cote avant d'ouvrir ».
- **Gabarit :** maquette `m3` dans `gabarits/maquettes-references.html`

### 10 · Édito
Une phrase en très grand, un mot encadré, puis un mur d'objets de l'app (façon Kinkai). Sert l'image de marque.
- **Gabarit :** maquette `m4` dans `gabarits/maquettes-references.html`

### 11 · Annonce
Pour les étapes de l'app : lancement, bêta, sortie sur les stores, nouvelle fonction.
- **Gabarit :** `gabarits/annonce-stickers-reel.html` (version publiée, style stickers), `gabarits/annonce-reel.html` (V8, dont la fin est reprise)

### 12 · Fonction à la loupe
Une fonction de l'app, montrée en stickers, étape par étape : l'état, l'échange, les alertes prix, les extensions et les Boosties, la commu. Chaque post n'en montre qu'une, et ne promet que ce que l'app fait déjà en prod.
- **Données :** aucune cote ; des valeurs d'exemple, comme dans la vidéo de lancement.

### 13 · Mythe ou réalité
Une idée reçue du monde TCG, en grand, puis les faits sourcés et le verdict. Instructif, donc enregistré et partagé.
- **Données :** chaque fait cité avec sa source et sa date.

### 14 · Tu préfères ?
Deux cartes au même prix, de préférence de deux jeux différents, face à face. Fait commenter, et montre que Boostz couvre plusieurs jeux.
- **Données :** cotes réelles, à moins de 10 % d'écart, datées.

### 15 · Sortie d'extension
Une extension, en deux temps possibles : l'annonce quelques jours avant (ce qu'il y a dedans, les cartes attendues, le prix d'un booster), ou le jour même et les jours suivants (« elle sort aujourd'hui », les premières cotes, le top des cartes). C'est le type préféré de l'utilisateur, à prévoir pour chaque grosse sortie des 8 jeux.
- **Données :** annonces officielles et calendriers de sorties, datés ; les cotes seulement quand elles existent.

### 16 · Thème
Un temps fort du calendrier (Halloween, Noël, Black Friday, rentrée…) lu à travers les cartes : une carte qui fait peur par jeu, une promo à vérifier… De préférence plusieurs jeux à la fois.

### 17 · Lexique TCG
« Ça veut dire quoi ? » : un mot du monde TCG par slide (PSA 10, alt art, SIR, chase, taux de tirage, scellé, enchantée…), avec sa définition en une phrase et un exemple en image. Pour les débutants ; fait enregistrer. Choisi le 06/10/2026.
- **Données :** aucune cote ; un exemple chiffré est sourcé et daté.

### 18 · Protège ta collection
Des conseils concrets en stickers : sleeves, toploaders, classeurs sans PVC, humidité, lumière, transport. Fait enregistrer. Choisi le 06/10/2026.
- **Données :** aucune ; les recommandations viennent des guides des fabricants ou des services de gradation, cités.

### 19 · Repère la contrefaçon
Les signes connus d'une fausse carte, un par plan ou par slide : la police, le dos, l'épaisseur, le test de la lumière, la brillance. Toujours avec la vraie carte en face. Choisi le 06/10/2026.
- **Données :** les signes viennent de guides officiels ou communautaires, cités ; jamais une fausse carte présentée comme vraie.

### 20 · Erreurs d'impression
Des cartes mal imprimées (cadre décalé, texte manquant, mauvais dos, double impression) qui se sont vendues une fortune, une par plan, avec sa vente. Choisi le 06/10/2026.
- **Données :** chaque vente sourcée et datée (maison d'enchères, PSA Auction Prices Realized), images réelles via le workflow Image.

### News TCG
Pas un format fixe : une grosse actu d'un des 8 jeux (annonce, réédition, record, ban) prend la place du prochain post qui n'est lié à aucune date, dans le format qui lui va le mieux.

## Historique

| Date | Réseaux | N° | Sujet | Jeu | Fichiers |
| --- | --- | --- | --- | --- | --- |
| ven. 16/10/2026, 10 h | Instagram (Reel), TikTok, Facebook (Reel), story Instagram et Facebook | 11 | Lancement : « boostZ ta collection », style stickers de l'onboarding | les 8 | `videos/2026-10-16-lancement-stickers.mp4` |
| jeu. 22/10/2026, 10 h | Instagram (carrousel), TikTok (photos), Facebook, story vidéo Instagram et Facebook | 1 | Méga-Dracaufeu X ex, Flammes Fantasmagoriques 130/094 | Pokémon | `images/2026-10-22-analyse-mega-dracaufeu-x-stickers/`, `videos/2026-10-22-story-mega-dracaufeu-x.mp4` |
| dim. 25/10/2026, 10 h | Instagram (Reel, musique « 8 Bit Breakthrough »), TikTok, Facebook (Reel), story Instagram et Facebook | 8 | Choisis ton combattant : « Tu joues lequel ? » | les 8 | `videos/2026-10-25-choisis-ton-combattant-8s.mp4` |
| lun. 09/11/2026, 10 h | Instagram (Reel), TikTok, Facebook (Reel), story Instagram et Facebook | 3 | 1 chance sur 96 d'avoir une enchantée | Lorcana | `videos/2026-11-04-1-chance-sur-96-stickers.mp4` |
| dim. 15/11/2026, 10 h | Instagram (Reel, musique « Retro Bit Dip »), TikTok, Facebook (Reel), story Instagram et Facebook | 12 | Fonction à la loupe : estime l'état de tes cartes | les 8 | `videos/2026-11-15-fonction-etat.mp4` |
| mar. 24/11/2026, 10 h | Instagram (carrousel), TikTok (photos), Facebook, story vidéo Instagram et Facebook | 13 | Mythe ou réalité : une carte à 5 250 $ pour un tigre qui n'existe pas (Tigre spectral) | Warcraft | `images/2026-11-24-mythe-tigre-spectral/`, `videos/2026-11-24-story-tigre-spectral.mp4` |
| ven. 27/11/2026, 10 h | Instagram (Reel, musique « Game Face »), TikTok, Facebook (Reel), story Instagram et Facebook | 16 | Black Friday : « Promo ou pas ? » (exemple, prix fictifs) | les 8 | `videos/2026-11-27-black-friday.mp4` |

Chaque vidéo porte une musique originale composée en code (`outils/musique.mjs`, mixée vers −18 LUFS par `outils/mixer.sh`), pour TikTok et Facebook ; les Reels Instagram jouent en plus la piste de la bibliothèque Instagram indiquée.

## D'où viennent les notes de tendance

Recherche du 03/10/2026 :
- Les contenus « combien vaut cette carte » et « les cartes qui montent » sont parmi les plus vus sur TikTok Pokémon en 2026, avec les ouvertures de boosters ([TikTok, Pokemon Card Market](https://www.tiktok.com/discover/pokemon-card-market), [TikTok, Why Are All Pokemon Cards Going Up 2026](https://www.tiktok.com/discover/why-are-all-pokemon-cards-going-up-2026)).
- Le Reel touche plus de monde, surtout des non-abonnés, ce qui compte pour un compte qui démarre ; le carrousel fait davantage commenter et enregistrer ceux qu'il touche ([Socialinsider, benchmarks Instagram 2026](https://www.socialinsider.io/social-media-benchmarks/instagram), [Collabkit, étude sur 10 000 posts](https://collabkit.me/blog/instagram-reels-vs-carousels-vs-images-data-study-2026)).
- L'écart de prix entre cartes japonaises et anglaises fait débat cette année ([PokemonPriceTracker](https://www.pokemonpricetracker.com/blog/posts/japanese-vs-english-pokemon-cards-value-guide-2026)).
