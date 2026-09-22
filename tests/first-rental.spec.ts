import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync } from "node:fs";

const slug = "premiere-mise-en-location-corse";
const screenshots = ".codex-work/first-rental";
mkdirSync(screenshots, { recursive: true });

for (const locale of ["fr", "en"] as const) {
  const prefix = locale === "fr" ? "" : "/en";
  for (const width of [320, 390, 768, 1440]) {
    test(`${locale}: first rental reading and checklist at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 950 });
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
      page.on("requestfailed", request => {
        if (!request.failure()?.errorText.includes("ERR_ABORTED")) errors.push(request.url());
      });
      page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      expect((await page.goto(`${prefix}/${slug}`))?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      await page.getByRole("button", { name: locale === "fr" ? "Tout refuser" : "Reject all", exact: true }).click();
      await expect(page.locator(".first-primary")).toHaveAttribute("href", `${prefix}/contact?intent=audit`);
      await page.locator('.first-chapters a[href="#les-reperes"]').click();
      await expect(page.locator("#les-reperes")).toBeInViewport();
      const checklist = page.locator("[data-first-checklist]");
      const boxes = checklist.getByRole("checkbox");
      await expect(boxes).toHaveCount(6);
      await boxes.first().focus();
      await page.keyboard.press("Space");
      await expect(boxes.first()).toBeChecked();
      await expect(checklist.getByRole("status")).toContainText("1 / 6");
      for (const box of await boxes.all()) await box.check();
      await expect(checklist.locator("progress")).toHaveAttribute("value", "6");
      await boxes.first().uncheck();
      await expect(checklist.getByRole("status")).toContainText("5 / 6");
      const question = page.locator(".faq-list details").first();
      await question.locator("summary").click();
      await expect(question.locator(".faq-answer")).toBeVisible();
      for (const img of await page.locator(".first-rental-page img").all()) {
        await img.scrollIntoViewIfNeeded();
        await expect(img).toHaveJSProperty("complete", true);
        expect(await img.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      }
      for (const section of await page.locator("[data-reveal]").all()) {
        await section.scrollIntoViewIfNeeded();
        await expect(section).toHaveCSS("opacity", "1");
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      if (width === 390 || width === 1440) {
        expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
        await page.evaluate(async () => { await document.fonts.ready; window.scrollTo({ top: 0, behavior: "instant" }); });
        await page.screenshot({ path: `${screenshots}/${locale}-${width}.png`, fullPage: true });
        await page.screenshot({ path: `${screenshots}/${locale}-${width}-hero.png` });
      }
      expect(errors).toEqual([]);
      await page.locator(".first-final .button").click();
      await expect(page).toHaveURL(new RegExp(`${prefix}/contact\\?intent=audit$`));
      await expect(page.locator("#contact-intent")).toHaveValue("audit");
    });
  }
  test(`${locale}: first rental is discoverable and translated`, async ({ page }) => {
    await page.goto(`${prefix}/`);
    await page.locator(`.home-rental-paths a[href="${prefix}/${slug}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${prefix}/${slug}$`));
    await page.locator(".language-link").click();
    await expect(page.locator("html")).toHaveAttribute("lang", locale === "fr" ? "en" : "fr");
    await expect(page.locator(".first-rental-page")).toBeVisible();
  });
}

test("first rental remains readable and usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ baseURL: process.env.BASE_URL || "http://127.0.0.1:4100", javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`/${slug}`);
  await expect(page.locator(".first-step")).toHaveCount(4);
  for (const step of await page.locator(".first-step").all()) await expect(step).toBeVisible();
  await expect(page.locator(".first-checklist-progress")).toBeHidden();
  await page.getByRole("checkbox").first().check();
  await page.locator(".faq-list summary").first().click();
  await expect(page.locator(".faq-answer").first()).toBeVisible();
  await context.close();
});
