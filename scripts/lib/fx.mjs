// Motion layers composited over film stills: a slow Ken Burns image layer, stars, shooting
// stars, light motes, rain, komorebi bokeh, a light sweep and shadowed title text. Each returns { css, svg, defs? }.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { rng, fmt, lerp } from './svg.mjs';

const IMG_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'assets', 'img');

/** Embeds assets/img/<id>.jpg — SVGs shown as <img> on GitHub cannot fetch external images. */
export function imageLayer(id, w, h, { zoom = 1.045, dur = 28, ox = '50%', oy = '50%' } = {}) {
  const file = path.join(IMG_DIR, `${id}.jpg`);
  if (!fs.existsSync(file)) throw new Error(`Missing ${file} — run: python scripts/prepare_images.py <sources>`);
  const href = `data:image/jpeg;base64,${fs.readFileSync(file).toString('base64')}`;
  return {
    css: `@keyframes kb-${id}{0%{transform:scale(1)}100%{transform:scale(${zoom})}}.kb-${id}{transform-origin:${ox} ${oy};animation:kb-${id} ${dur}s ease-in-out infinite alternate}`,
    svg: `<g class="kb-${id}"><image href="${href}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/></g>`,
  };
}

export function stars({ count, x0, x1, y0, y1, seed = 3, prefix = 'st', color = '#FFFFFF', max = 1.6 }) {
  const r = rng(seed);
  let svg = '';
  for (let i = 0; i < count; i++) {
    svg += `<circle class="${prefix}" cx="${fmt(lerp(x0, x1, r()))}" cy="${fmt(lerp(y0, y1, r()))}" r="${fmt(0.5 + r() * max)}" fill="${color}" style="animation-duration:${fmt(2.5 + r() * 4)}s;animation-delay:${fmt(-r() * 6)}s"/>`;
  }
  return { css: `@keyframes ${prefix}{0%,100%{opacity:.1}50%{opacity:.95}}.${prefix}{animation:${prefix} ease-in-out infinite}`, svg };
}

/** Four-point glint. */
export function glint(r, fill = '#FFFFFF') {
  const k = (n) => fmt(n * r);
  return `<path d="M0 ${k(-1)}Q${k(0.1)} ${k(-0.1)} ${k(1)} 0Q${k(0.1)} ${k(0.1)} 0 ${k(1)}Q${k(-0.1)} ${k(0.1)} ${k(-1)} 0Q${k(-0.1)} ${k(-0.1)} 0 ${k(-1)}Z" fill="${fill}"/>`;
}

/** Shooting stars: [x, y, dx, dy, delay] each; one streak per `period` seconds. */
export function shootingStars(list, { prefix = 'ss', period = 9, len = 120, color = '#FFFFFF' } = {}) {
  let css = '';
  let svg = '';
  list.forEach(([x, y, dx, dy, delay], i) => {
    const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    css += `@keyframes ${prefix}${i}{0%{transform:translate(0,0);opacity:0}2%{opacity:1}12%{transform:translate(${dx}px,${dy}px);opacity:0}100%{transform:translate(${dx}px,${dy}px);opacity:0}}`;
    svg += `<g transform="translate(${x} ${y})"><g style="animation:${prefix}${i} ${period}s ease-in ${delay}s infinite;opacity:0"><g transform="rotate(${fmt(ang)})"><path d="M0 0L${-len} 0" stroke="url(#${prefix}Tail)" stroke-width="2" stroke-linecap="round"/><circle r="2.2" fill="${color}"/></g></g></g>`;
  });
  const defs = `<linearGradient id="${prefix}Tail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient>`;
  return { css, svg, defs };
}

/** Floating light motes drifting upward. */
export function motes({ count, x0, x1, y0, y1, seed = 5, prefix = 'mo', color = '#FFF6DA', max = 2.4, rise = 40 }) {
  const r = rng(seed);
  let svg = '';
  for (let i = 0; i < count; i++) {
    svg += `<circle class="${prefix}" cx="${fmt(lerp(x0, x1, r()))}" cy="${fmt(lerp(y0, y1, r()))}" r="${fmt(0.8 + r() * max)}" fill="${color}" style="animation-duration:${fmt(6 + r() * 7)}s;animation-delay:${fmt(-r() * 12)}s"/>`;
  }
  return {
    css: `@keyframes ${prefix}{0%{transform:translate(0,0);opacity:0}25%{opacity:.9}75%{opacity:.7}100%{transform:translate(14px,-${rise}px);opacity:0}}.${prefix}{animation:${prefix} ease-in-out infinite}`,
    svg,
  };
}

/** Slanted rain in two depth layers. */
export function rain({ w, h, count = 90, seed = 13, prefix = 'rn', slant = 0.18, color = '#E6F2FF' }) {
  const r = rng(seed);
  let css = '';
  let svg = '';
  for (const [layer, n, speed, len, op] of [[0, Math.round(count * 0.6), 0.9, 18, 0.35], [1, Math.round(count * 0.4), 0.6, 28, 0.6]]) {
    css += `@keyframes ${prefix}${layer}{0%{transform:translate(0,-${h * 0.3}px)}100%{transform:translate(${fmt(-h * 1.3 * slant)}px,${fmt(h * 1.05)}px)}}`;
    for (let i = 0; i < n; i++) {
      const x = fmt(lerp(0, w + h * slant, r()));
      const y = fmt(lerp(-h * 0.4, h, r()));
      const dur = fmt(speed * (0.85 + r() * 0.3));
      svg += `<path d="M${x} ${y}l${fmt(-len * slant)} ${len}" stroke="${color}" stroke-opacity="${op}" stroke-width="${layer ? 1.4 : 1}" stroke-linecap="round" style="animation:${prefix}${layer} ${dur}s linear ${fmt(-r() * dur)}s infinite"/>`;
    }
  }
  return { css, svg };
}

/**
 * Komorebi: soft out-of-focus light discs (sunlight through leaves) that bloom and fade out of
 * phase and drift a little. No hard beams.
 */
export function bokeh({ count, x0, x1, y0, y1, seed = 21, prefix = 'bk', colors = ['#FFF4D6', '#FFE2A8', '#FFFFFF'], min = 8, max = 34 }) {
  const r = rng(seed);
  let svg = '';
  for (let i = 0; i < count; i++) {
    const c = colors[Math.floor(r() * colors.length)];
    svg += `<circle class="${prefix}" cx="${fmt(lerp(x0, x1, r()))}" cy="${fmt(lerp(y0, y1, r()))}" r="${fmt(lerp(min, max, r()))}" fill="url(#${prefix}G${colors.indexOf(c)})" style="animation-duration:${fmt(5 + r() * 6)}s;animation-delay:${fmt(-r() * 10)}s"/>`;
  }
  const defs = colors.map((c, i) => `<radialGradient id="${prefix}G${i}"><stop offset="0" stop-color="${c}" stop-opacity=".85"/><stop offset=".55" stop-color="${c}" stop-opacity=".35"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`).join('');
  return {
    css: `@keyframes ${prefix}{0%,100%{opacity:0;transform:translate(0,0) scale(.7)}40%{opacity:.75}60%{opacity:.55;transform:translate(8px,-6px) scale(1)}}.${prefix}{transform-box:fill-box;transform-origin:center;animation:${prefix} ease-in-out infinite}`,
    defs,
    svg,
  };
}

/** A wide, soft band of light that glides across the frame — like a slow lens sweep. */
export function lightSweep({ w, h, prefix = 'sw', color = '#FFFFFF', opacity = 0.22, dur = 9, angle = -18 }) {
  return {
    css: `@keyframes ${prefix}{0%{transform:translateX(${-w * 0.6}px) skewX(${angle}deg)}60%,100%{transform:translateX(${w * 1.3}px) skewX(${angle}deg)}}.${prefix}{animation:${prefix} ${dur}s ease-in-out infinite}`,
    defs: `<linearGradient id="${prefix}G" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${color}" stop-opacity="0"/><stop offset=".5" stop-color="${color}" stop-opacity="${opacity}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient>`,
    svg: `<rect class="${prefix}" x="0" y="${-h * 0.2}" width="${w * 0.35}" height="${h * 1.4}" fill="url(#${prefix}G)"/>`,
  };
}

/** Blurred dark copy behind text so it stays legible on any part of a photo. */
export function shadowedText(d, fill, { blur = 6, opacity = 0.55, shadow = '#0A1024', id = 'tsh' } = {}) {
  return {
    defs: `<filter id="${id}" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="${blur}"/></filter>`,
    svg: `<path d="${d}" fill="${shadow}" opacity="${opacity}" filter="url(#${id})"/><path d="${d}" fill="${fill}"/>`,
  };
}
