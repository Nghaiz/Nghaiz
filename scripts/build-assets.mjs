// Regenerates every SVG in assets/ (except assets/generated/) from scripts/profile.config.mjs
// and scripts/stack.config.mjs. Journal cards come in a dark and a light file each.
//   npm run build            → everything
//   npm run build -- hero    → only files whose name starts with "hero"
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFonts } from './lib/type.mjs';
import { MODES } from './lib/journal.mjs';
import { profile } from './profile.config.mjs';
import { STACK } from './stack.config.mjs';
import { hero } from './assets/hero.mjs';
import { tokyo, dawnBanner, sunlight } from './assets/scenes.mjs';
import { heading } from './assets/heading.mjs';
import { project } from './assets/project.mjs';
import { toolbox } from './assets/toolbox.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets');

const HEADINGS = {
  about: { title: 'About me', jp: '自己紹介' },
  stack: { title: 'Tech stack', jp: '技術', note: 'every logo here shows up in one of my repos' },
  projects: { title: 'University projects', jp: '学業', note: 'coursework and student team projects at PTIT' },
  graph: { title: 'Contribution graph', jp: '足あと', note: 'redrawn every day by GitHub Actions' },
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
for (const [mode, tone] of Object.entries(MODES)) {
  profile.projects.forEach((p, i) => {
    builders[`${p.file}-${mode}.svg`] = () => project(p, profile.login, tone, 11 + i);
  });
  for (const group of STACK) builders[`stack-${group.key}-${mode}.svg`] = () => toolbox(group, tone);
}

await loadFonts();
fs.mkdirSync(OUT, { recursive: true });
const only = process.argv.slice(2);
for (const [file, build] of Object.entries(builders)) {
  if (only.length && !only.some((o) => file.startsWith(o))) continue;
  const svg = build();
  fs.writeFileSync(path.join(OUT, file), svg);
  console.log(`${file.padEnd(34)} ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`);
}
