// Project cards as journal pages: a big doodle sticker, handwritten title, a short story, and the
// stack as little logo stickers. One light and one dark tone per project.
import { words as text, measure } from '../lib/type.mjs';
import { doc, fmt } from '../lib/svg.mjs';
import { doodle, PAPER } from '../lib/doodles.mjs';
import { TONES, INK, JOURNAL_CSS, paperDefs, paperBg, paperBorder, sticker, squiggle, tape, inkHeart } from '../lib/journal.mjs';
import { logo } from '../lib/images.mjs';

const W = 600;
const H = 330;

export function wrap(str, font, size, maxW) {
  const lines = [];
  let cur = '';
  for (const w of str.split(' ')) {
    const next = cur ? `${cur} ${w}` : w;
    if (cur && measure(next, { font, size }) > maxW) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  return cur ? [...lines, cur] : lines;
}

export function project(p, login, tone, seed) {
  const t = TONES[tone];
  const title = text(p.title, { font: 'fuzzy', size: 28, x: 146, y: 74 });
  const kind = text(p.kind, { font: 'fuzzyR', size: 15, x: 148, y: 108 });
  const lines = wrap(p.desc, 'fuzzyR', 17, W - 64).slice(0, 3);
  const desc = lines.map((l, i) => text(l, { font: 'fuzzyR', size: 17, x: 32, y: 166 + i * 27 }).paint(t.ink, 'fill-opacity=".86"')).join('');
  let x = 30;
  let chips = '';
  p.tags.forEach((tag, i) => {
    const name = text(tag, { font: 'fuzzyR', size: 15, x: x + 44, y: 289 });
    const w = name.width + 58;
    if (x + w > W - 24) return;
    chips += sticker(tone, { x, y: 264, w, h: 38, fill: '#FFFFFF', r: 12, border: 3, rot: i % 2 ? 1 : -1, delay: 0.5 + i * 0.08, content: logo(tag, x + 23, 283, 22) + `${name.paint(`${INK}`)}` });
    x += w + 10;
  });
  const team = !p.repo.startsWith(`${login}/`);
  const teamNote = team ? text('with my team', { font: 'fuzzyR', size: 15, x: W - 52, y: 42, anchor: 'end' }) : null;
  const body = `<g clip-path="url(#card)">${paperBg(tone, { w: W, h: H })}
    ${sticker(tone, { x: 28, y: 30, w: 98, h: 98, fill: PAPER[p.tint], rot: -4, r: 22, content: doodle(p.doodle, { x: 77, y: 79, size: 68, ink: INK }) })}
    ${tape(70, 30, -18, p.tape || 'rose', 64, 20)}
    ${title.paint(`${t.ink}`)}${squiggle(146, 146 + title.width, 86, t.squiggle, seed)}${kind.paint(`${t.soft}`)}
    ${teamNote ? `${teamNote.paint(`${t.soft}`)}${inkHeart(W - 36, 37, t.squiggle, 0.6)}` : ''}
    ${desc}
    ${chips}</g>
    ${paperBorder(tone, { w: W, h: H })}`;
  return doc({ width: W, height: H, title: p.title, desc: p.desc, style: JOURNAL_CSS, defs: paperDefs(tone, { w: W, h: H }), body });
}
