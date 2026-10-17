// Project cards on warm paper: a small line-art icon with a gentle loop, title, note, tags.
import { C } from '../lib/theme.mjs';
import { text } from '../lib/type.mjs';
import { doc, card, leaf } from '../lib/svg.mjs';

const W = 600;
const H = 250;

const ICONS = {
  target: `<g class="spin"><circle r="20" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="10 6"/></g>
    <circle r="9" fill="none" stroke="${C.ink}" stroke-width="2.5"/><path d="M0 -28V-16M0 28V16M-28 0H-16M28 0H16" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/><circle r="2.5" fill="${C.sunset}"/>`,
  drone: `<g class="hover"><rect x="-10" y="-6" width="20" height="12" rx="4" fill="none" stroke="${C.ink}" stroke-width="2.5"/>
    ${[[-22, -16], [22, -16], [-22, 16], [22, 16]].map(([x, y]) => `<path d="M0 0L${x} ${y}" stroke="${C.ink}" stroke-width="2.5"/><g transform="translate(${x} ${y})"><g class="prop"><path d="M-11 0H11" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/></g></g>`).join('')}</g>`,
  house: `<path d="M-22 4L0 -18L22 4V24H-22Z" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/><rect class="glow" x="-14" y="6" width="10" height="9" fill="${C.sun}"/><rect x="4" y="8" width="9" height="16" fill="none" stroke="${C.ink}" stroke-width="2"/>
    <path d="M10 -10V-20H16V-4" fill="none" stroke="${C.ink}" stroke-width="2.5"/>`,
  sprout: `<path d="M-20 22H20" stroke="${C.dusk}" stroke-width="3" stroke-linecap="round"/><path d="M0 22V-2" stroke="${C.skyDeep}" stroke-width="2.5"/>
    <g transform="translate(0 6)"><g class="sway"><g transform="rotate(-50)">${leaf(16, C.sky)}</g></g></g>
    <g transform="translate(0 -2)"><g class="sway" style="animation-delay:-1s"><g transform="rotate(45)">${leaf(14, C.skyDeep)}</g></g></g>`,
};

function wrap(str, font, size, maxW) {
  const lines = [];
  let cur = '';
  for (const w of str.split(' ')) {
    const next = cur ? `${cur} ${w}` : w;
    if (cur && text(next, { font, size }).width > maxW) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  return cur ? [...lines, cur] : lines;
}

export function project(p, login) {
  const tint = C[p.tint];
  const team = !p.repo.startsWith(`${login}/`);
  const title = text(p.title, { font: 'gentium', size: 27, x: 132, y: 62 });
  const jp = text(p.jp, { font: 'klee', size: 17, x: 132 + title.width + 12, y: 60 });
  const lines = wrap(p.desc, 'patrick', 21, W - 172).slice(0, 4);
  const desc = lines.map((l, i) => text(l, { font: 'patrick', size: 21, x: 132, y: 98 + i * 25 }).d).join('');
  let x = 132;
  let tags = '';
  for (const t of p.tags) {
    const td = text(t, { font: 'patrick', size: 18, x: x + 12, y: 216 });
    tags += `<rect x="${x}" y="196" width="${td.width + 24}" height="28" rx="14" fill="${tint}" fill-opacity=".2"/><path d="${td.d}" fill="${C.ink}"/>`;
    x += td.width + 32;
  }
  const note = team ? text('team project', { font: 'patrick', size: 17, x: W - 34, y: 40, anchor: 'end' }) : null;
  const style = `
    @keyframes up{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:none}} .up{animation:up .9s ease-out both}
    @keyframes spin{to{transform:rotate(360deg)}} .spin{transform-box:fill-box;transform-origin:center;animation:spin 12s linear infinite}
    @keyframes prop{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.2)}} .prop{transform-box:fill-box;transform-origin:center;animation:prop .25s linear infinite}
    @keyframes hover{0%,100%{transform:translateY(-2px)}50%{transform:translateY(2px)}} .hover{animation:hover 2.6s ease-in-out infinite}
    @keyframes glow{0%,100%{opacity:.6}50%{opacity:1}} .glow{animation:glow 3s ease-in-out infinite}
    @keyframes sway{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}} .sway{transform-box:fill-box;transform-origin:50% 100%;animation:sway 3.5s ease-in-out infinite}
  `;
  const body = `<g class="up">
    ${card({ w: W, h: H })}
    <circle cx="72" cy="78" r="38" fill="${tint}" fill-opacity=".22"/>
    <g transform="translate(72 78)">${ICONS[p.icon]}</g>
    <path d="${title.d}" fill="${C.ink}"/><path d="${jp.d}" fill="${C.inkSoft}"/>
    ${note ? `<path d="${note.d}" fill="${C.inkFaint}"/>` : ''}
    <path d="${desc}" fill="${C.inkSoft}"/>
    ${tags}
  </g>`;
  return doc({ width: W, height: H, title: p.title, desc: p.desc, style, body });
}
