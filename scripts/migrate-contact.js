import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

// Pass an explicit env file with node --env-file=...; never print credentials/errors.
try {
    if (!process.env.CONTACT_DATABASE_URL) throw new Error('Missing database');
    const sql = neon(process.env.CONTACT_DATABASE_URL);
    const source = await readFile(new URL('../db/contact.sql', import.meta.url), 'utf8');
    const statements = source.split(';').map(statement => statement.trim()).filter(Boolean);
    await sql.transaction(statements.map(statement => sql.query(statement)));
    console.info('Contact schema ready.');
} catch {
    console.error('Contact migration failed. Check database access; no credentials have been logged.');
    process.exitCode = 1;
}
