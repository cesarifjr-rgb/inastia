import type { Locale } from "./content/pages.ts";
import { arrow, contactPath, t } from "./lib.ts";

export function pricing(locale: Locale): string {
  const included = [
    t(locale, "Création, diffusion et mise à jour des annonces", "Creating, publishing and updating listings"),
    t(locale, "Tarification dynamique, réservations et calendrier", "Dynamic pricing, bookings and availability"),
    t(locale, "Examen des demandes et échanges avec les voyageurs", "Reviewing booking enquiries and handling guest messages"),
    t(locale, "Organisation des arrivées, des départs et des clés", "Arranging arrivals, departures and key access"),
    t(locale, "Assistance voyageurs 24 h/24, 7 j/7", "24/7 guest assistance"),
    t(locale, "Organisation du ménage, du linge et des réassorts", "Arranging cleaning, linen and restocking"),
    t(locale, "Contrôles du logement et organisation de la maintenance", "Property checks and maintenance arrangements"),
    t(locale, "Suivi des cautions et démarches en cas de dommages", "Deposit follow-up and handling damage claims"),
    t(locale, "Suivi de votre bien et échanges avec notre équipe", "Property updates and direct contact with our team"),
  ];
  const stay = [
    t(locale, "Ménage, linge et consommables facturés séparément au locataire, selon le devis", "Cleaning, linen and supplies charged separately to the guest, as quoted"),
    t(locale, "Préparation de la maison pour vos séjours personnels : coût précisé dans votre proposition", "Preparation for your own stays: the cost is specified in your proposal"),
  ];
  const maintenance = [
    t(locale, "Maintenance, réparations et remplacement d’équipements", "Maintenance, repairs and replacement equipment"),
    t(locale, "Travaux et gros entretien du logement", "Building work and major property maintenance"),
    t(locale, "Interventions et achats supplémentaires soumis à votre accord", "Extra work and purchases subject to your approval"),
  ];
  const ownerCosts = [
    t(locale, "Frais des plateformes Airbnb, Booking et autres canaux", "Fees charged by Airbnb, Booking and other platforms"),
    t(locale, "Assurance propriétaire et charges de copropriété", "Owner’s insurance and co-ownership charges"),
    t(locale, "Taxe de séjour et fiscalité du propriétaire", "Tourist tax and the owner’s taxes"),
    t(locale, "Conformité, sécurité et documents nécessaires à la location", "Property compliance, safety and documents needed for letting"),
  ];
  const list = (items: string[]) => `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  return `<section class="pricing-section" id="tarifs" aria-labelledby="pricing-title"><div class="container">
    <div class="pricing-top">
      <div class="pricing-copy"><p class="eyebrow">${t(locale, "COMMENT SONT CALCULÉS LES FRAIS", "HOW THE FEES ARE CALCULATED")}</p>
        <h2 id="pricing-title" class="pricing-rate"><span>20</span><span class="pricing-rate-unit">%<small>${t(locale, "TTC", "incl. VAT")}</small></span></h2>
        <p class="pricing-tagline">${t(locale, "Toute la gestion,<br><em>une seule commission.</em>", "Complete management,<br><em>one commission.</em>")}</p>
        <p class="pricing-basis">${t(locale, "Du montant des nuitées, avant les frais des plateformes. Hors ménage, linge et taxe de séjour.", "Of the accommodation amount, before platform fees. Cleaning, linen and tourist tax are excluded from this calculation.")}</p>
        <p>${t(locale, "Pour 1 000 € de nuitées, les honoraires Inastia représentent 200 € TTC. Le calcul est effectué avant déduction des frais de réservation des plateformes.", "On €1,000 of accommodation, Inastia’s fee is €200 including VAT. It is calculated before platform booking fees are deducted.")}</p>
        <p>${t(locale, "Vous encaissez directement les loyers. Vos honoraires de gestion et les autres prestations sont identifiés séparément, dans votre proposition puis sur vos factures.", "You receive rental income directly. Management fees and other services are itemised separately in your proposal and then on your invoices.")}</p>
        <a class="text-link" href="#detail-tarif">${t(locale, "Voir ce qui est inclus et ce qui ne l’est pas", "See what is included and what is separate")}${arrow}</a>
      </div>
      <div class="pricing-calculator" data-pricing-calculator data-locale="${locale}" aria-labelledby="pricing-example-title">
        <div class="pricing-calculator-bar"><span aria-hidden="true">● ● ●</span><span>INASTIA · ${t(locale, "VOTRE CALCUL", "YOUR CALCULATION")}</span></div>
        <div class="pricing-calculator-body"><h3 id="pricing-example-title" class="eyebrow">${t(locale, "COMPRENDRE LE CALCUL DE VOS FRAIS DE GESTION", "UNDERSTAND HOW YOUR MANAGEMENT FEES ARE CALCULATED")}</h3>
          <div class="pricing-input-row"><label for="pricing-revenue">${t(locale, "Montant des nuitées", "Accommodation amount")}</label><div class="pricing-input"><input id="pricing-revenue" type="number" min="0" max="1000000" step="0.01" value="5000" inputmode="decimal" aria-describedby="pricing-example-note pricing-error" disabled><span>€</span></div></div>
          <div class="pricing-input-row"><label for="pricing-platform-rate">${t(locale, "Frais de plateforme pour cet exemple", "Platform fee for this example")}</label><div class="pricing-input"><input id="pricing-platform-rate" type="number" min="0" max="100" step="0.01" value="17" inputmode="decimal" aria-describedby="pricing-platform-note pricing-error" disabled><span>%</span></div></div>
          <p class="pricing-input-note" id="pricing-platform-note">${t(locale, "17 % est une hypothèse de calcul. Utilisez le taux réellement appliqué à votre réservation.", "17% is an example assumption. Enter the fee that actually applies to your booking.")}</p>
          <div class="pricing-results" aria-live="polite" aria-atomic="true"><dl>
            <div><dt>${t(locale, "Frais de plateforme", "Platform fees")}</dt><dd data-platform-fees>− 850 €</dd></div>
            <div><dt>${t(locale, "Commission Inastia · 20 % TTC", "Inastia commission · 20% incl. VAT")}</dt><dd data-management-fees>− 1 000 €</dd></div>
            <div class="pricing-balance"><dt>${t(locale, "Solde avant autres charges", "Balance before other costs")}</dt><dd data-pricing-balance>3 150 €</dd></div>
          </dl></div>
          <p class="pricing-error" id="pricing-error" data-pricing-error role="status" hidden>${t(locale, "Indiquez un montant entre 0 et 1 000 000 € et un taux entre 0 et 100 %, avec deux décimales au maximum.", "Enter an amount from €0 to €1,000,000 and a rate from 0 to 100%, with no more than two decimal places.")}</p>
          <p class="pricing-example-note" id="pricing-example-note">${t(locale, "Exemple arithmétique, sans estimation de revenus ni garantie de résultat. Ménage, linge, taxe de séjour, entretien, assurances et impôts restent à traiter séparément selon votre situation.", "An arithmetic example, not an income estimate or a guarantee. Cleaning, linen, tourist tax, maintenance, insurance and taxes must be considered separately for your circumstances.")}</p>
          <noscript><p class="pricing-example-note">${t(locale, "Le calcul ci-dessus reste consultable. Activez JavaScript pour modifier les montants.", "The example above remains available. Enable JavaScript to change the amounts.")}</p></noscript>
          <a class="button button-cream" href="${contactPath(locale, "gestion")}">${t(locale, "Demander une proposition de gestion", "Request a management proposal")}${arrow}</a>
        </div>
      </div>
    </div>
    <div class="pricing-detail" id="detail-tarif"><div class="pricing-detail-heading"><p class="eyebrow">${t(locale, "LE DÉTAIL DU TARIF", "THE FEE IN DETAIL")}</p><h3>${t(locale, "Tout est géré.<br><em>Chaque coût est expliqué.</em>", "Everything is managed.<br><em>Every cost is explained.</em>")}</h3><p>${t(locale, "La gestion à 100 % signifie que nous prenons en charge toutes les étapes de votre location. La commission rémunère cette gestion. Le ménage, le linge et les consommables sont facturés au locataire ; les réparations et autres dépenses du logement restent séparées, avec votre accord.", "Complete management means we take care of every stage of your rental. The commission pays for that management. Cleaning, linen and supplies are charged to the guest; repairs and other property expenses are separate and require your approval.")}</p></div>
      <div class="pricing-columns"><article class="pricing-card pricing-card-included"><h4><span aria-hidden="true">✓</span>${t(locale, "Honoraires de gestion", "Management fees")}</h4>${list(included)}<p>${t(locale, "Couverts par la commission de 20 % TTC, facturée au propriétaire.", "Covered by the 20% commission including VAT, invoiced to the owner.")}</p></article><article class="pricing-card"><h4>${t(locale, "Prestations liées au séjour", "Services linked to stays")}</h4>${list(stay)}<p>${t(locale, "Le devis identifie le payeur et le montant de chaque prestation. Ces services s’inscrivent dans la gestion complète ; ils ne sont pas proposés seuls.", "The quote identifies who pays and how much each service costs. These services are part of full management and are not offered on their own.")}</p></article><article class="pricing-card pricing-card-agreed"><h4>${t(locale, "Entretien du logement", "Property maintenance")}</h4>${list(maintenance)}<p>${t(locale, "Dépenses à votre charge, distinctes des honoraires de gestion. Les besoins et les coûts vous sont présentés pour décision.", "Costs borne by you, separate from management fees. We present the work needed and its cost so you can decide.")}</p></article><article class="pricing-card"><h4>${t(locale, "Obligations du propriétaire", "Owner’s responsibilities")}</h4>${list(ownerCosts)}<p>${t(locale, "Ces frais et obligations sont à traiter séparément selon votre logement et votre situation.", "These costs and responsibilities must be addressed separately according to your property and circumstances.")}</p></article></div>
    </div>
  </div></section>`;
}
