import { test, expect, type Page } from "@playwright/test";

declare global {
  interface Window {
    __frontierSolveChallenge: () => void;
  }
}

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:4100");
test.skip(
  !["localhost", "127.0.0.1", "[::1]"].includes(base.hostname),
  "Inline-validation tests only use a local page with mocked providers.",
);

test.beforeEach(async ({ page }) => {
  await page.route("https://challenges.cloudflare.com/**", (route) =>
    route.abort(),
  );
  await page.route("https://api.resend.com/**", (route) => route.abort());
  await page.addInitScript(() => {
    window.__frontierSolveChallenge = () => {};
    Object.assign(window, {
      turnstile: {
        render: (
          _container: HTMLElement,
          options: { callback: (token: string) => void },
        ) => {
          window.__frontierSolveChallenge = () =>
            options.callback("frontier-local-token");
          window.__frontierSolveChallenge();
          return "local-widget";
        },
        reset: () => {},
      },
    });
  });
});

async function completeFields(page: Page): Promise<void> {
  await page.locator("#propertyType").selectOption("Maison");
  await page.locator("#location").fill("Solenzara");
  await page.locator("#firstName").fill("Local");
  await page.locator("#lastName").fill("Test");
  await page.locator("#email").fill("local@example.com");
}

for (const locale of ["fr", "en"] as const) {
  const path = `${locale === "en" ? "/en" : ""}/contact`;
  test(`inline errors are associated, precise and correctable with the keyboard (${locale})`, async ({
    page,
  }) => {
    let requests = 0;
    await page.route("**/api/contact", async (route) => {
      requests++;
      await route.fulfill({ json: { success: true } });
    });
    await page.goto(path);
    const summary = page.locator(".form-errors");
    await expect(summary).toBeHidden();
    await expect(page.locator("[aria-invalid=true]")).toHaveCount(0);
    await page.locator("#submit-contact").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#propertyType")).toBeFocused();
    await expect(summary).toHaveAttribute("role", "alert");
    await expect(summary).toContainText(
      locale === "fr" ? "5 champs" : "5 highlighted fields",
    );
    await expect(page.locator("[aria-invalid=true]")).toHaveCount(5);
    await expect(page.locator("#firstName")).toHaveAttribute(
      "aria-describedby",
      "firstName-error",
    );
    await expect(page.locator("#firstName-error")).toHaveText(
      locale === "fr" ? "Indiquez votre prénom." : "Enter your first name.",
    );
    await summary.locator('a[href="#email"]').focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#email")).toBeFocused();
    await page.locator("#email").fill("incomplete");
    await expect(page.locator("#email-error")).toContainText(
      locale === "fr" ? "adresse email complète" : "complete email address",
    );
    await completeFields(page);
    await page.locator("#location").fill("   ");
    await page
      .locator("#message")
      .fill("Local validation check; no real delivery.");
    await expect(page.locator("#message")).toHaveAttribute(
      "aria-describedby",
      "message-help",
    );
    await page.locator("#submit-contact").click();
    await expect(page.locator("#location")).toBeFocused();
    await expect(page.locator("#location-error")).toContainText(
      locale === "fr" ? "commune" : "town",
    );
    expect(requests).toBe(0);
    await page.locator("#location").fill("Solenzara");
    await expect(summary).toBeHidden();
    await expect(page.locator("[aria-invalid=true]")).toHaveCount(0);
    await expect(page.locator("#location")).not.toHaveAttribute(
      "aria-describedby",
    );
    await expect(page.locator("#message-help")).toBeVisible();
  });

  test(`retry preserves data and success requires a confirmed response (${locale})`, async ({
    page,
  }) => {
    let requests = 0;
    await page.route("**/api/contact", async (route) => {
      requests++;
      expect(route.request().postDataJSON()).toMatchObject({
        intent: "audit",
        email: "local@example.com",
      });
      await route.fulfill({
        json: { success: requests === 1 ? "true" : true },
      });
    });
    await page.goto(`${path}?intent=audit`);
    await completeFields(page);
    await page.locator("#submit-contact").click();
    await expect(page.locator("#form-status")).toHaveAttribute(
      "data-state",
      "error",
    );
    await expect(page.locator("#email")).toHaveValue("local@example.com");
    await expect(page.locator("#contact-intent")).toHaveValue("audit");
    await expect(page.locator("#form-reset")).toBeHidden();
    // A fresh local challenge is required after any attempted send.
    await page.locator("#submit-contact").click();
    expect(requests).toBe(1);
    await page.evaluate(() => window.__frontierSolveChallenge());
    await page.locator("#submit-contact").click();
    await expect(page.locator("#form-status")).toHaveAttribute(
      "data-state",
      "success",
    );
    await expect(page.locator("#form-status")).toBeFocused();
    await expect(page.locator("#submit-contact")).toBeDisabled();
    await expect(page.locator("#firstName")).toHaveValue("");
    await expect(page.locator("#contact-intent")).toHaveValue("audit");
    await expect(page.locator(".form-errors")).toBeHidden();
    expect(requests).toBe(2);
  });
}

test("without JavaScript required fields retain browser constraint validation", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  try {
    const page = await context.newPage();
    let requests = 0;
    await page.route("**/api/contact", async (route) => {
      requests++;
      await route.abort();
    });
    await page.goto("/contact");
    expect(
      await page
        .locator("#contact-form")
        .evaluate((form: HTMLFormElement) => form.noValidate),
    ).toBe(false);
    await page.locator("#submit-contact").click();
    await expect(page.locator("#propertyType")).toBeFocused();
    expect(
      await page
        .locator("#propertyType")
        .evaluate((field: HTMLSelectElement) => field.validity.valueMissing),
    ).toBe(true);
    expect(requests).toBe(0);
  } finally {
    await context.close();
  }
});
