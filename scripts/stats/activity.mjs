// "Last 31 days" card: daily contributions as a glowing comet-blue line over a faint area,
// with the busiest day marked.
import { C } from '../lib/theme.mjs';
import { text } from '../lib/type.mjs';
import { doc, nightCard, fmt } from '../lib/svg.mjs';
import { num, cardTitle } from './overview.mjs';

const W = 1200;
const H = 300;
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
  const TOPY = 120;
  const BASE = 246;
  const pts = days.map((x, i) => [X0 + ((X1 - X0) * i) / (days.length - 1), BASE - (x.contributionCount / max) * (BASE - TOPY)]);
  const line = smooth(pts);
  const area = `${line}L${X1} ${BASE}L${X0} ${BASE}Z`;
  const peak = days.reduce((b, x, i) => (x.contributionCount > days[b].contributionCount ? i : b), 0);
  const [px, py] = pts[peak];
  const [, pm, pd] = days[peak].date.split('-').map(Number);
  const flip = px > W - 260;
  const label = text(`${days[peak].contributionCount} on ${MONTHS[pm - 1]} ${pd}`, { font: 'montb', size: 13, x: flip ? px - 16 : px + 16, y: py - 12, anchor: flip ? 'end' : 'start' });
  const sum = text(`${num(total)} contributions`, { font: 'montb', size: 14, x: W - 36, y: 84, anchor: 'end' });
  const ticks = days
    .map((x, i) => {
      if (i % 5 !== 0 && i !== days.length - 1) return '';
      const [, m, dd] = x.date.split('-').map(Number);
      const t = text(i === 0 || dd === 1 ? `${MONTHS[m - 1]} ${dd}` : `${dd}`, { font: 'mont', size: 11, x: pts[i][0], y: H - 26, anchor: 'middle' });
      return `<path d="${t.d}" fill="${C.faint}"/>`;
    })
    .join('');
  const style = `${card.css}
    @keyframes draw{to{stroke-dashoffset:0}} .line{stroke-dasharray:3000;stroke-dashoffset:3000;animation:draw 2.4s ease-out .2s forwards}
    @keyframes fade{0%{opacity:0}100%{opacity:1}} .area{animation:fade 1.4s ease-out 1s both}.late{animation:fade .8s ease-out 2.2s both}
    @keyframes pulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.8);opacity:0}} .pulse{transform-box:fill-box;transform-origin:center;animation:pulse 2.2s ease-out infinite}`;
  const defs = `${card.defs}
    <linearGradient id="areaG" x1="0" y1="${TOPY}" x2="0" y2="${BASE}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${C.comet}" stop-opacity=".32"/><stop offset="1" stop-color="${C.comet}" stop-opacity="0"/></linearGradient>
    <linearGradient id="lineG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.violet}"/><stop offset=".6" stop-color="${C.comet}"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient>
    <filter id="lineGlow" x="-5%" y="-30%" width="110%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>`;
  const body = `${card.svg}
    ${cardTitle('GITHUB  ·  DAILY', 'The last 31 days', C.violet)}
    <path d="${sum.d}" fill="${C.soft}"/>
    ${[0.5, 1].map((f) => `<path d="M${X0} ${fmt(BASE - f * (BASE - TOPY))}H${X1}" stroke="${C.line}" stroke-dasharray="2 8"/>`).join('')}
    <path class="area" d="${area}" fill="url(#areaG)"/>
    <path class="line" d="${line}" fill="none" stroke="${C.comet}" stroke-width="7" opacity=".45" filter="url(#lineGlow)"/>
    <path class="line" d="${line}" fill="none" stroke="url(#lineG)" stroke-width="2.5" stroke-linecap="round"/>
    <g class="late"><circle class="pulse" cx="${fmt(px)}" cy="${fmt(py)}" r="7" fill="${C.comet}"/><circle cx="${fmt(px)}" cy="${fmt(py)}" r="4.5" fill="#FFFFFF"/><path d="${label.d}" fill="${C.text}"/></g>
    ${ticks}`;
  return doc({ width: W, height: H, title: `${num(total)} contributions in the last 31 days`, desc: `Busiest day: ${days[peak].date} with ${days[peak].contributionCount}.`, style, defs, body });
}
