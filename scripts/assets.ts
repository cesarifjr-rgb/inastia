import sharp from "sharp";
import { mkdir, copyFile } from "node:fs/promises";

await mkdir("public/images", { recursive: true });
for (const name of ["villa_amichi", "villa_lova", "casa_verde"]) {
  for (const width of [480, 800, 1200]) {
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
await sharp("villa_amichi.webp")
  .resize(1200, 630, { fit: "cover" })
  .jpeg({ quality: 85 })
  .toFile("public/images/inastia-share.jpg");
await mkdir("public/fonts", { recursive: true });
for (const [family, file] of [
  ["cormorant-garamond", "cormorant-garamond-latin-wght-normal.woff2"],
  ["cormorant-garamond", "cormorant-garamond-latin-wght-italic.woff2"],
  ["manrope", "manrope-latin-wght-normal.woff2"],
]) {
  await copyFile(
    `node_modules/@fontsource-variable/${family}/files/${file}`,
    `public/fonts/${file}`,
  );
}
for (const family of ["cormorant-garamond", "manrope"]) {
  await copyFile(
    `node_modules/@fontsource-variable/${family}/LICENSE`,
    `public/fonts/${family}-LICENSE.txt`,
  );
}
console.log("Responsive images and licensed local fonts prepared.");
