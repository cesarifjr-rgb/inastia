import type { Locale } from "./content/pages.ts";
import { arrow, contactPath, path, picture, t } from "./lib.ts";
import { contactCallout, faq, zones } from "./components.ts";
import { hospitalityArt, serviceArt } from "./art.ts";
import { reviews } from "./reviews.ts";
import { managementArt } from "./management-art.ts";
import { pricing } from "./pricing.ts";

export function home(locale: Locale): string {
  const services = [
    {
      title: t(locale, "Une annonce et un calendrier suivis pour vous.", "Your listing and calendar, managed for you."),
      text: t(locale, "Nous préparons ou améliorons votre annonce, puis suivons les réservations, les disponibilités et les prix. Vos propres séjours sont intégrés à l’organisation du calendrier.", "We prepare or improve your listing, then manage bookings, availability and pricing. Your own stays are built into the calendar."),
      items: [t(locale, "Présentation de votre logement", "Presenting your home"), t(locale, "Réservations et disponibilités", "Bookings and availability"), t(locale, "Prix suivis au fil de la saison", "Pricing reviewed through the season")],
      section: "section-1",
      link: t(locale, "Voir le suivi de l’annonce", "Explore listing management"),
      art: 1,
    },
    {
      title: t(locale, "Un relais dans les échanges avec les voyageurs.", "Someone to handle guest communication."),
      text: t(locale, "Informations pratiques, préparation de l’arrivée et questions liées au séjour : vous déléguez ces échanges à notre équipe.", "Practical information, arrival arrangements and questions about the stay: our team handles these conversations for you."),
      items: [t(locale, "Informations avant l’arrivée", "Information before arrival"), t(locale, "Organisation des arrivées et départs", "Arrival and departure arrangements"), t(locale, "Échanges pendant le séjour", "Communication during the stay")],
      section: "section-2",
      link: t(locale, "Voir les échanges voyageurs", "Explore guest communication"),
      art: 2,
    },
    {
      title: t(locale, "Une organisation locale entre les séjours.", "Local coordination between stays."),
      text: t(locale, "Nous coordonnons la préparation du logement et les vérifications définies pour votre maison. Les points nécessitant une intervention ou une décision vous sont signalés.", "We coordinate preparation and the checks defined for your home. We flag anything that needs work or a decision from you."),
      items: [t(locale, "Ménage et linge selon le devis", "Cleaning and linen as quoted"), t(locale, "Vérifications après intervention", "Checks after each intervention"), t(locale, "Signalement des anomalies", "Reporting any issues")],
      section: "section-3",
      link: t(locale, "Voir la préparation de la maison", "Explore property preparation"),
      art: 0,
    },
  ];
  const questions = [
    {
      question: t(locale, "Comment serai-je informé de ce qui se passe dans ma maison ?", "How will I know what is happening in my home?"),
      answer: t(locale, "Vous échangez directement avec notre équipe. Nous vous signalons les anomalies et les interventions qui nécessitent votre décision. Une facture mensuelle détaille nos honoraires et les prestations facturées.", "You speak directly with our team. We flag issues and work that needs your decision. A monthly invoice details our fees and any services charged."),
    },
    {
      question: t(locale, "Que se passe-t-il en cas de problème pendant un séjour ?", "What happens if there is a problem during a stay?"),
      answer: t(locale, "Les voyageurs contactent notre équipe pour les questions liées au séjour. Nous examinons le problème, vous signalons les anomalies et coordonnons les interventions nécessaires. Les achats et interventions supplémentaires qui vous incombent sont soumis à votre accord ; les modalités de contact et d’intervention sont précisées au démarrage.", "Guests contact our team with questions about their stay. We assess the issue, report any problems to you and coordinate the work needed. Extra purchases and work at your expense require your agreement; contact and intervention arrangements are clarified before management starts."),
    },
    {
      question: t(locale, "Pouvez-vous reprendre une location déjà en cours ?", "Can you take over an existing rental?"),
      answer: t(locale, "Oui. Avant la reprise, nous examinons l’annonce, les réservations déjà confirmées et les accès nécessaires aux comptes et au logement. Nous précisons ensuite la date de démarrage et l’organisation de la transition. Le transfert des comptes, des avis ou des réservations n’est pas automatique.", "Yes. Before taking over, we review your listing, confirmed bookings and the access needed to accounts and the property. We then agree the start date and transition arrangements. Accounts, reviews and bookings do not transfer automatically."),
    },
    {
      question: t(locale, "Quelle est la durée de l’engagement et comment se termine la prestation ?", "How long is the agreement and how does management end?"),
      answer: t(locale, "La durée est précisée dans votre contrat. Les CGV prévoient une reconduction tacite et un préavis de deux mois avant l’échéance, par lettre recommandée avec accusé de réception. À la fin de la prestation, les réservations déjà confirmées sont honorées jusqu’à leur terme et les commissions correspondantes restent dues.", "The term is specified in your agreement. The terms provide for automatic renewal and two months’ notice before the end date, by registered letter with acknowledgement of receipt. Confirmed bookings are honoured through completion and the corresponding commissions remain payable."),
    },
    {
      question: t(locale, "Puis-je vous confier seulement le ménage ou l’annonce ?", "Can I book cleaning or listing management on its own?"),
      answer: t(locale, "Non. Notre offre réunit l’annonce, les échanges voyageurs, l’accueil et la coordination sur place. Nous ne proposons pas ces services seuls. La proposition distingue les tâches couvertes par la commission et les prestations facturées séparément.", "No. Our service brings together the listing, guest communication, welcome arrangements and local coordination. We do not offer these services on their own. The proposal separates work covered by the commission from services charged separately."),
    },
    {
      question: t(locale, "Puis-je continuer à profiter de ma maison ?", "Can I still enjoy my own home?"),
      answer: t(locale, "Oui. Vous choisissez vos périodes d’occupation et nous les bloquons dans le calendrier, en tenant compte des réservations déjà confirmées. Ces dates sont intégrées à l’organisation des séjours et de la préparation du logement.", "Yes. You choose your own stays and we block them in the calendar, taking confirmed bookings into account. These dates are included when planning guest stays and preparing the property."),
    },
    {
      question: t(locale, "Comment sont fixés vos tarifs ?", "How are your fees set?"),
      answer: t(locale, "La commission est de 20 % TTC des nuitées, avant déduction des frais de plateforme et hors ménage, linge et taxe de séjour. Pour 1 000 € de nuitées, elle représente 200 € TTC. Le ménage et le linge sont facturés séparément au locataire selon le devis. Vous encaissez directement les loyers ; les autres prestations et dépenses sont détaillées dans votre proposition.", "The commission is 20% including VAT of the accommodation amount before platform fees, excluding cleaning, linen and tourist tax. On €1,000 of accommodation, it is €200 including VAT. Cleaning and linen are charged separately to the guest as quoted. You receive rental income directly; other services and expenses are itemised in your proposal."),
    },
    {
      question: t(locale, "Quels logements pouvez-vous prendre en charge ?", "Which properties can you manage?"),
      answer: t(locale, "Nous intervenons sur la côte est de la Corse, de Ghisonaccia à Porto-Vecchio. Nous vérifions l’adresse, les accès, le type de logement et les prestations nécessaires avant de confirmer la prise en charge. Votre bien peut déjà être loué ou se préparer à une première saison.", "We work along Corsica’s east coast, from Ghisonaccia to Porto-Vecchio. We check the address, access, property type and services needed before confirming management. Your home may already be rented out or preparing for its first season."),
    },
    {
      question: t(locale, "Que comprend le premier audit gratuit ?", "What does the free review include?"),
      answer: t(locale, "Vous faites le point sur votre organisation, votre annonce si elle existe et les priorités à traiter avant de déléguer. L’audit sert à identifier les prochaines étapes et les informations nécessaires à une éventuelle prise en charge. Il est gratuit et qualitatif, sans prévision de revenus. Le rappel sous 24 h, selon vos disponibilités, lance l’échange : ce délai ne concerne pas la restitution complète de l’audit.", "You review your current arrangements, any existing listing and the priorities to address before handing over management. The review identifies next steps and the information needed to consider taking over. It is free and qualitative, without an income forecast. The callback within 24 hours, at a time that suits you, starts the conversation; that time frame does not cover completion of the review."),
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
    [t(locale, "Présentez votre maison.", "Tell us about your home."), t(locale, "Où se trouve votre bien ? Est-il déjà loué ? Quand souhaitez-vous déléguer sa gestion ? Quelques informations suffisent pour ouvrir la discussion.", "Where is your home? Is it already rented out? When would you like us to take over? A few details are enough to start the conversation.")],
    [t(locale, "Vérifions la prise en charge.", "Check whether we can manage it."), t(locale, "Nous étudions votre situation et les priorités de votre logement. Si vous demandez l’audit gratuit, nous vous rappelons sous 24 h, selon vos disponibilités, pour ce premier échange.", "We consider your situation and your home’s priorities. If you request a free review, we’ll call within 24 hours, at a time that suits you, for this first conversation.")],
    [t(locale, "Examinez votre proposition.", "Review your proposal."), t(locale, "Vous recevez une proposition précisant les prestations, la commission et les frais éventuels. Une fois le cadre convenu, nous organisons la prise en charge de votre location.", "You receive a proposal setting out services, commission and any additional costs. Once the terms are agreed, we arrange to take over management of your rental.")],
  ];
  return `
  <section class="home-hero">
    <div class="hero-aura" aria-hidden="true"></div>
    <div class="hero-topline container"><p class="eyebrow"><span class="status-dot" aria-hidden="true"></span>${t(locale, "CONCIERGERIE FAMILIALE EN CORSE", "FAMILY-RUN PROPERTY CARE IN CORSICA")}</p><span class="hero-coordinate" aria-hidden="true">42° N · 09° E</span></div>
    <div class="hero-main container">
      <div class="hero-copy"><h1><span>${t(locale, "Votre maison en Corse.", "Your home in Corsica.")}</span><span class="hero-accent">${t(locale, "La location, sans tout gérer vous-même.", "Let it out, without managing every stay.")}</span></h1>
      <p class="hero-description">${t(locale, "Confiez à notre équipe familiale le suivi des réservations, les échanges avec les voyageurs et l’organisation sur place. Vous conservez vos périodes d’occupation et les décisions concernant votre bien.", "Let our family team manage bookings, guest communication and local arrangements. You keep your own stays and the decisions about your home.")}</p>
      <p class="hero-location">${t(locale, "De Ghisonaccia à Porto-Vecchio. Nous confirmons la prise en charge à partir de l’adresse de votre logement.", "From Ghisonaccia to Porto-Vecchio. We confirm whether we can manage your home based on its address.")}</p>
      <div class="hero-actions"><a class="button" href="${contactPath(locale, "gestion")}">${t(locale, "Demander une proposition de gestion", "Request a management proposal")}${arrow}</a><a class="text-link" href="#services">${t(locale, "Comprendre les services et les frais", "Understand the services and fees")}</a></div>
      <p class="hero-reassurance">${t(locale, "Un premier échange pour vérifier la prise en charge et préciser les prestations adaptées à votre maison.", "A first conversation to check whether we can manage your home and define the services it needs.")}</p></div>
      <div class="hero-visual" data-hospitality-scene data-illustration-active="false" aria-hidden="true">${hospitalityArt(locale)}</div>
    </div>
    <div class="hero-bottom container"><a class="scroll-cue" href="#services"><span aria-hidden="true">↓</span>${t(locale, "Votre gestion, en détail", "Your management, in detail")}</a><p class="territory-note">${t(locale, "De Ghisonaccia à Porto-Vecchio", "From Ghisonaccia to Porto-Vecchio")}</p><button id="motion-toggle" type="button" aria-pressed="false" aria-label="${t(locale, "Mettre les animations en pause", "Pause animations")}" data-pause="${t(locale, "Mettre les animations en pause", "Pause animations")}" data-play="${t(locale, "Reprendre les animations", "Resume animations")}"><span class="motion-icon" aria-hidden="true">Ⅱ</span><span class="motion-label">${t(locale, "Animations", "Animations")}</span></button></div>
  </section>
  <section class="section services-section" id="services"><span id="formules" class="anchor-target" aria-hidden="true"></span><span id="comparaison" class="anchor-target" aria-hidden="true"></span><div class="container">
    <div class="section-heading" data-reveal><div><p class="eyebrow">${t(locale, "01 — LA GESTION COMPLÈTE", "01 — FULL MANAGEMENT")}</p><h2>${t(locale, "Ce que vous déléguez<br><em>au quotidien.</em>", "The day-to-day work<br><em>you hand over.</em>")}</h2></div><p>${t(locale, "Notre offre réunit le suivi de la location et l’organisation sur place. La même équipe coordonne l’annonce, les voyageurs et la préparation de la maison. Votre proposition distingue les prestations couvertes par la commission et celles facturées séparément.", "Our service brings together rental management and local coordination. The same team coordinates the listing, guests and preparation of the home. Your proposal separates services covered by the commission from those charged separately.")}</p></div>
    <div class="service-grid">${services.map((service, index) => `<article class="service-card management-pillar" data-reveal><div class="service-card-heading"><span class="service-number">0${index + 1}</span>${serviceArt(service.art)}</div><h3>${service.title}</h3><p class="service-audience">${service.text}</p><ul class="management-pillar-list">${service.items.map((item) => `<li>${item}</li>`).join("")}</ul><a class="service-card-link" href="${path(locale, "gestion-airbnb-corse-du-sud")}#${service.section}">${service.link}${arrow}</a></article>`).join("")}</div>
    <div class="management-agreement"><dl><div><dt>${t(locale, "Vous gardez la main", "You stay in control")}</dt><dd>${t(locale, "Vos séjours personnels et les décisions qui vous reviennent. Nous vous signalons les points qui nécessitent votre accord.", "Your own stays and the decisions that remain yours. We flag the points that need your approval.")}</dd></div><div><dt>${t(locale, "Vos dépenses, vos décisions", "Your expenses, your decisions")}</dt><dd>${t(locale, "Les achats et interventions supplémentaires sont soumis à votre accord. La proposition précise leur coût et qui les règle. Vous encaissez directement les loyers.", "Extra purchases and work require your approval. The proposal states their cost and who pays. You receive rental income directly.")}</dd></div></dl><a class="button" href="${contactPath(locale, "gestion")}">${t(locale, "Demander une proposition de gestion", "Request a management proposal")}${arrow}</a></div>
  </div></section>
  ${managementArt(locale)}
  <section class="presence-section"><div class="container">
    <div class="presence-grid"><div class="presence-heading" data-reveal><p class="eyebrow">${t(locale, "02 — UNE ÉQUIPE FAMILIALE", "02 — A FAMILY TEAM")}</p><h2>${t(locale, "Qui suit votre maison<br><em>sur place.</em>", "Who looks after<br><em>your home locally.</em>")}</h2></div><div class="presence-copy" data-reveal><p class="presence-lead">${t(locale, "Une équipe familiale basée à Travo, un lien direct pour votre maison.", "A family team based in Travo, a direct connection to your home.")}</p><p>${t(locale, "Propriétaires nous-mêmes, nous savons que votre maison compte au-delà des réservations. Vous échangez directement avec nous sur le suivi de votre location. Nous coordonnons le quotidien et vous signalons les points qui demandent votre décision, pour que vous restiez informé même à distance.", "As owners ourselves, we know your home matters beyond its bookings. You speak directly with us about your rental. We coordinate the day-to-day work and flag decisions for you, keeping you informed even when you are away.")}</p><a class="text-link" href="${path(locale, "about")}">${t(locale, "Découvrir notre façon de travailler", "Discover how we work")}${arrow}</a></div></div>
    <div class="local-area" id="zone"><div><h3>${t(locale, "La côte est, au quotidien.", "Corsica’s east coast, every day.")}</h3><p>${t(locale, "De Ghisonaccia à Porto-Vecchio, ainsi qu’à Prunelli-di-Fiumorbo, Ventiseri, Solaro et Conca. Votre adresse permet de confirmer les prestations possibles.", "From Ghisonaccia to Porto-Vecchio, also covering Prunelli-di-Fiumorbo, Ventiseri, Solaro and Conca. Your address lets us confirm the services available.")}</p></div><div class="zone-list">${zones.map(([name, slug]) => `<a href="${path(locale, slug)}"><span>${name}</span>${arrow}</a>`).join("")}</div></div>
  </div></section>
  <section class="section portfolio-section" id="portfolio"><span id="resultats" class="anchor-target" aria-hidden="true"></span><div class="container">
    <div class="section-heading" data-reveal><div><p class="eyebrow">${t(locale, "03 — LES MAISONS ET LES SÉJOURS", "03 — HOMES AND STAYS")}</p><h2>${t(locale, "Des maisons qui comptent.<br><em>Des clés qui nous sont confiées.</em>", "Homes that matter.<br><em>Keys entrusted to us.</em>")}</h2></div><p>${t(locale, "Quelques maisons de notre portfolio, sur la côte est. Leur configuration, leurs accès et les habitudes de leurs propriétaires guident l’organisation de notre gestion.", "A few homes from our east coast portfolio. Their layout, access and owners’ routines shape how we organise management.")}</p></div>
    <div class="property-list">${properties.map((property, index) => `<figure class="property-row" data-reveal><span class="property-index">0${index + 1}</span>${picture(property.image, `${property.name} · ${property.location}`, "property-thumb")}<figcaption><span class="eyebrow">${property.type}</span><h3>${property.name}</h3><p>${property.location}</p></figcaption></figure>`).join("")}</div>
    <div class="care-proof"><div><p class="eyebrow">${t(locale, "LE SUIVI ENTRE LES SÉJOURS", "CARE BETWEEN STAYS")}</p><h3>${t(locale, "Préparer, vérifier,<br>vous tenir informé.", "Prepare, check,<br>keep you informed.")}</h3><p>${t(locale, "Dans le cadre de la gestion complète, la préparation et les contrôles sont organisés selon les prestations convenues. Ces étapes expliquent notre suivi ; il ne s’agit pas d’un rapport d’intervention réel.", "As part of full management, preparation and checks are organised within the agreed services. These steps explain our follow-up; this is not an actual intervention report.")}</p><a class="text-link" href="${path(locale, "gestion-airbnb-corse-du-sud")}#section-3">${t(locale, "Voir le suivi de votre maison", "See how we care for your home")}${arrow}</a></div><ol class="care-steps">${care.map(([title, text]) => `<li><h4>${title}</h4><p>${text}</p></li>`).join("")}</ol></div>
    ${reviews(locale)}
  </div></section>
  ${pricing(locale)}
  <section class="section process-section" id="processus"><div class="container"><div class="section-heading" data-reveal><div><p class="eyebrow">${t(locale, "04 — DU PREMIER ÉCHANGE AU DÉMARRAGE", "04 — FROM FIRST CONTACT TO GETTING STARTED")}</p><h2>${t(locale, "Ce qui se passe<br><em>après votre demande.</em>", "What happens<br><em>after your enquiry.</em>")}</h2></div><a class="text-link" href="${path(locale, "audit-gratuit-potentiel-locatif")}">${t(locale, "Encore en réflexion ? Découvrez l’audit gratuit", "Still considering it? Explore the free review")}${arrow}</a></div><ol class="process-list">${steps.map(([title, text], index) => `<li data-reveal><span class="step-index">0${index + 1}</span><div><h3>${title}</h3><p>${text}</p></div></li>`).join("")}</ol><p class="process-note">${t(locale, "L’audit est une analyse qualitative, sans prévision de revenus. Le périmètre, le coût et les modalités de l’accompagnement sont précisés avant de commencer.", "The review is qualitative, not a rental income forecast. Scope, cost and arrangements are specified before work begins.")} <a href="/cgv" lang="fr">${t(locale, "Consulter les CGV", "Read the terms (French)")}</a>.</p></div></section>
  ${faq(locale, questions)}${contactCallout(locale)}`;
}
