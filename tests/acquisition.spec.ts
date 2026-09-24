import { test, expect, type Page } from "@playwright/test";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:4100");
test.skip(!["localhost", "127.0.0.1", "[::1]"].includes(base.hostname), "Only local fixtures may submit enquiries.");
const key = "inastia-acquisition-v1";
const campaign = "utm_source=google&utm_medium=organic&utm_campaign=google_business_profile";
const saved = (page: Page) => page.evaluate(k => JSON.parse(sessionStorage.getItem(k) || "null"), key);
const commands = (page: Page) => page.evaluate(() => (window.dataLayer || []).map(item => Array.from(item)));
async function consent(page: Page) {
  await page.locator(".consent-preferences summary").click();
  await page.locator("#consent-analytics").check();
  await page.locator('[data-ads-choice="save"]').click();
}

test.beforeEach(async ({ page }) => {
  await page.route("**/*", route => new URL(route.request().url()).origin === base.origin
    ? route.continue() : route.fulfill({ contentType: "application/javascript", body: "" }));
});

for (const locale of ["fr", "en"]) {
  test(`${locale}: GBP survives a service-page visit and language change through a confirmed form`, async ({ page }) => {
    await page.addInitScript(() => Object.assign(window, { turnstile: {
      render: (_element: HTMLElement, options: { callback: (token: string) => void }) => {
        Object.assign(window, { __gbpSolve: () => options.callback("synthetic-token") });
        return "synthetic-widget";
      }, reset: () => {},
    } }));
    let payload: Record<string, unknown> | undefined;
    await page.route("**/api/contact", route => {
      payload = route.request().postDataJSON();
      return route.fulfill({ status: 202, json: { success: true, status: "registered" } });
    });
    const prefix = locale === "en" ? "/en" : "";
    await page.goto(`${prefix}/?${campaign}&email=private@example.invalid&utm_content=private-name#private`);
    expect(await saved(page)).toBeNull();
    await consent(page);
    const initial = await saved(page);
    expect(initial).toMatchObject({ consent: true, source: "google_business_profile" });
    expect((await commands(page)).find(item => item[0] === "set" && typeof item[1] === "object")?.[1]).toMatchObject({ page_location: `${base.origin}${prefix}/?${campaign}` });
    expect(JSON.stringify(await commands(page))).not.toContain("private");
    await page.locator(`.site-footer a[href='${prefix}/gestion-airbnb-corse-du-sud']`).click();
    expect(await saved(page)).toEqual(initial);
    await page.locator(".header-cta").click();
    await page.locator(".site-header .language-link").click();
    await page.reload();
    expect(await saved(page)).toEqual(initial);
    await page.locator("#firstName").fill("Synthetic");
    await page.locator("#lastName").fill("Test");
    await page.locator("#email").fill("private@example.invalid");
    await page.locator("#propertyType").selectOption("Villa");
    await page.locator("#location").fill("Solenzara");
    await page.locator("#propertyArea").fill("Test area");
    await page.evaluate(() => (window as unknown as { __gbpSolve: () => void }).__gbpSolve());
    await page.locator("#submit-contact").click();
    await expect(page.locator("#form-status")).toHaveAttribute("data-state", "success");
    expect(payload?.acquisition).toEqual(initial);
    expect(payload).not.toHaveProperty("googleAdsGclid");
    const events = (await commands(page)).filter(item => item[0] === "event");
    expect(events.filter(item => item[1] === "generate_lead")).toHaveLength(1);
    expect(events.filter(item => item[1] === "conversion")).toHaveLength(0);
    expect(JSON.stringify(events)).not.toContain("private@example.invalid");
  });
}

test("refusal and Ads-only consent never capture GBP; withdrawal clears it", async ({ page }) => {
  await page.goto(`/?${campaign}`);
  await page.locator('[data-ads-choice="reject"]').click();
  expect(await saved(page)).toBeNull();
  await page.locator("#ads-consent-settings").click();
  await page.locator("#consent-advertising").check();
  await page.locator('[data-ads-choice="save"]').click();
  expect(await saved(page)).toBeNull();
  await page.locator("#ads-consent-settings").click();
  await page.locator("#consent-analytics").check();
  await page.locator('[data-ads-choice="save"]').click();
  expect(await saved(page)).toMatchObject({ source: "google_business_profile" });
  await page.locator("#ads-consent-settings").click();
  await page.locator('[data-ads-choice="reject"]').click();
  expect(await saved(page)).toBeNull();
});

test("reload preserves the timestamp and the source expires after 30 minutes", async ({ page }) => {
  await page.clock.install();
  await page.goto(`/?${campaign}`);
  await consent(page);
  const initial = await saved(page);
  await page.clock.fastForward(60000);
  await page.reload();
  expect(await saved(page)).toEqual(initial);
  await page.locator(".header-cta").click();
  await page.clock.fastForward(30 * 60 * 1000);
  expect(await saved(page)).toBeNull();
});

test("a different campaign or advertising click clears an earlier GBP origin", async ({ page }) => {
  for (const next of ["utm_source=newsletter&utm_medium=email", "gclid=synthetic_click_12345"]) {
    await page.goto(`/?${campaign}`);
    if (await page.locator("#ads-consent").isVisible()) await consent(page);
    expect(await saved(page)).toMatchObject({ source: "google_business_profile" });
    await page.goto(`/?${next}`);
    expect(await saved(page)).toBeNull();
    expect(JSON.stringify(await commands(page))).not.toContain("utm_source=");
  }
});

test("unavailable session storage does not prevent navigation to the form", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new Error("Storage blocked"); };
  });
  await page.goto(`/?${campaign}`);
  await consent(page);
  await page.locator(".header-cta").click();
  await expect(page.locator("#contact-form")).toBeVisible();
  expect(await saved(page)).toBeNull();
});
