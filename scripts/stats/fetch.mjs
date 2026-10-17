// GitHub GraphQL data layer for the stats cards.
const ENDPOINT = 'https://api.github.com/graphql';

const PROFILE_QUERY = `
query($login:String!){
  user(login:$login){
    login
    name
    createdAt
    followers{ totalCount }
    publicRepos: repositories(privacy:PUBLIC, ownerAffiliations:OWNER){ totalCount }
    pullRequests{ totalCount }
    issues{ totalCount }
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
      totalCommitContributions
      totalPullRequestReviewContributions
      contributionCalendar{ weeks{ contributionDays{ date contributionCount } } }
    }
  }
}`;

/** Every contribution day since the account was created (oldest first), plus all-time totals. */
async function fetchHistory(token, login, createdAt) {
  const now = new Date();
  const days = new Map();
  let commits = 0;
  let reviews = 0;
  for (let y = new Date(createdAt).getUTCFullYear(); y <= now.getUTCFullYear(); y++) {
    const from = new Date(Math.max(Date.UTC(y, 0, 1), new Date(createdAt).getTime()));
    const to = new Date(Math.min(Date.UTC(y, 11, 31, 23, 59, 59), now.getTime()));
    const { contributionsCollection: cc } = await gql(token, CALENDAR_QUERY, { login, from: from.toISOString(), to: to.toISOString() });
    commits += cc.totalCommitContributions;
    reviews += cc.totalPullRequestReviewContributions;
    for (const w of cc.contributionCalendar.weeks) {
      for (const d of w.contributionDays) days.set(d.date, d.contributionCount);
    }
  }
  const all = [...days.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => ({ date, count }));
  return { all, commits, reviews };
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Busiest single day and the weekday with the most contributions over the given days. */
export function rhythm(days) {
  const byWeekday = Array(7).fill(0);
  let best = days[0];
  for (const d of days) {
    byWeekday[new Date(`${d.date}T00:00:00Z`).getUTCDay()] += d.contributionCount;
    if (d.contributionCount > best.contributionCount) best = d;
  }
  const top = byWeekday.indexOf(Math.max(...byWeekday));
  return { bestDay: { date: best.date, count: best.contributionCount }, favouriteWeekday: WEEKDAYS[top] };
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

// is:public keeps the count identical between a local run and the public-only CI token.
const MERGED_PRS_QUERY = `
query($q:String!){
  search(query:$q, type:ISSUE, first:1){ issueCount }
}`;

const pickUser = (data) => {
  if (!data?.user) throw new Error('GitHub GraphQL returned no user — check PROFILE_USER');
  return data.user;
};

async function gql(token, query, variables, pick = pickUser, attempt = 1) {
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
    return gql(token, query, variables, pick, attempt + 1);
  }
  if (!res.ok) throw new Error(`GitHub GraphQL HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(`GitHub GraphQL errors: ${json.errors.map((e) => e.message).join('; ')}`);
  return pick(json.data);
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

  const merged = await gql(token, MERGED_PRS_QUERY, { q: `author:${login} is:pr is:merged is:public` }, (data) => data.search);
  const history = await fetchHistory(token, login, user.createdAt);

  return {
    allTime: {
      commits: history.commits,
      reviews: history.reviews,
      pullRequests: user.pullRequests.totalCount,
      issues: user.issues.totalCount,
      languages: langBytes.size,
    },
    rhythm: rhythm(days),
    login: user.login,
    name: user.name,
    createdAt: user.createdAt,
    followers: user.followers.totalCount,
    publicRepos: user.publicRepos.totalCount,
    prsMerged: merged.issueCount,
    repoCount: repos.length,
    stars,
    contributedTo: user.repositoriesContributedTo.totalCount,
    totalContributions: cc.contributionCalendar.totalContributions,
    commits: cc.totalCommitContributions,
    prs: cc.totalPullRequestContributions,
    issues: cc.totalIssueContributions,
    restricted: cc.restrictedContributionsCount,
    days, // [{ date: 'YYYY-MM-DD', contributionCount }]
    streak: streaks(history.all),
    allDays: history.all, // [{ date, count }] since the account was created
    languages: [...langBytes.entries()].map(([name, v]) => ({ name, bytes: v.bytes, color: v.color })),
  };
}
