import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import handler from '../../api/contact-preferences.js';
import { preferenceReceipt, readPreferenceReceipt, preferenceLabels, preferenceVersion } from '../../lib/contact-preferences.js';

const requestId = 'b3f08a74-27f0-4a3b-9aab-4baab05f5c31';
const receivedAt = Date.parse('2026-09-20T16:00:00Z');
const input = { email: 'test@example.invalid', phone: '+33600000000', locale: 'en' };
function payload(overrides = {}) {
    return { receipt: preferenceReceipt(input, requestId, receivedAt), marketingEmail: true, marketingPhone: false,
        email: input.email, phone: '', collectedAt: new Date(receivedAt + 1000).toISOString(), ...overrides };
}
async function request(body = payload(), overrides = {}) {
    const res = { setHeader: vi.fn(), status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    await handler({ method: 'POST', headers: { host: 'inastia.fr', origin: 'https://inastia.fr' }, body, ...overrides }, res);
    return res;
}
describe('preferences following a confirmed enquiry (all sending simulated)', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(receivedAt + 2000);
        vi.stubEnv('TURNSTILE_SECRET_KEY', 'synthetic-secret');
        vi.stubEnv('RESEND_API_KEY', 'synthetic-key');
        vi.stubEnv('VERCEL_ENV', 'production');
        vi.spyOn(console, 'info').mockImplementation(() => {});
        vi.spyOn(console, 'warn').mockImplementation(() => {});
        vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ id: requestId }) })));
    });
    afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

    it('binds a one-hour signed receipt to the original enquiry and locale', () => {
        const token = preferenceReceipt(input, requestId, receivedAt);
        expect(readPreferenceReceipt(token)).toMatchObject({ ...input, requestId, expiresAt: receivedAt + 3600000 });
        const [data, signature] = token.split('.');
        const modified = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(data, 'base64url')), email: 'other@example.invalid' })).toString('base64url');
        expect(readPreferenceReceipt(modified + '.' + signature)).toBeUndefined();
        expect(readPreferenceReceipt(token, receivedAt + 3600000)).toBeUndefined();
        expect(readPreferenceReceipt(token, receivedAt - 1)).toBeUndefined();
        vi.stubEnv('TURNSTILE_SECRET_KEY', 'rotated-secret');
        expect(readPreferenceReceipt(token)).toBeUndefined();
    });

    it.each([undefined, '', 'garbage', 'a.b.c', 'a'.repeat(2049)])('rejects a missing or malformed receipt %# without sending', async receipt => {
        const res = await request(payload({ receipt }));
        expect(res.status).toHaveBeenCalledWith(403);
        expect(fetch).not.toHaveBeenCalled();
    });

    it.each([{ marketingEmail: 'true' }, { marketingEmail: true, email: '' }, { email: '<bad>' },
        { marketingPhone: true, phone: '' }, { marketingPhone: true, phone: 'invalid' },
        { collectedAt: 'invalid' }, { phone: '1'.repeat(31) }])('validates preference input %j before sending', async patch => {
        const res = await request(payload(patch));
        expect(res.status).toHaveBeenCalledWith(400);
        expect(fetch).not.toHaveBeenCalled();
    });

    it.each([{ method: 'GET' }, { headers: { host: 'inastia.fr' } },
        { headers: { host: 'inastia.fr', origin: 'https://other.invalid' } }])('rejects unsupported methods and cross-origin requests %j', async patch => {
        const res = await request(payload(), patch);
        expect(res.status.mock.calls[0][0]).toBeGreaterThanOrEqual(400);
        expect(fetch).not.toHaveBeenCalled();
    });

    it('does not send from preview deployments', async () => {
        vi.stubEnv('VERCEL_ENV', 'preview');
        expect((await request()).status).toHaveBeenCalledWith(503);
        expect(fetch).not.toHaveBeenCalled();
    });

    it.each(['fr', 'en'])('sends explicit labels and provenance once per identical retry in %s', async locale => {
        const body = payload({ receipt: preferenceReceipt({ ...input, locale }, requestId, receivedAt) });
        expect((await request(body)).json).toHaveBeenCalledWith({ success: true });
        expect((await request(body)).json).toHaveBeenCalledWith({ success: true });
        const calls = fetch.mock.calls;
        expect(calls).toHaveLength(2);
        expect(calls[1][1].body).toBe(calls[0][1].body);
        expect(calls[1][1].headers).toEqual(calls[0][1].headers);
        expect(calls[0][0]).toBe('https://api.resend.com/emails');
        expect(calls[0][1].headers['Idempotency-Key']).toMatch(/^preferences\/[a-f0-9]{64}$/);
        const mail = JSON.parse(calls[0][1].body);
        expect(mail.html).toContain(requestId);
        expect(mail.html).toContain(preferenceVersion);
        expect(mail.html).toContain(preferenceLabels[locale].email.replaceAll("'", '&#39;'));
        expect(mail.html).toContain('Téléphone : Non');
        expect(mail.html).toContain('horloge non vérifiée');
        expect(mail.html).toContain('oppositions existantes');
        expect(console.info).not.toHaveBeenCalledWith(expect.stringContaining(input.email));
    });

    it('only confirms a real provider receipt and permits idempotent retry after uncertainty', async () => {
        const body = payload();
        fetch.mockRejectedValueOnce(new Error('Lost response'));
        expect((await request(body)).status).toHaveBeenCalledWith(503);
        expect((await request(body)).status).toHaveBeenCalledWith(200);
        expect(fetch.mock.calls[0][1].headers['Idempotency-Key']).toBe(fetch.mock.calls[1][1].headers['Idempotency-Key']);
        fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
        expect((await request(body)).status).toHaveBeenCalledWith(503);
    });
});
