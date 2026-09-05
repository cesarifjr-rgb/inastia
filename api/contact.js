// Vercel Serverless Function — Contact Form Handler
// Validates Cloudflare Turnstile + sends email via Resend

import { escapeHtml, isValidEmail, truncate } from '../utils.js';

export default async function handler(req, res) {
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
                return res.status(403).json({ success: false, error: 'Origine non autorisée.' });
            }
        } catch {
            return res.status(403).json({ success: false, error: 'Origine non autorisée.' });
        }
    }

    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({ success: false, error: 'Données invalides.' });
    }
    const limits = { firstName: 100, lastName: 100, email: 254, phone: 30,
        propertyType: 50, location: 100, bedrooms: 5, bathrooms: 5,
        surface: 10, capacity: 5, message: 2000, intent: 20, turnstileToken: 2048 };
    const input = {};
    for (const [key, limit] of Object.entries(limits)) {
        const value = req.body[key];
        if (value !== undefined && (typeof value !== 'string' || value.length > limit)) {
            return res.status(400).json({ success: false, error: 'Données invalides ou trop longues.' });
        }
        input[key] = (value || '').trim();
    }

    const {
        firstName, lastName, email, phone,
        propertyType, location, bedrooms, bathrooms,
        surface, capacity, message, intent, turnstileToken
    } = input;

    const intentLabels = new Map([
        ['', 'Demande générale'],
        ['audit', 'Audit gratuit'],
        ['gestion', 'Gestion complète'],
        ['annonce', 'Lancement et gestion d’annonce'],
        ['rotation', 'Accueil et rotation'],
    ]);
    if (!intentLabels.has(intent)) {
        return res.status(400).json({ success: false, error: 'Motif de demande invalide.' });
    }

    // --- 1. Validate required fields ---
    if (!firstName || !lastName || !email) {
        return res.status(400).json({ success: false, error: 'Champs obligatoires manquants.' });
    }

    // --- 1b. Validate email format ---
    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, error: 'Adresse email invalide.' });
    }

    if (!turnstileToken) {
        return res.status(403).json({ success: false, error: 'Veuillez effectuer la vérification anti-spam.' });
    }
    if (!process.env.TURNSTILE_SECRET_KEY || !process.env.RESEND_API_KEY) {
        return res.status(503).json({ success: false, error: 'Service temporairement indisponible.' });
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

        if (!turnstileRes.ok || turnstileData.success !== true) {
            return res.status(403).json({ success: false, error: 'Vérification anti-spam échouée. Veuillez réessayer.' });
        }
    } catch {
        return res.status(500).json({ success: false, error: 'Erreur de vérification. Veuillez réessayer.' });
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
        <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:14px">${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
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
            return res.status(500).json({ success: false, error: 'Erreur d\'envoi. Veuillez réessayer ou nous contacter par téléphone.' });
        }

        return res.status(200).json({ success: true });
    } catch {
        return res.status(500).json({ success: false, error: 'Erreur serveur. Veuillez réessayer.' });
    }
}
