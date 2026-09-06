import type { Locale } from "./content/pages.ts";
import { arrow, contactPath, path, picture, t } from "./lib.ts";
import { contactCallout, faq, zones } from "./components.ts";
import { hospitalityArt, serviceArt } from "./art.ts";
import { reviews } from "./reviews.ts";
import { managementArt } from "./management-art.ts";
import { pricing } from "./pricing.ts";
import { serviceDetailArt } from "./service-detail-art.ts";

export function home(locale: Locale): string {
  const services = [
    {
      title: t(locale, "Nous mettons votre maison en location.", "We get your home ready to rent."),
      text: t(locale, "Photos, rédaction, diffusion sur les plateformes, prix et calendrier : nous préparons l’annonce et pilotons les réservations.", "Photos, listing copy, booking platforms, pricing and availability: we prepare your listing and manage its bookings."),
      items: [t(locale, "Annonce sur Airbnb, Booking et Abritel", "Listings on Airbnb, Booking and Abritel"), t(locale, "Tarification dynamique et disponibilités", "Dynamic pricing and availability"), t(locale, "Demandes de réservation prises en charge", "Booking enquiries handled for you")],
      section: "section-1",
      link: t(locale, "Voir le suivi de l’annonce", "Explore listing management"),
      art: 1,
    },
    {
      title: t(locale, "Nous nous occupons de vos voyageurs.", "We look after your guests."),
      text: t(locale, "De la demande de réservation au départ, nous gérons les échanges, les accès et les questions du séjour. Notre assistance est disponible 24 h/24, 7 j/7.", "From the first booking enquiry to departure, we handle messages, access and questions about the stay. Our guest assistance is available 24/7."),
      items: [t(locale, "Examen des demandes et des profils voyageurs", "Reviewing booking enquiries and guest profiles"), t(locale, "Arrivées, départs et gestion des clés", "Arrivals, departures and key management"), t(locale, "Assistance 24 h/24, 7 j/7 et suivi des avis", "24/7 guest assistance and review management")],
      section: "section-2",
      link: t(locale, "Voir les échanges voyageurs", "Explore guest communication"),
      art: 2,
    },
    {
      title: t(locale, "Nous prenons soin de votre maison.", "We take care of your home."),
      text: t(locale, "Ménage, linge, consommables et vérifications entre les séjours : nous organisons chaque passage et prenons le relais lorsqu’un imprévu survient.", "Cleaning, linen, supplies and checks between stays: we organise every visit and take care of unexpected issues."),
      items: [t(locale, "Ménage, linge propre et réassort", "Cleaning, fresh linen and restocking"), t(locale, "Contrôles et organisation de la maintenance", "Property checks and maintenance arrangements"), t(locale, "Cautions et suivi des dossiers de dommages", "Deposits and damage claim follow-up")],
      section: "section-3",
      link: t(locale, "Voir la préparation de la maison", "Explore property preparation"),
      art: 0,
    },
  ];
  const fullServices = [
    { title: t(locale, "Annonces et diffusion", "Listings and distribution"), text: t(locale, "Nous préparons les photos et les textes, publions votre logement sur Airbnb, Booking et Abritel, puis tenons les informations à jour.", "We prepare photos and copy, publish your home on Airbnb, Booking and Abritel, then keep its information up to date."), section: 1 },
    { title: t(locale, "Réservations et voyageurs", "Bookings and guests"), text: t(locale, "Nous traitons les demandes, examinons les profils et avis disponibles, expliquons les règles de la maison et répondons aux voyageurs avant, pendant et après leur séjour.", "We handle enquiries, review available guest profiles and feedback, explain house rules and reply to guests before, during and after their stay."), section: 2 },
    { title: t(locale, "Ménage, linge et consommables", "Cleaning, linen and supplies"), text: t(locale, "Nous organisons le ménage entre les séjours, la fourniture du linge propre, son entretien et le réassort des essentiels. La maison est vérifiée avant l’arrivée suivante.", "We arrange cleaning between stays, supply and launder fresh linen, and restock essentials. The home is checked before the next arrival."), section: 3 },
    { title: t(locale, "Tarification et calendrier", "Pricing and availability"), text: t(locale, "Nous adaptons les prix à la saison, au marché local et à la demande. Nous gérons les disponibilités en intégrant les périodes où vous profitez de votre maison.", "We adjust prices to the season, local market and demand. We manage availability and make room for your own stays."), section: 4 },
    { title: t(locale, "Arrivées, départs et clés", "Arrivals, departures and keys"), text: t(locale, "Nous transmettons les consignes, préparons le guide de la maison, organisons l’accueil et les accès, puis suivons le départ et la restitution des clés.", "We send instructions, prepare the house guide, arrange the welcome and access, then oversee departure and the return of keys."), section: 5 },
    { title: t(locale, "Assistance 24 h/24 et maintenance", "24/7 assistance and maintenance"), text: t(locale, "Un voyageur a une question ou un problème ? Notre équipe répond 24 h/24, 7 j/7, évalue la situation et organise les interventions nécessaires.", "A guest has a question or a problem? Our team is available 24/7 to assess the situation and arrange the work needed."), section: 6 },
    { title: t(locale, "Cautions et suivi des dommages", "Deposits and damage claims"), text: t(locale, "Nous suivons les cautions, documentons les dégradations et gérons les démarches auprès des plateformes ou assureurs concernés, selon les garanties applicables à la réservation.", "We follow up deposits, document damage and handle the process with the relevant booking platform or insurer under the cover that applies to the booking."), section: 7 },
  ];
  const questions = [
    {
      question: t(locale, "Que signifie une gestion complète à 100 % ?", "What does complete management mean?"),
      answer: t(locale, "Vous nous confiez toutes les étapes de la location : annonce, prix, réservations, voyageurs, arrivées et départs, ménage, linge, maintenance et suivi des cautions ou dommages. Inastia organise et suit l’ensemble pour vous. Vous choisissez vos séjours personnels, encaissez directement les loyers et validez les dépenses supplémentaires. Les honoraires de gestion, les frais de séjour et les dépenses du logement sont détaillés séparément.", "You hand over every stage of the rental: listing, pricing, bookings, guests, arrivals and departures, cleaning, linen, maintenance and deposit or damage follow-up. Inastia organises and manages the whole process for you. You choose your own stays, receive rental income directly and approve extra expenses. Management fees, stay-related costs and property expenses are itemised separately."),
    },
    {
      question: t(locale, "Comment serai-je informé de ce qui se passe dans ma maison ?", "How will I know what is happening in my home?"),
      answer: t(locale, "Vous échangez directement avec notre équipe. Nous vous signalons les anomalies et les interventions qui nécessitent votre décision. Une facture mensuelle détaille nos honoraires et les prestations facturées.", "You speak directly with our team. We flag issues and work that needs your decision. A monthly invoice details our fees and any services charged."),
    },
    {
      question: t(locale, "Que se passe-t-il en cas de problème pendant un séjour ?", "What happens if there is a problem during a stay?"),
      answer: t(locale, "Notre assistance voyageurs est disponible 24 h/24, 7 j/7. Nous répondons, évaluons le problème et organisons sa résolution avec les intervenants nécessaires. Le délai d’intervention sur place dépend de la situation et de la disponibilité des prestataires. Nous vous tenons informé et vous soumettons les achats ou réparations supplémentaires à votre charge.", "Our guest assistance is available 24/7. We respond, assess the issue and arrange its resolution with the people needed. The time for an on-site visit depends on the situation and contractor availability. We keep you informed and ask you to approve extra purchases or repairs at your expense."),
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
      <div class="hero-copy"><h1><span>${t(locale, "Votre location en Corse.", "Your holiday rental in Corsica.")}</span><span class="hero-accent">${t(locale, "On s’occupe de tout.", "We take care of everything.")}</span></h1>
      <p class="hero-description">${t(locale, "Une gestion complète à 100 %, de l’annonce au départ des voyageurs. Réservations, prix, accueil, ménage, linge et imprévus : notre équipe familiale prend tout en main. Vous profitez de votre maison et recevez directement vos revenus locatifs.", "Complete management, from creating the listing to the guests’ departure. Bookings, pricing, arrivals, cleaning, linen and unexpected issues: our family team handles it all. You enjoy your home and receive rental income directly.")}</p>
      <p class="hero-assistance">${t(locale, "Assistance voyageurs 24 h/24, 7 j/7", "Guest assistance available 24/7")}</p>
      <p class="hero-location">${t(locale, "Votre conciergerie familiale, de Ghisonaccia à Porto-Vecchio.", "Your family-run property management team, from Ghisonaccia to Porto-Vecchio.")}</p>
      <div class="hero-actions"><a class="button" href="${contactPath(locale, "gestion")}">${t(locale, "Demander une proposition de gestion", "Request a management proposal")}${arrow}</a><a class="text-link" href="#services">${t(locale, "Comprendre les services et les frais", "Understand the services and fees")}</a></div>
      <p class="hero-reassurance">${t(locale, "Une seule équipe pour toute votre location. Des honoraires et des frais expliqués avant de commencer.", "One team for every part of your rental. Fees and expenses explained before you start.")}</p></div>
      <div class="hero-visual" data-hospitality-scene data-illustration-active="false" aria-hidden="true">${hospitalityArt(locale)}</div>
    </div>
    <div class="hero-bottom container"><a class="scroll-cue" href="#services"><span aria-hidden="true">↓</span>${t(locale, "Votre gestion, en détail", "Your management, in detail")}</a><p class="territory-note">${t(locale, "De Ghisonaccia à Porto-Vecchio", "From Ghisonaccia to Porto-Vecchio")}</p><button id="motion-toggle" type="button" aria-pressed="false" aria-label="${t(locale, "Mettre les animations en pause", "Pause animations")}" data-pause="${t(locale, "Mettre les animations en pause", "Pause animations")}" data-play="${t(locale, "Reprendre les animations", "Resume animations")}"><span class="motion-icon" aria-hidden="true">Ⅱ</span><span class="motion-label">${t(locale, "Animations", "Animations")}</span></button></div>
  </section>
  <section class="section services-section" id="services"><span id="formules" class="anchor-target" aria-hidden="true"></span><span id="comparaison" class="anchor-target" aria-hidden="true"></span><div class="container">
    <div class="section-heading" data-reveal><div><p class="eyebrow">${t(locale, "01 — LA GESTION COMPLÈTE", "01 — FULL MANAGEMENT")}</p><h2>${t(locale, "Votre location,<br><em>prise en charge de A à Z.</em>", "Every part of your rental,<br><em>taken care of.</em>")}</h2></div><p>${t(locale, "Vous nous confiez les clés, nous gérons la suite. De la mise en ligne à la préparation du prochain séjour, Inastia s’occupe de l’annonce, des voyageurs et de votre maison. Vous avez un seul interlocuteur pour l’ensemble.", "You hand us the keys and we take it from there. From publishing the listing to preparing the next stay, Inastia looks after the bookings, the guests and your home. One team handles the whole process for you.")}</p></div>
    <div class="service-grid">${services.map((service, index) => `<article class="service-card management-pillar" data-reveal><div class="service-card-heading"><span class="service-number">0${index + 1}</span>${serviceArt(service.art)}</div><h3>${service.title}</h3><p class="service-audience">${service.text}</p><ul class="management-pillar-list">${service.items.map((item) => `<li>${item}</li>`).join("")}</ul><a class="service-card-link" href="${path(locale, "gestion-airbnb-corse-du-sud")}#${service.section}">${service.link}${arrow}</a></article>`).join("")}</div>
    <div class="full-service-detail" aria-labelledby="full-service-title"><h3 id="full-service-title">${t(locale, "Concrètement, nous nous occupons de tout cela.", "Here is what we take care of for you.")}</h3><ol class="full-service-list">${fullServices.map((service, index) => `<li data-reveal><div class="full-service-visual" aria-hidden="true">${serviceDetailArt(index)}<span class="full-service-number">0${index + 1}</span></div><h4><a href="${path(locale, "gestion-airbnb-corse-du-sud")}#section-${service.section}">${service.title}${arrow}</a></h4><p>${service.text}</p></li>`).join("")}</ol></div>
    <div class="management-agreement"><dl><div><dt>${t(locale, "Toute la gestion, une seule équipe", "The whole rental, one team")}</dt><dd>${t(locale, "Vous n’avez pas à chercher un prestataire pour chaque tâche ni à organiser les séjours à distance. Nous gérons les réservations, les voyageurs et les interventions pour vous.", "You do not need to find a contractor for every task or organise stays from a distance. We handle bookings, guests and on-site work for you.")}</dd></div><div><dt>${t(locale, "Vous profitez de votre maison", "You enjoy your home")}</dt><dd>${t(locale, "Vous choisissez vos périodes personnelles et encaissez directement les loyers. Nous vous tenons informé et vous présentons les dépenses supplémentaires à valider. Les honoraires et frais de séjour sont détaillés dans votre proposition.", "You choose your own stays and receive rental income directly. We keep you informed and ask you to approve extra expenses. Management fees and stay-related costs are itemised in your proposal.")}</dd></div></dl><a class="button" href="${contactPath(locale, "gestion")}">${t(locale, "Demander une proposition de gestion", "Request a management proposal")}${arrow}</a></div>
  </div></section>
  ${managementArt(locale)}
  <section class="presence-section"><div class="container">
    <div class="presence-grid"><div class="presence-heading" data-reveal><p class="eyebrow">${t(locale, "02 — UNE ÉQUIPE FAMILIALE", "02 — A FAMILY TEAM")}</p><h2>${t(locale, "Qui suit votre maison<br><em>sur place.</em>", "Who looks after<br><em>your home locally.</em>")}</h2></div><div class="presence-copy" data-reveal><p class="presence-lead">${t(locale, "Une équipe familiale basée à Travo, un lien direct pour votre maison.", "A family team based in Travo, a direct connection to your home.")}</p><p>${t(locale, "Propriétaires nous-mêmes, nous savons que votre maison compte au-delà des réservations. Vous échangez directement avec nous sur le suivi de votre location. Nous coordonnons le quotidien et vous signalons les points qui demandent votre décision, pour que vous restiez informé même à distance.", "As owners ourselves, we know your home matters beyond its bookings. You speak directly with us about your rental. We coordinate the day-to-day work and flag decisions for you, keeping you informed even when you are away.")}</p><a class="text-link" href="${path(locale, "about")}">${t(locale, "Découvrir notre façon de travailler", "Discover how we work")}${arrow}</a></div></div>
    <div class="local-area" id="zone"><div><h3>${t(locale, "La côte est, au quotidien.", "Corsica’s east coast, every day.")}</h3><p>${t(locale, "De Ghisonaccia à Porto-Vecchio, ainsi qu’à Prunelli-di-Fiumorbo, Ventiseri, Solaro et Conca. Votre adresse permet de confirmer les prestations possibles.", "From Ghisonaccia to Porto-Vecchio, also covering Prunelli-di-Fiumorbo, Ventiseri, Solaro and Conca. Your address lets us confirm the services available.")}</p></div><div class="zone-list">${zones.map(([name, slug]) => `<a href="${path(locale, slug)}"><span>${name}</span>${arrow}</a>`).join("")}</div></div>
  </div></section>
  <section class="section portfolio-section" id="portfolio"><span id="resultats" class="anchor-target" aria-hidden="true"></span><div class="container">
    <div class="section-heading" data-reveal><div><p class="eyebrow">${t(locale, "03 — LES MAISONS ET LES SÉJOURS", "03 — HOMES AND STAYS")}</p><h2>${t(locale, "Des maisons qui comptent.<br><em>Des clés qui nous sont confiées.</em>", "Homes that matter.<br><em>Keys entrusted to us.</em>")}</h2></div><p>${t(locale, "Quelques maisons de notre portfolio, sur la côte est. Leur configuration, leurs accès et les habitudes de leurs propriétaires guident l’organisation de notre gestion.", "A few homes from our east coast portfolio. Their layout, access and owners’ routines shape how we organise management.")}</p></div>
    <div class="property-list">${properties.map((property, index) => `<figure class="property-row" data-reveal><span class="property-index">0${index + 1}</span>${picture(property.image, `${property.name} · ${property.location}`, "property-thumb")}<figcaption><span class="eyebrow">${property.type}</span><h3>${property.name}</h3><p>${property.location}</p></figcaption></figure>`).join("")}</div>
    <div class="care-proof"><div><p class="eyebrow">${t(locale, "LE SUIVI ENTRE LES SÉJOURS", "CARE BETWEEN STAYS")}</p><h3>${t(locale, "Préparer, vérifier,<br>vous tenir informé.", "Prepare, check,<br>keep you informed.")}</h3><p>${t(locale, "Avant chaque arrivée, nous organisons le ménage, le linge et les accès, puis vérifions la préparation de votre maison. Nous suivons les anomalies constatées et les actions nécessaires pour le prochain séjour.", "Before each arrival, we arrange cleaning, linen and access, then check that your home is ready. We follow up any issues and the work needed for the next stay.")}</p><a class="text-link" href="${path(locale, "gestion-airbnb-corse-du-sud")}#section-3">${t(locale, "Voir le suivi de votre maison", "See how we care for your home")}${arrow}</a></div><ol class="care-steps">${care.map(([title, text]) => `<li><h4>${title}</h4><p>${text}</p></li>`).join("")}</ol></div>
    ${reviews(locale)}
  </div></section>
  ${pricing(locale)}
  <section class="section process-section" id="processus"><div class="container"><div class="section-heading" data-reveal><div><p class="eyebrow">${t(locale, "04 — DU PREMIER ÉCHANGE AU DÉMARRAGE", "04 — FROM FIRST CONTACT TO GETTING STARTED")}</p><h2>${t(locale, "Ce qui se passe<br><em>après votre demande.</em>", "What happens<br><em>after your enquiry.</em>")}</h2></div><a class="text-link" href="${path(locale, "audit-gratuit-potentiel-locatif")}">${t(locale, "Encore en réflexion ? Découvrez l’audit gratuit", "Still considering it? Explore the free review")}${arrow}</a></div><ol class="process-list">${steps.map(([title, text], index) => `<li data-reveal><span class="step-index">0${index + 1}</span><div><h3>${title}</h3><p>${text}</p></div></li>`).join("")}</ol><p class="process-note">${t(locale, "L’audit est une analyse qualitative, sans prévision de revenus. Le périmètre, le coût et les modalités de l’accompagnement sont précisés avant de commencer.", "The review is qualitative, not a rental income forecast. Scope, cost and arrangements are specified before work begins.")} <a href="/cgv" lang="fr">${t(locale, "Consulter les CGV", "Read the terms (French)")}</a>.</p></div></section>
  ${faq(locale, questions)}${contactCallout(locale)}`;
}
