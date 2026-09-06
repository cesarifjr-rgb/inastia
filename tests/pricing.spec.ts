import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function expectAmounts(page: Page, amounts: [string, string, string]) {
  const results = page.locator(".pricing-results dd");
  await expect(results).toHaveCount(3);
  for (const [index, amount] of amounts.entries()) {
    await expect(results.nth(index)).toHaveText(amount);
  }
}

for (const locale of ["fr", "en"] as const) {
  const prefix = locale === "en" ? "/en" : "";

  test(`20% commission uses accommodation before platform fees (${locale})`, async ({ page }) => {
    await page.goto(`${prefix}/`);
    const revenue = page.locator("#pricing-revenue");
    const rate = page.locator("#pricing-platform-rate");
    await expect(revenue).toBeEnabled();
    await expect(revenue).toHaveValue("5500");
    await expect(rate).toHaveValue("17");
    await expectAmounts(page, locale === "fr"
      ? ["− 935,00 €", "− 1 100,00 €", "3 465,00 €"]
      : ["− €935.00", "− €1,100.00", "€3,465.00"]);
    await expect(page.locator(".pricing-basis")).toContainText(locale === "fr"
      ? "avant les frais des plateformes"
      : "before platform fees");
    await rate.fill("10");
    await expectAmounts(page, locale === "fr"
      ? ["− 550,00 €", "− 1 100,00 €", "3 850,00 €"]
      : ["− €550.00", "− €1,100.00", "€3,850.00"]);
  });

  test(`edited amounts preserve cent rounding and local currency formatting (${locale})`, async ({ page }) => {
    await page.goto(`${prefix}/gestion-airbnb-corse-du-sud`);
    const revenue = page.locator("#pricing-revenue");
    const rate = page.locator("#pricing-platform-rate");
    await expect(revenue).toBeEnabled();
    await revenue.fill("1234.56");
    await rate.fill("17.33");
    await expectAmounts(page, locale === "fr"
      ? ["− 213,95 €", "− 246,91 €", "773,70 €"]
      : ["− €213.95", "− €246.91", "€773.70"]);
    await revenue.fill("50");
    await expectAmounts(page, locale === "fr"
      ? ["− 8,67 €", "− 10,00 €", "31,33 €"]
      : ["− €8.67", "− €10.00", "€31.33"]);
    // A half-cent platform fee rounds to a cent; the balance reconciles with both displayed fees.
    await revenue.fill("10.05");
    await rate.fill("10");
    await expectAmounts(page, locale === "fr"
      ? ["− 1,01 €", "− 2,01 €", "7,03 €"]
      : ["− €1.01", "− €2.01", "€7.03"]);
  });
}

test("invalid or incomplete inputs clear the previous result and recover when corrected", async ({ page }) => {
  await page.goto("/");
  const revenue = page.locator("#pricing-revenue");
  const rate = page.locator("#pricing-platform-rate");
  const error = page.locator("[data-pricing-error]");
  await expect(revenue).toBeEnabled();

  for (const [field, value] of [
    [revenue, ""],
    [revenue, "-0.01"],
    [revenue, "1000000.01"],
    [revenue, "0.001"],
    [rate, ""],
    [rate, "-0.01"],
    [rate, "100.01"],
    [rate, "17.001"],
  ] as const) {
    await field.fill(value);
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expect(error).toBeVisible();
    await expectAmounts(page, ["—", "—", "—"]);
    await revenue.fill("100");
    await rate.fill("10");
    await expect(error).toBeHidden();
    await expect(revenue).toHaveAttribute("aria-invalid", "false");
    await expect(rate).toHaveAttribute("aria-invalid", "false");
    await expectAmounts(page, ["− 10,00 €", "− 20,00 €", "70,00 €"]);
  }
});

test("zero and permitted upper bounds remain valid, including a negative balance", async ({ page }) => {
  await page.goto("/en/");
  const revenue = page.locator("#pricing-revenue");
  const rate = page.locator("#pricing-platform-rate");
  await expect(revenue).toBeEnabled();
  await revenue.fill("0");
  await rate.fill("0");
  await expectAmounts(page, ["− €0.00", "− €0.00", "€0.00"]);
  await revenue.fill("1000000");
  await expectAmounts(page, ["− €0.00", "− €200,000.00", "€800,000.00"]);
  await rate.fill("100");
  await expectAmounts(page, ["− €1,000,000.00", "− €200,000.00", "-€200,000.00"]);
  await expect(page.locator("[data-pricing-error]")).toBeHidden();
});

test("without JavaScript the fixed example, explanation and management link remain available", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    for (const prefix of ["", "/en"]) {
      for (const route of ["/", "/gestion-airbnb-corse-du-sud"]) {
        await page.goto(`${prefix}${route}`);
        const calculator = page.locator("[data-pricing-calculator]");
        await expect(calculator).toHaveCount(1);
        await expect(calculator).toBeVisible();
        await expect(page.locator("#pricing-revenue")).toBeDisabled();
        await expect(page.locator("#pricing-platform-rate")).toBeDisabled();
        await expectAmounts(page, ["− 935 €", "− 1 100 €", "3 465 €"]);
        await expect(calculator.locator("noscript p")).toBeVisible();
        await expect(calculator.locator("noscript p")).toContainText(prefix
          ? "Enable JavaScript to change the amounts."
          : "Activez JavaScript pour modifier les montants.");
        await expect(calculator.locator("a.button")).toHaveAttribute("href", `${prefix}/contact?intent=gestion`);
      }
    }
  } finally {
    await context.close();
  }
});

test("home and service pricing are accessible on mobile and the keyboard CTA selects management", async ({ page }) => {
  test.setTimeout(60_000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("requestfailed", request => {
    if (!request.failure()?.errorText.includes("net::ERR_ABORTED")) {
      errors.push(`${request.url()}: ${request.failure()?.errorText}`);
    }
  });
  page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`); });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const prefix of ["", "/en"]) {
    for (const route of ["/", "/gestion-airbnb-corse-du-sud"]) {
      await page.goto(`${prefix}${route}`);
      const calculator = page.locator("[data-pricing-calculator]");
      await expect(calculator).toHaveCount(1);
      const revenue = calculator.getByLabel(prefix ? "Accommodation amount" : "Montant des nuitées", { exact: true });
      const rate = calculator.getByLabel(prefix ? "Platform fee for this example" : "Frais de plateforme pour cet exemple", { exact: true });
      await expect(revenue).toBeEnabled();
      await calculator.scrollIntoViewIfNeeded();
      await page.evaluate(() => document.fonts.ready);
      const bounds = await page.locator("#tarifs input, #tarifs a, #tarifs dt, #tarifs dd").evaluateAll(elements =>
        elements.map(element => ({ left: element.getBoundingClientRect().left, right: element.getBoundingClientRect().right })),
      );
      for (const bound of bounds) {
        expect(bound.left).toBeGreaterThanOrEqual(-1);
        expect(bound.right).toBeLessThanOrEqual(321);
      }
      const accessibility = await new AxeBuilder({ page }).include("#tarifs").analyze();
      expect(accessibility.violations).toEqual([]);
      await revenue.focus();
      await page.keyboard.press("Tab");
      await expect(rate).toBeFocused();
      await expect(rate).toHaveCSS("outline-style", "solid");
      await page.keyboard.press("Tab");
      const cta = calculator.getByRole("link", { name: prefix ? "Discuss the costs for your property" : "Parlons des frais de votre bien" });
      await expect(cta).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(new RegExp(`${prefix}/contact\\?intent=gestion$`));
      await expect(page.locator("#contact-intent")).toHaveValue("gestion");
    }
  }
  expect(errors).toEqual([]);
});
