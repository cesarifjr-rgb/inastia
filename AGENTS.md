# Instructions du dépôt

## Périmètre et vérité métier

- Site vitrine inastia.fr, distinct du Hub Inastia. Préserver le projet Vercel `inastia`, ses domaines et son intégration Git.
- Ne pas inventer services, tarifs, résultats, avis, membres de l’équipe ni données d’intervention. Signaler les contradictions avec les contenus sourcés.
- Équipe collective ; photos réelles et localisations conservées. `villa_lova` désigne le bien affiché **Cala Lova**.
- Avis de voyageurs statiques dans leur langue originale, avec sources et date du relevé. Aucun témoignage propriétaire déduit des avis voyageurs.
- Audit gratuit qualitatif par appel/email, sans prévision de revenus ni délai promis. L’adresse confirme les prestations possibles ; l’atlas ne définit pas une desserte garantie.

## Architecture

- Node.js 24, TypeScript, HTML statique et Vite 8. `scripts/generate.ts` produit `.generated/`, sitemap et robots.txt ; Vite produit `dist/`. Ne pas corriger ces sorties directement.
- Contenus détaillés dans `src/content/pages.ts`, légaux dans `src/content/legal/`, résumés d’offres partagés via `servicesFor(locale)` dans `src/content/services.ts`.
- Templates dans `src/home.ts`, `src/components.ts`, `src/templates.ts`. Préserver 27 pages indexables et la 404 ; trois pages légales françaises, signalées comme telles dans l’interface anglaise.
- Styles chargés par `src/client.ts` : `base.css` (reset et commun), `service-art.css` (trois illustrations d’origine), `frontier.css` (tokens/composition), `motion.css` (mouvement). L’ancien `styles.css` a été supprimé.
- `src/art.ts` contient les trois `serviceArt(index)` ; l’ancien `hospitalityArt` est conservé provisoirement hors hero courant. `src/atlas.ts` fournit le hero et le territoire. Sources et licences : `docs/design-frontier/geography.md`.
- `src/motion.ts` utilise CSS et IntersectionObserver natifs, sans GSAP. Préserver pause/reprise, reduced-motion, suspension hors écran/onglet masqué et reprise après `pageshow`.
- `src/orientation.ts` / `orientation-client.ts` : quatre radios facultatives, motifs explicites, comparatif accessible sans JavaScript, aucune inférence de prix ou d’éligibilité.
- `src/portfolio.ts` / `portfolio-client.ts` : `dialog.showModal()`, liens photographiques de repli, focus et historique `#maison-*`. Ne pas casser le retour navigateur ni convertir les photos en réservation.
- `src/contact.ts` : validation et erreurs reliées aux champs. `api/contact.js` : vérification serveur Turnstile et envoi Resend.
- `npx tsx scripts/render-share.ts` génère le PNG social Atlas 1200 × 630 avec Sharp et le contour sourcé. Pas de Blender, WebGL ou ancien hero nécessaire.

## Modifications

- Définir le résultat attendu et effectuer le changement le plus simple ; aucune refonte sans rapport avec la demande.
- Maintenir FR/EN, canonical, hreflang, liens historiques, coordonnées et lien médiateur.
- Modifier les responsabilités/coûts communs dans `servicesFor` ; synchroniser les détails et le guide seulement si le sens métier change. Un simple changement éditorial ne justifie pas de réécrire le moteur de mouvement.
- Conserver les correspondances offre/illustration/intent lors d’un changement d’ordre ; voir `docs/design-frontier/maintenance.md`.
- Régénérer les photos/polices par `npm run assets` seulement si nécessaire ; préserver licences et noms réels.
- Garder focus visibles, labels, cibles tactiles et contenu lisible sans JavaScript. La préférence système initialise la pause ; une reprise explicite reste possible.
- Ne mettre aucune donnée personnelle du contact dans une URL, le stockage navigateur, les artefacts de démonstration ou Git.

## Vérification

- `npm ci`, puis typecheck, lint, tests et build selon le périmètre. `npm run dev` écoute sur 3100 ; relancer `npm run generate` après modification de contenu/template.
- E2E : build terminé puis `npm run preview -- --host 127.0.0.1 --port 4100 --strictPort`, et `npm run test:e2e` dans un autre terminal. Aucun rebuild concurrent aux contrôles navigateur.
- `BASE_URL` permet les contrôles distants ; les suites de mutation du formulaire y sont ignorées. Les simulations locales Turnstile/Resend ne doivent pas envoyer d’email et ne prouvent pas la délivrabilité.
- Rapporter les contrôles effectivement exécutés et leurs limites. La revue interne n’est pas un test avec de vrais utilisateurs.

## Livraison et secrets

- Mission actuelle isolée sur `codex/design-frontier`, départ `900c977`. Sauvegarde vérifiée et retour arrière décrits dans `docs/design-frontier/maintenance.md`.
- Prévisualisation autorisée ; aucune publication production actuellement autorisée. L’agent principal coordonne intégration, promotion ou retour en production après autorisation explicite.
- Relire diff et vérifications avant livraison ; aucun force-push ni reset destructif comme procédure de retour arrière.
- Ne versionner ni secrets, `.env` privés ni artefacts de tests. `RESEND_API_KEY` et `TURNSTILE_SECRET_KEY` restent serveur et ne sont jamais affichés.
- Tout envoi réel de message nécessite une autorisation explicite. Après une release autorisée, contrôler production et état du déploiement.
