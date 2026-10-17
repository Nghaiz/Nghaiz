// "Languages" journal page: logo stickers, hand-drawn share bars, and how many more there are.
import { words as text } from '../lib/type.mjs';
import { doc, fmt } from '../lib/svg.mjs';
import { doodle, PAPER } from '../lib/doodles.mjs';
import { TONES, INK, STICKERS, JOURNAL_CSS, paperDefs, paperBg, paperBorder, cardHeader, sticker, logo } from '../lib/journal.mjs';

const W = 600;
const H = 510;
// Not hand-written code: HTML here is exported reports, TeX is write-ups, and notebook size is
// dominated by stored outputs.
const EXCLUDED = ['HTML', 'TeX', 'Jupyter Notebook'];
const TOP = 6;

export function shares(languages) {
  const kept = languages.filter((l) => !EXCLUDED.includes(l.name)).sort((a, b) => b.bytes - a.bytes);
  const total = kept.reduce((s, l) => s + l.bytes, 0);
  return total ? kept.map((l) => ({ name: l.name, share: l.bytes / total })) : [];
}

export function languagesCard(d, tone) {
  const t = TONES[tone];
  const all = shares(d.languages);
  const top = all.slice(0, TOP);
  const BAR_X = 96;
  const BAR_W = 470;
  const rows = top
    .map((it, i) => {
      const y = 122 + i * 56;
      const name = text(it.name, { font: 'fuzzy', size: 19, x: BAR_X, y: y + 18 });
      const pct = text(`${(it.share * 100).toFixed(1)}%`, { font: 'fuzzy', size: 17, x: BAR_X + BAR_W, y: y + 18, anchor: 'end' });
      const fillW = Math.max(10, it.share * BAR_W);
      return `${sticker(tone, { x: 28, y: y - 6, w: 50, h: 50, fill: '#FFFFFF', rot: i % 2 ? 2 : -2, delay: 0.2 + i * 0.1, r: 14, content: logo(it.name, 53, y + 19, 30) })}
        ${name.paint(`${t.ink}`)}${pct.paint(`${t.soft}`)}
        <rect x="${BAR_X}" y="${y + 28}" width="${BAR_W}" height="10" rx="5" fill="none" stroke="${t.ink}" stroke-opacity=".25" stroke-width="1.4" stroke-dasharray="3 4"/>
        <rect class="grow" style="animation-delay:${fmt(0.4 + i * 0.1)}s" x="${BAR_X}" y="${y + 28}" width="${fmt(fillW)}" height="10" rx="5" fill="${STICKERS[i % STICKERS.length]}" stroke="${INK}" stroke-width="1.4"/>`;
    })
    .join('');
  const more = all.length - top.length;
  const foot = text(more > 0 ? `and ${more} more languages along the way` : 'that is all of them, for now', { font: 'fuzzyR', size: 16, x: 82, y: 478 });
  const body = `<g clip-path="url(#card)">${paperBg(tone, { w: W, h: H })}
    ${cardHeader(tone, { title: 'Languages', note: 'by code size in my public repos', doodleName: 'code', tint: PAPER.blue, seed: 5 })}
    ${rows}
    <g class="fadein" style="animation-delay:1.1s">${doodle('sparkles', { x: 52, y: 470, size: 38, ink: tone === 'night' ? '#F6EEDF' : INK })}${foot.paint(`${t.soft}`)}</g></g>
    ${paperBorder(tone, { w: W, h: H })}`;
  return doc({ width: W, height: H, title: 'Languages', desc: top.map((l) => `${l.name} ${(l.share * 100).toFixed(1)}%`).join(', '), style: JOURNAL_CSS, defs: paperDefs(tone, { w: W, h: H }), body });
}
