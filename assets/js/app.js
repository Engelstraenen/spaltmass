/* SPALTMASS – Demo. Vanilla-JS, alles hängt an der Scroll-Position. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
  var eout = function (t) { return 1 - Math.pow(1 - t, 3); };
  var mobile = function () { return innerWidth < 900; };
  var band = function (p, a, b, f) { f = f || .06; return Math.min(seg(p, a, a + f), 1 - seg(p, b - f, b)); };

  /* ---------- Bilder: data-img="name" → assets/img/name.webp (mobil -m) ---------- */
  var IMG = window.SP_IMG || {};
  $$('[data-img]').forEach(function (el) {
    var n = el.getAttribute('data-img');
    if (IMG[n]) el.src = 'assets/img/' + n + (mobile() ? '-m' : '') + '.webp?v=' + (IMG._v || 1);
    else el.style.visibility = 'hidden';           // nie Platzhalter zeigen
  });
  $$('[data-need]').forEach(function (el) { if (!IMG[el.getAttribute('data-need')]) el.style.display = 'none'; });

  /* ---------- Menü, Toast, Demo-Links, Modal ---------- */
  $('.nav-menu').addEventListener('click', function () { var o = root.classList.toggle('menu-open'); this.setAttribute('aria-expanded', o); });
  $$('.menu a').forEach(function (a) { a.addEventListener('click', function () { root.classList.remove('menu-open'); $('.nav-menu').setAttribute('aria-expanded', false); }); });
  var toastT;
  function toast(t) { var el = $('.toast'); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { el.hidden = true; }, 2800); }
  $$('[data-demo]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); toast(a.getAttribute('data-demo')); }); });

  var dlg = $('#m-melden');
  $$('[data-open="melden"]').forEach(function (b) { b.addEventListener('click', function () { if (dlg.showModal) dlg.showModal(); hint(); }); });
  var HINT = {
    gegner: 'Gut für Sie: Die Versicherung des Unfallgegners zahlt das Gutachten. Sie wählen den Gutachter selbst.',
    teil: 'Kein Problem: Wir klären mit Ihnen, wer welchen Anteil trägt, bevor Kosten entstehen.',
    ich: 'Bei Kasko zahlt Ihre eigene Versicherung je nach Vertrag. Wir sagen Ihnen vorher, ob sich ein Gutachten lohnt.'
  };
  function hint() { var v = ($('input[name=s]:checked', dlg) || {}).value; $('[data-hint]', dlg).textContent = HINT[v] || ''; }
  $$('input[name=s]', dlg).forEach(function (r) { r.addEventListener('change', hint); });
  $('.shot input', dlg).addEventListener('change', function () {
    var box = $('.thumbs', dlg); box.innerHTML = '';
    Array.prototype.slice.call(this.files, 0, 8).forEach(function (f) { var i = new Image(); i.alt = 'Ihr Foto'; i.src = URL.createObjectURL(f); box.appendChild(i); });
  });
  dlg.addEventListener('close', function () { if (dlg.returnValue === 'ok') toast('Demo: Meldung wäre jetzt beim Gutachter. Rückruf in 15 Minuten.'); });

  /* ---------- Kapitel-Punkte ---------- */
  var chs = $$('.ch');
  chs.forEach(function () { $('.dots').appendChild(document.createElement('i')); });
  var dotEls = $$('.dots i');

  function prog(sec) {
    var r = sec.getBoundingClientRect(), h = sec.offsetHeight - innerHeight;
    return h > 0 ? clamp(-r.top / h, 0, 1) : clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1);
  }
  function show(el, o, dy, keepY) {
    if (!el) return;
    el.style.opacity = o.toFixed(3);
    var y = ((1 - o) * (dy == null ? 26 : dy)).toFixed(1) + 'px';
    el.style.transform = (keepY ? 'translateY(-50%) ' : '') + 'translateY(' + y + ')';
  }

  /* ---------- Film: Video spulen (wenn vorhanden), sonst Standbild mit Kamerafahrt ---------- */
  function Film(sec, sel, cls) {
    var box = $('.media', sec), v = $(sel || '.vid', box), ok = false;
    if (!v) return function () { return false; };
    var key = v.getAttribute('data-key'), VID = window.SP_VID || {};
    if (VID[key]) {
      var s = document.createElement('source');
      s.src = v.getAttribute('data-src') + (mobile() ? (innerWidth / innerHeight <= .75 ? '-p' : '-m') : '') + '.mp4?v=' + (VID._v || 1);
      s.type = 'video/mp4'; v.appendChild(s);
      v.addEventListener('loadeddata', function () { ok = true; sec.classList.add(cls || 'has-vid'); });
      v.load(); var pr = v.play && v.play(); if (pr && pr.then) pr.then(function () { v.pause(); }).catch(function () {});
    }
    var want = 0, cur = 0;
    function tick() { if (!ok || !v.duration) return; cur += (want - cur) * .25; if (Math.abs(want - cur) > .002) { v.currentTime = cur * (v.duration - .05); requestAnimationFrame(tick); } }
    return function (p, z) {
      box.style.setProperty('--z', z == null ? 1 : z);
      if (ok) { want = p; requestAnimationFrame(tick); }
      return ok;
    };
  }

  /* ---------- Zähler ---------- */
  function count(el, to, t, dec) { el.textContent = (to * t).toFixed(dec || 0).replace('.', ','); }

  /* ---------- Punkt im Bild (object-fit: cover) → Pixel auf der Bühne ---------- */
  function onCover(media, ix, iy, ref) {
    var W = media.clientWidth, H = media.clientHeight, ratio = 5504 / 3072;
    var cs = getComputedStyle(ref || media), op = parseFloat(cs.getPropertyValue('--op')) / 100, tx = parseFloat(cs.getPropertyValue('--tx')) / 100;
    if (isNaN(op)) op = .5; if (isNaN(tx)) tx = 0;
    var z = parseFloat(media.style.getPropertyValue('--z')) || 1;
    var dw = Math.max(W, H * ratio), dh = dw / ratio, ox = (W - dw) * op, oy = (H - dh) / 2;
    var x = ox + ix * dw, y = oy + iy * dh, cx = W * .62, cy = H * .55;
    return [cx + (x - cx) * z + tx * W, cy + (y - cy) * z + media.offsetTop];
  }

  /* ---------- 1 Schaden: Streiflicht → Messen ---------- */
  var s1 = $('#schaden'), f1 = Film(s1), f1m = Film(s1, '.vid2', 'has-vid2'), v1m = $('.vid2', s1), reads = $$('.reads b', s1), s1b = $('.s1', s1), s1m = $('.s2', s1), pins = $$('.pin', s1);
  function u1() {
    var p = prog(s1), vid = f1(seg(p, 0, .55), f1 ? 1 + seg(p, 0, .55) * .06 : 1);
    s1.style.setProperty('--g', (.4 + .6 * Math.sin(Date.now() / 900) * .5 + .3).toFixed(2));
    show($('.b-hero', s1), 1 - seg(p, .14, .24), -30, !mobile());
    var m = seg(p, .42, .54);
    if (vid) { m = seg(p, .47, .53); $('.vid', s1).style.opacity = (1 - seg(p, .41, .47)).toFixed(3); }   // Abblende statt Doppelbild
    if (s1m) s1m.style.opacity = m.toFixed(3);
    var mv = f1m(seg(p, .53, .95));   // Messen-Film spult nach der Abblende
    if (v1m) v1m.style.opacity = mv ? m.toFixed(3) : '0';
    reads.forEach(function (b, i) { count(b, +b.getAttribute('data-count'), eout(seg(p, .62 + i * .12, .74 + i * .12))); });
    if (!vid) s1b.style.transform = 'scale(' + (1 + seg(p, 0, .5) * .08).toFixed(4) + ')';
    show($('.b-mess', s1), band(p, .5, .98, .07), 26, !mobile());
    pins.forEach(function (pn, i) {
      var xy = onCover($('.media', s1), +pn.getAttribute('data-ix'), +pn.getAttribute('data-iy'), s1m || null);
      pn.style.setProperty('--px', xy[0].toFixed(1) + 'px'); pn.style.setProperty('--py', xy[1].toFixed(1) + 'px');
      var inView = xy[0] > 50 && xy[0] < innerWidth - 50;
      var on = !mv && inView && p > .58 + i * .1 && p < .97; pn.classList.toggle('on', on);   // mit Film: Messwerte als Anzeige im Text
      count($('b', pn), +$('b', pn).getAttribute('data-count'), eout(seg(p, .58 + i * .1, .7 + i * .1)));
    });
  }

  /* ---------- 2 Scan: Foto → Drahtgitter ---------- */
  var s2 = $('#scan'), sb = $('.scanbox', s2), cos = $$('.callouts li', s2);
  function u2() {
    var p = prog(s2), cut = 100 - seg(p, .08, .55) * 100;
    sb.style.setProperty('--cut', cut.toFixed(2) + '%');
    sb.style.setProperty('--sl', (cut > 0 && cut < 100) ? 1 : 0);
    show($('.b-scan', s2), band(p, .1, 1, .08), 26, !mobile());
    cos.forEach(function (c, i) { c.classList.toggle('on', p > .58 + i * .08); });
  }

  /* ---------- 3 Ihr Recht: Kinetik-Typo ---------- */
  var s3 = $('#recht'), ws = $$('.kin .w', s3), facts = $$('.fact', s3), cards = $$('.card3', s3);
  function u3() {
    var p = prog(s3);
    $('.k-recht', s3).style.opacity = seg(p, .02, .1);
    ws.forEach(function (w, i) { var t = eout(seg(p, .04 + i * .12, .2 + i * .12)); w.style.opacity = t; w.style.transform = 'translateX(' + ((1 - t) * -8) + 'vw)'; });
    facts.forEach(function (f, i) { show(f, seg(p, .36 + i * .08, .46 + i * .08), 24); });
    cards.forEach(function (c, i) { show(c, seg(p, .64 + i * .06, .74 + i * .06), 24); });
  }

  /* ---------- 4 Handy ---------- */
  var s4 = $('#melden'), pb = $('.phonebox', s4), st = $$('.steps li', s4);
  function u4() {
    var p = prog(s4);
    var xy = onCover(pb, .715, .44), W = pb.clientWidth, H = pb.clientHeight, dw = Math.max(W, H * 5504 / 3072);
    pb.style.setProperty('--gx', xy[0].toFixed(1) + 'px'); pb.style.setProperty('--gy', (xy[1] - pb.offsetTop).toFixed(1) + 'px'); pb.style.setProperty('--gw', (dw * .125).toFixed(1) + 'px');
    pb.style.setProperty('--go', seg(p, .12, .22).toFixed(3));
    pb.style.setProperty('--up', eout(seg(p, .25, .7)).toFixed(3));
    show($('.b-melden', s4), seg(p, .04, .16), 26, !mobile());
    st.forEach(function (li, i) { show(li, seg(p, .2 + i * .12, .3 + i * .12), 16); });
  }

  /* ---------- 5 Gutachten: Seiten fächern, Uhr läuft auf 48 h ---------- */
  var s5 = $('#gutachten'), pages = $$('.page', s5), chk = $$('.checks li', s5), hrs = $('[data-hours]', s5);
  function u5() {
    var p = prog(s5), t = eout(seg(p, .05, .75));
    hrs.textContent = Math.round(48 * seg(p, .05, .75));
    chk.forEach(function (li, i) { li.classList.toggle('on', seg(p, .05, .75) > (i + 1) / (chk.length + 1)); });
    // p1 vorne, p2 und p3 fächern nach hinten
    var spread = [[0, 0, 0], [-14, -6, -40], [-28, -12, -80]];
    pages.slice().reverse().forEach(function (pg, i) {
      var s = spread[i], k = t;
      pg.style.transform = 'translate3d(' + (s[0] * k * (mobile() ? .6 : 1)) + '%,' + (s[1] * k) + '%,' + (s[2] * k) + 'px) rotateY(' + (-18 * k) + 'deg) rotateZ(' + (s[1] * .5 * k) + 'deg)';
    });
    $('.report', s5).style.opacity = seg(p, 0, .08);
  }

  /* ---------- 6 Vorher/Nachher: Scroll schiebt, Griff ziehbar ---------- */
  var s6 = $('#ergebnis'), ba = $('.ba', s6), drag = null;
  function setBA(v) { ba.style.setProperty('--ba', clamp(v, 0, 100).toFixed(2) + '%'); }
  function u6() {
    var p = prog(s6);
    if (drag == null) setBA(100 - eout(seg(p, .12, .62)) * 100);
    show($('.b-erg', s6), seg(p, .6, .72), 26);
  }
  var hnd = $('.handle', s6);
  hnd.addEventListener('pointerdown', function (e) { drag = true; hnd.setPointerCapture(e.pointerId); });
  hnd.addEventListener('pointermove', function (e) { if (!drag) return; var r = ba.getBoundingClientRect(); setBA((e.clientX - r.left) / r.width * 100); });
  hnd.addEventListener('pointerup', function () { drag = 'held'; });
  hnd.addEventListener('keydown', function (e) { var cur = parseFloat(ba.style.getPropertyValue('--ba')) || 50; if (e.key === 'ArrowLeft') { drag = 'held'; setBA(cur - 5); } if (e.key === 'ArrowRight') { drag = 'held'; setBA(cur + 5); } });

  /* ---------- 7 Leistungen: horizontale Fahrt ---------- */
  var s7 = $('#leistungen'), rail = $('.rail', s7);
  function u7() {
    var p = prog(s7), max = Math.max(0, rail.scrollWidth - innerWidth);
    rail.style.transform = 'translateX(' + (-max * seg(p, .08, .92)).toFixed(1) + 'px)';
  }

  /* ---------- 8 Karriere: Film + Kinetik-Typo ---------- */
  var s8 = $('#karriere'), f8 = Film(s8), kws = $$('.kw', s8);
  function u8() {
    var p = prog(s8);
    f8(seg(p, 0, .9), 1 + seg(p, 0, 1) * .06);
    show($('.b-kar', s8), band(p, .02, .3, .07), 26);
    kws.forEach(function (k, i) {
      var a = .3 + i * .12, t = seg(p, a, a + .05), o = Math.min(t, 1 - seg(p, a + .1, a + .13));
      k.style.opacity = o.toFixed(3); k.style.transform = 'translateX(' + ((1 - t) * -12 + seg(p, a + .1, a + .13) * 8) + 'vw)';
    });
    show($('.b-kar2', s8), seg(p, .9, .97), 20);
  }

  /* ---------- 9 Bewerben in 60 s ---------- */
  var s9 = $('#bewerben'), qs = $$('.q', s9), qi = 0, secs = 60, tmr = null, ph = $('.phone-in', s9);
  function go(i) { qs.forEach(function (q, k) { q.classList.toggle('on', k === i); q.classList.toggle('out', k < i); }); qi = i; ph.style.setProperty('--p', Math.min(i, 4)); }
  function startT() { if (tmr) return; tmr = setInterval(function () { secs = Math.max(0, secs - 1); $('[data-sec]', s9).textContent = secs; $('.timer', s9).style.setProperty('--t', secs / 60); if (!secs || qi >= 4) { clearInterval(tmr); } }, 1000); }
  qs.forEach(function (q, i) { $$('button:not([type=submit]):not(.again)', q).forEach(function (b) { b.addEventListener('click', function () { startT(); go(i + 1); }); }); });
  $('form', s9).addEventListener('submit', function (e) { e.preventDefault(); go(4); });
  $('.again', s9).addEventListener('click', function () { secs = 60; clearInterval(tmr); tmr = null; $('[data-sec]', s9).textContent = 60; $('.timer', s9).style.setProperty('--t', 1); go(0); });
  go(0);

  /* ---------- 10 Bewertungen: hochzählen, Sterne füllen, Karten wechseln ---------- */
  var s10 = $('#bewertungen'), big = $('.big', s10), stars = $('.stars', s10), done10 = false;
  function u10() {
    if (done10) return;
    var r = s10.getBoundingClientRect(); if (r.top > innerHeight * .7) return;
    done10 = true; var t0 = performance.now(), to = +big.getAttribute('data-to');
    (function an(now) { var t = eout(clamp((now - t0) / 1600, 0, 1)); count(big, to, t, 1); stars.style.setProperty('--f', (to / 5 * t).toFixed(3)); if (t < 1) requestAnimationFrame(an); })(t0);
  }
  var qts = $$('.qt', s10), qn = 0;
  setInterval(function () { qts[qn].classList.remove('on'); qn = (qn + 1) % qts.length; qts[qn].classList.add('on'); }, 5200);

  /* ---------- 11 Kontakt ---------- */
  var fin = $('.final');
  function u11() { if (fin.getBoundingClientRect().top < innerHeight * .8) fin.classList.add('on'); }

  /* ---------- Schleife ---------- */
  var ticking = false;
  function frame() {
    ticking = false;
    document.body.classList.toggle('scrolled', scrollY > 30);
    u1(); u2(); u3(); u4(); u5(); u6(); u7(); u8(); u10(); u11();
    var mid = innerHeight / 2;
    chs.forEach(function (c, i) { var r = c.getBoundingClientRect(); dotEls[i].classList.toggle('on', r.top <= mid && r.bottom > mid); });
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  setInterval(req, 120);   // Licht pulsiert auch ohne Scrollen
  frame();
})();
