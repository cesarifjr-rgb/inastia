# Instructions du dépôt

## Périmètre

- Ce dépôt contient le site vitrine inastia.fr, distinct du Hub Inastia.
- Préserver le projet Vercel `inastia`, les domaines et l'intégration Git existants.
- Ne pas inventer de services, tarifs, résultats, avis ou membres de l'équipe.
- Les données métier sont sourcées dans le contenu existant ; signaler les contradictions.

## Architecture

- Node.js 24, TypeScript, génération HTML statique et Vite 8.
- Modifier les contenus dans `src/content/pages.ts` et les fragments juridiques dans `src/content/legal/`.
- Modifier les templates dans `src/home.ts`, `src/components.ts` et `src/templates.ts`.
- `scripts/generate.ts` écrit `.generated/`, le sitemap et robots.txt.
- Vite compile les documents générés vers `dist/`.
- Ne jamais corriger directement `.generated/` ou `dist/`.
- `src/client.ts` gère l'interface ; `src/contact.ts` gère le formulaire.
- `api/contact.js` est la fonction serveur Vercel utilisant Turnstile et Resend.
- `src/motion.ts` pilote GSAP/pause ; `src/scene.ts` est le pont DOM ; `src/scene.worker.ts` charge/rend le GLB via Three.js et OffscreenCanvas ; `src/art.ts` fournit le repli SVG.
- Les sources Blender sont `scripts/create-coast.py` et `scripts/render-share.py` ; le GLB est versionné, les .blend restent hors dépôt.

## Modifications

- Définir le résultat attendu et faire le changement le plus simple possible.
- Respecter le style existant ; éviter les refontes sans rapport avec la demande.
- Garder les 14 routes françaises historiques et leurs liens compatibles.
- Maintenir les pages FR/EN en parallèle, avec canonical et hreflang cohérents.
- Les trois pages légales sont françaises ; l'interface anglaise doit le préciser.
- Conserver les coordonnées, le lien médiateur et les informations légales sourcées.
- Utiliser les photos existantes sans changer leur identité ni leur localisation.
- Régénérer les assets avec `npm run assets` seulement si nécessaire.
- Conserver les licences des polices locales dans `public/fonts/`.
- Respecter le clavier, les focus visibles, les labels, reduced-motion et la pause des animations. La préférence système initialise la pause, avec reprise explicite possible. Préserver le repli SVG sans Worker/OffscreenCanvas/WebGL, la suspension hors écran/onglet masqué et la reprise BFCache.

## Vérification

- Installation reproductible : `npm ci`.
- Exécuter typecheck, lint, tests et build selon le périmètre du changement.
- `npm run dev` génère les pages puis démarre sur le port 3100.
- Relancer `npm run generate` après modification des templates/contenus.
- Les tests E2E nécessitent `npm run preview` actif sur le port 4100.
- `BASE_URL` permet les contrôles distants ; les mutations formulaire y sont ignorées.
- Les tests de formulaire locaux simulent Turnstile/Resend et ne doivent pas envoyer d'email.
- Distinguer vérifications automatiques, vérifications production et limitations constatées.

## Livraison et secrets

- Branche de refonte : `codex/inastia-redesign` ; autres branches de travail : `codex/…`.
- Relire le diff et les vérifications avant intégration à `main` ; aucun force-push.
- Ne versionner ni secrets, fichiers .env privés, artefacts de tests ni notes de travail.
- Garder les clés Resend/Turnstile côté serveur, sans les afficher dans les sorties.
- Après chaque release, contrôler le site production et l'état du déploiement Vercel.
- Tout envoi réel de message nécessite une autorisation explicite.
