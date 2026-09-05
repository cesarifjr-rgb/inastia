import { readFileSync } from "node:fs";
import type { Locale, PageContent } from "./content/pages.ts";
import { header, footer, contactCallout, faq, zones } from "./components.ts";
import { arrow, escape, path, picture, t } from "./lib.ts";
import { serviceArt } from "./art.ts";

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
      "Conciergerie familiale de locations saisonnières sur la côte est de la Corse, de Ghisonaccia à Porto-Vecchio.",
  };
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f8f3e9"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><meta name="robots" content="${noindex ? "noindex, follow" : "index, follow"}"><link rel="canonical" href="${url}">${translated && !noindex ? `<link rel="alternate" hreflang="fr" href="https://inastia.fr/${slug}"><link rel="alternate" hreflang="en" href="https://inastia.fr/en/${slug}"><link rel="alternate" hreflang="x-default" href="https://inastia.fr/${slug}">` : ""}<meta property="og:type" content="website"><meta property="og:site_name" content="Inastia"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${url}"><meta property="og:locale" content="${locale === "fr" ? "fr_FR" : "en_GB"}"><meta property="og:image" content="https://inastia.fr/images/inastia-share.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Inastia — les clés de votre maison, le soin de votre accueil"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="https://inastia.fr/images/inastia-share.png"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="preload" href="/fonts/space-grotesk-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/manrope-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script><script type="module" src="/src/client.ts"></script></head><body>${header(locale, slug)}<main id="main" tabindex="-1">${content}</main>${footer(locale)}</body></html>`;
}

export function secondary(locale: Locale, page: PageContent): string {
  const artIndex =
    page.slug === "pack-lancement-airbnb" || page.kind === "audit"
      ? 1
      : page.slug === "menage-airbnb-corse-du-sud" || page.kind === "about"
        ? 2
        : 0;
  const propertyCaption =
    page.image === "villa_lova"
      ? "Villa Lova · Cala d’Oro"
      : page.image === "casa_verde"
        ? "Casa Verde · Pinarello"
        : "Villa d’Amichi · Pinarello";
  return `<section class="page-hero"><div class="page-hero-copy"><nav class="breadcrumb" aria-label="${t(locale, "Fil d’Ariane", "Breadcrumb")}"><a href="${path(locale)}">${t(locale, "Accueil", "Home")}</a><span aria-hidden="true">/</span><span>${escape(page.eyebrow)}</span></nav><p class="eyebrow">${escape(page.eyebrow)}</p><h1>${escape(page.heading)}</h1><p class="lead">${escape(page.intro)}</p><a class="button" href="${path(locale, "contact")}">${t(locale, "Parlons de votre bien", "Tell us about your home")}${arrow}</a></div>${`<div class="page-hero-art"><span class="eyebrow">${t(locale, "VOTRE MAISON. NOTRE PRÉSENCE.", "YOUR HOME. OUR PRESENCE.")}</span>${serviceArt(artIndex)}<figure class="page-property">${picture(page.image, page.imageAlt)}<figcaption>${propertyCaption}<br>${t(locale, "Une maison de l’univers Inastia", "An Inastia portfolio home")}</figcaption></figure></div>`}</section>
  <section class="section"><div class="container page-sections"><nav class="page-aside" aria-label="${t(locale, "Dans cette page", "On this page")}"><p class="eyebrow">${t(locale, "L’essentiel", "At a glance")}</p>${page.sections.map((section, index) => `<a href="#section-${index + 1}">${escape(section.title)}</a>`).join("")}</nav><div>${page.sections.map((section, index) => `<section class="editorial-section" data-reveal id="section-${index + 1}"><h2>${escape(section.title)}</h2><p>${escape(section.text)}</p>${section.items?.length ? `<ul>${section.items.map((item) => `<li>${escape(item)}</li>`).join("")}</ul>` : ""}</section>`).join("")}<nav class="related-links" aria-label="${t(locale, "À découvrir aussi", "Explore more")}">${page.kind === "location" ? `<a href="${path(locale, "gestion-airbnb-corse-du-sud")}">${t(locale, "Gestion complète", "Full management")}</a><a href="${path(locale, "menage-airbnb-corse-du-sud")}">${t(locale, "Accueil et rotation séjour", "Guest welcome and changeovers")}</a>` : zones.map(([name, slug]) => `<a href="${path(locale, slug)}">${name}</a>`).join("")}</nav></div></div></section>${faq(locale, page.faq)}${contactCallout(locale)}`;
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
    `<div class="field ${full ? "field-full" : ""}"><label for="${name}">${label}${required ? " *" : ""}</label><input id="${name}" name="${name}" type="${type}" ${required ? "required" : ""} ${autocomplete ? `autocomplete="${autocomplete}"` : ""} maxlength="${maxlength}"></div>`;
  return `<div class="container contact-layout"><div class="contact-intro"><nav class="breadcrumb" aria-label="${t(locale, "Fil d’Ariane", "Breadcrumb")}"><a href="${path(locale)}">${t(locale, "Accueil", "Home")}</a><span aria-hidden="true">/</span><span>Contact</span></nav><p class="eyebrow">${t(locale, "VOTRE PROJET COMMENCE ICI", "YOUR PLANS START HERE")}</p><h1>${t(locale, "Votre projet.<br><em>Le premier pas.</em>", "Your plans.<br><em>The first step.</em>")}</h1><p class="lead">${t(locale, "Vous souhaitez déléguer, lancer votre location ou être accompagné sur place ? Quelques détails suffisent pour commencer la conversation.", "Looking for full management, a rental launch or support on the ground? A few details are all we need to start the conversation.")}</p><a class="text-link" href="${path(locale, "audit-gratuit-potentiel-locatif")}">${t(locale, "Notre premier audit est gratuit", "Our initial property review is free")}${arrow}</a><div class="contact-direct"><a href="tel:+33613812550">+33 6 13 81 25 50</a><a href="mailto:contact@inastia.fr">contact@inastia.fr</a><p>${t(locale, "De Ghisonaccia à Porto-Vecchio.<br>Une conciergerie familiale, ancrée en Corse.", "From Ghisonaccia to Porto-Vecchio.<br>A family-run service, rooted in Corsica.")}</p></div></div>
  <form id="contact-form" class="contact-form" data-locale="${locale}" method="post" action="/api/contact"><h2>${t(locale, "Faisons connaissance.", "Let’s get acquainted.")}</h2><p class="form-note">${t(locale, "Les champs marqués d’un * sont obligatoires.", "Fields marked * are required.")}</p><div class="form-grid">
  <div class="field"><label for="propertyType">${t(locale, "Type de bien", "Property type")} *</label><select id="propertyType" name="propertyType" required><option value="">${t(locale, "Choisir", "Select")}</option><option value="Villa">Villa</option><option value="Appartement">${t(locale, "Appartement", "Apartment")}</option><option value="Maison de caractère">${t(locale, "Maison de caractère", "Character home")}</option><option value="Autre">${t(locale, "Autre", "Other")}</option></select></div>
  ${field("location", t(locale, "Commune", "Town"), "text", true, "address-level2")}
  ${field("firstName", t(locale, "Prénom", "First name"), "text", true, "given-name")}
  ${field("lastName", t(locale, "Nom", "Last name"), "text", true, "family-name")}
  ${field("email", t(locale, "Email", "Email"), "email", true, "email", true, 254)}
  ${field("phone", t(locale, "Téléphone (facultatif)", "Phone (optional)"), "tel", false, "tel", true, 30)}
  <div class="field field-full"><label for="message">${t(locale, "Votre projet (facultatif)", "Your plans (optional)")}</label><textarea id="message" name="message" rows="4" maxlength="2000" placeholder="${t(locale, "Capacité d’accueil, lien d’annonce si disponible et accompagnement souhaité.", "Guest capacity, listing link if available, and the support you are looking for.")}"></textarea></div></div>
  <p class="form-privacy">${t(locale, "Vos informations servent à répondre à votre demande. Aucun abonnement à une newsletter.", "We use your details to respond to your enquiry. No newsletter subscription.")} <a href="/privacy" lang="fr">${t(locale, "Politique de confidentialité", "Privacy policy (French)")}</a>.</p><div id="turnstile-container"></div><div id="form-status" role="status" aria-live="polite" tabindex="-1"></div><button class="button" id="submit-contact" type="submit">${t(locale, "Envoyer ma demande", "Send my enquiry")}${arrow}</button><button id="form-reset" type="button" hidden>${t(locale, "Envoyer une autre demande", "Send another enquiry")}</button><noscript><p>${t(locale, "L’envoi sécurisé nécessite JavaScript. Vous pouvez nous écrire à", "Secure submission needs JavaScript. You can email us at")} <a href="mailto:contact@inastia.fr">contact@inastia.fr</a> ${t(locale, "ou nous appeler.", "or call us.")}</p></noscript></form></div>`;
}
