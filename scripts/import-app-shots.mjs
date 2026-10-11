/**
 * Import the live App Store artwork for GemGame, Fleet Commander and NoBooze
 * from their app repos into public/apps.
 *
 *   npm run shots                      # repos under ~/dev
 *   APPS_ROOT=/path/to/repos npm run shots
 *
 * Each app's own Fastlane / storefront pipeline is the canonical source, so
 * re-run this after a store refresh rather than cropping anything by hand.
 * Missing sources are skipped with a warning, so `npm run build` never depends
 * on the app repos.
 *
 * Posters (finished store frames with a baked headline) are resized as they
 * are, except that their en-GB "09:41" clock becomes "9:41" to match the
 * site's drawn iPhones. Raw captures have their status bar scrubbed so the
 * site's drawn iPhone can show a clean one, then land in public/apps/clean/.
 *
 * Every /apps image is served with a one-year immutable cache, so a refresh
 * must write NEW filenames (bump the version folder or suffix below) and point
 * src/data/apps.ts at them. Never overwrite a published file in place.
 */
import sharp from 'sharp';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scrubStatusBar } from './lib/scrub-status-bar.mjs';
import { dropClockZero } from './lib/drop-clock-zero.mjs';

const ROOT = process.env.APPS_ROOT ?? join(homedir(), 'dev');
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'apps');

/** Portrait 1320x2868 sources land at 760x1651, twice the widest rendered frame. */
const WIDTH = 760;

const GEM = join(ROOT, 'GemGame/fastlane/screenshots/en-GB');
const FLEET = join(ROOT, 'gamesdev/marketing/storefront/source');
const NOBOOZE = join(ROOT, 'NoBooze/fastlane/screenshots/en-GB');
const NOBOOZE_RAW = join(ROOT, 'NoBooze/fastlane/store_screenshots/raw/en-GB');
const NOBOOZE_ICON = join(ROOT, 'NoBooze/NoBooze/Assets.xcassets/AppIcon.appiconset/AppIcon-Paper.png');

/** Where each set's clock sits once resized to 760px wide. */
const GEM_CLOCK = { left: 100, top: 480, width: 160, height: 80 };
const NOBOOZE_CLOCK = { left: 130, top: 295, width: 170, height: 70 };

/** GemGame 2.5 "Velvet" store set. */
const GEM_SHOTS = [
  '01-combo', '02-garden', '03-guardian', '04-worlds', '05-daily',
  '06-specials', '07-relic', '08-calm', '09-voiceover',
].map((name) => ({ from: join(GEM, `${name}.png`), to: `gemgame/v252/${name}.webp`, clock: GEM_CLOCK }));

/** NoBooze 1.9 store set. */
const NOBOOZE_SHOTS = [
  '01-dashboard', '02-sos', '03-year', '04-journal', '05-elixirs', '06-letters',
].map((name) => ({ from: join(NOBOOZE, `${name}.png`), to: `nobooze/v190/${name}.webp`, clock: NOBOOZE_CLOCK }));

/** Fleet Commander 1.2.1 native captures. Its store frames carry 14:5x clocks,
 *  so the site composes these raw screens itself. */
const FLEET_SHOTS = ['route', 'tactics', 'build', 'extraction', 'showdown', 'legacy', 'confrontation'].map(
  (name) => ({ from: join(FLEET, `iphone-${name}.png`), to: `clean/fleet-121-${name}.webp`, scrub: true }),
);

const SHOTS = [
  ...GEM_SHOTS,
  ...NOBOOZE_SHOTS,
  ...FLEET_SHOTS,
  // The hero's NoBooze phone.
  { from: join(NOBOOZE_RAW, '01-dashboard.png'), to: 'clean/nobooze-19-dashboard.webp', scrub: true },
  { from: NOBOOZE_ICON, to: 'nobooze/icon-v19.webp', width: 256 },
];

let written = 0;
let skipped = 0;

for (const shot of SHOTS) {
  const target = join(OUT, shot.to);
  if (!existsSync(shot.from)) {
    console.warn(`skip  ${shot.to.padEnd(34)} source missing: ${shot.from}`);
    skipped += 1;
    continue;
  }
  mkdirSync(dirname(target), { recursive: true });
  const resized = await sharp(shot.from)
    .resize({ width: shot.width ?? WIDTH, kernel: 'lanczos3' })
    .png()
    .toBuffer();
  const image = shot.scrub
    ? await scrubStatusBar(resized)
    : shot.clock
      ? await dropClockZero(resized, shot.clock)
      : sharp(resized);
  const info = await image.webp({ quality: 82, effort: 6 }).toFile(target);
  console.log(
    `write ${relative(OUT, target).padEnd(34)} ${info.width}x${info.height}  ` +
      `${(statSync(target).size / 1024).toFixed(0)}KB`,
  );
  written += 1;
}

console.log(`\n${written} written, ${skipped} skipped.`);
