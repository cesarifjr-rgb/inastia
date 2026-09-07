const TAG_ID = "AW-16573676464";
const CONVERSION = `${TAG_ID}/BHALCNepqPAcELD3-N49`;
const CONSENT_KEY = "inastia-ads-consent-v1";
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
  if (allowed) loadTag();
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
      if (loaded) window.gtag?.("consent", "update", { ...denied, ad_storage: "granted", ad_user_data: "granted" });
      else loadTag();
    } else if (loaded) {
      window.gtag?.("consent", "update", denied);
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
