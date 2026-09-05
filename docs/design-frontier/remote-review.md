# Revue distante de la préversion

5 septembre 2026. Site contrôlé : https://inastia-ozxqtakj4-inastia.vercel.app/, réalisation web `26d84a0`. Accès temporaire officiel utilisé uniquement en mémoire du navigateur ; aucun lien d’accès, jeton ou cookie conservé dans les preuves. Tous les navigateurs de ce lot sont fermés.

## Parcours effectivement vérifiés

Neuf routes : huit FR (accueil, gestion, annonce, rotation, histoire, audit, contact, Solenzara) à 1440 × 1000, puis `/en/contact?intent=gestion` à 390 × 844. HTTP 200 partout, document sans débordement horizontal, images HTML chargées, assets attendus `client-DXJcXiA6.js` et `client-C-qFlqLV.css`. Aucune exception JavaScript de page ni erreur HTTP des images/CSS/JS applicatifs observée.

Sur l’accueil à 390 px : Enter ouvre le menu, Escape le ferme et rend le focus au bouton. Le guide facultatif, choix « déléguer le suivi », affiche sa recommandation ; son lien mène à `/contact?intent=gestion` et le select du formulaire reprend `gestion`. Aucun champ du formulaire n’a été renseigné ni soumis.

## Écarts propres au contexte distant

- Les neuf réponses portent `x-robots-tag: noindex`, attendu sur cette préversion protégée. Aucun changement effectué.
- Ce smoke a observé **une erreur console HTTP 400**. Une lecture ciblée l’attribue à une requête XHR de `https://challenges.cloudflare.com`, après chargement réussi du script et d’un document Turnstile. Le site affiche alors : « La vérification anti-spam est indisponible. Réessayez ou contactez-nous par téléphone ou par e-mail. »
- L’erreur survient après simple focus dans un champ vide. Aucun challenge n’a été résolu ou contourné. Le téléphone et l’email de secours restent présents ; le bouton d’envoi est visible et non désactivé, mais il n’a pas été activé. La vérification anti-spam nécessaire à l’envoi est indisponible sur cette préversion dans ces essais : le parcours d’envoi réel y reste bloqué. Les tests locaux/API ne démontrent pas sa disponibilité distante.
- Le diagnostic complémentaire a relevé **110200** dans le callback d’erreur, lors d’une seule activation instrumentée qui conserve le gestionnaire original. Cloudflare définit ce code comme « Domain not authorized » : le domaine de cette préversion est refusé par le widget. [Documentation officielle](https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/error-codes/). La cause est donc confirmée pour cet hôte ; la configuration de production n’a pas été testée ou changée. Aucun réglage du fournisseur, CSP ou hostname n’a été modifié.
- Le blocage CSP de la toolbar `vercel.live`, relevé séparément par Lighthouse preview, n’a pas été reproduit dans ce smoke. L’absence de ce message ici ne contredit pas le rapport Lighthouse et ne justifie pas d’annoncer zéro erreur console distante.

Toutes les requêtes vers `/api/contact` étaient interceptées pour interdire leur émission ; **aucune tentative n’a eu lieu**. Deux observations de focus vide donnent le même état anti-spam indisponible, sans saisie ni données personnelles.

L’agent principal a aussi constaté le même état après un clic sur le champ Commune vide dans le navigateur intégré. L’ouverture du tableau de bord Cloudflare mène à son écran de connexion : aucune session administrateur n’est disponible pour autoriser le domaine de test. Une connexion du propriétaire du compte est nécessaire pour poursuivre ce point. La correction visée est limitée à l’ajout explicite de `inastia-ozxqtakj4-inastia.vercel.app` aux hostnames du widget existant, en conservant les domaines déjà autorisés ; ni wildcard ni suppression de protection n’est proposée. Il faudra vérifier ensuite le widget sans soumettre de demande réelle.

## Preuves et limites

Dossier externe `C:/Users/Admin/Documents/inastia-frontier-evidence/remote-final/` : dix PNG (neuf pages et état widget), `observations.json`, `turnstile-observation.json`, `turnstile-error-observation.json`, `turnstile-error-diagnostic.md` et scripts sans accès temporaire enregistré. Les URLs des dépendances tierces sont réduites à leur origine dans la lecture ciblée ; aucun query ou cookie n’est exporté.

Il s’agit d’un smoke Chrome distant ciblé, pas d’un nouveau passage exhaustif des tests locaux, d’une certification d’accessibilité ou d’un essai de délivrabilité. Les mesures Lighthouse distantes sont documentées dans la revue performance séparée. Aucune publication en production n’a été effectuée par ce lot.
