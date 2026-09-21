// Shared allowlist: neither Analytics nor the CRM receives arbitrary URLs or text.
export const JOURNEY_VERSION = 'journey-2026-09-21-v1';
export const JOURNEY_LIFETIME = 30 * 60 * 1000;
const pages = ['home', 'contact', 'about', 'partenaires', 'privacy', 'cgv', 'mentions-legales',
    'gestion-airbnb-corse-du-sud', 'audit-gratuit-potentiel-locatif', 'intendance-residence-secondaire-corse',
    'premiere-mise-en-location-corse', 'conciergerie-ghisonaccia', 'conciergerie-airbnb-porto-vecchio',
    'conciergerie-location-saisonniere-solenzara', 'conciergerie-airbnb-zonza-pinarello', 'conciergerie-airbnb-lecci-saint-cyprien'];
export const CONTACT_PLACEMENTS = ['hero', 'pricing', 'header', 'mobile_menu', 'footer', 'callout', 'faq',
    'content', 'profile', 'contact', 'email_fallback', 'phone', 'direct'];

export function journeyPage(pathname) {
    const slug = pathname.replace(/^\/(?:en\/)?/, '').replace(/\/$/, '') || 'home';
    return pages.includes(slug) ? slug : undefined;
}

export function journeyAttribution(value, now = Date.now()) {
    if (!value || typeof value !== 'object' || value.consent !== true || value.version !== JOURNEY_VERSION
        || !pages.includes(value.page) || !CONTACT_PLACEMENTS.includes(value.placement)
        || !['fr', 'en'].includes(value.locale) || !Number.isFinite(value.at)
        || value.at > now || now - value.at >= JOURNEY_LIFETIME) return undefined;
    return { consent: true, version: JOURNEY_VERSION, page: value.page, placement: value.placement,
        locale: value.locale, at: value.at };
}
