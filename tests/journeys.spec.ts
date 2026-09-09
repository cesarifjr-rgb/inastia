import { test, expect } from "@playwright/test";

for (const prefix of ["", "/en"]) {
  test(`all primary CTAs open a management request ${prefix || "FR"}`, async ({ page }) => {
    const label = prefix ? "Have my property managed" : "Confier la gestion de mon bien";
    for (const slug of [
      "gestion-airbnb-corse-du-sud",
      "audit-gratuit-potentiel-locatif",
      "about",
      "conciergerie-ghisonaccia",
      "conciergerie-location-saisonniere-solenzara",
      "conciergerie-airbnb-zonza-pinarello",
      "conciergerie-airbnb-lecci-saint-cyprien",
      "conciergerie-airbnb-porto-vecchio",
      "",
    ] as const) {
      await page.goto(`${prefix}/${slug}`);
      const buttons = page.locator('a.button[href*="/contact?intent="]');
      expect(await buttons.count()).toBeGreaterThan(2);
      for (const button of await buttons.all()) {
        await expect(button).toHaveText(label);
        await expect(button).toHaveAttribute("href", `${prefix}/contact?intent=gestion`);
      }
      await page.locator(slug ? ".page-hero-copy .button" : ".hero-actions .button").click();
      await expect(page).toHaveURL(new RegExp(`/contact\\?intent=gestion$`));
      await expect(page.locator("#contact-intent")).toHaveValue("gestion");
      await expect(page.locator("#submit-contact-label")).toHaveText(label);
    }
  });

  test(`mobile menu CTA opens a management request ${prefix || "FR"}`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${prefix}/`);
    await page.locator(".menu-toggle").click();
    await page.locator("#mobile-menu .button").click();
    await expect(page).toHaveURL(new RegExp(`/contact\\?intent=gestion$`));
    await expect(page.locator("#contact-intent")).toHaveValue("gestion");
  });

  test(`contact starts within the mobile screen ${prefix || "FR"}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${prefix}/contact?intent=audit`);
    await page.evaluate(() => document.fonts.ready);
    const bounds = await page.locator("#propertyType").boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.y).toBeLessThanOrEqual(600);
    expect(await page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(await page.evaluate(() => document.documentElement.clientWidth));
  });
}

test("review excerpts retain attribution and their original language", async ({ page }) => {
  await page.goto("/");
  const reviews = page.locator(".review-card");
  await expect(reviews).toHaveCount(3);
  await expect(page.locator(".reviews-note")).toContainText("avis de voyageurs");
  for (const review of await reviews.all()) {
    await expect(review.locator("footer strong")).toHaveText(/\S+/);
    await expect(review.locator(".review-quote")).toHaveAttribute("lang", /^(fr|en)$/);
    expect(await review.getAttribute("cite")).toBe(await review.locator("footer a").getAttribute("href"));
  }
});
