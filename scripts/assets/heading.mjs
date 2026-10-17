// Section headings: script title + Japanese mincho note + a thin comet line that draws in.
// Transparent background, so each heading ships a light and a dark variant for <picture>.
import { HEADING } from '../lib/theme.mjs';
import { text } from '../lib/type.mjs';
import { doc } from '../lib/svg.mjs';
import { glint } from '../lib/fx.mjs';

const W = 1200;
const H = 110;

export function heading({ title, jp }, mode = 'light') {
  const t = HEADING[mode];
  const head = text(title, { font: 'fuzzy', size: 46, x: 24, y: 70 });
  const note = text(jp, { font: 'mincho', size: 19, x: 24 + head.width + 18, y: 66 });
  const end = 24 + head.width + 18 + note.width;
  const style = `
    @keyframes draw{to{stroke-dashoffset:0}} .ln{stroke-dasharray:1300;stroke-dashoffset:1300;animation:draw 1.6s cubic-bezier(.3,0,.2,1) .2s forwards}
    @keyframes tw{0%,100%{transform:scale(.6) rotate(0);opacity:.6}50%{transform:scale(1.1) rotate(45deg);opacity:1}} .tw{transform-box:fill-box;transform-origin:center;animation:tw 3s ease-in-out infinite}
    @keyframes fade{0%{opacity:0;transform:translateY(6px)}100%{opacity:1;transform:none}} .fade{animation:fade 1s ease-out both}`;
  const defs = `<linearGradient id="lnG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.accent}"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></linearGradient>`;
  const body = `<g class="fade"><path d="${head.d}" fill="${t.ink}"/><path d="${note.d}" fill="${t.soft}"/></g>
    <path class="ln" d="M28 92H${Math.round(end + 120)}" stroke="url(#lnG)" stroke-width="2" stroke-linecap="round"/>
    <g transform="translate(28 92)"><g class="tw">${glint(6, t.accent)}</g></g>`;
  return doc({ width: W, height: H, title: `${title} · ${jp}`, desc: `Section: ${title}`, style, defs, body });
}

/** Compact centred sub-label (e.g. inside the tech stack section). */
export function sublabel({ title }, mode = 'light') {
  const t = HEADING[mode];
  const W2 = 1200;
  const H2 = 64;
  const head = text(title, { font: 'fuzzy', size: 28, x: W2 / 2, y: 42, anchor: 'middle' });
  const half = head.width / 2;
  const style = '@keyframes tw{0%,100%{transform:scale(.6) rotate(0);opacity:.6}50%{transform:scale(1.1) rotate(45deg);opacity:1}} .tw{transform-box:fill-box;transform-origin:center;animation:tw 3s ease-in-out infinite}';
  const body = `<path d="${head.d}" fill="${t.ink}"/>
    <path d="M${W2 / 2 - half - 150} 32H${W2 / 2 - half - 24}M${W2 / 2 + half + 24} 32H${W2 / 2 + half + 150}" stroke="${t.accent}" stroke-opacity=".6" stroke-width="1.5" stroke-linecap="round"/>
    <g transform="translate(${W2 / 2 - half - 24} 32)"><g class="tw">${glint(5, t.accent)}</g></g><g transform="translate(${W2 / 2 + half + 24} 32)"><g class="tw" style="animation-delay:-1.5s">${glint(5, t.accent)}</g></g>`;
  return doc({ width: W2, height: H2, title, desc: title, style, body });
}
