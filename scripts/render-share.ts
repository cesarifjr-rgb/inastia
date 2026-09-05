import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { hospitalityArt } from "../src/art.ts";

// Reuse the site's vector artwork, without animation, in the social preview.
const artwork = hospitalityArt("fr")
  .replace(
    'class="hospitality-illustration"',
    'x="538" y="-15" width="665" height="650"',
  )
  .replaceAll("Manrope,Arial,sans-serif", "Arial,sans-serif")
  .replaceAll("Space,Arial,sans-serif", "Arial,sans-serif");
const card = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#f8f3e9"/>
<text x="65" y="93" font-family="Arial,sans-serif" font-size="29" font-weight="600" letter-spacing="5" fill="#17455b">INASTIA</text>
<text x="65" y="132" font-family="Arial,sans-serif" font-size="11" letter-spacing="2" fill="#566973">CONCIERGERIE EN CORSE</text>
<path d="M65 215h52" stroke="#22739b"/>
<text x="65" y="294" font-family="Arial,sans-serif" font-size="44" fill="#17455b">Votre maison.</text>
<text x="65" y="352" font-family="Arial,sans-serif" font-size="44" fill="#22739b">L’esprit au large.</text>
<text x="65" y="558" font-family="Arial,sans-serif" font-size="17" fill="#566973">inastia.fr</text>
${artwork}</svg>`;
await mkdir("public/images", { recursive: true });
await sharp(Buffer.from(card))
  .png({ palette: true, colours: 256, effort: 10, compressionLevel: 9 })
  .toFile("public/images/inastia-share.png");
console.log("Hospitality illustration rendered to the 1200 × 630 social card.");
