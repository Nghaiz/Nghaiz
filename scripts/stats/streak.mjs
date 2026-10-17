// "My rhythm" journal page: three streak stickers and a bullet-journal habit tracker of the last
// six weeks (one row per week, one column per weekday).
import { words as text } from '../lib/type.mjs';
import { doc, fmt } from '../lib/svg.mjs';
import { doodle, PAPER } from '../lib/doodles.mjs';
import { TONES, INK, JOURNAL_CSS, paperDefs, paperBg, paperBorder, cardHeader, sticker } from '../lib/journal.mjs';
import { num, day } from './overview.mjs';

const W = 1200;
const H = 370;
const WEEKS = 6;
const LEVELS = ['#DCEBD5', '#BFD7B5', '#93B98A', '#6E9E66'];

function entry(tone, { x, y, fill, dd, value, unit, label, sub, rot, delay }) {
  const v = text(value, { font: 'fuzzy', size: 42, x: x + 115, y: y + 122, anchor: 'middle' });
  const u = text(unit, { font: 'fuzzyR', size: 17, x: x + 115, y: y + 146, anchor: 'middle' });
  const l = text(label, { font: 'fuzzy', size: 16, x: x + 115, y: y + 176, anchor: 'middle' });
  const s = text(sub, { font: 'fuzzyR', size: 13, x: x + 115, y: y + 198, anchor: 'middle' });
  return sticker(tone, {
    x, y, w: 230, h: 214, fill, rot, delay,
    content: doodle(dd, { x: x + 115, y: y + 52, size: 62, ink: INK }) + `${v.paint(`${INK}`)}${u.paint(`${INK}`, `fill-opacity=".72"`)}${l.paint(`${INK}`)}${s.paint(`${INK}`, `fill-opacity=".62"`)}`,
  });
}

export function streakCard(d, tone) {
  const t = TONES[tone];
  const s = d.streak;
  const range = (r) => (r.length ? `${day(r.start, false)} to ${day(r.end, false)}` : 'starts with the next commit');
  const entries = [
    entry(tone, { x: 30, y: 116, fill: PAPER.butter, dd: 'candle', value: `${s.current.length}`, unit: s.current.length === 1 ? 'day' : 'days', label: 'current streak', sub: range(s.current), rot: -1.8, delay: 0.25 }),
    entry(tone, { x: 284, y: 116, fill: PAPER.rose, dd: 'rosette', value: `${s.longest.length}`, unit: s.longest.length === 1 ? 'day' : 'days', label: 'longest streak', sub: range(s.longest), rot: 1.4, delay: 0.37 }),
    entry(tone, { x: 538, y: 116, fill: PAPER.sage, dd: 'sprout', value: num(s.total), unit: 'contributions', label: 'in total', sub: `since ${day(s.since)}`, rot: -1, delay: 0.49 }),
  ].join('');

  // habit tracker: last WEEKS full weeks ending this week, Monday first
  const counts = new Map(d.allDays.map((x) => [x.date, x.count]));
  const last = new Date(`${d.allDays[d.allDays.length - 1].date}T00:00:00Z`);
  const monday = new Date(last);
  monday.setUTCDate(last.getUTCDate() - ((last.getUTCDay() + 6) % 7) - (WEEKS - 1) * 7);
  const max = Math.max(1, ...d.allDays.slice(-WEEKS * 7).map((x) => x.count));
  const GX = 842;
  const GY = 150;
  let dots = '';
  for (let w = 0; w < WEEKS; w++) {
    for (let k = 0; k < 7; k++) {
      const dt = new Date(monday);
      dt.setUTCDate(monday.getUTCDate() + w * 7 + k);
      if (dt > last) continue;
      const iso = dt.toISOString().slice(0, 10);
      const c = counts.get(iso) ?? 0;
      const cx = GX + k * 44;
      const cy = GY + w * 34;
      const delay = fmt(0.6 + (w * 7 + k) * 0.015);
      dots += c
        ? `<circle class="fadein" style="animation-delay:${delay}s" cx="${cx}" cy="${cy}" r="12" fill="${LEVELS[Math.min(3, Math.floor((c / max) * 4))]}" stroke="${INK}" stroke-width="1.5"/>`
        : `<circle class="fadein" style="animation-delay:${delay}s" cx="${cx}" cy="${cy}" r="12" fill="none" stroke="${t.ink}" stroke-opacity=".35" stroke-width="1.5" stroke-dasharray="3 3"/>`;
      if (iso === d.allDays[d.allDays.length - 1].date) dots += `<circle class="tw" cx="${cx}" cy="${cy}" r="16.5" fill="none" stroke="${t.squiggle}" stroke-width="2" stroke-dasharray="4 3"/>`; // today
    }
  }
  const letters = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((l, k) => `${text(l, { font: 'fuzzy', size: 15, x: GX + k * 44, y: 124, anchor: 'middle' }).paint(`${t.soft}`)}`).join('');
  const trackerTitle = text('my habit tracker', { font: 'fuzzy', size: 18, x: GX - 14, y: 92 });
  const trackerNote = text(`last ${WEEKS} weeks`, { font: 'fuzzyR', size: 14, x: GX + 6 * 44 + 14, y: 92, anchor: 'end' });
  const body = `<g clip-path="url(#card)">${paperBg(tone, { w: W, h: H })}
    ${cardHeader(tone, { title: 'My rhythm', note: 'small steps, most days', doodleName: 'calendar', tint: PAPER.peach, seed: 6 })}
    ${entries}
    <path d="M806 70V340" stroke="${t.ink}" stroke-opacity=".18" stroke-width="1.6" stroke-dasharray="2 7" stroke-linecap="round"/>
    ${trackerTitle.paint(`${t.ink}`)}${trackerNote.paint(`${t.soft}`)}${letters}${dots}</g>
    ${paperBorder(tone, { w: W, h: H })}`;
  return doc({ width: W, height: H, title: `Current streak ${s.current.length} days, longest ${s.longest.length} days`, desc: `${num(s.total)} contributions since ${s.since}`, style: JOURNAL_CSS, defs: paperDefs(tone, { w: W, h: H }), body });
}
