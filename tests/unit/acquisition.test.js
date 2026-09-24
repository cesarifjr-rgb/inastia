import { describe, expect, it } from 'vitest';
import { ACQUISITION_LIFETIME, ACQUISITION_VERSION, acquisitionAttribution, isGbpCampaign } from '../../lib/acquisition.js';

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
