// Tech stack as journal pages: one card per group, every tool a logo sticker with its name.
// Things I'm learning next get a dashed outline and a little "next" tape. The empty corner of the
// header holds a small moving scene (assets/vignettes.mjs) that acts out what the group is for.
import { words as text } from '../lib/type.mjs';
import { doc, fmt } from '../lib/svg.mjs';
import { PAPER } from '../lib/doodles.mjs';
import { TONES, INK, JOURNAL_CSS, paperDefs, paperBg, paperBorder, cardHeader, cardHeaderRight, sticker, tape } from '../lib/journal.mjs';
import { logo } from '../lib/images.mjs';
import { scene, SCENE_BOX } from './vignettes.mjs';

const W = 600;
const PER_ROW = 5;
const TINTS = { languages: PAPER.blue, apps: PAPER.lavender, backend: PAPER.peach, data: PAPER.mint, stores: PAPER.butter, tools: PAPER.rose };
const SCENE_GAP = 12;

/** The header text must end before the scene corner starts, or the two would overlap. */
function assertSceneFits(group) {
  const right = cardHeaderRight({ title: group.title, note: group.note });
  if (right > SCENE_BOX.x - SCENE_GAP) throw new Error(`"${group.title}" header runs to x=${right.toFixed(0)}, into the scene corner at ${SCENE_BOX.x}. Shorten the title or note.`);
}

export const toolboxHeight = (group) => 112 + Math.ceil(group.items.length / PER_ROW) * 118 + 10;

export function toolbox(group, tone) {
  const t = TONES[tone];
  const H = toolboxHeight(group);
  const tiles = group.items
    .map((item, i) => {
      const { name, next } = typeof item === 'string' ? { name: item } : item;
      const cx = 32 + 54 + (i % PER_ROW) * 107;
      const y = 112 + Math.floor(i / PER_ROW) * 118;
      const label = text(name, { font: 'fuzzyR', size: 14, x: cx, y: y + 90, anchor: 'middle' });
      const tile = sticker(tone, {
        x: cx - 34, y, w: 68, h: 68, fill: '#FFFFFF', r: 18, rot: [-3, 2, -1.5, 2.5, -2][i % 5], delay: 0.2 + i * 0.05, dashed: !!next,
        content: logo(name, cx, y + 34, 40),
      });
      const nextTape = next ? `${tape(cx + 26, y + 4, 18, 'butter', 40, 16)}<g transform="rotate(18 ${cx + 26} ${y + 4})">${text('next', { font: 'fuzzyR', size: 11, x: cx + 26, y: y + 8, anchor: 'middle' }).paint(INK)}</g>` : '';
      return `${tile}${nextTape}${label.paint(`${t.ink}`, `fill-opacity="${next ? 0.7 : 0.92}"`)}`;
    })
    .join('');
  if (group.scene) assertSceneFits(group);
  const vignette = scene(tone, group.scene);
  const body = `<g clip-path="url(#card)">${paperBg(tone, { w: W, h: H })}
    ${cardHeader(tone, { title: group.title, note: group.note, doodleName: group.doodle, tint: TINTS[group.key] || PAPER.butter, seed: group.title.length })}
    ${vignette.svg}${tiles}</g>
    ${paperBorder(tone, { w: W, h: H })}`;
  const names = group.items.map((i) => (typeof i === 'string' ? i : `${i.name} (next)`));
  return doc({ width: W, height: H, title: group.title, desc: names.join(', '), style: JOURNAL_CSS + vignette.css, defs: paperDefs(tone, { w: W, h: H }), body });
}
