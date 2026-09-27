# Application de l'audit du 24 septembre 2026

Contrôles et corrections du 27 septembre, à partir de `f891edc` (31 pages
indexables). Les résultats documentaires de l'audit sont confrontés au site
publié ; un élément déjà couvert n'est pas réécrit pour satisfaire une liste.

| Action retenue | Réalisation et critère vérifié |
| --- | --- |
| A07 — Réception complète | Une demande réelle du 24 septembre : enregistrement unique, deux tâches réussies en une tentative, événement `email.delivered`, email retrouvé dans la corbeille de la messagerie et dossier Attio portant la même référence. Aucun envoi de test, déplacement de message ou modification commerciale. Cette preuve FR/gestion ne simule pas une demande réelle pour chaque langue/intention. |
| A10 — Domaine principal | Redirection permanente des pages `www.inastia.fr` vers `inastia.fr`. Chemins et paramètres conservés, autres hôtes inchangés. Les routes `/api` restent directement accessibles sur les deux hôtes : Resend utilise encore le webhook sur `www`. |
| A23 — Consentement | Requêtes réellement observées avant choix, après refus, Analytics seul, Ads seul, acceptation, puis retrait et rechargement. Aucun appel Google avant choix/après refus dans les scénarios observés ; choix séparés et suppression des cookies de mesure au retrait. |
| A23 — Paramètres d'URL | Défaut reproduit : le premier signal Ads recevait les paramètres arbitraires d'URL. Contexte nettoyé défini avant la configuration Ads, y compris sans Analytics. Ordre de configuration vérifié dans les tests ; contrôle réseau final à refaire après publication. |
| A24 — Erreurs et suivi | `form_error` consentie, catégories fixes sans donnée saisie, dédoublonnage des champs invalides d'une même tentative. Aucune erreur ne compte comme demande/conversion. Dimension GA4 créée ; suivi commercial existant conservé. |
| A16–A18 — Usage | Tests navigateur des formulaires, navigation, consentement, focus, images, contrastes automatisés et mouvement. Complément Chromium/WebKit avec émulation tactile, FR/EN, 320/360/390/768 px et paysage. Une émulation ne valide ni un vrai clavier iOS/Android ni la lecture vocale d'un lecteur d'écran. |
| A12–A13 — Pages locales | Contenu spécifique déjà présent en FR/EN : quartier/accès à Porto-Vecchio, Cala d'Oro et rotations à Solenzara, littoral/village à Zonza, résidence et accès à Saint-Cyprien, base de Travo et qualification du secteur à Ghisonaccia. Photographies localisées honnêtement. Aucun cas client, délai terrain ou secteur supplémentaire inventé. |

## Suivi commercial vérifié

Le rapprochement du journal et d'Attio porte sur la période depuis le
22 septembre : une demande réelle, un email livré et retrouvé, une opportunité
au stade « Nouveau lead ». La qualification reste à instruire ; aucune
qualification, proposition ou signature n'est déduite de l'envoi du formulaire.
Les taux commerciaux ne sont pas interprétables sur ce seul dossier.

La vue privée existante « Parcours du site — CTA et suivi » permet de retrouver
la page, l'emplacement, la langue et les étapes commerciales. Le bilan suit
[les définitions par cohorte](copywriting-measurement.md) ; consulter aussi
[les événements et catégories](journey-measurement.md). Ne pas importer les
identifiants des prospects dans GA4 pour relier les deux outils.

Les sondes réseau de recette du 27 septembre ont pu créer quelques visites
Analytics/Ads ; elles n'ont envoyé ni formulaire ni conversion de prospect.
Ne pas interpréter cette date comme une évolution commerciale. Les tests locaux
de formulaire et conversion interceptent les fournisseurs.

## Sauvegarde indépendante : premier export et limites

Export ponctuel des quatre tables, transaction `REPEATABLE READ READ ONLY`
avec `contact_backup`, stocké hors de Neon et du dépôt, sous ACL Windows
restreinte et chiffré avec DPAPI CurrentUser. Restauration en mémoire dans
PGlite, comparaison SQL des lignes typées dans les deux sens : zéro différence
sur 1 demande, 2 tâches, 2 événements et 1 verrou. Aucun worker/fournisseur
connecté à la copie ; aucune écriture en production.

Il s'agit d'un export logique applicatif, pas d'un dump du cluster ni d'un
exercice PITR Neon. Le déchiffrement dépend du profil Windows actuel. Une
sauvegarde périodique, une copie récupérable sur un autre appareil et une fenêtre
PITR plus longue restent à établir. Aucun abonnement payant n'a été activé.

## Preuves et limites

Validation locale : 198 tests unitaires, compilation et lint réussis. Les
20 tests ciblés Analytics/Ads passent après correction d'une régression de
l'ordre des commandes au retrait du consentement. Les 16 parcours mobiles
Chromium/WebKit passent. La politique CSP de production reste inchangée ; le
test WebKit retire seulement `upgrade-insecure-requests` sur le serveur HTTP
local pour éviter de demander ses ressources en HTTPS sur ce même port.
La suite navigateur complète est également exécutée par la CI avant fusion.

Les traces réseau, rapports de tests, captures, état technique et vérification
de restauration restent dans les artefacts locaux ignorés, sans coordonnées
de prospect dans ce document. Les données commerciales et références privées
ne sont pas versionnées. Les protections observées ne constituent pas un
certificat de conformité, un test d'intrusion ou une mesure des Core Web Vitals
réels. Les tests physiques iPhone/Android et lecteur d'écran restent à réaliser.
