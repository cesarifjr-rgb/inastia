import type { Locale } from "./pages.ts";

export const partnersSlug = "partenaires";

export const partnerProfiles: Record<Locale, { title: string; label: string; text: string; detail: string; action: string }[]> = {
  fr: [
    {
      title: "Vous connaissez les propriétaires.",
      label: "Agences & professionnels de l’immobilier",
      text: "Après une acquisition ou au fil de votre accompagnement, vos clients cherchent une équipe pour leur maison en Corse. Présentez-leur Inastia pour la gestion de leur location ou l’intendance de leur résidence secondaire.",
      detail: "Un relais local pour la suite de leur projet.",
      action: "Échanger sur vos clients",
    },
    {
      title: "Vous prenez soin des maisons.",
      label: "Artisans & services de la maison",
      text: "Entretien des piscines, jardins, dépannage, ménage ou linge : votre savoir-faire compte dans la vie d’une maison. Présentez-nous votre métier, votre secteur et vos disponibilités pour étudier une collaboration.",
      detail: "Des interventions définies et organisées ensemble.",
      action: "Présenter votre savoir-faire",
    },
    {
      title: "Vous faites les bonnes rencontres.",
      label: "Professionnels de la mise en relation",
      text: "Vous connaissez un propriétaire qui souhaite déléguer sa gestion ? Avec son accord, vous nous mettez en relation. Nous prenons ensuite en charge les échanges, la proposition et la signature éventuelle.",
      detail: "Vous créez le lien. Nous accompagnons le projet.",
      action: "Parler de mise en relation",
    },
  ],
  en: [
    {
      title: "You know the homeowners.",
      label: "Estate agents & property professionals",
      text: "After a purchase or during your ongoing work, your clients may need a team to care for their home in Corsica. Introduce them to Inastia for full holiday rental management or second-home care.",
      detail: "A local team for the next chapter of their plans.",
      action: "Discuss your clients’ needs",
    },
    {
      title: "You care for the homes.",
      label: "Tradespeople & home services",
      text: "Pool care, gardening, repairs, cleaning or linen: your expertise plays a part in keeping a home running well. Tell us about your work, service area and availability so we can explore working together.",
      detail: "Work with a scope and schedule agreed together.",
      action: "Tell us about your expertise",
    },
    {
      title: "You make the connections.",
      label: "Professional introducers",
      text: "Know an owner who wants to hand over their rental management? With their permission, introduce us. We then handle the conversations, proposal and any eventual contract.",
      detail: "You make the introduction. We take it from there.",
      action: "Discuss introductions",
    },
  ],
};

export const partnerFaq: Record<Locale, { question: string; answer: string }[]> = {
  fr: [
    {
      question: "Avec quels professionnels souhaitez-vous échanger ?",
      answer: "Agences immobilières, professionnels en relation avec des propriétaires, artisans et prestataires de la maison : nous étudions les collaborations en lien avec notre gestion locative et notre intendance. Votre activité, votre secteur et vos disponibilités nous permettent de voir comment travailler ensemble.",
    },
    {
      question: "Comment vous présenter un propriétaire ?",
      answer: "Commencez par échanger avec nous pour convenir du cadre. Avant toute transmission de coordonnées, assurez-vous que le propriétaire accepte d’être contacté par Inastia. Votre rôle se limite à la mise en relation ; notre équipe assure ensuite les échanges commerciaux, la proposition et la signature éventuelle.",
    },
    {
      question: "Une mise en relation peut-elle être rémunérée ?",
      answer: "Une rémunération éventuelle se convient par écrit avant la mise en relation. Pour un apport en gestion complète, elle est conditionnée à la signature effective d’un contrat par le propriétaire présenté, selon les conditions convenues. Le premier échange permet de préciser ce cadre ; l’envoi d’un contact ne crée pas à lui seul un droit à rémunération.",
    },
    {
      question: "Sur quel secteur peut-on travailler ensemble ?",
      answer: "Notre activité se situe sur la côte orientale de la Corse, de Ghisonaccia à Porto-Vecchio, notamment autour de Ventiseri, Solenzara, Sainte-Lucie de Porto-Vecchio, Pinarello et Lecci. Pour chaque besoin, nous vérifions l’adresse, les accès et les disponibilités avant de confirmer une prise en charge ou une intervention.",
    },
    {
      question: "Comment sont organisées les prestations ?",
      answer: "Nous échangeons d’abord sur votre métier et notre besoin. Le périmètre, les tarifs, les disponibilités et les modalités d’intervention sont convenus avant chaque collaboration. Une prise de contact ne vaut pas commande et aucun volume d’interventions n’est garanti.",
    },
  ],
  en: [
    {
      question: "Which professionals would you like to hear from?",
      answer: "Estate agents, professionals who work with homeowners, tradespeople and home service providers: we consider collaborations connected to our rental management and second-home care. Your expertise, service area and availability help us explore how we might work together.",
    },
    {
      question: "How do I introduce a homeowner?",
      answer: "Speak with us first to agree how the introduction will work. Before sharing any contact details, make sure the owner agrees to be contacted by Inastia. Your role is limited to the introduction; our team then handles the commercial discussions, proposal and any eventual contract.",
    },
    {
      question: "Can an introduction be paid?",
      answer: "Any referral fee must be agreed in writing before the introduction. For a full management referral, payment depends on the introduced owner actually signing a contract, under the agreed terms. Our first conversation is the opportunity to discuss those terms; sending a contact does not in itself create an entitlement to payment.",
    },
    {
      question: "Where can we work together?",
      answer: "We work along Corsica’s east coast, from Ghisonaccia to Porto-Vecchio, including Ventiseri, Solenzara, Sainte-Lucie de Porto-Vecchio, Pinarello and Lecci. We check the address, access and availability for each enquiry before confirming any service or visit.",
    },
    {
      question: "How is service work arranged?",
      answer: "We begin by discussing your expertise and our requirements. Scope, rates, availability and working arrangements are agreed before each collaboration. Getting in touch is not a work order and no volume of assignments is guaranteed.",
    },
  ],
};
