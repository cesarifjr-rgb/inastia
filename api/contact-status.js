import { authorizeOperations } from '../lib/contact-auth.js';
import { durableEnabled, getContactStore } from '../lib/contact-store.js';

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    if (!authorizeOperations(req.headers.authorization)) return res.status(401).json({ error: 'Unauthorized' });
    if (!durableEnabled()) return res.status(503).json({ error: 'Disabled' });
    try { return res.status(200).json(await getContactStore().status()); }
    catch { return res.status(503).json({ error: 'Unavailable' }); }
}
