import type { Locale } from "./pages.ts";

export const intendanceSlug = "intendance-residence-secondaire-corse";
export const intendanceSetup = 120;
export const intendancePlans = [
  { id: "essentielle", name: { fr: "Essentielle", en: "Essential" }, visits: 1, monthly: 89 },
  { id: "serenite", name: { fr: "Sérénité", en: "Serenity" }, visits: 2, monthly: 159 },
] as const;

export const intendanceExtras: {
  id: string;
  price: number;
  name: Record<Locale, string>;
  detail: Record<Locale, string>;
  unit: Record<Locale, string>;
}[] = [
  {
    id: "visite", price: 69,
    name: { fr: "Visite supplémentaire", en: "Additional scheduled visit" },
    detail: { fr: "Ajoutez un passage pour vérifier la maison entre deux visites. Contrôle visuel jusqu’à 30 minutes et compte rendu photo, sur une tournée programmée.", en: "Add a visit to check your home between scheduled appointments. Includes a visual check of up to 30 minutes and a photo report, as part of a planned round." },
    unit: { fr: "le passage", en: "per visit" },
  },
  {
    id: "meteo", price: 79,
    name: { fr: "Passage après intempéries", en: "Post-weather visit" },
    detail: { fr: "Après un épisode météo, nous vérifions l’état apparent des espaces accessibles et vous adressons des photos. Passage sur demande jusqu’à 30 minutes, selon disponibilité et dès que les accès sont sûrs.", en: "After a weather event, we check the visible condition of accessible areas and send you photos. Visits of up to 30 minutes are available on request, subject to availability and safe access." },
    unit: { fr: "le passage", en: "per visit" },
  },
  {
    id: "ouverture", price: 95,
    name: { fr: "Préparation avant votre arrivée", en: "Preparation before your arrival" },
    detail: { fr: "Avant votre arrivée, nous aérons la maison, réglons la température et réalisons les vérifications d’usage selon vos consignes. Jusqu’à une heure sur place. Ménage, linge et achats en supplément sur devis.", en: "Before you arrive, we air the home, set the temperature and carry out routine checks following your instructions. Includes up to one hour on site. Cleaning, linen and purchases are quoted separately." },
    unit: { fr: "la préparation", en: "per preparation" },
  },
  {
    id: "fermeture", price: 95,
    name: { fr: "Fermeture après votre départ", en: "Closing after your stay" },
    detail: { fr: "Après votre départ, nous vérifions les ouvrants, effectuons les réglages usuels prévus avec vous et vous envoyons un compte rendu. Jusqu’à une heure sur place, hors ménage et hivernage technique.", en: "After you leave, we check doors and windows, make the routine settings agreed with you and send a report. Includes up to one hour on site, excluding cleaning and technical winterisation." },
    unit: { fr: "la fermeture", en: "per closing visit" },
  },
  {
    id: "rendezvous", price: 75,
    name: { fr: "Présence pour un artisan ou une livraison", en: "Meeting a contractor or a delivery" },
    detail: { fr: "Nous sommes sur place pour accueillir l’artisan ou recevoir la livraison. Le rendez-vous comprend le déplacement et 45 minutes de présence. Au-delà : 30 € TTC par demi-heure, avec votre accord. La prestation de l’artisan reste séparée.", en: "We meet the contractor or receive the delivery at your home. The appointment includes travel and 45 minutes on site. Additional time is €30 including VAT per half-hour, with your approval. Contractor charges remain separate." },
    unit: { fr: "le rendez-vous", en: "per appointment" },
  },
  {
    id: "coordination", price: 60,
    name: { fr: "Coordination spécifique à distance", en: "Additional remote coordination" },
    detail: { fr: "Vous nous confiez l’organisation d’une intervention, les échanges avec un prestataire ou un suivi particulier. Hors suivi courant inclus dans l’abonnement, cette coordination est convenue à l’avance et décomptée par tranches de 15 minutes à 15 € TTC.", en: "Ask us to arrange work, liaise with a contractor or handle a specific request. Beyond the routine updates included in your plan, this coordination is agreed in advance and billed in 15-minute increments at €15 including VAT." },
    unit: { fr: "l’heure", en: "per hour" },
  },
];

export const intendanceFaq: Record<Locale, { question: string; answer: string }[]> = {
  fr: [
    { question: "À qui s’adresse l’intendance de résidence secondaire ?", answer: "Aux propriétaires qui souhaitent faire suivre leur maison en Corse pendant leurs absences. Vous nous confiez les visites régulières, les vérifications convenues, le courrier et les clés. Vous recevez un compte rendu photo après chaque passage et échangez directement avec notre équipe. Votre maison n’a pas besoin d’être proposée à la location." },
    { question: "Que vérifiez-vous pendant une visite ?", answer: "Nous réalisons un contrôle visuel jusqu’à 30 minutes dans les espaces accessibles : ouvrants, signes apparents d’humidité ou de fuite, points d’eau et compteurs. Nous aérons selon vos consignes et relevons le courrier, conservé sur place. Le contenu des vérifications est défini pour votre logement. Ces passages ne constituent pas un diagnostic technique ni une prestation de sécurité privée." },
    { question: "Comment suis-je informé du suivi de ma maison ?", answer: "Après chaque visite, vous recevez des photos et un compte rendu des vérifications effectuées. Nous vous signalons les anomalies constatées et les suites qui demandent votre décision. Les échanges se font directement avec notre équipe ; les dépenses et interventions supplémentaires restent soumises à votre accord." },
    { question: "Quels logements peuvent bénéficier des forfaits à 89 € et 159 € ?", answer: "Un logement jusqu’à 150 m² dans un seul bâtiment, avec accès routier standard, sur notre secteur de Ghisonaccia à Porto-Vecchio confirmé au devis. Les déplacements des visites programmées sont inclus. Nous examinons l’adresse précise et les accès avant de confirmer le forfait. Grandes propriétés, dépendances, accès isolés et adresses hors tournée font l’objet d’un devis adapté." },
    { question: "Comment les visites sont-elles planifiées ?", answer: "Nous convenons du calendrier avec vous et tenons compte de vos périodes de présence. Essentielle prévoit une visite par mois ; Sérénité en prévoit deux, réparties dans le mois. Une préparation d’arrivée ou un rendez-vous avec un artisan reste une prestation distincte, sauf remplacement expressément prévu au devis. Les changements de planning se conviennent ensemble." },
    { question: "Le ménage, le jardin et la piscine sont-ils inclus ?", answer: "L’abonnement couvre les visites et le suivi convenus. Le ménage, le linge, l’entretien du jardin ou de la piscine et les travaux sont proposés sur des devis distincts. Nous pouvons en organiser les interventions dans le cadre de votre intendance. Le coût des professionnels, des achats et de toute coordination spécifique vous est présenté avant votre accord." },
    { question: "Comment démarrer l’intendance de ma maison ?", answer: "Présentez-nous votre logement, ses accès, vos habitudes de séjour et le suivi souhaité. Le premier échange et le devis sont gratuits. Après acceptation, la mise en place à 120 € TTC comprend la visite initiale, le relevé des consignes, le dossier du bien et l’organisation des clés. Nous fixons ensuite le début de l’abonnement et les visites dans votre contrat." },
    { question: "Quelle est la durée de l’engagement ?", answer: "L’abonnement est mensuel, sans engagement annuel. Vous pouvez y mettre fin à tout moment avec un préavis de 30 jours. La dernière période est facturée au prorata des jours couverts, selon les conditions d’intendance. Les droits légaux de rétractation restent applicables. Vous examinez ces modalités dans le devis et le contrat avant de vous engager." },
    { question: "Que se passe-t-il si vous constatez une anomalie ?", answer: "Nous vous transmettons les éléments constatés et échangeons avec vous sur la suite à donner. Réparations, achats et prestations supplémentaires nécessitent votre accord et restent à votre charge. Un passage après intempéries peut être demandé en complément, selon disponibilité et accès sûrs. L’intendance ne comprend ni astreinte permanente, ni télésurveillance, ni garantie d’absence de sinistre entre deux visites." },
    { question: "Quelle différence avec la gestion locative complète ?", answer: "L’intendance organise le suivi de votre maison pendant vos absences et les prestations convenues pour vos séjours. La gestion complète prend en charge l’activité locative : annonces, réservations, échanges voyageurs, arrivées, départs et coordination de la maison. Si vous louez vous-même, l’intendance n’inclut pas l’accueil des voyageurs, les rotations ni leur assistance." },
  ],
  en: [
    { question: "Who is second-home care for?", answer: "For owners who want their home in Corsica looked after while they are away. We take care of regular visits, agreed checks, mail collection and key holding. You receive a photo report after every visit and speak directly with our team. Your home does not need to be offered for rental." },
    { question: "What do you check during a visit?", answer: "We carry out a visual check of up to 30 minutes in accessible areas: doors and windows, visible signs of damp or leaks, water points and meters. We air the home following your instructions and collect the mail, which stays at the property. The checks are agreed for your home. These visits are not a technical inspection or a private security service." },
    { question: "How will I be kept informed about my home?", answer: "After every visit, you receive photos and a report of the checks completed. We let you know about any issues found and the next steps that need your decision. You deal directly with our team; additional costs and interventions require your approval." },
    { question: "Which homes qualify for the €89 and €159 plans?", answer: "One home of up to 150 m² in a single building, with standard road access, in our service area from Ghisonaccia to Porto-Vecchio as confirmed in the quote. Travel for scheduled visits is included. We review the exact address and access before confirming the plan. Larger properties, outbuildings, isolated access and addresses outside our rounds receive a tailored quote." },
    { question: "How are visits scheduled?", answer: "We agree the calendar with you, taking your stays into account. Essential includes one visit a month; Serenity includes two, spread across the month. Arrival preparation or a contractor appointment remains a separate service unless a replacement visit is expressly agreed in the quote. Schedule changes are agreed together." },
    { question: "Are cleaning, gardening and pool care included?", answer: "Your plan covers the agreed visits and routine updates. Cleaning, linen, gardening, pool maintenance and building work are quoted separately. We can arrange these services as part of caring for your home. Professional fees, purchases and any additional coordination charges are presented before you approve them." },
    { question: "How do I arrange care for my home?", answer: "Tell us about your property, its access, when you stay and the care you need. The initial conversation and quote are free. After acceptance, the €120 setup fee including VAT covers the first visit, instructions, property file and key arrangements. We then set the subscription start date and visit schedule in your contract." },
    { question: "How long do I need to commit for?", answer: "The subscription is monthly, with no annual commitment. You can cancel at any time with 30 days’ notice. The final period is charged in proportion to the days covered, under the home-care terms. Statutory withdrawal rights remain applicable. You review these details in the quote and contract before committing." },
    { question: "What happens if you find an issue?", answer: "We share what we have found and discuss the next steps with you. Repairs, purchases and additional services need your approval and remain at your expense. A post-weather visit can be requested as an extra, subject to availability and safe access. Home care does not include permanent on-call cover, remote security monitoring or a guarantee against damage between visits." },
    { question: "How does home care differ from full rental management?", answer: "Home care organises visits while you are away and the services agreed for your own stays. Full management handles the rental activity: listings, reservations, guest messages, arrivals, departures and property coordination. If you manage your own rentals, home care does not include guest arrivals, changeovers or guest assistance." },
  ],
};
