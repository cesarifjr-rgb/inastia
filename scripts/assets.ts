import sharp from "sharp";
import { mkdir, copyFile } from "node:fs/promises";

await mkdir("public/images", { recursive: true });
for (const name of ["villa_amichi", "villa_lova", "casa_verde"]) {
  for (const width of [240, 480, 800, 1200]) {
    const input = sharp(`${name}.webp`).resize({
      width,
      withoutEnlargement: true,
    });
    await Promise.all([
      input
        .clone()
        .avif({ quality: 58, effort: 6 })
        .toFile(`public/images/${name}-${width}.avif`),
      input
        .clone()
        .webp({ quality: 82 })
        .toFile(`public/images/${name}-${width}.webp`),
    ]);
  }
}
// The social image is rendered from the Blender source by scripts/render-share.py.
await mkdir("public/fonts", { recursive: true });
for (const [family, file] of [
  ["space-grotesk", "space-grotesk-latin-wght-normal.woff2"],
  ["manrope", "manrope-latin-wght-normal.woff2"],
]) {
  await copyFile(
    `node_modules/@fontsource-variable/${family}/files/${file}`,
    `public/fonts/${file}`,
  );
}
for (const family of ["space-grotesk", "manrope"]) {
  await copyFile(
    `node_modules/@fontsource-variable/${family}/LICENSE`,
    `public/fonts/${family}-LICENSE.txt`,
  );
}
console.log("Responsive images and licensed local fonts prepared.");
