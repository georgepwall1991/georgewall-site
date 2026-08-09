/**
 * Editorial layer over the raw GitHub data.
 *
 * GitHub descriptions are terse and SEO-shaped. The portfolio wants a point of
 * view. Each featured entry below is matched to a live repo by `name`; the
 * human-written `kicker`/`title`/`blurb` lead, and live stars/topics/links from
 * GitHub fill in around them. Order here is the order on the page.
 */

import type { PackageId } from './nuget';

export interface ProjectProof {
  diagnostic: string;
  problem: string;
  before: string[];
  after: string[];
  result: string;
}

export interface Featured {
  /** Must match a GitHub repo `name` exactly. */
  name: string;
  /** Small over-line category, set in mono. */
  kicker: string;
  /** Display title (overrides the repo name). */
  title: string;
  /** 1–2 sentence editorial blurb. */
  blurb: string;
  /** Explicit destination: repository homepage metadata is not trusted as UX copy. */
  primary?: { label: string; href: string };
  /** NuGet package used for live adoption/version proof. */
  packageId?: PackageId;
  /** Evidence panel for flagship work. */
  proof?: ProjectProof;
}

export const FEATURED: Featured[] = [
  {
    name: 'LinqContraband',
    kicker: 'Compile-time safety · EF Core',
    title: 'LinqContraband',
    blurb:
      'A Roslyn analyser that reads your LINQ the way the database will. N+1 queries and client-side evaluation get caught in the editor, not after a slow page has annoyed everyone.',
    primary: { label: 'Install package', href: 'https://www.nuget.org/packages/LinqContraband' },
    packageId: 'LinqContraband',
    proof: {
      diagnostic: 'LINQ001',
      problem: 'Materialising before filtering pulls the whole table into memory.',
      before: ['db.Orders', '  .ToList()', '  .Where(o => o.Total > 1_000)'],
      after: ['db.Orders', '  .Where(o => o.Total > 1_000)', '  .ToList()'],
      result: 'The database filters; the editor catches the expensive shape before review.',
    },
  },
  {
    name: 'DependencyInjection.Lifetime.Analyzers',
    kicker: 'Compile-time safety · DI',
    title: 'DI Lifetime Analyzers',
    blurb:
      'Captive dependencies, leaked scopes, lifetime mismatches: the bugs that look fine in tests and then embarrass you under load. This catches them while you type, with zero runtime overhead.',
    primary: {
      label: 'Install package',
      href: 'https://www.nuget.org/packages/DependencyInjection.Lifetime.Analyzers',
    },
    packageId: 'DependencyInjection.Lifetime.Analyzers',
    proof: {
      diagnostic: 'DILIFETIME001',
      problem: 'A singleton captures a scoped dependency and quietly extends its lifetime.',
      before: ['AddSingleton<ReportService>()', 'AddScoped<AppDbContext>()'],
      after: ['AddScoped<ReportService>()', 'AddScoped<AppDbContext>()'],
      result: 'The container graph becomes a compile-time contract instead of a runtime surprise.',
    },
  },
  {
    name: 'CancelCop.Analyzer',
    kicker: 'Compile-time safety · async',
    title: 'CancelCop',
    blurb:
      'A focused analyser for CancellationToken propagation across handlers, EF Core, HTTP and Minimal APIs. Cooperative cancellation, enforced, with code fixes that wire the token for you.',
    primary: {
      label: 'Install package',
      href: 'https://www.nuget.org/packages/CancelCop.Analyzer',
    },
    packageId: 'CancelCop.Analyzer',
    proof: {
      diagnostic: 'CANCEL001',
      problem: 'A cancellation token reaches the handler, then disappears at the database call.',
      before: ['Task Handle(CancellationToken ct)', '  => db.SaveChangesAsync();'],
      after: ['Task Handle(CancellationToken ct)', '  => db.SaveChangesAsync(ct);'],
      result: 'The code fix wires cooperative cancellation through the whole call chain.',
    },
  },
  {
    name: 'automapper-analyser',
    kicker: 'Compile-time safety · mapping',
    title: 'AutoMapper Analyser',
    blurb:
      'AutoMapper’s convenience hides its sharpest edge: the mapping you forgot. This flags missing and misconfigured maps at build, before they become a runtime shrug.',
    primary: {
      label: 'Install package',
      href: 'https://www.nuget.org/packages/AutoMapperAnalyzer.Analyzers',
    },
    packageId: 'AutoMapperAnalyzer.Analyzers',
  },
  {
    name: 'CPMigrate',
    kicker: 'Developer tooling · CLI',
    title: 'CPMigrate',
    blurb:
      'Move an entire .NET solution onto Central Package Management without doing diff archaeology by hand. It scores dependency health, proves restore equivalence, and bisects package updates so the working set stays instead of rolling everything back.',
    primary: { label: 'Install tool', href: 'https://www.nuget.org/packages/CPMigrate' },
    packageId: 'CPMigrate',
  },
  {
    name: 'NotifyGen',
    kicker: 'Source generation · MVVM',
    title: 'NotifyGen',
    blurb:
      'Add [Notify], delete the boilerplate. A source generator that turns fields into INotifyPropertyChanged-aware properties at compile time: MVVM with less ceremony and no runtime tax.',
    primary: { label: 'Install package', href: 'https://www.nuget.org/packages/NotifyGen' },
    packageId: 'NotifyGen',
  },
];

/**
 * Secondary highlights — range beyond the analyser beat: architecture, desktop,
 * config correctness. Shown in a tighter grid below the lead stories.
 */
export const SECONDARY: Featured[] = [
  {
    name: 'ConfigContraband',
    kicker: 'Compile-time safety · config',
    title: 'ConfigContraband',
    blurb:
      'Broken appsettings should not be a deploy-time surprise. Analysers for the .NET Options pattern that catch misbound configuration before it ships.',
    primary: { label: 'Install package', href: 'https://www.nuget.org/packages/ConfigContraband' },
    packageId: 'ConfigContraband',
  },
  {
    name: 'HttpClient.Resilience.Analyzers',
    kicker: 'Compile-time safety · HTTP',
    title: 'HttpClient Resilience Analysers',
    blurb:
      'Outbound HTTP failures are expensive and intermittent. These analysers catch unsafe retries, lifetime mistakes, dropped cancellation and response-ownership bugs while the code is still in the editor.',
    primary: {
      label: 'Install package',
      href: 'https://www.nuget.org/packages/HttpClient.Resilience.Analyzers',
    },
    packageId: 'HttpClient.Resilience.Analyzers',
  },
  {
    name: 'CQRSPrototype',
    kicker: 'Reference architecture',
    title: 'CQRS Prototype',
    blurb:
      'A clean-architecture CQRS reference: MediatR, DDD, transactional outbox. The patterns that keep enterprise .NET honest and testable.',
  },
  {
    name: 'AOEOverlay',
    kicker: 'Desktop · React + Tauri',
    title: 'AOE Overlay',
    blurb:
      'A Tauri + TypeScript desktop overlay for live Age of Empires IV match data: web-built, native-weight.',
  },
  {
    name: 'DuplicatePhotoHandler',
    kicker: 'Desktop · Rust + React',
    title: 'Duplicate Photo Handler',
    blurb:
      'A Rust + Tauri + React desktop app that hashes thousands of photos a second to clean up duplicate libraries: systems-language core, web UI on top.',
  },
];

/** Names that get the headline treatment, in case the archive wants to flag them. */
export const FEATURED_NAMES: Set<string> = new Set([...FEATURED, ...SECONDARY].map((f) => f.name));
