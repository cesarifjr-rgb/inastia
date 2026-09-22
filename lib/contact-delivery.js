import { syncEnquiry } from './attio.js';
import { durableEnabled, getContactStore } from './contact-store.js';

const receiptId = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const emailRetryWindow = 23 * 3600;

async function sendEmail(job) {
    if (!process.env.RESEND_API_KEY) throw new Error('email_configuration');
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST', signal: AbortSignal.timeout(10000), redirect: 'error',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Idempotency-Key': `contact/${job.request_id}` },
        body: JSON.stringify(job.payload.email),
    });
    if (!response.ok) {
        if (response.status === 409) throw new Error('email_idempotency_conflict');
        if (response.status < 500 && response.status !== 429) throw new Error('email_rejected');
        throw new Error('email_unavailable');
    }
    const data = await response.json();
    if (!receiptId.test(data?.id || '')) throw new Error('email_receipt_missing');
    return data.id;
}

export async function processContactJobs({ store = getContactStore(), requestId = null, maxJobs = 6, budgetMs = 40000,
    send = sendEmail, sync = syncEnquiry } = {}) {
    if (!durableEnabled() || process.env.VERCEL_ENV !== 'production') return { processed: 0 };
    const deadline = Date.now() + budgetMs;
    const lease = await store.acquireWorker();
    if (!lease) return { processed: 0, busy: true };
    let processed = 0;
    try {
        while (processed < maxJobs && Date.now() < deadline - 15000) {
            const job = await store.claim(requestId);
            if (!job) break;
            processed++;
            if ((job.kind === 'email' && Number(job.age_seconds) >= emailRetryWindow) || job.attempts > (job.kind === 'email' ? 20 : 12)) {
                await store.finish(job, { status: 'attention', error: job.kind === 'email' ? 'email_retry_window_expired' : 'crm_retry_limit' });
                continue;
            }
            let outcome;
            try {
                if (job.kind === 'email') {
                    outcome = { status: 'succeeded', providerId: await send(job) };
                } else {
                    const result = await sync(job.payload.input, job.payload.context, { timeoutMs: Math.max(1000, Math.min(20000, deadline - Date.now() - 6000)) });
                    if (result.status !== 'synced') throw new Error('crm_configuration');
                    outcome = { status: 'succeeded' };
                }
            } catch (error) {
                const known = /^(email_(configuration|idempotency_conflict|rejected|unavailable|receipt_missing)|crm_configuration|attio_(unavailable|conflict|rejected|workspace_mismatch|ambiguous_record|ambiguous_email))$/;
                const category = known.test(error.message) ? error.message : `${job.kind}_unavailable`;
                const permanent = /rejected|conflict|workspace_mismatch|ambiguous|configuration/.test(category);
                const delaySeconds = Math.min(10800, 60 * 2 ** Math.min(job.attempts - 1, 8));
                const expired = job.kind === 'email' && Number(job.age_seconds) + delaySeconds >= emailRetryWindow;
                outcome = { status: permanent || expired ? 'attention' : 'pending', error: category, delaySeconds };
            }
            // If this commit fails, leave the lease to expire. Retry the SAME provider key/body.
            await store.finish(job, outcome);
            console[outcome.status === 'attention' ? 'error' : 'info'](JSON.stringify({ event: 'contact_delivery', requestId: job.request_id,
                kind: job.kind, status: outcome.status, attempts: job.attempts, error: outcome.error }));
        }
        return { processed };
    } finally {
        await store.releaseWorker(lease);
    }
}
