/* Basis: motionsites „Veyra Electric“ (veyra-electric). Engine (Bildebene, Hotspots, Detail-Zoom, Lack-Menü, Hover-Video) übernommen, Daten/Texte auf SPALTMASS umgestellt. */

(function () {
'use strict'

/* ───────── Medien: SPALTMASS-Bilder (sjinn GPT Image 2, nachgeschärft) ───────── */
var IMG = window.SP_IMG || {}
function im(n, fb) { return IMG[n] ? 'assets/img/' + n + '.webp?v=' + (IMG._v || 1) : (fb ? im(fb) : '') }
var baseExterior = im('d01-hero')

var appearanceOptions = {
  wheels: [
    { id:'original', label:'Vorher: nach dem Unfall', color:'#5b4a60', image: baseExterior },
    { id:'nachher',  label:'Nachher: nach Gutachten repariert', color:'#7ff2c8', image: im('d07-repariert', 'd01-hero') }
  ]
}

var systems = {
  delle: {
    index:'01', label:'Delle Tür hinten', category:'Vermessen', title:'Jeder\nMillimeter.',
    short:'Delle vermessen',
    description:'Die Delle wird fotografiert und mit Maßstab vermessen. Dazu prüfen wir die Spaltmaße und die Lackschicht an den heilen Teilen.',
    benefit:'Alles, was wir messen, steht belegt im Gutachten. Auch Schäden, die man nicht sofort sieht.',
    image: im('d03-delle'), anchor:{ x:47, y:53 }, more:'messen.html', back:'.44',
    points:[
      { label:'Spaltmaß', text:'Fuge zwischen den Türen: 6,1 mm statt 3,8 mm auf der heilen Seite. Hier hat sich etwas verzogen.', x:23, y:46 },
      { label:'Tiefe der Delle', text:'Mit Maßstab vermessen: 4,2 mm tief, scharfe Knickkante. Das entscheidet über Ausbeulen oder Neuteil.', x:57, y:63 },
      { label:'Lack an heilen Teilen', text:'Gemessen wird nur auf glatten, heilen Flächen: 118 µm, also Serienlack, kein Vorschaden.', x:42, y:24 }
    ]
  },
  melden: {
    index:'02', label:'Kotflügel vorn', category:'Schaden melden', title:'Sechs Fotos.\nZwei Minuten.',
    short:'Schaden melden',
    description:'Fotos direkt vom Unfallort schicken. Wir rufen in 15 Minuten zurück und kommen innerhalb von 24 Stunden zu Ihnen.',
    benefit:'Kein Telefon-Pingpong: Sie fotografieren, wir übernehmen den Rest.',
    image: im('d04-handy'), anchor:{ x:61, y:50 }, more:'melden.html', back:'.32',
    points:[
      { label:'Foto-Sucher', text:'Die Seite führt Sie durch sechs Fotos: Auto vorn und hinten, Schaden aus 2 m und nah, Unfallstelle, Unterlagen.', x:56, y:46 },
      { label:'Upload', text:'Die Fotos gehen direkt an den Sachverständigen, nicht an eine Hotline.', x:50, y:70 },
      { label:'Rückruf', text:'Innerhalb von 15 Minuten meldet sich ein Gutachter, 24/7.', x:86, y:40 }
    ]
  },
  gutachten: {
    index:'03', label:'Stoßfänger hinten', category:'Gutachten', title:'Gutachten\nin 48 h.',
    short:'Gutachten ansehen',
    description:'Fotos, Maße und Kalkulation in einem Gutachten. Digital an Sie, Ihre Werkstatt und Ihren Anwalt.',
    benefit:'Bei unverschuldetem Unfall wählen Sie den Gutachter, die gegnerische Versicherung zahlt.',
    image: im('d05-doku', 'd03-delle'), anchor:{ x:37.5, y:53 }, more:'gutachten.html', back:'.645',
    points:[
      { label:'Beweisfoto mit Maßstab', text:'Jede Schadstelle mit Zollstock fotografiert, damit die Größe später niemand bestreiten kann.', x:50, y:62 },
      { label:'Wertminderung', text:'Ein Unfallauto ist beim Verkauf weniger wert. Das steht nur im Gutachten, nicht im Kostenvoranschlag.', x:30, y:30 },
      { label:'Nutzungsausfall', text:'Für jeden Tag ohne Auto: nach Fahrzeuggruppe 23 bis 175 € pro Tag (Richtwerte).', x:72, y:34 }
    ]
  },
  werte: {
    index:'04', label:'Fahrzeugwert', category:'Wert & Totalschaden', title:'Reparieren\noder ersetzen?',
    short:'Werte ansehen',
    description:'Der Gutachter ermittelt drei Zahlen: Reparaturkosten, Wiederbeschaffungswert und Restwert. Daraus folgt, ob repariert wird oder ein wirtschaftlicher Totalschaden vorliegt.',
    benefit:'Bis 130 % des Wiederbeschaffungswerts darf auf Kosten des Gegners repariert werden, wenn fachgerecht repariert wird und Sie das Auto weiter fahren.',
    image: im('d02-profil'), anchor:{ x:52, y:30 }, more:'gutachten.html', back:'.645',
    points:[
      { label:'Wiederbeschaffungswert', text:'Was ein gleichwertiges Auto beim Händler kostet, per Marktrecherche ermittelt. Liegt meist über dem Zeitwert.', x:38, y:38 },
      { label:'Reparaturkosten', text:'Kalkuliert nach Herstellervorgaben: Teile, Lack, Arbeitszeit. Entscheidend ist das Verhältnis zum Wiederbeschaffungswert.', x:45, y:58 },
      { label:'Restwert', text:'Was das Unfallauto noch bringt, mit verbindlichen Angeboten belegt. Bei Totalschaden zahlt der Gegner Wiederbeschaffungswert minus Restwert.', x:27, y:62 }
    ]
  }
}

var hotspots = [
  { id:'delle',     label:'01 Delle Tür',  anchor:systems.delle.anchor,     target:'delle' },
  { id:'melden',    label:'02 Kotflügel',  anchor:systems.melden.anchor,    target:'melden' },
  { id:'gutachten', label:'03 Stoßfänger', anchor:systems.gutachten.anchor, target:'gutachten' },
  { id:'werte',     label:'04 Fahrzeugwert', anchor:{ x:52, y:30 }, target:'werte' },
  { id:'wheels',    label:'Vorher / Nachher', anchor:{ x:78, y:44 }, target:null }
]

/* ───────── Icons ───────── */
function icon(name, size) {
  var d = {
    plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',
    x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    check:'<path d="M20 6 9 17l-5-5"/>',
    arrowLeft:'<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
    arrowUpRight:'<path d="M7 7h10v10"/><path d="M7 17 17 7"/>'
  }[name]
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'
}

/* ───────── State ───────── */
var state = {
  phase:'overview', selected:'delle', hovered:null, annotation:null,
  ready:false, reduced:false, detailVisible:false, error:'',
  appearance:null, appearancePinned:false, appearanceClosing:false,
  optionId:'original', appearanceImage: baseExterior, neutral:true,
  loadedOptions: new Set([baseExterior]), failedOptions: new Set()
}
var optionLoads = new Set()
var lock = false, request = 0, suppressFocus = false
var timer, revealTimer, appearanceTimer, leaveTimer

var el = {
  experience: document.getElementById('experience'),
  stage: document.getElementById('szStage'),
  plane: document.getElementById('plane'),
  carImage: document.getElementById('carImage'),
  detailVisual: document.getElementById('detailVisual'),
  detailImage: document.getElementById('detailImage'),
  appearanceVisual: document.getElementById('appearanceVisual'),
  appearanceImage: document.getElementById('appearanceImage'),
  hotspotLayer: document.getElementById('hotspotLayer'),
  annotationLayer: document.getElementById('annotationLayer'),
  intro: document.getElementById('intro'),
  back: document.getElementById('backButton'),
  detailCopy: document.getElementById('detailCopy'),
  detailCategory: document.getElementById('detailCategory'),
  detailTitle: document.getElementById('detailTitle'),
  detailDescription: document.getElementById('detailDescription'),
  detailBenefit: document.getElementById('detailBenefit'),
  partList: document.getElementById('partList'),
  status: document.getElementById('status'),
  statusText: document.getElementById('statusText'),
  footerNote: document.getElementById('footerNote'),
  srStatus: document.getElementById('srStatus'),
  errorMessage: document.getElementById('errorMessage'),
  canvas: document.getElementById('hoverCanvas')
}

el.carImage.src = baseExterior
el.appearanceImage.src = baseExterior

function canUseHotspot(active, id, closing) { return !closing && (!active || active === id) }
function busy() { return state.phase === 'entering' || state.phase === 'returning' }

/* ───────── Scene plane. One coordinate system for frame, media and hotspots. ───────── */
function updatePlane() {
  var width = el.stage.getBoundingClientRect().width
  var mobile = width <= 900
  var mediaHeight = Math.max(700, window.innerHeight) - (window.innerHeight <= 780 ? 64 : 76) - 164 - 88
  var w = mobile ? width - 40 : Math.min(width - 2 * Math.min(72, Math.max(24, width * 0.04)), mediaHeight * 1672 / 941)
  var h = w * 941 / 1672
  el.plane.style.width = w + 'px'
  el.plane.style.height = h + 'px'
  el.plane.style.left = ((width - w) / 2) + 'px'
  el.plane.style.top = (mobile ? 132 : 88) + 'px'
  el.experience.style.setProperty('--scene-width', w + 'px')
  el.experience.style.setProperty('--scene-height', h + 'px')
}
new ResizeObserver(updatePlane).observe(el.stage)
window.addEventListener('resize', updatePlane)
updatePlane()

/* ───────── Hover video. Canvas-composited, direction-safe. ───────── */
var hoverVideo = (function () {
  // Hover-Clips (Dreamina, folgen): je Delle vorwärts/rückwärts. Ohne Clip bleibt das Standbild stehen.
  var sources = window.SP_HOVER || {}
  var surface = el.canvas
  var context = surface.getContext('2d', { alpha:false })
  var videos = new Map()
  var settled = null, active = null
  var running = false, frozen = false, failed = false
  var generation = 0, raf = 0, watchdog = 0, cancelFrame = null
  var desired = null, onNeutral = function () {}

  Object.keys(sources).forEach(function (id) {
    sources[id].forEach(function (src, direction) {
      var video = document.createElement('video')
      video.muted = true; video.playsInline = true; video.preload = 'auto'; video.src = src
      videos.set(id + '-' + direction, video)
    })
  })

  function draw(video) {
    if (video.readyState < 2 || video.seeking || !video.videoWidth) return
    if (surface.width !== video.videoWidth || surface.height !== video.videoHeight) {
      surface.width = video.videoWidth; surface.height = video.videoHeight
    }
    context.drawImage(video, 0, 0, surface.width, surface.height)
    surface.style.opacity = '1'
  }

  function stop() {
    generation++
    if (active) { active.pause(); active.onended = active.onerror = active.onloadeddata = active.onseeked = null }
    if (cancelFrame) cancelFrame()
    cancelFrame = null
    cancelAnimationFrame(raf); clearTimeout(watchdog)
    running = false; active = null
  }

  // Complete each short clip before changing direction. The reverse clips carry
  // their own timing curves: duration-ratio seeking would not preserve pose.
  function nextClip(current, want) {
    if (current === want) return null
    return current ? { id: current, reverse: true } : (want ? { id: want, reverse: false } : null)
  }

  function update() {
    // Freeze the exact visible hover frame while the detail crossfade covers it.
    if (state.phase === 'entering') { if (!frozen) { stop(); frozen = true } return }
    if (state.phase === 'detail' || state.reduced) {
      stop(); settled = null; frozen = false
      surface.style.opacity = '0'; onNeutral(true)
      return
    }
    if (state.phase !== 'overview' || running || failed) return
    frozen = false
    var next = nextClip(settled, desired)
    if (!next) return
    var video = videos.get(next.id + '-' + (next.reverse ? 1 : 0))
    active = video; running = true
    onNeutral(false)
    var token = ++generation
    function valid() { return generation === token }

    function fail() {
      if (!valid()) return
      stop(); failed = true; onNeutral(true)
      // Keep the last decoded canvas frame. Detail navigation still works.
    }
    function complete() {
      if (!valid()) return
      draw(video); stop()
      settled = next.reverse ? null : next.id
      onNeutral(settled === null)
      update()
    }
    function paint() {
      if (!valid()) return
      draw(video)
      if ('requestVideoFrameCallback' in video) {
        var handle = video.requestVideoFrameCallback(paint)
        cancelFrame = function () { video.cancelVideoFrameCallback(handle) }
      } else raf = requestAnimationFrame(paint)
    }
    function start() {
      if (!valid()) return
      video.onseeked = video.onloadeddata = null
      // Don't draw during load/seek; the canvas keeps the previous frame until
      // this video's first decoded playback frame arrives.
      if ('requestVideoFrameCallback' in video) {
        var handle = video.requestVideoFrameCallback(paint)
        cancelFrame = function () { video.cancelVideoFrameCallback(handle) }
      } else raf = requestAnimationFrame(paint)
      var played = video.play()
      if (played && played.catch) played.catch(fail)
    }
    function prepare() {
      if (!valid()) return
      video.onloadeddata = null
      if (video.currentTime > 0.001) { video.onseeked = start; video.currentTime = 0 } else start()
    }
    video.onended = complete
    video.onerror = fail
    watchdog = window.setTimeout(fail, 15000)
    if (video.readyState >= 2) prepare()
    else { video.onloadeddata = prepare; video.load() }
  }

  return {
    set: function (want) { desired = sources[want] ? want : null; update() },
    sync: update,
    onNeutral: function (fn) { onNeutral = fn }
  }
})()

hoverVideo.onNeutral(function (value) {
  if (state.neutral === value) return
  state.neutral = value
  renderAppearance()
})

/* ───────── Appearance ───────── */
function preloadAppearance(mode) {
  appearanceOptions[mode].forEach(function (option) {
    if (optionLoads.has(option.image)) return
    optionLoads.add(option.image)
    var image = new Image()
    image.onload = function () {
      image.decode().then(function () {
        state.loadedOptions.add(option.image)
        state.failedOptions.delete(option.image)
        renderAppearance()
      }).catch(function () { state.failedOptions.add(option.image); renderAppearance() })
    }
    image.onerror = function () { state.failedOptions.add(option.image); renderAppearance() }
    image.src = option.image
  })
}

function openAppearance(mode) {
  if (state.phase !== 'overview' || !canUseHotspot(state.appearance, mode, state.appearanceClosing)) return
  clearTimeout(leaveTimer)
  state.hovered = null
  if (state.appearance === mode) return
  state.appearance = mode
  state.appearancePinned = false
  state.optionId = appearanceOptions[mode][0].id
  state.appearanceImage = baseExterior
  preloadAppearance(mode)
  hoverVideo.set(null)
  render()
}

function closeAppearance(restoreFocus) {
  if (!state.appearance || state.appearanceClosing) return
  var previous = state.appearance
  clearTimeout(leaveTimer)
  state.appearanceClosing = true
  state.hovered = null
  render()
  appearanceTimer = window.setTimeout(function () {
    state.appearance = null; state.appearancePinned = false; state.appearanceClosing = false
    state.appearanceImage = baseExterior
    render()
    if (restoreFocus !== false) {
      suppressFocus = true
      var button = el.hotspotLayer.querySelector('[data-hotspot="' + previous + '"]')
      if (button) button.focus({ preventScroll:true })
      suppressFocus = false
    }
  }, state.reduced ? 0 : 260)
}

function chooseAppearance(id) {
  if (!state.appearance || state.appearanceClosing || !state.neutral) return
  var option = appearanceOptions[state.appearance].filter(function (item) { return item.id === id })[0]
  if (!option || !state.loadedOptions.has(option.image)) return
  state.appearancePinned = true
  state.optionId = id
  state.appearanceImage = option.image
  render()
}

/* ───────── Phase transitions ───────── */
function finish(returning, id) {
  clearTimeout(timer)
  state.phase = returning ? 'overview' : 'detail'
  state.detailVisible = !returning
  lock = false
  render()
  hoverVideo.sync()
  setTimeout(function () {
    if (returning) {
      var button = el.hotspotLayer.querySelector('[data-hotspot="' + id + '"]')
      if (button) button.focus({ preventScroll:true })
    } else el.back.focus({ preventScroll:true })
  }, 0)
}

function transition(id, returning) {
  if (id === 'optics' || state.appearance || lock || !state.ready || (!returning && state.phase !== 'overview')) return
  lock = true
  var token = ++request
  state.selected = id; state.hovered = null; state.annotation = null; state.error = ''
  state.phase = returning ? 'returning' : 'entering'
  render()
  hoverVideo.sync()

  // Hover films stay separate from the click-to-detail crossfade.
  revealTimer = window.setTimeout(function () {
    if (request === token) { state.detailVisible = !returning; render() }
  }, state.reduced ? 0 : 350)
  timer = window.setTimeout(function () { if (request === token) finish(returning, id) }, state.reduced ? 0 : 1250)
}

function returnToCar() { if (state.phase === 'detail') transition(state.selected, true) }

/* ───────── Rendering ───────── */
/* Hotspots are built once per phase and then mutated in place. Rebuilding them
   would destroy the node the pointer is currently over and cancel the hover. */
var hotspotNodes = {}
var builtHotspotKey = ''

function buildHotspots() {
  var key = state.phase + '|' + state.ready
  if (key === builtHotspotKey) return
  builtHotspotKey = key
  hotspotNodes = {}
  el.hotspotLayer.innerHTML = ''
  if (state.phase !== 'overview' || !state.ready) return

  hotspots.forEach(function (item) {
    if (item.id === 'paint' || item.id === 'wheels') {
      var wrap = document.createElement('div')
      wrap.className = 'appearance-hotspot'
      wrap.style.setProperty('--anchor-x', item.anchor.x + '%')
      wrap.style.setProperty('--anchor-y', item.anchor.y + '%')

      var button = document.createElement('button')
      button.className = 'hotspot'
      button.dataset.hotspot = item.id
      button.setAttribute('aria-controls', 'appearance-' + item.id)
      button.setAttribute('aria-label', item.label)
      button.innerHTML = '<span class="hotspot-ring"></span>' +
        '<span class="hotspot-label">' + item.label + '</span>'
      button.addEventListener('focus', function () { if (!suppressFocus) openAppearance(item.id) })
      button.addEventListener('click', function () {
        if (state.appearance === item.id && state.appearancePinned) closeAppearance(true)
        else { openAppearance(item.id); state.appearancePinned = true; render() }
      })
      wrap.appendChild(button)

      wrap.addEventListener('pointerenter', function () { openAppearance(item.id) })
      wrap.addEventListener('pointerleave', function () {
        if (!state.appearancePinned && !wrap.contains(document.activeElement)) {
          leaveTimer = window.setTimeout(function () { closeAppearance(false) }, 140)
        }
      })
      wrap.addEventListener('focusout', function (event) {
        if (!state.appearancePinned && !wrap.contains(event.relatedTarget)) closeAppearance(false)
      })

      el.hotspotLayer.appendChild(wrap)
      hotspotNodes[item.id] = { wrap: wrap, button: button, ring: button.querySelector('.hotspot-ring'), menu: null, bridge: null }
      return
    }

    var spot = document.createElement('button')
    spot.className = 'hotspot'
    spot.dataset.hotspot = item.id
    spot.style.left = item.anchor.x + '%'
    spot.style.top = item.anchor.y + '%'
    spot.setAttribute('aria-label', item.target ? systems[item.target].short : item.label)
    spot.innerHTML = '<span class="hotspot-ring">' + icon('plus', 14) + '</span>' +
      '<span class="hotspot-label">' + item.label + (item.target ? icon('arrowUpRight', 15) : '') + '</span>'

    function enter() {
      if (spot.disabled) return
      state.hovered = item.id; syncHotspots(); hoverVideo.set(item.id)
    }
    function leave() { state.hovered = null; syncHotspots(); hoverVideo.set(null) }
    spot.addEventListener('pointerenter', enter)
    spot.addEventListener('pointerleave', leave)
    spot.addEventListener('focus', enter)
    spot.addEventListener('blur', leave)
    if (item.target) spot.addEventListener('click', function () { transition(item.target, false) })
    el.hotspotLayer.appendChild(spot)
    hotspotNodes[item.id] = { wrap: null, button: spot, ring: spot.querySelector('.hotspot-ring'), menu: null, bridge: null }
  })
}

function syncHotspots() {
  hotspots.forEach(function (item) {
    var node = hotspotNodes[item.id]
    if (!node) return
    var enabled = canUseHotspot(state.appearance, item.id, state.appearanceClosing)
    node.button.disabled = !enabled

    if (item.id !== 'paint' && item.id !== 'wheels') {
      node.button.classList.toggle('active', state.hovered === item.id)
      return
    }

    var open = state.appearance === item.id
    node.wrap.classList.toggle('expanded', open)
    node.button.classList.toggle('active', open)
    node.button.setAttribute('aria-expanded', String(open && !state.appearanceClosing))
    node.ring.innerHTML = icon(open && state.appearancePinned ? 'x' : 'plus', 14)

    var wantMenu = open && !state.appearanceClosing
    if (wantMenu && !node.menu) {
      node.bridge = document.createElement('span')
      node.bridge.className = 'menu-bridge'
      node.bridge.setAttribute('aria-hidden', 'true')
      node.menu = buildMenu(item.id)
      node.wrap.appendChild(node.bridge)
      node.wrap.appendChild(node.menu)
    } else if (!wantMenu && node.menu) {
      node.wrap.removeChild(node.bridge)
      node.wrap.removeChild(node.menu)
      node.bridge = null
      node.menu = null
    }
  })
}

function buildMenu(mode) {
  var options = appearanceOptions[mode]
  var current = options.filter(function (option) { return option.id === state.optionId })[0] || options[0]
  var menu = document.createElement('div')
  menu.className = 'appearance-menu ' + mode
  menu.id = 'appearance-' + mode
  menu.setAttribute('role', 'group')
  menu.setAttribute('aria-label', mode === 'paint' ? 'Farbe nach der Reparatur' : 'Vorher / Nachher')

  var heading = document.createElement('div')
  heading.className = 'appearance-heading'
  heading.innerHTML = '<span>' + (mode === 'paint' ? 'Ihre Farbe, wie neu' : 'Vorher / Nachher') + '</span>'
  var close = document.createElement('button')
  close.className = 'appearance-close'
  close.setAttribute('aria-label', 'Schließen, Unfallauto wieder zeigen')
  close.innerHTML = icon('x', 16)
  close.addEventListener('click', function () { closeAppearance(true) })
  heading.appendChild(close)
  menu.appendChild(heading)

  var list = document.createElement('div')
  list.className = 'appearance-options'
  options.forEach(function (option) {
    var button = document.createElement('button')
    var selected = option.id === state.optionId
    button.className = 'appearance-option' + (selected ? ' selected' : '')
    button.disabled = !state.neutral || !state.loadedOptions.has(option.image)
    button.title = option.label
    button.setAttribute('aria-pressed', String(selected))
    button.setAttribute('aria-label', option.label + (state.failedOptions.has(option.image) ? ' — unavailable' : ''))
    if (mode === 'paint') {
      button.innerHTML = '<span class="paint-chip" style="background-color:' + option.color +
        ';color:' + (option.id === 'schwarz' || option.id === 'rot' ? '#fff' : '#111') + '">' + (selected ? icon('check', 14) : '') + '</span>'
    } else {
      button.innerHTML = '<span class="wheel-chip" style="background-position:47% 54%;background-image:url(&quot;' + option.image + '&quot;)"></span>'
    }
    button.addEventListener('click', function () { chooseAppearance(option.id) })
    list.appendChild(button)
  })
  menu.appendChild(list)

  var caption = document.createElement('div')
  caption.className = 'appearance-caption'
  caption.setAttribute('aria-live', 'polite')
  caption.innerHTML = (state.neutral ? current.label : 'Zurück zum Auto …') +
    '<small>' + (state.failedOptions.size ? 'Ein Bild konnte nicht laden' : 'Schließen, um weitere Schäden anzusehen') + '</small>'
  menu.appendChild(caption)
  return menu
}

var builtAnnotationKey = ''

function buildAnnotations() {
  var key = state.phase + '|' + state.selected
  if (key === builtAnnotationKey) return
  builtAnnotationKey = key
  el.annotationLayer.innerHTML = ''
  if (state.phase !== 'detail') return
  systems[state.selected].points.forEach(function (point, i) {
    var button = document.createElement('button')
    button.className = 'annotation'
    button.style.left = point.x + '%'
    button.style.top = point.y + '%'
    button.setAttribute('aria-label', point.label)
    button.innerHTML = '<span>' + String(i + 1).padStart(2, '0') + '</span>' +
      '<span class="annotation-label">' + point.label + '</span>'
    button.addEventListener('click', function () {
      state.annotation = state.annotation === i ? null : i
      render()
    })
    el.annotationLayer.appendChild(button)
  })
}

var builtPartKey = ''

function buildPartList() {
  if (builtPartKey === state.selected) return
  builtPartKey = state.selected
  el.partList.innerHTML = ''
  systems[state.selected].points.forEach(function (point, i) {
    var button = document.createElement('button')
    button.innerHTML = '<span class="part-row"><small>' + String(i + 1).padStart(2, '0') + '</small>' +
      point.label + icon('plus', 14) + '</span>'
    button.addEventListener('click', function () {
      state.annotation = state.annotation === i ? null : i
      render()
    })
    el.partList.appendChild(button)
  })
}

function syncDetailSelection() {
  var points = systems[state.selected].points
  Array.prototype.forEach.call(el.annotationLayer.children, function (node, i) {
    node.classList.toggle('open', state.annotation === i)
    node.setAttribute('aria-expanded', String(state.annotation === i))
  })
  Array.prototype.forEach.call(el.partList.children, function (node, i) {
    var open = state.annotation === i
    node.classList.toggle('selected', open)
    node.tabIndex = state.phase === 'detail' ? 0 : -1
    node.setAttribute('aria-expanded', String(open))
    var description = node.querySelector('.part-description')
    if (open && !description) {
      description = document.createElement('span')
      description.className = 'part-description'
      description.textContent = points[i].text
      node.appendChild(description)
    } else if (!open && description) node.removeChild(description)
  })
}

function renderAppearance() {
  var shown = state.appearance && state.neutral && !state.appearanceClosing
  el.appearanceVisual.classList.toggle('shown', !!shown)
  el.appearanceImage.src = state.appearanceImage
  var menu = el.hotspotLayer.querySelector('.appearance-menu')
  if (!menu || !state.appearance) return
  var options = appearanceOptions[state.appearance]
  var buttons = menu.querySelectorAll('.appearance-option')
  options.forEach(function (option, i) {
    if (!buttons[i]) return
    buttons[i].disabled = !state.neutral || !state.loadedOptions.has(option.image)
    buttons[i].classList.toggle('selected', option.id === state.optionId)
  })
  var current = options.filter(function (o) { return o.id === state.optionId })[0] || options[0]
  var caption = menu.querySelector('.appearance-caption')
  if (caption) {
    caption.innerHTML = (state.neutral ? current.label : 'Zurück zum Auto …') +
      '<small>' + (state.failedOptions.size ? 'Ein Bild konnte nicht laden' : 'Schließen, um weitere Schäden anzusehen') + '</small>'
  }
}

function render() {
  var current = systems[state.selected]

  el.experience.className = 'experience phase-' + state.phase + (state.reduced ? ' reduced' : '')
  el.experience.setAttribute('aria-busy', String(busy()))
  el.plane.style.setProperty('--focus-x', current.anchor.x + '%')
  el.plane.style.setProperty('--focus-y', current.anchor.y + '%')

  el.detailImage.src = current.image
  el.detailImage.alt = 'Nahansicht: ' + current.label
  el.detailVisual.classList.toggle('shown', state.detailVisible)

  el.intro.classList.toggle('hide', state.phase !== 'overview')
  el.intro.setAttribute('aria-hidden', String(state.phase !== 'overview'))

  el.back.hidden = state.phase === 'overview'
  el.back.disabled = busy()
  el.back.innerHTML = icon('arrowLeft', 18) +
    '<span>' + (state.phase === 'returning' ? 'Zurück zum Auto' : 'Zurück zum Auto') + '</span><kbd>Esc</kbd>'

  el.detailCopy.classList.toggle('shown', state.phase === 'detail')
  el.detailCopy.setAttribute('aria-hidden', String(state.phase !== 'detail'))
  el.detailCategory.textContent = current.category
  var more = document.getElementById('detailMore'); if (more) more.href = current.more || '#';
  el.detailTitle.innerHTML = current.title.split('\n').map(function (line) { return '<span>' + line + '</span>' }).join('')
  el.detailDescription.textContent = current.description
  el.detailBenefit.textContent = current.benefit

  var showStatus = busy() || !state.ready
  el.status.hidden = !showStatus
  el.statusText.textContent = !state.ready ? 'Bilder werden geladen'
    : state.phase === 'returning' ? 'Zurück zum Auto'
    : 'Nahansicht: ' + current.label

  el.footerNote.textContent = state.phase === 'overview'
    ? 'Tippen Sie auf eine Delle. Oder scrollen Sie: einmal rund ums Auto.'
    : 'Beispielwerte zur Erklärung. Demo-Seite.'

  el.srStatus.textContent = busy()
    ? (state.phase === 'entering' ? 'Öffne ' : 'Schließe ') + current.label
    : state.phase === 'detail' ? 'Nahansicht ' + current.label + '. Escape führt zurück.'
    : 'Unfallauto. Wählen Sie einen Schaden.'

  if (state.error) {
    el.errorMessage.hidden = false
    el.errorMessage.innerHTML = state.error
    var dismiss = document.createElement('button')
    dismiss.setAttribute('aria-label', 'Meldung schließen')
    dismiss.innerHTML = icon('x', 16)
    dismiss.addEventListener('click', function () { state.error = ''; render() })
    el.errorMessage.appendChild(dismiss)
  } else el.errorMessage.hidden = true

  buildHotspots()
  syncHotspots()
  buildAnnotations()
  buildPartList()
  syncDetailSelection()
  renderAppearance()
}

/* ───────── Boot ───────── */
var motion = matchMedia('(prefers-reduced-motion: reduce)')
function syncMotion() { state.reduced = motion.matches; hoverVideo.sync(); render() }
motion.addEventListener('change', syncMotion)
state.reduced = motion.matches

window.addEventListener('keydown', function (event) {
  if (event.key !== 'Escape') return
  if (state.appearance) closeAppearance(true); else returnToCar()
})
el.back.addEventListener('click', returnToCar)

Promise.all([baseExterior, systems.delle.image, systems.melden.image].map(function (source) {
  return new Promise(function (resolve, reject) {
    var image = new Image()
    image.onload = function () { image.decode().then(resolve, resolve) }
    image.onerror = reject
    image.src = source
  })
})).then(function () { state.ready = true; render() })
  .catch(function () { state.error = 'Ein Bild konnte nicht laden. Bitte neu laden.'; render() })

render()
})()

/* ───────── SPALTMASS: Übergabe an die Scroll-Fahrt. Der Rahmen wächst beim Scrollen genau auf die Lage des Hero-Bilds der Fahrt, dann blendet die Bühne aus. ───────── */
;(function () {
  var wrap = document.getElementById('szene-wrap'), exp = document.getElementById('experience'), plane = document.getElementById('plane'), stage = document.getElementById('szStage')
  var env = plane.querySelector('.media-envelope'), fade = [exp.querySelector('.masthead'), exp.querySelector('.intro'), exp.querySelector('.scene-footer'), document.getElementById('hotspotLayer')], hideLate = [document.getElementById('detailCopy'), document.getElementById('backButton'), document.getElementById('annotationLayer')]
  var root = document.documentElement, ease = function (t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 }
  function tick() {
    var H = innerHeight, W = innerWidth
    if (W <= 900) { root.classList.toggle('in-szene', wrap.getBoundingClientRect().bottom > 70); plane.style.transform = ''; exp.style.opacity = ''; return }
    var range = wrap.offsetHeight - H, q = Math.max(0, Math.min(1, (scrollY - wrap.offsetTop) / range)), e = ease(Math.min(1, q / .85))
    root.classList.toggle('in-szene', q < .9)
    var c = window.SP_cam0 && window.SP_cam0()
    if (c && plane.style.width) {
      var sr = stage.getBoundingClientRect(), px = sr.left + parseFloat(plane.style.left), py = sr.top + parseFloat(plane.style.top) - (sr.top - 0) + 0, pw = parseFloat(plane.style.width)
      py = stage.offsetTop + parseFloat(plane.style.top) - (exp.getBoundingClientRect().top < 0 ? 0 : 0)
      var k = 1 + (c.w / pw - 1) * e, tx = (c.x - px) * e, ty = (c.y - py) * e
      plane.style.transformOrigin = '0 0'
      plane.style.transform = e > 0 ? 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) scale(' + k.toFixed(4) + ')' : ''
      env.style.borderRadius = (16 * (1 - e)).toFixed(1) + 'px'; env.style.boxShadow = '0 0 0 ' + (3 * (1 - e)).toFixed(2) + 'px #fff'
    }
    fade.forEach(function (n) { if (n) n.style.opacity = (1 - Math.min(1, q / .35)).toFixed(3) })
    hideLate.forEach(function (n) { if (n) n.style.visibility = q > .25 ? 'hidden' : '' })
    exp.style.opacity = (1 - Math.max(0, (q - .88) / .12)).toFixed(3)
    exp.style.pointerEvents = q > .95 ? 'none' : ''
  }
  addEventListener('scroll', tick, { passive: true }); addEventListener('resize', tick); setTimeout(tick, 60); tick()
})()
