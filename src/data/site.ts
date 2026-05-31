/**
 * One place for identity + contact details. Edit here, it updates everywhere.
 * NOTE: `email` is published publicly on the site (mailto). Change or remove it
 * if you'd rather not expose it to scrapers.
 */
export const SITE = {
  name: 'George Wall',
  domain: 'georgewall.uk',
  url: 'https://www.georgewall.uk',
  role: 'Full-stack developer',
  location: 'London',
  email: 'georgewall91@gmail.com',
  github: 'https://github.com/georgepwall1991',
  githubUser: 'georgepwall1991',
  /** Roman-numeral year for the masthead flourish. */
  issueYear: 'MMXXVI',
  issueNo: '01',
} as const;

/**
 * Public profiles, emitted as schema.org `sameAs` to disambiguate the person
 * entity for search engines and AI. Add verified URLs only — a 404 here is a
 * worse signal than an omission. To add LinkedIn/X, drop the full URL in below.
 */
export const SOCIALS: string[] = [
  'https://github.com/georgepwall1991',
  'https://www.nuget.org/profiles/GeorgeWall1991',
  // 'https://www.linkedin.com/in/<your-handle>',  // ← add when you have the URL
];
