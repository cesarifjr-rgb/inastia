# Instructions du dépôt

## Périmètre

- Ce dépôt contient le site vitrine inastia.fr, distinct du Hub Inastia.
- Préserver le projet Vercel `inastia`, les domaines et l'intégration Git existants.
- Ne pas inventer de services, tarifs, résultats, avis ou membres de l'équipe.
- Les données métier sont sourcées dans le contenu existant ; signaler les contradictions.
- La demande du 6 septembre 2026 confirme une gestion de A à Z et une assistance voyageurs 24 h/24, 7 j/7. Détailler les sept domaines : annonces/diffusion, réservations/voyageurs, ménage/linge/consommables, tarification/calendrier, arrivées/départs/clés, assistance/maintenance, cautions/dommages. La gestion à 100 % ne signifie pas tous frais compris ; ne pas en déduire un délai d’intervention physique ni une assurance dommages propre à Inastia.

## Architecture

- Node.js 24, TypeScript, génération HTML statique et Vite 8.
- Modifier les contenus dans `src/content/pages.ts` et les fragments juridiques dans `src/content/legal/`.
- Modifier les templates dans `src/home.ts`, `src/components.ts` et `src/templates.ts`. La gestion complète reste l’offre principale ; annonce, voyageurs et maison en sont les volets. La demande du 12 septembre 2026 autorise aussi l’offre d’intendance de résidence secondaire, ses tarifs et sa publication. `src/content/intendance.ts`, `src/intendance.ts` et `src/intendance.css` portent ses formules, contenus FR/EN et présentation. L’audit gratuit reste une première étape.
- `src/management.css` adapte la composition. `management-art.ts`, `management-art.css` et `management-art-client.ts` portent la scène de conciergerie, ses textes FR/EN et sa suspension selon visibilité/pause. La scène représente une concierge remettant une clé dorée à deux parents et leurs deux enfants devant une grande villa imaginaire avec piscine, avec trois repères SVG discrets. `scripts/render-key-handover.ts` génère les variantes AVIF/WebP de l’illustration source ; conserver son ratio, les cinq personnages dans le cadrage mobile et la remise de clé lisible. Les sept petites illustrations restent dans `service-detail-art.ts`. Conserver le hero `hospitalityArt` et le style sauvegardé.
- `scripts/generate.ts` écrit `.generated/`, le sitemap et robots.txt.
- Vite compile les documents générés vers `dist/`.
- Ne jamais corriger directement `.generated/` ou `dist/`.
- `src/client.ts` gère l'interface ; `src/contact.ts` gère le formulaire.
- `src/analytics.ts` et `lib/journey.js` portent la mesure consentie du parcours CTA. Préserver les catégories autorisées, la validité de 30 minutes, l'indépendance Analytics/Ads et l'attribution initiale des opportunités Attio. Ne jamais envoyer de texte du formulaire ou d'identifiant CRM à GA4. Voir `docs/journey-measurement.md`.
- `src/pricing.ts`, `src/pricing-client.ts` et `src/pricing.css` présentent le tarif confirmé de 20 % TTC des nuitées avant frais de plateforme, hors ménage, linge et taxe de séjour. Le calculateur est arithmétique, sans prévision locative ; garder les opérations en centimes et points de base entiers et les versions FR/EN.
- `api/contact.js` est la fonction serveur Vercel utilisant Turnstile et Resend.
- `src/art.ts` fournit `hospitalityArt(locale)`, illustration SVG FR/EN intégrée au HTML ; `src/motion.ts` pilote GSAP, la pause CSS et la visibilité de l’illustration.
- `npx tsx scripts/render-share.ts` génère la carte sociale PNG depuis le SVG avec Sharp. Le site ne nécessite pas de Blender ni de rendu 3D.

## Modifications

- Définir le résultat attendu et faire le changement le plus simple possible.
- Respecter le style existant ; éviter les refontes sans rapport avec la demande.
- Conserver 29 pages indexables (13 FR, 13 EN, trois légales FR) et la 404. La page `premiere-mise-en-location-corse` accompagne les propriétaires débutants dans la gestion complète ; ses contenus, présentation et checklist sont dans les fichiers `first-rental`. Préserver les quatre anciennes URLs annonce/rotation par les redirections de `vercel.json`, sans réintroduire leurs pages commerciales.
- Maintenir les pages FR/EN en parallèle, avec canonical et hreflang cohérents.
- Les trois pages légales sont françaises ; l'interface anglaise doit le préciser.
- Conserver les coordonnées, le lien médiateur et les informations légales sourcées. Ne pas supprimer les clauses contractuelles historiques des trois fragments légaux.
- Depuis la correction autorisée du 19 septembre 2026, le formulaire distingue audit gratuit, gestion complète et intendance. Chaque intention est conservée dans les liens FR/EN, le formulaire, la confirmation et le dossier commercial. L’audit reste exploratoire et ne constitue pas une décision de déléguer. L’intendance conserve aussi sa formule. Le secteur précis reste obligatoire côté client et API pour ces trois intentions. Depuis la simplification du 20 septembre 2026, le rôle, l’échéance et la situation locative sont facultatifs pour la gestion complète ; le bloc projet est replié et les informations manquantes ne doivent pas être inventées dans le CRM. Le rôle et l’échéance restent obligatoires pour audit et intendance, la situation locative pour audit. Le formulaire regroupe logement, projet et coordonnées. Les réponses « Projet encore en réflexion » et « À définir ensemble » sont valides. Les anciens liens annonce et rotation ouvrent la gestion complète ; leurs intents restent acceptés par l’API pour compatibilité.
- Depuis la demande du 20 septembre 2026, les CTA de gestion utilisent « Parlons de votre logement » et `intent=gestion`. Le parcours de contact gestion distingue le titre de page « Parlons de votre projet de gestion », le titre du formulaire « Présentez-nous votre logement » et le bouton d’envoi « Envoyer ma demande », avec leurs équivalents anglais. Ceux de la page audit utilisent « Demander mon audit gratuit » et `intent=audit`, y compris le menu ; ceux d’intendance ouvrent `intent=intendance`. Les prestations complémentaires restent réservées aux biens suivis dans l’une des deux offres. L’audit annonce un rappel sous 24 h selon la convenance du propriétaire, pas la livraison de l’analyse dans ce délai. Le téléphone est obligatoire pour l’audit, une réponse demandée par téléphone ou les appels commerciaux, côté client et API ; il est masqué et exclu du payload dans les autres cas. Pour l’audit, le choix redondant du canal est masqué. La préférence de réponse email/téléphone ne vaut pas consentement commercial. Le nom de famille est obligatoire côté formulaire et API ; le message reste facultatif et peut préciser les disponibilités. Les choix commerciaux email/téléphone sont séparés, facultatifs, non précochés et indépendants du traitement de la demande ; l’accord téléphone dure au maximum un an. Un audit confirmé peut produire `generate_lead` avec `service=audit` après consentement Analytics, mais pas une conversion Ads de gestion ou d’intendance.
- Utiliser les photos existantes sans changer leur identité ni leur localisation.
- L’accueil présente les services dans un seul bloc illustré, puis les honoraires immédiatement après. Le tarif de 20 % TTC et l’accès aux honoraires figurent dès le hero ; le détail opérationnel des sept prestations reste sur la page de gestion. Ne pas réintroduire les anciennes cartes, la seconde liste de prestations ni le bloc répétitif de préparation entre séjours.
- Régénérer les assets avec `npm run assets` seulement si nécessaire.
- Conserver les licences des polices locales dans `public/fonts/`.
- Respecter le clavier, les focus visibles, les labels, reduced-motion et la pause des animations. La préférence système initialise la pause, avec reprise explicite possible. Préserver le SVG visible sans JavaScript, la suspension de ses mouvements hors écran/onglet masqué et la reprise BFCache.

## Vérification

- Installation reproductible : `npm ci`.
- Exécuter typecheck, lint, tests et build selon le périmètre du changement.
- `npm run dev` génère les pages puis démarre sur le port 3100.
- Relancer `npm run generate` après modification des templates/contenus.
- Après le build, les tests E2E démarrent le preview sur le port 4100 si `BASE_URL` n'est pas défini. En local, un preview existant peut être réutilisé ; en CI le serveur est toujours démarré par Playwright.
- `BASE_URL` permet les contrôles distants ; les mutations formulaire y sont ignorées.
- Les tests de formulaire locaux simulent Turnstile/Resend et ne doivent pas envoyer d'email.
- Distinguer vérifications automatiques, vérifications production et limitations constatées.

## Livraison et secrets

- Les corrections de l'audit du 6 septembre 2026 sont sur `codex/audit-recommendations`. Exécuter aussi les tests navigateur avant intégration ; Vercel attend le check GitHub `build-and-test` avant la promotion de production. Les cas clients et informations internes manquants ne doivent pas être remplacés par des exemples présentés comme réels.

- Les compléments de l’audit sont sur `codex/contact-consent`, fondée sur `17d981b`, dans `C:/Users/Admin/Documents/inastia-gestion-complete` : choix commerciaux, messagerie OVH, encaissement direct des loyers par les propriétaires et vérification fournisseurs. Préserver les preuves sans versionner de données client.
- La révision antérieure `codex/inspiration-motion`, fondée sur `c4a1e39`, inspire les textes et visuels des références HostnFly et WeHost, avec des créations propres à Inastia et le style sauvegardé conservé ; le responsable principal publie après validation. Le projet Atlas précédent reste séparé.
- Pour retrouver la baseline, consulter `900c977` ou la sauvegarde indiquée dans README, dans un emplacement séparé. Ne pas écraser le travail courant ni utiliser un reset destructif. Conserver les mesures historiques de baseline avec leur date et leur version.
- Relire le diff et les vérifications avant intégration à `main` ; aucun force-push.
- Ne versionner ni secrets, fichiers .env privés, artefacts de tests ni notes de travail.
- Les compléments tarifs et conservation sont sur `codex/pricing-contract-crm`, fondée sur `09bc246`. Le projet de contrat Word, la convention CM2C, les recherches CRM et les contrôles de la base Hub restent hors du dépôt. L’attestation CM2C nominative, vérifiée et autorisée à la publication le 6 septembre 2026, est dans `public/attestation-cm2c-inastia.pdf`, avec une échéance au 13 février 2029. Ne pas publier de carte professionnelle, assurance, adhésion ou prestation supplémentaire non confirmée.
- Garder les clés Resend/Turnstile côté serveur, sans les afficher dans les sorties.
- Après chaque release, contrôler le site production et l'état du déploiement Vercel.
- Tout envoi réel de message nécessite une autorisation explicite.
