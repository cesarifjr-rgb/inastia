import { test, expect } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`home layout and keyboard navigation at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".hero-actions .button")).toBeVisible();
    expect(await page.evaluate(() => Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) <= innerWidth)).toBe(true);
    if (width === 390) {
      const toggle = page.locator(".menu-toggle");
      await toggle.focus();
      await page.keyboard.press("Enter");
      await expect(page.locator("#mobile-menu a").first()).toBeFocused();
      await expect(page.locator("main")).toHaveJSProperty("inert", true);
      await page.keyboard.press("Escape");
      await expect(page.locator("#mobile-menu")).toBeHidden();
      await expect(toggle).toBeFocused();
      await expect(page.locator("main")).toHaveJSProperty("inert", false);
    } else {
      await page.locator('.desktop-nav a[href="/#services"]').focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/#services$/);
    }
    expect(errors).toEqual([]);
  });

  test(`orientation radio keyboard and contact intent at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.route("**/api/contact", (route) => route.abort());
    await page.goto("/");
    const guide = page.locator("[data-orientation-guide]");
    await guide.locator("summary").focus();
    await page.keyboard.press("Enter");
    const first = guide.locator('input[value="large"]');
    await first.focus();
    await page.keyboard.press("Space");
    await expect(first).toBeChecked();
    await page.keyboard.press("ArrowDown");
    await expect(guide.locator('input[value="listing"]')).toBeChecked();
    const result = guide.locator('[data-orientation-result="listing"]');
    await expect(result).toBeVisible();
    await result.locator('a[href="/contact?intent=annonce"]').click();
    await expect(page.locator("#contact-intent")).toHaveValue("annonce");
  });

  test(`dialog history Escape and focus at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/#portfolio");
    const link = page.locator(".property-link").first();
    const dialog = page.locator("#property-viewer");
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("img")).toHaveJSProperty("complete", true);
    await page.goBack();
    await expect(dialog).toBeHidden();
    await expect(link).toBeFocused();
    await page.goForward();
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/#portfolio$/);
    await expect(link).toBeFocused();
  });

  test(`contact inline validation without delivery at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    let submissions = 0;
    await page.route("**/api/contact", (route) => { submissions++; return route.fulfill({ json: { success: true } }); });
    await page.route("https://challenges.cloudflare.com/**", (route) => route.abort());
    await page.route("https://api.resend.com/**", (route) => route.abort());
    await page.goto("/contact?intent=audit");
    await page.locator("#submit-contact").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#propertyType")).toBeFocused();
    await expect(page.locator("[aria-invalid=true]")).toHaveCount(5);
    await expect(page.locator("#email")).toHaveAttribute("aria-describedby", "email-error");
    await page.locator('.form-errors a[href="#email"]').focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#email")).toBeFocused();
    await page.locator("#email").fill("local@example.com");
    await expect(page.locator("#email")).not.toHaveAttribute("aria-invalid");
    expect(submissions).toBe(0);
  });
}
