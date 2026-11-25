# PROJEKT-MASTERFILE – SPALTMASS
Gilt zusätzlich zur globalen Masterfile (~/.claude/CLAUDE.md).

## 1. Ziel und Endprodukt
Muster-/Demo-Webseite für Kfz-Sachverständige (Kfz-Gutachter), Akquise-Demo wie WARMHERZ, FARBKANTE, LICHTBOGEN. Fiktive Firma „SPALTMASS – Kfz-Sachverständige“. Modern, cool, praxisnah, löst echte Probleme der Gutachter-Firmen.

Probleme, die die Seite lösen soll:
- Geschädigte wissen nicht, dass sie den Gutachter bei unverschuldetem Unfall frei wählen dürfen und die gegnerische Versicherung zahlt (Versicherer steuern zu eigenen Gutachtern).
- Schnelligkeit: Erreichbarkeit 24/7, Vor-Ort-Termin in 24 h, Gutachten in 48 h.
- Schaden digital melden (Fotos per Handy/Chat), weniger Telefon-Pingpong.
- Vertrauen/Kompetenz sichtbar machen (Messtechnik, Lackschichtdicke, Spaltmaß, versteckte Schäden).
- Nachwuchs/Fachkräfte (Kfz-Meister, Ingenieure → Sachverständige): eigenes Recruiting-Kapitel.

## 2. Qualitätsanspruch & Referenzen
Aufbau wie FLUTLICHT27/FARBKANTE: Film-Kapitel (Scroll spult Video) ↔ Motion Design, Vorher → Arbeit → Ergebnis, Bewertungen bewegt, mobil-optimiert.

## 3. Regeln für dieses Projekt
Gratis zuerst (sjinn Unlimited). Bezahlt nur nach OK. Keine Preise/Euro in Storyboards.

## 4. Skills, Plugins, Agenten, MCP
| Name | wofür |
|---|---|
| claude-in-chrome | sjinn.ai Storyboards/Bilder/Videos |

## 5. Zugänge
sjinn.ai im Chrome eingeloggt ✅ · GitHub (gh) prüfen vor Push

## 6. Workflow & Freigabepunkte
1. 3 Storyboards (SPSB-1/2/3) → Eugen wählt
2. Motivliste 4K + First Frames → Freigabe
3. Video-Drafts → Freigabe → Endrender MiniMax H3 2K (nach OK)
4. Seite bauen, Handy-Check 4 Größen, GitHub Pages

## 7. Befehle
- Vorschau: `python3 tools/serve.py 4393` → http://127.0.0.1:4393/
- Bilder: `python3 tools/assets.py` (assets-roh/4k → site/assets/img)
- Video: `python3 tools/video.py <roh.mp4> hero|messen|karriere` (All-Intra + Handy-Ausschnitt, schreibt vid.js)
- Veröffentlichen: `git push` + `git subtree split --prefix site -b gh-pages && git push -f origin gh-pages` → https://engelstraenen.github.io/spaltmass/
- Prüfen: `python3 tools/check.py <url> <ordner> 1440x900 schaden:0,...` · Handy: `python3 tools/mobil_check.py <url> <ordner>`

## 8. Offene Fragen
- Freigabe Startbilder SPD-01 + SPD-07 → Orbit-Filme (Dreamina-Platz über Koordinations-Sitzung)

## 9. Entschieden
- 23.11.2026: Fiktiver Name SPALTMASS (Profi-Begriff Spaltmaß, Gewerk eindeutig). Storyboards: 1 „Streiflicht“ (schwarz/Cyan), 2 „Die Unfallnacht“ (Nacht/Orange, 24-h-Geschichte), 3 „Das Labor“ (hell/Signalgelb, Explosionszeichnung, Lackschichten). Prompts `konzepte/prompts.md`.
- 23.11.2026: Eugen wählt Storyboard 1 „Streiflicht“. Motive `konzepte/motive.json`, Seite `site/`.
- 23.11.2026: Restliche 4K-Motive gratis abwarten (bezahlt ca. 750 Credits abgelehnt).
- 24.11.2026: Video-Drafts auf Dreamina Seedance 2.5 720P Unlimited (kontoweit nur 1 gleichzeitig). FACHLICH (Eugen): Lackschichtdicken-Messer nur auf glatten, heilen Bauteilen (Vorschaden/Nachlackierung finden), NIE in der Delle. Delle = Foto + Maßstab + Spaltmaß. Messen-Szene zeigt den Gutachter an der HEILEN Seite (Delle nicht im Bild). Bild-Edits behalten die Handposition des Referenzbilds → für neue Handlung neu komponieren, nur Auto/Studio als Referenz. Startbilder vor dem Senden klein selbst auf fachliche Richtigkeit prüfen (02B/02C gingen falsch raus). Griff (Eugen): Messgerät fest in der ganzen Hand (Finger drum, Daumen seitlich, Sensor senkrecht mit Druck), nie locker mit Fingerspitzen; im Prompt ausdrücklich als GRIP-Absatz.

## 10. Ablage
Code: dieser Ordner. Storyboards: `konzepte/`. Rohmedien: `assets-roh/` (gitignore).
- 25.11.2026: Neuaufbau, Eugen wählt Storyboard 1 „Drehteller“ (SPSB-4, konzepte/4-drehteller.jpg): ein Unfallauto auf Drehteller, Scroll umkreist und zoomt in Dellen, jede Delle = Kapitel, eine durchgehende Geschichte. Farbwelt Aubergine #1d1420 + Mint #7ff2c8. Altes Schema (Streiflicht) abgelöst. Drehbuch konzepte/umbau-drehbuch.md, Motive konzepte/motive-drehteller.json (Schäden alle RECHTS: Tür hinten rechts = Delle 01).
