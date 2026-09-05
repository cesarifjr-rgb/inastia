# Direction graphique Inastia

La direction conserve la palette claire sable, ciel et mer et l’illustration d’accueil : porte-clés Inastia, clé et détails de soin devant une arche ciel/mer. La hiérarchie donne désormais la priorité aux accompagnements, aux responsabilités et au premier contact.

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

L’accueil comporte sept sections : hero explicite et action, trois accompagnements comparables, équipe et territoire, maisons et suivi des rotations avec avis voyageurs, cadre du premier échange, FAQ, puis appel à contact. Le manifeste autonome est absorbé. Les cartes nomment d’abord l’offre, puis ce qui est confié, conservé et à chiffrer. Leurs icônes restent compactes ; les rubriques s’alignent en subgrid à partir de 1024 px. En dessous, les cartes sont empilées.

La présentation familiale reste collective, sans prénom ni portrait non autorisé. Les maisons gardent leurs noms et localisations réels. Le bloc de suivi expose les étapes du service ; ne pas le présenter comme une preuve de mission attribuée à une maison. Les avis Google sont explicitement des extraits de voyageurs, sourcés et statiques, avec date du relevé global. Ils éclairent l’accueil vécu, sans démontrer à eux seuls le suivi propriétaire.

Les pages secondaires associent le hero typographique à un résumé concret des prestations et une petite photo légendée, puis un sommaire, des sections et une FAQ. Le résumé remplace la grande illustration de service. Sur mobile, les colonnes se superposent. Le corps principal est à 16 px, les labels et aides utiles à 13–14 px ; le H1 d’accueil est limité à 80 px sur grand écran et 40–48 px sur mobile.

Le contact rapproche les champs de l’introduction. Le motif choisi reste visible et modifiable ; le parcours audit précise une restitution par appel ou email. Conserver l’aide permanente, les états d’envoi et la place réservée à l’antispam. Les champs utilisent un fond opaque `#fffefb`, une bordure `#657b88` et une aide `#566973`. Vérifier les contrastes et la lisibilité des états réels après toute évolution.

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
