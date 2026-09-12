import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { adsAttribution, listingIdentity, syncEnquiry } from '../../lib/attio.js';

const workspace = '303b4287-37bc-4166-abcc-005574bbfa5a';
const now = Date.parse('2026-09-09T12:00:00Z');
const input = { firstName: 'Test', lastName: '', email: 'TEST@example.invalid', phone: '',
    intent: 'gestion', propertyType: 'Villa', location: 'Lecci', message: 'Synthetic enquiry' };
const context = { requestId: 'b3f08a74-27f0-4a3b-9aab-4baab05f5c31', receivedAt: now,
    contactPreference: 'email', marketingEmail: false, marketingPhone: false };
const consent = { googleAdsConsent: true, googleAdsConsentVersion: 'ads-2026-09-09-v2',
    googleAdsGclid: 'synthetic_click_12345', googleAdsClickAt: new Date(now - 60000).toISOString() };
const nextContext = { ...context, requestId: 'b3f08a74-27f0-4a3b-9aab-4baab05f5c32', receivedAt: now + 60000 };
const ok = data => ({ ok: true, status: 200, json: async () => ({ data: JSON.parse(JSON.stringify(data)) }) });
const scalar = (record, key) => record.values[key]?.[0]?.value;

// Stateful HTTP fixtures expose partial failures, repeat submissions and concurrent creation.
function crm() {
    const data = { people: [], biens: [], deals: [] };
    const wrap = values => Object.fromEntries(Object.entries(values).map(([key, val]) => [key,
        Array.isArray(val) ? val : key === 'stage' ? [{ status: { title: val } }] : [{ value: val }]]));
    const create = (object, values) => {
        const record = { id: { workspace_id: workspace, record_id: object + '-' + (data[object].length + 1) }, values: wrap(values) };
        if (object === 'people') record.values.email_addresses = values.email_addresses.map(email_address => ({ email_address }));
        data[object].push(record);
        if (object === 'biens') {
            for (const ref of values.proprietaires || []) {
                const person = data.people.find(p => p.id.record_id === ref.target_record_id);
                (person.values.biens ||= []).push({ target_object: 'biens', target_record_id: record.id.record_id });
            }
        }
        return record;
    };
    const request = async (url, options) => {
        const path = new URL(url).pathname.split('/').filter(Boolean);
        const object = path[2];
        const payload = options.body ? JSON.parse(options.body) : undefined;
        if (options.method === 'GET' && path.length === 3) return ok({ id: { workspace_id: workspace } });
        if (path[4] === 'query') {
            const [slug, key] = Object.entries(payload.filter)[0];
            return ok(data[object].filter(r => slug === 'email_addresses'
                ? r.values[slug].some(v => v.email_address.toLowerCase() === key)
                : scalar(r, slug) === key).slice(0, payload.limit));
        }
        if (options.method === 'POST' || options.method === 'PUT') return ok(create(object, payload.data.values));
        if (options.method === 'PATCH') {
            const record = data[object].find(r => r.id.record_id === path[4]);
            Object.assign(record.values, wrap(payload.data.values));
            return ok(record);
        }
        throw new Error('Unexpected request blocked');
    };
    return { data, create, request };
}

describe('website to Attio (all network requests mocked)', () => {
    let store;
    beforeEach(() => {
        vi.stubEnv('ATTIO_API_KEY', 'synthetic-attio-secret');
        vi.stubEnv('VERCEL_ENV', 'production');
        store = crm();
        vi.stubGlobal('fetch', vi.fn(store.request));
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

    it('recognises listing IDs without conflating generic, short, or lookalike URLs', () => {
        expect(listingIdentity('https://www.airbnb.fr/rooms/123456?source=x')).toBe('airbnb:123456');
        expect(listingIdentity('https://www.booking.com/hotel/fr/test.fr.html?aid=1')).toBe('booking:fr/test');
        for (const url of ['', 'invalid', 'https://airbnb.fr/', 'https://airbnb.com.evil.invalid/rooms/123456',
            'https://user:password@airbnb.fr/rooms/123456', 'https://example.invalid/property', 'https://airbnb.fr/s/abc']) {
            expect(listingIdentity(url)).toBeUndefined();
        }
    });

    it('creates linked contact, property and new opportunity without inventing values or permissions', async () => {
        await expect(syncEnquiry({ ...input, bedrooms: '4', decisionRole: 'proprietaire' }, {
            ...context, qualification: [['Rôle du demandeur', 'Propriétaire']], ads: adsAttribution(consent, now),
        })).resolves.toEqual({ status: 'synced' });
        expect(Object.values(store.data).map(rows => rows.length)).toEqual([1, 1, 1]);
        const [person, property, deal] = Object.values(store.data).map(rows => rows[0]);
        expect(person.values.name[0].full_name).toBe('Test');
        expect(scalar(person, 'site_derniere_demande')).toContain('Offres email : refusées');
        expect(scalar(property, 'chambres')).toBe(4);
        expect(scalar(property, 'role_demandeur')).toBe('Propriétaire');
        expect(property.values.proprietaires[0].target_record_id).toBe(person.id.record_id);
        expect(deal.values.bien[0].target_record_id).toBe(property.id.record_id);
        expect(deal.values.stage[0].status.title).toBe('Nouveau lead');
        expect(scalar(deal, 'google_ads_gclid')).toBe(consent.googleAdsGclid);
        expect(scalar(deal, 'prochaine_action_le')).toBe('2026-09-09T14:00:00.000Z');
        for (const record of [person, property, deal]) {
            for (const key of ['value', 'revenu_inastia_estime', 'google_ads_qualifie_le', 'google_ads_export_autorise', 'signature_verifiee']) {
                expect(record.values[key]).toBeUndefined();
            }
        }
    });

    it('preserves existing identity, additional addresses, original click, and manual opt-outs', async () => {
        const existing = store.create('people', { name: [{ full_name: 'Existing' }],
            email_addresses: [input.email, 'second@example.invalid'],
            phone_numbers: [{ original_phone_number: '+33600000000' }],
            google_ads_gclid: 'original_click', ne_pas_contacter: true, source_acquisition: 'Apporteur documenté' });
        await syncEnquiry({ ...input, phone: '+33700000000' }, { ...context, ads: adsAttribution(consent, now) });
        expect(existing.values.name[0].full_name).toBe('Existing');
        expect(existing.values.email_addresses).toHaveLength(2);
        expect(existing.values.phone_numbers[0].original_phone_number).toBe('+33600000000');
        expect(scalar(existing, 'ne_pas_contacter')).toBe(true);
        expect(scalar(existing, 'google_ads_gclid')).toBe('original_click');
        expect(scalar(existing, 'source_acquisition')).toBe('Apporteur documenté');
    });

    it('keeps home-care intent, plan and surface on the contact and linked opportunity', async () => {
        const qualification = [['Formule d’intendance', 'Sérénité — 2 visites par mois']];
        await syncEnquiry({ ...input, intent: 'intendance', surface: '125.5' }, { ...context, qualification });
        const person = store.data.people[0];
        const deal = store.data.deals[0];
        for (const text of [scalar(person, 'site_derniere_demande'), scalar(deal, 'demande_initiale')]) {
            expect(text).toContain('Motif : intendance');
            expect(text).toContain('Formule d’intendance : Sérénité — 2 visites par mois');
            expect(text).toContain('Surface (m²) : 125.5');
        }
        expect(scalar(store.data.biens[0], 'surface_m2')).toBe(125.5);
        expect(deal.values.google_ads_export_autorise).toBeUndefined();
    });

    it('does not transmit a click without consent, assume SEO, or duplicate a replayed enquiry', async () => {
        await syncEnquiry(input, context);
        fetch.mockClear();
        await syncEnquiry(input, context);
        expect(Object.values(store.data).map(rows => rows.length)).toEqual([1, 1, 1]);
        expect(fetch.mock.calls.every(([url, opts]) => opts.method === 'GET' || url.endsWith('/query'))).toBe(true);
        expect(scalar(store.data.deals[0], 'source_acquisition')).toBe('inastia.fr — canal non attribué');
        expect(store.data.deals[0].values.google_ads_gclid).toBeUndefined();
    });

    it('repairs a partial sync even after the contact was marked as received', async () => {
        fetch.mockImplementation((url, opts) => url.endsWith('/deals/records') && opts.method === 'POST'
            ? Promise.resolve({ ok: false, status: 503 }) : store.request(url, opts));
        await expect(syncEnquiry(input, context)).rejects.toThrow('attio_unavailable');
        expect(Object.values(store.data).map(rows => rows.length)).toEqual([1, 1, 0]);
        expect(fetch.mock.calls.filter(([url, opts]) => url.endsWith('/deals/records') && opts.method === 'POST')).toHaveLength(1);
        fetch.mockImplementation(store.request);
        await syncEnquiry(input, context);
        expect(Object.values(store.data).map(rows => rows.length)).toEqual([1, 1, 1]);
    });

    it('reuses a recognised listing while preserving a reviewed property and won stage', async () => {
        const linked = { ...input, listingUrl: 'https://www.airbnb.fr/rooms/123456?source=first' };
        await syncEnquiry(linked, context);
        store.data.deals[0].values.stage = [{ status: { title: 'Gagné' } }];
        store.data.biens[0].values.nom_du_bien = [{ value: 'Nom vérifié' }];
        await syncEnquiry({ ...linked, listingUrl: 'https://www.airbnb.com/rooms/123456?source=second', propertyType: 'Maison' }, nextContext);
        expect(Object.values(store.data).map(rows => rows.length)).toEqual([1, 1, 1]);
        expect(store.data.deals[0].values.stage[0].status.title).toBe('Gagné');
        expect(scalar(store.data.biens[0], 'nom_du_bien')).toBe('Nom vérifié');
        expect(scalar(store.data.deals[0], 'site_derniere_demande_id')).toBe(nextContext.requestId);
        expect(scalar(store.data.deals[0], 'demande_initiale')).toContain(context.requestId);
        expect(scalar(store.data.deals[0], 'derniere_demande')).toContain(nextContext.requestId);
    });

    it('keeps two properties of the same contact in the same town separate', async () => {
        await syncEnquiry({ ...input, listingUrl: 'https://airbnb.fr/rooms/123456' }, context);
        await syncEnquiry({ ...input, listingUrl: 'https://airbnb.fr/rooms/654321' }, nextContext);
        expect(Object.values(store.data).map(rows => rows.length)).toEqual([1, 2, 2]);
    });

    it('flags property identity for review instead of merging submissions without reliable listing IDs', async () => {
        await syncEnquiry(input, context);
        await syncEnquiry(input, nextContext);
        expect(store.data.biens).toHaveLength(2);
        expect(scalar(store.data.biens[1], 'doublon_a_verifier')).toBe(true);
    });

    it('does not replace a newer enquiry when an older request finishes late', async () => {
        const linked = { ...input, listingUrl: 'https://airbnb.fr/rooms/123456' };
        await syncEnquiry(linked, nextContext);
        await syncEnquiry(linked, context);
        expect(scalar(store.data.people[0], 'site_derniere_demande_id')).toBe(nextContext.requestId);
        expect(scalar(store.data.deals[0], 'site_derniere_demande_id')).toBe(nextContext.requestId);
    });

    it('resolves a concurrent unique record conflict without resetting its reviewed stage', async () => {
        fetch.mockImplementation(async (url, opts) => {
            if (url.endsWith('/deals/records') && opts.method === 'POST') {
                store.create('deals', { ...JSON.parse(opts.body).data.values, stage: 'Audit planifié' });
                return { ok: false, status: 409 };
            }
            return store.request(url, opts);
        });
        await syncEnquiry(input, context);
        expect(store.data.deals).toHaveLength(1);
        expect(store.data.deals[0].values.stage[0].status.title).toBe('Audit planifié');
    });

    it('refuses ambiguous email matches and a different workspace', async () => {
        store.create('people', { email_addresses: [input.email] });
        store.create('people', { email_addresses: [input.email] });
        await expect(syncEnquiry(input, context)).rejects.toThrow('attio_ambiguous_email');
        expect(store.data.biens).toHaveLength(0);
        fetch.mockResolvedValueOnce(ok({ id: { workspace_id: 'wrong-workspace' } }));
        await expect(syncEnquiry(input, context)).rejects.toThrow('attio_workspace_mismatch');
    });

    it('never writes from preview deployments or without a credential', async () => {
        vi.stubEnv('VERCEL_ENV', 'preview');
        await expect(syncEnquiry(input, context)).resolves.toEqual({ status: 'disabled' });
        vi.stubEnv('VERCEL_ENV', 'production');
        vi.stubEnv('ATTIO_API_KEY', '');
        await expect(syncEnquiry(input, context)).resolves.toEqual({ status: 'disabled' });
        expect(fetch).not.toHaveBeenCalled();
    });
});
