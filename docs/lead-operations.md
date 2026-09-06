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

La déduplication Resend dure 24 heures. Une reprise identique dans la page ouverte conserve clé et contenu ; un contenu modifié ou une nouvelle demande utilise une autre clé. Le client conserve les points de départ des horloges monotone et civile : si au moins l'un des temps écoulés atteint 23 heures, il refuse une reprise automatique avant tout appel à l'API et invite à vérifier la réception. Un décalage constant de l'horloge civile n'empêche pas le premier envoi. Une correction d'horloge importante après une tentative peut bloquer sa reprise par prudence ; l'horloge civile couvre aussi les veilles pendant lesquelles l'horloge monotone peut être suspendue. Le rechargement de la page et les requêtes manuelles hors de ce client ne sont pas couverts par cette borne en mémoire. Pour une reprise tardive ou après fermeture, vérifier d'abord la réception. Aucun stockage local des coordonnées n'est ajouté.

## Contrôle réel autorisé après déploiement

L'utilisateur a autorisé un unique envoi réel à `contact@inastia.fr` après déploiement. Préparer une seule demande synthétique dans le parcours « Gestion complète », nom « Test Audit », commune « Porto-Vecchio », type « Autre », email `audit-test@example.com`, téléphone vide, les deux choix commerciaux décochés, message indiquant explicitement « Test technique de réception Inastia — aucune demande commerciale, aucun rappel attendu ». Conserver sa référence opaque et son heure dans le relevé de vérification. Ne pas utiliser de coordonnées de prospect réel.

Après envoi : rapprocher la réponse de l'API, l'événement Vercel, l'identifiant Resend, l'événement fournisseur et la présence dans la boîte professionnelle OVH. Le responsable commercial confirme ensuite l'attribution et classe la demande comme test selon la procédure existante. L'existence d'un CRM reste à confirmer. Ne pas supprimer automatiquement le message ni répondre à l'adresse réservée d'exemple.

Les tests automatisés du dépôt utilisent des fournisseurs simulés et n'envoient pas ce message. Aucun contrôle réel n'est réputé réussi par la seule présence de cette procédure.

## Choix commerciaux et traitement humain

Inastia a confirmé répondre aux demandes, préparer audits/devis et effectuer des relances email et téléphone. Les deux choix facultatifs du formulaire sont distincts de la réponse à la demande et du rappel d'audit demandé. Ils ne sont pas précochés et ne conditionnent pas ces services.

Avant chaque relance commerciale, la personne chargée du suivi vérifie le canal autorisé, la preuve disponible, sa date et les retraits reçus. Le choix téléphone expire au maximum un an après la collecte, sans renouvellement automatique ; un retrait met fin plus tôt à l'autorisation. Pour l'email, vérifier le maintien du consentement dans la durée de conservation applicable. Un contact ou une nouvelle demande ne renouvelle pas automatiquement un choix antérieur.

L'email de demande conserve les choix, les libellés complets, la langue, la version `commercial-2026-09-06-v1` et la date déclarée par le navigateur, dont l'horloge n'est pas vérifiée. Le `requestId` permet de rapprocher cet email de l'événement `provider_accepted`, qui porte `providerId` et `receivedAt` calculé côté serveur. Cette date serveur n'est pas injectée dans le contenu stable d'une reprise idempotente. En cas de date incohérente, ne pas traiter la date déclarée comme une preuve suffisante.

Une case décochée ou l'absence de choix n'apporte aucune nouvelle autorisation. Ce n'est pas à elle seule la preuve du retrait d'un ancien consentement valide : rapprocher les demandes antérieures et les retraits, sans supposer une autorisation sur la seule présence de coordonnées. Un consentement au téléphone n'autorise pas les emails, et réciproquement.

Traiter un retrait reçu à `contact@inastia.fr`, par réponse email ou oralement lors d'un appel avant toute nouvelle relance : enregistrer le canal et la date dans le dispositif privé de suivi, puis informer les personnes habilitées. Conserver seulement la preuve et les données d'opposition nécessaires selon une règle documentée ; ne mettre aucune coordonnée ni liste d'opposition dans le dépôt de code ou dans un espace accessible au public.

La conservation du message original et de ses en-têtes, ainsi que de la corrélation serveur utile, doit être organisée dans l'espace privé habilité avant expiration des traces fournisseur. Resend annonce 30 jours pour l'offre observée ; cela ne constitue ni une politique de purge OVH ni une durée de conservation des prospects. Les personnes habilitées, le dispositif privé de suivi, les durées de preuve/opposition et la purge effective restent à confirmer. Aucun nouveau CRM ou archivage automatique n'est créé par cette procédure.

## Alertes et mesure

Vérifier d'abord les alertes déjà actives chez Vercel, Resend et dans le traitement de la boîte. Les événements `configuration_missing`, `challenge_unavailable`, `send_rejected`, `send_uncertain` et les rebonds fournisseur sont les signaux techniques à instruire. Choisir un destinataire d'exploitation et un seuil adapté au volume observé avant d'activer un nouvel envoi d'alertes. Les erreurs attendues de validation ne doivent pas produire une alerte individuelle, et une journée sans demande ne suffit pas à établir une panne.

Vérification du 6 septembre 2026 : les réglages Alerts du projet Vercel affichent
« Enable Observability Plus » ; aucune alerte de cette offre n'a été activée.
Les comptes Resend et Cloudflare ont ensuite pu être inspectés en lecture :
domaine Resend existant vérifié, offre Transactional Free, widget Turnstile
existant correspondant à la clé publique, mode Managed et préautorisation
désactivée. Les options et limites de preuve sont consignées dans
[le registre opérationnel](privacy-operations.md). Aucun abonnement supplémentaire
n'a été souscrit ni réglage fournisseur modifié.

Les pages Webhooks de Resend et Notifications de Cloudflare ne montrent aucune
configuration existante lors du contrôle. Aucune notification automatique
d'erreur de réception n'est donc attestée par ces interfaces. La création d'un
webhook, d'un destinataire et d'un seuil d'alerte reste une décision d'exploitation
à définir ; aucun nouvel envoi d'alerte n'a été activé.

Pour le suivi commercial, utiliser des agrégats avec définitions explicites : tentatives, acceptations, réceptions confirmées, demandes qualifiées, premier traitement et contrats. Dédupliquer par demande logique ; ne pas additionner ses reprises. Comparer des périodes saisonnières équivalentes. Ne pas exporter les coordonnées ou messages pour calculer ces taux, et ne pas installer un traceur d'audience pour remplir un indicateur sans avoir défini son besoin et son cadre.

Les identifiants restent corrélables à une demande et ne sont donc pas réputés anonymes. Accès et conservation des logs doivent être qualifiés avec les autres traitements dans [le registre opérationnel](privacy-operations.md).

Sources : [idempotence Resend](https://resend.com/docs/dashboard/emails/idempotency-keys), [livraison Resend](https://resend.com/docs/webhooks/emails/delivered), [journalisation OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

Pour les choix commerciaux : [prospection électronique — CNIL](https://www.cnil.fr/fr/la-prospection-commerciale-par-courrier-electronique-sms-mms-et-automate-dappel)
et [règles téléphoniques applicables depuis le 11 août 2026 — Service Public](https://www.service-public.gouv.fr/particuliers/actualites/A19003?lang=fr).
