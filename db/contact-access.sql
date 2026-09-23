-- Apply as the owner, only to the dedicated contact database after contact.sql.
-- Login credentials are configured separately and must never enter this file.
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'contact_app') THEN
        CREATE ROLE contact_app NOLOGIN NOINHERIT;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'contact_backup') THEN
        CREATE ROLE contact_backup NOLOGIN NOINHERIT;
    END IF;
    EXECUTE format('REVOKE CREATE, TEMPORARY ON DATABASE %I FROM PUBLIC', current_database());
    EXECUTE format('REVOKE ALL ON DATABASE %I FROM contact_app, contact_backup', current_database());
    EXECUTE format('GRANT CONNECT ON DATABASE %I TO contact_app, contact_backup', current_database());
    IF EXISTS (
        SELECT FROM pg_auth_members
        WHERE member IN (SELECT oid FROM pg_roles WHERE rolname IN ('contact_app', 'contact_backup'))
    ) THEN
        RAISE EXCEPTION 'Contact roles must not inherit or assume another role';
    END IF;
    IF EXISTS (
        SELECT FROM pg_roles
        WHERE rolname IN ('contact_app', 'contact_backup')
        AND (rolsuper OR rolcreatedb OR rolcreaterole OR rolreplication OR rolbypassrls OR rolinherit)
    ) THEN
        RAISE EXCEPTION 'Contact roles must not have elevated attributes';
    END IF;
    IF EXISTS (
        SELECT FROM pg_roles r
        WHERE r.rolname IN ('contact_app', 'contact_backup') AND (
            EXISTS (SELECT FROM pg_database WHERE datdba = r.oid)
            OR EXISTS (SELECT FROM pg_namespace WHERE nspowner = r.oid)
            OR EXISTS (SELECT FROM pg_class WHERE relowner = r.oid)
        )
    ) THEN
        RAISE EXCEPTION 'Contact roles must not own database objects';
    END IF;

    REVOKE CREATE ON SCHEMA public FROM PUBLIC;
    REVOKE ALL ON SCHEMA public FROM contact_app, contact_backup;
    GRANT USAGE ON SCHEMA public TO contact_app, contact_backup;

    REVOKE ALL ON contact_enquiries, contact_jobs, contact_email_events, contact_worker FROM PUBLIC;
    REVOKE ALL ON contact_enquiries, contact_jobs, contact_email_events, contact_worker FROM contact_app, contact_backup;
    GRANT SELECT, INSERT, UPDATE, DELETE ON contact_enquiries TO contact_app;
    GRANT SELECT, INSERT, UPDATE ON contact_jobs TO contact_app;
    GRANT SELECT, INSERT ON contact_email_events TO contact_app;
    GRANT SELECT, UPDATE ON contact_worker TO contact_app;
    GRANT SELECT ON contact_enquiries, contact_jobs, contact_email_events, contact_worker TO contact_backup;
    -- No default grants: a future table requires an explicit privilege review.
END $$;
