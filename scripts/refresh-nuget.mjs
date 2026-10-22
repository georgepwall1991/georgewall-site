/**
 * Refresh src/data/nuget-snapshot.json from the public NuGet search API.
 * The build fetches live counts anyway; this keeps the committed fallback
 * current and, when run by the daily workflow, its commit triggers a fresh
 * Vercel deploy. A package that fails to load keeps its previous entry.
 * Run with `npm run nuget`.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'src', 'data', 'nuget-snapshot.json');
const previous = JSON.parse(await readFile(out, 'utf8'));

async function fetchPackage(id) {
  const query = encodeURIComponent(`packageid:${id}`);
  const response = await fetch(
    `https://azuresearch-usnc.nuget.org/query?q=${query}&prerelease=true&take=5`,
    { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15_000) },
  );
  if (!response.ok) throw new Error(`NuGet ${response.status}`);
  const payload = await response.json();
  const hit = payload.data?.find((pkg) => pkg.id?.toLowerCase() === id.toLowerCase());
  if (!hit?.id || !hit.version || !Number.isFinite(hit.totalDownloads)) {
    throw new Error('missing from response');
  }
  return {
    id: hit.id,
    version: hit.version,
    totalDownloads: hit.totalDownloads,
    url: `https://www.nuget.org/packages/${encodeURIComponent(hit.id)}`,
  };
}

const ids = Object.keys(previous.packages);
const results = await Promise.allSettled(ids.map(fetchPackage));
let fresh = 0;
const packages = Object.fromEntries(
  ids.map((id, i) => {
    const result = results[i];
    if (result.status === 'fulfilled') {
      fresh += 1;
      return [id, result.value];
    }
    console.warn(`Keeping previous ${id}: ${result.reason?.message ?? result.reason}`);
    return [id, previous.packages[id]];
  }),
);

if (fresh === 0) {
  console.error('No NuGet packages could be fetched; leaving the snapshot unchanged.');
  process.exit(1);
}

await writeFile(
  out,
  JSON.stringify({ generatedAt: new Date().toISOString(), packages }, null, 2) + '\n',
);
const total = Object.values(packages).reduce((sum, pkg) => sum + pkg.totalDownloads, 0);
console.log(`Wrote ${out}: ${fresh}/${ids.length} packages refreshed, ${total} downloads.`);
