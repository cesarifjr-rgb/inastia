import type { Locale } from "./content/pages.ts";
import { firstRentalChecklist, firstRentalFaq, firstRentalSteps } from "./content/first-rental.ts";
import { arrow, contactPath, escape, path, t } from "./lib.ts";
import { faq } from "./components.ts";

function housePhoto(name: string, alt: string, priority = false): string {
  const sizes = priority ? "(min-width: 900px) 1200px, 800px" : "(min-width: 1700px) 850px, (min-width: 900px) 55vw, 100vw";
  return `<picture><source type="image/avif" srcset="/images/${name}-480.avif 480w, /images/${name}-800.avif 800w, /images/${name}-1200.avif 1200w" sizes="${sizes}"><img src="/images/${name}-800.webp" srcset="/images/${name}-480.webp 480w, /images/${name}-800.webp 800w, /images/${name}-1200.webp 1200w" sizes="${sizes}" width="1200" height="805" alt="${escape(alt)}" ${priority ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async"></picture>`;
}

const sun = `<svg class="first-sun" viewBox="0 0 100 100" fill="none" aria-hidden="true"><circle cx="50" cy="50" r="20"/><circle cx="50" cy="50" r="7"/><path d="M50 4v14m0 64v14M4 50h14m64 0h14M17.5 17.5l10 10m45 45 10 10M17.5 82.5l10-10m45-45 10-10M32.4 7.5l5.4 13m24.4 59 5.4 13M7.5 32.4l13 5.4m59 24.4 13 5.4M7.5 67.6l13-5.4m59-24.4 13-5.4M32.4 92.5l5.4-13m24.4-59 5.4-13"/></svg>`;

export function firstRental(locale: Locale): string {
  const chapters = [
    ["le-parcours", t(locale, "Les étapes", "The journey")],
    ["les-reperes", t(locale, "Votre carnet", "Your notebook")],
    ["le-cadre", t(locale, "L’accompagnement", "Our support")],
    ["faq", t(locale, "Vos questions", "Your questions")],
  ];
  return `<div class="first-rental-page">
    <section class="first-hero" aria-labelledby="first-title">
      <div class="first-hero-copy">
        <nav class="breadcrumb" aria-label="${t(locale, "Fil d’Ariane", "Breadcrumb")}"><a href="${path(locale)}">${t(locale, "Accueil", "Home")}</a><span aria-hidden="true">/</span><span>${t(locale, "Première mise en location", "Your first rental")}</span></nav>
        <p class="eyebrow first-edition"><span aria-hidden="true"></span>${t(locale, "LE CARNET DE VOTRE PREMIÈRE LOCATION", "YOUR FIRST RENTAL NOTEBOOK")}</p>
        <h1 id="first-title">${t(locale, "Votre maison.<br> <em>Sa première<br> saison.</em>", "Your home.<br> <em>Its very first<br> season.</em>")}</h1>
        <p class="first-hero-lead">${t(locale, "Vous imaginez accueillir vos premiers voyageurs en Corse ? Faisons de cette idée un projet bien préparé, à votre rythme.", "Thinking of welcoming your first guests in Corsica? Let’s turn the idea into a well-prepared plan, at your own pace.")}</p>
        <a class="button first-primary" href="${contactPath(locale, "audit")}">${t(locale, "Demander mon audit gratuit", "Request my free review")}${arrow}</a>
        <a class="first-discover" href="#le-parcours">${t(locale, "Découvrir les étapes", "Explore the journey")}<span aria-hidden="true">↓</span></a>
        <p class="first-location">${t(locale, "UNE ÉQUIPE FAMILIALE, EN CORSE", "A FAMILY TEAM, IN CORSICA")}<span>Ghisonaccia — Porto-Vecchio</span></p>
      </div>
      <figure class="first-hero-photo">
        ${housePhoto("villa_amichi", t(locale, "La terrasse et la piscine de la Villa d’Amichi, à Pinarello, Zonza", "The terrace and pool at Villa d’Amichi in Pinarello, Zonza"), true)}
        <div class="first-photo-top"><span>INASTIA · CORSE</span><span>${t(locale, "L’ART D’ACCUEILLIR", "THE ART OF WELCOMING")}</span></div>
        <div class="first-photo-card">${sun}<p>${t(locale, "Une nouvelle histoire.<br> <em>Toujours votre maison.</em>", "A new chapter.<br> <em>Still your home.</em>")}</p></div>
        <figcaption>Villa d’Amichi <span>Pinarello · Zonza</span></figcaption>
      </figure>
    </section>

    <nav class="first-chapters container" aria-label="${t(locale, "Dans ce carnet", "Inside this notebook")}">${chapters.map(([id, label], i) => `<a href="#${id}"><span>0${i + 1}</span>${label}${arrow}</a>`).join("")}</nav>

    <section class="first-intro container" aria-labelledby="first-intro-title"><p class="eyebrow">${t(locale, "LOUER POUR LA PREMIÈRE FOIS", "RENTING OUT FOR THE FIRST TIME")}</p><h2 id="first-intro-title">${t(locale, "Vous n’avez pas à tout savoir.<br> <em>On commence par votre maison.</em>", "You don’t need every answer.<br> <em>We start with your home.</em>")}</h2><p>${t(locale, "Les équipements, les photos, les annonces, les clés… Une première location soulève beaucoup de questions. Nous les reprenons avec vous, dans le bon ordre, pour préparer l’accueil et vous permettre de décider sereinement.", "Equipment, photographs, listings, keys… Your first rental raises plenty of questions. We work through them with you, in the right order, to prepare for guests and help you decide with confidence.")}</p></section>

    <section class="first-journey container" id="le-parcours" aria-labelledby="first-journey-title">
      <div class="first-section-heading"><div><p class="eyebrow">${t(locale, "01 / LE PARCOURS", "01 / THE JOURNEY")}</p><h2 id="first-journey-title">${t(locale, "De l’idée<br> <em>aux premières clés.</em>", "From an idea<br> <em>to the first handover.</em>")}</h2></div><p>${t(locale, "Quatre étapes pour avancer.<br> Et une équipe à vos côtés.", "Four steps to move forward.<br> And a team by your side.")}</p></div>
      <ol class="first-steps">${firstRentalSteps[locale].map((step, i) => `<li class="first-step" data-reveal><span class="first-step-number" aria-hidden="true">0${i + 1}</span><div class="first-step-story"><h3>${escape(step.title)}</h3><p>${escape(step.text)}</p></div><dl class="first-step-roles"><div><dt>${t(locale, "VOUS", "YOU")}</dt><dd>${escape(step.owner)}</dd></div><div><dt>INASTIA</dt><dd>${escape(step.team)}</dd></div></dl></li>`).join("")}</ol>
    </section>

    <section class="first-notebook" id="les-reperes" aria-labelledby="first-notebook-title"><div class="container first-notebook-grid">
      <div class="first-notebook-intro"><p class="eyebrow">${t(locale, "02 / VOTRE CARNET DE DÉPART", "02 / YOUR STARTING NOTES")}</p><h2 id="first-notebook-title">${t(locale, "Quelques repères.<br> <em>Un premier pas.</em>", "A few notes.<br> <em>A first step.</em>")}</h2><p>${t(locale, "Cochez les points que vous avez déjà en tête. Vous pouvez nous contacter même si tout n’est pas encore défini.", "Tick the things you already have in mind. You can contact us even if some details are still undecided.")}</p>
      <figure class="first-notebook-photo">${housePhoto("casa_verde", t(locale, "Casa Verde, une maison du portfolio Inastia à Pinarello, Zonza", "Casa Verde, a home in the Inastia portfolio in Pinarello, Zonza"))}<figcaption>Casa Verde · Pinarello · Zonza</figcaption></figure></div>
      <div class="first-checklist" data-first-checklist>
        <div class="first-checklist-heading"><span>${t(locale, "MON PROJET DE LOCATION", "MY RENTAL PLANS")}</span>${sun}</div>
        <fieldset><legend class="sr-only">${t(locale, "Les repères pour notre premier échange", "Notes for our first conversation")}</legend>${firstRentalChecklist[locale].map((item, i) => `<label class="first-check"><input type="checkbox" name="first-rental-${i + 1}"><span class="first-check-box" aria-hidden="true"></span><span><strong>${escape(item.title)}</strong><span>${escape(item.detail)}</span></span></label>`).join("")}</fieldset>
        <div class="first-checklist-progress" hidden><progress max="6" value="0" aria-label="${t(locale, "Repères préparés", "Notes prepared")}"></progress><p role="status" aria-live="polite" aria-atomic="true" data-count-label="${t(locale, "repères préparés", "notes prepared")}"></p></div>
        <p class="first-checklist-note">${t(locale, "Le bon moment pour en parler ? Dès que l’envie est là.", "The right time to talk? As soon as the idea takes shape.")}</p>
      </div>
    </div></section>

    <aside class="first-formalities container" aria-labelledby="first-formalities-title"><span class="first-small-number" aria-hidden="true">i</span><div><h2 id="first-formalities-title">${t(locale, "Avant d’ouvrir le calendrier", "Before opening the calendar")}</h2><p>${t(locale, "Les démarches dépendent de votre logement et de sa commune. Vérifiez les formalités applicables auprès de votre mairie, ainsi que votre assurance et les règles de copropriété éventuelles. Ces points se préparent avant la mise en location.", "The formalities depend on your property and its municipality. Check the applicable requirements with your town hall, along with your insurance and any co-ownership rules, before offering the home for rent.")}</p><a href="https://www.service-public.gouv.fr/particuliers/vosdroits/N19104" class="text-link" lang="fr">${t(locale, "Consulter les démarches sur Service Public", "Read the official guidance (French)")}${arrow}</a></div></aside>

    <section class="first-framework" id="le-cadre" aria-labelledby="first-framework-title"><div class="container first-framework-grid"><div><p class="eyebrow">${t(locale, "03 / UN CADRE CLAIR", "03 / CLEAR ARRANGEMENTS")}</p><h2 id="first-framework-title">${t(locale, "Votre première saison.<br> <em>Notre gestion complète.</em>", "Your first season.<br> <em>Our full management.</em>")}</h2><p>${t(locale, "La préparation de votre location s’inscrit dans notre accompagnement de A à Z. Le périmètre, les frais et les conditions sont précisés dans votre proposition, avant de commencer.", "Preparing your rental is part of our service from start to finish. The scope, costs and terms are set out in your proposal before work begins.")}</p><a class="text-link" href="${path(locale, "gestion-airbnb-corse-du-sud")}">${t(locale, "Explorer la gestion complète", "Explore full management")}${arrow}</a></div><div class="first-fee"><p class="first-fee-label">${t(locale, "HONORAIRES DE GESTION", "MANAGEMENT FEE")}</p><p class="first-fee-amount">20<span>%</span><small>${t(locale, "TTC", "incl. VAT")}</small></p><p>${t(locale, "Des nuitées, avant frais de plateforme.<br> Hors ménage, linge et taxe de séjour.", "Of accommodation charges, before platform fees.<br> Excluding cleaning, linen and tourist tax.")}</p><a href="${path(locale, "gestion-airbnb-corse-du-sud")}#tarifs">${t(locale, "Comprendre chaque coût", "Understand each cost")}${arrow}</a></div></div></section>

    ${faq(locale, firstRentalFaq[locale], "audit")}

    <section class="first-final" aria-labelledby="first-final-title"><div class="container first-final-inner"><div class="first-final-mark">${sun}<span>INASTIA · CORSE</span></div><p class="eyebrow">${t(locale, "LA SUITE S’ÉCRIT ENSEMBLE", "LET’S WRITE THE NEXT CHAPTER")}</p><h2 id="first-final-title">${t(locale, "Et si tout commençait<br> <em>par votre maison ?</em>", "What if it all started<br> <em>with your home?</em>")}</h2><p>${t(locale, "Présentez-nous votre projet, même s’il n’en est qu’à ses débuts. L’audit gratuit permet de faire le point sur les premières étapes, sans prévision de revenus.", "Tell us about your plans, even if they are only just taking shape. The free review helps identify the first steps, without an income forecast.")}</p><a class="button button-cream" href="${contactPath(locale, "audit")}">${t(locale, "Demander mon audit gratuit", "Request my free review")}${arrow}</a><p class="first-final-help">${t(locale, "Un rappel sous 24 h, selon vos disponibilités, pour ce premier échange.", "A callback within 24 hours, at a time that suits you, for our first conversation.")}</p><a class="first-final-phone" href="tel:+33613812550">+33 6 13 81 25 50</a></div></section>
  </div>`;
}
