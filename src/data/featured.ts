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
  file: string;
  line: number;
  problem: string;
  fix: string;
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
      'A Roslyn analyser for expensive EF Core query shapes. It catches N+1 queries, client-side evaluation and early materialisation while the code is still in the editor.',
    primary: { label: 'Install package', href: 'https://www.nuget.org/packages/LinqContraband' },
    packageId: 'LinqContraband',
    proof: {
      diagnostic: 'LINQ001',
      file: 'OrdersQuery.cs',
      line: 42,
      problem: 'Materialising before filtering pulls the whole table into memory.',
      fix: 'Move materialisation after the predicate',
      before: ['db.Orders', '  .ToList()', '  .Where(o => o.Total > 1_000)'],
      after: ['db.Orders', '  .Where(o => o.Total > 1_000)', '  .ToList()'],
      result: 'The database does the filtering. The editor flags the expensive shape before review.',
    },
  },
  {
    name: 'DependencyInjection.Lifetime.Analyzers',
    kicker: 'Compile-time safety · DI',
    title: 'DI Lifetime Analysers',
    blurb:
      'A Roslyn analyser for captive dependencies, leaked scopes and lifetime mismatches. It checks the container graph at compile time and adds no runtime code.',
    primary: {
      label: 'Install package',
      href: 'https://www.nuget.org/packages/DependencyInjection.Lifetime.Analyzers',
    },
    packageId: 'DependencyInjection.Lifetime.Analyzers',
    proof: {
      diagnostic: 'DILIFETIME001',
      file: 'ServiceRegistration.cs',
      line: 18,
      problem: 'A singleton captures a scoped dependency and quietly extends its lifetime.',
      fix: 'Align the consumer with the scoped dependency',
      before: ['AddSingleton<ReportService>()', 'AddScoped<AppDbContext>()'],
      after: ['AddScoped<ReportService>()', 'AddScoped<AppDbContext>()'],
      result: 'The lifetime mismatch is flagged in the editor before it reaches production.',
    },
  },
  {
    name: 'CancelCop.Analyzer',
    kicker: 'Compile-time safety · async',
    title: 'CancelCop',
    blurb:
      'Checks that CancellationToken is passed through handlers, EF Core, HTTP and Minimal APIs. The code fixes wire a missing token into the call.',
    primary: {
      label: 'Install package',
      href: 'https://www.nuget.org/packages/CancelCop.Analyzer',
    },
    packageId: 'CancelCop.Analyzer',
    proof: {
      diagnostic: 'CANCEL001',
      file: 'OrderHandler.cs',
      line: 27,
      problem: 'A cancellation token reaches the handler, then disappears at the database call.',
      fix: 'Propagate the existing token into the call',
      before: ['Task Handle(CancellationToken ct)', '  => db.SaveChangesAsync();'],
      after: ['Task Handle(CancellationToken ct)', '  => db.SaveChangesAsync(ct);'],
      result: 'The code fix passes the token through the call chain.',
    },
  },
  {
    name: 'automapper-analyser',
    kicker: 'Compile-time safety · mapping',
    title: 'AutoMapper Analyser',
    blurb:
      'Checks AutoMapper profiles for missing and misconfigured maps at build time.',
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
      'Moves a .NET solution to Central Package Management. It checks dependency health, verifies restore equivalence and bisects package updates that fail tests.',
    primary: { label: 'Install tool', href: 'https://www.nuget.org/packages/CPMigrate' },
    packageId: 'CPMigrate',
  },
  {
    name: 'NotifyGen',
    kicker: 'Source generation · MVVM',
    title: 'NotifyGen',
    blurb:
      'A source generator for INotifyPropertyChanged. Add [Notify] to a field and it generates the property and change notification code at compile time.',
    primary: { label: 'Install package', href: 'https://www.nuget.org/packages/NotifyGen' },
    packageId: 'NotifyGen',
  },
];

/**
 * Secondary highlights: architecture, desktop,
 * config correctness. Shown in a tighter grid below the lead stories.
 */
export const SECONDARY: Featured[] = [
  {
    name: 'ConfigContraband',
    kicker: 'Compile-time safety · config',
    title: 'ConfigContraband',
    blurb:
      'Checks .NET Options registrations and appsettings files for missing sections, invalid values and binding mistakes before deployment.',
    primary: { label: 'Install package', href: 'https://www.nuget.org/packages/ConfigContraband' },
    packageId: 'ConfigContraband',
  },
  {
    name: 'HttpClient.Resilience.Analyzers',
    kicker: 'Compile-time safety · HTTP',
    title: 'HttpClient Resilience Analysers',
    blurb:
      'Checks HttpClient registrations and resilience policies for unsafe retries, lifetime mistakes, missing cancellation and response disposal bugs.',
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
      'A .NET reference application using CQRS, MediatR, DDD and the transactional outbox pattern.',
  },
  {
    name: 'AOEOverlay',
    kicker: 'Desktop · React + Tauri',
    title: 'AOE Overlay',
    blurb:
      'A Tauri and TypeScript desktop overlay for Age of Empires IV build orders, with imports, hotkeys and voice coaching.',
  },
  {
    name: 'DuplicatePhotoHandler',
    kicker: 'Desktop · Rust + React',
    title: 'Duplicate Photo Handler',
    blurb:
      'A Rust, Tauri and React desktop app that hashes photo libraries and groups duplicate files.',
  },
];

/** Names that get the headline treatment, in case the archive wants to flag them. */
export const FEATURED_NAMES: Set<string> = new Set([...FEATURED, ...SECONDARY].map((f) => f.name));
