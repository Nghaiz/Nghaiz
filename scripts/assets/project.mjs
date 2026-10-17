// Featured project cards on the night-sky card: category line, title, short pitch, stack.
import { C } from '../lib/theme.mjs';
import { text } from '../lib/type.mjs';
import { doc, nightCard, fmt } from '../lib/svg.mjs';
import { glint } from '../lib/fx.mjs';

const W = 600;
const H = 250;

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
  const accent = C[p.accent];
  const kind = text(p.kind, { font: 'montb', size: 12, x: 34, y: 46, tracking: 2.5 });
  const title = text(p.title, { font: 'montb', size: 26, x: 34, y: 86 });
  const lines = wrap(p.desc, 'mont', 15, W - 72).slice(0, 3);
  const desc = lines.map((l, i) => text(l, { font: 'mont', size: 15, x: 34, y: 128 + i * 23 }).d).join('');
  let x = 34;
  let tags = '';
  for (const t of p.tags) {
    const td = text(t, { font: 'montb', size: 12, x: x + 12, y: 214 });
    tags += `<rect x="${x}" y="197" width="${fmt(td.width + 24)}" height="25" rx="12.5" fill="none" stroke="${accent}" stroke-opacity=".55"/><path d="${td.d}" fill="${C.text}"/>`;
    x += td.width + 32;
  }
  const team = !p.repo.startsWith(`${login}/`);
  const repo = text(team ? `${p.repo}  ·  team` : p.repo, { font: 'mont', size: 12, x: W - 34, y: 46, anchor: 'end' });
  const style = `${card.css}
    @keyframes up{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:none}} .up{animation:up .9s ease-out both}
    @keyframes bar{0%{transform:scaleX(0)}100%{transform:scaleX(1)}} .bar{transform-box:fill-box;transform-origin:left;animation:bar 1.2s cubic-bezier(.3,0,.2,1) .3s both}
    @keyframes tw{0%,100%{transform:scale(.5) rotate(0);opacity:.4}50%{transform:scale(1) rotate(45deg);opacity:1}} .tw{transform-box:fill-box;transform-origin:center;animation:tw 3.4s ease-in-out infinite}`;
  const body = `${card.svg}
    <rect class="bar" x="34" y="102" width="46" height="2.5" rx="1.25" fill="${accent}"/>
    <g class="up"><path d="${kind.d}" fill="${accent}"/><path d="${repo.d}" fill="${C.faint}"/>
      <path d="${title.d}" fill="${C.text}"/><path d="${desc}" fill="${C.soft}"/>${tags}</g>
    <g transform="translate(${W - 40} 82)"><g class="tw">${glint(7, accent)}</g></g>`;
  return doc({ width: W, height: H, title: p.title, desc: p.desc, style, defs: card.defs, body });
}
