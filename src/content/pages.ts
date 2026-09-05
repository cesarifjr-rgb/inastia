export type Locale = "fr" | "en";

export type PageContent = {
  slug: string;
  kind: "service" | "location" | "about" | "audit";
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  image: "villa_amichi" | "villa_lova" | "casa_verde";
  imageAlt: string;
  sections: { title: string; text: string; items?: string[] }[];
  faq: { question: string; answer: string }[];
};

export const pages: Record<Locale, PageContent[]> = {
  fr: [
    {
      slug: "conciergerie-airbnb-porto-vecchio",
      kind: "location",
      title: "Conciergerie à Porto-Vecchio | Inastia",
      description:
        "Gestion de location saisonnière à Porto-Vecchio : annonces, accueil, ménage et suivi de votre bien avec Inastia. Parlons de votre projet.",
      eyebrow: "Porto-Vecchio",
      heading: "Votre location avance. Même à distance.",
      intro:
        "À Porto-Vecchio, louer votre maison ne devrait pas occuper toutes vos journées. Annonce, voyageurs, passages sur place : Inastia coordonne ce que vous souhaitez déléguer, avec un suivi clair pour vous.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi, une maison du portfolio Inastia à Pinarello",
      sections: [
        {
          title: "Une saison qui se prépare",
          text: "Avant les premières réservations, nous faisons le point sur votre annonce, vos prix et vos disponibilités. Vous définissez vos périodes personnelles ; nous organisons les prestations nécessaires au logement.",
          items: [
            "Présentation de l’annonce",
            "Tarification et calendrier",
            "Organisation des prestations sur place",
          ],
        },
        {
          title: "Un relais entre chaque séjour",
          text: "Des clés au linge propre, chaque rotation demande de la coordination. Nous organisons les arrivées, le ménage et les contrôles convenus. Les photos après intervention et les anomalies signalées vous donnent des repères concrets.",
          items: [
            "Coordination des arrivées et départs",
            "Contrôle du ménage",
            "Suivi des petites interventions",
          ],
        },
        {
          title: "Les informations qui vous concernent",
          text: "Nous suivons les échanges voyageurs et vous transmettons les points qui demandent votre attention. Vous gardez la vue sur le calendrier et les interventions, sans avoir à coordonner chaque passage vous-même.",
        },
      ],
      faq: [
        {
          question: "Intervenez-vous dans les environs de Porto-Vecchio ?",
          answer:
            "Nous étudions les demandes à Porto-Vecchio et dans ses environs. L’adresse et les contraintes d’accès nous permettent de confirmer les prestations possibles.",
        },
        {
          question:
            "Mon logement est déjà en location. Pouvez-vous reprendre le suivi ?",
          answer:
            "Oui. Nous partons de votre annonce et de votre organisation existantes pour définir les ajustements et préparer le relais.",
        },
        {
          question: "Comment est établi le tarif ?",
          answer:
            "La proposition tient compte du bien, de la saison, de la zone et des prestations retenues. Les frais et les modalités du contrat sont précisés avant le démarrage.",
        },
      ],
    },
    {
      slug: "conciergerie-location-saisonniere-solenzara",
      kind: "location",
      title: "Conciergerie à Solenzara et Sari-Solenzara | Inastia",
      description:
        "À Solenzara, Inastia organise votre location saisonnière : lancement, accueil, ménage, linge et suivi local. Un accompagnement adapté à votre maison.",
      eyebrow: "Solenzara · Sari-Solenzara",
      heading: "À Solenzara, votre relais sur place.",
      intro:
        "Une arrivée à organiser, du linge à préparer, une intervention à suivre. Nous prenons le relais sur le terrain pour que votre location continue à accueillir, même quand vous êtes ailleurs.",
      image: "villa_lova",
      imageAlt: "Cala Lova, à Cala d’Oro, Solenzara",
      sections: [
        {
          title: "Partir de votre logement",
          text: "Les accès, les clés et le rythme des réservations déterminent l’organisation. Nous examinons ces détails avec vous pour prévoir les passages et préparer les arrivées dans les conditions propres à votre maison.",
        },
        {
          title: "Organiser les rotations",
          text: "Quand un départ précède une arrivée, le ménage et le linge doivent suivre le même planning. Les contrôles et les photos documentent la préparation ; les besoins de maintenance vous sont signalés.",
          items: [
            "Ménage et préparation du linge",
            "Organisation de l’accueil",
            "Remontée des anomalies",
          ],
        },
        {
          title: "Prendre le relais au bon moment",
          text: "Première mise en location ou annonce déjà active : nous partons de votre situation. Nous pouvons préparer l’annonce et le guide voyageur, ou coordonner les séjours selon le niveau de délégation retenu.",
        },
      ],
      faq: [
        {
          question: "Pouvez-vous préparer une première mise en location ?",
          answer:
            "Oui. Notre accompagnement au lancement comprend l’audit du logement, la création ou l’amélioration de l’annonce, le calendrier et les règles de séjour.",
        },
        {
          question: "Qui suit les petits travaux ?",
          answer:
            "Nous pouvons signaler et coordonner les besoins de maintenance dans le cadre des prestations convenues. Les interventions et leurs coûts sont à préciser selon le besoin.",
        },
        {
          question: "Puis-je confier seulement les rotations de séjour ?",
          answer:
            "Oui, l’accueil et les rotations constituent une offre dédiée. Nous en définissons les modalités selon le logement et votre calendrier.",
        },
      ],
    },
    {
      slug: "conciergerie-airbnb-zonza-pinarello",
      kind: "location",
      title: "Conciergerie à Zonza et Pinarello | Inastia",
      description:
        "Accueil voyageurs, ménage, linge et gestion de location à Zonza et Pinarello. Inastia accompagne les propriétaires de maisons et villas à distance.",
      eyebrow: "Zonza · Pinarello",
      heading: "À Pinarello, votre maison bien entourée.",
      intro:
        "Accueillir dans une villa familiale, c’est penser aux chambres, aux clés, aux consignes et aux demandes pendant le séjour. Inastia suit ces détails avec vous, pour que la distance pèse moins sur votre quotidien.",
      image: "casa_verde",
      imageAlt: "Casa Verde, à Pinarello, Zonza",
      sections: [
        {
          title: "Une préparation à sa mesure",
          text: "Le nombre de chambres, la capacité d’accueil et les extérieurs donnent le cadre. Nous organisons le ménage, le linge et les contrôles photo selon votre logement et les prestations convenues.",
        },
        {
          title: "Des voyageurs qui ont leurs repères",
          text: "Avant l’arrivée, les consignes d’accès et le guide voyageur donnent les informations utiles. Pendant le séjour, nous suivons les demandes prévues dans votre accompagnement. L’accueil se construit aussi dans ces échanges.",
          items: [
            "Organisation des clés et de l’arrivée",
            "Guide voyageur",
            "Suivi des demandes pendant le séjour",
          ],
        },
        {
          title: "Une présence quand il le faut",
          text: "Clés, consommables, petite réparation : nous coordonnons les besoins sur place dans le périmètre défini ensemble. Le suivi de l’annonce et des prix peut compléter cette présence au fil de la saison.",
        },
      ],
      faq: [
        {
          question: "Accompagnez-vous les villas familiales ?",
          answer:
            "Oui. Nous prenons en compte la capacité, les chambres et les contraintes des extérieurs pour définir l’organisation adaptée.",
        },
        {
          question: "Que contient le guide voyageur ?",
          answer:
            "Il rassemble les informations utiles au séjour, les consignes du logement et des recommandations locales. Son contenu est adapté à votre maison.",
        },
        {
          question: "Puis-je garder des dates pour ma famille ?",
          answer:
            "Oui. Vos périodes d’usage personnel sont intégrées au calendrier afin d’organiser les réservations autour de vos disponibilités.",
        },
      ],
    },
    {
      slug: "conciergerie-airbnb-lecci-saint-cyprien",
      kind: "location",
      title: "Conciergerie à Lecci et Saint-Cyprien | Inastia",
      description:
        "Inastia coordonne annonces, accueil, ménage et linge à Lecci et Saint-Cyprien. Préparez votre saison avec un accompagnement local adapté à votre bien.",
      eyebrow: "Lecci · Saint-Cyprien",
      heading: "Votre bien prêt. Vos séjours suivis.",
      intro:
        "À Lecci et Saint-Cyprien, la qualité d’une location se joue avant et pendant le séjour. Nous relions l’annonce, l’accueil et la préparation du logement pour vous aider à déléguer avec des repères clairs.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi, une maison du portfolio Inastia à Pinarello",
      sections: [
        {
          title: "Une annonce qui dit l’essentiel",
          text: "Les voyageurs doivent comprendre ce que votre maison propose. Nous revoyons la présentation, les équipements et les informations pratiques pour préciser l’annonce avant la saison.",
        },
        {
          title: "Un même suivi pour les prestations",
          text: "Arrivées, départs, ménage et linge sont coordonnés autour du calendrier. Vous disposez d’un interlocuteur pour les prestations convenues et les petites interventions à organiser.",
          items: [
            "Check-in et check-out",
            "Ménage et linge",
            "Signalement des besoins de maintenance",
          ],
        },
        {
          title: "Votre calendrier, vos choix",
          text: "Vos périodes personnelles font partie de l’organisation. Vous choisissez ce que vous gardez en main : les réservations avec un relais pour les rotations, le suivi d’annonce ou la gestion complète.",
        },
      ],
      faq: [
        {
          question: "Peut-on commencer par un audit avant la saison ?",
          answer:
            "Oui. La commune, le type de bien, sa capacité et l’annonce existante nous donnent une première base pour étudier votre projet.",
        },
        {
          question: "L’accueil peut-il être autonome ?",
          answer:
            "Oui. L’accueil personnalisé ou autonome est défini selon le logement et son organisation. Nous préparons les consignes nécessaires aux voyageurs.",
        },
        {
          question: "Dois-je choisir la gestion complète ?",
          answer:
            "Non. Nous proposons aussi le lancement et le suivi d’annonce, ainsi que l’accueil et les rotations. Le choix dépend des tâches que vous souhaitez conserver.",
        },
      ],
    },
    {
      slug: "conciergerie-ghisonaccia",
      kind: "location",
      title: "Conciergerie à Ghisonaccia et Ventiseri | Inastia",
      description:
        "Une conciergerie locale à Ghisonaccia, Ventiseri et Prunelli-di-Fiumorbo : annonces, ménage, linge et suivi de location avec Inastia.",
      eyebrow: "Ghisonaccia · Ventiseri · Prunelli-di-Fiumorbo",
      heading: "Proche de votre bien. Présent pour vous.",
      intro:
        "Depuis Travo, à Ventiseri, nous accompagnons les propriétaires autour de Ghisonaccia et de Prunelli-di-Fiumorbo. Une présence locale pour suivre le logement, préparer les séjours et vous tenir informé.",
      image: "villa_lova",
      imageAlt: "Cala Lova, une maison du portfolio Inastia à Solenzara",
      sections: [
        {
          title: "Connaître la maison pour la suivre",
          text: "Nous partons des accès, des équipements et des besoins de votre logement. Ces informations permettent de cadrer les passages, les contrôles et les comptes rendus utiles après intervention.",
        },
        {
          title: "Faire progresser votre annonce",
          text: "Une annonce existante mérite parfois un nouveau regard. Texte, prix, calendrier : l’audit identifie les priorités. Si vous débutez, nous préparons avec vous les bases de la mise en location.",
          items: [
            "Création ou optimisation d’annonce",
            "Suivi du calendrier",
            "Ajustements selon la saison",
          ],
        },
        {
          title: "Garder un lien avec le terrain",
          text: "Ménage, linge et consommables sont organisés entre les séjours. Nous suivons les imprévus dans le cadre convenu et vous signalons les points qui nécessitent une décision.",
        },
      ],
      faq: [
        {
          question: "Où êtes-vous installés ?",
          answer:
            "Inastia est située à Travo, sur la commune de Ventiseri. Nous accompagnons notamment les biens à Ghisonaccia, Ventiseri et Prunelli-di-Fiumorbo.",
        },
        {
          question: "Travaillez-vous avec Airbnb et Booking ?",
          answer:
            "La création ou l’amélioration d’annonce peut concerner Airbnb et Booking. Nous définissons les plateformes adaptées à votre projet, sans affiliation à ces plateformes.",
        },
        {
          question: "Quels renseignements envoyer pour commencer ?",
          answer:
            "Indiquez la commune, le type de bien, la capacité d’accueil et votre situation actuelle : première location, annonce existante ou besoin de relais sur place.",
        },
      ],
    },
    {
      slug: "gestion-airbnb-corse-du-sud",
      kind: "service",
      title: "Gestion de location saisonnière en Corse | Inastia",
      description:
        "Confiez le suivi de votre location à Inastia : annonces, calendrier, voyageurs et coordination sur place, de Ghisonaccia à Porto-Vecchio.",
      eyebrow: "Gestion complète",
      heading: "Déléguez le quotidien. Gardez la main.",
      intro:
        "Une location réunit beaucoup de tâches. Inastia coordonne l’annonce, les voyageurs et les prestations sur place pour vous rendre du temps, tout en vous laissant la visibilité sur votre bien.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi, à Pinarello, Zonza",
      sections: [
        {
          title: "Ce que vous confiez : annonce et séjours",
          text: "Nous créons ou améliorons l’annonce, suivons les disponibilités et ajustons les prix selon la saison. Nous coordonnons la communication voyageurs, les arrivées, le ménage, le linge et les clés dans le périmètre convenu.",
          items: [
            "Création ou optimisation d’annonce",
            "Suivi des prix et disponibilités",
            "Communication voyageurs et suivi des avis",
          ],
        },
        {
          title: "Ce que vous gardez : vos séjours et vos décisions",
          text: "Vos périodes personnelles sont intégrées au calendrier. Les besoins de maintenance vous sont signalés ; nous suivons les interventions convenues et vous sollicitons pour les décisions qui vous reviennent.",
        },
        {
          title: "Commission, frais et durée à convenir",
          text: "Votre proposition précise les prestations, la commission sur les revenus locatifs et les frais éventuels. La durée et les modalités figurent au contrat. Ce cadre est défini avant le démarrage.",
        },
      ],
      faq: [
        {
          question: "Dans quel secteur proposez-vous la gestion ?",
          answer:
            "Nous accompagnons des biens sur la côte est de la Corse, de Ghisonaccia à Porto-Vecchio. L’adresse précise permet de confirmer la prise en charge et son organisation.",
        },
        {
          question: "Puis-je continuer à occuper mon logement ?",
          answer:
            "Oui. Vous pouvez réserver des périodes pour votre usage personnel. Elles sont prises en compte dans le calendrier de location.",
        },
        {
          question: "La gestion complète a-t-elle un tarif unique ?",
          answer:
            "Non. La commission et les frais éventuels dépendent du bien, de la zone, de la saison et des services retenus. Une proposition personnalisée précise le coût et les conditions.",
        },
      ],
    },
    {
      slug: "menage-airbnb-corse-du-sud",
      kind: "service",
      title: "Ménage, linge et accueil voyageurs en Corse | Inastia",
      description:
        "Organisez vos rotations avec Inastia : ménage, linge, check-in, check-out et contrôles du logement, sur la côte est de la Corse.",
      eyebrow: "Accueil & rotation séjour",
      heading: "Vous gérez les réservations. Nous préparons l’accueil.",
      intro:
        "Vous souhaitez garder la gestion de vos annonces et réservations ? Confiez-nous le relais entre deux séjours : ménage, linge, arrivée, départ et contrôle du logement, selon vos besoins.",
      image: "casa_verde",
      imageAlt: "Casa Verde, à Pinarello, Zonza",
      sections: [
        {
          title: "Ce que vous confiez : la préparation entre deux séjours",
          text: "Ménage, linge, consommables, remise des clés et consignes : nous préparons les passages selon vos besoins. L’accueil personnalisé ou autonome est organisé en amont, avec les informations utiles à l’arrivée et au départ.",
          items: [
            "Ménage après séjour",
            "Linge selon les besoins convenus",
            "Accueil et contrôle du logement",
          ],
        },
        {
          title: "Ce que vous gardez : annonce, réservations et décisions",
          text: "Vous conservez la gestion de l’annonce et des réservations. Une checklist et des photos de fin d’intervention documentent la préparation. Nous vous signalons les anomalies constatées pour que vous puissiez décider des suites nécessaires.",
        },
        {
          title: "Prestations et coût à convenir",
          text: "La proposition tient compte de la surface, du nombre de chambres, des accès et des prestations souhaitées. Le ménage, le linge et les consommables y sont précisés, avec leur prise en charge et leur coût. Votre calendrier permet d’organiser les passages.",
        },
      ],
      faq: [
        {
          question: "Puis-je garder la gestion de mes réservations ?",
          answer:
            "Oui. Cette offre permet de confier l’accueil et les rotations tout en conservant la gestion de l’annonce et des réservations.",
        },
        {
          question: "Le linge est-il systématiquement inclus ?",
          answer:
            "Le linge et les consommables sont définis selon vos besoins dans la proposition. Leur prise en charge et leur coût sont précisés avant le démarrage.",
        },
        {
          question: "Comment évaluez-vous une rotation ?",
          answer:
            "Nous prenons en compte la surface, le nombre de chambres, les accès et les prestations souhaitées. Votre calendrier permet ensuite de préparer l’organisation des passages.",
        },
      ],
    },
    {
      slug: "pack-lancement-airbnb",
      kind: "service",
      title: "Lancement et gestion d’annonce Airbnb | Inastia",
      description:
        "Préparez votre mise en location : audit du logement, annonce, calendrier, prix de départ et suivi des ajustements avec Inastia en Corse.",
      eyebrow: "Lancement & gestion d’annonce",
      heading: "Votre maison mérite une annonce à sa mesure.",
      intro:
        "La mise en location commence avant la publication. Nous vous aidons à présenter votre logement, fixer les règles de séjour et préparer le calendrier, puis à ajuster l’annonce après son lancement.",
      image: "villa_lova",
      imageAlt: "Cala Lova, à Cala d’Oro, Solenzara",
      sections: [
        {
          title: "Ce que vous confiez : préparer et ajuster l’annonce",
          text: "Nous examinons la présentation et les équipements du logement, puis préparons ou améliorons l’annonce. Le titre, le texte, les règles de séjour, les prix de départ et les disponibilités s’appuient sur les atouts réels de votre bien.",
          items: [
            "Création ou amélioration de l’annonce",
            "Texte et règles de séjour",
            "Calendrier et prix de départ",
          ],
        },
        {
          title: "Ce qui reste à organiser : l’accueil et les rotations",
          text: "Cette offre porte sur l’annonce. L’accueil, le ménage et les rotations font l’objet d’une offre dédiée, qui peut compléter votre accompagnement. Le niveau de délégation se définit selon les tâches que vous souhaitez conserver.",
        },
        {
          title: "Suivi, durée et coût à convenir",
          text: "Après publication, le suivi de la visibilité, du calendrier et des premiers retours permet d’ajuster l’annonce. Nous définissons ensemble le périmètre et la durée de ce suivi ; les prestations et leur coût sont précisés dans la proposition.",
        },
      ],
      faq: [
        {
          question: "Cette offre convient-elle à une annonce déjà publiée ?",
          answer:
            "Oui. Nous pouvons reprendre une annonce existante, en revoir la présentation et travailler sur le calendrier, les prix et les règles de séjour.",
        },
        {
          question: "Le ménage et l’accueil font-ils partie du lancement ?",
          answer:
            "Le lancement concerne la préparation et la gestion d’annonce. L’accueil et les rotations font l’objet d’une offre dédiée, qui peut compléter votre accompagnement.",
        },
        {
          question: "Quand faut-il préparer son annonce ?",
          answer:
            "L’idéal est de prévoir la préparation avant l’ouverture du calendrier à la location. Nous étudions votre état d’avancement et les points à traiter en priorité.",
        },
      ],
    },
    {
      slug: "about",
      kind: "about",
      title: "Une conciergerie familiale en Corse | Inastia",
      description:
        "Découvrez Inastia, une entreprise familiale de conciergerie sur la côte est de la Corse. Un lien direct avec les propriétaires, une attention au séjour.",
      eyebrow: "L’esprit Inastia",
      heading: "Une famille. Le soin de votre maison.",
      intro:
        "Nous connaissons la question qui se pose quand on confie ses clés : qui prendra soin de la maison ? Inastia est née de cette expérience de propriétaires, avec la volonté d’accompagner d’autres propriétaires en Corse.",
      image: "casa_verde",
      imageAlt: "Casa Verde, une maison accompagnée par Inastia à Pinarello",
      sections: [
        {
          title: "Définir ce que vous souhaitez déléguer",
          text: "Inastia est une entreprise familiale, née de notre expérience de propriétaires. Le premier échange porte sur votre logement, sa commune et votre organisation actuelle. Vos attentes et vos périodes personnelles permettent de définir l’accompagnement.",
        },
        {
          title: "Échanger directement sur le suivi de votre bien",
          text: "Vous échangez avec nous pour organiser les prestations convenues et suivre votre logement. Nous vous signalons les points qui demandent une décision : anomalie constatée, besoin de maintenance ou intervention à prévoir.",
        },
        {
          title: "Coordonner la préparation et l’accueil",
          text: "Préparer le logement, transmettre les consignes et suivre les demandes font partie des tâches que nous coordonnons selon votre accompagnement. Nous sommes installés à Travo, à Ventiseri ; l’adresse de votre bien permet de confirmer les prestations possibles entre Ghisonaccia et Porto-Vecchio.",
        },
      ],
      faq: [
        {
          question: "Où se situe Inastia ?",
          answer:
            "Notre entreprise est installée à Travo, sur la commune de Ventiseri. Notre secteur s’étend sur la côte est de la Corse, de Ghisonaccia à Porto-Vecchio.",
        },
        {
          question: "Comment se passe un premier échange ?",
          answer:
            "Nous parlons de votre logement, de son emplacement et de votre organisation actuelle. Cela nous permet de vous orienter vers l’accompagnement adapté.",
        },
        {
          question: "Faut-il déjà louer son bien pour vous contacter ?",
          answer:
            "Non. Nous accompagnons aussi la préparation d’une première mise en location, avec un audit du logement et une offre de lancement d’annonce.",
        },
      ],
    },
    {
      slug: "audit-gratuit-potentiel-locatif",
      kind: "audit",
      title: "Audit gratuit de votre location en Corse | Inastia",
      description:
        "Recevez une première analyse qualitative de votre bien en Corse : annonce, positionnement et priorités. Demandez votre audit gratuit à Inastia.",
      eyebrow: "Audit gratuit",
      heading: "Identifiez les priorités de votre location.",
      intro:
        "Un premier audit gratuit et qualitatif pour repérer les points à travailler et choisir votre accompagnement. Cette analyse ne constitue pas une prévision de revenus.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi, à Pinarello, Zonza",
      sections: [
        {
          title: "1. Présenter votre bien et votre situation",
          text: "Indiquez la commune, le type de logement, la capacité d’accueil et votre organisation actuelle. Ajoutez le lien de l’annonce si elle existe. Ces informations nous permettent d’étudier votre demande dans notre secteur, de Ghisonaccia à Porto-Vecchio.",
        },
        {
          title: "2. Identifier les points à travailler",
          text: "À partir des informations sur votre bien et de l’annonce disponible, nous examinons la présentation, les équipements, les prix et les avis. Nous vous présentons cette première analyse qualitative par appel ou par email pour guider vos choix.",
          items: [
            "Points à améliorer en priorité",
            "Recommandations sur l’annonce ou l’expérience de séjour",
            "Orientation vers l’accompagnement utile",
          ],
        },
        {
          title: "3. Choisir la suite de l’accompagnement",
          text: "Si vous souhaitez ensuite confier des prestations à Inastia, nous en précisons le périmètre, le coût et les conditions dans une proposition distincte. Le premier audit reste une analyse qualitative ; il ne garantit pas de revenus locatifs.",
        },
      ],
      faq: [
        {
          question: "L’audit est-il payant ?",
          answer:
            "Non, ce premier audit qualitatif est gratuit. Si vous souhaitez ensuite un accompagnement, les prestations et leurs conditions vous sont présentées séparément.",
        },
        {
          question: "Donnez-vous un montant de revenus garanti ?",
          answer:
            "Non. L’audit est une première analyse qualitative des points à travailler. Les résultats d’une location dépendent notamment du bien, des disponibilités et de la demande.",
        },
        {
          question:
            "Mon logement n’a pas encore d’annonce. Puis-je demander un audit ?",
          answer:
            "Oui. La localisation, le type de bien, sa capacité et votre projet nous permettent de commencer l’échange et d’identifier les étapes de préparation.",
        },
      ],
    },
  ],
  en: [
    {
      slug: "conciergerie-airbnb-porto-vecchio",
      kind: "location",
      title: "Holiday rental management in Porto-Vecchio | Inastia",
      description:
        "Inastia looks after listings, guest arrivals, cleaning and property coordination in Porto-Vecchio. Tell us about your holiday home.",
      eyebrow: "Porto-Vecchio",
      heading: "Your rental keeps moving. Even from afar.",
      intro:
        "Renting out your Porto-Vecchio home should not take over your days. Listings, guests and visits to the property: Inastia coordinates the work you choose to hand over and keeps you informed.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi, an Inastia portfolio home in Pinarello",
      sections: [
        {
          title: "Prepare before the season",
          text: "We review your listing, prices and availability before the first bookings. You set aside your own stays; we organise the services your property needs.",
          items: [
            "Listing presentation",
            "Pricing and availability",
            "Coordination of on-site services",
          ],
        },
        {
          title: "A local hand between stays",
          text: "From keys to clean linen, each changeover takes coordination. We organise arrivals, cleaning and the agreed checks. Photographs after visits and reported issues give you a clear view of the work.",
          items: [
            "Arrival and departure coordination",
            "Cleaning checks",
            "Follow-up on minor maintenance",
          ],
        },
        {
          title: "The updates you need",
          text: "We handle guest conversations and bring matters that need your attention to you. You keep sight of the calendar and property visits without coordinating every visit yourself.",
        },
      ],
      faq: [
        {
          question: "Do you cover the area around Porto-Vecchio?",
          answer:
            "We consider properties in Porto-Vecchio and the surrounding area. The exact address and access requirements help us confirm which services we can provide.",
        },
        {
          question: "Can you take over an existing rental?",
          answer:
            "Yes. We review your current listing and arrangements to identify any adjustments and prepare the handover.",
        },
        {
          question: "How is the price calculated?",
          answer:
            "Our proposal takes account of your property, the season, its location and the services selected. Fees and contract terms are set out before the service begins.",
        },
      ],
    },
    {
      slug: "conciergerie-location-saisonniere-solenzara",
      kind: "location",
      title: "Holiday rental management in Solenzara | Inastia",
      description:
        "Inastia coordinates holiday rentals in Solenzara: listing launches, guest arrivals, cleaning, linen and local support tailored to your home.",
      eyebrow: "Solenzara · Sari-Solenzara",
      heading: "Your local support in Solenzara.",
      intro:
        "An arrival to arrange, linen to prepare, maintenance to follow up. We take care of the work on the ground so your rental can keep welcoming guests while you are elsewhere.",
      image: "villa_lova",
      imageAlt: "Cala Lova in Cala d’Oro, Solenzara",
      sections: [
        {
          title: "Start with the property",
          text: "Access, keys and the booking calendar shape the arrangements. We work through these details with you to plan visits and prepare arrivals around your home’s requirements.",
        },
        {
          title: "Coordinate each changeover",
          text: "When one stay follows another, cleaning and linen need a shared plan. Checks and photographs document the preparations, and maintenance needs are reported to you.",
          items: [
            "Cleaning and linen preparation",
            "Guest arrival arrangements",
            "Reporting issues found on site",
          ],
        },
        {
          title: "Step in when you need us",
          text: "Whether you are launching a rental or already taking bookings, we start with your current arrangements. We can prepare the listing and guest guide or coordinate stays within the support you choose.",
        },
      ],
      faq: [
        {
          question: "Can you help with a first rental launch?",
          answer:
            "Yes. Our launch support includes reviewing the property, creating or improving the listing, and preparing the calendar and house rules.",
        },
        {
          question: "Who follows up on minor maintenance?",
          answer:
            "We can report and coordinate maintenance needs within the agreed scope. The work required and its cost are defined according to the situation.",
        },
        {
          question: "Can I book changeover support on its own?",
          answer:
            "Yes. Guest arrivals and changeovers are a separate service. We agree the arrangements around your property and calendar.",
        },
      ],
    },
    {
      slug: "conciergerie-airbnb-zonza-pinarello",
      kind: "location",
      title: "Holiday rental management in Zonza and Pinarello | Inastia",
      description:
        "Guest arrivals, cleaning, linen and rental management in Zonza and Pinarello. Inastia supports villa and holiday home owners from a distance.",
      eyebrow: "Zonza · Pinarello",
      heading: "Your Pinarello home, in good hands.",
      intro:
        "Hosting in a family villa means thinking about bedrooms, keys, instructions and requests during the stay. Inastia helps you look after these details so distance asks less of your day.",
      image: "casa_verde",
      imageAlt: "Casa Verde in Pinarello, Zonza",
      sections: [
        {
          title: "Preparation that fits your home",
          text: "Bedrooms, guest capacity and outdoor spaces set the scope. We organise cleaning, linen and photographic checks around your property and the services agreed.",
        },
        {
          title: "Help guests find their bearings",
          text: "Access instructions and the guest guide share useful details before arrival. During the stay, we handle requests within your agreed support. A welcome takes shape in these conversations too.",
          items: [
            "Keys and arrival arrangements",
            "A guest guide",
            "Support with requests during the stay",
          ],
        },
        {
          title: "Someone on the ground",
          text: "Keys, supplies or a minor repair: we coordinate practical needs within the agreed scope. Listing and pricing support can complement this local presence through the season.",
        },
      ],
      faq: [
        {
          question: "Do you look after family villas?",
          answer:
            "Yes. We consider guest capacity, bedrooms and outdoor requirements to agree suitable arrangements for the property.",
        },
        {
          question: "What goes into the guest guide?",
          answer:
            "It brings together useful information for the stay, house instructions and local recommendations. The content is tailored to your home.",
        },
        {
          question: "Can I keep dates for my family?",
          answer:
            "Yes. Your personal stays are included in the calendar so bookings can be organised around your availability.",
        },
      ],
    },
    {
      slug: "conciergerie-airbnb-lecci-saint-cyprien",
      kind: "location",
      title: "Holiday rental management in Lecci and Saint-Cyprien | Inastia",
      description:
        "Inastia coordinates listings, guest arrivals, cleaning and linen in Lecci and Saint-Cyprien. Local support to help prepare your rental season.",
      eyebrow: "Lecci · Saint-Cyprien",
      heading: "A prepared home. A supported stay.",
      intro:
        "In Lecci and Saint-Cyprien, a good rental experience begins before arrival. We bring together the listing, the welcome and property preparation so you can delegate with clear expectations.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi, an Inastia portfolio home in Pinarello",
      sections: [
        {
          title: "A listing that makes things clear",
          text: "Guests need to understand what your home offers. We review the presentation, amenities and practical information to clarify the listing before the season.",
        },
        {
          title: "Services coordinated together",
          text: "Arrivals, departures, cleaning and linen are planned around the calendar. You have a contact for the agreed services and minor interventions that need arranging.",
          items: [
            "Check-in and check-out",
            "Cleaning and linen",
            "Maintenance needs reported",
          ],
        },
        {
          title: "Your calendar, your choices",
          text: "Your own stays are part of the plan. Choose what to keep managing: bookings with local changeover support, your listing with ongoing help, or full management.",
        },
      ],
      faq: [
        {
          question: "Can we start with a review before the season?",
          answer:
            "Yes. The location, property type, guest capacity and any existing listing give us a starting point to review your project.",
        },
        {
          question: "Is self check-in possible?",
          answer:
            "Yes. Personal or self check-in is agreed according to the property and its arrangements. We prepare the instructions guests will need.",
        },
        {
          question: "Do I have to choose full management?",
          answer:
            "No. We also offer listing launch and management, as well as guest arrival and changeover support. The choice depends on the tasks you want to keep.",
        },
      ],
    },
    {
      slug: "conciergerie-ghisonaccia",
      kind: "location",
      title: "Holiday rental management in Ghisonaccia and Ventiseri | Inastia",
      description:
        "Local rental support in Ghisonaccia, Ventiseri and Prunelli-di-Fiumorbo: listings, cleaning, linen and property coordination with Inastia.",
      eyebrow: "Ghisonaccia · Ventiseri · Prunelli-di-Fiumorbo",
      heading: "Close to your home. Here for you.",
      intro:
        "Based in Travo, Ventiseri, we support owners around Ghisonaccia and Prunelli-di-Fiumorbo. Local help to look after the property, prepare stays and keep you informed.",
      image: "villa_lova",
      imageAlt: "Cala Lova, an Inastia portfolio home in Solenzara",
      sections: [
        {
          title: "Know the home before planning the work",
          text: "We start with access, amenities and your property’s needs. These details help define visits, checks and the information worth sharing after each intervention.",
        },
        {
          title: "Give your listing a fresh perspective",
          text: "An existing listing can benefit from another look. Copy, prices and availability: the review identifies priorities. If you are starting out, we help prepare the foundations for your first rental.",
          items: [
            "Listing creation or improvement",
            "Calendar management",
            "Seasonal adjustments",
          ],
        },
        {
          title: "Keep a link to the property",
          text: "Cleaning, linen and supplies are organised between stays. We follow up on unexpected issues within the agreed service and let you know when a decision is needed.",
        },
      ],
      faq: [
        {
          question: "Where are you based?",
          answer:
            "Inastia is based in Travo, in the municipality of Ventiseri. Our coverage includes Ghisonaccia, Ventiseri and Prunelli-di-Fiumorbo.",
        },
        {
          question: "Do you work with Airbnb and Booking?",
          answer:
            "Listing creation or improvement can cover Airbnb and Booking. We agree which platforms suit your project; we are not affiliated with these platforms.",
        },
        {
          question: "What should I send to get started?",
          answer:
            "Share the municipality, property type, guest capacity and your current situation: a first rental, an existing listing or a need for practical help on site.",
        },
      ],
    },
    {
      slug: "gestion-airbnb-corse-du-sud",
      kind: "service",
      title: "Holiday rental management in Corsica | Inastia",
      description:
        "Inastia coordinates your listing, calendar, guests and on-site services along Corsica’s east coast, from Ghisonaccia to Porto-Vecchio.",
      eyebrow: "Full rental management",
      heading: "Hand over the work. Keep the choice.",
      intro:
        "A holiday rental brings many tasks together. Inastia coordinates your listing, guests and on-site services to give you time back while keeping you informed about your home.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi in Pinarello, Zonza",
      sections: [
        {
          title: "What you delegate: listings and stays",
          text: "We create or improve your listing, manage availability and adjust prices through the season. We coordinate guest communication, arrivals, cleaning, linen and keys within the agreed scope.",
          items: [
            "Listing creation or improvement",
            "Pricing and availability management",
            "Guest communication and review follow-up",
          ],
        },
        {
          title: "What you keep: your stays and decisions",
          text: "Your personal stays are included in the calendar. We report maintenance needs, follow up on agreed work and bring decisions that belong to you to your attention.",
        },
        {
          title: "Commission, fees and duration to agree",
          text: "Your proposal sets out the services, commission on rental income and any additional fees. Duration and terms are specified in the contract. This framework is agreed before the service begins.",
        },
      ],
      faq: [
        {
          question: "Where is full management available?",
          answer:
            "We support properties on Corsica’s east coast, from Ghisonaccia to Porto-Vecchio. The exact address lets us confirm coverage and the practical arrangements.",
        },
        {
          question: "Can I still stay in my home?",
          answer:
            "Yes. You can keep periods for your personal use. These are taken into account in the rental calendar.",
        },
        {
          question: "Is there one fixed management rate?",
          answer:
            "No. Commission and any additional fees depend on the property, location, season and selected services. A personalised proposal sets out the cost and terms.",
        },
      ],
    },
    {
      slug: "menage-airbnb-corse-du-sud",
      kind: "service",
      title: "Cleaning, linen and guest arrivals in Corsica | Inastia",
      description:
        "Plan rental changeovers with Inastia: cleaning, linen, check-in, check-out and property checks along Corsica’s east coast.",
      eyebrow: "Guest arrivals & changeovers",
      heading: "You manage bookings. We prepare the welcome.",
      intro:
        "Want to keep managing your listings and reservations? Let us coordinate the work between stays: cleaning, linen, arrivals, departures and property checks, according to your needs.",
      image: "casa_verde",
      imageAlt: "Casa Verde in Pinarello, Zonza",
      sections: [
        {
          title: "What you delegate: preparing for the next stay",
          text: "Cleaning, linen, supplies, keys and instructions: we plan visits around your needs. Personal or self check-in is arranged in advance, with the information guests need for arrival and departure.",
          items: [
            "Cleaning after each stay",
            "Linen according to agreed needs",
            "Guest arrivals and property checks",
          ],
        },
        {
          title: "What you keep: listings, bookings and decisions",
          text: "You continue to manage your listing and reservations. A checklist and photographs record the completed preparations. We report issues found so you can decide what further work is needed.",
        },
        {
          title: "Services and cost to agree",
          text: "The proposal takes account of floor area, bedrooms, access and the services requested. It specifies cleaning, linen and supplies, with the scope and cost of each. Your booking calendar helps us plan the visits.",
        },
      ],
      faq: [
        {
          question: "Can I keep managing my own bookings?",
          answer:
            "Yes. This service lets you delegate arrivals and changeovers while continuing to manage your listing and reservations.",
        },
        {
          question: "Is linen always included?",
          answer:
            "Linen and supplies are agreed according to your needs in the proposal. The scope and cost are specified before the service begins.",
        },
        {
          question: "How do you assess a changeover?",
          answer:
            "We consider floor area, bedrooms, access and the services required. Your booking calendar then helps us plan the visits.",
        },
      ],
    },
    {
      slug: "pack-lancement-airbnb",
      kind: "service",
      title: "Airbnb listing launch and management | Inastia",
      description:
        "Prepare your rental launch in Corsica with Inastia: property review, listing, calendar, initial pricing and ongoing adjustments.",
      eyebrow: "Listing launch & management",
      heading: "A listing worthy of your home.",
      intro:
        "Launching a rental starts before publication. We help you present your home, set house rules and prepare the calendar, then adjust the listing after it goes live.",
      image: "villa_lova",
      imageAlt: "Cala Lova in Cala d’Oro, Solenzara",
      sections: [
        {
          title: "What you delegate: preparing and updating the listing",
          text: "We review the property’s presentation and amenities, then prepare or improve the listing. Its title, copy, house rules, initial prices and availability reflect your home’s real strengths.",
          items: [
            "Listing creation or improvement",
            "Copy and house rules",
            "Calendar and initial pricing",
          ],
        },
        {
          title: "What still needs arranging: arrivals and changeovers",
          text: "This service focuses on the listing. Guest arrivals, cleaning and changeovers are a separate offer that can complement your support. The level of delegation depends on the tasks you want to keep.",
        },
        {
          title: "Ongoing support, duration and cost to agree",
          text: "After publication, reviewing visibility, availability and early feedback helps guide adjustments. We agree the scope and duration of this support together; the services and their cost are set out in the proposal.",
        },
      ],
      faq: [
        {
          question: "Is this suitable for an existing listing?",
          answer:
            "Yes. We can review an existing listing, improve its presentation and work on the calendar, pricing and house rules.",
        },
        {
          question: "Does the launch include cleaning and guest arrivals?",
          answer:
            "This service covers listing preparation and management. Guest arrivals and changeovers are a separate offer that can complement your support.",
        },
        {
          question: "When should I start preparing the listing?",
          answer:
            "Ideally, preparation begins before you open the calendar for bookings. We review your progress and identify the priorities with you.",
        },
      ],
    },
    {
      slug: "about",
      kind: "about",
      title: "A family-run rental concierge in Corsica | Inastia",
      description:
        "Meet Inastia, a family-run concierge on Corsica’s east coast. Direct relationships with owners and thoughtful attention to every stay.",
      eyebrow: "The Inastia approach",
      heading: "A family. A home in good hands.",
      intro:
        "We know the question that comes with handing over your keys: who will care for the house? Inastia grew from our own experience as owners and a desire to support other homeowners in Corsica.",
      image: "casa_verde",
      imageAlt: "Casa Verde, a home supported by Inastia in Pinarello",
      sections: [
        {
          title: "Agree what you want to delegate",
          text: "Inastia is a family-run company that grew from our own experience as owners. The first conversation covers your property, its location and your current arrangements. Your expectations and personal stays help define the support.",
        },
        {
          title: "Speak directly about your property",
          text: "You speak with us to organise the agreed services and follow your home. We report matters that need a decision, such as an issue found, a maintenance need or work to arrange.",
        },
        {
          title: "Coordinate preparation and guest arrivals",
          text: "Preparing the home, sharing instructions and following up on requests are tasks we coordinate within your chosen support. We are based in Travo, Ventiseri; your property’s address helps us confirm the services available between Ghisonaccia and Porto-Vecchio.",
        },
      ],
      faq: [
        {
          question: "Where is Inastia based?",
          answer:
            "We are based in Travo, in the municipality of Ventiseri. Our area extends along Corsica’s east coast, from Ghisonaccia to Porto-Vecchio.",
        },
        {
          question: "What happens in a first conversation?",
          answer:
            "We discuss your property, its location and your current arrangements. This helps us guide you towards the right level of support.",
        },
        {
          question: "Do I need to be renting already?",
          answer:
            "No. We also help owners prepare a first rental, with a property review and a listing launch service.",
        },
      ],
    },
    {
      slug: "audit-gratuit-potentiel-locatif",
      kind: "audit",
      title: "Free holiday rental review in Corsica | Inastia",
      description:
        "Get an initial qualitative review of your Corsican property: listing, positioning and priorities. Request your free rental review from Inastia.",
      eyebrow: "Free rental review",
      heading: "Identify the priorities for your rental.",
      intro:
        "A free initial qualitative review to identify what needs attention and help you choose the right support. This assessment is not a rental income forecast.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi in Pinarello, Zonza",
      sections: [
        {
          title: "1. Tell us about your property and plans",
          text: "Share the municipality, property type, guest capacity and current arrangements. Add a link to the listing if one exists. These details let us consider your request within our area, from Ghisonaccia to Porto-Vecchio.",
        },
        {
          title: "2. Identify what needs attention",
          text: "Using your property details and any available listing, we review the presentation, amenities, prices and reviews. We share this initial qualitative assessment by phone or email to help guide your choices.",
          items: [
            "Priority areas for improvement",
            "Recommendations on the listing or guest experience",
            "Guidance on useful support",
          ],
        },
        {
          title: "3. Choose your next steps",
          text: "If you then wish to arrange services with Inastia, a separate proposal sets out their scope, cost and terms. The initial review remains a qualitative assessment; it does not guarantee rental income.",
        },
      ],
      faq: [
        {
          question: "Is there a fee for the review?",
          answer:
            "No, this initial qualitative review is free. If you then wish to arrange ongoing support, the services and terms are presented separately.",
        },
        {
          question: "Do you guarantee an income figure?",
          answer:
            "No. The review is an initial qualitative assessment of areas to work on. Rental results depend on factors including the property, availability and demand.",
        },
        {
          question: "Can I request a review before I have a listing?",
          answer:
            "Yes. The location, property type, capacity and your plans give us a starting point for the conversation and the preparation needed.",
        },
      ],
    },
  ],
};
