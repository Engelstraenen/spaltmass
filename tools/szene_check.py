#!/usr/bin/env python3
"""Veyra-Bühne + Übergabe prüfen: Screenshots bei Scroll-Anteilen der Bühne, Hotspot-Klick, Fehler.
Start: python3 tools/szene_check.py <url> <ordner> <WxH>"""
import sys, os
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
url, out, vp = sys.argv[1], sys.argv[2], sys.argv[3]; w, h = map(int, vp.split('x')); os.makedirs(out, exist_ok=True)
errs = []; shots = []
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={'width': w, 'height': h}, is_mobile=w < 900, has_touch=w < 900)
    pg.on('console', lambda m: m.type == 'error' and errs.append(m.text)); pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(url, wait_until='networkidle'); pg.wait_for_timeout(2500)
    def shot(name):
        fn = f'{out}/{vp}_{name}.jpg'; pg.screenshot(path=fn, type='jpeg', quality=70); shots.append((name, fn))
    shot('0start')
    # Hotspot 01 hover + Klick → Detail
    hs = pg.query_selector('[data-hotspot="delle"]') or pg.query_selector('.hotspot')
    if hs:
        hs.hover(); pg.wait_for_timeout(500); shot('1hover'); hs.click(); pg.wait_for_timeout(2200); shot('2detail')
        pg.keyboard.press('Escape'); pg.wait_for_timeout(1800)
    pa = pg.query_selector('[data-hotspot="paint"]')
    if pa: pa.hover(); pg.wait_for_timeout(1200); shot('3paint'); pg.mouse.move(5, 5); pg.wait_for_timeout(900)
    for q in (.3, .6, .85, 1.0, 1.15):
        pg.evaluate("q=>{const wr=document.getElementById('szene-wrap');scrollTo(0,wr.offsetTop+q*(wr.offsetHeight-innerHeight))}", q); pg.wait_for_timeout(900); shot('q%03d' % round(q * 100))
    qs = pg.evaluate('document.documentElement.scrollWidth>innerWidth'); b.close()
cols = 5; tw = 360; th = round(tw * h / w); rows = (len(shots) + cols - 1) // cols
K = Image.new('RGB', (cols * tw, rows * (th + 18)), (20, 20, 20)); d = ImageDraw.Draw(K)
for i, (n, fn) in enumerate(shots):
    x, y = (i % cols) * tw, (i // cols) * (th + 18); K.paste(Image.open(fn).resize((tw, th)), (x, y + 18)); d.text((x + 4, y + 3), n, fill=(127, 242, 200))
K.save(f'{out}/kontakt_{vp}.jpg', quality=75); print('Querscroll:', qs, '| Fehler:', len(errs)); [print(' ', e[:200]) for e in errs[:6]]
