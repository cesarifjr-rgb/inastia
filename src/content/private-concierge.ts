import type { Locale } from "./pages.ts";
import { escape, t } from "../lib.ts";

export const privateConciergeSlug = "conciergerie-privee-corse";

export function privateConciergeMail(locale: Locale, owner: boolean | null, service = ""): string {
  const audience = owner === null ? t(locale, "demande de prestation", "service enquiry") : owner ? t(locale, "propriétaire", "homeowner") : t(locale, "voyageur", "guest");
  const subject = t(locale, `Conciergerie privée 2027 - ${audience}`, `Private concierge 2027 - ${audience}`) + (service ? ` - ${service}` : "");
  const body = t(locale,
    `Bonjour à l’équipe Inastia,\n\nJe souhaite préparer ${owner ? "mes séjours dans ma résidence" : "mon séjour"} en Corse pour 2027.\n\nNom :\nProfil : ${owner === null ? "propriétaire / voyageur" : audience}\nCommune du logement :\nDates envisagées :\nNombre de personnes :\nServices souhaités : ${service}\nPrécisions sur ma demande :\nBudget indicatif (facultatif) :\n\nBien à vous,`,
    `Hello Inastia team,\n\nI would like to prepare ${owner ? "my visits to my home" : "my stay"} in Corsica for 2027.\n\nName:\nProfile: ${owner === null ? "homeowner / guest" : audience}\nProperty location:\nProposed dates:\nNumber of guests:\nServices of interest: ${service}\nDetails of my request:\nIndicative budget (optional):\n\nBest regards,`);
  return escape(`mailto:contact@inastia.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
}

export const privateServices: Record<Locale, { title: string; text: string; details: string }[]> = {
  fr: [
    { title: "Chef à domicile", text: "Un dîner dans votre villa, un brunch en famille ou des repas préparés pour plusieurs jours. Une demande construite autour de votre table et de vos envies.", details: "À préciser : date, nombre de convives, type de repas et budget." },
    { title: "Courses & petits-déjeuners", text: "Les premières courses à l’arrivée, du pain et des viennoiseries pour le matin, ou une livraison pendant le séjour. De quoi profiter de la maison dès les premiers instants.", details: "À préciser : liste souhaitée, adresse, créneau et substitutions acceptées." },
    { title: "Baby-sitting", text: "Une soirée à deux, un déjeuner entre amis ou un besoin de garde pendant les vacances. Une solution à étudier avec un professionnel adapté à l’âge des enfants.", details: "À préciser : nombre et âge des enfants, horaires et lieu de garde." },
    { title: "Matériel de puériculture", text: "Lit bébé, chaise haute, poussette ou autre équipement utile. Préparons les besoins des plus petits avec un loueur professionnel.", details: "À préciser : matériel, âge et poids utiles, dates et livraison." },
    { title: "Massages, yoga & coaching", text: "Un massage bien-être à la maison, un cours de yoga ou une séance de sport privée. Un moment pour vous, seul ou à plusieurs.", details: "À préciser : activité, durée, participants et espace disponible." },
    { title: "Location de bateau", text: "Une demi-journée sur l’eau ou une sortie à la journée, avec ou sans skipper selon votre projet. Les possibilités seront étudiées avec un opérateur nautique.", details: "À préciser : date, port souhaité, groupe, skipper et budget." },
    { title: "Voiture & transferts", text: "Un véhicule pour explorer la région, un transfert depuis l’aéroport ou un trajet avec chauffeur. Des solutions à envisager avec les professionnels du transport et de la location.", details: "À préciser : trajets, horaires, passagers, bagages et sièges enfants." },
    { title: "Linge & ménage de séjour", text: "Des draps et serviettes pour votre maison, un changement de linge ou un ménage supplémentaire pendant vos vacances.", details: "À préciser : lits, personnes, surface, dates et prestations déjà incluses." },
    { title: "Fleurs & attentions", text: "Un bouquet, un panier d’accueil ou une attention pour une occasion particulière. Le choix, la livraison et le message se préparent selon votre demande.", details: "À préciser : occasion, budget, message et moment de livraison." },
    { title: "Restaurants & activités", text: "Une table pour le soir, une découverte locale ou une activité à partager. Faites-nous part de vos goûts pour étudier les options disponibles.", details: "À préciser : date, participants, envies et budget." },
    { title: "Recherche de location de vacances", text: "Vous cherchez encore votre maison pour l’été ? Présentez-nous vos critères pour étudier les possibilités d’hébergement et les conditions de réservation.", details: "À préciser : secteur, dates, chambres, équipements et budget." },
    { title: "Événements privés", text: "Un anniversaire, un repas de famille ou une surprise en petit comité. Repas, fleurs et intervenants se réunissent autour d’un projet défini avec vous.", details: "À préciser : occasion, lieu, invités, horaires et budget global." },
  ],
  en: [
    { title: "Private chef", text: "Dinner in your villa, a family brunch or meals prepared for several days. Arrangements shaped around your table and preferences.", details: "Please share: date, number of diners, type of meal and budget." },
    { title: "Groceries & breakfast", text: "First groceries for your arrival, bread and pastries for the morning, or a delivery during your stay. Practical touches to help you settle in.", details: "Please share: shopping list, address, delivery time and allowed substitutions." },
    { title: "Babysitting", text: "An evening as a couple, lunch with friends or childcare during your holiday. Options to explore with a professional suited to the children’s ages.", details: "Please share: number and ages of children, hours and childcare location." },
    { title: "Baby equipment hire", text: "A cot, high chair, pushchair or other useful equipment. Let’s plan what your youngest guests need with a professional rental provider.", details: "Please share: equipment, relevant age and weight, dates and delivery needs." },
    { title: "Massage, yoga & fitness", text: "A relaxation massage at home, a yoga class or a private fitness session. Time for yourself, on your own or with others.", details: "Please share: activity, duration, participants and available space." },
    { title: "Boat hire", text: "A half-day on the water or a full-day outing, with or without a skipper depending on your plans. Options will be explored with a boating professional.", details: "Please share: date, preferred port, group size, skipper needs and budget." },
    { title: "Car hire & transfers", text: "A car to explore the region, an airport transfer or a journey with a driver. Options to consider with transport and rental professionals.", details: "Please share: routes, times, passengers, luggage and child seat needs." },
    { title: "Linen & holiday cleaning", text: "Sheets and towels for your home, a change of linen or additional cleaning during your holiday.", details: "Please share: beds, guests, property size, dates and services already included." },
    { title: "Flowers & thoughtful gifts", text: "A bouquet, a welcome hamper or a gift for a special occasion. The choice, delivery and message are planned around your request.", details: "Please share: occasion, budget, message and delivery time." },
    { title: "Restaurants & activities", text: "A table for dinner, a local discovery or an activity to enjoy together. Tell us what you like so we can explore available options.", details: "Please share: date, participants, preferences and budget." },
    { title: "Holiday rental search", text: "Still looking for your summer home? Share your criteria so we can explore accommodation options and booking arrangements.", details: "Please share: area, dates, bedrooms, amenities and budget." },
    { title: "Private events", text: "A birthday, a family meal or a small surprise gathering. Food, flowers and professional services brought together around a project agreed with you.", details: "Please share: occasion, venue, guests, times and overall budget." },
  ],
};

export const privateFaq: Record<Locale, { question: string; answer: string }[]> = {
  fr: [
    { question: "Quand ces services seront-ils disponibles ?", answer: "Nous préparons l’offre de conciergerie privée pour la saison 2027. Vous pouvez déjà nous transmettre vos dates et vos envies. Les services, intervenants, disponibilités et tarifs seront confirmés dans votre proposition avant tout engagement. Une demande ne constitue pas une réservation." },
    { question: "Faut-il être propriétaire ou séjourner dans une maison Inastia ?", answer: "Deux accompagnements sont prévus : l’un pour les propriétaires et leurs séjours personnels, l’autre pour les voyageurs. Vous pouvez présenter votre demande même si le logement n’est pas géré par Inastia. La prise en charge sera étudiée selon l’adresse, les accès et, si nécessaire, l’accord du propriétaire ou du gestionnaire." },
    { question: "Quelle différence avec l’intendance et la gestion locative ?", answer: "L’intendance suit la maison pendant vos absences. La gestion complète organise son activité locative et comprend déjà l’assistance liée au logement. La conciergerie privée prépare vos besoins personnels et les services supplémentaires de votre séjour. Nous vérifions ce qui est déjà prévu dans votre contrat avant de chiffrer un complément." },
    { question: "Comment demander une prestation et connaître son prix ?", answer: "Choisissez un service dans le catalogue ou présentez-nous plusieurs envies pour votre séjour. Nous étudierons votre demande pour établir une proposition sur devis. Le prix de la prestation, les éventuels frais d’organisation ou de déplacement, le professionnel à régler et les conditions d’annulation seront précisés avant votre accord." },
    { question: "Quel secteur sera couvert ?", answer: "Notre projet se concentre sur la côte orientale, de Ghisonaccia à Porto-Vecchio, en passant par Ventiseri, Solenzara, Favone, Sainte-Lucie-de-Porto-Vecchio, Pinarello et Lecci. Chaque service sera confirmé selon votre commune, vos dates et les déplacements nécessaires." },
    { question: "Les demandes pourront-elles être faites au dernier moment ?", answer: "Nous vous conseillons de nous présenter vos envies dès que vos dates se précisent. Les demandes tardives seront étudiées selon les possibilités. Cette nouvelle offre ne comporte pas de promesse de disponibilité permanente ni de réservation garantie." },
  ],
  en: [
    { question: "When will these services be available?", answer: "We are preparing our private concierge offering for the 2027 season. You can already share your dates and preferences. Services, providers, availability and prices will be confirmed in your proposal before any commitment. An enquiry is not a booking." },
    { question: "Do I need to own a home or stay in an Inastia property?", answer: "We are planning two services: one for homeowners and their personal visits, and another for guests. You may enquire even if Inastia does not manage the property. We will assess the location, access and, where necessary, the owner’s or manager’s permission." },
    { question: "How does this differ from home care and rental management?", answer: "Home care looks after your property while you are away. Full rental management handles rental operations and already includes assistance relating to the accommodation. Private concierge support focuses on personal arrangements and additional services during your stay. We check your existing contract before quoting any extra." },
    { question: "How do I request a service and find out its price?", answer: "Choose a service from the catalogue or share several wishes for your stay. We will assess your request and prepare a personalised quote. The service price, any organisation or travel fees, the professional to pay and cancellation terms will be set out before your approval." },
    { question: "Which area will be covered?", answer: "Our plans focus on the east coast, from Ghisonaccia to Porto-Vecchio, including Ventiseri, Solenzara, Favone, Sainte-Lucie-de-Porto-Vecchio, Pinarello and Lecci. Each service will be confirmed according to your location, dates and the travel involved." },
    { question: "Will last-minute requests be possible?", answer: "We recommend sharing your preferences as soon as your dates become clearer. Late requests will be considered subject to availability. This new service does not promise round-the-clock availability or guaranteed bookings." },
  ],
};
