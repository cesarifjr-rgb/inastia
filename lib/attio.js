// Called only after Turnstile verification and confirmed email acceptance.
const workspace = '303b4287-37bc-4166-abcc-005574bbfa5a';
const base = 'https://api.attio.com/v2/objects/people';

export function adsAttribution(body, now = Date.now()) {
    const at = Date.parse(body.googleAdsClickAt);
    if (body.googleAdsConsent !== true || body.googleAdsConsentVersion !== 'ads-2026-09-09-v2'
        || typeof body.googleAdsGclid !== 'string' || !/^[A-Za-z0-9_-]{10,300}$/.test(body.googleAdsGclid)
        || !Number.isFinite(at) || at > now || now - at >= 90 * 86400000) return undefined;
    return { gclid: body.googleAdsGclid, capturedAt: new Date(at).toISOString() };
}

function value(record, slug) { return record.values[slug]?.[0]?.value; }

export async function syncEnquiry(input, context) {
    const token = process.env.ATTIO_API_KEY;
    // A preview must never write to the production CRM.
    if (!token || process.env.VERCEL_ENV === 'preview') return { status: 'disabled' };
    const signal = AbortSignal.timeout(20000);
    async function api(path, method, payload) {
        for (let attempt = 0; attempt < 3; attempt++) {
            let response;
            try {
                response = await fetch(base + path, {
                    method, signal, redirect: 'error',
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } catch {
                if (signal.aborted || attempt === 2) throw new Error('attio_unavailable');
            }
            if (response?.ok) {
                const data = (await response.json()).data;
                const records = Array.isArray(data) ? data : [data];
                if (records.some(record => record?.id?.workspace_id !== workspace)) throw new Error('attio_workspace_mismatch');
                return data;
            }
            if (response && response.status !== 429 && response.status < 500) throw new Error('attio_rejected');
            if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
        }
        throw new Error('attio_unavailable');
    }
    await api('', 'GET');
    const email = input.email.toLowerCase();
    const matches = await api('/records/query', 'POST', { filter: { email_addresses: email }, limit: 2 });
    if (matches.length > 1) throw new Error('attio_ambiguous_email');
    // Do not replace an existing contact's additional email addresses.
    const person = matches[0] || await api('/records?matching_attribute=email_addresses', 'PUT', { data: { values: { email_addresses: [email] } } });
    if (value(person, 'site_derniere_demande_id') === context.requestId) return { status: 'already_present' };
    const previousAt = Date.parse(value(person, 'site_derniere_demande_le'));
    if (Number.isFinite(previousAt) && previousAt > context.receivedAt) return { status: 'newer_enquiry_present' };
    const values = {
        site_derniere_demande_id: context.requestId,
        site_derniere_demande_le: new Date(context.receivedAt).toISOString(),
        site_source: context.ads ? 'Google Ads — inastia.fr' : 'inastia.fr',
        site_derniere_demande: [
            `Demande : ${context.requestId}`, `Reçue le : ${new Date(context.receivedAt).toISOString()}`,
            `Motif : ${input.intent || 'général'}`, `Réponse souhaitée : ${context.contactPreference}`,
            `Bien : ${input.propertyType} à ${input.location}`,
            ...['bedrooms', 'bathrooms', 'surface', 'capacity'].filter(key => input[key]).map(key => `${key} : ${input[key]}`),
            `Message : ${input.message || ''}`,
            `Offres email : ${context.marketingEmail ? 'acceptées' : 'refusées'}`,
            `Appels commerciaux : ${context.marketingPhone ? 'acceptés, un an maximum' : 'refusés'}`,
            `Version des choix commerciaux : ${input.consentVersion || 'aucune'} (${input.consentLocale || ''})`,
            `Date déclarée des choix : ${input.consentCollectedAt || 'non fournie'}`,
            `Attribution Google Ads : ${context.ads ? 'acceptée — ads-2026-09-09-v2' : 'non transmise'}`,
            ...(context.ads ? [`Clic enregistré par le navigateur : ${context.ads.capturedAt}`] : []),
        ].join('\n'),
    };
    if (!person.values.name?.length) values.name = [{ first_name: input.firstName, last_name: input.lastName || '', full_name: [input.firstName, input.lastName].filter(Boolean).join(' ') }];
    if (input.phone && !person.values.phone_numbers?.length) values.phone_numbers = [{ original_phone_number: input.phone, country_code: 'FR' }];
    // Keep existing attribution, commercial choices and opt-outs. Qualification is manual.
    if (context.ads && !value(person, 'google_ads_gclid')) {
        values.google_ads_gclid = context.ads.gclid;
        values.google_ads_date_prospect = new Date(context.receivedAt).toISOString();
    }
    await api('/records/' + person.id.record_id, 'PATCH', { data: { values } });
    return { status: 'synced' };
}
