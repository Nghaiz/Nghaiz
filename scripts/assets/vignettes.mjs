// Little moving scenes for the toolbox cards. Each one acts out what its group is for, in the empty
// right corner of the card header, and loops on the shared CYCLE so every card stays alive however
// late the viewer scrolls to it. Picked per group by `scene` in stack.config.mjs.
import { words as text, measure } from '../lib/type.mjs';
import { fmt, rng, CYCLE, keyframes, loop } from '../lib/svg.mjs';
import { doodle, PAPER } from '../lib/doodles.mjs';
import { TONES, INK, sticker, tape } from '../lib/journal.mjs';
import { logo } from '../lib/images.mjs';

/** Where a scene may draw, in card coordinates: the header's right corner, above the first tile row. */
export const SCENE_BOX = { x: 360, y: 14, w: 218, h: 92 };

const CODE = { font: 'fuzzy', max: 18, min: 14 };
const TYPE_STEP = 0.09; // seconds per typed character
const ORIGIN = { center: 'transform-box:fill-box;transform-origin:center;', left: 'transform-box:fill-box;transform-origin:left;' };

/** Languages: a code note types a hello in one language letter by letter, then hands over to the next. */
function typing(tone, b, { snippets }) {
  const N = snippets.length;
  if (N < 2) throw new Error('The typing scene rotates between snippets; give it at least two.');
  const T = CYCLE * N;
  const note = { x: b.x + 6, y: b.y + 18, w: b.w - 12, h: 66 };
  const textX = note.x + 52;
  const maxW = note.x + note.w - 14 - textX;
  const base = note.y + note.h / 2 + 7;
  // A letter shows from its keystroke until its snippet has faded out, then waits for its next turn.
  let css = keyframes('tyL', T, [[0, 'opacity:0'], [[0.04, CYCLE - 0.1], 'opacity:1'], [[CYCLE - 0.06, T], 'opacity:0']]) + loop('tyL', T, 0, '', 'linear');
  const lines = snippets
    .map(([lang, code], k) => {
      let size = CODE.max;
      while (measure(code, { font: CODE.font, size }) > maxW) {
        size -= 0.5;
        if (size < CODE.min) throw new Error(`Typing snippet "${code}" is too long for the code note; shorten it.`);
      }
      if (0.5 + code.length * TYPE_STEP > CYCLE - 2) throw new Error(`Typing snippet "${code}" takes too long to type; shorten it.`);
      const slot = 0.8 + k * CYCLE; // snippet k owns slot k of the rotation
      const at = (i) => measure(code.slice(0, i), { font: CODE.font, size });
      const letters = [...code]
        .map((ch, i) => (/\s/.test(ch) ? '' : `<g class="tyL" style="animation-delay:${fmt(slot + 0.5 + i * TYPE_STEP)}s">${text(ch, { font: CODE.font, size, x: textX + at(i), y: base }).paint(INK)}</g>`))
        .join('');
      const caret = [[0, 'transform:none'], ...[...code].map((_, i) => [0.5 + i * TYPE_STEP, `transform:translateX(${fmt(at(i + 1) + 2)}px)`]), [T, 'transform:none']];
      css += keyframes(`tyS${k}`, T, [[0, 'opacity:0'], [0.3, 'opacity:1'], [CYCLE - 0.5, 'opacity:1'], [[CYCLE - 0.2, T], 'opacity:0']]) + loop(`tyS${k}`, T, slot);
      css += keyframes(`tyK${k}`, T, caret) + loop(`tyK${k}`, T, slot, '', 'step-end');
      return `<g class="tyS${k}">${logo(lang, note.x + 28, note.y + note.h / 2, 28)}${letters}
        <g class="tyK${k}"><rect class="caret" x="${fmt(textX + 1)}" y="${fmt(base - 17)}" width="2.2" height="21" rx="1" fill="${INK}"/></g></g>`;
    })
    .join('');
  css += keyframes('caret', 1, [[[0, 0.5], 'opacity:1'], [[0.51, 1], 'opacity:0']]) + loop('caret', 1, 0, '', 'linear');
  css += `@media (prefers-reduced-motion:reduce){${snippets.slice(1).map((_, k) => `.tyS${k + 1},`).join('')}.caret{display:none}}`;
  const svg = `${sticker(tone, { ...note, fill: '#FFFFFF', r: 14, rot: -2, delay: 0.5, content: lines })}${tape(note.x + note.w / 2, note.y + 1, -4, 'blue', 52, 16)}`;
  return { css, svg };
}

/** Apps & games: a cursor clicks the address bar, the page loads, then its blocks pop in. */
function browser(tone, b) {
  const t = TONES[tone];
  const P = CYCLE;
  const win = { x: b.x + 8, y: b.y + 8, w: 156, h: 82 };
  const inner = { x: win.x + 14, w: win.w - 28 };
  const half = (inner.w - 8) / 2;
  const blocks = [
    [inner.x, win.y + 30, inner.w, PAPER.blue],
    [inner.x, win.y + 54, half, PAPER.peach],
    [inner.x + half + 8, win.y + 54, half, PAPER.sage],
  ];
  let css = keyframes('brL', P, [[[0, 0.6], 'opacity:1;transform:scaleX(0)'], [1.7, 'opacity:1;transform:scaleX(1)'], [[2, P], 'opacity:0;transform:scaleX(1)']]) + loop('brL', P, 0, `opacity:0;${ORIGIN.left}`);
  const pages = blocks
    .map(([x, y, w, fill], i) => {
      const at = 2 + i * 0.25;
      css += keyframes(`brB${i}`, P, [[[0, at], 'opacity:0;transform:scale(.6)'], [[at + 0.4, P - 1], 'opacity:1;transform:none'], [[P - 0.6, P], 'opacity:0;transform:none']]) + loop(`brB${i}`, P, 0, ORIGIN.center);
      return `<rect class="brB${i}" x="${fmt(x)}" y="${y}" width="${fmt(w)}" height="18" rx="5" fill="${fill}" stroke="${INK}" stroke-width="1.2"/>`;
    })
    .join('');
  const dots = [PAPER.roseDeep, PAPER.butter, PAPER.sageDeep].map((fill, i) => `<circle cx="${win.x + 16 + i * 11}" cy="${win.y + 14}" r="3.4" fill="${fill}" stroke="${INK}" stroke-width="1.2"/>`).join('');
  const content = `${dots}<path d="M${win.x + 4} ${win.y + 23}H${win.x + win.w - 4}" stroke="${INK}" stroke-opacity=".3" stroke-width="1.4"/>
    <rect x="${win.x + 50}" y="${win.y + 9}" width="${win.w - 62}" height="10" rx="5" fill="none" stroke="${INK}" stroke-opacity=".35" stroke-width="1.3"/>
    <rect class="brL" x="${inner.x}" y="${win.y + 40}" width="${inner.w}" height="7" rx="3.5" fill="${PAPER.lavender}" stroke="${INK}" stroke-width="1.2"/>${pages}`;
  // the cursor rests beside the window and travels to the address bar to click it
  const rest = [win.x + win.w + 20, win.y + 56];
  const target = [win.x + win.w - 22, win.y + 14];
  const go = `transform:translate(${fmt(target[0] - rest[0])}px,${fmt(target[1] - rest[1])}px)`;
  css += keyframes('brM', P, [[[0, 0.1], 'transform:none'], [[0.6, 0.85], go], [[1.6, P], 'transform:none']]) + loop('brM', P);
  css += keyframes('brR', P, [[[0, 0.6], 'opacity:0;transform:scale(.3)'], [0.75, 'opacity:1;transform:scale(.7)'], [[1.25, P], 'opacity:0;transform:scale(1.5)']]) + loop('brR', P, 0, `opacity:0;${ORIGIN.center}`);
  const cursor = `<circle class="brR" cx="${target[0]}" cy="${target[1]}" r="9" fill="none" stroke="${t.squiggle}" stroke-width="2"/>
    <g transform="translate(${rest[0]} ${rest[1]})"><g class="brM"><path d="M0 0V18L4.6 13.6 8 21 11.2 19.6 7.8 12.2H14Z" fill="#FFFBF3" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/></g></g>`;
  return { css, svg: `${sticker(tone, { ...win, fill: '#FFFFFF', r: 11, rot: -2, delay: 0.4, content })}${cursor}` };
}

/** Backend: a request rides the wire from one server to the other and the response comes back. */
function packets(tone, b) {
  const t = TONES[tone];
  const S = 58;
  const left = { x: b.x + 2, y: b.y + 24 };
  const right = { x: b.x + b.w - S - 2, y: b.y + 24 };
  const y = left.y + S / 2;
  const x1 = left.x + S + 8;
  const x2 = right.x - 8;
  const D = x2 - x1;
  const trip = CYCLE / 3;
  const ride = (dir, from, to) => [[[0, from], `opacity:0;transform:translateX(0)`], [from + 0.2, `opacity:1;transform:translateX(${fmt(dir * 8)}px)`], [to - 0.2, `opacity:1;transform:translateX(${fmt(dir * (D - 8))}px)`], [[to, trip], `opacity:0;transform:translateX(${fmt(dir * D)}px)`]];
  let css = keyframes('pkA', trip, ride(1, 0, 1.3)) + loop('pkA', trip) + keyframes('pkB', trip, ride(-1, 1.5, 2.8)) + loop('pkB', trip);
  css += keyframes('pkR', trip, [[[0, 1.1], 'opacity:.3'], [[1.3, 1.7], 'opacity:1'], [[2, trip], 'opacity:.3']]) + loop('pkR', trip);
  css += keyframes('pkL', trip, [[[0, 0.1], 'opacity:1'], [[0.4, 2.6], 'opacity:.3'], [[2.8, trip], 'opacity:1']]) + loop('pkL', trip);
  css += '@media (prefers-reduced-motion:reduce){.pkA,.pkB{display:none}}';
  const envelope = (fill) => `<rect x="-9" y="-6.5" width="18" height="13" rx="2.5" fill="${fill}" stroke="${INK}" stroke-width="1.4"/><path d="M-9 -6.5L0 1 9 -6.5" fill="none" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>`;
  const server = (p, fill, led, delay, rot) =>
    sticker(tone, { x: p.x, y: p.y, w: S, h: S, fill, r: 15, rot, delay, content: `${doodle('server', { x: p.x + S / 2, y: p.y + S / 2, size: 40, ink: INK })}<circle class="${led}" cx="${p.x + S - 11}" cy="${p.y + 11}" r="4" fill="${PAPER.sageDeep}" stroke="${INK}" stroke-width="1.2"/>` });
  const svg = `<path d="M${x1} ${y}H${x2}" stroke="${t.soft}" stroke-opacity=".7" stroke-width="2.2" stroke-dasharray="2 7" stroke-linecap="round"/>
    ${server(left, PAPER.sage, 'pkL', 0.4, -4)}${server(right, PAPER.blue, 'pkR', 0.5, 3)}
    <g transform="translate(${x1} ${y - 1})"><g class="pkA">${envelope(PAPER.butter)}</g></g>
    <g transform="translate(${x2} ${y + 1})"><g class="pkB">${envelope(PAPER.mint)}</g></g>`;
  return { css, svg };
}

/** Data & AI: a loss curve draws itself going down while the flask bubbles. */
function training(tone, b) {
  const t = TONES[tone];
  const P = CYCLE;
  const c = { x: b.x + 10, y: b.y + 18, w: 124, h: 68 };
  const r = rng(17);
  const pts = Array.from({ length: 9 }, (_, i) => [c.x + 10 + (i * (c.w - 18)) / 8, c.y + 8 + (c.h - 22) * (1 - Math.exp(-i / 2.4)) + (i && i < 8 ? (r() - 0.5) * 6 : 0)]);
  const len = Math.ceil(pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0)) + 4;
  let css = keyframes('trC', P, [[[0, 0.6], `stroke-dashoffset:${len}`], [[2.6, P - 1.2], 'stroke-dashoffset:0'], [[P - 0.6, P], `stroke-dashoffset:-${len}`]]) + loop('trC', P, 0, '', 'ease-out');
  const flask = { x: b.x + b.w - 70, y: b.y + 30, s: 62 };
  const bubbles = [[-4, 3], [5, 2.4], [-1, 3.4], [7, 2.2]]
    .map(([dx, rad], i) => {
      css += keyframes(`trB${i}`, P / 4, [[0, 'opacity:0;transform:none'], [0.4, 'opacity:.9'], [[1.9, P / 4], `opacity:0;transform:translate(${dx}px,-28px)`]]) + loop(`trB${i}`, P / 4, i * 0.55, 'opacity:0;');
      return `<circle class="trB${i}" cx="${flask.x + flask.s / 2 + (i % 2 ? 3 : -2)}" cy="${flask.y + 4}" r="${rad}" fill="none" stroke="${t.doodle}" stroke-width="1.5"/>`;
    })
    .join('');
  const svg = `<path d="M${c.x} ${c.y}V${c.y + c.h}H${c.x + c.w}" fill="none" stroke="${t.soft}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${c.x - 4} ${c.y + 6}L${c.x} ${c.y}L${c.x + 4} ${c.y + 6}M${c.x + c.w - 6} ${c.y + c.h - 4}L${c.x + c.w} ${c.y + c.h}L${c.x + c.w - 6} ${c.y + c.h + 4}" fill="none" stroke="${t.soft}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="trC" style="stroke-dasharray:${len}" d="M${pts.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join('L')}" fill="none" stroke="${t.squiggle}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    ${sticker(tone, { x: flask.x, y: flask.y, w: flask.s, h: flask.s, fill: PAPER.mint, r: 16, rot: 4, delay: 0.5, content: doodle('flask', { x: flask.x + flask.s / 2, y: flask.y + flask.s / 2, size: 44, ink: INK }) })}${bubbles}`;
  return { css, svg };
}

/** Databases: rows travel from the database into a little table and fill it in, one by one. */
function sync(tone, b) {
  const t = TONES[tone];
  const P = CYCLE;
  const db = { x: b.x + 2, y: b.y + 24, s: 60 };
  const tbl = { x: b.x + b.w - 114, y: b.y + 10, w: 110, h: 80 };
  const rows = [PAPER.blue, PAPER.rose, PAPER.mint].map((fill, i) => ({ fill, y: tbl.y + 38 + i * 15, w: [74, 60, 68][i], at: 1 + i * 0.55 }));
  let css = '';
  const fills = rows
    .map((row, i) => {
      css += keyframes(`syR${i}`, P, [[[0, row.at], 'transform:scaleX(0)'], [[row.at + 0.4, P - 1.2], 'transform:scaleX(1)'], [[P - 0.7, P], 'transform:scaleX(0)']]) + loop(`syR${i}`, P, 0, ORIGIN.left);
      return `<path d="M${tbl.x + 12} ${row.y}H${tbl.x + tbl.w - 12}" stroke="${INK}" stroke-opacity=".22" stroke-width="1.3" stroke-dasharray="2 4" stroke-linecap="round"/>
        <rect class="syR${i}" x="${tbl.x + 12}" y="${row.y - 4.5}" width="${row.w}" height="9" rx="4.5" fill="${row.fill}" stroke="${INK}" stroke-width="1.1"/>`;
    })
    .join('');
  const y = db.y + db.s / 2;
  const x1 = db.x + db.s + 6;
  const D = tbl.x - 6 - x1;
  const trips = rows.flatMap((row) => [[row.at - 0.5, 'opacity:1;transform:none'], [row.at - 0.05, `opacity:1;transform:translateX(${fmt(D)}px)`], [row.at, `opacity:0;transform:translateX(${fmt(D)}px)`], [row.at + 0.01, 'opacity:0;transform:none']]);
  css += keyframes('syD', P, [[0, 'opacity:0;transform:none'], ...trips, [P, 'opacity:0;transform:none']]) + loop('syD', P, 0, 'opacity:0;');
  const content = `<rect x="${tbl.x + 10}" y="${tbl.y + 11}" width="${tbl.w - 20}" height="13" rx="4" fill="${PAPER.butter}" stroke="${INK}" stroke-width="1.2"/>${fills}`;
  const svg = `<path d="M${x1} ${y}H${x1 + D}" stroke="${t.soft}" stroke-opacity=".7" stroke-width="2.2" stroke-dasharray="2 7" stroke-linecap="round"/>
    ${sticker(tone, { x: db.x, y: db.y, w: db.s, h: db.s, fill: PAPER.sage, r: 16, rot: -4, delay: 0.4, content: doodle('database', { x: db.x + db.s / 2, y: db.y + db.s / 2, size: 42, ink: INK }) })}
    ${sticker(tone, { ...tbl, fill: '#FFFFFF', r: 11, rot: 2, delay: 0.5, content })}
    <g transform="translate(${x1} ${y})"><circle class="syD" r="5" fill="${PAPER.butter}" stroke="${INK}" stroke-width="1.4"/></g>`;
  return { css, svg };
}

/** Everyday tools: the wrench gives a turn and each test on the checklist gets its tick. */
function checklist(tone, b) {
  const P = CYCLE;
  const list = { x: b.x + 4, y: b.y + 8, w: 130, h: 82 };
  const ticks = [0, 1, 2].map((i) => ({ y: list.y + 22 + i * 21, w: [72, 56, 64][i], at: 0.9 + i * 0.8 }));
  const TICK = 24;
  let css = '';
  const rows = ticks
    .map((row, i) => {
      css += keyframes(`ckT${i}`, P, [[[0, row.at], `stroke-dashoffset:${TICK}`], [[row.at + 0.35, P - 1], 'stroke-dashoffset:0'], [[P - 0.6, P], `stroke-dashoffset:${TICK}`]]) + loop(`ckT${i}`, P, 0, '', 'ease-out');
      const bx = list.x + 13;
      return `<rect x="${bx}" y="${row.y - 7}" width="14" height="14" rx="3" fill="#FFFBF3" stroke="${INK}" stroke-width="1.4"/>
        <rect x="${list.x + 36}" y="${row.y - 2.5}" width="${row.w}" height="5" rx="2.5" fill="${INK}" fill-opacity=".22"/>
        <path class="ckT${i}" style="stroke-dasharray:${TICK}" d="M${bx + 2.5} ${row.y - 0.5}L${bx + 6.5} ${row.y + 4}L${bx + 15} ${row.y - 8}" fill="none" stroke="${PAPER.moss}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
    })
    .join('');
  // the wrench turns just before each tick lands
  const turns = ticks.flatMap((row) => [[row.at - 0.35, 'transform:none'], [row.at - 0.05, 'transform:rotate(-18deg)'], [row.at + 0.3, 'transform:none']]);
  css += keyframes('ckW', P, [[0, 'transform:none'], ...turns, [P, 'transform:none']]) + loop('ckW', P, 0, ORIGIN.center);
  const w = { x: b.x + b.w - 70, y: b.y + 24, s: 62 };
  const svg = `${sticker(tone, { ...list, fill: '#FFFFFF', r: 11, rot: -2, delay: 0.4, content: rows })}
    ${sticker(tone, { x: w.x, y: w.y, w: w.s, h: w.s, fill: PAPER.peach, r: 16, rot: 5, delay: 0.5, content: `<g class="ckW">${doodle('wrench', { x: w.x + w.s / 2, y: w.y + w.s / 2, size: 44, ink: INK })}</g>` })}`;
  return { css, svg };
}

const SCENES = { typing, browser, packets, training, sync, checklist };

/** Scene for a toolbox group: { css, svg }, or nothing when the group has no `scene`. */
export function scene(tone, spec) {
  if (!spec) return { css: '', svg: '' };
  const cfg = typeof spec === 'string' ? { kind: spec } : spec;
  const draw = SCENES[cfg.kind];
  if (!draw) throw new Error(`Unknown toolbox scene "${cfg.kind}". Known: ${Object.keys(SCENES).join(', ')}`);
  return draw(tone, SCENE_BOX, cfg);
}
