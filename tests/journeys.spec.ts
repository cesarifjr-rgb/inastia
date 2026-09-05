import { test, expect } from "@playwright/test";

for (const prefix of ["", "/en"]) {
  test(`service and audit CTAs preserve the chosen request ${prefix || "FR"}`, async ({ page }) => {
    for (const [slug, intent] of [
      ["gestion-airbnb-corse-du-sud", "gestion"],
      ["audit-gratuit-potentiel-locatif", "audit"],
    ] as const) {
      await page.goto(`${prefix}/${slug}`);
      await page.locator(".page-hero-copy .button").click();
      await expect(page).toHaveURL(new RegExp(`/contact\\?intent=${intent}$`));
      await expect(page.locator("#contact-intent")).toHaveValue(intent);
    }
    await page.goto(`${prefix}/`);
    await page.locator(".hero-actions .button").click();
    await expect(page.locator("#contact-intent")).toHaveValue("audit");
  });

  test(`contact starts within the mobile screen ${prefix || "FR"}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${prefix}/contact?intent=audit`);
    await page.evaluate(() => document.fonts.ready);
    const bounds = await page.locator("#contact-intent").boundingBox();
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
