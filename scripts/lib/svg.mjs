// Shared SVG building blocks: document wrapper, seeded randomness, small shapes, paper card.
import { C } from './theme.mjs';

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

/** Respect prefers-reduced-motion everywhere: freeze loops, show final state. */
const REDUCED = '@media (prefers-reduced-motion:reduce){*{animation:none!important}}';

export function doc({ width, height, title, desc = '', style = '', defs = '', body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title><desc id="d">${esc(desc)}</desc>
<style>${(style + REDUCED).replace(/\s+/g, ' ').trim()}</style>
<defs>${defs}</defs>
${body}
</svg>
`;
}

/** Simple almond leaf with a midrib, pointing up from its stem at the origin. */
export function leaf(s, fill = C.sky, rib = 'rgba(0,0,0,.18)') {
  const k = (n) => fmt(n * s);
  return `<path d="M0 0C${k(-0.55)} ${k(-0.3)} ${k(-0.5)} ${k(-0.85)} 0 ${k(-1.2)}C${k(0.5)} ${k(-0.85)} ${k(0.55)} ${k(-0.3)} 0 0Z" fill="${fill}"/><path d="M0 0L0 ${k(-1.05)}" stroke="${rib}" stroke-width="${fmt(Math.max(0.6, s * 0.06))}"/>`;
}

/** Hand-drawn wobbly line from (x1,y) to (x2,y). */
export function wobble(x1, x2, y, seed = 1, amp = 2.2) {
  const r = rng(seed);
  const n = Math.max(4, Math.round((x2 - x1) / 60));
  let d = `M${x1} ${y}`;
  for (let i = 1; i <= n; i++) {
    const x = lerp(x1, x2, i / n);
    const cx = lerp(x1, x2, (i - 0.5) / n);
    d += `Q${fmt(cx)} ${fmt(y + (r() - 0.5) * amp * 2)} ${fmt(x)} ${fmt(y + (r() - 0.5) * amp)}`;
  }
  return d;
}

/** Paper card: cream fill, warm hairline border, soft offset shadow. */
export function card({ x = 0, y = 0, w, h, r = 18 }) {
  return `<rect x="${x + 3}" y="${y + 5}" width="${w - 6}" height="${h - 8}" rx="${r}" fill="#000" opacity=".06"/>` +
    `<rect x="${x + 1}" y="${y + 1}" width="${w - 6}" height="${h - 8}" rx="${r}" fill="${C.paper}" stroke="${C.rule}" stroke-width="1.5"/>`;
}

/** XML-escape for text that still goes into attributes/titles. */
export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
