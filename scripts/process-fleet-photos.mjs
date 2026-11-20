/**
 * Process naimatullah's real fleet photos → /public/fleet/real/ as optimized WebP.
 * Renames descriptively for SEO alt-text purposes.
 */
import sharp from 'sharp';
import { readdir, mkdir, copyFile } from 'fs/promises';
import { join, basename } from 'path';

const SRC = 'drivers/naimatullah/vehicles';
const DEST = 'public/fleet/real';

// Map source filenames → descriptive SEO-friendly names
// Based on manual inspection of each photo
const PHOTO_MAP = {
  'WhatsApp Image 2026-07-27 at 10.55.46 PM.jpeg': 'mercedes-v-class-fleet-lineup.webp',
  'WhatsApp Image 2026-07-27 at 10.55.42 PM.jpeg': 'mercedes-sprinter-vip-exterior.webp',
  'WhatsApp Image 2026-07-27 at 10.55.42 PM (1).jpeg': 'mercedes-sprinter-vip-exterior-2.webp',
  'WhatsApp Image 2026-07-27 at 10.55.42 PM (2).jpeg': 'mercedes-sprinter-vip-exterior-3.webp',
  'WhatsApp Image 2026-07-27 at 10.55.45 PM (1).jpeg': 'mercedes-sprinter-vip-interior-tan.webp',
  'WhatsApp Image 2026-07-27 at 10.55.44 PM (2).jpeg': 'mercedes-sprinter-vip-interior-front.webp',
  'WhatsApp Image 2026-07-27 at 10.55.45 PM (2).jpeg': 'mercedes-sprinter-vip-interior-side.webp',
  'WhatsApp Image 2026-07-27 at 10.55.45 PM (3).jpeg': 'mercedes-sprinter-vip-interior-ceiling.webp',
  'WhatsApp Image 2026-07-27 at 10.55.43 PM (1).jpeg': 'mercedes-sprinter-vip-interior-pink.webp',
  'WhatsApp Image 2026-07-27 at 10.55.43 PM.jpeg': 'mercedes-sprinter-vip-interior-dark.webp',
  'WhatsApp Image 2026-07-27 at 10.55.43 PM (2).jpeg': 'mercedes-sprinter-vip-interior-seats.webp',
  'WhatsApp Image 2026-07-27 at 10.55.47 PM (2).jpeg': 'mercedes-s-class-exterior-night.webp',
  'WhatsApp Image 2026-07-27 at 10.55.48 PM (1).jpeg': 'mercedes-s-class-interior-luxury.webp',
  'WhatsApp Image 2026-07-27 at 10.55.48 PM.jpeg': 'mercedes-s-class-interior-rear.webp',
  'WhatsApp Image 2026-07-27 at 10.55.47 PM (1).jpeg': 'mercedes-v-class-exterior-side.webp',
  'WhatsApp Image 2026-07-27 at 10.55.47 PM.jpeg': 'mercedes-v-class-exterior-angle.webp',
  'WhatsApp Image 2026-07-27 at 10.55.47 PM (3).jpeg': 'mercedes-v-class-front.webp',
  'WhatsApp Image 2026-07-27 at 10.55.44 PM (1).jpeg': 'vip-van-interior-overview.webp',
  'WhatsApp Image 2026-07-27 at 10.55.44 PM.jpeg': 'vip-van-interior-detail.webp',
  'WhatsApp Image 2026-07-27 at 10.55.45 PM.jpeg': 'vip-van-interior-rear.webp',
  'WhatsApp Image 2026-07-27 at 10.55.46 PM (1).jpeg': 'vip-van-interior-wide.webp',
  'WhatsApp Image 2026-07-26 at 5.12.28 PM.jpeg': 'hyundai-staria-exterior.webp',
  'WhatsApp Image 2026-07-26 at 5.12.29 PM.jpeg': 'hyundai-staria-exterior-2.webp',
  'WhatsApp Image 2026-07-26 at 4.55.46 PM.jpeg': 'fleet-vehicle-exterior.webp',
  'WhatsApp Image 2026-07-29 at 10.17.10 AM.jpeg': 'fleet-vehicle-latest.webp',
};

async function main() {
  await mkdir(DEST, { recursive: true });
  const files = await readdir(SRC);
  let processed = 0;

  for (const file of files) {
    const destName = PHOTO_MAP[file];
    if (!destName) {
      console.log(`⏭ Skipping unmapped: ${file}`);
      continue;
    }

    const src = join(SRC, file);
    const dest = join(DEST, destName);

    try {
      await sharp(src)
        .resize({ width: 1280, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(dest);
      processed++;
      console.log(`✅ ${file} → ${destName}`);
    } catch (err) {
      console.error(`❌ ${file}: ${err.message}`);
    }
  }

  console.log(`\nDone: ${processed}/${files.length} photos processed to ${DEST}`);
}

main();
