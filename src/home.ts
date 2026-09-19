import type { Locale } from "./content/pages.ts";
import { arrow, contactPath, path, picture, t } from "./lib.ts";
import { contactCallout, faq, zones } from "./components.ts";
import { hospitalityArt } from "./art.ts";
import { reviews } from "./reviews.ts";
import { managementArt } from "./management-art.ts";
import { pricing } from "./pricing.ts";
import { intendanceTeaser } from "./intendance.ts";

export function home(locale: Locale): string {
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
      answer: t(locale, "Pour vos locations, l’annonce, les échanges voyageurs et les rotations font partie de la gestion complète. Pour une résidence secondaire à usage personnel, notre offre d’intendance prévoit des visites régulières et des prestations complémentaires sur devis. Nous ne proposons pas de ménage ou de gestion d’annonce isolés en dehors de ces offres.", "For rentals, listings, guest communication and changeovers are part of full management. For a second home used for your own stays, our home-care service provides regular visits and separately quoted extras. We do not provide standalone cleaning or listing management outside these services."),
    },
    {
      question: t(locale, "Pouvez-vous suivre ma maison si je ne la loue pas ?", "Can you care for my home if I don’t rent it out?"),
      answer: t(locale, "Oui. Notre offre d’intendance de résidence secondaire comprend une ou deux visites programmées par mois, un compte rendu photo, la garde des clés et le signalement des anomalies. Essentielle est à 89 € TTC par mois et Sérénité à 159 € TTC par mois, avec 120 € TTC de mise en place. Les conditions d’accès, les prestations et les suppléments sont détaillés sur notre page Intendance.", "Yes. Our second-home care service includes one or two scheduled visits a month, a photo report, key holding and reporting any issues found. Essential costs €89 a month and Serenity €159 a month, including VAT, with a €120 setup fee including VAT. Access conditions, services and extras are detailed on our Home care page."),
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
      answer: t(locale, "Nous intervenons sur la côte orientale de la Corse, de Ghisonaccia à Porto-Vecchio. Nous vérifions l’adresse, les accès, le type de logement et les prestations nécessaires avant de confirmer la prise en charge. Votre bien peut déjà être loué ou se préparer à une première saison.", "We work along Corsica’s east coast, from Ghisonaccia to Porto-Vecchio. We check the address, access, property type and services needed before confirming management. Your home may already be rented out or preparing for its first season."),
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
  const steps = [
    [t(locale, "Présentez-nous votre maison.", "Tell us about your home."), t(locale, "Où se trouve votre bien ? Est-il déjà loué ? Quand souhaitez-vous déléguer sa gestion ? Quelques informations suffisent pour ouvrir la discussion.", "Where is your home? Is it already rented out? When would you like us to take over? A few details are enough to start the conversation.")],
    [t(locale, "Vérifions la prise en charge.", "Check whether we can manage it."), t(locale, "Nous étudions votre situation et les priorités de votre logement. Si vous demandez l’audit gratuit, nous vous rappelons sous 24 h, selon vos disponibilités, pour ce premier échange.", "We consider your situation and your home’s priorities. If you request a free review, we’ll call within 24 hours, at a time that suits you, for this first conversation.")],
    [t(locale, "Examinez votre proposition.", "Review your proposal."), t(locale, "Vous recevez une proposition précisant les prestations, la commission et les frais éventuels. Une fois le cadre convenu, nous organisons la prise en charge de votre location.", "You receive a proposal setting out services, commission and any additional costs. Once the terms are agreed, we arrange to take over management of your rental.")],
  ];
  return `
  <section class="home-hero">
    <div class="hero-aura" aria-hidden="true"></div>
    <div class="hero-topline container"><p class="eyebrow"><span class="status-dot" aria-hidden="true"></span>${t(locale, "CONCIERGERIE FAMILIALE EN CORSE", "FAMILY-RUN PROPERTY CARE IN CORSICA")}</p><span class="hero-coordinate" aria-hidden="true">42° N · 09° E</span></div>
    <div class="hero-main container">
      <div class="hero-copy"><h1><span>${t(locale, "Votre location en Corse.", "Your holiday rental in Corsica.")}</span><span class="hero-accent">${t(locale, "On s’occupe de tout.", "We take care of everything.")}</span></h1>
      <p class="hero-description">${t(locale, "Notre équipe familiale gère votre location de A à Z. Vous profitez de votre maison et encaissez directement les loyers ; nous prenons en charge l’organisation des séjours.", "Our family team manages your rental from start to finish. You enjoy your home and receive rental income directly; we take care of organising the stays.")}</p>
      <p class="hero-assistance">${t(locale, "Assistance voyageurs 24 h/24, 7 j/7", "Guest assistance available 24/7")}</p>
      <p class="hero-location">${t(locale, "Votre conciergerie familiale, de Ghisonaccia à Porto-Vecchio.", "Your family-run property management team, from Ghisonaccia to Porto-Vecchio.")}</p>
      <div class="hero-actions"><a class="button" href="${contactPath(locale, "gestion")}">${t(locale, "Confier la gestion de mon bien", "Have my property managed")}${arrow}</a><a class="text-link" href="#tarifs">${t(locale, "Comprendre les honoraires", "Understand our fees")}</a></div>
      <p class="hero-reassurance">${t(locale, "20 % TTC des nuitées, avant frais de plateforme. Hors ménage, linge et taxe de séjour.", "20% incl. VAT of accommodation charges, before platform fees. Excluding cleaning, linen and tourist tax.")}</p></div>
      <div class="hero-visual" data-hospitality-scene data-illustration-active="false" aria-hidden="true">${hospitalityArt(locale)}</div>
    </div>
    <div class="hero-bottom container"><a class="scroll-cue" href="#services"><span aria-hidden="true">↓</span>${t(locale, "Votre gestion, en un regard", "Your management, at a glance")}</a><p class="territory-note">${t(locale, "De Ghisonaccia à Porto-Vecchio", "From Ghisonaccia to Porto-Vecchio")}</p><button id="motion-toggle" type="button" aria-pressed="false" aria-label="${t(locale, "Mettre les animations en pause", "Pause animations")}" data-pause="${t(locale, "Mettre les animations en pause", "Pause animations")}" data-play="${t(locale, "Reprendre les animations", "Resume animations")}"><span class="motion-icon" aria-hidden="true">Ⅱ</span><span class="motion-label">${t(locale, "Animations", "Animations")}</span></button></div>
  </section>
  <div class="services-section" id="services"><span id="formules" class="anchor-target" aria-hidden="true"></span><span id="comparaison" class="anchor-target" aria-hidden="true"></span>
    ${managementArt(locale)}
    <div class="container home-service-summary"><p>${t(locale, "Vous choisissez vos séjours personnels et validez les dépenses supplémentaires. Nous vous tenons informé du suivi de votre maison.", "You choose your own stays and approve extra expenses. We keep you informed about the care of your home.")}</p><a class="text-link" href="${path(locale, "gestion-airbnb-corse-du-sud")}#section-1">${t(locale, "Voir les sept prestations en détail", "Explore all seven services")}${arrow}</a></div>
  </div>
  ${pricing(locale, false)}
  <section class="presence-section"><div class="container">
    <div class="presence-grid"><div class="presence-heading" data-reveal><p class="eyebrow">${t(locale, "UNE ÉQUIPE FAMILIALE", "A FAMILY TEAM")}</p><h2>${t(locale, "Qui suit votre maison<br><em>sur place.</em>", "Who looks after<br><em>your home locally.</em>")}</h2></div><div class="presence-copy" data-reveal><p class="presence-lead">${t(locale, "Une équipe familiale, un lien direct pour votre maison.", "A family team based in Travo, a direct connection to your home.")}</p><p>${t(locale, "Propriétaires nous-mêmes, nous savons que votre maison compte au-delà des réservations. Vous échangez directement avec nous sur le suivi de votre location. Nous coordonnons le quotidien et vous signalons les points qui demandent votre décision, pour que vous restiez informé même à distance.", "As owners ourselves, we know your home matters beyond its bookings. You speak directly with us about your rental. We coordinate the day-to-day work and flag decisions for you, keeping you informed even when you are away.")}</p><a class="text-link" href="${path(locale, "about")}">${t(locale, "Découvrir notre façon de travailler", "Discover how we work")}${arrow}</a></div></div>
    <div class="local-area" id="zone"><div><h3>${t(locale, "La côte orientale, au quotidien.", "Corsica’s east coast, every day.")}</h3><p>${t(locale, "De Ghisonaccia à Porto-Vecchio, en passant par Ventiseri, Solenzara, Sainte-Lucie de Porto-Vecchio et Lecci. Votre adresse permet de confirmer les prestations possibles.", "From Ghisonaccia to Porto-Vecchio, also covering Prunelli-di-Fiumorbo, Ventiseri, Solaro and Conca. Your address lets us confirm the services available.")}</p></div><div class="zone-list">${zones.map(([name, slug]) => `<a href="${path(locale, slug)}"><span>${name}</span>${arrow}</a>`).join("")}</div></div>
  </div></section>
  <section class="section portfolio-section" id="portfolio"><span id="resultats" class="anchor-target" aria-hidden="true"></span><div class="container">
    <div class="section-heading" data-reveal><div><p class="eyebrow">${t(locale, "LES MAISONS ET LES SÉJOURS", "HOMES AND STAYS")}</p><h2>${t(locale, "Des maisons qui comptent.<br><em>Des clés qui nous sont confiées.</em>", "Homes that matter.<br><em>Keys entrusted to us.</em>")}</h2></div><p>${t(locale, "Quelques maisons de notre portfolio, sur la côte orientale. Leur configuration, leurs accès et les habitudes de leurs propriétaires guident l’organisation de notre gestion.", "A few homes from our east coast portfolio. Their layout, access and owners’ routines shape how we organise management.")}</p></div>
    <div class="property-list">${properties.map((property, index) => `<figure class="property-row" data-reveal><span class="property-index">0${index + 1}</span>${picture(property.image, `${property.name} · ${property.location}`, "property-thumb")}<figcaption><span class="eyebrow">${property.type}</span><h3>${property.name}</h3><p>${property.location}</p></figcaption></figure>`).join("")}</div>
    ${reviews(locale)}
  </div></section>
  ${intendanceTeaser(locale)}
  <section class="section process-section" id="processus"><div class="container"><div class="section-heading" data-reveal><div><p class="eyebrow">${t(locale, "DU PREMIER ÉCHANGE AU DÉMARRAGE", "FROM FIRST CONTACT TO GETTING STARTED")}</p><h2>${t(locale, "Ce qui se passe<br><em>après votre demande.</em>", "What happens<br><em>after your enquiry.</em>")}</h2></div><a class="text-link" href="${path(locale, "audit-gratuit-potentiel-locatif")}">${t(locale, "Encore en réflexion ? Découvrez l’audit gratuit", "Still considering it? Explore the free review")}${arrow}</a></div><ol class="process-list">${steps.map(([title, text], index) => `<li data-reveal><span class="step-index">0${index + 1}</span><div><h3>${title}</h3><p>${text}</p></div></li>`).join("")}</ol><p class="process-note">${t(locale, "L’audit est une analyse qualitative, sans prévision de revenus. Le périmètre, le coût et les modalités de l’accompagnement sont précisés avant de commencer.", "The review is qualitative, not a rental income forecast. Scope, cost and arrangements are specified before work begins.")} <a href="/cgv" lang="fr">${t(locale, "Consulter les CGV", "Read the terms (French)")}</a>.</p></div></section>
  ${faq(locale, questions)}${contactCallout(locale)}`;
}
