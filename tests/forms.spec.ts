import { test, expect, type Page } from "@playwright/test";

declare global {
  interface Window {
    __solveChallenge: () => void;
    __challengeResetCount: number;
  }
}

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:4100");
const local = ["localhost", "127.0.0.1", "[::1]"].includes(base.hostname);
test.skip(!local, "Form mutation tests are restricted to a local mock server.");

test.beforeEach(async ({ page }) => {
  // Tests cannot contact either live protection or email providers.
  await page.route("https://challenges.cloudflare.com/**", (route) =>
    route.abort(),
  );
  await page.route("https://api.resend.com/**", (route) => route.abort());
  await page.addInitScript(() => {
    window.__challengeResetCount = 0;
    window.__solveChallenge = () => {};
    Object.assign(window, {
      turnstile: {
        render: (
          container: HTMLElement,
          options: { callback: (token: string) => void; size: string },
        ) => {
          const widget = document.createElement("div");
          widget.style.width = options.size === "compact" ? "150px" : "300px";
          widget.style.height = options.size === "compact" ? "140px" : "65px";
          container.append(widget);
          window.__solveChallenge = () => options.callback("local-test-token");
          return "test-widget";
        },
        reset: () => {
          window.__challengeResetCount += 1;
        },
      },
    });
  });
});

async function fillContact(page: Page): Promise<void> {
  await page.locator("#propertyType").selectOption("Villa");
  await page.locator("#location").fill("Porto-Vecchio");
  await page.locator("#firstName").fill("Test");
  await page.locator("#lastName").fill("Local");
  await page.locator("#email").fill("local-test@example.com");
  if (await page.locator("#phone").evaluate((phone) => (phone as HTMLInputElement).required))
    await page.locator("#phone").fill("+33 6 00 00 00 00");
  await page.locator("#message").fill("Local automated test; never delivered.");
}

for (const locale of ["fr", "en"] as const) {
  const path = locale === "fr" ? "/contact" : "/en/contact";
  test.describe(`Contact ${locale}`, () => {
    test("audit callback phone requirement follows intent and survives simulated success/reset", async ({ page }) => {
      let requests = 0;
      await page.route("**/api/contact", async (route) => {
        requests += 1;
        expect(route.request().postDataJSON()).toMatchObject({ intent: "audit", phone: "+33 6 00 00 00 00" });
        await route.fulfill({ json: { success: true } });
      });
      await page.goto(`${path}?intent=audit`);
      const phone = page.locator("#phone");
      const intent = page.locator("#contact-intent");
      await expect(phone).toHaveAttribute("required", "");
      await expect(phone).toHaveAccessibleName(locale === "fr" ? "Téléphone *" : "Phone *");
      await expect(page.locator("#message-help")).toContainText(locale === "fr" ? "disponibilités" : "available");
      for (const value of ["gestion", ""]) {
        await intent.selectOption(value);
        await expect(phone).not.toHaveAttribute("required", "");
        await expect(phone).toHaveAccessibleName(locale === "fr" ? "Téléphone (facultatif)" : "Phone (optional)");
        await expect(page.locator("#contact-lead")).not.toContainText("24");
      }
      await intent.selectOption("audit");
      await expect(page.locator(".language-link")).toHaveAttribute("href", /intent=audit$/);
      await fillContact(page);
      await phone.fill("");
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      await expect(phone).toBeFocused();
      expect(requests).toBe(0);
      await phone.fill("+33 6 00 00 00 00");
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toHaveAttribute("data-state", "success");
      await expect(page.locator("#form-status")).toContainText(locale === "fr" ? "selon votre convenance" : "at a time that suits you");
      await expect(intent).toHaveValue("audit");
      await expect(phone).toHaveAttribute("required", "");
      await expect(page.locator("#submit-contact")).toBeDisabled();
      await page.locator("#form-reset").click();
      await expect(intent).toHaveValue("audit");
      await expect(phone).toHaveAttribute("required", "");
      await expect(page.locator("#submit-contact")).toBeEnabled();
      await intent.selectOption("gestion");
      await expect(phone).not.toHaveAttribute("required", "");
      await expect(page.locator("#contact-title")).toHaveText(locale === "fr" ? "Confiez-nous la gestion de votre bien." : "Let us manage your property.");
      expect(requests).toBe(1);
    });

    for (const intent of ["audit", "gestion", "annonce", "rotation", ""]) {
      const expectedIntent = ["audit", "gestion"].includes(intent) ? intent : "";
      test(`${intent && !expectedIntent ? `legacy ${intent} falls back to generic` : `preserves ${intent || "generic"}`} through a simulated confirmation`, async ({
        page,
      }) => {
        let payload: Record<string, string> | undefined;
        await page.route("**/api/contact", async (route) => {
          payload = route.request().postDataJSON();
          await route.fulfill({ json: { success: true } });
        });
        await page.goto(intent ? `${path}?intent=${intent}` : path);
        await expect(page.locator("#contact-intent")).toHaveValue(expectedIntent);
        expect(await page.locator("#contact-intent option").evaluateAll(options => options.map(option => (option as HTMLOptionElement).value))).toEqual(["", "audit", "gestion"]);
        await expect(page.locator(".language-link")).toHaveAttribute(
          "href",
          new URL(`${locale === "fr" ? "/en/contact" : "/contact"}${expectedIntent ? `?intent=${expectedIntent}` : ""}`, base).href,
        );
        if (!expectedIntent) await expect(page.locator("#contact-title")).toHaveText(
          locale === "fr" ? "Parlons de votre bien." : "Let\u2019s talk about your property.",
        );
        if (intent === "audit") {
          await expect(page.locator("#contact-title")).toContainText(
            locale === "fr" ? "audit gratuit" : "free property review",
          );
          await expect(page.locator("#submit-contact-label")).toContainText(
            locale === "fr" ? "audit gratuit" : "free property review",
          );
          await expect(page.locator("#contact-lead")).toContainText(locale === "fr" ? "sous 24 h" : "within 24 hours");
        }
        await fillContact(page);
        await expect(page.locator("#message-help")).toBeVisible();
        await expect(page.locator("#message")).toHaveAttribute(
          "aria-describedby",
          "message-help",
        );
        await page.evaluate(() => window.__solveChallenge());
        await page.locator("#submit-contact").click();
        await expect(page.locator("#form-status")).toHaveAttribute(
          "data-state",
          "success",
        );
        expect(payload?.intent).toBe(expectedIntent);
        await expect(page.locator("#contact-intent")).toHaveValue(expectedIntent);
        if (intent === "audit")
          await expect(page.locator("#form-status")).toContainText(
            locale === "fr" ? "sous 24 h, selon votre convenance" : "within 24 hours, at a time that suits you",
          );
      });
    }

    test("invalid intent falls back to generic and can be changed before sending", async ({
      page,
    }) => {
      let payload: Record<string, string> | undefined;
      await page.route("**/api/contact", async (route) => {
        payload = route.request().postDataJSON();
        await route.fulfill({ json: { success: true } });
      });
      await page.goto(`${path}?intent=%3Cscript%3E`);
      await expect(page.locator("#contact-intent")).toHaveValue("");
      await expect(page.locator("#contact-title")).toHaveText(
        locale === "fr"
          ? "Parlons de votre bien."
          : "Let\u2019s talk about your property.",
      );
      await page.locator("#contact-intent").selectOption("audit");
      await expect(page.locator(".language-link")).toHaveAttribute(
        "href",
        /intent=audit/,
      );
      await page.locator(".language-link").click();
      await expect(page).toHaveURL(
        new RegExp(
          `${locale === "fr" ? "/en/contact" : "/contact"}\\?intent=audit$`,
        ),
      );
      await expect(page.locator("#contact-intent")).toHaveValue("audit");
      await expect(page.locator("#phone")).toHaveAttribute("required", "");
      await expect(page.locator("#phone")).toHaveAccessibleName(locale === "fr" ? "Phone *" : "Téléphone *");
      await page.locator("#contact-intent").selectOption("gestion");
      await expect(page.locator("#phone")).not.toHaveAttribute("required", "");
      await fillContact(page);
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toHaveAttribute(
        "data-state",
        "success",
      );
      expect(payload?.intent).toBe("gestion");
    });

    test("required fields and absent challenge prevent sending", async ({
      page,
    }) => {
      let requests = 0;
      await page.setViewportSize({ width: 375, height: 812 });
      await page.route("**/api/contact", async (route) => {
        requests += 1;
        await route.fulfill({ json: { success: true } });
      });
      await page.goto(path);
      await page.locator("#submit-contact").click();
      await expect(page.locator("#propertyType")).toBeFocused();
      expect(
        await page
          .locator("#propertyType")
          .evaluate((field: HTMLSelectElement) => field.validity.valueMissing),
      ).toBe(true);
      expect(
        await page
          .locator("#contact-form")
          .evaluate((form: HTMLFormElement) => form.checkValidity()),
      ).toBe(false);
      await fillContact(page);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(
        await page.evaluate(() => document.documentElement.clientWidth),
      );
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toContainText(
        locale === "fr" ? "Veuillez effectuer" : "Please complete",
      );
      await expect(page.locator("#form-status")).toBeFocused();
      expect(requests).toBe(0);
    });

    test("successful enquiry remains visible until intentional reset", async ({
      page,
    }) => {
      let requests = 0;
      await page.route("**/api/contact", async (route) => {
        requests += 1;
        expect(route.request().postDataJSON()).toMatchObject({
          firstName: "Test",
          turnstileToken: "local-test-token",
          email: "local-test@example.com",
        });
        await route.fulfill({ json: { success: true } });
      });
      await page.goto(`${path}?intent=gestion`);
      await fillContact(page);
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      const status = page.locator("#form-status");
      await expect(status).toHaveAttribute("data-state", "success");
      await expect(status).toContainText(
        locale === "fr" ? "bien été envoyée" : "has been sent",
      );
      await expect(status).toBeFocused();
      await expect(page.locator("#firstName")).toHaveValue("");
      await expect(page.locator("#submit-contact")).toBeDisabled();
      await expect(page.locator("#form-reset")).toBeVisible();
      // Regression: the previous form hid success automatically after 4 seconds.
      await page.waitForTimeout(4300);
      await expect(status).toHaveAttribute("data-state", "success");
      expect(await page.evaluate(() => window.__challengeResetCount)).toBe(1);
      await page.locator("#form-reset").click();
      await expect(page.locator("#firstName")).toBeFocused();
      await expect(page.locator("#submit-contact")).toBeEnabled();
      await expect(page.locator("#form-reset")).toBeHidden();
      await expect(page.locator("#contact-intent")).toHaveValue("gestion");
      expect(requests).toBe(1);
    });

    test("failed request preserves input and requires fresh challenge", async ({
      page,
    }) => {
      let requests = 0;
      await page.route("**/api/contact", async (route) => {
        requests += 1;
        await route.fulfill({ status: 500, json: { success: false } });
      });
      await page.goto(`${path}?intent=audit`);
      await fillContact(page);
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toContainText(
        locale === "fr"
          ? "informations sont conservées"
          : "information has been kept",
      );
      await expect(page.locator("#email")).toHaveValue(
        "local-test@example.com",
      );
      await expect(page.locator("#message")).toHaveValue(
        "Local automated test; never delivered.",
      );
      await expect(page.locator("#contact-intent")).toHaveValue("audit");
      expect(await page.evaluate(() => window.__challengeResetCount)).toBe(1);
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toContainText(
        locale === "fr" ? "Veuillez effectuer" : "Please complete",
      );
      expect(requests).toBe(1);
    });

    test("pending request cannot be submitted twice", async ({ page }) => {
      let requests = 0;
      let release: () => void = () => {};
      const gate = new Promise<void>((resolve) => {
        release = resolve;
      });
      await page.route("**/api/contact", async (route) => {
        requests += 1;
        await gate;
        await route.fulfill({ json: { success: true } });
      });
      await page.goto(path);
      await fillContact(page);
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      await expect(page.locator("#submit-contact")).toBeDisabled();
      await expect(page.locator("#contact-form")).toHaveAttribute(
        "aria-busy",
        "true",
      );
      await page
        .locator("#contact-form")
        .evaluate((form: HTMLFormElement) => form.requestSubmit());
      await expect.poll(() => requests).toBe(1);
      release();
      await expect(page.locator("#form-status")).toHaveAttribute(
        "data-state",
        "success",
      );
      expect(requests).toBe(1);
    });
  });
}
