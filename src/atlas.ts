import type { Locale } from "./content/pages.ts";
import { arrow, path, t } from "./lib.ts";

// geo.api.gouv.fr communal centres, retrieved 2026-09-05.
// Coordinates use the same projection as corsica-outline.svg; see geography.md.
const places = [
  { label: "Ghisonaccia", commune: "Ghisonaccia", slug: "conciergerie-ghisonaccia", x: 206.63, y: 304.28 },
  { label: "Solenzara", commune: "Sari-Solenzara", slug: "conciergerie-location-saisonniere-solenzara", x: 188.70, y: 373.64 },
  { label: "Zonza · Pinarello", commune: "Zonza", slug: "conciergerie-airbnb-zonza-pinarello", x: 173.49, y: 404.46 },
  { label: "Lecci · Saint-Cyprien", commune: "Lecci", slug: "conciergerie-airbnb-lecci-saint-cyprien", x: 182.11, y: 421.14 },
  { label: "Porto-Vecchio", commune: "Porto-Vecchio", slug: "conciergerie-airbnb-porto-vecchio", x: 173.78, y: 443.70 },
] as const;

export function heroAtlas(locale: Locale): string {
  return `<div class="hero-atlas">
    <span class="atlas-north" aria-hidden="true">N ↑</span>
    <svg class="atlas-silhouette" viewBox="0 0 248.21 520" aria-hidden="true"><image href="/images/corsica-outline.svg" width="248.21" height="520"/>${places.map((place, index) => `<g><circle cx="${place.x}" cy="${place.y}" r="3.5" fill="currentColor"/><text x="${place.x - 9}" y="${place.y + 3}" text-anchor="end" font-size="10" fill="currentColor">${index + 1}</text></g>`).join("")}</svg>
    <nav class="atlas-index" aria-label="${t(locale, "Nos secteurs en Corse", "Our areas in Corsica")}">${places.map((place, index) => `<a href="${path(locale, place.slug)}"><span class="atlas-number" aria-hidden="true">0${index + 1}</span><span>${place.label.split(" · ")[0]}${place.label.includes(" · ") || place.label === "Solenzara" ? `<small>${place.label.split(" · ")[1] ?? place.commune}</small>` : ""}</span></a>`).join("")}</nav>
    <p class="atlas-caption">${t(locale, "Repères des communes de la côte est.<br>Votre adresse permet de confirmer les prestations possibles.", "Reference points along the east coast.<br>Your address helps us confirm the services available.")}</p>
  </div>`;
}

export function territoryAtlas(locale: Locale): string {
  const titleId = `territory-atlas-title-${locale}`;
  const descriptionId = `territory-atlas-description-${locale}`;
  return `<div class="territory-atlas">
    <figure class="atlas-map">
      <svg viewBox="0 0 248.21 520" role="img" aria-labelledby="${titleId} ${descriptionId}">
        <title id="${titleId}">${t(locale, "Corse : cinq repères communaux", "Corsica: five municipal reference points")}</title>
        <desc id="${descriptionId}">${t(locale, "Les numéros indiquent les centres communaux de Ghisonaccia, Sari-Solenzara, Zonza, Lecci et Porto-Vecchio, dans cet ordre. Les liens correspondants figurent dans la liste.", "The numbers mark the municipal centres of Ghisonaccia, Sari-Solenzara, Zonza, Lecci and Porto-Vecchio, in that order. Corresponding links are provided in the list.")}</desc>
        <image href="/images/corsica-outline.svg" width="248.21" height="520" aria-hidden="true"/>
        ${places.map((place, index) => `<g class="atlas-point" data-place="${index + 1}" aria-hidden="true"><circle cx="${place.x}" cy="${place.y}" r="4" fill="currentColor"/><text x="${place.x - 10}" y="${place.y + 3}" text-anchor="end" font-size="10" fill="currentColor">${index + 1}</text></g>`).join("")}
      </svg>
      <figcaption>${t(locale, "Repères des communes. Votre adresse permet de confirmer les prestations possibles.", "Municipal reference points. Your address helps us confirm which services are available.")}</figcaption>
    </figure>
    <ol class="atlas-localities">${places.map((place, index) => `<li><a href="${path(locale, place.slug)}"><span class="atlas-number" aria-hidden="true">0${index + 1}</span><span class="atlas-place"><span class="atlas-place-name">${place.label}</span><span class="atlas-commune">${t(locale, "Repère communal :", "Municipal reference:")} ${place.commune}</span></span>${arrow}</a></li>`).join("")}</ol>
    <details class="atlas-sources"><summary>${t(locale, "Sources cartographiques", "Map sources")}</summary><p>${t(locale, "Contour simplifié de l’île principale :", "Simplified main-island outline:")} <a href="https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-land/">Natural Earth</a> (${t(locale, "domaine public", "public domain")}). ${t(locale, "Centres communaux :", "Municipal centres:")} <a href="https://geo.api.gouv.fr/decoupage-administratif/communes">geo.api.gouv.fr</a>, ${t(locale, "consultés le 5 septembre 2026", "accessed 5 September 2026")}, <a href="https://www.data.gouv.fr/pages/legal/licences/etalab-2.0">Licence Ouverte 2.0</a>. ${t(locale, "Ces points ne localisent pas les lieux-dits et ne délimitent pas une zone de desserte.", "These points do not locate individual localities or define a service boundary.")}</p></details>
  </div>`;
}
