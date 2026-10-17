// The featured DevOps & Cloud page: my pipeline drawn as a road, stop by stop, with little parcels
// riding it past a "you are here" pin and up a dotted path into the cloud I'm learning next.
// Full width and first in the stack, so it reads as the focus, not one card among six.
import { words as text, measure } from '../lib/type.mjs';
import { doc, fmt } from '../lib/svg.mjs';
import { doodle, PAPER } from '../lib/doodles.mjs';
import { TONES, INK, JOURNAL_CSS, paperDefs, paperBg, paperBorder, squiggle, sticker, inkStar, inkPlus, inkArrow, logo } from '../lib/journal.mjs';

const W = 1200;
const H = 574;
const TILE = 74; // logo sticker on the road
const NEXT_TILE = 62; // dashed sticker in the cloud
const ROAD_Y = 254; // road centre line; the stickers sit on it
const STOPS_X = [44, 1066]; // the stops share this span; the pin and the bend live to its right
const PIN_X = 1124;
const CLOUD = { x: 556, y: 398, w: 610, h: 170 };
const MIN_GAP = 36; // between neighbouring stops, so each one reads as its own stop
const DOT = 29; // numbered dot in front of each stop caption, gap included
const FONT = { label: { font: 'fuzzyR', size: 15 }, caption: { font: 'fuzzy', size: 18 }, note: { font: 'fuzzyR', size: 13 } };
const CLOUD_TONE = { night: { fillOp: 0.05, glowOp: 0.24 }, cream: { fillOp: 0.62, glowOp: 0.5 } };
const TILT = [-3, 2.5, -1.5, 2, -2.5];

const CSS = `
  @keyframes flow{to{stroke-dashoffset:-38}} .flow{animation:flow 2.6s linear infinite}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}} .float{animation:float 7s ease-in-out infinite}
  @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}} .bob{animation:bob 2.8s ease-in-out infinite}
  @media (prefers-reduced-motion:reduce){.parcel{display:none}}`;

/** Tile centres and extents of one stop, relative to its left edge. Labels decide the spacing. */
function measureStop(stop) {
  const labels = stop.items.map((n) => measure(n, FONT.label));
  const centers = [0];
  for (let i = 1; i < labels.length; i++) centers.push(centers[i - 1] + Math.max(TILE + 14, (labels[i - 1] + labels[i]) / 2 + 18));
  const mid = centers.at(-1) / 2;
  const capW = DOT + measure(stop.label, FONT.caption);
  const noteW = stop.note ? measure(stop.note, FONT.note) : 0;
  const left = Math.min(-Math.max(TILE, labels[0]) / 2, mid - capW / 2, mid - noteW / 2);
  const right = Math.max(centers.at(-1) + Math.max(TILE, labels.at(-1)) / 2, mid + capW / 2, mid + noteW / 2);
  return { centers: centers.map((c) => c - left), mid: mid - left, width: right - left, capW };
}

/** Spread the stops evenly over STOPS_X; refuse to draw a road where stops would run together. */
function placeStops(stops) {
  const m = stops.map(measureStop);
  const gap = (STOPS_X[1] - STOPS_X[0] - m.reduce((s, x) => s + x.width, 0)) / (stops.length - 1);
  if (gap < MIN_GAP) throw new Error(`DevOps stops don't fit: ${gap.toFixed(1)}px between stops (need ${MIN_GAP}). Shorten a label or note.`);
  let x = STOPS_X[0];
  return m.map((s) => {
    const at = x;
    x += s.width + gap;
    return { ...s, x: at };
  });
}

/** The road: a gentle hand-drawn wobble rather than a ruler line. */
function roadPath(x0, x1, y) {
  const n = Math.round((x1 - x0) / 160);
  let d = `M${x0} ${y}`;
  for (let i = 1; i <= n; i++) d += `Q${fmt(x0 + ((x1 - x0) * (i - 0.5)) / n)} ${y + (i % 2 ? -5 : 5)} ${fmt(x0 + ((x1 - x0) * i) / n)} ${y}`;
  return d;
}

/** Soft cloud filling the box: big bumps on top, shallow scallops underneath. */
function cloudPath({ x, y, w, h }) {
  const base = y + h * 0.78;
  const top = [[0.04, 0.78], [0.1, 0.42], [0.27, 0.14], [0.5, 0.02], [0.72, 0.12], [0.9, 0.38], [0.96, 0.78]].map(([px, py]) => [x + w * px, y + h * py]);
  let d = `M${fmt(top[0][0])} ${fmt(top[0][1])}`;
  for (let i = 1; i < top.length; i++) {
    const r = Math.hypot(top[i][0] - top[i - 1][0], top[i][1] - top[i - 1][1]) * 0.62;
    d += `A${fmt(r)} ${fmt(r)} 0 0 1 ${fmt(top[i][0])} ${fmt(top[i][1])}`;
  }
  const span = top.at(-1)[0] - top[0][0];
  for (let i = 1; i <= 3; i++) d += `A${fmt(span * 0.25)} ${fmt(span * 0.11)} 0 0 1 ${fmt(top.at(-1)[0] - (span * i) / 3)} ${fmt(base)}`;
  return `${d}Z`;
}

/** A parcel riding the whole route; two of them, half a trip apart, keep the pipeline moving. */
function parcel(begin) {
  const timing = `dur="15s" begin="${begin}" repeatCount="indefinite"`;
  return `<g class="parcel"><g opacity="0"><animateMotion ${timing} rotate="0"><mpath href="#route"/></animateMotion>
    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.04;.9;1" ${timing}/>
    <rect x="-11" y="-10" width="22" height="17" rx="3" fill="${PAPER.peach}" stroke="${INK}" stroke-width="1.6"/>
    <rect x="-2.5" y="-10" width="5" height="17" fill="${PAPER.butter}" stroke="${INK}" stroke-width="1.2"/></g></g>`;
}

function pin(x, y, t) {
  return `<ellipse cx="${x}" cy="${y + 2}" rx="8" ry="2.6" fill="${t.shadow}" opacity="${t.shadowOp}"/>
    <g class="bob"><path d="M${x} ${y}C${x - 8} ${y - 10} ${x - 13} ${y - 16} ${x - 13} ${y - 24}A13 13 0 0 1 ${x + 13} ${y - 24}C${x + 13} ${y - 16} ${x + 8} ${y - 10} ${x} ${y}Z" fill="${PAPER.roseDeep}" stroke="${t.ink}" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="${x}" cy="${y - 24}" r="5" fill="#FFFBF3" stroke="${t.ink}" stroke-width="1.6"/></g>`;
}

function stopMarkup(stop, s, i, t, tone) {
  const capX = s.x + s.mid - s.capW / 2;
  const dotY = ROAD_Y - TILE / 2 - 21;
  const caption = `<circle cx="${fmt(capX + 11)}" cy="${dotY}" r="11" fill="${PAPER.butter}" stroke="${INK}" stroke-width="1.5"/>
    ${text(String(i + 1), { font: 'fuzzy', size: 13, x: capX + 11, y: dotY + 4.5, anchor: 'middle' }).paint(INK)}
    ${text(stop.label, { ...FONT.caption, x: capX + DOT, y: ROAD_Y - TILE / 2 - 15 }).paint(t.ink)}`;
  const tiles = stop.items
    .map((name, k) => {
      const cx = s.x + s.centers[k];
      const tile = sticker(tone, {
        x: cx - TILE / 2, y: ROAD_Y - TILE / 2, w: TILE, h: TILE, fill: '#FFFFFF', r: 19, rot: TILT[(i + k) % TILT.length], delay: 0.25 + i * 0.12 + k * 0.06,
        content: logo(name, cx, ROAD_Y, 44),
      });
      return `${tile}${text(name, { ...FONT.label, x: cx, y: ROAD_Y + TILE / 2 + 24, anchor: 'middle' }).paint(t.ink, 'fill-opacity=".92"')}`;
    })
    .join('');
  const note = stop.note ? text(stop.note, { ...FONT.note, x: s.x + s.mid, y: ROAD_Y + TILE / 2 + 45, anchor: 'middle' }).paint(t.soft) : '';
  return `${caption}${tiles}${note}`;
}

function cloudMarkup(next, t, tone) {
  const { x, y, w, h } = CLOUD;
  const x0 = x + 110;
  const x1 = x + w - 100;
  const cy = y + 72;
  const tiles = next.items
    .map((name, i) => {
      const cx = x0 + ((x1 - x0) * i) / (next.items.length - 1);
      const tile = sticker(tone, {
        x: cx - NEXT_TILE / 2, y: cy - NEXT_TILE / 2, w: NEXT_TILE, h: NEXT_TILE, r: 17, rot: -TILT[i % TILT.length], delay: 1.2 + i * 0.08, dashed: true,
        content: logo(name, cx, cy, 36),
      });
      return `${tile}${text(name, { ...FONT.label, size: 14, x: cx, y: cy + NEXT_TILE / 2 + 21, anchor: 'middle' }).paint(t.ink, 'fill-opacity=".78"')}`;
    })
    .join('');
  return `<ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${fmt(w * 0.62)}" ry="${fmt(h * 0.9)}" fill="url(#glow)"/>
    <g class="float"><path d="${cloudPath(CLOUD)}" fill="#FFFFFF" fill-opacity="${CLOUD_TONE[tone].fillOp}" stroke="${t.soft}" stroke-opacity=".6" stroke-width="2" stroke-dasharray="7 6" stroke-linecap="round"/>${tiles}</g>`;
}

export function devopsCard(cfg, tone) {
  const t = TONES[tone];
  const stops = placeStops(cfg.stops);
  const road = roadPath(36, PIN_X, ROAD_Y);
  const ahead = `C${PIN_X + 56} ${ROAD_Y} ${W - 30} ${ROAD_Y + 44} ${W - 40} ${ROAD_Y + 98}S${W - 92} ${ROAD_Y + 150} ${W - 112} ${ROAD_Y + 166}`;

  // header: bigger than the toolbox cards, plus a "main quest" tag
  const tx = 136;
  const title = text(cfg.title, { font: 'fuzzy', size: 48, x: tx, y: 84 });
  const badge = sticker(tone, { x: 34, y: 26, w: 84, h: 84, fill: PAPER.blue, rot: -6, r: 20, content: doodle(cfg.doodle, { x: 76, y: 68, size: 56, ink: INK }) });
  const tagX = tx + title.width + 30;
  const tagLabel = text(cfg.tag, { font: 'fuzzy', size: 18, x: tagX + 42, y: 69 });
  const tagW = 42 + tagLabel.width + 16;
  const tag = sticker(tone, { x: tagX, y: 42, w: tagW, h: 42, fill: PAPER.butter, rot: 3, r: 12, delay: 0.5, content: `${doodle('star', { x: tagX + 23, y: 63, size: 26, ink: INK })}${tagLabel.paint(INK)}` });
  const header = `${badge}${title.paint(t.ink)}${squiggle(tx, tx + title.width, 97, t.squiggle, 7)}
    ${text(cfg.note, { font: 'fuzzyR', size: 19, x: tx + 2, y: 129 }).paint(t.soft)}${tag}`;

  const roadMarkup = `<path d="${road}" fill="none" stroke="${t.grid}" stroke-opacity="${fmt(t.gridOp * 1.9)}" stroke-width="18" stroke-linecap="round"/>
    <path class="flow" d="${road}" fill="none" stroke="${t.soft}" stroke-opacity=".55" stroke-width="2.2" stroke-dasharray="10 9" stroke-linecap="round"/>
    <path d="M${PIN_X} ${ROAD_Y}${ahead}" fill="none" stroke="${t.soft}" stroke-opacity=".75" stroke-width="2.6" stroke-dasharray=".1 9" stroke-linecap="round"/>`;

  // "next on the road", pointing into the cloud
  const nextTitle = text(cfg.next.title, { font: 'fuzzy', size: 26, x: 144, y: 452 });
  const nextBlock = `${sticker(tone, { x: 56, y: 416, w: 68, h: 68, fill: PAPER.peach, rot: -7, r: 18, delay: 1.1, content: doodle('rocket', { x: 90, y: 450, size: 46, ink: INK }) })}
    ${nextTitle.paint(t.ink)}${text(cfg.next.note, { font: 'fuzzyR', size: 16, x: 146, y: 481 }).paint(t.soft)}
    ${inkArrow(144 + nextTitle.width + 18, 444, CLOUD.x + 30, 468, t.soft, -26)}`;

  const sparkles = [
    inkStar(tagX + tagW + 20, 50, 7, t.squiggle, 0.6),
    inkStar(CLOUD.x + 40, CLOUD.y - 6, 8, t.squiggle, 0.2),
    inkStar(CLOUD.x + CLOUD.w - 30, CLOUD.y + 4, 6, t.squiggle, 1.4, -8),
    inkPlus(CLOUD.x + CLOUD.w * 0.36, CLOUD.y - 18, t.soft, 0.8),
    inkPlus(CLOUD.x + CLOUD.w + 12, CLOUD.y + CLOUD.h - 30, t.soft, 2),
  ].join('');

  const body = `<g clip-path="url(#card)">${paperBg(tone, { w: W, h: H })}
    <rect x="9" y="9" width="${W - 18}" height="${H - 18}" rx="15" fill="none" stroke="${t.soft}" stroke-opacity=".3" stroke-width="1.4" stroke-dasharray="7 6"/>
    ${header}${sparkles}${cloudMarkup(cfg.next, t, tone)}${roadMarkup}${parcel('0s')}${parcel('-7.5s')}
    ${cfg.stops.map((stop, i) => stopMarkup(stop, stops[i], i, t, tone)).join('')}
    ${pin(PIN_X, ROAD_Y - 1, t)}${text(cfg.here, { font: 'fuzzyR', size: 15, x: PIN_X, y: ROAD_Y - 46, anchor: 'middle' }).paint(t.ink)}
    ${nextBlock}</g>
    ${paperBorder(tone, { w: W, h: H })}`;
  const defs = `${paperDefs(tone, { w: W, h: H })}<path id="route" d="${road}${ahead}"/>
    <radialGradient id="glow"><stop offset="0" stop-color="${PAPER.blue}" stop-opacity="${CLOUD_TONE[tone].glowOp}"/><stop offset="1" stop-color="${PAPER.blue}" stop-opacity="0"/></radialGradient>`;
  const desc = `${cfg.note}. Today: ${cfg.stops.map((s) => `${s.label} (${s.items.join(', ')})`).join(', ')}. ${cfg.next.title}: ${cfg.next.items.join(', ')}`;
  return doc({ width: W, height: H, title: `${cfg.title}, my ${cfg.tag}`, desc, style: JOURNAL_CSS + CSS, defs, body });
}
