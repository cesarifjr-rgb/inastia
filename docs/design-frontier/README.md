# Livraison — Inastia / Design Frontier

Réalisation du 5 septembre 2026, branche `codex/design-frontier`, issue de `900c977`. La direction **Atlas de proximité** est intégrée au site statique existant, à ses 27 pages indexables et à sa 404. La réalisation web de référence est le commit `26d84a0` ; les commits documentaires suivants ne changent pas le site.

Préversion Vercel : [ouvrir le site](https://inastia-ozxqtakj4-inastia.vercel.app/), déploiement `dpl_EhQprVadbb696pBRfq1VFwhHArkb`, cible preview, état READY. L’accès est protégé par la connexion Vercel habituelle ; le lien d’accès temporaire fourni avec la livraison expire le 6 septembre. **La production reste à `900c977` : aucune mise en production ni fusion dans main n’a été effectuée pour cette mission.**

## Dossier A–H

| Livrable | Pièces à consulter |
| --- | --- |
| A — Diagnostic et référence | [Diagnostic priorisé](diagnostic.md), `baseline/content.md`, `baseline/technical.md`, inventaire des routes, 32 captures et rapports bruts dans le dossier de preuves. |
| B — Trois directions et décision | [Comparaison et choix](direction.md), prototypes autonomes A/B/C et notes dans `design/explorations/`, 12 captures premier écran/intérieur × desktop/mobile dans `explorations/`. Deux mécanismes d’entrée comparés dans `motion-prototypes/`. |
| C — Système et composants | [Système visuel](../design-system.md), [contrat de chaque effet](motion-spec.md), [sources géographiques](geography.md), composants réellement intégrés et sources listés ci-dessous. |
| D — Parcours et limites | [Revue du parcours propriétaire](user-review.md), [revue technique](technical-review.md), [responsive](responsive.md), état des fonctionnalités ci-dessous. |
| E — Avant/après | `compare.html` dans le dossier de preuves : huit mêmes routes, 1440 × 1000 et 390 × 844, premier écran et pleine page. 32 PNG avant + 32 après ; Chrome 152, DPR 1, préférence et attentes identiques. Baseline publique et résultat local : la comparaison visuelle n’est pas une mesure de temps réseau. |
| F — Tests et critique | Trois passes internes distinctes : [artistique](artistic-review.md), [utilisateur](user-review.md), [technique](technical-review.md). Tests durables dans `tests/`, rapports bruts dans `technical-final/`, `responsive/`, `portfolio/` et `user-review-final-playwright/`. |
| G — Performance | [Mesures et protocole](performance.md), rapports Lighthouse avant/après et profils des effets dans `baseline/` et `performance-final/`. Les objectifs terrain ne sont pas assimilés aux mesures de laboratoire. |
| H — Maintenance et retour | [Procédure de maintenance et restauration](maintenance.md), README et AGENTS du dépôt, source et diff versionnés. Sauvegarde de départ conservée hors dépôt. |

Le dossier de preuves local est `C:/Users/Admin/Documents/inastia-frontier-evidence`. L’archive livrée contient une copie portable des documents, des preuves et du code versionné ; ouvrir son fichier `LIRE-MOI.md` après extraction. Les rapports distinguent constat visuel, mesure, hypothèse de conception et limite de test. Aucun gain de conversion n’est revendiqué.

## Fonctionnalités intégrées et vérifiées

| Parcours | Implémenté et testé | Limite explicite |
| --- | --- | --- |
| Navigation et lecture | Menu mobile au clavier, inert, Échap/focus ; FR/EN, liens/ancres, no-JS, FAQ native, accès direct aux sections. | Pas de session avec lecteur d’écran ou propriétaire réel. |
| Offres et orientation | Résumés partagés, comparatif permanent, quatre besoins facultatifs, motif explicite, reset, besoin repris au contact sans données personnelles dans l’URL. | Orientation indicative ; aucune éligibilité, tarification ou recette calculée. |
| Territoire | Contour sourcé, cinq centres communaux documentés, liste de liens tactiles et clavier, composition mobile textuelle. | La carte ne garantit ni disponibilité ni périmètre commercial à une adresse. |
| Maisons et carnet | Trois photos authentiques, dialogue natif, liens de repli, historique Précédent/Suivant du navigateur, Échap, focus, média absent et clics répétés ; récit du soin explicitement explicatif. | Pas de réservation ; aucune intervention ou donnée client fictive. |
| Contact | États initial, aide, erreurs inline et résumé, correction, envoi en attente, prévention double envoi, échec/reprise, succès strictement confirmé et reset volontaire. Tests locaux avec fournisseurs interceptés ; validation serveur testée sans réseau réel. | Délivrabilité réelle et challenge sur appareil physique non testés. Sans JavaScript ou lorsque le service tiers est indisponible, téléphone/email restent accessibles ; aucun succès de démonstration présenté comme un vrai envoi. |
| Mouvement | Entrée courte, révélations sans texte masqué, arts originaux, pause/reprise, reduced-motion dynamique, suspension hors écran, BFCache et interruptions. | Masquage de document simulé ; pas de mesure batterie/GPU, de FPS certifié ou de métrique INP terrain. |
| Responsive | 80 vues sur huit routes, dix largeurs de 320 à 1920 px ; huit reflows 640 px supplémentaires. Long titre anglais et médias bloqués examinés. | Clavier virtuel et zoom natifs non testés : hauteur disponible et largeur CSS simulées, décrites sans les assimiler à des essais physiques. |

## Résultats exécutés

Le [smoke distant de la préversion](remote-review.md) confirme neuf routes HTTP 200 et les parcours menu/guide/contact. Après focus dans un champ vide, Turnstile affiche toutefois son état indisponible. Le callback **110200 — Domain not authorized** confirme que le domaine de cette préversion n’est pas autorisé par le widget Cloudflare : l’envoi réel y reste bloqué dans ces essais, et téléphone/email restent accessibles. Aucun formulaire n’a été rempli ou soumis. Le tableau de bord Cloudflare exige une connexion pour ajouter ce seul hôte de test ; la demande de connexion est le point restant. La clé et l’API de contact ont été préservées ; ce constat ne démontre pas un problème sur la production, qui reste inchangée.

- TypeScript, ESLint, build Vite : réussis. Dernier lint et dernier run Vitest à 20:17 heure de Paris : **71/71** tests dans trois fichiers.
- Chrome : **109 cas traités** (106 au premier passage, trois corrigés puis retestés avec succès), puis **44/44** contrôles complémentaires. Ce n’est pas un unique run intégral après toutes les corrections.
- Firefox et WebKit via HTTPS local : **16/16**. Les limites du premier essai HTTP local et sa résolution TLS sont conservées dans le rapport.
- Axe : **48 scans, aucune violation signalée** dans les pages et états examinés. Il ne s’agit pas d’une certification complète WCAG 2.2 AA.
- Graphe : 27 routes HTTP 200, titres distincts, un H1 par page, descriptions/canonical/OG, alternates FR/EN pertinents, aucun lien de page ou fragment interne manquant.
- Captures après : seize chargements, aucun débordement, média cassé, erreur console/runtime ou requête échouée observés.

Les contrôles locaux ne révèlent pas de blocage restant ; **la validation de l’envoi réel sur la préversion est bloquée par l’état Turnstile décrit ci-dessus**. Les essais avec appareils physiques, lecteur d’écran, propriétaires réels et livraison d’email restent **non testés** ; les Core Web Vitals terrain restent **non mesurés**. La production est une étape **non exécutée**, conformément à l’exigence d’autorisation explicite du brief. La préversion reste consultable et ses contacts directs restent utilisables.

## Sources et commandes

La liste exhaustive des fichiers modifiés est `fichiers-modifies.txt` dans l’archive. Principales sources : `src/home.ts`, `templates.ts`, `contact.ts`, `client.ts`, `content/services.ts`, `atlas.ts`, `orientation.ts`/`orientation-client.ts`, `portfolio.ts`/`portfolio-client.ts`, `motion.ts` et les quatre feuilles CSS. L’ancien `styles.css` est remplacé. `scripts/render-share.ts` et le PNG social sont actualisés ; les chunks GSAP et ScrollTrigger sont retirés du chargement et la dépendance GSAP est supprimée. `api/contact.js`, les contenus légaux, les avis, les photos originales et les 27 URL sont préservés.

Commandes de vérification depuis la racine, Node 24 :

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run preview -- --host 127.0.0.1 --port 4100 --strictPort
# Dans un autre terminal, serveur stabilisé :
npm run test:e2e
```

Les procédures ciblées, exigences de test local du contact et modalités de retour arrière sont détaillées dans [maintenance.md](maintenance.md). Les runs multi-moteurs HTTPS et mesures d’effets utilisent aussi des configurations et scripts conservés dans les preuves ; ne pas les confondre avec les commandes par défaut ci-dessus.
