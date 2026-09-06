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
      heading:
        "Votre location à Porto-Vecchio, sans tout coordonner vous-même.",
      intro:
        "Annonce, réservations, messages voyageurs, passages sur place : la location demande un suivi régulier, même quand vous êtes loin. Notre équipe familiale en assure la gestion complète à Porto-Vecchio. Vous choisissez vos périodes personnelles et validez les interventions supplémentaires ; nous coordonnons le quotidien.",
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
          text: "Des clés au linge propre, chaque rotation demande de la coordination. Nous organisons les arrivées, le ménage et la vérification de la préparation du logement. Les photos après intervention documentent cette préparation ; les anomalies vous sont signalées.",
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
            "La commission est de 20 % TTC sur le montant des nuitées avant déduction des frais de plateforme, hors ménage, linge et taxe de séjour. Les prestations facturées séparément et les modalités du contrat sont précisées dans la proposition avant le démarrage.",
        },
        {
          question:
            "Puis-je vous confier uniquement le ménage, l’accueil ou l’annonce ?",
          answer:
            "Non. Inastia propose uniquement la gestion complète de votre location. Le suivi de l’annonce, l’accueil et la préparation du logement font partie de cette offre ; nous ne les proposons pas séparément. Les prestations et leurs coûts sont précisés dans la proposition.",
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
      heading: "À Solenzara, confiez le suivi de votre location.",
      intro:
        "Une arrivée à organiser ne se prépare pas sans connaître les réservations, les accès et les besoins de la maison. Notre gestion complète relie ces tâches, de l’annonce au suivi sur place. Vous échangez avec notre équipe sur les séjours à organiser, les prestations et les dépenses à valider.",
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
          text: "Première mise en location ou annonce déjà active : nous partons de votre situation pour préparer la gestion complète. Nous relions le suivi de l’annonce, le guide voyageur et la coordination des séjours. La proposition précise les tâches confiées et les frais avant le démarrage.",
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
            "Nous signalons les besoins de maintenance et coordonnons les interventions que vous autorisez. Leur coût est précisé séparément de la commission de gestion.",
        },
        {
          question:
            "Comment les rotations s’intègrent-elles à la gestion complète ?",
          answer:
            "Nous les coordonnons avec les réservations et les arrivées dans le cadre de la gestion complète. Les passages, le ménage, le linge et les consommables sont précisés dans la proposition, avec leurs coûts.",
        },
        {
          question:
            "Puis-je vous confier uniquement le ménage, l’accueil ou l’annonce ?",
          answer:
            "Non. Inastia propose uniquement la gestion complète de votre location. Le suivi de l’annonce, l’accueil et la préparation du logement font partie de cette offre ; nous ne les proposons pas séparément. Les prestations et leurs coûts sont précisés dans la proposition.",
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
      heading: "Votre maison à Pinarello. Notre équipe pour la location.",
      intro:
        "Vous souhaitez louer votre maison tout en gardant des moments pour votre famille ? Nous suivons l’annonce, les réservations, les voyageurs et la préparation du logement dans le cadre de la gestion complète. Vos périodes personnelles s’organisent selon le calendrier et les modalités convenus.",
      image: "casa_verde",
      imageAlt: "Casa Verde, à Pinarello, Zonza",
      sections: [
        {
          title: "Préciser où se trouve votre maison",
          text: "La commune de Zonza comprend le village en montagne et un secteur littoral autour de Sainte-Lucie-de-Porto-Vecchio et Pinarello. Pour votre demande, précisez le secteur, l’adresse et les conditions d’accès à la maison. Ces informations nous permettent de confirmer la prise en charge et d’organiser les passages prévus ; le nom de la commune seul ne suffit pas.",
        },
        {
          title: "Une préparation à sa mesure",
          text: "Le nombre de chambres, la capacité d’accueil et les extérieurs donnent le cadre. Nous organisons le ménage, le linge et les contrôles photo selon votre logement et les prestations convenues.",
        },
        {
          title: "Des voyageurs qui ont leurs repères",
          text: "Avant l’arrivée, les consignes d’accès et le guide voyageur donnent les informations utiles. Pendant le séjour, notre équipe répond aux questions des voyageurs sur le logement et leur séjour. L’accueil se construit aussi dans ces échanges.",
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
            "Oui. Vos périodes personnelles sont définies et bloquées dans le calendrier en tenant compte des réservations déjà confirmées et des modalités convenues ensemble.",
        },
        {
          question:
            "Puis-je vous confier uniquement le ménage, l’accueil ou l’annonce ?",
          answer:
            "Non. Inastia propose uniquement la gestion complète de votre location. Le suivi de l’annonce, l’accueil et la préparation du logement font partie de cette offre ; nous ne les proposons pas séparément. Les prestations et leurs coûts sont précisés dans la proposition.",
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
      heading: "À Lecci, une seule équipe pour suivre votre location.",
      intro:
        "Préparer l’annonce, répondre aux voyageurs et organiser la maison entre deux séjours : nous réunissons ces tâches dans notre gestion complète à Lecci et Saint-Cyprien. Vous n’avez plus à en coordonner chaque étape ; les prestations et leurs coûts sont définis ensemble.",
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
          text: "Vos périodes personnelles sont définies et bloquées dans le calendrier en tenant compte des réservations déjà confirmées et des modalités convenues ensemble. Nous coordonnons les réservations et les séjours ; vous conservez les décisions qui vous reviennent concernant votre maison. Prestations, coûts et modalités sont précisés avant le démarrage.",
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
        {
          question:
            "Puis-je vous confier uniquement le ménage, l’accueil ou l’annonce ?",
          answer:
            "Non. Inastia propose uniquement la gestion complète de votre location. Le suivi de l’annonce, l’accueil et la préparation du logement font partie de cette offre ; nous ne les proposons pas séparément. Les prestations et leurs coûts sont précisés dans la proposition.",
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
      heading: "Un relais près de Ghisonaccia pour votre location.",
      intro:
        "Depuis Travo, à Ventiseri, notre équipe familiale suit les locations autour de Ghisonaccia et de Prunelli-di-Fiumorbo. Notre gestion complète relie l’annonce, les réservations et la coordination locale. Vous gardez un lien direct avec nous pour les informations et les décisions concernant votre maison.",
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
          text: "Nous organisons le ménage, le linge et les consommables entre les séjours. Nous vous signalons les imprévus et les interventions à décider, puis coordonnons celles que vous autorisez.",
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
        {
          question:
            "Puis-je vous confier uniquement le ménage, l’accueil ou l’annonce ?",
          answer:
            "Non. Inastia propose uniquement la gestion complète de votre location. Le suivi de l’annonce, l’accueil et la préparation du logement font partie de cette offre ; nous ne les proposons pas séparément. Les prestations et leurs coûts sont précisés dans la proposition.",
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
      heading: "Confiez votre location. Gardez vos décisions.",
      intro:
        "Vous souhaitez louer votre bien sans coordonner vous-même l’annonce, les voyageurs et chaque passage sur place ? Notre équipe familiale réunit ces tâches dans une seule offre de gestion complète. Vous gardez vos séjours personnels, selon le calendrier convenu, et les décisions qui vous reviennent.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi, à Pinarello, Zonza",
      sections: [
        {
          title: "Votre annonce et vos réservations suivies ensemble",
          text: "Première mise en location ou annonce déjà publiée : nous préparons ou améliorons la présentation de votre logement, ses équipements, ses règles de séjour et ses informations pratiques. Nous suivons ensuite les réservations, les disponibilités et les prix selon la saison. Vos séjours personnels sont bloqués dans le calendrier en tenant compte des réservations déjà confirmées. Vous n’avez plus à coordonner l’annonce et chaque arrivée séparément.",
          items: [
            "Création ou amélioration de l’annonce",
            "Suivi des réservations, des prix et des disponibilités",
            "Prise en compte de vos séjours personnels",
          ],
        },
        {
          title: "Un relais pour les échanges avec vos voyageurs",
          text: "Nous préparons les consignes d’accès et les informations sur le logement, organisons l’arrivée et le départ, puis répondons aux questions liées au séjour. Les voyageurs échangent avec notre équipe ; nous vous signalons les points qui demandent votre décision. Nous suivons aussi leurs avis après le départ.",
          items: [
            "Consignes du logement et guide voyageur",
            "Communication avant et pendant le séjour",
            "Organisation des arrivées et des départs",
          ],
        },
        {
          title: "Une maison préparée, des besoins signalés",
          text: "Nous coordonnons les clés, le ménage et le linge autour des arrivées. Une checklist et des photos de fin d’intervention documentent la préparation du logement. Les anomalies vous sont signalées ; vous validez les interventions et les achats supplémentaires que nous organisons. La coordination est incluse dans la commission. Le ménage, le linge, les consommables et les réparations sont chiffrés séparément.",
          items: [
            "Préparation du logement entre les séjours",
            "Checklist et photos de fin d’intervention",
            "Anomalies signalées, interventions soumises à votre accord",
          ],
        },
        {
          title: "Vos décisions et vos coûts, précisés avant de commencer",
          text: "Vous encaissez directement les loyers et conservez vos périodes personnelles ainsi que la validation des interventions supplémentaires. Avant de décider, vous recevez une proposition qui distingue la commission de 20 % TTC des nuitées, les prestations séparées et les dépenses liées au logement. L’adresse et les accès permettent de confirmer la prise en charge ; la durée et les modalités figurent au contrat. Si vous préparez encore votre projet, l’audit gratuit permet de faire le point.",
          items: [
            "Vos séjours personnels et vos décisions préservés",
            "Commission, prestations et frais précisés dans la proposition",
            "Durée et modalités définies au contrat",
          ],
        },
      ],
      faq: [
        {
          question: "Quels logements pouvez-vous prendre en charge ?",
          answer:
            "Nous étudions les logements sur la côte est de la Corse, de Ghisonaccia à Porto-Vecchio. L’adresse précise, les accès, le type de bien et sa capacité permettent de vérifier l’organisation des arrivées et des passages. Le nom de la commune seul ne confirme pas la prise en charge.",
        },
        {
          question: "Comment serai-je informé du suivi de ma maison ?",
          answer:
            "Vous échangez directement avec notre équipe. Nous vous signalons les anomalies et les interventions qui demandent votre décision. Les factures mensuelles détaillent les revenus locatifs, notre commission et les frais convenus.",
        },
        {
          question: "Que se passe-t-il en cas de problème pendant un séjour ?",
          answer:
            "Les voyageurs contactent notre équipe pour les questions liées au logement et au séjour. Nous vous signalons les anomalies et les interventions qui nécessitent votre décision, puis coordonnons les suites autorisées. Les réparations et achats supplémentaires sont distincts de la commission et doivent être précisés avec vous.",
        },
        {
          question: "Pouvez-vous reprendre une location déjà en cours ?",
          answer:
            "Oui, nous pouvons préparer la reprise d’une location existante. Nous examinons avec vous les réservations confirmées, l’annonce, les accès aux comptes et au logement, ainsi que la date de relais. Nous précisons ainsi les tâches à reprendre et les modalités du relais avant de commencer.",
        },
        {
          question: "Quelle est la durée de l’engagement et comment y mettre fin ?",
          answer:
            "La durée est précisée dans votre contrat. Les CGV prévoient une reconduction tacite, sauf dénonciation par lettre recommandée avec accusé de réception deux mois avant l’échéance. Elles prévoient aussi que les réservations déjà confirmées soient honorées jusqu’à leur terme et que les commissions correspondantes restent dues. Vous examinez ces conditions avant de vous engager.",
        },
        {
          question: "Puis-je continuer à occuper mon logement ?",
          answer:
            "Oui. Vos périodes personnelles sont définies et bloquées dans le calendrier en tenant compte des réservations déjà confirmées et des modalités convenues ensemble.",
        },
        {
          question: "La gestion complète a-t-elle un tarif unique ?",
          answer:
            "Oui. La commission est de 20 % TTC sur le montant des nuitées avant déduction des frais de plateforme, hors ménage, linge et taxe de séjour. Les frais séparés et les conditions propres à votre bien sont détaillés dans la proposition.",
        },
        {
          question: "Le ménage, le linge et les consommables sont-ils inclus ?",
          answer:
            "La coordination du ménage et du linge est incluse dans la commission. Les prestations de ménage, le linge et les consommables sont facturés séparément selon le devis et payés par le locataire. La proposition précise les prestations et leurs coûts pour votre logement.",
        },
        {
          question:
            "Puis-je vous confier uniquement le ménage, l’accueil ou l’annonce ?",
          answer:
            "Non. Inastia propose uniquement la gestion complète de votre location. Le suivi de l’annonce, l’accueil et la préparation du logement font partie de cette offre ; nous ne les proposons pas séparément. Les prestations et leurs coûts sont précisés dans la proposition.",
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
      heading: "Des propriétaires à vos côtés pour gérer votre location.",
      intro:
        "Confier les clés de sa maison, c’est aussi confier son quotidien de location. Propriétaires nous-mêmes, nous avons créé Inastia pour accompagner les propriétaires en Corse. Vous échangez directement avec notre équipe familiale pour organiser la gestion complète et les points qui demandent votre décision.",
      image: "casa_verde",
      imageAlt: "Casa Verde, une maison accompagnée par Inastia à Pinarello",
      sections: [
        {
          title: "Notre équipe suit l’annonce et les réservations",
          text: "Notre équipe prépare ou améliore votre annonce, suit les réservations et ajuste les prix selon la saison. Nous relions le calendrier aux arrivées et aux prestations sur place. Vos périodes personnelles sont intégrées en tenant compte des réservations confirmées : vous déléguez le suivi sans renoncer à vos propres séjours.",
        },
        {
          title: "Notre équipe coordonne les voyageurs et la maison",
          text: "Nous préparons les consignes, répondons aux voyageurs et organisons l’accueil. Entre les séjours, nous coordonnons le ménage et le linge, puis vérifions la préparation à l’aide d’une checklist et de photos. Les anomalies et les besoins de maintenance vous sont signalés. Vous validez les interventions supplémentaires ; leurs coûts sont distincts de la commission.",
        },
        {
          title: "Vous échangez directement avec notre équipe",
          text: "Basés à Travo, nous restons votre lien avec le suivi de la maison. Vous échangez directement avec notre équipe et décidez des interventions supplémentaires. Vous encaissez les loyers sur votre compte ; nos factures mensuelles distinguent les honoraires et les frais convenus. Avant le démarrage, vous examinez les prestations, les coûts et les conditions dans la proposition.",
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
            "Après votre demande d’audit gratuit, nous vous rappelons sous 24 h, selon vos disponibilités. Nous parlons de votre logement, de son emplacement et de votre organisation actuelle pour préparer la gestion complète. L’audit reste qualitatif, sans prévision de revenus.",
        },
        {
          question: "Faut-il déjà louer son bien pour vous contacter ?",
          answer:
            "Non. Le premier audit gratuit est possible même sans annonce existante. La préparation de la première mise en location peut ensuite s’inscrire dans la gestion complète, selon le périmètre convenu.",
        },
        {
          question:
            "Puis-je vous confier uniquement le ménage, l’accueil ou l’annonce ?",
          answer:
            "Non. Inastia propose uniquement la gestion complète de votre location. Le suivi de l’annonce, l’accueil et la préparation du logement font partie de cette offre ; nous ne les proposons pas séparément. Les prestations et leurs coûts sont précisés dans la proposition.",
        },
      ],
    },
    {
      slug: "audit-gratuit-potentiel-locatif",
      kind: "audit",
      title: "Audit gratuit de votre location en Corse | Inastia",
      description:
        "Un premier audit gratuit pour préparer la gestion complète de votre location en Corse. Rappel sous 24 h selon vos disponibilités, sans prévision de revenus.",
      eyebrow: "Audit gratuit",
      heading: "Identifiez les priorités avant de déléguer votre location.",
      intro:
        "Vous préparez une première location ou souhaitez passer le relais ? L’audit gratuit vous aide à identifier les points à préparer, les informations manquantes et les prochaines étapes possibles. Nous vous rappelons sous 24 h, selon vos disponibilités, pour commencer l’échange sur votre logement. L’analyse est qualitative, sans prévision de revenus.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi, à Pinarello, Zonza",
      sections: [
        {
          title: "1. Présentez votre bien et votre projet",
          text: "Indiquez la commune, le type de logement et votre situation : première mise en location ou annonce déjà publiée. La capacité d’accueil et le lien de l’annonce, s’il existe, complètent cette première base. Précisez aussi vos disponibilités pour le rappel. L’adresse du bien permet de confirmer les prestations possibles dans notre secteur, de Ghisonaccia à Porto-Vecchio.",
        },
        {
          title: "2. Identifiez les points à préparer",
          text: "Le premier échange porte sur votre organisation et ce que vous souhaitez déléguer. Nous examinons les informations du logement et, si elle existe, votre annonce : présentation, équipements, prix et avis. Nous faisons le point avec vous sur les priorités, les informations à compléter et les conditions d’une éventuelle prise en charge. Le délai de 24 h concerne le rappel, pas la réalisation complète de l’audit.",
          items: [
            "Les priorités pour l’annonce et l’organisation des séjours",
            "Les informations du logement à compléter",
            "Les prochaines étapes et les conditions de prise en charge",
          ],
        },
        {
          title: "3. Examinez la suite avant de décider",
          text: "L’audit vous aide à décider si vous souhaitez poursuivre vers la gestion complète. Dans ce cas, une proposition distincte précise les prestations, la commission, les frais et les conditions. Vous l’examinez avant de vous engager. L’audit reste gratuit et qualitatif ; il ne garantit ni revenus ni résultats locatifs.",
        },
      ],
      faq: [
        {
          question: "Qu’est-ce que l’audit m’aide à décider ?",
          answer:
            "Nous faisons le point sur les priorités de votre annonce et de vos séjours, les informations à compléter et les conditions d’une éventuelle prise en charge. Vous pouvez ensuite décider de poursuivre ou non vers une proposition de gestion. Cette première analyse est qualitative, sans estimation de revenus.",
        },
        {
          question: "L’audit est-il payant ?",
          answer:
            "Non, ce premier audit qualitatif est gratuit. Si vous souhaitez ensuite nous confier la gestion complète, les prestations et les conditions sont présentées dans une proposition distincte.",
        },
        {
          question: "L’audit est-il terminé sous 24 h ?",
          answer:
            "Le délai de 24 h concerne notre rappel, selon vos disponibilités. Il sert à commencer l’échange et à préciser votre situation ; il ne s’agit pas d’un engagement de réaliser l’audit complet dans ce délai.",
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
        {
          question:
            "Puis-je vous confier uniquement le ménage, l’accueil ou l’annonce ?",
          answer:
            "Non. Inastia propose uniquement la gestion complète de votre location. Le suivi de l’annonce, l’accueil et la préparation du logement font partie de cette offre ; nous ne les proposons pas séparément. Les prestations et leurs coûts sont précisés dans la proposition.",
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
      heading: "Your Porto-Vecchio rental, without coordinating every detail.",
      intro:
        "Listings, bookings, guest messages and property visits need regular attention, even when you are away. Our family team provides full management in Porto-Vecchio. You choose your own stays and approve additional work; we coordinate the day-to-day tasks.",
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
          text: "From keys to clean linen, each changeover takes coordination. We organise arrivals, cleaning and checks of the home’s preparation. Photographs after each visit document that preparation; we report any issues to you.",
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
            "Our commission is 20% including VAT of the accommodation amount before platform fees, excluding cleaning, linen and tourist tax. Services charged separately and the contract terms are set out in the proposal before management begins.",
        },
        {
          question:
            "Can I book cleaning, guest arrivals or listing support on their own?",
          answer:
            "No. Inastia provides full rental management only. Listing support, guest arrivals and property preparation are parts of that service; we do not offer them separately. Services and costs are set out in the proposal.",
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
      heading: "Hand over the care of your Solenzara rental.",
      intro:
        "Preparing an arrival means knowing the bookings, access and needs of the home. Our full management connects these tasks, from the listing to local coordination. You speak with our team about upcoming stays, services and spending that needs your approval.",
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
          text: "Whether you are launching a rental or already taking bookings, we start with your current arrangements to prepare full management. We connect listing management, the guest guide and stay coordination. The proposal sets out the tasks and costs before work begins.",
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
            "We report maintenance needs and coordinate the work you approve. Its cost is specified separately from the management commission.",
        },
        {
          question: "How do changeovers fit into full management?",
          answer:
            "We coordinate them with bookings and arrivals as part of full management. Visits, cleaning, linen and supplies are specified in the proposal, including their costs.",
        },
        {
          question:
            "Can I book cleaning, guest arrivals or listing support on their own?",
          answer:
            "No. Inastia provides full rental management only. Listing support, guest arrivals and property preparation are parts of that service; we do not offer them separately. Services and costs are set out in the proposal.",
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
      heading: "Your Pinarello home. Our team for the rental.",
      intro:
        "Want to rent out your home while keeping time there with your family? We manage the listing, bookings, guest communication and property preparation as part of full management. Your personal stays are arranged within the agreed calendar and terms.",
      image: "casa_verde",
      imageAlt: "Casa Verde in Pinarello, Zonza",
      sections: [
        {
          title: "Tell us exactly where your home is",
          text: "The municipality of Zonza includes the mountain village and a coastal area around Sainte-Lucie-de-Porto-Vecchio and Pinarello. In your enquiry, specify the area, address and access arrangements for your home. These details let us confirm whether we can take on management and organise the agreed visits; the municipality name alone is not enough.",
        },
        {
          title: "Preparation that fits your home",
          text: "Bedrooms, guest capacity and outdoor spaces set the scope. We organise cleaning, linen and photographic checks around your property and the services agreed.",
        },
        {
          title: "Help guests find their bearings",
          text: "Access instructions and the guest guide share useful details before arrival. During the stay, our team answers guests’ questions about the property and their visit. A welcome takes shape in these conversations too.",
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
            "Yes. Your personal stays are agreed and blocked in the calendar, taking account of confirmed bookings and the arrangements agreed together.",
        },
        {
          question:
            "Can I book cleaning, guest arrivals or listing support on their own?",
          answer:
            "No. Inastia provides full rental management only. Listing support, guest arrivals and property preparation are parts of that service; we do not offer them separately. Services and costs are set out in the proposal.",
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
      heading: "One team to look after your Lecci rental.",
      intro:
        "Preparing the listing, responding to guests and arranging the home between stays: we bring these tasks together in full management in Lecci and Saint-Cyprien. You no longer have to coordinate each step; we agree the services and costs together.",
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
          text: "Your personal stays are agreed and blocked in the calendar, taking account of confirmed bookings and the arrangements agreed together. We coordinate bookings and stays; you keep the decisions that remain yours about the home. Services, costs and terms are specified before management begins.",
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
        {
          question:
            "Can I book cleaning, guest arrivals or listing support on their own?",
          answer:
            "No. Inastia provides full rental management only. Listing support, guest arrivals and property preparation are parts of that service; we do not offer them separately. Services and costs are set out in the proposal.",
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
      heading: "Local support for your rental near Ghisonaccia.",
      intro:
        "Based in Travo, Ventiseri, our family team looks after rentals around Ghisonaccia and Prunelli-di-Fiumorbo. Full management connects your listing, bookings and local coordination. You keep a direct link with us for updates and decisions about your home.",
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
          text: "We arrange cleaning, linen and supplies between stays. We report unexpected issues and work that needs a decision, then coordinate the work you approve.",
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
        {
          question:
            "Can I book cleaning, guest arrivals or listing support on their own?",
          answer:
            "No. Inastia provides full rental management only. Listing support, guest arrivals and property preparation are parts of that service; we do not offer them separately. Services and costs are set out in the proposal.",
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
      heading: "Hand over your rental. Keep your decisions.",
      intro:
        "Want to rent out your home without coordinating the listing, guests and every visit yourself? Our family team brings these tasks together in one full management service. You keep your personal stays, within the agreed calendar, and the decisions that remain yours.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi in Pinarello, Zonza",
      sections: [
        {
          title: "Your listing and bookings managed together",
          text: "Whether this is your first rental or an existing listing, we prepare or improve your property’s presentation, amenities, house rules and practical information. We then follow bookings, availability and seasonal pricing. Your own stays are blocked in the calendar, taking confirmed bookings into account. You no longer have to coordinate the listing and each arrival separately.",
          items: [
            "Listing creation or improvement",
            "Booking, pricing and availability management",
            "Your personal stays included in the calendar",
          ],
        },
        {
          title: "Someone to handle guest communication",
          text: "We prepare access instructions and property information, organise arrivals and departures, then answer questions about the stay. Guests communicate with our team; we flag the points that need your decision. We also follow up on their reviews after departure.",
          items: [
            "House instructions and a guest guide",
            "Communication before and during the stay",
            "Arrival and departure arrangements",
          ],
        },
        {
          title: "A prepared home, with issues brought to your attention",
          text: "We coordinate keys, cleaning and linen around arrivals. A checklist and photographs after each visit document the home’s preparation. We report any issues; you approve the additional work and purchases we arrange. Coordination is included in the commission. Cleaning, linen, supplies and repairs are priced separately.",
          items: [
            "Property preparation between stays",
            "A checklist and photographs after each intervention",
            "Issues reported, additional work submitted for your approval",
          ],
        },
        {
          title: "Your decisions and costs, agreed before we begin",
          text: "You receive rental payments directly, keep your own stays and approve additional work. Before deciding, you receive a proposal separating the 20% commission including VAT on accommodation from other services and property expenses. The address and access arrangements help us confirm coverage; duration and terms are set out in the contract. If you are still planning, the free review helps you consider the next steps.",
          items: [
            "Your personal stays and decisions preserved",
            "Commission, services and additional costs set out in the proposal",
            "Duration and terms specified in the contract",
          ],
        },
      ],
      faq: [
        {
          question: "Which properties can you manage?",
          answer:
            "We consider homes on Corsica’s east coast, from Ghisonaccia to Porto-Vecchio. The exact address, access, property type and guest capacity help us assess arrival and visit arrangements. The municipality name alone does not confirm that we can manage a property.",
        },
        {
          question: "How will I hear about my property?",
          answer:
            "You speak directly with our team. We report issues and work that needs your decision. Monthly invoices detail rental income, our commission and agreed costs.",
        },
        {
          question: "What happens if there is a problem during a stay?",
          answer:
            "Guests contact our team with questions about the property and their stay. We report issues and work that needs your decision, then coordinate the steps you authorise. Repairs and additional purchases are separate from the commission and must be discussed with you.",
        },
        {
          question: "Can you take over an existing rental?",
          answer:
            "Yes, we can prepare to take over an existing rental. Together, we review confirmed bookings, the listing, account and property access, and the handover date. This defines the tasks to take over and the handover arrangements before work begins.",
        },
        {
          question: "How long is the agreement, and how can it end?",
          answer:
            "The duration is specified in your contract. The terms provide for automatic renewal unless either party gives notice by registered letter with acknowledgement of receipt two months before the end date. They also provide for confirmed bookings to be honoured through completion and the related commissions to remain payable. You review these conditions before committing.",
        },
        {
          question: "Can I still stay in my home?",
          answer:
            "Yes. Your personal stays are agreed and blocked in the calendar, taking account of confirmed bookings and the arrangements agreed together.",
        },
        {
          question: "Is there one fixed management rate?",
          answer:
            "Yes. Our commission is 20% including VAT of the accommodation amount before platform fees, excluding cleaning, linen and tourist tax. Separate costs and the terms for your property are detailed in the proposal.",
        },
        {
          question: "Are cleaning, linen and supplies included?",
          answer:
            "Cleaning and linen coordination is included in the commission. Cleaning services, linen and supplies are charged separately as quoted and paid by the guest. The proposal specifies the services and their costs for your property.",
        },
        {
          question:
            "Can I book cleaning, guest arrivals or listing support on their own?",
          answer:
            "No. Inastia provides full rental management only. Listing support, guest arrivals and property preparation are parts of that service; we do not offer them separately. Services and costs are set out in the proposal.",
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
      heading: "Fellow owners, here to manage your rental.",
      intro:
        "Handing over your keys also means handing over the day-to-day work of a rental. As owners ourselves, we created Inastia to support homeowners in Corsica. You speak directly with our family team about full management and the matters that need your decision.",
      image: "casa_verde",
      imageAlt: "Casa Verde, a home supported by Inastia in Pinarello",
      sections: [
        {
          title: "Our team manages the listing and bookings",
          text: "Our team prepares or improves your listing, follows bookings and adjusts prices for the season. We connect the calendar with arrivals and local services. Your own stays are included, taking confirmed bookings into account: you hand over the day-to-day work while keeping time in your home.",
        },
        {
          title: "Our team coordinates guests and property care",
          text: "We prepare instructions, answer guests and organise arrivals. Between stays, we coordinate cleaning and linen, then check preparation using a checklist and photographs. We report any issues and maintenance needs. You approve additional work; its costs are separate from the commission.",
        },
        {
          title: "You speak directly with our team",
          text: "Based in Travo, we keep you connected to the care of your home. You speak directly with our team and decide on additional work. Rental payments go to your account; our monthly invoices distinguish our fees from agreed costs. Before work begins, you review the services, costs and terms in the proposal.",
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
            "After your free review request, we call you back within 24 hours, taking your availability into account. We discuss your property, its location and your current arrangements to prepare for full management. The review is qualitative, without a rental income forecast.",
        },
        {
          question: "Do I need to be renting already?",
          answer:
            "No. The free initial review is available even without an existing listing. Preparing a first rental can then form part of full management, within the agreed scope.",
        },
        {
          question:
            "Can I book cleaning, guest arrivals or listing support on their own?",
          answer:
            "No. Inastia provides full rental management only. Listing support, guest arrivals and property preparation are parts of that service; we do not offer them separately. Services and costs are set out in the proposal.",
        },
      ],
    },
    {
      slug: "audit-gratuit-potentiel-locatif",
      kind: "audit",
      title: "Free holiday rental review in Corsica | Inastia",
      description:
        "A free initial review to prepare full management of your Corsican rental. A call back within 24 hours, taking your availability into account; no income forecast.",
      eyebrow: "Free rental review",
      heading: "Identify what to prepare before handing over your rental.",
      intro:
        "Preparing your first rental or ready to hand over an existing one? The free review helps identify what needs preparation, missing information and possible next steps. We call you back within 24 hours, taking your availability into account, to begin discussing your home. The review is qualitative, without an income forecast.",
      image: "villa_amichi",
      imageAlt: "Villa d’Amichi in Pinarello, Zonza",
      sections: [
        {
          title: "1. Tell us about your home and plans",
          text: "Share the town, property type and your situation: a first rental or an existing listing. Guest capacity and a listing link, if available, add useful context. Let us know when you are available for a call. The property’s address helps us confirm the services possible within our area, from Ghisonaccia to Porto-Vecchio.",
        },
        {
          title: "2. Identify what needs preparation",
          text: "The first conversation covers your current arrangements and what you want to hand over. We examine the property information and, if you have one, your listing: presentation, amenities, pricing and reviews. Together, we consider priorities, information to complete and the conditions for possible management. The 24-hour commitment applies to the call back, not completion of the review.",
          items: [
            "Priorities for the listing and stay arrangements",
            "Property information to complete",
            "Next steps and conditions for taking on management",
          ],
        },
        {
          title: "3. Consider the next steps before deciding",
          text: "The review helps you decide whether to move towards full management. If you do, a separate proposal sets out services, commission, costs and terms. You consider it before committing. The review remains free and qualitative; it guarantees neither income nor rental results.",
        },
      ],
      faq: [
        {
          question: "What does the review help me decide?",
          answer:
            "Together, we consider priorities for your listing and stays, information to complete and the conditions for possible management. You can then decide whether to move on to a management proposal. This initial review is qualitative, without an income estimate.",
        },
        {
          question: "Is there a fee for the review?",
          answer:
            "No, this initial qualitative review is free. If you then wish to arrange full management, the services and terms are set out in a separate proposal.",
        },
        {
          question: "Is the review completed within 24 hours?",
          answer:
            "The 24-hour commitment is for our call back, taking your availability into account. It begins the conversation and helps clarify your situation; it is not a commitment to complete the whole review within that time.",
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
        {
          question:
            "Can I book cleaning, guest arrivals or listing support on their own?",
          answer:
            "No. Inastia provides full rental management only. Listing support, guest arrivals and property preparation are parts of that service; we do not offer them separately. Services and costs are set out in the proposal.",
        },
      ],
    },
  ],
};
