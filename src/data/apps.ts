export interface PrivateApp {
  name: string;
  title: string;
  kicker: string;
  status: string;
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
  }[];
}

export const PRIVATE_APPS: PrivateApp[] = [
  {
    name: 'GemGame',
    title: 'GemGame: Match 3 Puzzle',
    kicker: 'Shipped iOS game · Match-3',
    status: 'App Store',
    blurb:
      'My match-3 habit turned into a released iPhone game: hand-built boards, big cascades, no ad sludge, and a starlit garden that gives earned stars somewhere to go.',
    stack: ['SpriteKit', 'SwiftUI', 'Game Center', 'StoreKit 2'],
    siteUrl: 'https://georgepwall1991.github.io/fleet-commander-site/gemgame/',
    url: 'https://apps.apple.com/us/app/gemgame-match-3-puzzle/id6761720994',
    cta: 'App Store',
    links: [
      {
        label: 'Game info',
        url: 'https://georgepwall1991.github.io/fleet-commander-site/gemgame/',
      },
      {
        label: 'FAQ / rules',
        url: 'https://georgepwall1991.github.io/fleet-commander-site/gemgame/faq/',
      },
      {
        label: 'Support',
        url: 'https://georgepwall1991.github.io/fleet-commander-site/gemgame/support/',
      },
      {
        label: 'Terms',
        url: 'https://georgepwall1991.github.io/fleet-commander-site/gemgame/terms/',
      },
    ],
    screenshots: [
      {
        src: '/apps/gemgame-gameplay.webp',
        alt: 'GemGame iPhone screenshot showing a neon match-3 board with gem cascades and boosters',
      },
      {
        src: '/apps/gemgame-garden.webp',
        alt: 'GemGame iPhone screenshot showing the starlit garden progression screen',
      },
    ],
  },
  {
    name: 'Fleet Commander',
    title: 'Fleet Commander',
    kicker: 'Shipped iOS game · Strategy',
    status: 'App Store',
    blurb:
      'A small space strategy game about expanding too far, holding the frontier, and resetting a bit wiser. Fleets, research, offline progress, Game Center, the whole App Store checklist.',
    stack: ['Swift', 'Game Center', 'StoreKit', 'iOS 17+'],
    siteUrl: 'https://georgepwall1991.github.io/fleet-commander-site/',
    url: 'https://apps.apple.com/us/app/fleet-commander/id6760207805',
    cta: 'App Store',
    links: [
      {
        label: 'Game info',
        url: 'https://georgepwall1991.github.io/fleet-commander-site/',
      },
      {
        label: 'Support',
        url: 'https://georgepwall1991.github.io/fleet-commander-site/support/',
      },
      {
        label: 'Privacy',
        url: 'https://georgepwall1991.github.io/fleet-commander-site/privacy/',
      },
      {
        label: 'Terms',
        url: 'https://georgepwall1991.github.io/fleet-commander-site/terms/',
      },
    ],
    screenshots: [
      {
        src: '/apps/fleet-commander-icon.webp',
        alt: 'Fleet Commander App Store icon',
      },
    ],
  },
  {
    name: 'TinyTransitJam',
    title: 'Tiny Transit Jam',
    kicker: 'Private iOS build · Puzzle',
    status: 'Private build',
    blurb:
      'A private prototype for the commute-puzzle part of my brain: tap the buses, load the matching passengers, and stop the station seizing up before it all goes sideways.',
    stack: ['SwiftUI', 'SpriteKit', 'SwiftData', 'Fastlane'],
    screenshots: [
      {
        src: '/apps/tiny-transit-home.webp',
        alt: 'Tiny Transit Jam iPhone screenshot showing the level map and daily challenge card',
      },
      {
        src: '/apps/tiny-transit-game.webp',
        alt: 'Tiny Transit Jam iPhone screenshot showing the onboarding puzzle board and booster tray',
      },
    ],
  },
];
