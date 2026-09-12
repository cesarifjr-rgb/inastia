import { ANALYTICS_ID, initAnalyticsInteractions, trackAnalytics, updateAnalyticsConsent } from "./analytics.ts";

const TAG_ID = "AW-18439914063";
const CONVERSION = `${TAG_ID}/16GeCNTTh_IcEM-E69hE`;
const INTENDANCE_CONVERSION = `${TAG_ID}/nZIzCL6Ih_UcEM-E69hE`;
const CONSENT_KEY = "inastia-measurement-consent-v1";
const LEGACY_CONSENT_KEY = "inastia-ads-consent-v2";
const CLICK_KEY = "inastia-ads-click-v1";
const CLICK_LIFETIME = 90 * 24 * 60 * 60 * 1000;
const CONSENT_LIFETIME = 180 * 24 * 60 * 60 * 1000;
const denied = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
};

declare global {
  interface Window {
    dataLayer?: IArguments[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean;
  }
}

let allowed = false;
let analyticsAllowed = false;
let loaded = false;
let adsConfigured = false;
let consentExpiresAt = 0;
let expiryTimer: number | undefined;
const recorded = new Set<string>();
let click: { gclid: string; at: number } | undefined;

function captureClick(): void {
  if (!allowed) return;
  try {
    click = JSON.parse(window.localStorage.getItem(CLICK_KEY) ?? "null") ?? undefined;
  } catch { /* Keep the current page's accepted click when storage is unavailable. */ }
  const gclid = new URL(window.location.href).searchParams.get("gclid");
  if (gclid && /^[A-Za-z0-9_-]{10,300}$/.test(gclid) && click?.gclid !== gclid) {
    click = { gclid, at: Date.now() };
    try { window.localStorage.setItem(CLICK_KEY, JSON.stringify(click)); } catch { /* Memory only. */ }
  }
  if (click && (typeof click.gclid !== "string" || !Number.isFinite(click.at) || click.at > Date.now()
    || Date.now() - click.at >= CLICK_LIFETIME)) {
    click = undefined;
    try { window.localStorage.removeItem(CLICK_KEY); } catch { /* Storage may be unavailable. */ }
  }
}

export function enquiryAttribution(): Record<string, string | boolean> {
  if (!allowed || Date.now() >= consentExpiresAt) return {};
  if (!click || typeof click.gclid !== "string" || !/^[A-Za-z0-9_-]{10,300}$/.test(click.gclid) || !Number.isFinite(click.at)
    || click.at > Date.now() || Date.now() - click.at >= CLICK_LIFETIME) return {};
  return { googleAdsGclid: click.gclid, googleAdsClickAt: new Date(click.at).toISOString(),
    googleAdsConsent: true, googleAdsConsentVersion: "ads-2026-09-09-v2" };
}

type Consent = { ads: boolean; analytics: boolean; at: number; legacy?: boolean };

function readConsent(): Consent | undefined {
  try {
    const saved = JSON.parse(window.localStorage.getItem(CONSENT_KEY) ?? "null");
    if (saved && typeof saved.ads === "boolean" && typeof saved.analytics === "boolean" && typeof saved.at === "number" &&
      saved.at <= Date.now() && Date.now() - saved.at < CONSENT_LIFETIME) {
      return saved;
    }
    const legacy = JSON.parse(window.localStorage.getItem(LEGACY_CONSENT_KEY) ?? "null");
    if (legacy && typeof legacy.accepted === "boolean" && typeof legacy.at === "number" &&
      legacy.at <= Date.now() && Date.now() - legacy.at < CONSENT_LIFETIME) {
      // An earlier advertising choice never authorizes the new Analytics purpose.
      return { ads: legacy.accepted, analytics: false, at: legacy.at, legacy: true };
    }
  } catch { /* Storage can be unavailable; consent then lasts for this page only. */ }
  return undefined;
}

function consentState() {
  return { ...denied, ad_storage: allowed ? "granted" : "denied", ad_user_data: allowed ? "granted" : "denied",
    analytics_storage: analyticsAllowed ? "granted" : "denied" };
}

function loadTag(): void {
  if (loaded) return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    // Google consumes Arguments records in its command queue.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("consent", "default", denied);
  window.gtag("consent", "update", consentState());
  window.gtag("set", "ads_data_redaction", true);
  window.gtag("set", "url_passthrough", false);
  window.gtag("js", new Date());
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${allowed ? TAG_ID : ANALYTICS_ID}`;
  script.async = true;
  document.head.append(script);
}

function clearCookies(prefix: string): void {
  for (const item of document.cookie.split(";")) {
    const name = item.trim().split("=")[0];
    if (!name?.startsWith(prefix)) continue;
    for (const domain of ["", `; domain=${window.location.hostname}`, "; domain=.inastia.fr"]) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax`;
    }
  }
}

function applyConsent(): void {
  if (!allowed) {
    click = undefined;
    try { window.localStorage.removeItem(CLICK_KEY); } catch { /* Storage may be unavailable. */ }
    clearCookies("_gcl_");
  }
  if (!analyticsAllowed) clearCookies("_ga");
  // Disable automatic GA events before notifying a loaded Google tag of a withdrawal.
  window[`ga-disable-${ANALYTICS_ID}`] = !analyticsAllowed;
  if (loaded) window.gtag?.("consent", "update", consentState());
  else if (allowed || analyticsAllowed) loadTag();
  if (allowed) {
    captureClick();
    if (!adsConfigured) {
      adsConfigured = true;
      window.gtag?.("config", TAG_ID, { allow_ad_personalization_signals: false, allow_enhanced_conversions: false });
    }
  }
  updateAnalyticsConsent(analyticsAllowed, allowed, consentExpiresAt);
}

export function initAdsConsent(): void {
  const banner = document.querySelector<HTMLElement>("#ads-consent");
  const settings = document.querySelector<HTMLButtonElement>("#ads-consent-settings");
  if (!banner || !settings || banner.dataset.initialized) return;
  // Preview deployments must not contribute to the production account.
  if (!["inastia.fr", "www.inastia.fr", "localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname)) return;
  banner.dataset.initialized = "true";
  settings.hidden = false;
  const adsChoice = banner.querySelector<HTMLInputElement>("#consent-advertising");
  const analyticsChoice = banner.querySelector<HTMLInputElement>("#consent-analytics");
  const preferences = banner.querySelector<HTMLDetailsElement>("details");
  const reflectChoices = () => {
    if (adsChoice) adsChoice.checked = allowed;
    if (analyticsChoice) analyticsChoice.checked = analyticsAllowed;
  };
  function scheduleExpiry(): void {
    window.clearTimeout(expiryTimer);
    if (!consentExpiresAt) return;
    const remaining = consentExpiresAt - Date.now();
    if (remaining <= 0) {
      allowed = analyticsAllowed = false;
      consentExpiresAt = 0;
      applyConsent();
      reflectChoices();
      banner!.hidden = false;
      return;
    }
    expiryTimer = window.setTimeout(scheduleExpiry, Math.min(remaining, 2147483647));
  }
  function restoreConsent(): void {
    const saved = readConsent();
    allowed = saved?.ads === true;
    analyticsAllowed = saved?.analytics === true;
    consentExpiresAt = saved ? saved.at + CONSENT_LIFETIME : 0;
    banner!.hidden = saved !== undefined && !saved.legacy;
    reflectChoices();
    applyConsent();
    scheduleExpiry();
  }
  restoreConsent();
  initAnalyticsInteractions();
  let returnFocus = false;
  settings.addEventListener("click", () => {
    returnFocus = true;
    reflectChoices();
    if (preferences) preferences.open = true;
    banner.hidden = false;
    banner.focus();
  });
  for (const button of banner.querySelectorAll<HTMLButtonElement>("[data-ads-choice]")) {
    button.addEventListener("click", () => {
      const choice = button.dataset.adsChoice;
      allowed = choice === "accept" || (choice === "save" && adsChoice?.checked === true);
      analyticsAllowed = choice === "accept" || (choice === "save" && analyticsChoice?.checked === true);
      consentExpiresAt = Date.now() + CONSENT_LIFETIME;
      try {
        window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ ads: allowed, analytics: analyticsAllowed, at: Date.now() }));
        window.localStorage.removeItem(LEGACY_CONSENT_KEY);
      } catch { /* Respect the current choice even when it cannot be persisted. */ }
      applyConsent();
      scheduleExpiry();
      banner.hidden = true;
      if (returnFocus) settings.focus();
    });
  }
  window.addEventListener("storage", (event) => {
    if (event.key === null || event.key === CONSENT_KEY || event.key === LEGACY_CONSENT_KEY) restoreConsent();
  });
}

export function trackEnquiry(requestId: string, intent: "gestion" | "intendance" = "gestion"): void {
  // Tracking must never affect delivery or the success message of the enquiry.
  try {
    if ((!allowed && !analyticsAllowed) || !loaded || recorded.has(requestId)) return;
    // Re-check expiration, including a tab left open for a long time.
    if (Date.now() >= consentExpiresAt) {
      allowed = analyticsAllowed = false;
      applyConsent();
      return;
    }
    recorded.add(requestId);
    // Each service has its own Ads action, after confirmed delivery and consent.
    if (allowed) window.gtag?.("event", "conversion", { send_to: intent === "intendance" ? INTENDANCE_CONVERSION : CONVERSION, transaction_id: requestId });
    trackAnalytics("generate_lead", { form_id: "contact-form", service: intent });
  } catch { /* Ad blockers or a tag failure must not break the contact form. */ }
}
