import { test } from 'node:test';
import assert from 'node:assert/strict';

import { isPortfolioRepo, sortForArchive, portfolioRepos, totalStars } from '../src/lib/repos.ts';
import { categoryOf, categoriesIn } from '../src/lib/categorize.ts';
import { pad2, relativeTime, languageColor, linkLabel, breakableName } from '../src/lib/format.ts';
import { NUGET_FALLBACK, totalNuGetDownloads } from '../src/data/nuget.ts';
import { PRIVATE_APPS, appScoreboard } from '../src/data/apps.ts';
import {
  COLLABS,
  collabLinkRel,
  collabSchemas,
  collabWebsiteSchema,
  isDofollowRel,
} from '../src/data/collabs.ts';

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
  assert.equal(totalNuGetDownloads(packages), 185447);
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
  assert.equal(board.live, 3);
  assert.equal(board.pending, 0);
});

test('COLLABS points at the live product sites with dofollow-safe rels', () => {
  assert.deepEqual(
    COLLABS.map((collab) => collab.href),
    ['https://influ.site', 'https://dansu.co.uk'],
  );
  assert.ok(COLLABS.every((collab) => collab.href.startsWith('https://')));
  assert.equal(collabLinkRel(), 'noopener');
  assert.equal(isDofollowRel(collabLinkRel()), true);
  assert.doesNotMatch(collabLinkRel(), /nofollow|sponsored|ugc/i);
  assert.match(COLLABS[0].anchor, /fashion intelligence/i);
  assert.match(COLLABS[1].anchor, /quick-dry towels/i);
  assert.equal(COLLABS[0].cta, 'Visit influ.site');
  assert.equal(COLLABS[1].cta, 'Visit dansu.co.uk');
});

test('collabWebsiteSchema marks George as a contributor, not sameAs', () => {
  const personId = 'https://www.georgewall.uk/#person';
  const influ = collabWebsiteSchema(COLLABS[0], personId);
  assert.equal(influ['@type'], 'WebSite');
  assert.equal(influ.name, 'INFLU');
  assert.equal(influ.alternateName, 'influ.site');
  assert.equal(influ.url, 'https://influ.site');
  assert.equal(influ['@id'], 'https://influ.site/#website');
  assert.deepEqual(influ.contributor, { '@id': personId });
  assert.equal('sameAs' in influ, false);

  const nodes = collabSchemas(personId);
  assert.equal(nodes.length, 2);
  assert.equal(nodes[1].url, 'https://dansu.co.uk');
  assert.equal(nodes[1]['@id'], 'https://dansu.co.uk/#website');
});

test('every app screenshot exists on disk and is ready for a store frame', async () => {
  const { existsSync } = await import('node:fs');
  const alts = new Set();
  for (const app of PRIVATE_APPS) {
    assert.ok(app.screenshots.length > 0, `${app.name} has no screenshots`);
    for (const shot of app.screenshots) {
      assert.ok(existsSync(new URL(`../public${shot.src}`, import.meta.url)), `missing ${shot.src}`);
      assert.ok(shot.width > 0 && shot.height > 0, `${shot.src} needs its real size`);
      assert.ok(shot.alt.length > 40, `${shot.src} alt text is too thin`);
      assert.ok(!alts.has(shot.alt), `${shot.src} repeats another shot's alt text`);
      alts.add(shot.alt);
      if (shot.kind === 'screen') {
        assert.ok(shot.headline, `${shot.src} is composed live and needs a headline`);
        // Raw captures must come from the status-bar-scrubbed set, or the
        // device frame draws 9:41 over the simulator's own clock.
        assert.ok(shot.src.startsWith('/apps/clean/'), `${shot.src} is not a cleaned capture`);
      }
    }
  }
});

test('every app screenshot declares its real pixel size', async () => {
  const { default: sharp } = await import('sharp');
  for (const app of PRIVATE_APPS) {
    for (const shot of app.screenshots) {
      const meta = await sharp(new URL(`../public${shot.src}`, import.meta.url).pathname).metadata();
      assert.deepEqual([shot.width, shot.height], [meta.width, meta.height], `${shot.src} size is stale`);
    }
  }
});

test('breakableName wraps repo names at dots and escapes HTML', () => {
  assert.equal(breakableName('HttpClient.Resilience.Analyzers'), 'HttpClient.<wbr>Resilience.<wbr>Analyzers');
  assert.equal(breakableName('georgewall-site'), 'georgewall-site');
  assert.equal(breakableName('a<b>.'), 'a&lt;b&gt;.');
});
