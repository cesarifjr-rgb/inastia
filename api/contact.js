// Vercel Serverless Function — Contact Form Handler
// Validates Cloudflare Turnstile + sends email via Resend

import { escapeHtml, isValidEmail, truncate } from '../utils.js';

export default async function handler(req, res) {
    // CORS / Method guard
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const {
        firstName, lastName, email, phone,
        propertyType, location, bedrooms, bathrooms,
        surface, capacity, message, turnstileToken
    } = req.body;

    // --- 1. Validate required fields ---
    if (!firstName || !lastName || !email) {
        return res.status(400).json({ success: false, error: 'Champs obligatoires manquants.' });
    }

    // --- 1b. Validate email format ---
    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, error: 'Adresse email invalide.' });
    }

    // --- 1c. Enforce input length limits ---
    if (String(firstName).length > 100 || String(lastName).length > 100 || String(email).length > 254) {
        return res.status(400).json({ success: false, error: 'Données trop longues.' });
    }

    // --- 2. Verify Turnstile token server-side ---
    try {
        const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                secret: process.env.TURNSTILE_SECRET_KEY,
                response: turnstileToken,
            }),
        });
        const turnstileData = await turnstileRes.json();

        if (!turnstileData.success) {
            console.error('Turnstile verification failed:', turnstileData);
            return res.status(403).json({ success: false, error: 'Vérification anti-spam échouée. Veuillez réessayer.' });
        }
    } catch (err) {
        console.error('Turnstile network error:', err);
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

    const subject = `Nouveau lead Inastia — ${safePropertyType || 'Non précisé'} à ${safeLocation || 'Non précisé'}`;

    const htmlBody = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fafafa;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:28px 32px">
        <h1 style="color:#d4a853;margin:0;font-size:22px">🏠 Nouveau Lead Inastia</h1>
        <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:14px">${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      <div style="padding:24px 32px">
        <h2 style="color:#1a1a2e;font-size:16px;margin:0 0 16px;border-bottom:2px solid #d4a853;padding-bottom:8px">👤 Contact</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
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
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Inastia <noreply@inastia.fr>',
                to: 'contact@inastia.fr',
                reply_to: safeEmail,
                subject: subject,
                html: htmlBody,
            }),
        });

        const emailData = await emailRes.json();

        if (!emailRes.ok) {
            console.error('Resend error:', emailData);
            return res.status(500).json({ success: false, error: 'Erreur d\'envoi. Veuillez réessayer ou nous contacter par téléphone.' });
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('Resend network error:', err);
        return res.status(500).json({ success: false, error: 'Erreur serveur. Veuillez réessayer.' });
    }
}
