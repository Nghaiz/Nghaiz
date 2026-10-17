// Featured project cards on the nebula card: mincho category line, script title, pitch, stack.
import { C } from '../lib/theme.mjs';
import { text } from '../lib/type.mjs';
import { doc, nightCard, GRAD, fmt } from '../lib/svg.mjs';

const W = 600;
const H = 300;

export function wrap(str, font, size, maxW) {
  const lines = [];
  let cur = '';
  for (const w of str.split(' ')) {
    const next = cur ? `${cur} ${w}` : w;
    if (cur && text(next, { font, size }).width > maxW) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  return cur ? [...lines, cur] : lines;
}

export function project(p, login, seed) {
  const card = nightCard({ w: W, h: H, seed });
  const accent = GRAD[p.accent][1];
  const kind = text(p.kind, { font: 'mincho', size: 15, x: 34, y: 48, tracking: 2 });
  const title = text(p.title, { font: 'vibes', size: 56, x: 32, y: 112 });
  const lines = wrap(p.desc, 'minchoM', 18, W - 70).slice(0, 3);
  const desc = lines.map((l, i) => text(l, { font: 'minchoM', size: 18, x: 34, y: 158 + i * 28 }).d).join('');
  let x = 34;
  let tags = '';
  for (const t of p.tags) {
    const td = text(t, { font: 'mincho', size: 15, x: x + 15, y: 264 });
    tags += `<rect x="${x}" y="243" width="${fmt(td.width + 30)}" height="30" rx="15" fill="${accent}" fill-opacity=".14" stroke="${accent}" stroke-opacity=".7"/><path d="${td.d}" fill="#FFFFFF"/>`;
    x += td.width + 40;
  }
  const team = !p.repo.startsWith(`${login}/`);
  const note = team ? text('team project', { font: 'vibes', size: 28, x: W - 34, y: 52, anchor: 'end' }) : null;
  const style = `${card.css}
    @keyframes up{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:none}} .up{animation:up .9s ease-out both}`;
  const body = `${card.svg}
    <g class="up"><path d="${kind.d}" fill="${accent}"/>${note ? `<path d="${note.d}" fill="${C.soft}"/>` : ''}
      <path d="${title.d}" fill="#FFFFFF"/><path d="${desc}" fill="#D3DDF5"/>${tags}</g>`;
  return doc({ width: W, height: H, title: p.title, desc: p.desc, style, defs: card.defs, body });
}
