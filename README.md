# Inastia

Site vitrine de la conciergerie familiale Inastia, sur la côte est de la Corse, de Ghisonaccia à Porto-Vecchio.

- Site : [inastia.fr](https://inastia.fr)
- Dépôt : [cesarifjr-rgb/inastia](https://github.com/cesarifjr-rgb/inastia)
- Hébergement : projet Vercel `inastia`, avec intégration Git existante.

## Développement

Node.js 24 et npm sont requis. Depuis la racine du dépôt :

```sh
npm ci
npm run dev
```

Le serveur démarre sur `http://127.0.0.1:3100`. La commande génère les pages avant de lancer Vite. Après modification d'un template ou d'un contenu TypeScript, relancer `npm run generate` pour actualiser les HTML ; le CSS et le JavaScript client bénéficient du rechargement Vite.

## Architecture

```text
src/content/pages.ts       Contenus des pages secondaires FR/EN
src/content/legal/         Fragments juridiques français
src/home.ts                Accueil FR/EN
src/components.ts          Navigation, footer, FAQ et appels à contact
src/templates.ts           Documents, pages secondaires et formulaire
src/lib.ts                 Helpers d'URL, échappement et images
scripts/generate.ts        Génération HTML, sitemap et robots.txt
.generated/                HTML intermédiaires, non versionnés
src/client.ts              Navigation et comportements d'interface
src/contact.ts             Vérification anti-spam et états du formulaire
src/styles.css             Styles et tokens
api/contact.js             Fonction Vercel : validation, Turnstile, Resend
public/                    Images optimisées, polices, licences, PDF légal
```

Les templates TypeScript génèrent du HTML statique ; Vite 8 compile ensuite les 28 documents vers `dist/` (27 pages indexables et une 404). Les 14 URL françaises historiques sont conservées, avec une page contact supplémentaire et 12 équivalents anglais sous `/en/`. Les trois pages légales restent en français ; les liens anglais le précisent. Les URL sans extension reposent sur `cleanUrls` dans `vercel.json`.

Ne pas modifier `.generated/` ou `dist/` directement. Les sources de contenu, les templates et les scripts de génération font autorité.

## Images et polices

Les variantes AVIF/WebP à 480, 800 et 1200 pixels sont versionnées dans `public/images/`. Les originaux `villa_amichi.webp`, `villa_lova.webp` et `casa_verde.webp` restent à la racine. Après une modification d'original, exécuter manuellement :

```sh
npm run assets
```

Ce script régénère les variantes, l'image sociale, les polices locales Cormorant Garamond/Manrope et leurs licences depuis les paquets Fontsource. Il n'est pas exécuté à chaque build. Conserver les licences de `public/fonts/`.

## Formulaire et configuration

`api/contact.js` vérifie les données et le jeton Cloudflare Turnstile avant d'envoyer via Resend à `contact@inastia.fr`, depuis `noreply@inastia.fr`. `src/contact.ts` charge Turnstile à l'interaction et gère chargement, erreur, expiration, succès et nouvel envoi.

Les variables serveur nécessaires sont `RESEND_API_KEY` et `TURNSTILE_SECRET_KEY` ; voir `.env.example`. Les configurer dans les environnements Vercel concernés. Ne jamais exposer les valeurs dans le code client, les logs ou Git. Le domaine d'expédition Resend et les domaines autorisés Turnstile doivent correspondre à l'environnement utilisé.

Vite dev/preview ne sert pas les fonctions Vercel. Les tests locaux du formulaire simulent les services ; ils ne prouvent pas la délivrabilité réelle. Ne pas ajouter de clé réelle pour faire fonctionner les tests simulés.

## Vérifications

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

Avec le preview actif sur `http://127.0.0.1:4100`, dans un autre terminal :

```sh
npm run test:e2e
```

Playwright utilise Chrome installé sur la machine. Les tests couvrent notamment les routes, liens, métadonnées, images, navigation, accessibilité et états simulés du formulaire. La configuration ne démarre pas le serveur automatiquement.

Pour contrôler un déploiement depuis PowerShell :

```powershell
$env:BASE_URL = 'https://inastia.fr'
npm run test:e2e
Remove-Item Env:BASE_URL
```

Sur une URL distante, les tests de mutation du formulaire sont ignorés. Aucun résultat de QA n'est présumé par cette documentation : exécuter les vérifications pour la révision à livrer et distinguer tests simulés et contrôles réels.

## Livraison

Travailler sur `codex/inastia-redesign` pour la refonte, puis utiliser une branche `codex/…` pour les évolutions suivantes. Relire les modifications et vérifier la version avant intégration à `main`. L'intégration Git du projet Vercel `inastia` assure le déploiement ; conserver cette liaison et les domaines existants. Ne pas forcer de push.

Après chaque release, effectuer un contrôle production : domaines, accueil mobile/desktop, pages de services, liens FR/EN, contact, images, métadonnées et erreurs navigateur. Vérifier l'état du déploiement et les journaux serveur si nécessaire. Un envoi réel de formulaire doit être explicitement autorisé et identifié comme test.

La direction graphique et ses tokens sont décrits dans [docs/design-system.md](docs/design-system.md).
