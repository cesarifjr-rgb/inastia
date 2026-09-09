# Liaison du formulaire avec Attio

Après validation Turnstile et acceptation de l’email par Resend, `api/contact.js`
confie la copie CRM à `waitUntil`. L’email reste le canal de réception de secours.
`lib/attio.js` rapproche le contact par email, conserve son identité existante,
ses autres adresses, ses oppositions et son attribution initiale, puis actualise
la dernière demande du site. Il relie ensuite un Bien et une Opportunité au contact,
avec la demande, sa source documentée et une prochaine action à deux heures.
Les emails et l’historique des attributs conservent les demandes antérieures.
Aucune séquence ni relance n’est déclenchée par ce code.

Le même identifiant de demande ne crée pas de doublon. Pour une même personne,
un identifiant d’annonce Airbnb ou Booking reconnu rapproche les demandes du même
bien ; les paramètres de suivi n’influencent pas ce rapprochement. Sans cet
identifiant, une nouvelle demande reste un bien distinct. Si le contact a déjà
des biens, le champ « Identité du bien à vérifier » invite à contrôler le dossier.
Le nom et la commune seuls ne justifient jamais une fusion. Les données du bien,
la source initiale et l’étape d’une opportunité existante sont conservées, y compris
après clôture ; une nouvelle demande sur un dossier clos demande un examen humain.

Configurer `ATTIO_API_KEY` uniquement dans les variables serveur de production
du projet Vercel `inastia`. La clé doit appartenir à l’espace Inastia et disposer
de Records en lecture/écriture et Object configuration en lecture. Les aperçus
Vercel n’écrivent jamais dans le CRM. La clé ne doit être ni versionnée ni exposée
par une variable `VITE_`.

Les attributs People nécessaires comprennent `site_derniere_demande_id`,
`site_derniere_demande_le`, `site_derniere_demande`, `site_source`,
`google_ads_gclid` et `google_ads_date_prospect`. La configuration de la liaison
Google Ads les crée avant publication du site. Le pilotage commercial ajoute
`source_acquisition`, `premiere_demande_le` et `canal_prefere` sur People,
les caractéristiques déclarées et la clé unique `site_bien_cle` sur Biens,
puis `site_opportunite_cle`, les dates et textes de demande, la relation `bien`,
`source_acquisition` et la prochaine action sur Deals. Le membre
`contact@inastia.fr` est responsable des nouvelles opportunités, à l’étape
« Nouveau lead ». Ces attributs et relations doivent exister avant déploiement.
Aucun montant estimé, propriétaire confirmé, contrat signé ou revenu n’est déduit
d’une simple demande. Sans attribution publicitaire consentie, le canal est indiqué
comme non attribué ; il n’est pas présumé être du référencement naturel.

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
et `synced` ou `sync_failed`.
En cas de `sync_failed`, retrouver l’email reçu avec cette référence pour reprendre
le dossier. Les lectures et le rapprochement du contact peuvent être retentés
trois fois dans une enveloppe de 45 secondes. Les créations utilisent des clés
uniques et les écritures ne sont pas répétées aveuglément. Une reprise relit les
fiches existantes et complète un parcours interrompu, même si le contact a déjà
été enregistré. Il n’y a pas de file de reprise durable : les routines commerciales
doivent contrôler les demandes reçues par email dont le parcours est incomplet.
Ne pas renvoyer un formulaire réel comme test
sans autorisation explicite d’envoyer l’email correspondant.
