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
    detail: { fr: "Contrôle visuel jusqu’à 30 minutes et compte rendu photo, ajouté à une tournée programmée.", en: "A visual check of up to 30 minutes and a photo report, added to a scheduled round." },
    unit: { fr: "le passage", en: "per visit" },
  },
  {
    id: "meteo", price: 79,
    name: { fr: "Passage après intempéries", en: "Post-weather visit" },
    detail: { fr: "Sur demande, contrôle visuel jusqu’à 30 minutes et photos. Selon disponibilité, dès que les accès permettent un passage en sécurité.", en: "On request, a visual check of up to 30 minutes with photos. Subject to availability and safe access conditions." },
    unit: { fr: "le passage", en: "per visit" },
  },
  {
    id: "ouverture", price: 95,
    name: { fr: "Préparation avant votre arrivée", en: "Preparation before your arrival" },
    detail: { fr: "Jusqu’à une heure : aération, mise en température et vérifications d’usage selon vos consignes. Ménage, linge et achats en supplément sur devis.", en: "Up to one hour: airing, setting the temperature and routine checks following your instructions. Cleaning, linen and purchases are quoted separately." },
    unit: { fr: "la préparation", en: "per preparation" },
  },
  {
    id: "fermeture", price: 95,
    name: { fr: "Fermeture après votre départ", en: "Closing after your stay" },
    detail: { fr: "Jusqu’à une heure : vérification des ouvrants, réglages usuels selon vos consignes et compte rendu. Hors ménage et hivernage technique.", en: "Up to one hour: checking doors and windows, routine settings following your instructions and a report. Excludes cleaning and technical winterisation." },
    unit: { fr: "la fermeture", en: "per closing visit" },
  },
  {
    id: "rendezvous", price: 75,
    name: { fr: "Présence pour un artisan ou une livraison", en: "Meeting a contractor or a delivery" },
    detail: { fr: "Déplacement et 45 minutes sur place, sur rendez-vous. Au-delà : 30 € TTC par demi-heure supplémentaire, avec votre accord. Hors prestation de l’artisan.", en: "Travel and 45 minutes on site, by appointment. Additional time: €30 including VAT per extra half-hour, with your approval. Contractor charges are separate." },
    unit: { fr: "le rendez-vous", en: "per appointment" },
  },
  {
    id: "coordination", price: 60,
    name: { fr: "Coordination spécifique à distance", en: "Additional remote coordination" },
    detail: { fr: "Organisation d’interventions, échanges avec les prestataires ou suivi particulier demandé. Décompte par tranches de 15 minutes à 15 € TTC, validé avant intervention.", en: "Arranging work, liaising with contractors or handling a specific request. Billed in 15-minute increments at €15 including VAT, agreed before work starts." },
    unit: { fr: "l’heure", en: "per hour" },
  },
];

export const intendanceFaq: Record<Locale, { question: string; answer: string }[]> = {
  fr: [
    { question: "Ma maison doit-elle être en location ?", answer: "Non. L’intendance s’adresse aux propriétaires qui souhaitent un relais local pour leur résidence secondaire, même sans la louer. Si vous louez par vous-même, les visites d’intendance restent distinctes de l’accueil, du ménage entre voyageurs et de l’assistance locative. Pour déléguer les locations, découvrez notre gestion complète." },
    { question: "Que comprend une visite ?", answer: "Un passage de contrôle visuel jusqu’à 30 minutes dans les espaces accessibles : ouvrants, traces d’humidité ou de fuite apparentes, points d’eau et compteurs accessibles, aération et relève du courrier. Les vérifications sont adaptées aux consignes du logement. Vous recevez un compte rendu photo après chaque passage. Il ne s’agit pas d’un diagnostic technique ni d’une prestation de sécurité privée." },
    { question: "Quels logements bénéficient des tarifs affichés ?", answer: "Les forfaits concernent un logement jusqu’à 150 m², dans un seul bâtiment, avec accès routier standard, sur notre secteur de Ghisonaccia à Porto-Vecchio. Les déplacements des visites programmées y sont inclus. Pour une grande propriété, des dépendances, un accès isolé ou un secteur hors tournée, une proposition précise le périmètre et tout supplément avant engagement." },
    { question: "Comment l’abonnement commence-t-il et s’arrête-t-il ?", answer: "Le premier échange et le devis sont gratuits. Après acceptation, la mise en place à 120 € TTC comprend la visite initiale, le relevé des consignes, le dossier du bien et l’organisation des clés. L’abonnement est facturé mensuellement et résiliable à tout moment avec un préavis de 30 jours, sans engagement annuel. Les modalités figurent dans les conditions particulières d’intendance et votre contrat. Les droits légaux de rétractation restent applicables." },
    { question: "Les visites ont-elles lieu à date fixe ?", answer: "Nous convenons ensemble du calendrier. Essentielle prévoit un passage par mois ; Sérénité prévoit deux passages répartis dans le mois. Une préparation d’arrivée ou un rendez-vous avec un artisan constitue une prestation distincte, sauf remplacement expressément prévu au devis. Toute modification du planning se convient avec vous." },
    { question: "Que se passe-t-il si vous constatez un problème ?", answer: "Nous vous signalons l’anomalie constatée, avec les éléments utiles pour décider. Les achats, réparations et prestations supplémentaires nécessitent votre accord et restent à votre charge. Les passages après intempéries sont proposés en supplément selon disponibilité et conditions d’accès. L’intendance ne comprend pas d’astreinte permanente, de télésurveillance ni de garantie d’absence de sinistre." },
    { question: "Pouvez-vous organiser le ménage, le jardin ou la piscine ?", answer: "Oui, dans le cadre de l’intendance de votre maison. Les prestations de ménage, de linge, de jardin, de piscine et les travaux font l’objet de devis distincts. Les frais de coordination spécifiques sont également précisés avant votre accord. La visite visuelle de la maison ne comprend pas l’entretien technique de ces équipements." },
  ],
  en: [
    { question: "Does my home have to be rented out?", answer: "No. Home care is for second-home owners who want a local point of contact, even if they never rent out their property. If you manage your own rentals, home-care visits remain separate from guest arrivals, changeover cleaning and rental assistance. Explore our full management service to delegate your rentals." },
    { question: "What does a visit include?", answer: "A visual visit of up to 30 minutes in accessible areas: doors and windows, visible signs of damp or leaks, accessible water points and meters, airing and collecting mail. Checks follow your property’s instructions. You receive a photo report after every visit. This is not a technical inspection or a private security service." },
    { question: "Which properties qualify for the listed prices?", answer: "Plans cover one home of up to 150 m² in a single building, with standard road access, in our service area from Ghisonaccia to Porto-Vecchio. Travel for scheduled visits is included. Larger properties, outbuildings, isolated access or locations outside our rounds receive a proposal setting out the scope and any additional charges before you commit." },
    { question: "How does the subscription start and end?", answer: "The initial conversation and quote are free. After acceptance, the €120 setup fee including VAT covers the initial visit, instructions, property file and key arrangements. The subscription is billed monthly and can be cancelled at any time with 30 days’ notice, with no annual commitment. Details are set out in the home-care terms and your contract. Statutory withdrawal rights remain applicable." },
    { question: "Are visits on fixed dates?", answer: "We agree the schedule together. Essential provides one visit each month; Serenity provides two visits spread across the month. Arrival preparation or a contractor appointment is a separate service unless a replacement visit is expressly agreed in the quote. Schedule changes are agreed with you." },
    { question: "What happens if you find a problem?", answer: "We report any issue found and give you the information needed to decide. Purchases, repairs and additional services require your approval and remain at your expense. Post-weather visits are available as an extra, subject to availability and safe access. Home care does not include permanent on-call cover, remote security monitoring or a guarantee against damage." },
    { question: "Can you arrange cleaning, gardening or pool care?", answer: "Yes, as part of caring for your home. Cleaning, linen, gardening, pool care and building work are quoted separately. Any specific coordination charges are also agreed beforehand. Visual home checks do not include technical maintenance of these facilities." },
  ],
};
