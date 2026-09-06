// Vercel Serverless Function — Contact Form Handler
// Validates Cloudflare Turnstile + sends email via Resend

import { randomUUID } from 'node:crypto';
import { escapeHtml, isValidEmail, truncate } from '../utils.js';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const receiptId = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

export default async function handler(req, res) {
    const startedAt = Date.now();
    const requestId = typeof req.body?.requestId === 'string' && uuid.test(req.body.requestId)
        ? req.body.requestId : randomUUID();
    function respond(status, body, stage, providerId) {
        // Metadata only: never log the payload, provider errors, credentials or tokens.
        try {
            const event = { event: 'contact', requestId, stage, status, durationMs: Date.now() - startedAt };
            if (typeof providerId === 'string' && receiptId.test(providerId)) event.providerId = providerId;
            console[status >= 400 ? 'warn' : 'info'](JSON.stringify(event));
        } catch { /* Telemetry must not prevent the response. */ }
        return res.status(status).json({ ...body, requestId });
    }
    // CORS / Method guard
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // Browser submissions must come from this deployment (including previews).
    const origin = req.headers?.origin;
    if (origin) {
        try {
            const host = req.headers?.host;
            if (!host || new URL(origin).host !== host) {
                return respond(403, { success: false, error: 'Origine non autorisée.' }, 'origin_rejected');
            }
        } catch {
            return respond(403, { success: false, error: 'Origine non autorisée.' }, 'origin_rejected');
        }
    }

    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return respond(400, { success: false, error: 'Données invalides.' }, 'validation');
    }
    const limits = { firstName: 100, lastName: 100, email: 254, phone: 30,
        propertyType: 50, location: 100, bedrooms: 5, bathrooms: 5,
        surface: 10, capacity: 5, message: 2000, intent: 20, turnstileToken: 2048, requestId: 36 };
    const input = {};
    for (const [key, limit] of Object.entries(limits)) {
        const value = req.body[key];
        if (value !== undefined && (typeof value !== 'string' || value.length > limit)) {
            return respond(400, { success: false, error: 'Données invalides ou trop longues.' }, 'validation');
        }
        input[key] = (value || '').trim();
    }

    const {
        firstName, lastName, email, phone,
        propertyType, location, bedrooms, bathrooms,
        surface, capacity, message, intent, turnstileToken
    } = input;

    if (input.requestId && !uuid.test(input.requestId)) {
        return respond(400, { success: false, error: 'Identifiant de demande invalide.' }, 'validation');
    }

    const intentLabels = new Map([
        ['', 'Demande générale'],
        ['audit', 'Audit gratuit'],
        ['gestion', 'Gestion complète'],
        ['annonce', 'Lancement et gestion d’annonce'],
        ['rotation', 'Accueil et rotation'],
    ]);
    if (!intentLabels.has(intent)) {
        return respond(400, { success: false, error: 'Motif de demande invalide.' }, 'validation');
    }

    // --- 1. Validate required fields ---
    if (!firstName || !lastName || !email || !location || !propertyType) {
        return respond(400, { success: false, error: 'Champs obligatoires manquants.' }, 'validation');
    }
    if (intent === 'audit' && !phone) {
        return respond(400, { success: false, error: 'Le téléphone est obligatoire pour le rappel de votre audit gratuit.' }, 'validation');
    }
    if (!['Villa', 'Appartement', 'Maison', 'Autre'].includes(propertyType)) {
        return respond(400, { success: false, error: 'Type de bien invalide.' }, 'validation');
    }
    const digits = phone.replace(/\D/g, '');
    if (phone && (!/^\+?[0-9 ()\u00a0.-]+$/.test(phone) || digits.length < 7 || digits.length > 15)) {
        return respond(400, { success: false, error: 'Numéro de téléphone invalide.' }, 'validation');
    }

    // --- 1b. Validate email format ---
    if (!isValidEmail(email)) {
        return respond(400, { success: false, error: 'Adresse email invalide.' }, 'validation');
    }

    if (!turnstileToken) {
        return respond(403, { success: false, error: 'Veuillez effectuer la vérification anti-spam.' }, 'challenge_missing');
    }
    if (!process.env.TURNSTILE_SECRET_KEY || !process.env.RESEND_API_KEY) {
        return respond(503, { success: false, uncertain: false, error: 'Service temporairement indisponible.' }, 'configuration_missing');
    }

    // --- 2. Verify Turnstile token server-side ---
    try {
        const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            signal: AbortSignal.timeout(10000),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                secret: process.env.TURNSTILE_SECRET_KEY,
                response: turnstileToken,
            }),
        });
        const turnstileData = await turnstileRes.json();
        // Additional preview hosts must be explicitly configured; never trust the request Host.
        const allowedHosts = new Set(['inastia.fr', 'www.inastia.fr']);
        for (const host of (process.env.TURNSTILE_ALLOWED_HOSTNAMES || '').split(',')) {
            const normalized = host.trim().toLowerCase();
            if (/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(normalized)) {
                allowedHosts.add(normalized);
            }
        }
        if (!turnstileRes.ok || turnstileData?.success !== true || !allowedHosts.has(turnstileData.hostname)) {
            return respond(403, { success: false, error: 'Vérification anti-spam échouée. Veuillez réessayer.' }, 'challenge_rejected');
        }
    } catch {
        return respond(500, { success: false, error: 'Erreur de vérification. Veuillez réessayer.', uncertain: false }, 'challenge_unavailable');
    }

    // --- 3. Send email via Resend ---
    // Sanitize all user inputs before embedding in HTML
    const safeFirstName = escapeHtml(truncate(firstName, 100));
    const safeLastName = escapeHtml(truncate(lastName, 100));
    const safeEmail = escapeHtml(truncate(email, 254));
    const safePhone = escapeHtml(truncate(phone, 30));
    const safePropertyType = escapeHtml(truncate(propertyType, 50));
    const safeLocation = escapeHtml(truncate(location, 100));
    const safeBedrooms = escapeHtml(truncate(bedrooms, 5));
    const safeBathrooms = escapeHtml(truncate(bathrooms, 5));
    const safeSurface = escapeHtml(truncate(surface, 10));
    const safeCapacity = escapeHtml(truncate(capacity, 5));
    const safeMessage = escapeHtml(truncate(message, 2000));
    const safeIntent = escapeHtml(intentLabels.get(intent));

    const subject = `Nouveau lead Inastia — ${propertyType || 'Non précisé'} à ${location || 'Non précisé'}`.replace(/[\r\n]/g, ' ');

    const htmlBody = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fafafa;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:28px 32px">
        <h1 style="color:#d4a853;margin:0;font-size:22px">🏠 Nouveau Lead Inastia</h1>
      </div>
      <div style="padding:24px 32px">
        <h2 style="color:#1a1a2e;font-size:16px;margin:0 0 16px;border-bottom:2px solid #d4a853;padding-bottom:8px">👤 Contact</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 0;color:#666">Motif de la demande</td><td style="padding:6px 0;font-weight:600">${safeIntent}</td></tr>
          <tr><td style="padding:6px 0;color:#666;width:140px">Nom</td><td style="padding:6px 0;font-weight:600">${safeFirstName} ${safeLastName}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Email</td><td style="padding:6px 0"><a href="mailto:${safeEmail}" style="color:#16213e">${safeEmail}</a></td></tr>
          ${safePhone ? `<tr><td style="padding:6px 0;color:#666">Téléphone</td><td style="padding:6px 0"><a href="tel:${safePhone}" style="color:#16213e">${safePhone}</a></td></tr>` : ''}
        </table>

        <h2 style="color:#1a1a2e;font-size:16px;margin:24px 0 16px;border-bottom:2px solid #d4a853;padding-bottom:8px">🏡 Bien</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${safePropertyType ? `<tr><td style="padding:6px 0;color:#666;width:140px">Type</td><td style="padding:6px 0;font-weight:600">${safePropertyType}</td></tr>` : ''}
          ${safeLocation ? `<tr><td style="padding:6px 0;color:#666">Localisation</td><td style="padding:6px 0">${safeLocation}</td></tr>` : ''}
          ${safeBedrooms ? `<tr><td style="padding:6px 0;color:#666">Chambres</td><td style="padding:6px 0">${safeBedrooms}</td></tr>` : ''}
          ${safeBathrooms ? `<tr><td style="padding:6px 0;color:#666">Salles de bain</td><td style="padding:6px 0">${safeBathrooms}</td></tr>` : ''}
          ${safeSurface ? `<tr><td style="padding:6px 0;color:#666">Surface</td><td style="padding:6px 0">${safeSurface} m²</td></tr>` : ''}
          ${safeCapacity ? `<tr><td style="padding:6px 0;color:#666">Capacité</td><td style="padding:6px 0">${safeCapacity} voyageurs</td></tr>` : ''}
        </table>

        ${safeMessage ? `
        <h2 style="color:#1a1a2e;font-size:16px;margin:24px 0 16px;border-bottom:2px solid #d4a853;padding-bottom:8px">💬 Message</h2>
        <p style="background:#fff;padding:16px;border-radius:8px;border-left:4px solid #d4a853;margin:0;font-size:14px;line-height:1.6">${safeMessage}</p>
        ` : ''}
      </div>
      <div style="background:#f0f0f0;padding:16px 32px;text-align:center;font-size:12px;color:#999">
        Envoyé depuis le formulaire de contact inastia.fr
      </div>
    </div>`;

    try {
        const emailRes = await fetch('https://api.resend.com/emails', {
            signal: AbortSignal.timeout(10000),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Idempotency-Key': `contact/${requestId}`,
            },
            body: JSON.stringify({
                from: 'Inastia <noreply@inastia.fr>',
                to: 'contact@inastia.fr',
                reply_to: email,
                subject: subject,
                html: htmlBody,
            }),
        });

        if (!emailRes.ok) {
            const uncertain = !emailRes.status || emailRes.status >= 500 || emailRes.status === 409;
            return respond(500, { success: false, uncertain, error: uncertain
                ? 'La confirmation de votre envoi n’a pas été reçue. Vous pouvez nous contacter pour vérifier sa réception.'
                : 'Erreur d\'envoi. Veuillez réessayer ou nous contacter par téléphone.' }, uncertain ? 'send_uncertain' : 'send_rejected');
        }
        const emailData = await emailRes.json();
        if (!emailData || typeof emailData.id !== 'string' || !receiptId.test(emailData.id)) throw new Error('Missing provider receipt');
        return respond(200, { success: true }, 'provider_accepted', emailData.id);
    } catch {
        return respond(500, { success: false, uncertain: true, error: 'La confirmation de votre envoi n’a pas été reçue. Vous pouvez nous contacter pour vérifier sa réception.' }, 'send_uncertain');
    }
}
