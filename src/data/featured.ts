/**
 * Editorial layer over the raw GitHub data.
 *
 * GitHub descriptions are terse and SEO-shaped. The portfolio wants a point of
 * view. Each featured entry below is matched to a live repo by `name`; the
 * human-written `kicker`/`title`/`blurb` lead, and live stars/topics/links from
 * GitHub fill in around them. Order here is the order on the page.
 */

export interface Featured {
  /** Must match a GitHub repo `name` exactly. */
  name: string;
  /** Small over-line category, set in mono. */
  kicker: string;
  /** Display title (overrides the repo name). */
  title: string;
  /** 1–2 sentence editorial blurb. */
  blurb: string;
  /** Optional: a non-GitHub primary link label, if the repo has a homepage. */
  cta?: string;
}

export const FEATURED: Featured[] = [
  {
    name: 'LinqContraband',
    kicker: 'Compile-time safety · EF Core',
    title: 'LinqContraband',
    blurb:
      'A Roslyn analyzer that reads your LINQ the way the database will — and refuses to let N+1 queries and client-side evaluation reach production. The expensive mistakes get caught at the red squiggle, not in the incident channel.',
    cta: 'NuGet',
  },
  {
    name: 'DependencyInjection.Lifetime.Analyzers',
    kicker: 'Compile-time safety · DI',
    title: 'DI Lifetime Analyzers',
    blurb:
      'Captive dependencies, leaked scopes, lifetime mismatches — the bugs that survive every unit test and surface at 3am under load. This catches them while you type, with zero runtime overhead.',
    cta: 'NuGet',
  },
  {
    name: 'CancelCop.Analyzer',
    kicker: 'Compile-time safety · async',
    title: 'CancelCop',
    blurb:
      'A surgical analyzer for CancellationToken propagation across handlers, EF Core, HTTP and Minimal APIs. Cooperative cancellation, enforced — with code fixes that wire the token for you.',
    cta: 'NuGet',
  },
  {
    name: 'automapper-analyser',
    kicker: 'Compile-time safety · mapping',
    title: 'AutoMapper Analyzer',
    blurb:
      "AutoMapper’s convenience hides its sharpest edge: the mapping you forgot. This flags missing and misconfigured maps at build, turning a whole class of runtime exceptions into a wavy underline.",
  },
  {
    name: 'CPMigrate',
    kicker: 'Developer tooling · CLI',
    title: 'CPMigrate',
    blurb:
      'Move an entire .NET solution onto Central Package Management without the manual diff archaeology. It analyses dependency health, migrates safely, and rolls back when reality disagrees.',
    cta: 'Live',
  },
  {
    name: 'NotifyGen',
    kicker: 'Source generation · MVVM',
    title: 'NotifyGen',
    blurb:
      'Add [Notify], delete the boilerplate. A source generator that turns fields into INotifyPropertyChanged-aware properties at compile time — MVVM without the ceremony, and zero runtime cost.',
  },
];

/**
 * Secondary highlights — range beyond the analyzer beat: architecture, desktop,
 * config correctness. Shown in a tighter grid below the lead stories.
 */
export const SECONDARY: Featured[] = [
  {
    name: 'ConfigContraband',
    kicker: 'Compile-time safety · config',
    title: 'ConfigContraband',
    blurb:
      'Broken appsettings shouldn’t be a deploy-time surprise. Analyzers for the .NET Options pattern that catch misbound configuration before it ships.',
  },
  {
    name: 'CQRSPrototype',
    kicker: 'Reference architecture',
    title: 'CQRS Prototype',
    blurb:
      'A clean-architecture CQRS reference: MediatR, DDD, transactional outbox — the patterns that keep enterprise .NET honest and testable.',
  },
  {
    name: 'AOEOverlay',
    kicker: 'Desktop · React + Tauri',
    title: 'AOE Overlay',
    blurb:
      'A Tauri + TypeScript desktop overlay — native-weight, web-built — for live match data in Age of Empires IV.',
  },
];

/** Names that get the headline treatment, in case the archive wants to flag them. */
export const FEATURED_NAMES: Set<string> = new Set(
  [...FEATURED, ...SECONDARY].map((f) => f.name),
);
