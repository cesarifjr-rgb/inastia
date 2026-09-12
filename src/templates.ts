import { readFileSync } from "node:fs";
import type { Locale, PageContent } from "./content/pages.ts";
import { header, footer, contactCallout, faq, zones } from "./components.ts";
import { arrow, contactPath, escape, path, picture, t } from "./lib.ts";
import { managementArt } from "./management-art.ts";
import { pricing } from "./pricing.ts";
import { intendancePlans } from "./content/intendance.ts";

export interface DocumentOptions {
  locale: Locale;
  slug: string;
  title: string;
  description: string;
  content: string;
  noindex?: boolean;
  translated?: boolean;
}

export function document(options: DocumentOptions): string {
  const {
    locale,
    slug,
    title,
    description,
    content,
    noindex = false,
    translated = true,
  } = options;
  const url = `https://inastia.fr${path(locale, slug)}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Inastia",
    url: "https://inastia.fr",
    telephone: "+33613812550",
    email: "contact@inastia.fr",
    logo: "https://inastia.fr/logo-brand.png",
    areaServed: zones.map(([name]) => name),
    description:
      "Conciergerie familiale : gestion de locations saisonnières et intendance de résidences secondaires sur la côte orientale de la Corse, de Ghisonaccia à Porto-Vecchio.",
  };
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f8f3e9"><meta name="google-site-verification" content="4E9Qh_lOcgiqFY61I8s-oKAleTuYG3o4sMJiYvTf8v4"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><meta name="robots" content="${noindex ? "noindex, follow" : "index, follow"}"><link rel="canonical" href="${url}">${translated && !noindex ? `<link rel="alternate" hreflang="fr" href="https://inastia.fr/${slug}"><link rel="alternate" hreflang="en" href="https://inastia.fr/en/${slug}"><link rel="alternate" hreflang="x-default" href="https://inastia.fr/${slug}">` : ""}<meta property="og:type" content="website"><meta property="og:site_name" content="Inastia"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${url}"><meta property="og:locale" content="${locale === "fr" ? "fr_FR" : "en_GB"}"><meta property="og:image" content="https://inastia.fr/images/inastia-share.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Inastia — les clés de votre maison, le soin de votre accueil"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="https://inastia.fr/images/inastia-share.png"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="preload" href="/fonts/space-grotesk-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/manrope-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script><script type="module" src="/src/client.ts"></script></head><body>${header(locale, slug)}<main id="main" tabindex="-1">${content}</main>${footer(locale)}</body></html>`;
}

export function secondary(locale: Locale, page: PageContent): string {
  const intent = page.kind === "audit" ? "audit" : "gestion";
  const ownerLanding = ["conciergerie-airbnb-zonza-pinarello", "conciergerie-location-saisonniere-solenzara", "conciergerie-airbnb-porto-vecchio"].includes(page.slug);
  const feeNote = ownerLanding ? `<p class="summary-note">${t(locale, "Gestion complète : 20 % TTC des nuitées avant frais de plateforme, hors ménage, linge et taxe de séjour.", "Full management: 20% including VAT of accommodation charges before platform fees, excluding cleaning, linen and tourist tax.")} <a href="${path(locale, "gestion-airbnb-corse-du-sud")}#tarifs">${t(locale, "Voir le détail du tarif", "See pricing details")}</a></p>` : "";
  const summaryTitle = page.kind === "audit"
    ? t(locale, "Un rappel sous 24 h, selon votre convenance.", "A callback within 24 hours, at a time that suits you.")
    : page.kind === "about"
      ? t(locale, "Votre lien avec le terrain.", "Your connection to the ground.")
      : t(locale, "Toute votre location, entre nos mains.", "Your entire rental, in our hands.");
  const summaryItems = page.kind === "audit"
    ? [t(locale, "Une première analyse qualitative", "An initial qualitative review"), t(locale, "Les améliorations à prioriser", "The improvements to prioritise"), t(locale, "Les conditions d’une prise en charge possible", "Conditions for possible management")]
    : page.kind === "about"
      ? [t(locale, "Une relation directe avec notre équipe", "A direct relationship with our team"), t(locale, "Des prestations définies avec vous", "Services agreed with you"), t(locale, "Des informations pour vos décisions", "Information to support your decisions")]
      : page.kind === "service" || ownerLanding
        ? [t(locale, "Annonces, prix et réservations", "Listings, pricing and bookings"), t(locale, "Voyageurs et assistance 24 h/24, 7 j/7", "Guests and 24/7 assistance"), t(locale, "Ménage, linge et suivi de votre maison", "Cleaning, linen and care for your home")]
        : page.sections.flatMap((section) => section.items ?? []).slice(0, 3);
  const summaryNote = page.kind === "audit"
    ? t(locale, "Gratuit, même sans annonce existante. Cette analyse ne constitue pas une prévision de revenus.", "Free, even without an existing listing. This review is not a rental income forecast.")
    : page.kind === "about"
      ? t(locale, "De Ghisonaccia à Porto-Vecchio. Votre adresse permet de confirmer les prestations possibles.", "From Ghisonaccia to Porto-Vecchio. Your address lets us confirm the services available.")
      : t(locale, "Le périmètre, la durée et les frais sont précisés avant le démarrage.", "Scope, duration and costs are specified before work begins.");
  const propertyCaption =
    page.image === "villa_lova"
      ? "Cala Lova · Cala d’Oro"
      : page.image === "casa_verde"
        ? "Casa Verde · Pinarello"
        : "Villa d’Amichi · Pinarello";
  return `<section class="page-hero"><div class="page-hero-copy"><nav class="breadcrumb" aria-label="${t(locale, "Fil d’Ariane", "Breadcrumb")}"><a href="${path(locale)}">${t(locale, "Accueil", "Home")}</a><span aria-hidden="true">/</span><span>${escape(page.eyebrow)}</span></nav><p class="eyebrow">${escape(page.eyebrow)}</p><h1>${escape(page.heading)}</h1><p class="lead">${escape(page.intro)}</p><a class="button" href="${contactPath(locale, "gestion")}">${t(locale, "Confier la gestion de mon bien", "Have my property managed")}${arrow}</a>${feeNote}</div><aside class="page-summary"><p class="eyebrow">${t(locale, "POUR VOTRE BIEN", "FOR YOUR PROPERTY")}</p><h2>${summaryTitle}</h2><ul class="summary-list">${summaryItems.map((item) => `<li>${escape(item)}</li>`).join("")}</ul><p class="summary-note">${summaryNote}</p><figure class="page-property">${picture(page.image, page.imageAlt)}<figcaption>${propertyCaption}<br>${t(locale, "Une maison de notre portfolio", "A home from our portfolio")}</figcaption></figure></aside></section>
  ${page.kind === "service" ? managementArt(locale) : ""}<section class="section"><div class="container page-sections"><nav class="page-aside" aria-label="${t(locale, "Dans cette page", "On this page")}"><p class="eyebrow">${t(locale, "L’essentiel", "At a glance")}</p>${page.sections.map((section, index) => `<a href="#section-${index + 1}">${escape(section.title)}</a>`).join("")}</nav><div>${page.sections.map((section, index) => `<section class="editorial-section" data-reveal id="section-${index + 1}"><h2>${escape(section.title)}</h2><p>${escape(section.text)}</p>${section.items?.length ? `<ul>${section.items.map((item) => `<li>${escape(item)}</li>`).join("")}</ul>` : ""}</section>`).join("")}<nav class="related-links" aria-label="${t(locale, "À découvrir aussi", "Explore more")}">${page.kind === "location" ? `<a href="${path(locale, "gestion-airbnb-corse-du-sud")}">${t(locale, "Gestion complète", "Full management")}</a>` : zones.map(([name, slug]) => `<a href="${path(locale, slug)}">${name}</a>`).join("")}</nav></div></div></section>${page.kind === "service" ? pricing(locale) : ""}${faq(locale, page.faq)}${contactCallout(locale, intent)}`;
}

export function legal(slug: string): string {
  const title =
    {
      "mentions-legales": "Mentions légales",
      privacy: "Politique de confidentialité",
      cgv: "Conditions générales de vente",
    }[slug] ?? "Informations légales";
  const content = readFileSync(`src/content/legal/${slug}.html`, "utf8");
  return `<div class="container"><article class="legal-layout"><nav class="breadcrumb" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span aria-hidden="true">/</span><span>Informations légales</span></nav><p class="eyebrow">INASTIA — INFORMATIONS LÉGALES</p><h1>${title}</h1><div class="legal-content">${content}</div></article></div>`;
}

export function contact(locale: Locale): string {
  const field = (
    name: string,
    label: string,
    type = "text",
    required = false,
    autocomplete = "",
    full = false,
    maxlength = 100,
  ): string =>
    `<div class="field ${full ? "field-full" : ""}" ${name === "listingUrl" ? "data-rental-field" : ""}><label for="${name}">${label}${required ? " *" : ""}</label><input id="${name}" name="${name}" type="${type}" ${required ? "required" : ""} ${autocomplete ? `autocomplete="${autocomplete}"` : ""} maxlength="${maxlength}"></div>`;
  return `<div class="container contact-layout"><div class="contact-intro"><nav class="breadcrumb" aria-label="${t(locale, "Fil d’Ariane", "Breadcrumb")}"><a href="${path(locale)}">${t(locale, "Accueil", "Home")}</a><span aria-hidden="true">/</span><span>Contact</span></nav><p class="eyebrow">${t(locale, "VOTRE PROJET COMMENCE ICI", "YOUR PLANS START HERE")}</p><h1 id="contact-title">${t(locale, "Préparons la gestion de votre maison", "Let’s prepare the management of your home")}</h1><p id="contact-lead" class="lead">${t(locale, "Indiquez où se trouve votre logement et ce que vous souhaitez déléguer. Ces informations nous permettent de vérifier sa prise en charge et de préparer notre premier échange.", "Tell us where your home is and what you would like to delegate. This helps us check whether we can manage it and prepare our first conversation.")}</p><div class="contact-direct"><a href="tel:+33613812550">+33 6 13 81 25 50</a><a href="mailto:contact@inastia.fr">contact@inastia.fr</a><p>${t(locale, "De Ghisonaccia à Porto-Vecchio.<br> Une conciergerie familiale, ancrée en Corse.", "From Ghisonaccia to Porto-Vecchio.<br> A family-run service, rooted in Corsica.")}</p></div></div>
  <form id="contact-form" class="contact-form" data-locale="${locale}" data-consent-version="commercial-2026-09-06-v1" method="post" action="/api/contact"><h2 id="contact-form-title">${t(locale, "Confier la gestion de mon bien", "Have my property managed")}</h2><p class="form-note">${t(locale, "Les champs marqués d’un * sont obligatoires.", "Fields marked * are required.")}</p><div class="form-grid">
  <div class="field field-full contact-service-selector"><label for="contact-intent">${t(locale, "Votre besoin", "Your service")} *</label><select id="contact-intent" name="intent" required><option value="gestion">${t(locale, "Gestion locative complète", "Full rental management")}</option><option value="intendance">${t(locale, "Intendance de résidence secondaire", "Second-home care")}</option></select></div>
  <div class="intendance-form-fields" data-intendance-fields hidden><div class="field"><label for="intendancePlan">${t(locale, "Formule envisagée (facultatif)", "Preferred plan (optional)")}</label><select id="intendancePlan" name="intendancePlan" disabled><option value="">${t(locale, "À définir ensemble", "To discuss together")}</option>${intendancePlans.map(plan => `<option value="${plan.id}">${plan.name[locale]} — ${plan.monthly} € ${t(locale, "TTC/mois", "incl. VAT/month")}</option>`).join("")}<option value="surmesure">${t(locale, "Sur mesure", "Tailored care")}</option></select></div><div class="field"><label for="surface">${t(locale, "Surface en m² (facultatif)", "Floor area in m² (optional)")}</label><input id="surface" name="surface" type="number" min="1" max="10000" step="0.1" inputmode="decimal" disabled></div><p class="field-full intendance-form-note">${t(locale, "Le premier échange et le devis sont gratuits. La mise en place de 120 € TTC intervient après votre accord. Précisez les dépendances et les accès dans votre message.", "The first conversation and quote are free. The €120 setup fee including VAT applies after your approval. Tell us about outbuildings and access in your message.")}</p></div>
  <div class="field"><label for="propertyType">${t(locale, "Type de bien", "Property type")} *</label><select id="propertyType" name="propertyType" required><option value="">${t(locale, "Choisir", "Select")}</option><option value="Villa">Villa</option><option value="Appartement">${t(locale, "Appartement", "Apartment")}</option><option value="Maison">${t(locale, "Maison", "House")}</option><option value="Autre">${t(locale, "Autre", "Other")}</option></select></div>
  ${field("location", t(locale, "Commune du bien", "Property town"), "text", true)}
  ${field("propertyArea", t(locale, "Lieu-dit ou quartier du bien (facultatif)", "Property area or neighbourhood (optional)"))}
  <div class="field"><label for="decisionRole">${t(locale, "Vous êtes (facultatif)", "Your role (optional)")}</label><select id="decisionRole" name="decisionRole"><option value="">${t(locale, "À préciser", "To be confirmed")}</option><option value="proprietaire">${t(locale, "Propriétaire", "Owner")}</option><option value="mandataire">${t(locale, "Mandataire autorisé", "Authorised representative")}</option><option value="autre">${t(locale, "Autre", "Other")}</option></select></div>
  <div class="field" data-rental-field><label for="rentalSituation">${t(locale, "Situation locative (facultatif)", "Rental situation (optional)")}</label><select id="rentalSituation" name="rentalSituation"><option value="">${t(locale, "À préciser", "To be confirmed")}</option><option value="premiere">${t(locale, "Première mise en location", "First rental season")}</option><option value="existante">${t(locale, "Location déjà en activité", "Already renting")}</option><option value="changement">${t(locale, "Changement de conciergerie", "Changing management company")}</option></select></div>
  <div class="field"><label for="startTimeline">${t(locale, "Démarrage souhaité (facultatif)", "Preferred start (optional)")}</label><select id="startTimeline" name="startTimeline"><option value="">${t(locale, "À préciser", "To be confirmed")}</option><option value="desquepossible">${t(locale, "Dès que possible", "As soon as possible")}</option><option value="troismois">${t(locale, "Dans les trois mois", "Within three months")}</option><option value="prochainesaison">${t(locale, "Pour la prochaine saison", "For next season")}</option><option value="adefinir">${t(locale, "À définir ensemble", "To discuss together")}</option></select></div>
  ${field("listingUrl", t(locale, "Lien de l’annonce (facultatif)", "Listing link (optional)"), "url", false, "", true, 500)}
  ${field("firstName", t(locale, "Prénom", "First name"), "text", true, "given-name")}
  ${field("lastName", t(locale, "Nom", "Last name"), "text", true, "family-name")}
  ${field("email", t(locale, "Email", "Email"), "email", true, "email", true, 254)}
  <div id="contact-preference-field" class="field field-full"><label for="contactPreference">${t(locale, "Comment souhaitez-vous être recontacté ?", "How would you like us to reply?")}</label><select id="contactPreference" name="contactPreference" aria-describedby="contact-preference-help"><option value="email">${t(locale, "Par email", "By email")}</option><option value="phone">${t(locale, "Par téléphone", "By phone")}</option></select><p id="contact-preference-help" class="field-help">${t(locale, "Ce choix concerne la réponse à votre demande.", "This choice applies to the reply to your enquiry.")}</p></div>
  ${field("phone", t(locale, "Téléphone (facultatif)", "Phone (optional)"), "tel", false, "tel", true, 30)}
  <div class="field field-full"><label for="message">${t(locale, "Votre projet (facultatif)", "Your plans (optional)")}</label><textarea id="message" name="message" rows="4" maxlength="2000" aria-describedby="message-help"></textarea><p id="message-help" class="field-help">${t(locale, "Précisez la capacité d’accueil, les accès et vos disponibilités pour notre échange.", "Add the guest capacity, access details and your availability for our conversation.")}</p></div></div>
  <fieldset class="contact-consents" aria-describedby="commercial-consent-help"><legend>${t(locale, "Choix commerciaux (facultatifs)", "Marketing preferences (optional)")}</legend><label class="contact-consent" for="marketingEmail"><input type="checkbox" id="marketingEmail" name="marketingEmail"><span>${t(locale, "J’accepte de recevoir par email les offres et relances commerciales d’Inastia concernant la gestion complète de locations.", "I agree to receive Inastia’s offers and marketing follow-ups about full holiday rental management by email.")}</span></label><label class="contact-consent" for="marketingPhone"><input type="checkbox" id="marketingPhone" name="marketingPhone"><span>${t(locale, "J’accepte qu’Inastia m’appelle pendant un an pour me présenter ses offres de gestion complète de locations.", "I agree to receive calls from Inastia for one year about its full holiday rental management offers.")}</span></label><p id="commercial-consent-help" class="field-help">${t(locale, "Ces choix sont facultatifs et indépendants de votre demande. Vous pouvez retirer votre accord à tout moment en écrivant à", "These choices are optional and separate from your enquiry. You can withdraw your consent at any time by emailing")} <a href="mailto:contact@inastia.fr">contact@inastia.fr</a>${t(locale, " ; pour les appels commerciaux, vous pouvez aussi nous le dire pendant l’appel. Le refus de ces offres n’empêche pas le traitement de votre demande ni le rappel d’audit demandé.", "; for marketing calls, you can also tell us during the call. Declining these offers does not prevent us from handling your enquiry or making the audit callback you requested.")}</p></fieldset>
  <p class="form-privacy">${t(locale, "Vos informations servent à répondre à votre demande et, uniquement selon vos choix ci-dessus, à vous adresser des offres et relances commerciales.", "We use your details to respond to your enquiry and, only according to your choices above, to send you offers and marketing follow-ups.")} <a href="/privacy" lang="fr">${t(locale, "Politique de confidentialité", "Privacy policy (French)")}</a>.</p><div class="contact-verification"><div id="turnstile-container"></div><div id="form-status" role="status" aria-live="polite" tabindex="-1"></div></div><button class="button" id="submit-contact" type="submit"><span id="submit-contact-label">${t(locale, "Confier la gestion de mon bien", "Have my property managed")}</span>${arrow}</button><button id="form-reset" type="button" hidden>${t(locale, "Envoyer une autre demande", "Send another enquiry")}</button><noscript><p>${t(locale, "L’envoi sécurisé nécessite JavaScript. Vous pouvez nous écrire à", "Secure submission needs JavaScript. You can email us at")} <a href="mailto:contact@inastia.fr">contact@inastia.fr</a> ${t(locale, "ou nous appeler.", "or call us.")}</p></noscript></form><section class="contact-next-steps" aria-labelledby="contact-next-title"><h2 id="contact-next-title">${t(locale, "Après votre demande", "After your enquiry")}</h2><ol><li>${t(locale, "Notre équipe examine votre commune et vos besoins.", "Our team reviews your town and your needs.")}</li><li>${t(locale, "Nous échangeons pour préciser votre projet de gestion complète.", "We discuss your full management plans.")}</li><li>${t(locale, "Nous définissons ensemble les prestations et le devis adaptés à votre bien.", "Together, we define the services and quote suited to your property.")}</li></ol></section></div>`;
}
