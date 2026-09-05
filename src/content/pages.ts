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
        "À Porto-Vecchio, louer votre maison ne devrait pas occuper toutes vos journées. Notre gestion complète relie l’annonce, les voyageurs et la coordination sur place, dans un périmètre défini avec vous.",
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
        "Gestion complète de location saisonnière à Solenzara : annonce, voyageurs et coordination locale, selon les prestations convenues pour votre maison.",
      eyebrow: "Solenzara · Sari-Solenzara",
      heading: "À Solenzara, votre relais sur place.",
      intro:
        "Une annonce à suivre, une arrivée à organiser, une maison à préparer. À Solenzara, notre gestion complète coordonne la location et les prestations sur place dans le cadre convenu avec vous.",
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
          text: "Première mise en location ou annonce déjà active : nous partons de votre situation pour préparer la gestion complète. Le suivi de l’annonce, le guide voyageur et la coordination des séjours s’inscrivent dans un même accompagnement, dont le périmètre est convenu avec vous.",
        },
      ],
      faq: [
        {
          question: "Pouvez-vous préparer une première mise en location ?",
          answer:
            "Oui. Le premier audit gratuit permet de faire le point sur votre logement. La préparation de l’annonce, du calendrier et des règles de séjour peut ensuite être organisée dans le cadre de la gestion complète, selon les prestations convenues.",
        },
        {
          question: "Qui suit les petits travaux ?",
          answer:
            "Nous pouvons signaler et coordonner les besoins de maintenance dans le cadre des prestations convenues. Les interventions et leurs coûts sont à préciser selon le besoin.",
        },
        {
          question:
            "Comment les rotations s’intègrent-elles à la gestion complète ?",
          answer:
            "Nous les coordonnons avec les réservations et les arrivées dans le cadre de la gestion complète. Les passages, le ménage, le linge et les consommables sont précisés dans la proposition, avec leurs coûts.",
        },
      ],
    },
    {
      slug: "conciergerie-airbnb-zonza-pinarello",
      kind: "location",
      title: "Conciergerie à Zonza et Pinarello | Inastia",
      description:
        "Gestion complète de location à Zonza et Pinarello. Inastia coordonne l’annonce, les voyageurs et les prestations convenues pour votre maison.",
      eyebrow: "Zonza · Pinarello",
      heading: "À Pinarello, votre maison bien entourée.",
      intro:
        "Accueillir dans une villa familiale, c’est penser aux chambres, aux clés, aux consignes et aux demandes pendant le séjour. Notre gestion complète relie ces détails au suivi de l’annonce et des réservations, selon le périmètre convenu.",
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
          text: "Le suivi de l’annonce, des prix et du calendrier est relié à la coordination sur place dans notre gestion complète. Clés, consommables ou petite réparation : les besoins, les prestations et leurs coûts sont définis ensemble, et les interventions qui demandent votre décision vous sont signalées.",
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
        "Gestion complète à Lecci et Saint-Cyprien : annonce, réservations et coordination des séjours. Un périmètre et des coûts définis pour votre bien.",
      eyebrow: "Lecci · Saint-Cyprien",
      heading: "Votre bien prêt. Vos séjours suivis.",
      intro:
        "À Lecci et Saint-Cyprien, la qualité d’une location se joue avant et pendant le séjour. Notre gestion complète relie l’annonce, les réservations, l’accueil et la préparation du logement dans le cadre défini ensemble.",
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
          text: "Vos périodes personnelles font partie du calendrier de location. Dans notre gestion complète, nous coordonnons les réservations et les séjours ; vous conservez les décisions qui vous reviennent concernant votre maison. Les prestations et leurs coûts sont définis avant le démarrage.",
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
          question: "Que gardez-vous en main avec la gestion complète ?",
          answer:
            "Vous gardez vos séjours personnels et les décisions qui vous reviennent. Nous suivons l’annonce, les réservations et la coordination locale dans le périmètre convenu ; les prestations, le linge et les frais sont détaillés dans la proposition.",
        },
      ],
    },
    {
      slug: "conciergerie-ghisonaccia",
      kind: "location",
      title: "Conciergerie à Ghisonaccia et Ventiseri | Inastia",
      description:
        "Gestion complète de location à Ghisonaccia, Ventiseri et Prunelli-di-Fiumorbo : annonce, voyageurs et suivi local avec Inastia.",
      eyebrow: "Ghisonaccia · Ventiseri · Prunelli-di-Fiumorbo",
      heading: "Proche de votre bien. Présent pour vous.",
      intro:
        "Depuis Travo, à Ventiseri, nous proposons la gestion complète de locations autour de Ghisonaccia et de Prunelli-di-Fiumorbo. Nous coordonnons l’annonce, les séjours et les prestations convenues, tout en vous tenant informé.",
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
      title: "Gestion complète de location saisonnière en Corse | Inastia",
      description:
        "Gestion complète de votre location en Corse : annonce, calendrier, voyageurs et coordination locale, dans un cadre défini avec vous.",
      eyebrow: "Gestion complète",
      heading: "Déléguez le quotidien. Gardez la main.",
      intro:
        "Inastia vous accompagne en gestion complète, de l’annonce au suivi des séjours. Nous coordonnons les réservations, les échanges voyageurs et les prestations sur place dans le périmètre convenu. Vous conservez vos séjours personnels et les décisions qui vous reviennent.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi, à Pinarello, Zonza",
      sections: [
        {
          title: "Une annonce préparée, un calendrier suivi",
          text: "Nous créons ou améliorons votre annonce à partir des atouts réels du logement : présentation, équipements, règles de séjour et informations pratiques. Nous suivons les réservations et les disponibilités, puis ajustons les prix selon la saison. Vos périodes personnelles sont prises en compte dans le calendrier.",
          items: [
            "Création ou amélioration de l’annonce",
            "Suivi des réservations, des prix et des disponibilités",
            "Prise en compte de vos séjours personnels",
          ],
        },
        {
          title: "Des échanges qui accompagnent les voyageurs",
          text: "Avant l’arrivée, nous préparons les consignes d’accès et les informations utiles au séjour. Nous coordonnons l’accueil, suivons les échanges voyageurs et les demandes pendant leur séjour dans le cadre convenu. Le suivi des avis complète cette attention portée à leur expérience.",
          items: [
            "Consignes du logement et guide voyageur",
            "Communication avant et pendant le séjour",
            "Organisation des arrivées et des départs",
          ],
        },
        {
          title: "Préparer la maison et vous signaler les besoins",
          text: "Le calendrier permet d’organiser les clés, le ménage, le linge et les contrôles entre deux séjours. La checklist et les photos de fin d’intervention documentent la préparation prévue. Nous vous signalons les anomalies et les besoins de maintenance, puis coordonnons les interventions convenues. Le ménage, le linge, les consommables et les interventions sont précisés dans la proposition, avec leur périmètre et leurs coûts ; ils ne sont pas automatiquement compris dans la commission.",
          items: [
            "Préparation et contrôles selon les prestations convenues",
            "Checklist et photos de fin d’intervention",
            "Signalement des anomalies et coordination des suites convenues",
          ],
        },
        {
          title: "Vos décisions, dans un cadre défini ensemble",
          text: "Vous gardez vos périodes d’usage personnel et les décisions qui vous reviennent concernant votre bien. Avant le démarrage, la proposition précise les prestations, la commission sur les revenus locatifs et les frais éventuels ; la durée et les modalités figurent au contrat. L’adresse du logement permet de confirmer la prise en charge. Un premier audit gratuit, qualitatif et restitué par appel ou email, permet de préparer cet échange sans prévoir de revenus locatifs.",
          items: [
            "Vos séjours personnels et vos décisions préservés",
            "Commission, prestations et frais précisés dans la proposition",
            "Durée et modalités définies au contrat",
          ],
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
        {
          question: "Le ménage, le linge et les consommables sont-ils inclus ?",
          answer:
            "Leur organisation fait partie du périmètre à définir pour votre bien. Les prestations, le linge, les consommables et leurs coûts sont détaillés dans la proposition ; la gestion complète ne signifie pas que tous ces frais sont inclus dans la commission.",
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
          title: "Définir la gestion de votre location",
          text: "Inastia est une entreprise familiale, née de notre expérience de propriétaires. Le premier échange porte sur votre logement, sa commune et votre organisation actuelle. Vos attentes et vos périodes personnelles permettent de définir le cadre de la gestion complète.",
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
            "Nous parlons de votre logement, de son emplacement et de votre organisation actuelle. Le premier audit gratuit permet de préciser les priorités avant de définir les prestations et les conditions de la gestion complète.",
        },
        {
          question: "Faut-il déjà louer son bien pour vous contacter ?",
          answer:
            "Non. Le premier audit gratuit est possible même sans annonce existante. La préparation de la première mise en location peut ensuite s’inscrire dans la gestion complète, selon le périmètre convenu.",
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
        "Un premier audit gratuit et qualitatif pour repérer les points à travailler et préparer la gestion complète de votre location. Il vous est restitué par appel ou email et ne constitue pas une prévision de revenus.",
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
            "Priorités pour préparer la gestion complète",
          ],
        },
        {
          title: "3. Définir la suite ensemble",
          text: "Si vous souhaitez nous confier la gestion complète de votre location, nous en précisons les prestations, la commission, les frais et les conditions dans une proposition distincte. Le premier audit reste gratuit et qualitatif ; il ne garantit pas de revenus locatifs.",
        },
      ],
      faq: [
        {
          question: "L’audit est-il payant ?",
          answer:
            "Non, ce premier audit qualitatif est gratuit. Si vous souhaitez ensuite nous confier la gestion complète, les prestations et les conditions sont présentées dans une proposition distincte.",
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
        "Renting out your Porto-Vecchio home should not take over your days. Our full management brings together the listing, guests and local coordination within a scope agreed with you.",
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
        "Full holiday rental management in Solenzara: listings, guests and local coordination, within the services agreed for your home.",
      eyebrow: "Solenzara · Sari-Solenzara",
      heading: "Your local support in Solenzara.",
      intro:
        "A listing to manage, an arrival to arrange, a home to prepare. In Solenzara, our full management coordinates the rental and local services within the terms agreed with you.",
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
          text: "Whether you are launching a rental or already taking bookings, we start with your current arrangements to prepare full management. Listing support, the guest guide and stay coordination form one service, with its scope agreed with you.",
        },
      ],
      faq: [
        {
          question: "Can you help with a first rental launch?",
          answer:
            "Yes. The free initial review helps us understand your home. Preparing the listing, calendar and house rules can then be arranged as part of full management, within the agreed services.",
        },
        {
          question: "Who follows up on minor maintenance?",
          answer:
            "We can report and coordinate maintenance needs within the agreed scope. The work required and its cost are defined according to the situation.",
        },
        {
          question: "How do changeovers fit into full management?",
          answer:
            "We coordinate them with bookings and arrivals as part of full management. Visits, cleaning, linen and supplies are specified in the proposal, including their costs.",
        },
      ],
    },
    {
      slug: "conciergerie-airbnb-zonza-pinarello",
      kind: "location",
      title: "Holiday rental management in Zonza and Pinarello | Inastia",
      description:
        "Full rental management in Zonza and Pinarello. Inastia coordinates the listing, guests and services agreed for your home.",
      eyebrow: "Zonza · Pinarello",
      heading: "Your Pinarello home, in good hands.",
      intro:
        "Hosting in a family villa means thinking about bedrooms, keys, instructions and requests during the stay. Our full management connects these details with the listing and bookings within the agreed scope.",
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
          text: "Our full management connects listing, pricing and calendar management with local coordination. Keys, supplies or a minor repair: needs, services and costs are agreed with you, and work requiring your decision is brought to your attention.",
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
        "Full rental management in Lecci and Saint-Cyprien: listings, bookings and stay coordination, with scope and costs agreed for your home.",
      eyebrow: "Lecci · Saint-Cyprien",
      heading: "A prepared home. A supported stay.",
      intro:
        "In Lecci and Saint-Cyprien, a good rental experience begins before arrival. Our full management connects the listing, bookings, guest welcome and property preparation within the agreed scope.",
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
          text: "Your personal stays form part of the rental calendar. Within full management, we coordinate bookings and stays; you keep the decisions that remain yours about the home. Services and costs are agreed before management begins.",
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
          question: "What stays in your hands with full management?",
          answer:
            "You keep your personal stays and the decisions that remain yours. We manage the listing, bookings and local coordination within the agreed scope; services, linen and costs are detailed in the proposal.",
        },
      ],
    },
    {
      slug: "conciergerie-ghisonaccia",
      kind: "location",
      title: "Holiday rental management in Ghisonaccia and Ventiseri | Inastia",
      description:
        "Full rental management in Ghisonaccia, Ventiseri and Prunelli-di-Fiumorbo: listings, guests and local coordination with Inastia.",
      eyebrow: "Ghisonaccia · Ventiseri · Prunelli-di-Fiumorbo",
      heading: "Close to your home. Here for you.",
      intro:
        "Based in Travo, Ventiseri, we provide full rental management around Ghisonaccia and Prunelli-di-Fiumorbo. We coordinate the listing, stays and agreed services while keeping you informed.",
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
      title: "Full holiday rental management in Corsica | Inastia",
      description:
        "Full rental management in Corsica: listings, calendar, guest communication and local coordination, within a scope agreed with you.",
      eyebrow: "Full rental management",
      heading: "Hand over the work. Keep the choice.",
      intro:
        "Inastia provides full rental management, from preparing your listing to following each stay. We coordinate bookings, guest communication and local services within the agreed scope. You keep your personal stays and the decisions that remain yours.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi in Pinarello, Zonza",
      sections: [
        {
          title: "A prepared listing and a managed calendar",
          text: "We create or improve your listing around the home’s real strengths: presentation, amenities, house rules and practical information. We manage bookings and availability and adjust prices through the season. Your personal stays are taken into account in the calendar.",
          items: [
            "Listing creation or improvement",
            "Booking, pricing and availability management",
            "Your personal stays included in the calendar",
          ],
        },
        {
          title: "Communication throughout the guest experience",
          text: "Before arrival, we prepare access instructions and useful information for the stay. We coordinate the welcome and handle guest communication and requests during the stay within the agreed scope. Following up on reviews is part of this attention to the guest experience.",
          items: [
            "House instructions and a guest guide",
            "Communication before and during the stay",
            "Arrival and departure arrangements",
          ],
        },
        {
          title: "Preparing the home and reporting what needs attention",
          text: "The calendar helps us coordinate keys, cleaning, linen and checks between stays. A checklist and photographs record the agreed preparations after each intervention. We report issues and maintenance needs, then coordinate the work agreed with you. Cleaning, linen, supplies and any interventions are specified in the proposal, including their scope and cost; they are not automatically covered by the management commission.",
          items: [
            "Preparation and checks within the agreed scope",
            "A checklist and photographs after each intervention",
            "Issues reported and agreed follow-up coordinated",
          ],
        },
        {
          title: "Your decisions, with clear terms",
          text: "You keep your personal stays and the decisions that remain yours about your home. Before management begins, the proposal sets out the services, commission on rental income and any additional costs; the contract specifies duration and terms. The property’s address helps us confirm coverage. A free initial qualitative review, shared by phone or email, helps prepare this conversation without forecasting rental income.",
          items: [
            "Your personal stays and decisions preserved",
            "Commission, services and additional costs set out in the proposal",
            "Duration and terms specified in the contract",
          ],
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
        {
          question: "Are cleaning, linen and supplies included?",
          answer:
            "Their arrangements form part of the scope agreed for your home. Services, linen, supplies and their costs are detailed in the proposal; full management does not mean all these costs are covered by the commission.",
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
          title: "Agree how your rental will be managed",
          text: "Inastia is a family-run company that grew from our own experience as owners. The first conversation covers your property, its location and your current arrangements. Your expectations and personal stays help define the scope of full management.",
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
            "We discuss your property, its location and your current arrangements. The free initial review helps identify priorities before agreeing the services and terms of full management.",
        },
        {
          question: "Do I need to be renting already?",
          answer:
            "No. The free initial review is available even without an existing listing. Preparing a first rental can then form part of full management, within the agreed scope.",
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
        "A free initial qualitative review to identify what needs attention and prepare for full rental management. It is shared by phone or email and is not a rental income forecast.",
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
            "Priorities for preparing full management",
          ],
        },
        {
          title: "3. Agree the next steps together",
          text: "If you would like us to take on full management of your rental, a separate proposal sets out the services, commission, additional costs and terms. The initial review remains free and qualitative; it does not guarantee rental income.",
        },
      ],
      faq: [
        {
          question: "Is there a fee for the review?",
          answer:
            "No, this initial qualitative review is free. If you then wish to arrange full management, the services and terms are set out in a separate proposal.",
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
