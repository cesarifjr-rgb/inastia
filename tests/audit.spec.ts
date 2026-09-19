import { test, expect } from "@playwright/test";

for (const locale of ["fr", "en"] as const) {
  const prefix = locale === "fr" ? "" : "/en";
  test(`${locale}: audit calls to action preserve the exploratory request`, async ({ page }) => {
    await page.goto(`${prefix}/audit-gratuit-potentiel-locatif`);
    const label = locale === "fr" ? "Demander mon audit gratuit" : "Request my free review";
    const links = page.locator('a.button[href*="/contact?intent="]');
    expect(await links.count()).toBeGreaterThan(2);
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute("href", `${prefix}/contact?intent=audit`);
      await expect(link).toHaveText(label);
    }
    await page.locator(".page-hero-copy .button").click();
    await expect(page.locator("#contact-intent")).toHaveValue("audit");
    await expect(page.locator("#submit-contact-label")).toHaveText(label);
    await expect(page.locator(".header-cta")).toHaveText(label);
    await expect(page.locator(".header-cta")).toHaveAttribute("href", "#contact-form");
    await expect(page.locator("#contact-lead")).toContainText(locale === "fr" ? "sans vous engager" : "without committing");
    await expect(page.locator("#phone")).toBeVisible();
    await expect(page.locator("#phone")).toHaveAttribute("required", "");
    await expect(page.locator("#contact-preference-field")).toBeHidden();
    await expect(page.locator("#marketingPhone")).not.toBeChecked();
    await page.locator(".language-link").click();
    await expect(page).toHaveURL(/contact\?intent=audit$/);
    await expect(page.locator("#contact-intent")).toHaveValue("audit");
  });
}
