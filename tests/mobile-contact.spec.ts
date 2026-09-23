import { test, expect } from "@playwright/test";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:4100");
test.skip(!["localhost", "127.0.0.1", "[::1]"].includes(base.hostname), "Use local pages and intercepted providers.");
test.use({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });

test.beforeEach(async ({ page }) => {
  await page.route("**/*", route => new URL(route.request().url()).origin === base.origin
    ? route.continue() : route.fulfill({ contentType: "application/javascript", body: "" }));
});

for (const prefix of ["", "/en"]) {
  for (const [slug, section, intent] of [
    ["", ".presence-section", "gestion"],
    ["audit-gratuit-potentiel-locatif", ".page-sections", "audit"],
    ["intendance-residence-secondaire-corse", ".intendance-ritual", "intendance"],
    ["premiere-mise-en-location-corse", "#le-parcours", "audit"],
  ]) {
    test(`${prefix || "fr"}/${slug}: mobile reminder respects cookies and opens the right enquiry`, async ({ page }) => {
      await page.goto(`${prefix}/${slug}`);
      const reminder = page.locator(".mobile-contact");
      const link = reminder.locator("a");
      await expect(reminder).toBeHidden();
      await page.locator(section!).evaluate(element => element.scrollIntoView({ behavior: "instant", block: "start" }));
      await expect(reminder).toBeHidden();
      await page.locator('[data-ads-choice="reject"]').click();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", `${prefix}/contact?intent=${intent}`);
      const bounds = await link.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(12);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390 - 12);
      expect(bounds!.height).toBeGreaterThanOrEqual(48);
      await link.click();
      await expect(page.locator("#contact-intent")).toHaveValue(intent!);
      await expect(page.locator(".mobile-contact")).toHaveCount(0);
      expect(await page.evaluate(() => sessionStorage.getItem("inastia-contact-journey-v1"))).toBeNull();
    });
  }
}

test("reminder yields to the menu, existing CTAs, footer, keyboard focus and desktop", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  await page.locator('[data-ads-choice="reject"]').click();
  const reminder = page.locator(".mobile-contact");
  const readOn = () => page.locator(".presence-section").evaluate(element => element.scrollIntoView({ behavior: "instant", block: "start" }));
  await readOn();
  await expect(reminder).toBeVisible();
  await page.locator(".menu-toggle").click();
  await expect(reminder).toBeHidden();
  await page.keyboard.press("Escape");
  await expect(reminder).toBeVisible();
  await page.locator("#pricing-revenue").fill("6000");
  await expect(reminder).toBeHidden();
  await page.locator("#pricing-revenue").blur();
  await page.locator(".contact-callout .button").scrollIntoViewIfNeeded();
  await expect(reminder).toBeHidden();
  await page.locator("#ads-consent-settings").click();
  await expect(reminder).toBeHidden();
  await readOn();
  await expect(reminder).toBeHidden();
  await page.locator('[data-ads-choice="reject"]').click();
  await expect(reminder).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(reminder).toBeHidden();
  await page.setViewportSize({ width: 390, height: 844 });
  await readOn();
  await expect(reminder).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(reminder).toBeHidden();
});
