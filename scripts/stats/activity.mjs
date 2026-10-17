// "The last 31 days" card: daily contributions as a glowing comet line over a soft aurora area,
// with the busiest day marked.
import { C } from '../lib/theme.mjs';
import { text } from '../lib/type.mjs';
import { doc, nightCard, glowing, fmt } from '../lib/svg.mjs';
import { num, cardTitle } from './overview.mjs';

const W = 1200;
const H = 380;
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

export function activityCard(d) {
  const card = nightCard({ w: W, h: H, seed: 9 });
  const days = d.days.slice(-DAYS);
  const total = days.reduce((s, x) => s + x.contributionCount, 0);
  const max = Math.max(1, ...days.map((x) => x.contributionCount));
  const X0 = 50;
  const X1 = W - 50;
  const TOPY = 150;
  const BASE = 314;
  const pts = days.map((x, i) => [X0 + ((X1 - X0) * i) / (days.length - 1), BASE - (x.contributionCount / max) * (BASE - TOPY)]);
  const line = smooth(pts);
  const area = `${line}L${X1} ${BASE}L${X0} ${BASE}Z`;
  const peak = days.reduce((b, x, i) => (x.contributionCount > days[b].contributionCount ? i : b), 0);
  const [px, py] = pts[peak];
  const [, pm, pd] = days[peak].date.split('-').map(Number);
  const flip = px > W - 300;
  // "95 on Oct 15", always read left to right; placed left of the peak when it sits near the edge
  const numW = text(`${days[peak].contributionCount}`, { font: 'mincho', size: 34 }).width;
  const dayW = text(`on ${MONTHS[pm - 1]} ${pd}`, { font: 'fuzzy', size: 20 }).width;
  const lx = flip ? px - 20 - (numW + 10 + dayW) : px + 20;
  const peakNum = text(`${days[peak].contributionCount}`, { font: 'mincho', size: 34, x: lx, y: py - 8 });
  const peakDay = text(`on ${MONTHS[pm - 1]} ${pd}`, { font: 'fuzzy', size: 20, x: lx + numW + 10, y: py - 8 });
  const ticks = days
    .map((x, i) => {
      if (i % 5 !== 0 && i !== days.length - 1) return '';
      const [, m, dd] = x.date.split('-').map(Number);
      const t = text(i === 0 || dd === 1 ? `${MONTHS[m - 1]} ${dd}` : `${dd}`, { font: 'minchoM', size: 17, x: pts[i][0], y: H - 26, anchor: 'middle' });
      return `<path d="${t.d}" fill="${C.faint}"/>`;
    })
    .join('');
  const style = `${card.css}
    @keyframes draw{to{stroke-dashoffset:0}} .line{stroke-dasharray:3200;stroke-dashoffset:3200;animation:draw 2.4s ease-out .2s forwards}
    @keyframes fade{0%{opacity:0}100%{opacity:1}} .area{animation:fade 1.4s ease-out 1s both}.late{animation:fade .8s ease-out 2.2s both}
    @keyframes pulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(2.2);opacity:0}} .pulse{transform-box:fill-box;transform-origin:center;animation:pulse 2.2s ease-out infinite}`;
  const defs = `${card.defs}
    <linearGradient id="areaG" x1="0" y1="${TOPY}" x2="0" y2="${BASE}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#7FD6F5" stop-opacity=".45"/><stop offset=".6" stop-color="#A88CFF" stop-opacity=".15"/><stop offset="1" stop-color="#A88CFF" stop-opacity="0"/></linearGradient>
    <linearGradient id="lineG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A88CFF"/><stop offset=".55" stop-color="#7FD6F5"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient>
    <filter id="lineGlow" x="-5%" y="-30%" width="110%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>`;
  const body = `${card.svg}
    ${cardTitle('The last 31 days', `${num(total)} contributions`, W)}
    <path class="area" d="${area}" fill="url(#areaG)"/>
    <path class="line" d="${line}" fill="none" stroke="#7FD6F5" stroke-width="10" opacity=".55" filter="url(#lineGlow)"/>
    <path class="line" d="${line}" fill="none" stroke="url(#lineG)" stroke-width="3.5" stroke-linecap="round"/>
    <g class="late"><circle class="pulse" cx="${fmt(px)}" cy="${fmt(py)}" r="8" fill="#7FD6F5"/><circle cx="${fmt(px)}" cy="${fmt(py)}" r="6" fill="#FFFFFF"/>${glowing(peakNum.d, 'comet', 0.4)}<path d="${peakDay.d}" fill="#FFFFFF"/></g>
    ${ticks}`;
  return doc({ width: W, height: H, title: `${num(total)} contributions in the last 31 days`, desc: `Busiest day: ${days[peak].date} with ${days[peak].contributionCount}.`, style, defs, body });
}
