import sharp from "sharp";
import { mkdir } from "node:fs/promises";

await mkdir("public/images", { recursive: true });
for (const width of [480, 800, 1122]) {
  const image = sharp("assets/illustrations/inastia-private-concierge.png").resize({ width, withoutEnlargement: true });
  await Promise.all([
    image.clone().avif({ quality: 64, effort: 6 }).toFile(`public/images/inastia-private-concierge-${width}.avif`),
    image.clone().webp({ quality: 86 }).toFile(`public/images/inastia-private-concierge-${width}.webp`),
  ]);
}
console.log("Responsive private concierge illustrations prepared.");
