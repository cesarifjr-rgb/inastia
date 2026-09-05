# Géographie de l’atlas Inastia

Données vérifiées et consultées le 5 septembre 2026. Aucun appel externe à l’exécution : le contour SVG et les cinq points sont embarqués. Les libellés et slugs reprennent les cinq secteurs existants de `src/components.ts`.

## Contour

Source : [Natural Earth Land 1:10m](https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-land/), [domaine public](https://www.naturalearthdata.com/about/terms-of-use/). [GeoJSON source figé](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/ace5fed0eaf3c6c03c951e75b439ba8fffbc218e/geojson/ne_10m_land.geojson), commit `ace5fed0eaf3c6c03c951e75b439ba8fffbc218e`, SHA256 `1ac90796408bc6ad6911d69448485d3c4dbf2190370080368a09976e1c9f7416`.

Sélection du plus grand anneau entièrement compris entre longitudes 8,4–9,7 et latitudes 41,3–43,1. Île principale seulement. Simplification Douglas–Peucker 0,002 degré, arrondi à six décimales : 401 points source, 286 sommets finaux, SVG de 4 086 octets. Ce n’est ni un contour cadastral ni une géométrie de couverture commerciale.

Projection équirectangulaire locale du contour et des points, viewBox `0 0 248.21 520` :

```text
x = 10 + (longitude − 8.545258) × cos(42°) × 302.75708769480184
y = 10 + (43.017401 − latitude) × 302.75708769480184
```

## Centres communaux

Source : [API Découpage administratif](https://geo.api.gouv.fr/decoupage-administratif/communes), champ `centre`, EPSG:4326. [Licence du projet et des données](https://github.com/datagouv/api-decoupage-administratif#-licence), [Licence Ouverte 2.0](https://www.data.gouv.fr/pages/legal/licences/etalab-2.0). La date de consultation ne représente pas une date de mise à jour du référentiel, non exposée dans les réponses utilisées.

| N° | Commune / INSEE | Longitude | Latitude | x SVG | y SVG |
|---|---|---:|---:|---:|---:|
| 1 | Ghisonaccia / 2B123 | 9.4192 | 42.0454 | 206.63 | 304.28 |
| 2 | Sari-Solenzara / 2A269 | 9.3395 | 41.8163 | 188.70 | 373.64 |
| 3 | Zonza / 2A362 | 9.2719 | 41.7145 | 173.49 | 404.46 |
| 4 | Lecci / 2A139 | 9.3102 | 41.6594 | 182.11 | 421.14 |
| 5 | Porto-Vecchio / 2A247 | 9.2732 | 41.5849 | 173.78 | 443.70 |

Requêtes exactes : [Ghisonaccia](https://geo.api.gouv.fr/communes?nom=Ghisonaccia&fields=nom,code,centre,mairie,codeDepartement&format=json), [Sari-Solenzara](https://geo.api.gouv.fr/communes?nom=Sari-Solenzara&fields=nom,code,centre,mairie,codeDepartement&format=json), [Zonza](https://geo.api.gouv.fr/communes?nom=Zonza&fields=nom,code,centre,mairie,codeDepartement&format=json), [Lecci](https://geo.api.gouv.fr/communes?nom=Lecci&fields=nom,code,centre,mairie,codeDepartement&format=json), [Porto-Vecchio](https://geo.api.gouv.fr/communes?nom=Porto-Vecchio&fields=nom,code,centre,mairie,codeDepartement&format=json).

Les points sont les centres communaux renvoyés par l’API, jamais les positions de Pinarello, Saint-Cyprien, du port de Solenzara ou d’une agence. La liste sépare le nom de secteur du nom de commune utilisé par le repère. Aucun point n’est déplacé sur le littoral, aucune ligne ne les relie, aucune surface de desserte n’est dessinée.

## Contrat DOM

- `heroAtlas(locale)` : `.hero-atlas`, image décorative `.atlas-silhouette`, navigation `.atlas-index`, cinq liens avec `.atlas-number` et nom de secteur.
- `territoryAtlas(locale)` : `.territory-atlas`, figure `.atlas-map` (SVG avec title/desc spécifiques au territoire et à la langue, cinq `.atlas-point` numérotés), légende, liste ordonnée `.atlas-localities`, détails `.atlas-sources`.
- Liens de liste : `.atlas-number`, `.atlas-place` contenant `.atlas-place-name` et `.atlas-commune`, puis flèche décorative.
- Le parent fournit le titre de section, l’id `zone` et le CSS. Donner aux liens `.atlas-index a`, `.atlas-localities a` et au summary une hauteur minimale de 44 px avec un focus visible. Le titre de carte ne remplace pas le titre de section.
- Les points sont statiques, sans cibles tactiles superposées entre communes proches. Les cinq liens HTML assurent la navigation clavier/tactile ; aucune information ne dépend du survol ou du JavaScript. Aucun module client nécessaire.
- Chaque composant est prévu une fois par page. L’image du hero ne crée pas d’id SVG dans le document HTML ; le SVG intérieur utilise `territory-atlas-title-fr/en` et `territory-atlas-description-fr/en`.
