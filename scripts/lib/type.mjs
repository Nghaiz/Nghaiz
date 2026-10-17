// Text → SVG path conversion. GitHub renders README SVGs as <img>, which cannot load web fonts,
// so every glyph is baked into path data with opentype.js. Fonts are fetched from google/fonts on
// first use and cached in scripts/fonts/ (gitignored); only their OFL licences are committed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';

const FONT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'fonts');
const GOOGLE_FONTS_RAW = 'https://raw.githubusercontent.com/google/fonts/main/ofl';

const SOURCES = {
  charm: 'charm/Charm-Bold.ttf',
  gentium: 'gentiumbookplus/GentiumBookPlus-Bold.ttf',
  patrick: 'patrickhand/PatrickHand-Regular.ttf',
  klee: 'kleeone/KleeOne-SemiBold.ttf',
  yuji: 'yujisyuku/YujiSyuku-Regular.ttf',
};

const loaded = new Map();

async function ensureFile(key) {
  const rel = SOURCES[key];
  if (!rel) throw new Error(`Unknown font key "${key}". Known: ${Object.keys(SOURCES).join(', ')}`);
  const file = path.join(FONT_DIR, path.basename(rel));
  if (fs.existsSync(file) && fs.statSync(file).size > 0) return file;
  fs.mkdirSync(FONT_DIR, { recursive: true });
  const res = await fetch(`${GOOGLE_FONTS_RAW}/${rel}`);
  if (!res.ok) throw new Error(`Font download failed for ${key}: HTTP ${res.status}`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

/** Load every font key up front so the synchronous helpers below can be used freely. */
export async function loadFonts(keys = Object.keys(SOURCES)) {
  for (const key of keys) {
    if (!loaded.has(key)) loaded.set(key, opentype.loadSync(await ensureFile(key)));
  }
}

function font(key) {
  const f = loaded.get(key);
  if (!f) throw new Error(`Font "${key}" not loaded — call loadFonts() first.`);
  return f;
}

function layout(str, key, size, tracking) {
  const f = font(key);
  const text = str.normalize('NFC');
  const glyphs = f.stringToGlyphs(text);
  const scale = size / f.unitsPerEm;
  const missing = [...text].filter((ch) => !/\s/.test(ch) && f.charToGlyphIndex(ch) === 0);
  if (missing.length) throw new Error(`Font "${key}" has no glyph for: ${[...new Set(missing)].join('')} (in "${text}")`);
  const items = [];
  let x = 0;
  glyphs.forEach((g, i) => {
    items.push({ glyph: g, x });
    x += (g.advanceWidth || 0) * scale + tracking;
    const next = glyphs[i + 1];
    if (next) x += f.getKerningValue(g, next) * scale;
  });
  return { f, items, width: Math.max(0, x - tracking) };
}

/** Width in px of `str` set in font `key` at `size`. */
export function measure(str, { font: key, size, tracking = 0 }) {
  return layout(str, key, size, tracking).width;
}

/**
 * Returns { d, width, x0 } — one combined path for the whole string.
 * anchor: 'start' | 'middle' | 'end' relative to x. y is the baseline.
 */
export function text(str, { font: key, size, x = 0, y = 0, anchor = 'start', tracking = 0 }) {
  const { items, width } = layout(str, key, size, tracking);
  const x0 = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  const d = items.map(({ glyph, x: gx }) => glyph.getPath(x0 + gx, y, size).toPathData(1)).join('');
  return { d, width, x0 };
}

/** Same as text() but one entry per visible glyph — for staggered per-letter animation. */
export function glyphs(str, { font: key, size, x = 0, y = 0, anchor = 'start', tracking = 0 }) {
  const { items, width } = layout(str, key, size, tracking);
  const x0 = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  const scale = size / font(key).unitsPerEm;
  return items
    .map(({ glyph, x: gx }) => ({
      d: glyph.getPath(x0 + gx, y, size).toPathData(1),
      x: x0 + gx,
      w: (glyph.advanceWidth || 0) * scale,
    }))
    .filter((g) => g.d.length > 0);
}

/** Vertical (tategaki) column: characters stacked top-to-bottom, centred on x. */
export function vertical(str, { font: key, size, x, y, gap = 0.08 }) {
  const chars = [...str.normalize('NFC')];
  return chars
    .map((ch, i) => text(ch, { font: key, size, x, y: y + (i + 1) * size * (1 + gap) - size * 0.12, anchor: 'middle' }).d)
    .join('');
}
