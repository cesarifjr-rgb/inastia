import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { ANALYTICS_ID } from "../src/analytics.ts";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:4100");
const local = ["localhost", "127.0.0.1", "[::1]"].includes(base.hostname);

for (const locale of ["fr", "en"]) {
  const prefix = locale === "fr" ? "" : "/en";
  test(`${locale}: care form selection, reset and separate conversion attribution`, async ({ page }) => {
    test.skip(!local, "Synthetic form submission runs locally only.");
    await page.addInitScript(() => {
      localStorage.setItem("inastia-measurement-consent-v1", JSON.stringify({ ads: true, analytics: true, at: Date.now() }));
      Object.assign(window, { turnstile: {
        render: (_node: HTMLElement, options: { callback: (token: string) => void }) => {
          Object.assign(window, { __careSolve: () => options.callback("synthetic-care-token") });
          return "synthetic-widget";
        }, reset: () => {},
      } });
    });
    let succeed = false;
    let payload: Record<string, unknown> | undefined;
    await page.route("**/*", async route => {
      const url = new URL(route.request().url());
      if (url.origin !== base.origin) return route.fulfill({ contentType: "application/javascript", body: "" });
      if (url.pathname === "/api/contact") {
        payload = route.request().postDataJSON();
        return route.fulfill({ status: succeed ? 200 : 503, json: { success: succeed } });
      }
      return route.continue();
    });
    await page.goto(`${prefix}/contact?intent=intendance&formule=serenite`);
    await expect(page.locator("#intendancePlan")).toHaveValue("serenite");
    await expect(page.locator("#rentalSituation")).toBeHidden();
    await expect(page.locator("#rentalSituation")).toBeDisabled();
    await expect(page.locator(".language-link")).toHaveAttribute("href", new URL(`${locale === "fr" ? "/en" : ""}/contact?intent=intendance&formule=serenite`, base).href);
    await page.locator("#contact-intent").selectOption("gestion");
    await expect(page.locator("#surface")).toBeHidden();
    await expect(page.locator("#surface")).toBeDisabled();
    await expect(page.locator("#rentalSituation")).toBeEnabled();
    await page.locator("#contact-intent").selectOption("intendance");
    await page.locator("#surface").fill("125");
    await page.locator("#propertyType").selectOption("Villa");
    await page.locator("#location").fill("Solenzara");
    await page.locator("#firstName").fill("Synthetic");
    await page.locator("#email").fill("care@example.invalid");
    await page.evaluate("window.__careSolve()");
    await page.locator("#submit-contact").click();
    await expect(page.locator("#lastName")).toBeFocused();
    expect(payload).toBeUndefined();
    await page.locator("#lastName").fill("Test");
    await page.locator("#submit-contact").click();
    await expect(page.locator("#form-status")).toHaveAttribute("data-state", "error");
    expect(await page.evaluate(() => (window.dataLayer || []).filter(item => item[1] === "generate_lead"))).toHaveLength(0);
    succeed = true;
    await page.evaluate("window.__careSolve()");
    await page.locator("#submit-contact").click();
    await expect(page.locator("#form-status")).toHaveAttribute("data-state", "success");
    expect(payload).toMatchObject({ intent: "intendance", intendancePlan: "serenite", surface: "125", rentalSituation: "", listingUrl: "", phone: "" });
    const events = await page.evaluate(() => (window.dataLayer || []).map(item => Array.from(item)));
    expect(events.filter(item => item[1] === "conversion")).toEqual([]);
    expect(events.filter(item => item[1] === "generate_lead")).toEqual([["event", "generate_lead", { send_to: ANALYTICS_ID, form_id: "contact-form", service: "intendance" }]]);
    await page.locator("#form-reset").click();
    await expect(page.locator("#contact-intent")).toHaveValue("intendance");
    await expect(page.locator("#intendancePlan")).toHaveValue("serenite");
    await page.goto(`${prefix}/contact?intent=intendance&formule=unknown`);
    await expect(page.locator("#intendancePlan")).toHaveValue("");
  });

  for (const width of [320, 390, 1024, 1440]) {
    test(`${locale}: intendance page at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(`${prefix}/intendance-residence-secondaire-corse`);
      await expect(page.locator(".intendance-plan")).toHaveCount(2);
      await expect(page.locator(".intendance-plan").first()).toContainText("89");
      await expect(page.locator(".intendance-plan").last()).toContainText("159");
      await expect(page.locator(".header-cta")).toHaveAttribute("href", `${prefix}/contact?intent=intendance`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (width === 390 || width === 1440) {
        const report = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
        expect(report.violations).toEqual([]);
      }
      expect(errors).toEqual([]);
    });
  }
}
