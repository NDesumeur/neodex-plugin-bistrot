// lancé par le test « local » de NeoDex : vérification interne (neuf cuisines servies par le cuisinier automatique, règles des postes),
// à la souris une tomate prise, posée, hachée et reprise ; des cuisines en plein service, un service complet à la friterie, la mise en page
module.exports = async ({ pj, sleep }) => {
  const B = `document.getElementById('bsCanvas').__bs`;
  const label = () => pj(`document.getElementById('bsCanvas').getAttribute('aria-label')`);
  const click = (cx, cy) => pj(`(() => { const c = document.getElementById('bsCanvas'), r = c.getBoundingClientRect(); c.dispatchEvent(new PointerEvent('pointerdown', {clientX: r.left + (${cx} * 24 + 12) / 576 * r.width, clientY: r.top + (36 + ${cy} * 24 + 12) / 300 * r.height, bubbles: true})); return 0; })()`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('bsCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'bistrot-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  const sc = await pj(`document.querySelector('[data-selfcheck]')?.dataset.selfcheck`); if (sc !== 'ok') throw new Error('vérification interne : ' + sc);
  await pj(`(${B}.level(0), 0)`); await sleep(500); await shot('0-depart');
  await pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: ' ', bubbles: true})), 0`); await sleep(2600);
  await click(10, 0); await sleep(2200); await shot('1-tomate');
  let l = await label(); if (!/en main : tomate\b/.test(l)) throw new Error('le cuisinier devait prendre une tomate : « ' + l + ' »');
  await click(12, 0); await sleep(1200); await click(12, 0); await sleep(800); await shot('2-hacher'); await sleep(1400); await click(12, 0); await sleep(800);
  l = await label(); if (!/en main : tomate hache/.test(l) || /reste 3:00/.test(l)) throw new Error('la tomate devait être hachée et le temps tourner : « ' + l + ' »');
  for (const [li, name] of [[1, 'burgers'], [3, 'friterie'], [4, 'fromagerie'], [5, 'pizzeria'], [6, 'salon'], [7, 'grand'], [8, 'coupdefeu']]) {
    await pj(`(${B}.level(${li}), ${B}.start(), ${B}.st().count = 120, ${B}.bot(true), ${B}.ff(${li === 8 ? 3700 : 2400}), 0)`); await sleep(250); await shot('3-' + name);
  }
  await pj(`(${B}.level(3), ${B}.start(), ${B}.st().count = 120, ${B}.bot(true), ${B}.ff(11000), 0)`); await sleep(1500); await shot('4-fin');
  const end = await pj(`(() => { const b = ${B}.st(); return {mode: b.mode, served: b.served, score: b.score, tips: b.tips, combo: b.bestCombo, stars: b.stars}; })()`);
  if (end.mode !== 'over' || end.served < 4) throw new Error('le service à la friterie ne se finit pas : ' + JSON.stringify(end));
  { // la zone de jeu tient dans la fenêtre, quelle que soit sa taille
    const L = await pj(`(() => { const c = [...document.querySelectorAll('.gameBox canvas')].filter(c => c.offsetWidth).sort((a, b) => b.offsetWidth - a.offsetWidth)[0], r = c.getBoundingClientRect(); let s = 0; for (let e = c.parentElement; e; e = e.parentElement) s += e.scrollTop; return { top: Math.round(r.top + s), bottom: Math.round(r.bottom + s), h: Math.round(r.height), w: Math.round(r.width), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
    if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
    if (L.bottom > L.wh + 1 || L.sw > L.ww + 1) throw new Error('la zone de jeu dépasse la fenêtre : ' + JSON.stringify(L));
  }
  return 'tomate hachée à la souris · friterie servie par le cuisinier automatique : ' + end.served + ' plats, ' + end.score + ' points, pourboires ' + end.tips + ', combo ×' + end.combo;
};
