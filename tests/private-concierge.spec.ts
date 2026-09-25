import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync } from "node:fs";

const slug = "conciergerie-privee-corse";
mkdirSync(".codex-work/private-concierge", { recursive: true });
for (const locale of ["fr", "en"] as const) {
  const prefix = locale === "fr" ? "" : "/en";
  for (const width of [320, 390, 768, 1024, 1280, 1440]) {
    test(`${locale}: private concierge 2027 at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 950 });
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
      page.on("requestfailed", request => { if (!request.failure()?.errorText.includes("ERR_ABORTED")) errors.push(request.url()); });
      page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      expect((await page.goto(`${prefix}/${slug}`))?.status()).toBe(200);
      await page.getByRole("button", { name: locale === "fr" ? "Tout refuser" : "Reject all", exact: true }).click();
      await expect(page.locator(".private-season")).toContainText("2027");
      await expect(page.locator(".header-cta")).toHaveAttribute("href", "#votre-projet");
      await page.locator(".private-hero .button").click();
      await expect(page.locator("#prestations")).toBeInViewport();
      for (const [index, audience] of (locale === "fr" ? ["propriétaire", "voyageur"] : ["homeowner", "guest"]).entries()) {
        const href = await page.locator(".private-actions a").nth(index).getAttribute("href");
        const url = new URL(href!);
        expect(url.protocol).toBe("mailto:");
        expect(url.pathname).toBe("contact@inastia.fr");
        expect(url.searchParams.get("subject")).toContain(audience);
        expect(url.searchParams.get("subject")).toContain("2027");
        expect(url.searchParams.get("body")).toContain(locale === "fr" ? "Services souhaités" : "Services of interest");
      }
      await page.locator(".faq-list summary").first().click();
      await expect(page.locator(".faq-answer").first()).toBeVisible();
      for (const img of await page.locator("main img").all()) {
        await img.scrollIntoViewIfNeeded();
        await expect(img).toHaveJSProperty("complete", true);
        expect(await img.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      if (await page.locator(".desktop-nav").isVisible()) {
        const nav = await page.locator(".desktop-nav").boundingBox();
        const actions = await page.locator(".header-actions").boundingBox();
        expect(nav!.x + nav!.width).toBeLessThanOrEqual(actions!.x + 1);
      }
      if (width === 390 || width === 1440) {
        expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
        await page.evaluate(async () => { await document.fonts.ready; window.scrollTo({ top: 0, behavior: "instant" }); });
        await page.screenshot({ path: `.codex-work/private-concierge/${locale}-${width}.png`, fullPage: true });
        await page.screenshot({ path: `.codex-work/private-concierge/${locale}-${width}-hero.png` });
      }
      expect(errors).toEqual([]);
    });
  }
  test(`${locale}: private concierge discovery and language switch`, async ({ page }) => {
    await page.goto(`${prefix}/`);
    await page.locator(`.site-footer a[href="${prefix}/${slug}"]`).click();
    await expect(page.locator(".private-page")).toBeVisible();
    await page.locator(".language-link").click();
    await expect(page.locator("html")).toHaveAttribute("lang", locale === "fr" ? "en" : "fr");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://inastia.fr${locale === "fr" ? "/en" : ""}/${slug}`);
  });
  test(`${locale}: private concierge quote identifies the selected service`, async ({ page }) => {
    await page.goto(`${prefix}/${slug}`);
    const services = page.locator(".private-services-grid article");
    await expect(services).toHaveCount(12);
    for (const service of await services.all()) {
      const title = await service.locator("h3").innerText();
      const url = new URL((await service.getByRole("link").getAttribute("href"))!);
      expect(url.protocol).toBe("mailto:");
      expect(url.pathname).toBe("contact@inastia.fr");
      expect(url.searchParams.get("subject")).toContain(title);
      expect(url.searchParams.get("body")).toContain(title);
      expect(url.searchParams.get("body")).toContain(locale === "fr" ? "propriétaire / voyageur" : "homeowner / guest");
    }
    expect(await page.locator("#prestations").evaluate(element => Boolean(element.compareDocumentPosition(document.querySelector("#vos-sejours")!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  });
}

test("private concierge remains usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ baseURL: process.env.BASE_URL || "http://127.0.0.1:4100", javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`/${slug}`);
  await expect(page.locator(".private-services-grid article")).toHaveCount(12);
  await page.locator(".faq-list summary").first().click();
  await expect(page.locator(".faq-answer").first()).toBeVisible();
  await expect(page.locator(".private-actions a").first()).toHaveAttribute("href", /^mailto:/);
  await context.close();
});
