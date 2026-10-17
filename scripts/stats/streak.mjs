// "Streak" card: all-time total, current streak (centre, inside a glowing ring), longest streak.
import { C } from '../lib/theme.mjs';
import { text } from '../lib/type.mjs';
import { doc, nightCard } from '../lib/svg.mjs';
import { num, day } from './overview.mjs';

const W = 1200;
const H = 250;

function column(x, value, label, sub, color) {
  const v = text(value, { font: 'montb', size: 38, x, y: 112, anchor: 'middle' });
  const l = text(label, { font: 'montb', size: 11, x, y: 182, anchor: 'middle', tracking: 2.2 });
  const s = text(sub, { font: 'mont', size: 13, x, y: 206, anchor: 'middle' });
  return `<path d="${v.d}" fill="${C.text}"/><path d="${l.d}" fill="${color}"/><path d="${s.d}" fill="${C.faint}"/>`;
}

export function streakCard(d) {
  const card = nightCard({ w: W, h: H, seed: 7 });
  const s = d.streak;
  const range = (r) => (r.length ? `${day(r.start)}  –  ${day(r.end)}` : 'not started yet');
  const ringLen = 2 * Math.PI * 50;
  const style = `${card.css}
    @keyframes in{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:none}} .in{animation:in .8s ease-out both}
    @keyframes ring{from{stroke-dashoffset:${ringLen.toFixed(1)}}} .ring{animation:ring 1.6s cubic-bezier(.3,0,.2,1) .2s both}
    @keyframes halo{0%,100%{opacity:.35}50%{opacity:.7}} .halo{animation:halo 4s ease-in-out infinite}`;
  const defs = `${card.defs}<filter id="ringGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>`;
  const body = `${card.svg}
    <path d="M400 50V210M800 50V210" stroke="${C.line}"/>
    <circle class="halo" cx="600" cy="99" r="50" fill="none" stroke="${C.comet}" stroke-width="6" filter="url(#ringGlow)"/>
    <circle class="ring" cx="600" cy="99" r="50" fill="none" stroke="${C.comet}" stroke-width="2.5" stroke-dasharray="${ringLen.toFixed(1)}" transform="rotate(-90 600 99)"/>
    <g class="in">${column(200, num(s.total), 'TOTAL CONTRIBUTIONS', `since ${day(s.since)}`, C.sunset)}</g>
    <g class="in" style="animation-delay:.2s">${column(600, `${s.current.length}`, 'CURRENT STREAK', range(s.current), C.comet)}</g>
    <g class="in" style="animation-delay:.4s">${column(1000, `${s.longest.length}`, 'LONGEST STREAK', range(s.longest), C.gold)}</g>`;
  return doc({ width: W, height: H, title: `Current streak ${s.current.length} days, longest ${s.longest.length} days`, desc: `${num(s.total)} contributions since ${s.since}`, style, defs, body });
}
