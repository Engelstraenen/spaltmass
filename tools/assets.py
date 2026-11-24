#!/usr/bin/env python3
"""4K-Rohbilder → Web-Bilder.

assets-roh/4k/<name>.jpg|png  →  site/assets/img/<name>.webp (3840 breit) + <name>-m.webp (1800 breit)
Schreibt site/assets/js/img.js (window.SP_IMG) mit Pixelmaßen + Versionsstempel.
Cache: unveränderte Quellen (Größe + Änderungszeit) werden nicht neu geöffnet (Dropbox lagert aus).
Start: python3 tools/assets.py
"""
import json
import os
import time
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets-roh", "4k")
DST = os.path.join(ROOT, "site", "assets", "img")
CACHE = os.path.join(ROOT, "tools", ".assets-cache.json")
os.makedirs(DST, exist_ok=True)

cache = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
out = {}
for fn in sorted(os.listdir(SRC)):
    name, ext = os.path.splitext(fn)
    if ext.lower() not in (".jpg", ".jpeg", ".png", ".webp"):
        continue
    p = os.path.join(SRC, fn)
    st = os.stat(p)
    key = "%d-%d" % (st.st_size, int(st.st_mtime))
    c = cache.get(name)
    if c and c["key"] == key and all(os.path.exists(os.path.join(DST, name + s + ".webp")) for s in ("", "-m")):
        out[name] = c["meta"]
        continue
    im = Image.open(p).convert("RGB")
    w, h = im.size
    for suf, tw, q in (("", 3840, 86), ("-m", 1800, 84)):
        t = im if w <= tw else im.resize((tw, round(h * tw / w)), Image.LANCZOS)
        t.save(os.path.join(DST, name + suf + ".webp"), "WEBP", quality=q, method=5)
    meta = {"w": w, "h": h}
    cache[name] = {"key": key, "meta": meta}
    out[name] = meta
    print("neu:", name, w, "x", h)

out["_v"] = int(time.time())
json.dump(cache, open(CACHE, "w"))
with open(os.path.join(ROOT, "site", "assets", "js", "img.js"), "w") as f:
    f.write("window.SP_IMG=" + json.dumps(out) + ";\n")
print("img.js:", len(out) - 1, "Bilder")
