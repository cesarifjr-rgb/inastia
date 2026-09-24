// Only the published GBP campaign is accepted; arbitrary URL values never reach the CRM or GA4.
export const ACQUISITION_VERSION = 'acquisition-2026-09-24-v1';
export const ACQUISITION_LIFETIME = 30 * 60 * 1000;
export const GBP_PARAMETERS = { utm_source: 'google', utm_medium: 'organic', utm_campaign: 'google_business_profile' };

export function isGbpCampaign(params) {
    return Object.entries(GBP_PARAMETERS).every(([key, value]) => params.getAll(key).length === 1 && params.get(key) === value)
        && !['gclid', 'gbraid', 'wbraid'].some(key => params.has(key));
}

export function acquisitionAttribution(value, now = Date.now()) {
    if (!value || typeof value !== 'object' || value.consent !== true || value.version !== ACQUISITION_VERSION
        || value.source !== 'google_business_profile' || !Number.isFinite(value.at)
        || value.at > now || now - value.at >= ACQUISITION_LIFETIME) return undefined;
    return { consent: true, version: ACQUISITION_VERSION, source: 'google_business_profile', at: value.at };
}
