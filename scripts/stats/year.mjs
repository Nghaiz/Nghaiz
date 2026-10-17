// "This year" card: one big number and five quiet rows with little line-art icons.
import { C } from '../lib/theme.mjs';
import { text } from '../lib/type.mjs';
import { doc, card, fmt } from '../lib/svg.mjs';

const W = 600;
const H = 300;

export const num = (n) => n.toLocaleString('en-US');

const ICON = {
  commit: `<circle r="6" fill="none" stroke="${C.ink}" stroke-width="2"/><path d="M-13 0H-6M6 0H13" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/>`,
  pr: `<circle cx="-6" cy="-7" r="3" fill="none" stroke="${C.ink}" stroke-width="2"/><circle cx="-6" cy="7" r="3" fill="none" stroke="${C.ink}" stroke-width="2"/><circle cx="7" cy="7" r="3" fill="none" stroke="${C.ink}" stroke-width="2"/><path d="M-6 -4V4M7 4V-3Q7 -7 3 -7H0" fill="none" stroke="${C.ink}" stroke-width="2"/>`,
  issue: `<circle r="8" fill="none" stroke="${C.ink}" stroke-width="2"/><circle r="2" fill="${C.ink}"/>`,
  star: `<path d="M0 -9L2.6 -3 9 -2.6 4 1.6 5.6 8 0 4.6 -5.6 8 -4 1.6 -9 -2.6 -2.6 -3Z" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"/>`,
  repo: `<path d="M-7 -9H6V8H-7Z M-7 4H6" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"/>`,
};

export function yearCard(d) {
  const title = text('This year', { font: 'gentium', size: 28, x: 36, y: 54 });
  const jp = text('今年', { font: 'klee', size: 18, x: 36 + title.width + 12, y: 52 });
  const big = text(num(d.totalContributions), { font: 'gentium', size: 64, x: 36, y: 160 });
  const bigLabel = text('contributions', { font: 'patrick', size: 24, x: 38, y: 194 });
  const since = text('over the last 12 months', { font: 'patrick', size: 19, x: 38, y: 222 });
  const rows = [
    ['commit', 'Commits', d.commits],
    ['pr', 'Pull requests', d.prs],
    ['issue', 'Issues', d.issues],
    ['star', 'Stars earned', d.stars],
    ['repo', 'Contributed to', d.contributedTo],
  ];
  const RX = 300;
  const rowSvg = rows
    .map(([icon, label, value], i) => {
      const y = 92 + i * 40;
      const l = text(label, { font: 'patrick', size: 22, x: RX + 32, y });
      const v = text(num(value), { font: 'gentium', size: 22, x: W - 40, y, anchor: 'end' });
      return `<g class="in" style="animation-delay:${fmt(0.3 + i * 0.12)}s"><g transform="translate(${RX + 10} ${y - 7})">${ICON[icon]}</g><path d="${l.d}" fill="${C.inkSoft}"/><path d="${v.d}" fill="${C.ink}"/>${i < rows.length - 1 ? `<path d="M${RX} ${y + 15}H${W - 40}" stroke="${C.rule}" stroke-dasharray="2 6" stroke-linecap="round"/>` : ''}</g>`;
    })
    .join('');
  const style = `@keyframes in{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:none}} .in{animation:in .8s ease-out both}
    @keyframes grow{0%{transform:scaleX(0)}100%{transform:scaleX(1)}} .grow{transform-box:fill-box;transform-origin:left;animation:grow 1.4s ease-out .4s both}`;
  const body = `${card({ w: W, h: H })}
    <path d="${title.d}" fill="${C.ink}"/><path d="${jp.d}" fill="${C.inkSoft}"/>
    <g class="in"><path d="${big.d}" fill="${C.ink}"/><path d="${bigLabel.d}" fill="${C.inkSoft}"/><path d="${since.d}" fill="${C.inkFaint}"/></g>
    <rect class="grow" x="38" y="240" width="220" height="6" rx="3" fill="${C.sky}" opacity=".55"/>
    <path d="M${RX - 20} 70V250" stroke="${C.rule}" stroke-width="1.5"/>
    ${rowSvg}`;
  return doc({ width: W, height: H, title: `${num(d.totalContributions)} contributions this year`, desc: rows.map(([, l, v]) => `${l}: ${num(v)}`).join(', '), style, body });
}
