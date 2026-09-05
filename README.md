# Inastia

Site vitrine de la conciergerie familiale Inastia, sur la côte est de la Corse, de Ghisonaccia à Porto-Vecchio.

- Site : [inastia.fr](https://inastia.fr)
- Dépôt : [cesarifjr-rgb/inastia](https://github.com/cesarifjr-rgb/inastia)
- Hébergement existant : projet Vercel `inastia`, domaines et intégration Git à conserver.
- Travail Design Frontier : branche isolée `codex/design-frontier`, référence de départ `900c977`.

## Développement

Node.js 24 et npm sont requis. Depuis la racine :

```sh
npm ci
npm run dev
```

Vite écoute sur `http://127.0.0.1:3100`. Après une modification de contenu ou de template TypeScript, exécuter `npm run generate` ; les styles et scripts client bénéficient du rechargement Vite. Ne pas éditer `.generated/` ou `dist/` : ces dossiers sont produits depuis les sources.

## Architecture

| Source | Responsabilité |
|---|---|
| `src/content/pages.ts` / `src/content/legal/` | Pages secondaires FR/EN et fragments légaux français |
| `src/content/services.ts` | `servicesFor(locale)`, résumés communs des trois accompagnements |
| `src/home.ts`, `src/components.ts`, `src/templates.ts` | Composition de l’accueil, éléments partagés et documents |
| `src/atlas.ts` | Atlas d’accueil et de territoire ; données et licences dans [geography.md](docs/design-frontier/geography.md) |
| `src/orientation.ts`, `src/orientation-client.ts` | Guide facultatif à quatre radios et recommandations explicites |
| `src/portfolio.ts`, `src/portfolio-client.ts` | Trois photographies réelles ; dialogue natif et état de navigation par fragment |
| `src/reviews.ts` | Extraits voyageurs statiques, sources et date du relevé Google |
| `src/base.css` | Reset, polices et règles communes |
| `src/frontier.css` | Tokens et compositions de la direction Atlas de proximité |
| `src/art.ts`, `src/service-art.css` | Trois illustrations de services d’origine et leur style ; ancien `hospitalityArt` conservé provisoirement mais hors hero courant |
| `src/motion.ts`, `src/motion.css` | Mouvement natif CSS et IntersectionObserver, pause, visibilité et cycle de page ; aucune bibliothèque GSAP |
| `src/client.ts`, `src/contact.ts` | Initialisation, navigation et validation du formulaire avec erreurs associées aux champs |
| `src/lib.ts` | URL, échappement et images |
| `scripts/generate.ts` | HTML, sitemap et robots.txt |
| `scripts/assets.ts`, `scripts/render-share.ts` | Variantes photos/polices et image sociale |
| `api/contact.js` | Fonction Vercel : validation, Turnstile et Resend |

Vite compile 28 documents : **27 pages indexables et une 404**. Les routes historiques sont conservées, avec 12 pages en anglais sous `/en/`. Les trois pages légales restent françaises et les liens anglais l’indiquent. Canonical et hreflang sont générés avec les pages ; `cleanUrls` dans `vercel.json` permet les URL sans extension.

## Contenu, images et interactions

La direction actuelle associe un atlas local, des comparatifs ouverts et une typographie éditoriale. L’équipe reste présentée collectivement. Les communes servent de repères, sans polygone de disponibilité : l’adresse du bien confirme les prestations possibles. Le guide est optionnel ; le comparatif reste complet sans JavaScript. La galerie utilise `showModal()` lorsqu’il est disponible, avec fermeture clavier, retour du focus et synchronisation historique ; sans JavaScript, les liens ouvrent les photographies.

Les originaux `villa_amichi.webp`, `casa_verde.webp`, `villa_lova.webp` restent à la racine. Le dernier représente **Cala Lova**, à Cala d’Oro / Solenzara ; l’identifiant interne ne change pas son nom affiché. Après modification autorisée d’un original :

```sh
npm run assets
```

Le script produit les variantes AVIF/WebP 240, 480, 800 et 1200 px et copie les polices locales Space Grotesk/Manrope et leurs licences dans `public/fonts/`. Il ne tourne pas à chaque build. Pour la carte sociale Atlas 1200 × 630, générée manuellement avec Sharp :

```sh
npx tsx scripts/render-share.ts
```

La carte sociale reprend le contour cartographique sourcé, pas l’ancien SVG `hospitalityArt`. Conserver les sources/licences cartographiques et vérifier l’image produite. Cette génération est séparée du build.

Les avis de `src/reviews.ts` sont des extraits de **voyageurs**, dans leur langue d’origine, avec auteur et lien source. La note globale est un relevé statique du 5 septembre 2026. Toute actualisation nécessite une vérification manuelle ; aucune synchronisation Google n’est revendiquée. Les étapes de soin décrivent le processus annoncé, pas une mission client réelle.

## Contact et secrets

`contactPath(locale, intent)` transmet uniquement un besoin public : `audit`, `gestion`, `annonce` ou `rotation`. Le sélecteur reste modifiable. Ne placer aucune coordonnée personnelle dans une URL, un fragment ou le stockage navigateur. Téléphone et projet sont facultatifs ; les erreurs sont reliées aux champs et le résumé permet d’y revenir au clavier.

Le premier audit est gratuit, qualitatif et restitué par appel ou email, sans prévision de revenus ni délai garanti. `api/contact.js` vérifie les données et le jeton Turnstile avant l’envoi Resend à `contact@inastia.fr`, depuis `noreply@inastia.fr`.

Variables serveur : `RESEND_API_KEY` et `TURNSTILE_SECRET_KEY` (voir `.env.example`). Ne jamais afficher ni versionner leurs valeurs. Garder les domaines Resend/Turnstile adaptés à l’environnement. Vite dev/preview ne sert pas les fonctions Vercel : les tests locaux utilisent des simulations et ne prouvent pas la délivrabilité. Aucune clé réelle n’est nécessaire pour ces simulations.

## Vérification et livraison

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run preview -- --host 127.0.0.1 --port 4100 --strictPort
```

Dans un autre terminal, après le build et avec la prévisualisation stable :

```sh
npm run test:e2e
```

Playwright utilise Chrome installé et ne démarre pas le serveur. Ne pas régénérer les pages ou reconstruire pendant une passe navigateur. Les scénarios locaux du formulaire interceptent les services ; les suites de mutation du formulaire sont ignorées sur une `BASE_URL` distante. Un contrôle distant ne constitue jamais une autorisation d’envoi réel.

La prévisualisation est autorisée dans cette mission ; **la publication en production ne l’est pas encore**. Ne pas fusionner vers `main`, promouvoir ou redéployer implicitement : l’intégration Git peut déclencher une publication. Conserver le projet Vercel et les domaines, ne pas forcer de push. Le responsable principal coordonne toute livraison ou retour en production après autorisation explicite.

Voir [maintenance et retour arrière](docs/design-frontier/maintenance.md), [design system](docs/design-system.md), [direction](docs/design-frontier/direction.md) et [revue interne du parcours](docs/design-frontier/user-review.md). Les rapports distinguent contrôles terminés et vérifications encore en cours ; leur présence ne vaut pas validation finale de la révision à publier.
