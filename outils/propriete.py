# Intellectual-property note of a post (asked on 06/10/2026): posted as the
# first comment on Instagram and Facebook, at the end of the caption on TikTok,
# which has no first-comment API. Usage: python3 outils/propriete.py <date>
IP = {
 'P': "Pokémon : © Pokémon / Nintendo / Creatures / GAME FREAK.",
 'L': "Disney Lorcana : © Disney, édité par Ravensburger.",
 'M': "Magic: The Gathering : © Wizards of the Coast.",
 'O': "One Piece Card Game : © Eiichiro Oda / Shueisha, Toei Animation, édité par Bandai.",
 'Y': "Yu-Gi-Oh! : © Studio Dice / Shueisha, TV TOKYO, KONAMI.",
 'D': "Dragon Ball Super Card Game : © Bird Studio / Shueisha, Toei Animation, édité par Bandai.",
 'S': "Star Wars: Unlimited : © & ™ Lucasfilm Ltd., édité par Fantasy Flight Games.",
 'W': "World of Warcraft : © Blizzard Entertainment.",
 'T': "Star Trek : ™ & © CBS Studios Inc.",
}
ALL = 'PLMOYDSW'
# Games and photo credits of the posts already scheduled, by publication date.
# Add an entry for every new post.
POSTS = {  # date: (IPs, photo credit or '')
 '2026-10-16': (ALL, ''),
 '2026-10-17': ('S', "Illustration et cartes : starwarsunlimited.com et swu-db.com."),
 '2026-10-23': ('P', "Photos des produits : investcollect.com, blazingtail.fr, pokepedia.fr, play-in.com."),
 '2026-10-26': ('P', ''),
 '2026-10-31': ('MPL', ''),
 '2026-11-03': (ALL, "Logo Discord : © Discord Inc."),
 '2026-11-06': ('P', "Images des cartes : versions japonaises, samuraiswordtokyo.com et serebii.net."),
 '2026-11-09': (ALL, ''),
 '2026-11-12': ('YMT', ''),
 '2026-11-14': (ALL, ''),
 '2026-11-17': ('O', "Photos des produits : chocobonplan.com, investcollect.com, espritjeu.com, play-in.com."),
 '2026-11-22': (ALL, ''),
 '2026-11-25': (ALL, ''),
 '2026-11-27': (ALL, ''),
 '2026-11-28': (ALL, ''),
 '2026-12-03': ('Y', ''),
 '2026-12-06': ('L', "Photos des produits : investcollect.com, play-in.com, espritjeu.com, ludum.fr."),
 '2026-12-09': ('L', ''),
 '2026-12-12': ('M', "Photos des produits : investcollect.com, play-in.com."),
 '2026-12-15': (ALL, ''),
 '2026-12-18': ('D', ''),
 '2026-12-21': ('PL', ''),
 '2026-12-24': (ALL, ''),
 '2026-12-27': ('P', "Photos des contrefaçons : justinbasil.com."),
 '2026-12-30': ('PMO', "Photos des cartes : leurs maisons de vente, slabfol.io et polkastarter.com."),
 '2027-01-01': (ALL, ''),
 '2027-01-07': ('S', "Photos des produits : investcollect.com, play-in.com."),
 '2027-02-01': ('W', "Image de la carte : Category One Games."),
 '2027-02-07': ('Y', "Photos des produits : play-in.com, investcollect.com."),
 '2027-02-13': ('PLM', "Photos des cartes : CGC, Screen Rant, Fanatics Collect."),
 '2027-02-16': ('PML', ''),
 '2027-02-19': ('P', ''),
}
def note(date):
    ips, credit = POSTS[date]
    lines = ["©️ Propriété intellectuelle"] + [IP[k] for k in ips]
    if credit: lines.append(credit)
    lines.append("Les noms et les illustrations des cartes appartiennent à leurs ayants droit. Boostz est une application indépendante, ni affiliée ni approuvée par ces sociétés.")
    return "\n".join(lines)
if __name__ == '__main__':
    import sys; print(note(sys.argv[1]))
