import { test, expect } from "@playwright/test";
import { fillQualification } from "./helpers/qualification.ts";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:4100");
test.skip(!["localhost", "127.0.0.1", "[::1]"].includes(base.hostname), "All submissions are local and provider requests are intercepted.");

for (const locale of ["fr", "en"]) {
  test(`${locale}: accepted enquiry receipt connects preference UI to handler without another conversion`, async ({ page }) => {
    const { default: contact } = await import(new URL("../api/contact.js", import.meta.url).href);
    const { default: preferences } = await import(new URL("../api/contact-preferences.js", import.meta.url).href);
    const mails: { key: string | null; html: string }[] = [];
    const payloads: Record<string, unknown>[] = [];
    await page.addInitScript(() => {
      localStorage.setItem("inastia-measurement-consent-v1", JSON.stringify({ ads: true, analytics: true, at: Date.now() }));
      Object.assign(window, { turnstile: { render: (_node: HTMLElement, options: { callback: (token: string) => void }) => {
        Object.assign(window, { __solvePreferences: () => options.callback("synthetic-token") });
        return "synthetic-widget";
      }, reset: () => {} } });
    });
    await page.route("**/*", async route => {
      const url = new URL(route.request().url());
      if (url.origin !== base.origin) return route.fulfill({ contentType: "application/javascript", body: "" });
      if (!["/api/contact", "/api/contact-preferences"].includes(url.pathname)) return route.continue();
      const originalFetch = globalThis.fetch;
      const previousEnv = { TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY, RESEND_API_KEY: process.env.RESEND_API_KEY,
        ATTIO_API_KEY: process.env.ATTIO_API_KEY, VERCEL_ENV: process.env.VERCEL_ENV };
      Object.assign(process.env, { TURNSTILE_SECRET_KEY: "synthetic-secret", RESEND_API_KEY: "synthetic-key", ATTIO_API_KEY: "", VERCEL_ENV: "production" });
      globalThis.fetch = async (target, options) => {
        if (String(target) === "https://challenges.cloudflare.com/turnstile/v0/siteverify") return Response.json({ success: true, hostname: "inastia.fr" });
        if (String(target) !== "https://api.resend.com/emails") throw new Error("Unexpected request blocked");
        mails.push({ key: new Headers(options?.headers).get("Idempotency-Key"), html: JSON.parse(String(options?.body)).html });
        return Response.json({ id: "fa64e6ef-875e-4e75-b9a1-593bdedb2629" });
      };
      let status = 200;
      let body: unknown;
      const response = { setHeader: () => {}, status(code: number) { status = code; return this; }, json(data: unknown) { body = data; return this; } };
      const payload = route.request().postDataJSON();
      payloads.push(payload);
      try {
        await (url.pathname === "/api/contact" ? contact : preferences)({ method: "POST", headers: { host: base.host, origin: base.origin }, body: payload }, response);
      } finally {
        globalThis.fetch = originalFetch;
        for (const [key, value] of Object.entries(previousEnv)) {
          if (value === undefined) delete process.env[key];
          else process.env[key] = value;
        }
      }
      await route.fulfill({ status, json: body });
    });
    await page.goto(`${locale === "en" ? "/en" : ""}/contact?intent=gestion`);
    await page.locator("#propertyType").selectOption("Villa");
    await page.locator("#location").fill("Lecci");
    await fillQualification(page);
    await page.locator("#firstName").fill("Synthetic");
    await page.locator("#email").fill("test@example.invalid");
    await expect(page.locator("#contact-preferences")).toBeHidden();
    await page.evaluate("window.__solvePreferences()");
    await page.locator("#submit-contact").click();
    await expect(page.locator("#contact-preferences")).toBeVisible();
    const before = await page.evaluate(() => (window.dataLayer || []).filter(item => ["generate_lead", "conversion"].includes(String(item[1]))).map(item => Array.from(item)));
    expect(before).toHaveLength(2);
    await expect(page.locator("#marketingEmail")).not.toBeChecked();
    await expect(page.locator("#marketingPhone")).not.toBeChecked();
    await page.locator("#marketingPhone").check();
    await page.locator("#preference-phone").fill("+33 6 00 00 00 00");
    await page.locator("#contact-preferences button").click();
    await expect(page.locator("#preferences-status")).toContainText(locale === "fr" ? "transmis à notre équipe" : "sent to our team");
    expect(mails).toHaveLength(2);
    expect(mails[0]?.key).toMatch(/^contact\//);
    expect(mails[1]?.key).toMatch(/^preferences\//);
    expect(mails[1]?.html).toContain(String(payloads[0]?.requestId));
    expect(mails[1]?.html).toContain(`langue : ${locale}`);
    expect(mails[1]?.html).toContain("Email : Non");
    expect(mails[1]?.html).toContain("Téléphone : Oui, pendant un an maximum");
    expect(payloads[0]?.siteVersion).toBe("conversion-2026-09-20-a");
    expect(await page.evaluate(() => (window.dataLayer || []).filter(item => ["generate_lead", "conversion"].includes(String(item[1]))).map(item => Array.from(item)))).toEqual(before);
  });
}
