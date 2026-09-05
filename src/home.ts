import type { Locale } from "./content/pages.ts";
import { arrow, path, picture, t } from "./lib.ts";
import { contactCallout, faq, zones } from "./components.ts";

export function home(locale: Locale): string {
  const services =
    locale === "fr"
      ? [
          {
            name: "Tout déléguer.",
            subtitle: "Gestion complète",
            text: "De l’annonce au départ des voyageurs, nous coordonnons la location de votre bien. Vous gardez la visibilité, nous prenons soin du quotidien.",
            slug: "gestion-airbnb-corse-du-sud",
            detail: "Annonce · Réservations · Séjours · Suivi",
          },
          {
            name: "Bien commencer.",
            subtitle: "Lancement & gestion d’annonce",
            text: "Un regard sur votre logement, une annonce soignée et des bases claires pour le mettre en location ou lui donner un nouvel élan.",
            slug: "pack-lancement-airbnb",
            detail: "Audit · Présentation · Mise en ligne",
          },
          {
            name: "Être bien entouré.",
            subtitle: "Accueil & rotation séjour",
            text: "Vous gérez vos réservations. Sur place, nous coordonnons l’accueil, le ménage et le linge entre deux séjours, selon vos besoins.",
            slug: "menage-airbnb-corse-du-sud",
            detail: "Accueil · Ménage · Linge · Contrôle",
          },
        ]
      : [
          {
            name: "Leave it with us.",
            subtitle: "Full management",
            text: "From the listing to the last goodbye, we coordinate your holiday rental. You stay informed while we look after the day to day.",
            slug: "gestion-airbnb-corse-du-sud",
            detail: "Listing · Bookings · Stays · Follow-up",
          },
          {
            name: "Start well.",
            subtitle: "Listing launch & management",
            text: "A fresh look at your property, a carefully prepared listing and a clear starting point for your first rental or a new chapter.",
            slug: "pack-lancement-airbnb",
            detail: "Review · Presentation · Launch",
          },
          {
            name: "Have help nearby.",
            subtitle: "Guest welcome & changeovers",
            text: "You manage your bookings. On the ground, we coordinate guest arrivals, cleaning and linen between stays, as you need them.",
            slug: "menage-airbnb-corse-du-sud",
            detail: "Welcome · Cleaning · Linen · Checks",
          },
        ];
  const questions =
    locale === "fr"
      ? [
          {
            question: "Quel accompagnement choisir pour mon bien ?",
            answer:
              "La gestion complète réunit le suivi de l’annonce et des séjours. Le lancement prépare votre mise en location. L’accueil et la rotation séjour vous apportent un relais local si vous gardez la main sur les réservations. Nous en parlons ensemble lors de l’audit gratuit.",
          },
          {
            question: "Comment sont fixés vos tarifs ?",
            answer:
              "Ils dépendent de votre bien, de sa localisation, de la saison et des prestations retenues. La gestion complète fonctionne avec une commission sur les revenus locatifs. Les montants et les éventuels frais complémentaires sont précisés dans la proposition et le contrat.",
          },
          {
            question: "Puis-je continuer à profiter de ma maison ?",
            answer:
              "Oui. Vos périodes d’occupation personnelle sont définies et bloquées dans le calendrier, en tenant compte des réservations déjà confirmées et des modalités convenues ensemble.",
          },
          {
            question: "Mon logement se trouve-t-il dans votre secteur ?",
            answer:
              "Nous intervenons sur la côte est de la Corse, de Ghisonaccia à Porto-Vecchio, notamment à Solenzara, Pinarello et Saint-Cyprien. Indiquez-nous votre commune pour confirmer les prestations possibles à votre adresse.",
          },
          {
            question: "Que comprend le premier audit gratuit ?",
            answer:
              "Une première analyse du potentiel locatif et des améliorations prioritaires, à partir des informations sur votre bien et de votre situation actuelle. Il permet de définir le niveau d’accompagnement pertinent, sans promesse de revenu garanti.",
          },
        ]
      : [
          {
            question: "Which level of support suits my property?",
            answer:
              "Full management covers both your listing and stays. Our launch service prepares your rental. Guest welcome and changeovers give you local support while you manage bookings. We discuss your needs during the free review.",
          },
          {
            question: "How do you set your fees?",
            answer:
              "Fees depend on your property, its location, the season and the services you choose. Full management is based on a commission on rental income. Amounts and any additional costs are set out in the proposal and agreement.",
          },
          {
            question: "Can I still use my own home?",
            answer:
              "Yes. We plan and block your own stays in the calendar, taking confirmed bookings and the arrangements agreed together into account.",
          },
          {
            question: "Is my property within your area?",
            answer:
              "We work along the east coast of Corsica, from Ghisonaccia to Porto-Vecchio, including Solenzara, Pinarello and Saint-Cyprien. Share your town so we can confirm the services available at your address.",
          },
          {
            question: "What does the free property review include?",
            answer:
              "An initial review of your rental potential and priorities, based on your property details and current situation. It helps identify the right support, without a guarantee of rental income.",
          },
        ];
  return `<section class="home-hero"><div class="hero-copy"><p class="eyebrow"><span class="tiny-sun" aria-hidden="true">✳</span> ${t(locale, "CONCIERGERIE EN CORSE", "PROPERTY CARE IN CORSICA")}</p><h1>${t(locale, "Votre maison.<br><em>L’esprit libre.</em>", "Your home.<br><em>Peace of mind.</em>")}</h1><p class="hero-description">${t(locale, "Une maison à louer. Des voyageurs à accueillir. Et pour vous, le plaisir de déléguer à une conciergerie familiale, ici, en Corse.", "A home to share. Guests to welcome. And for you, the freedom of trusting a family-run property service, here in Corsica.")}</p><a class="button" href="${path(locale, "contact")}">${t(locale, "Confiez-nous votre projet", "Tell us about your property")}${arrow}</a><a class="hero-secondary" href="#services">${t(locale, "Découvrir notre accompagnement", "Explore our services")} <span aria-hidden="true">↓</span></a><div class="hero-location"><span class="location-line" aria-hidden="true"></span><span>${t(locale, "DE GHISONACCIA<br>À PORTO-VECCHIO", "FROM GHISONACCIA<br>TO PORTO-VECCHIO")}</span></div></div><figure class="hero-figure">${picture("villa_amichi", t(locale, "La piscine et la terrasse en pierre de la Villa d’Amichi, à Pinarello", "The pool and stone terrace of Villa d’Amichi in Pinarello"), "hero-photo", true)}<figcaption><span>Villa d’Amichi</span><span>Pinarello, Corse <span aria-hidden="true">↗</span></span></figcaption><span class="image-side-note" aria-hidden="true">L’ART DE RECEVOIR, L’ESPRIT CORSE.</span></figure></section>
  <section class="intro-strip"><div class="container intro-grid"><p class="eyebrow">${t(locale, "PROPRIÉTAIRES, AVANT TOUT", "A PERSONAL APPROACH")}</p><p>${t(locale, "Votre maison a son histoire.<br>Notre rôle : <em>en prendre soin.</em>", "Every home has a story.<br>Our role: <em>to care for yours.</em>")}</p><span>${t(locale, "De la première annonce au dernier départ, un accompagnement à la mesure de votre bien et de votre façon de louer.", "From the first listing to the last departure, support shaped around your property and the way you want to rent it.")}</span></div></section>
  <span id="formules" class="legacy-anchor" aria-hidden="true"></span><span id="comparaison" class="legacy-anchor" aria-hidden="true"></span><section class="section services-section" id="services"><div class="container"><div class="section-heading"><div><p class="eyebrow">${t(locale, "01 — L’ACCOMPAGNEMENT", "01 — OUR SERVICES")}</p><h2>${t(locale, "À chaque maison,<br><em>sa façon de déléguer.</em>", "Your home.<br><em>Your way of letting go.</em>")}</h2></div><p>${t(locale, "Vous choisissez ce que vous souhaitez confier. Nous définissons ensemble le reste.", "You choose what you want to hand over. We work out the details together.")}</p></div><div class="service-list">${services.map((service, i) => `<a class="service-row" href="${path(locale, service.slug)}"><span class="service-number">0${i + 1}</span><div class="service-title"><span class="eyebrow">${service.subtitle}</span><h3>${service.name}</h3></div><div class="service-description"><p>${service.text}</p><span>${service.detail}</span></div><span class="circle-arrow">${arrow}</span></a>`).join("")}</div><p class="service-note">${t(locale, "Une proposition sur mesure, des prestations et des tarifs précisés avant de commencer.", "A tailored proposal, with services and fees agreed before we begin.")}</p></div></section>
  <span id="resultats" class="legacy-anchor" aria-hidden="true"></span><span id="temoignages" class="legacy-anchor" aria-hidden="true"></span><section class="section portfolio-section" id="portfolio"><div class="container"><div class="section-heading"><div><p class="eyebrow">${t(locale, "02 — DES MAISONS, DES HISTOIRES", "02 — HOMES WITH A STORY")}</p><h2>${t(locale, "Des lieux singuliers.<br><em>Une même attention.</em>", "Individual homes.<br><em>The same care.</em>")}</h2></div><p>${t(locale, "Un aperçu des maisons qui font partie de l’univers Inastia. Derrière chaque séjour, le soin des détails.", "A glimpse of the homes in the Inastia portfolio. Behind every stay, attention to the details.")}</p></div><div class="portfolio-grid"><figure class="property property-main">${picture("villa_amichi", t(locale, "Villa d’Amichi : terrasse et piscine à Pinarello", "Villa d’Amichi: terrace and pool in Pinarello"))}<figcaption><div><h3>Villa d’Amichi</h3><p>Pinarello · Zonza</p></div><span>${t(locale, "Villa", "Villa")} <span aria-hidden="true">01</span></span></figcaption></figure><figure class="property">${picture("casa_verde", t(locale, "Casa Verde, maison du portfolio Inastia à Pinarello", "Casa Verde, an Inastia portfolio home in Pinarello"))}<figcaption><div><h3>Casa Verde</h3><p>Pinarello · Zonza</p></div><span>${t(locale, "Maison", "House")} <span aria-hidden="true">02</span></span></figcaption></figure><figure class="property">${picture("villa_lova", t(locale, "Villa Lova et sa piscine à la nuit tombée, Cala d’Oro", "Villa Lova and its pool at dusk in Cala d’Oro"))}<figcaption><div><h3>Villa Lova</h3><p>Cala d’Oro · Solenzara</p></div><span>${t(locale, "Maison de caractère", "Character home")} <span aria-hidden="true">03</span></span></figcaption></figure></div></div></section>
  <section class="story-section"><div class="story-image">${picture("casa_verde", t(locale, "La terrasse de Casa Verde à Pinarello", "The terrace of Casa Verde in Pinarello"))}</div><div class="story-copy"><p class="eyebrow">${t(locale, "UNE CONCIERGERIE FAMILIALE", "A FAMILY-RUN CONCIERGE SERVICE")}</p><h2>${t(locale, "D’ici.<br><em>Et à vos côtés.</em>", "From here.<br><em>Here for you.</em>")}</h2><p>${t(locale, "Inastia est née d’une conviction simple : une maison se confie à des personnes, autant qu’à un savoir-faire.", "Inastia grew from a simple belief: entrusting a home is about the people as much as their expertise.")}</p><p>${t(locale, "Notre ancrage en Corse nourrit notre manière de recevoir, de suivre votre bien et d’être présents quand vous ne l’êtes pas.", "Our Corsican roots shape the way we welcome guests, look after your property and stay close when you are away.")}</p><a class="text-link" href="${path(locale, "about")}">${t(locale, "Découvrir l’esprit Inastia", "Discover the Inastia approach")}${arrow}</a></div></section>
  <section class="section process-section" id="processus"><div class="container"><div class="section-heading"><div><p class="eyebrow">${t(locale, "03 — LE PREMIER PAS", "03 — GETTING STARTED")}</p><h2>${t(locale, "Faire connaissance.<br><em>Puis faire confiance.</em>", "Get to know us.<br><em>Then make yourself at home.</em>")}</h2></div><a class="text-link" href="${path(locale, "audit-gratuit-potentiel-locatif")}">${t(locale, "Ce que comprend l’audit gratuit", "What our free review covers")}${arrow}</a></div><ol class="process-list">${(locale ===
  "fr"
    ? [
        [
          "Parlons de votre bien",
          "Sa localisation, son histoire, vos attentes et vos périodes de présence. Nous commençons par vous écouter.",
        ],
        [
          "Dessinons l’accompagnement",
          "Un audit du potentiel, les priorités à travailler et une proposition détaillée. Vous savez ce qui est prévu.",
        ],
        [
          "Préparons les premiers séjours",
          "Une fois le cadre convenu, nous organisons l’annonce et les prestations retenues. Votre projet prend vie.",
        ],
      ]
    : [
        [
          "Tell us about your home",
          "Its location, its character, your plans and your own stays. We start by listening.",
        ],
        [
          "Find the right support",
          "An initial review, clear priorities and a detailed proposal. You know what is included.",
        ],
        [
          "Prepare for the first guests",
          "Once the arrangements are agreed, we prepare the listing and the services you have chosen. Your plans take shape.",
        ],
      ]
  )
    .map(
      ([title, text], i) =>
        `<li><span class="step-index">0${i + 1}</span><h3>${title}</h3><p>${text}</p></li>`,
    )
    .join("")}</ol></div></section>
  <section class="section territory-section" id="zone"><div class="container territory-grid"><div class="territory-copy"><p class="eyebrow">${t(locale, "04 — NOTRE TERRITOIRE", "04 — OUR REGION")}</p><h2>${t(locale, "La côte est.<br><em>Notre point d’ancrage.</em>", "The east coast.<br><em>Where we belong.</em>")}</h2><p>${t(locale, "De Ghisonaccia à Porto-Vecchio, nous accompagnons les propriétaires sur un territoire que nous connaissons au quotidien.", "From Ghisonaccia to Porto-Vecchio, we support homeowners in the places we know day by day.")}</p><p class="territory-note">${t(locale, "Également : Prunelli-di-Fiumorbo, Ventiseri, Solaro et Conca. Les prestations sont confirmées selon votre adresse.", "Also: Prunelli-di-Fiumorbo, Ventiseri, Solaro and Conca. Available services are confirmed for your address.")}</p></div><div class="zone-list">${zones.map(([name, slug], i) => `<a href="${path(locale, slug)}"><span class="zone-index">0${i + 1}</span><span>${name}</span>${arrow}</a>`).join("")}<span class="coast-caption">${t(locale, "CORSE · MER TYRRHÉNIENNE", "CORSICA · TYRRHENIAN SEA")}</span></div></div></section>
  ${faq(locale, questions)}${contactCallout(locale)}`;
}
