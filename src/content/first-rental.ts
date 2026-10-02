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

export const firstRentalChecklist: Record<Locale, { title: string; items: { title: string; detail: string }[] }[]> = {
  fr: [
    {
      title: "Poser le cadre",
      items: [
        { title: "Vérifier les démarches de la commune", detail: "Précisez à la mairie l’adresse et l’usage du logement : résidence principale ou secondaire. Faites confirmer la déclaration, l’enregistrement et l’éventuelle autorisation de changement d’usage à obtenir avant de louer." },
        { title: "Relire l’assurance et la copropriété", detail: "Faites confirmer par votre assureur la couverture de la location saisonnière, ses exclusions et les justificatifs nécessaires. Si le logement est en copropriété, vérifiez son règlement et les démarches auprès du syndic." },
        { title: "Préparer le dossier de loueur", detail: "Vérifiez les formalités de début d’activité et le numéro SIRET. Identifiez les déclarations fiscales à prévoir et qui collecte puis reverse la taxe de séjour pour chaque canal de réservation." },
        { title: "Réserver vos dates et votre budget", detail: "Bloquez vos séjours personnels, les travaux et les périodes indisponibles. Listez les achats, réparations et frais récurrents à prévoir avant de choisir une date d’ouverture réaliste." },
      ],
    },
    {
      title: "Préparer la maison",
      items: [
        { title: "Prévoir chaque couchage et le linge", detail: "Notez les dimensions des lits et contrôlez matelas, protections, oreillers et occultation. Préparez les draps, serviettes et un stock de remplacement adapté aux rotations, avec un rangement identifié." },
        { title: "Équiper la cuisine pour tous les voyageurs", detail: "Comptez vaisselle, verres, couverts et places à table selon la capacité annoncée. Vérifiez ustensiles, casseroles, réfrigérateur, cuisson, poubelles et matériel de ménage ; complétez ce qui manque." },
        { title: "Tester les équipements et les accès", detail: "Essayez l’eau chaude, les éclairages, les appareils, le Wi-Fi et la climatisation s’ils sont proposés. Testez volets, serrures et portail ; repérez les coupures d’eau et d’électricité et les réparations à effectuer." },
        { title: "Contrôler la sécurité et les extérieurs", detail: "Vérifiez le détecteur de fumée, les escaliers, garde-corps et éclairages d’accès. Pour une piscine, faites vérifier le dispositif de sécurité adapté. Prévoyez les consignes d’urgence et les restrictions locales d’usage du barbecue." },
      ],
    },
    {
      title: "Préparer l’annonce",
      items: [
        { title: "Faire un inventaire et libérer les rangements", detail: "Listez les équipements pièce par pièce et photographiez leur état. Mettez les objets personnels à l’abri et laissez de la place dans les placards pour les voyageurs." },
        { title: "Photographier une maison prête à accueillir", detail: "Préparez les lits, rangez les pièces et photographiez chambres, salles d’eau, cuisine et extérieurs. Montrez les espaces réellement accessibles et les particularités utiles, sans masquer les contraintes." },
        { title: "Décrire le logement avec précision", detail: "Précisez couchages, salles d’eau, stationnement et équipements disponibles. Signalez escaliers, accès difficile ou espaces partagés ; fixez les règles concernant animaux, tabac, bruit et capacité d’accueil." },
        { title: "Vérifier les prix et les calendriers", detail: "Définissez les prix par période, la durée minimale et les conditions de réservation. Distinguez nuitées, frais de plateforme, gestion, ménage, linge et taxe de séjour ; vérifiez la cohérence des disponibilités entre annonces." },
      ],
    },
    {
      title: "Organiser le premier accueil",
      items: [
        { title: "Préparer le ménage et les rotations", detail: "Confirmez qui intervient et le temps disponible entre départ et arrivée. Préparez une liste de contrôle, le circuit du linge, les consommables à renouveler et un contrôle final avant chaque séjour." },
        { title: "Tester la remise des clés", detail: "Vérifiez l’itinéraire, le stationnement et l’accès au logement. Définissez les horaires, les consignes en cas de retard, les jeux de clés et la personne à joindre en cas de difficulté." },
        { title: "Rédiger un guide de maison", detail: "Rassemblez le code Wi-Fi, les notices utiles, le tri des déchets, les règles de piscine s’il y en a une et les consignes de départ. Ajoutez les contacts utiles et le respect du voisinage." },
        { title: "Faire une répétition avant l’arrivée", detail: "Parcourez la maison comme un voyageur : entrer, se connecter, cuisiner, se doucher et dormir. Corrigez les oublis, vérifiez l’inventaire et confirmez que chaque intervenant connaît son rôle." },
      ],
    },
  ],
  en: [
    {
      title: "Set the foundations",
      items: [
        { title: "Check the municipal requirements", detail: "Give the town hall the address and whether this is your main or second home. Confirm the declaration, registration and any change-of-use authorisation required before renting it out." },
        { title: "Review insurance and co-ownership rules", detail: "Ask your insurer to confirm holiday rental cover, exclusions and any documents needed. For a home in a co-owned building or development, check its rules and the formalities with the property manager." },
        { title: "Prepare your rental activity documents", detail: "Check the business registration formalities and SIRET number. Identify the tax declarations to plan for and who collects and remits tourist tax for each booking channel." },
        { title: "Set aside your dates and budget", detail: "Block your own stays, planned work and unavailable periods. List purchases, repairs and ongoing costs before choosing a realistic opening date." },
      ],
    },
    {
      title: "Prepare the home",
      items: [
        { title: "Plan every bed and the linen", detail: "Record bed sizes and check mattresses, protectors, pillows and blackout curtains or shutters. Prepare sheets, towels and spare sets suited to changeovers, with a designated storage area." },
        { title: "Equip the kitchen for every guest", detail: "Count dishes, glasses, cutlery and dining seats against the advertised capacity. Check utensils, pans, the fridge, cooking facilities, bins and cleaning equipment; replace anything missing." },
        { title: "Test equipment and access", detail: "Try the hot water, lights, appliances, Wi-Fi and air conditioning where offered. Test shutters, locks and gates; locate water and electricity shut-offs and identify repairs to make." },
        { title: "Check safety and outdoor areas", detail: "Check the smoke detector, stairs, railings and entrance lighting. For a pool, have the appropriate safety system checked. Prepare emergency instructions and check local restrictions on barbecue use." },
      ],
    },
    {
      title: "Prepare the listing",
      items: [
        { title: "Make an inventory and clear storage space", detail: "List equipment room by room and photograph its condition. Put personal belongings away securely and leave cupboard space for guests." },
        { title: "Photograph a home ready for guests", detail: "Make the beds, tidy the rooms and photograph bedrooms, bathrooms, kitchen and outdoor areas. Show the spaces guests can actually use and helpful details without hiding limitations." },
        { title: "Describe the home accurately", detail: "Specify beds, bathrooms, parking and available amenities. Mention stairs, difficult access or shared spaces; set rules for pets, smoking, noise and guest numbers." },
        { title: "Check prices and calendars", detail: "Set seasonal prices, minimum stays and booking terms. Separate accommodation charges, platform fees, management, cleaning, linen and tourist tax; check availability is consistent across listings." },
      ],
    },
    {
      title: "Arrange the first arrival",
      items: [
        { title: "Plan cleaning and changeovers", detail: "Confirm who will attend and the time available between departure and arrival. Prepare a cleaning checklist, linen arrangements, supplies to replenish and a final check before each stay." },
        { title: "Test the key handover", detail: "Check directions, parking and entry to the home. Set arrival times, instructions for delays, key arrangements and a contact for access difficulties." },
        { title: "Write a house guide", detail: "Gather the Wi-Fi code, useful appliance instructions, waste sorting, pool rules where relevant and departure instructions. Add useful contacts and guidance on respecting neighbours." },
        { title: "Do a trial run before arrival", detail: "Walk through the home as a guest: arrive, connect, cook, shower and sleep. Resolve anything overlooked, check the inventory and confirm that everyone involved knows their role." },
      ],
    },
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
