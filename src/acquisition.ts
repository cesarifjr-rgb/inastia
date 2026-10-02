import { ACQUISITION_LIFETIME, ACQUISITION_VERSION, acquisitionAttribution, hasCampaign, isGbpCampaign, organicSearchSource } from "../lib/acquisition.js";
import type { Acquisition } from "../lib/acquisition.js";
import { journeyPage } from "../lib/journey.js";

const KEY = "inastia-acquisition-v1";
const landingAt = Date.now();
let enabled = false;
let expiresAt = 0;
let captured = false;
let timer: ReturnType<typeof setTimeout> | undefined;

function clear(): void {
  clearTimeout(timer);
  try { sessionStorage.removeItem(KEY); } catch { /* Measurement is optional. */ }
}

export function enquiryAcquisition(): { acquisition?: Acquisition } {
  if (!enabled || Date.now() >= expiresAt) { clear(); return {}; }
  try {
    const acquisition = acquisitionAttribution(JSON.parse(sessionStorage.getItem(KEY) || "null"));
    if (acquisition) return { acquisition };
  } catch { /* Unavailable or invalid storage must never block an enquiry. */ }
  clear();
  return {};
}

export function updateAcquisitionConsent(accepted: boolean, expiry: number): void {
  enabled = accepted && Date.now() < expiry;
  expiresAt = expiry;
  if (!enabled) { clear(); return; }
  try {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (!captured && navigation?.type !== "reload" && navigation?.type !== "back_forward") {
      captured = true;
      const params = new URLSearchParams(location.search);
      const source = isGbpCampaign(params) ? "google_business_profile"
        : !hasCampaign(params) ? organicSearchSource(document.referrer) : undefined;
      let external = false;
      try { external = new URL(document.referrer).origin !== location.origin; } catch { /* Direct or unavailable. */ }
      if (source) {
        const previous = acquisitionAttribution(JSON.parse(sessionStorage.getItem(KEY) || "null"));
        // Internal navigation/reloads cannot renew the landing's 30-minute lifetime.
        if (!previous || previous.source !== source || external) {
          const page = journeyPage(location.pathname);
          sessionStorage.setItem(KEY, JSON.stringify({ consent: true, version: ACQUISITION_VERSION,
            source, at: landingAt, ...(page ? { page, locale: location.pathname.startsWith("/en/") ? "en" : "fr" } : {}) }));
        }
      } else if (hasCampaign(params) || external) {
        clear(); // A new campaign or external referral supersedes the earlier acquisition.
      }
    }
    const { acquisition } = enquiryAcquisition();
    clearTimeout(timer);
    if (acquisition) timer = setTimeout(clear, Math.min(acquisition.at + ACQUISITION_LIFETIME, expiresAt) - Date.now());
  } catch { clear(); }
}
