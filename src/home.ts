import type { Locale } from "./content/pages.ts";
import { arrow, contactPath, path, picture, t } from "./lib.ts";
import { contactCallout, faq, zones } from "./components.ts";
import { hospitalityArt, serviceArt } from "./art.ts";
import { reviews } from "./reviews.ts";

export function home(locale: Locale): string {
  const services = [
    {
      title: t(locale, "Gestion complète", "Full management"),
      audience: t(locale, "Pour déléguer le suivi de votre location.", "For owners who want their rental looked after."),
      delegate: t(locale, "Annonce, réservations, échanges voyageurs et coordination sur place.", "Listing, bookings, guest communication and local coordination."),
      keep: t(locale, "Vos séjours personnels et les décisions qui vous reviennent.", "Your own stays and the decisions that remain yours."),
      cost: t(locale, "Commission sur les revenus locatifs. Prestations et frais précisés au devis.", "Commission on rental income. Services and additional costs specified in the proposal."),
      slug: "gestion-airbnb-corse-du-sud",
      link: t(locale, "Voir la gestion complète", "Explore full management"),
    },
    {
      title: t(locale, "Lancement et gestion d’annonce", "Listing launch and management"),
      audience: t(locale, "Pour démarrer ou améliorer une annonce existante.", "For a new rental or a listing that needs a fresh look."),
      delegate: t(locale, "Présentation, prix, calendrier et suivi de l’annonce à convenir.", "Presentation, prices, calendar and agreed listing support."),
      keep: t(locale, "L’organisation sur place, sauf prestations convenues séparément.", "Local arrangements, unless separate services are agreed."),
      cost: t(locale, "Périmètre, durée du suivi et coût définis dans la proposition.", "Scope, duration of support and cost set out in the proposal."),
      slug: "pack-lancement-airbnb",
      link: t(locale, "Voir le suivi d’annonce", "Explore listing support"),
    },
    {
      title: t(locale, "Accueil et rotation séjour", "Guest welcome and changeovers"),
      audience: t(locale, "Pour garder les réservations et confier le terrain.", "For owners who manage bookings and need local support."),
      delegate: t(locale, "Arrivées, départs, ménage, linge et contrôles selon vos besoins.", "Arrivals, departures, cleaning, linen and agreed checks."),
      keep: t(locale, "La gestion de vos annonces et de vos réservations.", "Management of your listings and bookings."),
      cost: t(locale, "Selon le logement et les passages. Linge et consommables détaillés au devis.", "Based on the home and visits. Linen and supplies detailed in the proposal."),
      slug: "menage-airbnb-corse-du-sud",
      link: t(locale, "Voir l’accueil et les rotations", "Explore guest welcome and changeovers"),
    },
  ];
  const questions = [
    {
      question: t(locale, "Puis-je continuer à profiter de ma maison ?", "Can I still enjoy my own home?"),
      answer: t(locale, "Oui. Vos périodes personnelles sont définies et bloquées dans le calendrier, en tenant compte des réservations déjà confirmées et des modalités convenues ensemble.", "Yes. We plan and block your own stays in the calendar, taking confirmed bookings and the arrangements agreed together into account."),
    },
    {
      question: t(locale, "Le linge et le ménage sont-ils toujours inclus ?", "Are linen and cleaning always included?"),
      answer: t(locale, "Leur prise en charge dépend de l’accompagnement retenu. Le ménage, le linge, les consommables et leurs coûts sont précisés dans la proposition ; ils ne sont pas systématiquement inclus dans toutes les offres.", "Their inclusion depends on your chosen support. Cleaning, linen, supplies and their costs are specified in the proposal; they are not automatically included in every service."),
    },
    {
      question: t(locale, "Comment sont fixés vos tarifs ?", "How are your fees set?"),
      answer: t(locale, "Le bien, sa localisation, la saison et les prestations donnent le cadre. La gestion complète fonctionne avec une commission sur les revenus locatifs. Pour chaque accompagnement, les montants, la durée et les frais éventuels sont précisés dans la proposition et le contrat.", "The property, location, season and services define the scope. Full management is based on commission on rental income. For each service, amounts, duration and any additional costs are specified in the proposal and agreement."),
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
    { image: "villa_lova", name: "Villa Lova", location: "Cala d’Oro · Solenzara", type: t(locale, "Maison de caractère", "Character home") },
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
      <p class="hero-description">${t(locale, "De Ghisonaccia à Porto-Vecchio, notre conciergerie familiale accompagne les propriétaires : gestion complète, lancement et gestion d’annonce, ou accueil entre deux séjours.", "From Ghisonaccia to Porto-Vecchio, our family-run service supports property owners: full management, listing launch and management, or guest welcome between stays.")}</p>
      <div class="hero-actions"><a class="button" href="${contactPath(locale, "audit")}">${t(locale, "Demander mon audit gratuit", "Request my free review")}${arrow}</a><a class="text-link" href="#services">${t(locale, "Comparer les accompagnements", "Compare our services")}</a></div>
      <p class="hero-reassurance">${t(locale, "Un premier échange par appel ou email. Des prestations définies selon votre bien.", "A first conversation by phone or email. Services defined around your home.")}</p></div>
      <div class="hero-visual" data-hospitality-scene data-illustration-active="false" aria-hidden="true">${hospitalityArt(locale)}</div>
    </div>
    <div class="hero-bottom container"><a class="scroll-cue" href="#services"><span aria-hidden="true">↓</span>${t(locale, "Choisir ce que vous déléguez", "Choose what to hand over")}</a><p class="territory-note">${t(locale, "De Ghisonaccia à Porto-Vecchio", "From Ghisonaccia to Porto-Vecchio")}</p><button id="motion-toggle" type="button" aria-pressed="false" aria-label="${t(locale, "Mettre les animations en pause", "Pause animations")}" data-pause="${t(locale, "Mettre les animations en pause", "Pause animations")}" data-play="${t(locale, "Reprendre les animations", "Resume animations")}"><span class="motion-icon" aria-hidden="true">Ⅱ</span><span class="motion-label">${t(locale, "Animations", "Animations")}</span></button></div>
  </section>
  <section class="section services-section" id="services"><span id="formules" class="anchor-target" aria-hidden="true"></span><span id="comparaison" class="anchor-target" aria-hidden="true"></span><div class="container">
    <div class="section-heading" data-reveal><div><p class="eyebrow">${t(locale, "01 — VOTRE ACCOMPAGNEMENT", "01 — YOUR SUPPORT")}</p><h2>${t(locale, "Vous choisissez<br><em>ce que vous déléguez.</em>", "Choose what<br><em>you hand over.</em>")}</h2></div><p>${t(locale, "Tout confier, améliorer votre annonce ou trouver un relais entre les séjours. Comparez ce que chaque accompagnement prend en charge.", "Hand over the day to day, improve your listing or find local support between stays. Compare what each service covers.")}</p></div>
    <div class="service-grid">${services.map((service, index) => `<article class="service-card" data-reveal><div class="service-card-heading"><span class="service-number">0${index + 1}</span>${serviceArt(index)}</div><h3>${service.title}</h3><p class="service-audience">${service.audience}</p><dl class="service-scope"><div><dt>${t(locale, "Vous nous confiez", "You hand over")}</dt><dd>${service.delegate}</dd></div><div><dt>${t(locale, "Vous gardez", "You keep")}</dt><dd>${service.keep}</dd></div><div><dt>${t(locale, "Le coût", "The cost")}</dt><dd>${service.cost}</dd></div></dl><a class="service-card-link" href="${path(locale, service.slug)}">${service.link}${arrow}</a></article>`).join("")}</div>
  </div></section>
  <section class="presence-section"><div class="container">
    <div class="presence-grid"><div class="presence-heading" data-reveal><p class="eyebrow">${t(locale, "02 — UNE ÉQUIPE FAMILIALE", "02 — A FAMILY TEAM")}</p><h2>${t(locale, "Votre maison.<br><em>Notre présence.</em>", "Your home.<br><em>Our local care.</em>")}</h2></div><div class="presence-copy" data-reveal><p class="presence-lead">${t(locale, "Vous échangez directement avec l’équipe Inastia.", "You speak directly with the Inastia team.")}</p><p>${t(locale, "Propriétaires nous-mêmes, nous connaissons les questions que pose le fait de confier ses clés. Nous définissons les prestations avec vous, coordonnons les passages et vous signalons les points qui demandent une décision.", "As owners ourselves, we understand the questions that come with handing over your keys. We agree the services with you, coordinate visits and flag the points that need your decision.")}</p><a class="text-link" href="${path(locale, "about")}">${t(locale, "Découvrir notre façon de travailler", "Discover how we work")}${arrow}</a></div></div>
    <div class="local-area" id="zone"><div><h3>${t(locale, "La côte est, au quotidien.", "Corsica’s east coast, every day.")}</h3><p>${t(locale, "De Ghisonaccia à Porto-Vecchio, ainsi qu’à Prunelli-di-Fiumorbo, Ventiseri, Solaro et Conca. Votre adresse permet de confirmer les prestations possibles.", "From Ghisonaccia to Porto-Vecchio, also covering Prunelli-di-Fiumorbo, Ventiseri, Solaro and Conca. Your address lets us confirm the services available.")}</p></div><div class="zone-list">${zones.map(([name, slug]) => `<a href="${path(locale, slug)}"><span>${name}</span>${arrow}</a>`).join("")}</div></div>
  </div></section>
  <section class="section portfolio-section" id="portfolio"><span id="resultats" class="anchor-target" aria-hidden="true"></span><div class="container">
    <div class="section-heading" data-reveal><div><p class="eyebrow">${t(locale, "03 — LES MAISONS ET LES SÉJOURS", "03 — HOMES AND STAYS")}</p><h2>${t(locale, "Des lieux différents.<br><em>Un soin concret.</em>", "Different homes.<br><em>Practical care.</em>")}</h2></div><p>${t(locale, "Trois maisons de notre portfolio, sur la côte est. Chaque accompagnement se définit selon le logement et les besoins de son propriétaire.", "Three homes from our east coast portfolio. Each arrangement reflects the property and its owner’s needs.")}</p></div>
    <div class="property-list">${properties.map((property, index) => `<figure class="property-row" data-reveal><span class="property-index">0${index + 1}</span>${picture(property.image, `${property.name} · ${property.location}`, "property-thumb")}<figcaption><span class="eyebrow">${property.type}</span><h3>${property.name}</h3><p>${property.location}</p></figcaption></figure>`).join("")}</div>
    <div class="care-proof"><div><p class="eyebrow">${t(locale, "LE SUIVI D’UNE ROTATION", "HOW A CHANGEOVER IS FOLLOWED UP")}</p><h3>${t(locale, "Préparer, vérifier,<br>vous tenir informé.", "Prepare, check,<br>keep you informed.")}</h3><p>${t(locale, "Notre offre d’accueil et de rotation prévoit un suivi documenté. Voici les étapes de cet accompagnement.", "Our guest welcome and changeover service includes documented follow-up. These are the steps we take.")}</p><a class="text-link" href="${path(locale, "menage-airbnb-corse-du-sud")}">${t(locale, "Voir le détail des rotations", "See how changeovers work")}${arrow}</a></div><ol class="care-steps">${care.map(([title, text]) => `<li><h4>${title}</h4><p>${text}</p></li>`).join("")}</ol></div>
    ${reviews(locale)}
  </div></section>
  <section class="section process-section" id="processus"><div class="container"><div class="section-heading" data-reveal><div><p class="eyebrow">${t(locale, "04 — DU PREMIER ÉCHANGE AU DÉMARRAGE", "04 — FROM FIRST CONTACT TO GETTING STARTED")}</p><h2>${t(locale, "Un premier regard.<br><em>Puis un cadre clair.</em>", "A first look.<br><em>Then a clear agreement.</em>")}</h2></div><a class="text-link" href="${path(locale, "audit-gratuit-potentiel-locatif")}">${t(locale, "Ce que comprend l’audit gratuit", "What the free review includes")}${arrow}</a></div><ol class="process-list">${steps.map(([title, text], index) => `<li data-reveal><span class="step-index">0${index + 1}</span><div><h3>${title}</h3><p>${text}</p></div></li>`).join("")}</ol><p class="process-note">${t(locale, "L’audit est une analyse qualitative, sans prévision de revenus. Le périmètre, le coût et les modalités de l’accompagnement sont précisés avant de commencer.", "The review is qualitative, not a rental income forecast. Scope, cost and arrangements are specified before work begins.")} <a href="/cgv" lang="fr">${t(locale, "Consulter les CGV", "Read the terms (French)")}</a>.</p></div></section>
  ${faq(locale, questions)}${contactCallout(locale)}`;
}
