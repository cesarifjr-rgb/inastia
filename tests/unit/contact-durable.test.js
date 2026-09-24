import { beforeAll, afterAll, beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import { Webhook } from 'svix';
import { ContactStore } from '../../lib/contact-store.js';
import * as storage from '../../lib/contact-store.js';
import { processContactJobs } from '../../lib/contact-delivery.js';
import contact from '../../api/contact.js';
import statusHandler from '../../api/contact-status.js';
import cronHandler from '../../api/cron/contact-deliveries.js';
import { POST as webhook } from '../../api/webhooks/resend.js';

const background = vi.hoisted(() => []);
vi.mock('@vercel/functions', () => ({ waitUntil: promise => { background.push(promise); } }));
const providerId = '54b51ec4-7bc8-40bc-80b6-417226a6af34';
const webhookSecret = 'whsec_' + Buffer.from('local-test-signing-secret-only').toString('base64');
const input = { firstName: 'Test', lastName: 'Local', email: 'test@example.com', propertyType: 'Villa', location: 'Test', propertyArea: 'Test', intent: 'gestion', turnstileToken: 'never-store-me' };
let db, store;
function res() { return { setHeader: vi.fn(), status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() }; }
async function register(id = randomUUID()) {
    await store.register(input, { requestId: id, receivedAt: Date.now(), marketingEmail: false, marketingPhone: false },
        { from: 'test@example.com', to: 'test@example.com', html: '<p>Test</p>', tags: [{ name: 'request_id', value: id }] });
    return id;
}
const jobs = async id => (await db.query('SELECT * FROM contact_jobs WHERE request_id = $1 ORDER BY kind', [id])).rows;
const due = async () => db.exec("UPDATE contact_jobs SET next_attempt_at = now() - interval '1 second'");
const run = (options = {}) => processContactJobs({ store, send: vi.fn().mockResolvedValue(providerId), sync: vi.fn().mockResolvedValue({ status: 'synced' }), ...options });
function signedRequest(event, id = 'msg_' + randomUUID(), timestamp = new Date()) {
    const body = JSON.stringify(event);
    return new Request('https://www.inastia.fr/api/webhooks/resend', { method: 'POST', body, headers: {
        'svix-id': id, 'svix-timestamp': String(Math.floor(timestamp.getTime() / 1000)),
        'svix-signature': new Webhook(webhookSecret).sign(id, timestamp, body),
    } });
}

beforeAll(async () => {
    db = new PGlite();
    await db.exec(await readFile(new URL('../../db/contact.sql', import.meta.url), 'utf8'));
    await db.exec(await readFile(new URL('../../db/contact-access.sql', import.meta.url), 'utf8'));
    store = new ContactStore((query, values) => db.transaction(async tx => {
        await tx.exec('SET LOCAL ROLE contact_app');
        return (await tx.query(query, values)).rows;
    }));
}, 30000);
afterAll(async () => { await db.close(); });
beforeEach(async () => {
    await db.exec('TRUNCATE contact_enquiries CASCADE; UPDATE contact_worker SET lease_id = NULL, locked_until = NULL');
    vi.stubEnv('CONTACT_DURABLE_ENABLED', 'true');
    vi.stubEnv('VERCEL_ENV', 'production');
    vi.stubEnv('CONTACT_DATABASE_URL', 'local-test-only');
    vi.stubEnv('RESEND_API_KEY', 'test-only');
    vi.stubEnv('ATTIO_API_KEY', 'test-only');
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-only');
    vi.stubEnv('CRON_SECRET', 'local-operations-secret');
    vi.stubEnv('RESEND_WEBHOOK_SECRET', webhookSecret);
    vi.spyOn(storage, 'getContactStore').mockReturnValue(store);
    for (const level of ['info', 'warn', 'error']) vi.spyOn(console, level).mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Unexpected external request')));
    background.length = 0;
});
afterEach(async () => {
    await Promise.all(background);
    vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs();
});

describe('durable contact pipeline, real PostgreSQL engine and fake providers', () => {
    it('can reapply the grants but rejects an elevated or owning contact role', async () => {
        const migration = await readFile(new URL('../../db/contact-access.sql', import.meta.url), 'utf8');
        await db.exec(migration);
        await db.exec('ALTER ROLE contact_backup CREATEDB');
        await expect(db.exec(migration)).rejects.toThrow('elevated attributes');
        await db.exec('ALTER ROLE contact_backup NOCREATEDB');
        await db.exec('ALTER TABLE contact_worker OWNER TO contact_backup');
        await expect(db.exec(migration)).rejects.toThrow('must not own');
        await db.exec('ALTER TABLE contact_worker OWNER TO postgres');
        await db.exec(migration);
    });

    it('runs the application without owner, schema creation or role administration privileges', async () => {
        const [role] = await store.query(`SELECT current_user, rolsuper, rolcreatedb, rolcreaterole, rolreplication, rolbypassrls
            FROM pg_roles WHERE rolname = current_user`, []);
        expect(role).toEqual({ current_user: 'contact_app', rolsuper: false, rolcreatedb: false,
            rolcreaterole: false, rolreplication: false, rolbypassrls: false });
        for (const query of [
            'CREATE TABLE public.unwanted (id integer)',
            'CREATE TEMP TABLE unwanted (id integer)',
            'ALTER TABLE contact_enquiries ADD COLUMN unwanted text',
            'TRUNCATE contact_enquiries CASCADE',
            'DELETE FROM contact_worker',
            'DELETE FROM contact_email_events',
            'CREATE ROLE unwanted',
        ]) await expect(store.query(query, [])).rejects.toMatchObject({ code: '42501' });
    });

    it('limits the backup role to reading the four contact tables', async () => {
        await register();
        const queryAsBackup = query => db.transaction(async tx => {
            await tx.exec('SET LOCAL ROLE contact_backup');
            return (await tx.query(query)).rows;
        });
        expect(await queryAsBackup('SELECT request_id FROM contact_enquiries')).toHaveLength(1);
        expect(await queryAsBackup('SELECT kind FROM contact_jobs')).toHaveLength(2);
        expect(await queryAsBackup('SELECT event_id FROM contact_email_events')).toHaveLength(0);
        expect(await queryAsBackup('SELECT id FROM contact_worker')).toHaveLength(1);
        for (const query of [
            'DELETE FROM contact_enquiries',
            'UPDATE contact_jobs SET attempts = 0',
            'UPDATE contact_worker SET locked_until = NULL',
            'CREATE TABLE public.unwanted (id integer)',
            'CREATE ROLE unwanted',
        ]) await expect(queryAsBackup(query)).rejects.toMatchObject({ code: '42501' });
    });

    it('atomically registers once, keeps the original snapshot and excludes Turnstile', async () => {
        const id = randomUUID();
        await Promise.all([register(id), register(id)]);
        expect(await jobs(id)).toHaveLength(2);
        const original = (await db.query('SELECT payload FROM contact_enquiries')).rows[0].payload;
        expect(JSON.stringify(original)).not.toContain('never-store-me');
        const conflict = await store.register({ ...input, message: 'Different request' }, original.context, original.email);
        expect(conflict.conflict).toBe(true);
        expect((await db.query('SELECT payload FROM contact_enquiries')).rows[0].payload).toEqual(original);
    });

    it('retries only CRM after an email success, including a worker restart', async () => {
        const id = await register();
        const send = vi.fn().mockResolvedValue(providerId);
        const sync = vi.fn().mockRejectedValueOnce(new Error('attio_unavailable')).mockResolvedValue({ status: 'synced' });
        await run({ send, sync });
        expect((await jobs(id)).map(job => [job.kind, job.status])).toEqual([['crm', 'pending'], ['email', 'succeeded']]);
        await due();
        const restarted = new ContactStore(store.query);
        await run({ store: restarted, send, sync });
        expect(send).toHaveBeenCalledTimes(1);
        expect(sync).toHaveBeenCalledTimes(2);
        expect((await jobs(id)).every(job => job.status === 'succeeded')).toBe(true);
    });

    it('does not let a slow or failed email prevent CRM creation', async () => {
        const id = await register();
        await run({ send: vi.fn().mockRejectedValue(new Error('email_unavailable')) });
        expect((await jobs(id)).map(job => [job.kind, job.status])).toEqual([['crm', 'succeeded'], ['email', 'pending']]);
    });

    it('only one worker can execute providers, and abandoned leases can be recovered', async () => {
        const id = await register();
        const send = vi.fn().mockResolvedValue(providerId);
        const sync = vi.fn().mockResolvedValue({ status: 'synced' });
        await Promise.all([run({ send, sync }), run({ send, sync })]);
        expect(send).toHaveBeenCalledTimes(1);
        expect(sync).toHaveBeenCalledTimes(1);
        await db.query("UPDATE contact_jobs SET status = 'running', locked_until = now() - interval '1 minute', provider_id = NULL WHERE request_id = $1 AND kind = 'email'", [id]);
        await db.exec("UPDATE contact_worker SET locked_until = now() - interval '1 minute'");
        await run({ send, sync });
        expect(send).toHaveBeenCalledTimes(2);
        expect(sync).toHaveBeenCalledTimes(1);
    });

    it('cannot commit a stale worker result over a newer lease', async () => {
        await register();
        const old = await store.claim();
        await db.exec("UPDATE contact_jobs SET locked_until = now() - interval '1 minute'");
        const current = await store.claim();
        await store.finish(old, { status: 'succeeded', providerId });
        expect((await jobs(old.request_id)).find(job => job.kind === old.kind).status).toBe('running');
        await store.finish(current, { status: 'succeeded', providerId });
    });

    it('reuses the exact Resend key and payload when provider acceptance was ambiguous', async () => {
        const id = await register();
        globalThis.fetch.mockRejectedValueOnce(new Error('lost response')).mockResolvedValueOnce({ ok: true, json: async () => ({ id: providerId }) });
        await processContactJobs({ store, sync: vi.fn().mockResolvedValue({ status: 'synced' }) });
        await due();
        await processContactJobs({ store });
        expect(globalThis.fetch).toHaveBeenCalledTimes(2);
        const calls = globalThis.fetch.mock.calls;
        expect(calls[0][1].body).toBe(calls[1][1].body);
        expect(calls[1][1].headers['Idempotency-Key']).toBe(`contact/${id}`);
    });

    it('does not resend an email after the safe 23-hour idempotency window', async () => {
        const id = await register();
        await db.query("UPDATE contact_jobs SET first_attempt_at = now() - interval '24 hours' WHERE request_id = $1 AND kind = 'email'", [id]);
        const send = vi.fn();
        await run({ send });
        expect(send).not.toHaveBeenCalled();
        expect((await jobs(id))[1]).toMatchObject({ status: 'attention', last_error: 'email_retry_window_expired' });
    });

    it('recovers a database failure after provider acceptance without changing the email key', async () => {
        const id = await register();
        globalThis.fetch.mockResolvedValue({ ok: true, json: async () => ({ id: providerId }) });
        const finish = vi.spyOn(store, 'finish').mockRejectedValueOnce(new Error('Commit lost'));
        await expect(processContactJobs({ store })).rejects.toThrow('Commit lost');
        finish.mockRestore();
        expect((await jobs(id))[1].status).toBe('running');
        await db.exec("UPDATE contact_jobs SET locked_until = now() - interval '1 minute'");
        await processContactJobs({ store, sync: vi.fn().mockResolvedValue({ status: 'synced' }) });
        expect(globalThis.fetch).toHaveBeenCalledTimes(2);
        expect(globalThis.fetch.mock.calls.map(call => call[1].headers['Idempotency-Key'])).toEqual([`contact/${id}`, `contact/${id}`]);
        expect((await jobs(id)).every(job => job.status === 'succeeded')).toBe(true);
    });

    it('recovers an email receipt via its signed tag, ignores duplicates and late sent events', async () => {
        const id = await register();
        const at = new Date().toISOString();
        const event = { type: 'email.delivered', created_at: at, data: { email_id: providerId, tags: { request_id: id } } };
        expect((await webhook(signedRequest(event, 'msg_delivery'))).status).toBe(200);
        expect((await webhook(signedRequest(event, 'msg_delivery'))).status).toBe(200);
        expect((await db.query('SELECT * FROM contact_email_events')).rows).toHaveLength(1);
        await webhook(signedRequest({ ...event, type: 'email.sent' }));
        expect((await db.query('SELECT email_event FROM contact_enquiries')).rows[0].email_event).toBe('email.delivered');
        const send = vi.fn();
        await run({ send });
        expect(send).not.toHaveBeenCalled();
        expect((await jobs(id))[1]).toMatchObject({ status: 'succeeded', provider_id: providerId });
    });

    it('records bounces without resending and rejects invalid or expired signatures', async () => {
        const id = await register();
        await run();
        const event = { type: 'email.bounced', created_at: new Date().toISOString(), data: { email_id: providerId } };
        expect((await webhook(new Request('https://local.test', { method: 'POST', body: JSON.stringify(event) }))).status).toBe(401);
        expect((await webhook(signedRequest(event, 'msg_old', new Date(Date.now() - 600000)))).status).toBe(401);
        expect((await webhook(signedRequest(event))).status).toBe(200);
        await webhook(signedRequest({ ...event, type: 'email.delivered', created_at: new Date(Date.now() + 1000).toISOString() }));
        expect((await store.status()).attention).toEqual([expect.objectContaining({ request_id: id, email_event: 'email.bounced' })]);
        const send = vi.fn(); await run({ send }); expect(send).not.toHaveBeenCalled();
    });

    it('acknowledges unrelated signed events without storing any personal data', async () => {
        await webhook(signedRequest({ type: 'email.sent', created_at: new Date().toISOString(), data: { email_id: providerId, to: ['private@example.com'] } }));
        expect((await db.query('SELECT * FROM contact_email_events')).rows).toHaveLength(0);
    });

    it('surfaces accepted emails still lacking a delivery confirmation after 30 minutes', async () => {
        const id = await register(); await run();
        await db.query("UPDATE contact_jobs SET updated_at = now() - interval '31 minutes' WHERE request_id = $1", [id]);
        expect((await store.status()).attention).toEqual([expect.objectContaining({ kind: 'email', status: 'succeeded', email_event: null })]);
    });

    it('returns 202 only after persistence, even while delivery is unavailable', async () => {
        globalThis.fetch.mockImplementation(async url => {
            if (url.includes('turnstile')) return { ok: true, json: async () => ({ success: true, hostname: 'www.inastia.fr' }) };
            throw new Error('Provider unavailable');
        });
        const response = res();
        await contact({ method: 'POST', headers: {}, body: { ...input, requestId: randomUUID() } }, response);
        expect(response.status).toHaveBeenCalledWith(202);
        expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, status: 'registered' }));
        expect((await db.query('SELECT * FROM contact_enquiries')).rows).toHaveLength(1);
    });

    it('fails closed on database failure and never dispatches to a provider', async () => {
        globalThis.fetch.mockResolvedValue({ ok: true, json: async () => ({ success: true, hostname: 'inastia.fr' }) });
        vi.spyOn(store, 'register').mockRejectedValue(new Error('Database down'));
        const response = res();
        await contact({ method: 'POST', headers: {}, body: input }, response);
        expect(response.status).toHaveBeenCalledWith(503);
        expect(globalThis.fetch).toHaveBeenCalledTimes(1);
        expect(background).toHaveLength(0);
    });

    it('persists sanitised GBP attribution and keeps the first snapshot through a retry without attribution', async () => {
        globalThis.fetch.mockResolvedValue({ ok: true, json: async () => ({ success: true, hostname: 'inastia.fr' }) });
        // Inspect durable registration independently of worker scheduling and provider delivery.
        vi.spyOn(store, 'acquireWorker').mockResolvedValue(null);
        const acquisition = { consent: true, version: 'acquisition-2026-09-24-v1', source: 'google_business_profile', at: Date.now() - 1000 };
        const body = { ...input, requestId: randomUUID(), acquisition: { ...acquisition, private: 'never-persist-this' } };
        const first = res();
        await contact({ method: 'POST', headers: {}, body }, first);
        expect(first.status).toHaveBeenCalledWith(202);
        const payload = (await db.query('SELECT payload FROM contact_enquiries')).rows[0].payload;
        expect(payload.context.acquisition).toEqual(acquisition);
        expect(JSON.stringify(payload)).not.toContain('never-persist-this');
        const retry = res();
        await contact({ method: 'POST', headers: {}, body: { ...body, acquisition: { ...acquisition, consent: false } } }, retry);
        expect(retry.status).toHaveBeenCalledWith(202);
        expect((await db.query('SELECT payload FROM contact_enquiries')).rows[0].payload).toEqual(payload);
        const sync = vi.fn().mockResolvedValue({ status: 'synced' });
        store.acquireWorker.mockRestore();
        await run({ sync });
        expect(sync.mock.calls[0][1].acquisition).toEqual(acquisition);
    });

    it('protects operations from public callers and disables preview workers', async () => {
        for (const handler of [statusHandler, cronHandler]) {
            const response = res();
            await handler({ method: 'GET', headers: {} }, response);
            expect(response.status).toHaveBeenCalledWith(401);
        }
        const response = res();
        await statusHandler({ method: 'GET', headers: { authorization: 'Bearer local-operations-secret' } }, response);
        expect(response.status).toHaveBeenCalledWith(200);
        await register(); vi.stubEnv('VERCEL_ENV', 'preview');
        expect(await run()).toEqual({ processed: 0 });
        expect(globalThis.fetch).not.toHaveBeenCalled();
    });

    it('purges completed payloads after 30 days while retaining duplicate protection', async () => {
        const id = await register(); await run();
        await db.query("UPDATE contact_enquiries SET received_at = now() - interval '31 days' WHERE request_id = $1", [id]);
        await store.cleanup();
        expect((await db.query('SELECT payload FROM contact_enquiries')).rows[0].payload).toBeNull();
        await register(id);
        expect((await db.query('SELECT payload FROM contact_enquiries')).rows[0].payload).toBeNull();
        const send = vi.fn(); await run({ send }); expect(send).not.toHaveBeenCalled();
    });

    it('retains unfinished content until 90 days then removes it and eventually its metadata', async () => {
        const id = await register();
        await db.query("UPDATE contact_enquiries SET received_at = now() - interval '31 days' WHERE request_id = $1", [id]);
        await store.cleanup();
        expect((await db.query('SELECT payload FROM contact_enquiries')).rows[0].payload).not.toBeNull();
        await db.query("UPDATE contact_enquiries SET received_at = now() - interval '91 days' WHERE request_id = $1", [id]);
        const send = vi.fn(); const sync = vi.fn();
        await run({ send, sync });
        expect(send).not.toHaveBeenCalled(); expect(sync).not.toHaveBeenCalled();
        await store.cleanup();
        expect((await db.query('SELECT payload FROM contact_enquiries')).rows[0].payload).toBeNull();
        expect((await jobs(id)).every(job => job.last_error === 'retention_expired')).toBe(true);
        await db.query("UPDATE contact_enquiries SET received_at = now() - interval '2 years' WHERE request_id = $1", [id]);
        await store.cleanup();
        expect(await jobs(id)).toHaveLength(0);
    });
});
