import { createHmac, timingSafeEqual } from 'node:crypto';

export const preferenceVersion = 'commercial-2026-09-20-v2';
export const preferenceLabels = {
    fr: {
        email: 'J’accepte de recevoir par email les offres et relances commerciales d’Inastia concernant la gestion complète de locations.',
        phone: 'J’accepte qu’Inastia m’appelle pendant un an pour me présenter ses offres de gestion complète de locations.',
    },
    en: {
        email: 'I agree to receive Inastia’s offers and marketing follow-ups about full holiday rental management by email.',
        phone: 'I agree to receive calls from Inastia for one year about its full holiday rental management offers.',
    },
};

function signature(payload) {
    // Domain-separated key: the anti-spam secret is never sent to the browser.
    const key = createHmac('sha256', process.env.TURNSTILE_SECRET_KEY).update('inastia:contact-preferences:v1').digest();
    return createHmac('sha256', key).update(payload).digest('base64url');
}

export function preferenceReceipt(input, requestId, receivedAt) {
    const payload = Buffer.from(JSON.stringify({ requestId, receivedAt, expiresAt: receivedAt + 3600000,
        email: input.email, phone: input.phone, locale: (input.locale || input.consentLocale) === 'en' ? 'en' : 'fr' })).toString('base64url');
    return payload + '.' + signature(payload);
}

export function readPreferenceReceipt(token, now = Date.now()) {
    if (!process.env.TURNSTILE_SECRET_KEY || typeof token !== 'string' || token.length > 2048) return undefined;
    const [payload, mac, extra] = token.split('.');
    if (!payload || !mac || extra || !/^[A-Za-z0-9_-]+$/.test(payload) || !/^[A-Za-z0-9_-]{43}$/.test(mac)) return undefined;
    const expected = Buffer.from(signature(payload));
    if (!timingSafeEqual(expected, Buffer.from(mac))) return undefined;
    try {
        const receipt = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        if (!Number.isFinite(receipt.expiresAt) || receipt.expiresAt <= now || receipt.receivedAt > now
            || !/^[0-9a-f-]{36}$/i.test(receipt.requestId)) return undefined;
        return receipt;
    } catch { return undefined; }
}
