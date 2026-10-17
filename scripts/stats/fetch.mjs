// GitHub GraphQL data layer for the stats cards.
const ENDPOINT = 'https://api.github.com/graphql';

const PROFILE_QUERY = `
query($login:String!){
  user(login:$login){
    login
    name
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
    languages: [...langBytes.entries()].map(([name, v]) => ({ name, bytes: v.bytes, color: v.color })),
  };
}
