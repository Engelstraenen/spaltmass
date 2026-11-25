#!/usr/bin/env python3
"""Unterseiten prüfen: Ganzseiten-Screenshots (Desktop + 4 Handy-Größen), Querscroll, Fehler, kleine Schrift, Tipp-Flächen.
Start: python3 tools/sub_check.py <url-basis> <ordner> [seiten]"""
import sys, os
from playwright.sync_api import sync_playwright
base, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
pages = sys.argv[3].split(',') if len(sys.argv) > 3 else ['melden', 'messen', 'recht', 'gutachten', 'karriere']
VPS = [(1440, 900), (390, 844), (360, 740), (430, 932), (844, 390)]
JS = """(()=>{const r=[];const W=innerWidth;document.querySelectorAll('body *').forEach(e=>{const s=getComputedStyle(e);if(s.visibility==='hidden'||s.display==='none'||e.closest('dialog:not([open]),.printcard'))return;const b=e.getBoundingClientRect();if(!b.width||!b.height)return;
 if(b.right>W+1&&s.position!=='fixed')r.push('ueber '+e.tagName+'.'+e.className+' '+Math.round(b.right));
 const t=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());if(t&&parseFloat(s.fontSize)<12.5)r.push('klein '+e.tagName+'.'+e.className+' '+s.fontSize);
 if((e.tagName==='A'||e.tagName==='BUTTON')&&(b.height<43.5)&&!e.closest('.foot,.src,.s-foot'))r.push('tipp '+e.tagName+'.'+e.className+' '+Math.round(b.height)+' '+e.textContent.trim().slice(0,20));});
 return [document.documentElement.scrollWidth>W, r.slice(0,12)];})()"""
with sync_playwright() as pw:
    b = pw.chromium.launch()
    for pgn in pages:
        for w, h in VPS:
            errs = []
            pg = b.new_page(viewport={'width': w, 'height': h}, is_mobile=w < 900, has_touch=w < 900)
            pg.on('console', lambda m: m.type == 'error' and errs.append(m.text)); pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.goto(base + pgn + '.html', wait_until='networkidle')
            hh = pg.evaluate('document.body.scrollHeight')
            for y in range(0, hh, h // 2): pg.evaluate(f'scrollTo(0,{y})'); pg.wait_for_timeout(120)
            pg.wait_for_timeout(1300); pg.evaluate('scrollTo(0,0)'); pg.wait_for_timeout(300)
            q, iss = pg.evaluate(JS)
            if w in (1440, 390): pg.screenshot(path=f'{out}/{pgn}_{w}.jpg', type='jpeg', quality=60, full_page=True)
            print(pgn, f'{w}x{h}', 'Querscroll' if q else 'ok', 'Fehler:', len(errs), '|', '; '.join(iss[:6]), '|', '; '.join(errs[:2]))
            pg.close()
    b.close()
