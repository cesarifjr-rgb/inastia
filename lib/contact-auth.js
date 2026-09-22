import { timingSafeEqual } from 'node:crypto';

export function authorizeOperations(header) {
    const secret = process.env.CRON_SECRET;
    if (!secret || process.env.VERCEL_ENV !== 'production') return false;
    const expected = Buffer.from(`Bearer ${secret}`);
    const actual = Buffer.from(typeof header === 'string' ? header : '');
    return actual.length === expected.length && timingSafeEqual(actual, expected);
}
