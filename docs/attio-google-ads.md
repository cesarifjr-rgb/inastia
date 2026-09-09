# Liaison du formulaire avec Attio

Après validation Turnstile et acceptation de l’email par Resend, `api/contact.js`
confie la copie CRM à `waitUntil`. L’email reste le canal de réception de secours.
`lib/attio.js` rapproche le contact par email, conserve son identité existante,
ses autres adresses, ses oppositions et son attribution initiale, puis actualise
la dernière demande du site. Les emails conservent les demandes antérieures.
Aucune séquence ni relance n’est déclenchée par ce code.

Configurer `ATTIO_API_KEY` uniquement dans les variables serveur de production
du projet Vercel `inastia`. La clé doit appartenir à l’espace Inastia et disposer
de Records en lecture/écriture et Object configuration en lecture. Les aperçus
Vercel n’écrivent jamais dans le CRM. La clé ne doit être ni versionnée ni exposée
par une variable `VITE_`.

Les attributs People nécessaires sont `site_derniere_demande_id`,
`site_derniere_demande_le`, `site_derniere_demande`, `site_source`,
`google_ads_gclid` et `google_ads_date_prospect`. La configuration de la liaison
Google Ads les crée avant publication du site.

Le navigateur conserve un GCLID pendant 90 jours au maximum uniquement après
accord à la mesure publicitaire. La version de consentement v2 inclut les suites
de la demande : les choix précédents sont donc redemandés. Le retrait supprime
le clic local. Un refus, une date périmée ou un identifiant invalide n’empêche
jamais l’envoi du formulaire ; aucune attribution Google n’est alors transmise.
Pour une demande déjà reçue, traiter le retrait dans Attio en décochant le
partage autorisé avant tout nouvel export.

La synchronisation Google Ads vers Attio est exécutée toutes les heures dans
le compte 146-737-6747. Elle actualise les bilans mensuels et récupère les
formulaires natifs Google Ads. Elle transmet les qualifications/signatures
uniquement avec un clic valide, une date réelle et la case de partage autorisé
cochée dans Attio. Les contacts importés et les nouvelles demandes du site ne
sont jamais considérés comme qualifiés automatiquement. La confirmation finale
d’un import reste à consulter dans Google Ads.

Les événements serveur `contact_crm` portent seulement l’identifiant de demande
et `synced`, `already_present`, `newer_enquiry_present` ou `sync_failed`.
En cas de `sync_failed`, retrouver l’email reçu avec cette référence pour reprendre
le dossier. Trois tentatives bornées couvrent les erreurs temporaires ; il n’y a
pas de file de reprise durable. Ne pas renvoyer un formulaire réel comme test
sans autorisation explicite d’envoyer l’email correspondant.
