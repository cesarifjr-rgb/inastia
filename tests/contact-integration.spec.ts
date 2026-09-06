import { test, expect } from "@playwright/test";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:4100");
test.skip(!["localhost", "127.0.0.1", "[::1]"].includes(base.hostname), "Integration submits only to a local intercepted route.");

for (const lostResponse of [false, true]) {
  test(lostResponse ? "contact client retries the real handler after ambiguous provider acceptance" : "contact client and real handler accept a verified enquiry", async ({ page }) => {
    // Load the unchanged JavaScript handler through its module URL.
    const { default: handler } = await import(new URL("../api/contact.js", import.meta.url).href);
    const providerCalls: { url: string; body: string; key: string | null }[] = [];
    const clientPayloads: Record<string, string>[] = [];
    const replies: { status: number; body: unknown }[] = [];
    let emailAttempts = 0;
    let challengeGeneration = 0;

    await page.addInitScript(() => {
      let generation = 0;
      Object.assign(window, {
        turnstile: {
          render: (container: HTMLElement, options: { callback: (token: string) => void }) => {
            container.textContent = "Synthetic local verification";
            Object.assign(window, { __integrationSolve: () => options.callback("synthetic-challenge-" + generation) });
            return "synthetic-widget";
          },
          reset: () => { generation += 1; },
        },
      });
    });
    await page.route("**/*", async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.origin === base.origin && url.pathname === "/api/contact") {
        expect(request.method()).toBe("POST");
        const payload = request.postDataJSON();
        clientPayloads.push(payload);
        const originalFetch = globalThis.fetch;
        const previousSecret = process.env.TURNSTILE_SECRET_KEY;
        const previousKey = process.env.RESEND_API_KEY;
        // Synthetic process values only; no .env file or live configuration is loaded.
        process.env.TURNSTILE_SECRET_KEY = "synthetic-integration-secret";
        process.env.RESEND_API_KEY = "synthetic-integration-key";
        globalThis.fetch = async (input, options) => {
          const target = String(input);
          const body = String(options?.body || "");
          const headers = new Headers(options?.headers);
          providerCalls.push({ url: target, body, key: headers.get("Idempotency-Key") });
          if (target === "https://challenges.cloudflare.com/turnstile/v0/siteverify") {
            expect(JSON.parse(body).response).toBe("synthetic-challenge-" + challengeGeneration++);
            return Response.json({ success: true, hostname: "inastia.fr" });
          }
          if (target === "https://api.resend.com/emails") {
            emailAttempts += 1;
            if (lostResponse && emailAttempts === 1) throw new Error("Synthetic lost response after provider acceptance");
            return Response.json({ id: "fa64e6ef-875e-4e75-b9a1-593bdedb2629" });
          }
          throw new Error("Unexpected external request blocked");
        };
        let status = 200;
        let body: unknown;
        const response = {
          status(value: number) { status = value; return this; },
          json(value: unknown) { body = value; return this; },
        };
        try {
          await handler({ method: "POST", headers: { host: base.host, origin: base.origin }, body: payload }, response);
        } finally {
          globalThis.fetch = originalFetch;
          if (previousSecret === undefined) delete process.env.TURNSTILE_SECRET_KEY;
          else process.env.TURNSTILE_SECRET_KEY = previousSecret;
          if (previousKey === undefined) delete process.env.RESEND_API_KEY;
          else process.env.RESEND_API_KEY = previousKey;
        }
        replies.push({ status, body });
        await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
        return;
      }
      if (url.origin === base.origin && ["GET", "HEAD"].includes(request.method())) {
        await route.continue();
      } else {
        await route.abort();
      }
    });

    await page.goto("/contact?intent=audit");
    await page.locator("#propertyType").selectOption("Villa");
    await page.locator("#location").fill("Ville de test");
    await page.locator("#firstName").fill("Exemple");
    await page.locator("#lastName").fill("Synthétique");
    await page.locator("#email").fill("integration@example.com");
    await page.locator("#phone").fill("+33 6 00 00 00 00");
    await page.locator("#message").fill("Synthetic integration enquiry — never delivered.");
    await page.evaluate("window.__integrationSolve()");
    await page.locator("#submit-contact").click();

    if (lostResponse) {
      await expect(page.locator("#form-status")).toHaveAttribute("data-state", "error");
      await expect(page.locator("#form-status")).toContainText("confirmation");
      expect(replies[0]).toMatchObject({ status: 500, body: { success: false, uncertain: true } });
      await expect(page.locator("#email")).toHaveValue("integration@example.com");
      await page.evaluate("window.__integrationSolve()");
      await page.locator("#submit-contact").click();
    }
    await expect(page.locator("#form-status")).toHaveAttribute("data-state", "success");
    expect(replies.at(-1)).toMatchObject({ status: 200, body: { success: true, requestId: clientPayloads.at(-1)?.requestId } });
    const emails = providerCalls.filter((call) => call.url === "https://api.resend.com/emails");
    expect(emails).toHaveLength(lostResponse ? 2 : 1);
    expect(emails[0]?.key).toBe("contact/" + clientPayloads[0]?.requestId);
    expect(JSON.parse(emails[0]?.body || "{}")).toMatchObject({ reply_to: "integration@example.com", to: "contact@inastia.fr" });
    if (lostResponse) {
      expect(clientPayloads[1]?.requestId).toBe(clientPayloads[0]?.requestId);
      expect(clientPayloads[1]?.turnstileToken).not.toBe(clientPayloads[0]?.turnstileToken);
      expect(emails[1]?.key).toBe(emails[0]?.key);
      expect(emails[1]?.body).toBe(emails[0]?.body);
    }
    expect(providerCalls).toHaveLength(lostResponse ? 4 : 2);
  });
}
