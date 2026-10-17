// "This year" card: the year's contribution total, then commits / PRs / issues / stars.
import { C } from '../lib/theme.mjs';
import { text } from '../lib/type.mjs';
import { doc, nightCard, fmt } from '../lib/svg.mjs';

const W = 600;
const H = 300;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const num = (n) => n.toLocaleString('en-US');
export const day = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};

/** Title row shared by the stats cards: small spaced caps label + script title. */
export function cardTitle(label, title, color = C.comet) {
  const l = text(label, { font: 'montb', size: 11, x: 34, y: 42, tracking: 2.5 });
  const t = text(title, { font: 'vibes', size: 40, x: 32, y: 84 });
  return `<path d="${l.d}" fill="${color}"/><path d="${t.d}" fill="${C.text}"/>`;
}

export function overviewCard(d) {
  const card = nightCard({ w: W, h: H, seed: 3 });
  const big = text(num(d.totalContributions), { font: 'montb', size: 54, x: 34, y: 172 });
  const bigLabel = text('contributions in the last 12 months', { font: 'mont', size: 14, x: 36, y: 200 });
  const metrics = [
    ['COMMITS', d.commits, C.comet],
    ['PULL REQUESTS', d.prs, C.sunset],
    ['ISSUES', d.issues, C.gold],
    ['STARS EARNED', d.stars, C.violet],
  ];
  const cells = metrics
    .map(([label, value, color], i) => {
      const x = 34 + i * 136;
      const v = text(num(value), { font: 'montb', size: 24, x, y: 258 });
      const l = text(label, { font: 'montb', size: 9.5, x, y: 276, tracking: 1.6 });
      return `<g class="in" style="animation-delay:${fmt(0.4 + i * 0.12)}s"><rect x="${x}" y="226" width="16" height="2.5" rx="1.25" fill="${color}"/><path d="${v.d}" fill="${C.text}"/><path d="${l.d}" fill="${C.faint}"/></g>`;
    })
    .join('');
  const style = `${card.css}
    @keyframes in{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:none}} .in{animation:in .8s ease-out both}`;
  const body = `${card.svg}
    <g class="in">${cardTitle('GITHUB  ·  THIS YEAR', 'Year in review')}</g>
    <g class="in" style="animation-delay:.2s"><path d="${big.d}" fill="${C.text}"/><path d="${bigLabel.d}" fill="${C.soft}"/></g>
    ${cells}`;
  return doc({ width: W, height: H, title: `${num(d.totalContributions)} contributions this year`, desc: metrics.map(([l, v]) => `${l.toLowerCase()}: ${num(v)}`).join(', '), style, defs: card.defs, body });
}
