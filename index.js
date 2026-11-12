// Bistrot : jeu de cuisine vu de dessus : hacher, cuire, dresser et envoyer les commandes à temps.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Bistrot</span><span class="hint">flèches : se déplacer · Espace : prendre / poser · E : hacher · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="bsCanvas" width="240" height="150" role="img" aria-label="Bistrot"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="bsStats"></div></div>
      <div class="row"><button class="btn main" id="bsNew">NOUVELLE PARTIE</button></div>
      <div class="hint">Les commandes arrivent en haut. Prends les ingrédients dans les caisses, hache-les sur la planche (maintiens E), cuis le steak à la poêle et la soupe à la marmite, dresse l'assiette et pose-la sur le passe avant la fin du ticket. Attention : ce qui reste sur le feu finit par brûler. Trois minutes de service ; un ticket raté coûte 10 points. Une étoile ouvre la cuisine suivante. À la souris : clique sur une case pour y aller.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:0 0 auto;position:relative}
.gameBox canvas{height:min(72vh,600px);width:auto;aspect-ratio:240/150;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "BISTROT", T: {"k": "#0c0a12", "k2": "#16121e", "fill": "#221c2c", "fillOn": "#2e263a", "hl": "#3a3046", "line": "#62566e", "acc": "#e8a040", "accL": "#ffe0b0", "accS": "#a86a20", "accD": "#2a1608", "rivet": "#f0f0f8", "btn": "#3a3046", "btnHi": "#62566e", "btnLo": "#16121e", "btnHov": "#443852", "btnHovHi": "#82768e", "text": "#f4f0f8", "muted": "#c0b8cc", "acc2": "#7ee07a", "gold": "#ffd84a", "orange": "#ff8a3a", "red": "#ff4a3a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#100c16", "bgDot": "#221c2c", "bgDot2": "#16121e", "spark": "#2a1608", "spark2": "#e8a040", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["............", "...kkkkkk...", "..kwwwwwwk..", ".kwwwwwwwwk.", ".kwwwwwwwwk.", "..kwwwwwwk..", "..kwmwwmwk..", "..kwmwwmwk..", "..kkkkkkkk..", "..kaaaaaak..", "...kkkkkk...", "............"],
  icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (v > (b ?? 0)) {  // un score nul n'est jamais un record
    games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

/* ---------- Bistrot : une cuisine vue de dessus. Les commandes arrivent ; prends les ingrédients, hache, cuis, dresse l'assiette et envoie-la
   au passe avant la fin du ticket. Six cuisines, trois minutes de service chacune, jusqu'à trois étoiles ---------- */
const BS = {W: 240, H: 150, TS: 12, COLS: 20, ROWS: 11, TOP: 18, TIME: 180 * 60, CHOP: 80, COOK: 300, BURN: 420, SOUP: 420, SBURN: 540, PLATES: 4, BACK: 360, SPD: 1.3};
// une nouvelle partie garde le même objet : la boucle du jeu (gameLoop) continue de tourner dessus
const renew = (old, o) => { if (!old) return o; for (const k of Object.keys(old)) if (k !== 'raf') delete old[k]; return Object.assign(old, o); };
const bss = gstore('bistrot', {best: {}, stars: {}, served: 0, games: 0, level: 0});
let bs = null, bsac = null, bsMute = false;
function bsBeep(f, d, type = 'square', slide = 0, vol = .03) { if (bsMute) return; try { bsac ??= new AudioContext(); const o = bsac.createOscillator(), g = bsac.createGain(), t = bsac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(bsac.destination); o.start(t); o.stop(t + d); } catch {} }
// les plats : ce qu'il y a dans l'assiette (rangé par ordre alphabétique), les points, et le temps du ticket en secondes
const BS_REC = {
  salade: {name: 'Salade', parts: ['salade'], pts: 20, time: 60},
  saltom: {name: 'Salade tomate', parts: ['salade', 'tomate'], pts: 30, time: 70},
  burger: {name: 'Burger', parts: ['pain', 'viande'], pts: 40, time: 80},
  cheese: {name: 'Cheeseburger', parts: ['fromage', 'pain', 'viande'], pts: 50, time: 95},
  soupeT: {name: 'Soupe de tomates', parts: ['soupeT'], pts: 40, time: 90},
  soupeO: {name: "Soupe à l'oignon", parts: ['soupeO'], pts: 40, time: 90},
};
const BS_ALL = Object.values(BS_REC).map(r => r.parts);
const BS_CRATE = {T: 'tomate', L: 'salade', P: 'pain', V: 'viande', F: 'fromage', O: 'oignon'};
const BS_CHOP = ['tomate', 'salade', 'fromage', 'oignon', 'viande'];
// les cuisines : . sol, # plan de travail, lettres = caisses d'ingrédients, C planche, S poêle, M marmite, A assiettes, X passe, D poubelle
const BS_LEVELS = [
  {name: 'Le comptoir', rec: ['salade', 'saltom'], gap: 1380, map: [
    '##L##T#####C#C####A#',
    '#..................#',
    '#..................#',
    '#....########......#',
    '#..................X',
    '#..................X',
    '#..................#',
    '#....########......#',
    '#..................#',
    '#..................#',
    '#########D##########']},
  {name: 'Burgers', rec: ['burger', 'salade'], gap: 1380, map: [
    '##P##V######S#S#####',
    '#..................#',
    '#..................C',
    '#...###.....###....C',
    '#..................#',
    'L..................X',
    '#..................X',
    '#...###.....###....#',
    '#..................#',
    '#..................A',
    '#######D############']},
  {name: 'Soupes', rec: ['soupeT', 'soupeO'], gap: 1320, map: [
    '##T####O####C#C#####',
    '#..................M',
    '#..................M',
    '#.....########.....#',
    '#..................#',
    'A..................#',
    '#..................M',
    '#.....########.....#',
    '#..................#',
    '#..................X',
    '######D###########X#']},
  {name: 'Fromagerie', rec: ['burger', 'cheese', 'saltom'], gap: 1260, map: [
    '#P#V#F#L#T######S#S#',
    '#..................#',
    'C.......#..........#',
    'C.......#..........#',
    '#.......#..........X',
    '#.......#..........X',
    '#.......#..........#',
    '#..................#',
    '#..................#',
    '#..................A',
    '####D###############']},
  {name: 'Grand service', rec: ['salade', 'saltom', 'burger', 'cheese', 'soupeT', 'soupeO'], gap: 1200, map: [
    '#T#L#P#V#F#O###C#C##',
    '#..................#',
    'S..................M',
    'S....##########....M',
    '#..................#',
    '#..................X',
    '#..................X',
    '#....##########....#',
    '#..................#',
    'A..................#',
    '#####D######C#######']},
  {name: 'Coup de feu', rec: ['burger', 'cheese', 'soupeT', 'saltom'], gap: 1080, map: [
    '#T#L#P#V#F##C#C#S#S#',
    '#.........#........#',
    '#.........#........M',
    '#.........#........M',
    '#.........#........#',
    '#..................X',
    '#.........#........X',
    '#.........#........#',
    '#.........#........#',
    'A.........#........#',
    '#####D##############']},
];
const bsGoals = [];  // les seuils des trois étoiles de chaque cuisine, fixés par le cuisinier automatique (vérification plus bas)
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const bsKey = (cx, cy) => cy * BS.COLS + cx;
const bsIn = (cx, cy) => cx >= 0 && cy >= 0 && cx < BS.COLS && cy < BS.ROWS;
const bsCh = (cx, cy) => bsIn(cx, cy) ? bs.grid[cy][cx] : '#';
const bsCk = k => bs.grid[Math.floor(k / BS.COLS)][k % BS.COLS];
const bsFloor = (cx, cy) => bsCh(cx, cy) === '.';
const bsUnlocked = li => li === 0 || (bss.stars[li - 1] || 0) >= 1;
// ce qu'un ingrédient apporte à l'assiette, une fois prêt : haché, ou cuit pour le steak ; le pain s'y met tel quel
const bsPart = it => it.t === 'pain' ? 'pain' : it.t === 'viande' ? (it.s === 'cuit' ? 'viande' : null) : ['salade', 'tomate', 'fromage'].includes(it.t) && it.s === 'hache' ? it.t : null;
const bsSub = (a, b) => { const c = b.slice(); return a.every(x => { const i = c.indexOf(x); if (i < 0) return false; c.splice(i, 1); return true; }); };
function bsAdd(plate, it) {  // n'accepte que ce qui mène à un plat de la carte
  if (it.t === 'assiette' || plate.parts.some(x => x.startsWith('soupe'))) return false;
  const p = bsPart(it); if (!p) return false;
  const np = [...plate.parts, p].sort(); if (!BS_ALL.some(r => bsSub(np, r))) return false;
  plate.parts = np; return true;
}
function bsNew(li = bss.level) {
  const g = bs?.g, L = BS_LEVELS[li], items = new Map();
  L.map.forEach((r, y) => [...r].forEach((c, x) => { if (c === 'M') items.set(bsKey(x, y), {t: 'marmite', parts: [], k: 0}); }));
  bs = renew(bs, {g, mode: 'ready', tick: 0, seen: 0, li, L, grid: L.map.map(r => [...r]), items, x: 9 * 12 + 6, y: 5 * 12 + 6, dir: [0, 1], walk: 0, hand: null, keys: new Set(),
    t: 0, count: 0, score: 0, served: 0, failed: 0, orders: [], next: 30, rng: seeded(li * 97 + 5), plates: BS.PLATES, back: [], fx: [], msg: null, goal: null, lastK: -1, chop: false,
    dead: 0, stars: 0, record: false, bot: null});
  bsInfo();
}
const bsSay = txt => { bs.msg = {txt, t: 100}; };
function bsOrder() { const L = bs.L, r = L.rec[Math.floor(bs.rng() * L.rec.length)], tot = BS_REC[r].time * 60; bs.orders.push({r, left: tot, tot, born: 20}); bsBeep(990, .08, 'triangle', 1320, .02); }
function bsServe(h) {
  const key = h.parts.join(','), i = bs.orders.findIndex(o => BS_REC[o.r].parts.join(',') === key);
  if (i < 0) { bsSay('Pas commandé'); bsBeep(160, .15); return false; }
  const o = bs.orders.splice(i, 1)[0], pts = BS_REC[o.r].pts + Math.round(10 * o.left / o.tot);
  bs.score += pts; bs.served++; bs.back.push(BS.BACK);
  bs.fx.push({x: bs.x, y: bs.y - 14, t: 60, txt: '+' + pts, c: '#ffd84a'});
  [784, 1047, 1319].forEach((f, j) => setTimeout(() => bsBeep(f, .1, 'triangle'), j * 70));
  return true;
}
// la case juste devant le cuisinier (-1 si c'est du sol)
function bsFront() { const cx = Math.floor(bs.x / 12) + bs.dir[0], cy = Math.floor(bs.y / 12) + bs.dir[1]; return !bsIn(cx, cy) || bsFloor(cx, cy) ? -1 : bsKey(cx, cy); }
function bsPot(k) {
  const p = bs.items.get(k), h = bs.hand;
  if (p.k >= BS.SOUP + BS.SBURN) { if (!h) { bs.hand = {t: 'cendre'}; Object.assign(p, {parts: [], k: 0}); bsBeep(220, .08); } else bsSay('Soupe brûlée : mains libres pour la vider'); return; }
  if (h && (h.t === 'tomate' || h.t === 'oignon') && p.parts.length < 3 && (!p.parts.length || p.parts[0] === h.t)) {
    if (h.s !== 'hache') { bsSay('Hache-le d’abord'); return; }
    p.parts.push(h.t); bs.hand = null; bsBeep(330, .08, 'triangle', 220); return;
  }
  if (h && h.t === 'assiette' && !h.parts.length && p.k >= BS.SOUP) { h.parts = [p.parts[0] === 'tomate' ? 'soupeT' : 'soupeO']; Object.assign(p, {parts: [], k: 0}); bsBeep(660, .08, 'triangle'); return; }
  if (h?.t === 'assiette' && p.parts.length === 3) bsSay('Pas encore cuite'); else if (h && p.parts.length && p.parts[0] !== h.t) bsSay('Une seule sorte par marmite');
}
// Espace : prendre ou poser, ce qui dépend de la case visée et de ce qu'on a en main
function bsUse() {
  const tc = bsFront(); if (tc < 0) return;
  const ch = bsCk(tc), it = bs.items.get(tc), h = bs.hand;
  if (ch === 'M') return bsPot(tc);
  if (!h) {
    if (it) { bs.hand = it; bs.items.delete(tc); bsBeep(520, .04); return; }
    if (BS_CRATE[ch]) { bs.hand = {t: BS_CRATE[ch], s: 'cru', c: 0, k: 0}; bsBeep(520, .04); return; }
    if (ch === 'A') { if (bs.plates > 0) { bs.plates--; bs.hand = {t: 'assiette', parts: []}; bsBeep(700, .04); } else bsSay('Plus d’assiette : elles reviennent du passe'); }
    return;
  }
  if (ch === 'D') { if (h.t === 'assiette') h.parts = []; else bs.hand = null; bsBeep(140, .1, 'square', 90); return; }
  if (ch === 'X') { if (h.t !== 'assiette' || !h.parts.length) bsSay('Le passe veut une assiette dressée'); else if (bsServe(h)) bs.hand = null; return; }
  if (ch === 'A') { if (h.t === 'assiette' && !h.parts.length) { bs.plates++; bs.hand = null; } return; }
  if (it) {  // dresser : l'ingrédient va sur l'assiette, ou l'assiette ramasse l'ingrédient
    if (it.t === 'assiette' && bsAdd(it, h)) { bs.hand = null; bsBeep(600, .05, 'triangle'); }
    else if (h.t === 'assiette' && bsAdd(h, it)) { bs.items.delete(tc); bsBeep(600, .05, 'triangle'); }
    else if (it.t === 'assiette' || h.t === 'assiette') bsSay(bsPart(it.t === 'assiette' ? h : it) ? 'Ça ne va pas ensemble' : 'Pas encore prêt');
    return;
  }
  if (ch === 'S') { if (h.t !== 'viande') bsSay('La poêle, c’est pour la viande'); else if (h.s === 'cru') bsSay('Hache-la d’abord'); else { bs.items.set(tc, h); bs.hand = null; bsBeep(200, .1, 'sawtooth', 160, .02); } return; }
  if (ch === 'C' && h.t === 'assiette') return;
  bs.items.set(tc, h); bs.hand = null; bsBeep(420, .04);
}
// E : hacher ce qui est sur la planche (mains libres)
function bsChopStep() {
  const tc = bsFront(), it = tc >= 0 ? bs.items.get(tc) : null;
  if (!it || bs.hand || bsCk(tc) !== 'C' || it.s !== 'cru' || !BS_CHOP.includes(it.t)) return false;
  bs.chop = true; it.c++;
  if (it.c % 14 === 1) bsBeep(260 + (it.c % 3) * 40, .03, 'square', 0, .02);
  if (it.c >= BS.CHOP) { it.s = 'hache'; bsBeep(660, .06, 'triangle'); }
  return true;
}
// les déplacements : on glisse le long des comptoirs, et un petit coup de pouce aide à entrer dans les allées
const bsFree = (x, y) => [[-4, -3], [3, -3], [-4, 3], [3, 3]].every(([a, b]) => bsFloor(Math.floor((x + a) / 12), Math.floor((y + b) / 12)));
function bsMove(dx, dy) {
  let moved = false;
  if (dx) { if (bsFree(bs.x + dx, bs.y)) { bs.x += dx; moved = true; } else { const c = Math.floor(bs.y / 12) * 12 + 6, d = c - bs.y; if (Math.abs(d) < 6 && d && !dy) { bs.y += Math.sign(d) * Math.min(Math.abs(d), BS.SPD); moved = true; } } }
  if (dy) { if (bsFree(bs.x, bs.y + dy)) { bs.y += dy; moved = true; } else { const c = Math.floor(bs.x / 12) * 12 + 6, d = c - bs.x; if (Math.abs(d) < 6 && d && !dx) { bs.x += Math.sign(d) * Math.min(Math.abs(d), BS.SPD); moved = true; } } }
  return moved;
}
// le chemin le plus court sur le sol (pour la souris et le cuisinier automatique)
function bsPath(ok) {
  const sx = Math.floor(bs.x / 12), sy = Math.floor(bs.y / 12), prev = new Map([[bsKey(sx, sy), -1]]), q = [[sx, sy]];
  for (let i = 0; i < q.length; i++) {
    const [x, y] = q[i];
    if (ok(x, y)) { const path = []; let k = bsKey(x, y); while (k !== -1) { path.unshift([k % BS.COLS, Math.floor(k / BS.COLS)]); k = prev.get(k); } return path; }
    for (const [dx, dy] of DIRS) { const nx = x + dx, ny = y + dy, nk = bsKey(nx, ny); if (bsFloor(nx, ny) && !prev.has(nk)) { prev.set(nk, bsKey(x, y)); q.push([nx, ny]); } }
  }
  return null;
}
function bsGoTo(pred, act) {  // va se placer devant la case la plus proche qui convient, puis agit (act : 'use', 'chop' ou rien)
  let target = -1;
  const path = bsPath((x, y) => DIRS.some(([dx, dy]) => { const nx = x + dx, ny = y + dy; if (!bsIn(nx, ny) || bsFloor(nx, ny) || !pred(bsKey(nx, ny))) return false; target = bsKey(nx, ny); return true; }));
  if (!path) return false;
  bs.goal = {k: target, act, path}; bs.lastK = target; return true;
}
function bsFollow() {
  const gl = bs.goal;
  if (gl.path.length) {
    const [cx, cy] = gl.path[0], tx = cx * 12 + 6, ty = cy * 12 + 6, dx = tx - bs.x, dy = ty - bs.y, d = Math.hypot(dx, dy);
    if (d <= BS.SPD) { bs.x = tx; bs.y = ty; gl.path.shift(); } else { bs.x += dx / d * BS.SPD; bs.y += dy / d * BS.SPD; }
    if (d > .1) bs.dir = Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)];
    bs.walk++; return;
  }
  if (gl.k < 0) { bs.goal = null; return; }
  bs.dir = [gl.k % BS.COLS - Math.floor(bs.x / 12), Math.floor(gl.k / BS.COLS) - Math.floor(bs.y / 12)];
  if (gl.act === 'use') { bsUse(); bs.goal = null; } else if (gl.act === 'chop') { if (!bsChopStep()) bs.goal = null; } else bs.goal = null;
}
function bsUpdate() {
  if (bs.count < 120) { bs.count++; return; }  // « Prêts ? » puis le service commence
  bs.t++;
  const L = bs.L, K = bs.keys;
  if (!bs.orders.length) bs.next = Math.min(bs.next, 90);
  if (--bs.next <= 0) { if (bs.orders.length < 4) bsOrder(); bs.next = L.gap; }
  for (const o of bs.orders) { if (o.born) o.born--; if (--o.left <= 0) { o.gone = 1; bs.score = Math.max(0, bs.score - 10); bs.failed++; bs.fx.push({x: bs.x, y: bs.y - 14, t: 60, txt: '-10', c: '#ff6a5a'}); bsBeep(180, .3, 'sawtooth', 90); } }
  bs.orders = bs.orders.filter(o => !o.gone);
  bs.back = bs.back.map(t => t - 1); if (bs.back.some(t => t <= 0)) { bs.plates += bs.back.filter(t => t <= 0).length; bs.back = bs.back.filter(t => t > 0); bsBeep(900, .04, 'triangle', 0, .015); }
  bs.chop = false;
  if (bs.bot) bs.bot.next();
  if (bs.goal) bsFollow();
  else {
    let mx = (K.has('R') ? 1 : 0) - (K.has('L') ? 1 : 0), my = (K.has('D') ? 1 : 0) - (K.has('U') ? 1 : 0);
    if (mx || my) { bs.dir = mx && (!my || Math.abs(mx) >= Math.abs(my) && !K.has('U') && !K.has('D')) ? [mx, 0] : [0, my]; const n = mx && my ? Math.SQRT1_2 : 1; if (bsMove(mx * BS.SPD * n, my * BS.SPD * n)) bs.walk++; }
    if (K.has('E')) bsChopStep();
  }
  // la cuisson : la poêle cuit puis brûle le steak, la marmite pleine cuit puis brûle la soupe
  for (const [k, it] of bs.items) {
    const ch = bsCk(k);
    if (ch === 'S' && it.t === 'viande' && it.s !== 'cru') {
      it.k++; it.s = it.k >= BS.COOK + BS.BURN ? 'brule' : it.k >= BS.COOK ? 'cuit' : 'hache';
      if (it.k === BS.COOK) bsBeep(880, .1, 'triangle'); if (it.k === BS.COOK + BS.BURN) bsBeep(150, .4, 'sawtooth', 80);
      if (it.k % 9 === 0) bs.fx.push({x: (k % BS.COLS) * 12 + 4 + (it.k % 5), y: Math.floor(k / BS.COLS) * 12, t: 30, c: it.s === 'brule' ? '#3a3036' : '#e8e8f0'});
    }
    if (ch === 'M' && it.parts.length === 3) {
      it.k++;
      if (it.k === BS.SOUP) bsBeep(880, .1, 'triangle'); if (it.k === BS.SOUP + BS.SBURN) bsBeep(150, .4, 'sawtooth', 80);
      if (it.k % 11 === 0) bs.fx.push({x: (k % BS.COLS) * 12 + 3 + (it.k % 7), y: Math.floor(k / BS.COLS) * 12, t: 30, c: it.k >= BS.SOUP + BS.SBURN ? '#3a3036' : '#e8e8f0'});
    }
  }
  for (const f of bs.fx) f.t--; bs.fx = bs.fx.filter(f => f.t > 0);
  if (bs.msg && --bs.msg.t <= 0) bs.msg = null;
  if (bs.t >= BS.TIME) bsEnd();
}
function bsEnd() {
  bs.mode = 'over'; bs.dead = 0; bs.goal = null; bs.keys.clear();
  const li = bs.li, gl = bsGoals[li] || [];
  bs.stars = gl.filter(v => bs.score >= v).length; bs.record = bs.score > (bss.best[li] || 0);
  if (bs.record) bss.best[li] = bs.score;
  bss.stars[li] = Math.max(bss.stars[li] || 0, bs.stars); bss.served += bs.served; bss.games++;
  saveGames(); bsInfo();
  [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => bsBeep(f, .14, 'triangle'), i * 110));
}
/* ---------- le dessin : carrelage, comptoirs en bois, inox pour les feux et le passe ; tout en sprites de 8 pixels ---------- */
const BS_PAL = {k: '#1a1008', w: '#ffffff', W: '#c8c8d8', r: '#e83a2a', R: '#ff8a6a', d: '#a01a1a', N: '#3a8a2a', n: '#2a6a2a', g: '#4aaa3a', G: '#9ae05a', y: '#d89a40', Y: '#f8d888',
  p: '#e87a8a', P: '#ffb0b8', b: '#7a4a2a', B: '#a86a3a', f: '#f8c830', F: '#fff0a0', o: '#c89010', v: '#b05ab0', V: '#e8c8e8', x: '#3a3036', X: '#5a5a68', m: '#8a8e9c', M: '#c8ccd8', c: '#d83a2a', C: '#ff7a5a'};
const BS_SPR = {
  tomate: ['...kk...', '.kkNNkk.', 'krRrrrrk', 'kRrrrrrk', 'krrrrrrk', 'krrrrrdk', '.krrddk.', '..kkkk..'],
  salade: ['..kkkk..', '.kgGGgk.', 'kgGgGGgk', 'kGgGgGgk', 'kgGGgGgk', 'kgGgGggk', '.kngggk.', '..kkkk..'],
  pain: ['........', '..kkkk..', '.kyYYyk.', 'kyYwYYyk', 'kyyyyyyk', 'kkkkkkkk', 'kyyyyyyk', '.kkkkkk.'],
  viande: ['........', '.kkkkk..', 'kpPpppkk', 'kpPwpppk', 'kppppPpk', 'kpPppppk', '.kppkkk.', '..kk....'],
  fromage: ['........', '......kk', '....kkFk', '..kkFFfk', 'kkFfFffk', 'kffffofk', 'kfoffffk', 'kkkkkkkk'],
  oignon: ['...kk...', '...kNk..', '..kVVk..', '.kVvVVk.', 'kVvVVvVk', 'kVVvVVvk', '.kVVvVk.', '..kkkk..'],
  cendre: ['........', '........', '...kk...', '..kxXk..', '.kxXxxk.', 'kxxXxxXk', 'kkkkkkkk', '........'],
};
const BS_BITS = ['........', '.kkk....', 'kaAak.kk', 'kaadkkAk', '.kkkkaak', '.kAakkdk', '.kadk.k.', '..kk....'];  // haché
const BS_PATTY = ['........', '........', '..kkkk..', '.kaAaak.', 'kaAaaadk', 'kaaaaddk', '.kkkkkk.', '........'];
const BS_BITPAL = {tomate: {a: '#e83a2a', A: '#ff8a6a', d: '#a01a1a'}, salade: {a: '#4aaa3a', A: '#9ae05a', d: '#2a6a2a'}, fromage: {a: '#f8c830', A: '#fff0a0', d: '#c89010'}, oignon: {a: '#e8c8e8', A: '#ffffff', d: '#a06aa0'},
  hache: {a: '#e87a8a', A: '#ffb0b8', d: '#b8505a'}, cuit: {a: '#8a5a2a', A: '#b07a40', d: '#5a3414'}, brule: {a: '#3a3030', A: '#5a4a48', d: '#1a1414'}};
const BS_BOWL = ['kkkkkkkk', 'kwwwwwWk', '.kwwwWk.', '..kkkk..'];
const BS_DISH = {
  salade: ['........', '.kgGgGk.', 'kGgGgGgk', ...BS_BOWL, '........'],
  saltom: ['........', '.kgrgGk.', 'kGgGrGgk', ...BS_BOWL, '........'],
  burger: ['..kkkk..', '.kyYYyk.', 'kyYwYyyk', 'kkkkkkkk', 'kbbBbbbk', 'kkkkkkkk', 'kyyyyyyk', '.kkkkkk.'],
  cheese: ['..kkkk..', '.kyYYyk.', 'kyYwYyyk', 'kfFffffk', 'kbbBbbbk', 'kkkkkkkk', 'kyyyyyyk', '.kkkkkk.'],
  soupeT: ['........', '...W.W..', '..W.W...', 'kkkkkkkk', 'kcCcccck', 'kwwwwwWk', '.kwwwWk.', '..kkkk..'],
  soupeO: ['........', '...W.W..', '..W.W...', 'kkkkkkkk', 'kfFffffk', 'kwwwwwWk', '.kwwwWk.', '..kkkk..'],
};
const BS_PAN = ['..kkkkkk....', '.kxXxxxxk...', 'kxXxxxxxxk..', 'kxxxxxxxxkkk', 'kxxxxxxxxkbk', '.kxxxxxxk.kk', '..kkkkkk....'];
const BS_POT = ['.kkkkkkkk.', 'kWwwwwwwWk', 'kiiIiiiiik', 'kiiiiiiIik', 'kkkkkkkkkk', 'kmMmmmmmmk', 'kmMmmmmmmk', 'kmmmmmmmmk', '.kkkkkkkk.'];
const BS_PLATE = ['.kkkkkkkk.', 'kwwwwwwwwk', 'kWwwwwwwWk', '.kkkkkkkk.'];
// l'icône d'un ingrédient prêt (pour les tickets et les assiettes pas finies)
function bsIcon(g, part, x, y) {
  if (part === 'pain') sprite(g, BS_SPR.pain, x, y, BS_PAL);
  else if (part === 'viande') sprite(g, BS_PATTY, x, y, {...BS_PAL, ...BS_BITPAL.cuit});
  else if (part.startsWith('soupe')) sprite(g, BS_DISH[part], x, y, BS_PAL);
  else sprite(g, BS_BITS, x, y, {...BS_PAL, ...BS_BITPAL[part]});
}
function bsItem(g, it, cx, by) {  // un objet posé : (cx, by) = milieu du bas
  const x = Math.round(cx) - 4, y = Math.round(by) - 8;
  if (it.t === 'assiette') {
    sprite(g, BS_PLATE, x - 1, y + 5, BS_PAL);
    const key = it.parts.join(','), done = Object.keys(BS_REC).find(r => BS_REC[r].parts.join(',') === key);
    if (done) sprite(g, BS_DISH[done], x, y - 1, BS_PAL); else it.parts.forEach((p, i) => bsIcon(g, p, x - 2 + i * 3, y - 1 - i));
    return;
  }
  if (it.t === 'cendre') return sprite(g, BS_SPR.cendre, x, y, BS_PAL);
  if (it.t === 'viande' && it.s !== 'cru') return sprite(g, BS_PATTY, x, y, {...BS_PAL, ...BS_BITPAL[it.s]});
  if (it.s === 'hache') return sprite(g, BS_BITS, x, y, {...BS_PAL, ...BS_BITPAL[it.t]});
  sprite(g, BS_SPR[it.t], x, y, BS_PAL);
}
const bsBar = (g, x, y, f, col) => { px(g, '#1a1008', x - 1, y - 1, 12, 4); px(g, '#3a2a1a', x, y, 10, 2); px(g, col, x, y, Math.max(1, Math.round(10 * Math.min(1, f))), 2); };
function bsTile(g, cx, cy) {
  const ch = bs.grid[cy][cx], x = cx * 12, y = BS.TOP + cy * 12, k = bsKey(cx, cy), it = bs.items.get(k), blink = bs.tick % 20 < 10;
  if (ch === '.') {  // le carrelage : damier crème et terre cuite, joints, reflet en haut à gauche, ombre des comptoirs voisins
    const a = (cx + cy) % 2, h = (cx * 7 + cy * 13) % 5;
    px(g, a ? '#ecdcbc' : '#d8a878', x, y, 12, 12); px(g, a ? '#f8ecd4' : '#e8bc8c', x + 1, y + 1, 9, 1); px(g, a ? '#f8ecd4' : '#e8bc8c', x + 1, y + 1, 1, 9);
    px(g, a ? '#dccaa4' : '#c8966a', x + 2, y + 10, 9, 1); px(g, a ? '#dccaa4' : '#c8966a', x + 10, y + 2, 1, 9);
    if (h === 1) px(g, a ? '#e0cea8' : '#c48e60', x + 4 + (cx % 3) * 2, y + 5 + (cy % 2) * 2, 2, 1);
    px(g, '#a88a66', x, y + 11, 12, 1); px(g, '#a88a66', x + 11, y, 1, 12);
    if (!bsFloor(cx, cy - 1)) { g.fillStyle = 'rgba(70,36,12,.32)'; g.fillRect(x, y, 12, 3); g.fillStyle = 'rgba(70,36,12,.16)'; g.fillRect(x, y + 3, 12, 1); }
    if (!bsFloor(cx - 1, cy)) { g.fillStyle = 'rgba(70,36,12,.2)'; g.fillRect(x, y, 2, 12); }
    return;
  }
  const metal = 'SMX'.includes(ch);
  if (metal) {  // l'inox brossé : reflets en bandes, rivets aux coins, façade sombre
    px(g, '#868a98', x, y, 12, 8); for (let i = 1; i < 8; i += 2) px(g, '#7c808e', x, y + i, 12, 1); px(g, '#c4c8d4', x, y, 12, 1); px(g, '#a4a8b4', x, y + 1, 1, 7); px(g, '#5a5e6a', x + 11, y + 1, 1, 7);
    px(g, '#2a2e38', x + 1, y + 1, 1, 1); px(g, '#2a2e38', x + 10, y + 6, 1, 1);
    px(g, '#4a4e5a', x, y + 8, 12, 3); px(g, '#5e626e', x, y + 8, 12, 1); px(g, '#2a2e38', x + 3, y + 9, 6, 1);
  } else {  // le bois : dessus clair veiné, chant arrondi, façade de placard avec sa poignée
    px(g, '#c8925a', x, y, 12, 8); px(g, '#e4b47a', x, y, 12, 1); px(g, '#d8a46a', x, y + 1, 12, 1);
    for (let i = 0; i < 3; i++) { const gy = y + 2 + ((cx * 3 + cy + i * 2) % 5), gx = x + ((cx * 5 + i * 4) % 8); px(g, '#b47e48', gx, gy, 3 + (i % 2), 1); }
    px(g, '#a8763e', x + 11, y + 1, 1, 7);
    px(g, '#7a4a22', x, y + 8, 12, 3); px(g, '#8e5a2e', x, y + 8, 12, 1); px(g, '#5a3414', x + 11, y + 8, 1, 3);
    if ((cx + cy) % 2) px(g, '#e8c080', x + 5, y + 9, 2, 1);
  }
  px(g, '#2a1408', x, y + 11, 12, 1);
  if (BS_CRATE[ch]) {  // une caisse en lattes, pleine de son ingrédient
    px(g, '#3a2010', x + 1, y + 1, 10, 8); px(g, '#a86e34', x + 2, y + 2, 8, 6); px(g, '#c88a48', x + 2, y + 2, 8, 1); px(g, '#7a4a20', x + 2, y + 4, 8, 1); px(g, '#7a4a20', x + 2, y + 6, 8, 1); px(g, '#5a3414', x + 5, y + 2, 1, 6);
    if (!it) { sprite(g, BS_SPR[BS_CRATE[ch]], x + 2, y - 2, BS_PAL); }
  }
  else if (ch === 'C') {  // la planche à découper : bois clair veiné, couteau
    px(g, '#5a3414', x + 1, y + 1, 10, 7); px(g, '#e8c890', x + 1, y + 1, 10, 6); px(g, '#f8e0b0', x + 1, y + 1, 10, 1); px(g, '#d0aa70', x + 2, y + 4, 4, 1); px(g, '#d0aa70', x + 6, y + 6, 3, 1);
    if (!it) { px(g, '#e8ecf4', x + 3, y + 3, 5, 1); px(g, '#a8acb8', x + 3, y + 4, 5, 1); px(g, '#3a2a1a', x + 8, y + 3, 3, 2); } }
  else if (ch === 'S') {
    const hot = it && it.t === 'viande';
    px(g, '#1a1c24', x + 1, y + 1, 10, 7); px(g, hot ? (bs.tick % 8 < 4 ? '#ff6a1a' : '#e84a10') : '#3a3e4a', x + 2, y + 2, 8, 5); px(g, '#1a1c24', x + 3, y + 3, 6, 3);
    if (hot) { px(g, '#ffd84a', x + 2 + (bs.tick >> 2) % 8, y + 2, 1, 1); if (bs.tick % 24 < 12) px(g, 'rgba(255,255,255,.5)', x + 4 + (bs.tick >> 3) % 3, y - 3 - (bs.tick % 12 >> 2), 1, 2); }
    sprite(g, BS_PAN, x, y + 1, BS_PAL);
    if (it) { bsItem(g, it, x + 6, y + 8); if (it.t === 'viande' && it.s === 'hache') bsBar(g, x + 1, y - 2, it.k / BS.COOK, '#ff9a3a'); if (it.s === 'cuit' && it.k > BS.COOK + BS.BURN * .4 && blink) pxFont(g, '!', x + 6, y - 1, '#ff4a3a', 8, 'center'); }
    return;
  }
  else if (ch === 'M') {
    const p = it, burnt = p.k >= BS.SOUP + BS.SBURN, done = p.k >= BS.SOUP;
    if (p.parts.length === 3 && bs.tick % 6 < 3) px(g, '#ff8a2a', x + 1, y + 6, 10, 3);
    const col = !p.parts.length ? '#2a2a34' : burnt ? '#3a3030' : p.parts[0] === 'tomate' ? (done ? '#d83a2a' : '#e87a6a') : (done ? '#d8a030' : '#e8d0b0');
    sprite(g, BS_POT, x + 1, y - 1, {...BS_PAL, i: col, I: p.parts.length && !burnt ? '#ffffff' : col});
    if (p.parts.length && p.parts.length < 3) for (let i = 0; i < 3; i++) px(g, i < p.parts.length ? '#7ae05a' : '#3a2a1a', x + 3 + i * 2, y - 2, 1, 1);
    if (p.parts.length === 3 && !done) bsBar(g, x + 1, y - 3, p.k / BS.SOUP, '#ff9a3a');
    if (done && !burnt) { if (p.k > BS.SOUP + BS.SBURN * .4 && blink) pxFont(g, '!', x + 6, y - 1, '#ff4a3a', 8, 'center'); else px(g, '#7ae05a', x + 5, y - 3, 2, 2); }
    return;
  }
  else if (ch === 'A') { for (let i = 0; i < Math.min(4, bs.plates); i++) sprite(g, BS_PLATE, x + 1, y + 4 - i * 2, BS_PAL); }
  else if (ch === 'X') { g.fillStyle = 'rgba(255,200,80,.18)'; g.fillRect(x - 1, y - 1, 14, 11); px(g, '#5a5e6a', x + 1, y + 2, 10, 6); for (let i = 0; i < 3; i++) { const c = (bs.tick / 8 + i) % 3 < 1 ? '#ffd84a' : '#c8a030'; px(g, c, x + 3 + i * 2, y + 3, 1, 1); px(g, c, x + 4 + i * 2, y + 4, 1, 1); px(g, c, x + 3 + i * 2, y + 5, 1, 1); }
    if (bsCh(cx, cy - 1) !== 'X') { px(g, '#1a1008', x + 8, y - 1, 3, 2); px(g, '#ffd84a', x + 9, y - 1, 1, 1); } }
  else if (ch === 'D') { px(g, '#1a1a22', x + 2, y - 1, 8, 10); px(g, '#6a6e7c', x + 3, y + 1, 6, 7); px(g, '#8a8e9c', x + 3, y + 1, 1, 7); px(g, '#9a9eac', x + 2, y - 1, 8, 2); px(g, '#c8ccd8', x + 3, y - 1, 6, 1); px(g, '#1a1a22', x + 5, y - 2, 2, 1);
    px(g, '#4a4e5a', x + 5, y + 3, 1, 4); px(g, '#4a4e5a', x + 7, y + 3, 1, 4); px(g, '#2a2e38', x + 4, y + 8, 4, 1); }
  if (it) { bsItem(g, it, x + 6, y + 8); if (ch === 'C' && it.s === 'cru' && it.c > 0) bsBar(g, x + 1, y - 2, it.c / BS.CHOP, '#7ae05a'); }
}
const BS_CHEF = {
  down: ['...kkkkkk...', '..kwwwwwwk..', '.kwwwwwwwwk.', '.kwwwwwwwWk.', '..kWWWWWWk..', '..kssssssk..', '..kseSSesk..', '..kssssssk..', '..kkrrrrkk..', '.kwwwrrwwwk.', 'kswwwwwwwwsk', '.kWwwwwwwWk.'],
  up: ['...kkkkkk...', '..kwwwwwwk..', '.kwwwwwwwwk.', '.kwwwwwwwWk.', '..kWWWWWWk..', '..khhhhhhk..', '..khhhhhhk..', '..kshhhhsk..', '..kkwwwwkk..', '.kwwwwwwwwk.', 'kswwwwwwwwsk', '.kWwwwwwwWk.'],
  side: ['...kkkkkk...', '..kwwwwwwk..', '.kwwwwwwwwk.', '.kwwwwwwwWk.', '..kWWWWWWk..', '..khhsssssk.', '..khssssesk.', '..khsssssk..', '..kkrrrrkk..', '..kwwwwrrk..', '..kwwwwwsk..', '..kWwwwwWk..'],
};
const BS_LEGS = [['..kbbkkbbk..', '..kkk..kkk..'], ['..kbbk.kbbk.', '..kkk...kk..'], ['.kbbk..kbbk.', '.kk....kkk..']];
const BS_CPAL = {k: '#1a1008', w: '#ffffff', W: '#c8d0e0', s: '#f0c8a0', S: '#d8a080', e: '#1a1008', r: '#e83a2a', b: '#3a3a5a', h: '#6a3a1a'};
function bsChef(g) {
  const x = Math.round(bs.x) - 6, y = BS.TOP + Math.round(bs.y) - 11, [dx, dy] = bs.dir, legs = BS_LEGS[bs.walk % 16 < 8 ? 1 : 2];
  const moving = bs.mode === 'play' && (bs.goal?.path.length || [...bs.keys].some(k => 'UDLR'.includes(k)));
  let rows = [...(dy < 0 ? BS_CHEF.up : dx ? BS_CHEF.side : BS_CHEF.down), ...(moving ? legs : BS_LEGS[0])];
  if (dx < 0) rows = rows.map(r => [...r].reverse().join(''));
  g.fillStyle = 'rgba(40,20,8,.3)'; g.fillRect(x + 2, y + 13, 8, 2); g.fillRect(x + 3, y + 12, 6, 4);
  if (bs.hand && dy < 0) bsItem(g, bs.hand, x + 6, y + 9);
  sprite(g, rows, x, y, BS_CPAL);
  if (bs.chop) { const up = bs.tick % 10 < 5; px(g, '#d8dce8', x + 6 + dx * 6 + (dx ? 0 : 3), y + (up ? 5 : 8) + dy * 4, 1, 3); }
  if (bs.hand && dy >= 0) bsItem(g, bs.hand, x + 6 + dx * 7, y + 15 - (dx ? 3 : 0));
}
const bsClock = t => { const s = Math.ceil(Math.max(0, BS.TIME - t) / 60); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
const BS_STAR = ['...k...', '..kyk..', 'kkkyykk', 'kyyyyyk', '.kyyyk.', '.kykyk.', 'kk...kk'];
function bsStars(g, n, x, y) { for (let i = 0; i < 3; i++) BS_STAR.forEach((r, j) => [...r].forEach((c, k) => { const col = (i < n ? {k: '#1a1008', y: '#ffd84a'} : {k: '#5a5068', y: '#3a3046'})[c]; if (col) px(g, col, x + i * 18 + k * 2, y + j * 2, 2, 2); })); }
function bsDraw() {
  const g = bs.g, {W, H, TOP} = BS;
  for (; bs.seen < bs.tick; bs.seen++) if (bs.mode === 'over') bs.dead++;
  g.imageSmoothingEnabled = false;
  const crow = Math.floor(bs.y / 12), front = bs.mode === 'play' ? bsFront() : -1;
  for (let cy = 0; cy < BS.ROWS; cy++) { for (let cx = 0; cx < BS.COLS; cx++) bsTile(g, cx, cy); if (cy === crow) bsChef(g); }
  if (front >= 0) { const fx = front % BS.COLS * 12, fy = TOP + Math.floor(front / BS.COLS) * 12, c = '#ffffff'; for (const [a, b] of [[0, 0], [10, 0], [0, 9], [10, 9]]) { px(g, c, fx + a, fy + b, 2, 1); px(g, c, fx + a + (a ? 1 : 0), fy + b + (b ? -1 : 0), 1, 2); } }
  for (const f of bs.fx) { if (f.txt) pxFont(g, f.txt, f.x, TOP + f.y - (60 - f.t) * .3, f.c, 8, 'center'); else px(g, f.c, f.x, TOP + f.y - (30 - f.t) * .4, 2, 2); }
  // les tickets de commande, le temps et le score
  px(g, '#2a1810', 0, 0, W, TOP); for (let x = 0; x < W; x += 8) px(g, '#33200f', x, 0, 4, TOP - 1); px(g, '#1a1008', 0, TOP - 1, W, 1); px(g, '#8a8e9c', 0, 0, W, 1); px(g, '#4a4e5a', 0, 1, W, 1);
  bs.orders.forEach((o, i) => {
    const x = 2 + i * 44, y = 1 - (o.born || 0), R = BS_REC[o.r], f = o.left / o.tot, late = f < .25 && bs.tick % 20 < 10;
    px(g, 'rgba(0,0,0,.35)', x + 1, y + 1, 42, 16); px(g, late ? '#ffd0c0' : '#f4ecd8', x, y, 42, 16); px(g, '#fffaf0', x, y, 42, 1); px(g, '#c8b898', x, y + 15, 42, 1); px(g, '#5a5e6a', x + 19, y - 1, 4, 2); px(g, '#a8acb8', x + 19, y - 1, 4, 1);
    sprite(g, BS_DISH[o.r], x + 2, y + 2, BS_PAL);
    const parts = R.parts[0].startsWith('soupe') ? Array(3).fill(R.parts[0] === 'soupeT' ? 'tomate' : 'oignon') : R.parts;
    parts.forEach((p, j) => bsIcon(g, p, x + 13 + j * 9, y + 2));
    px(g, '#3a2a1a', x + 2, y + 12, 38, 2); px(g, f > .5 ? '#5ac83a' : f > .25 ? '#f8c830' : '#e83a2a', x + 2, y + 12, Math.ceil(38 * f), 2);
  });
  pxFont(g, bsClock(bs.t), W - 3, 8, bs.t > BS.TIME - 30 * 60 && bs.tick % 30 < 15 ? '#ff6a5a' : '#ffffff', 8, 'right');
  pxFont(g, String(bs.score), W - 3, 16, '#ffd84a', 8, 'right');
  if (bs.msg) { px(g, 'rgba(14,10,20,.8)', 0, H - 12, W, 12); pxFont(g, bs.msg.txt, W / 2, H - 3, '#ffffff', 8, 'center'); }
  if (bs.mode === 'ready') { const gl = bsGoals[bs.li];
    gameText(g, W, [[(bs.li + 1) + '. ' + bs.L.name.toUpperCase(), '#ffd84a', 12], [bs.L.rec.map(r => BS_REC[r].name).join(' · '), '#ffffff'], ['Espace : prendre / poser · E : hacher', '#b8d0ff'],
      [gl ? 'Étoiles : ' + gl.join(' · ') + ' points' : '', '#ffd84a'], ['← → : cuisine · Espace : commencer', '#b8b0c8']], 50); }
  if (bs.mode === 'play' && bs.count < 120) pxFont(g, bs.count < 70 ? 'PRÊTS ?' : 'SERVICE !', W / 2, 84, bs.count < 70 ? '#ffd84a' : '#7ae05a', 16, 'center');
  if (bs.mode === 'pause') gameText(g, W, [['PAUSE', '#ffd84a', 12], ['Entrée : reprendre', '#b8b0c8']], 70);
  if (bs.mode === 'over' && bs.dead > 20) {
    gameText(g, W, [['SERVICE TERMINÉ', '#ffd84a', 12], [bs.score + ' points' + (bs.record ? ' · RECORD !' : ''), '#ffffff'], ['', ''], [bs.served + ' plats servis · ' + bs.failed + ' ratés', '#b8d0ff'], [bs.dead > 50 ? 'Espace : rejouer · ← → : cuisine' : '', '#b8b0c8']], 50);
    bsStars(g, bs.stars, W / 2 - 25, 71);
  }
  if (bs.tick % 15 === 0) g.canvas.setAttribute('aria-label', 'Bistrot, cuisine ' + bs.L.name + ' : reste ' + bsClock(bs.t) + ', score ' + bs.score + ', ' + bs.served + ' plats servis, commandes : ' + (bs.orders.map(o => BS_REC[o.r].name).join(', ') || 'aucune') +
    ', en main : ' + (bs.hand ? (bs.hand.t === 'assiette' ? 'assiette' + (bs.hand.parts.length ? ' (' + bs.hand.parts.join(', ') + ')' : ' vide') : bs.hand.t + (bs.hand.s && bs.hand.s !== 'cru' ? ' ' + bs.hand.s : '')) : 'rien') + (bs.mode === 'over' ? ', fini, ' + bs.stars + ' étoiles' : '') + '.');
}
function bsInfo() {
  const li = bs ? bs.li : bss.level, gl = bsGoals[li];
  $('bsStats').replaceChildren(...[['Cuisine', (li + 1) + '. ' + BS_LEVELS[li].name], ['Meilleur score', bss.best[li] ?? '--'], ['Étoiles', (bss.stars[li] || 0) + ' / 3'], ['Pour 3 étoiles', gl ? gl[2] : '--'],
    ['Plats servis', bss.served], ['Étoiles en tout', Object.values(bss.stars).reduce((a, b) => a + b, 0) + ' / ' + BS_LEVELS.length * 3]].flatMap(([a, c]) => [el('span', '', a), el('b', '', String(c))]));
}
const BS_KEYS = {ArrowUp: 'U', z: 'U', w: 'U', ArrowDown: 'D', s: 'D', ArrowLeft: 'L', q: 'L', a: 'L', ArrowRight: 'R', d: 'R', e: 'E', E: 'E', Control: 'E'};
function bsPick(dir) { let li = bs.li; do li = (li + dir + BS_LEVELS.length) % BS_LEVELS.length; while (!bsUnlocked(li)); bss.level = li; saveGames(); bsNew(li); }
function bsStart() { if (bs.mode === 'over') bsNew(bs.li); bs.mode = 'play'; }
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !bs || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  const k = e.key;
  if (bs.mode === 'over' || bs.mode === 'ready') {
    const ok = bs.mode === 'ready' || bs.dead > 50;
    if ((k === 'ArrowLeft' || k === 'ArrowRight') && ok) { e.preventDefault(); bsPick(k === 'ArrowLeft' ? -1 : 1); return; }
    if ((k === ' ' || k === 'Enter') && ok) { e.preventDefault(); bsStart(); }
    return;
  }
  if (k === 'p' || k === 'P' || k === 'Escape') { bs.mode = bs.mode === 'play' ? 'pause' : 'play'; return; }
  if (k === 'Enter' && bs.mode === 'pause') { bs.mode = 'play'; return; }
  if (bs.mode !== 'play') return;
  if (k === ' ') { e.preventDefault(); if (!e.repeat && bs.count >= 120) { bs.goal = null; bsUse(); } return; }
  if (BS_KEYS[k]) { e.preventDefault(); bs.keys.add(BS_KEYS[k]); if (BS_KEYS[k] !== 'E') bs.goal = null; }
});
document.addEventListener('keyup', e => { if (bs && BS_KEYS[e.key]) bs.keys.delete(BS_KEYS[e.key]); });
{ const cv = $('bsCanvas');  // à la souris ou au doigt : un clic sur une case y emmène le cuisinier, qui prend, pose ou hache
  cv.onpointerdown = e => {
    e.preventDefault(); if (!bs) return;
    if (bs.mode === 'ready' || (bs.mode === 'over' && bs.dead > 50)) return bsStart();
    if (bs.mode !== 'play' || bs.count < 120) return;
    const r = cv.getBoundingClientRect(), cx = Math.floor((e.clientX - r.left) / r.width * BS.W / 12), cy = Math.floor(((e.clientY - r.top) / r.height * BS.H - BS.TOP) / 12);
    if (!bsIn(cx, cy)) return;
    if (bsFloor(cx, cy)) { const path = bsPath((x, y) => x === cx && y === cy); if (path) bs.goal = {k: -1, path}; return; }
    const it = bs.items.get(bsKey(cx, cy)), act = bsCh(cx, cy) === 'C' && it && it.s === 'cru' && BS_CHOP.includes(it.t) && !bs.hand ? 'chop' : 'use';
    bsGoTo(k => k === bsKey(cx, cy), act);
  }; }
$('bsNew').onclick = () => { bsNew(bs?.li ?? bss.level); $('bsNew').blur(); };
// le cuisinier automatique : prend la plus vieille commande et la prépare de bout en bout, sans rien faire en même temps
function* bsGo(pred, act) { if (!bsGoTo(pred, act)) { yield; return false; } while (bs.goal) yield; return true; }
function* bsBotRun() {
  for (;;) {
    if (bs.hand) { if (bs.hand.t === 'assiette' && !bs.hand.parts.length) yield* bsGo(k => bsCk(k) === 'A', 'use'); else yield* bsGo(k => bsCk(k) === 'D', 'use'); continue; }
    const o = bs.orders[0]; if (!o) { yield; continue; }
    yield* bsBotMake(o.r);
  }
}
function* bsBotMake(r) {
  const parts = BS_REC[r].parts, free = c => k => bsCk(k) === c && !bs.items.has(k);
  const prep = function* (t) {  // va chercher l'ingrédient, le pose sur une planche libre, le hache et le reprend
    yield* bsGo(k => BS_CRATE[bsCk(k)] === t && !bs.items.has(k), 'use');
    if (!(yield* bsGo(free('C'), 'use'))) return;
    const b = bs.lastK; yield* bsGo(k => k === b, 'chop'); yield* bsGo(k => k === b, 'use');
  };
  if (parts[0].startsWith('soupe')) {
    const t = parts[0] === 'soupeT' ? 'tomate' : 'oignon', pots = [...bs.items.keys()].filter(k => bsCk(k) === 'M');
    const burnt = pots.find(k => bs.items.get(k).k >= BS.SOUP + BS.SBURN); if (burnt !== undefined) { yield* bsGo(k => k === burnt, 'use'); return; }
    const pot = pots.find(k => bs.items.get(k).parts[0] === t && (bs.items.get(k).parts.length < 3 || bs.items.get(k).k < BS.SOUP + BS.SBURN)) ?? pots.find(k => !bs.items.get(k).parts.length);
    if (pot === undefined) { yield; return; }
    while (bs.items.get(pot).parts.length < 3) { yield* prep(t); yield* bsGo(k => k === pot, 'use'); if (bs.hand) return; }
    while (!bs.plates) yield;
    yield* bsGo(k => bsCk(k) === 'A', 'use');
    while (bs.items.get(pot).k < BS.SOUP) yield;
    yield* bsGo(k => k === pot, 'use'); yield* bsGo(k => bsCk(k) === 'X', 'use'); return;
  }
  while (!bs.plates) yield;
  yield* bsGo(k => bsCk(k) === 'A', 'use');
  yield* bsGo(free('#'), 'use'); const pl = bs.lastK;
  for (const t of parts) {
    if (t === 'pain') { yield* bsGo(k => BS_CRATE[bsCk(k)] === 'pain', 'use'); yield* bsGo(k => k === pl, 'use'); continue; }
    yield* prep(t);
    if (t === 'viande') { yield* bsGo(free('S'), 'use'); const st = bs.lastK; while (bs.items.get(st)?.s === 'hache') yield; yield* bsGo(k => k === st, 'use'); }
    yield* bsGo(k => k === pl, 'use');
  }
  yield* bsGo(k => k === pl, 'use'); yield* bsGo(k => bsCk(k) === 'X', 'use');
}
{  // vérification : chaque cuisine est bien dessinée et le cuisinier automatique y sert des plats (son score fixe les étoiles) ;
   // les règles de l'assiette, de la poêle et de la marmite
  const bad = [], keep = bs, keepS = JSON.stringify(bss);
  bsMute = true;
  for (let li = 0; li < BS_LEVELS.length; li++) {
    const L = BS_LEVELS[li];
    if (L.map.length !== BS.ROWS || L.map.some(r => r.length !== BS.COLS)) { bad.push(L.name + ' : plan'); continue; }
    bs = null; bsNew(li); bs.mode = 'play'; bs.count = 120; bs.bot = bsBotRun();
    while (bs.mode === 'play') bsUpdate();
    if (bs.served < 4) bad.push(L.name + ' : ' + bs.served + ' plats');
    bsGoals[li] = [.4, .7, .95].map(f => Math.max(10, Math.round(bs.score * f / 10) * 10));
  }
  bs = null; bsNew(1); bs.mode = 'play'; bs.count = 120;
  const plate = {t: 'assiette', parts: []};
  if (bsAdd(plate, {t: 'tomate', s: 'cru'})) bad.push('tomate crue dans l’assiette');
  if (!bsAdd(plate, {t: 'tomate', s: 'hache'}) || bsAdd(plate, {t: 'pain', s: 'cru'}) || bsAdd(plate, {t: 'viande', s: 'brule'})) bad.push('assiette mal dressée');
  bs.x = 12 * 12 + 6; bs.y = 1 * 12 + 6; bs.dir = [0, -1]; bs.hand = {t: 'viande', s: 'cru', c: 0, k: 0}; bsUse();
  if (bs.items.size) bad.push('steak cru sur le feu');
  bs.hand.s = 'hache'; bsUse(); for (let i = 0; i < BS.COOK + 5; i++) bsUpdate();
  if (bs.items.get(bsKey(12, 0))?.s !== 'cuit') bad.push('le steak ne cuit pas');
  for (let i = 0; i < BS.BURN; i++) bsUpdate();
  if (bs.items.get(bsKey(12, 0))?.s !== 'brule') bad.push('le steak ne brûle pas');
  console.assert(!bad.length, 'bistrot', bad);
  Object.assign(bss, JSON.parse(keepS)); for (const k of Object.keys(bss)) if (!(k in JSON.parse(keepS))) delete bss[k];
  bs = keep; bsMute = false;
}
ctx.onOpen(() => {
  if (!bs || !bs.g) { bsNew(bsUnlocked(bss.level) ? bss.level : 0); bs.g = $('bsCanvas').getContext('2d'); }
  gameLoop(bs, 'bistrot', bsUpdate, bsDraw); bsInfo();
});
}
