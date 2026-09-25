import sharp from "sharp";
import { mkdir } from "node:fs/promises";

await mkdir("public/images", { recursive: true });
for (const name of ["real-estate", "home-services", "introductions"]) {
  for (const width of [400, 800]) {
    const image = sharp(`assets/illustrations/inastia-partners-${name}.png`).resize({ width, withoutEnlargement: true });
    await Promise.all([
      image.clone().avif({ quality: 64, effort: 6 }).toFile(`public/images/inastia-partners-${name}-${width}.avif`),
      image.clone().webp({ quality: 86 }).toFile(`public/images/inastia-partners-${name}-${width}.webp`),
    ]);
  }
}
console.log("Responsive partner profile illustrations prepared.");
