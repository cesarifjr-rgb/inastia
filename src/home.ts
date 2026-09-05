import type { Locale } from "./content/pages.ts";
import { arrow, path, picture, t } from "./lib.ts";
import { contactCallout, faq, zones } from "./components.ts";
import { contours, serviceArt, coastFallback } from "./art.ts";

export function home(locale: Locale): string {
  const services =
    locale === "fr"
      ? [
          {
            label: "Gestion complète",
            title: "Le quotidien.<br>Sans vous.",
            text: "Annonce, réservations, voyageurs et prestations sur place. Nous coordonnons votre location ; vous gardez la vue sur votre bien.",
            slug: "gestion-airbnb-corse-du-sud",
            link: "Déléguer la gestion",
          },
          {
            label: "Lancement & gestion d’annonce",
            title: "Le bon départ.<br>Dès l’annonce.",
            text: "Un regard sur votre logement, une annonce qui lui ressemble, des prix et un calendrier préparés. Les bonnes bases pour accueillir.",
            slug: "pack-lancement-airbnb",
            link: "Préparer mon lancement",
          },
          {
            label: "Accueil & rotation séjour",
            title: "Sur place.<br>À votre place.",
            text: "Vous gérez les réservations. Nous coordonnons les arrivées, le ménage et le linge entre deux séjours, selon vos besoins.",
            slug: "menage-airbnb-corse-du-sud",
            link: "Trouver mon relais local",
          },
        ]
      : [
          {
            label: "Full management",
            title: "The daily work.<br>Off your hands.",
            text: "Listings, bookings, guests and services on the ground. We coordinate your rental while you keep a clear view of your home.",
            slug: "gestion-airbnb-corse-du-sud",
            link: "Explore full management",
          },
          {
            label: "Listing launch & management",
            title: "A good start.<br>A better listing.",
            text: "A fresh look at your home, a listing true to its character, prices and a calendar prepared. The foundations for welcoming guests.",
            slug: "pack-lancement-airbnb",
            link: "Prepare my rental launch",
          },
          {
            label: "Guest welcome & changeovers",
            title: "On the ground.<br>On your behalf.",
            text: "You manage bookings. We coordinate arrivals, cleaning and linen between stays, according to your needs.",
            slug: "menage-airbnb-corse-du-sud",
            link: "Find my local support",
          },
        ];
  const questions =
    locale === "fr"
      ? [
          {
            question: "Quel accompagnement choisir pour mon bien ?",
            answer:
              "La gestion complète réunit le suivi de l’annonce et des séjours. Le lancement prépare votre mise en location. L’accueil et les rotations vous apportent un relais local si vous gardez les réservations. L’audit gratuit permet de choisir selon vos besoins.",
          },
          {
            question: "Comment sont fixés vos tarifs ?",
            answer:
              "Ils dépendent du bien, de sa localisation, de la saison et des prestations retenues. La gestion complète fonctionne avec une commission sur les revenus locatifs. Les montants et les éventuels frais complémentaires sont précisés dans la proposition et le contrat.",
          },
          {
            question: "Puis-je continuer à profiter de ma maison ?",
            answer:
              "Oui. Vos périodes personnelles sont définies et bloquées dans le calendrier, en tenant compte des réservations déjà confirmées et des modalités convenues ensemble.",
          },
          {
            question: "Mon logement est-il dans votre secteur ?",
            answer:
              "Nous intervenons sur la côte est de la Corse, de Ghisonaccia à Porto-Vecchio. Indiquez-nous votre commune pour confirmer les prestations possibles à votre adresse.",
          },
          {
            question: "Que comprend le premier audit gratuit ?",
            answer:
              "Une première analyse qualitative du potentiel locatif et des améliorations prioritaires, à partir des informations sur votre bien. Elle permet d’identifier l’accompagnement pertinent ; elle ne constitue pas une prévision de revenus.",
          },
        ]
      : [
          {
            question: "Which level of support suits my property?",
            answer:
              "Full management covers the listing and stays. The launch service prepares your rental. Guest welcome and changeovers provide local support while you manage bookings. The free review helps you choose according to your needs.",
          },
          {
            question: "How are your fees set?",
            answer:
              "Fees depend on your property, location, season and selected services. Full management is based on commission on rental income. Amounts and any additional costs are set out in the proposal and agreement.",
          },
          {
            question: "Can I still enjoy my own home?",
            answer:
              "Yes. We plan and block your own stays in the calendar, taking confirmed bookings and the arrangements agreed together into account.",
          },
          {
            question: "Is my property within your area?",
            answer:
              "We work along Corsica’s east coast, from Ghisonaccia to Porto-Vecchio. Share your town so we can confirm the services available at your address.",
          },
          {
            question: "What does the free review include?",
            answer:
              "An initial qualitative review of rental potential and priorities based on your property details. It helps identify suitable support; it is not a rental income forecast.",
          },
        ];
  const properties = [
    {
      image: "villa_amichi",
      name: "Villa d’Amichi",
      location: "Pinarello · Zonza",
      type: t(locale, "Villa", "Villa"),
      detail: t(
        locale,
        "Le soin d’un lieu fait pour recevoir.",
        "Care for a home made for hosting.",
      ),
    },
    {
      image: "casa_verde",
      name: "Casa Verde",
      location: "Pinarello · Zonza",
      type: t(locale, "Maison", "House"),
      detail: t(
        locale,
        "Une maison singulière, un suivi à sa mesure.",
        "An individual home, with support to match.",
      ),
    },
    {
      image: "villa_lova",
      name: "Villa Lova",
      location: "Cala d’Oro · Solenzara",
      type: t(locale, "Maison de caractère", "Character home"),
      detail: t(
        locale,
        "L’attention aux détails, entre chaque séjour.",
        "Attention to the details between stays.",
      ),
    },
  ];
  const steps =
    locale === "fr"
      ? [
          [
            "On parle de votre bien.",
            "Votre commune, votre logement, votre façon de louer. Nous commençons par comprendre ce que vous souhaitez confier.",
          ],
          [
            "On pose un cadre clair.",
            "Un audit gratuit, les priorités et une proposition détaillée. Prestations, tarifs et modalités sont précisés avant de commencer.",
          ],
          [
            "On prend le relais.",
            "Une fois le cadre convenu, nous préparons l’annonce et les prestations retenues. Vous gardez le lien avec votre maison.",
          ],
        ]
      : [
          [
            "Tell us about your home.",
            "Its location, its character and how you rent it. We start by understanding what you want to hand over.",
          ],
          [
            "Agree the right support.",
            "A free review, clear priorities and a detailed proposal. Services, fees and arrangements are specified before we begin.",
          ],
          [
            "Let us take it from here.",
            "Once the arrangements are agreed, we prepare the listing and selected services. You keep a connection to your home.",
          ],
        ];
  return `
  <section class="home-hero">
    <div class="hero-aura" aria-hidden="true"></div>
    <div class="hero-topline container"><p class="eyebrow"><span class="status-dot" aria-hidden="true"></span>${t(locale, "CONCIERGERIE FAMILIALE EN CORSE", "FAMILY-RUN PROPERTY CARE IN CORSICA")}</p><span class="hero-coordinate" aria-hidden="true">42° N · 09° E</span></div>
    <div class="hero-main container">
      <div class="hero-copy"><h1><span>${t(locale, "Votre maison.", "Your home.")}</span><span>${t(locale, "L’esprit", "A little more")}</span><span class="hero-accent">${t(locale, "au large.", "freedom.")}</span></h1>
      <p class="hero-description">${t(locale, "Les clés sont en Corse. Vous êtes où vous voulez. Annonce, voyageurs, ménage, linge : Inastia prend le relais sur votre location.", "Your keys are in Corsica. You are wherever you want to be. Listings, guests, cleaning and linen: Inastia takes care of your rental’s day to day.")}</p>
      <div class="hero-actions"><a class="button" href="${path(locale, "contact")}">${t(locale, "Parlons de votre bien", "Tell us about your home")}${arrow}</a><span class="hero-cta-note">${t(locale, "Premier audit gratuit", "Free initial property review")}</span></div></div>
      <div class="hero-visual"><span class="scene-label-top">${t(locale, "ENTRE CIEL ET MER.", "BETWEEN SKY AND SEA.")}</span><div class="coast-scene" data-coast-scene data-scene-state="loading" data-scene-frame="0" aria-hidden="true">${coastFallback}</div><span class="scene-label-bottom">${t(locale, "L’HOSPITALITÉ CORSE, TOUT SIMPLEMENT.", "CORSICAN HOSPITALITY, SIMPLY.")}</span><p class="scene-caption">${t(locale, "Une évocation du littoral corse", "An impression of the Corsican coast")}</p></div>
    </div>
    <div class="hero-bottom container"><a class="scroll-cue" href="#services"><span aria-hidden="true">↓</span>${t(locale, "Découvrir l’accompagnement", "Explore our services")}</a><p class="territory-note">${t(locale, "De Ghisonaccia à Porto-Vecchio", "From Ghisonaccia to Porto-Vecchio")}</p><button id="motion-toggle" type="button" aria-pressed="false" aria-label="${t(locale, "Mettre les animations en pause", "Pause animations")}" data-pause="${t(locale, "Mettre les animations en pause", "Pause animations")}" data-play="${t(locale, "Reprendre les animations", "Resume animations")}"><span class="motion-icon" aria-hidden="true">Ⅱ</span><span class="motion-label">${t(locale, "Animations", "Animations")}</span></button></div>
  </section>
  <section class="manifesto-section"><div class="container"><p class="eyebrow" data-reveal>${t(locale, "VOTRE TEMPS A DE LA VALEUR", "YOUR TIME MATTERS")}</p><h2 data-reveal>${t(locale, "Moins à gérer.<br><span>Plus à vivre.</span>", "Less to manage.<br><span>More to enjoy.</span>")}</h2><div class="manifesto-bottom" data-reveal><p>${t(locale, "Louer une maison, c’est une somme de détails. Répondre, préparer, accueillir, vérifier. Nous les coordonnons pour que votre location trouve sa place dans votre vie, sans prendre toute la place.", "A rental is made of details. Responding, preparing, welcoming, checking. We coordinate them so your rental fits into your life without taking it over.")}</p><div class="manifesto-points"><span>${t(locale, "Une présence locale", "A local presence")}</span><span>${t(locale, "Des prestations choisies", "Services you choose")}</span><span>${t(locale, "Une relation directe", "A direct relationship")}</span></div></div></div><div class="manifesto-orb" aria-hidden="true"></div></section>
  <section class="section services-section" id="services"><span id="formules" class="anchor-target" aria-hidden="true"></span><div class="container"><div class="section-heading" data-reveal><div><p class="eyebrow">${t(locale, "01 — À VOUS DE CHOISIR", "01 — YOUR CHOICE")}</p><h2>${t(locale, "Vous choisissez.<br><em>Nous prenons le relais.</em>", "You choose.<br><em>We take it from here.</em>")}</h2></div><p>${t(locale, "Tout déléguer ou seulement ce qui vous manque sur place. L’accompagnement s’adapte à votre façon de louer.", "Hand over everything or just the work that needs someone nearby. Support shaped around the way you rent.")}</p></div><div class="service-grid">${services.map((s, i) => `<a class="service-card" href="${path(locale, s.slug)}" data-reveal><div class="service-card-top"><span>0${i + 1}</span><span class="eyebrow">${s.label}</span></div>${serviceArt(i)}<h3>${s.title}</h3><p>${s.text}</p><span class="service-card-link">${s.link}${arrow}</span></a>`).join("")}</div></div></section>
  <section class="presence-section"><div class="presence-art" aria-hidden="true">${contours}<div class="presence-signal"><div></div><div></div><div></div><span>i.</span></div></div><div class="presence-grid container"><div class="presence-heading" data-reveal><p class="eyebrow">${t(locale, "UNE FAMILLE, ICI EN CORSE", "A FAMILY, HERE IN CORSICA")}</p><h2>${t(locale, "À distance.<br><em>Jamais loin.</em>", "Miles away.<br><em>Still close to home.</em>")}</h2></div><div class="presence-copy" data-reveal><p class="presence-lead">${t(locale, "Des personnes sur place. Une relation qui compte.", "People on the ground. A relationship that matters.")}</p><p>${t(locale, "Inastia est une conciergerie familiale. Propriétaires nous-mêmes, nous savons ce que représente le fait de confier ses clés. Nous vous parlons directement et suivons votre bien sur un territoire qui fait partie de notre quotidien.", "Inastia is a family-run concierge service. As owners ourselves, we understand what handing over your keys means. You speak directly with us, and we look after your home in the places we know day by day.")}</p><a class="text-link" href="${path(locale, "about")}">${t(locale, "Les personnes derrière Inastia", "The people behind Inastia")}${arrow}</a></div></div></section>
  <section class="section portfolio-section" id="portfolio"><span id="resultats" class="anchor-target" aria-hidden="true"></span><span id="comparaison" class="anchor-target" aria-hidden="true"></span><div class="container"><div class="section-heading" data-reveal><div><p class="eyebrow">${t(locale, "02 — LES MAISONS INASTIA", "02 — INASTIA HOMES")}</p><h2>${t(locale, "Chaque lieu.<br><em>Une attention à part.</em>", "Every home.<br><em>Individual attention.</em>")}</h2></div><p>${t(locale, "Trois maisons de notre portfolio. Des caractères différents, un même soin dans l’accompagnement.", "Three homes from our portfolio. Different characters, the same care in our support.")}</p></div><div class="property-list">${properties.map((p, i) => `<figure class="property-row" data-reveal><span class="property-index">0${i + 1}</span>${picture(p.image, `${p.name} · ${p.location}`, "property-thumb")}<figcaption><span class="eyebrow">${p.type}</span><h3>${p.name}</h3><p>${p.location}</p></figcaption><p class="property-detail">${p.detail}</p></figure>`).join("")}</div></div></section>
  <section class="section process-section" id="processus"><div class="container"><div class="section-heading" data-reveal><div><p class="eyebrow">${t(locale, "03 — LE PREMIER PAS", "03 — GETTING STARTED")}</p><h2>${t(locale, "Un échange.<br><em>Et la suite se dessine.</em>", "One conversation.<br><em>A clear way forward.</em>")}</h2></div><a class="text-link" href="${path(locale, "audit-gratuit-potentiel-locatif")}">${t(locale, "Découvrir l’audit gratuit", "Explore the free review")}${arrow}</a></div><ol class="process-list">${steps.map(([title, text], i) => `<li data-reveal><span class="step-index">0${i + 1}</span><div><h3>${title}</h3><p>${text}</p></div></li>`).join("")}</ol></div></section>
  <section class="section territory-section" id="zone"><div class="container territory-grid"><div class="territory-copy" data-reveal><p class="eyebrow">${t(locale, "04 — NOTRE TERRITOIRE", "04 — OUR REGION")}</p><h2>${t(locale, "L’île en commun.<br><em>La côte est au quotidien.</em>", "An island we share.<br><em>An east coast we know.</em>")}</h2><p>${t(locale, "De Ghisonaccia à Porto-Vecchio, nous accompagnons les propriétaires sur la côte est de la Corse. Indiquez-nous votre commune pour confirmer les prestations à votre adresse.", "From Ghisonaccia to Porto-Vecchio, we support owners along Corsica’s east coast. Share your town so we can confirm the services at your address.")}</p><p class="territory-note">${t(locale, "Également : Prunelli-di-Fiumorbo, Ventiseri, Solaro et Conca.", "Also: Prunelli-di-Fiumorbo, Ventiseri, Solaro and Conca.")}</p></div><div class="zone-list">${zones.map(([name, slug], i) => `<a href="${path(locale, slug)}" data-reveal><span class="zone-index">0${i + 1}</span><span>${name}</span>${arrow}</a>`).join("")}</div></div></section>
  <span id="temoignages" class="anchor-target" aria-hidden="true"></span>${faq(locale, questions)}${contactCallout(locale)}`;
}
