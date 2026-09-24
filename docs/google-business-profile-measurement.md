# Mesurer les demandes provenant de la fiche Google

Configuration du 24 septembre 2026. Le lien de la fiche doit être exactement :

`https://inastia.fr/?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile`

Il ouvre toujours l’accueil. `google / organic` reste distinct de Google Ads ; la campagne `google_business_profile` isole le lien de la fiche du reste du référencement naturel. Ce marquage identifie le lien utilisé, pas une preuve infalsifiable de provenance : un lien partagé peut conserver ses paramètres.

Référence : [dimensions de source et marquage manuel GA4](https://support.google.com/analytics/answer/11242870?hl=en). Les rapports GA4 appliquent leurs propres règles de session et d’attribution ; une nouvelle campagne rencontrée en cours de session ne crée pas nécessairement une nouvelle session. Le comptage CRM ci-dessous ne doit donc pas être assimilé à une reproduction exacte du rapport GA4.

## Parcours et consentement

Avec le consentement Analytics, GA4 reçoit uniquement ces trois valeurs prédéfinies dans `page_location`. Tous les autres paramètres libres restent retirés. Le navigateur conserve séparément l’origine `google_business_profile` en session pendant 30 minutes au maximum. Elle traverse les pages internes, le changement FR/EN et le formulaire. Une autre campagne balisée ou un clic publicitaire remplace cette origine par une origine inconnue de ce dispositif ; elle ne doit pas être artificiellement attribuée à GBP. Le refus, le retrait du consentement ou l’expiration suppriment l’attribution facultative, sans empêcher la demande. Le consentement Ads seul ne suffit pas.

L’API valide de nouveau la catégorie, le consentement, la version et la date. L’instantané validé est enregistré avec la demande durable ; la copie CRM utilise l’heure de réception initiale, même après une reprise différée. L’origine n’entre pas dans l’email idempotent et n’est jamais déduite d’un champ vide.

Dans Attio, les nouvelles opportunités et les contacts sans source initiale reçoivent **Google Business Profile — inastia.fr** dans **Source initiale documentée** (`source_acquisition`). Le détail de la demande conserve la provenance par lien balisé et la date d’arrivée déclarée par le navigateur. Une origine initiale déjà documentée n’est jamais remplacée ; une nouvelle visite GBP figure alors seulement dans la dernière demande. Un ancien identifiant Ads consenti peut subsister séparément : il ne remplace pas la provenance de cette visite GBP.

## Bilan mensuel

Relever les chiffres sur le même mois civil, heure de Paris, et dater le relevé. Garder séparément les consultations/actions de la fiche, la navigation consentie et les résultats commerciaux : leurs populations ne sont pas identiques.

| Mesure | Source et règle |
|---|---|
| Consultations de la fiche | Rapport Performances Google Business Profile. |
| Clics vers le site et clics d’appel | Rapport GBP, en colonnes distinctes. Un clic d’appel n’est pas un appel abouti. |
| Visites consenties du lien GBP | GA4, acquisition de trafic, campagne de la session = `google_business_profile`, source/support = `google / organic`. |
| Formulaires enregistrés | Événement `generate_lead` dans ce même segment ; séparer gestion, audit et intendance. Il ne prouve pas la qualification ou la copie CRM. |
| Nouveaux projets propriétaires | Attio, source initiale exacte **Google Business Profile — inastia.fr**, première demande dans le mois, dossier relié au contact et au bien. Exclure tests, indésirables et doublons confirmés. |
| Projets qualifiés | Parmi cette même cohorte de dossiers, qualification humaine documentée avec sa première date ; un formulaire ne qualifie pas un propriétaire. |
| Rendez-vous | Première rencontre ou premier appel de découverte effectivement tenu, daté et documenté dans chaque dossier. Une tâche ou une invitation future ne compte pas. |
| Contrats | Pour la même cohorte, contrat relié au dossier, date de signature, document signé et signature vérifiée. Un stade « Gagné » seul ne suffit pas. |

La [vue Attio Google Business Profile — demandes et contrats](https://app.attio.com/inastia/deals/view/c3638373-a820-49d5-823b-29c7c0e6816c) est enregistrée pour l’équipe, avec le filtre de source exacte ci-dessus, une clé d’opportunité du site non vide et l’exclusion des noms contenant `TEST TECHNIQUE`. Elle reprend l’étape commerciale, les repères du parcours, la première demande, la proposition et les contrats. Pour les dossiers acquis auparavant par un autre canal puis revenus par GBP, consulter séparément le détail de la dernière demande : ne pas réattribuer leur acquisition initiale.

Tableau mensuel à tenir sans données personnelles :

| Mois d’entrée | Relevé le | Consultations GBP | Clics site GBP | Clics d’appel GBP | Sessions GA4 GBP | Formulaires GA4 GBP | Nouveaux projets CRM | Qualifiés | RDV tenus | Contrats signés |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| À renseigner | À renseigner | NR | NR | NR | NR | NR | NR | NR | NR | NR |

`NR` signifie non relevé ou non vérifié, jamais zéro. Actualiser les cohortes antérieures lorsque leurs dossiers avancent. Les signatures du mois ne doivent pas être divisées par les seules nouvelles demandes du même mois. Séparer les origines inconnues, appels et contacts directs non attribuables. Ce dispositif ne reconstitue pas les visites passées et n’attribue pas tous les appels de la fiche. Il ne crée ni qualification automatique ni envoi de données personnelles à Google.

## Vérification

Les tests couvrent la navigation FR/EN, les consentements indépendants, les valeurs autorisées, l’expiration, les campagnes concurrentes, le formulaire, l’enregistrement durable et les écritures Attio simulées. Aucun faux prospect ni email réel n’est nécessaire. L’état Vercel et le lien publié doivent être contrôlés après livraison. La copie d’une demande authentique et sa progression commerciale restent à vérifier lorsque cette demande existe ; des tests simulés ne les prouvent pas.
