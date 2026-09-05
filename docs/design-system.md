# Direction graphique Inastia V4

La V4 conserve la structure et la palette claire sable, ciel et mer : grands titres, trois cartes de services, présentation familiale, portfolio discret et parcours vers le contact. Le hero montre une illustration de l’accueil : porte-clés Inastia, clé et détails de soin devant une arche ciel/mer.

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

Le hero associe une promesse courte et une illustration de la remise des clés, sans photographie dominante. Le manifeste alterne avec trois cartes de services, une présentation familiale, un portfolio en lignes compactes, une méthode et les zones locales. Les symboles maison, annonce et clé illustrent les prestations réelles, en cohérence avec l’illustration du hero.

Les pages secondaires partagent un hero typographique, une illustration de service et une petite photo légendée, puis un sommaire, des sections et une FAQ. Le formulaire et les pages légales utilisent la même palette claire. Sur mobile, les colonnes se superposent ; les titres doivent garder les marges communes.

## Motion et rendu statique

`src/art.ts` fournit les illustrations CSS/SVG et la fonction `hospitalityArt(locale)` pour le hero FR/EN. Le SVG est intégré au HTML et reste visible sans JavaScript. Il est décoratif : les labels et le texte HTML portent le message métier.

`src/motion.ts` gère GSAP/ScrollTrigger, la pause/reprise et la visibilité. Le CSS anime le porte-clés, la clé et les vagues lorsque l’illustration est active. La préférence `prefers-reduced-motion` initialise une pause ; l’utilisateur peut explicitement reprendre. Respecter cet état, la suspension hors écran/onglet masqué et la reprise BFCache. Une capture fixe ne démontre pas la qualité temporelle du mouvement.

## Sources et régénération

- Modifier le SVG source dans `src/art.ts` et maintenir les libellés FR/EN ensemble.
- `npx tsx scripts/render-share.ts` réutilise le SVG français et génère `public/images/inastia-share.png` en 1200 × 630 via Sharp. Cette image est statique ; sa génération est manuelle.
- Le site ne nécessite ni modèle GLB, ni Three.js, ni Blender. Les anciennes preuves Blender restent hors dépôt.
- Les photographies originales `villa_amichi.webp`, `casa_verde.webp`, `villa_lova.webp` représentent respectivement Villa d’Amichi / Pinarello-Zonza, Casa Verde / Pinarello-Zonza et Villa Lova / Cala d’Oro-Solenzara.
- `npm run assets` génère leurs variantes AVIF/WebP à 240, 480, 800 et 1200 pixels et copie les polices/licences. Il ne régénère pas l’image sociale.

Conserver les localisations réelles des photographies. Le porte-clés et le décor sont des illustrations. Le discours reste celui d’une conciergerie familiale : ne pas inventer technologie, résultats, avis ou couverture géographique pour accompagner l’esthétique.
