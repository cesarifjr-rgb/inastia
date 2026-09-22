import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const locale of ["fr", "en"] as const) {
  const prefix = locale === "fr" ? "" : "/en";
  const route = `${prefix}/gestion-airbnb-corse-du-sud`;

  test(`management services keep summaries visible and expand independently by keyboard ${locale}`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(route);
    const services = page.locator(".management-service");
    await expect(services).toHaveCount(7);
    await expect(page.locator(".management-service[open]")).toHaveCount(0);
    await expect(services.nth(2).locator("summary")).toContainText(
      locale === "fr" ? "facturés séparément aux voyageurs" : "charged separately to guests",
    );
    for (const service of await services.all()) {
      const summary = service.locator("summary");
      await expect(summary).toBeVisible();
      await expect(service.locator(".management-service-content")).toBeHidden();
      await summary.focus();
      await summary.press("Enter");
      await expect(service.locator(".management-service-content")).toBeVisible();
    }
    await expect(page.locator(".management-service[open]")).toHaveCount(7);
    await services.first().locator("summary").focus();
    await services.first().locator("summary").press("Space");
    await expect(services.first().locator(".management-service-content")).toBeHidden();
    await expect(page.locator(".management-service[open]")).toHaveCount(6);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const report = await new AxeBuilder({ page }).include(".management-services")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(report.violations).toEqual([]);
  });

  test(`management service details remain usable without JavaScript ${locale}`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const page = await context.newPage();
    try {
      await page.goto(route);
      const cleaning = page.locator("#section-3");
      await expect(cleaning.locator(".management-service-content")).toBeHidden();
      await cleaning.locator("summary").click();
      await expect(cleaning.locator(".management-service-content")).toBeVisible();
      await expect(cleaning.locator("li")).toHaveCount(3);
      await cleaning.locator("summary").click();
      await expect(cleaning.locator(".management-service-content")).toBeHidden();
    } finally {
      await context.close();
    }
  });

  test(`existing management links open the relevant service ${locale}`, async ({ page }) => {
    await page.goto(`${route}#section-6`);
    await expect(page.locator("#section-6 .management-service-content")).toBeVisible();
    await expect(page.locator(".management-service[open]")).toHaveCount(1);
    await page.goto(`${route}#section-3`);
    await expect(page.locator("#section-3 .management-service-content")).toBeVisible();
    await page.goto(`${prefix}/`);
    await page.locator(".home-service-summary a").click();
    await expect(page).toHaveURL(new RegExp(`${route}#section-1$`));
    await expect(page.locator("#section-1 .management-service-content")).toBeVisible();
    await page.locator(".management-services-intro a").click();
    await expect(page).toHaveURL(/#tarifs$/);
    await expect(page.locator("#pricing-title")).toBeInViewport();
  });
}
