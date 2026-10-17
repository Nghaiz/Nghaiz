// "The last 31 days" card: daily contributions as a soft sky-blue area, with a little flag
// planted on the busiest day.
import { C } from '../lib/theme.mjs';
import { text } from '../lib/type.mjs';
import { doc, card, fmt } from '../lib/svg.mjs';
import { num } from './year.mjs';

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
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${fmt(c1[0])} ${fmt(c1[1])} ${fmt(c2[0])} ${fmt(c2[1])} ${fmt(p2[0])} ${fmt(p2[1])}`;
  }
  return d;
}

export function activityCard(d) {
  const days = d.days.slice(-DAYS);
  const total = days.reduce((s, x) => s + x.contributionCount, 0);
  const max = Math.max(1, ...days.map((x) => x.contributionCount));
  const X0 = 50;
  const X1 = W - 50;
  const TOPY = 150;
  const BASE = 246;
  const pts = days.map((x, i) => [X0 + ((X1 - X0) * i) / (days.length - 1), BASE - (x.contributionCount / max) * (BASE - TOPY)]);
  const line = smooth(pts);
  const area = `${line}L${X1} ${BASE + 20}L${X0} ${BASE + 20}Z`;

  const peakIdx = days.reduce((best, x, i) => (x.contributionCount > days[best].contributionCount ? i : best), 0);
  const [px, py] = pts[peakIdx];
  const [, pm, pd] = days[peakIdx].date.split('-').map(Number);
  const flagLabel = text(`${days[peakIdx].contributionCount} on ${MONTHS[pm - 1]} ${pd}`, { font: 'patrick', size: 19, x: px + 30, y: py - 30 });
  const flipFlag = px + 30 + flagLabel.width + 16 > W - 40;
  const flag = flipFlag
    ? text(`${days[peakIdx].contributionCount} on ${MONTHS[pm - 1]} ${pd}`, { font: 'patrick', size: 19, x: px - 30, y: py - 30, anchor: 'end' })
    : flagLabel;

  const ticks = days
    .map((x, i) => {
      if (i % 5 !== 0 && i !== days.length - 1) return '';
      const [, m, dd] = x.date.split('-').map(Number);
      const t = text(dd === 1 || i === 0 ? `${MONTHS[m - 1]} ${dd}` : `${dd}`, { font: 'patrick', size: 17, x: pts[i][0], y: H - 22, anchor: 'middle' });
      return `<path d="${t.d}" fill="${C.inkFaint}"/>`;
    })
    .join('');

  const title = text('The last 31 days', { font: 'gentium', size: 28, x: 40, y: 54 });
  const jp = text('足あと', { font: 'klee', size: 18, x: 40 + title.width + 12, y: 52 });
  const sum = text(`${num(total)} contributions`, { font: 'patrick', size: 22, x: W - 40, y: 54, anchor: 'end' });

  const style = `@keyframes draw{to{stroke-dashoffset:0}} .line{stroke-dasharray:3000;stroke-dashoffset:3000;animation:draw 2.6s ease-out .2s forwards}
    @keyframes fade{0%{opacity:0}100%{opacity:1}} .area{animation:fade 1.6s ease-out 1s both}.late{animation:fade .8s ease-out 2.4s both}
    @keyframes wave{0%,100%{transform:skewY(0)}50%{transform:skewY(-6deg)}} .flag{transform-box:fill-box;transform-origin:left;animation:wave 2s ease-in-out infinite}`;
  const defs = `<linearGradient id="hill" x1="0" y1="${TOPY}" x2="0" y2="${BASE + 20}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${C.comet}"/><stop offset="1" stop-color="${C.sky}"/></linearGradient>
    <clipPath id="plot"><rect x="${X0}" y="80" width="${X1 - X0}" height="${BASE - 60}"/></clipPath>`;
  const body = `${card({ w: W, h: H })}
    <path d="${title.d}" fill="${C.ink}"/><path d="${jp.d}" fill="${C.inkSoft}"/><path d="${sum.d}" fill="${C.inkSoft}"/>
    ${[0.33, 0.66, 1].map((f) => `<path d="M${X0} ${fmt(BASE - f * (BASE - TOPY))}H${X1}" stroke="${C.rule}" stroke-dasharray="2 8" stroke-linecap="round"/>`).join('')}
    <g clip-path="url(#plot)"><path class="area" d="${area}" fill="url(#hill)" opacity=".85"/></g>
    <path class="line" d="${line}" fill="none" stroke="${C.skyDeep}" stroke-width="3" stroke-linecap="round"/>
    <g class="late">
      <path d="M${fmt(px)} ${fmt(py)}V${fmt(py - 44)}" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/>
      <path class="flag" d="M${fmt(px)} ${fmt(py - 44)}l${flipFlag ? -22 : 22} 7l${flipFlag ? 22 : -22} 7Z" fill="${C.sunset}"/>
      <path d="${flag.d}" fill="${C.ink}"/></g>
    ${ticks}`;
  return doc({ width: W, height: H, title: `${num(total)} contributions in the last 31 days`, desc: `Busiest day: ${days[peakIdx].date} with ${days[peakIdx].contributionCount}.`, style, defs, body });
}
