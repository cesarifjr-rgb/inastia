# Maintenance Design Frontier

Cette procédure accompagne la branche isolée `codex/design-frontier`, issue de `900c977`. La prévisualisation locale est autorisée ; **aucune publication en production n’est autorisée à ce stade**. Les rapports de cette mission sont des preuves de contrôles précis, pas une approbation implicite de mise en ligne.

## Modifier à la source

| Changement | Source principale | Vérification ciblée |
|---|---|---|
| Texte accueil / éléments communs | `src/home.ts`, `src/components.ts` | FR/EN, liens et rendu mobile |
| Contenu détaillé d’une page | `src/content/pages.ts` | Résumé, sections, FAQ, titre et métadonnées |
| Responsabilités et cadre du coût | `src/content/services.ts` via `servicesFor(locale)` | Même sens sur accueil et page d’offre ; guide cohérent |
| Guide de choix | `src/orientation.ts`, `src/orientation-client.ts` | Quatre choix, motifs, reset, clavier, intentions et repli sans JavaScript |
| Biens photographiés | `src/portfolio.ts`, correspondances photo/légende dans `src/content/pages.ts` et `src/templates.ts` | Identité réelle, localisation, texte alternatif et dialogue |
| Avis | `src/reviews.ts` | Source, citation originale, attribution voyageurs, date du relevé |
| Territoire / carte | `src/atlas.ts`, SVG et `docs/design-frontier/geography.md` | Source, projection, licence, commune versus lieu-dit |
| Style | `src/frontier.css`, `src/base.css` ou `src/service-art.css` selon le composant | 390/1440, focus, lisibilité et repli statique |

Après une modification de contenu ou de template, `npm run generate` actualise le HTML intermédiaire. Ne pas corriger les sorties `.generated/` ou `dist/` à la main. Un changement de texte, photo ou ordre éditorial ne nécessite pas de réécrire `motion.ts` : garder les attributs/classes de ses composants et vérifier les états existants.

### Offres et ordre

`servicesFor(locale)` conserve titre, public, tâches confiées, tâches gardées, coût, slug, intent et index d’illustration. Les détails des offres restent dans `pages.ts` et les explications du guide dans `orientation.ts` : une modification métier doit être relue dans les trois endroits, en français et en anglais.

L’accueil et les pages secondaires appellent tous deux `serviceArt(service.index)` : l’identité de l’illustration reste stable lorsque les objets de `servicesFor(locale)` changent de position. Pour réordonner les offres, déplacer les objets en conservant leur `index`, leur `slug` et leur `intent`, puis vérifier les trois pages et les quatre résultats du guide. Les intents restent `gestion`, `annonce`, `rotation`, `audit` ; ils ne dépendent pas de la position du tableau. Un changement d’ordre seul ne demande aucune modification du moteur de mouvement.

### Photographies et image sociale

Les originaux racine sont `villa_amichi.webp`, `casa_verde.webp` et `villa_lova.webp`. Ce dernier garde son identifiant mais s’affiche **Cala Lova**, Cala d’Oro / Solenzara. Ne substituer ni photo synthétique ni nouvelle localisation. Après remplacement autorisé d’un original :

```sh
npm run assets
```

Le script produit les variantes 240, 480, 800 et 1200 px et les ressources typographiques/licences. Vérifier miniatures, image agrandie, textes alternatifs et pages secondaires ; ne pas supprimer les licences. Les dimensions/cadrages affichés doivent correspondre aux images réelles.

La carte sociale est distincte :

```sh
npx tsx scripts/render-share.ts
```

Vérifier le PNG `public/images/inastia-share.png` à 1200 × 630 et le texte lisible. L’atlas reprend le contour Natural Earth avec les sources/licences documentées ; aucun ancien décor `hospitalityArt` ne doit être nécessaire. La génération est manuelle et séparée du build.

### Données factuelles

L’équipe reste collective. Les étapes de soin sont une explication de processus ; aucune donnée terrain de mission ou rapport client réel n’a été fournie. Ne pas ajouter de faux cas, métriques ou propriétaires fictifs. Les avis Google sont des extraits voyageurs, dans leur langue originale, avec un relevé global daté du 5 septembre 2026. Un nouveau chiffre doit provenir d’une nouvelle vérification explicite ; ne pas transformer la date de build en date de relevé.

Les repères géographiques sont des centres communaux, pas des points de lieux-dits ni une frontière de desserte. Conserver la phrase qui conditionne les prestations à l’adresse. Les trois pages légales restent françaises : ne pas en inventer une traduction pour obtenir une symétrie de routes.

## Vérifier une révision

Depuis la racine, avec Node.js 24 :

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run preview -- --host 127.0.0.1 --port 4100 --strictPort
```

Dans un second terminal :

```sh
npm run test:e2e
```

Chrome doit être installé. Le serveur n’est pas lancé par Playwright. Le maintenir sur un build stable pendant les tests ; coordonner les agents pour éviter tout rebuild concurrent. Pour une vérification limitée au guide :

```sh
npm run test -- tests/orientation.test.ts
npx playwright test tests/orientation-frontier.spec.ts
```

Les suites `contact-frontier.spec.ts` et `forms.spec.ts` restreignent leurs mutations au serveur local et interceptent Turnstile/Resend. Les tests locaux ne prouvent pas la livraison d’un email et ne nécessitent pas de secrets réels. Sur un déploiement autorisé à être inspecté, PowerShell permet de choisir la cible :

```powershell
$env:BASE_URL = 'https://inastia.fr'
npm run test:e2e
Remove-Item Env:BASE_URL
```

Les suites de mutation formulaire sont ignorées à distance. Garder cette protection et ne jamais déduire une autorisation d’envoi réel de l’autorisation de consulter un site. Ne pas enregistrer d’informations personnelles dans les URL, les fragments, le stockage navigateur ou les preuves de test. Les seules variables serveur requises sont `RESEND_API_KEY` et `TURNSTILE_SECRET_KEY` ; ne pas afficher leurs valeurs.

La vérification de livraison doit identifier la révision et la cible testées, les résultats effectifs et les limites. Contrôler les 27 pages indexables et la 404, FR/EN, métadonnées, navigation, état des interactions, rendu et erreurs navigateur. Voir [revue interne du parcours](user-review.md), [direction](direction.md) et [sources géographiques](geography.md). Les autres passes de validation peuvent encore être en cours ; ne pas convertir un résultat intermédiaire en validation globale.

## Sauvegarde et retour arrière

La mission part de `900c977` sur `codex/design-frontier`. La sauvegarde vérifiée est :

`C:/Users/Admin/Documents/Inastia-Sauvegardes/Inastia-2026-09-05_18-58-Cala-Lova.zip`

Cette archive est un filet de sécurité local ; son existence n’autorise ni écrasement du travail courant ni publication. Pour préparer un retour, commencer par conserver le diff et identifier la dernière révision validée. Examiner la sauvegarde dans un dossier séparé ou ouvrir un worktree sur la référence voulue, puis comparer les fichiers. Ne pas lancer `reset --hard`, un écrasement global ou un force-push comme procédure de restauration.

En cas de retour en production, l’agent principal présente d’abord la révision cible et les changements à annuler. Après autorisation explicite de production, il peut coordonner des commits de réversion ciblés ou le redéploiement d’une version validée, en conservant le projet Vercel, les domaines et l’intégration Git. Refaire les contrôles adaptés sur la version de retour et vérifier le déploiement réel. Une fusion vers `main` peut déclencher le déploiement Git : elle appartient donc à cette étape autorisée, pas à une simple préparation locale.
