import { test, expect, type Page } from "@playwright/test";
import { fillQualification } from "./helpers/qualification.ts";

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
  await fillQualification(page);
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
      await page.evaluate(() => window.__solveChallenge());
      const surname = page.locator("#lastName");
      await expect(surname).not.toHaveAttribute("required", "");
      await expect(surname).toHaveAccessibleName(locale === "fr" ? "Nom (facultatif)" : "Last name (optional)");
      await surname.fill("");
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toHaveAttribute("data-state", "success");
      expect(payload).toMatchObject({ intent: "gestion", contactPreference: "email", lastName: "", phone: "", locale });
    });

    test("phone reply requirement survives simulated success/reset", async ({ page }) => {
      let requests = 0;
      await page.route("**/api/contact", async (route) => {
        requests += 1;
        expect(route.request().postDataJSON()).toMatchObject({ intent: "gestion", contactPreference: "phone", phone: "+33 6 00 00 00 00" });
        await route.fulfill({ json: { success: true } });
      });
      await page.goto(path);
      const phone = page.locator("#phone");
      await expect(page.locator("#contact-preference-field")).toBeVisible();
      await expect(phone).toBeHidden();
      await page.locator("#contactPreference").selectOption("phone");
      await expect(phone).toHaveAttribute("required", "");
      await expect(phone).toHaveAccessibleName(locale === "fr" ? "Téléphone *" : "Phone *");
      await fillContact(page);
      await phone.fill("");
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      await expect(phone).toBeFocused();
      expect(requests).toBe(0);
      await phone.fill("+33 6 00 00 00 00");
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toHaveAttribute("data-state", "success");
      await expect(page.locator("#contact-intent")).toHaveValue("gestion");
      await expect(phone).toHaveAttribute("required", "");
      await expect(page.locator("#contactPreference")).toHaveValue("phone");
      await expect(page.locator("#submit-contact")).toBeDisabled();
      await page.locator("#form-reset").click();
      await expect(page.locator("#contact-intent")).toHaveValue("gestion");
      await expect(phone).toHaveAttribute("required", "");
      await expect(page.locator("#submit-contact")).toBeEnabled();
      await page.locator("#contactPreference").selectOption("email");
      await expect(phone).not.toHaveAttribute("required", "");
      await expect(phone).toBeHidden();
      expect(requests).toBe(1);
    });

    for (const intent of ["gestion", "annonce", "rotation", "", "%3Cscript%3E"]) {
      test(`${intent || "direct contact"} defaults to management through a simulated confirmation`, async ({ page }) => {
        let payload: Record<string, string> | undefined;
        await page.route("**/api/contact", async (route) => {
          payload = route.request().postDataJSON();
          await route.fulfill({ json: { success: true } });
        });
        await page.goto(intent ? `${path}?intent=${intent}` : path);
        const label = locale === "fr" ? "Demander ma proposition de gestion" : "Request my management proposal";
        await expect(page.locator("#contact-intent")).toHaveValue("gestion");
        await expect(page.locator("#contact-intent")).toBeVisible();
        await expect(page.locator('select[name="intent"]')).toHaveCount(1);
        await expect(page.locator("#contact-form-title")).toHaveText(label);
        await expect(page.locator("#submit-contact-label")).toHaveText(locale === "fr" ? "Envoyer mon projet de gestion" : "Send my management enquiry");
        await expect(page.locator("#contact-title")).toHaveText(locale === "fr" ? "Votre projet de gestion locative" : "Your rental management plans");
        await expect(page.locator("#contact-lead")).not.toContainText("24");
        await expect(page.locator("#phone")).toBeHidden();
        await expect(page.locator(".language-link")).toHaveAttribute(
          "href",
          new URL(`${locale === "fr" ? "/en/contact" : "/contact"}?intent=gestion`, base).href,
        );
        await fillContact(page);
        await expect(page.locator("#message-help")).toBeVisible();
        await expect(page.locator("#message")).toHaveAttribute("aria-describedby", "message-help");
        await page.evaluate(() => window.__solveChallenge());
        await page.locator("#submit-contact").click();
        await expect(page.locator("#form-status")).toHaveAttribute("data-state", "success");
        expect(payload?.intent).toBe("gestion");
        await expect(page.locator("#contact-intent")).toHaveValue("gestion");
        await expect(page.locator("#submit-contact-label")).toHaveText(locale === "fr" ? "Envoyer mon projet de gestion" : "Send my management enquiry");
      });
    }

    test("legacy link stays a management request after changing language", async ({ page }) => {
      await page.goto(`${path}?intent=annonce`);
      await page.locator(".language-link").click();
      await expect(page).toHaveURL(new URL(`${locale === "fr" ? "/en/contact" : "/contact"}?intent=gestion`, base).href);
      await expect(page.locator("#contact-intent")).toHaveValue("gestion");
      await expect(page.locator("#contact-form-title")).toHaveText(locale === "fr" ? "Request my management proposal" : "Demander ma proposition de gestion");
      await expect(page.locator("#phone")).toBeHidden();
    });

    test("without JavaScript the form offers audit explicitly without implying management", async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      try {
        await page.goto(new URL(`${path}?intent=audit`, base).href);
        await expect(page.locator('select[name="intent"]')).toHaveCount(1);
        await expect(page.locator("#contact-intent")).toHaveValue("");
        await expect(page.locator('#contact-intent option[value="audit"]')).toHaveText(locale === "fr" ? "Audit gratuit" : "Free property review");
        await expect(page.locator("#contact-form-title")).toHaveText(locale === "fr" ? "Présentez-nous votre projet" : "Tell us about your plans");
      } finally {
        await context.close();
      }
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
          locale,
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
        locale === "fr" ? "bien été transmis" : "has been sent",
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
      for (const field of ["#message", "#email", "#propertyType", "#contact-intent"]) {
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
      for (const [name, value] of [["propertyArea", "Pinarello"], ["decisionRole", "acquereur"], ["rentalSituation", "reflexion"], ["startTimeline", "adefinir"]]) {
        const field = page.locator(`#${name}`);
        if (name === "propertyArea") await field.fill("   ");
        else await field.selectOption("");
        await page.locator("#submit-contact").click();
        await expect(field).toBeFocused();
        expect(requests).toBe(0);
        if (name === "propertyArea") await field.fill(value!);
        else await field.selectOption(value!);
      }
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

    for (const channel of ["email", "phone"]) {
      test(`post-submission ${channel} preferences are separate, retryable and optional`, async ({ page }) => {
        let enquiries = 0;
        const choices: Record<string, unknown>[] = [];
        await page.route("**/api/contact", async route => {
          enquiries++;
          const payload = route.request().postDataJSON();
          expect(payload.marketingEmail).toBeUndefined();
          expect(payload.marketingPhone).toBeUndefined();
          await route.fulfill({ json: { success: true, preferencesReceipt: "synthetic-receipt" } });
        });
        await page.route("**/api/contact-preferences", async route => {
          choices.push(route.request().postDataJSON());
          await route.fulfill({ status: choices.length === 1 ? 503 : 200, json: { success: choices.length > 1 } });
        });
        await page.goto(path);
        await expect(page.locator("#contact-preferences")).toBeHidden();
        await fillContact(page);
        await page.evaluate(() => window.__solveChallenge());
        await page.locator("#submit-contact").click();
        await expect(page.locator("#contact-preferences")).toBeVisible();
        await expect(page.locator("#marketingEmail")).not.toBeChecked();
        await expect(page.locator("#marketingPhone")).not.toBeChecked();
        const selected = channel === "email" ? "#marketingEmail" : "#marketingPhone";
        await page.locator(selected).check();
        const field = page.locator(`#preference-${channel}`);
        await expect(field).toHaveAttribute("required", "");
        await field.fill("");
        await page.locator("#contact-preferences button").click();
        await expect(field).toBeFocused();
        expect(choices).toHaveLength(0);
        await field.fill(channel === "email" ? "preference@example.invalid" : "+33 6 00 00 00 00");
        await page.locator("#contact-preferences button").click();
        await expect(page.locator("#preferences-status")).toContainText(locale === "fr" ? "pas été confirmée" : "could not be confirmed");
        await expect(page.locator("#form-status")).toHaveAttribute("data-state", "success");
        await expect(page.locator(selected)).toBeChecked();
        await page.locator("#contact-preferences button").click();
        await expect(page.locator("#preferences-status")).toContainText(locale === "fr" ? "transmis à notre équipe" : "sent to our team");
        expect(choices).toHaveLength(2);
        expect(choices[1]).toEqual(choices[0]);
        expect(choices[0]).toMatchObject({ receipt: "synthetic-receipt", marketingEmail: channel === "email", marketingPhone: channel === "phone" });
        expect(enquiries).toBe(1);
        await expect(page.locator("#contact-preferences button")).toBeDisabled();
        await page.locator("#form-reset").click();
        await expect(page.locator("#contact-preferences")).toBeHidden();
      });
    }

    test("changing the enquiry renews identity, while elapsed retry expiry blocks fetch", async ({ page }) => {
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
      await page.locator("#message").fill("Updated synthetic enquiry");
      await page.evaluate(() => window.__solveChallenge());
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toHaveAttribute("data-state", "error");
      expect(payloads[1]?.requestId).not.toBe(payloads[0]?.requestId);

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
      await expect(page.locator("#contact-preferences")).toBeHidden();
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
