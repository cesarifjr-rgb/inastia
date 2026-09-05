import type { Locale } from "./content/pages.ts";
import { escape, t } from "./lib.ts";

export const googleProfileUrl = "https://maps.app.goo.gl/cHyBApDad724MUJj6";

// Original excerpts checked on Google on 2026-09-05. Dates refer to visits.
export const googleReviews = [
  {
    author: "lassalas fanny",
    language: "fr",
    visit: { fr: "Octobre 2025", en: "October 2025" },
    quote: "Ce sont des personnes professionnelles, disponibles et consciencieuses. Un grand merci à eux !!",
    url: "https://maps.app.goo.gl/NWxqbPY6JiDXPoW27",
  },
  {
    author: "Virginie BASOGE",
    language: "fr",
    visit: { fr: "Août 2025", en: "August 2025" },
    quote: "excellente communication des les échanges préalables à la réception de la maison, puis en cours de séjour et pour finir au check-out.",
    url: "https://maps.app.goo.gl/zeLuHcYWgf43p4Zj7",
  },
  {
    author: "Josephine Gowans-Eglinton",
    language: "en",
    visit: { fr: "Juin 2025", en: "June 2025" },
    quote: "Communication was excellent during our holiday to Corsica, we really appreciated the prompt and helpful responses and friendly check in.",
    url: "https://maps.app.goo.gl/ekebimLuFs4GkAUe8",
  },
] as const;

export function reviews(locale: Locale): string {
  return `<div class="google-reviews" id="temoignages">
    <div class="reviews-heading"><div><p class="eyebrow">${t(locale, "LE REGARD DES VOYAGEURS", "FROM OUR GUESTS")}</p><h3>${t(locale, "L’accueil, raconté par ceux qui l’ont vécu.", "Hospitality, in our guests’ words.")}</h3></div><div class="rating-summary"><strong>${t(locale, "5,0", "5.0")}<span> / 5</span></strong><span class="review-stars" aria-hidden="true">★★★★★</span><a href="${googleProfileUrl}" target="_blank" rel="noopener noreferrer">${t(locale, "29 avis sur Google", "29 reviews on Google")} <span aria-hidden="true">↗</span><span class="sr-only">${t(locale, "(nouvel onglet)", "(new tab)")}</span></a></div></div>
    <div class="reviews-grid">${googleReviews.map((review) => `<blockquote class="review-card" cite="${review.url}"><span class="review-stars" role="img" aria-label="${t(locale, "5 étoiles sur 5", "5 out of 5 stars")}">★★★★★</span><p class="review-quote" lang="${review.language}">« ${escape(review.quote)} »</p><footer><strong>${escape(review.author)}</strong><span>${t(locale, "Séjour", "Stay")} : ${review.visit[locale]}</span><a href="${review.url}" target="_blank" rel="noopener noreferrer">${t(locale, "Lire cet avis sur Google", "Read this review on Google")} <span aria-hidden="true">↗</span><span class="sr-only">${t(locale, "(nouvel onglet)", "(new tab)")}</span></a></footer></blockquote>`).join("")}</div>
    <p class="reviews-note">${t(locale, "Extraits d’avis de voyageurs, dans leur langue d’origine. Note globale de la fiche Google relevée le 5 septembre 2026.", "Excerpts from guest reviews, in their original language. Overall Google profile rating checked on 5 September 2026.")}</p>
  </div>`;
}
