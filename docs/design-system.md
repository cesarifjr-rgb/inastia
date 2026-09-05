# Direction graphique Inastia

**Atlas de proximité** est la direction Design Frontier : fond clair, bleu profond, carte de Corse sourcée, comparatifs ouverts et pages éditoriales. La proposition reste celle d’une conciergerie familiale pour propriétaires. La carte aide à se repérer ; elle ne représente pas une disponibilité garantie.

## Sources et tokens

`src/client.ts` importe dans cet ordre `base.css`, `service-art.css`, `frontier.css`, puis `motion.css`. Le reset et les éléments communs restent dans `base.css`. Les tokens et compositions courants sont dans `src/frontier.css`, bloc `:root` ; l’ancien `styles.css` a été supprimé.

| Token | Valeur | Usage |
|---|---|---|
| `--sand` | `#f4f7f5` | Fond principal |
| `--surface` | `#ffffff` | Surface claire |
| `--surface-up` | `#e8f0f1` | Surface secondaire |
| `--ink` | `#123e52` | Texte principal |
| `--blue` | `#145b80` | Commandes |
| `--muted` | `#48636e` | Texte secondaire |
| `--line` | `#a4bdc5` | Séparateurs |
| `--paper` | `#deedf0` | Sections bleutées |
| `--accent` | `#a94b28` | Accent et focus |
| `--gutter` | `clamp(20px, 4.5vw, 88px)` | Marges |
| `--max` | `1520px` | Largeur maximale |
| `--radius` | `2px` | Angles des commandes |
| `--space-section` | `clamp(56px, 6.5vw, 112px)` | Rythme vertical |
| `--motion-short` / `--motion-enter` | `180ms` / `720ms` | Durées de référence |

Space Grotesk compose les titres et Manrope le corps. Les accents éditoriaux utilisent Georgia/Times en italique ; aucune police serif distante n’est chargée. Les fontes variables WOFF2 sont locales et leurs licences restent dans `public/fonts/`. Vérifier contraste, focus, labels et états d’erreur après toute modification de palette ; la couleur seule ne suffit pas à exprimer une erreur ou une sélection.

## Composition et composants

L’accueil articule proposition/atlas, choix de délégation, équipe, territoire, maisons et soin, avis voyageurs, premier échange, FAQ et contact. Les trois offres utilisent des lignes éditoriales : identité et illustration à gauche, responsabilités et coût à droite sur grand écran ; empilement sur téléphone. Les trois illustrations d’origine (maison, annonce, clé) sont fournies par `serviceArt(service.index)` et `service-art.css`. Leur index stable conserve l’association à l’offre lors d’un réordonnancement.

`servicesFor(locale)` alimente les résumés d’accueil et d’offre. Chaque offre précise ce qui est confié, conservé et à convenir financièrement. Le guide `orientation.ts` est une aide facultative : `fieldset`/`legend`, quatre labels de radios, une colonne mobile et deux colonnes bureau. Les labels doivent revenir à la ligne sans troncature. La réponse comporte motif, réserve et liens ; elle ne remplace pas le comparatif statique.

`heroAtlas` et `territoryAtlas` dans `src/atlas.ts` utilisent `public/images/corsica-outline.svg`. Les repères sont des centres communaux, distincts des lieux-dits présents dans les libellés. Les liens HTML restent accessibles sans carte interactive. Les sources Natural Earth et geo.api.gouv.fr, leur date et leurs licences sont documentées dans [geography.md](design-frontier/geography.md).

Le portfolio expose trois vrais biens. Un dialogue natif agrandit la photographie ; nom et localisation restent visibles, Échap ferme et le focus revient au lien. L’historique utilise des fragments de bien, sans données personnelles. Sans JavaScript, le lien pointe directement vers la photographie. Cette galerie ne promet ni disponibilité ni réservation.

Les pages secondaires combinent titre, résumé, photographie légendée, sommaire, sections et FAQ. Les services conservent leur illustration et le partage des rôles ; audit, équipe et territoire ont des résumés adaptés. Les titres déjà numérotés ne reçoivent pas d’index décoratif supplémentaire. Les colonnes s’empilent sur mobile.

Le contact garde le besoin choisi modifiable, les aides persistantes et les champs facultatifs explicites. Les erreurs de `contact.ts` associent message et champ avec `aria-describedby`/`aria-invalid`, proposent un résumé de navigation et permettent la correction sans perdre les données. Les états de succès reposent sur une réponse confirmée, pas sur une simple animation.

## Mouvement et repli statique

`motion.ts` utilise IntersectionObserver et le cycle de page ; `motion.css` définit entrées, pause et mouvements CSS. Aucune dépendance GSAP/ScrollTrigger n’est requise. Le bouton Animations, la préférence reduced-motion, la visibilité des illustrations, l’onglet masqué et `pageshow` participent à l’état courant. Ne pas ajouter un moteur parallèle pour une nouvelle section : réutiliser `data-reveal` lorsque pertinent et vérifier le repli sans JavaScript.

Les textes, cartes et photographies restent disponibles sans animation. L’ancien `hospitalityArt` de `art.ts` est conservé provisoirement ; il ne constitue plus le hero ni la carte sociale. Le PNG 1200 × 630 est généré par `npx tsx scripts/render-share.ts` à partir de l’atlas et du contour sourcé, puis inspecté séparément. Une image fixe ne démontre pas la qualité temporelle du mouvement.

## Contenu et maintenance

Ne pas inventer portraits, prix, délais, résultats ou données de mission pour compléter une composition. Les avis sont statiques, sourcés, datés et attribués aux voyageurs. Les originaux représentent Villa d’Amichi (Pinarello/Zonza), Casa Verde (Pinarello/Zonza) et Cala Lova (Cala d’Oro/Solenzara). `npm run assets` génère les variantes et copie les licences ; il ne régénère pas l’image sociale.

Les procédures de modification et de retour arrière sont dans [maintenance.md](design-frontier/maintenance.md). Les constats du parcours sont dans [user-review.md](design-frontier/user-review.md) : revue interne, périmètre explicite et vérification finale de livraison à distinguer des passes intermédiaires.
