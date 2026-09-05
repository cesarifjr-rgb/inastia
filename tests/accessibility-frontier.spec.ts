import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const evidence = "C:/Users/Admin/Documents/inastia-frontier-evidence/technical-final/axe";
mkdirSync(evidence, { recursive: true });
const states = [
  ["home", "/"], ["guide-expanded", "/"],
  ["guide-large", "/"], ["guide-listing", "/"],
  ["guide-local", "/"], ["guide-unsure", "/"],
  ["dialog", "/#portfolio"],
  ["gestion", "/gestion-airbnb-corse-du-sud"],
  ["annonce", "/pack-lancement-airbnb"],
  ["rotation", "/menage-airbnb-corse-du-sud"],
  ["about", "/about"], ["audit", "/audit-gratuit-potentiel-locatif"],
  ["contact", "/contact"], ["contact-errors", "/contact"],
  ["legal", "/mentions-legales"], ["privacy", "/privacy"],
  ["cgv", "/cgv"], ["404", "/404"],
] as const;

for (const width of [390, 1440]) {
  for (const [state, path] of states) {
    test(`contextual WCAG 2.2 AA ${state} at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      let submissions = 0;
      await page.route("**/api/contact", (route) => { submissions++; return route.fulfill({ json: { success: true } }); });
      await page.route("https://challenges.cloudflare.com/**", (route) => route.abort());
      await page.route("https://api.resend.com/**", (route) => route.abort());
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      if (state.startsWith("guide-")) {
        await page.locator("[data-orientation-guide] summary").click();
        if (state !== "guide-expanded") {
          const need = state.slice("guide-".length);
          await page.locator(`[data-orientation-guide] input[value="${need}"]`).check();
          await expect(page.locator(`[data-orientation-result="${need}"]`)).toBeVisible();
        }
      } else if (state === "dialog") {
        await page.locator(".property-link").first().click();
        await expect(page.locator("#property-viewer")).toBeVisible();
      } else if (state === "contact-errors") {
        await page.locator("#submit-contact").click();
        await expect(page.locator("[aria-invalid=true]")).toHaveCount(5);
      }
      const report = await new AxeBuilder({ page }).withTags([
        "wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa",
      ]).analyze();
      writeFileSync(`${evidence}/${state}-${width}.json`, JSON.stringify(report, null, 2));
      await page.screenshot({ path: `${evidence}/${state}-${width}.png`, fullPage: true });
      expect(submissions).toBe(0);
      expect(report.violations).toEqual([]);
    });
  }
}
