// Vendors the devicon logos named in scripts/stack.config.mjs into assets/logos/<slug>.svg.
// Run once after editing the stack: `npm run logos`. Builds read the files from disk, so the
// profile never depends on a CDN at render time.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOGOS } from './stack.config.mjs';

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons';
const VARIANTS = ['original', 'plain', 'original-wordmark', 'plain-wordmark'];
// The original Tux is a 190 KB illustration; the plain mark reads the same at sticker size.
const PREFERRED = { linux: 'plain' };
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'logos');

fs.mkdirSync(OUT, { recursive: true });
const slugs = [...new Set(Object.values(LOGOS))].sort();
const missing = [];
for (const slug of slugs) {
  const file = path.join(OUT, `${slug}.svg`);
  if (fs.existsSync(file)) continue;
  let saved = false;
  for (const v of [PREFERRED[slug], ...VARIANTS].filter(Boolean)) {
    const res = await fetch(`${DEVICON}/${slug}/${slug}-${v}.svg`);
    if (!res.ok) continue;
    fs.writeFileSync(file, await res.text());
    console.log(`saved ${slug} (${v})`);
    saved = true;
    break;
  }
  if (!saved) missing.push(slug);
}
if (missing.length) {
  console.error(`No devicon logo for: ${missing.join(', ')}`);
  process.exit(1);
}
console.log(`${slugs.length} logos in assets/logos`);
