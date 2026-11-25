// Bistrot : jeu de cuisine vu de dessus : hacher, cuire, dresser et envoyer les commandes à temps.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Bistrot</span><span class="hint">flèches : se déplacer · Espace : prendre / poser · E : hacher · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="bsCanvas" width="576" height="300" role="img" aria-label="Bistrot"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="bsStats"></div></div>
      <div class="row"><button class="btn main" id="bsNew">NOUVELLE PARTIE</button></div>
      <div class="hint">Les clients attendent dans la salle, à droite ; leurs tickets sont en haut. Prends les ingrédients dans les caisses, hache-les sur la planche (maintiens E), cuis le steak à la poêle, les frites à la friteuse, la pizza garnie au four et la soupe à la marmite, dresse l'assiette et pose-la sur le passe. Les jauges disent où en est la cuisson ; « !! » : ça va brûler. Deux cuisines bougent : un tapis roulant coupe la première en deux et porte ce que tu poses de l'autre côté ; sur le bateau, tout tangue et te pousse. Servir vite rapporte un pourboire, servir à la suite un combo ; les clients pressés paient plus. Une étoile ouvre la cuisine suivante. À la souris : clique sur une case pour y aller.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:1 1 0;min-width:300px;position:relative}
.gameBox canvas{width:min(100%,max(300px,calc((100vh - 210px) * 576 / 300)));height:auto;aspect-ratio:576/300;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:0 1 300px;min-width:230px;max-width:360px}
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
  // les trophées de NeoDex (3.4.8 et plus) : succès et records déclarés dans plugin.json ; sur un NeoDex plus ancien, rien ne se passe
  const trophy = id => { ctx.games?.unlock(id).catch(() => {}); };
  const trophyRecord = (id, v) => { if (v != null && Number.isFinite(+v)) ctx.games?.record(id, +v).catch(() => {}); };
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

/* ---------- Bistrot : une cuisine vue de dessus, la salle des clients à droite. Les commandes arrivent ; prends les ingrédients, hache, cuis, dresse l'assiette
   et envoie-la au passe avant que le client s'impatiente. Neuf cuisines, trois minutes de service chacune, jusqu'à trois étoiles ---------- */
// le jeu se calcule en cases de 12 (bs.x, bs.y) et se dessine en cases de 24 pixels ; la salle occupe les 96 pixels de droite
const BS = {W: 576, H: 300, TOP: 36, T: 24, COLS: 20, ROWS: 11, TIME: 180 * 60, CHOP: 80, SOUP: 420, SBURN: 540, PLATES: 4, BACK: 360, SPD: 1.3};
const BS_COOKS = {S: {t: 'viande', cook: 300, burn: 420}, U: {t: 'patate', cook: 240, burn: 420}, Z: {t: 'pate', cook: 360, burn: 480}};  // poêle, friteuse, four
// une nouvelle partie garde le même objet : la boucle du jeu (gameLoop) continue de tourner dessus
const renew = (old, o) => { if (!old) return o; for (const k of Object.keys(old)) if (k !== 'raf') delete old[k]; return Object.assign(old, o); };
const bss = gstore('bistrot', {best: {}, stars: {}, served: 0, games: 0, level: 0}); bss.tips ??= 0;
let bs = null, bsac = null, bsMute = false;
function bsBeep(f, d, type = 'square', slide = 0, vol = .03) { if (bsMute) return; try { bsac ??= new AudioContext(); const o = bsac.createOscillator(), g = bsac.createGain(), t = bsac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(bsac.destination); o.start(t); o.stop(t + d + .02); } catch {} }
// les plats : ce qu'il y a dans l'assiette (rangé par ordre alphabétique), les points, et le temps du ticket en secondes
const BS_REC = {
  salade: {name: 'Salade', parts: ['salade'], pts: 20, time: 60},
  saltom: {name: 'Salade tomate', parts: ['salade', 'tomate'], pts: 30, time: 70},
  burger: {name: 'Burger', parts: ['pain', 'viande'], pts: 40, time: 80},
  cheese: {name: 'Cheeseburger', parts: ['fromage', 'pain', 'viande'], pts: 50, time: 95},
  soupeT: {name: 'Soupe de tomates', parts: ['soupeT'], pts: 40, time: 90},
  soupeO: {name: "Soupe à l'oignon", parts: ['soupeO'], pts: 40, time: 90},
  frites: {name: 'Frites', parts: ['frites'], pts: 30, time: 70},
  menu: {name: 'Burger frites', parts: ['frites', 'pain', 'viande'], pts: 60, time: 110},
  pizza: {name: 'Pizza', parts: ['pizza'], pts: 60, time: 120},
  dessert: {name: 'Coupe de fraises', parts: ['creme', 'fraise'], pts: 30, time: 70},
};
const BS_ALL = Object.values(BS_REC).map(r => r.parts);
const BS_CRATE = {T: 'tomate', L: 'salade', P: 'pain', V: 'viande', F: 'fromage', O: 'oignon', K: 'patate', E: 'pate', B: 'fraise', Q: 'creme'};
const BS_CHOP = ['tomate', 'salade', 'fromage', 'oignon', 'viande', 'patate', 'fraise'];
// les cuisines : . sol, W mur, # plan de travail, lettres = caisses, C planche, S poêle, U friteuse, Z four, M marmite, A assiettes, X passe (toujours à droite, vers la salle),
// D poubelle, H porte battante (elle s'ouvre et se ferme toute seule ; un passage reste toujours libre à côté), > < v ^ tapis roulant (il porte ce qu'on y pose), > < v ^ tapis roulant (il porte ce qu'on y pose)
const BS_LEVELS = [
  {name: 'Le comptoir', rec: ['salade', 'saltom'], gap: 1380, map: [
    'WWWWWW##L#T#C#C#####', 'WWWWWW#............#', 'WWWWWW#............#', 'WWWWWWA...####.....#', 'WWWWWW#...####.....X', 'WWWWWW#............X',
    'WWWWWW#...####.....#', 'WWWWWW#...####.....#', 'WWWWWW#............#', 'WWWWWW#............#', 'WWWWWW######D#######']},
  {name: 'Burgers', rec: ['burger', 'salade'], gap: 1380, map: [
    'WWWWWW##P#V#L#C#C###', 'WWWWWW#............#', 'WWWWWWS............#', 'WWWWWWS...##.##....#', 'WWWWWW#...#...#....X', 'WWWWWW#...#...#....X',
    'WWWWWWA...##.##....#', 'WWWWWW#............#', 'WWWWWW#............#', 'WWWWWW#............#', 'WWWWWW####D#########']},
  {name: 'Soupes', rec: ['soupeT', 'soupeO'], gap: 1320, map: [
    'WWWWWW##T#O##C#C####', 'WWWWWWM............#', 'WWWWWWM............#', 'WWWWWW#...######...#', 'WWWWWWA............X', 'WWWWWW#............X',
    'WWWWWW#...######...#', 'WWWWWWM............#', 'WWWWWW#............#', 'WWWWWW#............#', 'WWWWWW#####D########']},
  {name: 'Friterie', rec: ['frites', 'menu', 'burger'], gap: 1320, map: [
    'WWWWWW##K#P#V#C#C###', 'WWWWWWU............#', 'WWWWWWU............#', 'WWWWWW#...##..##...#', 'WWWWWWS...#....#...X', 'WWWWWWS...#....#...X',
    'WWWWWW#...##..##...#', 'WWWWWWA............#', 'WWWWWW#............#', 'WWWWWW#............#', 'WWWWWW#####D########']},
  {name: 'Fromagerie', rec: ['burger', 'cheese', 'saltom'], gap: 1260, map: [
    'WWWWW#P#V#F#L#T#C#C#', 'WWWWWS.......#.....#', 'WWWWWS.......#.....#', 'WWWWW#.......H.....#', 'WWWWW#.......#.....X', 'WWWWW#.............X',
    'WWWWW#.......#.....#', 'WWWWWA.......H.....#', 'WWWWW#.......#.....#', 'WWWWW#.......#.....#', 'WWWWW#####D#########']},
  {name: 'Pizzeria', rec: ['pizza', 'saltom'], gap: 1320, map: [
    'WWWWWW##E#T#F#L#C#C#', 'WWWWWWZ............#', 'WWWWWWZ............#', 'WWWWWW#...######...#', 'WWWWWWA............X', 'WWWWWW#............X',
    'WWWWWW#...######...#', 'WWWWWW#............#', 'WWWWWW#............#', 'WWWWWW#............#', 'WWWWWW#####D########']},
  {name: 'Salon de thé', rec: ['dessert', 'salade', 'soupeO'], gap: 1260, map: [
    'WWWWWW##B#Q#L#O#C#C#', 'WWWWWWM............#', 'WWWWWWM............#', 'WWWWWW#...##..##...#', 'WWWWWWA...#....#...X', 'WWWWWW#...#....#...X',
    'WWWWWW#...##..##...#', 'WWWWWW#............#', 'WWWWWW#............#', 'WWWWWW#............#', 'WWWWWW#####D########']},
  {name: 'Grand service', rec: ['saltom', 'cheese', 'soupeO', 'menu', 'pizza', 'dessert'], gap: 1200, map: [
    '#TL#PV#FO#KE#BQ#####', '#..................#', 'C..................#', 'C...####....####...#', 'S..................X', 'U..................X',
    'Z...####....####...#', 'M..................#', 'M..................#', 'A..................#', '#########D##########']},
  {name: 'Coup de feu', rec: ['burger', 'cheese', 'pizza', 'frites'], gap: 1080, rush: true, map: [
    '#T#P#V#FK##E#C#C#C##', 'S........#.........#', 'S........#.........#', 'U........H.........#', 'U........#.........X', 'Z..................X',
    'Z........#.........#', '#........H.........#', '#........#.........#', 'A........#.........#', '####D###############']},
  // le tapis roulant : un mur coupe la cuisine en deux (ingrédients à gauche, feux et passe à droite) ; le tapis porte ce qu'on y pose, le tour par le bas est long
  {name: 'Tapis roulant', rec: ['burger', 'cheese', 'frites'], gap: 1320, tip: 'le tapis porte ce que tu poses de l’autre côté du mur', map: [
    '#P#V#F#K#CC##SS#UU##', '#...........#......#', '#...........#......#', '#.........>>>>.....#', '#...........#......X', '#...........#......X',
    '#...........#......#', '#.........<<<<.....#', '#...........#......#', '#..................A', '####D###########D###']},
  // le bateau : la cuisine tangue d'un bord à l'autre et pousse le cuisinier
  {name: 'Le bateau', rec: ['saltom', 'soupeO', 'dessert'], gap: 1260, boat: true, tip: 'ça tangue : la houle te pousse d’un bord à l’autre', map: [
    'WWWWWW##L#T#O#B#QCC#', 'WWWWWWM............#', 'WWWWWWM............#', 'WWWWWW#...##..##...#', 'WWWWWWA...#....#...X', 'WWWWWW#...#....#...X',
    'WWWWWW#...##..##...#', 'WWWWWWM............#', 'WWWWWW#............#', 'WWWWWW#............#', 'WWWWWW#####D########']},
];
const BS_BELT = {'>': [1, 0], '<': [-1, 0], v: [0, 1], '^': [0, -1]};
function bsBelt() {  // chaque objet sur le tapis avance d'une case, si la suivante (tapis ou plan de travail) est libre
  const moved = new Set();
  for (let pass = 0, ch = true; ch && pass < 30; pass++) { ch = false;
    for (const [k, nk] of bs.belts) { const it = bs.items.get(k), c = bsCk(nk); if (!it || moved.has(it) || bs.items.has(nk) || (c !== '#' && !BS_BELT[c])) continue; bs.items.set(nk, it); bs.items.delete(k); moved.add(it); ch = true; } }
}
const bsGoals = [];  // les seuils des trois étoiles de chaque cuisine, fixés par le cuisinier automatique (vérification plus bas)
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const bsKey = (cx, cy) => cy * BS.COLS + cx;
const bsIn = (cx, cy) => cx >= 0 && cy >= 0 && cx < BS.COLS && cy < BS.ROWS;
const bsCh = (cx, cy) => bsIn(cx, cy) ? bs.grid[cy][cx] : '#';
const bsCk = k => bs.grid[Math.floor(k / BS.COLS)][k % BS.COLS];
const bsFloor = (cx, cy) => { const c = bsCh(cx, cy); return c === '.' || (c === 'H' && bs.doorOpen); };
const bsUnlocked = li => li === 0 || (bss.stars[li - 1] || 0) >= 1;
// ce qu'un ingrédient apporte à l'assiette, une fois prêt : haché, cuit (steak, frites, pizza), ou tel quel (pain, crème)
const bsPart = it => ({pain: 'pain', creme: 'creme'})[it.t] || (it.s === 'cuit' ? ({viande: 'viande', patate: 'frites', pate: 'pizza'})[it.t] : null) || (['salade', 'tomate', 'fromage', 'fraise'].includes(it.t) && it.s === 'hache' ? it.t : null);
const bsSub = (a, b) => { const c = b.slice(); return a.every(x => { const i = c.indexOf(x); if (i < 0) return false; c.splice(i, 1); return true; }); };
function bsAdd(plate, it) {  // n'accepte que ce qui mène à un plat de la carte
  if (it.t === 'assiette' || plate.parts.some(x => x.startsWith('soupe'))) return false;
  const p = bsPart(it); if (!p) return false;
  const np = [...plate.parts, p].sort(); if (!BS_ALL.some(r => bsSub(np, r))) return false;
  plate.parts = np; return true;
}
// la pâte à pizza se garnit de tomate et de fromage hachés, puis va au four
function bsTop(p, x) { if (p.s !== 'cru' || !['tomate', 'fromage'].includes(x.t) || x.s !== 'hache' || p.parts.includes(x.t)) return false; p.parts = [...p.parts, x.t].sort(); return true; }
function bsNew(li = bss.level) {
  const g = bs?.g, L = BS_LEVELS[li], items = new Map();
  L.map.forEach((r, y) => [...r].forEach((c, x) => { if (c === 'M') items.set(bsKey(x, y), {t: 'marmite', parts: [], k: 0}); }));
  bs = renew(bs, {g, mode: 'ready', tick: 0, seen: 0, li, L, grid: L.map.map(r => [...r]), items, x: 9 * 12 + 6, y: 5 * 12 + 6, dir: [0, 1], walk: 0, hand: null, keys: new Set(),
    t: 0, count: 0, score: 0, served: 0, failed: 0, orders: [], clients: [], next: 30, rng: seeded(li * 97 + 5), plates: BS.PLATES, back: [], fx: [], msg: null, goal: null, lastK: -1, chop: false,
    dead: 0, stars: 0, record: false, bot: null, doorOpen: true, combo: 0, bestCombo: 0, lastServe: -1e9, tips: 0, rushT: 0, banner: null, belts: [], tilt: 0, tilting: 0});
  L.map.forEach((r, y) => [...r].forEach((c, x) => { const d = BS_BELT[c]; if (d) bs.belts.push([bsKey(x, y), bsKey(x + d[0], y + d[1])]); }));
  bsInfo();
}
const bsSay = txt => { bs.msg = {txt, t: 100}; };
function bsOrder() {
  const used = new Set(bs.clients.map(c => c.seat)), seat = [0, 1, 2, 3].find(s => !used.has(s));
  if (seat === undefined) { bs.next = 60; return; }  // toutes les tables sont prises : le prochain client attend
  const L = bs.L, r = L.rec[Math.floor(bs.rng() * L.rec.length)], hurry = bs.t > 30 * 60 && bs.rng() < .22, tot = Math.round(BS_REC[r].time * 60 * (hurry ? .65 : 1));
  bs.orders.push({r, left: tot, tot, born: 20, hurry, seat});
  bs.clients.push({seat, look: Math.floor(bs.rng() * 6), st: 'wait', t: 0, r, hurry});
  bsBeep(990, .08, 'triangle', 1320, .02);
}
function bsServe(h) {
  const key = h.parts.join(','), i = bs.orders.findIndex(o => BS_REC[o.r].parts.join(',') === key);
  if (i < 0) { bsSay('Pas commandé'); bsBeep(160, .15); return false; }
  const o = bs.orders.splice(i, 1)[0], f = o.left / o.tot, base = Math.round(BS_REC[o.r].pts * (o.hurry ? 1.5 : 1)), tip = f > .6 ? 15 : f > .35 ? 8 : 0;
  bs.combo = bs.t - bs.lastServe < 25 * 60 ? bs.combo + 1 : 1; bs.lastServe = bs.t; bs.bestCombo = Math.max(bs.bestCombo, bs.combo);
  const cb = Math.min(20, 5 * (bs.combo - 1)), pts = base + tip + cb;
  bs.score += pts; bs.served++; bs.tips += tip; bs.back.push(BS.BACK);
  const c = bs.clients.find(c => c.seat === o.seat); if (c) Object.assign(c, {st: 'eat', t: 200});
  bs.fx.push({x: bs.x, y: bs.y - 14, t: 70, txt: '+' + pts, c: '#ffd84a'});
  if (tip) bs.fx.push({x: 228, y: -10, t: 80, txt: 'POURBOIRE +' + tip, c: '#7ae05a', hud: 1});
  if (cb) bs.fx.push({x: 228, y: 4, t: 80, txt: 'COMBO ×' + bs.combo + ' +' + cb, c: '#ff9a3a', hud: 1});
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
  if (ch === 'W' || ch === 'H') return;
  if (ch === 'M') return bsPot(tc);
  if (!h) {
    if (it) { bs.hand = it; bs.items.delete(tc); bsBeep(520, .04); return; }
    if (BS_CRATE[ch]) { bs.hand = {t: BS_CRATE[ch], s: 'cru', c: 0, k: 0, parts: []}; bsBeep(520, .04); return; }
    if (ch === 'A') { if (bs.plates > 0) { bs.plates--; bs.hand = {t: 'assiette', parts: []}; bsBeep(700, .04); } else bsSay('Plus d’assiette : elles reviennent du passe'); }
    return;
  }
  if (ch === 'D') { if (h.t === 'assiette') h.parts = []; else bs.hand = null; bsBeep(140, .1, 'square', 90); return; }
  if (ch === 'X') { if (h.t !== 'assiette' || !h.parts.length) bsSay('Le passe veut une assiette dressée'); else if (bsServe(h)) bs.hand = null; return; }
  if (ch === 'A') { if (h.t === 'assiette' && !h.parts.length) { bs.plates++; bs.hand = null; } return; }
  if (it) {  // dresser : l'ingrédient va sur l'assiette (ou sur la pâte), ou l'assiette ramasse l'ingrédient
    if (it.t === 'pate' && bsTop(it, h)) { bs.hand = null; bsBeep(600, .05, 'triangle'); }
    else if (h.t === 'pate' && bsTop(h, it)) { bs.items.delete(tc); bsBeep(600, .05, 'triangle'); }
    else if (it.t === 'assiette' && bsAdd(it, h)) { bs.hand = null; bsBeep(600, .05, 'triangle'); }
    else if (h.t === 'assiette' && bsAdd(h, it)) { bs.items.delete(tc); bsBeep(600, .05, 'triangle'); }
    else if (it.t === 'assiette' || h.t === 'assiette') bsSay(bsPart(it.t === 'assiette' ? h : it) ? 'Ça ne va pas ensemble' : 'Pas encore prêt');
    return;
  }
  const ck = BS_COOKS[ch];
  if (ck) {
    const ok = h.t === ck.t && (h.t === 'pate' ? h.parts.length === 2 : h.s !== 'cru');
    if (!ok) bsSay(h.t !== ck.t ? {S: 'La poêle, c’est pour la viande', U: 'La friteuse, c’est pour les pommes de terre', Z: 'Le four, c’est pour la pizza'}[ch] : h.t === 'pate' ? 'Garnis-la : tomate et fromage hachés' : 'Hache-la d’abord');
    else { bs.items.set(tc, h); bs.hand = null; bsBeep(200, .1, 'sawtooth', 160, .02); }
    return;
  }
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
  // les portes battantes : six secondes ouvertes, six fermées, jamais sur le cuisinier
  const want = Math.floor(bs.t / 360) % 2 === 0, onDoor = bs.grid[Math.floor(bs.y / 12)][Math.floor(bs.x / 12)] === 'H';
  if (bs.doorOpen !== want && (want || !onDoor)) { bs.doorOpen = want; if (bs.grid.some(r => r.includes('H'))) bsBeep(want ? 500 : 300, .06, 'triangle', want ? 700 : 200, .02); }
  // le coup de feu : à 1 et 2 minutes, les commandes arrivent deux fois plus vite pendant 20 secondes
  if (L.rush && (bs.t === 60 * 60 || bs.t === 120 * 60)) { bs.rushT = 20 * 60; bs.banner = {txt: 'COUP DE FEU !', t: 120}; bs.next = Math.min(bs.next, 30); bsBeep(440, .3, 'sawtooth', 880, .03); }
  if (bs.rushT > 0) bs.rushT--;
  if (L.boat) {  // la houle : quand le bateau penche fort, le cuisinier glisse vers le bas du pont
    const ph = bs.tilt = Math.sin(bs.t / 150);
    if (Math.abs(ph) > .55) { if (!bs.tilting) { bs.tilting = 1; bsSay('Ça tangue ! Tiens-toi'); bsBeep(160, .5, 'sine', 110, .03); } bsMove(ph * .5, 0); } else bs.tilting = 0;
  }
  if (bs.belts.length && bs.t % 24 === 0) bsBelt();
  if (!bs.orders.length) bs.next = Math.min(bs.next, 90);
  if (--bs.next <= 0) { bs.next = bs.rushT > 0 ? L.gap >> 1 : L.gap; if (bs.orders.length < 4) bsOrder(); }
  for (const o of bs.orders) { if (o.born) o.born--; if (--o.left <= 0) {
    o.gone = 1; bs.score = Math.max(0, bs.score - 10); bs.failed++; bs.combo = 0;
    const c = bs.clients.find(c => c.seat === o.seat); if (c) Object.assign(c, {st: 'angry', t: 100});
    bs.fx.push({x: bs.x, y: bs.y - 14, t: 60, txt: '-10', c: '#ff6a5a'}); bsBeep(180, .3, 'sawtooth', 90);
  } }
  bs.orders = bs.orders.filter(o => !o.gone);
  for (const c of bs.clients) if (c.st !== 'wait') c.t--; bs.clients = bs.clients.filter(c => c.st === 'wait' || c.t > 0);
  bs.back = bs.back.map(t => t - 1); if (bs.back.some(t => t <= 0)) { bs.plates += bs.back.filter(t => t <= 0).length; bs.back = bs.back.filter(t => t > 0); bsBeep(900, .04, 'triangle', 0, .015); }
  bs.chop = false;
  if (bs.bot) bs.bot.next();
  if (bs.goal) bsFollow();
  else {
    let mx = (K.has('R') ? 1 : 0) - (K.has('L') ? 1 : 0), my = (K.has('D') ? 1 : 0) - (K.has('U') ? 1 : 0);
    if (mx || my) { bs.dir = mx && (!my || Math.abs(mx) >= Math.abs(my) && !K.has('U') && !K.has('D')) ? [mx, 0] : [0, my]; const n = mx && my ? Math.SQRT1_2 : 1; if (bsMove(mx * BS.SPD * n, my * BS.SPD * n)) bs.walk++; }
    if (K.has('E')) bsChopStep();
  }
  // la cuisson : poêle, friteuse et four cuisent puis brûlent ; la marmite pleine cuit puis brûle la soupe
  for (const [k, it] of bs.items) {
    const ch = bsCk(k), ck = BS_COOKS[ch];
    if (ck && it.t === ck.t && (it.t === 'pate' || it.s !== 'cru')) {
      it.k++; it.s = it.k >= ck.cook + ck.burn ? 'brule' : it.k >= ck.cook ? 'cuit' : it.t === 'pate' ? 'cru' : 'hache';
      if (it.k === ck.cook) bsBeep(880, .1, 'triangle'); if (it.k === ck.cook + ck.burn) bsBeep(150, .4, 'sawtooth', 80);
      if (it.k % 9 === 0) bs.fx.push({x: (k % BS.COLS) * 12 + 4 + (it.k % 5), y: Math.floor(k / BS.COLS) * 12 - 2, t: 30, c: it.s === 'brule' ? '#3a3036' : '#e8e8f0'});
    }
    if (ch === 'M' && it.parts.length === 3) {
      it.k++;
      if (it.k === BS.SOUP) bsBeep(880, .1, 'triangle'); if (it.k === BS.SOUP + BS.SBURN) bsBeep(150, .4, 'sawtooth', 80);
      if (it.k % 11 === 0) bs.fx.push({x: (k % BS.COLS) * 12 + 3 + (it.k % 7), y: Math.floor(k / BS.COLS) * 12 - 2, t: 30, c: it.k >= BS.SOUP + BS.SBURN ? '#3a3036' : '#e8e8f0'});
    }
  }
  for (const f of bs.fx) f.t--; bs.fx = bs.fx.filter(f => f.t > 0);
  if (bs.msg && --bs.msg.t <= 0) bs.msg = null;
  if (bs.banner && --bs.banner.t <= 0) bs.banner = null;
  if (bs.t >= BS.TIME) bsEnd();
}
function bsEnd() {
  bs.mode = 'over'; bs.dead = 0; bs.goal = null; bs.keys.clear();
  const li = bs.li, gl = bsGoals[li] || [];
  bs.stars = gl.filter(v => bs.score >= v).length; bs.record = bs.score > (bss.best[li] || 0);
  if (bs.record) bss.best[li] = bs.score;
  bss.stars[li] = Math.max(bss.stars[li] || 0, bs.stars); bss.served += bs.served; bss.games++; bss.tips += bs.tips;
  saveGames(); bsInfo();
  [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => bsBeep(f, .14, 'triangle'), i * 110));
}
/* ---------- le dessin, en cases de 24 pixels : carrelage, murs garnis d'étagères, comptoirs en bois, inox des feux ; la salle des clients à droite ---------- */
const BS_PAL = {k: '#1a1008', w: '#ffffff', W: '#c8c8d8', r: '#e83a2a', R: '#ff8a6a', d: '#a01a1a', N: '#3a8a2a', n: '#2a6a2a', g: '#4aaa3a', G: '#9ae05a', y: '#d89a40', Y: '#f8d888',
  p: '#e87a8a', P: '#ffb0b8', b: '#7a4a2a', B: '#a86a3a', f: '#f8c830', F: '#fff0a0', o: '#c89010', v: '#b05ab0', V: '#e8c8e8', x: '#3a3036', X: '#5a5a68', m: '#8a8e9c', M: '#c8ccd8', c: '#d83a2a', C: '#ff7a5a',
  u: '#c8a060', U: '#e8c890', h: '#8a6a3a', q: '#f0e4cc', Q: '#fff8ec', j: '#c8b898'};
const BS_SPR = {  // les ingrédients entiers, 12 x 12
  tomate: ['....kNNk....', '..kkNggNkk..', '.krrRRrrrrk.', 'krRRwRrrrrdk', 'krRRRrrrrrdk', 'krrRrrrrrrdk', 'krrrrrrrrrdk', 'krrrrrrrrddk', '.krrrrrrddk.', '.kdrrrrdddk.', '..kkddddkk..', '....kkkk....'],
  salade: ['...kkkkkk...', '..kgGGgGgk..', '.kGgGGgGGgk.', 'kgGGgGGgGGgk', 'kGgGGgGgGgGk', 'kgGgGGgGGgnk', 'kGGgGgGGgnnk', 'kgGgGGgGgnnk', '.kgGgGgggnk.', '.kngggnnnnk.', '..kknnnnkk..', '....kkkk....'],
  pain: ['............', '...kkkkkk...', '..kyYYYYyk..', '.kyYwYwYYyk.', 'kyYYYYYYYYyk', 'kyyYyYyyyyyk', 'kkkkkkkkkkkk', 'kyyyyyyyyyyk', 'kyyyyyyyyyok', '.kkkkkkkkkk.', '............', '............'],
  viande: ['............', '..kkkkkk....', '.kpPPpppkk..', 'kpPwwpppppk.', 'kpPPpppPpppk', 'kppppppPPppk', 'kpwpppppppdk', 'kpppPpppppdk', '.kpppppppddk', '..kkpppdddk.', '....kkkkkk..', '............'],
  fromage: ['............', '........kk..', '......kkFFk.', '....kkFFFFk.', '..kkFFFfFFfk', 'kkFFFFFFFFfk', 'kfffffffffok', 'kfoffffofffk', 'kffffoffffok', 'kfoffffffffk', 'kkkkkkkkkkkk', '............'],
  oignon: ['.....kk.....', '.....kNk....', '....kVVk....', '...kVvVVk...', '..kVVvVVVk..', '.kVvVVvVVVk.', 'kVVvVVvVVVvk', 'kVvVVvVVVvVk', 'kVVvVVvVVvVk', '.kVVvVVVvVk.', '..kkVVVVkk..', '....kkkk....'],
  patate: ['............', '...kkkkk....', '..kuUUuuk...', '.kuUuuuuukk.', 'kuUuuuhhuuuk', 'kuuuuuuuuuhk', 'kuuhuuuuuuhk', 'kuuuuuuuhuhk', '.kuuuuuuuhhk', '..kkuuuhhhk.', '....kkkkkk..', '............'],
  pate: ['............', '............', '...kkkkkk...', '..kqQQQqqk..', '.kqQwQqqqqk.', 'kqQQqqqqqqqk', 'kqqqqqqqqqjk', 'kqqqqqqqqjjk', '.kqqqqqqjjk.', '..kkkkkkkk..', '............', '............'],
  fraise: ['....kNNk....', '...kNggNk...', '..kkkkkkkk..', '.krRrrrrrrk.', 'krRwRrFrrrdk', 'krrrrrrrFrdk', 'krFrrrFrrrdk', '.krrrrrrrdk.', '.krrFrrrddk.', '..krrrrddk..', '...krrddk...', '....kkkk....'],
  creme: ['.....kk.....', '....kwwk....', '...kwwWwk...', '..kwwwwwWk..', '.kwwWwwwwWk.', 'kkkkkkkkkkkk', 'kmMMMMMMMMmk', '.kmMMMMMMmk.', '..kmmmmmmk..', '...kkkkkk...', '............', '............'],
  cendre: ['............', '............', '............', '....kkkk....', '...kxXxxk...', '..kxXxxXxk..', '.kxxXxxxXxk.', 'kxXxxxXxxxXk', 'kkkkkkkkkkkk', '............', '............', '............'],
};
const BS_BITS = ['............', '............', '..kkk...kk..', '.kaAak.kAak.', '.kaadk.kadk.', '..kkk.kkkk..', '.kk..kaAak..', 'kAak.kaadk..', 'kadk..kkk.kk', '.kk..kk..kAk', '....kAak..k.', '.....kk.....'];  // haché
const BS_PATTY = ['............', '............', '............', '...kkkkkk...', '..kaAAaaak..', '.kaAaaaaaadk', 'kaaaaaAaaadk', 'kaAaaaaaaddk', '.kaaaaaaddk.', '..kkkkkkkk..', '............', '............'];
const BS_FRIES = ['............', '..k.k.k.k...', '.kakAkakAk..', '.kAkakAkak..', '.kakAkakAk..', 'kkkkkkkkkkk.', 'kcCccwcccck.', 'kcCccccccck.', '.kcccccccck.', '.kcccccccck.', '..kkkkkkkk..', '............'];
const BS_PIZZA = ['....kkkk....', '..kkyYYykk..', '.kyrrFrrryk.', '.kYrFrrNrFk.', 'kyrrrFrrrryk', 'kYFrNrrFrrYk', 'kyrrrrFrNryk', 'kYrFrrrrFryk', '.kyrrNrFrrk.', '.kyyrrrrryk.', '..kkyyyykk..', '....kkkk....'];
const BS_BITPAL = {tomate: {a: '#e83a2a', A: '#ff8a6a', d: '#a01a1a'}, salade: {a: '#4aaa3a', A: '#9ae05a', d: '#2a6a2a'}, fromage: {a: '#f8c830', A: '#fff0a0', d: '#c89010'}, oignon: {a: '#e8c8e8', A: '#ffffff', d: '#a06aa0'},
  fraise: {a: '#e83a2a', A: '#ffb0b8', d: '#a01a1a'}, patate: {a: '#f0e0a0', A: '#fff8d0', d: '#c8a860'},
  hache: {a: '#e87a8a', A: '#ffb0b8', d: '#b8505a'}, cuit: {a: '#8a5a2a', A: '#b07a40', d: '#5a3414'}, brule: {a: '#3a3030', A: '#5a4a48', d: '#1a1414'}};
const BS_BOWL = ['kkkkkkkkkkkk', 'kwwwwwwwwwWk', '.kwwwwwwwWk.', '..kwwwwwWk..', '...kkkkkk...', '............', '............'];
const BS_DISH = {
  salade: ['............', '............', '...kGkgk....', '..kgGgGgGk..', '.kGgGgGgGgk.', ...BS_BOWL],
  saltom: ['............', '............', '...kGkrk....', '..kgGrGgrk..', '.kGrGgGrGgk.', ...BS_BOWL],
  burger: ['............', '...kkkkkk...', '..kyYYYYyk..', '.kyYwYYwYyk.', 'kyYYYYYYYYyk', 'kgGgGgGgGgGk', 'kbbBbbbbBbbk', 'kbbbbbbbbbbk', 'kkkkkkkkkkkk', 'kyyyyyyyyyyk', '.kkkkkkkkkk.', '............'],
  cheese: ['............', '...kkkkkk...', '..kyYYYYyk..', '.kyYwYYwYyk.', 'kyYYYYYYYYyk', 'kfFfffffFffk', 'kbbBbbbbBbbk', 'kbbbbbbbbbbk', 'kkkkkkkkkkkk', 'kyyyyyyyyyyk', '.kkkkkkkkkk.', '............'],
  soupeT: ['............', '...W..W.....', '..W..W..W...', '...W..W.....', 'kkkkkkkkkkkk', 'kcCcccccCcck', 'kwwwwwwwwwWk', '.kwwwwwwwWk.', '..kwwwwwWk..', '...kkkkkk...', '............', '............'],
  soupeO: ['............', '...W..W.....', '..W..W..W...', '...W..W.....', 'kkkkkkkkkkkk', 'kfFfffffFffk', 'kwwwwwwwwwWk', '.kwwwwwwwWk.', '..kwwwwwWk..', '...kkkkkk...', '............', '............'],
  dessert: ['.....kk.....', '....kwwk....', '...kwwWwk...', '..krwrwrwk..', '..kRrwrRrk..', '.kkkkkkkkkk.', '.kMwrwrwrMk.', '..kMwrwrMk..', '...kMwwMk...', '....kmmk....', '...kmmmmk...', '...kkkkkk...'],
};
const BS_FRYPAL = {cuit: {a: '#f8d040', A: '#fff4a0'}, brule: {a: '#5a4030', A: '#7a5a40'}};
// un ingrédient prêt, en icône 12 x 12 (tickets, assiettes pas finies)
function bsIcon(g, part, x, y) {
  if (part === 'pain' || part === 'creme') sprite(g, BS_SPR[part], x, y, BS_PAL);
  else if (part === 'viande') sprite(g, BS_PATTY, x, y, {...BS_PAL, ...BS_BITPAL.cuit});
  else if (part === 'frites') sprite(g, BS_FRIES, x, y, {...BS_PAL, ...BS_FRYPAL.cuit});
  else if (part === 'pizza') sprite(g, BS_PIZZA, x, y, BS_PAL);
  else if (BS_DISH[part]) sprite(g, BS_DISH[part], x, y, BS_PAL);
  else sprite(g, BS_BITS, x, y, {...BS_PAL, ...BS_BITPAL[part]});
}
function bsDish(g, r, x, y) {  // le plat fini, 12 x 12 (le burger frites : le burger avec ses frites à côté)
  if (r === 'menu') { sprite(g, BS_FRIES, x + 5, y + 1, {...BS_PAL, ...BS_FRYPAL.cuit}); sprite(g, BS_DISH.burger, x - 3, y, BS_PAL); return; }
  if (r === 'frites') return sprite(g, BS_FRIES, x, y, {...BS_PAL, ...BS_FRYPAL.cuit});
  if (r === 'pizza') return sprite(g, BS_PIZZA, x, y, BS_PAL);
  sprite(g, BS_DISH[r], x, y, BS_PAL);
}
function bsPlate(g, x, y) { px(g, '#1a1008', x + 2, y, 16, 1); px(g, '#1a1008', x, y + 1, 20, 4); px(g, '#1a1008', x + 2, y + 5, 16, 1); px(g, '#ffffff', x + 1, y + 1, 18, 3); px(g, '#d8dce8', x + 3, y + 2, 14, 1); px(g, '#c8ccd8', x + 1, y + 4, 18, 1); }
const bsDone = it => Object.keys(BS_REC).find(r => BS_REC[r].parts.join(',') === it.parts.join(','));
function bsItem(g, it, cx, by) {  // un objet posé, en pixels de l'écran : (cx, by) = milieu du bas
  const x = Math.round(cx) - 6, y = Math.round(by) - 12;
  if (it.t === 'assiette') {
    bsPlate(g, x - 4, y + 7);
    const done = bsDone(it);
    if (done) bsDish(g, done, x, y - 1); else it.parts.forEach((p, i) => bsIcon(g, p, x - 3 + i * 5, y - 1 - i * 2));
    return;
  }
  if (it.t === 'cendre') return sprite(g, BS_SPR.cendre, x, y, BS_PAL);
  if (it.t === 'pate') {
    if (it.s === 'cru' && !it.parts.length) return sprite(g, BS_SPR.pate, x, y, BS_PAL);
    const tom = it.parts.includes('tomate'), fro = it.parts.includes('fromage'), base = tom ? '#e83a2a' : '#f0e4cc';
    const pal = it.s === 'brule' ? {...BS_PAL, y: '#3a3030', Y: '#5a4a48', r: '#2a2020', F: '#4a3a30', N: '#1a1414'} : it.s === 'cuit' ? BS_PAL : {...BS_PAL, y: '#f0e4cc', Y: '#fff8ec', r: base, F: fro ? '#fff0a0' : base, N: base};
    return sprite(g, BS_PIZZA, x, y, pal);
  }
  if (it.t === 'viande' && it.s !== 'cru') return sprite(g, it.s === 'hache' ? BS_BITS : BS_PATTY, x, y, {...BS_PAL, ...BS_BITPAL[it.s]});
  if (it.t === 'patate' && (it.s === 'cuit' || it.s === 'brule')) return sprite(g, BS_FRIES, x, y, {...BS_PAL, ...BS_FRYPAL[it.s]});
  if (it.s === 'hache') return sprite(g, BS_BITS, x, y, {...BS_PAL, ...BS_BITPAL[it.t]});
  sprite(g, BS_SPR[it.t], x, y, BS_PAL);
}
// une jauge au-dessus d'un poste : la cuisson (orange), puis le temps avant que ça brûle (rouge qui clignote)
function bsGauge(g, x, y, f, col) { px(g, '#1a1008', x - 1, y - 1, 22, 6); px(g, '#3a2a1a', x, y, 20, 4); px(g, col, x, y, Math.max(1, Math.round(20 * Math.min(1, f))), 4); px(g, 'rgba(255,255,255,.35)', x, y, Math.max(1, Math.round(20 * Math.min(1, f))), 1); }
function bsWarn(g, x, y) { if (bs.tick % 16 < 9) { px(g, '#1a1008', x - 7, y - 9, 14, 11); px(g, '#ff4a3a', x - 6, y - 8, 12, 9); pxFont(g, '!!', x, y - 1, '#ffffff', 8, 'center'); } }
const bsHash = (cx, cy) => (cx * 7 + cy * 13 + cx * cy) % 11;
function bsWall(g, x, y, cx, cy) {  // le mur de briques, garni ici et là d'étagères, de casseroles pendues, d'un cadre ou d'une fenêtre
  if (bs.L.boat) {  // sur le bateau : la coque en planches, des hublots sur la mer
    px(g, '#6a4422', x, y, 24, 24); for (let r = 0; r < 4; r++) { px(g, r % 2 ? '#7a5028' : '#71492a', x, y + r * 6, 24, 5); px(g, '#3a2210', x, y + r * 6 + 5, 24, 1); px(g, '#3a2210', x + ((cx * 7 + r * 11) % 20), y + r * 6, 1, 5); }
    if ((cx * 2 + cy) % 4 === 0) { const w = Math.round(Math.sin((bs.tick + cx * 20) / 25) * 2); px(g, '#1a1008', x + 4, y + 4, 16, 16); px(g, '#c8a040', x + 5, y + 5, 14, 14); px(g, '#2a5a98', x + 7, y + 7, 10, 10); px(g, '#8ac8f8', x + 7, y + 11 + w, 10, 1); px(g, '#4a8ad8', x + 7, y + 12 + w, 10, 5 - w); }
    px(g, '#2a1408', x, y + 23, 24, 1); return;
  }
  px(g, '#5a2e1e', x, y, 24, 24);
  for (let r = 0; r < 4; r++) for (let c = -1; c < 3; c++) { const bx = x + c * 12 + (r % 2) * 6, by = y + r * 6; px(g, (c + r + cx) % 3 ? '#8a4a32' : '#7a4028', Math.max(x, bx), by, Math.min(11, x + 24 - Math.max(x, bx)), 5); px(g, '#a05a3a', Math.max(x, bx), by, Math.min(11, x + 24 - Math.max(x, bx)), 1); }
  const h = bsHash(cx, cy);
  if (h === 1) { px(g, '#3a2210', x, y + 14, 24, 3); px(g, '#6a4220', x, y + 13, 24, 1); for (let i = 0; i < 3; i++) { const jc = ['#e83a2a', '#f8c830', '#4aaa3a'][(cx + i) % 3]; px(g, '#1a1008', x + 2 + i * 8, y + 5, 6, 8); px(g, '#d8e8f0', x + 3 + i * 8, y + 6, 4, 6); px(g, jc, x + 3 + i * 8, y + 9, 4, 3); px(g, '#8a6a3a', x + 3 + i * 8, y + 5, 4, 1); } }
  else if (h === 4) { px(g, '#2a2e38', x + 2, y + 3, 20, 1); for (let i = 0; i < 2; i++) { const px0 = x + 4 + i * 10; px(g, '#2a2e38', px0 + 3, y + 3, 1, 4); px(g, '#1a1c24', px0, y + 7, 8, 8); px(g, '#8a8e9c', px0 + 1, y + 8, 6, 6); px(g, '#c4c8d4', px0 + 1, y + 8, 6, 1); } }
  else if (h === 7) { px(g, '#1a1008', x + 4, y + 3, 16, 16); px(g, '#c89a5a', x + 5, y + 4, 14, 14); px(g, '#f4ecd8', x + 7, y + 6, 10, 10); for (let i = 0; i < 4; i++) px(g, '#5a4a3a', x + 8, y + 7 + i * 2, 6 + (i % 2) * 2, 1); }
  else if (h === 9 && cy < 2) { px(g, '#1a1008', x + 3, y + 2, 18, 18); px(g, '#8ac8f8', x + 4, y + 3, 16, 16); px(g, '#c8e8ff', x + 4, y + 3, 16, 5); px(g, '#ffffff', x + 6, y + 5, 5, 2); px(g, '#1a1008', x + 11, y + 3, 2, 16); px(g, '#1a1008', x + 4, y + 10, 16, 2); }
  px(g, '#2a1408', x, y + 23, 24, 1);
}
function bsFloorTile(g, x, y, cx, cy) {  // le carrelage : damier crème et terre cuite, joints, reflet ; l'ombre des comptoirs voisins
  const a = (cx + cy) % 2;
  px(g, a ? '#ecdcbc' : '#d8a878', x, y, 24, 24); px(g, a ? '#f8ecd4' : '#e8bc8c', x + 1, y + 1, 21, 2); px(g, a ? '#f8ecd4' : '#e8bc8c', x + 1, y + 1, 2, 21);
  px(g, a ? '#dccaa4' : '#c8966a', x + 3, y + 21, 20, 2); px(g, a ? '#dccaa4' : '#c8966a', x + 21, y + 3, 2, 20);
  if (bsHash(cx, cy) === 2) { px(g, a ? '#e0cea8' : '#c48e60', x + 8, y + 10, 4, 2); px(g, a ? '#e0cea8' : '#c48e60', x + 12, y + 12, 3, 2); }
  px(g, '#a88a66', x, y + 23, 24, 1); px(g, '#a88a66', x + 23, y, 1, 24);
  if (!bsFloor(cx, cy - 1)) { g.fillStyle = 'rgba(70,36,12,.3)'; g.fillRect(x, y, 24, 6); g.fillStyle = 'rgba(70,36,12,.14)'; g.fillRect(x, y + 6, 24, 2); }
  if (!bsFloor(cx - 1, cy)) { g.fillStyle = 'rgba(70,36,12,.18)'; g.fillRect(x, y, 4, 24); }
}
function bsTile(g, cx, cy) {
  const ch = bs.grid[cy][cx], x = cx * 24, y = BS.TOP + cy * 24, k = bsKey(cx, cy), it = bs.items.get(k), t = bs.tick;
  if (ch === '.') return bsFloorTile(g, x, y, cx, cy);
  if (ch === 'W') return bsWall(g, x, y, cx, cy);
  if (ch === 'H') {  // la porte battante : ouverte, deux battants rabattus sur le carrelage ; fermée, deux panneaux de bois à hublot
    bsFloorTile(g, x, y, cx, cy);
    if (bs.doorOpen) { px(g, '#7a4a22', x, y + 1, 4, 22); px(g, '#7a4a22', x + 20, y + 1, 4, 22); px(g, '#a8763e', x + 1, y + 2, 2, 20); px(g, '#a8763e', x + 21, y + 2, 2, 20); }
    else { px(g, '#1a1008', x, y, 24, 24); for (const dx of [1, 13]) { px(g, '#a8763e', x + dx, y + 1, 10, 22); px(g, '#c8925a', x + dx, y + 1, 10, 2); px(g, '#1a1008', x + dx + 3, y + 6, 5, 5); px(g, '#8ac8f8', x + dx + 4, y + 7, 3, 3); } }
    return;
  }
  if (BS_BELT[ch]) {  // le tapis roulant : caoutchouc sombre, chevrons qui défilent dans son sens, rouleaux sur la façade
    const [dx, dy] = BS_BELT[ch], o = (t >> 1) % 8;
    px(g, '#1a1c24', x, y, 24, 16); px(g, '#3a3c48', x + 1, y + 2, 22, 12);
    for (let i = 0; i < 3; i++) { const s = (i * 8 + o * (dx + dy > 0 ? 1 : -1) + 24) % 24;
      if (dx) for (let j = 0; j < 3; j++) px(g, '#7a7e8c', x + s + (dx > 0 ? j : 2 - j), y + 5 + j, 1, 1), px(g, '#7a7e8c', x + s + (dx > 0 ? j : 2 - j), y + 11 - j, 1, 1);
      else for (let j = 0; j < 3; j++) px(g, '#7a7e8c', x + 7 + j, y + 2 + (s % 12) + (dy > 0 ? j : 2 - j), 1, 1), px(g, '#7a7e8c', x + 15 - j, y + 2 + (s % 12) + (dy > 0 ? j : 2 - j), 1, 1); }
    px(g, '#4a4e5a', x, y + 16, 24, 7); for (let i = 0; i < 4; i++) { px(g, '#2a2e38', x + 2 + i * 6, y + 18, 4, 4); px(g, '#8a8e9c', x + 3 + i * 6, y + 18, 1, 1); }
    px(g, '#2a1408', x, y + 23, 24, 1);
    if (it) bsItem(g, it, x + 12, y + 15);
    return;
  }
  const metal = 'SUZMX'.includes(ch);
  if (metal) {  // l'inox brossé : reflets en bandes, rivets, façade sombre
    px(g, '#868a98', x, y, 24, 16); for (let i = 2; i < 16; i += 3) px(g, '#7c808e', x, y + i, 24, 1); px(g, '#c4c8d4', x, y, 24, 2); px(g, '#a4a8b4', x, y + 2, 2, 14); px(g, '#5a5e6a', x + 22, y + 2, 2, 14);
    px(g, '#2a2e38', x + 2, y + 3, 2, 2); px(g, '#2a2e38', x + 20, y + 12, 2, 2);
    px(g, '#4a4e5a', x, y + 16, 24, 7); px(g, '#5e626e', x, y + 16, 24, 1); px(g, '#2a2e38', x + 6, y + 19, 12, 2);
  } else {  // le bois : dessus clair veiné, chant arrondi, façade de placard avec sa poignée
    px(g, '#c8925a', x, y, 24, 16); px(g, '#e4b47a', x, y, 24, 2); px(g, '#d8a46a', x, y + 2, 24, 1);
    for (let i = 0; i < 4; i++) { const gy = y + 4 + ((cx * 3 + cy + i * 3) % 10), gx = x + ((cx * 5 + i * 7) % 16); px(g, '#b47e48', gx, gy, 6 + (i % 2) * 2, 1); }
    px(g, '#a8763e', x + 22, y + 2, 2, 14);
    px(g, '#7a4a22', x, y + 16, 24, 7); px(g, '#8e5a2e', x, y + 16, 24, 1); px(g, '#5a3414', x + 23, y + 16, 1, 7); px(g, '#5a3414', x + 11, y + 17, 1, 6);
    px(g, '#e8c080', x + 8, y + 19, 2, 2); px(g, '#e8c080', x + 14, y + 19, 2, 2);
  }
  px(g, '#2a1408', x, y + 23, 24, 1);
  if (BS_CRATE[ch]) {  // une caisse en lattes, pleine de son ingrédient
    px(g, '#3a2010', x + 2, y + 2, 20, 15); px(g, '#a86e34', x + 3, y + 3, 18, 13); px(g, '#c88a48', x + 3, y + 3, 18, 2); px(g, '#7a4a20', x + 3, y + 8, 18, 1); px(g, '#7a4a20', x + 3, y + 12, 18, 1); px(g, '#5a3414', x + 11, y + 3, 1, 13);
    if (!it) { sprite(g, BS_SPR[BS_CRATE[ch]], x + 6, y - 3, BS_PAL); sprite(g, BS_SPR[BS_CRATE[ch]], x + 2, y + 1, BS_PAL); }
  } else if (ch === 'C') {  // la planche à découper, avec son couteau
    px(g, '#5a3414', x + 2, y + 2, 20, 13); px(g, '#e8c890', x + 2, y + 2, 20, 11); px(g, '#f8e0b0', x + 2, y + 2, 20, 2); px(g, '#d0aa70', x + 5, y + 7, 7, 1); px(g, '#d0aa70', x + 12, y + 10, 6, 1);
    if (!it) { px(g, '#e8ecf4', x + 5, y + 5, 10, 2); px(g, '#a8acb8', x + 5, y + 7, 10, 1); px(g, '#3a2a1a', x + 15, y + 5, 5, 3); }
  } else if (ch === 'S' || ch === 'U' || ch === 'Z') {
    const ck = BS_COOKS[ch], on = it && it.t === ck.t && (it.t === 'pate' || it.s !== 'cru');
    if (ch === 'S') {  // la poêle sur son feu
      px(g, '#1a1c24', x + 2, y + 2, 20, 13); px(g, on ? (t % 8 < 4 ? '#ff6a1a' : '#e84a10') : '#3a3e4a', x + 4, y + 4, 16, 9); px(g, '#1a1c24', x + 6, y + 6, 12, 5);
      px(g, '#1a1008', x + 3, y + 3, 16, 12); px(g, '#3a3036', x + 4, y + 4, 14, 10); px(g, '#5a5a68', x + 4, y + 4, 14, 2); px(g, '#1a1008', x + 18, y + 7, 6, 3); px(g, '#7a4a2a', x + 19, y + 8, 5, 1);
    } else if (ch === 'U') {  // la friteuse : un bac d'huile dorée qui bouillonne
      px(g, '#1a1c24', x + 2, y + 2, 20, 13); px(g, on ? '#f0c040' : '#c89a3a', x + 4, y + 4, 16, 9); px(g, '#fff0a0', x + 4, y + 4, 16, 1);
      if (on) for (let i = 0; i < 3; i++) px(g, '#fff8d0', x + 5 + ((t >> 2) + i * 5) % 14, y + 6 + (i * 3) % 6, 2, 2);
      px(g, '#2a2e38', x + 3, y + 2, 1, 13); px(g, '#2a2e38', x + 20, y + 2, 1, 13);
    } else {  // le four à pizza en briques, avec sa bouche rougeoyante
      px(g, '#1a1008', x + 1, y - 4, 22, 20); px(g, '#a8563a', x + 2, y - 3, 20, 18); for (let r = 0; r < 4; r++) px(g, '#8a4028', x + 2, y - 3 + r * 5, 20, 1);
      px(g, '#1a1008', x + 6, y + 4, 12, 10); px(g, on ? (t % 10 < 5 ? '#ff8a2a' : '#ffb04a') : '#5a2a1a', x + 7, y + 6, 10, 8); px(g, '#ffd84a', x + 9, y + 11, 6, 2);
    }
    if (it) {
      bsItem(g, it, x + 12, y + 15);
      if (on && it.s !== 'brule') { const f = it.k / ck.cook; if (it.s !== 'cuit') bsGauge(g, x + 2, y - 8, f, '#ff9a3a'); else { const b = (it.k - ck.cook) / ck.burn; if (b > .4) { bsGauge(g, x + 2, y - 8, 1 - b, '#ff4a3a'); bsWarn(g, x + 12, y - 11); } else { px(g, '#1a1008', x + 8, y - 10, 8, 8); px(g, '#7ae05a', x + 9, y - 9, 6, 6); px(g, '#ffffff', x + 10, y - 7, 2, 2); } } }
    }
    return;
  } else if (ch === 'M') {  // la marmite : 3 légumes hachés, puis la soupe cuit
    const p = it, burnt = p.k >= BS.SOUP + BS.SBURN, done = p.k >= BS.SOUP;
    if (p.parts.length === 3) px(g, t % 6 < 3 ? '#ff8a2a' : '#e85a1a', x + 3, y + 12, 18, 4);
    const col = !p.parts.length ? '#2a2a34' : burnt ? '#3a3030' : p.parts[0] === 'tomate' ? (done ? '#d83a2a' : '#e87a6a') : (done ? '#d8a030' : '#e8d0b0');
    px(g, '#1a1008', x + 2, y - 2, 20, 16); px(g, '#c8ccd8', x + 3, y - 1, 18, 2); px(g, col, x + 4, y + 1, 16, 4); if (p.parts.length && !burnt) px(g, '#ffffff', x + 6 + (t >> 3) % 8, y + 2, 2, 1);
    px(g, '#8a8e9c', x + 3, y + 5, 18, 8); px(g, '#c8ccd8', x + 4, y + 6, 2, 6); px(g, '#1a1008', x, y + 3, 3, 3); px(g, '#1a1008', x + 21, y + 3, 3, 3);
    if (p.parts.length && p.parts.length < 3) for (let i = 0; i < 3; i++) { px(g, '#1a1008', x + 5 + i * 5, y - 7, 4, 4); px(g, i < p.parts.length ? '#7ae05a' : '#5a4a3a', x + 6 + i * 5, y - 6, 2, 2); }
    if (p.parts.length === 3 && !done) bsGauge(g, x + 2, y - 8, p.k / BS.SOUP, '#ff9a3a');
    if (done && !burnt) { const b = (p.k - BS.SOUP) / BS.SBURN; if (b > .4) { bsGauge(g, x + 2, y - 8, 1 - b, '#ff4a3a'); bsWarn(g, x + 12, y - 11); } else { px(g, '#1a1008', x + 8, y - 10, 8, 8); px(g, '#7ae05a', x + 9, y - 9, 6, 6); px(g, '#ffffff', x + 10, y - 7, 2, 2); } }
    return;
  } else if (ch === 'A') { for (let i = 0; i < Math.min(4, bs.plates); i++) bsPlate(g, x + 2, y + 9 - i * 3); }
  else if (ch === 'X') {  // le passe : inox chauffé par sa lampe, la clochette
    g.fillStyle = 'rgba(255,200,80,.22)'; g.fillRect(x - 2, y - 2, 28, 22); px(g, '#5a5e6a', x + 2, y + 4, 20, 10);
    for (let i = 0; i < 3; i++) { const c = (t / 8 + i) % 3 < 1 ? '#ffd84a' : '#c8a030'; px(g, c, x + 6 + i * 4, y + 6, 2, 2); px(g, c, x + 8 + i * 4, y + 8, 2, 2); px(g, c, x + 6 + i * 4, y + 10, 2, 2); }
    if (bsCh(cx, cy - 1) !== 'X') { px(g, '#1a1008', x + 15, y - 3, 7, 5); px(g, '#ffd84a', x + 16, y - 2, 5, 3); px(g, '#fff4a0', x + 17, y - 2, 2, 1); px(g, '#1a1008', x + 18, y - 4, 1, 1); }
  } else if (ch === 'D') {  // la poubelle
    px(g, '#1a1a22', x + 4, y - 2, 16, 20); px(g, '#6a6e7c', x + 6, y + 2, 12, 14); px(g, '#8a8e9c', x + 6, y + 2, 2, 14); px(g, '#9a9eac', x + 4, y - 2, 16, 4); px(g, '#c8ccd8', x + 6, y - 2, 12, 1); px(g, '#1a1a22', x + 10, y - 4, 4, 2);
    px(g, '#4a4e5a', x + 10, y + 6, 1, 8); px(g, '#4a4e5a', x + 14, y + 6, 1, 8);
  }
  if (it) { bsItem(g, it, x + 12, y + 15); if (ch === 'C' && it.s === 'cru' && it.c > 0) bsGauge(g, x + 2, y - 8, it.c / BS.CHOP, '#7ae05a'); }
}
const BS_CHEF = {
  down: ['....kkkkkkkk....', '...kwwwwwwwwk...', '..kwwwwwwwwwwk..', '..kwwwwwwwwwWk..', '...kWWWWWWWWk...', '...kSssssssSk...', '...ksessssesk...', '...kssssssssk...', '...ksssrrsssk...', '....kkrrrrkk....',
    '..kwwwrrrrwwwk..', '.kswwwwwwwwwwsk.', '.kswwwwwwwwwwsk.', '..kwwwbbbbwwwk..', '..kWwwwwwwwwWk..', '..kWWwwwwwwWWk..'],
  up: ['....kkkkkkkk....', '...kwwwwwwwwk...', '..kwwwwwwwwwwk..', '..kwwwwwwwwwWk..', '...kWWWWWWWWk...', '...khhhhhhhhk...', '...khhhhhhhhk...', '...kshhhhhhsk...', '...kssssssssk...', '....kkwwwwkk....',
    '..kwwwwwwwwwwk..', '.kswwwwwwwwwwsk.', '.kswwwwwwwwwwsk.', '..kwwwbbbbwwwk..', '..kWwwwwwwwwWk..', '..kWWwwwwwwWWk..'],
  side: ['....kkkkkkkk....', '...kwwwwwwwwk...', '..kwwwwwwwwwwk..', '..kwwwwwwwwwWk..', '...kWWWWWWWWk...', '...khhssssssk...', '...khsssssesk...', '...khsssssssk...', '...khsssssssk...', '....kkrrrrkk....',
    '...kwwwwwrrrk...', '...kwwwwwwwsk...', '...kwwwwwwwsk...', '...kwwwbbbbwk...', '...kWwwwwwwWk...', '...kWWwwwwWWk...'],
};
const BS_LEGS = {front: [['...kbbbk.kbbbk..', '...kkkk..kkkk...'], ['..kbbbk...kbbbk.', '..kkkk.....kkk..'], ['....kbbbkkbbbk..', '....kkkk.kkkk...']],
  side: [['....kbbbbbk.....', '....kkkkkkk.....'], ['...kbbbk.kbbk...', '...kkkk..kkk....'], ['.....kbbbbk.....', '.....kkkkkk.....']]};
const BS_CPAL = {k: '#1a1008', w: '#ffffff', W: '#c8d0e0', s: '#f0c8a0', S: '#d8a080', e: '#1a1008', r: '#e83a2a', b: '#3a3a5a', h: '#6a3a1a'};
function bsChef(g) {
  const sx = Math.round(bs.x * 2), sy = BS.TOP + Math.round(bs.y * 2), [dx, dy] = bs.dir, x = sx - 8, y = sy - 15;
  const moving = bs.mode === 'play' && (bs.goal?.path.length || [...bs.keys].some(k => 'UDLR'.includes(k))), L = BS_LEGS[dx ? 'side' : 'front'];
  let rows = [...(dy < 0 ? BS_CHEF.up : dx ? BS_CHEF.side : BS_CHEF.down), ...(moving ? L[bs.walk % 16 < 8 ? 1 : 2] : L[0])];
  if (dx < 0) rows = rows.map(r => [...r].reverse().join(''));
  g.fillStyle = 'rgba(40,20,8,.3)'; g.beginPath(); g.ellipse(sx, sy + 4, 8, 3, 0, 0, 7); g.fill();
  if (bs.hand && dy < 0) bsItem(g, bs.hand, sx, y + 16);
  sprite(g, rows, x, y, BS_CPAL);
  if (bs.chop) { const up = bs.tick % 10 < 5; px(g, '#1a1008', sx + dx * 12 - 1 + (dx ? 0 : 6), y + (up ? 8 : 13) + dy * 6, 3, 7); px(g, '#e8ecf4', sx + dx * 12 + (dx ? 0 : 6), y + (up ? 9 : 14) + dy * 6, 1, 5); }
  if (bs.hand && dy >= 0) bsItem(g, bs.hand, sx + dx * 13, y + 28 - (dx ? 5 : 0));
  // la bulle : ce que l'assiette en main deviendra, coché si un client l'a commandé
  if (bs.hand?.t === 'assiette' && bs.hand.parts.length) {
    const done = bsDone(bs.hand), want = done && bs.orders.some(o => o.r === done), bx = sx - 13, by = y - 20;
    px(g, '#1a1008', bx, by, 26, 18); px(g, '#ffffff', bx + 1, by + 1, 24, 16); px(g, '#1a1008', sx - 1, by + 18, 3, 2); px(g, '#ffffff', sx, by + 17, 1, 2);
    if (done) bsDish(g, done, bx + 4, by + 3); else bs.hand.parts.slice(0, 2).forEach((p, i) => bsIcon(g, p, bx + 1 + i * 11, by + 3));
    if (want) { px(g, '#3aa83a', bx + 19, by + 2, 2, 2); px(g, '#3aa83a', bx + 21, by + 4, 2, 2); px(g, '#3aa83a', bx + 23, by + 2, 2, 2); }
  }
}
// la salle : un parquet, quatre tables ; chaque commande est un client assis qui attend, mange, ou repart fâché
const BS_LOOK = [['#6a3a1a', '#3a7ae0', '#f0c8a0'], ['#e8c040', '#d83a6a', '#f0c8a0'], ['#1a1008', '#4aaa3a', '#a86a40'], ['#a0a0a8', '#8a4ab0', '#f0c8a0'], ['#c84a1a', '#e8a030', '#d8a080'], ['#3a2a1a', '#30b0b8', '#7a4a2a']];
const BS_GUEST = ['....kkkkk.....', '...khhhhhk....', '..khhhhhhhk...', '..ksesshhhk...', '..kssssshhk...', '..ksrssshk....', '...kkssskk....', '..kccccccck...', '.kcCcccccccck.', '.kcCcccccccck.', '..kcccccccck..', '..kkkkkkkkkk..'];
function bsHall(g) {
  const X0 = 480, t = bs.tick;
  for (let y = BS.TOP, r = 0; y < BS.H; y += 6, r++) { px(g, r % 2 ? '#8a5a32' : '#83542e', X0, y, 96, 5); px(g, '#5a3818', X0, y + 5, 96, 1); for (let x = X0 + (r % 3) * 16; x < BS.W; x += 48) px(g, '#5a3818', x, y, 1, 5); }  // le parquet : des lattes décalées
  px(g, '#3a2210', X0, BS.TOP, 3, BS.H - BS.TOP); px(g, '#c8925a', X0 + 3, BS.TOP, 1, BS.H - BS.TOP);
  for (let s = 0; s < 4; s++) {
    const ty = BS.TOP + 8 + s * 66, c = bs.clients.find(c => c.seat === s);
    g.fillStyle = 'rgba(30,14,4,.35)'; g.fillRect(X0 + 12, ty + 30, 44, 6);
    px(g, '#1a1008', X0 + 10, ty + 14, 44, 18); px(g, '#f4ecd8', X0 + 11, ty + 15, 42, 12); px(g, '#e83a2a', X0 + 11, ty + 15, 42, 2); for (let i = 0; i < 42; i += 6) px(g, '#e83a2a', X0 + 11 + i, ty + 17, 3, 10); px(g, '#7a4a22', X0 + 11, ty + 27, 42, 4);
    px(g, '#1a1008', X0 + 62, ty + 18, 18, 22); px(g, '#7a4a22', X0 + 63, ty + 19, 16, 20); px(g, '#a8763e', X0 + 63, ty + 19, 16, 3);
    if (!c) continue;
    const [hair, shirt, skin] = BS_LOOK[c.look], bob = c.st === 'eat' ? (t >> 3) % 2 : c.st === 'angry' ? ((t >> 1) % 2) * 2 - 1 : 0, leave = c.st === 'angry' && c.t < 40 ? (40 - c.t) * 2 : c.st === 'eat' && c.t < 30 ? (30 - c.t) * 3 : 0;
    sprite(g, BS_GUEST, X0 + 60 + leave + (c.st === 'angry' ? bob : 0), ty + 6 + (c.st === 'eat' ? bob : 0), {k: '#1a1008', h: hair, s: skin, e: '#1a1008', r: '#a04040', c: shirt, C: '#ffffff'});
    if (c.st === 'eat') { bsPlate(g, X0 + 30, ty + 18); bsDish(g, c.r, X0 + 34, ty + 9); if (t % 40 < 20) { px(g, '#ff6a8a', X0 + 74, ty - 2, 2, 2); px(g, '#ff6a8a', X0 + 78, ty - 2, 2, 2); px(g, '#ff6a8a', X0 + 74, ty, 6, 2); px(g, '#ff6a8a', X0 + 76, ty + 2, 2, 2); } }
    else if (c.st === 'angry') pxFont(g, '#!', X0 + 80, ty + 4, '#ff4a3a', 8, 'center');
    else {  // la bulle de commande et la patience du client
      const o = bs.orders.find(o => o.seat === s), f = o ? o.left / o.tot : 1;
      px(g, '#1a1008', X0 + 22, ty - 6, 20, 18); px(g, '#ffffff', X0 + 23, ty - 5, 18, 16); px(g, '#1a1008', X0 + 41, ty + 4, 4, 2);
      if (o) bsDish(g, o.r, X0 + 26, ty - 3);
      if (c.hurry) { px(g, '#1a1008', X0 + 84, ty + 2, 8, 10); px(g, '#ff4a3a', X0 + 85, ty + 3, 6, 8); pxFont(g, '!', X0 + 88, ty + 10, '#ffffff', 8, 'center'); }
      if (f < .25 && t % 20 < 10) px(g, '#ff4a3a', X0 + 70, ty + 2, 2, 4);
    }
  }
}
const bsClock = t => { const s = Math.ceil(Math.max(0, BS.TIME - t) / 60); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
const BS_STAR = ['...k...', '..kyk..', 'kkkyykk', 'kyyyyyk', '.kyyyk.', '.kykyk.', 'kk...kk'];
function bsStars(g, n, x, y) { for (let i = 0; i < 3; i++) BS_STAR.forEach((r, j) => [...r].forEach((c, k) => { const col = (i < n ? {k: '#1a1008', y: '#ffd84a'} : {k: '#5a5068', y: '#3a3046'})[c]; if (col) px(g, col, x + i * 22 + k * 3, y + j * 3, 3, 3); })); }
function bsDraw() {
  const g = bs.g, {W, H, TOP} = BS;
  for (; bs.seen < bs.tick; bs.seen++) if (bs.mode === 'over') bs.dead++;
  g.imageSmoothingEnabled = false;
  const crow = Math.floor(bs.y / 12), front = bs.mode === 'play' ? bsFront() : -1, sway = Math.round(bs.tilt * 4);
  if (bs.L.boat) { px(g, '#1a3a5a', 0, TOP, W, H - TOP); g.save(); g.translate(sway, 0); }  // le bateau penche : toute la cuisine glisse un peu, la mer se voit au bord
  for (let cy = 0; cy < BS.ROWS; cy++) { for (let cx = 0; cx < BS.COLS; cx++) bsTile(g, cx, cy); if (cy === crow) bsChef(g); }
  bsHall(g);
  if (front >= 0) { const fx = front % BS.COLS * 24, fy = TOP + Math.floor(front / BS.COLS) * 24, c = '#ffffff'; for (const [a, b] of [[0, 0], [20, 0], [0, 20], [20, 20]]) { px(g, c, fx + a, fy + b + (b ? 2 : 0), 4, 2); px(g, c, fx + a + (a ? 2 : 0), fy + b, 2, 4); } }
  for (const f of bs.fx) { if (f.hud) continue; if (f.txt) pxFont(g, f.txt, f.x * 2, TOP + f.y * 2 - (70 - f.t) * .5, f.c, 8, 'center'); else px(g, f.c, f.x * 2, TOP + f.y * 2 - (30 - f.t) * .8, 3, 3); }
  if (bs.L.boat) g.restore();
  // les tickets de commande, le temps et le score
  px(g, '#2a1810', 0, 0, W, TOP); for (let x = 0; x < W; x += 12) px(g, '#33200f', x, 0, 6, TOP - 1); px(g, '#1a1008', 0, TOP - 1, W, 1); px(g, '#8a8e9c', 0, 0, W, 2); px(g, '#4a4e5a', 0, 2, W, 1);
  bs.orders.forEach((o, i) => {
    const x = 4 + i * 100, y = 3 - (o.born || 0), R = BS_REC[o.r], f = o.left / o.tot, late = f < .25 && bs.tick % 20 < 10;
    px(g, 'rgba(0,0,0,.35)', x + 2, y + 2, 94, 30); px(g, late ? '#ffd0c0' : o.hurry ? '#fff0d8' : '#f4ecd8', x, y, 94, 30); px(g, '#fffaf0', x, y, 94, 1); px(g, '#c8b898', x, y + 29, 94, 1);
    if (o.hurry) { px(g, '#e83a2a', x, y, 3, 30); pxFont(g, 'PRESSÉ', x + 90, y + 10, '#e83a2a', 8, 'right'); }
    px(g, '#5a5e6a', x + 44, y - 2, 6, 3); px(g, '#a8acb8', x + 44, y - 2, 6, 1);
    bsDish(g, o.r, x + 6, y + 4);
    const parts = R.parts[0].startsWith('soupe') ? Array(3).fill(R.parts[0] === 'soupeT' ? 'tomate' : 'oignon') : R.parts;
    parts.forEach((p, j) => bsIcon(g, p, x + 24 + j * 14, y + (o.hurry ? 12 : 4)));
    px(g, '#3a2a1a', x + 4, y + 23, 86, 4); px(g, f > .5 ? '#5ac83a' : f > .25 ? '#f8c830' : '#e83a2a', x + 4, y + 23, Math.ceil(86 * f), 4);
  });
  pxFont(g, bsClock(bs.t), W - 6, 15, bs.t > BS.TIME - 30 * 60 && bs.tick % 30 < 15 ? '#ff6a5a' : '#ffffff', 8, 'right');
  pxFont(g, String(bs.score), W - 6, 31, '#ffd84a', 8, 'right');
  if (bs.combo > 1 && bs.t - bs.lastServe < 25 * 60) pxFont(g, 'COMBO ×' + bs.combo, W - 52, 31, '#ff9a3a', 8, 'right');
  for (const f of bs.fx) if (f.hud) { px(g, 'rgba(14,10,20,.7)', f.x - 70, TOP + 40 + f.y * 2 - 10, 140, 13); pxFont(g, f.txt, f.x, TOP + 40 + f.y * 2, f.c, 8, 'center'); }
  if (bs.banner) { const k = bs.banner.t % 20 < 10; px(g, 'rgba(14,10,20,.8)', 0, TOP + 110, 480, 34); pxFont(g, bs.banner.txt, 240, TOP + 134, k ? '#ff6a3a' : '#ffd84a', 16, 'center'); }
  if (bs.msg) { px(g, 'rgba(14,10,20,.85)', 0, H - 22, 480, 22); pxFont(g, bs.msg.txt, 240, H - 7, '#ffffff', 8, 'center'); }
  if (bs.mode === 'ready') { const gl = bsGoals[bs.li];
    gameText(g, W, [[(bs.li + 1) + '. ' + bs.L.name.toUpperCase(), '#ffd84a', 16], ['', ''], [bs.L.rec.map(r => BS_REC[r].name).join(' · '), '#ffffff'], ['Espace : prendre / poser · E : hacher' + (bs.L.rush ? ' · gare aux coups de feu' : ''), '#b8d0ff'], ...(bs.L.tip ? [[bs.L.tip, '#ffb04a']] : []),
      [gl ? 'Étoiles : ' + gl.join(' · ') + ' points' : '', '#ffd84a'], ['← → : cuisine · Espace : commencer', '#b8b0c8']], 110); }
  if (bs.mode === 'play' && bs.count < 120) pxFont(g, bs.count < 70 ? 'PRÊTS ?' : 'SERVICE !', 240, 170, bs.count < 70 ? '#ffd84a' : '#7ae05a', 24, 'center');
  if (bs.mode === 'pause') gameText(g, W, [['PAUSE', '#ffd84a', 16], ['Entrée : reprendre', '#b8b0c8']], 150);
  if (bs.mode === 'over' && bs.dead > 20) {
    gameText(g, W, [['SERVICE TERMINÉ', '#ffd84a', 16], [bs.score + ' points' + (bs.record ? ' · RECORD !' : ''), '#ffffff'], ['', ''], ['', ''], [bs.served + ' plats servis · ' + bs.failed + ' ratés', '#b8d0ff'],
      ['pourboires ' + bs.tips + ' · meilleur combo ×' + bs.bestCombo, '#7ae05a'], [bs.dead > 50 ? 'Espace : rejouer · ← → : cuisine' : '', '#b8b0c8']], 100);
    bsStars(g, bs.stars, W / 2 - 32, 120);
  }
  if (bs.tick % 15 === 0) g.canvas.setAttribute('aria-label', 'Bistrot, cuisine ' + bs.L.name + ' : reste ' + bsClock(bs.t) + ', score ' + bs.score + ', ' + bs.served + ' plats servis, commandes : ' + (bs.orders.map(o => BS_REC[o.r].name).join(', ') || 'aucune') +
    ', en main : ' + (bs.hand ? (bs.hand.t === 'assiette' ? 'assiette' + (bs.hand.parts.length ? ' (' + bs.hand.parts.join(', ') + ')' : ' vide') : bs.hand.t + (bs.hand.s && bs.hand.s !== 'cru' ? ' ' + bs.hand.s : '')) : 'rien') + (bs.mode === 'over' ? ', fini, ' + bs.stars + ' étoiles' : '') + '.');
}
function bsInfo() {
  setTimeout(bsTrophies);
  const li = bs ? bs.li : bss.level, gl = bsGoals[li];
  $('bsStats').replaceChildren(...[['Cuisine', (li + 1) + '. ' + BS_LEVELS[li].name], ['Meilleur score', bss.best[li] ?? '--'], ['Étoiles', (bss.stars[li] || 0) + ' / 3'], ['Pour 3 étoiles', gl ? gl[2] : '--'],
    ['Plats servis', bss.served], ['Pourboires', bss.tips], ['Étoiles en tout', Object.values(bss.stars).reduce((a, b) => a + b, 0) + ' / ' + BS_LEVELS.length * 3]].flatMap(([a, c]) => [el('span', '', a), el('b', '', String(c))]));
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
    const r = cv.getBoundingClientRect(), cx = Math.floor((e.clientX - r.left) / r.width * BS.W / 24), cy = Math.floor(((e.clientY - r.top) / r.height * BS.H - BS.TOP) / 24);
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
  const cook = function* (st, still) {  // pose sur le poste libre, attend la cuisson, reprend
    if (!(yield* bsGo(free(st), 'use'))) return;
    const k = bs.lastK; while (bs.items.get(k)?.s === still) yield; yield* bsGo(kk => kk === k, 'use');
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
    if (t === 'pain' || t === 'creme') { yield* bsGo(k => BS_CRATE[bsCk(k)] === t, 'use'); yield* bsGo(k => k === pl, 'use'); continue; }
    if (t === 'viande') { yield* prep('viande'); yield* cook('S', 'hache'); }
    else if (t === 'frites') { yield* prep('patate'); yield* cook('U', 'hache'); }
    else if (t === 'pizza') {  // la pâte sur un plan libre, garnie de tomate puis de fromage, puis au four
      yield* bsGo(k => bsCk(k) === 'E', 'use'); yield* bsGo(free('#'), 'use'); const pk = bs.lastK;
      for (const top of ['tomate', 'fromage']) { yield* prep(top); yield* bsGo(k => k === pk, 'use'); }
      yield* bsGo(k => k === pk, 'use'); yield* cook('Z', 'cru');
    } else yield* prep(t);
    yield* bsGo(k => k === pl, 'use');
  }
  yield* bsGo(k => k === pl, 'use'); yield* bsGo(k => bsCk(k) === 'X', 'use');
}
{  // vérification : chaque cuisine est bien dessinée, ses postes sont accessibles, et le cuisinier automatique y sert des plats (son score fixe les étoiles) ;
   // les règles de l'assiette, de la pâte, de la poêle, de la friteuse et du four
  const bad = [], keep = bs, keepS = JSON.stringify(bss);
  bsMute = true;
  for (let li = 0; li < BS_LEVELS.length; li++) {
    const L = BS_LEVELS[li];
    if (L.map.length !== BS.ROWS || L.map.some(r => r.length !== BS.COLS)) { bad.push(L.name + ' : plan'); continue; }
    bs = null; bsNew(li);
    const reach = new Set(); { const q = [[9, 5]]; reach.add(bsKey(9, 5)); for (let i = 0; i < q.length; i++) for (const [dx, dy] of DIRS) { const nx = q[i][0] + dx, ny = q[i][1] + dy; if (bsFloor(nx, ny) && !reach.has(bsKey(nx, ny))) { reach.add(bsKey(nx, ny)); q.push([nx, ny]); } } }
    if (!bsFloor(9, 5)) bad.push(L.name + ' : départ');
    L.map.forEach((row, y) => [...row].forEach((c, x) => { if (!'.#WH'.includes(c) && !BS_BELT[c] && !DIRS.some(([dx, dy]) => reach.has(bsKey(x + dx, y + dy)))) bad.push(L.name + ' : ' + c + ' inaccessible'); if (c === 'X' && x !== 19) bad.push(L.name + ' : passe pas à droite'); }));
    bs.mode = 'play'; bs.count = 120; bs.bot = bsBotRun();
    while (bs.mode === 'play') bsUpdate();
    if (bs.served < 4) bad.push(L.name + ' : ' + bs.served + ' plats');
    bsGoals[li] = [.4, .7, .95].map(f => Math.max(10, Math.round(bs.score * f / 10) * 10));
  }
  bs = null; bsNew(1); bs.mode = 'play'; bs.count = 120;
  const plate = {t: 'assiette', parts: []};
  if (bsAdd(plate, {t: 'tomate', s: 'cru'})) bad.push('tomate crue dans l’assiette');
  if (!bsAdd(plate, {t: 'tomate', s: 'hache'}) || bsAdd(plate, {t: 'pain', s: 'cru'}) || bsAdd(plate, {t: 'viande', s: 'brule'})) bad.push('assiette mal dressée');
  const pate = {t: 'pate', s: 'cru', parts: [], k: 0};
  if (bsTop(pate, {t: 'tomate', s: 'cru'}) || !bsTop(pate, {t: 'tomate', s: 'hache'}) || bsTop(pate, {t: 'tomate', s: 'hache'}) || !bsTop(pate, {t: 'fromage', s: 'hache'})) bad.push('pâte mal garnie');
  if (!bsAdd({t: 'assiette', parts: []}, {...pate, s: 'cuit'}) || !bsAdd({t: 'assiette', parts: ['creme']}, {t: 'fraise', s: 'hache'})) bad.push('pizza ou dessert refusés');
  bs.x = 7 * 12 + 6; bs.y = 2 * 12 + 6; bs.dir = [-1, 0]; bs.hand = {t: 'viande', s: 'cru', c: 0, k: 0, parts: []}; bsUse();
  if (bs.items.size) bad.push('steak cru sur le feu');
  bs.hand.s = 'hache'; bsUse(); for (let i = 0; i < BS_COOKS.S.cook + 5; i++) bsUpdate();
  if (bs.items.get(bsKey(6, 2))?.s !== 'cuit') bad.push('le steak ne cuit pas');
  for (let i = 0; i < BS_COOKS.S.burn; i++) bsUpdate();
  if (bs.items.get(bsKey(6, 2))?.s !== 'brule') bad.push('le steak ne brûle pas');
  { const li = BS_LEVELS.findIndex(L => L.name === 'Tapis roulant'); bs = null; bsNew(li); bs.mode = 'play'; bs.count = 120; bs.next = 1e9; bs.items.set(bsKey(10, 3), {t: 'pain', s: 'cru', c: 0, k: 0, parts: []});
    for (let i = 0; i < 24 * 4; i++) bsUpdate(); if (bs.items.get(bsKey(13, 3))?.t !== 'pain') bad.push('le tapis ne porte pas le pain de l’autre côté');
    bs.items.set(bsKey(12, 7), {t: 'tomate', s: 'cru', c: 0, k: 0, parts: []}); for (let i = 0; i < 24 * 3; i++) bsUpdate(); if (bs.items.get(bsKey(10, 7))?.t !== 'tomate') bad.push('le tapis du retour ne marche pas');
    bs = null; bsNew(li + 1); bs.mode = 'play'; bs.count = 120; bs.next = 1e9; bs.x = 8 * 12 + 6; const x0 = bs.x; bs.t = Math.round(150 * Math.PI / 2) - 1; for (let i = 0; i < 20; i++) bsUpdate();
    if (!(bs.x > x0 + 4) || !bs.tilting) bad.push('le bateau ne pousse pas : ' + x0 + ' → ' + bs.x); }
  console.assert(!bad.length, 'bistrot', bad); view.dataset.selfcheck = bad.length ? bad.join(' ; ') : 'ok';
  Object.assign(bss, JSON.parse(keepS)); for (const k of Object.keys(bss)) if (!(k in JSON.parse(keepS))) delete bss[k];
  bs = keep; bsMute = false;
}
// les trophées, tirés des statistiques et des records gardés (aussi à l'ouverture : ce qui a été fait avant compte)
function bsTrophies() {
  const s = BS_LEVELS.map((_, i) => bss.stars[i] || 0), n = s.reduce((a, x) => a + x, 0), sig = [bss.games, bss.served, bss.tips, n].join(); if (sig === bsTrophies.sig) return; bsTrophies.sig = sig;
  trophyRecord('servis', bss.served || null); trophyRecord('etoiles', n || null);
  if (bss.games >= 1) trophy('premier'); if (bss.served >= 100) trophy('cent'); if (bss.served >= 1000) trophy('mille');
  if (s.some(x => x >= 3)) trophy('etoiles3'); if (s.every(x => x >= 1)) trophy('cuisines'); if (s.every(x => x >= 3)) trophy('chef'); if (bss.tips >= 1000) trophy('pourboires');
}
ctx.onOpen(() => {
  if (!bs || !bs.g) { bsNew(bsUnlocked(bss.level) ? bss.level : 0); bs.g = $('bsCanvas').getContext('2d'); }
  if (bs.mode === 'pause' && bs.count < 120) bs.mode = 'play';
  $('bsCanvas').__bs = {st: () => bs, level: li => { bss.level = li; bsNew(li); }, start: bsStart, ff: n => { for (let i = 0; i < n && bs.mode === 'play'; i++) bsUpdate(); }, bot: on => { bs.bot = on ? bsBotRun() : null; }};
  gameLoop(bs, 'bistrot', bsUpdate, bsDraw); bsInfo();
});
}
