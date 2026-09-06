# Conservation et suivi des données Inastia

Version du 6 septembre 2026. L’entreprise a demandé la mise en place d’une règle
de conservation et de son contrôle. Aucune ancienne purge n’a été établie.
Cette politique couvre le Hub, le futur CRM, la boîte OVH et les copies utiles.

## Règles retenues

| Données et finalité | Échéance et traitement |
|---|---|
| Prospects et demandes sans contrat | Trois ans au maximum depuis la collecte ou le dernier contact entrant pertinent et vérifié de la personne. À l’échéance, fin de l’usage commercial et suppression, sauf pièces précisément nécessaires à une obligation ou un litige. |
| Partenaires professionnels potentiels | Même plafond de trois ans pour les coordonnées personnelles utilisées en prospection ; la justification du canal et l’opposition restent contrôlées séparément. |
| Propriétaires clients | Données utiles pendant la relation ; à sa fin, retirer les accès opérationnels et trier les pièces nécessaires aux archives. La fin de relation ne vaut pas consentement commercial. |
| Pièces nécessaires à la preuve contractuelle | Archivage restreint, généralement cinq ans à partir du point de départ du délai applicable, à documenter pour chaque dossier. Un litige ou délai spécial fait l’objet d’une conservation distincte, motivée et réexaminée. |
| Factures et pièces comptables | Dix ans à partir de la clôture de l’exercice concerné. Le reste d’un dossier commercial ne doit pas être conservé dix ans par simple association à une facture. |
| Contrat électronique avec un consommateur d’au moins 120 € | Dix ans après la conclusion pour une prestation immédiate ; sinon conservation dès la conclusion et jusqu’à dix ans après l’exécution. Pour une prestation annuelle, retenir la fin réelle d’exécution. Cette obligation porte sur le contrat et sa preuve, pas sur tous les messages ou documents du client. |
| Opposition et retrait | Prise en compte immédiate sur tous les outils. Trace minimale conservée au moins trois ans, uniquement pour éviter une nouvelle sollicitation ; nécessité réexaminée chaque année. La fin de ce délai ne réautorise jamais une relance à elle seule. |
| Accord aux appels commerciaux | Arrêt au retrait ou un an après l’accord, au plus tôt des deux. Aucun renouvellement par import, ouverture d’email ou relance sortante. Une demande d’audit reste distincte d’une autorisation de prospection. |
| Accord aux emails commerciaux | Arrêt au retrait et, au plus tard, à l’échéance de conservation commerciale. L’accord à un canal n’autorise pas l’autre. |

Les imports, modifications techniques, visites de page et relances envoyées par
Inastia ne remettent pas le compteur de conservation à zéro. Une date inconnue
n’est pas remplacée par la date du jour. Une adresse publique ou une ancienne
fiche n’est pas un consentement ; toute autre base de prospection éventuelle doit
être qualifiée pour le destinataire et le canal concernés.

## Mise en œuvre

Pour chaque fiche, conserver l’identifiant d’origine, la date/source de collecte,
le dernier contact entrant prouvé, les préférences par canal, leur preuve,
les retraits, l’échéance et les éventuelles raisons d’archivage. Les dates
d’import et de prochaine action commerciale sont des informations distinctes.

Un contrôle hebdomadaire relève les dossiers échus ou à échéance dans trente
jours, les accords téléphoniques expirés et les informations manquantes. Le
premier contrôle utilise la base active du Hub en lecture seule et produit des
compteurs sans noms, emails, téléphones ni messages. Les dates historiques
constituent un point de départ provisoire à rapprocher des sources lors de la
migration. Le contrôle doit ensuite être adapté au CRM effectivement connecté.

Le suivi est programmé chaque lundi à 9 h, heure de Paris, dans la tâche Codex
consacrée à Inastia. Il signale les changements nécessitant une action et les
échecs de contrôle. Il dépend de la disponibilité de l’ordinateur, de
l’application et des accès ; un passage non exécuté ne vaut pas contrôle réussi.

À une échéance, retirer la fiche des vues de relance, vérifier les contrats,
factures, oppositions et litiges, puis séparer l’archive justifiée du dossier
actif avant effacement. Préparer un relevé des éléments concernés avant une
suppression irréversible ; les dossiers ambigus restent exclus des relances et
sont soumis à examen. Tracer date, règle, périmètre et résultat de l’action,
sans recopier le contenu supprimé dans le journal.

Appliquer le traitement à la boîte OVH, au CRM, au Hub encore utilisé, aux pièces
et aux exports. Une suppression CRM ne prouve pas celle de l’email OVH.
Les exports de migration ont une durée opérationnelle limitée : trente jours
après validation de la bascule, sous réserve d’un incident documenté. Les
sauvegardes suivent une rotation à vérifier chez chaque fournisseur ; une
restauration doit réappliquer les retraits et suppressions déjà décidés.

Les habilitations de la boîte, le mécanisme effectif d’effacement OVH et les
réglages du futur CRM doivent être vérifiés. Le suivi programmé n’équivaut pas
à une purge automatique de ces systèmes. Aucun envoi commercial n’est autorisé
par cette politique seule.

## Références

- [CNIL — gestion commerciale et conservation des prospects](https://www.cnil.fr/fr/questions-reponses-sur-les-referentiels-relatifs-la-gestion-des-activites-commerciales-et-des)
- [CNIL — durées et distinction base active archives](https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees)
- [CNIL — liste repoussoir](https://www.cnil.fr/fr/comment-utiliser-une-liste-repoussoir-pour-respecter-lopposition-la-prospection-commerciale)
- Code de commerce, article L.123-22 ; Code civil, article 2224 ; Code de la consommation, article L.213-1.
- [Seuil du contrat électronique D213-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032807208) et [durée D213-2](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032807210).
