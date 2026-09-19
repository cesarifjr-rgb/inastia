import type { Page } from "@playwright/test";

export async function fillQualification(page: Page): Promise<void> {
  await page.locator("#propertyArea").fill("Quartier de test");
  await page.locator("#decisionRole").selectOption("proprietaire");
  if (await page.locator("#rentalSituation").isEnabled()) await page.locator("#rentalSituation").selectOption("premiere");
  await page.locator("#startTimeline").selectOption("adefinir");
}
