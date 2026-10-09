export interface PrivateApp {
  name: string;
  title: string;
  kicker: string;
  status: string;
  release?: string;
  category: "game" | "health";
  theme: "gem" | "fleet" | "wellness" | "transit" | "lumina";
  featured?: boolean;
  blurb: string;
  stack: string[];
  siteUrl?: string;
  url?: string;
  cta?: string;
  links?: {
    label: string;
    url: string;
  }[];
  /** Square app icon, shown beside the title. */
  icon?: string;
  /** Full-bleed artwork behind the device stack. */
  backdrop?: string;
  screenshots: {
    src: string;
    alt: string;
    caption?: string;
  }[];
}

/** The one status string that means "you can download this today". */
export const LIVE_STATUS = "App Store";

export interface AppScoreboard {
  live: number;
  pending: number;
  /** Reads off the pending apps themselves, so shipping one needs no copy edit. */
  pendingLabel: string;
}

/**
 * Counts for the storefront scoreboard, derived from status rather than hand-
 * maintained. Apps marked `featured: false` live in the lab strip and are not
 * part of the tally. When several apps are pending under different statuses
 * there is no single honest label, so it falls back to a generic one.
 */
export function appScoreboard(apps: PrivateApp[]): AppScoreboard {
  const storefront = apps.filter((app) => app.featured !== false);
  const pending = storefront.filter((app) => app.status !== LIVE_STATUS);
  const statuses = new Set(pending.map((app) => app.status));

  return {
    live: storefront.length - pending.length,
    pending: pending.length,
    pendingLabel: statuses.size === 1 ? [...statuses][0] : "In build",
  };
}

export const PRIVATE_APPS: PrivateApp[] = [
  {
    name: "GemGame",
    title: "GemGame: Cosy Match 3 Puzzle",
    kicker: "iOS game · Match-3 puzzle",
    status: "App Store",
    release: "v2.1.6",
    category: "game",
    theme: "gem",
    blurb:
      "My cosy match-3 game. Five magical worlds, a garden to bring back to life, a daily star board and power gems that properly go off. No ads, and the core puzzles play offline.",
    stack: ["SpriteKit", "SwiftUI", "Game Center", "StoreKit 2"],
    siteUrl: "https://georgepwall1991.github.io/fleet-commander-site/gemgame/",
    url: "https://apps.apple.com/gb/app/gemgame-cosy-match-3-puzzle/id6761720994",
    cta: "App Store",
    links: [
      {
        label: "Game info",
        url: "https://georgepwall1991.github.io/fleet-commander-site/gemgame/",
      },
      {
        label: "FAQ",
        url: "https://georgepwall1991.github.io/fleet-commander-site/gemgame/faq/",
      },
      {
        label: "Support",
        url: "https://georgepwall1991.github.io/fleet-commander-site/gemgame/support/",
      },
      {
        label: "Privacy",
        url: "https://georgepwall1991.github.io/fleet-commander-site/gemgame/privacy/",
      },
      {
        label: "Terms",
        url: "https://georgepwall1991.github.io/fleet-commander-site/gemgame/terms/",
      },
    ],
    icon: "/apps/gemgame/icon.webp",
    screenshots: [
      {
        src: "/apps/gemgame/gameplay.webp",
        alt: "GemGame App Store screenshot: a rainbow combo clearing the jewel board, captioned Match gems. Make magic.",
        caption: "Match gems",
      },
      {
        src: "/apps/gemgame/garden.webp",
        alt: "GemGame App Store screenshot: restoring the magical garden with fountains and flower beds",
        caption: "Restore the garden",
      },
      {
        src: "/apps/gemgame/boss.webp",
        alt: "GemGame App Store screenshot: a guardian boss level above the jewel board",
        caption: "Outsmart the guardian",
      },
    ],
  },
  {
    name: "Fleet Commander",
    title: "Fleet Commander",
    kicker: "iOS game · Space roguelite",
    status: "App Store",
    release: "v1.0.5",
    category: "game",
    theme: "fleet",
    blurb:
      "A solo tactical space roguelite for iPhone and iPad. Read the frontier, pick a rule-breaker, then push on or bank it. The upcoming Frontier Runs update adds fleet builds, rival commanders and extraction.",
    stack: ["Swift", "Game Center", "StoreKit", "iOS 17+"],
    siteUrl: "https://georgepwall1991.github.io/fleet-commander-site/",
    url: "https://apps.apple.com/gb/app/fleet-commander/id6760207805",
    cta: "App Store",
    links: [
      {
        label: "Game info",
        url: "https://georgepwall1991.github.io/fleet-commander-site/",
      },
      {
        label: "Support",
        url: "https://georgepwall1991.github.io/fleet-commander-site/support/",
      },
      {
        label: "Privacy",
        url: "https://georgepwall1991.github.io/fleet-commander-site/privacy/",
      },
      {
        label: "Terms",
        url: "https://georgepwall1991.github.io/fleet-commander-site/terms/",
      },
    ],
    icon: "/apps/fleet-commander-icon.webp",
    backdrop: "/apps/fleet/nebula.webp",
    screenshots: [
      {
        src: "/apps/fleet/route.webp",
        alt: "Fleet Commander screenshot: reading the frontier route across the Orion Verge star map",
        caption: "Read the frontier",
      },
      {
        src: "/apps/fleet/tactics.webp",
        alt: "Fleet Commander screenshot: choosing one rule-breaker before a run",
        caption: "Choose a rule-breaker",
      },
      {
        src: "/apps/fleet/showdown.webp",
        alt: "Fleet Commander screenshot: a rival commander showdown with win odds for each tactic",
        caption: "Rival showdown",
      },
    ],
  },
  {
    name: "NoBooze",
    title: "NoBooze",
    kicker: "iOS app · Health and fitness",
    status: "App Store",
    release: "v1.6.1",
    category: "health",
    theme: "wellness",
    blurb:
      "A private sobriety companion built around streaks, health milestones, check-ins and journalling. A slip is handled with support rather than a lecture.",
    stack: ["SwiftUI", "Core Data", "HealthKit", "CloudKit"],
    siteUrl: "https://funny-boba-67508f.netlify.app/",
    url: "https://apps.apple.com/gb/app/nobooze/id6755612993",
    icon: "/apps/nobooze/icon.webp",
    backdrop: "/apps/nobooze/dusk.webp",
    cta: "App Store",
    links: [
      {
        label: "Product site",
        url: "https://funny-boba-67508f.netlify.app/",
      },
    ],
    screenshots: [
      {
        src: "/apps/nobooze-today.webp",
        alt: "NoBooze showing a 128-day alcohol-free streak, savings, achievements and daily support actions",
        caption: "Today · live product",
      },
      {
        src: "/apps/nobooze-journal.webp",
        alt: "NoBooze journal showing a private reflection prompt, searchable entries and mood context",
        caption: "Reflection-first journal",
      },
    ],
  },
  {
    name: "Lumina",
    title: "My Lumina",
    kicker: "TestFlight · Recovery companion",
    status: "TestFlight",
    release: "build 23",
    category: "health",
    theme: "lumina",
    featured: false,
    blurb:
      "A TestFlight recovery companion built around guided body scans, mood palettes and an on-device chat. Conversations stay on the phone; private progress can sync through the user’s own iCloud account.",
    stack: ["SwiftUI", "SwiftData", "Foundation Models", "CloudKit"],
    screenshots: [
      {
        src: "/apps/lumina-home.webp",
        alt: "My Lumina TestFlight home screen with a friendly yellow mascot, body scan and mood palette actions",
        caption: "Home · TestFlight build",
      },
    ],
  },
  {
    name: "TinyTransitJam",
    title: "Tiny Transit Jam",
    kicker: "Private iOS build · Puzzle",
    status: "Private build",
    release: "Playable build",
    category: "game",
    theme: "transit",
    featured: false,
    blurb:
      "A one-screen transit puzzle with generated levels, accessible gameplay actions and a heavily tested rules engine. Load matching passengers before the station locks itself solid.",
    stack: ["SwiftUI", "SpriteKit", "SwiftData", "Fastlane"],
    screenshots: [
      {
        src: "/apps/tiny-transit-home.webp",
        alt: "Tiny Transit Jam iPhone screenshot showing the level map and daily challenge card",
      },
      {
        src: "/apps/tiny-transit-game.webp",
        alt: "Tiny Transit Jam iPhone screenshot showing the onboarding puzzle board and booster tray",
      },
    ],
  },
];
