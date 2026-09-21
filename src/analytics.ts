import { CONTACT_PLACEMENTS, JOURNEY_LIFETIME, JOURNEY_VERSION, journeyAttribution, journeyPage } from "../lib/journey.js";
import type { Journey } from "../lib/journey.js";

export const ANALYTICS_ID = "G-ZQWEB3WMM4";
const JOURNEY_KEY = "inastia-contact-journey-v1";

let enabled = false;
let configured = false;
let expiresAt = 0;
let formStarted = false;
let journeyTimer: ReturnType<typeof setTimeout> | undefined;

function clearJourney(): void {
  clearTimeout(journeyTimer);
  try { sessionStorage.removeItem(JOURNEY_KEY); } catch { /* Optional measurement storage. */ }
}

function expireJourney(): void {
  clearTimeout(journeyTimer);
  try {
    const journey = journeyAttribution(JSON.parse(sessionStorage.getItem(JOURNEY_KEY) || "null"));
    if (journey) { journeyTimer = setTimeout(clearJourney, journey.at + JOURNEY_LIFETIME - Date.now()); return; }
  } catch { /* Optional measurement storage. */ }
  clearJourney();
}

export function enquiryJourney(): { journey?: Journey } {
  if (!enabled || Date.now() >= expiresAt) { clearJourney(); return {}; }
  try {
    const journey = journeyAttribution(JSON.parse(sessionStorage.getItem(JOURNEY_KEY) || "null"));
    const referrer = new URL(document.referrer);
    // Keep only the CTA that led here, including a contact-page language change or reload.
    if (journey && referrer.origin === location.origin && journeyPage(location.pathname) === "contact"
      && (journeyPage(referrer.pathname) === "contact" || (journeyPage(referrer.pathname) === journey.page
        && (referrer.pathname.startsWith("/en/") ? "en" : "fr") === journey.locale))) return { journey };
  } catch { /* No referrer, unavailable storage or malformed data means no attributed CTA. */ }
  clearJourney();
  return {};
}

function originParameters(journey?: Journey): Record<string, string> {
  return {
    origin_page: journey?.page ?? journeyPage(location.pathname) ?? "other",
    origin_locale: journey?.locale ?? (location.pathname.startsWith("/en/") ? "en" : "fr"),
    contact_placement: journey?.placement ?? "direct",
  };
}

export function formAnalyticsParameters(service?: string): Record<string, string> {
  const selected = service ?? document.querySelector<HTMLSelectElement>("#contact-intent")?.value;
  return { form_id: "contact-form", service: selected === "audit" || selected === "intendance" ? selected : "gestion",
    ...originParameters(enquiryJourney().journey) };
}

function contactPlacement(link: HTMLAnchorElement): string {
  if (link.closest("#mobile-menu")) return "mobile_menu";
  if (link.closest(".site-header")) return "header";
  if (link.closest(".site-footer")) return "footer";
  if (link.dataset.contactPlacement) return CONTACT_PLACEMENTS.includes(link.dataset.contactPlacement) ? link.dataset.contactPlacement : "direct";
  if (link.closest("#tarifs, .intendance-plans-section")) return "pricing";
  if (link.closest(".home-hero, .page-hero, .intendance-hero, .first-hero")) return "hero";
  if (link.closest(".contact-callout, .first-final")) return "callout";
  if (link.closest(".faq-section")) return "faq";
  return link.closest("main") ? "content" : "direct";
}

function pageLocation(advertising: boolean): string {
  const url = new URL(window.location.href);
  const clean = new URL(url.origin + url.pathname);
  // Keep only validated advertising identifiers, never form values or arbitrary query strings.
  if (advertising) {
    for (const key of ["gclid", "gbraid", "wbraid"]) {
      const value = url.searchParams.get(key);
      if (value && /^[A-Za-z0-9_-]{10,300}$/.test(value)) clean.searchParams.set(key, value);
    }
  }
  return clean.href;
}

function pageReferrer(): string {
  try {
    const url = new URL(document.referrer);
    return url.origin + url.pathname;
  } catch { return ""; }
}

export function updateAnalyticsConsent(accepted: boolean, advertising: boolean, expiry: number): void {
  enabled = accepted && Date.now() < expiry;
  expiresAt = expiry;
  window[`ga-disable-${ANALYTICS_ID}`] = !enabled;
  if (!enabled) { clearJourney(); return; }
  expireJourney();
  const page = { page_location: pageLocation(advertising), page_referrer: pageReferrer() };
  // Update URL context without reconfiguring the stream or counting another page view.
  window.gtag?.("set", page);
  if (configured) return;
  configured = true;
  window.gtag?.("config", ANALYTICS_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: 180 * 24 * 60 * 60,
    cookie_update: false,
  });
}

export function trackAnalytics(name: "form_start" | "generate_lead" | "contact_click", parameters: Record<string, string> = {}): void {
  if (!enabled || Date.now() >= expiresAt) return;
  window.gtag?.("event", name, { send_to: ANALYTICS_ID, ...parameters });
}

export function initAnalyticsInteractions(): void {
  document.querySelector("#contact-form")?.addEventListener("input", (event) => {
    if (formStarted || !enabled || Date.now() >= expiresAt || !(event.target instanceof Element)
      || !event.target.matches("input:not([type=hidden]):not([type=checkbox]), select, textarea")) return;
    formStarted = true;
    trackAnalytics("form_start", formAnalyticsParameters());
  });
  document.addEventListener("click", (event) => {
    if (!enabled || Date.now() >= expiresAt || !(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>("a[href]");
    if (!link || link.classList.contains("language-link")) return;
    const url = new URL(link.href);
    const method = url.protocol === "tel:" ? "phone" : url.protocol === "mailto:" ? "email"
      : url.origin === location.origin && /^\/(en\/)?contact$/.test(url.pathname) ? "form" : undefined;
    if (!method) {
      if (url.origin === location.origin && url.pathname !== location.pathname) clearJourney();
      return;
    }
    const placement = contactPlacement(link);
    const page = journeyPage(location.pathname);
    const locale = location.pathname.startsWith("/en/") ? "en" : "fr";
    const requested = method === "form" ? url.searchParams.get("intent") : document.querySelector<HTMLSelectElement>("#contact-intent")?.value;
    const service = requested === "audit" || requested === "intendance" ? requested
      : page === "audit-gratuit-potentiel-locatif" && method !== "form" ? "audit"
      : page === "intendance-residence-secondaire-corse" && method !== "form" ? "intendance" : "gestion";
    const parameters: Record<string, string> = { contact_method: method, service,
      origin_page: page ?? "other", origin_locale: locale, contact_placement: placement };
    if (/^\/(en\/)?partenaires$/.test(location.pathname)) {
      const profile = link.dataset.partnerProfile ?? "general";
      // Only fixed categories enter Analytics, never the link, draft, address or free text.
      parameters.service = "partenariat";
      parameters.partner_profile = ["general", "immobilier", "prestataire", "recommandation"].includes(profile) ? profile : "general";
    }
    if (method === "form" && page) {
      try { sessionStorage.setItem(JOURNEY_KEY, JSON.stringify({ consent: true, version: JOURNEY_VERSION,
        page, placement, locale, at: Date.now() })); } catch { /* Sending a request never depends on measurement. */ }
      expireJourney();
    }
    trackAnalytics("contact_click", parameters);
  });
}
