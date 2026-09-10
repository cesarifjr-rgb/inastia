export const ANALYTICS_ID = "G-ZQWEB3WMM4";

let enabled = false;
let configured = false;
let expiresAt = 0;
let formStarted = false;

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
  if (!enabled) return;
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
    trackAnalytics("form_start", { form_id: "contact-form" });
  });
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>("a[href]");
    if (!link) return;
    const url = new URL(link.href);
    const method = url.protocol === "tel:" ? "phone" : url.protocol === "mailto:" ? "email"
      : url.origin === location.origin && /^\/(en\/)?contact$/.test(url.pathname) ? "form" : undefined;
    if (method) trackAnalytics("contact_click", { contact_method: method });
  });
}
