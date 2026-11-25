/* SPALTMASS „Drehteller“: eine Bühne, eine Kamera, ein Auto. Scroll-Fortschritt p (0–1) steuert alles. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var eio = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var eout = function (t) { return 1 - Math.pow(1 - t, 3); };
  var IMG = window.SP_IMG || {}, VID = window.SP_VID || {};
  var root = document.documentElement;

  /* Farbwelt testen: ?farbe=1d1420,7ff2c8 */
  var fq = new URLSearchParams(location.search).get('farbe');
  if (fq) { var c = fq.split(','); var rgb = function (h) { return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }).join(','); };
    if (c[0]) { root.style.setProperty('--bg', '#' + c[0]); root.style.setProperty('--bg-rgb', rgb(c[0])); }
    if (c[1]) { root.style.setProperty('--or', '#' + c[1]); root.style.setProperty('--or-rgb', rgb(c[1])); } }

  var stage = $('#stage'), fahrt = $('#fahrt');
  var W = 0, H = 0, MOB = false, PORT = false;

  /* ---------- Kapitel-Zeitplan (p) ---------- */
  var CH = { 0: 0, melden: .27, messen: .41, recht: .52, gutachten: .62, karriere: .80, bewertungen: .895, kontakt: .975 };
  var NAMES = [[0, 'Drehteller'], [.09, 'Umrunden'], [.25, 'Melden'], [.37, 'Messen'], [.49, 'Ihr Recht'], [.58, 'Gutachten'], [.67, 'Ergebnis'], [.77, 'Karriere'], [.87, 'Bewertungen'], [.94, 'Kontakt']];

  /* ---------- Bildebenen + Kamera ---------- */
  // Kamera-Keyframes je Ebene: [p, fx, fy, zoom]; fx/fy = Bildpunkt (0–1), der an den Zielpunkt rückt
  // Sichtbarkeit: [an-start, an-ende, aus-start, aus-ende]
  var HAS_A = !!VID.a, HAS_B = !!VID.b;
  var L = {
    d01: { vis: [-1, -1, .10, .16], cam: [[0, .56, .52, 1], [.10, .52, .53, 1.08], [.16, .48, .53, 1.22]] },
    d02: { vis: [.11, .16, .21, .25], cam: [[.11, .5, .56, 1.04], [.16, .47, .57, 1.12], [.25, .455, .583, 3.1]] },
    d03: { vis: [.205, .25, .275, .30], cam: [[.205, .58, .62, 1.9], [.25, .58, .63, 1.15], [.30, .58, .64, 1]] },
    d04: { vis: [.272, .29, .382, .398], cam: [[.265, .55, .63, 1.92], [.31, .56, .5, 1.04], [.36, .56, .5, 1.08], [.40, .55, .63, 1.92]] },
    d03b: { src: 'd03', vis: [.37, .40, .505, .53], cam: [[.37, .58, .64, 1.0], [.40, .58, .64, 1.0], [.41, .58, .64, 1.02], [.53, .58, .64, 1.06]] },
    d06: { vis: [.69, .698, .74, .755], cam: [[.66, .58, .64, 1], [.725, .58, .64, 1], [.755, .58, .64, 1.25]] },
    d07: { vis: [.725, .76, .79, .82], cam: [[.725, .475, .53, 3.2], [.77, .5, .53, 1.05], [.82, .54, .53, 1.12]] },
    d08: { vis: [.78, .815, .855, .885], cam: [[.78, .7, .5, 1.12], [.885, .7, .5, 1.02]] },
    d09: { vis: [.86, .895, 2, 2], cam: [[.86, .5, .55, 1.25], [.92, .5, .55, 1.04], [1, .5, .55, 1]] }
  };
  if (HAS_A) { L.vA = { vis: [.095, .11, .21, .25], cam: [[.095, .5, .5, 1], [.25, .45, .58, 2.6]], scrub: [.10, .22] }; L.d02.vis = [.2, .22, .22, .25]; }
  if (HAS_B) { L.vB = { vis: [.86, .88, 2, 2], cam: [[.86, .5, .5, 1], [1, .5, .5, 1]], scrub: [.87, .95] }; }

  var lys = {};
  $$('.ly').forEach(function (el) { lys[el.getAttribute('data-ly')] = el; });
  // zweite Ebene für d03 (Messen) aus der ersten klonen
  var d03b = lys.d03.cloneNode(true); d03b.setAttribute('data-ly', 'd03b'); lys.d03.parentNode.insertBefore(d03b, lys.d06); lys.d03b = d03b;

  function srcOf(n) { var m = IMG[n]; return m ? 'assets/img/' + n + '.webp?v=' + (IMG._v || 1) : ''; }
  function nat(n) { var m = IMG[n]; return m ? [m.w, m.h] : [3584, 2016]; }
  $$('img[data-src]').forEach(function (im) { var n = im.getAttribute('data-src'); if (!IMG[n]) { im.closest('.ly,.fly,.wipe') ? (im.style.display = 'none') : (im.style.display = 'none'); return; } im.decoding = 'async'; im.src = srcOf(n); });
  Object.keys(L).forEach(function (k) { if (!lys[k]) { delete L[k]; return; } var im = $('img', lys[k]); if (im && !IMG[im.getAttribute('data-src')]) delete L[k]; });

  /* Videos (Scroll spult) */
  var vids = {};
  ['a', 'b'].forEach(function (k) {
    if (!VID[k]) return; var host = lys['v' + k.toUpperCase()]; var v = document.createElement('video');
    v.muted = true; v.playsInline = true; v.preload = 'auto'; v.setAttribute('playsinline', '');
    v.src = 'assets/vid/' + k + (innerWidth < 900 && innerHeight > innerWidth ? '-p' : '') + '.mp4?v=' + (VID._v || 1);
    host.appendChild(v); vids[k] = { v: v, want: 0, cur: 0, ok: false, w: VID[k].w || 1284, h: VID[k].h || 716 };
    v.addEventListener('loadeddata', function () { vids[k].ok = true; });
  });

  function natOf(k) { if (k === 'vA') return [vids.a.w, vids.a.h]; if (k === 'vB') return [vids.b.w, vids.b.h]; var im = $('img', lys[k]); return nat(im ? im.getAttribute('data-src') : k); }
  function mediaOf(k) { return k === 'vA' ? vids.a.v : k === 'vB' ? vids.b.v : $('img', lys[k]); }

  // Zielpunkt auf dem Schirm: Desktop rechts (Text links), Handy hochkant oben-mittig (Text unten)
  function target() { return MOB ? (PORT ? [.5, .36] : [.66, .5]) : [.62, .52]; }

  // Kamera-Zustand je Ebene berechnen
  function camAt(k, p) {
    var c = L[k].cam, i = 0; if (p <= c[0][0]) return c[0].slice(1); if (p >= c[c.length - 1][0]) return c[c.length - 1].slice(1);
    while (i < c.length - 1 && p > c[i + 1][0]) i++;
    var a = c[i], b = c[i + 1], t = eio(seg(p, a[0], b[0]));
    return [lerp(a[1], b[1], t), lerp(a[2], b[2], t), Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), t))];
  }
  var CAMS = {};
  function place(k, p) {
    if (!L[k]) return;
    var n = natOf(k), iw = n[0], ih = n[1], s0 = MOB && PORT ? 1.6 * W / iw : Math.max(W / iw, H / ih), c = camAt(k, p), z = c[2], s = s0 * z;
    var t = target(), dw = iw * s, dh = ih * s;
    var x = t[0] * W - c[0] * dw, y = t[1] * H - c[1] * dh;
    x = dw > W ? clamp(x, W - dw, 0) : (W - dw) / 2; y = dh > H ? clamp(y, H - dh, 0) : clamp(y, Math.min(0, H - dh), Math.max(0, H - dh));
    CAMS[k] = { x: x, y: y, s: s };
    var m = mediaOf(k); if (!m) return;
    var tf = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) scale(' + s.toFixed(5) + ')';
    (k === 'd07' ? $$('img', lys[k]) : [m]).forEach(function (el) { el.style.width = iw + 'px'; el.style.height = ih + 'px'; el.style.transform = tf; });
  }
  // Bildpunkt → Schirm
  function scr(k, fx, fy) { var c = CAMS[k], n = natOf(k); if (!c) return [-999, -999]; return [c.x + fx * n[0] * c.s, c.y + fy * n[1] * c.s]; }
  // Für die Veyra-Bühne: wo liegt das Hero-Bild der Fahrt bei p=0 (Übergabe Rahmen → Vollbild)
  window.SP_cam0 = function () { place('d01', 0); var c = CAMS.d01, n = natOf('d01'); return c ? { x: c.x, y: c.y, w: n[0] * c.s, h: n[1] * c.s } : null; };
  function visOf(k, p) { var v = L[k].vis; return Math.min(v[0] < 0 ? 1 : seg(p, v[0], v[1]), 1 - seg(p, v[2], v[3])); }

  /* ---------- Texte ---------- */
  var TX = { hero: [-1, 0, .07, .095], orbit: [.11, .135, .19, .215], melden: [.30, .32, .365, .385], messen: [.42, .44, .49, .51], recht: [.515, .535, .585, .60], gutachten: [.605, .625, .665, .685], wie: [.724, .742, .768, .782], karriere: [.79, .81, .855, .87], bewertungen: [.885, .905, .935, .95], kontakt: [.955, .975, 2, 2] };
  var txs = {}; $$('.tx').forEach(function (el) { txs[el.getAttribute('data-tx')] = el; });
  function showTx(k, p) {
    var r = TX[k], el = txs[k], o = Math.min(r[0] < 0 ? 1 : seg(p, r[0], r[1]), 1 - seg(p, r[2], r[3]));
    el.style.opacity = o.toFixed(3); el.classList.toggle('vis', o > .02);
    var dy = (1 - eout(r[0] < 0 ? 1 : seg(p, r[0], r[1]))) * 30 - seg(p, r[2], r[3]) * 30;
    el.style.translate = '0 ' + dy.toFixed(1) + 'px';
    el.inert = o < .5;
    return o;
  }

  /* ---------- Marker ---------- */
  var MK = { // Bildpunkte der Schäden je Ebene
    d01: [[.47, .53], [.612, .5], [.372, .53]],
    d02: [[.455, .583], [.68, .57], [.225, .6]],
    vA: [[.47, .53], [.612, .5], [.372, .53]]
  };
  var mks = $$('.mk');
  function markers(p) {
    var useA = HAS_A && p > .1 && p < .22;
    var k = p < .135 ? (useA ? 'vA' : 'd01') : 'd02';
    if (useA) k = p < .13 ? 'vA' : 'none';
    var on = k !== 'none' ? Math.min(seg(p, .005, .03), 1 - seg(p, .19, .225)) : 0;
    if (k === 'd02') on = Math.min(seg(p, .15, .17), 1 - seg(p, .195, .215));
    if (useA && p > .13) on = 0;
    mks.forEach(function (m, i) {
      var o = on * (i === 0 ? 1 : 1 - seg(p, .17, .19));
      if (o < .01 || k === 'none') { m.style.opacity = 0; return; }
      var pt = scr(k, MK[k][i][0], MK[k][i][1]);
      var sc = i === 0 ? 1 + seg(p, .16, .21) * .5 : 1;
      m.style.opacity = o.toFixed(3);
      m.style.transform = 'translate3d(' + pt[0].toFixed(1) + 'px,' + pt[1].toFixed(1) + 'px,0) scale(' + sc.toFixed(3) + ')';
    });
  }

  /* ---------- Handy-Sucher (Bildschirm des Handys in d04) ---------- */
  var PH = window.SP_PHONE || [.305, .31, .823, .727]; // Display-Rechteck im Bild (x0,y0,x1,y1)
  var finder = $('.finder'), upN = $('[data-up]');
  function phone(p) {
    var o = Math.min(seg(p, .30, .315), 1 - seg(p, .37, .385));
    finder.style.opacity = o.toFixed(3); if (o < .01) return;
    var a = scr('d04', PH[0], PH[1]), b = scr('d04', PH[2], PH[3]), ix = (b[0] - a[0]) * .08, iy = (b[1] - a[1]) * .1;
    finder.style.left = (a[0] + ix) + 'px'; finder.style.top = (a[1] + iy) + 'px'; finder.style.width = (b[0] - a[0] - 2 * ix) + 'px'; finder.style.height = (b[1] - a[1] - 2 * iy) + 'px';
    var u = seg(p, .315, .365); upN.textContent = Math.round(u * 6); finder.style.setProperty('--u', u.toFixed(3));
  }

  /* ---------- Messraster (Canvas) ---------- */
  var cv = $('.grid'), cx = cv.getContext('2d'), DPR = 1;
  var DENT = [.58, .64];
  function grid(p) {
    cx.clearRect(0, 0, cv.width, cv.height);
    var oIn = seg(p, .425, .445), oOut = 1 - seg(p, .59, .605);
    var o = Math.min(oIn, oOut); if (o < .01) return;
    var bend = seg(p, .435, .465) * (1 - seg(p, .49, .508));   // Raster biegt sich in die Delle, dann wieder flach
    var flat = eio(seg(p, .505, .552));                        // Linien werden zu Briefzeilen
    var c = scr('d03b', DENT[0], DENT[1]);
    var R = Math.min(W, H) * (MOB ? .36 : .30), n = 13, sp = (R * 2.4) / n;
    var cols = '127,242,200';
    try { cols = getComputedStyle(root).getPropertyValue('--or-rgb').trim() || cols; } catch (e) {}
    cx.save(); cx.scale(DPR, DPR); cx.lineWidth = 1.1;
    if (MOB && PORT && flat < .05) { cx.beginPath(); cx.rect(0, 0, W, H * .52); cx.clip(); } // Raster bleibt im Bildband über dem Text
    cx.shadowColor = 'rgba(' + cols + ',.8)'; cx.shadowBlur = 6;
    // Ziel: Zeilen im Brief
    var lines = $$('.lines i'), pw = lines.length ? lines[0].parentNode.getBoundingClientRect().width : 0, tr = lines.map(function (l, i) { var r = l.getBoundingClientRect(); return [r.left, r.top, pw * ((i + 1) % 3 ? 1 : .72)]; });
    var x0 = c[0] - n / 2 * sp, y0 = c[1] - n / 2 * sp;
    function disp(x, y) { var dx = x - c[0], dy = y - c[1], r2 = (dx * dx + dy * dy) / (R * R * .55), f = Math.exp(-r2 * 2.2) * bend; return [x - dx * f * .18, y + f * sp * 1.4 - dy * f * .1]; }
    // waagrechte Linien
    for (var j = 0; j <= n; j++) {
      var yy = y0 + j * sp, al = .55 * o;
      var tgt = flat > 0 && tr.length ? tr[j % tr.length] : null;
      cx.strokeStyle = 'rgba(' + cols + ',' + (al * (tgt ? (j < tr.length ? 1 : 1 - flat) : 1)).toFixed(3) + ')';
      cx.beginPath();
      for (var i = 0; i <= 40; i++) {
        var xx = x0 + i / 40 * n * sp, q = disp(xx, yy);
        if (tgt && j < tr.length) { q = [lerp(q[0], tgt[0] + i / 40 * tgt[2], flat), lerp(q[1], tgt[1], flat)]; }
        i ? cx.lineTo(q[0], q[1]) : cx.moveTo(q[0], q[1]);
      }
      cx.stroke();
    }
    // senkrechte Linien verblassen beim Flachwerden
    cx.strokeStyle = 'rgba(' + cols + ',' + (.45 * o * (1 - flat)).toFixed(3) + ')';
    for (var i2 = 0; i2 <= n; i2++) {
      var xv = x0 + i2 * sp; cx.beginPath();
      for (var j2 = 0; j2 <= 40; j2++) { var q2 = disp(xv, y0 + j2 / 40 * n * sp); j2 ? cx.lineTo(q2[0], q2[1]) : cx.moveTo(q2[0], q2[1]); }
      cx.stroke();
    }
    // Fadenkreuz auf der Delle
    var ck = o * seg(p, .44, .46) * (1 - seg(p, .5, .515));
    if (ck > .01) { cx.strokeStyle = 'rgba(' + cols + ',' + ck + ')'; cx.lineWidth = 1.5; var r0 = 22 + 6 * Math.sin(Date.now() / 300);
      cx.beginPath(); cx.arc(c[0], c[1] + sp * .9 * bend, r0, 0, 7); cx.stroke();
      cx.beginPath(); cx.moveTo(c[0] - 44, c[1] + sp * .9 * bend); cx.lineTo(c[0] + 44, c[1] + sp * .9 * bend); cx.moveTo(c[0], c[1] - 44 + sp * .9 * bend); cx.lineTo(c[0], c[1] + 44 + sp * .9 * bend); cx.stroke(); }
    cx.restore();
  }

  /* ---------- Brief → Gutachten → Foto fliegt ---------- */
  var doc = $('.doc'), pg1 = $('.pg1'), pg2 = $('.pg2'), pg3 = $('.pg3'), lin = $$('.lines i'), rep = $('.rep'), chk = $$('.chk li'), repImg = $('.rep img');
  var fly = $('.fly'), wipe = $('.wipe');
  function docPos() { // Briefposition: Desktop rechts, Handy oben
    if (!MOB) return [W * .66, H * .5]; if (PORT) return [W * .5, H * .3]; return [W * .74, H * .52];
  }
  function docu(p) {
    var o = Math.min(seg(p, .54, .556), 1 - seg(p, .675, .70));
    doc.style.opacity = o.toFixed(3); docFly(p); if (p < .48 || p > .75) return;
    var dp = docPos(), sh = MOB && PORT ? .78 : 1;
    var tilt = eio(seg(p, .585, .625));
    doc.style.transform = 'translate(-50%,-50%) translate(' + (dp[0] - W / 2) + 'px,' + (dp[1] - H / 2) + 'px) scale(' + sh + ') rotateX(' + (tilt * 14) + 'deg) rotateY(' + (-tilt * 22) + 'deg) rotateZ(' + (tilt * 3) + 'deg)';
    lin.forEach(function (l, i) { l.style.setProperty('--l', eout(seg(p, .555 + i * .004, .58 + i * .004)).toFixed(3)); });
    pg2.style.transform = 'translate(' + (tilt * 26) + 'px,' + (tilt * 14) + 'px) rotate(' + (tilt * 5) + 'deg)';
    pg3.style.transform = 'translate(' + (tilt * 52) + 'px,' + (tilt * 28) + 'px) rotate(' + (tilt * 10) + 'deg)';
    pg2.style.opacity = pg3.style.opacity = tilt;
    var r = seg(p, .60, .62); rep.style.opacity = r; $('.lines').style.opacity = 1 - r;
    chk.forEach(function (li, i) { li.classList.toggle('on', p > .628 + i * .009); });
  }
  // Foto fliegt aus dem Gutachten auf Vollbild (deckungsgleich mit d06)
  function docFly(p) {
    var f = eio(seg(p, .668, .70)), fo = seg(p, .664, .67) * (1 - seg(p, .728, .74));
    fly.style.opacity = fo.toFixed(3);
    if (fo > .01) { var rr = (repImg.offsetWidth ? repImg : rep).getBoundingClientRect(); place('d06', p); var c6 = CAMS.d06 || { x: 0, y: 0, s: Math.max(W / 3584, H / 2016) }, n6 = nat('d06-repariert-nah'), tw = n6[0] * c6.s, th = n6[1] * c6.s;
      fly.style.left = lerp(rr.left, c6.x, f) + 'px'; fly.style.top = lerp(rr.top, c6.y, f) + 'px'; fly.style.width = lerp(rr.width, tw, f) + 'px'; fly.style.height = lerp(rr.height, th, f) + 'px'; }
  }
  // Vorher/Nachher-Wischer über deckungsgleichem Bild (d03 → d06)
  var wipeI = $('i', wipe), d03full = null;
  function wiper(p) {
    // Die d06-Ebene selbst wird über das fliegende Vorher-Bild gewischt (liegt darüber, z-index)
    var o = seg(p, .698, .704) * (1 - seg(p, .732, .736)); wipe.style.opacity = o.toFixed(3);
    var w = eio(seg(p, .704, .732)), el = lys.d06;
    if (el) { el.style.zIndex = p > .69 && p < .76 ? 2 : ''; el.style.clipPath = p < .733 ? 'inset(0 0 0 ' + Math.min(99.8, (1 - w) * 100).toFixed(2) + '%)' : ''; }
    wipeI.style.left = ((1 - w) * 100).toFixed(2) + '%';
  }

  /* ---------- Ring um den Drehteller + Bewertungen ---------- */
  var ring = $('.ring'), rb = $('.ring-b'), rf = $('.ring-f');
  var TT = window.SP_TT || [.5, .545, .252, .249]; // Drehteller in d09: Mitte x,y, Radius x,y (Bildanteile)
  function rings(p) {
    var o = Math.min(seg(p, .885, .905), 1 - seg(p, .955, .975)); ring.style.opacity = o.toFixed(3); if (o < .01 || !CAMS.d09) return;
    var c = scr('d09', TT[0], TT[1]), e = scr('d09', TT[0] + TT[2], TT[1] + TT[3]), rx = e[0] - c[0], ry = e[1] - c[1];
    [rb, rf].forEach(function (el) { el.setAttribute('cx', c[0]); el.setAttribute('cy', c[1]); el.setAttribute('rx', rx); el.setAttribute('ry', ry); });
    var len = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
    var d = eio(seg(p, .89, .93)); rf.style.strokeDasharray = len; rf.style.strokeDashoffset = (len * (1 - d)).toFixed(1);
  }
  var cnts = $$('[data-count]');
  function count(el, t) { var v = +el.getAttribute('data-count') * t, d = +(el.getAttribute('data-dec') || 0); el.textContent = v.toFixed(d).replace('.', ','); }
  var stars = $('.stars'), ticker = $('.ticker'), mini = $('.mini');
  var quotes = $$('.quotes blockquote'), qi = 0;
  setInterval(function () { quotes.forEach(function (q, i) { q.classList.toggle('on', i === qi); }); qi = (qi + 1) % quotes.length; }, 3800);
  quotes[0].classList.add('on');

  /* ---------- Kinetik ---------- */
  function kin(el, p, a, step) { $$('span', el).forEach(function (s, i) { var t = eout(seg(p, a + i * step, a + i * step + .012)); s.style.opacity = t; s.style.transform = 'translateX(' + ((1 - t) * -6) + 'vw)'; }); }
  function stagger(list, p, a, step, dy) { list.forEach(function (li, i) { var t = eout(seg(p, a + i * step, a + i * step + .01)); li.style.opacity = t; li.style.transform = 'translateY(' + ((1 - t) * (dy || 18)) + 'px)'; }); }
  var kRecht = $('.tx-recht .kin'), kKar = $('.tx-karriere .kin'), facts = $$('.facts li'), perks = $$('.perks li'), readsB = $$('.reads b');

  /* ---------- Dial / Navigation ---------- */
  var degEl = $('[data-deg]'), chEl = $('[data-ch]'), dial = $('.dial'), hint = $('.hint');
  var navA = $$('.links a');
  function degAt(p) { // Drehteller-Winkel entlang der Fahrt
    return Math.round(seg(p, .09, .2) * 90 + seg(p, .73, .87) * 180 + seg(p, .87, .93) * 90);
  }

  /* ---------- Hauptschleife ---------- */
  var want = 0, cur = 0, intro = 0, t0 = performance.now(), lastP = -1;
  function readScroll() { var max = fahrt.offsetHeight - H; want = clamp((scrollY - fahrt.offsetTop) / max, 0, 1); }
  function frame(now) {
    // kurze Eigenbewegung beim Laden (Aktion ab der ersten Sekunde)
    intro = Math.min(1, (now - t0) / 1800);
    cur += (want - cur) * (Math.abs(want - cur) > .2 ? .35 : .14);
    var p = Math.max(cur, eout(intro) * .022 * (want < .03 ? 1 : 0));
    if (Math.abs(p - lastP) > 1e-5 || p > .42 && p < .61) { render(p); lastP = p; }
    requestAnimationFrame(frame);
  }
  function render(p) {
    Object.keys(L).forEach(function (k) {
      var el = lys[k]; if (!el) return; var o = visOf(k, p);
      el.style.opacity = o.toFixed(3); el.style.visibility = o > .002 ? 'visible' : 'hidden';
      if (o > .002) place(k, p);
      if (L[k].scrub) { var vk = k === 'vA' ? 'a' : 'b', V = vids[vk]; if (V && V.ok && V.v.duration) { var t = seg(p, L[k].scrub[0], L[k].scrub[1]) * (V.v.duration - .05); if (Math.abs(V.v.currentTime - t) > .03) V.v.currentTime = t; } }
    });
    // Schatten hinter Text
    $('.shade').style.setProperty('--sh', (1 - .55 * Math.min(seg(p, .2, .24), 1 - seg(p, .29, .31))).toFixed(3));
    Object.keys(TX).forEach(function (k) { showTx(k, p); });
    markers(p); phone(p); grid(p); docu(p); wiper(p); rings(p);
    kin(kRecht, p, .53, .014); stagger(facts, p, .565, .008);
    kin(kKar, p, .81, .012); stagger(perks, p, .83, .007);
    readsB.forEach(function (b, i) { count(b, eout(seg(p, .45 + i * .012, .47 + i * .012))); });
    var r = eout(seg(p, .905, .925)); count($('.score b'), r); stars.style.setProperty('--f', eout(seg(p, .91, .935)).toFixed(3));
    ticker.style.opacity = Math.min(seg(p, .9, .915), 1 - seg(p, .94, .955)).toFixed(3);
    if (mini) mini.style.setProperty('--g', eout(seg(p, .628, .652)).toFixed(3));
    var dg = degAt(p); degEl.textContent = '[ ' + ('00' + dg).slice(-3) + '° ]'; dial.style.setProperty('--d', (dg / 360).toFixed(3));
    var nm = NAMES[0][1]; NAMES.forEach(function (n) { if (p >= n[0]) nm = n[1]; }); chEl.textContent = nm;
    hint.style.opacity = (1 - seg(p, .01, .04)).toFixed(3);
    var act = null; Object.keys(CH).forEach(function (k) { if (k !== '0' && p >= CH[k] - .03) act = k; });
    navA.forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-go') === act); });
  }

  function resize() {
    W = stage.clientWidth; H = stage.clientHeight; MOB = innerWidth < 900; PORT = H > W;
    DPR = Math.min(2, devicePixelRatio || 1); cv.width = W * DPR; cv.height = H * DPR;
    readScroll(); lastP = -1;
  }
  addEventListener('resize', resize); addEventListener('scroll', readScroll, { passive: true });
  resize();
  // Rücksprung von einer Unterseite: index.html?p=0.44 → an dieselbe Stelle der Fahrt
  var qp = parseFloat(new URLSearchParams(location.search).get('p'));
  if (qp > 0 && qp <= 1) { scrollTo(0, fahrt.offsetTop + qp * (fahrt.offsetHeight - H)); readScroll(); cur = want; t0 = -1e5; }
  requestAnimationFrame(frame);

  /* 130-%-Check: Reparatur oder wirtschaftlicher Totalschaden (BGH-Rechtsprechung, Bruttoreparaturkosten zu Wiederbeschaffungswert) */
  var T130 = { 60: 'Reparatur lohnt sich: Die Kosten liegen klar unter dem Wiederbeschaffungswert. Dazu kommen Wertminderung und Nutzungsausfall.', 115: '130-%-Regel: Reparieren ist erlaubt, wenn fachgerecht nach Gutachten repariert wird und Sie das Auto weiter nutzen. Der Gegner zahlt.', 145: 'Wirtschaftlicher Totalschaden: Sie bekommen Wiederbeschaffungswert minus Restwert. Den Restwert belegen wir mit echten Angeboten.' };
  $$('.t130 button').forEach(function (b) { b.addEventListener('click', function () { $$('.t130 button').forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); var o = $('.t130-out'); if (o) o.textContent = T130[b.getAttribute('data-r')]; }); });

  /* Kapitel anspringen */
  $$('[data-go]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); var k = a.getAttribute('data-go'), p = CH[k] || 0; root.classList.remove('menu-open'); $('.burger').setAttribute('aria-expanded', false); scrollTo({ top: fahrt.offsetTop + p * (fahrt.offsetHeight - H), behavior: 'smooth' }); }); });
  $('.burger').addEventListener('click', function () { var o = root.classList.toggle('menu-open'); this.setAttribute('aria-expanded', o); });

  /* Toast für Demo-Links */
  var toastT; function toast(t) { var el = $('.toast'); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { el.hidden = true; }, 2800); }
  $$('[data-demo]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); toast(a.getAttribute('data-demo')); }); });

  /* Schaden melden */
  var dm = $('#m-melden'), HINT = { gegner: 'Gut zu wissen: Sie wählen den Gutachter, die gegnerische Versicherung zahlt.', teil: 'Wir klären mit Ihnen, wer zahlt, bevor Kosten entstehen.', ich: 'Auch für Kasko-Schäden erstellen wir Gutachten.' };
  function hintU() { var v = ($('input[name=s]:checked', dm) || {}).value; $('[data-hint]', dm).textContent = HINT[v] || ''; }
  $$('input[name=s]', dm).forEach(function (r) { r.addEventListener('change', hintU); });
  $$('[data-open="melden"]').forEach(function (b) { b.addEventListener('click', function () { dm.showModal(); hintU(); }); });
  $('.shot input', dm).addEventListener('change', function () { var box = $('.thumbs', dm); box.innerHTML = ''; Array.prototype.slice.call(this.files, 0, 8).forEach(function (f) { var i = new Image(); i.alt = 'Ihr Foto'; i.src = URL.createObjectURL(f); box.appendChild(i); }); });
  dm.addEventListener('close', function () { if (dm.returnValue === 'ok') toast('Demo: Meldung wäre jetzt beim Gutachter. Rückruf in 15 Minuten.'); });

  /* 60-Sekunden-Bewerbung */
  var db = $('#m-bewerben'), qs = $$('.q', db), secs = 60, tmr = null;
  function go(i) { qs.forEach(function (q, k) { q.classList.toggle('on', k === i); }); if (i >= 3) { clearInterval(tmr); tmr = null; } }
  $$('[data-open="bewerben"]').forEach(function (b) { b.addEventListener('click', function () { secs = 60; $('[data-sec]', db).textContent = 60; go(0); db.showModal(); }); });
  qs.forEach(function (q, i) { $$('.opts button, .send', q).forEach(function (b) { b.addEventListener('click', function () { if (!tmr) tmr = setInterval(function () { secs = Math.max(0, secs - 1); $('[data-sec]', db).textContent = secs; }, 1000); go(i + 1); }); }); });
  db.addEventListener('close', function () { clearInterval(tmr); tmr = null; });
})();
