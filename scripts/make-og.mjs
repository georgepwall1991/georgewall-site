/**
 * Rasterise public/og.svg -> public/og.png (1200x630) for social cards.
 * Run once with `npm run og` whenever the OG art changes. The PNG is committed,
 * so the Vercel build never depends on sharp.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const svgPath = join(root, 'public', 'og.svg');
const pngPath = join(root, 'public', 'og.png');

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('sharp is not installed. Run `npm install` first.');
  process.exit(1);
}

const svg = await readFile(svgPath);
await sharp(svg, { density: 160 }).png({ quality: 90 }).resize(1200, 630).toFile(pngPath);
console.log('Wrote', pngPath);
