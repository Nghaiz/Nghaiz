// Custom profile badges: nebula pills with a hand-drawn icon, a Fuzzy Bubbles label and a glowing
// mincho value. A light sweep crosses each pill, offset per badge so a row of them ripples.
import { text } from '../lib/type.mjs';
import { doc, rng, fmt, GRAD } from '../lib/svg.mjs';
import { num } from './overview.mjs';

const H = 46;
const R = H / 2;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Owns the fill attribute too: writing fill twice on one element is invalid XML and the browser drops the whole image.
const line = (c, w = 1.8, fill = 'none') => `fill="${fill}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;

/** 20×20 line icons centred on the origin. */
const ICONS = {
  people: (c) =>
    `<circle cx="-2.6" cy="-3.6" r="3.6" ${line(c)}/><path d="M-9.6 7.6c0-4 3-6.6 7-6.6s7 2.6 7 6.6" ${line(c)}/>` +
    `<circle cx="6.2" cy="-4.8" r="2.7" ${line(c, 1.5)} opacity=".7"/><path d="M7.4 .6c2.8 .5 4.6 2.6 4.6 5.6" ${line(c, 1.5)} opacity=".7"/>`,
  star: (c) => `<path d="M0 -9.2L2.7 -3.3 9.1 -2.6 4.3 1.8 5.6 8.2 0 5 -5.6 8.2 -4.3 1.8 -9.1 -2.6 -2.7 -3.3Z" fill-opacity=".22" ${line(c, 1.7, c)}/>`,
  repo: (c) =>
    `<path d="M-7 -8.6H5.2a2 2 0 0 1 2 2V8.6H-5a2 2 0 0 1-2-2Z" ${line(c)}/><path d="M-7 6.4a2 2 0 0 1 2-2H7.2" ${line(c)}/>` +
    `<path d="M-3.2 -8.6V-2.4L-1.5 -3.7 .2 -2.4V-8.6" fill="${c}"/>`,
  grid: (c) =>
    [0.25, 0.55, 1, 0.4, 1, 0.7, 0.85, 0.3, 0.6]
      .map((o, i) => `<rect x="${fmt(-8.5 + (i % 3) * 6.2)}" y="${fmt(-8.5 + Math.floor(i / 3) * 6.2)}" width="4.6" height="4.6" rx="1.2" fill="${c}" opacity="${o}"/>`)
      .join(''),
  merge: (c) =>
    `<circle cx="-5" cy="-6.8" r="2.6" ${line(c)}/><circle cx="-5" cy="6.8" r="2.6" ${line(c)}/><circle cx="6" cy="1.8" r="2.6" ${line(c)}/>` +
    `<path d="M-5 -4.2V4.2M-5 -4C-5 0 -1 1.8 3.4 1.8" ${line(c)}/>`,
  flame: (c) =>
    `<path d="M.4 9C-4.4 9 -7.4 5.9 -7.4 2.1C-7.4 -1.6 -4.8 -3.4 -3.9 -6.9C-2.6 -4.9 -1.4 -4.1 -.3 -4.1C-.5 -6.4 .6 -8.4 2.4 -9.6C2.3 -7 3.6 -5.4 5 -3.6C6.4 -1.8 7.4 -.1 7.4 2.3C7.4 6.2 4.6 9 .4 9Z" fill-opacity=".22" ${line(c, 1.6, c)}/>` +
    `<path d="M.3 8.6C-1.9 8.6 -3.3 7.1 -3.3 5.2C-3.3 3.2 -1.6 2.3 -.9 .4C.4 1.9 .9 2 1.6 1.4C2.6 2.6 3.6 3.8 3.6 5.4C3.6 7.3 2.3 8.6 .3 8.6Z" fill="${c}"/>`,
  comet: (c) =>
    `<path d="M-9 7.6L1.4 -2.8" ${line(c, 1.6)} opacity=".45"/><path d="M-5.6 9.2L3.4 .2" ${line(c, 1.3)} opacity=".3"/>` +
    `<circle cx="4" cy="-4.6" r="4.2" fill-opacity=".25" ${line(c, 1.6, c)}/><circle cx="4" cy="-4.6" r="1.5" fill="${c}"/>`,
};

export function badge({ label, value, icon, accent, index = 0 }) {
  const [top, base] = GRAD[accent];
  const l = text(label, { font: 'fuzzy', size: 16, x: 50, y: 28.6 });
  const v = text(value, { font: 'mincho', size: 20, x: 50 + l.width + 10, y: 30.4 });
  const W = Math.ceil(50 + l.width + 10 + v.width + 20);
  const delay = fmt(index * 0.7);
  const r = rng(31 * index + 7);
  let stars = '';
  for (let i = 0; i < 5; i++) {
    stars += `<circle class="tw" cx="${fmt(56 + r() * (W - 70))}" cy="${fmt(5 + r() * 36)}" r="${fmt(0.5 + r() * 0.8)}" fill="#FFFFFF" style="animation-duration:${fmt(2 + r() * 3)}s;animation-delay:${fmt(-r() * 4)}s"/>`;
  }
  const style = `
    @keyframes sweep{0%,60%{transform:translateX(-90px) skewX(-20deg)}100%{transform:translateX(${W + 90}px) skewX(-20deg)}} .sweep{animation:sweep 7s ease-in-out ${delay}s infinite}
    @keyframes pulse{0%,100%{opacity:.4}50%{opacity:.85}} .pulse{animation:pulse 3.6s ease-in-out ${delay}s infinite}
    @keyframes tw{0%,100%{opacity:.1}50%{opacity:.9}} .tw{animation:tw ease-in-out infinite}
    @keyframes rise{0%{opacity:0;transform:translateY(4px)}100%{opacity:1;transform:none}} .rise{animation:rise .9s ease-out ${fmt(0.2 + index * 0.08)}s both}`;
  const defs = `
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1A2160"/><stop offset=".6" stop-color="#0E1338"/><stop offset="1" stop-color="#080B24"/></linearGradient>
    <radialGradient id="glow" gradientUnits="userSpaceOnUse" cx="23" cy="23" r="52"><stop offset="0" stop-color="${base}" stop-opacity=".5"/><stop offset="1" stop-color="${base}" stop-opacity="0"/></radialGradient>
    <linearGradient id="rim" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="0"><stop offset="0" stop-color="${base}" stop-opacity=".95"/><stop offset=".55" stop-color="#FFFFFF" stop-opacity=".14"/><stop offset="1" stop-color="#A88CFF" stop-opacity=".6"/></linearGradient>
    <linearGradient id="val" gradientUnits="userSpaceOnUse" x1="0" y1="15" x2="0" y2="31"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${base}"/></linearGradient>
    <linearGradient id="sh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset=".5" stop-color="#FFFFFF" stop-opacity=".2"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>
    <filter id="vg" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="3.5"/></filter>
    <clipPath id="pill"><rect width="${W}" height="${H}" rx="${R}"/></clipPath>`;
  const body = `<g clip-path="url(#pill)">
      <rect width="${W}" height="${H}" fill="url(#bg)"/><rect class="pulse" width="${W}" height="${H}" fill="url(#glow)"/>${stars}
      <rect class="sweep" x="0" y="-10" width="48" height="${H + 20}" fill="url(#sh)"/></g>
    <rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="${R - 0.75}" fill="none" stroke="url(#rim)" stroke-width="1.5"/>
    <circle cx="23" cy="23" r="15.5" fill="${base}" fill-opacity=".16" stroke="${base}" stroke-opacity=".55"/>
    <g transform="translate(23 23)">${ICONS[icon](base)}</g>
    <path d="${l.d}" fill="#DDE5FA"/>
    <g class="rise"><path d="${v.d}" fill="${base}" opacity=".6" filter="url(#vg)"/><path d="${v.d}" fill="url(#val)"/></g>`;
  return doc({ width: W, height: H, title: `${label}: ${value}`, desc: `${label}: ${value}`, style, defs, body });
}

/** The badge row under the hero, in display order. Returns { file: svg }. */
export function badges(d) {
  const since = new Date(d.createdAt);
  const list = [
    ['followers', 'Followers', num(d.followers), 'people', 'comet'],
    ['stars', 'Stars', num(d.stars), 'star', 'gold'],
    ['repos', 'Public repos', num(d.publicRepos), 'repo', 'violet'],
    ['contributions', 'Contributions', num(d.totalContributions), 'grid', 'mint'],
    ['prs', 'PRs merged', num(d.prsMerged), 'merge', 'sunset'],
    ['streak', 'Streak', `${d.streak.current.length} days`, 'flame', 'ember'],
    ['since', 'On GitHub since', `${MONTHS[since.getUTCMonth()]} ${since.getUTCFullYear()}`, 'comet', 'comet'],
  ];
  return Object.fromEntries(list.map(([key, label, value, icon, accent], index) => [`badge-${key}.svg`, badge({ label, value, icon, accent, index })]));
}
