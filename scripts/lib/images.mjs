// Image painters for vendored files: Shinkai crops prepared into assets/img (scripts/images.json)
// and devicon logos vendored into assets/logos (npm run logos). Both are embedded as data: URIs,
// because GitHub renders README SVGs as <img>, which cannot fetch anything.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fmt } from './svg.mjs';
import { words as text } from './type.mjs';
import { PAPER } from './doodles.mjs';
import { INK } from './journal.mjs';
import { LOGOS } from '../stack.config.mjs';

// ---------------------------------------------------------------- photos

const IMG_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'assets', 'img');

/** Image painter for a prepared crop in assets/img (see scripts/images.json): (x,y,w,h) → <image>. */
export function photo(id) {
  const file = path.join(IMG_DIR, `${id}.jpg`);
  if (!fs.existsSync(file)) throw new Error(`Missing ${file} — run: python scripts/prepare_images.py <sources>`);
  const href = `data:image/jpeg;base64,${fs.readFileSync(file).toString('base64')}`;
  return (x, y, w, h) => `<image href="${href}" x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" preserveAspectRatio="xMidYMid slice"/>`;
}

// ---------------------------------------------------------------- logos

const LOGO_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'assets', 'logos');
const logoCache = new Map();

/** data: URI of the vendored devicon logo for a display name, or null when there is none. */
export function logoData(name) {
  const slug = LOGOS[name];
  if (!slug) return null;
  if (!logoCache.has(slug)) {
    const file = path.join(LOGO_DIR, `${slug}.svg`);
    if (!fs.existsSync(file)) throw new Error(`Logo for "${name}" not vendored (${slug}.svg) — run: npm run logos`);
    logoCache.set(slug, `data:image/svg+xml;base64,${fs.readFileSync(file).toString('base64')}`);
  }
  return logoCache.get(slug);
}

/** A logo centred at (cx, cy) inside a size×size box, or initials on a pastel disc when no logo exists. */
export function logo(name, cx, cy, size, fallbackFill = PAPER.lavender) {
  const href = logoData(name);
  if (href) return `<image href="${href}" x="${fmt(cx - size / 2)}" y="${fmt(cy - size / 2)}" width="${size}" height="${size}"/>`;
  const words = name.replace(/[^A-Za-z0-9 ]/g, '').split(/\s+/).filter(Boolean);
  const initials = (words.length > 1 ? words.map((w) => w[0]).join('') : words[0].length <= 4 ? words[0] : words[0].slice(0, 3)).slice(0, 4).toUpperCase();
  return `<circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(size / 2)}" fill="${fallbackFill}" stroke="${INK}" stroke-width="1.6"/>${text(initials, { font: 'fuzzy', size: size * 0.38, x: cx, y: cy + size * 0.14, anchor: 'middle' }).paint(`${INK}`)}`;
}
