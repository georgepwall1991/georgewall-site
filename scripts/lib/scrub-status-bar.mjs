/**
 * Paint the status bar off a raw iPhone capture so the site's drawn device can
 * show Apple's marketing bar (9:41, full signal, full battery) instead.
 *
 * For each row of the status band this paints a horizontal blend between the
 * left and right edge pixels (where only background lives), softens it, then
 * feathers it back into the untouched screen below. The Dynamic Island goes
 * too; the frame draws its own.
 */
import sharp from 'sharp';

/** Status band as a fraction of image height; captures are all iPhone 6.1–6.9". */
const BAND = 0.066;
const FEATHER = 0.018;
/** Sample a little in from each edge so rounded-corner antialiasing is skipped. */
const EDGE = 0.03;

/** Returns a sharp pipeline holding the scrubbed image, ready to encode. */
export async function scrubStatusBar(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
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

  return sharp(out, { raw: { width: w, height: h, channels: c } }).removeAlpha();
}
