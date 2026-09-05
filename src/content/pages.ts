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
      heading: "Votre maison à Porto-Vecchio. Une présence à vos côtés.",
      intro:
        "Les réservations se succèdent, les horaires d’arrivée changent, une demande survient entre deux séjours. Inastia coordonne le quotidien de votre location pour que vous puissiez prendre du recul.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi, une maison du portfolio Inastia à Pinarello",
      sections: [
        {
          title: "Préparer la saison, avant les premières arrivées",
          text: "Nous regardons votre annonce, votre calendrier et l’organisation du logement. Ce premier échange permet de préciser les besoins du bien et le niveau d’accompagnement, à Porto-Vecchio comme dans ses environs.",
          items: [
            "Présentation de l’annonce",
            "Tarification et calendrier",
            "Organisation des prestations sur place",
          ],
        },
        {
          title: "Entre deux séjours, chaque détail compte",
          text: "Ménage, linge, consommables et remise des clés se préparent ensemble. Les contrôles et les photos après intervention permettent de suivre l’état du logement et de signaler les anomalies.",
          items: [
            "Coordination des arrivées et départs",
            "Contrôle du ménage",
            "Suivi des petites interventions",
          ],
        },
        {
          title: "Rester informé, même à distance",
          text: "Vous gardez une visibilité sur votre calendrier et les interventions. Nous assurons la communication avec les voyageurs et vous faisons remonter les points qui nécessitent votre attention. Le périmètre est défini selon votre bien et vos besoins.",
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
      heading: "À Solenzara, le soin d’une maison prête à accueillir.",
      intro:
        "Une maison bien préparée, des arrivées organisées et un relais sur place : nous accompagnons votre location à Solenzara, du lancement de l’annonce au suivi des séjours.",
      image: "villa_lova",
      imageAlt: "Villa Lova, à Cala d’Oro, Solenzara",
      sections: [
        {
          title: "Une organisation qui tient compte des accès",
          text: "À Solenzara et Sari-Solenzara, les contraintes varient d’un logement à l’autre. Nous prenons en compte sa situation et le rythme des réservations pour organiser les passages, les clés et la préparation avant arrivée.",
        },
        {
          title: "Soigner le passage d’un séjour au suivant",
          text: "Quand les départs et les arrivées sont rapprochés, le ménage et le linge ont besoin d’un planning partagé. Une checklist et des photos de contrôle accompagnent la rotation ; les besoins de maintenance sont signalés.",
          items: [
            "Ménage et préparation du linge",
            "Organisation de l’accueil",
            "Remontée des anomalies",
          ],
        },
        {
          title: "Commencer, ou reprendre une location existante",
          text: "Votre maison n’est pas encore en ligne ? Le lancement prépare l’annonce et le guide voyageur. Si elle accueille déjà des vacanciers, nous examinons l’existant pour définir le relais dont vous avez besoin pendant les séjours.",
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
      heading: "À Pinarello, accueillir avec attention.",
      intro:
        "Une villa familiale demande de l’attention, de la préparation des chambres aux indications laissées aux voyageurs. Inastia organise ces détails pour les propriétaires qui ne sont pas toujours sur place.",
      image: "casa_verde",
      imageAlt: "Casa Verde, à Pinarello, Zonza",
      sections: [
        {
          title: "Une préparation à l’échelle de votre villa",
          text: "La capacité d’accueil, les chambres et les extérieurs donnent le rythme des préparatifs. Nous cadrons les rotations en fonction du logement, avec ménage, linge et contrôle photo selon les prestations choisies.",
        },
        {
          title: "Donner aux voyageurs leurs repères",
          text: "L’accueil commence par des informations claires. Les consignes du logement et un guide local personnalisé accompagnent l’arrivée ; nous suivons les demandes liées au séjour dans le cadre de la gestion convenue.",
          items: [
            "Organisation des clés et de l’arrivée",
            "Guide voyageur",
            "Suivi des demandes pendant le séjour",
          ],
        },
        {
          title: "Votre relais quand vous êtes ailleurs",
          text: "Un besoin de consommables, une clé à gérer, une petite réparation à organiser : nous faisons le lien sur place. Le suivi de l’annonce et des prix peut compléter cet accompagnement au fil de la saison.",
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
      heading: "À Lecci et Saint-Cyprien, un séjour bien préparé.",
      intro:
        "De ce que raconte l’annonce à ce que découvre le voyageur, chaque étape doit être cohérente. Nous coordonnons la présentation de votre bien et son accueil au quotidien.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi, une maison du portfolio Inastia à Pinarello",
      sections: [
        {
          title: "Une annonce fidèle à la maison",
          text: "L’audit avant saison permet de revoir la présentation, les équipements mis en avant et les informations du séjour. Nous identifions les points à préciser pour donner aux voyageurs une lecture claire de votre logement.",
        },
        {
          title: "Des prestations coordonnées",
          text: "Accueil, départ, ménage et linge sont organisés dans un même suivi. Vous disposez d’un interlocuteur pour les prestations convenues, avec signalement des besoins et coordination des petites interventions.",
          items: [
            "Check-in et check-out",
            "Ménage et linge",
            "Signalement des besoins de maintenance",
          ],
        },
        {
          title: "Un calendrier qui reste le vôtre",
          text: "Vous conservez la visibilité sur les réservations et vos périodes personnelles. Nous ajustons l’accompagnement au niveau de délégation souhaité, du relais pour les rotations à la gestion complète.",
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
      heading: "Une présence proche de votre maison.",
      intro:
        "Installée à Travo, sur la commune de Ventiseri, Inastia accompagne les locations autour de Ghisonaccia et de Prunelli-di-Fiumorbo. Le quotidien de votre bien se suit aussi sur le terrain.",
      image: "villa_lova",
      imageAlt: "Villa Lova, une maison du portfolio Inastia à Solenzara",
      sections: [
        {
          title: "Le terrain comme point de départ",
          text: "Connaître l’emplacement, les accès et les besoins de votre logement permet d’organiser les contrôles et les interventions. Nous définissons avec vous les prestations utiles et les informations à partager après les passages.",
        },
        {
          title: "Donner une direction à votre annonce",
          text: "Pour une première location comme pour une annonce existante, nous regardons le texte, le calendrier et les prix. L’audit qualitatif aide à choisir les priorités avant d’engager un accompagnement.",
          items: [
            "Création ou optimisation d’annonce",
            "Suivi du calendrier",
            "Ajustements selon la saison",
          ],
        },
        {
          title: "Préparer chaque nouveau séjour",
          text: "Ménage, linge et consommables sont coordonnés selon les besoins du logement. Notre présence locale permet de suivre les imprévus et de vous transmettre les points d’attention, même lorsque vous êtes absent.",
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
      heading: "Votre location, suivie dans son ensemble.",
      intro:
        "De l’annonce au départ des voyageurs, Inastia coordonne votre location saisonnière sur la côte est de la Corse. Un accompagnement pour déléguer le quotidien tout en gardant une vue sur votre maison.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi, à Pinarello, Zonza",
      sections: [
        {
          title: "L’annonce et le calendrier",
          text: "Nous préparons ou améliorons votre annonce, suivons les disponibilités et adaptons la tarification à la saison. Vos périodes personnelles font partie de l’organisation dès le départ.",
          items: [
            "Création ou optimisation d’annonce",
            "Suivi des prix et disponibilités",
            "Communication voyageurs et suivi des avis",
          ],
        },
        {
          title: "Le relais sur place",
          text: "L’accueil, le ménage, le linge et les clés sont coordonnés autour des réservations. Les besoins de maintenance sont signalés et les interventions prévues au contrat sont suivies. Vous êtes informé des points qui demandent une décision.",
        },
        {
          title: "Un cadre défini pour votre bien",
          text: "Nous commençons par comprendre le logement et vos attentes. La proposition détaille les prestations, la commission sur les revenus locatifs et les éventuels frais annexes. La durée et les modalités figurent au contrat.",
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
      heading: "Entre deux séjours, une maison prête.",
      intro:
        "Le départ des uns prépare l’arrivée des autres. Inastia organise le ménage, le linge et l’accueil avec une attention portée à l’état du logement et aux informations transmises.",
      image: "casa_verde",
      imageAlt: "Casa Verde, à Pinarello, Zonza",
      sections: [
        {
          title: "Une préparation adaptée au logement",
          text: "La surface, les chambres et les contraintes du bien définissent la rotation. Le ménage, le linge et les consommables sont précisés selon vos besoins, pour une organisation cohérente entre chaque réservation.",
          items: [
            "Ménage après séjour",
            "Linge selon les besoins convenus",
            "Suivi des consommables",
          ],
        },
        {
          title: "Un accueil pensé en amont",
          text: "L’arrivée et le départ peuvent être personnalisés ou autonomes selon votre logement. La remise des clés et les consignes sont préparées pour que les voyageurs sachent comment accéder à la maison et la quitter.",
        },
        {
          title: "Des contrôles que vous pouvez suivre",
          text: "Une checklist et des photos de fin d’intervention documentent le passage. Les anomalies constatées sont remontées pour vous permettre de décider des suites, notamment lorsqu’un besoin de maintenance apparaît.",
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
      heading: "Les bonnes bases pour ouvrir votre maison.",
      intro:
        "Votre logement est prêt à accueillir. Il reste à le présenter, à définir ses règles et à organiser sa disponibilité. Inastia vous accompagne dans ce passage de la maison à l’annonce.",
      image: "villa_lova",
      imageAlt: "Villa Lova, à Cala d’Oro, Solenzara",
      sections: [
        {
          title: "Faire le point avant de publier",
          text: "Nous examinons le logement et identifions les recommandations prioritaires. La présentation, les équipements et les informations à transmettre sont étudiés pour construire une annonce fidèle à ce que vous proposez.",
        },
        {
          title: "Assembler une annonce claire",
          text: "Le titre et le texte donnent aux voyageurs les repères utiles pour choisir. Le calendrier, les prix de départ et les règles de séjour sont préparés pour rendre l’offre lisible.",
          items: [
            "Création ou amélioration de l’annonce",
            "Texte et règles de séjour",
            "Calendrier et prix de départ",
          ],
        },
        {
          title: "Ajuster après le lancement",
          text: "La publication est une première étape. Le suivi de visibilité, du calendrier et des premiers retours permet de proposer des ajustements. Le périmètre et la durée du suivi sont définis dans votre accompagnement.",
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
      heading: "Une histoire de famille. Le sens de l’accueil.",
      intro:
        "Inastia est née d’une expérience que nous connaissons nous-mêmes : être propriétaire, aimer sa maison et vouloir la confier avec confiance. De cette expérience est venue l’envie d’accompagner d’autres propriétaires.",
      image: "casa_verde",
      imageAlt: "Casa Verde, une maison accompagnée par Inastia à Pinarello",
      sections: [
        {
          title: "Connaître les questions d’un propriétaire",
          text: "Les arrivées tardives, le linge à préparer, les clés à confier : nous savons la place que prend une location dans le quotidien. Notre approche part de ces besoins concrets et du soin que vous souhaitez apporter à votre maison.",
        },
        {
          title: "Se parler directement",
          text: "Inastia est une entreprise familiale à taille humaine. L’échange direct nous permet de comprendre vos habitudes, votre projet et le niveau d’accompagnement qui vous convient. Vous savez à qui parler de votre bien.",
        },
        {
          title: "L’hospitalité dans les gestes du quotidien",
          text: "Préparer une maison, donner des indications claires, suivre une demande : l’accueil se construit dans ces gestes. Sur la côte est de la Corse, de Ghisonaccia à Porto-Vecchio, nous les coordonnons avec une attention partagée entre propriétaire et voyageur.",
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
      heading: "Un premier regard sur votre projet locatif.",
      intro:
        "Avant de lancer une annonce ou de changer votre organisation, prenons le temps de regarder votre bien. L’audit gratuit identifie les points à travailler et l’accompagnement qui pourrait vous être utile.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi, à Pinarello, Zonza",
      sections: [
        {
          title: "Ce que nous regardons",
          text: "La commune, le type de logement et la capacité d’accueil donnent le contexte. Si votre annonce existe déjà, sa présentation, ses équipements, ses prix et ses avis permettent de repérer les freins visibles à la réservation.",
        },
        {
          title: "Ce que vous en retirez",
          text: "Vous recevez une première lecture qualitative et des recommandations sur les priorités : annonce, tarification ou expérience de séjour. Cette analyse aide à choisir le niveau de délégation ; elle ne constitue pas une prévision de revenus.",
          items: [
            "Points à améliorer en priorité",
            "Recommandations adaptées au bien",
            "Orientation vers l’accompagnement utile",
          ],
        },
        {
          title: "Les informations pour commencer",
          text: "Indiquez la commune, le type de bien, le nombre de voyageurs accueillis et votre situation actuelle. Ajoutez le lien de l’annonce si vous en avez une. Nous partons de ces éléments pour étudier votre projet sur notre secteur, de Ghisonaccia à Porto-Vecchio.",
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
      heading: "Your Porto-Vecchio home. Someone by your side.",
      intro:
        "Bookings follow one another, arrival times change and a request comes in between stays. Inastia coordinates the day-to-day running of your rental so you can step back.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi, an Inastia portfolio home in Pinarello",
      sections: [
        {
          title: "Prepare the season before the first arrival",
          text: "We review your listing, calendar and the way your home is run. This first conversation helps us understand the property and agree on the support you need, in Porto-Vecchio and the surrounding area.",
          items: [
            "Listing presentation",
            "Pricing and availability",
            "Coordination of on-site services",
          ],
        },
        {
          title: "Between stays, the details matter",
          text: "Cleaning, linen, supplies and keys are planned together. Checks and photographs after each visit help document the condition of your home and highlight anything that needs attention.",
          items: [
            "Arrival and departure coordination",
            "Cleaning checks",
            "Follow-up on minor maintenance",
          ],
        },
        {
          title: "Stay informed from wherever you are",
          text: "You keep visibility over your calendar and property visits. We handle guest communication and share the points that need your attention. The scope of our support is agreed around your home and your needs.",
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
      heading: "In Solenzara, a home ready to welcome.",
      intro:
        "A thoughtfully prepared home, organised arrivals and someone on the ground: we support your Solenzara rental from its first listing through to each guest stay.",
      image: "villa_lova",
      imageAlt: "Villa Lova in Cala d’Oro, Solenzara",
      sections: [
        {
          title: "Planning around your property’s access",
          text: "In Solenzara and Sari-Solenzara, each property has its own practical requirements. We consider its location and booking schedule when organising visits, keys and preparations before guests arrive.",
        },
        {
          title: "A careful handover between stays",
          text: "When check-out and check-in are close together, cleaning and linen need a shared schedule. Checklists and photographs document the changeover, while maintenance needs are reported.",
          items: [
            "Cleaning and linen preparation",
            "Guest arrival arrangements",
            "Reporting issues found on site",
          ],
        },
        {
          title: "Start a rental, or build on an existing one",
          text: "If your home is not yet listed, our launch service prepares the listing and guest guide. If you already host, we review your arrangements to define the support you need during stays.",
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
      heading: "In Pinarello, a thoughtful welcome.",
      intro:
        "A family villa needs attention, from preparing bedrooms to leaving useful instructions for guests. Inastia organises these details for owners who cannot always be there.",
      image: "casa_verde",
      imageAlt: "Casa Verde in Pinarello, Zonza",
      sections: [
        {
          title: "Preparation that fits your villa",
          text: "Guest capacity, bedrooms and outdoor areas shape the work before each arrival. We plan changeovers around the property, with cleaning, linen and photographic checks according to the services you choose.",
        },
        {
          title: "Help guests feel at home",
          text: "A welcome begins with clear information. House instructions and a personalised local guide support the arrival. We handle requests during the stay within the agreed management service.",
          items: [
            "Keys and arrival arrangements",
            "A guest guide",
            "Support with requests during the stay",
          ],
        },
        {
          title: "A local contact while you are away",
          text: "Supplies to replenish, a key to arrange or a minor repair to coordinate: we provide a link to your home on the ground. Listing and pricing support can complement this work through the season.",
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
      heading: "In Lecci and Saint-Cyprien, prepare a considered stay.",
      intro:
        "From the story your listing tells to the home your guests discover, each step should feel consistent. We coordinate the presentation of your property and the practical details of welcoming guests.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi, an Inastia portfolio home in Pinarello",
      sections: [
        {
          title: "A listing true to your home",
          text: "A review before the season looks at your presentation, featured amenities and guest information. We identify details to clarify so travellers can understand exactly what your property offers.",
        },
        {
          title: "Services that work together",
          text: "Arrivals, departures, cleaning and linen are coordinated together. You have a contact for the agreed services, with issues reported and minor maintenance coordinated.",
          items: [
            "Check-in and check-out",
            "Cleaning and linen",
            "Maintenance needs reported",
          ],
        },
        {
          title: "A calendar that remains yours",
          text: "You keep visibility over reservations and your own stays. We adapt the service to how much you wish to delegate, from practical help with changeovers to full rental management.",
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
      heading: "A local presence close to your home.",
      intro:
        "Based in Travo, in the municipality of Ventiseri, Inastia supports rentals around Ghisonaccia and Prunelli-di-Fiumorbo. Looking after your property means being there on the ground, too.",
      image: "villa_lova",
      imageAlt: "Villa Lova, an Inastia portfolio home in Solenzara",
      sections: [
        {
          title: "Start with the property itself",
          text: "Understanding the location, access and practical needs of your home helps us organise checks and visits. Together, we define the services you need and the information to share after each visit.",
        },
        {
          title: "Give your listing a clear direction",
          text: "For a first rental or an existing listing, we review the copy, calendar and pricing. A qualitative assessment helps establish priorities before you choose ongoing support.",
          items: [
            "Listing creation or improvement",
            "Calendar management",
            "Seasonal adjustments",
          ],
        },
        {
          title: "Prepare for every new stay",
          text: "Cleaning, linen and supplies are coordinated around the property’s needs. Our local presence lets us follow up on unexpected issues and share anything requiring your attention, even while you are away.",
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
      heading: "A considered approach to your whole rental.",
      intro:
        "From the listing to the guests’ departure, Inastia coordinates your holiday rental on Corsica’s east coast. Delegate the daily work while keeping a view of your home.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi in Pinarello, Zonza",
      sections: [
        {
          title: "The listing and calendar",
          text: "We create or improve your listing, manage availability and adapt pricing through the season. Your personal stays are part of the arrangements from the beginning.",
          items: [
            "Listing creation or improvement",
            "Pricing and availability management",
            "Guest communication and review follow-up",
          ],
        },
        {
          title: "Support on the ground",
          text: "Guest arrivals, cleaning, linen and keys are coordinated around bookings. Maintenance needs are reported and agreed interventions followed up. We keep you informed of matters that need a decision.",
        },
        {
          title: "Clear arrangements for your home",
          text: "We begin by understanding the property and your expectations. The proposal sets out services, the commission on rental income and any additional fees. Duration and conditions are specified in the contract.",
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
      heading: "Between stays, a home made ready.",
      intro:
        "One departure prepares the way for the next arrival. Inastia organises cleaning, linen and guest access, with attention to the condition of your home and the information shared.",
      image: "casa_verde",
      imageAlt: "Casa Verde in Pinarello, Zonza",
      sections: [
        {
          title: "Preparation tailored to the property",
          text: "The floor area, bedrooms and practical requirements shape each changeover. Cleaning, linen and supplies are agreed around your needs, giving each booking a clear plan.",
          items: [
            "Cleaning after each stay",
            "Linen according to agreed needs",
            "Monitoring supplies",
          ],
        },
        {
          title: "Plan the welcome in advance",
          text: "Arrivals and departures can be personal or self-service, depending on the property. Keys and instructions are prepared so guests know how to access the home and what to do when they leave.",
        },
        {
          title: "Checks you can follow",
          text: "A checklist and photographs document the completed visit. Any issues found are reported so you can decide what happens next, including when maintenance is needed.",
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
      heading: "A thoughtful start for your holiday home.",
      intro:
        "Your home is ready for guests. Now it needs a clear presentation, house rules and an organised calendar. Inastia helps you make the transition from home to rental listing.",
      image: "villa_lova",
      imageAlt: "Villa Lova in Cala d’Oro, Solenzara",
      sections: [
        {
          title: "Take stock before publishing",
          text: "We review the property and identify the main recommendations. Presentation, amenities and guest information are considered together to build a listing that accurately reflects your home.",
        },
        {
          title: "Create a clear listing",
          text: "The title and copy help travellers decide whether your home is right for their stay. The calendar, initial pricing and house rules are prepared to make the offer easy to understand.",
          items: [
            "Listing creation or improvement",
            "Copy and house rules",
            "Calendar and initial pricing",
          ],
        },
        {
          title: "Adjust after the launch",
          text: "Publishing is the first step. Reviewing visibility, the calendar and early feedback helps identify useful adjustments. The scope and duration of ongoing support are set out in your service agreement.",
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
      heading: "A family story. A sense of welcome.",
      intro:
        "Inastia grew from an experience we know ourselves: owning a home, caring about it and wanting to leave it in trusted hands. That experience inspired us to support other owners.",
      image: "casa_verde",
      imageAlt: "Casa Verde, a home supported by Inastia in Pinarello",
      sections: [
        {
          title: "Understand an owner’s concerns",
          text: "Late arrivals, linen to prepare, keys to hand over: we know how much space a rental can take up in daily life. Our approach starts with these practical needs and the care you want for your home.",
        },
        {
          title: "Talk to us directly",
          text: "Inastia is a small, family-run company. Direct conversations help us understand your habits, your plans and the level of support that suits you. You know who to speak to about your property.",
        },
        {
          title: "Hospitality in everyday details",
          text: "Preparing a home, giving clear directions, following up on a request: a welcome is built from these actions. Along Corsica’s east coast, from Ghisonaccia to Porto-Vecchio, we coordinate them with both owners and guests in mind.",
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
      heading: "A first look at your rental plans.",
      intro:
        "Before launching a listing or changing your arrangements, let’s take a look at your property. Our free review identifies areas to work on and the support that could be useful.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi in Pinarello, Zonza",
      sections: [
        {
          title: "What we look at",
          text: "The municipality, property type and guest capacity provide the context. If you already have a listing, its presentation, amenities, prices and reviews help identify visible obstacles to bookings.",
        },
        {
          title: "What you take away",
          text: "You receive an initial qualitative assessment and recommendations on priorities: the listing, pricing or guest experience. The review helps you decide what to delegate; it is not a rental income forecast.",
          items: [
            "Priority areas for improvement",
            "Property-specific recommendations",
            "Guidance on useful support",
          ],
        },
        {
          title: "What we need to begin",
          text: "Share the municipality, property type, guest capacity and your current situation. Include the listing link if you have one. These details help us review your plans within our area, from Ghisonaccia to Porto-Vecchio.",
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
