import type { Locale } from "./content/pages.ts";
import { arrow, escape, path, t } from "./lib.ts";

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
  return `<a class="skip-link" href="#main">${t(locale, "Aller au contenu", "Skip to content")}</a>
  <header class="site-header"><div class="header-inner">
    <a class="wordmark" href="${path(locale)}">INASTIA <span class="brand-detail">CONCIERGERIE · CORSE</span></a>
    <nav class="desktop-nav" aria-label="${t(locale, "Navigation principale", "Main navigation")}">
      <a href="${path(locale)}#services">${t(locale, "L’accompagnement", "Our services")}</a>
      <a href="${path(locale)}#portfolio">${t(locale, "Nos maisons", "Our homes")}</a>
      <a href="${path(locale)}#zone">${t(locale, "Le territoire", "Our region")}</a>
      <a href="${path(locale, "about")}" ${slug === "about" ? 'aria-current="page"' : ""}>${t(locale, "L’esprit Inastia", "About Inastia")}</a>
    </nav>
    <div class="header-actions"><a class="language-link" href="${alternate}" lang="${locale === "fr" ? "en" : "fr"}" aria-label="${locale === "fr" ? (["privacy", "cgv", "mentions-legales", "404"].includes(slug) ? "EN — Go to the English website" : "EN — View this page in English") : "FR — Voir cette page en français"}">${locale === "fr" ? "EN" : "FR"}</a>
      <a class="button button-small header-cta" href="${path(locale, "contact")}">${t(locale, "Parlons de votre bien", "Tell us about your home")}${arrow}</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="${t(locale, "Ouvrir le menu", "Open menu")}" data-open-label="${t(locale, "Ouvrir le menu", "Open menu")}" data-close-label="${t(locale, "Fermer le menu", "Close menu")}"><span></span><span></span></button>
    </div>
  </div>
  <nav id="mobile-menu" class="mobile-menu" aria-label="${t(locale, "Navigation mobile", "Mobile navigation")}" hidden>
    <span class="eyebrow">${t(locale, "Votre maison, notre attention", "Your home, our care")}</span>
    <a href="${path(locale)}#services">${t(locale, "L’accompagnement", "Our services")}</a>
    <a href="${path(locale)}#portfolio">${t(locale, "Nos maisons", "Our homes")}</a>
    <a href="${path(locale)}#zone">${t(locale, "Le territoire", "Our region")}</a>
    <a href="${path(locale, "about")}">${t(locale, "L’esprit Inastia", "About Inastia")}</a>
    <a class="button" href="${path(locale, "contact")}">${t(locale, "Parlons de votre bien", "Tell us about your home")}${arrow}</a>
    <a class="menu-phone" href="tel:+33613812550">+33 6 13 81 25 50</a>
  </nav></header>`;
}

export function footer(locale: Locale): string {
  return `<footer class="site-footer"><div class="container footer-grid">
    <div class="footer-intro"><a class="wordmark" href="${path(locale)}">INASTIA</a><p>${t(locale, "L’hospitalité corse.<br>Le soin de votre maison.", "Corsican hospitality.<br>A home in good hands.")}</p><a class="text-link" href="mailto:contact@inastia.fr">contact@inastia.fr</a><a class="text-link" href="tel:+33613812550">+33 6 13 81 25 50</a></div>
    <div><h2 class="footer-heading">${t(locale, "Votre projet", "Your plans")}</h2><ul>
      <li><a href="${path(locale, "gestion-airbnb-corse-du-sud")}">${t(locale, "Gestion complète", "Full management")}</a></li>
      <li><a href="${path(locale, "pack-lancement-airbnb")}">${t(locale, "Lancement d’annonce", "Listing launch")}</a></li>
      <li><a href="${path(locale, "menage-airbnb-corse-du-sud")}">${t(locale, "Accueil & rotation séjour", "Guest welcome & changeovers")}</a></li>
      <li><a href="${path(locale, "audit-gratuit-potentiel-locatif")}">${t(locale, "Audit gratuit", "Free property review")}</a></li>
    </ul></div>
    <div><h2 class="footer-heading">${t(locale, "Notre territoire", "Our region")}</h2><ul>${zones.map(([name, slug]) => `<li><a href="${path(locale, slug)}">${name}</a></li>`).join("")}</ul></div>
    <div><h2 class="footer-heading">Inastia</h2><ul><li><a href="${path(locale, "about")}">${t(locale, "Notre histoire", "Our story")}</a></li><li><a href="${path(locale, "contact")}">Contact</a></li><li><a href="https://g.page/r/CZVJJeGqvKOtEBM/review" target="_blank" rel="noopener noreferrer">${t(locale, "Donner un avis Google", "Leave a Google review")} <span class="sr-only">${t(locale, "(nouvel onglet)", "(new tab)")}</span>↗</a></li></ul><p class="footer-location">${t(locale, "De Ghisonaccia<br>à Porto-Vecchio.", "From Ghisonaccia<br>to Porto-Vecchio.")}</p></div>
  </div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} Inastia</span><nav aria-label="${t(locale, "Informations légales", "Legal information in French")}"><a href="/mentions-legales" lang="fr">${t(locale, "Mentions légales", "Legal notice (FR)")}</a><a href="/privacy" lang="fr">${t(locale, "Confidentialité", "Privacy (FR)")}</a><a href="/cgv" lang="fr">${t(locale, "CGV", "Terms (FR)")}</a></nav><a href="#main">${t(locale, "Retour en haut", "Back to top")} ↑</a></div></footer>`;
}

export function contactCallout(locale: Locale): string {
  return `<section class="contact-callout" id="contact"><div class="container callout-inner"><div><p class="eyebrow">${t(locale, "Tout commence par une conversation", "It starts with a conversation")}</p><h2>${t(locale, "Et si nous parlions<br><em>de votre maison ?</em>", "Let’s talk about<br><em>your home.</em>")}</h2></div><div class="callout-action"><p>${t(locale, "Un premier regard sur votre bien, vos envies et le bon niveau d’accompagnement. Notre audit est gratuit.", "A first look at your property, your plans and the right level of support. Our property review is free.")}</p><a class="button button-cream" href="${path(locale, "contact")}">${t(locale, "Demander mon audit gratuit", "Request my free review")}${arrow}</a><a class="callout-phone" href="tel:+33613812550">${t(locale, "Ou appelez-nous au", "Or call us on")} +33 6 13 81 25 50</a></div></div></section>`;
}

export function faq(
  locale: Locale,
  items: { question: string; answer: string }[],
): string {
  return `<section class="section faq-section" id="faq"><div class="container faq-grid"><div><p class="eyebrow">${t(locale, "Avant de vous lancer", "Before you get started")}</p><h2>${t(locale, "Vos questions,<br><em>tout simplement.</em>", "Your questions,<br><em>simply answered.</em>")}</h2><a class="text-link" href="${path(locale, "contact")}">${t(locale, "Une autre question ? Échangeons.", "Another question? Let’s talk.")}${arrow}</a></div><div class="faq-list">${items.map(({ question, answer }) => `<details><summary>${escape(question)}<span aria-hidden="true">+</span></summary><div class="faq-answer"><p>${escape(answer)}</p></div></details>`).join("")}</div></div></section>`;
}
