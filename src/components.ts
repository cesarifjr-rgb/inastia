import type { Locale } from "./content/pages.ts";
import { arrow, contactPath, escape, path, t } from "./lib.ts";
import { googleProfileUrl } from "./reviews.ts";

export const zones = [
  ["Ghisonaccia", "conciergerie-ghisonaccia"],
  ["Solenzara", "conciergerie-location-saisonniere-solenzara"],
  ["Zonza · Pinarello", "conciergerie-airbnb-zonza-pinarello"],
  ["Lecci · Saint-Cyprien", "conciergerie-airbnb-lecci-saint-cyprien"],
  ["Porto-Vecchio", "conciergerie-airbnb-porto-vecchio"],
] as const;

export function header(locale: Locale, slug: string): string {
  const alternate = path(
    locale === "fr" ? "en" : "fr",
    ["privacy", "cgv", "mentions-legales", "404"].includes(slug) ? "" : slug,
  );
  const motionButton =
    slug &&
    !["contact", "privacy", "cgv", "mentions-legales", "404"].includes(slug)
      ? `<button id="motion-toggle" class="header-motion" type="button" aria-pressed="false" aria-label="${t(locale, "Mettre les animations en pause", "Pause animations")}" data-pause="${t(locale, "Mettre les animations en pause", "Pause animations")}" data-play="${t(locale, "Reprendre les animations", "Resume animations")}"><span class="motion-icon" aria-hidden="true">Ⅱ</span><span class="motion-label">${t(locale, "Animations", "Motion")}</span></button>`
      : "";
  return `<a class="skip-link" href="#main">${t(locale, "Aller au contenu", "Skip to content")}</a>
  <header class="site-header"><div class="header-inner">
    <a class="wordmark" href="${path(locale)}">INASTIA <span class="brand-detail">CONCIERGERIE · CORSE</span></a>
    <nav class="desktop-nav" aria-label="${t(locale, "Navigation principale", "Main navigation")}">
      <a href="${path(locale)}#services">${t(locale, "Gestion complète", "Full management")}</a>
      <a href="${path(locale)}#portfolio">${t(locale, "Nos maisons", "Our homes")}</a>
      <a href="${path(locale)}#zone">${t(locale, "Le territoire", "Our region")}</a>
      <a href="${path(locale, "about")}" ${slug === "about" ? 'aria-current="page"' : ""}>${t(locale, "L’esprit Inastia", "About Inastia")}</a>
    </nav>
    <div class="header-actions">${motionButton}<a class="language-link" href="${alternate}" lang="${locale === "fr" ? "en" : "fr"}" aria-label="${locale === "fr" ? (["privacy", "cgv", "mentions-legales", "404"].includes(slug) ? "EN — Go to the English website" : "EN — View this page in English") : "FR — Voir cette page en français"}">${locale === "fr" ? "EN" : "FR"}</a>
      <a class="button button-small header-cta" href="${contactPath(locale, "gestion")}">${t(locale, "Parlons de votre bien", "Tell us about your home")}${arrow}</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="${t(locale, "Ouvrir le menu", "Open menu")}" data-open-label="${t(locale, "Ouvrir le menu", "Open menu")}" data-close-label="${t(locale, "Fermer le menu", "Close menu")}"><span></span><span></span></button>
    </div>
  </div>
  <nav id="mobile-menu" class="mobile-menu" aria-label="${t(locale, "Navigation mobile", "Mobile navigation")}" hidden>
    <span class="eyebrow">${t(locale, "Votre maison, notre attention", "Your home, our care")}</span>
    <a href="${path(locale)}#services">${t(locale, "Gestion complète", "Full management")}</a>
    <a href="${path(locale)}#portfolio">${t(locale, "Nos maisons", "Our homes")}</a>
    <a href="${path(locale)}#zone">${t(locale, "Le territoire", "Our region")}</a>
    <a href="${path(locale, "about")}">${t(locale, "L’esprit Inastia", "About Inastia")}</a>
    <a class="button" href="${contactPath(locale, "gestion")}">${t(locale, "Parlons de votre bien", "Tell us about your home")}${arrow}</a>
    <a class="menu-phone" href="tel:+33613812550">+33 6 13 81 25 50</a>
  </nav></header>`;
}

export function footer(locale: Locale): string {
  return `<footer class="site-footer"><div class="container footer-grid">
    <div class="footer-intro"><a class="wordmark" href="${path(locale)}">INASTIA</a><p>${t(locale, "L’hospitalité corse.<br>Le soin de votre maison.", "Corsican hospitality.<br>A home in good hands.")}</p><a class="text-link" href="mailto:contact@inastia.fr">contact@inastia.fr</a><a class="text-link" href="tel:+33613812550">+33 6 13 81 25 50</a></div>
    <div><h2 class="footer-heading">${t(locale, "Votre projet", "Your plans")}</h2><ul>
      <li><a href="${path(locale, "gestion-airbnb-corse-du-sud")}">${t(locale, "Gestion complète", "Full management")}</a></li>
      <li><a href="${path(locale, "audit-gratuit-potentiel-locatif")}">${t(locale, "Audit gratuit", "Free property review")}</a></li>
    </ul></div>
    <div><h2 class="footer-heading">${t(locale, "Notre territoire", "Our region")}</h2><ul>${zones.map(([name, slug]) => `<li><a href="${path(locale, slug)}">${name}</a></li>`).join("")}</ul></div>
    <div><h2 class="footer-heading">Inastia</h2><ul><li><a href="${path(locale, "about")}">${t(locale, "Notre histoire", "Our story")}</a></li><li><a href="${path(locale, "contact")}">Contact</a></li><li><a href="${googleProfileUrl}" target="_blank" rel="noopener noreferrer">${t(locale, "Lire les avis Google", "Read our Google reviews")} <span class="sr-only">${t(locale, "(nouvel onglet)", "(new tab)")}</span>↗</a></li><li><a href="https://g.page/r/CZVJJeGqvKOtEBM/review" target="_blank" rel="noopener noreferrer">${t(locale, "Donner un avis Google", "Leave a Google review")} <span class="sr-only">${t(locale, "(nouvel onglet)", "(new tab)")}</span>↗</a></li></ul><p class="footer-location">${t(locale, "De Ghisonaccia<br>à Porto-Vecchio.", "From Ghisonaccia<br>to Porto-Vecchio.")}</p></div>
  </div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} Inastia</span><nav aria-label="${t(locale, "Informations légales", "Legal information in French")}"><a href="/mentions-legales" lang="fr">${t(locale, "Mentions légales", "Legal notice (FR)")}</a><a href="/privacy" lang="fr">${t(locale, "Confidentialité", "Privacy (FR)")}</a><a href="/cgv" lang="fr">${t(locale, "CGV", "Terms (FR)")}</a></nav><a href="#main">${t(locale, "Retour en haut", "Back to top")} ↑</a></div></footer>`;
}

export function contactCallout(locale: Locale, intent: "audit" | "gestion" = "gestion"): string {
  const audit = intent === "audit";
  return `<section class="contact-callout" id="contact"><div class="container callout-inner"><div><p class="eyebrow">${audit ? t(locale, "VOTRE AUDIT GRATUIT", "YOUR FREE PROPERTY REVIEW") : t(locale, "LA GESTION COMPLÈTE DE VOTRE LOCATION", "FULL MANAGEMENT OF YOUR HOLIDAY RENTAL")}</p><h2>${audit ? t(locale, "Votre projet mérite<br><em>un premier regard.</em>", "Your plans deserve<br><em>a closer look.</em>") : t(locale, "Confiez-nous votre location.<br><em>Commençons par en parler.</em>", "Let us manage your rental.<br><em>Let’s start with a conversation.</em>")}</h2></div><div class="callout-action"><p>${audit ? t(locale, "Parlez-nous de votre bien et indiquez vos disponibilités. Nous vous rappelons sous 24 h, à un moment qui vous convient, pour faire le point sur votre projet de gestion.", "Tell us about your home and when you are available. We’ll call you within 24 hours, at a time that suits you, to discuss your management plans.") : t(locale, "Vous souhaitez déléguer l’annonce, les voyageurs et le suivi sur place ? Présentez-nous votre bien. Nous échangeons sur votre projet et vous proposons un cadre de gestion adapté, avec des prestations et des frais clairement définis.", "Ready to hand over your listing, guest communication and local coordination? Tell us about your home. We’ll discuss your plans and propose a management arrangement with clearly defined services and fees.")}</p><a class="button button-cream" href="${contactPath(locale, intent)}">${audit ? t(locale, "Demander mon audit gratuit", "Request my free review") : t(locale, "Parlons de la gestion de mon bien", "Let’s discuss my rental")}${arrow}</a>${audit ? "" : `<a class="callout-phone" href="${path(locale, "audit-gratuit-potentiel-locatif")}">${t(locale, "Ou commencez par un audit gratuit", "Or start with a free property review")}</a>`}<a class="callout-phone" href="tel:+33613812550">${t(locale, "Appelez-nous au", "Call us on")} +33 6 13 81 25 50</a></div></div></section>`;
}

export function faq(
  locale: Locale,
  items: { question: string; answer: string }[],
): string {
  return `<section class="section faq-section" id="faq"><div class="container faq-grid"><div><p class="eyebrow">${t(locale, "Avant de vous lancer", "Before you get started")}</p><h2>${t(locale, "Tout se précise.<br><em>Même les détails.</em>", "Clear answers.<br><em>Down to the details.</em>")}</h2><a class="text-link" href="${path(locale, "contact")}">${t(locale, "Une autre question ? Échangeons.", "Another question? Let’s talk.")}${arrow}</a></div><div class="faq-list">${items.map(({ question, answer }) => `<details><summary>${escape(question)}<span aria-hidden="true">+</span></summary><div class="faq-answer"><p>${escape(answer)}</p></div></details>`).join("")}</div></div></section>`;
}
