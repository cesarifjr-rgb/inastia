import sharp from "sharp";
import { mkdir } from "node:fs/promises";

await mkdir("public/images", { recursive: true });
for (const width of [480, 960, 1400]) {
  const image = sharp("assets/illustrations/inastia-management-villa.png").resize({ width, withoutEnlargement: true });
  await Promise.all([
    image.clone().avif({ quality: 62, effort: 6 }).toFile(`public/images/inastia-management-villa-${width}.avif`),
    image.clone().webp({ quality: 86 }).toFile(`public/images/inastia-management-villa-${width}.webp`),
  ]);
}
console.log("Responsive management villa illustrations prepared.");
