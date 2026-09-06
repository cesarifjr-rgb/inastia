# Mesurer les demandes qualifiées

Procédure interne du 6 septembre 2026 pour le point 18 du rapport de copywriting. Elle complète [le diagnostic de réception et les règles de suivi humain](lead-operations.md). Elle peut être appliquée manuellement dès la prochaine demande, sans connexion du site à Hub Inastia.

## Ce qui est observable aujourd'hui

Le site n'a ni mesure d'audience côté navigateur, ni CMP, ni base de prospects intégrée. Hub Inastia est indépendant du formulaire. Les journaux techniques et la boîte professionnelle OVH sont les points de départ du rapprochement ; ils ne qualifient pas automatiquement les projets.

| Observation | Ce qu'elle établit |
|---|---|
| `provider_accepted` avec `requestId` et `providerId` | Resend a accepté la demande d'envoi. Cela ne prouve ni la livraison ni la réception en boîte. |
| `email.delivered` chez Resend | Le serveur destinataire a accepté l'email. Cela ne prouve pas sa lecture ou son traitement. |
| Message retrouvé dans OVH | La demande est reçue en boîte ; l'équipe peut confirmer sa réception et commencer la qualification. |
| Qualification, proposition, contrat | Ces étapes sont renseignées par l'équipe à partir du traitement réel et des documents correspondants. |

L'événement d'acceptation porte aussi les catégories validées `intent` et `contactPreference`. `intent` vaut `gestion`, `audit`, une chaîne vide pour une demande générale, ou les anciennes valeurs compatibles `annonce`/`rotation`. Ces dernières ne constituent pas des offres de prestation seule : leur besoin doit être clarifié. `contactPreference` vaut `email` ou `phone`. Pour les anciennes requêtes sans ce champ, le serveur utilise `phone` pour l'audit et `email` pour les autres motifs. Cette préférence n'est pas un consentement commercial et une valeur par défaut ne prouve pas un choix explicite.

Les visites, clics sur CTA et débuts de formulaire ne sont pas mesurés actuellement. Ne pas afficher de taux visite → demande ni inventer ces volumes à partir des journaux d'envoi. Aucun test auprès de visiteurs réels n'a été réalisé dans ce travail ; aucun résultat commercial attribuable à la réécriture n'est disponible.

## Une fiche privée par demande

À la première réception confirmée dans OVH, copier cette grille dans le dispositif privé habilité de suivi. L'email conserve les coordonnées et le message ; la référence permet de le retrouver sans les recopier dans le bilan. Le modèle reste vierge dans le dépôt.

| Champ | À renseigner | Règle |
|---|---|---|
| `requestId` | | Référence opaque présente dans l'email et les traces. |
| Première réception OVH confirmée | | Date et heure, fuseau Europe/Paris. Elle détermine la semaine d'entrée dans le bilan. |
| Motif reçu / parcours à traiter | | Gestion, audit ou à préciser ; conserver le motif technique d'origine si nécessaire au rapprochement. |
| Préférence de contact | | Email ou téléphone selon la demande ; vérifier séparément les choix de prospection avant une relance commerciale. |
| Secteur confirmé | | Oui / non / à préciser, après vérification de la localisation réelle. |
| Type de logement compatible | | Oui / non / à préciser, selon les logements effectivement pris en charge. |
| Intention de déléguer | | Confirmée / absente / à préciser. Une demande d'audit peut rester en préparation de projet. |
| Délai ou période souhaitée | | Période annoncée et compatibilité avec une prise en charge, ou à préciser. Aucun délai de service n'est promis par cette grille. |
| Qualification | | Qualifié / à préciser / non adapté. |
| Première qualification confirmée | | Date du premier classement réel « qualifié » ; laisser vide tant que cette étape n'a pas été franchie. Conserver cette date si le statut actuel change ensuite. |
| Motif non adapté | | Hors secteur, logement incompatible, prestation seule, absence de projet de délégation, délai incompatible, ou autre motif commercial documenté en privé. |
| Proposition | | Non envoyée / envoyée, avec date du premier envoi réel. Un brouillon n'est pas une proposition envoyée. |
| Contrat | | Non signé / signé, avec date de signature et référence privée du document. |
| Exclusion ou doublon | | Test, indésirable, suivi d'un dossier existant, ou `requestId` de référence après rapprochement d'un doublon confirmé. |

Classer « qualifié » lorsque le secteur et le type de logement sont compatibles, l'intention de déléguer est confirmée et la période permet une suite commerciale réaliste. Si une information manque, conserver « à préciser ». « Non adapté » nécessite un motif concret ; un email sans réponse ne suffit pas à inventer ce motif. Ni un consentement commercial ni le seul envoi du formulaire ne qualifient un projet. Le statut actuel peut évoluer : conserver en privé le motif du changement et les étapes déjà réellement franchies.

Dédupliquer d'abord sur `requestId` : plusieurs traces ou reprises d'une même demande ne créent pas plusieurs fiches. Si l'équipe confirme que plusieurs références concernent le même projet, les rattacher en privé à une référence principale et ne compter la suite commerciale qu'une fois. Ne jamais faire ce rapprochement sur une simple ressemblance supposée. Une proposition révisée ou plusieurs exemplaires d'un contrat n'ajoutent pas de conversion.

## Bilan manuel chaque lundi

La personne chargée du suivi clôt le bilan de la semaine précédente, du lundi 00 h au dimanche 23 h 59, heure de Paris. Les demandes non livrées ou introuvables dans OVH restent au diagnostic technique. Les tests, indésirables, suivis de dossiers existants et doublons confirmés sont exclus du bilan des nouveaux projets.

1. Rapprocher les acceptations avec la boîte, puis créer ou mettre à jour les fiches privées. Un écart entre acceptations et réceptions doit être examiné, pas transformé en demande reçue.
2. Compter **R**, les références uniques dont la première réception confirmée appartient à cette semaine.
3. Parmi ces mêmes références, compter **Q**, celles ayant franchi au moins une fois une qualification confirmée, d'après leur date de première qualification. Ne pas retirer cette étape lorsqu'un projet ne signe pas ou change ensuite de situation. Les statuts actuels « à préciser » et « non adapté » restent utiles au traitement des fiches, mais ne remplacent pas cet historique.
4. Pour ce même groupe, compter **P**, les demandes avec proposition réellement envoyée, puis **C**, celles avec contrat réellement signé. Vérifier `C ≤ P ≤ Q ≤ R`. Si une étape antérieure manque dans le suivi, la rapprocher des preuves avant de publier les taux, sans inventer de date ou de qualification.
5. Calculer `Q/R` (qualification), `P/Q` (proposition), `C/P` (signature) et `C/R` (passage global). Si un dénominateur vaut zéro, inscrire « non calculable ». Si les données n'ont pas été vérifiées, inscrire « non renseigné », et non zéro.
6. Mettre à jour les semaines antérieures lorsque leurs demandes avancent. Une signature tardive appartient toujours à la semaine de première réception de sa demande pour ces taux. Ne pas diviser les signatures de cette semaine par les seules nouvelles demandes de cette semaine.

Le bilan agrégé contient seulement la semaine d'entrée, la date du relevé, le parcours gestion/audit/à préciser, R, Q, P, C et les taux. Les statuts actuels « à préciser » et « non adapté » ainsi que leurs motifs peuvent être comptés séparément, sans les additionner aux étapes historiques du parcours. Ne pas y exporter `requestId`, identifiants de contrat, noms, coordonnées, adresses, messages ou verbatims. Les références du registre privé restent corrélables à des personnes ; elles ne sont pas anonymes et suivent les règles d'accès et de [conservation](data-retention.md).

Comparer des groupes observés pendant une durée similaire, en signalant les dossiers encore ouverts et la saison. Les nombres de demandes reçues et qualifiées peuvent être suivis dès maintenant par cette procédure ; leur rapport au trafic du site reste inconnu sans mesure de visites.

## Tests éditoriaux après stabilisation

Les modifications étendues de cette version ne sont pas une expérience isolant la cause d'un changement de résultats. Le premier relevé manuel constitue un point de départ, pas une preuve d'amélioration.

| Étape | Plan et condition de démarrage |
|---|---|
| Vérifier la compréhension | Utiliser le script ci-dessous lorsque le trafic est faible, sur une version stable et avec des propriétaires correspondant à la cible. Aucune invitation ni prise de contact n'est envoyée par cette procédure. |
| Comparer la promesse | Préparer une variante de titre centrée sur la délégation. Ne changer que le titre ; conserver sous-texte, CTA, prix, formulaire et règles de qualification. Consigner versions et dates, puis comparer des périodes et des demandes suffisamment suivies. Sans contrôle du trafic et de la saison, présenter une observation, pas un effet causal démontré. Aucun système A/B n'est implémenté. |
| Examiner la place de l'audit | Garder l'audit secondaire dans la version actuelle. Tester éventuellement sa visibilité une fois la version et le suivi stables, sans mener en même temps le test du titre. Comparer surtout les demandes qualifiées issues de gestion et d'audit. |
| Témoignage propriétaire, cas réel, équipe nommée | Hors périmètre à la demande de l'utilisateur : points 09, 10 et 11 écartés. Le test avec témoignage propriétaire du rapport n'est pas planifié, et aucune collecte correspondante n'est lancée. |

Avant toute mesure future des clics, débuts de formulaire ou visites, définir le besoin et le dispositif adapté. Leur ajout reste une décision ultérieure ; aucun événement navigateur, cookie, CMP ou intégration Hub n'est créé par ce document.

### Script d'entretien de compréhension

Faire parcourir la page sans expliquer l'offre au préalable, puis demander :

1. Avec vos mots, que propose Inastia et à qui ce service s'adresse-t-il ?
2. Que délégueriez-vous et quelles décisions ou tâches resteraient à votre charge ?
3. Comment comprenez-vous la commission, les autres frais et qui les paie ?
4. Que pensez-vous qu'il se passe après le bouton principal ? Que propose l'audit et à quoi correspondent les 24 heures ?
5. Quelles informations vous manquent pour décider de présenter votre projet ?

Noter les incompréhensions par question et les passages concernés, sans identité ni coordonnées dans le compte rendu agrégé. Ne pas aider la personne avant sa première réponse. Corriger les ambiguïtés constatées avant de multiplier les comparaisons quantitatives. Aucun entretien ni résultat n'est déclaré réalisé par la seule préparation de ce script.
