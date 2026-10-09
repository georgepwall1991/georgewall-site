/**
 * Live products George collaborates on. These are not GitHub repos: they are
 * editorial entries with explicit outbound URLs for the homepage chapter.
 *
 * The hrefs exist to pass SEO value to the live products. They are dofollow
 * by design (rel is `noopener` only). Do not add nofollow, sponsored, or ugc,
 * and do not put these URLs on Person `sameAs`.
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
  /** George's role, shown as the headline badge. */
  role: string;
  kicker: string;
  title: string;
  blurb: string;
  href: string;
  /** Keyword-rich prose anchor for contextual backlinks. */
  anchor: string;
  /** Exact-domain CTA label (brand URL match). */
  cta: string;
  theme: CollabTheme;
  tags: string[];
  poster: CollabPoster;
  /** Product imagery for the ventures spread. The first image leads. */
  gallery: CollabPoster[];
  /** Proof points shown under the copy. */
  facts: { label: string; value: string }[];
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
    alternateName: new URL(collab.href).hostname,
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
    role: "Product engineer",
    kicker: "Fashion intelligence platform",
    title: "INFLU",
    blurb:
      "INFLU is a fashion intelligence platform. It scores looks as they start to rise, so you can see what is about to take off. I collaborate on the live product, including the Style Index and the scoring UI.",
    href: "https://influ.site",
    anchor: "INFLU, a fashion intelligence platform",
    cta: "Visit influ.site",
    theme: "influ",
    tags: ["Product", "Web", "Fashion"],
    poster: {
      src: "/collab/influ.webp",
      alt: "INFLU homepage, with the fashion intelligence feed and look scores",
    },
    gallery: [
      { src: "/ventures/influ/look-01.webp", alt: "Street style look tracked on INFLU" },
      { src: "/ventures/influ/look-02.webp", alt: "Couture gown look tracked on INFLU" },
      { src: "/ventures/influ/look-12.webp", alt: "Editorial look tracked on INFLU" },
      { src: "/ventures/influ/look-04.webp", alt: "Tailoring look tracked on INFLU" },
      { src: "/ventures/influ/look-09.webp", alt: "Statement look tracked on INFLU" },
      { src: "/ventures/influ/look-07.webp", alt: "Monochrome look tracked on INFLU" },
    ],
    facts: [
      { label: "Built", value: "Style Index" },
      { label: "Surface", value: "Web terminal" },
      { label: "Signal", value: "Virality · velocity" },
    ],
    schemaDescription:
      "Fashion intelligence platform that scores looks as they start to rise.",
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
    role: "Co-founder",
    kicker: "Premium quick-dry towels",
    title: "Dansu",
    blurb:
      "Dansu makes premium quick-dry towels for raves, gym and travel. I co-founded it, built the brand site and Shopify storefront, and run the engineering behind our growth.",
    href: "https://dansu.co.uk",
    anchor: "Dansu, premium quick-dry towels for raves, gym and travel",
    cta: "Visit dansu.co.uk",
    theme: "dansu",
    tags: ["Brand site", "Storefront", "Product"],
    poster: {
      src: "/collab/dansu.webp",
      alt: "Dansu homepage, with the brand mark and a shop now link",
    },
    gallery: [
      {
        src: "/ventures/dansu/towels.webp",
        alt: "Dansu quick-dry towels fanned out in England, Netherlands, France, Brazil, Spain and Germany colourways",
      },
      {
        src: "/ventures/dansu/world-cup.webp",
        alt: "Dansu World Cup 26 campaign artwork over a fan wearing a Dansu towel",
      },
    ],
    facts: [
      { label: "Role", value: "Co-founder" },
      { label: "Stack", value: "Shopify · automation" },
      { label: "Range", value: "Raves · gym · travel" },
    ],
    schemaDescription:
      "Premium quick-dry towels for raves, gym and travel, sold from a London brand site.",
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
