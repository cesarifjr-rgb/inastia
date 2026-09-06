# Direction graphique Inastia

La direction conserve la palette claire sable, ciel et mer et l’illustration d’accueil : porte-clés Inastia, clé et détails de soin devant une arche ciel/mer. La version actuelle repart de `900c977` et présente une seule offre de gestion complète, avec ses responsabilités et son premier contact. La direction Atlas du projet précédent n’est pas utilisée.

## Tokens

Source de vérité : `src/styles.css`, bloc `:root`.

| Token | Valeur | Usage |
|---|---|---|
| `--sand` | `#f8f3e9` | Fond principal sable |
| `--surface` | `#fffaf3` | Surfaces de cartes |
| `--surface-up` | `#e7f0f4` | Surfaces secondaires bleutées |
| `--ink` | `#17455b` | Texte principal |
| `--blue` | `#1c6285` | Accent et commandes |
| `--muted` | `#566973` | Texte secondaire |
| `--line` | `#c7d4d6` | Séparateurs |
| `--paper` | `#dfeef4` | Sections ciel clair |
| `--gutter` | `clamp(24px,4.5vw,88px)` | Marges fluides |
| `--max` | `1280px` | Largeur des conteneurs |

Space Grotesk compose les titres ; Manrope porte paragraphes et commandes. Les fontes variables WOFF2 sont locales et leurs licences sont conservées dans `public/fonts/`. Les accents de titres utilisent la couleur, sans italique. Garder des contrastes lisibles sur les fonds clairs et vérifier les commandes, légendes et champs après chaque changement de palette.

## Composition

L’accueil conserve le hero sauvegardé et détaille la gestion complète en trois volets : annonce, voyageurs et maison. Les cartes et leurs illustrations d’origine présentent ces composantes, pas trois offres commerciales. `src/management.css` porte cette composition ; les cartes renvoient aux sections de la même page de gestion. Le cadre commun précise les décisions conservées et les coûts à convenir. Une scène de maison SVG/CSS en volume, dans `management-art.ts` et `management-art.css`, permet d’explorer les trois volets avec des radios natives. Elle est une illustration, jamais un bien réel ou un tableau de bord client.

La présentation familiale reste collective, sans prénom ni portrait non autorisé. Les maisons gardent leurs noms et localisations réels. Le bloc de suivi expose les étapes du service ; ne pas le présenter comme une preuve de mission attribuée à une maison. Les avis Google sont explicitement des extraits de voyageurs, sourcés et statiques, avec date du relevé global. Ils éclairent l’accueil vécu, sans démontrer à eux seuls le suivi propriétaire.

Les pages secondaires associent le hero typographique à un résumé concret des prestations et une petite photo légendée, puis un sommaire, des sections et une FAQ. La page de gestion complète ajoute la scène illustrée et quatre sections : annonce/calendrier, voyageurs, préparation/signalement, puis décisions/coût/cadre. Les anciennes pages annonce et rotation ne sont plus générées ; leurs URLs sont redirigées vers cette page. Sur mobile, les colonnes se superposent. Le corps principal est à 16 px, les labels et aides utiles à 13–14 px ; le H1 d’accueil est limité à 80 px sur grand écran et 40–48 px sur mobile.

Le contact rapproche les champs de l’introduction. Le motif choisi reste visible et modifiable ; le parcours audit annonce un rappel sous 24 h selon la convenance du propriétaire, avec téléphone obligatoire. Ce délai concerne le premier échange, pas la réalisation de l’analyse. Conserver l’aide permanente, les états d’envoi et la place réservée à l’antispam. Les champs utilisent un fond opaque `#fffefb`, une bordure `#657b88` et une aide `#566973`. Vérifier les contrastes et la lisibilité des états réels après toute évolution.

## Motion et rendu statique

`src/art.ts` fournit les illustrations `serviceArt(index)` réutilisées pour les volets de gestion et `hospitalityArt(locale)` pour le hero FR/EN. Les illustrations sont intégrées au HTML et restent visibles et statiques sans JavaScript. Elles sont décoratives : les labels et le texte HTML portent le message métier. Les mouvements des volets suivent le même bouton de pause et la même préférence de réduction des animations que le hero. `management-art-client.ts` observe la scène et l’état de pause, puis suspend son mouvement hors écran, onglet masqué et pendant la suspension de page ; la sélection des volets est définie dans le CSS.

`src/motion.ts` gère GSAP/ScrollTrigger, la pause/reprise et la visibilité. Le CSS anime le porte-clés, la clé et les vagues lorsque l’illustration est active. La préférence `prefers-reduced-motion` initialise une pause ; l’utilisateur peut explicitement reprendre. Respecter cet état, la suspension hors écran/onglet masqué et la reprise BFCache. Une capture fixe ne démontre pas la qualité temporelle du mouvement.

La scène de gestion associe la maison à trois diagrammes originaux : calendrier, échanges voyageurs et vérifications. Ils restent visibles sans JavaScript et en pause. Seul le détail correspondant au volet sélectionné s’anime, quand la scène est visible et les animations autorisées. Ces diagrammes sont séparés du mouvement de la maison pour garder les autres repères immobiles ; aucun calendrier, échange ou statut ne représente une donnée client réelle.

Les références HostnFly et WeHost, consultées le 6 septembre 2026 à la demande de l’utilisateur, inspirent la clarté des bénéfices, les illustrations de tâches et le parcours de prise en charge. La palette, le hero, les dessins, les textes et les limites commerciales restent propres à Inastia. Ne pas reprendre leurs actifs, promesses de revenus, partenariats ou preuves chiffrées.

## Sources et régénération

- Modifier le hero et les petites illustrations dans `src/art.ts`, la nouvelle scène dans `src/management-art.ts` / `.css`, et maintenir les libellés FR/EN ensemble. Pour le contenu commercial, modifier `src/home.ts` et `src/content/pages.ts`. Ne pas réécrire le moteur de mouvement pour une modification éditoriale.
- `npx tsx scripts/render-share.ts` réutilise le SVG français et génère `public/images/inastia-share.png` en 1200 × 630 via Sharp. Cette image est statique ; sa génération est manuelle.
- Le site ne nécessite ni modèle GLB, ni Three.js, ni Blender. Les anciennes preuves Blender restent hors dépôt.
- Les photographies originales `villa_amichi.webp`, `casa_verde.webp`, `villa_lova.webp` représentent respectivement Villa d’Amichi / Pinarello-Zonza, Casa Verde / Pinarello-Zonza et Cala Lova / Cala d’Oro-Solenzara.
- `npm run assets` génère leurs variantes AVIF/WebP à 240, 480, 800 et 1200 pixels et copie les polices/licences. Il ne régénère pas l’image sociale.

Les styles et contenus repartent de la version sauvegardée `900c977`. Les mesures antérieures, notamment celles du projet Frontier distinct, restent des preuves historiques et ne constituent pas la recette de cette nouvelle version. Les trois documents légaux restent inchangés et les frais, le linge, les consommables et les interventions sont précisés au devis, sans inclusion automatique dans la commission.

Conserver les localisations réelles des photographies. Le porte-clés et le décor sont des illustrations. Le discours reste celui d’une conciergerie familiale : ne pas inventer technologie, résultats, avis ou couverture géographique pour accompagner l’esthétique.
