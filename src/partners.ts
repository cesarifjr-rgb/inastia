import type { Locale } from "./content/pages.ts";
import { partnerFaq, partnerProfiles } from "./content/partners.ts";
import { intendanceSlug } from "./content/intendance.ts";
import { arrow, escape, path, t } from "./lib.ts";

function partnerMail(locale: Locale, profile?: string): string {
  const subject = t(locale, "Partenariat Inastia", "Partnering with Inastia") + (profile ? ` — ${profile}` : "");
  const body = t(locale,
    "Bonjour Inastia,\n\nJe souhaite échanger avec vous au sujet d’un partenariat.\n\nMon nom et mon entreprise :\nMon activité :\nMon secteur d’intervention :\nLa collaboration envisagée :\nMes disponibilités pour échanger :\n\nÀ bientôt,",
    "Hello Inastia,\n\nI would like to discuss a partnership with you.\n\nMy name and business:\nMy expertise:\nMy service area:\nHow we could work together:\nA good time to get in touch:\n\nBest regards,");
  return escape(`mailto:contact@inastia.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
}

function partnerPhoto(name: string, alt: string, priority = false): string {
  return `<picture><source type="image/avif" srcset="/images/${name}-480.avif 480w, /images/${name}-800.avif 800w, /images/${name}-1200.avif 1200w" sizes="(min-width: 1024px) 54vw, 100vw"><img src="/images/${name}-800.webp" srcset="/images/${name}-480.webp 480w, /images/${name}-800.webp 800w, /images/${name}-1200.webp 1200w" sizes="(min-width: 1024px) 54vw, 100vw" width="1200" height="805" alt="${escape(alt)}" loading="${priority ? "eager" : "lazy"}" ${priority ? 'fetchpriority="high"' : ""} decoding="async"></picture>`;
}

const connectionMark = `<svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M40 12v56M12 40h56M20 20l40 40M20 60l40-40" stroke="currentColor" stroke-width="1.2"/><circle cx="40" cy="40" r="20" stroke="currentColor" stroke-width="1.2"/><circle cx="40" cy="40" r="6" fill="currentColor"/></svg>`;

export function partners(locale: Locale): string {
  const profiles = partnerProfiles[locale];
  const steps = locale === "fr" ? [
    ["Faisons connaissance.", "Votre activité, votre secteur, vos attentes. Nous échangeons directement pour comprendre ce que nous pouvons construire ensemble."],
    ["Posons un cadre clair.", "Rôle de chacun, périmètre et conditions : nous les précisons avant toute mise en relation ou intervention."],
    ["Commençons concrètement.", "Une première mise en relation ou une prestation convenue. Nous coordonnons la suite avec les personnes concernées."],
  ] : [
    ["Let’s get acquainted.", "Your expertise, service area and expectations. A direct conversation helps us see what we could build together."],
    ["Agree the details.", "Everyone’s role, the scope and the terms: we clarify these before any introduction or service begins."],
    ["Make a start.", "A first introduction or an agreed service. We coordinate the next steps with the people involved."],
  ];
  return `<div class="partners-page">
    <section class="partners-hero" aria-labelledby="partners-title">
      <div class="partners-hero-copy">
        <nav class="breadcrumb" aria-label="${t(locale, "Fil d’Ariane", "Breadcrumb")}"><a href="${path(locale)}">${t(locale, "Accueil", "Home")}</a><span aria-hidden="true">/</span><span>${t(locale, "Partenaires", "Partners")}</span></nav>
        <p class="eyebrow"><span class="partners-dot" aria-hidden="true"></span>${t(locale, "L’ESPRIT PARTENAIRE · INASTIA", "THE PARTNER SPIRIT · INASTIA")}</p>
        <h1 id="partners-title">${t(locale, "Les bonnes<br>rencontres font<br>les <em>belles maisons.</em>", "Great homes.<br>Good people.<br><em>Better together.</em>")}</h1>
        <p class="partners-lead">${t(locale, "Vous connaissez les propriétaires. Vous avez le savoir-faire. Ensemble, prenons soin des maisons en Corse et des liens qui les entourent.", "You know the owners. You bring the expertise. Together, let’s care for homes in Corsica and the people who make them special.")}</p>
        <div class="partners-hero-actions"><a class="button" href="#devenir-partenaire">${t(locale, "Parlons partenariat", "Let’s work together")}${arrow}</a><a class="partners-discover" href="#collaborations">${t(locale, "Trouver notre lien", "Find your place")}<span aria-hidden="true">↓</span></a></div>
        <p class="partners-hero-location">${t(locale, "UNE ÉQUIPE FAMILIALE. UN TERRITOIRE PARTAGÉ.", "A FAMILY TEAM. A PLACE WE SHARE.")}<span>Ghisonaccia — Porto-Vecchio</span></p>
      </div>
      <figure class="partners-hero-visual">
        ${partnerPhoto("villa_amichi", t(locale, "La terrasse en pierre et la piscine de la Villa d’Amichi, à Pinarello", "The stone terrace and pool at Villa d’Amichi in Pinarello"), true)}
        <div class="partners-photo-label">${t(locale, "CORSE ORIENTALE", "CORSICA’S EAST COAST")} <span>42° N · 09° E</span></div>
        <div class="partners-photo-note">${connectionMark}<p>${t(locale, "Un même territoire.<br><em>Une attention commune.</em>", "A place we share.<br><em>A care we have in common.</em>")}</p></div>
        <figcaption>Villa d’Amichi · Pinarello<span>${t(locale, "Une maison du portfolio Inastia", "A home from the Inastia portfolio")}</span></figcaption>
      </figure>
    </section>

    <div class="partners-values container" role="group" aria-label="${t(locale, "Notre façon de travailler", "Our approach")}"><p><span>01</span>${t(locale, "Un ancrage local", "Local knowledge")}</p><p><span>02</span>${t(locale, "Des rôles clairs", "Clear roles")}</p><p><span>03</span>${t(locale, "Une relation directe", "A direct relationship")}</p></div>

    <section class="partners-section container" id="collaborations" aria-labelledby="collaborations-title">
      <div class="partners-section-heading"><div><p class="eyebrow">${t(locale, "01 / NOS COLLABORATIONS", "01 / WORKING TOGETHER")}</p><h2 id="collaborations-title">${t(locale, "À chacun son métier.<br><em>À nous de faire le lien.</em>", "Each with our expertise.<br><em>Connected by care.</em>")}</h2></div><p>${t(locale, "De la première recommandation au soin quotidien d’une maison, il y a plusieurs façons de travailler ensemble.", "From a first recommendation to the everyday care of a home, there is more than one way to work together.")}</p></div>
      <div class="partners-profiles">${profiles.map((profile, index) => `<article class="partner-profile"><div class="partner-profile-top"><span>0${index + 1}</span>${connectionMark}</div><p class="eyebrow">${escape(profile.label)}</p><h3>${escape(profile.title)}</h3><p class="partner-profile-text">${escape(profile.text)}</p><p class="partner-profile-detail">${escape(profile.detail)}</p><a class="text-link" href="${partnerMail(locale, profile.label)}">${escape(profile.action)}${arrow}</a></article>`).join("")}</div>
    </section>

    <section class="partners-local" aria-labelledby="partners-local-title"><div class="container partners-local-grid"><figure>${partnerPhoto("villa_lova", t(locale, "Cala Lova, une maison du portfolio Inastia à Cala d’Oro, Solenzara", "Cala Lova, a home from the Inastia portfolio in Cala d’Oro, Solenzara"))}<figcaption>Cala Lova · Cala d’Oro · Solenzara</figcaption></figure><div class="partners-local-copy"><p class="eyebrow">${t(locale, "02 / LE TERRAIN NOUS RÉUNIT", "02 / ROOTED IN THE SAME PLACE")}</p><h2 id="partners-local-title">${t(locale, "Le lien local.<br><em>Il change tout.</em>", "Local connections.<br><em>They make a difference.</em>")}</h2><p>${t(locale, "Une maison bien suivie, c’est aussi une équipe qui sait à qui s’adresser. Chez Inastia, nous coordonnons la gestion des locations et l’intendance des résidences secondaires sur la côte orientale.", "A well cared-for home needs a team that knows who to call. At Inastia, we coordinate holiday rental management and second-home care along Corsica’s east coast.")}</p><p>${t(locale, "Vous apportez votre connaissance des propriétaires ou votre savoir-faire. Nous apportons le suivi de la maison et l’organisation des échanges. Chacun garde sa place, autour d’un projet commun.", "You bring your knowledge of homeowners or your expertise. We bring property care and coordination. Everyone has a clear role in a shared project.")}</p><div class="partners-offer-links"><a href="${path(locale, "gestion-airbnb-corse-du-sud")}">${t(locale, "Notre gestion complète", "Our full management")}${arrow}</a><a href="${path(locale, intendanceSlug)}">${t(locale, "Notre intendance", "Our home care")}${arrow}</a></div><div class="partners-local-area"><span>${t(locale, "NOTRE CÔTE ORIENTALE", "OUR EAST COAST")}</span><p>Ghisonaccia · Ventiseri · Solenzara<br>Sainte-Lucie · Pinarello · Lecci · Porto-Vecchio</p></div></div></div></section>

    <section class="partners-section container partners-start" aria-labelledby="partners-start-title"><div class="partners-section-heading"><div><p class="eyebrow">${t(locale, "03 / LE PREMIER PAS", "03 / THE FIRST STEP")}</p><h2 id="partners-start-title">${t(locale, "Tout commence<br><em>par une conversation.</em>", "It all starts<br><em>with a conversation.</em>")}</h2></div><p>${t(locale, "Un échange pour se connaître, un cadre pour bien travailler, puis un premier projet à partager.", "A conversation to get acquainted, clear terms for working together, then a first project to share.")}</p></div><ol class="partners-steps">${steps.map(([title, text], index) => `<li><span class="partners-step-number">0${index + 1}</span><h3>${escape(title!)}</h3><p>${escape(text!)}</p></li>`).join("")}</ol></section>

    <section class="partners-contact" id="devenir-partenaire" aria-labelledby="partners-contact-title"><div class="container partners-contact-grid"><div class="partners-contact-heading"><p class="eyebrow">${t(locale, "ET SI L’ON TRAVAILLAIT ENSEMBLE ?", "SHALL WE WORK TOGETHER?")}</p><h2 id="partners-contact-title">${t(locale, "Les belles relations<br>commencent par<br><em>un bonjour.</em>", "Good partnerships<br>begin with<br><em>a hello.</em>")}</h2>${connectionMark}</div><div class="partners-contact-action"><p>${t(locale, "Parlez-nous de vous, de votre activité et de votre secteur. Nous prendrons le temps d’étudier les possibilités de collaboration.", "Tell us about yourself, your work and your service area. We’ll take the time to explore how we could collaborate.")}</p><a class="button button-cream" href="${partnerMail(locale)}">${t(locale, "Écrire à l’équipe Inastia", "Email the Inastia team")}${arrow}</a><p class="partners-mail-help">${t(locale, "Votre messagerie s’ouvre avec un message à compléter.", "Opens your email app with a message to complete.")}</p><div class="partners-direct"><a href="mailto:contact@inastia.fr">contact@inastia.fr</a><a href="tel:+33613812550">+33 6 13 81 25 50</a></div><p class="partners-contact-note">${t(locale, "Pour ce premier échange, vos coordonnées professionnelles suffisent. Attendons l’accord du propriétaire avant de partager les siennes.", "Your own business contact details are enough for this first conversation. Please get the owner’s permission before sharing theirs.")}</p></div></div></section>

    <section class="partners-section container partners-faq" aria-labelledby="partners-faq-title"><div><p class="eyebrow">${t(locale, "POUR FAIRE CONNAISSANCE", "GETTING TO KNOW EACH OTHER")}</p><h2 id="partners-faq-title">${t(locale, "Quelques réponses,<br><em>avant notre échange.</em>", "A few answers,<br><em>before we talk.</em>")}</h2></div><div class="faq-list">${partnerFaq[locale].map(({ question, answer }) => `<details><summary>${escape(question)}<span aria-hidden="true">+</span></summary><div class="faq-answer"><p>${escape(answer)}</p></div></details>`).join("")}</div></section>
  </div>`;
}
