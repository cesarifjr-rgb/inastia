import { test, expect, type Page } from "@playwright/test";
import { ANALYTICS_ID } from "../src/analytics.ts";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:4100");
test.skip(!["localhost", "127.0.0.1", "[::1]"].includes(base.hostname), "Analytics test traffic is intercepted locally.");
const consentKey = "inastia-measurement-consent-v1";

async function queue(page: Page) {
  return page.evaluate(() => (window.dataLayer || []).map((item) => Array.from(item)));
}

test.beforeEach(async ({ page }) => {
  await page.route("**/*", (route) => new URL(route.request().url()).origin === base.origin
    ? route.continue() : route.fulfill({ contentType: "application/javascript", body: "" }));
});

for (const locale of ["fr", "en"]) {
  test(`${locale}: Analytics works independently of Ads, sanitizes URLs and stops after withdrawal`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${locale === "fr" ? "/" : "/en/"}?email=private@example.invalid&gclid=synthetic_click_12345#private-message`);
    await expect(page.locator("script[src*='googletagmanager']")).toHaveCount(0);
    await page.locator(".consent-preferences summary").click();
    await page.locator("#consent-analytics").check();
    await page.locator('[data-ads-choice="save"]').click();
    await expect(page.locator(`script[src$='id=${ANALYTICS_ID}']`)).toHaveCount(1);
    const commands = await queue(page);
    expect(commands.filter(item => item[0] === "config").map(item => item[1])).toEqual([ANALYTICS_ID]);
    expect(commands.find(item => item[0] === "consent" && item[1] === "update")?.[2]).toMatchObject({ analytics_storage: "granted", ad_storage: "denied" });
    expect(JSON.stringify(commands)).not.toContain("private");
    expect(JSON.stringify(commands)).not.toContain("synthetic_click");
    expect(await page.evaluate(() => localStorage.getItem("inastia-ads-click-v1"))).toBeNull();
    await page.locator(`.site-footer a[href='${locale === "fr" ? "/contact" : "/en/contact"}']`).click();
    await page.locator("#firstName").fill("PrivateName");
    await page.locator("#lastName").fill("PrivateSurname");
    await page.locator("#message").fill("Confidential message");
    expect((await queue(page)).filter(item => item[1] === "form_start")).toHaveLength(1);
    expect(JSON.stringify(await queue(page))).not.toContain("PrivateName");
    expect(JSON.stringify(await queue(page))).not.toContain("Confidential message");
    await page.context().addCookies([{ name: "_ga", value: "synthetic", url: base.origin }, { name: "_ga_ZQWEB3WMM4", value: "synthetic", url: base.origin }]);
    await page.locator("#ads-consent-settings").click();
    await page.locator('[data-ads-choice="reject"]').click();
    expect(await page.evaluate((id) => window[`ga-disable-${id}`], ANALYTICS_ID)).toBe(true);
    expect((await page.context().cookies()).filter(cookie => cookie.name.startsWith("_ga"))).toEqual([]);
    await page.reload();
    await expect(page.locator("#ads-consent")).toBeHidden();
    await expect(page.locator("script[src*='googletagmanager']")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("old Ads acceptance does not grant Analytics consent or renew its timestamp", async ({ page }) => {
  const at = Date.now() - 10000;
  await page.addInitScript(value => localStorage.setItem("inastia-ads-consent-v2", JSON.stringify({ accepted: true, at: value })), at);
  await page.goto("/");
  await expect(page.locator("#ads-consent")).toBeVisible();
  expect((await queue(page)).filter(item => item[0] === "config").map(item => item[1])).toEqual(["AW-18439914063"]);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("inastia-ads-consent-v2")!).at)).toBe(at);
  await page.locator(".consent-preferences summary").click();
  await expect(page.locator("#consent-advertising")).toBeChecked();
  await expect(page.locator("#consent-analytics")).not.toBeChecked();
  await page.locator('[data-ads-choice="save"]').click();
  expect(await page.evaluate(() => localStorage.getItem("inastia-ads-consent-v2"))).toBeNull();
  await page.reload();
  await expect(page.locator("#ads-consent")).toBeHidden();
  expect((await queue(page)).filter(item => item[0] === "config").map(item => item[1])).toEqual(["AW-18439914063"]);
});

test("all-purpose consent preserves validated click attribution and configures GA once", async ({ page }) => {
  await page.goto("/?gclid=synthetic_click_12345&email=private@example.invalid");
  await page.locator('[data-ads-choice="accept"]').click();
  expect((await queue(page)).filter(item => item[0] === "config").map(item => item[1])).toEqual(["AW-18439914063", ANALYTICS_ID]);
  expect(JSON.stringify(await queue(page))).toContain("gclid=synthetic_click_12345");
  expect(JSON.stringify(await queue(page))).not.toContain("private@example.invalid");
  await page.locator("#ads-consent-settings").click();
  await page.locator("#consent-advertising").uncheck();
  await page.locator('[data-ads-choice="save"]').click();
  expect((await queue(page)).filter(item => item[0] === "config" && item[1] === ANALYTICS_ID)).toHaveLength(1);
  expect((await queue(page)).filter(item => item[0] === "set" && typeof item[1] === "object").at(-1)?.[1]).toMatchObject({ page_location: `${base.origin}/` });
  expect(await page.evaluate(() => localStorage.getItem("inastia-ads-click-v1"))).toBeNull();
});

test("Analytics-only enquiry records a lead only after confirmed success and never sends an Ads conversion", async ({ page }) => {
  await page.addInitScript((key) => {
    localStorage.setItem(key, JSON.stringify({ ads: false, analytics: true, at: Date.now() }));
    Object.assign(window, { turnstile: {
      render: (_element: HTMLElement, options: { callback: (token: string) => void }) => {
        Object.assign(window, { __solve: () => options.callback("synthetic-token") });
        return "synthetic-widget";
      }, reset: () => {},
    } });
  }, consentKey);
  let succeed = false;
  await page.route("**/api/contact", route => route.fulfill({ status: succeed ? 200 : 503,
    contentType: "application/json", body: JSON.stringify({ success: succeed }) }));
  await page.goto("/contact");
  await page.locator("#firstName").fill("Synthetic");
  await page.locator("#lastName").fill("Test");
  await page.locator("#email").fill("analytics-test@example.invalid");
  await page.locator("#location").fill("Solenzara");
  await page.locator("#decisionRole").selectOption("proprietaire");
  await page.locator("#propertyType").selectOption("Villa");
  await page.evaluate(() => (window as unknown as { __solve: () => void }).__solve());
  await page.locator("#submit-contact").click();
  await expect(page.locator("#form-status")).toHaveAttribute("data-state", "error");
  expect((await queue(page)).filter(item => item[1] === "generate_lead")).toEqual([]);
  succeed = true;
  await page.evaluate(() => (window as unknown as { __solve: () => void }).__solve());
  await page.locator("#submit-contact").click();
  await expect(page.locator("#form-status")).toHaveAttribute("data-state", "success");
  await page.locator("#contact-form").dispatchEvent("submit");
  expect((await queue(page)).filter(item => item[1] === "generate_lead")).toEqual([["event", "generate_lead", { send_to: ANALYTICS_ID, form_id: "contact-form" }]]);
  expect((await queue(page)).filter(item => item[1] === "conversion")).toEqual([]);
  expect(JSON.stringify(await queue(page))).not.toContain("analytics-test@example.invalid");
});

test("withdrawal in another tab stops Analytics on the current page", async ({ page, context }) => {
  await page.goto("/");
  await page.locator('[data-ads-choice="accept"]').click();
  const other = await context.newPage();
  await other.route("**/*", route => new URL(route.request().url()).origin === base.origin
    ? route.continue() : route.fulfill({ contentType: "application/javascript", body: "" }));
  await other.goto("/contact");
  await other.locator("#ads-consent-settings").click();
  await other.locator('[data-ads-choice="reject"]').click();
  await expect.poll(() => page.evaluate((id) => window[`ga-disable-${id}`], ANALYTICS_ID)).toBe(true);
  expect((await queue(page)).filter(item => item[0] === "consent").at(-1)?.[2]).toMatchObject({ analytics_storage: "denied", ad_storage: "denied" });
});
