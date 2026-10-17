// Profile badges as paper tags: a die-cut sticker with a doodle, a label and the number.
// Stickers read the same on GitHub's light and dark backgrounds, so one file per badge.
import { words as text } from '../lib/type.mjs';
import { doc, fmt } from '../lib/svg.mjs';
import { doodle, PAPER } from '../lib/doodles.mjs';
import { INK, JOURNAL_CSS, paperDefs, sticker } from '../lib/journal.mjs';
import { num } from './overview.mjs';

const H = 50;
// Breathing room is baked into the SVG: GitHub strips CSS margins, and whitespace between
// <img> tags gives only a few pixels, so badges would otherwise touch each other and the hero.
const PAD = { x: 6, top: 9, bottom: 5 };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function badge({ label, value, dd, fill, index = 0 }) {
  const l = text(label, { font: 'fuzzyR', size: 16, x: PAD.x + 54, y: PAD.top + 31 });
  const v = text(value, { font: 'fuzzy', size: 19, x: PAD.x + 54 + l.width + 9, y: PAD.top + 32 });
  const w = Math.ceil(54 + l.width + 9 + v.width + 20);
  const W = w + 2 * PAD.x;
  const content = `<circle cx="${PAD.x + 27}" cy="${PAD.top + H / 2}" r="17" fill="#FFFBF3" fill-opacity=".7"/>${doodle(dd, { x: PAD.x + 27, y: PAD.top + H / 2, size: 30, ink: INK })}
    ${l.paint(`${INK}`, `fill-opacity=".78"`)}${v.paint(`${INK}`)}`;
  const body = sticker('cream', { x: PAD.x, y: PAD.top, w, h: H, fill, r: H / 2, rot: index % 2 ? 0.8 : -0.8, delay: fmt(index * 0.08), content });
  return doc({ width: W, height: H + PAD.top + PAD.bottom, title: `${label}: ${value}`, desc: `${label}: ${value}`, style: JOURNAL_CSS, defs: paperDefs('cream', { w: W, h: H }), body });
}

/** The badge row under the hero, in display order. Returns { file: svg }. */
export function badges(d) {
  const since = new Date(d.createdAt);
  const list = [
    ['followers', 'Followers', num(d.followers), 'friends', PAPER.blue],
    ['stars', 'Stars', num(d.stars), 'star', PAPER.butter],
    ['repos', 'Public repos', num(d.publicRepos), 'house', PAPER.peach],
    ['contributions', 'Contributions', num(d.totalContributions), 'sprout', PAPER.sage],
    ['prs', 'PRs merged', num(d.prsMerged), 'plane', PAPER.lavender],
    ['streak', 'Streak', `${d.streak.current.length} days`, 'candle', PAPER.rose],
    ['since', 'On GitHub since', `${MONTHS[since.getUTCMonth()]} ${since.getUTCFullYear()}`, 'calendar', PAPER.mint],
  ];
  return Object.fromEntries(list.map(([key, label, value, dd, fill], index) => [`badge-${key}.svg`, badge({ label, value, dd, fill, index })]));
}
