/**
 * Live products George collaborates on. These are not GitHub repos: they are
 * editorial entries with explicit outbound URLs for the homepage chapter.
 *
 * The hrefs are dofollow by design (rel is `noopener` only). Do not add
 * nofollow, sponsored, or ugc — and do not put these URLs on Person `sameAs`.
 */

export type CollabTheme = "influ" | "dansu";

export interface CollabPoster {
  src: string;
  alt: string;
}

export interface CollabScene {
  edition: string;
  figure: string;
  metricLabel: string;
  metricValue: string;
  status: string;
  caption: string;
  notes: string[];
}

export interface Collaboration {
  slug: string;
  kicker: string;
  title: string;
  blurb: string;
  href: string;
  cta: string;
  theme: CollabTheme;
  tags: string[];
  poster: CollabPoster;
  schemaDescription: string;
  scene: CollabScene;
}

/** Safe new-tab rel that does not dilute the backlink. */
export const COLLAB_LINK_REL = "noopener" as const;

export function collabLinkRel(): typeof COLLAB_LINK_REL {
  return COLLAB_LINK_REL;
}

export function isDofollowRel(rel: string): boolean {
  const tokens = rel.toLowerCase().split(/\s+/).filter(Boolean);
  return (
    !tokens.includes("nofollow") &&
    !tokens.includes("sponsored") &&
    !tokens.includes("ugc")
  );
}

export function collabWebsiteSchema(
  collab: Collaboration,
  personId: string,
): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": `${collab.href.replace(/\/$/, "")}/#website`,
    name: collab.title,
    url: collab.href,
    description: collab.schemaDescription,
    contributor: { "@id": personId },
  };
}

export function collabSchemas(personId: string): Record<string, unknown>[] {
  return COLLABS.map((collab) => collabWebsiteSchema(collab, personId));
}

export const COLLABS: Collaboration[] = [
  {
    slug: "influ",
    kicker: "Collaboration · Fashion intelligence",
    title: "INFLU",
    blurb:
      "INFLU is a fashion intelligence terminal: it scores looks as they rise, not after they’ve peaked. I collaborate on the live product — the Style Index, the scoring surface, and the editorial UX that makes telemetry feel like a magazine.",
    href: "https://influ.site",
    cta: "Visit influ.site",
    theme: "influ",
    tags: ["Product", "Editorial UX", "Live platform"],
    poster: {
      src: "/collab/influ.webp",
      alt: "INFLU homepage: a fashion intelligence terminal scoring rising looks",
    },
    schemaDescription:
      "Fashion intelligence platform that scores rising looks before they peak.",
    scene: {
      edition: "Sect. I",
      figure: "The Fashion Issue",
      metricLabel: "Style Index",
      metricValue: "87",
      status: "Peaking",
      caption: "Live signal · rising looks",
      notes: ["Virality", "Velocity", "Phase"],
    },
  },
  {
    slug: "dansu",
    kicker: "Collaboration · Brand and storefront",
    title: "Dansu",
    blurb:
      "Dansu makes premium quick-dry towels for raves, gym and travel, with a storefront built around terrace energy and national colours. I collaborate on the brand site — the kind of product page that should feel like a night out, not a catalogue.",
    href: "https://dansu.co.uk",
    cta: "Visit dansu.co.uk",
    theme: "dansu",
    tags: ["Brand site", "Storefront", "Product"],
    poster: {
      src: "/collab/dansu.webp",
      alt: "Dansu homepage: national-colour towel drops with terrace copy",
    },
    schemaDescription:
      "Premium quick-dry towels for raves, gym and travel, with a brand storefront built around terrace energy.",
    scene: {
      edition: "England",
      figure: "Terrace issue",
      metricLabel: "Nations",
      metricValue: "07",
      status: "Live store",
      caption: "Raves, gym and travel",
      notes: ["England", "Brazil", "France"],
    },
  },
];
