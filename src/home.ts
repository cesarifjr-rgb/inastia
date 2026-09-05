import type { Locale } from "./content/pages.ts";
import { arrow, contactPath, path, picture, t } from "./lib.ts";
import { contactCallout, faq, zones } from "./components.ts";
import { hospitalityArt, serviceArt } from "./art.ts";
import { reviews } from "./reviews.ts";
import { managementArt } from "./management-art.ts";

export function home(locale: Locale): string {
  const services = [
    {
      title: t(locale, "Une annonce suivie.", "A listing looked after."),
      text: t(locale, "Présentation du logement, calendrier, tarifs et réservations : nous suivons votre annonce dans le cadre de la gestion complète.", "Property presentation, calendar, pricing and bookings: we look after your listing as part of full management."),
      items: [t(locale, "Présentation et mise en valeur", "Presentation of your home"), t(locale, "Calendrier et réservations", "Calendar and bookings"), t(locale, "Suivi des prix selon le cadre convenu", "Pricing within the agreed framework")],
      section: "section-1",
      art: 1,
    },
    {
      title: t(locale, "Des voyageurs accompagnés.", "Guests supported."),
      text: t(locale, "Avant l’arrivée et pendant le séjour, les échanges voyageurs et l’organisation de l’accueil font partie du même accompagnement.", "Before arrival and during the stay, guest communication and welcome arrangements are part of the same service."),
      items: [t(locale, "Informations avant l’arrivée", "Information before arrival"), t(locale, "Organisation des arrivées et départs", "Arrival and departure arrangements"), t(locale, "Échanges pendant le séjour", "Communication during the stay")],
      section: "section-2",
      art: 2,
    },
    {
      title: t(locale, "Une maison suivie sur place.", "Local care for your home."),
      text: t(locale, "Nous coordonnons la préparation entre les séjours, les contrôles et les points à vous signaler, selon les prestations convenues.", "We coordinate preparation between stays, checks and any points to report to you, within the agreed services."),
      items: [t(locale, "Ménage et linge selon le devis", "Cleaning and linen as quoted"), t(locale, "Vérifications après intervention", "Checks after each intervention"), t(locale, "Signalement des anomalies", "Reporting any issues")],
      section: "section-3",
      art: 0,
    },
  ];
  const questions = [
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
      answer: t(locale, "Nous intervenons sur la côte est de la Corse, de Ghisonaccia à Porto-Vecchio. Indiquez-nous votre commune pour confirmer les prestations possibles à votre adresse.", "We work along Corsica’s east coast, from Ghisonaccia to Porto-Vecchio. Share your town so we can confirm the services available at your address."),
    },
    {
      question: t(locale, "Que comprend le premier audit gratuit ?", "What does the free review include?"),
      answer: t(locale, "Une première analyse qualitative de votre bien et des améliorations prioritaires, restituée par appel ou email. Elle permet d’identifier l’accompagnement pertinent ; elle ne constitue pas une prévision de revenus. Votre logement peut être étudié même s’il n’a pas encore d’annonce.", "An initial qualitative review of your home and its priorities, shared by phone or email. It helps identify suitable support; it is not a rental income forecast. Your home can be reviewed even if it does not have a listing yet."),
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
    [t(locale, "Vous nous présentez votre bien.", "Tell us about your home."), t(locale, "Commune, type de logement et accompagnement souhaité. Une annonce existante peut compléter votre demande.", "Town, property type and the support you need. An existing listing can help explain your plans.")],
    [t(locale, "Nous faisons le point avec vous.", "We review it with you."), t(locale, "Nous étudions votre situation et les priorités. Le premier audit gratuit vous est restitué par appel ou email.", "We review your situation and priorities. Your free initial property review is shared by phone or email.")],
    [t(locale, "Vous choisissez sur une base claire.", "Choose with a clear picture."), t(locale, "La proposition précise prestations, tarifs, frais éventuels et modalités. Les services retenus démarrent une fois le cadre convenu.", "The proposal sets out services, fees, possible additional costs and arrangements. Selected services start once the terms are agreed.")],
  ];
  return `
  <section class="home-hero">
    <div class="hero-aura" aria-hidden="true"></div>
    <div class="hero-topline container"><p class="eyebrow"><span class="status-dot" aria-hidden="true"></span>${t(locale, "CONCIERGERIE FAMILIALE EN CORSE", "FAMILY-RUN PROPERTY CARE IN CORSICA")}</p><span class="hero-coordinate" aria-hidden="true">42° N · 09° E</span></div>
    <div class="hero-main container">
      <div class="hero-copy"><h1><span>${t(locale, "Votre location", "Your rental")}</span><span>${t(locale, "en Corse.", "in Corsica.")}</span><span class="hero-accent">${t(locale, "Un relais sur place.", "Local care, for you.")}</span></h1>
      <p class="hero-description">${t(locale, "De Ghisonaccia à Porto-Vecchio, notre conciergerie familiale prend en charge la gestion complète de votre location : annonce, voyageurs et coordination sur place.", "From Ghisonaccia to Porto-Vecchio, our family-run service provides full management of your rental: the listing, your guests and local coordination.")}</p>
      <div class="hero-actions"><a class="button" href="${contactPath(locale, "audit")}">${t(locale, "Demander mon audit gratuit", "Request my free review")}${arrow}</a><a class="text-link" href="#services">${t(locale, "Découvrir la gestion complète", "Explore full management")}</a></div>
      <p class="hero-reassurance">${t(locale, "Un premier échange par appel ou email. Des prestations définies selon votre bien.", "A first conversation by phone or email. Services defined around your home.")}</p></div>
      <div class="hero-visual" data-hospitality-scene data-illustration-active="false" aria-hidden="true">${hospitalityArt(locale)}</div>
    </div>
    <div class="hero-bottom container"><a class="scroll-cue" href="#services"><span aria-hidden="true">↓</span>${t(locale, "Votre gestion, en détail", "Your management, in detail")}</a><p class="territory-note">${t(locale, "De Ghisonaccia à Porto-Vecchio", "From Ghisonaccia to Porto-Vecchio")}</p><button id="motion-toggle" type="button" aria-pressed="false" aria-label="${t(locale, "Mettre les animations en pause", "Pause animations")}" data-pause="${t(locale, "Mettre les animations en pause", "Pause animations")}" data-play="${t(locale, "Reprendre les animations", "Resume animations")}"><span class="motion-icon" aria-hidden="true">Ⅱ</span><span class="motion-label">${t(locale, "Animations", "Animations")}</span></button></div>
  </section>
  <section class="section services-section" id="services"><span id="formules" class="anchor-target" aria-hidden="true"></span><span id="comparaison" class="anchor-target" aria-hidden="true"></span><div class="container">
    <div class="section-heading" data-reveal><div><p class="eyebrow">${t(locale, "01 — LA GESTION COMPLÈTE", "01 — FULL MANAGEMENT")}</p><h2>${t(locale, "Un accompagnement.<br><em>De l’annonce à la maison.</em>", "One service.<br><em>From listing to local care.</em>")}</h2></div><p>${t(locale, "La gestion complète est notre offre. Ces trois volets travaillent ensemble pour suivre votre location, avec un périmètre et des frais définis selon votre bien.", "Full management is our service. These three aspects work together to look after your rental, with a scope and costs agreed for your property.")}</p></div>
    <div class="service-grid">${services.map((service, index) => `<article class="service-card management-pillar" data-reveal><div class="service-card-heading"><span class="service-number">0${index + 1}</span>${serviceArt(service.art)}</div><h3>${service.title}</h3><p class="service-audience">${service.text}</p><ul class="management-pillar-list">${service.items.map((item) => `<li>${item}</li>`).join("")}</ul><a class="service-card-link" href="${path(locale, "gestion-airbnb-corse-du-sud")}#${service.section}">${t(locale, "Ce que nous prenons en charge", "What we take care of")}${arrow}</a></article>`).join("")}</div>
    <div class="management-agreement"><dl><div><dt>${t(locale, "Vous gardez la main", "You stay in control")}</dt><dd>${t(locale, "Vos séjours personnels et les décisions qui vous reviennent. Nous vous signalons les points qui nécessitent votre accord.", "Your own stays and the decisions that remain yours. We flag the points that need your approval.")}</dd></div><div><dt>${t(locale, "Un cadre défini ensemble", "An agreement shaped together")}</dt><dd>${t(locale, "Commission sur les revenus locatifs. Ménage, linge, consommables et frais éventuels sont détaillés au devis ; ils ne sont pas automatiquement inclus dans la commission.", "Commission on rental income. Cleaning, linen, supplies and any additional costs are detailed in the proposal; they are not automatically included in the commission.")}</dd></div></dl><a class="button" href="${contactPath(locale, "gestion")}">${t(locale, "Parlons de votre gestion", "Discuss your rental management")}${arrow}</a></div>
  </div></section>
  ${managementArt(locale)}
  <section class="presence-section"><div class="container">
    <div class="presence-grid"><div class="presence-heading" data-reveal><p class="eyebrow">${t(locale, "02 — UNE ÉQUIPE FAMILIALE", "02 — A FAMILY TEAM")}</p><h2>${t(locale, "Votre maison.<br><em>Notre présence.</em>", "Your home.<br><em>Our local care.</em>")}</h2></div><div class="presence-copy" data-reveal><p class="presence-lead">${t(locale, "Vous échangez directement avec l’équipe Inastia.", "You speak directly with the Inastia team.")}</p><p>${t(locale, "Propriétaires nous-mêmes, nous connaissons les questions que pose le fait de confier ses clés. Nous définissons les prestations avec vous, coordonnons les passages et vous signalons les points qui demandent une décision.", "As owners ourselves, we understand the questions that come with handing over your keys. We agree the services with you, coordinate visits and flag the points that need your decision.")}</p><a class="text-link" href="${path(locale, "about")}">${t(locale, "Découvrir notre façon de travailler", "Discover how we work")}${arrow}</a></div></div>
    <div class="local-area" id="zone"><div><h3>${t(locale, "La côte est, au quotidien.", "Corsica’s east coast, every day.")}</h3><p>${t(locale, "De Ghisonaccia à Porto-Vecchio, ainsi qu’à Prunelli-di-Fiumorbo, Ventiseri, Solaro et Conca. Votre adresse permet de confirmer les prestations possibles.", "From Ghisonaccia to Porto-Vecchio, also covering Prunelli-di-Fiumorbo, Ventiseri, Solaro and Conca. Your address lets us confirm the services available.")}</p></div><div class="zone-list">${zones.map(([name, slug]) => `<a href="${path(locale, slug)}"><span>${name}</span>${arrow}</a>`).join("")}</div></div>
  </div></section>
  <section class="section portfolio-section" id="portfolio"><span id="resultats" class="anchor-target" aria-hidden="true"></span><div class="container">
    <div class="section-heading" data-reveal><div><p class="eyebrow">${t(locale, "03 — LES MAISONS ET LES SÉJOURS", "03 — HOMES AND STAYS")}</p><h2>${t(locale, "Des lieux différents.<br><em>Un soin concret.</em>", "Different homes.<br><em>Practical care.</em>")}</h2></div><p>${t(locale, "Trois maisons de notre portfolio, sur la côte est. Chaque accompagnement se définit selon le logement et les besoins de son propriétaire.", "Three homes from our east coast portfolio. Each arrangement reflects the property and its owner’s needs.")}</p></div>
    <div class="property-list">${properties.map((property, index) => `<figure class="property-row" data-reveal><span class="property-index">0${index + 1}</span>${picture(property.image, `${property.name} · ${property.location}`, "property-thumb")}<figcaption><span class="eyebrow">${property.type}</span><h3>${property.name}</h3><p>${property.location}</p></figcaption></figure>`).join("")}</div>
    <div class="care-proof"><div><p class="eyebrow">${t(locale, "LE SUIVI ENTRE LES SÉJOURS", "CARE BETWEEN STAYS")}</p><h3>${t(locale, "Préparer, vérifier,<br>vous tenir informé.", "Prepare, check,<br>keep you informed.")}</h3><p>${t(locale, "Dans le cadre de la gestion complète, la préparation et les contrôles sont organisés selon les prestations convenues. Ces étapes expliquent notre suivi ; il ne s’agit pas d’un rapport d’intervention réel.", "As part of full management, preparation and checks are organised within the agreed services. These steps explain our follow-up; this is not an actual intervention report.")}</p><a class="text-link" href="${path(locale, "gestion-airbnb-corse-du-sud")}#section-3">${t(locale, "Voir le suivi de votre maison", "See how we care for your home")}${arrow}</a></div><ol class="care-steps">${care.map(([title, text]) => `<li><h4>${title}</h4><p>${text}</p></li>`).join("")}</ol></div>
    ${reviews(locale)}
  </div></section>
  <section class="section process-section" id="processus"><div class="container"><div class="section-heading" data-reveal><div><p class="eyebrow">${t(locale, "04 — DU PREMIER ÉCHANGE AU DÉMARRAGE", "04 — FROM FIRST CONTACT TO GETTING STARTED")}</p><h2>${t(locale, "Un premier regard.<br><em>Puis un cadre clair.</em>", "A first look.<br><em>Then a clear agreement.</em>")}</h2></div><a class="text-link" href="${path(locale, "audit-gratuit-potentiel-locatif")}">${t(locale, "Ce que comprend l’audit gratuit", "What the free review includes")}${arrow}</a></div><ol class="process-list">${steps.map(([title, text], index) => `<li data-reveal><span class="step-index">0${index + 1}</span><div><h3>${title}</h3><p>${text}</p></div></li>`).join("")}</ol><p class="process-note">${t(locale, "L’audit est une analyse qualitative, sans prévision de revenus. Le périmètre, le coût et les modalités de l’accompagnement sont précisés avant de commencer.", "The review is qualitative, not a rental income forecast. Scope, cost and arrangements are specified before work begins.")} <a href="/cgv" lang="fr">${t(locale, "Consulter les CGV", "Read the terms (French)")}</a>.</p></div></section>
  ${faq(locale, questions)}${contactCallout(locale)}`;
}
