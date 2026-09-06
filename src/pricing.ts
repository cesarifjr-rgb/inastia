import type { Locale } from "./content/pages.ts";
import { arrow, contactPath, t } from "./lib.ts";

export function pricing(locale: Locale): string {
  const included = [
    t(locale, "Création et mise à jour de votre annonce", "Creating and updating your listing"),
    t(locale, "Suivi du calendrier et des prix dans le cadre convenu", "Calendar and pricing support within the agreed scope"),
    t(locale, "Informations voyageurs et organisation des arrivées et départs", "Guest information and arrival and departure arrangements"),
    t(locale, "Coordination du ménage et du linge entre les séjours", "Coordinating cleaning and linen between stays"),
    t(locale, "Contrôles prévus et signalement des anomalies", "Agreed checks and reporting of issues"),
    t(locale, "Suivi de votre bien et échanges avec notre équipe", "Property updates and direct contact with our team"),
  ];
  const separate = [
    t(locale, "Frais des plateformes Airbnb, Booking et autres canaux", "Fees charged by Airbnb, Booking and other platforms"),
    t(locale, "Prestations de ménage, linge et consommables selon le devis (payées par le locataire)", "Cleaning, linen and supplies as quoted (paid by the guest)"),
    t(locale, "Maintenance, réparations et remplacement d’équipements", "Maintenance, repairs and replacement equipment"),
    t(locale, "Travaux et gros entretien du logement", "Building work and major property maintenance"),
    t(locale, "Assurance propriétaire et charges de copropriété", "Owner’s insurance and co-ownership charges"),
    t(locale, "Taxe de séjour et fiscalité du propriétaire", "Tourist tax and the owner’s taxes"),
  ];
  const agreed = [
    t(locale, "Préparation de la maison pour vos séjours personnels", "Preparing your home for your own stays"),
    t(locale, "Interventions et achats supplémentaires que vous autorisez", "Additional work and purchases you approve"),
    t(locale, "Besoins particuliers liés à votre logement", "Requirements specific to your property"),
  ];
  const list = (items: string[]) => `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  return `<section class="pricing-section" id="tarifs" aria-labelledby="pricing-title"><div class="container">
    <div class="pricing-top">
      <div class="pricing-copy"><p class="eyebrow">${t(locale, "LE TARIF, EN TOUTE CLARTÉ", "CLEAR, STRAIGHTFORWARD PRICING")}</p>
        <h2 id="pricing-title" class="pricing-rate"><span>20</span><span class="pricing-rate-unit">%<small>${t(locale, "TTC", "incl. VAT")}</small></span></h2>
        <p class="pricing-tagline">${t(locale, "Vos nuitées.<br><em>Notre accompagnement.</em>", "Your bookings.<br><em>Our care.</em>")}</p>
        <p class="pricing-basis">${t(locale, "Du montant des nuitées, avant les frais des plateformes. Hors ménage, linge et taxe de séjour.", "Of the accommodation amount, before platform fees. Cleaning, linen and tourist tax are excluded from this calculation.")}</p>
        <p>${t(locale, "Une commission pour le suivi de votre location. Vous encaissez directement les loyers ; notre rémunération et les frais convenus sont détaillés séparément.", "One commission for looking after your rental. You receive rental income directly; our fee and any agreed costs are detailed separately.")}</p>
        <a class="text-link" href="#detail-tarif">${t(locale, "Voir ce qui est inclus et ce qui ne l’est pas", "See what is included and what is separate")}${arrow}</a>
      </div>
      <div class="pricing-calculator" data-pricing-calculator data-locale="${locale}" aria-labelledby="pricing-example-title">
        <div class="pricing-calculator-bar"><span aria-hidden="true">● ● ●</span><span>INASTIA · ${t(locale, "VOTRE CALCUL", "YOUR CALCULATION")}</span></div>
        <div class="pricing-calculator-body"><h3 id="pricing-example-title" class="eyebrow">${t(locale, "UN EXEMPLE, À AJUSTER", "AN EXAMPLE YOU CAN ADJUST")}</h3>
          <div class="pricing-input-row"><label for="pricing-revenue">${t(locale, "Montant des nuitées", "Accommodation amount")}</label><div class="pricing-input"><input id="pricing-revenue" type="number" min="0" max="1000000" step="0.01" value="5500" inputmode="decimal" aria-describedby="pricing-example-note pricing-error" disabled><span>€</span></div></div>
          <div class="pricing-input-row"><label for="pricing-platform-rate">${t(locale, "Frais de plateforme pour cet exemple", "Platform fee for this example")}</label><div class="pricing-input"><input id="pricing-platform-rate" type="number" min="0" max="100" step="0.01" value="17" inputmode="decimal" aria-describedby="pricing-platform-note pricing-error" disabled><span>%</span></div></div>
          <p class="pricing-input-note" id="pricing-platform-note">${t(locale, "17 % est une hypothèse de calcul. Utilisez le taux réellement appliqué à votre réservation.", "17% is an example assumption. Enter the fee that actually applies to your booking.")}</p>
          <div class="pricing-results" aria-live="polite" aria-atomic="true"><dl>
            <div><dt>${t(locale, "Frais de plateforme", "Platform fees")}</dt><dd data-platform-fees>− 935 €</dd></div>
            <div><dt>${t(locale, "Commission Inastia · 20 % TTC", "Inastia commission · 20% incl. VAT")}</dt><dd data-management-fees>− 1 100 €</dd></div>
            <div class="pricing-balance"><dt>${t(locale, "Solde avant autres charges", "Balance before other costs")}</dt><dd data-pricing-balance>3 465 €</dd></div>
          </dl></div>
          <p class="pricing-error" id="pricing-error" data-pricing-error role="status" hidden>${t(locale, "Indiquez un montant entre 0 et 1 000 000 € et un taux entre 0 et 100 %, avec deux décimales au maximum.", "Enter an amount from €0 to €1,000,000 and a rate from 0 to 100%, with no more than two decimal places.")}</p>
          <p class="pricing-example-note" id="pricing-example-note">${t(locale, "Exemple arithmétique, sans estimation de revenus ni garantie de résultat. Ménage, linge, taxe de séjour, entretien, assurances et impôts restent à traiter séparément selon votre situation.", "An arithmetic example, not an income estimate or a guarantee. Cleaning, linen, tourist tax, maintenance, insurance and taxes must be considered separately for your circumstances.")}</p>
          <noscript><p class="pricing-example-note">${t(locale, "Le calcul ci-dessus reste consultable. Activez JavaScript pour modifier les montants.", "The example above remains available. Enable JavaScript to change the amounts.")}</p></noscript>
          <a class="button button-cream" href="${contactPath(locale, "gestion")}">${t(locale, "Parlons des frais de votre bien", "Discuss the costs for your property")}${arrow}</a>
        </div>
      </div>
    </div>
    <div class="pricing-detail" id="detail-tarif"><div class="pricing-detail-heading"><p class="eyebrow">${t(locale, "LE DÉTAIL DU TARIF", "THE FEE IN DETAIL")}</p><h3>${t(locale, "Ce qui est inclus.<br><em>Ce qui ne l’est pas.</em>", "What is included.<br><em>What is separate.</em>")}</h3><p>${t(locale, "La commission rémunère notre accompagnement. Les dépenses liées au logement et les prestations facturées à part restent identifiées dans votre devis.", "The commission pays for our support. Property expenses and services billed separately are identified in your proposal.")}</p></div>
      <div class="pricing-columns"><article class="pricing-card pricing-card-included"><h4><span aria-hidden="true">✓</span>${t(locale, "Dans les 20 % TTC", "Within the 20% fee")}</h4>${list(included)}</article><article class="pricing-card"><h4><span aria-hidden="true">×</span>${t(locale, "Frais séparés", "Separate costs")}</h4>${list(separate)}</article><article class="pricing-card pricing-card-agreed"><h4><span aria-hidden="true">+</span>${t(locale, "Selon vos besoins", "As you need it")}</h4>${list(agreed)}<p>${t(locale, "Dans le cadre de la gestion complète, avec votre accord et un coût précisé avant intervention. Ces services ne sont pas proposés seuls.", "As part of full management, with your approval and the cost agreed before work begins. These services are not offered on their own.")}</p></article></div>
    </div>
  </div></section>`;
}
