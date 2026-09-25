import type { Locale } from "./pages.ts";
import { escape, t } from "../lib.ts";

export const privateConciergeSlug = "conciergerie-privee-corse";

export function privateConciergeMail(locale: Locale, service = ""): string {
  const audience = t(locale, "voyageur", "guest");
  const subject = t(locale, `Conciergerie privée - ${audience}`, `Private concierge - ${audience}`) + (service ? ` - ${service}` : "");
  const body = t(locale,
    `Bonjour à l’équipe Inastia,\n\nJe souhaite préparer mon séjour en Corse.\n\nNom :\nCommune du logement :\nDates envisagées :\nNombre de personnes :\nServices souhaités : ${service}\nPrécisions sur ma demande :\nBudget indicatif (facultatif) :\n\nBien à vous,`,
    `Hello Inastia team,\n\nI would like to prepare my stay in Corsica.\n\nName:\nProperty location:\nProposed dates:\nNumber of guests:\nServices of interest: ${service}\nDetails of my request:\nIndicative budget (optional):\n\nBest regards,`);
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
    { title: "Linge & ménage de séjour", text: "Des draps et serviettes pour votre location, un changement de linge ou un ménage supplémentaire pendant vos vacances.", details: "À préciser : lits, personnes, surface, dates et prestations déjà incluses." },
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
    { title: "Linen & holiday cleaning", text: "Sheets and towels for your holiday rental, a change of linen or additional cleaning during your stay.", details: "Please share: beds, guests, property size, dates and services already included." },
    { title: "Flowers & thoughtful gifts", text: "A bouquet, a welcome hamper or a gift for a special occasion. The choice, delivery and message are planned around your request.", details: "Please share: occasion, budget, message and delivery time." },
    { title: "Restaurants & activities", text: "A table for dinner, a local discovery or an activity to enjoy together. Tell us what you like so we can explore available options.", details: "Please share: date, participants, preferences and budget." },
    { title: "Holiday rental search", text: "Still looking for your summer home? Share your criteria so we can explore accommodation options and booking arrangements.", details: "Please share: area, dates, bedrooms, amenities and budget." },
    { title: "Private events", text: "A birthday, a family meal or a small surprise gathering. Food, flowers and professional services brought together around a project agreed with you.", details: "Please share: occasion, venue, guests, times and overall budget." },
  ],
};

export const privateFaq: Record<Locale, { question: string; answer: string }[]> = {
  fr: [
    { question: "Les services sont-ils disponibles dès maintenant ?", answer: "Oui, notre offre de conciergerie privée est disponible dès maintenant. Transmettez-nous vos dates et vos envies pour recevoir une proposition personnalisée. Les services, intervenants, disponibilités et tarifs seront confirmés dans votre proposition avant tout engagement. Une demande ne constitue pas une réservation." },
    { question: "Faut-il séjourner dans un logement géré par Inastia ?", answer: "Non. La conciergerie privée s’adresse aux voyageurs en Corse, y compris ceux qui séjournent dans un logement non géré par Inastia. La prise en charge est étudiée selon l’adresse, les accès et, si nécessaire, l’accord de votre hôte ou du gestionnaire." },
    { question: "Et si un service est déjà compris dans ma réservation ?", answer: "La conciergerie privée prépare les prestations supplémentaires de vos vacances. Nous vérifions ce qui est déjà compris dans votre réservation avant de chiffrer un complément, afin de ne pas vous proposer une seconde fois le même service." },
    { question: "Comment demander une prestation et connaître son prix ?", answer: "Choisissez un service dans le catalogue ou présentez-nous plusieurs envies pour votre séjour. Nous étudions votre demande pour établir une proposition sur devis. Le prix de la prestation, les éventuels frais d’organisation ou de déplacement, le professionnel à régler et les conditions d’annulation seront précisés avant votre accord." },
    { question: "Quel secteur couvrez-vous ?", answer: "Notre offre couvre la côte orientale, de Ghisonaccia à Porto-Vecchio, en passant par Ventiseri, Solenzara, Favone, Sainte-Lucie-de-Porto-Vecchio, Pinarello et Lecci. Chaque service sera confirmé selon votre commune, vos dates et les déplacements nécessaires." },
    { question: "Peut-on faire une demande au dernier moment ?", answer: "Nous vous conseillons de nous présenter vos envies dès que vos dates se précisent. Les demandes tardives sont étudiées selon les disponibilités des professionnels. Chaque prestation nécessite une confirmation avant réservation." },
  ],
  en: [
    { question: "Are the services available now?", answer: "Yes, our private concierge services are available now. Share your dates and preferences to receive a personalised proposal. Services, providers, availability and prices will be confirmed in your proposal before any commitment. An enquiry is not a booking." },
    { question: "Do I need to stay in a property managed by Inastia?", answer: "No. Private concierge services are for guests visiting Corsica, including those staying in accommodation not managed by Inastia. We assess the location, access and, where necessary, your host’s or manager’s permission." },
    { question: "What if a service is already included in my booking?", answer: "Private concierge services cover additional arrangements for your holiday. We check what is already included in your booking before quoting for anything extra, so you are not offered the same service twice." },
    { question: "How do I request a service and find out its price?", answer: "Choose a service from the catalogue or share several wishes for your stay. We assess your request and prepare a personalised quote. The service price, any organisation or travel fees, the professional to pay and cancellation terms will be set out before your approval." },
    { question: "Which area do you cover?", answer: "Our services cover the east coast, from Ghisonaccia to Porto-Vecchio, including Ventiseri, Solenzara, Favone, Sainte-Lucie-de-Porto-Vecchio, Pinarello and Lecci. Each service will be confirmed according to your location, dates and the travel involved." },
    { question: "Can I make a last-minute request?", answer: "We recommend sharing your preferences as soon as your dates become clearer. Late requests are considered subject to provider availability. Each service requires confirmation before booking." },
  ],
};
