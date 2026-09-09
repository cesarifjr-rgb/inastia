const TAG_ID = "AW-18439914063";
const CONVERSION = `${TAG_ID}/16GeCNTTh_IcEM-E69hE`;
const CONSENT_KEY = "inastia-ads-consent-v2";
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
  }
}

let allowed = false;
let loaded = false;
let consentExpiresAt = 0;
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

function readConsent(): boolean | undefined {
  try {
    const saved = JSON.parse(window.localStorage.getItem(CONSENT_KEY) ?? "null");
    if (saved && typeof saved.accepted === "boolean" && typeof saved.at === "number" &&
      saved.at <= Date.now() && Date.now() - saved.at < CONSENT_LIFETIME) {
      consentExpiresAt = saved.at + CONSENT_LIFETIME;
      return saved.accepted;
    }
  } catch { /* Storage can be unavailable; consent then lasts for this page only. */ }
  return undefined;
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
  window.gtag("consent", "update", { ...denied, ad_storage: "granted", ad_user_data: "granted" });
  window.gtag("set", "ads_data_redaction", true);
  window.gtag("set", "url_passthrough", false);
  window.gtag("js", new Date());
  window.gtag("config", TAG_ID, { allow_ad_personalization_signals: false, allow_enhanced_conversions: false });
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${TAG_ID}`;
  script.async = true;
  document.head.append(script);
}

function clearAdsCookies(): void {
  click = undefined;
  try { window.localStorage.removeItem(CLICK_KEY); } catch { /* Storage may be unavailable. */ }
  for (const item of document.cookie.split(";")) {
    const name = item.trim().split("=")[0];
    if (!name?.startsWith("_gcl_")) continue;
    for (const domain of ["", `; domain=${window.location.hostname}`, "; domain=.inastia.fr"]) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax`;
    }
  }
}

export function initAdsConsent(): void {
  const banner = document.querySelector<HTMLElement>("#ads-consent");
  const settings = document.querySelector<HTMLButtonElement>("#ads-consent-settings");
  if (!banner || !settings || banner.dataset.initialized) return;
  // Preview deployments must not contribute to the production account.
  if (!["inastia.fr", "www.inastia.fr", "localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname)) return;
  banner.dataset.initialized = "true";
  settings.hidden = false;
  const saved = readConsent();
  allowed = saved === true;
  banner.hidden = saved !== undefined;
  if (allowed) { captureClick(); loadTag(); }
  else clearAdsCookies();
  let returnFocus = false;
  settings.addEventListener("click", () => {
    returnFocus = true;
    banner.hidden = false;
    banner.focus();
  });
  for (const button of banner.querySelectorAll<HTMLButtonElement>("[data-ads-choice]")) {
    button.addEventListener("click", () => {
      allowed = button.dataset.adsChoice === "accept";
      consentExpiresAt = Date.now() + CONSENT_LIFETIME;
      try {
        window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: allowed, at: Date.now() }));
      } catch { /* Respect the current choice even when it cannot be persisted. */ }
      if (allowed) {
        captureClick();
        if (loaded) window.gtag?.("consent", "update", { ...denied, ad_storage: "granted", ad_user_data: "granted" });
        else loadTag();
      } else {
        if (loaded) window.gtag?.("consent", "update", denied);
        clearAdsCookies();
      }
      banner.hidden = true;
      if (returnFocus) settings.focus();
    });
  }
  window.addEventListener("storage", (event) => {
    if (event.key !== CONSENT_KEY) return;
    const saved = readConsent();
    allowed = saved === true;
    banner.hidden = saved !== undefined;
    if (allowed) {
      captureClick();
      if (loaded) window.gtag?.("consent", "update", { ...denied, ad_storage: "granted", ad_user_data: "granted" });
      else loadTag();
    } else {
      if (loaded) window.gtag?.("consent", "update", denied);
      clearAdsCookies();
    }
  });
}

export function trackEnquiry(requestId: string): void {
  // Tracking must never affect delivery or the success message of the enquiry.
  try {
    if (!allowed || !loaded || recorded.has(requestId)) return;
    // Re-check expiration, including a tab left open for a long time.
    if (Date.now() >= consentExpiresAt) {
      allowed = false;
      window.gtag?.("consent", "update", denied);
      clearAdsCookies();
      return;
    }
    recorded.add(requestId);
    window.gtag?.("event", "conversion", { send_to: CONVERSION, transaction_id: requestId });
  } catch { /* Ad blockers or a tag failure must not break the contact form. */ }
}
