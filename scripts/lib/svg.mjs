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

/** Glowing gradient fills for big numbers — one per accent. */
export const GRAD = {
  comet: ['#FFFFFF', '#7FD6F5'],
  sunset: ['#FFE6C2', '#FF8FB4'],
  gold: ['#FFF6D2', '#FFB84D'],
  violet: ['#FFFFFF', '#A88CFF'],
};

/**
 * Nebula card: deep night gradient with slowly drifting violet / rose / cyan clouds, bright
 * twinkling stars and a soft rim. Also defines the GRAD fills (g-comet, g-sunset, …) and a glow
 * filter. Returns { css, defs, svg } — draw content after `svg`.
 */
export function nightCard({ w, h, seed = 1, r = 22 }) {
  const rand = rng(seed);
  let stars = '';
  for (let i = 0; i < Math.round((w * h) / 5000); i++) {
    const big = rand() > 0.9;
    stars += `<circle class="nc-st" cx="${fmt(rand() * w)}" cy="${fmt(rand() * h)}" r="${fmt(big ? 1.4 + rand() : 0.5 + rand() * 0.8)}" fill="#FFFFFF" style="animation-delay:${fmt(-rand() * 6)}s;animation-duration:${fmt(2.5 + rand() * 4)}s"/>`;
  }
  const blobs = [
    [w * 0.12, h * 0.1, w * 0.55, '#6C4BD8', 0.45, 26],
    [w * 0.92, h * 0.95, w * 0.5, '#E2508F', 0.32, 32],
    [w * 0.78, h * 0.05, w * 0.4, '#3FB6E0', 0.28, 22],
  ]
    .map(([cx, cy, rr, c, o, dur], i) => `<radialGradient id="nb${i}"><stop offset="0" stop-color="${c}" stop-opacity="${o}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>|<circle class="nc-nb" cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(rr)}" fill="url(#nb${i})" style="animation-duration:${dur}s;animation-delay:${-i * 7}s"/>`)
    .map((s) => s.split('|'));
  const grads = Object.entries(GRAD)
    .map(([k, [a, b]]) => `<linearGradient id="g-${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`)
    .join('');
  return {
    css: `@keyframes nc-st{0%,100%{opacity:.15}50%{opacity:1}}.nc-st{animation:nc-st ease-in-out infinite}
      @keyframes nc-nb{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(${fmt(w * 0.04)}px,${fmt(h * 0.06)}px) scale(1.12)}}.nc-nb{transform-box:fill-box;transform-origin:center;animation:nc-nb ease-in-out infinite}`,
    defs: `<linearGradient id="ncBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#141A4A"/><stop offset=".55" stop-color="#0A0E2C"/><stop offset="1" stop-color="#05061A"/></linearGradient>
      ${blobs.map((b) => b[0]).join('')}${grads}
      <linearGradient id="ncRim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A88CFF" stop-opacity=".7"/><stop offset=".5" stop-color="#7FD6F5" stop-opacity=".15"/><stop offset="1" stop-color="#FF8FB4" stop-opacity=".6"/></linearGradient>
      <filter id="numGlow" x="-20%" y="-30%" width="140%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
      <clipPath id="ncClip"><rect width="${w}" height="${h}" rx="${r}"/></clipPath>`,
    svg: `<g clip-path="url(#ncClip)"><rect width="${w}" height="${h}" fill="url(#ncBg)"/>${blobs.map((b) => b[1]).join('')}${stars}</g>
      <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${r}" fill="none" stroke="url(#ncRim)" stroke-width="2"/>`,
  };
}

/** A big number (or any path) filled with a GRAD gradient over its own soft glow. */
export function glowing(d, grad, glowOpacity = 0.55) {
  return `<path d="${d}" fill="${GRAD[grad][1]}" opacity="${glowOpacity}" filter="url(#numGlow)"/><path d="${d}" fill="url(#g-${grad})"/>`;
}

/** XML-escape for text that still goes into attributes/titles. */
export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
