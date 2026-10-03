#!/usr/bin/env python3
"""Cardmarket price snapshots for every Pokémon card, and the biggest movers.

    python3 outils/cotes.py releve   # one snapshot of today's prices
    python3 outils/cotes.py top      # the movers between the last two snapshots

Why this exists: no public source keeps a market-wide price history any more.
The tcgcsv daily archives answer 403 since mid-September 2026, and the GitHub
datasets built on them froze at the same moment. TCGdex still publishes, for
every card, the Cardmarket figures of the day (EUR: 1/7/30-day average sale
price, trend, lowest listing) but no history - so this script records them
itself, on the 1st and the 16th of each month, and compares two records.

Stdlib only: it runs on a bare GitHub Actions runner.
"""
import concurrent.futures
import datetime
import json
import os
import sys
import time
import urllib.request

API = 'https://api.tcgdex.net/v2/fr'
DIR = os.path.join('donnees', 'cotes', 'pokemon')
UA = 'boostz-communication (+https://boostz.fr)'
# A card under this price moves 50 % on a single sale; such moves are noise, not news.
FLOOR_EUR = 10.0
# Below this, a card is not worth keeping in a snapshot at all.
KEEP_EUR = 1.0


def get(url, tries=5):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except Exception as e:
            if i == tries - 1:
                print('failed', url, e, file=sys.stderr)
                return None
            time.sleep(2 ** i)


def card(cid):
    c = get(f'{API}/cards/{cid}')
    if not c:
        return cid, None
    cm = ((c.get('pricing') or {}).get('cardmarket')) or {}
    prices = [cm.get(k) for k in ('avg1', 'avg7', 'avg30', 'trend', 'low')]
    meta = [c.get('name'), (c.get('set') or {}).get('name'), c.get('localId'), c.get('rarity'), c.get('image')]
    return cid, (prices, meta)


def releve():
    today = datetime.datetime.now(datetime.timezone.utc).date().isoformat()
    ids = [c['id'] for c in get(f'{API}/cards')]
    print(len(ids), 'cards to read')
    snap, meta, failed = {}, {}, 0
    # Eight at a time: about ten minutes for the whole catalogue, a load TCGdex,
    # a free API, absorbs without noticing - and only twice a month.
    with concurrent.futures.ThreadPoolExecutor(8) as pool:
        for n, (cid, res) in enumerate(pool.map(card, ids)):
            if res is None:
                failed += 1
                continue
            prices, m = res
            if max([p for p in prices if isinstance(p, (int, float))] or [0]) >= KEEP_EUR:
                snap[cid] = prices
                meta[cid] = m
            if n % 2000 == 0:
                print(n, 'read,', len(snap), 'priced')
    # A snapshot that lost a large part of the catalogue would fake hundreds of moves.
    if failed > len(ids) * 0.05:
        sys.exit(f'{failed} cards failed, snapshot not written')
    os.makedirs(DIR, exist_ok=True)
    with open(os.path.join(DIR, f'{today}.json'), 'w', encoding='utf-8') as f:
        json.dump({'date': today, 'source': 'Cardmarket, via TCGdex', 'champs': ['avg1', 'avg7', 'avg30', 'trend', 'low'],
                   'cartes': snap}, f, ensure_ascii=False, separators=(',', ':'), sort_keys=True)
    # Names and images change rarely: one file, overwritten, so git only stores the diff.
    path = os.path.join(DIR, 'cartes.json')
    known = json.load(open(path, encoding='utf-8')) if os.path.exists(path) else {}
    known.update(meta)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(known, f, ensure_ascii=False, indent=0, sort_keys=True)
    print(today, len(snap), 'priced cards,', failed, 'failed')


def snapshots():
    return sorted(f[:-5] for f in os.listdir(DIR) if f[:4].isdigit() and f.endswith('.json'))


def top():
    days = snapshots()
    end = days[-1]
    load = lambda d: json.load(open(os.path.join(DIR, f'{d}.json'), encoding='utf-8'))['cartes']
    meta = json.load(open(os.path.join(DIR, 'cartes.json'), encoding='utf-8'))
    end_day = datetime.date.fromisoformat(end)
    # The previous snapshot at least 13 days older: the 1st-16th rhythm gives 13 to 16 days.
    older = [d for d in days if (end_day - datetime.date.fromisoformat(d)).days >= 13]
    b = load(end)
    if older:
        start, a = older[-1], load(older[-1])
        mode = 'Prix de vente moyen sur 7 jours, d\'un relevé à l\'autre'
        pairs = {cid: (a[cid][1], b[cid][1], a[cid][3], b[cid][3]) for cid in set(a) & set(b)}
    else:
        # One snapshot only: compare the last 7 days with the last 30 days of the same record.
        start = None
        mode = 'Aperçu : prix de vente moyen des 7 derniers jours, comparé à celui des 30 derniers jours'
        pairs = {cid: (p[2], p[1], p[2], p[3]) for cid, p in b.items()}
    rows = []
    for cid, (v0, v1, t0, t1) in pairs.items():
        if not all(isinstance(v, (int, float)) for v in (v0, v1, t0, t1)):
            continue
        if v0 < FLOOR_EUR or v1 < FLOOR_EUR:
            continue
        # The Cardmarket trend must move the same way: a single odd sale moves the
        # average but not the trend, and that is exactly the false mover to drop.
        if (v1 - v0) * (t1 - t0) <= 0:
            continue
        m = meta.get(cid, [None] * 5)
        rows.append({'id': cid, 'nom': m[0], 'set': m[1], 'numero': m[2], 'rarete': m[3], 'image': m[4],
                     'avant': v0, 'apres': v1, 'evolution': round((v1 - v0) / v0 * 100, 1)})
    rows.sort(key=lambda r: -abs(r['evolution']))
    out = {'debut': start, 'fin': end, 'mode': mode, 'seuil_eur': FLOOR_EUR, 'candidates': len(rows),
           'mouvements': rows[:10],
           'hausses': sorted([r for r in rows if r['evolution'] > 0], key=lambda r: -r['evolution'])[:10],
           'baisses': sorted([r for r in rows if r['evolution'] < 0], key=lambda r: r['evolution'])[:10]}
    img_dir = os.path.join(DIR, 'images')
    os.makedirs(img_dir, exist_ok=True)
    for r in {r['id']: r for r in out['mouvements'] + out['hausses'][:3] + out['baisses'][:3]}.values():
        dest = os.path.join(img_dir, f"{r['id']}.png")
        if r['image'] and not os.path.exists(dest):
            try:
                req = urllib.request.Request(r['image'] + '/high.png', headers={'User-Agent': UA})
                with urllib.request.urlopen(req, timeout=30) as resp, open(dest, 'wb') as f:
                    f.write(resp.read())
            except Exception as e:
                print('no image for', r['id'], e, file=sys.stderr)
    with open(os.path.join(DIR, f'top-{end}.json'), 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(mode, start, '->', end, len(rows), 'candidates')
    for r in out['mouvements']:
        print(f"{r['evolution']:+7.1f} %  {r['avant']:8.2f} -> {r['apres']:8.2f}  {r['nom']} ({r['set']} {r['numero']})")


if __name__ == '__main__':
    {'releve': releve, 'top': top}[sys.argv[1]]()
