import { createHash, randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

export const durableEnabled = () => process.env.CONTACT_DURABLE_ENABLED === 'true';

export function getContactStore() {
    if (!process.env.CONTACT_DATABASE_URL) throw new Error('contact_database_missing');
    const sql = neon(process.env.CONTACT_DATABASE_URL);
    return new ContactStore((query, values) => sql.query(query, values, { fetchOptions: { signal: AbortSignal.timeout(5000) } }));
}

export class ContactStore {
    constructor(query) { this.query = query; }

    async register(input, context, email) {
        // Never persist a challenge token. Attribution is optional and can expire between retries.
        const stableInput = Object.fromEntries(Object.entries(input).filter(([key]) => !['turnstileToken', 'requestId'].includes(key)).sort(([a], [b]) => a.localeCompare(b)));
        const fingerprint = createHash('sha256').update(JSON.stringify([stableInput, context.marketingEmail, context.marketingPhone])).digest('hex');
        const payload = { input: stableInput, context, email };
        const [row] = await this.query(`WITH enquiry AS (
            INSERT INTO contact_enquiries (request_id, fingerprint, payload, received_at)
            VALUES ($1, $2, $3::jsonb, $4)
            ON CONFLICT (request_id) DO UPDATE SET request_id = EXCLUDED.request_id
            RETURNING request_id, fingerprint
        ), jobs AS (
            INSERT INTO contact_jobs (request_id, kind)
            SELECT request_id, kind FROM enquiry CROSS JOIN (VALUES ('email'), ('crm')) AS kinds(kind)
            WHERE fingerprint = $2 ON CONFLICT DO NOTHING
        ) SELECT fingerprint FROM enquiry`, [context.requestId, fingerprint, JSON.stringify(payload), new Date(context.receivedAt).toISOString()]);
        return { conflict: row.fingerprint !== fingerprint };
    }

    async acquireWorker() {
        const lease = randomUUID();
        const rows = await this.query(`UPDATE contact_worker SET lease_id = $1, locked_until = now() + interval '90 seconds'
            WHERE id = 1 AND (locked_until IS NULL OR locked_until < now()) RETURNING id`, [lease]);
        return rows.length ? lease : null;
    }

    async releaseWorker(lease) {
        await this.query('UPDATE contact_worker SET lease_id = NULL, locked_until = NULL WHERE id = 1 AND lease_id = $1', [lease]);
    }

    async claim(requestId = null) {
        const [row] = await this.query(`WITH candidate AS (
            SELECT j.request_id, j.kind FROM contact_jobs j JOIN contact_enquiries e USING (request_id)
            WHERE ($1::uuid IS NULL OR j.request_id = $1) AND e.payload IS NOT NULL
              AND ((j.status = 'pending' AND j.next_attempt_at <= now()) OR (j.status = 'running' AND j.locked_until < now()))
            ORDER BY j.next_attempt_at, j.kind DESC LIMIT 1 FOR UPDATE OF j SKIP LOCKED
        ) UPDATE contact_jobs j SET status = 'running', attempts = attempts + 1,
            first_attempt_at = COALESCE(first_attempt_at, now()), lease_id = $2,
            locked_until = now() + interval '2 minutes', updated_at = now()
          FROM candidate c, contact_enquiries e
          WHERE j.request_id = c.request_id AND j.kind = c.kind AND e.request_id = j.request_id
          RETURNING j.*, e.payload, e.received_at, extract(epoch FROM (now() - j.first_attempt_at)) AS age_seconds`, [requestId, randomUUID()]);
        return row;
    }

    async finish(job, { status, providerId = null, error = null, delaySeconds = 0 }) {
        await this.query(`UPDATE contact_jobs SET status = $4, provider_id = COALESCE(provider_id, $5::uuid),
            last_error = $6, next_attempt_at = now() + $7 * interval '1 second',
            lease_id = NULL, locked_until = NULL, updated_at = now()
            WHERE request_id = $1 AND kind = $2 AND lease_id = $3 AND status = 'running'`,
        [job.request_id, job.kind, job.lease_id, status, providerId, error, delaySeconds]);
    }

    async recordEvent({ eventId, requestId, providerId, type, at }) {
        // A signed tag recovers an acceptance even if its HTTP response or DB update was lost.
        // Lock the job before insertion so different, concurrent events cannot lose state updates.
        const rows = await this.query(`WITH target AS MATERIALIZED (
            SELECT j.request_id FROM contact_jobs j WHERE j.kind = 'email'
              AND (j.provider_id = $2::uuid OR (j.request_id = $3::uuid AND (j.provider_id IS NULL OR j.provider_id = $2::uuid)))
            FOR UPDATE
        ), inserted AS (
            INSERT INTO contact_email_events (event_id, request_id, provider_id, type, occurred_at)
            SELECT $1, request_id, $2, $4, $5 FROM target ON CONFLICT DO NOTHING RETURNING request_id
        ), accepted AS (
            UPDATE contact_jobs SET status = 'succeeded', provider_id = $2, last_error = NULL,
                lease_id = NULL, locked_until = NULL, updated_at = now()
            WHERE kind = 'email' AND request_id IN (SELECT request_id FROM inserted) RETURNING request_id
        ) UPDATE contact_enquiries SET email_event = $4, email_event_at = $5
            WHERE request_id IN (SELECT request_id FROM accepted)
              AND (email_event_at IS NULL OR (email_event_at <= $5::timestamptz
                AND NOT (email_event IN ('email.bounced', 'email.failed', 'email.suppressed', 'email.complained') AND $4 = 'email.delivered')
                AND NOT (email_event IN ('email.delivered', 'email.bounced', 'email.failed', 'email.suppressed', 'email.complained')
                  AND $4 IN ('email.sent', 'email.delivery_delayed'))))
            RETURNING request_id`, [eventId, providerId, requestId, type, at]);
        return rows.length > 0;
    }

    async status() {
        const counts = await this.query('SELECT kind, status, count(*)::integer AS count FROM contact_jobs GROUP BY kind, status', []);
        const attention = await this.query(`SELECT j.request_id, j.kind, j.status, j.attempts, j.last_error, j.updated_at, e.email_event
            FROM contact_jobs j JOIN contact_enquiries e USING (request_id)
            WHERE j.status = 'attention' OR (j.status != 'succeeded' AND e.received_at < now() - interval '30 minutes')
              OR (j.kind = 'email' AND e.email_event IN ('email.bounced', 'email.failed', 'email.suppressed', 'email.complained'))
              OR (j.kind = 'email' AND j.status = 'succeeded' AND j.updated_at < now() - interval '30 minutes'
                AND (e.email_event IS NULL OR e.email_event IN ('email.sent', 'email.delivery_delayed')))
            ORDER BY j.updated_at DESC LIMIT 50`, []);
        const delivery = await this.query(`SELECT COALESCE(email_event, 'unconfirmed') AS event, count(*)::integer AS count
            FROM contact_enquiries GROUP BY email_event`, []);
        return { counts, delivery, attention };
    }

    async cleanup() {
        // Content: 30 days after both jobs succeeded; unresolved content: maximum 90 days.
        await this.query(`UPDATE contact_jobs SET status = 'attention', last_error = 'retention_expired', updated_at = now()
            WHERE status IN ('pending', 'running') AND request_id IN (
                SELECT request_id FROM contact_enquiries WHERE received_at < now() - interval '90 days')`, []);
        await this.query(`UPDATE contact_enquiries e SET payload = NULL WHERE payload IS NOT NULL
            AND (received_at < now() - interval '90 days' OR (received_at < now() - interval '30 days'
            AND NOT EXISTS (SELECT 1 FROM contact_jobs j WHERE j.request_id = e.request_id AND j.status != 'succeeded')))`, []);
        await this.query("DELETE FROM contact_enquiries WHERE received_at < now() - interval '1 year'", []);
    }
}
