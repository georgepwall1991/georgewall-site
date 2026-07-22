export interface ArticleMeta {
  slug: string;
  title: string;
  kicker: string;
  description: string;
  published: string;
  readingTime: string;
}

export const ARTICLES: ArticleMeta[] = [
  {
    slug: 'when-http-retries-make-failures-worse',
    title: 'When HTTP retries make failures worse',
    kicker: 'Compile-time safety · HTTP resilience',
    description:
      'Retries can rescue a transient request—or multiply load, latency and side effects. The difference is a policy the code can explain.',
    published: '2026-07-22',
    readingTime: '7 min read',
  },
  {
    slug: 'catching-broken-appsettings-before-deployment',
    title: 'Catching broken appsettings before deployment',
    kicker: 'Compile-time safety · configuration',
    description:
      'How .NET Options and appsettings drift apart, and how to move missing sections, bad values and validation gaps into the editor.',
    published: '2026-07-22',
    readingTime: '7 min read',
  },
  {
    slug: 'catching-n-plus-1-at-compile-time',
    title: 'Catching N+1 queries at compile time',
    kicker: 'Compile-time safety · EF Core',
    description:
      'Why N+1 and client-side evaluation survive code review and tests—and how a Roslyn analyser moves the catch into the editor.',
    published: '2026-06-01',
    readingTime: '6 min read',
  },
];
