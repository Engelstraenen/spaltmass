#!/usr/bin/env python3
"""Baut abnahme/abnahme.html (Vorlage RUSSFREI) für SPALTMASS Storyboard 7B. Notizen unten pflegen."""
import re
V = open('abnahme/abnahme-vorlage.html').read()
head = V[:V.index('</style>') + 8].replace('RUSSFREI Abnahme', 'SPALTMASS Abnahme').replace('--acc:#e6ff3a; --on-acc:#141516', '--acc:#ff6b57; --on-acc:#1a0f0c').replace('--bg:#141516; --panel:#1c1e20', '--bg:#1e252b; --panel:#161b20')
tail = V[V.index('<div class="lb"'):]
URL = 'https://engelstraenen.github.io/spaltmass/'
K = [
 ('Landing · Schaden antippen', None, 'Wie Storyboard: Auto mittig am Tunneleingang, 3 Beispiel-Markierungen mit Beschriftung (löschbar), rechts „Ihre Meldung“ mit Schaden abschicken + 24/7 anrufen.'),
 ('Gemeldet · danach anrufen', None, 'Wie Storyboard: nach dem Abschicken „Der Gutachter hat alles im Postfach“ + Jetzt Gutachter anrufen.'),
 ('Streifenlicht · Jeder Millimeter', 'Storyboard zeigt die Seite des Autos im Streifenlicht. Auf der Seite fährt das Auto als echter Film (Scrollen spult) in den Tunnel, Blick von hinten.', None),
 ('Messen · Spaltmaß und Lack', None, 'Wie Storyboard: Spaltmaßlehre in der Fuge, Lackschicht-Messgerät auf heilem Blech (fester Griff), Messwert-Schilder am Bild. Kein Zollstock.'),
 ('Werte · 130-%-Regel', 'Beide Anzeigen hängen an der rechten Tafel übereinander (links steht der Text). Tacho startet bei 72 %, 60/115/145 % zum Antippen.', None),
 ('Gutachten aus dem Druckerschlitz', None, 'Wie Storyboard: Gutachten fährt beim Scrollen aus dem Schlitz (Fotos, Reparaturkosten, Wertminderung, Nutzungsausfall, Restwert).'),
 ('Repariert · ins Tageslicht', '{P7}', None),
 ('Karriere am Leitstand', None, 'Wie Storyboard: Sachverständige mit Tablet am Leitstand, Vorteile als Kinetik-Typo, Bewerbung in 60 Sekunden.'),
 ('Handy · Google-Bewertung', 'Google-Karte ist als „Beispiel“ markiert (Firma erfunden, keine echten Bewertungen).', None),
]
def build(p7='Tageslicht-Bild PS-07 fehlt noch (sjinn voll), Stelle ist vorerst dunkel.', status='In Arbeit · online'):
    s = [head, '\n<div class="wrap">\n  <header class="top">\n    <h1>SPALTMASS · Abnahme</h1>\n    <div class="status">',
         f'      <span class="pill"><b>{status}</b></span>', '      <span class="pill">Storyboard 1 „Die Prüfstraße“ (SPSB-7B) · Schiefer + Koralle</span>',
         '      <span class="pill">Geprüft: 1440, 1280, 390, 360, 430, quer 844 · 0 Fehler · kein Querscroll</span>', '      <span class="pill">Alle Bilder/Filme kostenlos (Unlimited)</span>', '    </div>',
         f'    <div class="actions">\n      <a class="btn" href="{URL}" target="_blank" rel="noopener">Seite öffnen</a>\n      <code class="url">{URL}</code>\n    </div>',
         '    <p class="note ok">Je Kapitel: links das Storyboard, Mitte die fertige Seite am Laptop, rechts am Handy. Bild antippen = groß.</p>\n  </header>\n']
    for i, (t, dev, ok) in enumerate(K, 1):
        note = f'<p class="note">Abweichung: {dev.replace("{P7}", p7)}</p>' if dev else f'<p class="note ok">{ok}</p>'
        s.append(f'  <section class="ch"><div class="ch-h"><span class="n">{i}</span><h2>{t}</h2></div>\n    <div class="grid"><figure><img src="{i}-storyboard.jpg" alt="Storyboard {t}"><figcaption>Storyboard</figcaption></figure><figure><img src="{i}-desktop.jpg" alt="Seite {t} Laptop"><figcaption>Seite · Laptop</figcaption></figure><figure><img src="{i}-handy.jpg" alt="Seite {t} Handy"><figcaption>Handy</figcaption></figure></div>\n    {note}</section>\n')
    s.append(f'  <section class="ch box"><h2>Zum Einbetten</h2>\n    <pre id="emb">&lt;iframe src="{URL}" width="100%" height="800" style="border:0" loading="lazy" title="SPALTMASS Demo"&gt;&lt;/iframe&gt;</pre>\n    <div class="actions"><button class="btn ghost" id="copy" type="button">Code kopieren</button><span id="copied" class="url" hidden>Kopiert</span></div>\n  </section>\n</div>\n\n')
    s.append(tail)
    return '\n'.join(s)
if __name__ == '__main__':
    import sys
    a = sys.argv[1:]
    open('abnahme/abnahme.html', 'w').write(build(*a) if a else build())
    print('ok')
