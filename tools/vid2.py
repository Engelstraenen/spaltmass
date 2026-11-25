#!/usr/bin/env python3
"""Scroll-Film für die Prüfstraße: nachschärfen (unsharp 5:5:0.7), All-Intra (jedes Bild Keyframe), volle Auflösung.
Start: python3 tools/vid2.py <roh.mp4> <name>  → site/assets/vid/<name>.mp4 + Eintrag in vid.js (Breite/Höhe)."""
import sys, os, json, subprocess, time
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src, name = sys.argv[1], sys.argv[2]
out = os.path.join(ROOT, 'site', 'assets', 'vid', name + '.mp4'); os.makedirs(os.path.dirname(out), exist_ok=True)
w, h = map(int, subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', src]).decode().strip().split(',')[:2])
subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-i', src, '-an', '-vf', 'unsharp=5:5:0.7,fps=30,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-g', '1', '-keyint_min', '1', '-sc_threshold', '0', '-movflags', '+faststart', out])
vp = os.path.join(ROOT, 'site', 'assets', 'js', 'vid.js')
try: cur = json.loads(open(vp).read().split('=', 1)[1].rstrip().rstrip(';'))
except Exception: cur = {}
cur[name] = {'w': w, 'h': h}; cur['_v'] = int(time.time())
open(vp, 'w').write('window.SP_VID=' + json.dumps(cur) + ';\n')
print(name, w, 'x', h, round(os.path.getsize(out) / 1e6, 1), 'MB')
