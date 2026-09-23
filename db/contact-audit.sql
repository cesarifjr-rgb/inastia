-- Read-only operational checks for the dedicated contact database.
-- Results contain only aggregates and database roles, never enquiry content.
BEGIN TRANSACTION READ ONLY;

SELECT current_database() AS database, current_user AS role,
    pg_database_size(current_database()) AS database_bytes;

SELECT
    (SELECT count(*) FROM contact_enquiries) AS enquiries,
    (SELECT count(*) FROM contact_jobs) AS jobs,
    (SELECT count(*) FROM contact_email_events) AS email_events,
    (SELECT count(*) FROM contact_worker WHERE id = 1) AS worker_rows;

SELECT
    count(*) FILTER (WHERE payload IS NOT NULL AND received_at < now() - interval '90 days') AS expired_payloads_90d,
    count(*) FILTER (WHERE payload IS NOT NULL AND received_at < now() - interval '30 days'
        AND NOT EXISTS (SELECT 1 FROM contact_jobs j WHERE j.request_id = e.request_id AND j.status != 'succeeded')) AS expired_completed_payloads_30d,
    count(*) FILTER (WHERE received_at < now() - interval '1 year') AS expired_references,
    count(*) FILTER (WHERE (SELECT count(*) FROM contact_jobs j WHERE j.request_id = e.request_id) != 2) AS incomplete_job_pairs
FROM contact_enquiries e;

SELECT kind, status, count(*) AS count FROM contact_jobs GROUP BY kind, status ORDER BY kind, status;

-- Login roles and inherited permissions; no password hashes are queried.
SELECT rolname, rolcreatedb, rolcreaterole, rolbypassrls,
    has_schema_privilege(rolname, 'public', 'CREATE') AS can_create_in_public,
    pg_has_role(rolname, 'pg_database_owner', 'MEMBER') AS database_owner
FROM pg_roles WHERE rolcanlogin AND rolname !~ '^(cloud_|neon_)';

COMMIT;
