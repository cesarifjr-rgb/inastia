import { journeyPage } from './journey.js';

// Only fixed source/page categories are retained, never the referrer URL or search query.
export const ACQUISITION_VERSION = 'acquisition-2026-09-24-v1';
export const ACQUISITION_LIFETIME = 30 * 60 * 1000;
export const GBP_PARAMETERS = { utm_source: 'google', utm_medium: 'organic', utm_campaign: 'google_business_profile' };
export const ACQUISITION_LABELS = {
    google_business_profile: 'Google Business Profile — inastia.fr',
    google_organic: 'Google naturel — référent détecté — inastia.fr',
    bing_organic: 'Bing naturel — référent détecté — inastia.fr',
    duckduckgo_organic: 'DuckDuckGo naturel — référent détecté — inastia.fr',
};
const clickIds = ['gclid', 'gbraid', 'wbraid', 'dclid', 'msclkid', 'fbclid', 'ttclid'];

export function hasCampaign(params) {
    return [...params.keys()].some(key => key.toLowerCase().startsWith('utm_') || clickIds.includes(key.toLowerCase()));
}

export function organicSearchSource(referrer) {
    try {
        const url = new URL(referrer);
        if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return undefined;
        const host = url.hostname.replace(/^www\./, '');
        if (/^google\.(com|fr|co\.uk|de|it|es|be|ch|ca)$/.test(host)) return 'google_organic';
        if (host === 'bing.com') return 'bing_organic';
        if (host === 'duckduckgo.com') return 'duckduckgo_organic';
    } catch { /* Missing or unknown referrers are not evidence of organic search. */ }
}

export function isGbpCampaign(params) {
    return Object.entries(GBP_PARAMETERS).every(([key, value]) => params.getAll(key).length === 1 && params.get(key) === value)
        && ![...params.keys()].some(key => clickIds.includes(key.toLowerCase()));
}

export function acquisitionAttribution(value, now = Date.now()) {
    if (!value || typeof value !== 'object' || value.consent !== true || value.version !== ACQUISITION_VERSION
        || !['google_business_profile', 'google_organic', 'bing_organic', 'duckduckgo_organic'].includes(value.source) || !Number.isFinite(value.at)
        || value.at > now || now - value.at >= ACQUISITION_LIFETIME) return undefined;
    const attribution = { consent: true, version: ACQUISITION_VERSION, source: value.source, at: value.at };
    if (typeof value.page === 'string' && journeyPage('/' + value.page) === value.page && ['fr', 'en'].includes(value.locale)) {
        Object.assign(attribution, { page: value.page, locale: value.locale });
    }
    return attribution;
}
