/**
 * Build-time NuGet adoption data.
 *
 * The public search API is queried during a build, with a committed fallback so
 * an outage or rate limit can never stop the portfolio deploying. The fallback
 * lives in nuget-snapshot.json, which `npm run nuget` (run daily by the
 * refresh-live-data workflow) rewrites from the live API.
 */

import snapshot from './nuget-snapshot.json' with { type: 'json' };

export interface NuGetPackage {
  id: string;
  version: string;
  totalDownloads: number;
  url: string;
}

export const PACKAGE_IDS = [
  'LinqContraband',
  'DependencyInjection.Lifetime.Analyzers',
  'CancelCop.Analyzer',
  'AutoMapperAnalyzer.Analyzers',
  'ConfigContraband',
  'ConfigContraband.Tool',
  'CPMigrate',
  'HttpClient.Resilience.Analyzers',
  'NotifyGen',
] as const;

export type PackageId = (typeof PACKAGE_IDS)[number];

export const NUGET_FALLBACK = snapshot.packages as Record<PackageId, NuGetPackage>;

interface SearchPackage {
  id?: string;
  version?: string;
  totalDownloads?: number;
}

export function totalNuGetDownloads(packages: Iterable<NuGetPackage>): number {
  return [...packages].reduce((total, pkg) => total + pkg.totalDownloads, 0);
}

async function fetchPackage(id: PackageId, signal: AbortSignal): Promise<NuGetPackage> {
  const query = encodeURIComponent(`packageid:${id}`);
  const response = await fetch(
    `https://azuresearch-usnc.nuget.org/query?q=${query}&prerelease=true&take=5`,
    { signal, headers: { Accept: 'application/json' } },
  );
  if (!response.ok) throw new Error(`NuGet ${response.status}`);

  const payload = (await response.json()) as { data?: SearchPackage[] };
  const hit = payload.data?.find((pkg) => pkg.id?.toLowerCase() === id.toLowerCase());
  if (!hit?.id || !hit.version || !Number.isFinite(hit.totalDownloads)) {
    throw new Error(`NuGet package ${id} missing from response`);
  }

  return {
    id: hit.id,
    version: hit.version,
    totalDownloads: hit.totalDownloads!,
    url: `https://www.nuget.org/packages/${encodeURIComponent(hit.id)}`,
  };
}

let packageSnapshot: Promise<Record<PackageId, NuGetPackage>> | undefined;

async function loadNuGetPackages(timeoutMs: number): Promise<Record<PackageId, NuGetPackage>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const results = await Promise.allSettled(
      PACKAGE_IDS.map((id) => fetchPackage(id, controller.signal)),
    );
    return Object.fromEntries(
      PACKAGE_IDS.map((id, index) => {
        const result = results[index];
        return [id, result.status === 'fulfilled' ? result.value : NUGET_FALLBACK[id]];
      }),
    ) as Record<PackageId, NuGetPackage>;
  } finally {
    clearTimeout(timer);
  }
}

/** Reuse one request set across every static route generated in the same build. */
export function getNuGetPackages(timeoutMs = 5000): Promise<Record<PackageId, NuGetPackage>> {
  packageSnapshot ??= loadNuGetPackages(timeoutMs);
  return packageSnapshot;
}
