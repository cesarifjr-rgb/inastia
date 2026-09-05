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
src/home.ts                Accueil FR/EN : gestion complète en trois volets
src/reviews.ts             Extraits Google statiques, sources et date de relevé
src/components.ts          Navigation, footer, FAQ et appels à contact
src/templates.ts           Documents, pages secondaires et formulaire
src/lib.ts                 Helpers d'URL, échappement et images
scripts/generate.ts        Génération HTML, sitemap et robots.txt
.generated/                HTML intermédiaires, non versionnés
src/client.ts              Navigation et comportements d'interface
src/art.ts                 Illustrations SVG/CSS et hospitalityArt(locale) FR/EN
src/motion.ts              GSAP, pause CSS et visibilité de l’illustration
src/contact.ts             Vérification anti-spam et états du formulaire
src/styles.css             Styles et tokens de la version sauvegardée
src/management.css         Composition de l’offre unique
src/management-art.ts      Illustration de maison et textes FR/EN
src/management-art.css     Scène SVG/CSS en volume et sélection des volets
src/management-art-client.ts Visibilité, pause et cycle de page de la scène
api/contact.js             Fonction Vercel : validation, Turnstile, Resend
scripts/render-share.ts    Carte sociale PNG depuis le SVG via Sharp
public/                    Images, polices locales, licences et PDF légal
```

Les templates TypeScript génèrent du HTML statique ; Vite 8 compile 24 documents vers `dist/` : 23 pages indexables (10 FR, 10 EN et trois pages légales FR) et une 404. Les anciennes routes `/pack-lancement-airbnb` et `/menage-airbnb-corse-du-sud`, ainsi que leurs équivalents `/en/`, sont redirigées de façon permanente vers la page de gestion complète dans la même langue. Elles ne sont plus générées ni listées dans le sitemap ; `scripts/generate.ts` retire uniquement leurs anciens HTML intermédiaires. `vercel.json` fait autorité pour les redirections ; Vite dev/preview les reproduit localement. Leur contrôle final reste à effectuer sur l’hébergement. Les trois pages légales restent en français ; les liens anglais le précisent. Les URL sans extension reposent sur `cleanUrls` dans `vercel.json`.

Ne pas modifier `.generated/` ou `dist/` directement. Les sources de contenu, les templates et les scripts de génération font autorité.

## Images et polices

Les variantes AVIF/WebP à 240, 480, 800 et 1200 pixels sont versionnées dans `public/images/`. Les originaux `villa_amichi.webp`, `villa_lova.webp` et `casa_verde.webp` restent à la racine. Après une modification d'original, exécuter manuellement :

```sh
npm run assets
```

Ce script régénère les variantes photographiques, les polices locales Space Grotesk/Manrope et leurs licences depuis les paquets Fontsource. Il ne tourne pas à chaque build. Conserver les licences de `public/fonts/`. L’image sociale est produite séparément par le script TypeScript décrit ci-dessous.

## Illustration d’accueil et image sociale

La palette claire sable, ciel et mer et l’illustration d’accueil sont conservées : porte-clés Inastia, clé et détails de soin devant une arche ciel/mer. L’accueil présente une seule offre de gestion complète, puis ses trois volets : annonce, voyageurs et maison. Les illustrations expliquent les composantes d’un même accompagnement ; elles ne proposent pas de services séparés. Une nouvelle scène SVG/CSS en volume complète le hero existant, avant l’équipe, le territoire, les maisons, le suivi, les avis, le premier échange et le contact. Les photographies des biens restent discrètes.

L’équipe est présentée collectivement, conformément au choix actuel de ne pas publier de prénoms. Le suivi d’une rotation décrit le processus annoncé ; il ne constitue pas un cas client ni un document de mission réelle. Les extraits Google de `src/reviews.ts` sont des avis de voyageurs conservés dans leur langue d’origine, avec auteur, date de séjour et lien source. La note globale porte sa date de relevé, le 5 septembre 2026. Ces contenus sont statiques : vérifier manuellement les sources avant de les actualiser ; ne pas les présenter comme une synchronisation Google ni comme des témoignages propriétaires.

La fonction `hospitalityArt(locale)` de `src/art.ts` génère le SVG intégré au HTML en français ou en anglais. Le site ne nécessite ni modèle 3D, ni WebGL, ni Blender. Les preuves des anciennes scènes restent hors dépôt.

Pour régénérer l’image sociale depuis la racine :

```sh
npx tsx scripts/render-share.ts
```

Ce script réutilise le SVG français, le compose avec le texte de la carte et produit `public/images/inastia-share.png` en 1200 × 630 avec Sharp. La génération est manuelle et ne fait pas partie du build Vercel.

`src/motion.ts` charge GSAP/ScrollTrigger pour les entrées et révélations. Les mouvements de la clé, du porte-clés et des vagues sont définis en CSS. Le bouton « Animations » permet la pause/reprise ; `prefers-reduced-motion` initialise la pause, avec reprise explicite possible. Un observateur de visibilité et les événements de page suspendent les mouvements de l’illustration hors écran, lorsque l’onglet est masqué et pendant une suspension BFCache. Ils reprennent selon l’état courant au retour. Sans JavaScript, le contenu HTML et le SVG restent disponibles. L’illustration est décorative et ne porte aucune information indispensable.

## Formulaire et configuration

`contactPath(locale, intent)` conserve le motif choisi dans l’URL de contact : `audit` ou `gestion`. L’interface propose également un échange général. Les anciennes valeurs `annonce` et `rotation` reviennent à ce choix neutre côté client ; l’API continue à accepter ces anciens payloads pour compatibilité, sans proposer d’offres partielles. Le formulaire présente ce motif dans un sélecteur modifiable ; l’audit adapte le titre, le bouton et le message de réussite. Le motif est transmis avec la demande. Le premier audit gratuit est restitué par appel ou par email, sans délai garanti ni promesse de rapport écrit. L’aide du projet reste visible pendant la saisie ; téléphone et projet restent facultatifs.

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

La demande actuelle est réalisée sur `codex/gestion-complete`, dans le worktree `C:/Users/Admin/Documents/inastia-gestion-complete`, à partir de la version sauvegardée `900c977`. L’utilisateur a demandé de rétablir ce style et de ne conserver que la gestion complète ; le responsable principal coordonne la publication après validation. Le projet précédent `C:/Users/Admin/Documents/inastia-design-frontier` reste distinct : ne pas y reprendre les règles Atlas pour cette version. Relire les modifications et vérifier la version avant intégration à `main`. L'intégration Git du projet Vercel `inastia` assure le déploiement ; conserver cette liaison et les domaines existants. Ne pas forcer de push.

Après chaque release, effectuer un contrôle production : domaines, accueil mobile/desktop, pages de services, liens FR/EN, contact, images, métadonnées et erreurs navigateur. Vérifier l'état du déploiement et les journaux serveur si nécessaire. Un envoi réel de formulaire doit être explicitement autorisé et identifié comme test.

Pour modifier le contenu, éditer `src/home.ts` et `src/content/pages.ts` en FR/EN ; les quatre sections de gestion détaillent annonce/calendrier, voyageurs, préparation/signalement et décisions/coûts. Modifier `management-art.ts` et son CSS pour la scène, sans réécrire le moteur de mouvement pour un simple changement de texte. Les frais, le linge et les prestations restent à convenir ; aucune inclusion automatique dans la commission. Les trois fragments juridiques conservent les clauses historiques, même si elles mentionnent plusieurs prestations.

La référence `900c977` et la sauvegarde vérifiée `C:/Users/Admin/Documents/Inastia-Sauvegardes/Inastia-2026-09-05_18-58-Cala-Lova.zip` permettent de retrouver l’ancien style et ses contenus. Préparer tout retour dans un dossier ou worktree séparé, comparer les changements et faire coordonner la réversion ou le redéploiement par le responsable principal ; aucun reset destructif ni force-push. Les mesures et preuves de baseline du dossier Frontier restent historiques : ne pas les réécrire comme résultats de cette version.

La direction graphique et ses tokens sont décrits dans [docs/design-system.md](docs/design-system.md).
