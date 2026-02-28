import { describe, it, expect } from 'vitest';
import { escapeHtml, isValidEmail, truncate } from './utils.js';

// ============================================
// escapeHtml
// ============================================
describe('escapeHtml', () => {
    it('returns empty string for null/undefined', () => {
        expect(escapeHtml(null)).toBe('');
        expect(escapeHtml(undefined)).toBe('');
        expect(escapeHtml('')).toBe('');
    });

    it('escapes ampersands', () => {
        expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    it('escapes angle brackets', () => {
        expect(escapeHtml('<script>alert("xss")</script>')).toBe(
            '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
        );
    });

    it('escapes quotes', () => {
        expect(escapeHtml('He said "hello"')).toBe('He said &quot;hello&quot;');
        expect(escapeHtml("It's fine")).toBe("It&#039;s fine");
    });

    it('handles mixed dangerous characters', () => {
        expect(escapeHtml('<img src="x" onerror="alert(1)">')).toBe(
            '&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;'
        );
    });

    it('leaves safe strings untouched', () => {
        expect(escapeHtml('Hello World 123')).toBe('Hello World 123');
        expect(escapeHtml('résidence été')).toBe('résidence été');
    });

    it('converts numbers to string', () => {
        expect(escapeHtml(42)).toBe('42');
    });
});

// ============================================
// isValidEmail
// ============================================
describe('isValidEmail', () => {
    it('accepts valid emails', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('user.name@domain.fr')).toBe(true);
        expect(isValidEmail('user+tag@mail.co.uk')).toBe(true);
    });

    it('rejects emails without @', () => {
        expect(isValidEmail('testexample.com')).toBe(false);
    });

    it('rejects emails without domain', () => {
        expect(isValidEmail('test@')).toBe(false);
        expect(isValidEmail('test@.')).toBe(false);
    });

    it('rejects emails with spaces', () => {
        expect(isValidEmail('test @example.com')).toBe(false);
        expect(isValidEmail('test@ example.com')).toBe(false);
    });

    it('rejects empty/null', () => {
        expect(isValidEmail('')).toBe(false);
        expect(isValidEmail(null)).toBe(false);
        expect(isValidEmail(undefined)).toBe(false);
    });

    it('rejects double @', () => {
        expect(isValidEmail('test@@example.com')).toBe(false);
    });
});

// ============================================
// truncate
// ============================================
describe('truncate', () => {
    it('returns empty string for null/undefined', () => {
        expect(truncate(null, 10)).toBe('');
        expect(truncate(undefined, 10)).toBe('');
        expect(truncate('', 10)).toBe('');
    });

    it('truncates strings longer than maxLen', () => {
        expect(truncate('Hello World', 5)).toBe('Hello');
        expect(truncate('abcdefghij', 3)).toBe('abc');
    });

    it('preserves strings shorter than maxLen', () => {
        expect(truncate('Hi', 10)).toBe('Hi');
        expect(truncate('exact', 5)).toBe('exact');
    });

    it('handles maxLen = 0', () => {
        expect(truncate('Hello', 0)).toBe('');
    });

    it('converts numbers to string', () => {
        expect(truncate(12345, 3)).toBe('123');
    });

    it('handles unicode characters', () => {
        expect(truncate('résidence été', 9)).toBe('résidence');
    });
});
