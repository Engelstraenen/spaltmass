#!/usr/bin/env python3
"""Abnahme-Bilder: je Storyboard-Panel (SPSB-7B Prüfstraße) Panel + Seite Desktop + Seite Handy.
Start: python3 tools/abnahme.py [url]  → abnahme/<n>-storyboard.jpg, <n>-desktop.jpg, <n>-handy.jpg
Panel 2 = Meldung abgeschickt (Dialog „Der Gutachter hat alles im Postfach“)."""
import sys, os
from playwright.sync_api import sync_playwright
from PIL import Image
URL = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:4393/'
SB = 'konzepte/7b-pruefstrasse.png'; OUT = 'abnahme/'; os.makedirs(OUT, exist_ok=True)
P = [.01, 'melden', .2, .37, .51, .655, .755, .86, .95]
sb = Image.open(SB).convert('RGB'); W, H = sb.size; pw, ph = W / 3, H / 3
for i in range(9):
    r, c = divmod(i, 3); sb.crop((int(c * pw), int(r * ph), int((c + 1) * pw), int((r + 1) * ph))).save(f'{OUT}{i+1}-storyboard.jpg', quality=88)
GO = "p=>{const f=document.getElementById('fahrt');scrollTo(0,f.offsetTop+p*(f.offsetHeight-innerHeight))}"
with sync_playwright() as pw_:
    b = pw_.chromium.launch()
    for tag, w, h, mob in (("desktop", 1600, 900, False), ("handy", 390, 844, True)):
        pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=2 if mob else 1, is_mobile=mob, has_touch=mob)
        pg.goto(URL, wait_until='networkidle'); pg.wait_for_timeout(2500)
        for i, p in enumerate(P):
            if p == 'melden':
                pg.evaluate(GO, 0); pg.wait_for_timeout(1200)
                pg.mouse.click(w * .55, h * (.5 if not mob else .32)); pg.wait_for_timeout(400)
                pg.evaluate("()=>{const t=document.querySelector('.pe-text');if(t){t.value='Delle Tür hinten rechts';t.dispatchEvent(new Event('input'))}const ok=document.querySelector('.pe-ok');ok&&ok.click();document.querySelector('[data-open=melden]').click()}")
                pg.wait_for_timeout(500)
                pg.evaluate("()=>{const f=document.querySelector('#m-melden form');f.requestSubmit()}"); pg.wait_for_timeout(900)
            else:
                pg.evaluate("()=>{const d=document.querySelector('#m-melden');d.open&&d.close()}")
                pg.evaluate(GO, p); pg.wait_for_timeout(1700)
            pg.screenshot(path=f'{OUT}{i+1}-{tag}.jpg', type='jpeg', quality=82)
    b.close()
print('ok')
