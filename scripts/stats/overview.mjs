// "Year in review" card: the year's total as a huge glowing mincho number, four metrics below.
import { C } from '../lib/theme.mjs';
import { text } from '../lib/type.mjs';
import { doc, nightCard, glowing, fmt } from '../lib/svg.mjs';

const W = 600;
const H = 360;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const num = (n) => n.toLocaleString('en-US');
export const day = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};

/** Title row shared by the stats cards: script title + small mincho caption on the right. */
export function cardTitle(title, caption, w = W) {
  const t = text(title, { font: 'fuzzy', size: 36, x: 34, y: 70 });
  const c = text(caption, { font: 'minchoM', size: 17, x: w - 36, y: 58, anchor: 'end' });
  return `<path d="${t.d}" fill="#FFFFFF"/><path d="${c.d}" fill="${C.soft}"/>`;
}

export const IN_CSS = '@keyframes in{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:none}} .in{animation:in .9s ease-out both}';

export function overviewCard(d) {
  const card = nightCard({ w: W, h: H, seed: 3 });
  const big = text(num(d.totalContributions), { font: 'mincho', size: 92, x: 34, y: 196 });
  const unit = text('contributions', { font: 'fuzzy', size: 24, x: 34 + big.width + 16, y: 194 });
  const metrics = [
    [d.commits, 'commits', 'comet'],
    [d.prs, 'pull requests', 'sunset'],
    [d.issues, 'issues', 'gold'],
    [d.stars, 'stars', 'violet'],
  ];
  const cells = metrics
    .map(([value, label, grad], i) => {
      const x = 34 + i * 140;
      const v = text(num(value), { font: 'mincho', size: 40, x, y: 288 });
      const l = text(label, { font: 'fuzzy', size: 17, x: x + 2, y: 324 });
      return `<g class="in" style="animation-delay:${fmt(0.45 + i * 0.12)}s">${glowing(v.d, grad, 0.45)}<path d="${l.d}" fill="${C.soft}"/></g>`;
    })
    .join('');
  const style = `${card.css} ${IN_CSS}`;
  const body = `${card.svg}
    <g class="in">${cardTitle('Year in review', 'last 12 months')}</g>
    <g class="in" style="animation-delay:.2s">${glowing(big.d, 'comet')}<path d="${unit.d}" fill="#FFFFFF"/></g>
    <rect x="34" y="225.4" width="${W - 68}" height="1.2" fill="url(#ncRim)" opacity=".7"/>
    ${cells}`;
  return doc({ width: W, height: H, title: `${num(d.totalContributions)} contributions this year`, desc: metrics.map(([v, l]) => `${l}: ${num(v)}`).join(', '), style, defs: card.defs, body });
}
