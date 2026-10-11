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
  /** Store gallery in order. The first three make the showcase fan (the
   *  first is the hero); the rest still feed the screen wall and the schema. */
  screenshots: AppShot[];
}

export interface AppShot {
  src: string;
  alt: string;
  width: number;
  height: number;
  /**
   * "poster": finished store art with its own headline, shown as is.
   * "screen": a raw capture from public/apps/clean/, composed on the page into
   * a marketing frame with `headline` as real, indexable text.
   */
  kind: "poster" | "screen";
  /** Short label: the eyebrow on a composed frame, the caption on a poster. */
  caption: string;
  headline?: string;
  /** Status bar glyph colour for screens. */
  ink?: "light" | "dark";
}

/** Raw iPhone capture at the size the clean pipeline writes. */
const screen = (
  file: string,
  size: [number, number],
  caption: string,
  headline: string,
  alt: string,
  ink: "light" | "dark" = "light",
): AppShot => ({
  src: `/apps/clean/${file}`,
  width: size[0],
  height: size[1],
  kind: "screen",
  caption,
  headline,
  alt,
  ink,
});

const poster = (src: string, caption: string, alt: string): AppShot => ({
  src,
  width: 600,
  height: 1300,
  kind: "poster",
  caption,
  alt,
});

const FLEET: [number, number] = [600, 1305];

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
      poster(
        "/apps/gemgame/gameplay.webp",
        "Match gems",
        "GemGame match-3 gameplay: a rainbow combo blasts across the jewel board under the headline Match gems. Make magic.",
      ),
      poster(
        "/apps/gemgame/garden.webp",
        "Restore the garden",
        "GemGame garden restoration: fountains, rose beds and a bench brought back to life, headlined Bring your garden to life.",
      ),
      poster(
        "/apps/gemgame/boss.webp",
        "Outsmart the guardian",
        "GemGame boss level: a golden guardian looms over the jewel board with its health bar, headlined Outsmart the guardian.",
      ),
      poster(
        "/apps/gemgame/daily-star.webp",
        "Daily Star",
        "GemGame Daily Star puzzle: a fresh daily jewel board with a points goal and 18 moves, headlined Your daily moment of magic.",
      ),
      poster(
        "/apps/gemgame/specials.webp",
        "Jewel Lab",
        "GemGame Jewel Lab practice board for striped and wrapped special gems, headlined Discover your next great move.",
      ),
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
      screen(
        "fleet-route.webp",
        FLEET,
        "Read the frontier",
        "Chart your run across the stars.",
        "Fleet Commander star map of the Orion Verge sector, with the next jump's objective, danger and reward laid out before you commit",
      ),
      screen(
        "fleet-build.webp",
        FLEET,
        "Rule-breakers",
        "Pick one rule. Then break it.",
        "Fleet Commander command module offering rule-breaker upgrades such as Redline Coils and Overkill Protocol for the active fleet",
      ),
      screen(
        "fleet-showdown.webp",
        FLEET,
        "Rival showdown",
        "Outplay rival commanders.",
        "Fleet Commander rival showdown against Veyra, showing her intended Flank and the win odds for Blitz, Flank and Fortify",
      ),
      screen(
        "fleet-tactics.webp",
        FLEET,
        "Read the intent",
        "See their move. Counter it.",
        "Fleet Commander capture operation: the enemy intends Fortify and a captain's wager raises the stakes on each tactic",
      ),
      screen(
        "fleet-extraction.webp",
        FLEET,
        "Push or bank",
        "Push your luck, or bank the loot.",
        "Fleet Commander momentum choice between extracting with 111 salvage banked or pushing on for a bigger multiplier",
      ),
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
        ...poster(
          "/apps/nobooze-dashboard.webp",
          "Count every day",
          "NoBooze home screen on an iPhone showing a 128-day alcohol-free streak and milestones, headlined Count every day you choose.",
        ),
        width: 760,
        height: 1651,
      },
      screen(
        "nobooze-today.webp",
        [644, 1400],
        "Today",
        "Every alcohol-free day, counted.",
        "NoBooze Today screen with a 128-day alcohol-free streak, £731 saved, 256 units skipped and a progress bar to day 180",
        "dark",
      ),
      screen(
        "nobooze-journal.webp",
        [437, 950],
        "Journal",
        "Write it out. Privately.",
        "NoBooze private journal with a reflection prompt, searchable entries and a mood-tagged daily check-in",
      ),
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
      screen(
        "lumina-home.webp",
        [760, 1652],
        "Body scan · Mood palette",
        "A gentle check-in, on your phone.",
        "My Lumina home screen with a friendly yellow mascot and actions for a guided body scan and a mood palette",
        "dark",
      ),
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
      screen(
        "tiny-transit-home.webp",
        [920, 1994],
        "Daily puzzle",
        "Untangle the rush hour.",
        "Tiny Transit Jam level map with stops from Suburb Stop to Riverside Ferry, daily rewards and a Today's Challenge card",
        "dark",
      ),
    ],
  },
];
