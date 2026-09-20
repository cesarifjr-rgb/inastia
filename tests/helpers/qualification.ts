import type { Page } from "@playwright/test";

export async function fillQualification(page: Page): Promise<void> {
  await page.locator("#propertyArea").fill("Quartier de test");
  if (!(await page.locator("#contact-project").evaluate(element => (element as HTMLDetailsElement).open)))
    await page.locator("#contact-project-summary").click();
  await page.locator("#decisionRole").selectOption("proprietaire");
  if (await page.locator("#rentalSituation").isEnabled()) await page.locator("#rentalSituation").selectOption("premiere");
  await page.locator("#startTimeline").selectOption("adefinir");
}
