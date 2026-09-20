import type { Locale } from "./pages.ts";

export const firstRentalSlug = "premiere-mise-en-location-corse";

export const firstRentalSteps: Record<Locale, { title: string; text: string; owner: string; team: string }[]> = {
  fr: [
    {
      title: "Dessiner votre saison.",
      text: "Quelques semaines en été ou une saison plus longue ? Le point de départ, c’est votre façon de vivre la maison. Nous examinons son adresse, ses accès et votre projet avant de confirmer la prise en charge.",
      owner: "Les périodes que vous souhaitez louer, celles que vous gardez pour vous et vos questions.",
      team: "Un premier échange pour comprendre le logement, vos besoins et l’organisation possible.",
    },
    {
      title: "Préparer une maison accueillante.",
      text: "Une literie confortable, une cuisine bien équipée, des rangements disponibles, des équipements qui fonctionnent : on prépare le séjour jusque dans les détails. Les achats et travaux éventuels restent soumis à votre accord.",
      owner: "L’inventaire des équipements, les points à réparer et les affaires personnelles à mettre de côté.",
      team: "Les priorités de préparation, l’organisation du ménage et du linge, les consignes propres à votre maison.",
    },
    {
      title: "Donner envie de venir.",
      text: "Les photos montrent les espaces tels qu’ils sont. L’annonce explique ce qui rend le séjour agréable, sans oublier les accès, les équipements et les règles de la maison. Le calendrier est préparé avec vos dates.",
      owner: "Les informations sur le logement, ses particularités et vos périodes d’occupation.",
      team: "Les photos professionnelles, la rédaction et la diffusion des annonces, les prix et le calendrier.",
    },
    {
      title: "Accueillir les premiers voyageurs.",
      text: "Une fois le cadre convenu et la maison prête, les séjours peuvent s’organiser. Des premiers messages à la remise des clés, puis entre deux réservations, notre équipe prend le relais sur place.",
      owner: "Vous encaissez directement les loyers et validez les dépenses supplémentaires de votre logement.",
      team: "Les réservations, les échanges, les arrivées et départs, les rotations et l’assistance voyageurs 24 h/24, 7 j/7.",
    },
  ],
  en: [
    {
      title: "Shape your season.",
      text: "A few summer weeks or a longer season? We start with the way you use your home. We review its address, access and your plans before confirming that we can take it on.",
      owner: "The dates you would like to rent out, the time you want to keep for yourself and your questions.",
      team: "A first conversation to understand your home, your needs and the arrangements that could work.",
    },
    {
      title: "Make the house welcoming.",
      text: "Comfortable beds, a well-equipped kitchen, space for belongings and appliances that work: a good stay starts with the details. Any purchases or work on the property remain subject to your approval.",
      owner: "An equipment inventory, any repairs to consider and personal belongings to set aside.",
      team: "Preparation priorities, cleaning and linen arrangements, and instructions specific to your home.",
    },
    {
      title: "Help guests picture their stay.",
      text: "Photographs show the spaces as they are. The listing explains what makes the stay special, together with access, amenities and house rules. We plan the calendar around your dates.",
      owner: "Information about the property, its particular features and the dates of your own stays.",
      team: "Professional photographs, writing and publishing the listings, pricing and the calendar.",
    },
    {
      title: "Welcome your first guests.",
      text: "Once the arrangements are agreed and the house is ready, stays can be organised. From the first messages to handing over the keys, then between bookings, our team takes care of the details locally.",
      owner: "You receive rental income directly and approve any additional property expenses.",
      team: "Bookings, communication, arrivals and departures, changeovers and round-the-clock guest assistance.",
    },
  ],
};

export const firstRentalChecklist: Record<Locale, { title: string; detail: string }[]> = {
  fr: [
    { title: "Situer la maison", detail: "L’adresse, les accès et les possibilités de stationnement." },
    { title: "Imaginer le calendrier", detail: "Les périodes à louer et celles à réserver à vos propres séjours." },
    { title: "Faire le tour des équipements", detail: "Les couchages, la cuisine, les extérieurs et les points à préparer." },
    { title: "Rassembler quelques photos", detail: "Des vues simples pour nous présenter le logement, même avant sa préparation." },
    { title: "Repérer les démarches à vérifier", detail: "Votre mairie, votre assurance et, le cas échéant, votre copropriété." },
    { title: "Noter vos questions", detail: "Vos attentes, vos hésitations et la date de démarrage envisagée." },
  ],
  en: [
    { title: "Locate the home", detail: "The address, access arrangements and parking options." },
    { title: "Sketch out a calendar", detail: "The dates to offer and those to keep for your own stays." },
    { title: "Review the equipment", detail: "Beds, the kitchen, outdoor spaces and anything to prepare." },
    { title: "Gather a few photographs", detail: "Simple pictures to introduce the home, even before it is prepared." },
    { title: "Identify the checks to make", detail: "With your town hall, insurer and, where applicable, your co-ownership association." },
    { title: "Write down your questions", detail: "Your expectations, concerns and preferred starting date." },
  ],
};

export const firstRentalFaq: Record<Locale, { question: string; answer: string }[]> = {
  fr: [
    { question: "Ma maison doit-elle être prête avant de vous contacter ?", answer: "Non. Vous pouvez nous présenter votre projet même sans annonce et avant la préparation du logement. Le premier échange permet d’identifier les priorités et d’examiner une prise en charge possible. Les prestations, les coûts et les modalités sont précisés avant le démarrage." },
    { question: "Puis-je garder des semaines pour ma famille ?", answer: "Oui. Vous choisissez vos périodes d’occupation et nous les intégrons au calendrier, en tenant compte des réservations déjà confirmées. Le mieux est de prévoir vos séjours personnels dès la préparation de la saison." },
    { question: "Combien de temps faut-il pour commencer ?", answer: "Cela dépend de l’état du logement, des équipements, des démarches applicables et des interventions à organiser. Nous examinons ces points avant de convenir d’une date. Le rappel sous 24 h annoncé pour l’audit gratuit concerne le premier échange, selon vos disponibilités ; il ne correspond pas à un délai de mise en location." },
    { question: "Que comprend l’audit gratuit si je n’ai pas encore d’annonce ?", answer: "Nous échangeons sur la maison, votre projet et les priorités de préparation. Cet audit est qualitatif : il aide à déterminer les prochaines étapes, sans prévision de revenus ni garantie de réservations. Vous pouvez ensuite examiner une proposition de gestion complète." },
    { question: "Pouvez-vous seulement créer mon annonce ?", answer: "La préparation de l’annonce et la mise en location s’inscrivent dans notre gestion complète. Nous ne proposons pas de création d’annonce ou de ménage isolés en dehors de nos offres. Si votre maison reste réservée à vos séjours personnels, notre offre d’intendance peut répondre à un autre besoin." },
  ],
  en: [
    { question: "Does my home need to be ready before I contact you?", answer: "No. You can tell us about your plans before the property is prepared and without an existing listing. The first conversation helps identify priorities and consider whether we can take it on. Services, costs and arrangements are specified before work starts." },
    { question: "Can I keep some weeks for my family?", answer: "Yes. You choose your own dates and we include them in the calendar, taking confirmed bookings into account. It is best to plan your personal stays as we prepare the season." },
    { question: "How long does it take to get started?", answer: "That depends on the condition of the property, its equipment, applicable formalities and any work to arrange. We review these points before agreeing on a date. The callback within 24 hours offered with the free review concerns the first conversation, at a time that suits you; it is not a deadline for launching the rental." },
    { question: "What does the free review cover if I have no listing yet?", answer: "We discuss the house, your plans and preparation priorities. This is a qualitative review to help identify next steps, without an income forecast or guaranteed bookings. You can then consider a full management proposal." },
    { question: "Can you just create my listing?", answer: "Listing preparation and getting the rental started are part of our full management service. We do not offer standalone listing creation or cleaning outside our services. If you keep the home for your own stays, our second-home care service may meet a different need." },
  ],
};
