/**
 * Pure repo-shaping logic for filtering, sorting and aggregation. No I/O or JSON
 * imports, so it can be unit-tested in isolation with `node --test`.
 */
import type { Repo } from '../data/types';

export const GITHUB_USER = 'georgepwall1991';

/**
 * Repos that exist for housekeeping rather than showing off, such as profile READMEs,
 * support-page mirrors, package taps. Hidden from the portfolio by default.
 */
export const META_REPOS: ReadonlySet<string> = new Set([
  'georgepwall1991',
  'georgepwall1991.github.io',
  'georgewall-site',
  'fleet-commander-site',
  'homebrew-cpmigrate',
]);

/** A repo worth listing in the portfolio: yours, alive, not housekeeping. */
export function isPortfolioRepo(repo: Repo): boolean {
  return !repo.fork && !repo.archived && !META_REPOS.has(repo.name);
}

/** Archive ordering: most stars first, then most-recently pushed. */
export function sortForArchive(repos: Repo[]): Repo[] {
  return [...repos].sort((a, b) => {
    if (b.stars !== a.stars) return b.stars - a.stars;
    return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
  });
}

export function portfolioRepos(repos: Repo[]): Repo[] {
  return sortForArchive(repos.filter(isPortfolioRepo));
}

/** Total stars across a set of repos. */
export function totalStars(repos: Repo[]): number {
  return repos.reduce((sum, r) => sum + r.stars, 0);
}
