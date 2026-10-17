// Fetches GitHub data and renders the dynamic stats cards into assets/generated/.
//   GITHUB_TOKEN=$(gh auth token) npm run stats
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFonts } from './lib/type.mjs';
import { fetchProfile } from './stats/fetch.mjs';
import { overviewCard } from './stats/overview.mjs';
import { languagesCard, shares } from './stats/languages.mjs';
import { streakCard } from './stats/streak.mjs';
import { activityCard } from './stats/activity.mjs';
import { badges } from './stats/badges.mjs';

const OUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'generated');
const MAX_BYTES = 250 * 1024;

async function main() {
  const login = process.env.PROFILE_USER || 'Nghaiz';
  const data = await fetchProfile(login, process.env.GITHUB_TOKEN);
  await loadFonts(['fuzzy', 'mincho', 'minchoM']);

  const cards = {
    'overview.svg': overviewCard(data),
    'languages.svg': languagesCard(data),
    'streak.svg': streakCard(data),
    'activity.svg': activityCard(data),
    ...badges(data),
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const [name, svg] of Object.entries(cards)) {
    const bytes = Buffer.byteLength(svg);
    if (bytes > MAX_BYTES) throw new Error(`${name} is ${bytes} bytes, over the ${MAX_BYTES} byte budget`);
    fs.writeFileSync(path.join(OUT_DIR, name), svg);
    console.log(`wrote assets/generated/${name} (${(bytes / 1024).toFixed(1)} KB)`);
  }
  console.log(
    JSON.stringify({
      year: data.totalContributions,
      followers: data.followers,
      publicRepos: data.publicRepos,
      prsMerged: data.prsMerged,
      createdAt: data.createdAt,
      commits: data.commits,
      prs: data.prs,
      issues: data.issues,
      stars: data.stars,
      streak: data.streak,
      languages: shares(data.languages).map((l) => `${l.name} ${(l.share * 100).toFixed(1)}%`),
    }),
  );
}

main().catch((err) => {
  console.error(`build-stats failed: ${err.message}`);
  process.exit(1);
});
