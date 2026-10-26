#!/usr/bin/env python3
"""TCGplayer market prices of the sealed products of the 8 games, recorded.

    python3 outils/scelles.py releve           # one record of today's prices
    python3 outils/scelles.py ecarts <game>    # the moves between the last two records
    python3 outils/scelles.py set <game> <name> # every card of one set, every printing

Why this exists: "Le radar des scellés" (TYPES.md, type 35) shows how sealed
products moved over a month, and no free source keeps that history. tcgcsv.com
mirrors TCGplayer's catalogue and prices every day; this script records them
on the 1st and the 16th, next to the card records (cotes.yml), and compares two
records. Prices are TCGplayer's, in US dollars, for English editions; French
editions come from the app's eBay listing cache at production time.

tcgcsv's rules (https://tcgcsv.com/docs): read last-updated.txt first, one
fetch a day at most, 100 ms between requests, never more than 10 000 requests
a day. A record here is about 600 requests, twice a month.

Stdlib only: it runs on a bare GitHub Actions runner.
"""
import datetime
import json
import os
import sys
import time
import urllib.request

BASE = 'https://tcgcsv.com/tcgplayer'
UA = 'boostz-communication/1.0 (+https://boostz.fr)'
DIR = os.path.join('donnees', 'scelles')
# The app's own mapping (boostz-mobile server/src/services/tcgcsv.js), plus
# category 80, Dragon Ball Super: Fusion World, where today's sealed products are.
CATEGORIES = {'magic': [1], 'pokemon': [3], 'yugioh': [2], 'onepiece': [68], 'lorcana': [71],
              'starwarsunlimited': [79], 'dragonball': [27, 80], 'wow': [13]}
# Sets older than this rarely move on a month and only cost requests. Warcraft
# ended in 2013, so it keeps everything.
YEARS = 5
PAUSE = 0.15


def get(url, tries=4):
    for i in range(tries):
        try:
            time.sleep(PAUSE)
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=40) as r:
                body = r.read()
            return body.decode('utf-8') if url.endswith('.txt') else json.loads(body)
        except Exception as e:
            if i == tries - 1:
                print('failed', url, e, file=sys.stderr)
                return None
            time.sleep(2 ** i)


def is_card(product):
    # The app's rule: a single card carries a real Number, or a Rarity other than "None".
    return any(d.get('name') == 'Number' or (d.get('name') == 'Rarity' and d.get('value') not in (None, '', 'None'))
               for d in product.get('extendedData') or [])


def releve():
    today = datetime.datetime.now(datetime.timezone.utc).date()
    build = get(f'{BASE.rsplit("/", 1)[0]}/last-updated.txt')
    since = (today - datetime.timedelta(days=365 * YEARS)).isoformat()
    meta_path = os.path.join(DIR, 'produits.json')
    meta = json.load(open(meta_path, encoding='utf-8')) if os.path.exists(meta_path) else {}
    prices, requests = {}, 1
    for game, cats in CATEGORIES.items():
        prices[game] = {}
        for cat in cats:
            groups = (get(f'{BASE}/{cat}/groups') or {}).get('results', [])
            requests += 1
            for g in groups:
                if game != 'wow' and (g.get('publishedOn') or '')[:10] < since:
                    continue
                gid = g['groupId']
                products = (get(f'{BASE}/{cat}/{gid}/products') or {}).get('results', [])
                rows = (get(f'{BASE}/{cat}/{gid}/prices') or {}).get('results', [])
                requests += 2
                sealed = {p['productId']: p for p in products if not is_card(p)}
                for r in rows:
                    pid = r.get('productId')
                    if pid not in sealed or r.get('marketPrice') is None:
                        continue
                    # One row per printing; sealed products have a single "Normal" one.
                    if str(pid) in prices[game] and r.get('subTypeName') != 'Normal':
                        continue
                    prices[game][str(pid)] = [r.get('marketPrice'), r.get('lowPrice')]
                    p = sealed[pid]
                    meta[str(pid)] = [game, p.get('name'), g.get('name'), (g.get('publishedOn') or '')[:10], p.get('imageUrl')]
        print(game, len(prices[game]), 'sealed products priced')
    print(requests, 'requests')
    if sum(len(v) for v in prices.values()) < 500:
        sys.exit('too few prices, record not written')
    os.makedirs(DIR, exist_ok=True)
    with open(os.path.join(DIR, f'{today.isoformat()}.json'), 'w', encoding='utf-8') as f:
        json.dump({'date': today.isoformat(), 'source': 'TCGplayer market price, via tcgcsv.com', 'devise': 'USD',
                   'build': (build or '').strip(), 'champs': ['market', 'low'], 'jeux': prices},
                  f, ensure_ascii=False, separators=(',', ':'), sort_keys=True)
    with open(meta_path, 'w', encoding='utf-8') as f:
        json.dump(meta, f, ensure_ascii=False, indent=0, sort_keys=True)


def ecarts(game, n=15):
    files = sorted(f for f in os.listdir(DIR) if f[:4].isdigit())
    if len(files) < 2:
        sys.exit('need two records')
    a, b = (json.load(open(os.path.join(DIR, f), encoding='utf-8')) for f in files[-2:])
    meta = json.load(open(os.path.join(DIR, 'produits.json'), encoding='utf-8'))
    rows = []
    for pid, (m1, _) in b['jeux'].get(game, {}).items():
        m0 = (a['jeux'].get(game, {}).get(pid) or [None])[0]
        if m0 and m1 and m0 >= 20:
            rows.append(((m1 - m0) / m0 * 100, m0, m1, meta[pid][1], meta[pid][2], pid))
    rows.sort(key=lambda r: -abs(r[0]))
    print(game, a['date'], '->', b['date'])
    for r in rows[:n]:
        print(f'{r[0]:+7.1f} %  {r[1]:8.2f} -> {r[2]:8.2f} $  {r[3]} ({r[4]}) #{r[5]}')


def set_cards(game, words):
    """Every card of the sets whose name contains `words`, each printing with
    its market and low price, for the posts on one set (« Sortie d'extension »).
    Lorcast, mirrored by rarebox-data, lists a new Lorcana set without its
    enchanted cards for a while, and those are the ones that cost the most."""
    today = datetime.datetime.now(datetime.timezone.utc).date()
    build = get(f'{BASE.rsplit("/", 1)[0]}/last-updated.txt')
    out = []
    for cat in CATEGORIES[game]:
        for g in (get(f'{BASE}/{cat}/groups') or {}).get('results', []):
            if words.lower() not in g.get('name', '').lower():
                continue
            products = {p['productId']: p for p in (get(f'{BASE}/{cat}/{g["groupId"]}/products') or {}).get('results', []) if is_card(p)}
            for r in (get(f'{BASE}/{cat}/{g["groupId"]}/prices') or {}).get('results', []):
                p = products.get(r.get('productId'))
                if not p or r.get('marketPrice') is None:
                    continue
                ext = {d.get('name'): d.get('value') for d in p.get('extendedData') or []}
                out.append({'id': p['productId'], 'nom': p.get('name'), 'set': g.get('name'), 'numero': ext.get('Number'), 'rarete': ext.get('Rarity'),
                            'version': r.get('subTypeName'), 'market': r.get('marketPrice'), 'low': r.get('lowPrice'), 'image': p.get('imageUrl')})
    if not out:
        sys.exit(f'no priced card for {game} « {words} »')
    out.sort(key=lambda c: -c['market'])
    slug = ''.join(ch if ch.isalnum() else '-' for ch in words.lower()).strip('-')
    os.makedirs(os.path.join('donnees', 'sets'), exist_ok=True)
    with open(os.path.join('donnees', 'sets', f'{game}-{slug}-{today.isoformat()}.json'), 'w', encoding='utf-8') as f:
        json.dump({'date': today.isoformat(), 'source': 'TCGplayer market price, via tcgcsv.com', 'devise': 'USD', 'build': (build or '').strip(), 'cartes': out},
                  f, ensure_ascii=False, indent=0)
    for c in out[:15]:
        print(f'{c["market"]:9.2f} $  {c["nom"]} #{c["numero"]} {c["rarete"]} ({c["version"]})')


if __name__ == '__main__':
    if sys.argv[1] == 'releve':
        releve()
    elif sys.argv[1] == 'set':
        set_cards(sys.argv[2], ' '.join(sys.argv[3:]))
    else:
        ecarts(sys.argv[2])
