import { authorizeOperations } from '../../lib/contact-auth.js';
import { durableEnabled, getContactStore } from '../../lib/contact-store.js';
import { processContactJobs } from '../../lib/contact-delivery.js';

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    if (!authorizeOperations(req.headers.authorization)) return res.status(401).json({ error: 'Unauthorized' });
    if (!durableEnabled()) return res.status(503).json({ error: 'Disabled' });
    try {
        const store = getContactStore();
        const result = await processContactJobs({ store });
        await store.cleanup();
        const state = await store.status();
        if (state.attention.length) console.error(JSON.stringify({ event: 'contact_attention', count: state.attention.length }));
        return res.status(200).json({ ...result, ...state });
    } catch {
        console.error(JSON.stringify({ event: 'contact_worker_failed' }));
        return res.status(503).json({ error: 'Unavailable' });
    }
}
