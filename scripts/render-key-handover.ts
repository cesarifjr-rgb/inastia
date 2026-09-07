import sharp from "sharp";
import { mkdir } from "node:fs/promises";

await mkdir("public/images", { recursive: true });
for (const width of [480, 960, 1400]) {
  const image = sharp("assets/illustrations/inastia-family-pool-welcome.png").resize({ width, withoutEnlargement: true });
  await Promise.all([
    image.clone().avif({ quality: 64, effort: 6 }).toFile(`public/images/inastia-family-pool-welcome-${width}.avif`),
    image.clone().webp({ quality: 88 }).toFile(`public/images/inastia-family-pool-welcome-${width}.webp`),
  ]);
}
console.log("Responsive key handover illustrations prepared.");
