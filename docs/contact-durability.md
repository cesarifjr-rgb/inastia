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
  avant activation, avec `CONTACT_ADMIN_DATABASE_URL` dans ce fichier privé.
  Le schéma est idempotent ; aucune table Hub n'est modifiée.
  Appliquer ensuite `scripts/migrate-contact-access.js` avec le même fichier.
  Cette migration atomique crée les rôles sans connexion, refuse les attributs
  élevés, appartenances et objets possédés, puis accorde les droits ci-dessous.
  Configurer leurs mots de passe séparément ; ne jamais les versionner.
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

Le cron efface les contenus 30 jours après la réception quand les deux tâches
ont réussi, ou 90 jours après la réception dans les autres cas. Les tâches encore
inachevées à 90 jours passent en `attention / retention_expired`. Les références, empreintes et états
techniques sont conservés au plus un an, puis supprimés en cascade. Ces règles
ne purgent ni la messagerie OVH, ni Attio, ni le Hub. Une demande d'effacement
doit aussi traiter cette copie technique dans l'espace privé habilité.

Le contrôle `db/contact-audit.sql` est intégralement en lecture seule. Il vérifie
les volumes, les paires de tâches, les contenus et références hors délai, ainsi
que les rôles SQL. Il ne restitue aucun contenu ni aucune coordonnée. Les quatre
compteurs d'anomalies doivent être nuls après un passage réussi du cron ; sinon,
contrôler d'abord son authentification, ses logs et l'accès à la base.

## Sauvegarde et restauration

L'historique Neon est distinct de la conservation applicative ci-dessus. Le
23 septembre 2026, la console de `contact-inastia-db` confirme une fenêtre de
restauration de **6 heures** sur l'offre Free. Cela couvre une erreur détectée
rapidement, pas une suppression découverte le lendemain ni la perte du projet
ou du compte. Aucun export indépendant ni sauvegarde quotidienne n'est configuré.
Les sauvegardes planifiées proposées par la console nécessitent une offre payante.
Ne pas présenter cette configuration comme une sauvegarde de plusieurs jours.

En cas d'incident :

1. Noter l'heure UTC et conserver les logs/références disponibles. Si la base
   répond encore, suspendre les écritures de contact et le worker avant toute
   bascule. Ne pas utiliser `CONTACT_DURABLE_ENABLED=false` pour cela : ce réglage
   réactive l'envoi historique. Bloquer temporairement les routes de contact,
   worker et webhook dans Vercel, avec une réponse d'indisponibilité, et garder
   les autres pages disponibles.
2. Dans Neon, sélectionner le projet dédié, puis créer une branche depuis un
   point antérieur à l'incident, à l'intérieur de la fenêtre affichée. Conserver
   la branche actuelle. Ne pas restaurer aveuglément `main` en place.
3. Garder la copie isolée de Vercel, de Resend et d'Attio. Exécuter le contrôle SQL
   ci-dessus et vérifier les références utiles en accès privé. Une restauration
   de base ne restaure ni les emails déjà envoyés ni les opérations CRM : les
   traitements intervenus après le point choisi doivent être rapprochés avec
   les fournisseurs avant toute reprise.
4. Sur la copie, mettre les tâches non terminées en `attention`, avec
   `last_error='restore_reconciliation'`, et libérer leurs verrous ainsi que celui
   de `contact_worker`. Ne remettre en `pending` que les tâches réconciliées.
   Conserver les UUID, corps email et identifiants fournisseurs ; ne jamais
   rejouer un email ambigu après la fenêtre d'idempotence Resend.
5. Réappliquer les effacements et la conservation avant remise en service : une
   copie ancienne peut réintroduire un contenu purgé ou un consentement retiré.
   Les choix commerciaux courants restent à vérifier dans Attio.
6. Après validation, modifier uniquement la connexion du site vers la branche
   récupérée, attendre CI et promotion, vérifier l'état privé, puis réouvrir les
   routes. Conserver la branche précédente pendant la vérification, puis retirer
   les copies temporaires selon leur expiration et la politique de conservation.

Un exercice utilise uniquement une branche temporaire, des données synthétiques
et une expiration courte. Aucun worker ni webhook applicatif n'est connecté à
cette branche. Vérifier les données après récupération, pas seulement le succès
de l'opération dans la console. Une branche de test n'est pas une sauvegarde.

Les accès opérateur passent par le compte Vercel existant et son SSO Neon.
`db/contact-access.sql` définit deux rôles créés par SQL, sans `neon_superuser`,
propriété d'objet, création de schéma/table temporaire ni administration de rôles :

| Rôle | Droits |
| --- | --- |
| `contact_app` | Lire les quatre tables ; insérer et modifier les demandes et tâches ; supprimer les demandes pour la conservation ; insérer les événements ; modifier le verrou du worker. |
| `contact_backup` | Lire uniquement les quatre tables, sans écriture. |

La suppression d'une demande entraîne ses tâches et événements en cascade.
Les futures tables n'obtiennent aucun droit automatique. Le compte de sauvegarde
n'est pas une sauvegarde : aucun export périodique n'est activé par cette migration.

Seule la connexion `contact_app` doit être installée dans `CONTACT_DATABASE_URL`,
Sensitive et Production uniquement. Déconnecter la liaison de variables de la
ressource Marketplace du projet Vercel (sans supprimer la ressource Neon) pour
retirer toutes les variantes de connexion propriétaire et empêcher leur
réinjection. Conserver Neon, sa facturation et son SSO dans la même intégration.
Garder la connexion administrative de migration et celle de sauvegarde hors du
runtime Vercel. Un ancien déploiement conserve ses anciennes variables ; ne pas
supprimer le propriétaire ni tourner son mot de passe avant une bascule vérifiée.

Avant la bascule, tester les droits refusés et le traitement avec fournisseurs
simulés sur une branche isolée. Après CI et promotion, vérifier l'état privé
et le cron. Un retour temporaire peut réinstaller la connexion propriétaire
conservée localement puis redéployer ; il doit rester exceptionnel et suivi.

Tests locaux : moteur PostgreSQL PGlite réel, fournisseurs simulés, reprises,
arrêts de worker, concurrence, conflits d'identifiant, signatures/rejeu,
événements désordonnés, conservation et indisponibilité de base. En production,
vérifier schéma, authentification, signature et état privé sans créer de prospect
ni envoyer de test email non autorisé. La prochaine demande authentique permettra
de confirmer ensemble livraison OVH et présence dans Attio.

Sources : [idempotence Resend](https://resend.com/docs/dashboard/emails/idempotency-keys),
[signatures](https://resend.com/docs/webhooks/verify-webhooks-requests),
[offre Neon](https://neon.com/docs/introduction/plans),
[sauvegardes Neon](https://neon.com/docs/manage/backups),
[rôles Neon](https://neon.com/docs/manage/roles).
