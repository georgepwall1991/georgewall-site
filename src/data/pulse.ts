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
      "The LC045 fixer corpus is complete, so more unsafe query shapes now move from a warning to a safe one-click repair.",
    href: "https://www.nuget.org/packages/LinqContraband",
    linkLabel: "NuGet",
  },
  {
    date: "09 Aug 2026",
    channel: "tooling",
    title: "DI Lifetime Analyzers",
    version: "v3.7.4 live",
    summary:
      "Mixed event-subscriber lifetimes stay visible instead of collapsing into a false safe result; the next patch is already on main.",
    href: "https://www.nuget.org/packages/DependencyInjection.Lifetime.Analyzers",
    linkLabel: "NuGet",
  },
  {
    date: "09 Aug 2026",
    channel: "tooling",
    title: "CPMigrate",
    version: "v3.56.0",
    summary:
      "Migration verification now proves the restored dependency graph stays equivalent, with filesystem-aware path identity checks.",
    href: "https://georgepwall1991.github.io/CPMigrate/",
    linkLabel: "Product site",
  },
  {
    date: "09 Aug 2026",
    channel: "tooling",
    title: "NotifyGen",
    version: "v1.9.0",
    summary:
      "Typed post-change hooks and target-side dependencies extend generated MVVM behaviour without adding reflection or runtime weight.",
    href: "https://www.nuget.org/packages/NotifyGen",
    linkLabel: "NuGet",
  },
  {
    date: "09 Aug 2026",
    channel: "product",
    title: "Fleet Commander",
    version: "151 playability passes",
    summary:
      "Post-launch main now carries documented passes across onboarding, battle clarity, Dynamic Type, VoiceOver and return flow.",
    href: "https://apps.apple.com/gb/app/fleet-commander/id6760207805",
    linkLabel: "App Store",
  },
  {
    date: "30 Jul 2026",
    channel: "product",
    title: "NoBooze",
    version: "v1.6.1 · shipped",
    summary:
      "The sobriety companion is live on the App Store, with a richer progress dashboard, journal and evidence-led accessibility pass.",
    href: "https://apps.apple.com/gb/app/nobooze/id6755612993",
    linkLabel: "App Store",
  },
  {
    date: "30 Jul 2026",
    channel: "product",
    title: "GemGame",
    version: "v2.1.6",
    summary:
      "Persistent records, milestones, reminder controls and a weekly relic rotation give the live game a stronger long-term loop.",
    href: "https://apps.apple.com/gb/app/gemgame-cosy-match-3-puzzle/id6761720994",
    linkLabel: "App Store",
  },
];
