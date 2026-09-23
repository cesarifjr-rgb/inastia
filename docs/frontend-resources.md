# Ressources frontend par page

La génération HTML sélectionne les entrées dans `src/templates.ts`, avec le même
choix en français et en anglais :

| Pages | Fonctionnalités supplémentaires | Styles supplémentaires |
| --- | --- | --- |
| Accueil, gestion complète | Scène de gestion, calculateur, ouverture des prestations par ancre | management, management-art, pricing |
| Contact | Formulaire et validations | Aucun |
| Première mise en location | Checklist | first-rental |
| Partenaires | Ouverture des questions par ancre | partners |
| Intendance | Aucune | intendance |
| Autres pages | Aucune | Aucun |

Chaque entrée importe d'abord `src/client.ts`, qui conserve le menu, les
consentements, les animations et le CTA mobile. Les dépendances sont déclarées
dans le HTML compilé : le formulaire n'attend pas un import déclenché après
l'initialisation du client. Les fichiers partagés restent réutilisables en cache
entre pages. Vite traite les entrées HTML et leurs modules dans son
[build multipage](https://vite.dev/guide/features#html).

GSAP et ScrollTrigger conservent leur chargement conditionnel existant. Aucune
animation n'est supprimée. Les styles du formulaire restent dans la base commune,
y compris les champs spécifiques à l'intendance.

## Comparaison du 23 septembre 2026

Référence : `10cb12e9fb37ddc8c764681c5eaf0d4aeadb7273`. Version comparée :
séparation des entrées et des styles décrite ci-dessus, sans changement de contenu.

Mesures locales sur les builds de production Vite, Chrome 153.0.8010.53,
viewport 375 × 812, nouveau contexte navigateur pour chaque page, aucun
consentement enregistré. Les réponses JS/CSS de même origine sont relevées
jusqu'à stabilisation du réseau. Les chiffres gzip sont une estimation obtenue
en compressant chaque réponse décodée avec `node:zlib.gzipSync`, puis en
additionnant les tailles. Ils ne représentent pas le transfert HTTP réel de
Vercel, qui peut utiliser une autre compression. Un ko vaut 1 000 octets.

Avec les préférences d'animation ordinaires, **tous les scripts chargés, GSAP
compris**, et les styles donnent :

| Page FR | JS + CSS avant, ko gzip estimés | Après | Réduction |
| --- | ---: | ---: | ---: |
| Accueil | 70,216 | 66,625 | 5,1 % |
| Contact gestion | 25,608 | 21,975 | 14,2 % |
| Gestion complète | 25,608 | 22,017 | 14,0 % |
| Première mise en location | 73,737 | 65,171 | 11,6 % |
| Intendance | 73,325 | 64,416 | 12,2 % |
| Partenaires | 28,582 | 19,869 | 30,5 % |
| Confidentialité | 25,608 | 16,699 | 34,8 % |
| Audit | 70,216 | 61,307 | 12,7 % |

Le JavaScript commun minifié passe de 33 093 à 16 042 octets. Avec la réduction
des animations activée, les entrées spécialisées portent le total JS à
18 686 octets pour l'accueil/gestion, 29 814 pour Contact, 16 575 pour la
checklist et 16 255 pour Partenaires. Les autres pages restent à 16 042 octets.
La feuille commune passe de 65 480 à 47 237 octets.

Compromis : les pages spécialisées ajoutent une requête JS ; l'accueil et la
gestion ajoutent aussi une requête CSS. Sur ces deux pages, le CSS gzip estimé
augmente de 880 octets, car deux fichiers se compressent moins bien qu'un seul.
Le total JS + CSS reste inférieur à la référence, et les pages suivantes
réutilisent la feuille commune sans charger les styles de gestion inutiles.

## Vérification

`tests/page-resources.spec.ts` impose des budgets de ressources réellement
chargées sur les principales pages FR/EN et une page légale. La réduction des
animations y isole les fonctionnalités du chargement GSAP, testé séparément.
Exécuter après `npm run build` :

```sh
npx playwright test tests/page-resources.spec.ts
```

Les parcours existants couvrent les formulaires simulés, les trois intentions,
les consentements, le calculateur, la checklist, les ancres, le menu et les
animations. Les mesures de poids ne démontrent pas une amélioration du LCP,
de l'INP ou du CLS au 75e percentile des visites. Les objectifs restent
LCP ≤ 2,5 s, INP ≤ 200 ms et CLS ≤ 0,1 ; leur atteinte nécessite des mesures
de visites réelles.
