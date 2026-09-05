# Atlas — deux prototypes de mouvement, comparaison technique

5 septembre 2026. Périmètre : `motion-translate.html` et `motion-clip.html`, dérivés de `atlas.html`, mêmes assets. Aucun fichier de l’application, CSS global, `motion.ts`, dépendance ou déploiement modifié par ce prototype. Les contrôles pause/rejeu servent à comparer l’effet ; ils ne sont pas une proposition d’interface finale.

## Mécanismes

1. **Translation CSS unique :** contour déplacé de 12 px vers sa position finale en 720 ms, `cubic-bezier(.2,.7,.2,1)`, sans fondu. L’île entière reste visible dès le début.
2. **Révélation CSS unique :** `clip-path:inset(0 0 100% 0)` vers `inset(0 0 0 0)`, même durée et easing. Le contour se découvre du nord vers le sud. Aucun texte ou lien n’est concerné par le clipping.

Les titres, la proposition, les cinq liens territoriaux et le CTA existent statiquement et ne sont jamais animés/masqués. À ≤650 px, l’atlas reprend sa liste mobile existante : contour et contrôles sont absents, aucune animation n’est active. Avec `prefers-reduced-motion:reduce`, le contour est immédiatement complet et immobile. Sans JS, les boutons d’inspection restent masqués et le contenu fonctionne ; l’animation CSS unique peut encore jouer si la préférence est normale.

Une très petite couche JS commune pilote uniquement pause/rejeu via les animations CSS natives (`getAnimations`, pause/play), pas de boucle par frame. Le prototype a été ajusté pour que la pause reste effective après un rejeu impératif ; ce cas a ensuite été vérifié. Aucun nouveau moteur graphique.

## Protocole exécuté

Serveur local `http://127.0.0.1:4201`, pages `/motion-translate.html` puis `/motion-clip.html`. Les captures A/B/C et l’inspection principale étaient terminées avant les mesures. Chrome 152 headless, viewport 1440×1000 CSS px, DPR 1, ralentissement CPU Chrome ×4, réseau local non bridé. Images et fontes déjà chargées. Trois fenêtres de rejeu par variante, chacune comprenant le clic de rejeu, les 720 ms d’effet et environ 330 ms de marge. Les fenêtres observées durent 1 052,6 à 1 061,9 ms ; **ce ne sont pas des durées de frame ni des durées de navigation**.

Trace Chrome CDP avec événements `devtools.timeline`, `toplevel` et marqueurs `blink.user_timing`. Les événements du renderer principal sont isolés entre deux marqueurs. Les intervalles RunTask et ThreadControllerImpl::RunTask sont fusionnés pour ne pas compter deux fois les tâches imbriquées. Paint/Layout/UpdateLayoutTree sont rapportés séparément, sans les additionner au temps total déjà inclus. Aucune capture pendant les traces.

Preuves hors dépôt : [mesures et assertions](C:/Users/Admin/Documents/inastia-frontier-evidence/motion-prototypes/measurements.json), [script réutilisable](C:/Users/Admin/Documents/inastia-frontier-evidence/motion-prototypes/profile.mjs), six fichiers `*-runN.trace.json` dans le même dossier.

## Résultats mesurés

| Coût dans la fenêtre de rejeu | Translation | Clip-path |
| --- | ---: | ---: |
| Temps occupé du thread principal, médiane de 3 | 11,512 ms | 12,142 ms |
| Étendue des 3 mesures | 10,275–15,796 ms | 10,852–14,286 ms |
| Plus longue tâche observée | 3,476 ms | 3,278 ms |
| Paint par rejeu | 0 / 0 / 0 | 4 / 4 / 4 |
| Temps Paint par rejeu | 0 / 0 / 0 ms | 1,608 / 1,611 / 1,765 ms |
| Layout par rejeu | 0 | 0 |
| UpdateLayoutTree, nombre | 5 / 5 / 5 | 5 / 5 / 6 |

Les plages se recouvrent : ces trois échantillons ne démontrent pas une différence statistiquement significative du temps total occupé. La différence reproductible est l’absence de Paint du renderer principal dans la translation et quatre Paint dans le clip-path. Le coût du clip reste très faible sur cet appareil ; il n’est pas qualifié de lent. Le coût GPU, les frames présentées/perdues, Safari/iOS et l’INP ne sont **pas mesurés**. Une trace headless CPU×4 ne remplace pas un appareil physique.

## Poids

Comparés au fichier Atlas statique (10 371 octets), gzip calculé localement :

| Variante complète de démonstration | HTML brut | HTML gzip | Ajout brut | Ajout gzip |
| --- | ---: | ---: | ---: | ---: |
| Translation | 12 670 | 4 354 | 2 299 | 764 |
| Clip-path | 12 662 | 4 363 | 2 291 | 773 |

Chaque variante comprend le même JS de contrôles de 1 174 octets brut. Les tailles n’incluent pas une nouvelle copie des assets : CSS/SVG/polices sont identiques et réutilisés. Les gzip sont un outil de comparaison de fichiers, pas des octets réseau observés.

## Vérifications et intérêt visuel

- Pause réelle après rejeu : temps courant, transform/clip-path et playState inchangés entre deux échantillons séparés de 180 ms ; reprise terminant à720 ms.
- Réduction du mouvement : zéro animation, transform/clip-path revenus à `none`, île complète.
- Mobile390 : image `display:none`, zéro animation ; liste accessible présente.
- Sans JS desktop : titre et CTA visibles, contrôles cachés, contour complet en fin d’effet. Aucun lien de contact n’a été activé et aucun formulaire n’a été soumis.
- Captures examinées à360 ms d’effet : [translation](C:/Users/Admin/Documents/inastia-frontier-evidence/motion-prototypes/translate-midpoint-1440.png) et [clip-path](C:/Users/Admin/Documents/inastia-frontier-evidence/motion-prototypes/clip-midpoint-1440.png). États statiques et mobile dans le même dossier.

**Choix proposé : translation.** Elle apporte une courte mise en place spatiale en gardant la géographie entière. Le clip-path produit un dévoilement plus perceptible, mais la coupe provisoire du bas de l’île ressemble à un masque de révélation ; son bénéfice ne paraît pas nécessaire au concept de repère territorial. Ce jugement est artistique, pas un résultat de test utilisateur. Aucune hiérarchie importante ne dépend de l’effet. Le rendu statique reste le résultat principal.

## Conséquence proposée pour l’intégration, non implémentée ici

Le nouveau récit Atlas n’a pas besoin des anciennes timelines de hero et de parallax GSAP pour montrer son contenu. Remplacer leurs usages devenus inutiles par IntersectionObserver + classes CSS pourrait enlever les deux chunks GSAP/ScrollTrigger : **112 714 octets bruts /44 608 octets gzip calculés dans la baseline**. Ce montant est une possibilité de retrait des bibliothèques, pas le gain net final : il faut compter le nouveau contrôleur et vérifier les imports restants.

Préserver le contenu visible par défaut sans JS ; limiter les révélations aux éléments non essentiels ; gérer focus et ancres, reduced-motion, pause explicite, sortie viewport, page masquée et restauration BFCache. Les trois animations d’offres appréciées peuvent rester CSS, avec une porte de visibilité par groupe. Documenter le déclencheur et l’arrêt de chaque effet. Faire un test du flux intégré avant de retirer les dépendances, puis relever les poids et les mesures avec le protocole baseline. Aucun code global n’est écrit pour l’instant.

## Sources primaires

[web.dev — guide des animations performantes](https://web.dev/articles/animations-guide) recommande de privilégier transform/opacity lorsque possible et de mesurer paint/layout pour les autres propriétés ; il déconseille de forcer systématiquement une couche avec will-change. [MDN transform](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transform) et [MDN clip-path](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/clip-path) décrivent ces propriétés et leur compatibilité. Leur support ne garantit pas le même chemin de rendu sur tous les moteurs. [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) décrit la préférence système utilisée pour l’état statique. Seul le navigateur indiqué dans ce protocole a été exécuté ici.
