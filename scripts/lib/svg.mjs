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

/** Respect prefers-reduced-motion everywhere: freeze loops, show the final state. */
const REDUCED = '@media (prefers-reduced-motion:reduce){*{animation:none!important}.ul{stroke-dashoffset:0!important}}';

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
