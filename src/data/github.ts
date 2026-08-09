/**
 * Build-time GitHub data access.
 *
 * Strategy: at build we try the public GitHub REST API (no token, no backend).
 * If that fails because of a rate limit, offline CI or an outage, we fall back to a
 * committed snapshot so the build is deterministic and never breaks. The client
 * then re-fetches live on the visitor's own IP to keep stars/dates warm.
 *
 * Pure shaping logic lives in ../lib/repos (so it's unit-testable); this module
 * re-exports it for convenience alongside the types.
 */
import fallback from './fallback.json';
import type { Profile, Repo, Snapshot } from './types';
import { GITHUB_USER } from '../lib/repos';

export type { Repo, Profile, Snapshot } from './types';
export {
  GITHUB_USER,
  META_REPOS,
  isPortfolioRepo,
  sortForArchive,
  portfolioRepos,
  totalStars,
} from '../lib/repos';

/** The committed snapshot, typed. Always available, always valid. */
export const snapshotFallback = fallback as Snapshot;

/** Map a raw GitHub API user object to our Profile shape. */
function mapApiProfile(p: any): Profile {
  return {
    login: p.login,
    name: p.name,
    bio: p.bio,
    location: p.location,
    avatar_url: p.avatar_url,
    html_url: p.html_url,
    followers: p.followers,
    public_repos: p.public_repos,
  };
}

/** Map a raw GitHub API repo object to our Repo shape. */
function mapApiRepo(r: any): Repo {
  return {
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
  };
}

async function fetchLive(timeoutMs = 6000): Promise<Snapshot> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'georgewall-site-build',
  };
  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers, signal: controller.signal }),
      fetch(
        `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed&direction=desc`,
        { headers, signal: controller.signal },
      ),
    ]);
    if (!profileRes.ok || !reposRes.ok) throw new Error('GitHub API non-200');
    const profile = await profileRes.json();
    const repos = await reposRes.json();
    if (!Array.isArray(repos)) throw new Error('Unexpected repos payload');

    return {
      generatedAt: new Date().toISOString(),
      user: mapApiProfile(profile),
      repos: repos.map(mapApiRepo),
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Build-time data. Tries live, falls back to the snapshot. Never throws:
 * a portfolio that won't build because GitHub hiccuped is a bad portfolio.
 */
async function loadSnapshot(): Promise<Snapshot> {
  try {
    const live = await fetchLive();
    if (live.repos.length >= 3) return live;
    return snapshotFallback;
  } catch {
    return snapshotFallback;
  }
}

let buildSnapshot: Promise<Snapshot> | undefined;

/** Reuse one coherent GitHub snapshot across every route in a static build. */
export function getSnapshot(): Promise<Snapshot> {
  buildSnapshot ??= loadSnapshot();
  return buildSnapshot;
}
