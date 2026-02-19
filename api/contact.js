// Vercel Serverless Function — Contact Form Handler
// Validates Cloudflare Turnstile + sends email via Resend

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
            return res.status(403).json({ success: false, error: 'Turnstile: ' + JSON.stringify(turnstileData) });
        }
    } catch (err) {
        console.error('Turnstile network error:', err);
        return res.status(500).json({ success: false, error: 'Turnstile network: ' + err.message });
    }

    // --- 3. Send email via Resend ---
    const subject = `Nouveau lead Inastia — ${propertyType || 'Non précisé'} à ${location || 'Non précisé'}`;

    const htmlBody = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fafafa;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:28px 32px">
        <h1 style="color:#d4a853;margin:0;font-size:22px">🏠 Nouveau Lead Inastia</h1>
        <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:14px">${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      <div style="padding:24px 32px">
        <h2 style="color:#1a1a2e;font-size:16px;margin:0 0 16px;border-bottom:2px solid #d4a853;padding-bottom:8px">👤 Contact</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 0;color:#666;width:140px">Nom</td><td style="padding:6px 0;font-weight:600">${firstName} ${lastName}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Email</td><td style="padding:6px 0"><a href="mailto:${email}" style="color:#16213e">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding:6px 0;color:#666">Téléphone</td><td style="padding:6px 0"><a href="tel:${phone}" style="color:#16213e">${phone}</a></td></tr>` : ''}
        </table>

        <h2 style="color:#1a1a2e;font-size:16px;margin:24px 0 16px;border-bottom:2px solid #d4a853;padding-bottom:8px">🏡 Bien</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${propertyType ? `<tr><td style="padding:6px 0;color:#666;width:140px">Type</td><td style="padding:6px 0;font-weight:600">${propertyType}</td></tr>` : ''}
          ${location ? `<tr><td style="padding:6px 0;color:#666">Localisation</td><td style="padding:6px 0">${location}</td></tr>` : ''}
          ${bedrooms ? `<tr><td style="padding:6px 0;color:#666">Chambres</td><td style="padding:6px 0">${bedrooms}</td></tr>` : ''}
          ${bathrooms ? `<tr><td style="padding:6px 0;color:#666">Salles de bain</td><td style="padding:6px 0">${bathrooms}</td></tr>` : ''}
          ${surface ? `<tr><td style="padding:6px 0;color:#666">Surface</td><td style="padding:6px 0">${surface} m²</td></tr>` : ''}
          ${capacity ? `<tr><td style="padding:6px 0;color:#666">Capacité</td><td style="padding:6px 0">${capacity} voyageurs</td></tr>` : ''}
        </table>

        ${message ? `
        <h2 style="color:#1a1a2e;font-size:16px;margin:24px 0 16px;border-bottom:2px solid #d4a853;padding-bottom:8px">💬 Message</h2>
        <p style="background:#fff;padding:16px;border-radius:8px;border-left:4px solid #d4a853;margin:0;font-size:14px;line-height:1.6">${message}</p>
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
                from: 'Inastia <onboarding@resend.dev>',
                to: process.env.CONTACT_EMAIL || 'contact@inastia.fr',
                reply_to: email,
                subject: subject,
                html: htmlBody,
            }),
        });

        const emailData = await emailRes.json();

        if (!emailRes.ok) {
            console.error('Resend error:', emailData);
            return res.status(500).json({ success: false, error: 'Resend: ' + JSON.stringify(emailData) });
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('Resend network error:', err);
        return res.status(500).json({ success: false, error: 'Network: ' + err.message });
    }
}
