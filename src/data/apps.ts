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

/** Finished store frame, imported at 760x1651 by `npm run shots`. */
const poster = (src: string, caption: string, alt: string): AppShot => ({
  src,
  width: 760,
  height: 1651,
  kind: "poster",
  caption,
  alt,
});

const FLEET: [number, number] = [760, 1652];

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
    release: "v2.5.2",
    category: "game",
    theme: "gem",
    blurb:
      "My cosy match-3 game. Five magical worlds, a garden to bring back to life, a daily star board, Relic Runs and power gems that properly go off. No ads, and the core puzzles play offline.",
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
        "/apps/gemgame/v252/01-combo.webp",
        "Match jewels",
        "GemGame cosy match-3 puzzle: a x3.5 Unreal cascade chain lights up the jewel board, headlined Match jewels. Chain cascades.",
      ),
      poster(
        "/apps/gemgame/v252/02-garden.webp",
        "Restore a living garden",
        "GemGame garden restoration: fountains, rose beds and a bench brought back to life with stars, headlined Restore a living garden.",
      ),
      poster(
        "/apps/gemgame/v252/03-guardian.webp",
        "Boss battles",
        "GemGame boss battle: the Cosmic Gatekeeper rises from the jewel board with its health bar, headlined Outwit the guardians.",
      ),
      poster(
        "/apps/gemgame/v252/04-worlds.webp",
        "Five enchanted worlds",
        "GemGame world map at Heart of the Void, one of five enchanted worlds with chapters to clear, headlined Awaken five worlds.",
      ),
      poster(
        "/apps/gemgame/v252/05-daily.webp",
        "Daily Star",
        "GemGame Daily Star complete, with today's best score, a three-day streak and a leaderboard, headlined A fresh puzzle every day.",
      ),
      poster(
        "/apps/gemgame/v252/06-specials.webp",
        "Special gems",
        "GemGame striped, wrapped, rainbow and comet gems firing across the board, headlined Blast with special gems.",
      ),
      poster(
        "/apps/gemgame/v252/07-relic.webp",
        "Relic Run",
        "GemGame Relic Run: drafting a relic such as Prism Lens or Comet Beacon before climbing five boards, headlined Draft relics. Climb five boards.",
      ),
      poster(
        "/apps/gemgame/v252/08-calm.webp",
        "Plays offline",
        "GemGame core puzzles with no countdown clock and lives that refill over time, headlined Unwind offline. No ads.",
      ),
      poster(
        "/apps/gemgame/v252/09-voiceover.webp",
        "Plays with VoiceOver",
        "GemGame with VoiceOver: a focused gem announced as Wrapped yellow gem in ice, headlined Every gem, clearly labelled.",
      ),
    ],
  },
  {
    name: "Fleet Commander",
    title: "Fleet Commander",
    kicker: "iOS game · Space roguelite",
    status: "App Store",
    release: "v1.2.1",
    category: "game",
    theme: "fleet",
    blurb:
      "A solo tactical space roguelite for iPhone and iPad. Each Frontier Run is a route through dangerous sectors: read the enemy's intent, build module combos, outplay rival commanders, then push deeper or extract with the salvage.",
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
        "fleet-121-route.webp",
        FLEET,
        "Read the route",
        "Choose your next risk.",
        "Fleet Commander Frontier Run route choice in The Cinder Reach: break the Dust Ambush or hold the Rescue Beacon, each with its danger and salvage",
      ),
      screen(
        "fleet-121-tactics.webp",
        FLEET,
        "Blitz, Flank or Fortify",
        "Outplay rival commanders.",
        "Fleet Commander escape operation: the enemy intends Fortify, with mission odds and fleet losses for Blitz, Flank and Fortify",
      ),
      screen(
        "fleet-121-build.webp",
        FLEET,
        "Modules and protocols",
        "Build a deadly combination.",
        "Fleet Commander rule-breaker choice between Wide Sweep, Deep Scanner and Phase Lance for the active fleet",
      ),
      screen(
        "fleet-121-extraction.webp",
        FLEET,
        "Push or bank",
        "Push deeper. Or extract.",
        "Fleet Commander push-or-bank choice at Glass Meridian: extract with 102 salvage banked or push on at a 1.60x multiplier",
      ),
      screen(
        "fleet-121-showdown.webp",
        FLEET,
        "Rival showdown",
        "Face the final showdown.",
        "Fleet Commander final showdown: choose between rival Commanders Veyra and Kestrel, each with a danger rating and salvage bounty",
      ),
      screen(
        "fleet-121-legacy.webp",
        FLEET,
        "Fleet history",
        "Bring your legacy home.",
        "Fleet Commander between runs: weaponising Fractured Plating from the command reserve for the fleet's next run",
      ),
      screen(
        "fleet-121-confrontation.webp",
        FLEET,
        "Command resolved",
        "Your fleet. Your last word.",
        "Fleet Commander battle result: command resolved and escape complete, with the wager passed and the rescue screen safe",
      ),
    ],
  },
  {
    name: "NoBooze",
    title: "NoBooze",
    kicker: "iOS app · Sober tracker",
    status: "App Store",
    release: "v1.9.0",
    category: "health",
    theme: "wellness",
    blurb:
      "A private sobriety companion. A day count that rises over the horizon, a free craving SOS with guided breathing, a plan for hard nights and a journal that stays on your device. A slip is handled with support rather than a lecture.",
    stack: ["SwiftUI", "Core Data", "HealthKit", "CloudKit"],
    siteUrl: "https://funny-boba-67508f.netlify.app/",
    url: "https://apps.apple.com/gb/app/nobooze/id6755612993",
    icon: "/apps/nobooze/icon-v19.webp",
    backdrop: "/apps/nobooze/dusk.webp",
    cta: "App Store",
    links: [
      {
        label: "Product site",
        url: "https://funny-boba-67508f.netlify.app/",
      },
    ],
    screenshots: [
      poster(
        "/apps/nobooze/v190/01-dashboard.webp",
        "Today",
        "NoBooze Today screen: a 128-day alcohol-free count rising over a sunset horizon and a Close the day check-in, headlined One day, then the next.",
      ),
      poster(
        "/apps/nobooze/v190/02-sos.webp",
        "Craving SOS",
        "NoBooze craving SOS: a breathing circle over still water and a strength slider, headlined When it pulls, breathe.",
      ),
      poster(
        "/apps/nobooze/v190/03-year.webp",
        "Journey",
        "NoBooze Journey tab: month five of the year in days, one dot per alcohol-free day, headlined One dot, one day.",
      ),
      poster(
        "/apps/nobooze/v190/04-journal.webp",
        "Journal",
        "NoBooze private journal with today's question about social situations and dated entries, headlined Notice how you feel.",
      ),
      poster(
        "/apps/nobooze/v190/05-elixirs.webp",
        "Alcohol-free drinks",
        "NoBooze drinks menu with twelve alcohol-free recipes, led by a Smoked Ginger Mule, headlined Tonight, something good.",
      ),
      poster(
        "/apps/nobooze/v190/06-letters.webp",
        "Letters",
        "NoBooze letters to your future self, sealed until the day you choose, headlined Letters to your future self.",
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
