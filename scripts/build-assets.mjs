// Regenerates every SVG in assets/ (except assets/generated/) from scripts/profile.config.mjs.
//   npm run build            → everything
//   npm run build -- hero    → only files whose name starts with "hero"
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFonts } from './lib/type.mjs';
import { profile } from './profile.config.mjs';
import { hero } from './assets/hero.mjs';
import { tokyo, dawnBanner, sunlight } from './assets/scenes.mjs';
import { heading } from './assets/heading.mjs';
import { project } from './assets/project.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets');

const HEADINGS = {
  about: { title: 'About me', jp: '自己紹介' },
  stack: { title: 'Tech stack', jp: '技術' },
  projects: { title: 'Projects', jp: '作品' },
  graph: { title: 'Contribution graph', jp: '足あと' },
};

const builders = {
  'hero.svg': () => hero(profile),
  'tokyo.svg': () => tokyo(),
  'stats-banner.svg': () => dawnBanner({ title: 'Notes from this year', jp: '一年の記録' }),
  'footer.svg': () => sunlight(),
};
for (const [key, h] of Object.entries(HEADINGS)) {
  builders[`heading-${key}.svg`] = () => heading(h, 'light');
  builders[`heading-${key}-dark.svg`] = () => heading(h, 'dark');
}
profile.projects.forEach((p, i) => {
  builders[`${p.file}.svg`] = () => project(p, profile.login, 11 + i);
});

await loadFonts();
fs.mkdirSync(OUT, { recursive: true });
const only = process.argv.slice(2);
for (const [file, build] of Object.entries(builders)) {
  if (only.length && !only.some((o) => file.startsWith(o))) continue;
  const svg = build();
  fs.writeFileSync(path.join(OUT, file), svg);
  console.log(`${file.padEnd(32)} ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`);
}
