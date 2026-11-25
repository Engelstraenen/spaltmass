// SPALTMASS sjinn-Schlange (kompakt). Einspielen: (0,eval)(code). Start: SP.run(queue)
// queue = [{id, ref (img.src im Asset-Dialog), prompt}], 16:9, 4K, Unlimited. Limit-Erkennung per MutationObserver.
window.SP = window.SP || {};
SP.sleep = ms => new Promise(r => setTimeout(r, ms));
SP.btn = t => [...document.querySelectorAll('button,[role=button]')].find(b => ((b.getAttribute('aria-label') || '') + '|' + (b.title || '') + '|' + b.innerText).toLowerCase().includes(t.toLowerCase()));
SP.click = async (t, w = 700) => { const b = SP.btn(t); if (!b) return false; b.click(); await SP.sleep(w); return true; };
SP.bar = () => [...document.querySelectorAll('button')].map(b => b.innerText.trim()).filter(t => /GPT|Nano|1:1|16:9|9:16|3:4|4:3|auto|1K|2K|4K|Unlimited|credits/.test(t)).join(' | ');
SP.setup = async () => {
  if (!/Unlimited · On/.test(SP.bar())) { await SP.click('Unlimited'); const o = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && e.innerText && e.innerText.trim() === 'No credits consumed'); if (o) { o.click(); await SP.sleep(700); } }
  await SP.click('Aspect ratio'); await SP.click('16:9'); await SP.click('Resolution'); await SP.click('2K resolution'); return SP.bar();
};
SP.clearRefs = async () => { for (let k = 0; k < 6; k++) { const b = [...document.querySelectorAll('button')].find(b => /^Remove Image/.test(b.getAttribute('aria-label') || '')); if (!b) break; b.click(); await SP.sleep(500); } };
SP.dlgImgs = async () => { if (!document.querySelector('[role=dialog]')) await SP.click('Add reference images', 1500); const d = document.querySelector('[role=dialog]'); return d ? [...d.querySelectorAll('img')].map(i => i.src) : []; };
SP.cancel = async () => { const d = document.querySelector('[role=dialog]'); const c = d && [...d.querySelectorAll('button')].find(b => b.innerText.trim() === 'Cancel'); c && c.click(); await SP.sleep(600); };
SP.setRef = async src => {
  if (!document.querySelector('[role=dialog]')) await SP.click('Add reference images', 1500);
  const dlg = document.querySelector('[role=dialog]'); if (!dlg) return 'NODLG';
  const clr = [...dlg.querySelectorAll('button')].find(b => /Clear selection/i.test(b.innerText)); if (clr) { clr.click(); await SP.sleep(600); }
  const img = [...dlg.querySelectorAll('img')].find(i => i.src === src); if (!img) { await SP.cancel(); return 'NOIMG'; }
  let card = img; for (let k = 0; k < 7; k++) { card = card.parentElement; const sb = card && card.querySelector('button[aria-label^="Select image"]'); if (sb) { sb.click(); break; } } await SP.sleep(600);
  const use = [...dlg.querySelectorAll('button')].find(b => /^Use \d+ image|Apply selection/i.test(b.innerText.trim()));
  if (use && !use.disabled) { const t = use.innerText.trim(); use.click(); await SP.sleep(900); return 'applied ' + t; }
  await SP.cancel(); return 'cancel';
};
SP.limN = SP.limN || 0;
if (!SP.obs) { SP.obs = new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) { if (/maximum limit|concurrent tasks/i.test(n.textContent || '')) SP.limN++; } }); SP.obs.observe(document.body, { childList: true, subtree: true }); }
SP.run = async queue => {
  const my = SP.runId = Date.now(); const ta = () => document.querySelector('textarea'); SP.q = { i: 0, msg: 'start', log: [] };
  const setv = v => { Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(ta(), v); ta().dispatchEvent(new Event('input', { bubbles: true })); };
  while (SP.q.i < queue.length && SP.runId === my) {
    const j = queue[SP.q.i];
    if (!j.prepared) { await SP.clearRefs(); const r = await SP.setRef(j.ref); SP.q.log.push(j.id + ' ref ' + r); if (!/applied Use 1 /.test(r)) { SP.q.msg = 'STOP ref ' + j.id + ' ' + r; return; } j.prepared = true; }
    const bar = SP.bar();
    if (!/Unlimited · On/.test(bar) || !/0 credits/.test(bar) || !bar.includes('16:9') || !bar.includes('2K')) { SP.q.msg = 'STOP bar ' + bar; return; }
    setv(''); await SP.sleep(300); setv(j.prompt); await SP.sleep(900);
    const l0 = SP.limN; const gb = [...document.querySelectorAll('button')].find(b => b.innerText.trim() === 'Generate'); if (gb) gb.click(); await SP.sleep(8000);
    if (SP.limN > l0) { SP.q.msg = j.id + ' LIMIT ' + new Date().toLocaleTimeString(); await SP.sleep(60000); continue; }
    SP.q.log.push(j.id + ' sent ' + new Date().toLocaleTimeString()); SP.q.i++; await SP.sleep(3000);
  }
  if (SP.runId === my) SP.q.msg = 'all sent';
};
'SP ok';
