import type { Locale } from "./content/pages.ts";
import { t } from "./lib.ts";

export function managementArt(locale: Locale): string {
  const id = `management-art-${locale}`;
  const image = "/images/inastia-family-pool-welcome";
  const sizes = "(min-width: 1440px) 740px, (min-width: 761px) calc(60vw - 77px), (min-width: 640px) 580px, calc(100vw - 48px)";
  return `<section class="section management-art-section" id="gestion-au-quotidien"><div class="container"><div class="management-art" data-management-art>
    <div class="management-art-heading"><p class="eyebrow">${t(locale, "La gestion, au fil des séjours", "Management through every stay")}</p><h2>${t(locale, "Une réservation.<br>Toute une organisation.", "One booking.<br>So much to coordinate.")}</h2></div>
    <fieldset class="management-art-controls"><legend>${t(locale, "Explorez les trois volets de la gestion", "Explore the three parts of management")}</legend>
      <label><input type="radio" name="${id}" value="listing" checked><span>${t(locale, "Annonce", "Listing")}</span></label>
      <label><input type="radio" name="${id}" value="guests"><span>${t(locale, "Voyageurs", "Guests")}</span></label>
      <label><input type="radio" name="${id}" value="home"><span>${t(locale, "Maison", "Home")}</span></label>
    </fieldset>
    <figure class="management-art-figure"><div class="management-art-scene" aria-hidden="true"><picture class="management-art-welcome"><source type="image/avif" srcset="${image}-480.avif 480w, ${image}-960.avif 960w, ${image}-1400.avif 1400w" sizes="${sizes}"><img src="${image}-960.webp" srcset="${image}-480.webp 480w, ${image}-960.webp 960w, ${image}-1400.webp 1400w" sizes="${sizes}" width="1402" height="1122" alt="" loading="lazy" decoding="async"></picture><svg class="management-art-diagrams" viewBox="0 0 640 510" fill="none" focusable="false" aria-hidden="true">
      <g class="management-art-zone management-art-zone-listing management-art-diagram" data-management-diagram="listing" transform="translate(8 -37) scale(.42)">
        <rect x="47" y="151" width="132" height="142" rx="16" fill="#17455b" opacity=".1"/>
        <rect x="42" y="144" width="132" height="142" rx="16" fill="#fffaf3" stroke="#adc4c9" stroke-width="2"/>
        <path d="M58 144h100a16 16 0 0 1 16 16v20H42v-20a16 16 0 0 1 16-16Z" fill="#c9e2e9"/>
        <path d="M76 135v20m64-20v20" stroke="#1c6285" stroke-width="5" stroke-linecap="round"/>
        <g fill="#d8e3e3"><rect x="61" y="198" width="19" height="19" rx="4"/><rect x="95" y="198" width="19" height="19" rx="4"/><rect x="129" y="198" width="19" height="19" rx="4"/><rect x="61" y="232" width="19" height="19" rx="4"/><rect x="95" y="232" width="19" height="19" rx="4"/><rect x="129" y="232" width="19" height="19" rx="4"/></g>
        <g class="management-diagram-motion management-calendar-marker" data-management-motion="listing"><rect x="61" y="198" width="19" height="19" rx="4" fill="#1c6285"/><path d="m65 207 4 4 7-8" stroke="#fffaf3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></g>
      </g>
      <g class="management-art-zone management-art-zone-guests management-art-diagram" data-management-diagram="guests" transform="translate(337 -28) scale(.45)">
        <path d="M469 119h105a13 13 0 0 1 13 13v42a13 13 0 0 1-13 13h-67l-23 18v-18h-15a13 13 0 0 1-13-13v-42a13 13 0 0 1 13-13Z" fill="#17455b" opacity=".1" transform="translate(4 6)"/>
        <path d="M469 119h105a13 13 0 0 1 13 13v42a13 13 0 0 1-13 13h-67l-23 18v-18h-15a13 13 0 0 1-13-13v-42a13 13 0 0 1 13-13Z" fill="#fffaf3" stroke="#adc4c9" stroke-width="2"/>
        <path d="M476 141h66m-66 16h43" stroke="#86aab7" stroke-width="5" stroke-linecap="round"/>
        <g class="management-diagram-motion management-guest-reply" data-management-motion="guests"><path d="M496 208h91a12 12 0 0 1 12 12v30a12 12 0 0 1-12 12h-10v16l-23-16h-58a12 12 0 0 1-12-12v-30a12 12 0 0 1 12-12Z" fill="#1c6285"/><g fill="#f8f3e9"><circle cx="518" cy="235" r="4"/><circle cx="542" cy="235" r="4"/><circle cx="566" cy="235" r="4"/></g></g>
      </g>
      <g class="management-art-zone management-art-zone-home management-art-diagram" data-management-diagram="home" transform="translate(-3 280) scale(.43)">
        <rect x="72" y="346" width="137" height="126" rx="14" fill="#17455b" opacity=".1"/>
        <rect x="67" y="340" width="137" height="126" rx="14" fill="#fffaf3" stroke="#adc4c9" stroke-width="2"/>
        <rect x="107" y="331" width="57" height="18" rx="7" fill="#d8b88b"/>
        <g stroke="#aec5c9" stroke-width="3" stroke-linecap="round"><path d="M119 373h61m-61 29h49m-49 29h57"/><rect x="85" y="366" width="16" height="16" rx="4"/><rect x="85" y="395" width="16" height="16" rx="4"/><rect x="85" y="424" width="16" height="16" rx="4"/></g>
        <g class="management-diagram-motion management-home-check" data-management-motion="home"><circle cx="195" cy="439" r="24" fill="#1c6285"/><path d="m183 439 8 8 15-17" stroke="#fffaf3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g>
      </g>
    </svg></div><figcaption>${t(locale, "Illustration de l’accueil — maison et personnages imaginaires.", "Welcome illustration — an imaginary house and characters.")}</figcaption></figure>
    <div class="management-art-copy">
      <div data-management-copy="listing"><span class="management-art-index" aria-hidden="true">01</span><h3>${t(locale, "Avant la réservation", "Before a booking")}</h3><p>${t(locale, "Nous créons et diffusons l’annonce, ajustons les prix et gérons le calendrier. Les demandes de réservation arrivent chez nous : nous prenons le relais avec les voyageurs.", "We create and publish the listing, adjust prices and manage availability. Booking enquiries come to us, and we take over communication with the guests.")}</p></div>
      <div data-management-copy="guests"><span class="management-art-index" aria-hidden="true">02</span><h3>${t(locale, "Avant et pendant le séjour", "Before and during the stay")}</h3><p>${t(locale, "Nous gérons les messages, les consignes et l’arrivée. Pendant tout le séjour, les voyageurs disposent de notre assistance 24 h/24, 7 j/7.", "We handle messages, instructions and arrivals. Throughout their stay, guests have access to our 24/7 assistance.")}</p></div>
      <div data-management-copy="home"><span class="management-art-index" aria-hidden="true">03</span><h3>${t(locale, "Entre deux séjours", "Between stays")}</h3><p>${t(locale, "Nous organisons le ménage, le linge propre et les réassorts, puis vérifions la maison. En cas de besoin, nous suivons les réparations et les dossiers de dommages.", "We arrange cleaning, fresh linen and restocking, then check the home. When needed, we follow up repairs and damage claims.")}</p></div>
    </div>
  </div></div></section>`;
}
