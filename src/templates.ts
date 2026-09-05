import { readFileSync } from "node:fs";
import type { Locale, PageContent } from "./content/pages.ts";
import { header, footer, contactCallout, faq, zones } from "./components.ts";
import { arrow, contactPath, escape, path, picture, t, type ContactIntent } from "./lib.ts";

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
  const intents: Record<string, ContactIntent> = {
    "gestion-airbnb-corse-du-sud": "gestion",
    "pack-lancement-airbnb": "annonce",
    "menage-airbnb-corse-du-sud": "rotation",
    "audit-gratuit-potentiel-locatif": "audit",
  };
  const intent = intents[page.slug];
  const summaryTitle = page.kind === "audit"
    ? t(locale, "Un retour par appel ou email.", "Feedback by phone or email.")
    : page.kind === "about"
      ? t(locale, "Votre lien avec le terrain.", "Your connection to the ground.")
      : t(locale, "L’accompagnement en bref.", "Your support at a glance.");
  const summaryItems = page.kind === "audit"
    ? [t(locale, "Une première analyse qualitative", "An initial qualitative review"), t(locale, "Les améliorations à prioriser", "The improvements to prioritise"), t(locale, "Un accompagnement adapté à vos besoins", "Support suited to your needs")]
    : page.kind === "about"
      ? [t(locale, "Une relation directe avec notre équipe", "A direct relationship with our team"), t(locale, "Des prestations définies avec vous", "Services agreed with you"), t(locale, "Des informations pour vos décisions", "Information to support your decisions")]
      : page.sections.flatMap((section) => section.items ?? []).slice(0, 3);
  const summaryNote = page.kind === "audit"
    ? t(locale, "Gratuit, même sans annonce existante. Cette analyse ne constitue pas une prévision de revenus.", "Free, even without an existing listing. This review is not a rental income forecast.")
    : page.kind === "about"
      ? t(locale, "De Ghisonaccia à Porto-Vecchio. Votre adresse permet de confirmer les prestations possibles.", "From Ghisonaccia to Porto-Vecchio. Your address lets us confirm the services available.")
      : t(locale, "Le périmètre, la durée et les frais sont précisés avant le démarrage.", "Scope, duration and costs are specified before work begins.");
  const propertyCaption =
    page.image === "villa_lova"
      ? "Villa Lova · Cala d’Oro"
      : page.image === "casa_verde"
        ? "Casa Verde · Pinarello"
        : "Villa d’Amichi · Pinarello";
  return `<section class="page-hero"><div class="page-hero-copy"><nav class="breadcrumb" aria-label="${t(locale, "Fil d’Ariane", "Breadcrumb")}"><a href="${path(locale)}">${t(locale, "Accueil", "Home")}</a><span aria-hidden="true">/</span><span>${escape(page.eyebrow)}</span></nav><p class="eyebrow">${escape(page.eyebrow)}</p><h1>${escape(page.heading)}</h1><p class="lead">${escape(page.intro)}</p><a class="button" href="${contactPath(locale, intent)}">${page.kind === "audit" ? t(locale, "Demander mon audit gratuit", "Request my free review") : t(locale, "Parlons de votre bien", "Tell us about your home")}${arrow}</a></div><aside class="page-summary"><p class="eyebrow">${t(locale, "POUR VOTRE BIEN", "FOR YOUR PROPERTY")}</p><h2>${summaryTitle}</h2><ul class="summary-list">${summaryItems.map((item) => `<li>${escape(item)}</li>`).join("")}</ul><p class="summary-note">${summaryNote}</p><figure class="page-property">${picture(page.image, page.imageAlt)}<figcaption>${propertyCaption}<br>${t(locale, "Une maison de notre portfolio", "A home from our portfolio")}</figcaption></figure></aside></section>
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
  return `<div class="container contact-layout"><div class="contact-intro"><nav class="breadcrumb" aria-label="${t(locale, "Fil d’Ariane", "Breadcrumb")}"><a href="${path(locale)}">${t(locale, "Accueil", "Home")}</a><span aria-hidden="true">/</span><span>Contact</span></nav><p class="eyebrow">${t(locale, "VOTRE PROJET COMMENCE ICI", "YOUR PLANS START HERE")}</p><h1 id="contact-title">${t(locale, "Parlons de votre bien.", "Let’s talk about your property.")}</h1><p class="lead">${t(locale, "Indiquez votre commune et votre besoin. Notre équipe vous répondra par appel ou par email.", "Tell us your town and what you need. Our team will respond by phone or email.")}</p><div class="contact-direct"><a href="tel:+33613812550">+33 6 13 81 25 50</a><a href="mailto:contact@inastia.fr">contact@inastia.fr</a><p>${t(locale, "De Ghisonaccia à Porto-Vecchio.<br>Une conciergerie familiale, ancrée en Corse.", "From Ghisonaccia to Porto-Vecchio.<br>A family-run service, rooted in Corsica.")}</p></div></div>
  <form id="contact-form" class="contact-form" data-locale="${locale}" method="post" action="/api/contact"><h2 id="contact-form-title">${t(locale, "Votre demande", "Your enquiry")}</h2><p class="form-note">${t(locale, "Les champs marqués d’un * sont obligatoires.", "Fields marked * are required.")}</p><div class="form-grid">
  <div class="field field-full"><label for="contact-intent">${t(locale, "Votre besoin", "What do you need?")}</label><select id="contact-intent" name="intent"><option value="">${t(locale, "Échanger sur mon projet", "Discuss my project")}</option><option value="audit">${t(locale, "Audit gratuit", "Free property review")}</option><option value="gestion">${t(locale, "Gestion complète", "Full management")}</option><option value="annonce">${t(locale, "Lancement et gestion d’annonce", "Listing launch and management")}</option><option value="rotation">${t(locale, "Accueil et rotation", "Guest welcome and changeovers")}</option></select></div>
  <div class="field"><label for="propertyType">${t(locale, "Type de bien", "Property type")} *</label><select id="propertyType" name="propertyType" required><option value="">${t(locale, "Choisir", "Select")}</option><option value="Villa">Villa</option><option value="Appartement">${t(locale, "Appartement", "Apartment")}</option><option value="Maison">${t(locale, "Maison", "House")}</option><option value="Autre">${t(locale, "Autre", "Other")}</option></select></div>
  ${field("location", t(locale, "Commune", "Town"), "text", true, "address-level2")}
  ${field("firstName", t(locale, "Prénom", "First name"), "text", true, "given-name")}
  ${field("lastName", t(locale, "Nom", "Last name"), "text", true, "family-name")}
  ${field("email", t(locale, "Email", "Email"), "email", true, "email", true, 254)}
  ${field("phone", t(locale, "Téléphone (facultatif)", "Phone (optional)"), "tel", false, "tel", true, 30)}
  <div class="field field-full"><label for="message">${t(locale, "Votre projet (facultatif)", "Your plans (optional)")}</label><textarea id="message" name="message" rows="4" maxlength="2000" aria-describedby="message-help"></textarea><p id="message-help" class="field-help">${t(locale, "Si vous le souhaitez, précisez la capacité d’accueil, votre situation actuelle et ce que vous aimeriez déléguer. Vous pouvez ajouter le lien de votre annonce.", "If you wish, tell us the guest capacity, your current situation and what you would like to hand over. You can add a link to your listing.")}</p></div></div>
  <p class="form-privacy">${t(locale, "Vos informations servent à répondre à votre demande. Aucun abonnement à une newsletter.", "We use your details to respond to your enquiry. No newsletter subscription.")} <a href="/privacy" lang="fr">${t(locale, "Politique de confidentialité", "Privacy policy (French)")}</a>.</p><div class="contact-verification"><div id="turnstile-container"></div><div id="form-status" role="status" aria-live="polite" tabindex="-1"></div></div><button class="button" id="submit-contact" type="submit"><span id="submit-contact-label">${t(locale, "Envoyer ma demande", "Send my enquiry")}</span>${arrow}</button><button id="form-reset" type="button" hidden>${t(locale, "Envoyer une autre demande", "Send another enquiry")}</button><noscript><p>${t(locale, "L’envoi sécurisé nécessite JavaScript. Vous pouvez nous écrire à", "Secure submission needs JavaScript. You can email us at")} <a href="mailto:contact@inastia.fr">contact@inastia.fr</a> ${t(locale, "ou nous appeler.", "or call us.")}</p></noscript></form><section class="contact-next-steps" aria-labelledby="contact-next-title"><h2 id="contact-next-title">${t(locale, "Après votre demande", "After your enquiry")}</h2><ol><li>${t(locale, "Notre équipe examine votre commune et vos besoins.", "Our team reviews your town and your needs.")}</li><li>${t(locale, "Nous échangeons avec vous par appel ou par email pour préciser votre projet et vous restituer le premier audit si vous l’avez demandé.", "We discuss your project with you by phone or email and share the initial property review if you requested one.")}</li><li>${t(locale, "Nous définissons ensemble les prestations et le devis adaptés à votre bien.", "Together, we define the services and quote suited to your property.")}</li></ol><a class="text-link" href="${path(locale, "audit-gratuit-potentiel-locatif")}">${t(locale, "Ce que comprend l’audit gratuit", "What the free review includes")}${arrow}</a></section></div>`;
}
