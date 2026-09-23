import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

// Use a private, direct owner connection, never the Vercel runtime connection.
try {
    if (!process.env.CONTACT_ADMIN_DATABASE_URL) throw new Error('Missing admin database');
    const sql = neon(process.env.CONTACT_ADMIN_DATABASE_URL);
    // Keep the DO block intact: do not split this migration on semicolons.
    await sql.query(await readFile(new URL('../db/contact-access.sql', import.meta.url), 'utf8'));
    console.info('Contact database permissions ready. Login credentials are configured separately.');
} catch {
    console.error('Contact permission migration failed. No secret or raw provider error displayed.');
    process.exitCode = 1;
}
