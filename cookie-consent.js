/**
 * Inastia — GDPR Consent Management Platform (CMP)
 * Handles cookie consent, UI display, and conditioned resource loading.
 */

const CONSENT_KEY = 'inastia_consent';
const CONSENT_DURATION = 180 * 24 * 60 * 60 * 1000; // 6 months in ms

// Default config
const config = {
    necessary: true, // Always true
    marketing: false // Default blocked
};

let currentConsent = null;

// UI Templates (injected via JS to keep HTML clean)
const htmlTemplates = {
    banner: `
    <div id="cookie-banner" class="cookie-banner" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
        <div class="cookie-content">
            <h3 id="cookie-title" data-i18n="cookies.title">Paramètres de confidentialité</h3>
            <p data-i18n="cookies.text">
                Nous utilisons des cookies pour optimiser votre expérience et mesurer notre audience.
                Vous pouvez choisir d'accepter ou de refuser les traceurs non essentiels.
            </p>
        </div>
        <div class="cookie-actions">
            <button id="cookie-refuse" class="btn btn-outline-dark btn-sm" data-i18n="cookies.refuse">Refuser</button>
            <button id="cookie-settings" class="btn btn-link btn-sm" data-i18n="cookies.settings">Paramétrer</button>
            <button id="cookie-accept" class="btn btn-primary btn-sm" data-i18n="cookies.accept">Accepter</button>
        </div>
    </div>`,

    modal: `
    <div id="cookie-modal" class="cookie-modal-overlay" style="display: none;">
        <div class="cookie-modal">
            <div class="cookie-modal-header">
                <h3 data-i18n="cookies.modal.title">Gestion des cookies</h3>
                <button id="cookie-modal-close" class="cookie-modal-close" aria-label="Fermer">&times;</button>
            </div>
            <div class="cookie-modal-body">
                <p data-i18n="cookies.modal.text">
                    Gérez vos préférences de consentement pour les cookies et traceurs.
                    Le refus ne vous empêchera pas d'accéder au site, mais certains contenus (cartes, vidéos) pourraient être masqués.
                </p>
                <p style="font-size:0.85rem;opacity:0.7;margin-top:6px" data-i18n="cookies.modal.retention">
                    Votre choix est conservé 6 mois. <a href="/privacy" style="color:inherit;text-decoration:underline">Politique de confidentialité</a>
                </p>
                
                <div class="cookie-option">
                    <div class="cookie-option-header">
                        <span data-i18n="cookies.necessary.title">Nécessaires</span>
                        <span class="cookie-status" data-i18n="cookies.always_active">Toujours actif</span>
                    </div>
                    <p data-i18n="cookies.necessary.desc">Indispensables au bon fonctionnement du site (session, sécurité, langue).</p>
                </div>

                <div class="cookie-option">
                    <div class="cookie-option-header">
                        <span data-i18n="cookies.marketing.title">Marketing & Tiers</span>
                        <label class="switch">
                            <input type="checkbox" id="consent-marketing">
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <p data-i18n="cookies.marketing.desc">Google Maps, YouTube, et autres contenus embarqués. Requis pour voir la carte interactive.</p>
                </div>
            </div>
            <div class="cookie-modal-footer">
                <button id="cookie-save" class="btn btn-primary" data-i18n="cookies.save">Enregistrer mes choix</button>
            </div>
        </div>
    </div>`
};

export function initConsent() {
    loadConsent();

    if (!hasValidConsent()) {
        showBanner();
    } else {
        applyConsent();
    }

    // Expose open settings globally for footer link
    window.openCookieSettings = () => {
        if (!document.getElementById('cookie-modal')) {
            renderUI(); // Ensure UI exists
        }
        showModal();
    };
}

function loadConsent() {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            // Check expiry
            if (new Date().getTime() < parsed.expiry) {
                currentConsent = parsed.preferences;
            } else {
                localStorage.removeItem(CONSENT_KEY);
            }
        } catch (e) {
            console.error("Cookie consent parse error", e);
        }
    }
}

function hasValidConsent() {
    return currentConsent !== null;
}

function saveConsent(preferences) {
    currentConsent = preferences;
    const data = {
        preferences: preferences,
        timestamp: new Date().getTime(),
        expiry: new Date().getTime() + CONSENT_DURATION
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
    applyConsent();
    hideBanner();
    hideModal();
}

function applyConsent() {
    // Handle Marketing (Google Maps, etc.)
    if (currentConsent.marketing) {
        activateMarketing();
    } else {
        deactivateMarketing();
    }


}

function activateMarketing() {
    // Unblock Iframes (Google Maps)
    document.querySelectorAll('iframe[data-src][data-category="marketing"]').forEach(iframe => {
        if (!iframe.src) {
            iframe.src = iframe.dataset.src;
            const container = iframe.closest('.map-container');
            if (container) {
                container.classList.remove('blocked');
            }
        }
    });
}

function deactivateMarketing() {
    // If we wanted to strictly unload, we could remove src, but usually reload is needed.
    // Primarily prevents loading on fresh visit if denied.
    // Also ensures blocking UI is visible if blocked.
    document.querySelectorAll('.map-container').forEach(container => {
        // Checking if we need to show the blocked state
        if (!currentConsent.marketing) {
            container.classList.add('blocked');
        }
    });
}

// UI Functions
function renderUI() {
    if (document.getElementById('cookie-banner')) return;

    // Inject styles if not present (handled in style.css, but logic here ensures elements exist)
    document.body.insertAdjacentHTML('beforeend', htmlTemplates.banner);
    document.body.insertAdjacentHTML('beforeend', htmlTemplates.modal);

    // Bind Events
    document.getElementById('cookie-accept').addEventListener('click', () => {
        saveConsent({ necessary: true, marketing: true });
    });

    document.getElementById('cookie-refuse').addEventListener('click', () => {
        saveConsent({ necessary: true, marketing: false });
    });

    document.getElementById('cookie-settings').addEventListener('click', showModal);
    document.getElementById('cookie-modal-close').addEventListener('click', hideModal);

    document.getElementById('cookie-save').addEventListener('click', () => {
        const marketing = document.getElementById('consent-marketing').checked;
        saveConsent({ necessary: true, marketing });
    });

    // Refresh I18N for injected elements
    // We assume the main i18n module exports a function to update texts. 
    // This will be handled by the main app loop or we can trigger a custom event.
    window.dispatchEvent(new Event('cookies:ui-injected'));
}

function showBanner() {
    renderUI();
    // Small delay for animation
    setTimeout(() => {
        document.getElementById('cookie-banner').classList.add('visible');
    }, 100);
}

function hideBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.classList.remove('visible');
        // Remove from DOM after transition? Better to keep hidden for performance if re-opening settings
    }
}

function showModal() {
    renderUI(); // Ensure exists
    const modal = document.getElementById('cookie-modal');
    // Pre-fill checkboxes based on current or default
    const marketing = currentConsent ? currentConsent.marketing : false;
    document.getElementById('consent-marketing').checked = marketing;

    modal.style.display = 'flex';

    // Accessibility: focus trap inside modal
    const focusableEls = modal.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])');
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];
    if (firstEl) firstEl.focus();

    modal._trapHandler = (e) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
            if (document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
        } else {
            if (document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
        }
        if (e.key === 'Escape') hideModal();
    };
    modal.addEventListener('keydown', modal._trapHandler);
}

function hideModal() {
    const modal = document.getElementById('cookie-modal');
    if (modal) {
        if (modal._trapHandler) modal.removeEventListener('keydown', modal._trapHandler);
        modal.style.display = 'none';
    }
}
