/* ============================================
   INASTIA — Main JavaScript v3
   GSAP animations, wizard form, custom cursor,
   dark mode, cinematic text, i18n, etc.
   ============================================ */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setLanguage, toggleLanguage, currentLang } from './i18n.js';
import { initConsent } from './cookie-consent.js';

gsap.registerPlugin(ScrollTrigger);

// ---- Cookie Consent Init ----
initConsent();
window.addEventListener('cookies:ui-injected', () => {
    setLanguage(currentLang);
});

// ---- Custom Cursor ----
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    document.querySelectorAll('.interactive, a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            follower.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            follower.classList.remove('active');
        });
    });

    document.body.style.cursor = 'none';
    document.querySelectorAll('a, button, .interactive').forEach(el => {
        el.style.cursor = 'none';
    });
}

// ---- Dark Mode Toggle ----
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

const savedTheme = localStorage.getItem('inastia-theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('inastia-theme', next);
    });
}

// ---- Navbar Scroll Behavior ----
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

if (navbar) {
    function handleNavScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
}

// ---- Mobile Nav Toggle ----
if (navToggle && navLinks && navOverlay) {
    function toggleMobileNav() {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        navOverlay.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    }
    navToggle.addEventListener('click', toggleMobileNav);
    navOverlay.addEventListener('click', toggleMobileNav);

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) toggleMobileNav();
        });
    });
}

// ---- Cinematic Hero Text (Letter-by-Letter) ----
function animateHeroText() {
    const heroLines = document.querySelectorAll('.hero-line');

    heroLines.forEach((line, lineIndex) => {
        const html = line.innerHTML;
        if (line.querySelector('span')) return;

        let charIndex = 0;
        let result = '';
        let insideTag = false;
        let tagContent = '';

        for (let i = 0; i < html.length; i++) {
            const char = html[i];

            if (char === '<') { insideTag = true; tagContent += char; continue; }
            if (insideTag) {
                tagContent += char;
                if (char === '>') { insideTag = false; result += tagContent; tagContent = ''; }
                continue;
            }

            if (char === ' ') {
                result += ' ';
            } else {
                const delay = (lineIndex * 8 + charIndex) * 0.04 + 0.5;
                result += `<span style="animation-delay:${delay}s">${char}</span>`;
                charIndex++;
            }
        }

        line.innerHTML = result;
    });
}
animateHeroText();
window.animateHeroTitle = animateHeroText;

// ============================================
// GSAP ANIMATIONS
// ============================================

// Signal to CSS that GSAP is handling reveals
document.body.classList.add('gsap-ready');

// ---- Parallax Hero Background ----
const heroBg = document.querySelector('.hero-bg video, .hero-bg img');
if (heroBg) {
    gsap.to(heroBg, {
        yPercent: 20,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
}

// ---- Section Headers (staggered line-by-line text) ----
document.querySelectorAll('.section-label, .section-title, .section-subtitle').forEach(el => {
    gsap.from(el, {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
        }
    });
});

// ---- Service Cards (staggered) ----
gsap.from('.service-card', {
    y: 60,
    opacity: 0,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 85%'
    }
});

// ---- Timeline Items (staggered from left) ----
gsap.from('.timeline-item', {
    x: -40,
    opacity: 0,
    duration: 0.7,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.timeline',
        start: 'top 80%'
    }
});

// ---- Comparison Cards (from sides) ----
const compBefore = document.querySelector('.comparison-before');
const compAfter = document.querySelector('.comparison-after');
if (compBefore && compAfter) {
    gsap.from(compBefore, {
        x: -60, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.comparison-slider', start: 'top 80%' }
    });
    gsap.from(compAfter, {
        x: 60, opacity: 0, duration: 0.8, delay: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.comparison-slider', start: 'top 80%' }
    });
}

// ---- Stats Numbers (scale in) ----
gsap.from('.stat-item', {
    scale: 0.8,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'back.out(1.5)',
    scrollTrigger: {
        trigger: '.stats-grid',
        start: 'top 85%'
    }
});

// ---- Portfolio Cards (parallax images on scroll) ----
document.querySelectorAll('.portfolio-card').forEach((card, i) => {
    gsap.from(card, {
        y: 80,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: card,
            start: 'top 90%'
        }
    });

    // Subtle parallax on the image inside
    const img = card.querySelector('img');
    if (img) {
        gsap.to(img, {
            yPercent: -8,
            ease: 'none',
            scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }
});

// ---- Review Cards (staggered up) ----
const reviewCards = document.querySelectorAll('.review-card');
if (reviewCards.length > 0) {
    ScrollTrigger.create({
        trigger: '.reviews-grid',
        start: 'top 90%',
        onEnter: () => {
            gsap.fromTo(reviewCards,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out' }
            );
        }
    });
}

// ---- Google Badge (scale in) ----
const googleBadge = document.querySelector('.google-badge');
if (googleBadge) {
    ScrollTrigger.create({
        trigger: '.google-badge',
        start: 'top 95%',
        onEnter: () => {
            gsap.fromTo(googleBadge,
                { scale: 0.9, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' }
            );
        }
    });
}

// ---- Map Section (text from left, map from right) ----
const mapText = document.querySelector('.map-text');
const mapVisual = document.querySelector('.map-visual');
if (mapText) {
    gsap.from(mapText, {
        x: -60, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.map-inner', start: 'top 80%' }
    });
}
if (mapVisual) {
    gsap.from(mapVisual, {
        x: 60, opacity: 0, duration: 0.8, delay: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.map-inner', start: 'top 80%' }
    });
}

// ---- Contact Section (text from left, form from right) ----
const contactText = document.querySelector('.contact-text');
const contactForm = document.getElementById('contactForm');
if (contactText) {
    gsap.from(contactText, {
        x: -50, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-inner', start: 'top 80%' }
    });
}
if (contactForm) {
    gsap.from(contactForm, {
        x: 50, opacity: 0, duration: 0.8, delay: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-inner', start: 'top 80%' }
    });
}

// ---- Footer (staggered columns) ----
gsap.from('.footer-col, .footer-brand', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.footer-inner',
        start: 'top 90%'
    }
});

// ---- About Page: Story Section ----
const storyImage = document.querySelector('.story-image');
const storyText = document.querySelector('.story-text');
if (storyImage && storyText) {
    gsap.from(storyImage, {
        x: -50, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.story-section', start: 'top 80%' }
    });
    gsap.from(storyText, {
        x: 50, opacity: 0, duration: 0.8, delay: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.story-section', start: 'top 80%' }
    });
}

// ---- About Page: Values Grid ----
gsap.from('.value-card', {
    y: 50,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.values-grid',
        start: 'top 85%'
    }
});


// ============================================
// ANIMATED COUNTERS (triggered by GSAP)
// ============================================
let countersAnimated = false;

function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    document.querySelectorAll('.stat-number[data-target]').forEach(counter => {
        const target = parseFloat(counter.dataset.target);
        const isDecimal = counter.dataset.decimal === 'true';
        const prefix = counter.dataset.prefix || '';
        const suffix = counter.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - (1 - progress) * (1 - progress);
            const current = isDecimal ? (target * ease).toFixed(1) : Math.floor(target * ease);
            counter.textContent = `${prefix}${current}${suffix}`;
            if (progress < 1) requestAnimationFrame(updateCounter);
            else counter.textContent = `${prefix}${isDecimal ? target.toFixed(1) : target}${suffix}`;
        }
        requestAnimationFrame(updateCounter);
    });
}

ScrollTrigger.create({
    trigger: '#resultats',
    start: 'top 70%',
    onEnter: animateCounters
});

// ============================================
// TIMELINE PROGRESS
// ============================================
const timelineProgress = document.getElementById('timelineProgress');
const timelineItems = document.querySelectorAll('.timeline-item');

if (timelineProgress && timelineItems.length > 0) {
    timelineItems.forEach(item => {
        ScrollTrigger.create({
            trigger: item,
            start: 'top 75%',
            onEnter: () => {
                item.classList.add('visible');
                const visibleItems = document.querySelectorAll('.timeline-item.visible');
                const fraction = visibleItems.length / timelineItems.length;
                timelineProgress.style.height = (fraction * 100) + '%';
            }
        });
    });
}

// ============================================
// WIZARD FORM
// ============================================
const wizardForm = document.getElementById('contactForm');

if (wizardForm) {
    const steps = wizardForm.querySelectorAll('.wizard-step');
    const bar = document.getElementById('wizardBar');
    const dots = wizardForm.querySelectorAll('.wizard-step-dot');
    const successEl = document.getElementById('wizardSuccess');
    let currentStep = 1;

    function goToStep(stepNum) {
        // Hide all steps
        steps.forEach(s => s.classList.remove('active'));
        // Show target step
        const target = wizardForm.querySelector(`[data-wizard-step="${stepNum}"]`);
        if (target) target.classList.add('active');

        // Update progress bar and dots
        bar.style.width = ((stepNum / 3) * 100) + '%';
        dots.forEach(dot => {
            const dStep = parseInt(dot.dataset.step);
            dot.classList.remove('active', 'done');
            if (dStep === stepNum) dot.classList.add('active');
            else if (dStep < stepNum) dot.classList.add('done');
        });

        currentStep = stepNum;
    }

    // Step validation
    function validateStep(stepNum) {
        if (stepNum === 1) {
            const selected = wizardForm.querySelector('input[name="propertyType"]:checked');
            if (!selected) {
                const options = wizardForm.querySelector('.wizard-options');
                if (options) {
                    options.style.outline = '2px solid #e74c3c';
                    options.style.borderRadius = '8px';
                    setTimeout(() => { options.style.outline = ''; }, 2000);
                }
                return false;
            }
        }
        if (stepNum === 2) {
            const location = wizardForm.querySelector('#location');
            if (location && !location.value) {
                location.style.outline = '2px solid #e74c3c';
                setTimeout(() => { location.style.outline = ''; }, 2000);
                return false;
            }
        }
        return true;
    }

    // Next buttons (with validation)
    wizardForm.querySelectorAll('.wizard-next').forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                const next = parseInt(btn.dataset.next);
                goToStep(next);
            }
        });
    });

    // Prev buttons
    wizardForm.querySelectorAll('.wizard-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            const prev = parseInt(btn.dataset.prev);
            goToStep(prev);
        });
    });

    // Submit — sends data via Web3Forms API
    wizardForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate step 3 (contact info)
        const firstName = wizardForm.querySelector('#firstName')?.value?.trim();
        const lastName = wizardForm.querySelector('#lastName')?.value?.trim();
        const email = wizardForm.querySelector('#email')?.value?.trim();

        if (!firstName || !lastName || !email) {
            const emptyField = !firstName ? '#firstName' : !lastName ? '#lastName' : '#email';
            const field = wizardForm.querySelector(emptyField);
            if (field) {
                field.style.outline = '2px solid #e74c3c';
                setTimeout(() => { field.style.outline = ''; }, 2000);
            }
            return;
        }

        // Disable submit button & show loading
        const submitBtn = wizardForm.querySelector('button[type="submit"]');
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span style="display:flex;align-items:center;gap:8px"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><circle cx="12" cy="12" r="10" opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>Envoi en cours...</span>';

        // Collect all form data
        const propertyType = wizardForm.querySelector('input[name="propertyType"]:checked')?.value || '';
        const location = wizardForm.querySelector('#location')?.value || '';
        const bedrooms = wizardForm.querySelector('#bedrooms')?.value || '';
        const bathrooms = wizardForm.querySelector('#bathrooms')?.value || '';
        const surface = wizardForm.querySelector('#surface')?.value || '';
        const capacity = wizardForm.querySelector('#capacity')?.value || '';
        const phone = wizardForm.querySelector('#phone')?.value || '';
        const message = wizardForm.querySelector('#message')?.value || '';

        // Build payload for Web3Forms
        const payload = {
            access_key: 'c2493fbd-1271-4313-aca8-0d34d4ea12b7',
            subject: `Nouveau lead Inastia — ${propertyType} à ${location}`,
            from_name: `${firstName} ${lastName}`,
            email: email,
            phone: phone,
            'Type de bien': propertyType,
            'Localisation': location,
            'Chambres': bedrooms,
            'Salles de bain': bathrooms,
            'Surface (m²)': surface,
            'Capacité': capacity,
            'Message': message || '(aucun message)',
        };

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const result = await response.json();

            if (result.success) {
                // Show success
                steps.forEach(s => s.classList.remove('active'));
                wizardForm.querySelector('.wizard-progress').style.display = 'none';
                successEl.classList.add('active');

                // Reset after 4s
                setTimeout(() => {
                    successEl.classList.remove('active');
                    wizardForm.querySelector('.wizard-progress').style.display = '';
                    wizardForm.reset();
                    goToStep(1);
                }, 4000);
            } else {
                throw new Error(result.message || 'Erreur serveur');
            }
        } catch (err) {
            // Show error inline
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.style.cssText = 'color:#e74c3c;background:rgba(231,76,60,0.1);padding:12px 16px;border-radius:8px;margin-top:12px;font-size:0.9rem;';
            errorDiv.textContent = 'Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter par téléphone.';
            submitBtn.parentNode.parentNode.appendChild(errorDiv);
            setTimeout(() => errorDiv.remove(), 5000);
        } finally {
            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
// ============================================
// SMOOTH SCROLL (Native + Hash Handling)
// ============================================

// Validate that a hash string is a safe CSS ID selector
function isSafeHash(hash) {
    return /^#[a-zA-Z][\w-]*$/.test(hash);
}

// Handle internal links (same page)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        if (!isSafeHash(targetId)) return;
        const targetEl = document.getElementById(targetId.slice(1));
        if (targetEl) {
            e.preventDefault();
            const y = targetEl.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    });
});

// Handle external links with hash (cross-page)
window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash && isSafeHash(hash)) {
        // meaningful delay to allow GSAP/layout to settle
        setTimeout(() => {
            const targetEl = document.getElementById(hash.slice(1));
            if (targetEl) {
                const y = targetEl.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }, 500);
    }
});

// ============================================
// LANGUAGE TOGGLE
// ============================================
const langToggle = document.getElementById('langToggle');
if (langToggle) {
    langToggle.addEventListener('click', () => {
        toggleLanguage();
    });
}

// Apply saved language on load (if English was previously selected)
if (currentLang !== 'fr') {
    setLanguage(currentLang);
}

// Cookie settings button (replaces inline onclick)
const cookieSettingsBtn = document.querySelector('[data-action="open-cookie-settings"]');
if (cookieSettingsBtn) {
    cookieSettingsBtn.addEventListener('click', () => {
        if (window.openCookieSettings) window.openCookieSettings();
    });
}
