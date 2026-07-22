export interface PrivateApp {
  name: string;
  title: string;
  kicker: string;
  status: string;
  release?: string;
  category: "game" | "health";
  theme: "gem" | "fleet" | "wellness" | "transit";
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

export const PRIVATE_APPS: PrivateApp[] = [
  {
    name: "GemGame",
    title: "GemGame: Cosy Match 3 Puzzle",
    kicker: "Shipped iOS game · Match-3",
    status: "App Store",
    release: "v2.1",
    category: "game",
    theme: "gem",
    blurb:
      "A hand-built match-3 game with big cascades, expressive power gems, ten galaxy worlds, and no ad sludge. Version 2.1 sharpens the jewels and makes every special feel properly explosive.",
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
      "A compact space strategy game about reading a connected galaxy, choosing where to expand, and holding the frontier. Fleets, tactical gambits, research, offline progress, and prestige all made the launch build.",
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
    kicker: "In development · Health & Fitness",
    status: "Coming next",
    release: "Build preview",
    category: "health",
    theme: "wellness",
    blurb:
      "A private, science-backed sobriety companion built to make progress feel tangible without making a difficult day feel like failure. It brings streaks, health milestones, check-ins, journalling, and slip support into one calm SwiftUI experience.",
    stack: ["SwiftUI", "Core Data", "HealthKit", "CloudKit"],
    siteUrl: "https://funny-boba-67508f.netlify.app/",
    url: "https://funny-boba-67508f.netlify.app/",
    cta: "Product site",
    screenshots: [
      {
        src: "/apps/nobooze-dashboard.webp",
        alt: "NoBooze development build showing the daily sobriety dashboard and first-day health milestone",
        caption: "Dashboard · development build",
      },
    ],
  },
  {
    name: "TinyTransitJam",
    title: "Tiny Transit Jam",
    kicker: "Private iOS build · Puzzle",
    status: "Private build",
    release: "Prototype",
    category: "game",
    theme: "transit",
    featured: false,
    blurb:
      "A private prototype for the commute-puzzle part of my brain: tap the buses, load the matching passengers, and stop the station seizing up before it all goes sideways.",
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
