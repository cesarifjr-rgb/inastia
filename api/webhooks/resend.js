import { Webhook } from 'svix';
import { durableEnabled, getContactStore } from '../../lib/contact-store.js';

const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const events = new Set(['email.sent', 'email.delivered', 'email.delivery_delayed', 'email.bounced', 'email.failed', 'email.suppressed', 'email.complained']);
const json = (body, status) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

// Web Standard handler preserves the original bytes required by Svix signatures.
export async function POST(request) {
    if (process.env.VERCEL_ENV !== 'production' || !durableEnabled() || !process.env.RESEND_WEBHOOK_SECRET) return json({ error: 'Unavailable' }, 503);
    let event;
    try {
        const reader = request.body?.getReader();
        if (!reader) return json({ error: 'Invalid body' }, 400);
        const chunks = [];
        let length = 0;
        for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            length += value.byteLength;
            if (length > 65536) { await reader.cancel(); return json({ error: 'Too large' }, 413); }
            chunks.push(Buffer.from(value));
        }
        const rawBody = Buffer.concat(chunks).toString('utf8');
        new Webhook(process.env.RESEND_WEBHOOK_SECRET).verify(rawBody, {
            'svix-id': request.headers.get('svix-id'), 'svix-timestamp': request.headers.get('svix-timestamp'),
            'svix-signature': request.headers.get('svix-signature'),
        });
        event = JSON.parse(rawBody);
    } catch { return json({ error: 'Invalid signature' }, 401); }
    if (!event || !events.has(event.type)) return json({ received: true }, 200);
    const providerId = event.data?.email_id;
    const tag = Array.isArray(event.data?.tags) ? event.data.tags.find(tag => tag.name === 'request_id')?.value : event.data?.tags?.request_id;
    const requestId = typeof tag === 'string' && uuid.test(tag) ? tag : null;
    const at = Date.parse(event.created_at);
    if (!uuid.test(providerId || '') || !Number.isFinite(at)) return json({ error: 'Invalid event' }, 400);
    try {
        await getContactStore().recordEvent({ eventId: request.headers.get('svix-id'), requestId, providerId, type: event.type, at: new Date(at).toISOString() });
        return json({ received: true }, 200);
    } catch { return json({ error: 'Unavailable' }, 503); }
}
