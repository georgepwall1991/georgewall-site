export interface PulseEntry {
  date: string;
  channel: "product" | "tooling";
  title: string;
  version: string;
  summary: string;
  href: string;
  linkLabel: string;
}

/**
 * A dated editorial snapshot of meaningful movement across public releases and
 * private product work. This is deliberately curated: a commit feed measures
 * activity, while this list explains what changed for the person using it.
 */
export const PULSE: PulseEntry[] = [
  {
    date: "09 Aug 2026",
    channel: "tooling",
    title: "LinqContraband",
    version: "v5.7.52",
    summary:
      "Finished the LC045 fix cases. More unsafe query shapes now come with a safe one-click fix.",
    href: "https://www.nuget.org/packages/LinqContraband",
    linkLabel: "NuGet",
  },
  {
    date: "09 Aug 2026",
    channel: "tooling",
    title: "DI Lifetime Analysers",
    version: "v3.7.4 live",
    summary:
      "Fixed mixed event-subscriber lifetimes being reported as safe. The follow-up patch is already on main.",
    href: "https://www.nuget.org/packages/DependencyInjection.Lifetime.Analyzers",
    linkLabel: "NuGet",
  },
  {
    date: "09 Aug 2026",
    channel: "tooling",
    title: "CPMigrate",
    version: "v3.56.0",
    summary:
      "CPMigrate now checks that the restored dependency graph is equivalent after migration, including filesystem-aware path checks.",
    href: "https://georgepwall1991.github.io/CPMigrate/",
    linkLabel: "Product site",
  },
  {
    date: "09 Aug 2026",
    channel: "tooling",
    title: "NotifyGen",
    version: "v1.9.0",
    summary:
      "Added typed post-change hooks and target-side dependencies. It is still generated at compile time, with no reflection.",
    href: "https://www.nuget.org/packages/NotifyGen",
    linkLabel: "NuGet",
  },
  {
    date: "09 Aug 2026",
    channel: "product",
    title: "Fleet Commander",
    version: "151 playability passes",
    summary:
      "I’ve made 151 post-launch playability passes, covering onboarding, battle clarity, Dynamic Type, VoiceOver and the return flow.",
    href: "https://apps.apple.com/gb/app/fleet-commander/id6760207805",
    linkLabel: "App Store",
  },
  {
    date: "30 Jul 2026",
    channel: "product",
    title: "NoBooze",
    version: "v1.6.1 · shipped",
    summary:
      "Shipped v1.6.1 with the new progress dashboard, journal updates and an accessibility pass.",
    href: "https://apps.apple.com/gb/app/nobooze/id6755612993",
    linkLabel: "App Store",
  },
  {
    date: "30 Jul 2026",
    channel: "product",
    title: "GemGame",
    version: "v2.1.6",
    summary:
      "Shipped persistent records, milestones, reminder controls and a weekly relic rotation in v2.1.6.",
    href: "https://apps.apple.com/gb/app/gemgame-cosy-match-3-puzzle/id6761720994",
    linkLabel: "App Store",
  },
];
