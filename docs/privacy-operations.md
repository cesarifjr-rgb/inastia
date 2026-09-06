# Traitements de contact et textes publics — suivi opérationnel

Document interne au dépôt, non publié par le générateur du site. État au
6 septembre 2026, après AUD-01, AUD-06, AUD-07 et AUD-08. Ne contient ni secret,
ni export de demande, ni contrat privé. Les points non confirmés ci-dessous ne
sont pas des déclarations à reprendre automatiquement dans la notice publique.

## Ce qui a été corrigé dans les textes

- AUD-01 : responsable Inastia explicite, données du formulaire, destinataires
  techniques identifiés, caractère obligatoire/facultatif, conséquence d'une
  absence de saisie et recours CNIL. Les bases légales restent à valider avant
  publication ; aucune case de consentement n'a été ajoutée par défaut.
- AUD-06 : distinction clients consommateurs/professionnels pour les clauses
  ciblées. Le début d'une prestation ne vaut plus perte automatique du droit de
  rétractation ; les conditions de pleine exécution sont précisées. L'indemnité
  de 40 euros est réservée aux relations professionnelles concernées ; le taux
  historique « intérêt légal + 3 points » conserve le minimum légal de trois
  fois le taux légal. Les options de juridiction du consommateur sont préservées
  et Bastia n'est plus présenté comme obligatoire pour tous.
- AUD-07 : coordonnées professionnelles CM2C du PDF public reproduites en HTML
  dans CGV et mentions légales, avec liens email/téléphone/site ; PDF conservé.
  Aucun contrat d'adhésion créé ou renouvelé.
- AUD-08 : cartographie ci-dessous ; aucune nouvelle CMP, mesure d'audience ou
  affirmation d'exemption des opérations du CAPTCHA.

## Cartographie fondée sur le code et le relevé public

| Étape | Données / finalité observables | Destinataire observé | Ce qui reste à vérifier |
|---|---|---|---|
| Navigation du site | Requêtes HTTP et ressources du site ; pages et langues servies sans stockage local applicatif observé | Vercel, hébergeur déclaré | Journaux d'infrastructure, personnes habilitées, régions et durée des logs |
| Entrée dans un champ du formulaire | Chargement Turnstile pour la vérification anti-robot | Cloudflare | Options du widget, DPA accepté, opérations sur le terminal et finalités exactes |
| Soumission | Identité, email, téléphone selon intention, commune, type de bien, message facultatif et jeton | Service /api/contact sur Vercel | Correspondance de la version déployée, réception réelle, accès aux journaux |
| Vérification anti-spam | Le code envoie le jeton à Siteverify ; pas le message commercial dans cet appel | Cloudflare | Restrictions de domaines et garanties contractuelles applicables |
| Transmission de la demande | Email reprenant les données de contact/logement/projet ; adresse de réponse du demandeur | Resend puis boîte contact Inastia | Contrat, conservation chez Resend, fournisseur de messagerie, accès, copies et sauvegardes |
| Traitement commercial | Réponse et éventuel rappel audit annoncés publiquement | Équipe Inastia | Qui traite, éventuel CRM ou transfert interne, conservation et procédure d'effacement |

Sources techniques : src/templates.ts, src/contact.ts, api/contact.js et
mentions légales. Relevé public du 6 septembre : profil Chrome neuf, FR puis EN
sans focus, aucune origine tierce ni clé local/session observée ; après focus
sans saisie, requêtes vers challenges.cloudflare.com et un sous-domaine, sans
cookie constaté dans la fenêtre d'environ 5,5 secondes. Des requêtes techniques
Cloudflare utilisent POST ; aucune demande n'a été soumise à /api/contact lors
de l'audit. Cette observation n'exclut pas d'autres opérations sur le terminal
et ne suffit pas à conclure à une exemption de consentement.

La corrélation d'envoi est intégrée et décrite dans la notice publique :
identifiant opaque de demande, identifiant fournisseur, phase/résultat et durée
peuvent eux aussi devenir des données personnelles lorsqu'ils sont reliables
à une demande. Les événements applicatifs n'incluent ni coordonnées ni message.
Ne pas journaliser
les coordonnées, messages, jetons ni secrets ; documenter accès, fondement et
conservation des nouvelles traces avant leur exploitation.

## Décisions factuelles indispensables à obtenir d'Inastia

1. **Bases légales par finalité.** Confirmer le traitement exact des demandes :
   réponse à une demande de prestation/devis, renseignements généraux, sécurité
   anti-spam et éventuels journaux de diagnostic. Identifier le fondement retenu
   pour chacun et, si intérêt légitime, l'intérêt poursuivi ainsi que la
   justification de nécessité/proportionnalité. Ne pas confondre une finalité
   avec une base légale et ne pas choisir le consentement par défaut.
2. **Destinataires et durées.** Confirmer les personnes ou fonctions qui accèdent
   à la boîte, le fournisseur de messagerie, les éventuels CRM/renvois et les
   règles réellement appliquées aux copies, sauvegardes et journaux. La notice
   historique annonce trois ans après le dernier contact, puis la durée de la
   relation contractuelle : cette phrase est conservée, pas certifiée comme
   politique de purge effective. Vérifier ses conditions et les éventuelles
   obligations distinctes d'archivage avant de la modifier.
3. **Fournisseurs et transferts.** Confirmer les contrats/DPA acceptés, options,
   lieux de traitement et garanties utilisés chez Vercel, Cloudflare, Resend et
   le fournisseur de messagerie. Un DPA public n'atteste pas à lui seul le
   dispositif contractuel réellement applicable au compte.
4. **Contrats et médiation.** Confirmer qualité des clients et modes de signature,
   documents utilisés, demande d'exécution anticipée le cas échéant, et adhésion
   CM2C en cours. Les CGV historiques décrivent un mandat et un reversement des
   loyers sous quinze jours après fin de mois : préciser qui encaisse, au nom
   de qui et selon quel contrat, puis rapprocher qualifications/assurances et
   garanties des opérations réelles. Aucun statut métier ni manipulation de
   fonds ne peut être certifié depuis la seule page publique.

## Préparation de la notice après validation

Pour chaque finalité confirmée, ajouter un paragraphe court dans la section
« Collecte des données » : finalité concrète, base juridique correspondante et,
si nécessaire, intérêt légitime poursuivi. Une réponse à une demande de contrat
peut relever des mesures précontractuelles à la demande de la personne ; cela
ne qualifie pas automatiquement toutes les demandes générales ni l'anti-spam.
Ce document ne vaut pas validation de ce fondement pour Inastia.

Proposition de rédaction à valider avec les pratiques réelles avant publication :

- « Lorsque vous demandez une prestation, un devis ou un audit en vue d'un
  accompagnement, les données nécessaires servent à prendre les mesures
  précontractuelles demandées par vous (article 6, paragraphe 1, b du RGPD). »
- « Pour les demandes de renseignements générales, nous nous fondons sur notre
  intérêt légitime à répondre aux personnes qui nous contactent au sujet de
  nos services (article 6, paragraphe 1, f). »
- « La prévention des messages indésirables et le diagnostic des erreurs de
  transmission répondent à notre intérêt légitime à assurer la sécurité et la
  fiabilité du formulaire (article 6, paragraphe 1, f). »

Ces trois phrases constituent une proposition conditionnelle, pas l'affirmation
que ces fondements ont été retenus par Inastia. Vérifier notamment les demandes
faites pour le compte d'une personne morale et documenter la mise en balance
des intérêts avant de retenir un intérêt légitime.

Compléter ensuite les catégories réelles de destinataires, les durées ou
critères vérifiés et, en cas de transfert applicable, le pays/la garantie et
le moyen d'en obtenir une copie. Adapter les droits à la base retenue, notamment
la portabilité ou le retrait du consentement lorsqu'ils s'appliquent. Ne pas
publier une formule « conforme RGPD » globale ou « aucun transfert » faute de
preuve.

Cloudflare distingue, dans son addendum Turnstile du 18 juin 2025, un rôle de
sous-traitant pour protéger les sites et de responsable pour améliorer la
détection des robots. Le DPA public Resend décrit des opérations principales aux
États-Unis et des mécanismes de transfert. Ces informations justifient une
vérification des contrats/options Inastia ; elles ne prouvent ni transfert
illicite ni obligation automatique de bandeau. La décision relative à l'article
82 doit tenir compte des opérations sur le terminal et de leurs finalités
effectives ; un simple focus ne vaut pas consentement.

## Vérification et clôture

- AUD-01 reste **partiel** tant que les bases et informations conditionnelles
  applicables ne sont pas confirmées puis ajoutées ; droit CNIL et informations
  de formulaire peuvent être vérifiés sans données personnelles.
- AUD-06 : vérifier le texte rendu, puis rapprocher les clauses corrigées des
  modèles contractuels réels. Les autres thèmes historiques sont conservés ;
  leur présence n'est pas une validation juridique générale.
- AUD-07 : retrouver les mêmes coordonnées en texte dans les deux pages, activer
  les liens au clavier et vérifier que le PDF reste disponible. L'accessibilité
  de l'information ne prouve pas l'adhésion.
- AUD-08 reste **à confirmer** tant que contrats, options, durées et opérations
  effectives ne sont pas documentés. Aucun message réel ni compte fournisseur
  modifié pour le compléter.

## Références officielles reconsultées le 6 septembre 2026

- [RGPD, articles 12–13 — CNIL](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3)
  et [recours CNIL](https://www.cnil.fr/fr/plaintes).
- [FAQ CNIL cookies, questions 17–18](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/FAQ),
  29 avril 2026 : CAPTCHA, finalités et information distincte du RGPD.
- [Turnstile Privacy Addendum](https://www.cloudflare.com/turnstile-privacy-policy/),
  mise à jour du 18 juin 2025 ; [DPA Resend](https://resend.com/legal/dpa), version
  publique consultée, contrat du compte non inspecté.
- [L221-18](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032226842),
  [L221-25](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044563179) et
  [L221-28](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044563170) :
  délai de rétractation, commencement et pleine exécution ; les deux derniers
  articles sont en vigueur dans cette version depuis le 28 mai 2022.
- [R631-3](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032808504),
  depuis le 1er juillet 2016 ; [article 48 du Code de procédure civile](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006410147) :
  compétences légales et attribution entre commerçants.
- [L441-10](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038414392),
  version applicable au 6 septembre 2026 : pénalités et minimum légal ; vérifier
  la version applicable lors d'une évolution future des contrats.
- [PDF CM2C déjà publié par Inastia](https://inastia.fr/vitrophanie.pdf),
  relu visuellement le 6 septembre 2026 : coordonnées reprises à l'identique,
  aucune identité individuelle.
