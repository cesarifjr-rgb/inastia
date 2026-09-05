# Revue artistique interne

5 septembre 2026. Cette passe est une critique de conception menée pendant la réalisation, sans jury externe ni participants utilisateurs. Elle repose sur l’examen visuel des prototypes et des pages rendues ; les mesures de navigation et de performance sont documentées séparément.

## Décision et corrections

Les douze captures des trois directions montrent des différences de composition réelles, sur ordinateur et mobile. L’architecture A donne trop de poids à l’imaginaire hôtelier ; le soin C raconte bien les rotations mais place les offres beaucoup plus bas sur mobile. B est retenu pour faire du territoire et du partage des responsabilités le sujet de la page. Voir [la comparaison](direction.md).

La première critique du prototype B a entraîné quatre corrections intégrées : une promesse explicite sur la location en Corse et le relais sur place ; une ligne dédiée au coût dans chaque offre ; des textes fonctionnels plus grands ; le retour des trois illustrations originales. Le passage d’un sélecteur à quatre radios permet aussi de lire entièrement les formulations anglaises longues. Le carnet garde la grammaire d’index et de filets de l’atlas, sans introduire une troisième palette.

La revue de la première tranche a couvert accueil, gestion et contact en français, à 1440 × 1000 et 390 × 844 : douze captures premier écran/pleine page. Un contrôle complémentaire à 390 px a couvert le titre de gestion en anglais et le parcours vers le contact anglais avec reprise de l’intention ; une treizième capture montre ce titre. Les espaces et retours à la ligne de l’introduction du contact ont été corrigés. La revue utilisateur a ensuite fait retirer le double numéro de la section équipe et les index redondants de l’audit. Les images avant/après de ces corrections figurent dans les dossiers `first-slice`, `user-review` et `user-review-final-playwright` du dossier de preuves.

## Observation du résultat intégré

| Élément relu visuellement | Conclusion et arbitrage |
| --- | --- |
| Premier écran desktop | Le grand titre à quatre lignes et l’atlas forment deux masses différentes ; la promesse et l’audit gratuit restent le point d’entrée. Le bleu du territoire, les repères et l’italique donnent le caractère à l’arrêt. Aucune photographie ne concurrence le service. |
| Registre des offres desktop | Les trois lignes se lisent comme un partage des rôles. Les illustrations maison, annonce et clé restent reconnaissables. La ligne du coût rompt la grille des deux responsabilités et évite de faire passer une prestation conditionnelle pour une inclusion. |
| Équipe puis territoire | La surface sombre marque le changement vers la présence humaine ; la surface bleutée suivante revient aux repères concrets. L’équipe est décrite collectivement, sans portrait ou identité inventée. |
| Territoire mobile à 390 px | Les cinq lieux deviennent de grands liens numérotés ; la carte n’est pas miniaturisée. Commune et lieu-dit restent distingués dans les légendes, sans information au survol. |
| Portfolio mobile à 390 px | Trois photographies réelles restent discrètes, chacune accompagnée du nom et du lieu. Les filets organisent la liste sans la transformer en catalogue de réservation. Cala Lova conserve son nom confirmé. |
| Carnet mobile à 390 px | Le titre, la réserve explicative et le lien vers les rotations précèdent les trois étapes. Chaque détail peut s’ouvrir dans le flux natif ; le récit ne prétend pas être un rapport d’intervention. |
| Services, contact et 404 | Marges, titres, filets et surfaces bleues propagent l’identité hors accueil. La 404 conserve un retour évident à l’accueil. Les aides et erreurs du formulaire suivent sa hiérarchie typographique. |

Les captures ne montrent pas de texte essentiel rogné dans les vues examinées. La matrice responsive plus large et ses limites sont dans [responsive.md](responsive.md). Les titres anglais longs, les contacts et l’accessibilité des états ouverts ont des vérifications séparées ; la seule beauté d’une capture ne les établit pas.

## Limites assumées

La photographie agrandie utilise un dialogue natif sans transition spectaculaire entre deux cadrages : le lien, l’historique, la fermeture et le retour du focus priment dans cette réalisation. La singularité repose sur la composition, pas sur un effet indispensable. Le guide ouvert allonge la lecture mobile ; il reste facultatif et la comparaison est toujours visible. L’impact de la direction sur la préférence ou la conversion est une hypothèse, sans mesure utilisateur disponible.

L’entrée de l’atlas retenue est une translation de 12 px, après comparaison instrumentée avec un découpage progressif. Le territoire et les textes sont déjà présents au premier rendu. Les prototypes, traces et résultats sont décrits dans `design/explorations/motion.md` et dans le dossier de preuves `motion-prototypes`.
