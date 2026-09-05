# Revue interne du parcours propriétaire

Revue du 5 septembre 2026 sur la prévisualisation locale `http://127.0.0.1:4100`, premier build intégrant les choix radio (`client-1uOrPdtI.js`), puis revalidation du build commun `client-DLiOUOJi.js` / `index-uaBI35XJ.css`. Aucun formulaire réel soumis. Cette revue est une inspection interne avec scénarios et tests automatisés, **pas une étude avec de vrais utilisateurs**. Elle ne mesure ni compréhension spontanée, ni préférence, ni taux de conversion.

## Méthode et preuves

Parcours examiné : accueil → guide ou comparatif → offre → contact, puis audit, À propos et Solenzara. Textes rendus et captures pleine page collectés à 390 × 960 et 1440 × 960 ; captures du guide français/anglais aux deux largeurs. Inspection visuelle des captures du guide anglais, de l’accueil bureau, de l’offre annonce et du contact mobile. Les autres captures sont conservées comme pièces de référence ; leur seule existence ne vaut pas inspection visuelle détaillée.

- [Scénarios Playwright](../../tests/orientation-frontier.spec.ts) : 8 tests, première exécution **8 réussis en 11,8 s**. Les contrôles couvrent les radios au clavier, les motifs, les quatre destinations, le besoin prérempli du contact, la remise à zéro, le groupe neutre, le rendu à deux largeurs et le comparatif sans JavaScript. Les assertions de motif spécifique ont ensuite été renforcées ; seconde exécution sur le build commun : **8 réussis en 11,4 s**.
- [Captures finales du guide](C:/Users/Admin/Documents/inastia-frontier-evidence/user-review-final-playwright) et [captures des pages](C:/Users/Admin/Documents/inastia-frontier-evidence/user-review).
- [Textes du parcours](C:/Users/Admin/Documents/inastia-frontier-evidence/user-review/journey-text.json), [graphe statique](C:/Users/Admin/Documents/inastia-frontier-evidence/user-review/static-graph.json), [baseline factuelle](C:/Users/Admin/Documents/inastia-frontier-evidence/baseline/content.md).

Le test de restauration modifie l’état coché puis émet un événement `pageshow` avec `persisted: true` : il vérifie le gestionnaire, sans prétendre reproduire le cache de navigation de tous les navigateurs. Le guide n’utilise pas l’historique URL, donc pas de contrat `popstate` propre au guide. Aucun lecteur d’écran, test de délivrabilité, audit juridique ou nouvelle vérification publique de la note Google n’a été réalisé. Aucun `pageerror` détecté pendant les quatre scénarios de rendu ; cette mesure ne couvre pas tous les messages console ni tous les fournisseurs externes.

## Résultat du parcours

| Étape | Observation | Conséquence pour le propriétaire |
|---|---|---|
| Accueil | Cible propriétaire, trois accompagnements et territoire explicites dès l’introduction. CTA audit et comparaison distincts. | Deux chemins compréhensibles : demander un échange ou comparer. |
| Guide | Une question optionnelle, quatre libellés complets. Les libellés anglais longs reviennent à la ligne à 390 px. La sélection au clavier conserve le focus et une seule réponse s’affiche. | Pas de réponse obligatoire pour accéder à l’offre ; pas de résultat caché derrière un formulaire. |
| Recommandation | Motif lié à la déclaration, réserve indicative, lien offre et lien contact avec le bon besoin. | La recommandation explique son choix sans simuler un calcul de tarif ou d’éligibilité. |
| Comparatif | Les trois offres exposent ce qui est confié, conservé et le cadre du coût, y compris sans JavaScript. | Les distinctions utiles ne dépendent ni du guide ni d’un accordéon. |
| Offre annonce | Le résumé conserve les mêmes responsabilités et conditions que l’accueil. Une section précise que l’accueil et le ménage relèvent d’une offre séparée. | Le propriétaire peut vérifier la limite de l’offre avant le contact. |
| Contact | Besoin transmis et modifiable ; champs obligatoires identifiés, téléphone/message facultatifs, suite de la demande expliquée. | Le contexte choisi n’a pas à être ressaisi. Aucun envoi nécessaire pour vérifier ce parcours. |
| Audit | Gratuit, qualitatif, appel/email, même sans annonce, absence de prévision de revenus explicites. | Le livrable annoncé est cohérent ; aucune promesse de gain ou de délai inventée. |
| À propos / local | Équipe collective, expérience de propriétaires et implantation conservées ; disponibilité conditionnée à l’adresse. | Le territoire présenté ne vaut pas garantie automatique de toutes les prestations. |

## Frictions observées

**Aucun blocage fonctionnel observé dans le périmètre testé.** Deux détails éditoriaux ont été signalés à l’agent principal et corrigés dans les sources :

1. L’accueil utilise « 02 — Une équipe familiale », puis « 02 / Repères locaux ». Si les chiffres se lisent comme une progression, cette répétition rend le repérage moins net. La capture `home-1440.png` conserve l’état avant. Correction coordonnée par l’agent principal : retirer le numéro du repère équipe. Vérification DOM après build réussie et captures `home-after-390.png` / `home-after-1440.png`.
2. L’audit cumule un index « 01 » et un titre « 1. Présenter votre bien… » (idem 02/03). Cela alourdit la lecture sans ajouter d’information. Le texte rendu et `audit-390.png` conservent l’état avant. Correction autorisée dans `src/templates.ts` : omettre l’index décoratif quand le titre commence déjà par un nombre suivi d’un point ou d’une parenthèse. Les titres et leur contenu sont conservés ; typecheck réussi. Après le build commun : absence des trois index décoratifs vérifiée sur audit FR/EN à 390 et 1440 px ; les trois titres restent présents. Les index des offres ordinaires sont conservés. Captures `audit-after-fr-390.png`, `audit-after-fr-1440.png` et variantes EN ; capture FR mobile inspectée visuellement après correction.

Deux limites de lecture sont à conserver comme hypothèses à tester avec de vrais propriétaires : le guide ouvert et sa réponse demandent du défilement sur téléphone ; l’introduction de l’offre annonce évoque d’abord le lancement, alors que le comparatif et la section détaillée couvrent également une annonce existante. Aucun comportement utilisateur mesuré ne permet d’en déduire un abandon ou une incompréhension.

Le défaut de troncature du sélecteur anglais avait été identifié avant cette passe par l’agent principal. La version radio examinée en conserve tous les mots et tient à 390 px, avec une colonne mobile et deux colonnes bureau. Cette revue dispose de la preuve après correction, pas d’une capture avant prise par son auteur ; elle ne fabrique donc pas de comparaison visuelle avant/après.

## Cohérence factuelle et graphe

La lecture reste conforme aux verrous de la baseline : Cala Lova affiché exactement, trois maisons réelles avec leurs localisations, présentation collective de l’équipe, avis explicitement attribués aux voyageurs dans leur langue originale, relevé Google daté du 5 septembre 2026, audit qualitatif et prestations/frais à convenir. Aucun pourcentage, prix, gain, délai garanti ou nouvelle identité personnelle observé dans le parcours relu. Les coûts restent qualitatifs parce qu’aucun tarif public confirmé ne permet un montant chiffré.

Le graphe local issu du sitemap retrouve **27 pages HTTP 200, 27 titres distincts, un H1 par page, description/canonical/image OG présents partout**, 24 pages avec trois alternates FR/EN/x-default et trois pages légales françaises sans alternates. **Zéro route ou fragment interne manquant** dans ce graphe HTML. Ce contrôle exclut les fichiers et destinations externes ; il ne prouve ni indexation effective ni disponibilité de services tiers.
