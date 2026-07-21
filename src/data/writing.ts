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
    slug: 'catching-n-plus-1-at-compile-time',
    title: 'Catching N+1 queries at compile time',
    kicker: 'Compile-time safety · EF Core',
    description:
      'Why N+1 and client-side evaluation survive code review and tests—and how a Roslyn analyser moves the catch into the editor.',
    published: '2026-06-01',
    readingTime: '6 min read',
  },
];
