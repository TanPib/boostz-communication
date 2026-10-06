# Tâche planifiée : les posts en automatique

Une tâche planifiée de Claude ouvre une session neuve chaque matin sur ce dépôt, avec la consigne ci-dessous. Elle peut tourner tous les jours sans rien casser : elle ne crée jamais un post qui existe déjà dans Metricool.

## Réglages de la tâche

- **Dépôt** : `TanPib/boostz-communication`, branche `main`, dans le même environnement que les sessions actuelles.
- **Fréquence** : tous les jours à 8 h 47, heure de Paris.
- **Une session neuve à chaque lancement** : elle repart du dépôt à jour et relit `CLAUDE.md`.
- **Connecteurs** : Metricool et GitHub. Sans eux, la session ne peut ni programmer les posts ni lancer les workflows.
- **Notifications** : activées, pour recevoir le compte rendu.

## Les autorisations, à ajouter par l'utilisateur

Personne ne regarde la session : elle ne doit jamais s'arrêter sur une demande de validation. Claude n'a pas le droit de modifier ses propres autorisations ; c'est à l'utilisateur d'ajouter ces règles à `.claude/settings.json`, dans `permissions.allow` :

```
"mcp__github",
"mcp__claude-code-remote__list_triggers",
"Read", "Edit", "Write", "Glob", "Grep",
"Bash(node outils/musique.mjs:*)",
"Bash(sh outils/mixer.sh:*)",
"Bash(sh outils/story-video.sh:*)",
"Bash(ffprobe:*)",
"Bash(git add:*)", "Bash(git commit:*)", "Bash(git pull:*)", "Bash(git fetch:*)", "Bash(git push:*)",
"Bash(git status:*)", "Bash(git diff:*)", "Bash(git log:*)", "Bash(git rev-parse:*)",
"Bash(curl -s -o /dev/null:*)"
```

Les règles déjà présentes (Metricool, `send_later`, `update_trigger`, WebSearch, WebFetch, `node rendu.mjs`, `ffmpeg`) restent.

## La consigne à coller

```
Tu es la tâche planifiée des posts Boostz. Lis CLAUDE.md, PLANNING.md et TYPES.md, et suis-les. L'utilisateur a donné son accord permanent (CLAUDE.md) : ne pose aucune question.

1. Lis le calendrier Metricool (getScheduledPosts, brand 7193220, Europe/Paris) d'aujourd'hui à J+10.
2. Pour chaque post de PLANNING.md daté d'ici J+5 qui n'est pas encore dans Metricool : produis-le et programme-le comme le décrit CLAUDE.md (Instagram, TikTok, Facebook, story ; musique ; vraies cartes ; chiffres sourcés et datés ; regarde chaque slide). Ne recrée jamais un post déjà programmé : en cas de doute, lis-le et ne le touche pas.
3. Si un post dépend d'un relevé de cotes absent, lance le workflow Cotes (actions_run_trigger) et attends son commit.
4. Fais la veille des news des 8 TCG. Une grosse news prend la place du prochain post sans date, selon PLANNING.md.
5. À partir du 20 du mois, si le mois suivant n'est pas planifié, écris son planning dans PLANNING.md : un post tous les 3 jours, sans trou, mêmes principes.
6. Mets à jour l'historique (TYPES.md, README.md) et l'état dans PLANNING.md, commit, push.
7. Compte rendu en français : ce qui a été programmé (avec les slides via SendUserFile), ce qui reste. S'il n'y avait rien à faire, une ligne suffit.

Si un outil est refusé, un connecteur absent ou une donnée introuvable : ne contourne pas la règle. Note le blocage dans la section « À reprendre » de PLANNING.md et dans le compte rendu.
```

## Une fois la tâche en place

Désactiver les rappels ponctuels de la session du 05/10 (`list_triggers`), pour que deux sessions ne produisent pas le même post en même temps.
