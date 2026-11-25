#!/usr/bin/env python3
"""Durchscroll-Prüfung der Drehteller-Bühne: Screenshot alle 5 % (oder Liste), Konsolenfehler, Querscroll.
Start: python3 tools/fahrt_check.py <url> <ordner> <WxH> [p1,p2,...]  → <ordner>/<WxH>_<p>.jpg + kontakt_<WxH>.jpg
"""
import sys, os
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
url, out, vp = sys.argv[1], sys.argv[2], sys.argv[3]
ps = [float(x) for x in sys.argv[4].split(',')] if len(sys.argv) > 4 else [i / 20 for i in range(21)]
w, h = map(int, vp.split('x')); os.makedirs(out, exist_ok=True)
errs = []
with sync_playwright() as pw:
    b = pw.chromium.launch()
    pg = b.new_page(viewport={'width': w, 'height': h}, device_scale_factor=1, is_mobile=w < 900, has_touch=w < 900)
    pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(url, wait_until='networkidle'); pg.wait_for_timeout(2200)
    shots = []
    for p in ps:
        pg.evaluate("p=>{const f=document.getElementById('fahrt');scrollTo(0,f.offsetTop+p*(f.offsetHeight-innerHeight))}", p)
        pg.wait_for_timeout(1400)
        fn = os.path.join(out, '%s_%03d.jpg' % (vp, round(p * 100)))
        pg.screenshot(path=fn, type='jpeg', quality=70); shots.append((p, fn))
    qs = pg.evaluate("document.documentElement.scrollWidth>innerWidth")
    b.close()
cols = 5; tw = 360; th = round(tw * h / w); rows = (len(shots) + cols - 1) // cols
K = Image.new('RGB', (cols * tw, rows * (th + 18)), (20, 20, 20)); d = ImageDraw.Draw(K)
for i, (p, fn) in enumerate(shots):
    x, y = (i % cols) * tw, (i // cols) * (th + 18)
    K.paste(Image.open(fn).resize((tw, th)), (x, y + 18)); d.text((x + 4, y + 3), 'p=%.2f' % p, fill=(127, 242, 200))
K.save(os.path.join(out, 'kontakt_%s.jpg' % vp), quality=75)
print('Querscroll:', qs, '| Fehler:', len(errs)); [print(' ', e[:200]) for e in errs[:8]]
