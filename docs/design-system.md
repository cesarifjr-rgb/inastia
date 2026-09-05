# Direction graphique Inastia V2

Une identité contemporaine et animée, adaptée à la conciergerie familiale : fond nuit, menthe, pierre claire, titres sans serif et villa architecturale en 3D. La mise en scène évoque la maison et le relais local. Les photos réelles restent des références discrètes ; le discours porte sur les propriétaires, l’accueil et le choix de délégation.

## Tokens

Source de vérité : `src/styles.css`, bloc `:root`.

| Token          | Valeur                   | Usage                             |
| -------------- | ------------------------ | --------------------------------- |
| `--night`      | `#081418`                | Fond principal                    |
| `--surface`    | `#102126`                | Surfaces secondaires              |
| `--surface-up` | `#172c30`                | Surfaces rehaussées               |
| `--ivory`      | `#eff0e8`                | Texte principal et boutons        |
| `--mint`       | `#b9edda`                | Accent, titres et appel à contact |
| `--muted`      | `#a3b6b7`                | Texte secondaire                  |
| `--line`       | `#2b4043`                | Séparateurs                       |
| `--paper`      | `#e9ede5`                | Sections claires                  |
| `--ink`        | `#12272b`                | Texte sur fond clair              |
| `--gutter`     | `clamp(24px,4.5vw,88px)` | Marges fluides                    |
| `--max`        | `1600px`                 | Largeur des conteneurs            |

Space Grotesk compose les titres ; Manrope porte paragraphes et commandes. Les fontes variables WOFF2 sont locales et leurs licences sont conservées dans `public/fonts/`. Les accents de titres sont colorés, sans italique. Les focus utilisent un contour visible distinct.

## Composition

Le hero associe une promesse courte et une villa illustrée, sans photographie dominante. Il conduit au contact et à l’audit gratuit. Le manifeste alterne avec trois cartes de services, une présentation familiale, un portfolio en lignes compactes, une méthode et les zones locales. Les symboles maison, annonce et clé relient les animations aux prestations réelles.

Les pages secondaires partagent un hero typographique, une illustration de service et une petite photo légendée, puis un sommaire, des sections et une FAQ. Le formulaire et les pages légales conservent la même identité. Sur mobile, les colonnes se superposent et les titres doivent conserver les marges communes.

## Motion et repli

`src/art.ts` fournit les illustrations CSS/SVG ; `src/motion.ts` gère GSAP et la commande pause/reprise. `src/scene.ts` fait le lien avec le DOM (taille, visibilité, pointeur et cycle de page). `src/scene.worker.ts` charge/analyse le GLB et effectue le rendu Three.js dans un Web Worker avec OffscreenCanvas, limité à 30 images par seconde sur mobile. La scène est décorative. Garder le SVG de repli, le contenu HTML visible sans JavaScript et les libellés indiquant une illustration architecturale. Ne pas faire dépendre la navigation ou la compréhension d’une animation.

La préférence `prefers-reduced-motion` initialise une pause ; l’utilisateur peut explicitement reprendre via le bouton. Respecter cet état, l’arrêt du rendu hors écran ou lorsque l’onglet est masqué, et la suspension/reprise lors du retour BFCache. Si Worker, OffscreenCanvas ou WebGL ne sont pas disponibles, ou si le chargement/rendu échoue, conserver l’illustration SVG statique. Vérifier les états animés et statiques après modification ; une capture fixe ne démontre pas la qualité du mouvement.

## Sources et régénération

- `scripts/create-villa.py` crée la villa dans Blender : `blender --background --python scripts/create-villa.py`.
- Le GLB versionné est `public/models/inastia-villa.glb`. Les scènes `.blend` et rendus de travail restent dans `../inastia-v2-evidence/`, hors dépôt.
- `scripts/render-share.py` ouvre la scène générée et produit la carte sociale : `blender --background --python scripts/render-share.py`, après la commande précédente. Résultat : `public/images/inastia-share.png`, 1200 × 630.
- Les originaux `villa_amichi.webp`, `casa_verde.webp`, `villa_lova.webp` représentent respectivement Villa d’Amichi / Pinarello-Zonza, Casa Verde / Pinarello-Zonza et Villa Lova / Cala d’Oro-Solenzara.
- `npm run assets` génère leurs variantes AVIF/WebP à 240, 480, 800 et 1200 pixels et copie les polices/licences. Il ne régénère ni la 3D ni l’image sociale.

Conserver les localisations réelles dans les légendes et textes alternatifs. Ne pas présenter la villa 3D comme un bien du portfolio, inventer une technologie de gestion, des chiffres ou des avis pour accompagner cette nouvelle esthétique.
