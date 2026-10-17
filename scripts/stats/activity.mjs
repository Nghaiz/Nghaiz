// "The last 31 days" journal page: a pencil line on graph paper, with a handwritten note and an
// arrow pointing at the busiest day.
import { words as text } from '../lib/type.mjs';
import { doc, fmt } from '../lib/svg.mjs';
import { PAPER } from '../lib/doodles.mjs';
import { TONES, JOURNAL_CSS, paperDefs, paperBg, paperBorder, cardHeader, inkStar, inkArrow } from '../lib/journal.mjs';
import { num, day } from './overview.mjs';

const W = 1200;
const H = 390;
const DAYS = 31;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Catmull-Rom through the points, as cubic Béziers. */
function smooth(pts) {
  let d = `M${fmt(pts[0][0])} ${fmt(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    d += `C${fmt(p1[0] + (p2[0] - p0[0]) / 6)} ${fmt(p1[1] + (p2[1] - p0[1]) / 6)} ${fmt(p2[0] - (p3[0] - p1[0]) / 6)} ${fmt(p2[1] - (p3[1] - p1[1]) / 6)} ${fmt(p2[0])} ${fmt(p2[1])}`;
  }
  return d;
}

export function activityCard(d, tone) {
  const t = TONES[tone];
  const days = d.days.slice(-DAYS);
  const total = days.reduce((s, x) => s + x.contributionCount, 0);
  const max = Math.max(1, ...days.map((x) => x.contributionCount));
  const GX0 = 40;
  const GX1 = W - 40;
  const GY0 = 112;
  const GY1 = 330;
  const X0 = GX0 + 30;
  const X1 = GX1 - 30;
  const TOPY = GY0 + 40;
  const BASE = GY1 - 14;
  const pts = days.map((x, i) => [X0 + ((X1 - X0) * i) / (days.length - 1), BASE - (x.contributionCount / max) * (BASE - TOPY)]);
  const line = smooth(pts);
  let grid = '';
  for (let x = GX0 + 20; x < GX1; x += 20) grid += `M${x} ${GY0}V${GY1}`;
  for (let y = GY0 + 20; y < GY1; y += 20) grid += `M${GX0} ${y}H${GX1}`;
  const peak = days.reduce((b, x, i) => (x.contributionCount > days[b].contributionCount ? i : b), 0);
  const [px, py] = pts[peak];
  const [, pm, pd] = days[peak].date.split('-').map(Number);
  const left = px > W / 2;
  const nx = left ? px - 290 : px + 70;
  const n1 = text('best of the month!', { font: 'fuzzy', size: 20, x: nx, y: py + 6 });
  const n2 = text(`${days[peak].contributionCount} on ${MONTHS[pm - 1]} ${pd}`, { font: 'fuzzyR', size: 16, x: nx, y: py + 30 });
  const arrow = left ? inkArrow(nx + n1.width + 12, py, px - 16, py - 6, t.squiggle, -26) : inkArrow(nx - 12, py, px + 16, py - 6, t.squiggle, -26);
  const ticks = days
    .map((x, i) => {
      if (i % 5 !== 0 && i !== days.length - 1) return '';
      const [, m, dd] = x.date.split('-').map(Number);
      const tk = text(i === 0 || dd === 1 ? `${MONTHS[m - 1]} ${dd}` : `${dd}`, { font: 'fuzzyR', size: 15, x: pts[i][0], y: H - 26, anchor: 'middle' });
      return `${tk.paint(`${t.faint}`)}`;
    })
    .join('');
  const dots = pts.map(([x, y], i) => `<circle class="fadein" style="animation-delay:${fmt(1 + i * 0.03)}s" cx="${fmt(x)}" cy="${fmt(y)}" r="3.2" fill="${t.paper}" stroke="${t.ink}" stroke-width="1.6"/>`).join('');
  const avg = (total / days.length).toFixed(1);
  const body = `<g clip-path="url(#card)">${paperBg(tone, { w: W, h: H })}
    ${cardHeader(tone, { title: 'The last 31 days', note: `${num(total)} contributions, about ${avg} a day`, doodleName: 'mug', tint: PAPER.blue, seed: 8 })}
    <rect x="${GX0}" y="${GY0}" width="${GX1 - GX0}" height="${GY1 - GY0}" rx="10" fill="${t.paper}" stroke="${t.ink}" stroke-opacity=".18"/>
    <path d="${grid}" stroke="${t.grid}" stroke-opacity="${t.gridOp * 1.6}" stroke-width="1"/>
    <g class="fadein" style="animation-delay:.9s"><path d="${line}L${X1} ${BASE}L${X0} ${BASE}Z" fill="${t.marker}" opacity="${t.markerOp * 0.45}"/></g>
    <path class="ul" style="animation-duration:2.4s;stroke-dasharray:3200;stroke-dashoffset:3200" d="${line}" fill="none" stroke="${t.ink}" stroke-width="2.6" stroke-linecap="round"/>
    ${dots}
    <g class="fadein" style="animation-delay:2s">${inkStar(px, py - 22, 11, t.squiggle, 0, 0)}${arrow}${n1.paint(`${t.ink}`)}${n2.paint(`${t.soft}`)}</g>
    ${ticks}</g>
    ${paperBorder(tone, { w: W, h: H })}`;
  return doc({ width: W, height: H, title: `${num(total)} contributions in the last 31 days`, desc: `Busiest day: ${day(days[peak].date)} with ${days[peak].contributionCount}.`, style: JOURNAL_CSS, defs: paperDefs(tone, { w: W, h: H }), body });
}
