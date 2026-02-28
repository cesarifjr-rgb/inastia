# 🏡 Inastia — Conciergerie Premium en Corse

Site vitrine de la conciergerie de locations saisonnières Inastia, basée en Corse-du-Sud.

**Live :** [inastia.fr](https://inastia.fr)

## Stack Technique

| Couche | Technologie |
|--------|-------------|
| Frontend | HTML5, Vanilla CSS, JavaScript ES2020 |
| Animations | [GSAP](https://gsap.com/) + ScrollTrigger |
| Bundler | [Vite](https://vitejs.dev/) 6.x |
| Hosting | [Vercel](https://vercel.com/) (Edge Network) |
| API | Vercel Serverless Functions (Node.js) |
| Email | [Resend](https://resend.com/) |
| Anti-spam | [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) |
| i18n | Custom (FR/EN) |

## Structure des Fichiers

```
├── index.html              # Page d'accueil
├── about.html              # À propos
├── mentions-legales.html   # Mentions légales
├── privacy.html            # Politique de confidentialité
├── cgv.html                # Conditions Générales de Vente
├── main.js                 # Logique principale (GSAP, wizard form, dark mode)
├── style.css               # Design system complet
├── cookie-consent.js       # GDPR Consent Management Platform
├── i18n.js                 # Traductions FR/EN
├── api/
│   └── contact.js          # Serverless function (Turnstile + Resend)
├── public/
│   ├── robots.txt
│   └── .well-known/
│       └── security.txt
├── vercel.json             # Config Vercel (headers, CSP, rewrites)
├── vite.config.js          # Config Vite (multi-page, esbuild)
└── package.json
```

## Setup Local

```bash
# 1. Cloner le repo
git clone <repo-url>
cd Code_Source_Officiel

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Remplir RESEND_API_KEY et TURNSTILE_SECRET_KEY

# 4. Lancer le serveur de développement
npm run dev
# → http://localhost:3000
```

## Déploiement

Push sur `main` → deploy automatique via Vercel.

```bash
git add .
git commit -m "feat: description"
git push origin main
```

## Sécurité

- **CSP** complet avec whitelisting strict
- **HSTS** preload + Strict-Transport-Security
- **Turnstile** CAPTCHA sur le formulaire de contact
- **Sanitization** HTML sur toutes les entrées utilisateur
- **Security headers** : X-Frame-Options DENY, COOP, Referrer-Policy
- **security.txt** : `/.well-known/security.txt`

## Variables d'Environnement

| Variable | Description | Où l'obtenir |
|----------|-------------|--------------|
| `RESEND_API_KEY` | Clé API Resend pour l'envoi d'emails | [resend.com/api-keys](https://resend.com/api-keys) |
| `TURNSTILE_SECRET_KEY` | Clé secrète Cloudflare Turnstile | [dash.cloudflare.com](https://dash.cloudflare.com) |

## License

Propriétaire — Inastia SAS © 2026
