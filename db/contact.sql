-- Dedicated contact database. Apply before enabling CONTACT_DURABLE_ENABLED.
CREATE TABLE IF NOT EXISTS contact_enquiries (
    request_id uuid PRIMARY KEY,
    fingerprint text NOT NULL,
    payload jsonb,
    received_at timestamptz NOT NULL DEFAULT now(),
    email_event text,
    email_event_at timestamptz
);
CREATE TABLE IF NOT EXISTS contact_jobs (
    request_id uuid NOT NULL REFERENCES contact_enquiries ON DELETE CASCADE,
    kind text NOT NULL CHECK (kind IN ('email', 'crm')),
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'succeeded', 'attention')),
    attempts integer NOT NULL DEFAULT 0,
    next_attempt_at timestamptz NOT NULL DEFAULT now(),
    first_attempt_at timestamptz,
    lease_id uuid,
    locked_until timestamptz,
    provider_id uuid,
    last_error text,
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (request_id, kind)
);
CREATE INDEX IF NOT EXISTS contact_jobs_due ON contact_jobs (next_attempt_at) WHERE status IN ('pending', 'running');
CREATE UNIQUE INDEX IF NOT EXISTS contact_jobs_provider ON contact_jobs (provider_id) WHERE provider_id IS NOT NULL;
CREATE TABLE IF NOT EXISTS contact_email_events (
    event_id text PRIMARY KEY,
    request_id uuid NOT NULL REFERENCES contact_enquiries ON DELETE CASCADE,
    provider_id uuid NOT NULL,
    type text NOT NULL,
    occurred_at timestamptz NOT NULL,
    recorded_at timestamptz NOT NULL DEFAULT now()
);
-- One short-lived worker at a time also serializes CRM updates for the same owner.
CREATE TABLE IF NOT EXISTS contact_worker (
    id integer PRIMARY KEY CHECK (id = 1),
    lease_id uuid,
    locked_until timestamptz
);
INSERT INTO contact_worker (id) VALUES (1) ON CONFLICT DO NOTHING;
