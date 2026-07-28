import { test } from 'node:test';
import assert from 'node:assert/strict';

import { isPortfolioRepo, sortForArchive, portfolioRepos, totalStars } from '../src/lib/repos.ts';
import { categoryOf, categoriesIn } from '../src/lib/categorize.ts';
import { pad2, relativeTime, languageColor, linkLabel } from '../src/lib/format.ts';
import { NUGET_FALLBACK, totalNuGetDownloads } from '../src/data/nuget.ts';
import { PRIVATE_APPS, appScoreboard } from '../src/data/apps.ts';

/** Build a Repo with sensible defaults; override what a test cares about. */
function repo(overrides = {}) {
  return {
    name: 'sample',
    description: 'a repo',
    language: 'C#',
    stars: 0,
    forks: 0,
    topics: [],
    fork: false,
    archived: false,
    homepage: null,
    html_url: 'https://github.com/georgepwall1991/sample',
    pushed_at: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

test('isPortfolioRepo excludes forks, archived, and meta repos', () => {
  assert.equal(isPortfolioRepo(repo({ name: 'LinqContraband' })), true);
  assert.equal(isPortfolioRepo(repo({ fork: true })), false);
  assert.equal(isPortfolioRepo(repo({ archived: true })), false);
  assert.equal(isPortfolioRepo(repo({ name: 'georgepwall1991' })), false);
  assert.equal(isPortfolioRepo(repo({ name: 'homebrew-cpmigrate' })), false);
});

test('sortForArchive orders by stars desc, then most recent push', () => {
  const a = repo({ name: 'a', stars: 9, pushed_at: '2026-01-01T00:00:00Z' });
  const b = repo({ name: 'b', stars: 9, pushed_at: '2026-05-01T00:00:00Z' });
  const c = repo({ name: 'c', stars: 4, pushed_at: '2026-06-01T00:00:00Z' });
  const sorted = sortForArchive([a, c, b]).map((r) => r.name);
  assert.deepEqual(sorted, ['b', 'a', 'c']);
});

test('sortForArchive does not mutate its input', () => {
  const input = [repo({ name: 'x', stars: 1 }), repo({ name: 'y', stars: 5 })];
  const snapshot = input.map((r) => r.name);
  sortForArchive(input);
  assert.deepEqual(
    input.map((r) => r.name),
    snapshot,
  );
});

test('portfolioRepos filters then sorts', () => {
  const repos = [
    repo({ name: 'fork', fork: true, stars: 100 }),
    repo({ name: 'georgepwall1991', stars: 100 }),
    repo({ name: 'real-low', stars: 1 }),
    repo({ name: 'real-high', stars: 9 }),
  ];
  const out = portfolioRepos(repos).map((r) => r.name);
  assert.deepEqual(out, ['real-high', 'real-low']);
});

test('totalStars sums stars', () => {
  assert.equal(totalStars([repo({ stars: 9 }), repo({ stars: 4 }), repo({ stars: 0 })]), 13);
  assert.equal(totalStars([]), 0);
});

test('categoryOf classifies by topics, name and language', () => {
  assert.equal(
    categoryOf(repo({ name: 'LinqContraband', topics: ['roslyn-analyzer'] })),
    'Analysers',
  );
  assert.equal(categoryOf(repo({ name: 'CancelCop.Analyzer', topics: [] })), 'Analysers');
  assert.equal(
    categoryOf(repo({ name: 'NotifyGen', topics: ['source-generators'] })),
    'Source gen',
  );
  assert.equal(categoryOf(repo({ name: 'CPMigrate', topics: ['cli', 'dotnet-tool'] })), 'Tooling');
  assert.equal(categoryOf(repo({ name: 'AOEOverlay', language: 'TypeScript', topics: [] })), 'Web');
  assert.equal(
    categoryOf(repo({ name: 'AspireMicroservices', language: 'C#', topics: [] })),
    'Other',
  );
});

test('categoriesIn returns present categories in canonical order', () => {
  const repos = [
    repo({ name: 'AspireMicroservices', language: 'C#' }), // Other
    repo({ name: 'AOEOverlay', language: 'TypeScript' }), // Web
    repo({ name: 'LinqContraband', topics: ['roslyn-analyzer'] }), // Analysers
  ];
  assert.deepEqual(categoriesIn(repos), ['Analysers', 'Web', 'Other']);
});

test('pad2 zero-pads single digits', () => {
  assert.equal(pad2(1), '01');
  assert.equal(pad2(12), '12');
});

test('relativeTime is stable against an injected now', () => {
  const now = new Date('2026-05-31T00:00:00Z');
  assert.equal(relativeTime('2026-05-31T00:00:00Z', now), 'today');
  assert.match(relativeTime('2026-05-29T00:00:00Z', now), /day/);
  assert.match(relativeTime('2026-01-01T00:00:00Z', now), /month/);
});

test('languageColor falls back for unknown languages', () => {
  assert.equal(languageColor('C#'), '#9b6dd6');
  assert.equal(languageColor('TypeScript'), '#3178c6');
  assert.equal(languageColor(null), 'var(--ink-faint)');
  assert.equal(languageColor('Brainfuck'), 'var(--ink-faint)');
});

test('linkLabel maps known hosts to friendly labels', () => {
  assert.equal(linkLabel('https://www.nuget.org/packages/LinqContraband'), 'NuGet');
  assert.equal(linkLabel('https://github.com/georgepwall1991/x'), 'GitHub');
  assert.equal(linkLabel('https://georgepwall1991.github.io/CPMigrate/'), 'Live');
});

test('NuGet fallback exposes credible adoption totals when the API is unavailable', () => {
  const packages = Object.values(NUGET_FALLBACK);
  assert.equal(packages.length, 9);
  assert.equal(totalNuGetDownloads(packages), 159521);
  assert.ok(
    packages.every((pkg) => pkg.version && pkg.url.startsWith('https://www.nuget.org/packages/')),
  );
});

/** Build a PrivateApp with only the fields the scoreboard reads. */
function app(overrides = {}) {
  return { name: 'sample', status: 'App Store', ...overrides };
}

test('appScoreboard derives live and pending counts from app status', () => {
  const board = appScoreboard([
    app({ status: 'App Store' }),
    app({ status: 'App Store' }),
    app({ status: 'In review' }),
  ]);
  assert.equal(board.live, 2);
  assert.equal(board.pending, 1);
  assert.equal(board.pendingLabel, 'In review');
});

test('appScoreboard ignores apps excluded from the storefront', () => {
  const board = appScoreboard([
    app({ status: 'App Store' }),
    app({ status: 'Private build', featured: false }),
  ]);
  assert.equal(board.live, 1);
  assert.equal(board.pending, 0);
});

test('appScoreboard falls back to a generic label when pending statuses differ', () => {
  const board = appScoreboard([
    app({ status: 'In review' }),
    app({ status: 'Coming next' }),
  ]);
  assert.equal(board.pending, 2);
  assert.equal(board.pendingLabel, 'In build');
});

test('appScoreboard reports nothing pending once everything has shipped', () => {
  const board = appScoreboard([app(), app(), app()]);
  assert.equal(board.live, 3);
  assert.equal(board.pending, 0);
});

test('appScoreboard matches the real showcase data', () => {
  const board = appScoreboard(PRIVATE_APPS);
  assert.equal(board.live, 2);
  assert.equal(board.pending, 1);
  assert.equal(board.pendingLabel, 'In review');
});
