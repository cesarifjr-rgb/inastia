# Exploration C — Le soin en mouvement

Prototype autonome dans `care.html`, sans JavaScript ni bibliothèque. Il explore un premier écran et une section intérieure ; ce n’est pas une refonte intégrée ni un formulaire fonctionnel ajouté au site. Les liens conduisent aux vraies pages publiques et à la demande d’audit avec motif.

## Concept et vocabulaire

Une présence collective rendue concrète par une séquence de gestes : préparer, vérifier, informer. Le premier écran assume le point de vue de l’accueil/rotation et donne accès aux trois accompagnements sans questionnaire. La narration passe d’un geste domestique à l’information utile au propriétaire, puis au choix du périmètre de délégation.

Le carnet est explicitement **explicatif** : ni rapport client, ni intervention datée, ni checklist artificiellement cochée. Aucun délai, prix, rendement ou nouveau membre d’équipe. Les précisions repliables détaillent le périmètre sans dissimuler le message essentiel.

## Typographie, couleur et composition

Space Grotesk massif, interlettrage serré et lignes courtes ; Manrope pour le texte de lecture. Le rythme est plus documentaire que touristique : en-têtes de photographie, index, filet horizontal, chapitres numérotés. Blanc très clair `#fffefa`, encre `#17201d`, vert profond `#153f33` et vert clair `#d6ed96`. Le bandeau vert ponctue fortement la transition ; les liens d’offres terminent le parcours dans une zone vert clair.

À 1440, le titre occupe la gauche, une photographie réelle et le geste illustré la droite. Le carnet comporte trois colonnes : index, geste, explication. À 390, le titre précède le texte et les actions ; la photo et l’illustration forment une petite paire, puis les étapes deviennent des lignes à deux colonnes. Les offres s’empilent. Les titres et contenus ne sont pas tronqués.

## Photographie et illustration

Photographie existante de Villa d’Amichi, légendée Pinarello/Zonza et identifiée comme maison du portfolio. La photo n’est pas décrite comme preuve d’une intervention. Linge plié dessiné en SVG et explicitement nommé illustration ; aucune image humaine synthétique. L’absence de portrait reste une limite si cette direction devient celle du site entier.

## Mouvement et interactions

Une seule animation CSS d’entrée du linge (0,7 seconde, translation de 8 px et rotation de 3 degrés), sans boucle, supprimée avec reduced-motion. Aucun texte ni lien n’attend l’animation. Accordéons HTML natifs, utilisables au clavier et sans JavaScript ; le processus reste lisible lorsqu’ils sont fermés. Liens d’ancrage à défilement natif, retour instantané avec reduced-motion. Pas de curseur, pinning ou interception du scroll.

## Risques et arbitrages

- Le hero parle fortement des rotations : bon territoire créatif, mais trop spécialisé pour l’accueil global sans élargir la proposition. Les trois offres visibles plus bas compensent partiellement ce biais.
- La composition typographique dense doit être examinée au rendu 1440/390 et à 320, avec les polices réellement chargées. Le prototype ne prouve pas encore une meilleure compréhension.
- La photo de bien et le dessin ne remplacent pas un vrai document autorisé ou un portrait d’équipe. La distinction explicatif/preuve doit rester visible dans une intégration.
- Une traduction anglaise et les états complets de navigation/contact restent hors de ce prototype de direction artistique.
- La palette s’écarte de l’ivoire/bleu actuel : c’est une hypothèse créative volontaire, avec un coût de continuité de marque à discuter.

## Coût technique relatif et vérification

Coût faible : HTML/CSS inline, deux polices locales réutilisées, une photo AVIF existante, un petit SVG inline, aucune requête cartographique et aucune dépendance d’exécution. Pas de mesure Lighthouse annoncée ; les poids réels et le chargement seront évalués dans la comparaison des explorations.

Contrôle statique : structure HTML et routes relues ; aucun formulaire ni mécanisme d’envoi. **Aucun navigateur lancé pendant la mesure Lighthouse de référence en cours.** La revue visuelle 1440/390 et les contrôles de contraste/clavier restent à effectuer par le responsable après libération du navigateur.
