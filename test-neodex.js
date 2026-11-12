// lancé par le test « local » de NeoDex : commence le service, puis à la souris prend une tomate, la pose sur la planche, la hache et la reprend
// (avec NEO_SHOTS : garde des images du jeu, sans la teinte du thème)
module.exports = async ({ pj, sleep }) => {
  const label = () => pj(`document.getElementById('bsCanvas').getAttribute('aria-label')`);
  const click = (cx, cy) => pj(`(() => { const c = document.getElementById('bsCanvas'), r = c.getBoundingClientRect(); c.dispatchEvent(new PointerEvent('pointerdown', {clientX: r.left + (${cx} * 12 + 6) / 240 * r.width, clientY: r.top + (18 + ${cy} * 12 + 6) / 150 * r.height, bubbles: true})); return 0; })()`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('bsCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'bistrot-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await sleep(500); await shot('0-depart');
  await pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: ' ', bubbles: true})), 0`); await sleep(2600);
  await click(5, 0); await sleep(2000); await shot('1-tomate');
  let l = await label(); if (!/en main : tomate\b/.test(l)) throw new Error('le cuisinier devait prendre une tomate : « ' + l + ' »');
  await click(11, 0); await sleep(1500); await click(11, 0); await sleep(800); await shot('2-hacher'); await sleep(1400); await click(11, 0); await sleep(800);
  l = await label(); if (!/en main : tomate hache/.test(l) || !/commandes : (Salade|Salade tomate)/.test(l) || /reste 3:00/.test(l)) throw new Error('la tomate devait être hachée, une commande affichée et le temps tourner : « ' + l + ' »');
  await shot('3-fin');
  return l;
};
