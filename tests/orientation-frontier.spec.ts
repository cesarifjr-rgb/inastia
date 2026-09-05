import { test, expect } from "@playwright/test";
import { servicesFor } from "../src/content/services.ts";

const needs = [
  ["large", "gestion", "gestion-airbnb-corse-du-sud"],
  ["listing", "annonce", "pack-lancement-airbnb"],
  ["local", "rotation", "menage-airbnb-corse-du-sud"],
  ["unsure", "audit", "audit-gratuit-potentiel-locatif"],
] as const;
const reasons = {
  fr: [
    "l’annonce, les réservations et la coordination sur place",
    "la présentation, les prix et le calendrier",
    "Vous conservez l’annonce et les réservations",
    "échange qualitatif par appel ou email",
  ],
  en: [
    "the listing, bookings and local coordination",
    "presentation, pricing and calendar",
    "You keep managing the listing and bookings",
    "qualitative review by phone or email",
  ],
};

for (const locale of ["fr", "en"] as const) {
  const prefix = locale === "en" ? "/en" : "";
  test(`keyboard guide, reasons, contact intents and reset (${locale})`, async ({
    page,
  }) => {
    await page.route("**/api/contact", (route) => route.abort());
    await page.goto(`${prefix}/`);
    const guide = page.locator("[data-orientation-guide]");
    await guide.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(guide.locator("[data-orientation-neutral]")).toBeVisible();
    await expect(guide.locator("input:checked")).toHaveCount(0);
    await page.keyboard.press("Tab");
    for (const [index, [need, intent, slug]] of needs.entries()) {
      if (index === 0) await page.keyboard.press("Space");
      else await page.keyboard.press("ArrowDown");
      const radio = guide.locator(`input[value="${need}"]`);
      await expect(radio).toBeChecked();
      await expect(radio).toBeFocused();
      const result = guide.locator(`[data-orientation-result="${need}"]`);
      await expect(result).toBeVisible();
      await expect(
        guide.locator("[data-orientation-result]:visible"),
      ).toHaveCount(1);
      await expect(result.locator(".orientation-reason")).toHaveText(/.{50}/);
      await expect(result.locator(".orientation-reason")).toContainText(
        reasons[locale][index]!,
      );
      await expect(result).toContainText(
        locale === "fr" ? "indicative" : "must be confirmed together",
      );
      await expect(result.locator(`a[href="${prefix}/${slug}"]`)).toBeVisible();
      await expect(
        result.locator(`a[href="${prefix}/contact?intent=${intent}"]`),
      ).toBeVisible();
    }
    // Exercise the browser restoration handler with changed checked state.
    await guide
      .locator('input[value="listing"]')
      .evaluate((element: HTMLInputElement) => {
        element.checked = true;
        window.dispatchEvent(
          new PageTransitionEvent("pageshow", { persisted: true }),
        );
      });
    await expect(
      guide.locator('[data-orientation-result="listing"]'),
    ).toBeVisible();
    await guide.locator("[data-orientation-reset]").focus();
    await page.keyboard.press("Enter");
    await expect(guide.locator("input:checked")).toHaveCount(0);
    await expect(guide.locator("[data-orientation-neutral]")).toBeVisible();
    await expect(guide.locator("[data-orientation-reset]")).toBeFocused();
    for (const [need, intent, slug] of needs) {
      await guide.locator(`input[value="${need}"]`).check();
      await guide
        .locator(
          `[data-orientation-result="${need}"] a[href="${prefix}/contact?intent=${intent}"]`,
        )
        .click();
      await expect(page.locator("#contact-intent")).toHaveValue(intent);
      await page.goto(`${prefix}/${slug}`);
      await page.locator(".page-hero-copy .button").click();
      await expect(page.locator("#contact-intent")).toHaveValue(intent);
      await page.goto(`${prefix}/`);
      await guide.locator("summary").click();
    }
  });

  test(`comparison remains complete without JavaScript (${locale})`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    try {
      const page = await context.newPage();
      await page.goto(`${prefix}/`);
      await expect(page.locator("[data-orientation-guide]")).toBeHidden();
      await page.locator('.orientation a[href="#comparaison"]').click();
      const cards = page.locator("#comparaison .service-card");
      await expect(cards).toHaveCount(3);
      for (const service of servicesFor(locale)) {
        const card = cards.nth(service.index);
        for (const text of [
          service.title,
          service.delegate,
          service.keep,
          service.cost,
        ]) {
          await expect(card.getByText(text, { exact: true })).toBeVisible();
        }
        await expect(card.locator("details")).toHaveCount(0);
      }
    } finally {
      await context.close();
    }
  });

  for (const width of [390, 1440]) {
    test(`radio labels wrap within the screen (${locale}, ${width})`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 960 });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(`${prefix}/`);
      await page.locator("[data-orientation-guide] summary").click();
      const labels = page.locator(".orientation-choice");
      for (const label of await labels.all()) {
        const box = await label.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width);
        expect(
          await label.evaluate(
            (element) => element.scrollWidth <= element.clientWidth,
          ),
        ).toBe(true);
      }
      await page.locator('input[value="local"]').check();
      await page
        .locator(".orientation")
        .screenshot({
          path: testInfo.outputPath(`guide-${locale}-${width}.png`),
        });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(errors).toEqual([]);
    });
  }
}
