import { test, expect, type Page } from "@playwright/test";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:4100");
test.skip(!["localhost", "127.0.0.1", "[::1]"].includes(base.hostname), "Synthetic conversions run only on the local intercepted site.");
const consentKey = "inastia-ads-consent-v1";

async function queue(page: Page) {
  return page.evaluate(() => (window.dataLayer || []).map((item) => Array.from(item)));
}

test.beforeEach(async ({ page }) => {
  // No Google request or email leaves these tests.
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.origin === base.origin) return route.continue();
    return route.fulfill({ contentType: "application/javascript", body: "" });
  });
});

for (const locale of ["fr", "en"]) {
  test(`${locale}: no tag before consent or after a persisted refusal`, async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (request) => { if (request.url().includes("googletagmanager.com")) requests.push(request.url()); });
    await page.goto(locale === "fr" ? "/" : "/en/");
    await expect(page.locator("#ads-consent")).toBeVisible();
    await expect(page.locator("script[src*='googletagmanager']")).toHaveCount(0);
    await page.locator('[data-ads-choice="reject"]').click();
    await page.goto(locale === "fr" ? "/contact" : "/en/contact");
    await expect(page.locator("#ads-consent")).toBeHidden();
    expect(await queue(page)).toEqual([]);
    expect(requests).toEqual([]);
    await page.locator("#ads-consent-settings").click();
    await expect(page.locator("#ads-consent")).toBeFocused();
    await page.locator('[data-ads-choice="accept"]').click();
    expect(requests).toHaveLength(1);
    const commands = await queue(page);
    expect(commands[0]).toEqual(["consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" }]);
    expect(commands[1]).toEqual(["consent", "update", { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "denied", analytics_storage: "denied" }]);
    await page.context().addCookies([{ name: "_gcl_aw", value: "synthetic", url: base.origin }]);
    await page.locator("#ads-consent-settings").click();
    await page.locator('[data-ads-choice="reject"]').click();
    expect((await queue(page)).at(-1)?.slice(0, 2)).toEqual(["consent", "update"]);
    expect((await page.context().cookies()).some((item) => item.name === "_gcl_aw")).toBe(false);
    await page.reload();
    await expect(page.locator("script[src*='googletagmanager']")).toHaveCount(0);
    expect(requests).toHaveLength(1);
  });
}

test("expired consent and storage failure keep the site usable", async ({ page }) => {
  await page.addInitScript((key) => window.localStorage.setItem(key, JSON.stringify({ accepted: true, at: Date.now() - 181 * 86400000 })), consentKey);
  await page.goto("/contact");
  await expect(page.locator("#ads-consent")).toBeVisible();
  expect(await queue(page)).toEqual([]);
  await page.evaluate(() => { Object.defineProperty(globalThis.Storage.prototype, "setItem", { value: () => { throw new Error("Synthetic storage failure"); } }); });
  await page.locator('[data-ads-choice="reject"]').click();
  await expect(page.locator("#contact-form")).toBeVisible();
  expect(await queue(page)).toEqual([]);
});

for (const consent of [false, true]) {
  test(`confirmed enquiry only, consent=${consent}, with retry and duplicate protection`, async ({ page }) => {
    await page.addInitScript(() => {
      Object.assign(window, { turnstile: {
        render: (_element: HTMLElement, options: { callback: (token: string) => void }) => {
          Object.assign(window, { __solve: () => options.callback("synthetic-token") });
          return "synthetic-widget";
        },
        reset: () => {},
      } });
    });
    const payloads: Record<string, unknown>[] = [];
    let succeed = false;
    await page.route("**/api/contact", (route) => {
      payloads.push(route.request().postDataJSON());
      return route.fulfill({ status: succeed ? 200 : 503, contentType: "application/json", body: JSON.stringify({ success: succeed }) });
    });
    await page.goto("/contact?intent=gestion");
    await page.locator(`[data-ads-choice="${consent ? "accept" : "reject"}"]`).click();
    await page.locator("#firstName").fill("Synthetic");
    await page.locator("#email").fill("ads-test@example.invalid");
    await page.locator("#location").fill("Solenzara");
    await page.locator("#propertyType").selectOption("Villa");
    await page.evaluate(() => (window as unknown as { __solve: () => void }).__solve());
    await page.locator("#submit-contact").click();
    await expect(page.locator("#form-status")).toHaveAttribute("data-state", "error");
    expect((await queue(page)).filter((item) => item[0] === "event")).toEqual([]);
    succeed = true;
    await page.evaluate(() => (window as unknown as { __solve: () => void }).__solve());
    await page.locator("#submit-contact").click();
    await expect(page.locator("#form-status")).toHaveAttribute("data-state", "success");
    expect(payloads[1]?.requestId).toBe(payloads[0]?.requestId);
    const conversions = (await queue(page)).filter((item) => item[0] === "event");
    expect(conversions).toEqual(consent ? [["event", "conversion", { send_to: "AW-16573676464/BHALCNepqPAcELD3-N49", transaction_id: payloads[0]?.requestId }]] : []);
    expect(JSON.stringify(await queue(page))).not.toContain("ads-test@example.invalid");
    await page.locator("#contact-form").dispatchEvent("submit");
    expect(payloads).toHaveLength(2);
    expect((await queue(page)).filter((item) => item[0] === "event")).toHaveLength(consent ? 1 : 0);
    if (consent) {
      await page.locator("#ads-consent-settings").click();
      await page.locator('[data-ads-choice="reject"]').click();
      await page.locator("#form-reset").click();
      await page.locator("#firstName").fill("Another");
      await page.locator("#email").fill("another@example.invalid");
      await page.locator("#location").fill("Zonza");
      await page.locator("#propertyType").selectOption("Maison");
      await page.evaluate(() => (window as unknown as { __solve: () => void }).__solve());
      await page.locator("#submit-contact").click();
      await expect(page.locator("#form-status")).toHaveAttribute("data-state", "success");
      expect((await queue(page)).filter((item) => item[0] === "event")).toHaveLength(1);
    }
  });
}
