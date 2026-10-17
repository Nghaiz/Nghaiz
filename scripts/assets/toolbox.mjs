// "My toolbox": tech stack as handwritten chips on paper, grouped by shelf.
import { C, SERIES } from '../lib/theme.mjs';
import { text } from '../lib/type.mjs';
import { doc, card, fmt } from '../lib/svg.mjs';

const W = 1200;
const ROW = 58;

export function toolbox(groups) {
  const H = 70 + groups.length * ROW + 20;
  let rows = '';
  let n = 0;
  groups.forEach((g, gi) => {
    const y = 64 + gi * ROW;
    const color = SERIES[gi % SERIES.length];
    const label = text(g.label, { font: 'gentium', size: 22, x: 48, y: y + 26 });
    rows += `<g class="in" style="animation-delay:${fmt(gi * 0.15)}s"><path d="${label.d}" fill="${C.ink}"/></g>`;
    let x = 250;
    for (const item of g.items) {
      const t = text(item, { font: 'patrick', size: 21, x: x + 30, y: y + 26 });
      rows += `<g class="in" style="animation-delay:${fmt(0.2 + gi * 0.15 + (n++ % 8) * 0.04)}s">
        <rect x="${x}" y="${y + 4}" width="${fmt(t.width + 44)}" height="32" rx="16" fill="${C.paperDeep}" stroke="${C.rule}" stroke-width="1.5"/>
        <circle cx="${x + 16}" cy="${y + 20}" r="5" fill="${color}"/><path d="${t.d}" fill="${C.ink}"/></g>`;
      x += t.width + 54;
    }
    if (gi < groups.length - 1) rows += `<path d="M48 ${y + ROW - 6}H${W - 48}" stroke="${C.rule}" stroke-dasharray="3 7" stroke-linecap="round"/>`;
  });
  const style = `@keyframes in{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:none}} .in{animation:in .8s ease-out both}`;
  const body = `${card({ w: W, h: H })}${rows}`;
  return doc({ width: W, height: H, title: 'My toolbox', desc: groups.map((g) => `${g.label}: ${g.items.join(', ')}`).join('. '), style, body });
}
