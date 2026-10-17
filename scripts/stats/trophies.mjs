// "Achievements": paper award rosettes ranked C → SSS, after the idea behind
// ryo-ma/github-profile-trophy. Thresholds and titles are this profile's own.
import { words as text } from '../lib/type.mjs';
import { doc, fmt } from '../lib/svg.mjs';
import { doodle, PAPER } from '../lib/doodles.mjs';
import { TONES, INK, JOURNAL_CSS, paperDefs, paperBg, paperBorder, cardHeader, sticker } from '../lib/journal.mjs';
import { num } from './overview.mjs';

const W = 1200;
const RANKS = ['C', 'B', 'A', 'AA', 'AAA', 'S', 'SS', 'SSS'];
// sticker face / rosette colour per rank, gentle to bold
const TIER = [
  [PAPER.sage, PAPER.sageDeep], [PAPER.blue, PAPER.blueDeep], [PAPER.lavender, '#AE9EE0'], [PAPER.peach, '#EBA585'],
  [PAPER.rose, PAPER.roseDeep], [PAPER.butter, '#E7BE5C'], ['#F6E2A8', '#E2A93B'], ['#F3E3F1', '#D99AC9'],
];

const years = (iso) => (Date.now() - new Date(iso).getTime()) / (365.25 * 24 * 3600 * 1000);

export const CATEGORIES = [
  { label: 'Commits', doodle: 'pencil', unit: 'commits', value: (d) => d.allTime.commits, steps: [1, 10, 100, 200, 500, 1000, 2000, 4000],
    titles: ['First Commit', 'Getting Started', 'Committed', 'Hyper Committer', 'Ultra Committer', 'Super Committer', 'Deep Committer', 'Commit Legend'] },
  { label: 'Pull requests', doodle: 'plane', unit: 'pull requests', value: (d) => d.allTime.pullRequests, steps: [1, 10, 20, 50, 100, 200, 500, 1000],
    titles: ['First Pull', 'Paper Planes', 'High Puller', 'Hyper Puller', 'Ultra Puller', 'Super Puller', 'Deep Puller', 'Pull Legend'] },
  { label: 'Issues', doodle: 'ladybug', unit: 'issues', value: (d) => d.allTime.issues, steps: [1, 10, 20, 50, 100, 200, 500, 1000],
    titles: ['First Bug Spotted', 'Bug Spotter', 'Bug Hunter', 'Hyper Issuer', 'Ultra Issuer', 'Super Issuer', 'Deep Issuer', 'Issue Legend'] },
  { label: 'Code reviews', doodle: 'glasses', unit: 'reviews', value: (d) => d.allTime.reviews, steps: [1, 10, 20, 50, 100, 200, 500, 1000],
    titles: ['First Review', 'Second Pair of Eyes', 'Careful Reader', 'Hyper Reviewer', 'Ultra Reviewer', 'Super Reviewer', 'Deep Reviewer', 'Review Legend'] },
  { label: 'Stars', doodle: 'star', unit: 'stars', value: (d) => d.stars, steps: [1, 10, 30, 50, 100, 200, 700, 2000],
    titles: ['First Star', 'Middle Star', 'You Are a Star', 'High Star', 'Super Star', 'Stargazer', 'High Stargazer', 'Super Stargazer'] },
  { label: 'Followers', doodle: 'friends', unit: 'followers', value: (d) => d.followers, steps: [1, 10, 20, 50, 100, 200, 400, 1000],
    titles: ['First Friend', 'Many Friends', 'Dynamic User', 'Active User', 'Famous User', 'Hyper Celebrity', 'Ultra Celebrity', 'Super Celebrity'] },
  { label: 'Repositories', doodle: 'house', unit: 'public repos', value: (d) => d.publicRepos, steps: [1, 10, 20, 30, 40, 50, 80, 100],
    titles: ['First Repo', 'Repo Builder', 'Repo Gardener', 'Repo Architect', 'Ultra Creator', 'Super Creator', 'Deep Creator', 'Repo Legend'] },
  { label: 'Experience', doodle: 'hourglass', unit: 'years on GitHub', value: (d) => years(d.createdAt), steps: [0.01, 0.5, 1, 2, 3, 5, 7, 10], format: (v) => v.toFixed(1),
    titles: ['Newcomer', 'Settling In', 'One Year In', 'Seasoned', 'Veteran', 'Old Hand', 'Elder', 'Timeless'] },
  { label: 'Languages', doodle: 'palette', unit: 'languages', value: (d) => d.allTime.languages, steps: [1, 2, 4, 6, 8, 10, 12, 15],
    titles: ['First Language', 'Bilingual', 'Polyglot Apprentice', 'Polyglot', 'Multilingual', 'Rainbow Coder', 'Language Collector', 'Rainbow Lang User'] },
];

export function rankOf(cat, d) {
  const v = cat.value(d);
  let i = -1;
  cat.steps.forEach((s, k) => {
    if (v >= s) i = k;
  });
  return { value: v, index: i, next: i + 1 < cat.steps.length ? cat.steps[i + 1] : null };
}

function rosette(cx, cy, [face, deep], dd, rank) {
  let d = '';
  for (let i = 0; i <= 16; i++) {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? 37 : 44;
    d += `${i ? 'L' : 'M'}${fmt(cx + Math.cos(a) * r)} ${fmt(cy + Math.sin(a) * r)}`;
  }
  const tag = text(rank, { font: 'fuzzy', size: 16, x: cx, y: cy + 69, anchor: 'middle' });
  const tagW = Math.max(30, tag.width + 18);
  return `<g class="sway"><path d="M${cx - 18} ${cy + 26}L${cx - 30} ${cy + 74} ${cx - 18} ${cy + 66} ${cx - 10} ${cy + 78} ${cx - 2} ${cy + 30}M${cx + 18} ${cy + 26}L${cx + 30} ${cy + 74} ${cx + 18} ${cy + 66} ${cx + 10} ${cy + 78} ${cx + 2} ${cy + 30}" fill="${deep}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
    <path d="${d}Z" fill="${deep}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><circle cx="${cx}" cy="${cy}" r="29" fill="#FFFBF3" stroke="${INK}" stroke-width="2"/>
    ${doodle(dd, { x: cx, y: cy, size: 40, ink: INK })}
    <rect x="${fmt(cx - tagW / 2)}" y="${cy + 52}" width="${fmt(tagW)}" height="24" rx="7" fill="#FFFBF3" stroke="${INK}" stroke-width="1.8"/>${tag.paint(`${INK}`)}</g>`;
}

function tile(tone, cat, d, x, y, i) {
  const { value, index, next } = rankOf(cat, d);
  const tier = TIER[Math.max(0, index)];
  const rank = index >= 0 ? RANKS[index] : '?';
  const fmtV = cat.format ? cat.format(value) : num(value);
  const title = text(index >= 0 ? cat.titles[index] : 'Not yet', { font: 'fuzzy', size: 19, x: x + 132, y: y + 46 });
  const label = text(cat.label, { font: 'fuzzyR', size: 15, x: x + 132, y: y + 70 });
  const val = text(`${fmtV} ${cat.unit}`, { font: 'fuzzyR', size: 15, x: x + 132, y: y + 100 });
  const prev = index >= 0 ? cat.steps[index] : 0;
  const progress = next == null ? 1 : Math.min(1, Math.max(0.04, (value - prev) / (next - prev)));
  const nextLabel = text(next == null ? 'top rank reached' : `next: ${RANKS[index + 1]} at ${cat.format ? cat.format(next) : num(next)}`, { font: 'fuzzyR', size: 13, x: x + 132, y: y + 146 });
  const content = `${rosette(x + 66, y + 66, tier, cat.doodle, rank)}
    ${title.paint(`${INK}`)}${label.paint(`${INK}`, `fill-opacity=".6"`)}${val.paint(`${INK}`)}
    <rect x="${x + 132}" y="${y + 114}" width="210" height="11" rx="5.5" fill="#FFFBF3" stroke="${INK}" stroke-width="1.5"/>
    <rect class="grow" style="animation-delay:${fmt(0.5 + i * 0.08)}s" x="${x + 132}" y="${y + 114}" width="${fmt(210 * progress)}" height="11" rx="5.5" fill="${tier[1]}" stroke="${INK}" stroke-width="1.5"/>
    ${nextLabel.paint(`${INK}`, `fill-opacity=".62"`)}`;
  return sticker(tone, { x, y, w: 368, h: 168, fill: tier[0], rot: [-1, 0.8, -0.6, 1, -0.8, 0.6, -1.1, 0.9, -0.7][i], delay: 0.2 + i * 0.08, content });
}

export function trophiesCard(d, tone) {
  const t = TONES[tone];
  const H = 110 + 3 * 184 + 18;
  const tiles = CATEGORIES.map((cat, i) => tile(tone, cat, d, 32 + (i % 3) * 384, 112 + Math.floor(i / 3) * 184, i)).join('');
  const credit = text('rank idea from github-profile-trophy', { font: 'fuzzyR', size: 14, x: W - 36, y: 62, anchor: 'end' });
  const body = `<g clip-path="url(#card)">${paperBg(tone, { w: W, h: H })}
    ${cardHeader(tone, { title: 'Achievements', note: 'nine little ribbons, ranked C to SSS', doodleName: 'trophy', tint: PAPER.butter, seed: 9 })}
    ${credit.paint(`${t.faint}`)}${tiles}</g>
    ${paperBorder(tone, { w: W, h: H })}`;
  const summary = CATEGORIES.map((c) => `${c.label} ${RANKS[rankOf(c, d).index] ?? '?'}`).join(', ');
  return doc({ width: W, height: H, title: 'Achievements', desc: summary, style: JOURNAL_CSS, defs: paperDefs(tone, { w: W, h: H }), body });
}
