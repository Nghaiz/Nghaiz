// "Year in review" journal page: a taped polaroid, the year's total under a highlighter stroke,
// four doodle stickers, and a handwritten note about the busiest day.
import { words as text } from '../lib/type.mjs';
import { doc, fmt } from '../lib/svg.mjs';
import { doodle, PAPER } from '../lib/doodles.mjs';
import { TONES, INK, JOURNAL_CSS, paperDefs, paperBg, paperBorder, sticker, squiggle, marker, inkStar, inkHeart, polaroid, photo } from '../lib/journal.mjs';

const W = 600;
const H = 510;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const num = (n) => n.toLocaleString('en-US');
export const day = (iso, withYear = true) => {
  const [y, m, d] = iso.split('-').map(Number);
  return withYear ? `${MONTHS[m - 1]} ${d}, ${y}` : `${MONTHS[m - 1]} ${d}`;
};

export function overviewCard(d, tone) {
  const t = TONES[tone];
  const from = d.days[0].date;
  const to = d.days[d.days.length - 1].date;
  const title = text('Year in review', { font: 'fuzzy', size: 32, x: 290, y: 66 });
  const range = text(`${day(from)}  to  ${day(to)}`, { font: 'fuzzyR', size: 15, x: 292, y: 104 });
  const big = text(num(d.totalContributions), { font: 'fuzzy', size: 52, x: 292, y: 176 });
  const bigL = text('contributions', { font: 'fuzzyR', size: 18, x: 294, y: 204 });
  const items = [
    ['pencil', PAPER.blue, d.commits, 'commits'],
    ['plane', PAPER.lavender, d.prs, 'pull requests'],
    ['ladybug', PAPER.rose, d.issues, 'issues opened'],
    ['house', PAPER.sage, d.contributedTo, 'repos contributed to'],
  ];
  const stickers = items
    .map(([dd, fill, value, label], i) => {
      const x = 26 + (i % 2) * 284;
      const y = 250 + Math.floor(i / 2) * 100;
      const n = text(num(value), { font: 'fuzzy', size: 30, x: x + 86, y: y + 46 });
      const l = text(label, { font: 'fuzzyR', size: 15, x: x + 88, y: y + 70 });
      return sticker(tone, {
        x, y, w: 264, h: 88, fill, rot: [-1.6, 1.2, 1, -1.4][i], delay: 0.3 + i * 0.12,
        content: doodle(dd, { x: x + 46, y: y + 44, size: 54, ink: INK }) + `${n.paint(`${INK}`)}${l.paint(`${INK}`, `fill-opacity=".72"`)}`,
      });
    })
    .join('');
  const best = d.rhythm.bestDay;
  const note = text(`busiest day: ${day(best.date, false)} (${best.count})   ·   loves ${d.rhythm.favouriteWeekday}s`, { font: 'fuzzyR', size: 16, x: 84, y: 482 });
  const body = `<g clip-path="url(#card)">${paperBg(tone, { w: W, h: H })}
    ${polaroid(tone, { x: 26, y: 24, w: 236, h: 204, rot: -3, image: photo(tone === 'night' ? 'snap-comet' : 'snap-dawn'), caption: 'a year of code', tapes: ['rose', 'sage'] })}
    ${title.paint(`${t.ink}`)}${squiggle(290, 290 + title.width, 78, t.squiggle, 4)}${range.paint(`${t.soft}`)}
    ${marker(288, 140, big.width + 10, 30, t.marker, t.markerOp)}${big.paint(`${t.ink}`)}${bigL.paint(`${t.soft}`)}
    ${inkHeart(302 + big.width + 22, 142, t.squiggle, 1.2)}${inkStar(564, 40, 10, t.doodle, 0)}
    ${stickers}
    <g class="fadein" style="animation-delay:1s">${doodle('mug', { x: 52, y: 474, size: 40, ink: t.doodle === '#F6EEDF' ? '#F6EEDF' : INK })}${note.paint(`${t.soft}`)}</g></g>
    ${paperBorder(tone, { w: W, h: H })}`;
  return doc({ width: W, height: H, title: `${num(d.totalContributions)} contributions in the last year`, desc: items.map(([, , v, l]) => `${num(v)} ${l}`).join(', '), style: JOURNAL_CSS, defs: paperDefs(tone, { w: W, h: H }), body });
}
