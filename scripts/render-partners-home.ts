import sharp from "sharp";
import { mkdir } from "node:fs/promises";

await mkdir("public/images", { recursive: true });
for (const width of [480, 800, 1122]) {
  const image = sharp("assets/illustrations/inastia-partners-home.png").resize({ width, withoutEnlargement: true });
  await Promise.all([
    image.clone().avif({ quality: 64, effort: 6 }).toFile(`public/images/inastia-partners-home-${width}.avif`),
    image.clone().webp({ quality: 86 }).toFile(`public/images/inastia-partners-home-${width}.webp`),
  ]);
}
console.log("Responsive partners home illustrations prepared.");
