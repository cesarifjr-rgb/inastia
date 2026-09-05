import type { Locale } from "./content/pages.ts";
import { picture, t } from "./lib.ts";

export function propertyGallery(locale: Locale): string {
  const properties = [
    { image: "villa_amichi", name: "Villa d’Amichi", location: "Pinarello · Zonza", type: t(locale, "Villa", "Villa") },
    { image: "casa_verde", name: "Casa Verde", location: "Pinarello · Zonza", type: t(locale, "Maison", "House") },
    { image: "villa_lova", name: "Cala Lova", location: "Cala d’Oro · Solenzara", type: t(locale, "Maison de caractère", "Character home") },
  ];
  return `<div class="property-list">${properties.map((property, index) => `<figure class="property-row" data-reveal><span class="property-index">0${index + 1}</span>${picture(property.image, `${property.name} · ${property.location}`, "property-thumb")}<figcaption><span class="eyebrow">${property.type}</span><h3>${property.name}</h3><p>${property.location}</p><a class="property-link" href="/images/${property.image}-1200.webp" data-property="${property.image}" data-property-name="${property.name}" data-property-location="${property.location}">${t(locale, "Voir la photographie", "View photograph")}<span class="sr-only"> — ${property.name}</span></a></figcaption><template id="property-photo-${property.image}"><picture><source type="image/avif" srcset="/images/${property.image}-1200.avif"><img src="/images/${property.image}-1200.webp" alt="${property.name} · ${property.location}" width="1200" height="805" decoding="async"></picture></template></figure>`).join("")}</div>
    <dialog id="property-viewer" class="property-viewer" aria-labelledby="property-viewer-title" aria-describedby="property-viewer-location"><button class="property-viewer-close" type="button" autofocus>${t(locale, "Fermer la photographie", "Close photograph")}</button><div class="property-viewer-media"></div><div class="property-viewer-caption"><h2 id="property-viewer-title"></h2><p id="property-viewer-location"></p></div></dialog>`;
}
