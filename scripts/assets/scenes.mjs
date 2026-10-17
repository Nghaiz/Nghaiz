// The supporting stills (no characters in any of them): rainy Tokyo at night (About), dawn above
// the clouds (stats banner) and a sunlit hillside street (footer).
import { text } from '../lib/type.mjs';
import { doc, rng, fmt } from '../lib/svg.mjs';
import { imageLayer, motes, rain, bokeh, lightSweep, shootingStars, glint, shadowedText } from '../lib/fx.mjs';

/** About: Tokyo from above on a rainy night — rain, blinking aviation lights, drifting mist. */
export function tokyo() {
  const W = 600;
  const H = 478;
  const img = imageLayer('tokyo', W, H, { zoom: 1.05, dur: 32, ox: '57%', oy: '30%' });
  const drops = rain({ w: W, h: H, count: 120, seed: 31, slant: 0.12 });
  const r = rng(44);
  // red aviation lights on the tower crown and a few rooftops
  const beacons = [[340, 58], [150, 124], [64, 128], [520, 150]]
    .map(([x, y], i) => `<circle class="bc" cx="${x}" cy="${y}" r="1.8" fill="#FF5A6E" style="animation-delay:${fmt(i * 0.37)}s"/><circle class="bc" cx="${x}" cy="${y}" r="5" fill="#FF5A6E" opacity=".2" style="animation-delay:${fmt(i * 0.37)}s"/>`)
    .join('');
  let windows = '';
  for (let i = 0; i < 40; i++) {
    windows += `<rect class="win" x="${fmt(r() * W)}" y="${fmt(150 + r() * 320)}" width="2" height="2" fill="#FFE3A3" style="animation-delay:${fmt(-r() * 8)}s;animation-duration:${fmt(3 + r() * 5)}s"/>`;
  }
  const style = `${img.css} ${drops.css}
    @keyframes bc{0%,55%,100%{opacity:.15}60%,80%{opacity:1}} .bc{animation:bc 2.4s ease-in-out infinite}
    @keyframes win{0%,100%{opacity:.1}50%{opacity:.9}} .win{animation:win ease-in-out infinite}
    @keyframes mist{0%{transform:translateX(-${W}px)}100%{transform:translateX(${W}px)}} .mist{animation:mist 40s linear infinite}`;
  const defs = `<clipPath id="frame"><rect width="${W}" height="${H}" rx="16"/></clipPath>
    <linearGradient id="mistG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#CFE2FF" stop-opacity="0"/><stop offset=".5" stop-color="#CFE2FF" stop-opacity=".22"/><stop offset="1" stop-color="#CFE2FF" stop-opacity="0"/></linearGradient>`;
  const body = `<g clip-path="url(#frame)">${img.svg}
    <rect class="mist" x="0" y="180" width="${W}" height="120" fill="url(#mistG)"/>
    ${windows}${beacons}${drops.svg}</g>`;
  return doc({ width: W, height: H, title: 'Tokyo on a rainy night', desc: 'Still from Your Name (© 2016 TOHO / CoMix Wave Films) with animated rain and blinking aviation lights.', style, defs, body });
}

/** Stats banner: dawn above a sea of clouds with the falling comet; section title on the sky. */
export function dawnBanner({ title, jp }) {
  const W = 1200;
  const H = 352;
  const img = imageLayer('dawn', W, H, { zoom: 1.04, dur: 30, ox: '40%', oy: '60%' });
  const sweep = lightSweep({ w: W, h: H, opacity: 0.18, dur: 11, color: '#FFF1D6' });
  const sparks = shootingStars([[606, 146, -26, 60, 1], [600, 120, -30, 80, 3.5], [612, 90, -22, 70, 6]], { prefix: 'sp', period: 7, len: 26, color: '#FFE9C4' });
  const sky = motes({ count: 18, x0: 0, x1: W, y0: 230, y1: 340, seed: 6, color: '#FFF6E0', rise: 30, max: 1.6 });
  const t = text(title, { font: 'vibes', size: 64, x: 54, y: 96 });
  const j = text(jp, { font: 'mincho', size: 20, x: 60 + t.width + 14, y: 92 });
  const st = shadowedText(`${t.d}${j.d}`, '#FFFFFF', { id: 'shT', blur: 6, opacity: 0.6, shadow: '#0A1A4A' });
  const style = `${img.css} ${sweep.css} ${sparks.css} ${sky.css}
    @keyframes sun{0%,100%{transform:scale(1);opacity:.65}50%{transform:scale(1.18);opacity:1}} .sun{transform-box:fill-box;transform-origin:center;animation:sun 6s ease-in-out infinite}
    @keyframes gl{0%,100%{transform:scale(.4) rotate(0);opacity:.3}50%{transform:scale(1) rotate(45deg);opacity:1}} .gl{transform-box:fill-box;transform-origin:center;animation:gl 3s ease-in-out infinite}
    @keyframes rise{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:none}} .rise{animation:rise 1.4s ease-out .3s both}`;
  const defs = `<clipPath id="frame"><rect width="${W}" height="${H}" rx="18"/></clipPath>
    <radialGradient id="sunG"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".95"/><stop offset=".25" stop-color="#FFE7B8" stop-opacity=".6"/><stop offset="1" stop-color="#FFB98A" stop-opacity="0"/></radialGradient>
    ${sweep.defs}${sparks.defs}${st.defs}`;
  const body = `<g clip-path="url(#frame)">${img.svg}
    <ellipse class="sun" cx="480" cy="211" rx="190" ry="90" fill="url(#sunG)"/>
    ${sweep.svg}${sky.svg}${sparks.svg}
    <g transform="translate(606 146)"><g class="gl">${glint(9, '#FFF6E0')}</g></g>
    <g class="rise">${st.svg}</g></g>`;
  return doc({ width: W, height: H, title: `${title} · ${jp}`, desc: 'Still from Your Name (© 2016 TOHO / CoMix Wave Films): dawn above the clouds, with a breathing sun and a light sweep.', style, defs, body });
}

/** Footer: the sunlit hillside street — komorebi light discs, a warm glow, the thank-you. */
export function sunlight() {
  const W = 1200;
  const H = 317;
  const img = imageLayer('sunlight', W, H, { zoom: 1.04, dur: 30, ox: '75%', oy: '40%' });
  const leaves = bokeh({ count: 26, x0: 420, x1: W, y0: 0, y1: 230, seed: 9 });
  const sweep = lightSweep({ w: W, h: H, opacity: 0.16, dur: 12, color: '#FFF4D6', prefix: 'fsw' });
  const a = text('Cảm ơn bạn đã ghé thăm!', { font: 'vibes', size: 68, x: 54, y: 168 });
  const b = text('THANKS FOR STOPPING BY   ·   ', { font: 'montb', size: 14, x: 60, y: 214, tracking: 3 });
  const c = text('またね', { font: 'mincho', size: 18, x: 60 + b.width, y: 215 });
  const sa = shadowedText(a.d, '#FFFFFF', { id: 'shA', blur: 7, opacity: 0.6, shadow: '#06140E' });
  const sb = shadowedText(`${b.d}${c.d}`, '#FFFFFF', { id: 'shB', blur: 4, opacity: 0.7, shadow: '#06140E' });
  const style = `${img.css} ${leaves.css} ${sweep.css}
    @keyframes warm{0%,100%{opacity:.45}50%{opacity:.8}} .warm{animation:warm 7s ease-in-out infinite}
    @keyframes rise{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:none}} .rise{animation:rise 1.4s ease-out both}`;
  const defs = `<clipPath id="frame"><rect width="${W}" height="${H}" rx="18"/></clipPath>
    <linearGradient id="left" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#05110C" stop-opacity=".62"/><stop offset=".5" stop-color="#05110C" stop-opacity="0"/></linearGradient>
    <radialGradient id="warmG" cx="1" cy="0" r="1"><stop offset="0" stop-color="#FFE2A8" stop-opacity=".55"/><stop offset=".6" stop-color="#FFE2A8" stop-opacity="0"/></radialGradient>
    ${leaves.defs}${sweep.defs}${sa.defs}${sb.defs}`;
  const body = `<g clip-path="url(#frame)">${img.svg}
    <rect width="${W}" height="${H}" fill="url(#left)"/>
    <rect class="warm" width="${W}" height="${H}" fill="url(#warmG)"/>
    ${sweep.svg}${leaves.svg}
    <g class="rise" style="animation-delay:.3s">${sa.svg}</g>
    <g class="rise" style="animation-delay:.9s">${sb.svg}</g></g>`;
  return doc({ width: W, height: H, title: 'Cảm ơn bạn đã ghé thăm! Thanks for stopping by.', desc: 'Still from Weathering With You (© 2019 Weathering With You Film Partners): a sunlit street with soft komorebi light.', style, defs, body });
}
