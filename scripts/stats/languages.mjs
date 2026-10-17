// "Languages" card: a donut whose arcs draw in one after another, plus a legend.
import { C, SERIES } from '../lib/theme.mjs';
import { text } from '../lib/type.mjs';
import { doc, nightCard, fmt } from '../lib/svg.mjs';
import { cardTitle } from './overview.mjs';

const W = 600;
const H = 300;
// Not code written by hand: HTML here is exported reports, TeX is write-ups, and notebook
// size is dominated by stored outputs.
const EXCLUDED = ['HTML', 'TeX', 'Jupyter Notebook'];
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
  const card = nightCard({ w: W, h: H, seed: 5 });
  const items = shares(d.languages);
  const cx = 140;
  const cy = 190;
  const R = 62;
  const circ = 2 * Math.PI * R;
  let acc = 0;
  const arcs = items
    .map((it, i) => {
      const len = Math.max(it.share * circ - 3, 0.5);
      const arc = `<circle class="arc" cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${SERIES[i % SERIES.length]}" stroke-width="16" stroke-dasharray="${fmt(len)} ${fmt(circ)}" stroke-dashoffset="${fmt(-acc)}" transform="rotate(-90 ${cx} ${cy})" style="--len:${fmt(len)};animation-delay:${fmt(0.2 + i * 0.18)}s"/>`;
      acc += it.share * circ;
      return arc;
    })
    .join('');
  const topPct = text(`${Math.round(items[0].share * 100)}%`, { font: 'montb', size: 24, x: cx, y: cy + 4, anchor: 'middle' });
  const topName = text(items[0].name, { font: 'mont', size: 11, x: cx, y: cy + 22, anchor: 'middle' });
  const legend = items
    .map((it, i) => {
      const y = 126 + i * 24;
      const n = text(it.name, { font: 'mont', size: 14, x: 290, y });
      const p = text(`${(it.share * 100).toFixed(1)}%`, { font: 'montb', size: 13, x: W - 36, y, anchor: 'end' });
      return `<g class="in" style="animation-delay:${fmt(0.3 + i * 0.08)}s"><circle cx="274" cy="${y - 5}" r="5" fill="${SERIES[i % SERIES.length]}"/><path d="${n.d}" fill="${C.text}"/><path d="${p.d}" fill="${C.soft}"/></g>`;
    })
    .join('');
  const style = `${card.css}
    @keyframes in{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:none}} .in{animation:in .8s ease-out both}
    @keyframes arc{from{stroke-dasharray:0 1000}} .arc{animation:arc .9s ease-out both}`;
  const body = `${card.svg}
    <g class="in">${cardTitle('PUBLIC REPOS  ·  BY CODE SIZE', 'Languages', C.sunset)}</g>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#FFFFFF" stroke-opacity=".06" stroke-width="16"/>
    ${arcs}
    <g class="in" style="animation-delay:.9s"><path d="${topPct.d}" fill="${C.text}"/><path d="${topName.d}" fill="${C.soft}"/></g>
    ${legend}`;
  return doc({ width: W, height: H, title: 'Languages', desc: items.map((i) => `${i.name} ${(i.share * 100).toFixed(1)}%`).join(', '), style, defs: card.defs, body });
}
