import type { Locale } from "./pages.ts";
import { escape, t } from "../lib.ts";

export const partnersSlug = "partenaires";
export type PartnerProfile = "general" | "immobilier" | "prestataire" | "recommandation";

export function partnerMail(locale: Locale, profile: PartnerProfile = "general"): string {
  const subjects = {
    general: t(locale, "présentation professionnelle", "professional introduction"),
    immobilier: t(locale, "immobilier", "property professionals"),
    prestataire: t(locale, "prestations", "home services"),
    recommandation: t(locale, "mise en relation", "homeowner introduction"),
  };
  const intentions = {
    general: "",
    immobilier: t(locale, "Proposer à mes clients un relais pour la gestion locative ou l’intendance.", "Offer my clients a local team for rental management or second-home care."),
    prestataire: t(locale, "Proposer mes prestations pour les maisons suivies par Inastia.", "Offer my services for the homes looked after by Inastia."),
    recommandation: t(locale, "Comprendre le cadre applicable avant de présenter un propriétaire.", "Understand the agreed terms before introducing a homeowner."),
  };
  const subject = `${t(locale, "Partenariat Inastia", "Partnering with Inastia")} — ${subjects[profile]}`;
  const body = t(locale,
    `Bonjour à l’équipe Inastia,\n\nJe souhaite échanger sur une possibilité de collaboration.\n\nNom et structure, le cas échéant :\nActivité :\nSecteur géographique concerné (communes d’intervention ou des projets) :\nCollaboration envisagée : ${intentions[profile]}\n\nBien à vous,`,
    `Hello Inastia team,\n\nI would like to discuss a possible collaboration.\n\nName and business, if applicable:\nActivity:\nRelevant area (towns covered or where the projects are located):\nProposed collaboration: ${intentions[profile]}\n\nBest regards,`);
  return escape(`mailto:contact@inastia.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
}

export const partnerProfiles: Record<Locale, { id: PartnerProfile; title: string; label: string; text: string; next: string; detail: string; action: string; detailAnchor: string; detailLink: string }[]> = {
  fr: [
    {
      id: "immobilier",
      title: "Un relais pour les projets de vos clients.",
      label: "Agences & professionnels de l’immobilier",
      text: "Après une acquisition ou au fil de votre accompagnement, un propriétaire peut avoir besoin de faire gérer sa location ou de faire suivre sa résidence secondaire.",
      next: "Vous pouvez lui présenter Inastia pour ces besoins. Avant toute mise en relation, échangeons sur les services concernés et le rôle de chacun.",
      detail: "Inastia prend ensuite en charge les échanges commerciaux, la proposition et l’éventuelle signature. Les modalités de présentation sont à convenir ensemble.",
      action: "Échanger sur un relais pour mes clients",
      detailAnchor: "inastia-concretement",
      detailLink: "Voir les prestations à recommander",
    },
    {
      id: "prestataire",
      title: "Vos prestations. Votre secteur d’intervention.",
      label: "Artisans & prestataires de la maison",
      text: "Piscine, jardin, dépannage, ménage ou linge : dites-nous ce que vous prenez en charge et dans quelles communes vous intervenez.",
      next: "Le premier échange permet d’examiner la correspondance entre votre activité et les besoins des maisons suivies par Inastia. Les conditions d’une intervention sont à convenir avant de commencer.",
      detail: "Une prise de contact ne vaut pas commande et ne garantit pas de missions.",
      action: "Présenter mes prestations",
      detailAnchor: "conditions-prestations",
      detailLink: "Comprendre le cadre des prestations",
    },
    {
      id: "recommandation",
      title: "Un premier échange avant la mise en relation.",
      label: "Professionnels en contact avec des propriétaires",
      text: "Vous connaissez un propriétaire qui cherche à déléguer la gestion de sa maison ? Commencez par nous présenter votre activité et le type de besoin rencontré, sans communiquer ses coordonnées.",
      next: "Nous pourrons ainsi préciser le cadre de la mise en relation. Il n’est pas nécessaire de vous définir comme apporteur pour ouvrir la discussion.",
      detail: "Une éventuelle rémunération se convient par écrit avant la mise en relation. Le seul envoi d’un contact ne crée pas de droit à rémunération.",
      action: "Échanger avant une mise en relation",
      detailAnchor: "conditions-recommandation",
      detailLink: "Lire les conditions de rémunération",
    },
  ],
  en: [
    {
      id: "immobilier",
      title: "A local team for your clients’ plans.",
      label: "Estate agents & property professionals",
      text: "After a purchase or during your ongoing work, an owner may need someone to manage their rental or look after their second home.",
      next: "You can introduce Inastia for these needs. Before making an introduction, let’s discuss the services involved and everyone’s role.",
      detail: "Inastia then handles the commercial discussions, proposal and any eventual contract. We agree how to make the introduction together.",
      action: "Discuss support for my clients",
      detailAnchor: "inastia-concretement",
      detailLink: "Explore the services to recommend",
    },
    {
      id: "prestataire",
      title: "Your services. The area you cover.",
      label: "Tradespeople & home service providers",
      text: "Pool care, gardens, repairs, cleaning or linen: tell us what you offer and which towns you cover.",
      next: "Our first conversation helps us see how your expertise fits the needs of the homes Inastia looks after. The terms of any work are agreed before it begins.",
      detail: "Getting in touch is not a work order and does not guarantee assignments.",
      action: "Present my services",
      detailAnchor: "conditions-prestations",
      detailLink: "Understand the terms for services",
    },
    {
      id: "recommandation",
      title: "A conversation before an introduction.",
      label: "Professionals who know homeowners",
      text: "Know an owner who wants to hand over their property management? Start by telling us about your work and the need you have encountered, without sharing their contact details.",
      next: "We can then agree how an introduction would work. You do not need to call yourself a professional introducer to start the conversation.",
      detail: "Any referral fee must be agreed in writing before the introduction. Sending a contact does not in itself create an entitlement to payment.",
      action: "Talk before making an introduction",
      detailAnchor: "conditions-recommandation",
      detailLink: "Read the referral fee conditions",
    },
  ],
};

export const partnerFaq: Record<Locale, { id: string; question: string; answer: string }[]> = {
  fr: [
    {
      id: "role-partenaire",
      question: "Qui échange avec le propriétaire après une mise en relation ?",
      answer: "Inastia prend en charge les échanges commerciaux, la proposition et l’éventuelle signature. Votre rôle dans cette démarche est la mise en relation ; son cadre est précisé avant de transmettre le contact. Nous convenons ensemble des modalités de présentation et des informations à partager avec vous, avec l’accord des personnes concernées.",
    },
    {
      id: "conditions-recommandation",
      question: "Une recommandation peut-elle être rémunérée ?",
      answer: "Une rémunération éventuelle doit être convenue par écrit avant la mise en relation. Pour un apport en gestion complète, elle dépend de la signature effective d’un contrat par le propriétaire présenté et des conditions convenues. Transmettre un contact ne crée pas, à lui seul, un droit à rémunération. Ces modalités ne sont pas automatiquement applicables à l’intendance.",
    },
    {
      id: "conditions-prestations",
      question: "Comment les conditions d’une prestation sont-elles définies ?",
      answer: "Le périmètre, les tarifs, les disponibilités et les modalités d’intervention sont convenus avant la collaboration. Présentez d’abord votre métier et votre secteur pour examiner les besoins auxquels vous pourriez répondre. Les modalités de validation, de facturation et de paiement sont à préciser ensemble avant toute intervention. Aucun volume de missions n’est garanti.",
    },
    {
      id: "secteur-partenaire",
      question: "Toutes les maisons du secteur peuvent-elles être prises en charge ?",
      answer: "L’adresse et les accès doivent être examinés avant de confirmer l’organisation possible. Le seul nom d’une commune ne suffit pas à confirmer une prise en charge. Notre secteur s’étend de Ghisonaccia à Porto-Vecchio. Vous pouvez être installé ailleurs et nous présenter un projet dans ce secteur : indiquez les communes des projets ou de vos interventions, pas seulement l’adresse de votre entreprise.",
    },
    {
      id: "residence-non-louee",
      question: "Puis-je vous contacter pour une maison qui n’est pas louée ?",
      answer: "Oui. L’intendance s’adresse aussi aux propriétaires qui utilisent leur résidence secondaire pour leurs propres séjours. La maison n’a pas besoin d’être proposée à la location. Les visites, les prestations complémentaires et leurs conditions sont détaillées dans notre offre d’intendance.",
    },
  ],
  en: [
    {
      id: "role-partenaire",
      question: "Who speaks with the owner after an introduction?",
      answer: "Inastia handles the commercial discussions, proposal and any eventual contract. Your role is the introduction; we agree its terms before any contact details are shared. Together, we discuss how to make the introduction and which information to share with you, with the permission of those involved.",
    },
    {
      id: "conditions-recommandation",
      question: "Can a recommendation be paid?",
      answer: "Any referral fee must be agreed in writing before the introduction. For full management referrals, it depends on the introduced owner actually signing a contract and on the agreed terms. Sharing a contact does not in itself create an entitlement to payment. These arrangements do not automatically apply to second-home care.",
    },
    {
      id: "conditions-prestations",
      question: "How are the terms of service work agreed?",
      answer: "Scope, rates, availability and working arrangements are agreed before a collaboration begins. Start by telling us about your expertise and service area so we can consider relevant needs. Approval, invoicing and payment arrangements must be discussed together before any work starts. No volume of assignments is guaranteed.",
    },
    {
      id: "secteur-partenaire",
      question: "Can you look after every property in your area?",
      answer: "We need to review the address and access before confirming possible arrangements. A town name alone does not confirm that we can take a property on. Our area runs from Ghisonaccia to Porto-Vecchio. Your own business can be based elsewhere: tell us where the projects are located or where you work, not just your business address.",
    },
    {
      id: "residence-non-louee",
      question: "Can I contact you about a home that is not rented out?",
      answer: "Yes. Second-home care is also for owners who use their property for their own stays. The home does not have to be offered as a rental. Our home care page explains the scheduled visits, additional services and their terms.",
    },
  ],
};
