import type { Locale } from "./content/pages.ts";
import { t } from "./lib.ts";
import { managementNotebook } from "./management-notebook.ts";

export function managementArt(locale: Locale): string {
  const id = `management-art-${locale}`;
  return `<section class="section management-art-section" id="gestion-au-quotidien"><div class="container"><div class="management-art" data-management-art>
    <div class="management-art-heading"><p class="eyebrow">${t(locale, "La gestion, au fil des séjours", "Management through every stay")}</p><h2>${t(locale, "Une réservation.<br>Toute une organisation.", "One booking.<br>So much to coordinate.")}</h2></div>
    <fieldset class="management-art-controls"><legend>${t(locale, "Explorez les trois volets de la gestion", "Explore the three parts of management")}</legend>
      <label><input type="radio" name="${id}" value="listing" checked><span>${t(locale, "Annonce", "Listing")}</span></label>
      <label><input type="radio" name="${id}" value="guests"><span>${t(locale, "Voyageurs", "Guests")}</span></label>
      <label><input type="radio" name="${id}" value="home"><span>${t(locale, "Maison", "Home")}</span></label>
    </fieldset>
    <figure class="management-art-figure"><div class="management-art-scene" aria-hidden="true">${managementNotebook(locale)}</div><figcaption>${t(locale, "Un carnet, trois volets : l’annonce, les voyageurs et la maison.", "One journal, three parts: the listing, the guests and the home.")}</figcaption></figure>
    <div class="management-art-copy">
      <div data-management-copy="listing"><span class="management-art-index" aria-hidden="true">01</span><h3>${t(locale, "Avant la réservation", "Before a booking")}</h3><p>${t(locale, "Nous créons et diffusons l’annonce, ajustons les prix et gérons le calendrier. Les demandes de réservation arrivent chez nous : nous prenons le relais avec les voyageurs.", "We create and publish the listing, adjust prices and manage availability. Booking enquiries come to us, and we take over communication with the guests.")}</p></div>
      <div data-management-copy="guests"><span class="management-art-index" aria-hidden="true">02</span><h3>${t(locale, "Avant et pendant le séjour", "Before and during the stay")}</h3><p>${t(locale, "Nous gérons les messages, les consignes et l’arrivée. Pendant tout le séjour, les voyageurs disposent de notre assistance 24 h/24, 7 j/7.", "We handle messages, instructions and arrivals. Throughout their stay, guests have access to our 24/7 assistance.")}</p></div>
      <div data-management-copy="home"><span class="management-art-index" aria-hidden="true">03</span><h3>${t(locale, "Entre deux séjours", "Between stays")}</h3><p>${t(locale, "Nous organisons le ménage, le linge propre et les réassorts, puis vérifions la maison. En cas de besoin, nous suivons les réparations et les dossiers de dommages.", "We arrange cleaning, fresh linen and restocking, then check the home. When needed, we follow up repairs and damage claims.")}</p></div>
    </div>
  </div></div></section>`;
}
