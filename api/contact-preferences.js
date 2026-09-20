import { createHash } from 'node:crypto';
import { escapeHtml, isValidEmail } from '../utils.js';
import { preferenceLabels, preferenceVersion, readPreferenceReceipt } from '../lib/contact-preferences.js';

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'private, no-store');
    if (req.method !== 'POST') return res.status(405).json({ success: false });
    try {
        if (!req.headers?.origin || new URL(req.headers.origin).host !== req.headers.host) return res.status(403).json({ success: false });
    } catch { return res.status(403).json({ success: false }); }
    if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') return res.status(503).json({ success: false });
    if (!process.env.RESEND_API_KEY || !process.env.TURNSTILE_SECRET_KEY) return res.status(503).json({ success: false });
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) return res.status(400).json({ success: false });
    const receipt = readPreferenceReceipt(body.receipt);
    if (!receipt) return res.status(403).json({ success: false, expired: true });
    if (typeof body.marketingEmail !== 'boolean' || typeof body.marketingPhone !== 'boolean'
        || typeof body.email !== 'string' || body.email.length > 254 || typeof body.phone !== 'string' || body.phone.length > 30
        || typeof body.collectedAt !== 'string' || body.collectedAt.length > 24
        || !Number.isFinite(Date.parse(body.collectedAt)) || new Date(body.collectedAt).toISOString() !== body.collectedAt) {
        return res.status(400).json({ success: false });
    }
    const email = body.marketingEmail ? body.email.trim() : receipt.email;
    const phone = body.marketingPhone ? body.phone.trim() : '';
    if ((email && !isValidEmail(email)) || (body.marketingEmail && !email)
        || (body.marketingPhone && (!/^\+?[0-9 ()\u00a0.-]+$/.test(phone) || phone.replace(/\D/g, '').length < 7 || phone.replace(/\D/g, '').length > 15))) {
        return res.status(400).json({ success: false });
    }
    const labels = preferenceLabels[receipt.locale];
    const text = [
        `Préférences commerciales après réception de la demande ${receipt.requestId}.`,
        `Contact de la demande : ${receipt.email || receipt.phone}.`,
        `Email : ${body.marketingEmail ? 'Oui — ' + email : 'Non'}.`,
        `Téléphone : ${body.marketingPhone ? 'Oui, pendant un an maximum — ' + phone : 'Non'}.`,
        `Version : ${preferenceVersion} ; langue : ${receipt.locale}.`,
        labels.email, labels.phone,
        'Choix facultatifs, distincts de la réponse à la demande. Retrait possible à contact@inastia.fr ou pendant un appel.',
        `Date déclarée par le navigateur (horloge non vérifiée) : ${body.collectedAt}.`,
        'La date fiable est celle de réception de ce message. Aucun renouvellement automatique. Vérifier les oppositions existantes avant toute prospection et consigner ces choix dans le dossier commercial.',
    ].join('\n');
    const key = createHash('sha256').update(receipt.requestId + '\n' + text).digest('hex');
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST', signal: AbortSignal.timeout(15000),
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Idempotency-Key': `preferences/${key}` },
            body: JSON.stringify({ from: 'Inastia <noreply@inastia.fr>', to: 'contact@inastia.fr',
                ...(email ? { reply_to: email } : {}), subject: 'Préférences commerciales Inastia — ' + receipt.requestId,
                html: '<div style="white-space:pre-wrap">' + escapeHtml(text) + '</div>' }),
        });
        const result = response.ok ? await response.json() : undefined;
        if (!result || typeof result.id !== 'string' || !/^[0-9a-f-]{36}$/i.test(result.id)) throw new Error('No receipt');
        console.info(JSON.stringify({ event: 'contact_preferences', requestId: receipt.requestId, stage: 'provider_accepted', providerId: result.id, receivedAt: new Date().toISOString() }));
        // This records preferences only. It must not create another lead or conversion.
        return res.status(200).json({ success: true });
    } catch {
        console.warn(JSON.stringify({ event: 'contact_preferences', requestId: receipt.requestId, stage: 'unconfirmed' }));
        return res.status(503).json({ success: false });
    }
}
