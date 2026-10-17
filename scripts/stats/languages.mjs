// "Languages" card: a thick glowing donut whose arcs draw in one after another, and a legend.
import { C, SERIES } from '../lib/theme.mjs';
import { text } from '../lib/type.mjs';
import { doc, nightCard, glowing, fmt } from '../lib/svg.mjs';
import { cardTitle, IN_CSS } from './overview.mjs';

const W = 600;
const H = 360;
// Not hand-written code: HTML here is exported reports, TeX is write-ups, and notebook size is
// dominated by stored outputs.
const EXCLUDED = ['HTML', 'TeX', 'Jupyter Notebook'];
const TOP = 5;
const VIVID = ['#7FD6F5', '#FF8FB4', '#FFC864', '#A88CFF', '#7FE0B5', '#8A98C8'];

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
  const card = nightCard({ w: W, h: H, seed: 5 });
  const items = shares(d.languages);
  const cx = 150;
  const cy = 218;
  const R = 82;
  const circ = 2 * Math.PI * R;
  let acc = 0;
  const arcs = items
    .map((it, i) => {
      const len = Math.max(it.share * circ - 4, 0.5);
      const color = VIVID[i % VIVID.length];
      const arc = `<circle class="arc" cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${color}" stroke-width="24" stroke-dasharray="${fmt(len)} ${fmt(circ)}" stroke-dashoffset="${fmt(-acc)}" transform="rotate(-90 ${cx} ${cy})" style="animation-delay:${fmt(0.2 + i * 0.18)}s"/>`;
      acc += it.share * circ;
      return arc;
    })
    .join('');
  const pct = text(`${Math.round(items[0].share * 100)}%`, { font: 'mincho', size: 40, x: cx, y: cy + 8, anchor: 'middle' });
  const name = text(items[0].name, { font: 'vibes', size: 30, x: cx, y: cy + 40, anchor: 'middle' });
  const legend = items
    .map((it, i) => {
      const y = 134 + i * 36;
      const n = text(it.name, { font: 'minchoM', size: 21, x: 310, y });
      const p = text(`${(it.share * 100).toFixed(1)}%`, { font: 'mincho', size: 21, x: W - 36, y, anchor: 'end' });
      return `<g class="in" style="animation-delay:${fmt(0.35 + i * 0.08)}s"><circle cx="292" cy="${y - 7}" r="7" fill="${VIVID[i % VIVID.length]}"/><path d="${n.d}" fill="#FFFFFF"/><path d="${p.d}" fill="${C.soft}"/></g>`;
    })
    .join('');
  const style = `${card.css} ${IN_CSS}
    @keyframes arc{from{stroke-dasharray:0 1000}} .arc{animation:arc 1s ease-out both}`;
  const defs = `${card.defs}<filter id="ringBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter>`;
  const body = `${card.svg}
    <g class="in">${cardTitle('Languages', 'public repos, by size')}</g>
    <g filter="url(#ringBlur)" opacity=".5">${arcs}</g>
    ${arcs}
    <g class="in" style="animation-delay:1s">${glowing(pct.d, 'comet', 0.4)}<path d="${name.d}" fill="${C.soft}"/></g>
    ${legend}`;
  return doc({ width: W, height: H, title: 'Languages', desc: items.map((i) => `${i.name} ${(i.share * 100).toFixed(1)}%`).join(', '), style, defs, body });
}
