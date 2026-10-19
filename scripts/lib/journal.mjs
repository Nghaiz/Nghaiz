// "Cozy journal" design system shared by every widget: two paper tones that follow the viewer's
// GitHub theme (night journal for dark, cream paper for light), matte sticker papers, washi tape
// with torn ends, and hand-drawn marks. Everything returns SVG markup strings.
import { fmt, rng, CYCLE, FIRST_WAVE, waveDelay, redrawKeyframes } from './svg.mjs';
import { words as text, measure } from './type.mjs';
import { doodle, PAPER } from './doodles.mjs';

export const TONES = {
  night: {
    paper: '#262233', grain: 0.35, dots: '#FFFFFF', dotsOp: 0.06, ink: '#F6EEDF', soft: '#D3CABD', faint: '#9C93A8',
    line: '#3A3448', marker: '#D98FA0', markerOp: 0.4, squiggle: '#EFA6B0', doodle: '#F6EEDF', grid: '#FFFFFF', gridOp: 0.06,
    shadow: '#000000', shadowOp: 0.35,
  },
  cream: {
    paper: '#F6EFE3', grain: 0.5, dots: '#7A6450', dotsOp: 0.12, ink: '#3A3245', soft: '#6F6475', faint: '#9C92A0',
    line: '#E3D8C6', marker: '#F3D27A', markerOp: 0.55, squiggle: '#E59AA6', doodle: '#8A7590', grid: '#7A6450', gridOp: 0.1,
    shadow: '#5A4636', shadowOp: 0.22,
  },
};
export const MODES = { dark: 'night', light: 'cream' };
export const INK = '#3A3245'; // ink on stickers, identical in both tones
export const STICKERS = [PAPER.blue, PAPER.lavender, PAPER.rose, PAPER.sage, PAPER.butter, PAPER.peach, PAPER.mint];
/** Stickers wider than this lift without the tilt: on a long sticker the tilt turns into a seesaw. */
const WIDE_STICKER = 160;
export const TAPE = { rose: ['#E8B4B8', 'tpDots'], sage: ['#A8C3A0', 'tpStripes'], blue: ['#A9C6E8', 'tpGrid'], butter: ['#F2D7A0', 'tpDots'], lilac: ['#CBB8E6', 'tpStripes'] };

/**
 * Shared animation vocabulary: stickers get placed, ink gets drawn, doodles breathe. Calm, no bounce.
 * Entrances are followed by the CYCLE wave (see lib/svg.mjs); give staggered elements `waveDelay()`.
 */
export const JOURNAL_CSS = `
  @keyframes place{0%{opacity:0;transform:translate(0,-8px) rotate(-3deg)}100%{opacity:1;transform:none}}
  @keyframes lift{0%,11%,100%{transform:none}4.5%{transform:translateY(-6px) rotate(-2deg)}}
  .place{transform-box:fill-box;transform-origin:center;animation:place .9s cubic-bezier(.25,.8,.3,1) 0s both,lift ${CYCLE}s ease-in-out ${FIRST_WAVE}s infinite}
  @keyframes liftw{0%,11%,100%{transform:none}4.5%{transform:translateY(-4px)}} .place.wide{animation-name:place,liftw}
  @keyframes draw{to{stroke-dashoffset:0}} ${redrawKeyframes('redraw', 600)}
  .ul{stroke-dasharray:600;stroke-dashoffset:600;animation:draw 1.4s ease-out .4s forwards,redraw ${CYCLE}s ease-in-out ${fmt(0.4 + FIRST_WAVE)}s infinite}
  .trace{animation:draw 2.4s ease-out .4s forwards}
  @keyframes tw{0%,100%{opacity:.45}50%{opacity:1}} .tw{animation:tw 3.6s ease-in-out infinite}
  @keyframes kb{0%{transform:scale(1.02)}100%{transform:scale(1.09)}} .kb{transform-origin:50% 50%;animation:kb 22s ease-in-out infinite alternate}
  @keyframes mark{0%{transform:scaleX(0)}100%{transform:scaleX(1)}} @keyframes remark{0%,16%,100%{transform:scaleX(1)}6%{transform:scaleX(0)}}
  .mark{transform-box:fill-box;transform-origin:left;animation:mark .8s ease-out .3s both,remark ${CYCLE}s ease-in-out ${fmt(0.3 + FIRST_WAVE)}s infinite}
  @keyframes grow{0%{transform:scaleX(0)}100%{transform:scaleX(1)}} @keyframes regrow{0%,18%,100%{transform:scaleX(1)}7%{transform:scaleX(.08)}}
  .grow{transform-box:fill-box;transform-origin:left;animation:grow 1.1s cubic-bezier(.3,.7,.3,1) 0s both,regrow ${CYCLE}s ease-in-out ${FIRST_WAVE}s infinite}
  @keyframes pop{0%,9%,100%{transform:none}4.5%{transform:scale(1.25)}}
  .pop{transform-box:fill-box;transform-origin:center;animation:fadein .8s ease-out 0s both,pop ${CYCLE}s ease-in-out ${FIRST_WAVE}s infinite}
  @keyframes sway{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}} .sway{transform-box:fill-box;transform-origin:50% 0%;animation:sway 5s ease-in-out infinite}
  @keyframes fadein{0%{opacity:0}100%{opacity:1}} .fadein{animation:fadein .8s ease-out both}`;

/** Defs every journal card needs: clip, paper grain, dot grid, tape patterns, soft shadow. */
export function paperDefs(tone, { w, h, r = 22 }) {
  const t = TONES[tone];
  return `<clipPath id="card"><rect width="${w}" height="${h}" rx="${r}"/></clipPath>
    <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .42  0 0 0 0 .35  0 0 0 .55 0"/></filter>
    <pattern id="grainFill" width="200" height="120" patternUnits="userSpaceOnUse"><rect width="200" height="120" filter="url(#grain)" opacity=".35"/></pattern>
    <pattern id="dotgrid" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="${t.dots}" opacity="${t.dotsOp}"/></pattern>
    <pattern id="tpDots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="1.6" fill="#FFFFFF"/></pattern>
    <pattern id="tpStripes" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3.5" height="8" fill="#FFFFFF"/></pattern>
    <pattern id="tpGrid" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 4H8M4 0V8" stroke="#FFFFFF" stroke-width="1.2"/></pattern>
    <filter id="soft" x="-15%" y="-25%" width="130%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>`;
}

export function paperBg(tone, { w, h }) {
  const t = TONES[tone];
  return `<rect width="${w}" height="${h}" fill="${t.paper}"/><rect width="${w}" height="${h}" fill="url(#dotgrid)"/><rect width="${w}" height="${h}" filter="url(#grain)" opacity="${t.grain}"/>`;
}

export function paperBorder(tone, { w, h, r = 22 }) {
  return `<rect x=".75" y=".75" width="${w - 1.5}" height="${h - 1.5}" rx="${r}" fill="none" stroke="${TONES[tone].line}" stroke-width="1.5"/>`;
}

/** Washi tape strip with torn zig-zag ends, centred on (x, y). */
export function tape(x, y, rot, colorKey = 'rose', w = 74, h = 22) {
  const [color, pattern] = TAPE[colorKey];
  const teeth = 6;
  let right = '';
  let left = '';
  for (let i = 1; i <= teeth; i++) right += `L${fmt(w / 2 + (i % 2 ? 3 : 0))} ${fmt(-h / 2 + (h * i) / teeth)}`;
  for (let i = teeth - 1; i >= 0; i--) left += `L${fmt(-w / 2 - (i % 2 ? 3 : 0))} ${fmt(-h / 2 + (h * i) / teeth)}`;
  const d = `M${-w / 2} ${-h / 2}H${w / 2}${right}H${-w / 2}${left}Z`;
  return `<g transform="translate(${fmt(x)} ${fmt(y)}) rotate(${rot})"><path d="${d}" fill="${color}" opacity=".9"/><path d="${d}" fill="url(#${pattern})" opacity=".5"/></g>`;
}

/**
 * Matte paper sticker: soft shadow, die-cut white border, pastel face with grain.
 * `content` is drawn on top in the sticker's own (rotated) frame.
 */
export function sticker(tone, { x, y, w, h, fill, rot = 0, delay = 0, r = 16, border = 4, dashed = false, content = '' }) {
  const t = TONES[tone];
  const edge = dashed
    ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#FFFBF3" fill-opacity=".82" stroke="${t.ink}" stroke-opacity=".45" stroke-width="1.6" stroke-dasharray="5 5"/>`
    : `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#FFFBF3"/>`;
  const face = dashed ? '' : `<rect x="${x + border}" y="${y + border}" width="${w - 2 * border}" height="${h - 2 * border}" rx="${r - 3}" fill="${fill}"/><rect x="${x + border}" y="${y + border}" width="${w - 2 * border}" height="${h - 2 * border}" rx="${r - 3}" fill="url(#grainFill)" opacity=".5"/>`;
  return `<g transform="rotate(${rot} ${fmt(x + w / 2)} ${fmt(y + h / 2)})"><g class="place${w > WIDE_STICKER ? ' wide' : ''}" style="${waveDelay(delay)}">
    ${dashed ? '' : `<rect x="${x + 1}" y="${y + 4}" width="${w}" height="${h}" rx="${r}" fill="${t.shadow}" opacity="${t.shadowOp}" filter="url(#soft)"/>`}${edge}${face}${content}</g></g>`;
}

/** Hand-drawn wavy underline from x1 to x2 at y; draws itself in. */
export function squiggle(x1, x2, y, color, seed = 1) {
  const r = rng(seed);
  const n = Math.max(3, Math.round((x2 - x1) / 40));
  let d = `M${fmt(x1)} ${fmt(y)}`;
  for (let i = 1; i <= n; i++) {
    const xa = x1 + ((x2 - x1) * (i - 0.5)) / n;
    const xb = x1 + ((x2 - x1) * i) / n;
    d += `Q${fmt(xa)} ${fmt(y + (i % 2 ? -4 : 4) + (r() - 0.5) * 2)} ${fmt(xb)} ${fmt(y + (r() - 0.5) * 2)}`;
  }
  return `<path class="ul" d="${d}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
}

/** Highlighter stroke behind a word: slightly skewed, swept in from the left. */
export function marker(x, y, w, h, color, opacity) {
  return `<path class="mark" d="M${fmt(x)} ${fmt(y + 2)}L${fmt(x + w)} ${fmt(y)}L${fmt(x + w + 2)} ${fmt(y + h)}L${fmt(x + 1)} ${fmt(y + h + 2)}Z" fill="${color}" opacity="${opacity}"/>`;
}

export function inkStar(x, y, r, color, delay = 0, rot = 12) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    pts.push(`${fmt(Math.cos(a) * rr)} ${fmt(Math.sin(a) * rr)}`);
  }
  return `<g transform="translate(${fmt(x)} ${fmt(y)}) rotate(${rot})"><path class="tw" style="animation-delay:${delay}s" d="M${pts.join('L')}Z" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round"/></g>`;
}

export function inkHeart(x, y, color, delay = 0) {
  return `<g transform="translate(${fmt(x)} ${fmt(y)}) rotate(-10)"><path class="tw" style="animation-delay:${delay}s" d="M0 6C-5 2.5 -8 -.5 -8 -3.6A4 4 0 0 1 0 -5.4A4 4 0 0 1 8 -3.6C8 -.5 5 2.5 0 6Z" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round"/></g>`;
}

export function inkPlus(x, y, color, delay = 0) {
  return `<path class="tw" style="animation-delay:${delay}s" d="M${x} ${y - 6}V${y + 6}M${x - 6} ${y}H${x + 6}" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>`;
}

/** Curved hand-drawn arrow from (x1,y1) to (x2,y2), bowing by `bend`. */
export function inkArrow(x1, y1, x2, y2, color, bend = -30) {
  const mx = (x1 + x2) / 2 + bend * 0.3;
  const my = (y1 + y2) / 2 + bend;
  const a = Math.atan2(y2 - my, x2 - mx);
  const h1 = [x2 - 9 * Math.cos(a - 0.45), y2 - 9 * Math.sin(a - 0.45)];
  const h2 = [x2 - 9 * Math.cos(a + 0.45), y2 - 9 * Math.sin(a + 0.45)];
  return `<path class="ul" d="M${fmt(x1)} ${fmt(y1)}Q${fmt(mx)} ${fmt(my)} ${fmt(x2)} ${fmt(y2)}M${fmt(h1[0])} ${fmt(h1[1])}L${fmt(x2)} ${fmt(y2)}L${fmt(h2[0])} ${fmt(h2[1])}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
}

const HEADER = { x: 28, textDx: 78, titleSize: 30, noteSize: 16, noteDx: 2 };

/** Right edge of cardHeader's title and note, so a card can keep other art clear of them. */
export function cardHeaderRight({ title, note, x = HEADER.x, titleSize = HEADER.titleSize }) {
  const tx = x + HEADER.textDx;
  const noteRight = note ? tx + HEADER.noteDx + measure(note, { font: 'fuzzyR', size: HEADER.noteSize }) : 0;
  return Math.max(tx + measure(title, { font: 'fuzzy', size: titleSize }), noteRight);
}

/** Card header: tilted doodle sticker, handwritten title with squiggle, small note under it. */
export function cardHeader(tone, { title, note, doodleName, x = HEADER.x, y = 22, titleSize = HEADER.titleSize, seed = 3, tint = PAPER.butter }) {
  const t = TONES[tone];
  const tx = x + HEADER.textDx;
  const head = text(title, { font: 'fuzzy', size: titleSize, x: tx, y: y + 36 });
  const sub = note ? text(note, { font: 'fuzzyR', size: HEADER.noteSize, x: tx + HEADER.noteDx, y: y + 66 }) : null;
  const badge = sticker(tone, { x, y, w: 62, h: 62, fill: tint, rot: -5, r: 16, content: doodle(doodleName, { x: x + 31, y: y + 31, size: 40, ink: INK }) });
  return `${badge}${head.paint(`${t.ink}`)}${squiggle(tx, tx + head.width, y + 46, t.squiggle, seed)}${sub ? `${sub.paint(`${t.soft}`)}` : ''}`;
}

/** Polaroid of a Shinkai sky crop, taped down, with a handwritten caption. */
export function polaroid(tone, { x, y, w, h, rot = -3, image, caption, tapes = ['rose', 'sage'] }) {
  const t = TONES[tone];
  const pad = 10;
  const ph = h - pad - 34;
  return `<g transform="rotate(${rot} ${fmt(x + w / 2)} ${fmt(y + h / 2)})">
    <rect x="${x + 2}" y="${y + 5}" width="${w}" height="${h}" rx="6" fill="${t.shadow}" opacity="${t.shadowOp}" filter="url(#soft)"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#FFFBF3"/>
    <clipPath id="pol"><rect x="${x + pad}" y="${y + pad}" width="${w - 2 * pad}" height="${ph}" rx="3"/></clipPath>
    <g clip-path="url(#pol)"><g class="kb">${image(x + pad, y + pad, w - 2 * pad, ph)}</g></g>
    ${text(caption, { font: 'fuzzyR', size: 16, x: x + w / 2, y: y + h - 12, anchor: 'middle' }).paint(`#6B5E70`)}
    ${tape(x + 38, y + 2, -16, tapes[0])}${tape(x + w - 34, y + 4, 12, tapes[1])}</g>`;
}
