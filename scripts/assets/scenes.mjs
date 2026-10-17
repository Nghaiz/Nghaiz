// The three supporting stills (no characters in any of them): Suzume's door in the flooded ruins
// (About), Weathering With You's rainy Shinjuku night (stats banner) and its sunlit hillside street (footer).
import { text } from '../lib/type.mjs';
import { doc, rng, fmt } from '../lib/svg.mjs';
import { imageLayer, motes, rain, rays, glint, shadowedText } from '../lib/fx.mjs';

/** About: the lone door standing in the flooded ruins: water glints, drifting light. */
export function door() {
  const W = 600;
  const H = 422;
  const img = imageLayer('door', W, H, { zoom: 1.05, dur: 30, ox: '42%', oy: '50%' });
  const light = motes({ count: 26, x0: 40, x1: W - 40, y0: 120, y1: 380, seed: 8, color: '#FFF8E6', rise: 60 });
  const r = rng(19);
  let ripples = '';
  for (let i = 0; i < 34; i++) {
    const y = fmt(318 + Math.pow(r(), 0.7) * 100);
    ripples += `<rect class="rp" x="${fmt(r() * W)}" y="${y}" width="${fmt(18 + r() * 60)}" height="1.6" rx="1" fill="#FFFFFF" style="animation-duration:${fmt(3 + r() * 4)}s;animation-delay:${fmt(-r() * 6)}s"/>`;
  }
  let glints = '';
  for (let i = 0; i < 7; i++) {
    glints += `<g transform="translate(${fmt(60 + r() * (W - 120))} ${fmt(322 + r() * 90)})"><g class="gl" style="animation-delay:${fmt(r() * 5)}s">${glint(5 + r() * 4)}</g></g>`;
  }
  const style = `${img.css} ${light.css}
    @keyframes rp{0%,100%{opacity:0;transform:translateX(0)}50%{opacity:.55;transform:translateX(10px)}} .rp{animation:rp ease-in-out infinite}
    @keyframes gl{0%,100%{transform:scale(.2) rotate(0);opacity:0}50%{transform:scale(1) rotate(45deg);opacity:1}} .gl{transform-box:fill-box;transform-origin:center;animation:gl 3.5s ease-in-out infinite}
    @keyframes gap{0%,100%{opacity:.25}50%{opacity:.85}} .gap{animation:gap 4s ease-in-out infinite}`;
  const defs = `<clipPath id="frame"><rect width="${W}" height="${H}" rx="16"/></clipPath>
    <linearGradient id="gapG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset=".5" stop-color="#FFF6DA"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>`;
  const body = `<g clip-path="url(#frame)">${img.svg}
    <rect class="gap" x="331" y="196" width="3" height="128" fill="url(#gapG)"/>
    ${ripples}${glints}${light.svg}</g>`;
  return doc({ width: W, height: H, title: 'Suzume — the door in the ruins', desc: 'Still from Suzume (© 2022 Suzume Film Partners): a door standing in flooded ruins, with animated water glints and drifting light.', style, defs, body });
}

/** Stats banner: rainy Shinjuku at night, with its section title. */
export function rainBanner({ title, jp }) {
  const W = 1200;
  const H = 338;
  const img = imageLayer('rain', W, H, { zoom: 1.05, dur: 26, ox: '50%', oy: '35%' });
  const drops = rain({ w: W, h: H, count: 150, seed: 13 });
  const t = text(title, { font: 'gentium', size: 44, x: 52, y: 262 });
  const j = text(jp, { font: 'klee', size: 24, x: 56, y: 302 });
  const st = shadowedText(`${t.d}${j.d}`, '#FFFFFF', { id: 'shT', blur: 7, opacity: 0.7 });
  const style = `${img.css} ${drops.css}
    @keyframes neon{0%,100%{opacity:.18}45%{opacity:.4}50%{opacity:.12}55%{opacity:.38}} .neon{animation:neon 6s ease-in-out infinite}
    @keyframes rise{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:none}} .rise{animation:rise 1.4s ease-out .3s both}`;
  const defs = `<clipPath id="frame"><rect width="${W}" height="${H}" rx="18"/></clipPath>
    <radialGradient id="neonG"><stop offset="0" stop-color="#FF7FB8"/><stop offset="1" stop-color="#FF7FB8" stop-opacity="0"/></radialGradient><radialGradient id="neonC"><stop offset="0" stop-color="#7FE3FF"/><stop offset="1" stop-color="#7FE3FF" stop-opacity="0"/></radialGradient>
    <linearGradient id="foot" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="#0A1838" stop-opacity="0"/><stop offset="1" stop-color="#0A1838" stop-opacity=".55"/></linearGradient>
    ${st.defs}`;
  const body = `<g clip-path="url(#frame)">${img.svg}
    <ellipse class="neon" cx="240" cy="60" rx="200" ry="120" fill="url(#neonG)"/><ellipse class="neon" cx="560" cy="110" rx="160" ry="110" fill="url(#neonC)" style="animation-delay:-2.5s"/><ellipse class="neon" cx="1010" cy="120" rx="180" ry="120" fill="url(#neonG)" style="animation-delay:-4s"/>
    ${drops.svg}
    <rect width="${W}" height="${H}" fill="url(#foot)"/>
    <g class="rise">${st.svg}</g></g>`;
  return doc({ width: W, height: H, title: `${title} · ${jp}`, desc: 'Still from Weathering With You (© 2019 Weathering With You Film Partners): rainy Shinjuku at night, with animated rain and flickering neon.', style, defs, body });
}

/** Footer: the sunlit hillside street: turning light rays, a breathing lens flare, floating motes, thank-you. */
export function sunlight() {
  const W = 1200;
  const H = 317;
  const img = imageLayer('sunlight', W, H, { zoom: 1.04, dur: 30, ox: '75%', oy: '40%' });
  const beams = rays({ cx: 1060, cy: -30, count: 18, len: 900 });
  const light = motes({ count: 30, x0: 20, x1: W - 20, y0: 40, y1: 300, seed: 4, color: '#FFFFFF', rise: 50 });
  const a = text('Cảm ơn bạn đã ghé thăm!', { font: 'gentium', size: 42, x: 56, y: 196 });
  const b = text('Thanks for stopping by', { font: 'gentium', size: 22, x: 58, y: 236 });
  const c = text('またね', { font: 'klee', size: 22, x: 58 + b.width + 16, y: 235 });
  const sa = shadowedText(a.d, '#FFFFFF', { id: 'shA', blur: 7, opacity: 0.55, shadow: '#0B2A20' });
  const sb = shadowedText(`${b.d}${c.d}`, '#F2F7FF', { id: 'shB', blur: 5, opacity: 0.55, shadow: '#0B2A20' });
  const style = `${img.css} ${beams.css} ${light.css}
    @keyframes core{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.25);opacity:1}} .core{transform-box:fill-box;transform-origin:center;animation:core 4s ease-in-out infinite}
    @keyframes rise{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:none}} .rise{animation:rise 1.4s ease-out both}`;
  const defs = `<clipPath id="frame"><rect width="${W}" height="${H}" rx="18"/></clipPath>
    <linearGradient id="left" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#071410" stop-opacity=".5"/><stop offset=".45" stop-color="#071410" stop-opacity="0"/></linearGradient>
    <radialGradient id="coreG"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".25" stop-color="#FFF6DA" stop-opacity=".8"/><stop offset="1" stop-color="#FFF6DA" stop-opacity="0"/></radialGradient>
    ${beams.defs}${sa.defs}${sb.defs}`;
  const body = `<g clip-path="url(#frame)">${img.svg}
    <rect width="${W}" height="${H}" fill="url(#left)"/>
    ${beams.svg}
    <circle class="core" cx="378" cy="262" r="46" fill="url(#coreG)"/>
    ${light.svg}
    <g class="rise" style="animation-delay:.3s">${sa.svg}</g>
    <g class="rise" style="animation-delay:.9s">${sb.svg}</g></g>`;
  return doc({ width: W, height: H, title: 'Cảm ơn bạn đã ghé thăm! Thanks for stopping by.', desc: 'Still from Weathering With You (© 2019 Weathering With You Film Partners): a sunlit hillside street, with animated light rays.', style, defs, body });
}
