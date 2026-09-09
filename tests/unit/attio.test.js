import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { adsAttribution, syncEnquiry } from '../../lib/attio.js';

const workspace = '303b4287-37bc-4166-abcc-005574bbfa5a';
const now = Date.parse('2026-09-09T12:00:00Z');
const input = { firstName: 'Test', lastName: '', email: 'TEST@example.invalid', phone: '',
    intent: 'gestion', propertyType: 'Villa', location: 'Lecci', message: 'Synthetic enquiry' };
const context = { requestId: 'b3f08a74-27f0-4a3b-9aab-4baab05f5c31', receivedAt: now,
    contactPreference: 'email', marketingEmail: false, marketingPhone: false };
const consent = { googleAdsConsent: true, googleAdsConsentVersion: 'ads-2026-09-09-v2',
    googleAdsGclid: 'synthetic_click_12345', googleAdsClickAt: new Date(now - 60000).toISOString() };
const person = values => ({ id: { workspace_id: workspace, record_id: 'person-id' }, values });
const ok = data => ({ ok: true, status: 200, json: async () => ({ data }) });

describe('website to Attio (all network requests mocked)', () => {
    beforeEach(() => {
        vi.stubEnv('ATTIO_API_KEY', 'synthetic-attio-secret');
        vi.stubEnv('VERCEL_ENV', 'production');
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Unexpected request blocked')));
    });
    afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

    it('requires fresh consent and a valid recent click', () => {
        expect(adsAttribution(consent, now)?.gclid).toBe(consent.googleAdsGclid);
        for (const patch of [{ googleAdsConsent: false }, { googleAdsConsent: 'true' },
            { googleAdsConsentVersion: 'old' }, { googleAdsGclid: '<script>' },
            { googleAdsClickAt: 'invalid' }, { googleAdsClickAt: new Date(now + 1).toISOString() },
            { googleAdsClickAt: new Date(now - 90 * 86400000).toISOString() }]) {
            expect(adsAttribution({ ...consent, ...patch }, now)).toBeUndefined();
        }
    });

    it('creates a contact with consented attribution without inventing a conversion or a marketing permission', async () => {
        fetch.mockResolvedValueOnce(ok({ id: { workspace_id: workspace } }))
            .mockResolvedValueOnce(ok([])).mockResolvedValueOnce(ok(person({})))
            .mockResolvedValueOnce(ok(person({})));
        await expect(syncEnquiry(input, { ...context, qualification: [['Rôle du demandeur', 'Propriétaire']], ads: adsAttribution(consent, now) })).resolves.toEqual({ status: 'synced' });
        expect(fetch.mock.calls[0][1].method).toBe('GET');
        expect(JSON.parse(fetch.mock.calls[2][1].body).data.values.email_addresses).toEqual(['test@example.invalid']);
        const values = JSON.parse(fetch.mock.calls[3][1].body).data.values;
        expect(values.name[0].full_name).toBe('Test');
        expect(values.google_ads_gclid).toBe(consent.googleAdsGclid);
        expect(values.site_derniere_demande_id).toBe(context.requestId);
        expect(values.site_derniere_demande).toContain('Offres email : refusées');
        expect(values.site_derniere_demande).toContain('Rôle du demandeur : Propriétaire');
        expect(values.google_ads_qualifie_le).toBeUndefined();
        expect(values.google_ads_export_autorise).toBeUndefined();
        expect(values.ne_pas_contacter).toBeUndefined();
    });

    it('preserves existing identity, additional addresses, original click, and manual opt-outs', async () => {
        fetch.mockResolvedValueOnce(ok({ id: { workspace_id: workspace } }))
            .mockResolvedValueOnce(ok([person({ name: [{ full_name: 'Existing' }],
                email_addresses: [{ email_address: input.email }, { email_address: 'second@example.invalid' }],
                phone_numbers: [{ original_phone_number: '+33600000000' }],
                google_ads_gclid: [{ value: 'original_click' }], ne_pas_contacter: [{ value: true }] })]))
            .mockResolvedValueOnce(ok(person({})));
        await syncEnquiry({ ...input, phone: '+33700000000' }, { ...context, ads: adsAttribution(consent, now) });
        expect(fetch).toHaveBeenCalledTimes(3);
        const values = JSON.parse(fetch.mock.calls[2][1].body).data.values;
        for (const key of ['name', 'email_addresses', 'phone_numbers', 'google_ads_gclid', 'ne_pas_contacter', 'google_ads_export_autorise']) expect(values[key]).toBeUndefined();
    });

    it('does not transmit a click without consent and skips already recorded requests', async () => {
        fetch.mockResolvedValueOnce(ok({ id: { workspace_id: workspace } }))
            .mockResolvedValueOnce(ok([person({ site_derniere_demande_id: [{ value: context.requestId }] })]));
        await expect(syncEnquiry(input, context)).resolves.toEqual({ status: 'already_present' });
        expect(fetch).toHaveBeenCalledTimes(2);
        expect(JSON.stringify(fetch.mock.calls)).not.toContain('synthetic_click');
    });

    it('refuses to write into a different workspace', async () => {
        fetch.mockResolvedValueOnce(ok({ id: { workspace_id: 'wrong-workspace' } }));
        await expect(syncEnquiry(input, context)).rejects.toThrow('attio_workspace_mismatch');
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('never writes from a preview deployment', async () => {
        vi.stubEnv('VERCEL_ENV', 'preview');
        await expect(syncEnquiry(input, context)).resolves.toEqual({ status: 'disabled' });
        expect(fetch).not.toHaveBeenCalled();
    });
});
