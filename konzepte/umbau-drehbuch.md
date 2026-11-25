# SPALTMASS Neuaufbau (25.11.2026) – Leitidee „Das Unfallauto ist die Bühne“

Ein Unfallauto steht die ganze Seite über im Mittelpunkt. Scrollen = Kamera umkreist das Auto und zoomt in die Schäden.
Jede Delle ist der Einstieg in ein Kapitel. EINE Geschichte, kein harter Abschnittswechsel.
Kernleistung (wörtlich): Kfz-Sachverständiger erstellt unabhängige Schadengutachten nach Unfällen.

## Vorlagen (MCP, 25.11.2026)
| Quelle | Vorlage | wofür |
|---|---|---|
| motionsites | car-atelier („Car Push-In“) | Kamera-Push über die Haube ins Auto, Headline zerfällt beim Scrollen → Zoom in die Delle |
| motionsites | camera-shop („rotating lens ring“) | drehender Ring, nur sichtbarer Bogen auf Canvas → Drehteller/Orbit-Ring mit Gradzahl |
| getlayers | kimi (F1) | Wireframe-Scan, Fadenkreuz über Fläche, gestrichelte Verbinder → Messraster/Marker an Dellen |
| getlayers | codescan-style | HUD-Readouts [ 4,2 mm ], Haarlinien + Eckklammern → Messwerte, Rahmen ums Bild |
| Skill | transitions-dev | Übergänge (Clip-Path-Reveal, Match-Cut) im Bau |

## Kapitel (alle Varianten)
0 Bühne (Unfallauto) · 1 Schaden melden (Handy-Foto) · 2 Vermessen „Jeder Millimeter“ · 3 Ihr Recht (freie Gutachterwahl, Gegner zahlt) · 4 Gutachten in 48 h · 5 Reparatur/Ergebnis „wie neu“ · 6 Recruiting (60-s-Bewerbung) · 7 Bewertungen (Beispiel-Kennzeichnung) · 8 Kontakt „Schaden melden“

## Übergangs-Drehbuch (Element A → Bewegung → Element B)
| Wechsel | A | Bewegung | B | Verbindendes Bild/Video |
|---|---|---|---|---|
| 0→1 | Delle 01 mit Marker | Kamera-Push in die Delle (Car-Atelier-Push) | Handy-Sucher rahmt dieselbe Delle | Zoom-Film Orbit→Delle, letztes Bild = Sucherbild |
| 1→2 | Foto im Handy-Sucher | Sucherecken wachsen zu Messraster, Raster legt sich aufs Blech und biegt sich in die Delle | Messraster mit Readouts | gleiches Delle-Nahbild als Grund, Raster per Code/Canvas |
| 2→3 | Rasterlinien | Linien heben ab, werden flach und zu Zeilen eines Schreibens (Match-Cut Linie→Zeile) | Kinetik-Typo „Ihr Gutachter. Ihre Wahl.“ | Motion-Brücke (SVG-Linien) |
| 3→4 | Schreiben/Typo | Blatt kippt in 3D, weitere Seiten fächern auf | Gutachten mit Delle-Foto + Maßstab | Doku-Foto der Delle (gleiche Delle) |
| 4→5 | Delle-Foto auf der Gutachtenseite | Foto wächst vollflächig, Vorher→Nachher-Wischer über deckungsgleiches Bild | repariertes Blech, Lichtlinie gerade | Vorher/Nachher deckungsgleich (Edit, Versatz 0 px) |
| 5→6 | spiegelnde reparierte Tür | Kamera fährt weiter im Orbit, Spiegelung zeigt die Gutachterin | Recruiting-Kapitel | Orbit-Film Abschnitt 2 |
| 6→7 | Orbit geht weiter | Kamera steigt hoch, Orbit-Ring schließt sich bei 360° | Note + Sterne auf dem Ring | Orbit-Film Abschnitt 3, Ring per Code |
| 7→8 | Ring geschlossen | Ring wird zum Knopf „Schaden melden“, Handy-Version | Kontakt | Code |

## Drei Varianten (Storyboards SPSB-4/5/6)
1. SPSB-4 „Drehteller“ – dunkles Studio, Auto auf Drehteller, Orbit seitlich. Farbwelt Aubergine #1d1420 + Mint #7ff2c8. Auto silber.
2. SPSB-5 „Draufsicht“ – heller Tageslichtraum, Kamera senkrecht von oben, Boden mit Messraster, nummerierte Marker. Sand #ece4d6 + Ziegelrot #b8432c. Auto weiß.
3. SPSB-6 „Hebebühne“ – Werkstatt abends, Auto auf Hebebühne, Kamera kreist tief und fährt unters Auto. Bordeaux #2a0f14 + Creme #f1e6d0. Auto schwarz.
