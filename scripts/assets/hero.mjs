// Hero: "Your Name" comet fanart, with a shimmer running down the comet's tail, a breathing
// comet head, falling fragments, twinkling stars, a pulsing sunset and the title fading in.
import { text } from '../lib/type.mjs';
import { doc } from '../lib/svg.mjs';
import { imageLayer, stars, shootingStars, glint, shadowedText } from '../lib/fx.mjs';

const W = 1200;
const H = 462;
// comet tails traced over the still (head first)
const TAIL = 'M324 190C404 140 540 66 676 26C780 -2 980 -22 1210 -12';
const TAIL2 = 'M330 186C420 150 560 92 720 56C860 26 1020 18 1210 22';

export function hero(profile) {
  const img = imageLayer('hero', W, H, { zoom: 1.04, dur: 34, ox: '27%', oy: '41%' });
  const sky = stars({ count: 90, x0: 0, x1: W, y0: 0, y1: 300, seed: 11 });
  const shoot = shootingStars([[1000, 60, -260, 110, 1.5], [620, 150, -220, 90, 6.5], [1150, 200, -200, 70, 11]], { period: 15 });
  const shards = shootingStars([[316, 196, -150, 150, 2.8], [324, 192, -90, 190, 8.2]], { prefix: 'sh', period: 11, len: 70, color: '#CFF4FF' });

  const X = 1140;
  const helloJp = text(profile.greetingJp, { font: 'mincho', size: 20, x: X, y: 226, anchor: 'end' });
  const hello = text(`${profile.greeting.toUpperCase()}   ·   `, { font: 'montb', size: 15, x: X - helloJp.width, y: 224, anchor: 'end', tracking: 3 });
  const name = text(profile.name, { font: 'fuzzy', size: 82, x: X, y: 318, anchor: 'end' });
  const tag = text(profile.tagline.toUpperCase(), { font: 'montb', size: 15, x: X, y: 362, anchor: 'end', tracking: 3 });
  const role = text(profile.role, { font: 'fuzzy', size: 26, x: X, y: 402, anchor: 'end' });
  const jp = text(profile.titleJp, { font: 'mincho', size: 22, x: X, y: 440, anchor: 'end' });
  const t1 = shadowedText(name.d, '#FFFFFF', { id: 'shName', blur: 10, opacity: 0.55 });
  const t2 = shadowedText(`${hello.d}${helloJp.d}${tag.d}`, '#FFFFFF', { id: 'shSmall', blur: 4, opacity: 0.7 });
  const t3 = shadowedText(jp.d, '#FFC7D6', { id: 'shJp', blur: 4, opacity: 0.7 });
  const t4 = shadowedText(role.d, '#8FE0FF', { id: 'shRole', blur: 5, opacity: 0.75 });
  const nameGlow = `<path d="${name.d}" fill="#8FD3E8" opacity=".55" filter="url(#nameGlow)"/>`;

  let glints = '';
  for (const [x, y, s, d] of [[560, 210, 7, 0], [880, 120, 5, 1.7], [140, 90, 6, 3.1], [1080, 170, 4, 2.4]]) {
    glints += `<g transform="translate(${x} ${y})"><g class="gl" style="animation-delay:${d}s">${glint(s)}</g></g>`;
  }

  const style = `
    ${img.css} ${sky.css} ${shoot.css} ${shards.css}
    @keyframes flow{0%{stroke-dashoffset:1500}100%{stroke-dashoffset:0}}
    .flow{stroke-dasharray:160 1340;animation:flow 4.5s cubic-bezier(.4,0,.6,1) infinite}
    @keyframes head{0%,100%{transform:scale(1);opacity:.75}50%{transform:scale(1.35);opacity:1}}
    .head{transform-box:fill-box;transform-origin:center;animation:head 3s ease-in-out infinite}
    @keyframes sun{0%,100%{opacity:.45;transform:scaleX(1)}50%{opacity:.8;transform:scaleX(1.12)}}
    .sun{transform-box:fill-box;transform-origin:center;animation:sun 7s ease-in-out infinite}
    @keyframes gl{0%,100%{transform:scale(.2) rotate(0);opacity:0}50%{transform:scale(1) rotate(45deg);opacity:1}}
    .gl{transform-box:fill-box;transform-origin:center;animation:gl 4s ease-in-out infinite}
    @keyframes rise{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:none}}
    .rise{animation:rise 1.6s ease-out both}
  `;
  const defs = `
    <clipPath id="frame"><rect width="${W}" height="${H}" rx="20"/></clipPath>
    <linearGradient id="flowG" gradientUnits="userSpaceOnUse" x1="324" y1="190" x2="1200" y2="-10"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#9FE6FF"/></linearGradient>
    <radialGradient id="headG"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".95"/><stop offset=".3" stop-color="#BFF0FF" stop-opacity=".55"/><stop offset="1" stop-color="#8FD3E8" stop-opacity="0"/></radialGradient>
    <radialGradient id="sunG"><stop offset="0" stop-color="#FFE6B8" stop-opacity=".9"/><stop offset=".4" stop-color="#FF9E8A" stop-opacity=".35"/><stop offset="1" stop-color="#FF9E8A" stop-opacity="0"/></radialGradient>
    <linearGradient id="shade" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#0A1024" stop-opacity=".45"/><stop offset=".45" stop-color="#0A1024" stop-opacity="0"/></linearGradient>
    <filter id="soft" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
    <filter id="nameGlow" x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation="14"/></filter>
    ${shoot.defs}${shards.defs}${t1.defs}${t2.defs}${t3.defs}${t4.defs}`;
  const body = `
  <g clip-path="url(#frame)">
    ${img.svg}
    <rect width="${W}" height="${H}" fill="url(#shade)"/>
    ${sky.svg}
    <ellipse class="sun" cx="228" cy="430" rx="260" ry="70" fill="url(#sunG)"/>
    <g filter="url(#soft)" opacity=".85">
      <path class="flow" d="${TAIL}" stroke="url(#flowG)" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path class="flow" d="${TAIL2}" stroke="url(#flowG)" stroke-width="4" fill="none" stroke-linecap="round" style="animation-delay:-2.2s"/>
    </g>
    <circle class="head" cx="324" cy="190" r="34" fill="url(#headG)"/>
    ${shards.svg}
    ${shoot.svg}
    ${glints}
    <g class="rise" style="animation-delay:.3s">${t2.svg}</g>
    <g class="rise" style="animation-delay:.8s">${nameGlow}${t1.svg}</g>
    <g class="rise" style="animation-delay:1.3s">${t4.svg}</g>
    <g class="rise" style="animation-delay:1.8s">${t3.svg}</g>
  </g>`;
  return doc({ width: W, height: H, title: `${profile.name} · ${profile.tagline}`, desc: 'Comet over a sea of clouds at dusk (Your Name fanart by 画师JW) with an animated comet, stars and shooting stars.', style, defs, body });
}
