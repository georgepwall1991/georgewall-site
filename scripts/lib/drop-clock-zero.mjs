/**
 * Turn a store poster's "09:41" status-bar clock into Apple's "9:41".
 *
 * GemGame and NoBooze render their store frames on an en-GB device, which
 * pads the hour. The site's drawn iPhones show 9:41, so a poster beside them
 * looks off. This finds the five clock glyphs inside `box`, paints the clock
 * out, then puts "9:41" back from the poster's own pixels, centred where the
 * old clock was, so the typeface is untouched.
 *
 * Throws when the box does not hold exactly five glyphs, so a moved phone in a
 * new store set fails loudly instead of smearing the wrong pixels.
 */
import sharp from 'sharp';

/** Luma at or above this counts as clock ink (the clock is pure white). */
const INK = 170;
/** Padding painted out around the clock, in pixels at 760px wide. */
const PAD = 4;
/** Shortest glyph, in pixels: the colon spans about 13. */
const MIN_GLYPH = 8;

const luma = (d, i) => 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];

/** box: { left, top, width, height } search area, in pixels of `input`. */
export async function dropClockZero(input, box) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, channels: c } = info;
  const at = (x, y) => (y * w + x) * c;

  // Runs of inked columns inside the box are the glyphs: 0, 9, :, 4, 1.
  // Specks shorter than a colon dot (frame edges, sparkles) are ignored.
  const runs = [];
  let open = false;
  for (let x = box.left; x < box.left + box.width; x++) {
    let lo = Infinity;
    let hi = -Infinity;
    for (let y = box.top; y < box.top + box.height; y++) {
      if (luma(data, at(x, y)) >= INK) {
        lo = Math.min(lo, y);
        hi = Math.max(hi, y);
      }
    }
    if (lo === Infinity) open = false;
    else if (!open) {
      runs.push({ from: x, to: x, top: lo, bottom: hi });
      open = true;
    } else {
      const run = runs[runs.length - 1];
      run.to = x;
      run.top = Math.min(run.top, lo);
      run.bottom = Math.max(run.bottom, hi);
    }
  }
  const glyphs = runs.filter((run) => run.bottom - run.top >= MIN_GLYPH);
  if (glyphs.length !== 5) {
    throw new Error(`expected 5 clock glyphs, found ${glyphs.length} in ${JSON.stringify(box)}`);
  }
  const top = Math.min(...glyphs.map((g) => g.top));
  const bottom = Math.max(...glyphs.map((g) => g.bottom));

  const x0 = glyphs[0].from - PAD;
  const x1 = glyphs[4].to + PAD;
  const y0 = top - PAD;
  const y1 = bottom + PAD;

  // Background under the clock: blend of a horizontal and a vertical
  // interpolation from the untouched pixels just outside the clock box.
  const bg = Buffer.from(data);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const tx = (x - x0) / (x1 - x0);
      const ty = (y - y0) / (y1 - y0);
      for (let k = 0; k < 3; k++) {
        const h = data[at(x0 - 1, y) + k] * (1 - tx) + data[at(x1 + 1, y) + k] * tx;
        const v = data[at(x, y0 - 1) + k] * (1 - ty) + data[at(x, y1 + 1) + k] * ty;
        bg[at(x, y) + k] = h * 0.35 + v * 0.65;
      }
    }
  }

  // Ink coverage of the original clock, against that background.
  const alpha = (x, y) => {
    const base = luma(bg, at(x, y));
    return Math.min(1, Math.max(0, (luma(data, at(x, y)) - base) / (255 - base)));
  };

  // "9:41" moves left by half the width the "0" took, keeping the clock centred.
  const shift = Math.round((glyphs[1].from - glyphs[0].from) / 2);
  const out = Buffer.from(bg);
  for (let y = y0; y <= y1; y++) {
    for (let x = glyphs[1].from - 1; x <= glyphs[4].to + 1; x++) {
      const a = alpha(x, y);
      if (a < 0.08) continue;
      const i = at(x - shift, y);
      for (let k = 0; k < 3; k++) out[i + k] = out[i + k] * (1 - a) + 255 * a;
    }
  }

  return sharp(out, { raw: { width: w, height: info.height, channels: c } });
}
