// SPALTMASS: Dreamina AI Image (GPT Image 2.5 Sunburst, 16:9, 2K, Medium, Unlimited). Einspielen per Datei-Eingang + eval.
// DI.go(job) schickt GENAU EINEN Auftrag per safeGen und wertet nach 30 s aus. Keine Retry-Schleife (Masterfile V2.63).
window.DI = window.DI || {};
DI.sleep = ms => new Promise(r => setTimeout(r, ms));
DI.bar = () => { const b = [...document.querySelectorAll('div,section')].filter(e => /Unlimited/.test(e.innerText || '') && /Sunburst|GPT Image/.test(e.innerText || '') && e.getBoundingClientRect().height < 90 && e.getBoundingClientRect().top > innerHeight * .6).sort((a, c) => a.innerText.length - c.innerText.length)[0]; return b ? b.innerText.replace(/\s+/g, ' ') : ''; };
DI.toggle = () => [...document.querySelectorAll('[role=switch],button[aria-checked]')].find(e => e.offsetParent && /Unlimited/.test((e.parentElement || {}).innerText || ''));
DI.editor = () => [...document.querySelectorAll('.ProseMirror')].find(e => e.offsetParent);
DI.setPrompt = t => { const ed = DI.editor(); if (!ed || !ed.editor) return false; ed.editor.commands.setContent(t); return true; };
DI.genBtn = () => { const ed = DI.editor(); if (!ed) return null; let box = ed; for (let k = 0; k < 8 && box; k++) { box = box.parentElement; const bs = box && [...box.querySelectorAll('button')].filter(b => b.offsetParent && !b.innerText.trim() && b.querySelector('svg')); if (bs && bs.length) { const r = bs.map(b => [b, b.getBoundingClientRect()]).sort((a, c) => c[1].right - a[1].right)[0]; if (r && r[1].width >= 28) return r[0]; } } return null; };
DI.rejects = 0;
if (!DI.obs) { DI.obs = new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (/up to 1 generation|run up to 1/i.test(n.textContent || '')) DI.rejects++; }); DI.obs.observe(document.body, { childList: true, subtree: true }); }
DI.check = () => { const t = DI.toggle(), bar = DI.bar(); const on = t && t.getAttribute('aria-checked') === 'true'; const price = (bar.match(/Unlimited\s*([0-9]+)/) || [])[1]; return { on, price, bar, sunburst: /Sunburst/.test(bar), k2: /2K/.test(bar), medium: /Medium/.test(bar), ratio: /16:9/.test(bar) }; };
DI.go = async job => {
  const ed = DI.editor(); if (ed) ed.focus();
  if (!DI.setPrompt(job.prompt)) return 'NO EDITOR';
  await DI.sleep(1200);
  let c = DI.check();
  if (!c.on) { const t = DI.toggle(); t && t.click(); await DI.sleep(800); c = DI.check(); }
  if (!c.on || c.price !== '0' || !c.sunburst || !c.k2 || !c.medium || !c.ratio) return 'STOP ' + JSON.stringify(c);
  const b = DI.genBtn(); if (!b || b.disabled) return 'NO BUTTON';
  const r0 = DI.rejects; b.click(); await DI.sleep(30000);
  if (DI.rejects > r0) { const t = DI.toggle(); if (t && t.getAttribute('aria-checked') !== 'true') t.click(); return 'REJECTED (Platz belegt) ' + job.id; }
  return 'SENT ' + job.id + ' ' + new Date().toLocaleTimeString();
};
'DI ok';
