// Shared utility functions used by api/contact.js
// Extracted for testability

/**
 * HTML entity encoding to prevent injection in email body
 * @param {string} str - Input string to escape
 * @returns {string} HTML-escaped string
 */
export function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Truncate string to max length
 * @param {string} str - Input string
 * @param {number} maxLen - Maximum length
 * @returns {string} Truncated string
 */
export function truncate(str, maxLen) {
    if (!str) return '';
    return String(str).slice(0, maxLen);
}
