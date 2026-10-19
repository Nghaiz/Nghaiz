// Shared SVG building blocks: document wrapper, seeded randomness, XML escaping.
import { takeGlyphDefs } from './type.mjs';

export const fmt = (n) => +n.toFixed(2);
export const lerp = (a, b, t) => a + (b - a) * t;

/** Deterministic PRNG so regenerated assets don't churn in git diffs. */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Motion clock shared by every widget. GitHub loads all README images at once (no JS, and it strips
 * `loading="lazy"`), so an entrance is over before the viewer scrolls to it. Instead, once its
 * entrance is done, every element re-plays a soft wave each CYCLE seconds: stickers lift and settle,
 * ink re-draws, bars re-sweep. Content never disappears, so a card stays readable mid-wave.
 */
export const CYCLE = 9;
/** The first wave starts this long after an element's own entrance delay (entrances last < 2s). */
export const FIRST_WAVE = 3.5;

/** `animation-delay` for an element animated as "entrance, wave": the wave keeps the entrance stagger. */
export const waveDelay = (delay) => `animation-delay:${fmt(delay)}s,${fmt(delay + FIRST_WAVE)}s`;

/** Ink wave for a dashed-in stroke of dash length `len`: wipe it away along the path, then draw it again. */
export const redrawKeyframes = (name, len) =>
  `@keyframes ${name}{0%{stroke-dashoffset:0}7%{stroke-dashoffset:-${len}}7.01%{stroke-dashoffset:${len}}20%,100%{stroke-dashoffset:0}}`;

/** @keyframes from [seconds | [seconds...], declarations] stops, so timings read in seconds, not percent. */
export function keyframes(name, period, stops) {
  let last = 0;
  for (const s of stops.flatMap(([at]) => [].concat(at))) {
    if (s < last || s > period) throw new Error(`@keyframes ${name}: stop at ${s}s is out of order or past its ${period}s period`);
    last = s;
  }
  return `@keyframes ${name}{${stops.map(([at, css]) => `${[].concat(at).map((s) => `${fmt((s / period) * 100)}%`).join(',')}{${css}}`).join('')}}`;
}

/** Class rule running keyframes `name` forever; `both` keeps the 0% state during a positive delay. */
export const loop = (name, period, delay = 0, extra = '', ease = 'ease-in-out') =>
  `.${name}{${extra}animation:${name} ${fmt(period)}s ${ease} ${fmt(delay)}s infinite both}`;

/** Respect prefers-reduced-motion everywhere: freeze loops, show the final state. */
const REDUCED = '@media (prefers-reduced-motion:reduce){*{animation:none!important}.ul,.ln,.trace{stroke-dashoffset:0!important}}';

export function doc({ width, height, title, desc = '', style = '', defs = '', body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title><desc id="d">${esc(desc)}</desc>
<style>${(style + REDUCED).replace(/\s+/g, ' ').trim()}</style>
<defs>${defs}${takeGlyphDefs()}</defs>
${body}
</svg>
`;
}

/** XML-escape for text that still goes into attributes/titles. */
export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
