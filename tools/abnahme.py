#!/usr/bin/env python3
"""Abnahme-Bilder: je Storyboard-Panel (SPSB-4 Drehteller) Panel + Seite Desktop + Seite Handy.
Start: python3 tools/abnahme.py [url]  → abnahme/<n>-storyboard.jpg, <n>-desktop.jpg, <n>-handy.jpg"""
import sys
from playwright.sync_api import sync_playwright
from PIL import Image
URL = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:4393/'
SB = 'konzepte/4-drehteller.png'; OUT = 'abnahme/'
P = [.02, .2, .335, .47, .575, .645, .735, .835, .925]
sb = Image.open(SB).convert('RGB'); W, H = sb.size; pw, ph = W / 3, H / 3
for i in range(9):
    r, c = divmod(i, 3); sb.crop((int(c * pw), int(r * ph), int((c + 1) * pw), int((r + 1) * ph))).save(f'{OUT}{i+1}-storyboard.jpg', quality=88)
with sync_playwright() as pw_:
    b = pw_.chromium.launch()
    for tag, w, h, mob in (("desktop", 1600, 900, False), ("handy", 390, 844, True)):
        pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=2 if mob else 1, is_mobile=mob, has_touch=mob)
        pg.goto(URL, wait_until='networkidle'); pg.wait_for_timeout(2500)
        for i, p in enumerate(P):
            pg.evaluate("p=>{const f=document.getElementById('fahrt');scrollTo(0,f.offsetTop+p*(f.offsetHeight-innerHeight))}", p); pg.wait_for_timeout(1600)
            pg.screenshot(path=f'{OUT}{i+1}-{tag}.jpg', type='jpeg', quality=82)
    b.close()
print('ok')
