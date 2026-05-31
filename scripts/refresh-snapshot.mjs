/**
 * Refresh src/data/fallback.json from live GitHub. Optional housekeeping —
 * the site fetches live anyway, but a fresh snapshot keeps the no-JS / build
 * fallback current. Run with `npm run snapshot`.
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const USER = 'georgepwall1991';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'src', 'data', 'fallback.json');
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'georgewall-site' };

const profile = await (await fetch(`https://api.github.com/users/${USER}`, { headers })).json();
const repos = await (
  await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed&direction=desc`, {
    headers,
  })
).json();

if (!Array.isArray(repos)) {
  console.error('GitHub API error:', profile?.message ?? repos?.message ?? 'unknown');
  process.exit(1);
}

const snapshot = {
  generatedAt: new Date().toISOString(),
  user: {
    login: profile.login,
    name: profile.name,
    bio: profile.bio,
    location: profile.location,
    avatar_url: profile.avatar_url,
    html_url: profile.html_url,
    followers: profile.followers,
    public_repos: profile.public_repos,
  },
  repos: repos.map((r) => ({
    name: r.name,
    description: r.description,
    language: r.language,
    stars: r.stargazers_count,
    forks: r.forks_count,
    topics: r.topics ?? [],
    fork: r.fork,
    archived: r.archived,
    homepage: r.homepage || null,
    html_url: r.html_url,
    pushed_at: r.pushed_at,
  })),
};

await writeFile(out, JSON.stringify(snapshot, null, 2) + '\n');
console.log(`Wrote ${out} — ${snapshot.repos.length} repos.`);
