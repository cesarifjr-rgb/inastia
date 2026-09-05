import { expect, test } from "@playwright/test";

test("photographs open by keyboard and close with Back, Escape and the close button", async ({ page }) => {
  await page.goto("/#portfolio");
  const link = page.locator('.property-link[data-property="villa_amichi"]');
  const viewer = page.locator("#property-viewer");
  await link.focus();
  await link.press("Enter");
  await expect(viewer).toBeVisible();
  await expect(page).toHaveURL(/#maison-villa_amichi$/);
  await expect(viewer.locator("h2")).toHaveText("Villa d’Amichi");
  await expect(viewer.locator("img")).toHaveJSProperty("complete", true);
  expect(await viewer.locator("img").evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await page.goBack();
  await expect(viewer).not.toBeVisible();
  await expect(page).toHaveURL(/#portfolio$/);
  await expect(link).toBeFocused();
  await page.goForward();
  await expect(viewer).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(viewer).not.toBeVisible();
  await expect(page).toHaveURL(/#portfolio$/);
  await expect(link).toBeFocused();
  await link.click();
  await viewer.locator(".property-viewer-close").click();
  await expect(viewer).not.toBeVisible();
  await expect(page).toHaveURL(/#portfolio$/);
  await expect(page.locator("body")).not.toHaveClass(/property-view-open/);
});

test("a mobile English deep link opens and closes without navigating away", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/#maison-casa_verde");
  const viewer = page.locator("#property-viewer");
  await expect(viewer).toBeVisible();
  await expect(viewer.locator("h2")).toHaveText("Casa Verde");
  await viewer.getByRole("button", { name: "Close photograph" }).click();
  await expect(viewer).not.toBeVisible();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator('.property-link[data-property="casa_verde"]')).toBeFocused();
  await page.goto("/en/#maison-unknown");
  await expect(viewer).not.toBeVisible();
  await expect(page).toHaveURL(/#maison-unknown$/);
});

test("Escape preserves the focused gallery link after mobile history traversal", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/#portfolio");
  const link = page.locator(".property-link").first();
  for (let index = 0; index < 3; index++) {
    await link.focus();
    await link.press("Enter");
    await expect(page.locator("#property-viewer")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(/#portfolio$/);
    await expect(page.locator("#property-viewer")).not.toBeVisible();
    await expect(link).toBeFocused();
  }
});

test("modified clicks retain native media navigation", async ({ page, context }) => {
  await page.goto("/");
  const popupPromise = context.waitForEvent("page");
  await page.locator('.property-link[data-property="villa_lova"]').click({ modifiers: ["Control"] });
  const popup = await popupPromise;
  await popup.waitForLoadState();
  await expect(popup).toHaveURL(/\/images\/villa_lova-1200\.webp$/);
  await expect(page.locator("#property-viewer")).not.toBeVisible();
  await popup.close();
});

test("blocked media preserves its text context and a working close control", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("**/images/**", (route) => route.abort());
  await page.goto("/#portfolio");
  const link = page.locator(".property-link").first();
  await link.click();
  const viewer = page.locator("#property-viewer");
  await expect(viewer).toBeVisible();
  await expect(viewer.locator("h2")).toHaveText("Villa d’Amichi");
  await expect(viewer.locator("img")).toHaveAttribute("alt", "Villa d’Amichi · Pinarello · Zonza");
  await viewer.getByRole("button", { name: "Fermer la photographie" }).click();
  await expect(viewer).not.toBeVisible();
  await expect(link).toBeFocused();
});

test("without JavaScript every photograph remains a real media link", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto("/");
    const links = page.locator(".property-link");
    await expect(links).toHaveCount(3);
    for (const link of await links.all()) {
      const href = await link.getAttribute("href");
      expect(href).toMatch(/^\/images\/(villa_amichi|casa_verde|villa_lova)-1200\.webp$/);
      const response = await context.request.get(href!);
      expect(response.ok()).toBe(true);
      expect(response.headers()["content-type"]).toContain("image/webp");
    }
    await links.first().click();
    await expect(page).toHaveURL(/\/images\/villa_amichi-1200\.webp$/);
  } finally {
    await context.close();
  }
});
