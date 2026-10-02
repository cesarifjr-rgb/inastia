import { describe, expect, it } from 'vitest';
import { ACQUISITION_LIFETIME, ACQUISITION_VERSION, acquisitionAttribution, hasCampaign, isGbpCampaign, organicSearchSource } from '../../lib/acquisition.js';

describe('GBP acquisition boundary', () => {
    it('only recognises the exact public campaign, with no duplicate or advertising identifiers', () => {
        const query = 'utm_source=google&utm_medium=organic&utm_campaign=google_business_profile';
        expect(isGbpCampaign(new URLSearchParams(query))).toBe(true);
        for (const invalid of ['', query.replace('organic', 'cpc'), query.replace('google_business_profile', 'private@example.invalid'),
            query + '&utm_source=google', query + '&gclid=synthetic', query + '&gbraid=synthetic', query + '&wbraid=synthetic']) {
            expect(isGbpCampaign(new URLSearchParams(invalid))).toBe(false);
        }
    });

    it('requires valid consent and timestamp, and drops all free text', () => {
        const now = Date.now();
        const valid = { consent: true, version: ACQUISITION_VERSION, source: 'google_business_profile', at: now - 1000 };
        expect(acquisitionAttribution({ ...valid, email: 'private@example.invalid' }, now)).toEqual(valid);
        for (const patch of [{ consent: false }, { consent: 'true' }, { version: 'old' }, { source: 'private@example.invalid' },
            { at: now + 1 }, { at: now - ACQUISITION_LIFETIME }, { at: 'yesterday' }]) {
            expect(acquisitionAttribution({ ...valid, ...patch }, now)).toBeUndefined();
        }
        expect(acquisitionAttribution(null, now)).toBeUndefined();
    });
});

describe('organic acquisition boundary', () => {
    it('recognises only known search domains, without retaining the URL or query', () => {
        for (const host of ['google.com', 'www.google.fr', 'www.google.co.uk']) {
            expect(organicSearchSource(`https://${host}/search?q=private@example.invalid`)).toBe('google_organic');
        }
        expect(organicSearchSource('https://www.bing.com/search?q=private')).toBe('bing_organic');
        expect(organicSearchSource('https://duckduckgo.com/?q=private')).toBe('duckduckgo_organic');
        for (const referrer of ['', 'invalid', 'https://google.com.evil.invalid/', 'https://notgoogle.com/',
            'https://www.google.com@evil.invalid/', 'https://private@google.com/', 'ftp://google.com/', 'https://mail.google.com/']) {
            expect(organicSearchSource(referrer)).toBeUndefined();
        }
    });

    it('does not infer organic acquisition when a campaign or paid click is present', () => {
        for (const parameter of ['utm_source', 'UTM_MEDIUM', 'gclid', 'gbraid', 'wbraid', 'dclid', 'msclkid', 'fbclid', 'ttclid']) {
            expect(hasCampaign(new URLSearchParams(`${parameter}=`))).toBe(true);
        }
        expect(hasCampaign(new URLSearchParams('intent=gestion'))).toBe(false);
    });

    it('validates fixed landing categories and strips arbitrary fields at the API boundary', () => {
        const now = Date.now();
        const source = { consent: true, version: ACQUISITION_VERSION, source: 'google_organic', at: now };
        const valid = { ...source, page: 'conciergerie-airbnb-porto-vecchio', locale: 'fr' };
        expect(acquisitionAttribution({ ...valid, referrer: 'https://google.com/?q=private' }, now)).toEqual(valid);
        expect(acquisitionAttribution({ ...source, page: 'private@example.invalid', locale: 'fr' }, now)).toEqual(source);
        expect(acquisitionAttribution({ ...valid, locale: 'private' }, now)).toEqual(source);
        for (const patch of [{ source: '__proto__' }, { source: ['google_organic'] }, { consent: false }, { at: now - ACQUISITION_LIFETIME }]) {
            expect(acquisitionAttribution({ ...valid, ...patch }, now)).toBeUndefined();
        }
    });
});
