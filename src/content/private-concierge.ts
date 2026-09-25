import type { Locale } from "./pages.ts";
import { escape, t } from "../lib.ts";

export const privateConciergeSlug = "conciergerie-privee-corse";

export function privateConciergeMail(locale: Locale, owner: boolean): string {
  const subject = t(locale, `Conciergerie privée 2027 - ${owner ? "propriétaire" : "voyageur"}`, `Private concierge 2027 - ${owner ? "homeowner" : "guest"}`);
  const body = t(locale,
    `Bonjour à l’équipe Inastia,\n\nJe souhaite préparer ${owner ? "mes séjours dans ma résidence" : "mon séjour"} en Corse pour 2027.\n\nNom :\nCommune du logement :\nDates envisagées :\nNombre de personnes :\nServices souhaités :\nBudget indicatif (facultatif) :\n\nBien à vous,`,
    `Hello Inastia team,\n\nI would like to prepare ${owner ? "my visits to my home" : "my stay"} in Corsica for 2027.\n\nName:\nProperty location:\nProposed dates:\nNumber of guests:\nServices of interest:\nIndicative budget (optional):\n\nBest regards,`);
  return escape(`mailto:contact@inastia.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
}

export const privateServices: Record<Locale, { title: string; text: string }[]> = {
  fr: [
    { title: "Une arrivée préparée", text: "Préparation de la maison, linge, ménage et premières courses : les attentions utiles pour vous installer et commencer votre séjour." },
    { title: "Les saveurs, chez vous", text: "Un dîner avec un chef à domicile, un repas livré ou une table à découvrir. Dites-nous vos envies et le nombre de convives." },
    { title: "Du temps pour soi", text: "Un massage bien-être, une séance de yoga ou un moment de détente à la maison, selon les intervenants et les créneaux disponibles." },
    { title: "La Corse au fil de l’eau", text: "Une sortie en bateau ou une journée avec skipper : un projet à étudier avec un professionnel, selon la météo, les départs et votre groupe." },
    { title: "Les trajets et la famille", text: "Un transfert avec chauffeur, du matériel pour les enfants ou un besoin de garde : précisez les horaires et les besoins pour étudier une solution adaptée." },
    { title: "Les moments à partager", text: "Un anniversaire, des fleurs ou un repas en petit comité. Nous préparons avec vous les détails souhaités, dans le respect du lieu qui vous accueille." },
  ],
  en: [
    { title: "A thoughtful arrival", text: "Preparing the home, linen, cleaning and first groceries: practical touches to help you settle in and start your stay." },
    { title: "Good food, at home", text: "Dinner with a private chef, a delivered meal or a restaurant to discover. Tell us what you have in mind and how many people will join you." },
    { title: "Time for yourself", text: "A relaxation massage, a yoga session or a quiet moment at home, subject to practitioners and appointments being available." },
    { title: "Corsica from the water", text: "A boat outing or a day with a skipper: a plan to explore with a professional, depending on weather, departure points and your group." },
    { title: "Travel and family", text: "A transfer with a professional driver, equipment for children or childcare: share your times and needs so that suitable options can be explored." },
    { title: "Moments to share", text: "A birthday, flowers or a small gathering around a meal. We discuss the details with you, respecting the rules of the property hosting you." },
  ],
};

export const privateFaq: Record<Locale, { question: string; answer: string }[]> = {
  fr: [
    { question: "Quand ces services seront-ils disponibles ?", answer: "Nous préparons l’offre de conciergerie privée pour la saison 2027. Vous pouvez déjà nous transmettre vos dates et vos envies. Les services, intervenants, disponibilités et tarifs seront confirmés dans votre proposition avant tout engagement. Une demande ne constitue pas une réservation." },
    { question: "Faut-il être propriétaire ou séjourner dans une maison Inastia ?", answer: "Deux accompagnements sont prévus : l’un pour les propriétaires et leurs séjours personnels, l’autre pour les voyageurs. Vous pouvez présenter votre demande même si le logement n’est pas géré par Inastia. La prise en charge sera étudiée selon l’adresse, les accès et, si nécessaire, l’accord du propriétaire ou du gestionnaire." },
    { question: "Quelle différence avec l’intendance et la gestion locative ?", answer: "L’intendance suit la maison pendant vos absences. La gestion complète organise son activité locative et comprend déjà l’assistance liée au logement. La conciergerie privée prépare vos besoins personnels et les services supplémentaires de votre séjour. Nous vérifions ce qui est déjà prévu dans votre contrat avant de chiffrer un complément." },
    { question: "Comment seront calculés les tarifs ?", answer: "Votre proposition distinguera les honoraires d’organisation, les éventuels déplacements et le prix des achats ou prestations extérieures. Le contenu, les montants et les modalités de règlement et d’annulation seront précisés avant votre accord. Aucun tarif de prestataire ni disponibilité ne sont garantis à ce stade." },
    { question: "Quel secteur sera couvert ?", answer: "Notre projet se concentre sur la côte orientale, de Ghisonaccia à Porto-Vecchio, en passant par Ventiseri, Solenzara, Favone, Sainte-Lucie-de-Porto-Vecchio, Pinarello et Lecci. Chaque service sera confirmé selon votre commune, vos dates et les déplacements nécessaires." },
    { question: "Les demandes pourront-elles être faites au dernier moment ?", answer: "Nous vous conseillons de nous présenter vos envies dès que vos dates se précisent. Les demandes tardives seront étudiées selon les possibilités. Cette nouvelle offre ne comporte pas de promesse de disponibilité permanente ni de réservation garantie." },
  ],
  en: [
    { question: "When will these services be available?", answer: "We are preparing our private concierge offering for the 2027 season. You can already share your dates and preferences. Services, providers, availability and prices will be confirmed in your proposal before any commitment. An enquiry is not a booking." },
    { question: "Do I need to own a home or stay in an Inastia property?", answer: "We are planning two services: one for homeowners and their personal visits, and another for guests. You may enquire even if Inastia does not manage the property. We will assess the location, access and, where necessary, the owner’s or manager’s permission." },
    { question: "How does this differ from home care and rental management?", answer: "Home care looks after your property while you are away. Full rental management handles rental operations and already includes assistance relating to the accommodation. Private concierge support focuses on personal arrangements and additional services during your stay. We check your existing contract before quoting any extra." },
    { question: "How will prices be calculated?", answer: "Your proposal will distinguish organisation fees, any travel charges and the cost of purchases or external services. Scope, prices, payment and cancellation terms will be set out before your approval. Provider prices and availability are not guaranteed at this stage." },
    { question: "Which area will be covered?", answer: "Our plans focus on the east coast, from Ghisonaccia to Porto-Vecchio, including Ventiseri, Solenzara, Favone, Sainte-Lucie-de-Porto-Vecchio, Pinarello and Lecci. Each service will be confirmed according to your location, dates and the travel involved." },
    { question: "Will last-minute requests be possible?", answer: "We recommend sharing your preferences as soon as your dates become clearer. Late requests will be considered subject to availability. This new service does not promise round-the-clock availability or guaranteed bookings." },
  ],
};
