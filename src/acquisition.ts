import { ACQUISITION_LIFETIME, ACQUISITION_VERSION, acquisitionAttribution, isGbpCampaign } from "../lib/acquisition.js";
import type { Acquisition } from "../lib/acquisition.js";

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
    if (!captured) {
      captured = true;
      const params = new URLSearchParams(location.search);
      if (isGbpCampaign(params)) {
        // A reload or a consent update must not extend an existing landing's lifetime.
        const previous = sessionStorage.getItem(KEY);
        if (!previous) sessionStorage.setItem(KEY, JSON.stringify({ consent: true, version: ACQUISITION_VERSION,
          source: "google_business_profile", at: landingAt }));
      } else if ([...params.keys()].some(key => key.startsWith("utm_") || ["gclid", "gbraid", "wbraid"].includes(key))) {
        clear(); // A different tagged campaign supersedes the earlier GBP visit.
      }
    }
    const { acquisition } = enquiryAcquisition();
    clearTimeout(timer);
    if (acquisition) timer = setTimeout(clear, Math.min(acquisition.at + ACQUISITION_LIFETIME, expiresAt) - Date.now());
  } catch { clear(); }
}
