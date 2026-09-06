# Suivi des demandes et vérification de réception

Le formulaire ne compte pas une ouverture de page ou un clic comme une demande reçue. La réponse `success: true` établit l'acceptation par Resend, après vérification Turnstile ; la réception en boîte et le traitement humain restent des étapes distinctes.

## Diagnostic d'une tentative

L'API retourne un `requestId` opaque et journalise un événement JSON `contact` contenant ce même identifiant, `stage`, `status` et `durationMs`. Une acceptation ajoute `providerId`, utilisable pour retrouver l'email chez Resend. Ni coordonnées, ni contenu du message, ni jeton, ni réponse brute d'un fournisseur ne doivent être ajoutés aux traces.

| Phase | Interprétation et action |
|---|---|
| `validation`, `origin_rejected` | Demande refusée avant envoi. Examiner le type d'écart sans copier les données du prospect dans les logs. |
| `challenge_missing`, `challenge_rejected` | Jeton absent/refusé ou hostname non autorisé ; demander une nouvelle vérification. |
| `challenge_unavailable`, `configuration_missing` | Défaillance avant transmission à Resend ; vérifier disponibilité et présence des variables, jamais leurs valeurs dans les sorties. |
| `send_rejected` | Rejet explicite du fournisseur ; rechercher le statut côté Resend et corriger sa cause. |
| `send_uncertain` | Réponse perdue, invalide, conflit ou erreur ambiguë ; rechercher la demande avant de conclure à son absence. |
| `provider_accepted` | Acceptation confirmée avec identifiant fournisseur ; vérifier livraison et boîte/CRM séparément. |

Dans le projet Vercel `inastia`, filtrer les journaux sur `/api/contact`, l'identifiant et la période. Dans Resend, retrouver `providerId`, puis consulter l'événement de livraison ou de rejet. Un événement `email.delivered` indique l'acceptation par le serveur destinataire, pas la lecture humaine. Confirmer ensuite la présence dans la boîte ou le CRM et l'attribution à un membre de l'équipe.

La déduplication Resend dure 24 heures. Une reprise identique dans la page ouverte conserve clé et contenu ; un contenu modifié ou une nouvelle demande utilise une autre clé. Le rechargement de la page n'est pas couvert par cette conservation en mémoire. Pour une reprise tardive ou après fermeture, vérifier d'abord la réception. Aucun stockage local des coordonnées n'est ajouté.

## Contrôle réel à exécuter une fois autorisé

Préparer une seule demande synthétique dans le parcours « Gestion complète », nom « Test Audit », commune « Porto-Vecchio », type « Autre », email `audit-test@example.com`, téléphone vide, message indiquant explicitement « Test technique de réception Inastia — aucune demande commerciale, aucun rappel attendu ». Conserver sa référence opaque et son heure dans le relevé de vérification. Ne pas utiliser de coordonnées de prospect réel.

Après envoi autorisé : rapprocher la réponse de l'API, l'événement Vercel, l'identifiant Resend, l'événement fournisseur et la présence dans la boîte/CRM. Le responsable commercial confirme ensuite l'attribution et classe la demande comme test selon la procédure existante. Ne pas supprimer automatiquement le message ni répondre à l'adresse réservée d'exemple.

Les tests automatisés du dépôt utilisent des fournisseurs simulés et n'envoient pas ce message. Aucun contrôle réel n'est réputé réussi par la seule présence de cette procédure.

## Alertes et mesure

Vérifier d'abord les alertes déjà actives chez Vercel, Resend et dans le traitement de la boîte. Les événements `configuration_missing`, `challenge_unavailable`, `send_rejected`, `send_uncertain` et les rebonds fournisseur sont les signaux techniques à instruire. Choisir un destinataire d'exploitation et un seuil adapté au volume observé avant d'activer un nouvel envoi d'alertes. Les erreurs attendues de validation ne doivent pas produire une alerte individuelle, et une journée sans demande ne suffit pas à établir une panne.

Vérification du 6 septembre 2026 : les réglages Alerts du projet Vercel affichent
« Enable Observability Plus » ; aucune alerte de cette offre n'a été activée.
Les interfaces Resend et Cloudflare demandent une connexion dans le navigateur
disponible, donc leurs alertes, contrats et options privées n'ont pas été
confirmés. Aucun abonnement supplémentaire n'a été souscrit.

Pour le suivi commercial, utiliser des agrégats avec définitions explicites : tentatives, acceptations, réceptions confirmées, demandes qualifiées, premier traitement et contrats. Dédupliquer par demande logique ; ne pas additionner ses reprises. Comparer des périodes saisonnières équivalentes. Ne pas exporter les coordonnées ou messages pour calculer ces taux, et ne pas installer un traceur d'audience pour remplir un indicateur sans avoir défini son besoin et son cadre.

Les identifiants restent corrélables à une demande et ne sont donc pas réputés anonymes. Accès et conservation des logs doivent être qualifiés avec les autres traitements dans [le registre opérationnel](privacy-operations.md).

Sources : [idempotence Resend](https://resend.com/docs/dashboard/emails/idempotency-keys), [livraison Resend](https://resend.com/docs/webhooks/emails/delivered), [journalisation OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).
