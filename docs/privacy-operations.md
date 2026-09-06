# Traitements de contact et textes publics — suivi opérationnel

Document interne au dépôt, non publié par le générateur du site. État au
6 septembre 2026. Ne contient ni secret, ni export de demande, ni contrat privé.
Les points ouverts ne sont pas des déclarations à reprendre automatiquement
sur le site.

## Pratiques confirmées et textes correspondants

Inastia répond aux demandes, prépare audits/devis et effectue des relances par
email et téléphone. La boîte professionnelle est chez OVH ; l'offre précise
n'a pas été fournie. Les propriétaires encaissent directement les loyers.

La notice distingue les mesures précontractuelles demandées par la personne
concernée, l'intérêt légitime à répondre aux autres demandes et à sécuriser le
formulaire, et le consentement aux offres/relances commerciales. Les demandes
faites pour une personne morale ne relèvent pas automatiquement de la base
précontractuelle applicable à la personne qui écrit. La mise en balance des
intérêts reste à documenter en interne.

Deux choix facultatifs, séparés et non précochés permettent les relances email
et téléphone. Le choix téléphone vaut au maximum un an, sans renouvellement
automatique ; tout choix peut être retiré à tout moment. La réponse à la demande
et le rappel d'audit demandé restent indépendants. Le détail de traitement humain
et de conservation des preuves figure dans [le suivi des demandes](lead-operations.md).

Les CGV corrigées distinguent consommateurs/professionnels, rétractation et
exécution anticipée, pénalités professionnelles et compétence territoriale.
Elles reflètent l'encaissement direct des loyers par les propriétaires ; elles
ne certifient aucun statut professionnel. Les coordonnées CM2C du PDF existant
figurent aussi en HTML. Les modèles de contrat et la preuve d'adhésion CM2C en
cours restent à fournir.

## Cartographie et éléments vérifiés

| Étape | Données / finalité | Destinataire et constat |
|---|---|---|
| Navigation et API | Requêtes HTTP, service du site et traitement du formulaire | Vercel ; fonctions de production dans `iad1`, États-Unis, selon les réglages inspectés |
| Entrée dans un champ | Chargement de la vérification anti-robot | Cloudflare Turnstile ; widget existant correspondant à la clé publique, mode Managed, préautorisation désactivée |
| Vérification anti-spam | Jeton transmis à Siteverify, sans message commercial | Cloudflare ; entrée de domaine `inastia.fr`, qui inclut les sous-domaines selon son fonctionnement ; contrôle serveur limité à l'apex et `www` |
| Transmission | Coordonnées, bien/projet, message facultatif et choix commerciaux avec leurs libellés | Resend puis boîte de contact Inastia chez OVH |
| Suivi humain | Réponse, audit/devis et relances selon le choix applicable | Hub Inastia confirmé ; hébergement Vercel et base PostgreSQL Neon constatée en production. Fonctions habilitées, renvois et sauvegardes à préciser |
| Diagnostic | Référence opaque, phase, résultat, durée ; identifiant fournisseur et date serveur lors de l'acceptation | Journaux applicatifs Vercel ; sans coordonnées, message, jeton ni secret |

Les identifiants de diagnostic restent corrélables à une demande et ne sont pas
réputés anonymes. L'horloge du navigateur est déclarative ; l'événement serveur
d'acceptation permet de corréler la réception. Aucun stockage local applicatif
des coordonnées n'est ajouté.

**Resend.** Le domaine existant `inastia.fr` apparaît vérifié et sa région d'envoi
est Ireland (`eu-west-1`). L'offre est Transactional Free, 3 000 emails/mois et
100/jour ; l'interface montre un administrateur. La rubrique Documents indique
que le DPA est conclu à l'inscription, conformément aux conditions qui
l'incorporent. Les métadonnées, logs et données de compte sont stockés aux
États-Unis selon la documentation, indépendamment de la région d'envoi. La
rétention annoncée pour cette offre est de 30 jours. Ce délai ne définit pas la
conservation dans la boîte OVH ni celle des preuves internes. Le formulaire de
création d'un nouveau sous-domaine propose des options de suivi ; ses cases ne
prouvent pas les réglages du domaine existant. Aucun sous-domaine n'a été créé,
aucun réglage modifié. TLS apparaît opportuniste.

**Transferts.** Le DPA Vercel prévoit les clauses contractuelles types (§13,
annexe 3). Le DPA Resend prévoit notamment les modules applicables des clauses
contractuelles types ; son délai de suppression après fin de compte ne doit pas
être confondu avec la conservation des prospects. Cloudflare distingue le rôle
de sous-traitant pour protéger les sites et celui de responsable pour améliorer
la détection des robots ; son DPA prévoit des garanties pour les transferts hors
EEE. Ces documents sont des éléments contractuels, pas une certification globale
de conformité. Pour OVH, la localisation dépend notamment de la commande et de
l'offre ; une résidence France/UE n'est pas établie par le seul nom du fournisseur.

**Terminal et CAPTCHA.** Le relevé public initial, sur profil Chrome neuf, n'a
observé aucune origine tierce avant focus ni clé local/session ; après focus,
des requêtes Cloudflare sont apparues sans cookie constaté dans la courte fenêtre
observée. Cela n'exclut pas d'autres opérations sur le terminal. Le mode Managed
et la préautorisation désactivée ne suffisent pas à conclure à une exemption de
consentement : l'analyse des opérations et finalités reste ouverte. Un focus ne
vaut pas consentement. Aucune CMP ni mesure d'audience n'a été ajoutée.

## Points restant à confirmer

- Fonctions accédant à la boîte et aux journaux, renvois internes et sauvegardes.
  Le Hub actuel est confirmé ; le CRM de remplacement fait l’objet d’un choix
  séparé. Aucun transfert n’est réputé effectué par la recommandation seule.
- L’entreprise a confirmé l’absence de règle appliquée auparavant et demandé
  sa mise en place. La [politique de conservation](data-retention.md) distingue
  prospection, autorisations par canal, preuves, oppositions et archives.
  Un premier contrôle du Hub en lecture seule a été effectué ; la purge OVH et
  les réglages du futur CRM restent à vérifier. Ne pas confondre suivi et purge.
- Offre/commande OVH et garanties applicables ; conservation effective des logs
  Vercel et organisation de la conservation des preuves avant expiration chez
  Resend ; contrôle des options de suivi du domaine Resend existant.
- Analyse des opérations Turnstile au regard de l'article 82 et formalisation de
  la mise en balance des intérêts ; modèles contractuels et adhésion CM2C.
- Le test synthétique unique du 6 septembre 2026 est livré par Resend et sa
  bonne réception a été confirmée par l’entreprise. Les preuves détaillées
  sont conservées séparément du dépôt ; aucun nouvel envoi n’est requis.

Aucune purge, liste d'opposition contenant des coordonnées, signature de contrat,
modification fournisseur ni souscription n'est effectuée par cette documentation.
AUD-01 et AUD-08 restent partiels sur ces points opérationnels ; les textes ne
constituent pas une validation juridique générale.

## Sources consultées le 6 septembre 2026

- [RGPD, information et droits — CNIL](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3)
  et [FAQ CNIL cookies, CAPTCHA](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/FAQ).
- [DPA Vercel](https://vercel.com/legal/dpa).
- [Conditions Resend](https://resend.com/legal/terms-of-service),
  [DPA signé de référence](https://resend.com/static/documents/resend-dpa-signed.pdf),
  [régions et stockage](https://resend.com/docs/dashboard/domains/regions),
  [offres et rétention](https://resend.com/pricing/).
- [Addendum Turnstile](https://www.cloudflare.com/turnstile-privacy-policy/),
  18 juin 2025 ; [DPA Cloudflare](https://www.cloudflare.com/cloudflare-customer-dpa/).
- [Contrats OVHcloud](https://www.ovhcloud.com/fr/terms-and-conditions/contracts/)
  et [DPA OVHcloud](https://contract.eu.ovhapis.com/1.0/pdf/OVH_Data_Protection_Agreement-fr.pdf).
- [L221-18](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032226842),
  [L221-25](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044563179),
  [L221-28](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044563170),
  [R631-3](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032808504),
  [article 48 CPC](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006410147)
  et [L441-10](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038414392).
- [PDF CM2C déjà publié par Inastia](https://inastia.fr/vitrophanie.pdf),
  coordonnées relues sans preuve d'adhésion.
