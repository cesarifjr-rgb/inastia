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
src/art.ts                 Illustrations SVG/CSS et repli statique du paysage côtier
src/motion.ts              Animations GSAP et commande pause/reprise
src/scene.ts               Pont DOM : visibilité, taille, pause et cycle de page
src/scene.worker.ts        Three.js / GLTF et rendu OffscreenCanvas en Web Worker
src/contact.ts             Vérification anti-spam et états du formulaire
src/styles.css             Styles et tokens
api/contact.js             Fonction Vercel : validation, Turnstile, Resend
public/                    Images, modèle GLB, polices locales, licences et PDF légal
```

Les templates TypeScript génèrent du HTML statique ; Vite 8 compile ensuite les 28 documents vers `dist/` (27 pages indexables et une 404). Les 14 URL françaises historiques sont conservées, avec une page contact supplémentaire et 12 équivalents anglais sous `/en/`. Les trois pages légales restent en français ; les liens anglais le précisent. Les URL sans extension reposent sur `cleanUrls` dans `vercel.json`.

Ne pas modifier `.generated/` ou `dist/` directement. Les sources de contenu, les templates et les scripts de génération font autorité.

## Images et polices

Les variantes AVIF/WebP à 240, 480, 800 et 1200 pixels sont versionnées dans `public/images/`. Les originaux `villa_amichi.webp`, `villa_lova.webp` et `casa_verde.webp` restent à la racine. Après une modification d'original, exécuter manuellement :

```sh
npm run assets
```

Ce script régénère les variantes photographiques, les polices locales Space Grotesk/Manrope et leurs licences depuis les paquets Fontsource. Il ne tourne pas à chaque build. Conserver les licences de `public/fonts/`. L’image sociale est produite séparément par Blender.

## Paysage côtier 3D et image sociale

La V3 conserve la structure de la V2 et utilise une palette claire sable, ciel et mer. Le hero présente un relief côtier illustré : soleil, horizon marin et dunes, sans bâtiment. Les photographies des biens restent discrètes. Le texte décrit une conciergerie familiale réelle, sans promesse technologique fictive.

La source reproductible du modèle est `scripts/create-coast.py`. Avec Blender disponible dans le PATH, depuis la racine :

```sh
blender --background --python scripts/create-coast.py
blender --background --python scripts/render-share.py
```

La première commande crée une scène neuve et exporte `public/models/inastia-coast.glb`, versionné. Elle enregistre aussi `inastia-coast.blend` et un rendu dans le dossier voisin `../inastia-v3-evidence/`, hors dépôt. La seconde ouvre ce fichier généré et produit `public/images/inastia-share.png` en 1200 × 630, ainsi que sa scène .blend dans le même dossier externe. Elle nécessite donc la première génération ; si Node est disponible, Sharp compacte ensuite le PNG. Ces commandes sont manuelles et ne font pas partie du build Vercel.

`src/motion.ts` charge GSAP/ScrollTrigger et initialise la scène optionnelle. `src/scene.ts` est un petit pont DOM ; le chargement du GLB, son analyse GLTF et le rendu Three.js sont exécutés dans `src/scene.worker.ts`, avec OffscreenCanvas. Le rendu mobile est limité à 30 images par seconde. Le bouton « Animations » permet la pause/reprise : la préférence système `prefers-reduced-motion` initialise la pause, mais l’utilisateur peut explicitement reprendre. La boucle s’arrête hors écran, lorsque l’onglet est masqué ou pendant une suspension en cache arrière/avant (BFCache), puis reprend selon l’état courant au retour. Si Worker, OffscreenCanvas ou WebGL manquent, ou si le chargement/rendu échoue, le SVG de repli conserve l’illustration. Sans JavaScript, le contenu HTML et le SVG restent disponibles. La 3D est décorative et ne porte aucune information indispensable.

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
