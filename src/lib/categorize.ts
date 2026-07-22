/**
 * Bucket a repo into an editorial category. Shared by the server-rendered
 * archive and the client-side live refresh so the two never disagree.
 */
import type { Repo } from '../data/types';

export type Category = 'Analysers' | 'Source gen' | 'Tooling' | 'Web' | 'Other';

export const CATEGORY_ORDER: Category[] = ['Analysers', 'Source gen', 'Tooling', 'Web', 'Other'];

export function categoryOf(repo: Repo): Category {
  const topics = repo.topics.map((t) => t.toLowerCase());
  const name = repo.name.toLowerCase();
  const has = (...needles: string[]) => needles.some((n) => topics.includes(n));
  const nameHas = (...needles: string[]) => needles.some((n) => name.includes(n));

  if (has('source-generators', 'source-generator', 'code-generation')) return 'Source gen';

  if (
    has('roslyn-analyzer', 'roslyn', 'static-analysis', 'code-analysis', 'linter') ||
    nameHas('analyzer', 'analyser', 'contraband', 'cop')
  ) {
    return 'Analysers';
  }

  if (
    has('cli', 'dotnet-tool', 'devops', 'migration-tool', 'productivity', 'dependency-management') ||
    nameHas('migrate', 'keeper')
  ) {
    return 'Tooling';
  }

  if (
    repo.language === 'TypeScript' ||
    repo.language === 'JavaScript' ||
    has('react', 'tauri', 'frontend', 'blazor')
  ) {
    return 'Web';
  }

  return 'Other';
}

/** Distinct categories present in a set, in canonical order. */
export function categoriesIn(repos: Repo[]): Category[] {
  const present = new Set(repos.map(categoryOf));
  return CATEGORY_ORDER.filter((c) => present.has(c));
}
