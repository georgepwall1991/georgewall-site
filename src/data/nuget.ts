/**
 * Build-time NuGet adoption data.
 *
 * The public search API is queried during a build, with a committed fallback so
 * an outage or rate limit can never stop the portfolio deploying. The fallback
 * values were refreshed on 21 July 2026.
 */

export interface NuGetPackage {
  id: string;
  version: string;
  totalDownloads: number;
  url: string;
}

const PACKAGE_IDS = [
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

export const NUGET_FALLBACK: Record<PackageId, NuGetPackage> = {
  LinqContraband: {
    id: 'LinqContraband',
    version: '5.7.0',
    totalDownloads: 44245,
    url: 'https://www.nuget.org/packages/LinqContraband',
  },
  'DependencyInjection.Lifetime.Analyzers': {
    id: 'DependencyInjection.Lifetime.Analyzers',
    version: '2.18.24',
    totalDownloads: 24868,
    url: 'https://www.nuget.org/packages/DependencyInjection.Lifetime.Analyzers',
  },
  'CancelCop.Analyzer': {
    id: 'CancelCop.Analyzer',
    version: '1.27.224',
    totalDownloads: 29703,
    url: 'https://www.nuget.org/packages/CancelCop.Analyzer',
  },
  'AutoMapperAnalyzer.Analyzers': {
    id: 'AutoMapperAnalyzer.Analyzers',
    version: '2.30.86',
    totalDownloads: 21759,
    url: 'https://www.nuget.org/packages/AutoMapperAnalyzer.Analyzers',
  },
  ConfigContraband: {
    id: 'ConfigContraband',
    version: '0.7.22',
    totalDownloads: 4852,
    url: 'https://www.nuget.org/packages/ConfigContraband',
  },
  'ConfigContraband.Tool': {
    id: 'ConfigContraband.Tool',
    version: '0.7.22',
    totalDownloads: 2755,
    url: 'https://www.nuget.org/packages/ConfigContraband.Tool',
  },
  CPMigrate: {
    id: 'CPMigrate',
    version: '3.4.0',
    totalDownloads: 13091,
    url: 'https://www.nuget.org/packages/CPMigrate',
  },
  'HttpClient.Resilience.Analyzers': {
    id: 'HttpClient.Resilience.Analyzers',
    version: '0.1.119',
    totalDownloads: 129,
    url: 'https://www.nuget.org/packages/HttpClient.Resilience.Analyzers',
  },
  NotifyGen: {
    id: 'NotifyGen',
    version: '1.4.0',
    totalDownloads: 682,
    url: 'https://www.nuget.org/packages/NotifyGen',
  },
};

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
