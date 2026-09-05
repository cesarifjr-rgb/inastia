# Direction graphique Inastia

Une identité éditoriale sobre, inspirée de la maison corse et de l'hospitalité familiale : fonds crème, olive profond, grandes photographies de biens existants et titres serif. Le site parle aux propriétaires qui souhaitent déléguer leur location ; chaque parcours mène vers une conversation ou l'audit gratuit.

## Tokens

Source de vérité : `src/styles.css`, bloc `:root`.

| Token | Valeur | Usage |
|---|---|---|
| `--cream` | `#f7f4ed` | Fond principal, texte sur olive |
| `--paper` | `#eeebe2` | Surfaces secondaires |
| `--olive` | `#303e32` | Sections fortes, boutons |
| `--ink` | `#29362c` | Texte principal |
| `--muted` | `#62675e` | Texte secondaire |
| `--line` | `#c9cabe` | Séparateurs |
| `--gold` | `#a48a54` | Accents décoratifs |
| `--gutter` | `clamp(24px,4.4vw,88px)` | Marges fluides |
| `--max` | `1600px` | Largeur des conteneurs |

Cormorant Garamond compose les titres et les accents italiques ; Manrope porte les paragraphes, labels et commandes. Les fontes variables WOFF2 sont servies localement, avec les licences Fontsource conservées dans `public/fonts/`. Les titres sont fluides ; le CSS contient les ajustements tablette/mobile. Ne pas utiliser l'or seul pour un texte indispensable sans vérifier son contraste.

## Composition et comportement

L'accueil alterne une entrée en deux colonnes, une liste de trois services sur fond olive, un portfolio asymétrique, une présentation familiale, une méthode et les zones desservies. Les pages secondaires partagent un hero, un sommaire, des sections éditoriales, une FAQ et un appel à contact. Les pages légales utilisent le même cadre, avec une colonne de lecture.

Préférer les lignes fines et les boutons rectangulaires aux effets décoratifs. La photo et la typographie créent la hiérarchie. Sur mobile, les colonnes se superposent ; la navigation devient un menu accessible. Garder les focus visibles, les liens explicites, les labels de formulaire et les messages d'état. Les transitions restent légères et sont désactivées avec `prefers-reduced-motion`.

## Sources visuelles et éditoriales

- `villa_amichi.webp` : Villa d'Amichi, Pinarello / Zonza.
- `casa_verde.webp` : Casa Verde, Pinarello / Zonza.
- `villa_lova.webp` : Villa Lova, Cala d'Oro / Solenzara.
- `scripts/assets.ts` génère les variantes AVIF/WebP et l'image de partage depuis ces originaux.
- Les contenus FR/EN résident dans `src/content/pages.ts` et les templates ; la société et les coordonnées proviennent des mentions légales existantes.

Une photo peut illustrer une page locale, mais son texte alternatif doit conserver sa véritable localisation. Ne pas présenter une illustration comme photo d'équipe, ni créer des résultats, avis ou labels pour remplir une section. Préférer une offre concrète et des modalités sur mesure aux promesses chiffrées non documentées.
