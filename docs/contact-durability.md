# Réception durable du formulaire

Le site reste sur Vercel à Paris (`cdg1`). Une base PostgreSQL Neon dédiée,
`contact-inastia-db`, est située à Francfort, dans l'Union européenne (offre
Marketplace `free_v3`). Elle est indépendante de la base historique du Hub.

## États et garanties

1. Turnstile et la validation existante précèdent toute écriture. Une transaction
   enregistre l'instantané de la demande et deux tâches : email et CRM.
2. L'API répond `202 {success: true, status: "registered", requestId}` seulement
   après confirmation de l'écriture. La copie Attio et la livraison en boîte ne
   sont pas encore garanties à cet instant. Analytics/Ads conservent les règles
   de consentement et de service ; leur signal de demande confirme cet enregistrement.
3. `waitUntil` lance un premier traitement. Un cron reprend les tâches toutes les
   15 minutes, avec délai croissant de 1 minute à 3 heures entre échecs. Ce rythme
   laisse la base se suspendre après 5 minutes d'inactivité et limite sa consommation.
4. Un verrou de worker de 90 secondes sérialise les traitements, y compris les
   mises à jour d'un même propriétaire dans Attio. Chaque tâche dispose d'un
   verrou de 2 minutes et d'un jeton de validation ; une exécution interrompue
   redevient traitable. Un passage traite au plus 6 tâches dans un budget de 40 s.
5. Email et CRM avancent indépendamment. Le CRM garde les identifiants stables
   déjà utilisés pour le contact, le bien et l'opportunité, ainsi que les
   oppositions, l'historique et l'attribution existante. Aucun envoi commercial
   ni aucune séquence supplémentaire n'est déclenché.

Le même UUID avec le même contenu retourne la même réception, sans écraser
l'instantané initial ni recréer les tâches. Un contenu différent sous le même
UUID est refusé (`409`). Le jeton Turnstile n'est jamais stocké. La déduplication
couvre les reprises du même identifiant, pas deux formulaires volontairement
distincts ou un navigateur ayant perdu son identifiant.

Les reprises Resend utilisent la même clé `contact/<UUID>` et le même corps
enregistré. Elles s'arrêtent avant 23 heures depuis la première tentative :
Resend ne garantit ses clés que 24 heures. Un résultat encore ambigu devient
`attention` ; il ne provoque pas un renvoi tardif aveugle. Un HTTP 409 ou rejet
permanent nécessite également une vérification. Le CRM dispose de 12 tentatives.
Une confirmation fournisseur perdue entre deux écritures se répare par une
reprise idempotente ou par le webhook signé portant le tag `request_id`.

## Livraison email

`/api/webhooks/resend` vérifie les octets d'origine, la signature et l'horodatage
Svix avant tout traitement. Les événements suivis sont `email.sent`,
`email.delivered`, `email.delivery_delayed`, `email.bounced`, `email.failed`,
`email.suppressed` et `email.complained`. Les doublons sont dédupliqués par
`svix-id`. Les événements retardés ne rétrogradent pas une livraison en simple
envoi ni un échec en livraison. Les événements sans demande correspondante
sont ignorés. Aucun suivi d'ouverture ou de clic n'est ajouté.

`email.delivered` signifie acceptation par le serveur destinataire, sans preuve
de lecture humaine. Un rebond ou un échec n'entraîne pas un nouvel envoi automatique.

## Configuration et déploiement

- Variables Production uniquement : `CONTACT_DATABASE_URL`,
  `CONTACT_DURABLE_ENABLED=true`, `CRON_SECRET` et `RESEND_WEBHOOK_SECRET`, en
  plus des clés Turnstile, Resend et Attio existantes. Les trois secrets ajoutés
  doivent rester confidentiels ; ne pas afficher leur contenu dans les logs.
- Appliquer `node --env-file=<fichier privé> scripts/migrate-contact.js` une fois
  avant activation. Le schéma est idempotent ; aucune table Hub n'est modifiée.
- Créer dans le compte Resend qui possède `inastia.fr` un webhook vers
  `https://www.inastia.fr/api/webhooks/resend`, avec les sept événements ci-dessus.
  Reporter sa clé de signature dans la variable Sensitive de production.
- Préserver le flux Git/CI et attendre la promotion des domaines publics. Les
  previews refusent les écritures formulaire, worker et webhook de production.
- `CONTACT_DURABLE_ENABLED=false` conserve le mode historique pour un retour
  technique contrôlé, mais suspend les reprises. Avant tout retour en arrière,
  inspecter et terminer les demandes en cours : ne pas mélanger les corps email
  historiques et durables sous une même clé d'idempotence.

## Exploitation

`GET /api/contact-status`, protégé par `Authorization: Bearer <CRON_SECRET>`,
renvoie uniquement des compteurs, états de livraison et jusqu'à 50 références
à vérifier. Il ne renvoie aucun nom, email, message ou jeton. Le cron est protégé
par le même secret. Les réponses ont `Cache-Control: no-store`.

Les logs `contact_delivery` indiquent l'identifiant opaque, le traitement, le
nombre de tentatives et une catégorie d'erreur. `contact_attention` indique
des dossiers en erreur ou en attente depuis plus de 30 minutes. Les erreurs
fournisseur brutes et les données personnelles n'y sont jamais écrites. Le
compte Vercel existant peut les consulter ; aucun abonnement ni email d'alerte
supplémentaire n'est activé par cette livraison.

Pour `attention` : retrouver la référence en base privée, contrôler le reçu
Resend et le dossier Attio, puis corriger la cause (quota, clé, schéma CRM,
adresse destinataire). Une reprise CRM après correction peut remettre uniquement
sa tâche en `pending`, avec `attempts=0` et `next_attempt_at=now()` ; ne pas
modifier la tâche email. Pour un email ambigu hors fenêtre, vérifier auprès
du fournisseur avant toute décision humaine de renvoi. Ne jamais effacer un
dossier pour contourner sa déduplication. Les deux destinataires techniques
restent ceux configurés historiquement : la boîte `contact@inastia.fr` et Attio.

La base gratuite a un quota de calcul et de stockage : le surveiller dans Neon.
Le cron maintient une activité minimale même sans demande ; augmenter son rythme
peut épuiser le quota et bloquer les nouvelles réceptions. Un `503` de la base
conserve le formulaire à l'écran ; aucun email de secours non enregistré n'est
envoyé. Le téléphone et l'adresse email du site restent accessibles.

## Conservation et contrôles

Le cron efface les contenus après 30 jours quand les deux tâches ont réussi,
ou après 90 jours dans les autres cas. Les tâches encore inachevées à 90 jours
passent en `attention / retention_expired`. Les références, empreintes et états
techniques sont conservés au plus un an, puis supprimés en cascade. Ces règles
ne purgent ni la messagerie OVH, ni Attio, ni le Hub. Une demande d'effacement
doit aussi traiter cette copie technique dans l'espace privé habilité.

Tests locaux : moteur PostgreSQL PGlite réel, fournisseurs simulés, reprises,
arrêts de worker, concurrence, conflits d'identifiant, signatures/rejeu,
événements désordonnés, conservation et indisponibilité de base. En production,
vérifier schéma, authentification, signature et état privé sans créer de prospect
ni envoyer de test email non autorisé. La prochaine demande authentique permettra
de confirmer ensemble livraison OVH et présence dans Attio.

Sources : [idempotence Resend](https://resend.com/docs/dashboard/emails/idempotency-keys),
[signatures](https://resend.com/docs/webhooks/verify-webhooks-requests),
[offre Neon](https://neon.com/docs/introduction/plans).
