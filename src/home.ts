import type { Locale } from "./content/pages.ts";
import { arrow, contactPath, path, picture, t } from "./lib.ts";
import { contactCallout, faq, zones } from "./components.ts";
import { hospitalityArt, serviceArt } from "./art.ts";
import { reviews } from "./reviews.ts";
import { managementArt } from "./management-art.ts";

export function home(locale: Locale): string {
  const services = [
    {
      title: t(locale, "Votre annonce et vos réservations.", "Your listing and bookings."),
      text: t(locale, "Nous créons ou améliorons votre annonce, suivons les réservations et ajustons les prix selon la saison. Votre calendrier tient aussi compte de vos séjours personnels.", "We create or improve your listing, manage bookings and adjust pricing for the season. Your calendar also makes room for your own stays."),
      items: [t(locale, "Présentation et mise en valeur", "Presentation of your home"), t(locale, "Calendrier et réservations", "Calendar and bookings"), t(locale, "Suivi des prix selon le cadre convenu", "Pricing within the agreed framework")],
      section: "section-1",
      link: t(locale, "Voir le suivi de l’annonce", "Explore listing management"),
      art: 1,
    },
    {
      title: t(locale, "Vos voyageurs ont un interlocuteur.", "A point of contact for your guests."),
      text: t(locale, "Consignes avant l’arrivée, organisation de l’accueil, questions pendant le séjour : notre équipe prend le relais dans les échanges avec vos voyageurs.", "Arrival instructions, welcome arrangements and questions during the stay: our team takes care of communication with your guests."),
      items: [t(locale, "Informations avant l’arrivée", "Information before arrival"), t(locale, "Organisation des arrivées et départs", "Arrival and departure arrangements"), t(locale, "Échanges pendant le séjour", "Communication during the stay")],
      section: "section-2",
      link: t(locale, "Voir l’accompagnement des voyageurs", "Explore guest support"),
      art: 2,
    },
    {
      title: t(locale, "Votre maison, suivie sur place.", "Your home, cared for locally."),
      text: t(locale, "Entre deux séjours, nous organisons la préparation et les contrôles prévus. Vous êtes informé des anomalies et des interventions à envisager pour votre maison.", "Between stays, we organise the agreed preparation and checks. We keep you informed about any issues and work your home may need."),
      items: [t(locale, "Ménage et linge selon le devis", "Cleaning and linen as quoted"), t(locale, "Vérifications après intervention", "Checks after each intervention"), t(locale, "Signalement des anomalies", "Reporting any issues")],
      section: "section-3",
      link: t(locale, "Voir la préparation de la maison", "Explore property preparation"),
      art: 0,
    },
  ];
  const questions = [
    {
      question: t(locale, "Puis-je vous confier seulement le ménage ou l’annonce ?", "Can I book cleaning or listing management on its own?"),
      answer: t(locale, "Non. Nous proposons uniquement la gestion complète des locations. L’annonce, les échanges voyageurs, l’accueil et la coordination du ménage font partie de cet accompagnement ; nous ne les proposons pas séparément.", "No. We only offer full rental management. Listing management, guest communication, welcome arrangements and cleaning coordination are part of that service; they are not offered separately."),
    },
    {
      question: t(locale, "Puis-je continuer à profiter de ma maison ?", "Can I still enjoy my own home?"),
      answer: t(locale, "Oui. Vos périodes personnelles sont définies et bloquées dans le calendrier, en tenant compte des réservations déjà confirmées et des modalités convenues ensemble.", "Yes. We plan and block your own stays in the calendar, taking confirmed bookings and the arrangements agreed together into account."),
    },
    {
      question: t(locale, "Le linge et le ménage sont-ils toujours inclus ?", "Are linen and cleaning always included?"),
      answer: t(locale, "La gestion complète organise le suivi de votre location, mais ne signifie pas que tous les frais sont inclus. Le ménage, le linge, les consommables et leurs coûts sont précisés dans la proposition adaptée à votre bien.", "Full management coordinates the care of your rental, but it does not mean every cost is included. Cleaning, linen, supplies and their costs are specified in the proposal for your home."),
    },
    {
      question: t(locale, "Comment sont fixés vos tarifs ?", "How are your fees set?"),
      answer: t(locale, "La gestion complète fonctionne avec une commission sur les revenus locatifs. Le bien, sa localisation, la saison et les prestations donnent le cadre. La commission, la durée et les frais éventuels sont précisés dans la proposition et le contrat.", "Full management is based on commission on rental income. The property, location, season and services define the scope. Commission, duration and any additional costs are specified in the proposal and agreement."),
    },
    {
      question: t(locale, "Mon logement est-il dans votre secteur ?", "Is my property within your area?"),
      answer: t(locale, "Nous intervenons sur la côte est de la Corse, de Ghisonaccia à Porto-Vecchio. Indiquez-nous votre commune pour confirmer la prise en charge de votre location.", "We work along Corsica’s east coast, from Ghisonaccia to Porto-Vecchio. Share your town so we can confirm whether we can manage your rental."),
    },
    {
      question: t(locale, "Que comprend le premier audit gratuit ?", "What does the free review include?"),
      answer: t(locale, "Nous vous rappelons sous 24 h, à un moment qui vous convient, pour faire le point sur votre bien et votre projet. L’audit examine ensuite votre situation et les améliorations prioritaires pour préparer une éventuelle gestion complète. C’est une analyse qualitative, sans prévision de revenus. Une annonce existante n’est pas nécessaire.", "We’ll call you within 24 hours, at a time that suits you, to discuss your home and plans. The review then considers your situation and priorities ahead of possible full management. It is a qualitative assessment, without an income forecast. You do not need an existing listing."),
    },
  ];
  const properties = [
    { image: "villa_amichi", name: "Villa d’Amichi", location: "Pinarello · Zonza", type: t(locale, "Villa", "Villa") },
    { image: "casa_verde", name: "Casa Verde", location: "Pinarello · Zonza", type: t(locale, "Maison", "House") },
    { image: "villa_lova", name: "Cala Lova", location: "Cala d’Oro · Solenzara", type: t(locale, "Maison de caractère", "Character home") },
  ];
  const care = [
    [t(locale, "Préparer", "Prepare"), t(locale, "Ménage, linge et accès sont organisés autour des arrivées, selon les prestations convenues.", "Cleaning, linen and access are arranged around arrivals, within the agreed services.")],
    [t(locale, "Vérifier", "Check"), t(locale, "Une checklist et des photos de fin d’intervention documentent la préparation du logement.", "A checklist and photos at the end of each intervention document the home’s preparation.")],
    [t(locale, "Vous informer", "Keep you informed"), t(locale, "Les anomalies constatées vous sont signalées pour décider des suites et des interventions nécessaires.", "We report any issues so you can decide on the next steps and any work needed.")],
  ];
  const steps = [
    [t(locale, "Parlons de votre location.", "Tell us about your rental."), t(locale, "Où se trouve votre bien ? Est-il déjà loué ? Quand souhaitez-vous déléguer sa gestion ? Quelques informations suffisent pour ouvrir la discussion.", "Where is your home? Is it already rented out? When would you like us to take over? A few details are enough to start the conversation.")],
    [t(locale, "Faisons le point sur votre projet.", "Let’s look at your plans."), t(locale, "Nous étudions votre situation et les priorités de votre logement. Si vous demandez l’audit gratuit, nous vous rappelons sous 24 h, selon vos disponibilités, pour ce premier échange.", "We consider your situation and your home’s priorities. If you request a free review, we’ll call within 24 hours, at a time that suits you, for this first conversation.")],
    [t(locale, "Confiez-nous la gestion, en confiance.", "Hand over management with a clear agreement."), t(locale, "Vous recevez une proposition précisant les prestations, la commission et les frais éventuels. Une fois le cadre convenu, nous organisons la prise en charge de votre location.", "You receive a proposal setting out services, commission and any additional costs. Once the terms are agreed, we arrange to take over management of your rental.")],
  ];
  return `
  <section class="home-hero">
    <div class="hero-aura" aria-hidden="true"></div>
    <div class="hero-topline container"><p class="eyebrow"><span class="status-dot" aria-hidden="true"></span>${t(locale, "CONCIERGERIE FAMILIALE EN CORSE", "FAMILY-RUN PROPERTY CARE IN CORSICA")}</p><span class="hero-coordinate" aria-hidden="true">42° N · 09° E</span></div>
    <div class="hero-main container">
      <div class="hero-copy"><h1><span>${t(locale, "Votre location", "Your rental")}</span><span>${t(locale, "en Corse.", "in Corsica.")}</span><span class="hero-accent">${t(locale, "Confiez sa gestion.", "Let us manage it.")}</span></h1>
      <p class="hero-description">${t(locale, "Profitez de votre maison, déléguez le quotidien de la location. Annonce, réservations, voyageurs et suivi sur place : notre équipe familiale assure la gestion complète de votre bien, de Ghisonaccia à Porto-Vecchio.", "Enjoy your home and hand over the day-to-day rental work. Listing, bookings, guests and local care: our family team provides full management of your property, from Ghisonaccia to Porto-Vecchio.")}</p>
      <div class="hero-actions"><a class="button" href="${contactPath(locale, "gestion")}">${t(locale, "Parlons de sa gestion", "Let’s discuss management")}${arrow}</a><a class="text-link" href="#services">${t(locale, "Découvrir la gestion complète", "Explore full management")}</a></div>
      <p class="hero-reassurance">${t(locale, "Un premier échange pour votre projet. Prestations et frais précisés avant le démarrage.", "A first conversation about your plans. Services and fees agreed before we begin.")}</p></div>
      <div class="hero-visual" data-hospitality-scene data-illustration-active="false" aria-hidden="true">${hospitalityArt(locale)}</div>
    </div>
    <div class="hero-bottom container"><a class="scroll-cue" href="#services"><span aria-hidden="true">↓</span>${t(locale, "Votre gestion, en détail", "Your management, in detail")}</a><p class="territory-note">${t(locale, "De Ghisonaccia à Porto-Vecchio", "From Ghisonaccia to Porto-Vecchio")}</p><button id="motion-toggle" type="button" aria-pressed="false" aria-label="${t(locale, "Mettre les animations en pause", "Pause animations")}" data-pause="${t(locale, "Mettre les animations en pause", "Pause animations")}" data-play="${t(locale, "Reprendre les animations", "Resume animations")}"><span class="motion-icon" aria-hidden="true">Ⅱ</span><span class="motion-label">${t(locale, "Animations", "Animations")}</span></button></div>
  </section>
  <section class="section services-section" id="services"><span id="formules" class="anchor-target" aria-hidden="true"></span><span id="comparaison" class="anchor-target" aria-hidden="true"></span><div class="container">
    <div class="section-heading" data-reveal><div><p class="eyebrow">${t(locale, "01 — LA GESTION COMPLÈTE", "01 — FULL MANAGEMENT")}</p><h2>${t(locale, "La location pour vous.<br><em>La gestion pour nous.</em>", "Your rental.<br><em>Our team takes care of it.</em>")}</h2></div><p>${t(locale, "L’annonce, les voyageurs et le suivi de la maison : trois volets coordonnés par la même équipe. Nous proposons exclusivement la gestion complète de votre location, sans prestations séparées.", "Your listing, guests and local care: three parts coordinated by the same team. We provide full rental management exclusively; these services are not offered separately.")}</p></div>
    <div class="service-grid">${services.map((service, index) => `<article class="service-card management-pillar" data-reveal><div class="service-card-heading"><span class="service-number">0${index + 1}</span>${serviceArt(service.art)}</div><h3>${service.title}</h3><p class="service-audience">${service.text}</p><ul class="management-pillar-list">${service.items.map((item) => `<li>${item}</li>`).join("")}</ul><a class="service-card-link" href="${path(locale, "gestion-airbnb-corse-du-sud")}#${service.section}">${service.link}${arrow}</a></article>`).join("")}</div>
    <div class="management-agreement"><dl><div><dt>${t(locale, "Vous gardez la main", "You stay in control")}</dt><dd>${t(locale, "Vos séjours personnels et les décisions qui vous reviennent. Nous vous signalons les points qui nécessitent votre accord.", "Your own stays and the decisions that remain yours. We flag the points that need your approval.")}</dd></div><div><dt>${t(locale, "Un cadre défini ensemble", "An agreement shaped together")}</dt><dd>${t(locale, "Commission sur les revenus locatifs. Ménage, linge, consommables et frais éventuels sont détaillés au devis ; ils ne sont pas automatiquement inclus dans la commission.", "Commission on rental income. Cleaning, linen, supplies and any additional costs are detailed in the proposal; they are not automatically included in the commission.")}</dd></div></dl><a class="button" href="${contactPath(locale, "gestion")}">${t(locale, "Parlons de votre gestion", "Discuss your rental management")}${arrow}</a></div>
  </div></section>
  ${managementArt(locale)}
  <section class="presence-section"><div class="container">
    <div class="presence-grid"><div class="presence-heading" data-reveal><p class="eyebrow">${t(locale, "02 — UNE ÉQUIPE FAMILIALE", "02 — A FAMILY TEAM")}</p><h2>${t(locale, "Vous êtes loin ?<br><em>Nous sommes ici.</em>", "Away from your home?<br><em>We’re here for it.</em>")}</h2></div><div class="presence-copy" data-reveal><p class="presence-lead">${t(locale, "Une équipe familiale basée à Travo, un lien direct pour votre maison.", "A family team based in Travo, a direct connection to your home.")}</p><p>${t(locale, "Propriétaires nous-mêmes, nous savons que votre maison compte au-delà des réservations. Vous échangez directement avec nous sur le suivi de votre location. Nous coordonnons le quotidien et vous signalons les points qui demandent votre décision, pour que vous restiez informé même à distance.", "As owners ourselves, we know your home matters beyond its bookings. You speak directly with us about your rental. We coordinate the day-to-day work and flag decisions for you, keeping you informed even when you are away.")}</p><a class="text-link" href="${path(locale, "about")}">${t(locale, "Découvrir notre façon de travailler", "Discover how we work")}${arrow}</a></div></div>
    <div class="local-area" id="zone"><div><h3>${t(locale, "La côte est, au quotidien.", "Corsica’s east coast, every day.")}</h3><p>${t(locale, "De Ghisonaccia à Porto-Vecchio, ainsi qu’à Prunelli-di-Fiumorbo, Ventiseri, Solaro et Conca. Votre adresse permet de confirmer les prestations possibles.", "From Ghisonaccia to Porto-Vecchio, also covering Prunelli-di-Fiumorbo, Ventiseri, Solaro and Conca. Your address lets us confirm the services available.")}</p></div><div class="zone-list">${zones.map(([name, slug]) => `<a href="${path(locale, slug)}"><span>${name}</span>${arrow}</a>`).join("")}</div></div>
  </div></section>
  <section class="section portfolio-section" id="portfolio"><span id="resultats" class="anchor-target" aria-hidden="true"></span><div class="container">
    <div class="section-heading" data-reveal><div><p class="eyebrow">${t(locale, "03 — LES MAISONS ET LES SÉJOURS", "03 — HOMES AND STAYS")}</p><h2>${t(locale, "Des maisons qui comptent.<br><em>Des clés qui nous sont confiées.</em>", "Homes that matter.<br><em>Keys entrusted to us.</em>")}</h2></div><p>${t(locale, "Quelques maisons de notre portfolio, sur la côte est. Leur configuration, leurs accès et les habitudes de leurs propriétaires guident l’organisation de notre gestion.", "A few homes from our east coast portfolio. Their layout, access and owners’ routines shape how we organise management.")}</p></div>
    <div class="property-list">${properties.map((property, index) => `<figure class="property-row" data-reveal><span class="property-index">0${index + 1}</span>${picture(property.image, `${property.name} · ${property.location}`, "property-thumb")}<figcaption><span class="eyebrow">${property.type}</span><h3>${property.name}</h3><p>${property.location}</p></figcaption></figure>`).join("")}</div>
    <div class="care-proof"><div><p class="eyebrow">${t(locale, "LE SUIVI ENTRE LES SÉJOURS", "CARE BETWEEN STAYS")}</p><h3>${t(locale, "Préparer, vérifier,<br>vous tenir informé.", "Prepare, check,<br>keep you informed.")}</h3><p>${t(locale, "Dans le cadre de la gestion complète, la préparation et les contrôles sont organisés selon les prestations convenues. Ces étapes expliquent notre suivi ; il ne s’agit pas d’un rapport d’intervention réel.", "As part of full management, preparation and checks are organised within the agreed services. These steps explain our follow-up; this is not an actual intervention report.")}</p><a class="text-link" href="${path(locale, "gestion-airbnb-corse-du-sud")}#section-3">${t(locale, "Voir le suivi de votre maison", "See how we care for your home")}${arrow}</a></div><ol class="care-steps">${care.map(([title, text]) => `<li><h4>${title}</h4><p>${text}</p></li>`).join("")}</ol></div>
    ${reviews(locale)}
  </div></section>
  <section class="section process-section" id="processus"><div class="container"><div class="section-heading" data-reveal><div><p class="eyebrow">${t(locale, "04 — DU PREMIER ÉCHANGE AU DÉMARRAGE", "04 — FROM FIRST CONTACT TO GETTING STARTED")}</p><h2>${t(locale, "Votre première location.<br><em>Ou le moment de déléguer.</em>", "Your first rental.<br><em>Or time to hand it over.</em>")}</h2></div><a class="text-link" href="${path(locale, "audit-gratuit-potentiel-locatif")}">${t(locale, "Préparer mon projet avec l’audit gratuit", "Start planning with a free review")}${arrow}</a></div><ol class="process-list">${steps.map(([title, text], index) => `<li data-reveal><span class="step-index">0${index + 1}</span><div><h3>${title}</h3><p>${text}</p></div></li>`).join("")}</ol><p class="process-note">${t(locale, "L’audit est une analyse qualitative, sans prévision de revenus. Le périmètre, le coût et les modalités de l’accompagnement sont précisés avant de commencer.", "The review is qualitative, not a rental income forecast. Scope, cost and arrangements are specified before work begins.")} <a href="/cgv" lang="fr">${t(locale, "Consulter les CGV", "Read the terms (French)")}</a>.</p></div></section>
  ${faq(locale, questions)}${contactCallout(locale)}`;
}
