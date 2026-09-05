# A — Architecture habitée

**Concept.** Une ouverture sur une maison réelle, puis une lecture du service comme un plan de responsabilités. L’architecture vient du cadrage et des proportions ; aucune nouvelle maison ni promesse de luxe n’est créée.

**Vocabulaire.** Porcelaine `#f5f3ee`, surface `#fcfbf7`, charbon `#252e2c`, texte secondaire `#596562`, bleu `#225e74`. Ouverture en arc unique, lignes de structure, numéros de sections et légendes extérieures au cadre. Pas de dégradé ni de cartes arrondies répétitives.

**Typographie.** Georgia éditoriale pour H1/H2/noms d’offres, avec italique réservé au second temps de la promesse ; Manrope locale pour informations et contrôles. Corps 16 px, labels et liens au moins 14 px. Le titre utilise un clamp jusqu’à 76 px sur ordinateur et 44 px sur mobile. Aucune fonte externe.

**Composition.** Premier écran à deux colonnes, texte/action à gauche et photographie cadrée à droite. Le comparatif intérieur est un registre horizontal : numéro, offre puis responsabilités et coût. À 390 px, texte/action précèdent une ouverture photographique raccourcie ; chaque offre devient une séquence verticale avec rubriques lisibles. Pas de carrousel ni d’information cachée. Cible ordinateur 1440 px, mobile 390 px ; inspection de rendu à effectuer par le responsable après la mesure de référence.

**Photographie.** Seule l’image existante `assets/villa_amichi-1200.avif` est utilisée, légendée Villa d’Amichi / Pinarello / Zonza / portfolio. Le recadrage est une proposition de présentation. Aucune disponibilité ou réservation associée. La bonne conservation des détails du bien doit être jugée sur les captures.

**Interaction et mouvement.** Aucun JavaScript ni bibliothèque. Ancres natives, liens de services vers les pages publiques, CTA vers Contact avec `intent=audit`. Aucun formulaire. Focus visible ; défilement lissé natif désactivé avec réduction des mouvements. La direction est intégralement statique.

**Risques.** L’arc peut être perçu comme un code d’hôtellerie : le texte propriétaire et le registre des responsabilités doivent rester dominants. Georgia peut sembler plus institutionnelle et moins propre à la marque que Space Grotesk ; à comparer aux autres directions, sans les mélanger. Le recadrage mobile doit rester identifiable et la longueur des rubriques nécessite une lecture verticale assumée. Le prototype français ne démontre pas encore les coupures anglaises ni l’ensemble du site.

**Coût technique relatif : faible.** Un HTML autonome, CSS intégré, une police locale et une photographie existante. Pas de dépendance ni de rendu continu. Aucun chiffre de performance revendiqué : captures, contrôles responsive et mesures non exécutés dans cette sous-tâche.
