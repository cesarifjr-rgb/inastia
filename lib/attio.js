// Called only after Turnstile verification and confirmed email acceptance.
import { createHash } from 'node:crypto';

const workspace = '303b4287-37bc-4166-abcc-005574bbfa5a';
const base = 'https://api.attio.com/v2/objects';

export function adsAttribution(body, now = Date.now()) {
    const at = Date.parse(body.googleAdsClickAt);
    if (body.googleAdsConsent !== true || body.googleAdsConsentVersion !== 'ads-2026-09-09-v2'
        || typeof body.googleAdsGclid !== 'string' || !/^[A-Za-z0-9_-]{10,300}$/.test(body.googleAdsGclid)
        || !Number.isFinite(at) || at > now || now - at >= 90 * 86400000) return undefined;
    return { gclid: body.googleAdsGclid, capturedAt: new Date(at).toISOString() };
}

function value(record, slug) { return record.values[slug]?.[0]?.value; }

// Only a recognised listing identifier establishes that two enquiries concern the same property.
export function listingIdentity(link) {
    try {
        const url = new URL(link);
        if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return undefined;
        const host = url.hostname.replace(/^www\./, '');
        const airbnb = ['airbnb.fr', 'airbnb.com', 'airbnb.co.uk'].includes(host) && url.pathname.match(/^\/rooms\/(\d+)(?:\/|$)/);
        if (airbnb) return 'airbnb:' + airbnb[1];
        const booking = host === 'booking.com' && url.pathname.match(/^\/hotel\/([a-z]{2})\/([^/]+)\.html$/);
        if (booking) return 'booking:' + booking[1] + '/' + booking[2].replace(/\.[a-z]{2}(?:-[a-z]{2})?$/, '');
    } catch { /* Missing or unrecognised listing: retain a separate property for human review. */ }
}

export async function syncEnquiry(input, context) {
    const token = process.env.ATTIO_API_KEY;
    // A preview must never write to the production CRM.
    if (!token || process.env.VERCEL_ENV === 'preview') return { status: 'disabled' };
    const signal = AbortSignal.timeout(45000);
    async function api(path, method, payload) {
        const attempts = method === 'GET' || method === 'PUT' || path.endsWith('/query') ? 3 : 1;
        for (let attempt = 0; attempt < attempts; attempt++) {
            let response;
            try {
                response = await fetch(base + path, {
                    method, signal, redirect: 'error',
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } catch {
                if (signal.aborted || attempt === attempts - 1) throw new Error('attio_unavailable');
            }
            if (response?.ok) {
                const data = (await response.json()).data;
                const records = Array.isArray(data) ? data : [data];
                if (records.some(record => record?.id?.workspace_id !== workspace)) throw new Error('attio_workspace_mismatch');
                return data;
            }
            if (response?.status === 409) throw new Error('attio_conflict');
            if (response && response.status !== 429 && response.status < 500) throw new Error('attio_rejected');
            if (attempt < attempts - 1) await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
        }
        throw new Error('attio_unavailable');
    }
    async function find(object, slug, key) {
        const matches = await api(`/${object}/records/query`, 'POST', { filter: { [slug]: key }, limit: 2 });
        if (matches.length > 1) throw new Error('attio_ambiguous_record');
        return matches[0];
    }
    async function ensure(object, slug, key, values) {
        const existing = await find(object, slug, key);
        if (existing) return existing;
        try {
            return await api(`/${object}/records`, 'POST', { data: { values: { ...values, [slug]: key } } });
        } catch (error) {
            // A concurrent request may have created the unique record. Never reset its stage.
            if (error.message !== 'attio_conflict') throw error;
            const created = await find(object, slug, key);
            if (!created) throw error;
            return created;
        }
    }
    await api('/people', 'GET');
    const email = input.email.toLowerCase();
    const matches = await api('/people/records/query', 'POST', { filter: { email_addresses: email }, limit: 2 });
    if (matches.length > 1) throw new Error('attio_ambiguous_email');
    // Do not replace an existing contact's additional email addresses.
    const person = matches[0] || await api('/people/records?matching_attribute=email_addresses', 'PUT', { data: { values: { email_addresses: [email] } } });
    const alreadyPresent = value(person, 'site_derniere_demande_id') === context.requestId;
    const previousAt = Date.parse(value(person, 'site_derniere_demande_le'));
    const source = context.ads ? 'Google Ads — inastia.fr' : 'inastia.fr — canal non attribué';
    const values = {
        site_derniere_demande_id: context.requestId,
        site_derniere_demande_le: new Date(context.receivedAt).toISOString(),
        site_source: context.ads ? 'Google Ads — inastia.fr' : 'inastia.fr',
        site_derniere_demande: [
            `Demande : ${context.requestId}`, `Reçue le : ${new Date(context.receivedAt).toISOString()}`,
            `Motif : ${input.intent || 'général'}`, `Réponse souhaitée : ${context.contactPreference}`,
            `Bien : ${input.propertyType} à ${input.location}`,
            ...(context.qualification || []).map(([label, detail]) => `${label} : ${detail}`),
            ...Object.entries({ bedrooms: 'Chambres', bathrooms: 'Salles de bain', surface: 'Surface (m²)', capacity: 'Capacité' })
                .filter(([key]) => input[key]).map(([key, label]) => `${label} : ${input[key]}`),
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
    if (!value(person, 'source_acquisition')) values.source_acquisition = source;
    if (!value(person, 'premiere_demande_le')) values.premiere_demande_le = new Date(context.receivedAt).toISOString();
    values.canal_prefere = context.contactPreference === 'phone' ? 'Téléphone' : 'Email';
    if (!alreadyPresent && !(Number.isFinite(previousAt) && previousAt > context.receivedAt)) {
        await api('/people/records/' + person.id.record_id, 'PATCH', { data: { values } });
    }
    // Continue even when the person was saved previously: a retry must repair a partial sync.
    const key = createHash('sha256').update(person.id.record_id + ':' + (listingIdentity(input.listingUrl) || context.requestId)).digest('hex');
    const personRef = { target_object: 'people', target_record_id: person.id.record_id };
    const name = `${input.propertyType} à ${input.location} — ${[input.firstName, input.lastName].filter(Boolean).join(' ')}`;
    const propertyValues = {
        nom_du_bien: name, ville: input.location, type_bien: input.propertyType,
        proprietaires: [personRef], statut_gestion: 'Prospect',
        // Imported contacts may already have properties without a reliable listing identifier.
        doublon_a_verifier: Boolean(person.values.biens?.length),
    };
    for (const [key, slug] of Object.entries({ propertyArea: 'secteur', listingUrl: 'lien_source',
        decisionRole: 'role_demandeur', rentalSituation: 'situation_locative', startTimeline: 'demarrage_souhaite' })) {
        const label = { decisionRole: 'Rôle du demandeur', rentalSituation: 'Situation locative', startTimeline: 'Démarrage souhaité' }[key];
        if (input[key]) propertyValues[slug] = (context.qualification || []).find(([title]) => title === label)?.[1] || input[key];
    }
    for (const [key, slug] of Object.entries({ bedrooms: 'chambres', bathrooms: 'salles_de_bain', surface: 'surface_m2', capacity: 'couchages' })) {
        if (input[key] && Number.isFinite(Number(input[key]))) propertyValues[slug] = Number(input[key]);
    }
    const property = await ensure('biens', 'site_bien_cle', key, propertyValues);
    if (!property.values.proprietaires?.some(ref => ref.target_record_id === person.id.record_id)) throw new Error('attio_property_contact_mismatch');
    const receivedAt = new Date(context.receivedAt).toISOString();
    const initialDeal = {
        name, stage: 'Nouveau lead', owner: 'contact@inastia.fr',
        associated_people: [personRef], bien: [{ target_object: 'biens', target_record_id: property.id.record_id }],
        source_acquisition: source, site_premiere_demande_le: receivedAt,
        demande_initiale: values.site_derniere_demande,
        prochaine_action: `Vérifier le projet et répondre par ${context.contactPreference === 'phone' ? 'téléphone' : 'email'}.`,
        prochaine_action_le: new Date(context.receivedAt + 2 * 3600000).toISOString(),
    };
    if (context.ads) initialDeal.google_ads_gclid = context.ads.gclid;
    const deal = await ensure('deals', 'site_opportunite_cle', key, initialDeal);
    if (!deal.values.associated_people?.some(ref => ref.target_record_id === person.id.record_id)
        || deal.values.bien?.[0]?.target_record_id !== property.id.record_id) throw new Error('attio_deal_relationship_mismatch');
    const dealPreviousAt = Date.parse(value(deal, 'site_derniere_demande_le'));
    if (value(deal, 'site_derniere_demande_id') !== context.requestId
        && !(Number.isFinite(dealPreviousAt) && dealPreviousAt > context.receivedAt)) {
        await api('/deals/records/' + deal.id.record_id, 'PATCH', { data: { values: {
            site_derniere_demande_id: context.requestId, site_derniere_demande_le: receivedAt,
            derniere_demande: values.site_derniere_demande,
        } } });
    }
    return { status: 'synced' };
}
