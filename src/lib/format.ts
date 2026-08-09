/**
 * Small, dependency-free formatting + presentation helpers.
 * Kept pure so the data-shaping logic can be unit tested in isolation.
 */

/** GitHub-ish language → colour. Falls back to a neutral ink for the unknown. */
const LANGUAGE_COLORS: Record<string, string> = {
  'C#': '#9b6dd6',
  TypeScript: '#3178c6',
  JavaScript: '#d8b500',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Ruby: '#9a1f2b',
  Swift: '#f05138',
  Python: '#3572A5',
  Shell: '#89e051',
  Astro: '#ff5a03',
  Rust: '#cc6a3a',
  Go: '#00ADD8',
  Kotlin: '#A97BFF',
  Java: '#b07219',
  Dockerfile: '#384d54',
};

export function languageColor(language: string | null | undefined): string {
  if (!language) return 'var(--ink-faint)';
  return LANGUAGE_COLORS[language] ?? 'var(--ink-faint)';
}

/** "1,024", grouped and locale-stable. */
export function formatCount(n: number): string {
  return new Intl.NumberFormat('en-GB').format(n);
}

/** "May 2026". Month and year are enough for a portfolio cadence. */
export function formatMonthYear(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

/** "3 days ago" / "5 months ago" relative to `now` (injectable for tests). */
export function relativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = now.getTime() - then;
  const day = 86_400_000;
  const rtf = new Intl.RelativeTimeFormat('en-GB', { numeric: 'auto' });
  const days = Math.round(diff / day);
  if (Math.abs(days) < 1) return 'today';
  if (Math.abs(days) < 30) return rtf.format(-days, 'day');
  const months = Math.round(days / 30);
  if (Math.abs(months) < 12) return rtf.format(-months, 'month');
  return rtf.format(-Math.round(months / 12), 'year');
}

/** Two-digit catalogue index: 1 → "01". */
export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Turn a NuGet/homepage/repo URL into a short, human label for a link chip. */
export function linkLabel(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'nuget.org' || host.endsWith('.nuget.org')) return 'NuGet';
    if (host === 'github.com') return 'GitHub';
    if (host.endsWith('github.io')) return 'Live';
    if (host === 'apps.apple.com') return 'App Store';
    return host;
  } catch {
    return 'Link';
  }
}
