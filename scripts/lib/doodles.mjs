// Planner-sticker doodles: small illustrations with an ink outline and matte pastel fills,
// drawn on a 48-unit box centred at the origin. doodle(name, { x, y, size, ink }) → SVG markup.
import { fmt } from './svg.mjs';

export const PAPER = {
  butter: '#F3DDA4', peach: '#F5CBB0', rose: '#EFC1C4', roseDeep: '#E59AA6', blue: '#B9D3EE', blueDeep: '#8FB4DF',
  lavender: '#CFC3EA', sage: '#BFD7B5', sageDeep: '#93B98A', moss: '#6E9E66', mint: '#BFE3DA', cream: '#FFFBF3', grey: '#D9D1C7', ladybug: '#E58C8C',
};
const P = PAPER;
const ln = (ink, w = 2.2) => `stroke="${ink}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;

const DRAW = {
  pencil: (k) => `<g transform="rotate(-40)">
      <path d="M-24 -5H-14V5H-24A3 3 0 0 1 -24 -5Z" fill="${P.rose}" ${ln(k)}/><rect x="-14" y="-5" width="5" height="10" fill="${P.grey}" ${ln(k)}/>
      <rect x="-9" y="-5" width="21" height="10" fill="${P.butter}" ${ln(k)}/><path d="M-9 0H12" ${ln(k, 1.2)} opacity=".35"/>
      <path d="M12 -5L22 0 12 5Z" fill="${P.peach}" ${ln(k)}/><path d="M18.5 -1.7L22 0 18.5 1.7Z" fill="${k}"/></g>`,
  plane: (k) => `<path d="M-22 14H-13M-20 19H-10" ${ln(k, 1.8)} opacity=".55"/>
      <path d="M-19 1L20 -15 7 17 -1 7Z" fill="${P.cream}" ${ln(k)}/><path d="M20 -15L-1 7 2 15Z" fill="${P.blue}" ${ln(k)}/><path d="M-1 7L20 -15" ${ln(k, 1.6)}/>`,
  ladybug: (k) => `<path d="M-3 -16Q-6 -22 -10 -21M3 -16Q6 -22 10 -21" fill="none" ${ln(k, 1.8)}/><circle cx="-10" cy="-21" r="1.6" fill="${k}"/><circle cx="10" cy="-21" r="1.6" fill="${k}"/>
      <path d="M-7 -13A7 7 0 0 1 7 -13Z" fill="${k}"/><ellipse cy="3" rx="15" ry="16" fill="${P.ladybug}" ${ln(k)}/><path d="M0 -12.5V19" ${ln(k, 1.8)}/>
      <circle cx="-7" cy="-1" r="2.8" fill="${k}"/><circle cx="7" cy="-1" r="2.8" fill="${k}"/><circle cx="-7" cy="10" r="2.3" fill="${k}"/><circle cx="7" cy="10" r="2.3" fill="${k}"/>
      <path d="M-10 -6Q-8 -9 -5 -10" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>`,
  glasses: (k) => `<path d="M-19 -2L-23 -8M19 -2L23 -8" fill="none" ${ln(k)}/><circle cx="-10" cy="2" r="9" fill="${P.blue}" fill-opacity=".7" ${ln(k)}/><circle cx="10" cy="2" r="9" fill="${P.blue}" fill-opacity=".7" ${ln(k)}/>
      <path d="M-1.5 0Q0 -3 1.5 0" fill="none" ${ln(k)}/><path d="M-14 -1Q-12 -4 -9 -4M6 -1Q8 -4 11 -4" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/>`,
  star: (k) => `<path d="M0 -17L5 -6.5 16.5 -5 8 3 10.2 14.5 0 9 -10.2 14.5 -8 3 -16.5 -5 -5 -6.5Z" fill="${P.butter}" ${ln(k)}/>
      <path d="M18 -16L21 -19M20 -10H23.5M13 -20L14.5 -23.5" ${ln(k, 1.8)}/><path d="M-6 -2Q-4 -5 -1 -5" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>`,
  house: (k) => `<rect x="7" y="-15" width="5" height="9" fill="${P.rose}" ${ln(k)}/><rect x="-14" y="-1" width="28" height="19" fill="${P.peach}" ${ln(k)}/>
      <path d="M-18 1L0 -16 18 1Z" fill="${P.roseDeep}" ${ln(k)}/><rect x="-4" y="6" width="8" height="12" rx="1.5" fill="${P.lavender}" ${ln(k)}/>
      <rect x="-11" y="3" width="6" height="6" fill="${P.blue}" ${ln(k, 1.8)}/><circle cx="2" cy="12" r=".9" fill="${k}"/>`,
  friends: (k) => `<circle cx="8" cy="-4" r="10" fill="${P.blue}" ${ln(k)}/><circle cx="-7" cy="3" r="11" fill="${P.butter}" ${ln(k)}/>
      <circle cx="-10.5" cy="1" r="1.4" fill="${k}"/><circle cx="-3.5" cy="1" r="1.4" fill="${k}"/><path d="M-10 6Q-7 9 -4 6" fill="none" ${ln(k, 1.8)}/>
      <circle cx="5" cy="-6" r="1.3" fill="${k}"/><circle cx="11" cy="-6" r="1.3" fill="${k}"/><path d="M5.5 -2Q8 0 10.5 -2" fill="none" ${ln(k, 1.8)}/>
      <circle cx="-13" cy="5" r="1.8" fill="${P.roseDeep}" opacity=".7"/><circle cx="-1" cy="5" r="1.8" fill="${P.roseDeep}" opacity=".7"/>`,
  sprout: (k) => `<path d="M0 6V-6" ${ln(k)}/><path d="M0 -4C-2 -12 -9 -15 -15 -13C-14 -7 -7 -3 0 -4Z" fill="${P.sage}" ${ln(k)}/>
      <path d="M0 -7C2 -16 9 -19 16 -17C15 -10 8 -6 0 -7Z" fill="${P.sageDeep}" ${ln(k)}/><path d="M-10 7H10L8 21H-8Z" fill="${P.peach}" ${ln(k)}/><rect x="-13" y="3" width="26" height="6" rx="2" fill="${P.rose}" ${ln(k)}/>`,
  candle: (k) => `<path d="M0 -21C5 -15 5 -11 0 -9C-5 -11 -5 -15 0 -21Z" fill="${P.butter}" ${ln(k, 1.8)}/><path d="M0 -16C2 -13 2 -12 0 -11C-2 -12 -2 -13 0 -16Z" fill="${P.peach}"/>
      <path d="M0 -9V-5" ${ln(k, 1.8)}/><rect x="-8" y="-5" width="16" height="25" rx="3" fill="${P.lavender}" ${ln(k)}/><path d="M-8 1Q-5 5 -2 1Q1 7 4 1Q6 4 8 1" fill="none" ${ln(k, 1.6)}/>`,
  rosette: (k) => {
    let d = '';
    for (let i = 0; i <= 12; i++) {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 ? 11.5 : 14;
      d += `${i ? 'L' : 'M'}${fmt(Math.cos(a) * r)} ${fmt(Math.sin(a) * r - 4)}`;
    }
    return `<path d="M-7 4L-12 21 -6 18 -3 23 1 6M7 4L12 21 6 18 3 23 -1 6" fill="${P.lavender}" ${ln(k)}/><path d="${d}Z" fill="${P.rose}" ${ln(k)}/><circle cy="-4" r="7" fill="${P.butter}" ${ln(k)}/>`;
  },
  calendar: (k) => `<rect x="-16" y="-13" width="32" height="31" rx="5" fill="${P.cream}" ${ln(k)}/><path d="M-16 -8A5 5 0 0 1 -11 -13H11A5 5 0 0 1 16 -8V-4H-16Z" fill="${P.rose}" ${ln(k)}/>
      <path d="M-8 -17V-9M8 -17V-9" ${ln(k)}/>${[-8, 0, 8].map((x) => [3, 11].map((y) => `<circle cx="${x}" cy="${y}" r="1.7" fill="${k}" opacity=".55"/>`).join('')).join('')}
      <circle cx="8" cy="11" r="4.5" fill="none" stroke="${P.roseDeep}" stroke-width="2"/>`,
  mug: (k) => `<path d="M-6 -12Q-9 -16 -6 -20M1 -12Q-2 -16 1 -20" fill="none" ${ln(k, 1.8)} opacity=".6"/>
      <path d="M9 -2A6 6 0 0 1 9 10" fill="none" ${ln(k)}/><path d="M-15 -7H10V11A7 7 0 0 1 3 18H-8A7 7 0 0 1 -15 11Z" fill="${P.blue}" ${ln(k)}/><path d="M-11 0H-4" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>`,
  trophy: (k) => `<path d="M-9 -15H-15V-10A6 6 0 0 0 -8 -4M9 -15H15V-10A6 6 0 0 1 8 -4" fill="none" ${ln(k)}/><path d="M-10 -17H10V-6A10 10 0 0 1 -10 -6Z" fill="${P.butter}" ${ln(k)}/>
      <path d="M-3 4H3L4 11H-4Z" fill="${P.butter}" ${ln(k)}/><rect x="-10" y="11" width="20" height="8" rx="2" fill="${P.peach}" ${ln(k)}/><path d="M0 -14L1.6 -10.6 5.3 -10.2 2.5 -7.7 3.3 -4 0 -5.8 -3.3 -4 -2.5 -7.7 -5.3 -10.2 -1.6 -10.6Z" fill="${P.cream}"/>`,
  target: (k) => `<circle r="17" fill="${P.cream}" ${ln(k)}/><circle r="11.5" fill="${P.rose}" ${ln(k)}/><circle r="6" fill="${P.cream}" ${ln(k)}/><circle r="2.4" fill="${k}"/>
      <path d="M0 -22V-17M0 17V22M-22 0H-17M17 0H22" ${ln(k)}/>`,
  drone: (k) => `${[[-15, -10], [15, -10], [-15, 10], [15, 10]].map(([x, y]) => `<path d="M0 0L${x} ${y}" ${ln(k)}/><ellipse cx="${x}" cy="${y}" rx="8" ry="2.6" fill="${P.blue}" ${ln(k, 1.8)}/>`).join('')}
      <rect x="-8" y="-6" width="16" height="12" rx="4" fill="${P.lavender}" ${ln(k)}/><circle cy="9" r="2.6" fill="${P.cream}" ${ln(k, 1.6)}/>`,
  houseSearch: (k) => `<rect x="-17" y="-2" width="22" height="16" fill="${P.peach}" ${ln(k)}/><path d="M-20 0L-6 -13 8 0Z" fill="${P.roseDeep}" ${ln(k)}/><rect x="-10" y="4" width="6" height="10" fill="${P.lavender}" ${ln(k, 1.8)}/>
      <path d="M15 15L21 21" ${ln(k, 3)}/><circle cx="10" cy="10" r="8" fill="${P.blue}" fill-opacity=".85" ${ln(k)}/><path d="M6 8Q7.5 5 10.5 5" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/>`,
  bulb: (k) => `<path d="M-15 -14L-19 -17M15 -14L19 -17M-19 -2H-23M19 -2H23M0 -22V-26" ${ln(k, 1.8)} opacity=".6"/>
      <path d="M-6 9C-6 4 -12 1 -12 -6A12 12 0 0 1 12 -6C12 1 6 4 6 9Z" fill="${P.butter}" ${ln(k)}/><path d="M-4 0Q-2 -4 0 0Q2 -4 4 0" fill="none" ${ln(k, 1.6)}/>
      <rect x="-6" y="9" width="12" height="5" rx="1.5" fill="${P.grey}" ${ln(k, 1.8)}/><rect x="-4.5" y="14" width="9" height="4" rx="1.5" fill="${P.grey}" ${ln(k, 1.8)}/>`,
  code: (k) => `<rect x="-19" y="-14" width="38" height="28" rx="7" fill="${P.blue}" ${ln(k)}/><path d="M-7 -6L-13 0 -7 6M7 -6L13 0 7 6M2.5 -8L-2.5 8" fill="none" ${ln(k)}/>`,
  palette: (k) => `<path d="M0 -17C11 -17 19 -10 19 -2C19 4 14 6 10 5C6 4 4 7 6 11C8 15 4 18 0 18C-11 18 -19 10 -19 0C-19 -10 -10 -17 0 -17Z" fill="${P.butter}" ${ln(k)}/>
      <circle cx="-9" cy="-6" r="3.2" fill="${P.roseDeep}" ${ln(k, 1.5)}/><circle cx="0" cy="-10" r="3.2" fill="${P.blueDeep}" ${ln(k, 1.5)}/><circle cx="9" cy="-7" r="3.2" fill="${P.sageDeep}" ${ln(k, 1.5)}/><circle cx="-10" cy="5" r="3.2" fill="${P.lavender}" ${ln(k, 1.5)}/>`,
  cloud: (k) => `<path d="M-12 14H12A8 8 0 0 0 13 -2A10 10 0 0 0 -6 -8A9 9 0 0 0 -13 6A4 4 0 0 0 -12 14Z" fill="${P.blue}" ${ln(k)}/><path d="M0 10V-1M-4.5 3.5L0 -1 4.5 3.5" fill="none" ${ln(k)}/>`,
  // open-end wrench: one outline, C-shaped jaw (circle r9 about 0,-14) opening upward
  wrench: (k) => `<g transform="rotate(40)"><path d="M-4 18V-5.94A9 9 0 0 1 -4.5 -21.79L-2 -16H2L4.5 -21.79A9 9 0 0 1 4 -5.94V18A4 4 0 0 1 -4 18Z" fill="${P.lavender}" ${ln(k)}/><circle cy="12" r="1.6" fill="${k}" opacity=".5"/></g>`,
  flask: (k) => `<path d="M-5 -19H5M-4 -19V-6L-15 13A3 3 0 0 0 -12 18H12A3 3 0 0 0 15 13L4 -6V-19" fill="${P.cream}" ${ln(k)}/>
      <path d="M-10 5H10L15 13A3 3 0 0 1 12 18H-12A3 3 0 0 1 -15 13Z" fill="${P.mint}" ${ln(k)}/><circle cx="-3" cy="11" r="1.8" fill="#FFFFFF"/><circle cx="4" cy="8" r="1.3" fill="#FFFFFF"/><circle cx="1" cy="-2" r="1.6" fill="${k}" opacity=".35"/>`,
  database: (k) => `<path d="M-15 -11V13A15 5 0 0 0 15 13V-11" fill="${P.sage}" ${ln(k)}/><ellipse cy="-11" rx="15" ry="5" fill="${P.mint}" ${ln(k)}/><path d="M-15 1A15 5 0 0 0 15 1" fill="none" ${ln(k)}/>`,
  browser: (k) => `<rect x="-19" y="-15" width="38" height="30" rx="5" fill="${P.cream}" ${ln(k)}/><path d="M-19 -10A5 5 0 0 1 -14 -15H14A5 5 0 0 1 19 -10V-6H-19Z" fill="${P.lavender}" ${ln(k)}/>
      <circle cx="-13" cy="-10.5" r="1.5" fill="${k}"/><circle cx="-8.5" cy="-10.5" r="1.5" fill="${k}"/><rect x="-13" y="-1" width="13" height="10" rx="2" fill="${P.blue}" ${ln(k, 1.6)}/><path d="M4 0H13M4 5H11M4 10H13" ${ln(k, 1.6)} opacity=".6"/>`,
  server: (k) => `${[-13, -1, 11].map((y) => `<rect x="-17" y="${y}" width="34" height="10" rx="3" fill="${P.lavender}" ${ln(k)}/><circle cx="-11" cy="${y + 5}" r="1.8" fill="${P.sageDeep}"/><path d="M2 ${y + 5}H11" ${ln(k, 1.6)} opacity=".5"/>`).join('')}`,
  hourglass: (k) => `<path d="M-13 -19H13M-13 19H13" ${ln(k, 2.6)}/><path d="M-10 -19C-10 -6 -3 -4 0 0C-3 4 -10 6 -10 19H10C10 6 3 4 0 0C3 -4 10 -6 10 -19Z" fill="${P.cream}" ${ln(k)}/>
      <path d="M-6 -10H6C4 -5 1 -3 0 -1C-1 -3 -4 -5 -6 -10ZM-8 17C-7 10 -2 8 0 6C2 8 7 10 8 17Z" fill="${P.butter}"/>`,
  heart: (k) => `<path d="M0 15C-11 7 -17 1 -17 -6A8.5 8.5 0 0 1 0 -10A8.5 8.5 0 0 1 17 -6C17 1 11 7 0 15Z" fill="${P.rose}" ${ln(k)}/><path d="M-11 -6Q-10 -10 -6 -10" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" opacity=".8"/>`,
  rocket: (k) => `<path d="M-6 9L-13 16L-12 8ZM6 9L13 16L12 8Z" fill="${P.rose}" ${ln(k)}/><path d="M0 -21C9 -14 10 -3 6 9H-6C-10 -3 -9 -14 0 -21Z" fill="${P.cream}" ${ln(k)}/>
      <circle cy="-6" r="4" fill="${P.blue}" ${ln(k, 1.8)}/><path d="M-3 13Q0 21 3 13" fill="${P.butter}" ${ln(k, 1.8)}/>`,
  sparkles: (k) => `<path d="M-4 -16Q-2 -5 9 -3Q-2 -1 -4 10Q-6 -1 -17 -3Q-6 -5 -4 -16Z" fill="${P.butter}" ${ln(k)}/><path d="M12 6Q13 11 18 12Q13 13 12 18Q11 13 6 12Q11 11 12 6Z" fill="${P.rose}" ${ln(k, 1.8)}/>`,
};

export const DOODLES = Object.keys(DRAW);

export function doodle(name, { x = 0, y = 0, size = 48, ink = '#3A3245', rot = 0 } = {}) {
  const draw = DRAW[name];
  if (!draw) throw new Error(`Unknown doodle "${name}". Known: ${DOODLES.join(', ')}`);
  return `<g transform="translate(${fmt(x)} ${fmt(y)}) rotate(${rot}) scale(${fmt(size / 48)})">${draw(ink)}</g>`;
}
