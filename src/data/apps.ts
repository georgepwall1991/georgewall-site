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
    kicker: "Shipped iOS game · Match-3",
    status: "App Store",
    release: "v2.1.6",
    category: "game",
    theme: "gem",
    blurb:
      "My match-3 game with ten galaxy worlds, power gems and no ad sludge. Version 2.1 tightened the boards, sharpened the artwork and made the specials feel properly explosive.",
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
    screenshots: [
      {
        src: "/apps/gemgame-gameplay.webp",
        alt: "GemGame App Store artwork showing a large cascade on the redesigned jewel board",
        caption: "Cascade system",
      },
      {
        src: "/apps/gemgame-specials.webp",
        alt: "GemGame App Store artwork showing striped, wrapped, seeker, and rainbow power gems",
        caption: "Power gems · v2.1",
      },
    ],
  },
  {
    name: "Fleet Commander",
    title: "Fleet Commander",
    kicker: "Shipped iOS game · Strategy",
    status: "App Store",
    release: "v1.0.5",
    category: "game",
    theme: "fleet",
    blurb:
      "A small space strategy game about expanding across a connected galaxy, researching upgrades and choosing the right tactical gambit. Built in Swift and shipped on the App Store.",
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
    screenshots: [
      {
        src: "/apps/fleet-commander-galaxy.webp",
        alt: "Fleet Commander App Store artwork showing the connected galaxy frontier map",
        caption: "Connected galaxy",
      },
      {
        src: "/apps/fleet-commander-battle.webp",
        alt: "Fleet Commander App Store artwork showing tactical gambits before a border battle",
        caption: "Tactical gambits",
      },
    ],
  },
  {
    name: "NoBooze",
    title: "NoBooze",
    kicker: "Shipped iOS product · Health & Fitness",
    status: "App Store",
    release: "v1.6.1",
    category: "health",
    theme: "wellness",
    blurb:
      "A private sobriety companion built around streaks, health milestones, check-ins and journalling. A slip is handled with support rather than a lecture.",
    stack: ["SwiftUI", "Core Data", "HealthKit", "CloudKit"],
    siteUrl: "https://funny-boba-67508f.netlify.app/",
    url: "https://apps.apple.com/gb/app/nobooze/id6755612993",
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
