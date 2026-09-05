import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";

// The same verified Natural Earth outline as the site. See geography.md.
const outline = await readFile("public/images/corsica-outline.svg", "utf8");
const artwork = outline.match(/<path\b[^>]+\/>/)?.[0];
if (!artwork) throw new Error("The Corsica outline must contain a path.");
const card = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#deedf0"/>
<text x="65" y="82" font-family="Arial,sans-serif" font-size="29" font-weight="600" letter-spacing="-1" fill="#123e52">INASTIA</text>
<text x="65" y="112" font-family="Arial,sans-serif" font-size="11" letter-spacing="2" fill="#48636e">CONCIERGERIE FAMILIALE EN CORSE</text>
<path d="M65 145H1135M815 185V535M65 558H1135" stroke="#a4bdc5"/>
<text x="65" y="267" font-family="Arial,sans-serif" font-size="78" letter-spacing="-5" fill="#123e52">Votre location</text>
<text x="65" y="351" font-family="Arial,sans-serif" font-size="78" letter-spacing="-5" fill="#123e52">en Corse.</text>
<text x="65" y="463" font-family="Georgia,serif" font-style="italic" font-size="72" letter-spacing="-4" fill="#123e52">Un relais sur place.</text>
<text x="65" y="599" font-family="Arial,sans-serif" font-size="16" fill="#48636e">De Ghisonaccia à Porto-Vecchio</text>
<text x="1135" y="599" text-anchor="end" font-family="Arial,sans-serif" font-size="16" fill="#123e52">inastia.fr</text>
<text x="850" y="205" font-family="Arial,sans-serif" font-size="12" fill="#48636e">N ↑</text>
<g transform="translate(905 180) scale(.68)">${artwork}</g></svg>`;
await mkdir("public/images", { recursive: true });
await sharp(Buffer.from(card))
  .png({ palette: true, colours: 256, effort: 10, compressionLevel: 9 })
  .toFile("public/images/inastia-share.png");
console.log("Atlas social card rendered at 1200 × 630.");
