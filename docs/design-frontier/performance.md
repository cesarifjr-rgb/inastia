# Performance — comparaison Design Frontier

Mesures du 5 septembre 2026. L’accueil de la preview charge environ **39,3 % d’octets de moins** selon le comptage Lighthouse. Le JavaScript applicatif passe de 49 037 à 5 537 octets gzip calculés, soit **−88,7 %**, après suppression de GSAP/ScrollTrigger. Le score performance passe de 98 à 99 sur mobile et reste à 100 sur desktop. Un seul échantillon par profil et par version : ces résultats ne sont pas des médianes de production ni une preuve de causalité.

Baseline : https://inastia.fr/, référence `900c977`, mesurée à 17:14:14 UTC puis 17:14:42 UTC. Après : [preview de branche](https://inastia-ozxqtakj4-inastia.vercel.app/), référence `26d84a0`, mesurée à 18:23:10 UTC puis 18:23:21 UTC. Les deux documents finaux répondent HTTP 200 et correspondent à l’accueil Inastia, avec `client-DXJcXiA6.js` et `client-C-qFlqLV.css`.

| Mesure Lighthouse | Mobile avant | Mobile après | Desktop avant | Desktop après |
| --- | ---: | ---: | ---: | ---: |
| Performance | 98 | 99 | 100 | 100 |
| Accessibilité | 100 | 100 | 100 | 100 |
| Bonnes pratiques | 100 | 92 | 100 | 92 |
| SEO | 100 | 69 | 100 | 69 |
| FCP | 1 566,014 ms | 1 318,547 ms | 405,523 ms | 430,797 ms |
| LCP | 2 202,514 ms | 2 068,547 ms | 493,523 ms | 580,797 ms |
| TBT | 2,5 ms | 0 ms | 0 ms | 0 ms |
| CLS | 0 | 0 | 0 | 0 |
| Requêtes comptées | 8 | 8 | 8 | 8 |
| Total compté | 246 477 octets | 149 587 octets | 246 440 octets | 149 604 octets |
| Scripts | 124 289 octets / 3 requêtes | 15 383 / 2 | 124 285 / 3 | 15 382 / 2 |
| CSS | 43 064 octets / 1 requête | 43 578 / 1 | 43 038 / 1 | 43 577 / 1 |
| Fontes | 47 482 octets / 2 requêtes | 47 318 / 2 | 47 498 / 2 | 47 318 / 2 |
| Document HTML | 31 201 octets | 38 780 octets | 31 201 octets | 38 780 octets |
| Images | 0 octet / 0 requête | 4 172 / 1 | 0 / 0 | 4 172 / 1 |

Le LCP mobile baisse de 134 ms ; le LCP desktop augmente de 87 ms, tout en restant à 581 ms. Les deux satisfont le garde-fou de 2,5 s. L’image initiale est le contour SVG de Corse ; les photos du portfolio restent différées. Ces totaux concernent le chargement initial, pas un parcours complet avec toutes les photos ouvertes.

Les scores 92 en bonnes pratiques et 69 en SEO sont conservés tels que mesurés. Les audits concernés identifient précisément deux caractéristiques de la preview : le header Vercel `x-robots-tag: noindex` empêche son indexation ; le script de commentaires `vercel.live/_next-live/feedback/feedback.js` est injecté par Vercel puis bloqué par la CSP existante. Il apparaît comme une deuxième requête script, avec statut −1 et zéro octet transféré. L’erreur CSP est présente dans la console et dans l’audit Issues. Ce script n’appartient pas au bundle applicatif. Aucun header n’a été retiré et aucune CSP élargie pour améliorer les scores. Il n’y a pas d’erreur runtime Lighthouse ni d’avertissement de mesure.

**Protocole conservé.** Lighthouse 13.4.1 et Headless Chrome 152, toutes les catégories standard, animations normales ; mobile puis desktop exécutés séquentiellement, sans autre navigateur de QA ou de profilage. Les objets `configSettings` complets avant/après sont identiques, pas seulement les principales dimensions.

| Paramètre | Mobile | Desktop |
| --- | --- | --- |
| Écran CSS et DPR | 412×823, DPR 1,75 | 1350×940, DPR 1 |
| Méthode | Simulation Lighthouse | Simulation Lighthouse |
| RTT / débit simulés | 150 ms / 1 638,4 Kbps | 40 ms / 10 240 Kbps |
| Ralentissement CPU | ×4 | ×1 |
| Benchmark du poste avant → après | 3 792,5 → 3 935 | 3 537 → 3 600 |
| `disableStorageReset` | false → false | false → false |

La preview étant protégée, son accès autorisé a d’abord établi un cookie dans un Chrome éphémère. L’URL propre et les bundles attendus ont été vérifiés avant le run. Le cache navigateur a été vidé explicitement, puis Lighthouse a appliqué son reset standard ; celui de la version 13.4.1 conserve les cookies tout en nettoyant les types de stockage configurés et le cache. Il n’a donc pas été nécessaire de désactiver le reset. Chaque profil utilise un Chrome distinct. L’origine, le contexte d’accès et le cache CDN restent différents de la production : cette limite accompagne la comparaison, même si les réglages Lighthouse sont identiques.

Les requêtes HEAD séparées confirment HTTP 200 et `Content-Encoding: br` sur le HTML, le JS et la CSS. Comme dans la baseline, les transferts comptés ici par Lighthouse sont proches des tailles décodées. Ils restent présentés sans correction ; ce ne sont pas les gzip calculés ci-dessous.

| Fichiers applicatifs | Avant brut | Après brut | Avant gzip calculé | Après gzip calculé |
| --- | ---: | ---: | ---: | ---: |
| JS principal | 11 035 | 15 296 | 4 429 | 5 537 |
| JS total, avec chunks d’animation avant | 123 749 | 15 296 | 49 037 | 5 537 |
| CSS | 42 858 | 43 473 | 9 800 | 9 673 |
| Deux fontes WOFF2 | 47 124 | 47 124 | — | — |

Le principal grossit de 1 108 octets gzip, avec les nouveaux comportements intégrés, mais la disparition des deux chunks GSAP réduit fortement le total. La CSS gagne 615 octets bruts et perd 127 octets gzip. Les calculs portent sur les fichiers dist dont les noms correspondent aux ressources réellement demandées. La requête de barre Vercel bloquée ne télécharge aucun script supplémentaire.

| Budget initial | Résultat final | État |
| --- | --- | --- |
| JS critique ≤8 000 octets gzip | 5 537 | Respecté |
| Total JS chargé ≤60 000 octets gzip | 5 537 applicatifs ; barre Vercel bloquée à 0 octet | Respecté pour ce chargement |
| CSS ≤15 000 octets gzip | 9 673 | Respecté |
| Fontes ≤50 000 octets WOFF2 | 47 124 | Respecté |
| Total Lighthouse mobile ≤425 000 octets | 149 587 | Respecté |
| Total Lighthouse desktop ≤525 000 octets | 149 604 | Respecté |
| LCP ≤2 500 ms | 2 068,547 mobile / 580,797 desktop | Respecté |
| TBT ≤50 ms / CLS ≤0,1 | 0 / 0 dans les deux profils | Respecté |
| Photo hero ≤120/220 ko | Aucun raster hero | Sans objet |
| Travail principal <4 ms par frame | Les traces mesurent des tâches, pas une distribution par frame | Non établi |

**Coût des effets.** Après Lighthouse, 21 traces ont été enregistrées : trois répétitions de sept scénarios sur la preview, Chrome 152.0.7977.76, 1440×1000, DPR1, CPU×4. Pages, fontes et média du dialogue sont réchauffés. Aucune capture d’écran ni autre QA pendant une trace. Les durées ci-dessous sont l’union des tâches du thread principal dans la fenêtre, sans double comptage ; elles incluent les opérations du scénario, les observations et les marques.

| Scénario | Fenêtre médiane | Travail principal médian [min–max] | Plus longue tâche | Paint / Layout par fenêtre |
| --- | ---: | ---: | ---: | --- |
| Entrée naturelle de l’atlas | 716,4 ms | 41,09 ms [36,73–43,76] | 5,91 ms | 9–11 / 6–7 |
| Défilement et révélation processus | 625,1 ms | 35,38 ms [34,16–40,56] | 8,33 ms | 9 / 2 |
| Illustration 1 visible | 1 060,3 ms | 6,03 ms [3,73–6,98] | 2,02 ms | 0 / 0 |
| Illustration 2 visible | 1 056,0 ms | 6,78 ms [4,25–7,59] | 2,04 ms | 0 / 0 |
| Illustration 3 visible | 1 056,7 ms | 6,50 ms [4,89–7,15] | 1,82 ms | 0 / 0 |
| Trois illustrations hors écran | 1 061,2 ms | 3,31 ms [3,13–5,48] | 2,42 ms | 0 / 0 |
| Ouverture et fermeture du dialogue | 828,2 ms | 87,82 ms [84,70–88,44] | 19,12 ms | 6 / 8 |

Les fenêtres «illustration 1» et «illustration 2» montrent les groupes 1 et 2 ; celle de l’illustration 3 montre les groupes 2 et 3. Les mesures portent sur cette portion de page réellement visible, pas sur un élément artificiellement isolé. Hors écran, les trois animations sont en pause et leurs transformations et phases restent strictement identiques avant/après dans les trois répétitions. Le thread principal n’est pas totalement inactif, mais aucun Paint ni Layout n’est enregistré dans ces fenêtres stabilisées.

L’entrée du hero comprend encore le travail de la page après navigation ; la révélation comprend le défilement ; le dialogue comprend clics, création du contenu, historique, affichage et fermeture. Leurs Paint/Layout ne peuvent pas être attribués au seul mouvement. Les fenêtres réelles comprennent les actions et leur attente, d’où environ 828 ms pour le dialogue. Aucune tâche d’au moins 50 ms n’est observée dans les 21 fenêtres. Ces données ne mesurent ni FPS, ni coût GPU, ni énergie, ni latence réelle d’interaction ; elles ne constituent pas une comparaison directe avec les prototypes isolés.

**INP et p75 terrain : absents.** Le TBT de laboratoire ne fournit pas d’INP. Aucune donnée CrUX/RUM, aucun percentile de visiteurs et aucune conclusion de conformité Core Web Vitals terrain ne sont disponibles. Les changements modestes de LCP entre deux runs uniques, les différences d’origine et de benchmark du poste imposent de conserver cette réserve.

Les rapports JSON/HTML, les 21 traces, les mesures non arrondies, les headers et scripts reproductibles se trouvent dans `C:/Users/Admin/Documents/inastia-frontier-evidence/performance-final` : `home-mobile.report.*`, `home-desktop.report.*`, `comparison.json`, `header-proof.json`, `protocol.md`, `effects/measurements.json`, `effects/summary.json` et `effects/*.trace.json`. Le dossier a été contrôlé : aucune valeur d’accès partagée n’y figure et aucun cookie n’a été exporté. Les scripts attendent l’accès via variable d’environnement. Tous les navigateurs de mesure ont été fermés. Aucune source du site n’a été modifiée pendant cette mesure.
