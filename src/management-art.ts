import type { Locale } from "./content/pages.ts";
import { t } from "./lib.ts";

export function managementArt(locale: Locale): string {
  const id = `management-art-${locale}`;
  return `<section class="section management-art-section" id="gestion-au-quotidien"><div class="container"><div class="management-art" data-management-art>
    <div class="management-art-heading"><p class="eyebrow">${t(locale, "La gestion, au fil des séjours", "Management through every stay")}</p><h2>${t(locale, "Une réservation.<br>Toute une organisation.", "One booking.<br>So much to coordinate.")}</h2></div>
    <fieldset class="management-art-controls"><legend>${t(locale, "Explorez les trois volets de la gestion", "Explore the three parts of management")}</legend>
      <label><input type="radio" name="${id}" value="listing" checked><span>${t(locale, "Annonce", "Listing")}</span></label>
      <label><input type="radio" name="${id}" value="guests"><span>${t(locale, "Voyageurs", "Guests")}</span></label>
      <label><input type="radio" name="${id}" value="home"><span>${t(locale, "Maison", "Home")}</span></label>
    </fieldset>
    <figure class="management-art-figure"><div class="management-art-scene" aria-hidden="true"><svg class="management-art-house" viewBox="0 0 640 510" focusable="false" aria-hidden="true">
      <defs><linearGradient id="${id}-ground" x2="0.8" y2="1"><stop stop-color="#edf1df"/><stop offset="1" stop-color="#d7dfcf"/></linearGradient><linearGradient id="${id}-water" x2="1" y2="1"><stop stop-color="#93d1d5"/><stop offset="1" stop-color="#4b97b2"/></linearGradient><linearGradient id="${id}-wall" x2="0" y2="1"><stop stop-color="#fffaf3"/><stop offset="1" stop-color="#e3d7c1"/></linearGradient></defs>
      <ellipse cx="328" cy="425" rx="236" ry="49" fill="#17455b" opacity=".07"/>
      <path d="M65 322 332 181 591 323 325 473Z" fill="#b5c4b5"/><path d="M65 308 332 167 591 309 325 459Z" fill="url(#${id}-ground)"/><path d="M65 308v14l260 151v-14Z" fill="#c2cbb9"/><path d="m325 459 266-150v14L325 473Z" fill="#a6b6a8"/>
      <path d="m168 316 166-91 179 99-167 94Z" fill="#ddd0b8"/><g stroke="#cbb99b" stroke-width="1.5" opacity=".75"><path d="m184 325 166-91m-142 105 166-91m-142 105 166-91m-142 105 166-91m-142 105 166-91m-142 105 166-91"/></g>
      <g class="management-art-zone management-art-zone-home"><path d="m384 353 82-45 91 51-83 46Z" fill="#fffaf3"/><path d="m397 354 69-37 77 42-70 38Z" fill="url(#${id}-water)"/><path d="m405 356 61-32 68 37" fill="none" stroke="#d8f2ed" stroke-width="3"/><path d="m437 356 17-9m23 29 17-9m-34-8 13-7" fill="none" stroke="#d8f2ed" stroke-width="2" opacity=".6"/>
      <path d="m179 222 141 78 137-77v108l-136 78-142-79Z" fill="url(#${id}-wall)"/><path d="m320 300 137-77v108l-136 78Z" fill="#cfbfa4"/><path d="m190 238 43 24v60l-43-24Z" fill="#28617a"/><path d="m238 265 62 34v60l-62-35Z" fill="#20536b"/><path d="m269 282 1 59m-73-98v50" stroke="#aac6c5" stroke-width="2"/><path d="m243 269 23 13v49l-23-13Z" fill="#8baead" opacity=".45"/>
      <path d="m340 306 35-20v45l-35 20Zm51-29 36-20v45l-36 20Z" fill="#50717a"/><path d="m344 311 27-15m24-9 28-16" stroke="#b8cdca" stroke-width="3"/>
      <path d="m161 218 153-86 162 89-155 89Z" fill="#b77555"/><path d="m161 218 89-128 152 85-81 135Z" fill="#cb9670"/><path d="m250 90 64 42 162 89-74-46Z" fill="#dfb290"/><path d="m161 218 160 92v8l-160-91Zm160 92 155-89v9l-155 88Z" fill="#925e48"/>
      <g stroke="#b17b59" stroke-width="2" opacity=".7"><path d="m181 229 87-129m-64 142 87-129m-64 142 87-129m-63 142 87-129m-64 142 87-129"/><path d="m186 182 158 88m-141-112 157 88m-140-113 157 88"/></g>
      <path d="m349 172 18-10v-43l-18 10Z" fill="#b78a68"/><path d="m326 116 23 13v43l-23-13Z" fill="#e5c3a0"/><path d="m321 112 23-13 28 16-23 14Z" fill="#fff0d4"/>
      <path d="m198 340 63 34-18 10-63-35Z" fill="#a67853"/><path d="m184 351v17m56 16v16m18-26v17" stroke="#7d654e" stroke-width="4"/>
      <g fill="#647e60"><ellipse cx="116" cy="287" rx="25" ry="16"/><ellipse cx="121" cy="270" rx="20" ry="27"/><ellipse cx="504" cy="277" rx="24" ry="31"/></g><path d="M119 280v49m385-48v34" stroke="#977454" stroke-width="6"/><path d="m100 333 19-10 21 11-20 11Z" fill="#c49b76"/>
      </g>
      <g class="management-art-zone management-art-zone-listing"><path d="m87 138 72-26 0 101-72 26Z" fill="#17455b" opacity=".12" transform="translate(6 9)"/><path d="m82 130 72-26v101l-72 26Z" fill="#fffaf3" stroke="#adc4c9" stroke-width="2"/><path d="m92 138 52-19v35l-52 19Z" fill="#c9e2e9"/><path d="m98 157 13-18 23 9v9l-36 13Z" fill="#6896a5"/><path d="m94 187 46-17m-46 28 34-12m-34 24 42-15" stroke="#47778a" stroke-width="3"/><circle cx="153" cy="107" r="15" fill="#1c6285"/><path d="m147 107 4 4 8-9" fill="none" stroke="#fffaf3" stroke-width="2.5" stroke-linecap="round"/></g>
      <g class="management-art-zone management-art-zone-guests"><path d="m480 158 47-26 40 23v48l-47 27-40-24Z" fill="#f0d49f" opacity=".32"/><circle cx="506" cy="149" r="18" fill="none" stroke="#d7ad64" stroke-width="9"/><path d="m518 163 37 42m-12-13 10-9m-2 18 10-9" fill="none" stroke="#d7ad64" stroke-width="9" stroke-linejoin="round"/><path d="m493 248 49-27 32 18-49 28Z" fill="#fffaf3" stroke="#adc4c9" stroke-width="1.5"/><path d="m493 248 30-2 19-25" fill="none" stroke="#adc4c9" stroke-width="1.5"/></g>
    </svg></div><figcaption>${t(locale, "Illustration de la gestion — cette maison ne représente pas un bien du portfolio.", "Management illustration — this house does not represent a portfolio property.")}</figcaption></figure>
    <div class="management-art-copy">
      <div data-management-copy="listing"><span class="management-art-index" aria-hidden="true">01</span><h3>${t(locale, "Avant la réservation", "Before a booking")}</h3><p>${t(locale, "Une présentation soignée, des prix suivis au fil de la saison et un calendrier à jour. Nous gérons les éléments de votre annonce qui préparent les prochains séjours.", "A considered presentation, pricing reviewed through the season and an up-to-date calendar. We manage the details of your listing ahead of the next stays.")}</p></div>
      <div data-management-copy="guests"><span class="management-art-index" aria-hidden="true">02</span><h3>${t(locale, "Avant et pendant le séjour", "Before and during the stay")}</h3><p>${t(locale, "Les voyageurs ont les informations pour leur arrivée et un interlocuteur pendant leur séjour. Vous n’avez plus à coordonner chaque échange.", "Guests receive their arrival information and have a point of contact during their stay. You no longer have to coordinate every conversation.")}</p></div>
      <div data-management-copy="home"><span class="management-art-index" aria-hidden="true">03</span><h3>${t(locale, "Entre deux séjours", "Between stays")}</h3><p>${t(locale, "La préparation et les vérifications prévues sont organisées sur place. Les anomalies vous sont signalées pour décider des interventions nécessaires.", "The agreed preparation and checks are organised locally. We report any issues so you can decide on the work needed.")}</p></div>
    </div>
  </div></div></section>`;
}
