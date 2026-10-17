// "Languages" card: one rounded stacked bar that fills in, plus a two-column legend.
import { C, SERIES } from '../lib/theme.mjs';
import { text } from '../lib/type.mjs';
import { doc, card, fmt } from '../lib/svg.mjs';

const W = 600;
const H = 300;
// HTML in these repos is mostly exported reports, TeX is coursework write-ups — not code.
const EXCLUDED = ['HTML', 'TeX'];
const TOP = 6;

export function shares(languages) {
  const kept = languages.filter((l) => !EXCLUDED.includes(l.name)).sort((a, b) => b.bytes - a.bytes);
  const total = kept.reduce((s, l) => s + l.bytes, 0);
  if (!total) return [];
  const top = kept.slice(0, TOP).map((l) => ({ name: l.name, share: l.bytes / total }));
  const rest = kept.slice(TOP).reduce((s, l) => s + l.bytes, 0);
  if (rest > 0) top.push({ name: 'Other', share: rest / total });
  return top;
}

export function languagesCard(d) {
  const items = shares(d.languages);
  const title = text('Languages', { font: 'gentium', size: 28, x: 36, y: 54 });
  const jp = text('言語', { font: 'klee', size: 18, x: 36 + title.width + 12, y: 52 });
  const BX = 36;
  const BW = W - 72;
  let x = BX;
  let bar = '';
  items.forEach((it, i) => {
    const w = it.share * BW;
    bar += `<rect class="seg" x="${fmt(x)}" y="80" width="${fmt(Math.max(w - 2, 1))}" height="18" fill="${SERIES[i % SERIES.length]}" style="animation-delay:${fmt(0.2 + i * 0.12)}s"/>`;
    x += w;
  });
  const legend = items
    .map((it, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const lx = 40 + col * 270;
      const ly = 142 + row * 38;
      const name = text(it.name, { font: 'patrick', size: 22, x: lx + 22, y: ly });
      const pct = text(`${(it.share * 100).toFixed(1)}%`, { font: 'gentium', size: 18, x: lx + 240, y: ly, anchor: 'end' });
      return `<g class="in" style="animation-delay:${fmt(0.5 + i * 0.08)}s"><circle cx="${lx + 7}" cy="${ly - 7}" r="7" fill="${SERIES[i % SERIES.length]}"/><path d="${name.d}" fill="${C.ink}"/><path d="${pct.d}" fill="${C.inkSoft}"/></g>`;
    })
    .join('');
  const style = `@keyframes in{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:none}} .in{animation:in .8s ease-out both}
    @keyframes seg{0%{transform:scaleX(0)}100%{transform:scaleX(1)}} .seg{transform-box:fill-box;transform-origin:left;animation:seg .7s ease-out both}`;
  const defs = `<clipPath id="barClip"><rect x="${BX}" y="80" width="${BW}" height="18" rx="9"/></clipPath>`;
  const body = `${card({ w: W, h: H })}
    <path d="${title.d}" fill="${C.ink}"/><path d="${jp.d}" fill="${C.inkSoft}"/>
    <rect x="${BX}" y="80" width="${BW}" height="18" rx="9" fill="${C.paperDeep}"/>
    <g clip-path="url(#barClip)">${bar}</g>
    ${legend}`;
  return doc({ width: W, height: H, title: 'Languages', desc: items.map((i) => `${i.name} ${(i.share * 100).toFixed(1)}%`).join(', '), style, defs, body });
}
