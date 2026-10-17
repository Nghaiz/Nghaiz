// Section headings: a small comet-star + serif title + Japanese note + hand-drawn underline.
// Transparent background, so each heading ships a light and a dark variant for <picture>.
import { C, DARK } from '../lib/theme.mjs';
import { text } from '../lib/type.mjs';
import { doc, wobble } from '../lib/svg.mjs';

const W = 1200;
const H = 96;

export function heading({ title, jp, seed = 1 }, mode = 'light') {
  const ink = mode === 'dark' ? DARK.ink : C.ink;
  const soft = mode === 'dark' ? DARK.inkSoft : C.inkSoft;
  const line = mode === 'dark' ? DARK.accent : C.sky;
  const t = text(title, { font: 'gentium', size: 40, x: 74, y: 58 });
  const j = text(jp, { font: 'klee', size: 22, x: 74 + t.width + 18, y: 56 });
  const end = 74 + t.width + 18 + j.width + 24;
  const mark = `<g transform="translate(40 50)"><path d="M0 0L-26 14" stroke="url(#tailG)" stroke-width="3" stroke-linecap="round"/><g class="tw"><path d="M0 -11Q1.2 -1.2 11 0Q1.2 1.2 0 11Q-1.2 1.2 -11 0Q-1.2 -1.2 0 -11Z" fill="${line}"/></g></g>`;
  const style = `
    @keyframes draw{to{stroke-dashoffset:0}} .ul{stroke-dasharray:1600;stroke-dashoffset:1600;animation:draw 1.8s ease-out .3s forwards}
    @keyframes tw{0%,100%{transform:scale(.8) rotate(0);opacity:.7}50%{transform:scale(1.15) rotate(45deg);opacity:1}} .tw{transform-box:fill-box;transform-origin:center;animation:tw 3.2s ease-in-out infinite}
    @keyframes fade{0%{opacity:0;transform:translateY(6px)}100%{opacity:1;transform:none}} .fade{animation:fade 1s ease-out both}
  `;
  const defs = `<linearGradient id="tailG" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${line}"/><stop offset="1" stop-color="${line}" stop-opacity="0"/></linearGradient>`;
  const body = `${mark}
  <g class="fade"><path d="${t.d}" fill="${ink}"/><path d="${j.d}" fill="${soft}"/></g>
  <path class="ul" d="${wobble(70, end, 78, seed)}" stroke="${line}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  return doc({ width: W, height: H, title: `${title} · ${jp}`, desc: `Section: ${title}`, style, defs, body });
}
