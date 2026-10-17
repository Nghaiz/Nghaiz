// Shared SVG building blocks: document wrapper, seeded randomness, the night-sky card.
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

/** Respect prefers-reduced-motion everywhere: freeze loops, show the final state. */
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

/**
 * Night-sky card: deep-blue gradient, faint twinkling stars, a soft comet-coloured glow in one
 * corner, hairline border. Returns { css, defs, svg } — draw content after `svg`.
 */
export function nightCard({ w, h, seed = 1, r = 18 }) {
  const rand = rng(seed);
  let stars = '';
  for (let i = 0; i < Math.round((w * h) / 9000); i++) {
    stars += `<circle class="nc-st" cx="${fmt(rand() * w)}" cy="${fmt(rand() * h)}" r="${fmt(0.4 + rand() * 0.9)}" fill="#FFFFFF" style="animation-delay:${fmt(-rand() * 6)}s;animation-duration:${fmt(3 + rand() * 4)}s"/>`;
  }
  return {
    css: '@keyframes nc-st{0%,100%{opacity:.08}50%{opacity:.55}}.nc-st{animation:nc-st ease-in-out infinite}',
    defs: `<linearGradient id="ncBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.bg1}"/><stop offset="1" stop-color="${C.bg0}"/></linearGradient>
      <radialGradient id="ncGlow" cx="1" cy="0" r="1"><stop offset="0" stop-color="${C.comet}" stop-opacity=".16"/><stop offset=".6" stop-color="${C.comet}" stop-opacity="0"/></radialGradient>
      <clipPath id="ncClip"><rect width="${w}" height="${h}" rx="${r}"/></clipPath>`,
    svg: `<g clip-path="url(#ncClip)"><rect width="${w}" height="${h}" fill="url(#ncBg)"/><rect width="${w}" height="${h}" fill="url(#ncGlow)"/>${stars}</g>
      <rect x=".75" y=".75" width="${w - 1.5}" height="${h - 1.5}" rx="${r}" fill="none" stroke="${C.line}" stroke-width="1.5"/>`,
  };
}

/** XML-escape for text that still goes into attributes/titles. */
export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
