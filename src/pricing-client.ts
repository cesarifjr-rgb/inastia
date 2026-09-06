export function initPricing(): void {
  const calculator = document.querySelector<HTMLElement>("[data-pricing-calculator]");
  if (!calculator) return;
  const revenue = calculator.querySelector<HTMLInputElement>("#pricing-revenue");
  const platformRate = calculator.querySelector<HTMLInputElement>("#pricing-platform-rate");
  const platformFees = calculator.querySelector<HTMLElement>("[data-platform-fees]");
  const managementFees = calculator.querySelector<HTMLElement>("[data-management-fees]");
  const balance = calculator.querySelector<HTMLElement>("[data-pricing-balance]");
  const error = calculator.querySelector<HTMLElement>("[data-pricing-error]");
  if (!revenue || !platformRate || !platformFees || !managementFees || !balance || !error) return;
  const currency = new Intl.NumberFormat(calculator.dataset.locale === "en" ? "en-GB" : "fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });
  const update = (): void => {
    const valid = revenue.value !== "" && platformRate.value !== "" && revenue.validity.valid && platformRate.validity.valid;
    revenue.setAttribute("aria-invalid", String(revenue.value === "" || !revenue.validity.valid));
    platformRate.setAttribute("aria-invalid", String(platformRate.value === "" || !platformRate.validity.valid));
    error.hidden = valid;
    if (!valid) {
      platformFees.textContent = managementFees.textContent = balance.textContent = "—";
      return;
    }
    const amountCents = Math.round(revenue.valueAsNumber * 100);
    const platformBasisPoints = Math.round(platformRate.valueAsNumber * 100);
    const platformCents = Math.round(amountCents * platformBasisPoints / 10000);
    const managementCents = Math.round(amountCents * 20 / 100);
    platformFees.textContent = `− ${currency.format(platformCents / 100)}`;
    managementFees.textContent = `− ${currency.format(managementCents / 100)}`;
    balance.textContent = currency.format((amountCents - platformCents - managementCents) / 100);
  };
  revenue.disabled = false;
  platformRate.disabled = false;
  revenue.addEventListener("input", update);
  platformRate.addEventListener("input", update);
  update();
}
