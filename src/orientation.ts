import type { Locale } from "./content/pages.ts";
import { contactPath, escape, path, t, type ContactIntent } from "./lib.ts";

export type DelegationNeed = "large" | "listing" | "local" | "unsure";
export type DelegationRecommendation = {
  intent: ContactIntent;
  slug: string;
};

const recommendations: Record<DelegationNeed, DelegationRecommendation> = {
  large: { intent: "gestion", slug: "gestion-airbnb-corse-du-sud" },
  listing: { intent: "annonce", slug: "pack-lancement-airbnb" },
  local: { intent: "rotation", slug: "menage-airbnb-corse-du-sud" },
  unsure: { intent: "audit", slug: "audit-gratuit-potentiel-locatif" },
};

/** A declared need suggests an offer; it never establishes price or eligibility. */
export function recommendationFor(
  need: unknown,
): DelegationRecommendation | null {
  if (typeof need !== "string" || !Object.hasOwn(recommendations, need))
    return null;
  return { ...recommendations[need as DelegationNeed] };
}

let guideSequence = 0;

export function delegationGuide(locale: Locale): string {
  const groupName = `orientation-${locale}-${++guideSequence}`;
  const choices: {
    need: DelegationNeed;
    label: string;
    title: string;
    reason: string;
  }[] = [
    {
      need: "large",
      label: t(
        locale,
        "Déléguer le suivi de la location",
        "Hand over the day-to-day rental management",
      ),
      title: t(locale, "Gestion complète", "Full management"),
      reason: t(
        locale,
        "Vous souhaitez confier l’annonce, les réservations et la coordination sur place. Vos séjours personnels et les décisions qui vous reviennent restent entre vos mains.",
        "You want help with the listing, bookings and local coordination. You keep your personal stays and the decisions that remain yours.",
      ),
    },
    {
      need: "listing",
      label: t(
        locale,
        "Créer ou améliorer mon annonce",
        "Create or improve my listing",
      ),
      title: t(
        locale,
        "Lancement et gestion d’annonce",
        "Listing launch and management",
      ),
      reason: t(
        locale,
        "Votre priorité porte sur la présentation, les prix et le calendrier de l’annonce, nouvelle ou déjà publiée. L’organisation sur place reste à prévoir, sauf prestations convenues séparément.",
        "Your priority is the presentation, pricing and calendar of a new or existing listing. Local arrangements remain yours unless separate services are agreed.",
      ),
    },
    {
      need: "local",
      label: t(
        locale,
        "Garder les réservations et confier le terrain",
        "Keep managing bookings and delegate local work",
      ),
      title: t(
        locale,
        "Accueil et rotation séjour",
        "Guest welcome and changeovers",
      ),
      reason: t(
        locale,
        "Vous conservez l’annonce et les réservations. Vous cherchez un relais pour les arrivées, le ménage, le linge et les contrôles, selon les besoins convenus.",
        "You keep managing the listing and bookings. You need local support with arrivals, cleaning, linen and checks, according to agreed needs.",
      ),
    },
    {
      need: "unsure",
      label: t(
        locale,
        "Faire le point avant de choisir",
        "Review my needs before choosing",
      ),
      title: t(locale, "Premier audit gratuit", "Free initial property review"),
      reason: t(
        locale,
        "Un premier échange qualitatif par appel ou email permet d’identifier les priorités et l’accompagnement utile, même sans annonce existante. Il ne constitue pas une prévision de revenus.",
        "An initial qualitative review by phone or email helps identify priorities and useful support, even without an existing listing. It is not a rental income forecast.",
      ),
    },
  ];
  return `<div class="orientation">
    <p>${t(locale, "Vous pouvez comparer les trois accompagnements sans répondre au guide.", "You can compare all three services without using the guide.")} <a href="#comparaison">${t(locale, "Voir le comparatif", "See the comparison")}</a></p>
    <details class="orientation-toggle" data-orientation-guide hidden>
      <summary>${t(locale, "Aidez-moi à choisir", "Help me choose")}</summary>
      <fieldset class="orientation-options"><legend>${t(locale, "Que souhaitez-vous confier en priorité ?", "What would you like to delegate first?")}</legend>
        ${choices.map((choice) => `<label class="orientation-choice"><input type="radio" name="${groupName}" value="${choice.need}" data-orientation-choice><span class="orientation-choice-text">${escape(choice.label)}</span></label>`).join("")}
      </fieldset>
      <div role="status" aria-live="polite" aria-atomic="true">
        <p data-orientation-neutral>${t(locale, "Choisissez un besoin pour afficher une piste d’accompagnement.", "Choose a need to see a suggested service.")}</p>
        ${choices
          .map((choice) => {
            const recommendation = recommendationFor(choice.need)!;
            return `<div class="orientation-result" data-orientation-result="${choice.need}" hidden><h3>${escape(choice.title)}</h3><p class="orientation-reason">${escape(choice.reason)}</p><p>${t(locale, "Cette orientation est indicative. Le périmètre, les conditions et les prestations possibles à votre adresse sont à confirmer ensemble.", "This suggestion is a guide. The scope, terms and services available at your address must be confirmed together.")}</p><a href="${path(locale, recommendation.slug)}">${t(locale, "Découvrir cet accompagnement", "Explore this service")}</a><a href="${contactPath(locale, recommendation.intent)}">${choice.need === "unsure" ? t(locale, "Demander mon audit gratuit", "Request my free review") : t(locale, "Parler de ce besoin", "Discuss this need")}</a></div>`;
          })
          .join("")}
      </div>
      <button type="button" data-orientation-reset>${t(locale, "Effacer mon choix", "Clear my choice")}</button>
    </details>
  </div>`;
}
