/**
 * Scrub the status bar off the raw captures that have no app-repo pipeline
 * (My Lumina, Tiny Transit Jam), so the site's device frame can draw a clean
 * Apple-standard one (9:41, full signal, full battery).
 *
 *   node scripts/clean-status-bars.mjs
 *
 * GemGame, Fleet Commander and NoBooze come straight from their repos through
 * `npm run shots`, which scrubs in the same way.
 *
 * Outputs land in public/apps/clean/ under new names, because /apps images are
 * served with a one-year immutable cache and must never change in place.
 */
import { mkdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scrubStatusBar } from './lib/scrub-status-bar.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'apps');
const OUT = join(ROOT, 'clean');

const SHOTS = [
  ['tiny-transit-home.webp', 'tiny-transit-home.webp'],
  ['lumina-home.webp', 'lumina-home.webp'],
];

mkdirSync(OUT, { recursive: true });

for (const [from, to] of SHOTS) {
  const target = join(OUT, to);
  const info = await (await scrubStatusBar(join(ROOT, from)))
    .webp({ quality: 84, effort: 6 })
    .toFile(target);
  console.log(`write clean/${to.padEnd(24)} ${info.width}x${info.height}  ${(statSync(target).size / 1024).toFixed(0)}KB`);
}
