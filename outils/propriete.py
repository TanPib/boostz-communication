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
 '2026-10-22': ('P', ''),
 '2026-10-25': (ALL, ''),
 '2026-10-31': ('MPL', ''),
 '2026-11-06': ('P', "Images des cartes : versions japonaises, samuraiswordtokyo.com et serebii.net."),
 '2026-11-09': ('L', ''),
 '2026-11-12': ('YMT', ''),
 '2026-11-15': (ALL, ''),
 '2026-11-24': ('W', "Image de la carte : Category One Games."),
 '2026-11-27': (ALL, ''),
 '2026-12-03': ('Y', ''),
 '2026-12-09': ('PLM', "Photos des cartes : CGC, Screen Rant, Fanatics Collect."),
 '2026-12-12': ('PML', ''),
 '2026-12-15': ('P', ''),
 '2026-12-18': ('D', ''),
 '2026-12-21': ('PL', ''),
 '2026-12-24': (ALL, ''),
 '2026-12-27': ('P', "Photos des contrefaçons : justinbasil.com."),
 '2026-12-30': ('PMO', "Photos des cartes : leurs maisons de vente, slabfol.io et polkastarter.com."),
 '2027-01-01': (ALL, ''),
}
def note(date):
    ips, credit = POSTS[date]
    lines = ["©️ Propriété intellectuelle"] + [IP[k] for k in ips]
    if credit: lines.append(credit)
    lines.append("Les noms et les illustrations des cartes appartiennent à leurs ayants droit. Boostz est une application indépendante, ni affiliée ni approuvée par ces sociétés.")
    return "\n".join(lines)
if __name__ == '__main__':
    import sys; print(note(sys.argv[1]))
