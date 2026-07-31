import sharp from "sharp";
import { readdirSync, statSync, writeFileSync } from "fs";
import { join } from "path";

const DIR = "public/hero";
const TARGET_BYTES = 950 * 1024; // aim just under 1MB
const MIN_QUALITY = 55; // floor to avoid visible banding on a luxury hero image

async function encodeAt(buffer, quality) {
  return sharp(buffer)
    .webp({ quality, effort: 6, smartSubsample: true })
    .toBuffer();
}

async function optimize(file) {
  const path = join(DIR, file);
  const original = statSync(path).size;
  const input = await sharp(path).toBuffer();

  let lo = MIN_QUALITY;
  let hi = 90;
  let best = await encodeAt(input, hi);

  if (best.length > TARGET_BYTES) {
    // binary search for highest quality under target, floor at MIN_QUALITY
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      const out = await encodeAt(input, mid);
      if (out.length <= TARGET_BYTES) {
        lo = mid;
        best = out;
      } else {
        hi = mid - 1;
      }
    }
    if (lo === MIN_QUALITY) {
      best = await encodeAt(input, MIN_QUALITY);
    }
  }

  writeFileSync(path, best);
  const after = statSync(path).size;
  console.log(
    `${file}: ${(original / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`
  );
}

const files = readdirSync(DIR).filter((f) => f.endsWith(".webp"));
for (const file of files) {
  await optimize(file);
}
