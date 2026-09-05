import type { Locale } from "./pages.ts";
import { t, type ContactIntent } from "../lib.ts";

export type ServiceSummary = {
  index: 0 | 1 | 2;
  intent: Exclude<ContactIntent, "audit">;
  title: string;
  audience: string;
  delegate: string;
  keep: string;
  cost: string;
  slug: string;
  link: string;
};

/** The same responsibilities and terms are used on the home and service pages. */
export function servicesFor(locale: Locale): ServiceSummary[] {
  return [
    {
      title: t(locale, "Gestion complète", "Full management"),
      audience: t(
        locale,
        "Pour déléguer le suivi de votre location.",
        "For owners who want their rental looked after.",
      ),
      delegate: t(
        locale,
        "Annonce, réservations, échanges voyageurs et coordination sur place.",
        "Listing, bookings, guest communication and local coordination.",
      ),
      keep: t(
        locale,
        "Vos séjours personnels et les décisions qui vous reviennent.",
        "Your own stays and the decisions that remain yours.",
      ),
      cost: t(
        locale,
        "Commission sur les revenus locatifs. Prestations et frais précisés au devis.",
        "Commission on rental income. Services and additional costs specified in the proposal.",
      ),
      index: 0,
      intent: "gestion",
      slug: "gestion-airbnb-corse-du-sud",
      link: t(locale, "Voir la gestion complète", "Explore full management"),
    },
    {
      title: t(
        locale,
        "Lancement et gestion d’annonce",
        "Listing launch and management",
      ),
      audience: t(
        locale,
        "Pour démarrer ou améliorer une annonce existante.",
        "For a new rental or a listing that needs a fresh look.",
      ),
      delegate: t(
        locale,
        "Présentation, prix, calendrier et suivi de l’annonce à convenir.",
        "Presentation, prices, calendar and agreed listing support.",
      ),
      keep: t(
        locale,
        "L’organisation sur place, sauf prestations convenues séparément.",
        "Local arrangements, unless separate services are agreed.",
      ),
      cost: t(
        locale,
        "Périmètre, durée du suivi et coût définis dans la proposition.",
        "Scope, duration of support and cost set out in the proposal.",
      ),
      index: 1,
      intent: "annonce",
      slug: "pack-lancement-airbnb",
      link: t(locale, "Voir le suivi d’annonce", "Explore listing support"),
    },
    {
      title: t(
        locale,
        "Accueil et rotation séjour",
        "Guest welcome and changeovers",
      ),
      audience: t(
        locale,
        "Pour garder les réservations et confier le terrain.",
        "For owners who manage bookings and need local support.",
      ),
      delegate: t(
        locale,
        "Arrivées, départs, ménage, linge et contrôles selon vos besoins.",
        "Arrivals, departures, cleaning, linen and agreed checks.",
      ),
      keep: t(
        locale,
        "La gestion de vos annonces et de vos réservations.",
        "Management of your listings and bookings.",
      ),
      cost: t(
        locale,
        "Selon le logement et les passages. Linge et consommables détaillés au devis.",
        "Based on the home and visits. Linen and supplies detailed in the proposal.",
      ),
      index: 2,
      intent: "rotation",
      slug: "menage-airbnb-corse-du-sud",
      link: t(
        locale,
        "Voir l’accueil et les rotations",
        "Explore guest welcome and changeovers",
      ),
    },
  ];
}
