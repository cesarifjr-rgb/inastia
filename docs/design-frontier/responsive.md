# Vérification responsive — Frontier

5 septembre 2026, Chrome piloté par Playwright, preview local 4100, build commun annoncé `client-DLiOUOJi.js` / CSS `uaBI35XJ`. Aucun CSS ni contenu de production modifié par ce contrôle. Les injections de stress n’existent que dans le navigateur éphémère.

## Matrice effectivement parcourue

Huit routes × dix largeurs = **80 vues** :

- accueil FR `/` ;
- gestion FR `/gestion-airbnb-corse-du-sud` ;
- annonce EN `/en/pack-lancement-airbnb` ;
- rotation EN `/en/menage-airbnb-corse-du-sud` ;
- histoire FR `/about` ;
- audit FR `/audit-gratuit-potentiel-locatif` ;
- contact FR `/contact?intent=gestion` ;
- Solenzara FR `/conciergerie-location-saisonniere-solenzara`.

Largeurs : **320, 390, 480, 600, 768, 900, 1024, 1280, 1440, 1920 px**. Hauteur 844 px jusqu’à 900, puis 1000 px. Deux offres EN ont été choisies pour couvrir les titres anglais longs, sans prétendre avoir parcouru toutes les permutations FR/EN.

Polices chargées, passage de défilement pour images différées et révélations, retour en haut, repos de 500 ms. L’attente de décodage est bornée. Mesures : largeur du document et du body, chargement des images HTML, exceptions JavaScript pageerror, boîtes visibles h1/h2/h3 et largeur interne de leurs textes.

**Résultat : 80/80 sans débordement horizontal, image cassée, titre hors largeur ou exception pageerror observés.** Ce critère ne détecte pas tous les chevauchements possibles, les contrastes ou les erreurs réseau non fatales.

## Cas ciblés

| Cas | Observation | Limite |
|---|---|---|
| Contact 390 × 360, textarea focalisée et défilée au centre | Champ et focus visibles, pas de débordement ; description sous le champ encore visible | Hauteur disponible simulée. Aucun vrai clavier iOS/Android ni gestion de visualViewport OS testés |
| Reflow à 640 px × 450 | Huit routes sans overflow | Proxy de largeur CSS de 1280 px à 200 %, pas commande de zoom native |
| Reflow à 320 px | Couvert par les huit routes de la matrice | Proxy de largeur CSS de 1280 px à 400 %, pas preuve du zoom navigateur réel |
| CSS `zoom:2` / `zoom:4` sur accueil à 1280 | Débordements 1452 / 2903 px | Stress synthétique : les media queries desktop restent actives. Ne pas assimiler à un échec mesuré du zoom navigateur 200/400 % |
| H1 anglais prolongé injecté dans annonce à 320 | Retour à la ligne naturel ; pas d’overflow, le paragraphe suit le titre | Contenu fictif uniquement dans le navigateur de test ; pas de changement éditorial |
| Suppression injectée de `#message-help` du textarea contact | Label « Votre projet (facultatif) » conservé ; layout stable | La description est nécessairement absente et aria-describedby reste sans cible dans ce scénario volontairement cassé. Ce n’est pas l’état produit |
| Toutes les requêtes `/images/**` bloquées à 320 | Modale portfolio garde son nom, lieu, alternative et fermeture ; largeur stable | Absence des médias provoquée volontairement ; les images normales sont chargées dans la matrice |

Le stress CSS zoom est consigné comme un signal distinct ; il ne justifie pas de modifier silencieusement le CSS sur la base d’une simulation différente du zoom navigateur.

## Lecture visuelle ciblée

Captures inspectées notamment : accueil 768/1920, annonce EN 320, rotation EN 768, contact 320, champ contact à hauteur réduite, titre injecté et CSS zoom. L’accueil garde sa hiérarchie à 768 et 1920 ; les trois niveaux du titre anglais long ne débordent pas à 320. La rotation EN place encore son action et sa comparaison dans la fenêtre à 768. Le contact 320 conserve les labels et l’espace entre « Porto-Vecchio. » et la phrase suivante, corrigé depuis la première tranche.

## Portfolio complémentaire

Six tests de `tests/portfolio-frontier.spec.ts` passent : clavier/historique/Escape/bouton, lien profond EN et hash inconnu, trois cycles de fermeture à 320, Ctrl-clic natif, médias bloqués et liens sans JavaScript. Galerie et modale mesurées à 320/390/768/1440 : aucun overflow interne, image et dialogue dans la fenêtre, bouton de fermeture de 44 px, focus restauré. Les preuves incluent des images volontairement bloquées et ne représentent pas une panne de production.

## Preuves et périmètre

Dossier externe : `C:/Users/Admin/Documents/inastia-frontier-evidence/responsive/`. `measurements.json` contient les 80 vues et les six stress ; `reflow-640.json` contient les huit contrôles complémentaires. `check.cjs` et `reflow.cjs` décrivent le protocole. Vingt-quatre PNG ordinaires couvrent les huit routes à 320/768/1920 ; cinq PNG supplémentaires montrent les cas ciblés. Aucune capture d’échec ordinaire, puisqu’aucun seuil de la matrice n’a échoué. Le dossier voisin `portfolio/` contient neuf PNG et son rapport.

Ce contrôle reste Chrome desktop automatisé : pas de test utilisateur, de lecteur d’écran réel, de clavier logiciel réel, de zoom natif attesté, ni de comparaison Firefox/WebKit dans ce lot. Pas de soumission de formulaire, de données personnelles, de Lighthouse ou de publication. Les contrôles cross-browser et artistiques du parent restent distincts.


## Recontrôle après dernier espacement contact

Sur les assets `client-DXJcXiA6.js` / `client-C-qFlqLV.css`, le contact avec `?intent=gestion` a été revérifié à 320 et 390 px : aucun débordement, valeur `gestion` reprise. Le select commence à y633,61 (320 px) et y598,59 (390 px), hauteur 48 px. À 390, son début est donc avant 600 px ; l’intégralité du select finit à y646,59. Deux PNG et `responsive/contact-final.json` conservent cette distinction. Aucun champ focalisé, renseigné ou soumis dans ce recontrôle.
