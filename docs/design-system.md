# Direction graphique Inastia V3

La V3 conserve la structure de la V2 appréciée par le propriétaire : grands titres, trois cartes de services, présentation familiale, portfolio discret et parcours vers le contact. La palette devient claire, inspirée de la plage, du sable et du ciel. Le hero montre un relief côtier animé — soleil, mer et dunes — sans bâtiment ni villa 3D.

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
| `--max` | `1600px` | Largeur des conteneurs |

Space Grotesk compose les titres ; Manrope porte paragraphes et commandes. Les fontes variables WOFF2 sont locales et leurs licences sont conservées dans `public/fonts/`. Les accents de titres utilisent la couleur, sans italique. Garder des contrastes lisibles sur les fonds clairs et vérifier les commandes, légendes et champs après chaque changement de palette.

## Composition

Le hero associe une promesse courte et un horizon côtier illustré, sans photographie dominante. Le manifeste alterne avec trois cartes de services, une présentation familiale, un portfolio en lignes compactes, une méthode et les zones locales. Les symboles maison, annonce et clé illustrent les prestations réelles, indépendamment du paysage du hero.

Les pages secondaires partagent un hero typographique, une illustration de service et une petite photo légendée, puis un sommaire, des sections et une FAQ. Le formulaire et les pages légales utilisent la même palette claire. Sur mobile, les colonnes se superposent ; les titres doivent garder les marges communes.

## Motion et repli

`src/art.ts` fournit les illustrations CSS/SVG et le paysage statique de repli ; `src/motion.ts` gère GSAP et la pause/reprise. `src/scene.ts` fait le lien avec le DOM. `src/scene.worker.ts` charge/analyse le GLB et effectue le rendu Three.js dans un Web Worker avec OffscreenCanvas, limité à 30 images par seconde sur mobile.

La 3D est décorative. Garder le contenu HTML visible sans JavaScript, le SVG de repli et la mention indiquant un paysage illustré. La préférence `prefers-reduced-motion` initialise une pause ; l’utilisateur peut explicitement reprendre. Respecter cet état, la suspension hors écran/onglet masqué et la reprise BFCache. Sans Worker, OffscreenCanvas ou WebGL, ou après un échec de chargement/rendu, revenir au SVG. Une capture fixe ne démontre pas la qualité temporelle du mouvement.

## Sources et régénération

- `blender --background --python scripts/create-coast.py` crée une scène côtière neuve, sans lire une scène utilisateur, et exporte le GLB versionné `public/models/inastia-coast.glb`.
- Le fichier source `inastia-coast.blend` et les rendus de travail restent dans `../inastia-v3-evidence/`, hors dépôt.
- Après cette génération, `blender --background --python scripts/render-share.py` ouvre la source créée et produit `public/images/inastia-share.png`, en 1200 × 630. La carte sociale reprend le relief côtier, le sable et le soleil.
- Les photographies originales `villa_amichi.webp`, `casa_verde.webp`, `villa_lova.webp` représentent respectivement Villa d’Amichi / Pinarello-Zonza, Casa Verde / Pinarello-Zonza et Villa Lova / Cala d’Oro-Solenzara.
- `npm run assets` génère leurs variantes AVIF/WebP à 240, 480, 800 et 1200 pixels et copie les polices/licences. Il ne régénère ni la 3D ni l’image sociale.

Conserver les localisations réelles des photographies. Le relief côtier est une illustration, pas une photographie d’une plage précise. Le discours reste celui d’une conciergerie familiale : ne pas inventer technologie, résultats, avis ou couverture géographique pour accompagner l’esthétique.
