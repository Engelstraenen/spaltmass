#!/usr/bin/env python3
"""Baut die Unterseiten (melden, messen, recht, gutachten, karriere) mit gemeinsamem Kopf/Fuß.
Start: python3 tools/unterseiten.py  → site/<name>.html. Zurück-Link: index.html?p=<Haltepunkt>"""
import os
ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'site')
V = '20'
def head(title, desc, back):
    return f'''<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title} – SPALTMASS Kfz-Sachverständige</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#1d1420">
<link rel="stylesheet" href="assets/css/style.css?v={V}">
<link rel="stylesheet" href="assets/css/sub.css?v={V}">
</head>
<body class="sub">
<header class="nav">
  <a class="logo" href="index.html"><b>SPALTMASS</b><span>Kfz-Sachverständige</span></a>
  <nav class="links" aria-label="Themen">
    <a href="melden.html">Melden</a><a href="messen.html">Messen</a><a href="recht.html">Ihr Recht</a><a href="gutachten.html">Gutachten</a><a href="karriere.html">Karriere</a>
  </nav>
  <a class="back" href="index.html?p={back}">Zurück zur Fahrt</a>
  <button class="burger" aria-label="Menü" aria-expanded="false"><i></i><i></i></button>
</header>
<main>
'''
def foot(back):
    return f'''
<div class="wrap"><div class="cta-band rv"><h2>Unfall gehabt?<br><span class="ac">Wir sind in 24&nbsp;h da.</span></h2><div class="btns" style="margin:0"><a class="btn big" href="index.html?p=0">Schaden melden</a><a class="btn ghost big" href="tel:+4900000000" data-demo="Demo: Hier klingelt die 24/7-Hotline.">24/7 anrufen</a></div></div></div>
</main>
<footer class="s-foot"><span>© SPALTMASS Kfz-Sachverständige (Demo-Seite)</span><span><a class="back" href="index.html?p={back}">Zurück zur Fahrt</a> · <a href="#" data-demo="Demo: Impressum folgt.">Impressum</a> · <a href="#" data-demo="Demo: Datenschutz folgt.">Datenschutz</a></span></footer>
<div class="toast" role="status" hidden></div>
{{EXTRA}}
<script src="assets/js/img.js?v={V}"></script>
<script src="assets/js/sub.js?v={V}"></script>
</body>
</html>
'''
def hero(img, kick, h1, lead, alt):
    return f'''<section class="s-hero"><img data-src="{img}" alt="{alt}"><div class="in"><p class="kick">{kick}</p><h1>{h1}</h1><p class="lead">{lead}</p></div></section>
<div class="wrap">'''

P = {}
# ---------------- MELDEN ----------------
P['melden'] = dict(title='Schaden melden', back='0', desc='Unfall? So melden Sie den Schaden in 2 Minuten: 6 Fotos, Bagatell-Check, Unfallkarte fürs Handschuhfach.', body=hero('p01-eingang', '01 · Schaden melden', 'Sechs Fotos.<br>Zwei Minuten.', 'Vom Unfallort direkt zum Sachverständigen. Ohne Warteschleife, ohne Formular-Marathon.', 'Unfallauto am Eingang der Prüfstraße') + '''
<section class="blk rv"><p class="kick">Warum schnell</p><h2>Jeden Tag kracht es tausendfach.</h2>
<div class="two"><div><p class="big"><span data-to="2.51" data-dec="2">0</span><small>Mio.</small></p><p class="lead">Straßenverkehrsunfälle hat die Polizei 2024 in Deutschland erfasst. Das sind rund <b data-to="6900">0</b> pro Tag. Wer gleich Fotos macht, hat später die besten Beweise.</p><p class="src">Quelle: Statistisches Bundesamt (Destatis), polizeilich erfasste Unfälle 2024.</p></div>
<div><img data-src="p05-werte" alt="Unfallauto in der Prüfstraße, Delle am Stoßfänger"></div></div></section>
<section class="blk rv"><p class="kick">Foto-Guide</p><h2>Diese sechs Fotos brauchen wir.</h2><p class="lead">Einmal rund ums Auto. Mehr nicht. Das Handy reicht völlig.</p>
<div class="grid6"><div><b>1</b><span>Auto schräg vorn</span><small>ganzes Fahrzeug mit Kennzeichen</small></div><div><b>2</b><span>Auto schräg hinten</span><small>gegenüberliegende Ecke</small></div><div><b>3</b><span>Schaden aus 2 m</span><small>damit man sieht, wo er sitzt</small></div><div><b>4</b><span>Schaden nah</span><small>Delle, Kratzer, Risse</small></div><div><b>5</b><span>Unfallstelle</span><small>Straße, Schilder, Lage der Autos</small></div><div><b>6</b><span>Unterlagen</span><small>Fahrzeugschein, Daten des Gegners</small></div></div></section>
<section class="blk rv" id="bagatell"><p class="kick">Bagatell-Check</p><h2>Gutachten oder Kostenvoranschlag?</h2><p class="lead">Zwei Fragen, eine ehrliche Antwort. Bei kleinen Schäden reicht oft ein Kostenvoranschlag, das sagen wir Ihnen auch.</p>
<p style="margin-top:26px;font-weight:600">Wer hat den Unfall verursacht?</p><div class="chips" data-q="schuld"><button data-v="gegner">Der andere</button><button data-v="unklar">Unklar</button><button data-v="ich">Ich selbst</button></div>
<p style="margin-top:22px;font-weight:600">Wie sieht der Schaden aus?</p><div class="chips" data-q="schaden"><button data-v="klein">Kleiner Kratzer, eine Stelle</button><button data-v="gross">Delle, mehrere Teile</button><button data-v="unklar">Kann ich nicht sagen</button></div>
<div class="answer" aria-live="polite">Bitte beide Fragen beantworten.</div>
<p class="src">Faustregel der Rechtsprechung: Bagatellgrenze rund 750 € (BGH, VI ZR 365/03). Ersetzt keine Rechtsberatung.</p></section>
<section class="blk rv"><p class="kick">Unfallkarte</p><h2>Für das Handschuhfach.</h2><p class="lead">Im Stress vergisst man das Wichtigste. Drucken, falten, ins Auto legen.</p>
<ol class="steps"><li><div><b>Sichern</b><span>Warnblinker, Warnweste, Warndreieck.</span></div></li><li><div><b>Verletzte?</b><span>Notruf 112, Erste Hilfe.</span></div></li><li><div><b>Fotos</b><span>Die sechs Fotos von oben.</span></div></li><li><div><b>Daten tauschen</b><span>Name, Kennzeichen, Versicherung des Gegners.</span></div></li><li><div><b>Nichts unterschreiben</b><span>Kein Schuldanerkenntnis vor Ort.</span></div></li><li><div><b>Uns anrufen</b><span>24/7, wir übernehmen den Rest.</span></div></li></ol>
<div class="btns"><button class="btn" id="print-card">Unfallkarte drucken</button></div></section>
<section class="blk rv"><p class="kick">Fragen</p><h2>Gut zu wissen</h2><div class="faq">
<details><summary>Muss ich die Polizei rufen?</summary><p>Bei Verletzten immer. Bei reinem Blechschaden ist es nicht Pflicht, hilft aber bei unklarer Schuldfrage.</p></details>
<details><summary>Wie schnell sind Sie vor Ort?</summary><p>In der Regel innerhalb von 24 Stunden, bei Ihnen zu Hause, am Arbeitsplatz oder in der Werkstatt.</p></details>
<details><summary>Was kostet mich das?</summary><p>Bei einem unverschuldeten Unfall zahlt die gegnerische Haftpflichtversicherung den Sachverständigen. Bei Bagatellschäden sagen wir Ihnen vorher, ob ein Kostenvoranschlag reicht.</p></details></div></section>
</div>''', extra='''<div class="printcard"><h3>SPALTMASS · Unfallkarte</h3><ol><li>Sichern: Warnblinker, Weste, Dreieck</li><li>Verletzte? 112</li><li>6 Fotos: vorn, hinten, Schaden 2 m, Schaden nah, Unfallstelle, Unterlagen</li><li>Daten des Gegners notieren</li><li>Nichts unterschreiben</li><li>SPALTMASS 24/7 anrufen (Demo)</li></ol></div>''')

# ---------------- MESSEN ----------------
P['messen'] = dict(title='Vermessen', back='.36', desc='Wie ein Kfz-Sachverständiger misst: Spaltmaß, Verformung, Lackschichtdicke an heilen Teilen, versteckte Schäden.', body=hero('p04-messen', '02 · Vermessen', 'Jeder<br>Millimeter.', 'Was wir messen, warum es zählt und wie wir Vorschäden finden.', 'Lackschichtdicken-Messgerät auf heilem Blech, Spaltmaßlehre in der Fuge') + '''
<section class="blk rv"><p class="kick">Der Ablauf</p><h2>So läuft die Besichtigung.</h2>
<div class="two"><ol class="steps"><li><div><b>Rundgang</b><span>Gesamtfotos aus allen Richtungen, Fahrzeugdaten, Kilometerstand.</span></div></li><li><div><b>Schaden dokumentieren</b><span>Jede Stelle mit Maßstab fotografiert, Lage und Größe vermessen.</span></div></li><li><div><b>Spaltmaße</b><span>Abstände zwischen Tür, Kotflügel und Klappen links und rechts verglichen.</span></div></li><li><div><b>Lackschicht</b><span>Gemessen an den heilen Teilen, um alte Reparaturen zu finden.</span></div></li><li><div><b>Kalkulation</b><span>Reparaturweg, Ersatzteile, Arbeitszeit nach Herstellervorgabe.</span></div></li></ol>
<img data-src="p01-eingang" alt="Unfallauto im Streifenlicht"></div></section>
<section class="blk rv" id="skala"><p class="kick">Lackschichtdicke</p><h2>Die Zahl, die Vorschäden verrät.</h2><p class="lead">Das Messgerät setzen wir auf glatte, heile Bauteile. Ist ein Teil deutlich dicker lackiert als der Rest, wurde es schon einmal nachlackiert oder gespachtelt. Tippen Sie auf die Skala.</p>
<div class="scale"><button style="left:15%" aria-label="Werksbereich" data-t="Rund 80 bis 160 µm: typisch für die Serienlackierung, je nach Hersteller. Alles im grünen Bereich."></button><button style="left:52%" aria-label="Nachlackiert" data-t="Deutlich mehr als am Rest des Autos, etwa 200 bis 300 µm: Hier wurde wahrscheinlich nachlackiert. Für das Gutachten ist das ein Vorschaden."></button><button style="left:86%" aria-label="Gespachtelt" data-t="Weit über 300 µm: Spachtel unter dem Lack. Ein reparierter Altschaden, den wir vom neuen Schaden trennen."></button></div>
<div class="scale-l"><span>Serie</span><span>nachlackiert</span><span>gespachtelt</span></div>
<div class="answer" aria-live="polite">Tippen Sie auf einen Bereich der Skala.</div>
<p class="src">Typische Richtwerte aus der Praxis, je Hersteller verschieden. Entscheidend ist der Vergleich mit den anderen Teilen desselben Autos.</p></section>
<section class="blk rv"><p class="kick">Spaltmaß</p><h2>Gleich links und rechts.</h2><div class="two rev"><div><p class="lead">Ab Werk sind die Fugen zwischen den Teilen auf beiden Seiten nahezu gleich, oft wenige Millimeter. Weicht eine Seite deutlich ab, hat sich etwas verzogen, manchmal tief in der Struktur. Genau das gehört ins Gutachten.</p>
<ul class="reads"><li><b>3,8</b><span>mm Fuge links (heile Seite)</span></li><li><b>6,1</b><span>mm Fuge rechts (Unfallseite)</span></li></ul><p class="src">Beispielwerte zur Erklärung.</p></div><img data-src="d03-delle" alt="Delle mit Türfuge"></div></section>
<section class="blk rv"><p class="kick">Fragen</p><h2>Gut zu wissen</h2><div class="faq">
<details><summary>Messen Sie den Lack auch in der Delle?</summary><p>Nein. Der Lackschichtdicken-Messer gehört auf glatte, heile Flächen. Die Delle wird fotografiert und mit Maßstab vermessen.</p></details>
<details><summary>Finden Sie Schäden, die man nicht sieht?</summary><p>Oft ja: verzogene Spaltmaße, gebrochene Halter hinter dem Stoßfänger, Sensoren. Im Zweifel empfehlen wir eine Vermessung in der Werkstatt.</p></details></div></section>
</div>''', extra='')

# ---------------- RECHT ----------------
P['recht'] = dict(title='Ihr Recht', back='.49', desc='Freie Gutachterwahl nach unverschuldetem Unfall, Haftpflicht, Kasko, Leasing-Rückgabe, Oldtimer. Mit Musterantwort an die Versicherung.', body=hero('p05-werte', '03 · Ihr Recht', 'Ihr Gutachter.<br><span class="ac">Ihre Wahl.</span>', 'Nach einem unverschuldeten Unfall entscheiden Sie, wer Ihren Schaden begutachtet. Nicht die Versicherung des Gegners.', 'Unfallauto zwischen zwei Anzeigetafeln') + '''
<section class="blk rv"><p class="kick">Warum das zählt</p><h2>Schäden werden immer teurer.</h2><p class="lead">Durchschnittlicher Sachschaden je Pkw in der Kfz-Haftpflicht. Je höher der Schaden, desto wichtiger ein unabhängiges Gutachten.</p>
<div class="bars"><div class="bar"><span>2013</span><i style="--v:.59"></i><b>≈ 2.500 €</b></div><div class="bar"><span>2017</span><i style="--v:.64"></i><b>≈ 2.700 €</b></div><div class="bar"><span>2023</span><i style="--v:.94"></i><b>≈ 4.000 €</b></div><div class="bar"><span>2024</span><i style="--v:1"></i><b>≈ 4.250 €</b></div></div>
<p class="src">Quelle: GDV, Gesamtverband der Versicherer (über autohaus.de/cash-online.de). Werkstatt-Stundensatz 2024 im Schnitt 202 €.</p></section>
<section class="blk rv"><p class="kick">Ihr Fall</p><h2>Vier Situationen, vier Regeln.</h2><div class="cards">
<div class="card"><span class="tag">Haftpflicht</span><b>Der andere war schuld</b><p>Sie wählen den Sachverständigen frei. Die gegnerische Versicherung zahlt Gutachten, Reparatur, Wertminderung und Nutzungsausfall.</p></div>
<div class="card"><span class="tag">Kasko</span><b>Eigener Schaden</b><p>Hier beauftragt meist Ihre Versicherung den Gutachter. Wir können unabhängig gegenprüfen, die Kosten besprechen wir vorher.</p></div>
<div class="card"><span class="tag">Leasing</span><b>Rückgabe ohne Ärger</b><p>Vor der Rückgabe prüfen wir, was normale Abnutzung ist und was ein Schaden. So zahlen Sie nur, was wirklich fällig ist.</p></div>
<div class="card"><span class="tag">Oldtimer</span><b>Wert belegen</b><p>Wertgutachten mit Zustandsnote für Versicherung, Kauf oder Verkauf. Nach einem Unfall zählt der belegte Wert.</p></div></div></section>
<section class="blk rv"><p class="kick">Musterantwort</p><h2>Die Versicherung schickt ihren Gutachter?</h2><p class="lead">Das dürfen Sie freundlich ablehnen. Text kopieren, ergänzen, abschicken.</p>
<div class="mail">Sehr geehrte Damen und Herren,

vielen Dank für Ihr Angebot. Zur Feststellung meines Schadens vom [Datum] am Fahrzeug [Kennzeichen] habe ich bereits einen unabhängigen Kfz-Sachverständigen beauftragt. Das Gutachten erhalten Sie direkt nach Fertigstellung.

Bitte sehen Sie von einer eigenen Besichtigung ab.

Mit freundlichen Grüßen
[Name]</div>
<div class="btns"><button class="btn" id="copy-mail">Text kopieren</button></div>
<p class="src">Muster ohne Gewähr, ersetzt keine Rechtsberatung.</p></section>
<section class="blk rv"><p class="kick">Fragen</p><h2>Gut zu wissen</h2><div class="faq">
<details><summary>Ab wann lohnt sich ein Gutachten?</summary><p>Faustregel: ab rund 750 € Schaden. Darunter reicht oft ein Kostenvoranschlag. Den Bagatell-Check finden Sie unter „Schaden melden“.</p></details>
<details><summary>Muss ich in die Werkstatt der Versicherung?</summary><p>Nein. Bei einem Haftpflichtschaden wählen Sie Ihre Werkstatt selbst.</p></details>
<details><summary>Was ist, wenn die Schuld geteilt wird?</summary><p>Dann zahlt die Gegenseite anteilig. Wir sagen Ihnen vorher, womit Sie rechnen können.</p></details></div></section>
</div>''', extra='')

# ---------------- GUTACHTEN ----------------
P['gutachten'] = dict(title='Gutachten', back='.62', desc='Was im Gutachten steht, was Ihnen zusteht: Rechner für Wertminderung und Nutzungsausfall, Tracker, Unterschied zum Kostenvoranschlag.', body=hero('p06-drucker', '04 · Gutachten', 'Gutachten<br>in 48&nbsp;h.', 'Mit Fotos, Maßen und Kalkulation. Und mit allem, was Ihnen zusteht.', 'Gutachten kommt aus dem Druckerschlitz') + '''
<section class="blk rv"><p class="kick">Gutachten oder Kostenvoranschlag</p><h2>Was drinsteht, wird bezahlt.</h2><div class="cards">
<div class="card"><span class="tag">Beide</span><b>Reparaturkosten</b><p>Teile, Lack, Arbeitszeit.</p></div>
<div class="card"><span class="tag">Nur Gutachten</span><b>Wertminderung</b><p>Ein Unfallauto ist beim Verkauf weniger wert, auch repariert.</p></div>
<div class="card"><span class="tag">Nur Gutachten</span><b>Nutzungsausfall</b><p>Geld für jeden Tag ohne Auto, wenn Sie keinen Mietwagen nehmen.</p></div>
<div class="card"><span class="tag">Nur Gutachten</span><b>Wiederbeschaffungs- und Restwert</b><p>Entscheidet, ob sich die Reparatur lohnt.</p></div>
<div class="card"><span class="tag">Nur Gutachten</span><b>Beweissicherung</b><p>Fotos und Maße, die vor Gericht halten.</p></div></div></section>
<section class="blk rv" id="rechner"><p class="kick">Rechner</p><h2>Was steht Ihnen zu?</h2><p class="lead">Grobe Schätzung nach den üblichen Methoden. Das genaue Ergebnis steht im Gutachten.</p>
<div class="calc"><div>
<label>Wiederbeschaffungswert des Autos <output data-o="wbw"></output><input type="range" name="wbw" min="5000" max="80000" step="500" value="25000"></label>
<label>Reparaturkosten <output data-o="rk"></output><input type="range" name="rk" min="500" max="30000" step="100" value="6500"></label>
<label>Zulassungsjahr <output data-o="age"></output><input type="range" name="age" min="1" max="8" step="1" value="2"></label>
<label>Fahrzeuggruppe (Nutzungsausfall)<select name="grp"><option value="A">A · Kleinstwagen</option><option value="C">C · Kleinwagen</option><option value="E">E · Kompakt</option><option value="F" selected>F · Mittelklasse</option><option value="H">H · Obere Mittelklasse</option><option value="J">J · Oberklasse</option><option value="L">L · Luxus/Sport</option></select></label>
<label>Tage ohne Auto <output data-o="days"></output><input type="range" name="days" min="1" max="21" step="1" value="6"></label></div>
<div class="res"><div><span>Wertminderung</span><b data-r="mw">0 €</b></div><div><span>Nutzungsausfall</span><b data-r="nu">0 €</b></div><div class="sum"><span>Zusätzlich zur Reparatur</span><b data-r="sum">0 €</b></div><p class="src" data-r="info"></p></div></div>
<p class="src">Wertminderung nach Ruhkopf/Sahm, Nutzungsausfall nach Schwacke-Gruppen (Richtwerte). Keine verbindliche Berechnung, Werte ohne Gewähr.</p></section>
<section class="blk rv"><p class="kick">Nutzungsausfall</p><h2>Tagessätze nach Fahrzeuggruppe.</h2>
<div class="cols"><div style="--d:0"><em>23</em><i style="--v:.13"></i>A</div><div style="--d:1"><em>29</em><i style="--v:.17"></i>B</div><div style="--d:2"><em>35</em><i style="--v:.2"></i>C</div><div style="--d:3"><em>38</em><i style="--v:.22"></i>D</div><div style="--d:4"><em>43</em><i style="--v:.25"></i>E</div><div style="--d:5"><em>50</em><i style="--v:.29"></i>F</div><div style="--d:6"><em>59</em><i style="--v:.34"></i>G</div><div style="--d:7"><em>65</em><i style="--v:.37"></i>H</div><div style="--d:8"><em>79</em><i style="--v:.45"></i>J</div><div style="--d:9"><em>119</em><i style="--v:.68"></i>K</div><div style="--d:10"><em>175</em><i style="--v:1"></i>L</div></div>
<p class="src">Euro je Tag, Schwacke-Tabelle (Sanden/Danner/Küppersbusch), Richtwerte für Pkw. Welche Gruppe Ihr Auto hat, steht im Gutachten.</p></section>
<section class="blk rv"><p class="kick">Tracker</p><h2>Wo ist mein Gutachten?</h2><p class="lead">Wie bei einem Paket: Sie sehen jederzeit, wie weit wir sind. (Demo)</p>
<ol class="track" id="tracker"><li><b>Gemeldet</b>Fotos da</li><li><b>Termin</b>morgen 9:00</li><li><b>Besichtigt</b>vor Ort</li><li><b>Kalkuliert</b>Kosten, Werte</li><li><b>Versendet</b>an Sie + Werkstatt</li></ol></section>
</div>''', extra='')

# ---------------- KARRIERE ----------------
P['karriere'] = dict(title='Karriere', back='.86', desc='Vom Kfz-Meister, Techniker oder Ingenieur zum Kfz-Sachverständigen. Weg, Weiterbildung, Benefits. Bewerbung in 60 Sekunden.', body=hero('p08-karriere', '06 · Karriere', 'Kfz-Profi?<br><span class="ac">Werde Gutachter.</span>', 'Dein Fachwissen, neu eingesetzt: draußen bei den Kunden statt in der Werkstattschicht.', 'Junge Sachverständige mit Tablet neben einem Auto') + '''
<section class="blk rv"><p class="kick">Dein Weg</p><h2>In vier Schritten zum Sachverständigen.</h2>
<ol class="steps"><li><div><b>Fundament</b><span>Kfz-Meister, staatlich geprüfter Techniker oder Ingenieur Fahrzeugtechnik.</span></div></li><li><div><b>Einarbeitung</b><span>Mitfahren, mitmessen, mitschreiben: mit einem erfahrenen Kollegen an deiner Seite.</span></div></li><li><div><b>Weiterbildung</b><span>Lehrgang zum Kfz-Sachverständigen, von uns bezahlt.</span></div></li><li><div><b>Zertifizierung</b><span>Prüfung nach DIN EN ISO/IEC 17024, danach eigene Gutachten.</span></div></li></ol></section>
<section class="blk rv"><p class="kick">Was du bekommst</p><h2>Klare Sache.</h2><div class="cards">
<div class="card"><b>E-Firmenwagen</b><p>Ab dem ersten Tag, auch privat.</p></div>
<div class="card"><b>Planbare Termine</b><p>Tagsüber beim Kunden, keine Schichten.</p></div>
<div class="card"><b>Tablet statt Papier</b><p>Messgeräte, Kalkulation und Fotos digital.</p></div>
<div class="card"><b>Weiterbildung bezahlt</b><p>Lehrgang, Prüfung, Fachtage.</p></div></div></section>
<section class="blk rv"><div class="two"><div><p class="kick">Bewerbung</p><h2>Kein Anschreiben. Drei Fragen.</h2><p class="lead">60 Sekunden, dann melden wir uns innerhalb von 24 Stunden.</p><div class="btns"><button class="btn big" data-open="bewerben">In 60 Sekunden bewerben</button></div></div><img data-src="p08-karriere" alt="Sachverständige mit Tablet am Leitstand"></div></section>
</div>''', extra='''<dialog id="m-bewerben" aria-labelledby="mb-h"><form method="dialog" class="mm" novalidate><button class="x" value="x" aria-label="Schließen">×</button><p class="kick">Bewerbung · <span data-sec>60</span> s</p><h3 id="mb-h">Kein Anschreiben. Drei Fragen.</h3>
<div class="q on"><p>Was bist du?</p><div class="opts"><button type="button">Kfz-Meister</button><button type="button">Techniker</button><button type="button">Ingenieur</button><button type="button">Geselle</button></div></div>
<div class="q"><p>Ab wann?</p><div class="opts"><button type="button">Sofort</button><button type="button">In 3 Monaten</button><button type="button">Später</button></div></div>
<div class="q"><p>Wie erreichen wir dich?</p><input type="tel" placeholder="Telefon" aria-label="Telefon" autocomplete="tel"><button type="button" class="btn send">Abschicken</button></div>
<div class="q"><p class="ok">Danke! Wir melden uns innerhalb von 24&nbsp;h. (Demo)</p></div></form></dialog>''')

for k, d in P.items():
    html = head(d['title'], d['desc'], d['back']) + d['body'] + foot(d['back']).replace('{EXTRA}', d['extra'])
    open(os.path.join(ROOT, k + '.html'), 'w').write(html)
    print(k, len(html))
