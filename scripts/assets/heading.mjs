// Section headings: handwritten title + a Japanese note in Klee One + a thin line that draws in.
// Transparent background, so each heading ships a light and a dark variant for <picture>.
import { HEADING } from '../lib/theme.mjs';
import { words as text } from '../lib/type.mjs';
import { doc } from '../lib/svg.mjs';
import { glint } from '../lib/fx.mjs';

const W = 1200;
const H = 110;

export function heading({ title, jp, note }, mode = 'light') {
  const t = HEADING[mode];
  const head = text(title, { font: 'fuzzy', size: 46, x: 28, y: 70 });
  const kanji = text(jp, { font: 'klee', size: 20, x: 28 + head.width + 18, y: 66 });
  const aside = note ? text(note, { font: 'fuzzyR', size: 18, x: W - 28, y: 66, anchor: 'end' }) : null;
  const X1 = W - 28;
  const style = `
    @keyframes draw{to{stroke-dashoffset:0}} .ln{stroke-dasharray:1200;stroke-dashoffset:1200;animation:draw 1.6s cubic-bezier(.3,0,.2,1) .2s forwards}
    @keyframes tw{0%,100%{transform:scale(.6) rotate(0);opacity:.6}50%{transform:scale(1.1) rotate(45deg);opacity:1}} .tw{transform-box:fill-box;transform-origin:center;animation:tw 3s ease-in-out infinite}
    @keyframes fade{0%{opacity:0;transform:translateY(6px)}100%{opacity:1;transform:none}} .fade{animation:fade 1s ease-out both}`;
  // userSpaceOnUse: a horizontal line has a zero-height bounding box, and an objectBoundingBox
  // gradient on a zero-height box is invalid, which makes the stroke disappear entirely.
  const defs = `<linearGradient id="lnG" gradientUnits="userSpaceOnUse" x1="28" y1="0" x2="${X1}" y2="0"><stop offset="0" stop-color="${t.accent}"/><stop offset=".55" stop-color="${t.accent}" stop-opacity=".45"/><stop offset="1" stop-color="${t.accent}" stop-opacity=".05"/></linearGradient>`;
  const body = `<g class="fade">${head.paint(`${t.ink}`)}${kanji.paint(`${t.soft}`)}${aside ? `${aside.paint(`${t.soft}`)}` : ''}</g>
    <path class="ln" d="M28 92H${X1}" stroke="url(#lnG)" stroke-width="2" stroke-linecap="round"/>
    <g transform="translate(28 92)"><g class="tw">${glint(6, t.accent)}</g></g>`;
  return doc({ width: W, height: H, title: `${title} · ${jp}`, desc: note ? `${title}: ${note}` : `Section: ${title}`, style, defs, body });
}
