/**
 * Scrub the status bar off raw simulator captures so the site's device frame
 * can draw a clean Apple-standard one (9:41, full signal, full battery).
 *
 *   node scripts/clean-status-bars.mjs
 *
 * The raw captures carry whatever the simulator said at the time: 19:38,
 * 22:26, no cellular bars, a charging battery. For each row of the status
 * band this paints a horizontal blend between the left and right edge pixels
 * (where only background lives), softens it, then feathers it back into the
 * untouched screen below. The Dynamic Island goes too; the frame draws its own.
 *
 * Outputs land in public/apps/clean/ under new names, because /apps images are
 * served with a one-year immutable cache and must never change in place.
 */
import sharp from 'sharp';
import { mkdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'apps');
const OUT = join(ROOT, 'clean');

/** Status band as a fraction of image height; captures are all iPhone 6.1–6.9". */
const BAND = 0.066;
const FEATHER = 0.018;
/** Sample a little in from each edge so rounded-corner antialiasing is skipped. */
const EDGE = 0.03;

const SHOTS = [
  ['fleet/route.webp', 'fleet-route.webp'],
  ['fleet/tactics.webp', 'fleet-tactics.webp'],
  ['fleet/showdown.webp', 'fleet-showdown.webp'],
  ['fleet/extraction.webp', 'fleet-extraction.webp'],
  ['fleet/build.webp', 'fleet-build.webp'],
  ['nobooze-today.webp', 'nobooze-today.webp'],
  ['nobooze-journal.webp', 'nobooze-journal.webp'],
  ['tiny-transit-home.webp', 'tiny-transit-home.webp'],
  ['lumina-home.webp', 'lumina-home.webp'],
];

mkdirSync(OUT, { recursive: true });

for (const [from, to] of SHOTS) {
  const { data, info } = await sharp(join(ROOT, from))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const band = Math.round(h * BAND);
  const feather = Math.round(h * FEATHER);
  const xl = Math.round(w * EDGE);
  const xr = w - 1 - xl;

  // Paint the band (plus feather zone) into a separate buffer first.
  const fill = Buffer.from(data);
  for (let y = 0; y < band + feather; y++) {
    const l = (y * w + xl) * c;
    const r = (y * w + xr) * c;
    for (let x = 0; x < w; x++) {
      const t = x / (w - 1);
      const i = (y * w + x) * c;
      for (let k = 0; k < 3; k++) fill[i + k] = data[l + k] * (1 - t) + data[r + k] * t;
      fill[i + 3] = 255;
    }
  }
  const soft = await sharp(fill, { raw: { width: w, height: h, channels: c } })
    .blur(Math.max(2, w / 120))
    .raw()
    .toBuffer();

  // Composite: fully painted in the band, easing back to the original below.
  const out = Buffer.from(data);
  for (let y = 0; y < band + feather; y++) {
    const a = y < band ? 1 : 1 - (y - band) / feather;
    const ease = a * a * (3 - 2 * a);
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * c;
      for (let k = 0; k < 3; k++) out[i + k] = soft[i + k] * ease + data[i + k] * (1 - ease);
    }
  }

  const target = join(OUT, to);
  await sharp(out, { raw: { width: w, height: h, channels: c } })
    .removeAlpha()
    .webp({ quality: 84, effort: 6 })
    .toFile(target);
  console.log(`write clean/${to.padEnd(24)} ${w}x${h}  ${(statSync(target).size / 1024).toFixed(0)}KB`);
}
