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
          window.__solveChallenge = () => options.callback(window.__challengeResetCount ? `local-test-token-${window.__challengeResetCount}` : "local-test-token");
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
    test("management reply channel is independent of marketing and allows an optional surname", async ({ page }) => {
      let payload: Record<string, unknown> | undefined;
      await page.route("**/api/contact", async (route) => {
        payload = route.request().postDataJSON();
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
      });
      await page.goto(`${path}?intent=gestion`);
      await expect(page.locator("#contactPreference")).toHaveValue("email");
      await expect(page.locator("#phone")).toBeHidden();
      await page.locator("#contactPreference").selectOption("phone");
      await expect(page.locator("#phone")).toHaveAttribute("required", "");
      await expect(page.locator("#marketingPhone")).not.toBeChecked();
      await expect(page.locator("#phone")).toBeVisible();
      await page.locator("#phone").fill("invalid-old-number");
      await page.locator("#contactPreference").selectOption("email");
      await expect(page.locator("#phone")).toBeHidden();
      await expect(page.locator("#phone")).not.toHaveAttribute("required", "");
      await fillContact(page);
      await page.locator("#lastName").fill("");
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toHaveAttribute("data-state", "success");
      expect(payload).toMatchObject({ intent: "gestion", contactPreference: "email", lastName: "", phone: "", marketingEmail: false, marketingPhone: false });
    });

    test("audit callback phone requirement follows intent and survives simulated success/reset", async ({ page }) => {
      let requests = 0;
      await page.route("**/api/contact", async (route) => {
        requests += 1;
        expect(route.request().postDataJSON()).toMatchObject({ intent: "audit", contactPreference: "phone", phone: "+33 6 00 00 00 00" });
        await route.fulfill({ json: { success: true } });
      });
      await page.goto(`${path}?intent=audit`);
      const phone = page.locator("#phone");
      await expect(page.locator("#contact-preference-field")).toBeHidden();
      await expect(page.locator("#audit-callback-help")).toBeVisible();
      const intent = page.locator("#contact-intent");
      await expect(phone).toHaveAttribute("required", "");
      await expect(phone).toHaveAccessibleName(locale === "fr" ? "Téléphone *" : "Phone *");
      await expect(page.locator("#message-help")).toContainText(locale === "fr" ? "disponibilités" : "available");
      for (const value of ["gestion", ""]) {
        await intent.selectOption(value);
        await expect(page.locator("#contact-preference-field")).toBeVisible();
        await expect(page.locator("#audit-callback-help")).toBeHidden();
        await expect(phone).not.toHaveAttribute("required", "");
        await expect(phone).toBeHidden();
        await expect(page.locator('label[for="phone"]')).toHaveText(locale === "fr" ? "Téléphone (facultatif)" : "Phone (optional)");
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
      await expect(page.locator("#contact-title")).toHaveText(locale === "fr" ? "Préparons la gestion de votre maison" : "Let’s prepare the management of your home");
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
            locale === "fr" ? "audit gratuit" : "free review",
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
          marketingEmail: false,
          marketingPhone: false,
          consentVersion: "commercial-2026-09-06-v1",
          consentLocale: locale,
          consentCollectedAt: expect.any(String),
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
        await route.fulfill({ status: 500, json: { success: false, uncertain: false } });
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
      for (const field of ["#message", "#email", "#propertyType", "#contact-intent", "#marketingEmail", "#marketingPhone"]) {
        await expect(page.locator(field)).toBeDisabled();
      }
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
      await expect(page.locator("#message")).toBeEnabled();
      await expect(page.locator("#form-status")).toBeFocused();
    });

    test("invalid phone and blank qualification are rejected before sending", async ({ page }) => {
      let requests = 0;
      await page.route("**/api/contact", async (route) => {
        requests += 1;
        await route.fulfill({ json: { success: true } });
      });
      await page.goto(`${path}?intent=audit`);
      await fillContact(page);
      await page.locator("#phone").fill("x");
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      await expect(page.locator("#phone")).toBeFocused();
      expect(requests).toBe(0);
      await page.locator("#phone").fill("+1 (202) 555-0123");
      await page.locator("#location").fill("   ");
      await page.locator("#submit-contact").click();
      await expect(page.locator("#location")).toBeFocused();
      expect(requests).toBe(0);
      await page.locator("#location").fill("Porto-Vecchio");
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toHaveAttribute("data-state", "success");
      expect(requests).toBe(1);
    });

    test("uncertain retries keep identity, use fresh challenge, and renew identity after editing", async ({ page }) => {
      const payloads: Record<string, string>[] = [];
      await page.route("**/api/contact", async (route) => {
        payloads.push(route.request().postDataJSON());
        await route.fulfill(payloads.length < 3
          ? { status: 500, json: { success: false, uncertain: true } }
          : { json: { success: true } });
      });
      await page.goto(`${path}?intent=gestion`);
      await fillContact(page);
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toContainText("confirmation");
      await expect(page.locator("#message")).toBeEnabled();
      await expect(page.locator("#message")).toHaveValue("Local automated test; never delivered.");
      await expect(page.locator("#form-status")).toBeFocused();
      await page.locator("#submit-contact").click();
      expect(payloads).toHaveLength(1);
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toHaveAttribute("data-state", "error");
      expect(payloads).toHaveLength(2);
      expect(payloads[1]?.requestId).toBe(payloads[0]?.requestId);
      expect(payloads[1]?.consentCollectedAt).toBe(payloads[0]?.consentCollectedAt);
      expect(payloads[1]?.turnstileToken).not.toBe(payloads[0]?.turnstileToken);
      await page.locator("#message").fill("Updated synthetic request; never delivered.");
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toHaveAttribute("data-state", "success");
      expect(payloads).toHaveLength(3);
      expect(payloads[2]?.requestId).not.toBe(payloads[1]?.requestId);
      expect(payloads[2]?.turnstileToken).not.toBe(payloads[1]?.turnstileToken);
    });

    test("client timeout restores fields and retries the same enquiry with a fresh challenge", async ({ page }) => {
      const payloads: Record<string, string>[] = [];
      await page.clock.install();
      await page.route("**/api/contact", async (route) => {
        payloads.push(route.request().postDataJSON());
        // Leave the first request unresolved so the real client AbortController fires.
        if (payloads.length === 1) return;
        await route.fulfill({ json: { success: true } });
      });
      await page.goto(`${path}?intent=audit`);
      await fillContact(page);
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      await expect.poll(() => payloads.length).toBe(1);
      await expect(page.locator("#message")).toBeDisabled();
      await page.clock.fastForward(25_001);
      await expect(page.locator("#form-status")).toHaveAttribute("data-state", "error");
      await expect(page.locator("#form-status")).toContainText(locale === "fr"
        ? "L’envoi a pris trop de temps et sa confirmation n’a pas été reçue"
        : "Sending took too long and we did not receive confirmation");
      await expect(page.locator("#form-status")).toBeFocused();
      await expect(page.locator("#submit-contact")).toBeEnabled();
      await expect(page.locator("#message")).toBeEnabled();
      await expect(page.locator("#email")).toBeEnabled();
      await expect(page.locator("#message")).toHaveValue("Local automated test; never delivered.");
      await expect(page.locator("#email")).toHaveValue("local-test@example.com");
      await expect(page.locator("#contact-intent")).toHaveValue("audit");
      await expect(page.locator("#contact-form")).not.toHaveAttribute("aria-busy", "true");
      expect(await page.evaluate(() => window.__challengeResetCount)).toBe(1);
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toContainText(locale === "fr" ? "Veuillez effectuer" : "Please complete");
      expect(payloads).toHaveLength(1);
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toHaveAttribute("data-state", "success");
      expect(payloads).toHaveLength(2);
      expect(payloads[1]?.requestId).toBe(payloads[0]?.requestId);
      expect(payloads[1]?.turnstileToken).not.toBe(payloads[0]?.turnstileToken);
    });

    test("commercial email choice is optional, unchecked, and independent of telephone", async ({ page }) => {
      let payload: Record<string, string | boolean> | undefined;
      await page.route("**/api/contact", async (route) => {
        payload = route.request().postDataJSON();
        await route.fulfill({ json: { success: true } });
      });
      await page.goto(path);
      for (const id of ["#marketingEmail", "#marketingPhone"]) {
        await expect(page.locator(id)).not.toBeChecked();
        await expect(page.locator(id)).not.toHaveAttribute("required", "");
      }
      await expect(page.locator("#commercial-consent-help")).toContainText(locale === "fr" ? "n’empêche pas" : "does not prevent");
      await fillContact(page);
      await page.locator("#marketingEmail").check();
      await expect(page.locator("#marketingPhone")).not.toBeChecked();
      await expect(page.locator("#phone")).toBeHidden();
      await expect(page.locator("#phone")).not.toHaveAttribute("required", "");
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toHaveAttribute("data-state", "success");
      expect(payload).toMatchObject({ marketingEmail: true, marketingPhone: false, phone: "", consentVersion: "commercial-2026-09-06-v1", consentLocale: locale });
      expect(payload?.consentCollectedAt).toMatch(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/);
    });

    test("telephone choice requires a valid number and resets without opting in email", async ({ page }) => {
      const payloads: Record<string, string | boolean>[] = [];
      await page.route("**/api/contact", async (route) => {
        payloads.push(route.request().postDataJSON());
        await route.fulfill({ json: { success: true } });
      });
      await page.goto(path);
      await fillContact(page);
      await page.locator("#marketingPhone").check();
      await expect(page.locator("#phone")).toBeVisible();
      await expect(page.locator("#phone")).toHaveAttribute("required", "");
      await expect(page.locator("#marketingEmail")).not.toBeChecked();
      await page.locator("#marketingPhone").uncheck();
      await expect(page.locator("#phone")).toBeHidden();
      await expect(page.locator("#phone")).not.toHaveAttribute("required", "");
      await page.locator("#marketingPhone").check();
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      await expect(page.locator("#phone")).toBeFocused();
      expect(payloads).toHaveLength(0);
      await page.locator("#phone").fill("x");
      await page.locator("#submit-contact").click();
      expect(payloads).toHaveLength(0);
      await page.locator("#phone").fill("+33 6 00 00 00 00");
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toHaveAttribute("data-state", "success");
      expect(payloads[0]).toMatchObject({ marketingEmail: false, marketingPhone: true, phone: "+33 6 00 00 00 00" });
      await expect(page.locator("#marketingEmail")).not.toBeChecked();
      await expect(page.locator("#marketingPhone")).not.toBeChecked();
      await expect(page.locator("#phone")).toBeHidden();
      await expect(page.locator("#phone")).not.toHaveAttribute("required", "");
    });

    test("changing a commercial choice renews identity, while elapsed retry expiry blocks fetch", async ({ page }) => {
      const payloads: Record<string, string | boolean>[] = [];
      await page.clock.install();
      await page.route("**/api/contact", async (route) => {
        payloads.push(route.request().postDataJSON());
        await route.fulfill({ status: 500, json: { success: false, uncertain: true } });
      });
      await page.goto(path);
      await fillContact(page);
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toHaveAttribute("data-state", "error");
      await page.clock.fastForward(1000);
      await page.locator("#marketingEmail").check();
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toHaveAttribute("data-state", "error");
      expect(payloads[1]?.requestId).not.toBe(payloads[0]?.requestId);
      expect(payloads[1]?.consentCollectedAt).not.toBe(payloads[0]?.consentCollectedAt);
      const fixedWallTime = await page.evaluate(() => Date.now());
      await page.clock.fastForward(23 * 60 * 60 * 1000);
      await page.clock.setSystemTime(fixedWallTime);
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toContainText(locale === "fr" ? "éviter un doublon" : "avoid a duplicate");
      expect(payloads).toHaveLength(2);
      // A further click cannot silently create a new identity or collection date.
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toContainText(locale === "fr" ? "éviter un doublon" : "avoid a duplicate");
      expect(payloads).toHaveLength(2);
      await expect(page.locator("#marketingEmail")).toBeChecked();
      await expect(page.locator("#message")).toBeEnabled();
      // A deliberately new enquiry then exercises sleep: wall time moves, elapsed time does not.
      await page.locator("#message").fill("Different synthetic enquiry; never delivered.");
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toHaveAttribute("data-state", "error");
      expect(payloads).toHaveLength(3);
      const beforeSleep = await page.evaluate(() => ({ wall: Date.now(), elapsed: performance.now() }));
      await page.clock.setSystemTime(beforeSleep.wall + 24 * 60 * 60 * 1000);
      expect(await page.evaluate(() => performance.now()) - beforeSleep.elapsed).toBeLessThan(60_000);
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toContainText(locale === "fr" ? "éviter un doublon" : "avoid a duplicate");
      expect(payloads).toHaveLength(3);
    });
  });
}
