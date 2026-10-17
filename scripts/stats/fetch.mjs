// GitHub GraphQL data layer for the stats cards.
const ENDPOINT = 'https://api.github.com/graphql';

const PROFILE_QUERY = `
query($login:String!){
  user(login:$login){
    login
    name
    createdAt
    followers{ totalCount }
    contributionsCollection{
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      restrictedContributionsCount
      contributionCalendar{
        totalContributions
        weeks{ contributionDays{ date contributionCount } }
      }
    }
    repositoriesContributedTo(first:1, contributionTypes:[COMMIT,PULL_REQUEST,ISSUE,REPOSITORY]){ totalCount }
  }
}`;

// One calendar year at a time — contributionsCollection spans at most a year per call.
const CALENDAR_QUERY = `
query($login:String!, $from:DateTime!, $to:DateTime!){
  user(login:$login){
    contributionsCollection(from:$from, to:$to){
      contributionCalendar{ weeks{ contributionDays{ date contributionCount } } }
    }
  }
}`;

/** Every contribution day since the account was created, oldest first. */
async function fetchAllDays(token, login, createdAt) {
  const now = new Date();
  const days = new Map();
  for (let y = new Date(createdAt).getUTCFullYear(); y <= now.getUTCFullYear(); y++) {
    const from = new Date(Math.max(Date.UTC(y, 0, 1), new Date(createdAt).getTime()));
    const to = new Date(Math.min(Date.UTC(y, 11, 31, 23, 59, 59), now.getTime()));
    const { contributionsCollection } = await gql(token, CALENDAR_QUERY, { login, from: from.toISOString(), to: to.toISOString() });
    for (const w of contributionsCollection.contributionCalendar.weeks) {
      for (const d of w.contributionDays) days.set(d.date, d.contributionCount);
    }
  }
  return [...days.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => ({ date, count }));
}

/** Current and longest runs of days with at least one contribution. Today may still be empty. */
export function streaks(allDays) {
  let longest = { length: 0, start: null, end: null };
  let run = { length: 0, start: null };
  for (const d of allDays) {
    if (d.count > 0) {
      run = run.length ? { length: run.length + 1, start: run.start } : { length: 1, start: d.date };
      if (run.length > longest.length) longest = { length: run.length, start: run.start, end: d.date };
    } else run = { length: 0, start: null };
  }
  const last = allDays.length - 1;
  let i = allDays[last]?.count > 0 ? last : last - 1; // an empty "today" doesn't break the streak
  const end = allDays[i]?.date ?? null;
  let length = 0;
  while (i >= 0 && allDays[i].count > 0) {
    length++;
    i--;
  }
  return {
    current: { length, start: length ? allDays[i + 1].date : null, end: length ? end : null },
    longest,
    total: allDays.reduce((s, d) => s + d.count, 0),
    since: allDays[0]?.date ?? null,
  };
}

// privacy: PUBLIC keeps local runs (full-scope gh token) identical to CI runs (public-only GITHUB_TOKEN).
const REPOS_QUERY = `
query($login:String!, $after:String){
  user(login:$login){
    repositories(ownerAffiliations:OWNER, isFork:false, privacy:PUBLIC, first:100, after:$after){
      pageInfo{ hasNextPage endCursor }
      nodes{
        name
        stargazerCount
        languages(first:10, orderBy:{field:SIZE, direction:DESC}){
          edges{ size node{ name color } }
        }
      }
    }
  }
}`;

async function gql(token, query, variables, attempt = 1) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'nghaiz-profile-stats',
    },
    body: JSON.stringify({ query, variables }),
  });
  if ([502, 503, 504].includes(res.status) && attempt < 4) {
    await new Promise((r) => setTimeout(r, 1500 * attempt));
    return gql(token, query, variables, attempt + 1);
  }
  if (!res.ok) throw new Error(`GitHub GraphQL HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(`GitHub GraphQL errors: ${json.errors.map((e) => e.message).join('; ')}`);
  if (!json.data?.user) throw new Error('GitHub GraphQL returned no user — check PROFILE_USER');
  return json.data.user;
}

/** Everything the three cards need, in one normalised object. */
export async function fetchProfile(login, token) {
  if (!token) throw new Error('GITHUB_TOKEN is not set. Locally: GITHUB_TOKEN=$(gh auth token) npm run stats');

  const user = await gql(token, PROFILE_QUERY, { login });

  const repos = [];
  let after = null;
  for (let page = 0; page < 50; page++) {
    const { repositories } = await gql(token, REPOS_QUERY, { login, after });
    repos.push(...repositories.nodes);
    if (!repositories.pageInfo.hasNextPage) break;
    after = repositories.pageInfo.endCursor;
  }

  const langBytes = new Map(); // name -> { bytes, color }
  let stars = 0;
  for (const repo of repos) {
    stars += repo.stargazerCount;
    for (const { size, node } of repo.languages.edges) {
      const cur = langBytes.get(node.name) ?? { bytes: 0, color: node.color };
      cur.bytes += size;
      langBytes.set(node.name, cur);
    }
  }

  const cc = user.contributionsCollection;
  const days = cc.contributionCalendar.weeks
    .flatMap((w) => w.contributionDays)
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    login: user.login,
    name: user.name,
    followers: user.followers.totalCount,
    repoCount: repos.length,
    stars,
    contributedTo: user.repositoriesContributedTo.totalCount,
    totalContributions: cc.contributionCalendar.totalContributions,
    commits: cc.totalCommitContributions,
    prs: cc.totalPullRequestContributions,
    issues: cc.totalIssueContributions,
    restricted: cc.restrictedContributionsCount,
    days, // [{ date: 'YYYY-MM-DD', contributionCount }]
    streak: streaks(await fetchAllDays(token, login, user.createdAt)),
    languages: [...langBytes.entries()].map(([name, v]) => ({ name, bytes: v.bytes, color: v.color })),
  };
}
