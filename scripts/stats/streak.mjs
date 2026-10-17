// "Streak" card: all-time total, current streak (inside a ring with an orbiting comet), longest.
import { C } from '../lib/theme.mjs';
import { text } from '../lib/type.mjs';
import { doc, nightCard, glowing } from '../lib/svg.mjs';
import { num, day, IN_CSS } from './overview.mjs';

const W = 1200;
const H = 380;
const RING = { cx: 600, cy: 196, r: 104 };

function column(x, label, value, unit, sub, grad) {
  const l = text(label, { font: 'vibes', size: 50, x, y: 74, anchor: 'middle' });
  const v = text(value, { font: 'mincho', size: value.length > 3 ? 84 : 108, x, y: 232, anchor: 'middle' });
  const u = text(unit, { font: 'vibes', size: 34, x, y: 280, anchor: 'middle' });
  const s = text(sub, { font: 'minchoM', size: 19, x, y: 340, anchor: 'middle' });
  return `<path d="${l.d}" fill="#FFFFFF"/>${glowing(v.d, grad)}<path d="${u.d}" fill="${C.soft}"/><path d="${s.d}" fill="${C.faint}"/>`;
}

export function streakCard(d) {
  const card = nightCard({ w: W, h: H, seed: 7 });
  const s = d.streak;
  const range = (r) => (r.length ? `${day(r.start)}  –  ${day(r.end)}` : 'starts with the next commit');
  const len = 2 * Math.PI * RING.r;
  const style = `${card.css} ${IN_CSS}
    @keyframes ring{from{stroke-dashoffset:${len.toFixed(1)}}} .ring{animation:ring 1.8s cubic-bezier(.3,0,.2,1) .2s both}
    @keyframes orbit{to{transform:rotate(360deg)}} .orbit{transform-origin:${RING.cx}px ${RING.cy}px;animation:orbit 9s linear infinite}
    @keyframes halo{0%,100%{opacity:.35}50%{opacity:.8}} .halo{animation:halo 4s ease-in-out infinite}`;
  const defs = `${card.defs}
    <filter id="ringGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8"/></filter>
    <linearGradient id="ringG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7FD6F5"/><stop offset="1" stop-color="#A88CFF"/></linearGradient>
    <linearGradient id="tailG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient>`;
  const { cx, cy, r } = RING;
  const body = `${card.svg}
    <path d="M400 70V330M800 70V330" stroke="url(#ncRim)" stroke-width="1.2" opacity=".5"/>
    <circle class="halo" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#7FD6F5" stroke-width="10" filter="url(#ringGlow)"/>
    <circle class="ring" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#ringG)" stroke-width="3" stroke-dasharray="${len.toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>
    <g class="orbit"><path d="M${cx - 46} ${cy - r + 9}A${r} ${r} 0 0 1 ${cx} ${cy - r}" stroke="url(#tailG)" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="${cx}" cy="${cy - r}" r="6" fill="#FFFFFF"/><circle cx="${cx}" cy="${cy - r}" r="14" fill="#7FD6F5" opacity=".35" filter="url(#ringGlow)"/></g>
    <g class="in">${column(200, 'Total', num(s.total), 'contributions', `since ${day(s.since)}`, 'sunset')}</g>
    <g class="in" style="animation-delay:.2s">${column(600, 'Current streak', `${s.current.length}`, 'days', range(s.current), 'comet')}</g>
    <g class="in" style="animation-delay:.4s">${column(1000, 'Longest streak', `${s.longest.length}`, 'days', range(s.longest), 'gold')}</g>`;
  return doc({ width: W, height: H, title: `Current streak ${s.current.length} days, longest ${s.longest.length} days`, desc: `${num(s.total)} contributions since ${s.since}`, style, defs, body });
}
