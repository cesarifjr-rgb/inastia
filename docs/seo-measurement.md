# Mesure du référencement naturel

Configuration du 2 octobre 2026, complément du [parcours CTA](journey-measurement.md) et de la [fiche Google](google-business-profile-measurement.md).

## De la recherche à la demande

Après consentement Analytics, le navigateur conserve une catégorie `google_organic`, `bing_organic` ou `duckduckgo_organic` lorsque le référent correspond à un domaine autorisé et que l'arrivée ne comporte ni paramètre UTM ni identifiant publicitaire. Les domaines Google couverts sont .com, .fr, .co.uk, .de, .it, .es, .be, .ch et .ca, avec ou sans www. Les domaines Bing et DuckDuckGo sont .com. Le lien Google Business Profile balisé conserve sa catégorie distincte.

Il s'agit d'une provenance déduite du référent, pas d'une preuve absolue de clic organique : une campagne sans balisage peut être confondue, et un référent absent reste inconnu. Les autres moteurs ne sont pas attribués automatiquement. Aucun historique n'est reclassé.

Seuls la catégorie, l'heure d'arrivée, une page de la liste autorisée et la langue sont conservés, jamais l'URL du référent ni la recherche saisie. La durée reste de 30 minutes dans la session, sans renouvellement par navigation interne, retour navigateur ou rechargement. Une nouvelle campagne ou un autre référent externe remplace ou efface l'origine précédente. Le refus, le retrait, l'expiration du consentement ou l'indisponibilité du stockage laissent le formulaire utilisable sans cette attribution. Un accord donné seulement après rechargement ne recrée pas une arrivée externe.

L'API valide l'instantané à réception. La file durable le conserve pour la copie Attio. Les nouveaux dossiers utilisent « Google/Bing/DuckDuckGo naturel — référent détecté — inastia.fr » dans la source initiale. La page d'entrée figure dans le détail de la demande ; `Site page origine` reste la page du CTA, qui peut être différente. Un dossier existant garde sa source initiale. Aucun texte de formulaire ni identifiant CRM n'est transmis à GA4.

## Vues enregistrées

- [Search Console hors marque, par page](https://search.google.com/search-console/performance/search-analytics?resource_id=https%3A%2F%2Finastia.fr%2F&breakdown=page&query=-inastia) : recherche Web, requêtes ne contenant pas `inastia`. Choisir le mois complet puis comparer le mois précédent. Les requêtes anonymisées sont exclues par ce filtre ; les totaux par page ne se somment pas nécessairement au total de la propriété. [Documentation Google](https://support.google.com/webmasters/answer/17011259?hl=en).
- [SEO — trafic naturel hors fiche Google](https://analytics.google.com/analytics/web/#/analysis/a407471380p553577581/edit/66mOoQFfTHKh1EK3TkbpGg) : support de session `^organic$`, campagne différente de `^google_business_profile$`. La vue mesure les sessions et événements consentis, pas tous les visiteurs ni les demandes uniques. Modifier la période du rapport lors de chaque bilan.
- [SEO — demandes, rendez-vous et contrats](https://app.attio.com/inastia/deals/view/a0d766c2-6691-49e3-afb1-63b9ef8b94aa) : identifiant de l'opportunité du site présent, noms sans `TEST TECHNIQUE`, source initiale contenant `naturel — référent détecté`.

La vue CRM comporte deux champs manuels : **Premier rendez-vous tenu le** (date) et **Preuve du rendez-vous tenu** (texte/lien vers un compte rendu daté). Ne pas y inscrire un rendez-vous seulement prévu. Pour une signature, contrôler le contrat lié, sa date de signature, le document signé et `signature_verifiee` ; une étape commerciale seule ne suffit pas.

## Bilan mensuel

1. Relever clics, impressions et CTR hors marque dans Search Console, puis chaque page locale FR/EN avec le même filtre et les mêmes dates. Conserver également la lecture toutes requêtes, clairement séparée.
2. Relever les sessions organiques consenties et `generate_lead` dans Analytics. Les volumes ne doivent pas être rapprochés individuellement des requêtes Search Console.
3. Dans Attio, compter les premières demandes distinctes par mois de réception, après exclusion des indésirables/doublons. Garder les sources inconnues et la fiche Google séparées.
4. Pour cette même cohorte de demandes, compter les dossiers ayant un rendez-vous tenu avec preuve puis un contrat vérifié. Réactualiser les anciennes cohortes lorsque les dossiers avancent. Ne pas diviser les signatures du mois par les demandes du mois si elles concernent des dossiers différents.

Le classeur de suivi remis le 2 octobre contient le point de départ, les cinq pages locales et leurs versions anglaises, ainsi qu'une grille mensuelle. Une cellule non renseignée reste inconnue ; zéro n'est utilisé qu'après contrôle. Aucun rendez-vous, contrat ou canal historique n'a été complété par supposition.

## Vérification

Les tests locaux couvrent les parcours FR/EN avec consentement, changement de langue, rechargement, expiration, retrait, campagnes concurrentes, stockage indisponible et absence de données libres dans Analytics. Les tests serveur vérifient la validation, la conservation durable et l'attribution initiale Attio. Les services externes et les formulaires sont simulés. Ils ne prouvent pas la prochaine copie d'une demande authentique en production : vérifier cette copie lors de sa réception, sans faux prospect ni email de test.

Les mesures PageSpeed mobiles du 2 octobre donnent 100/100 en performance sur [l'accueil](https://pagespeed.web.dev/analysis/https-inastia-fr/50p4tk43an?form_factor=mobile) et [la gestion](https://pagespeed.web.dev/analysis/https-inastia-fr-gestion-airbnb-corse-du-sud/an7x36phai?form_factor=mobile), avec LCP respectifs 1,4 s et 1,2 s, TBT 0 ms et CLS 0. Ce sont des tests de laboratoire ponctuels, pas une validation Core Web Vitals des visiteurs réels ; les données terrain restent indisponibles.
