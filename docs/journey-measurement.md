# Mesurer le parcours du site

Configuration du 21 septembre 2026. Elle complète [le suivi des demandes qualifiées](copywriting-measurement.md) et [la liaison Attio / Google Ads](attio-google-ads.md).

Depuis le 24 septembre, [le suivi Google Business Profile](google-business-profile-measurement.md) conserve aussi la provenance du lien balisé, avec le consentement Analytics, jusqu’à la demande et à sa source initiale dans Attio.

## Du CTA à la demande

Après accord Analytics, trois événements utilisent les mêmes catégories d'origine :

| Événement | Déclenchement | Limite |
|---|---|---|
| `contact_click` | Clic sur un lien formulaire, téléphone ou email | Ne prouve ni appel effectué ni demande reçue. |
| `form_start` | Première saisie du formulaire sur la page | Un seul événement par chargement ; pas une personne unique. |
| `generate_lead` | Réponse positive de l'API après enregistrement durable de la demande (`202 registered`) ; acceptation Resend dans le mode historique | Ne prouve ni livraison en boîte, ni copie CRM, ni qualification. |

Paramètres communs : `service` (gestion, audit, intendance ; partenariat pour les clics partenaires), `origin_page`, `origin_locale` et `contact_placement`. `contact_method` distingue form/phone/email pour les clics. Les débuts et envois portent aussi `form_id=contact-form`.

| Emplacement | Valeur |
|---|---|
| Introduction de page | `hero` |
| Menu ordinateur / mobile | `header` / `mobile_menu` |
| Rappel mobile après le CTA principal | `mobile_sticky` |
| Honoraires / formules | `pricing` |
| Bloc final / pied de page | `callout` / `footer` |
| FAQ / autre contenu | `faq` / `content` |
| Emplacements explicites partenaires | `profile`, `contact`, `email_fallback`, `phone` |
| Formulaire sans origine de CTA vérifiable | `direct` |

La page est un identifiant autorisé (`home`, `contact` ou slug connu), pas une URL complète. La langue est `fr` ou `en`. Aucun texte libre, coordonnées, identifiant de demande ou identifiant Attio n'est ajouté à ces paramètres Analytics.

Le dernier CTA vers le formulaire est gardé dans `sessionStorage`, avec accord Analytics, pour une validité maximale de 30 minutes. Le formulaire exige une navigation de même origine cohérente avec cette page. Le changement de langue et le rechargement du formulaire conservent cette origine. Une autre navigation interne, le retrait du consentement ou l'expiration invalident l'origine. Le navigateur supprime le stockage à l'échéance lorsqu'il est actif ; une lecture ultérieure refuse toujours une valeur expirée. Un bloqueur, un accès direct ou un stockage indisponible laissent la demande utilisable sans attribution.

## Analytics

Propriété Inastia : `553577581`, flux `G-ZQWEB3WMM4`. Les dimensions personnalisées d'événement sont configurées pour `contact_placement`, `contact_method`, `service`, `partner_profile`, `origin_page` et `origin_locale`.

Dans une exploration libre : lignes **Page origine du contact**, **Emplacement du contact** ; colonnes **Nom de l'événement** ; valeur **Nombre d'événements** ; filtre du nom d'événement correspondant à `^(contact_click|form_start|generate_lead)$`. Ventiler par service/langue et appareil si les volumes le permettent. Pour les clics, isoler `contact_method=form` avant comparaison au formulaire ; téléphone et email n'ont pas de confirmation de réception côté site.

Les nouvelles dimensions peuvent demander [24 à 48 heures de traitement](https://support.google.com/analytics/answer/14240153?hl=en). L'historique sans ces paramètres reste non renseigné. Les volumes consentis ne représentent pas tous les visiteurs. Une division des nombres d'événements n'est pas un taux individuel : clics répétés, refus, bloqueurs, accès directs et parcours interrompus existent. Pour un entonnoir individuel, utiliser une exploration séquentielle sur une période et un service identiques, puis vérifier le faible effectif avant toute conclusion.

## Rapprochement commercial dans Attio

Vue partagée : [Parcours du site — CTA et suivi](https://app.attio.com/inastia/deals/view/83eb6ddf-10e9-4c22-92b8-2a1370d57a89).

Elle affiche l'étape commerciale, la page, l'emplacement, la langue, la première demande reçue, la proposition envoyée et les contrats liés. Elle exige une clé d'opportunité du site et exclut les noms contenant `TEST TECHNIQUE`. Vérifier aussi les indésirables et doublons avant un bilan.

Les trois attributs texte `site_page_origine`, `site_emplacement_cta`, `site_langue_origine` reçoivent l'origine consentie lors de la création d'une opportunité. L'API et la copie CRM contrôlent la même liste de catégories, version, date et accord. Une origine invalide est ignorée sans refuser la demande. Les dossiers existants gardent leur attribution initiale et leur étape ; le texte de la dernière demande peut documenter un nouveau CTA. Une valeur vide signifie origine inconnue, jamais référencement naturel présumé.

L'origine facultative n'entre pas dans le corps de l'email Resend : un retrait de consentement ou une expiration entre deux tentatives ne doit pas modifier l'envoi idempotent. La première demande enregistrée conserve son instantané validé. Les tâches durables et les traces `contact_delivery` permettent de contrôler une copie CRM échouée sans renvoyer l'email.

| Étape commerciale | Preuve attendue |
|---|---|
| Demande | Référence unique et réception contrôlée ; dossier site relié au contact et au logement. |
| Qualification | Décision humaine après vérification du secteur, logement, intention et calendrier. Le stade actuel ne remplace pas l'historique. Documenter la première date et la preuve dans le dossier. |
| Proposition | `proposition_envoyee_le`, après envoi réel ; un brouillon ne compte pas. |
| Signature | Contrat relié au dossier, `date_signature`, document signé et `signature_verifiee`. Le seul stade Gagné ne suffit pas. |

Le champ Google Ads `google_ads_qualifie_le` appartient à People, tandis que les signatures sont rattachées aux opportunités/contrats. Pour un contact possédant plusieurs logements, ne pas attribuer sa qualification à tous ses dossiers : contrôler la preuve propre à chaque projet. Aucun nouveau passage de stade, export hors ligne ou automatisme de qualification n'est ajouté par ce chantier.

Comparer chaque semaine les mêmes cohortes de premières demandes par page/CTA/service, avec les origines inconnues à part. Réactualiser les cohortes quand les dossiers avancent. Ne pas diviser les contrats de la semaine par les nouveaux formulaires de cette semaine. Les règles R/Q/P/C et d'exclusion du guide de qualification restent applicables. Aucun identifiant individuel n'est envoyé à GA4 pour joindre les dossiers commerciaux.

## Vérification et limites

Les tests locaux simulent Google, Turnstile, Resend et Attio : catégories FR/EN, menus mobile/ordinateur, navigation réelle vers le formulaire, langue, refus/retrait/expiration, absence de texte libre, réception confirmée et préservation des dossiers existants. Ils ne prouvent pas un import Google ou une synchronisation d'une nouvelle demande réelle en production. Contrôler le prochain dossier authentique à partir de son email et de `contact_crm` ; ne pas envoyer de faux prospect.

Au contrôle du 21 septembre, les dossiers présents ne permettaient pas de prouver une chaîne réelle nouvelle origine → qualification → proposition → signature. Les données historiques n'ont pas été complétées par supposition. Ce chantier met en place la collecte et le rapprochement, sans déclarer de gain de conversion.
