// Fetches GitHub data and renders the dynamic journal cards into assets/generated/:
// one dark ("night" paper) and one light ("cream" paper) file per card, plus the badges.
//   GITHUB_TOKEN=$(gh auth token) npm run stats
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFonts } from './lib/type.mjs';
import { MODES } from './lib/journal.mjs';
import { fetchProfile } from './stats/fetch.mjs';
import { overviewCard } from './stats/overview.mjs';
import { languagesCard, shares } from './stats/languages.mjs';
import { streakCard } from './stats/streak.mjs';
import { activityCard } from './stats/activity.mjs';
import { trophiesCard, CATEGORIES, rankOf } from './stats/trophies.mjs';
import { badges } from './stats/badges.mjs';

const OUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'generated');
const MAX_BYTES = 400 * 1024;
const CARDS = { overview: overviewCard, languages: languagesCard, streak: streakCard, activity: activityCard, trophies: trophiesCard };

async function main() {
  const login = process.env.PROFILE_USER || 'Nghaiz';
  const data = await fetchProfile(login, process.env.GITHUB_TOKEN);
  await loadFonts(['fuzzy', 'fuzzyR']);

  const files = { ...badges(data) };
  for (const [name, render] of Object.entries(CARDS)) {
    for (const [mode, tone] of Object.entries(MODES)) files[`${name}-${mode}.svg`] = render(data, tone);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const old of fs.readdirSync(OUT_DIR)) if (!files[old]) fs.rmSync(path.join(OUT_DIR, old)); // drop retired cards
  for (const [name, svg] of Object.entries(files)) {
    const bytes = Buffer.byteLength(svg);
    if (bytes > MAX_BYTES) throw new Error(`${name} is ${bytes} bytes, over the ${MAX_BYTES} byte budget`);
    fs.writeFileSync(path.join(OUT_DIR, name), svg);
    console.log(`wrote assets/generated/${name} (${(bytes / 1024).toFixed(1)} KB)`);
  }
  console.log(
    JSON.stringify({
      year: data.totalContributions,
      allTime: data.allTime,
      rhythm: data.rhythm,
      streak: { current: data.streak.current.length, longest: data.streak.longest.length, total: data.streak.total },
      trophies: Object.fromEntries(CATEGORIES.map((c) => [c.label, rankOf(c, data).index])),
      languages: shares(data.languages).slice(0, 6).map((l) => `${l.name} ${(l.share * 100).toFixed(1)}%`),
    }),
  );
}

main().catch((err) => {
  console.error(`build-stats failed: ${err.message}`);
  process.exit(1);
});
