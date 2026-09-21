import { test, expect, type Page } from "@playwright/test";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:4100");
test.skip(!["localhost", "127.0.0.1", "[::1]"].includes(base.hostname), "Measurement and delivery are intercepted locally only.");
const key = "inastia-contact-journey-v1";
const events = (page: Page) => page.evaluate(() => (window.dataLayer || []).map(item => Array.from(item)).filter(item => item[0] === "event"));

test.beforeEach(async ({ page }) => {
  await page.route("**/*", route => new URL(route.request().url()).origin === base.origin
    ? route.continue() : route.fulfill({ contentType: "application/javascript", body: "" }));
});

async function consent(page: Page): Promise<void> {
  await page.locator(".consent-preferences summary").click();
  await page.locator("#consent-analytics").check();
  await page.locator('[data-ads-choice="save"]').click();
}

for (const locale of ["fr", "en"]) {
  const prefix = locale === "en" ? "/en" : "";
  test(`${locale}: CTA placements stay distinct across desktop and mobile navigation`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${prefix}/?email=private@example.invalid`);
    await consent(page);
    await page.evaluate(() => document.addEventListener("click", event => {
      if (event.target instanceof Element && event.target.closest('a[href*="/contact"]')) event.preventDefault();
    }));
    for (const [selector, placement] of [[".hero-actions .button", "hero"], [".header-cta", "header"],
      ["#tarifs .button", "pricing"], [".contact-callout .button", "callout"], [`.site-footer a[href="${prefix}/contact"]`, "footer"]]) {
      await page.locator(selector!).click();
      expect((await events(page)).at(-1)?.[2]).toMatchObject({ contact_method: "form", service: "gestion", origin_page: "home", origin_locale: locale, contact_placement: placement });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator(".menu-toggle").click();
    await page.locator('#mobile-menu a[href*="/contact"]').click();
    expect((await events(page)).at(-1)?.[2]).toMatchObject({ contact_placement: "mobile_menu" });
    expect(JSON.stringify(await events(page))).not.toContain("private@example.invalid");
  });

  test(`${locale}: the pricing CTA follows the real navigation, form start and confirmed request`, async ({ page }) => {
    await page.addInitScript(() => Object.assign(window, { turnstile: {
      render: (_element: HTMLElement, options: { callback: (token: string) => void }) => {
        Object.assign(window, { __journeySolve: () => options.callback("synthetic-token") });
        return "synthetic-widget";
      }, reset: () => {},
    } }));
    let payload: Record<string, unknown> | undefined;
    await page.route("**/api/contact", route => {
      payload = route.request().postDataJSON();
      return route.fulfill({ json: { success: true } });
    });
    await page.goto(`${prefix}/`);
    await consent(page);
    await page.locator("#tarifs .button").click();
    await expect(page).toHaveURL(`${base.origin}${prefix}/contact?intent=gestion`);
    await page.locator("#firstName").fill("PrivateName");
    expect((await events(page)).find(item => item[1] === "form_start")?.[2]).toMatchObject({ service: "gestion", contact_placement: "pricing", origin_page: "home", origin_locale: locale });
    await page.locator("#lastName").fill("PrivateSurname");
    await page.locator("#email").fill("private@example.invalid");
    await page.locator("#propertyType").selectOption("Villa");
    await page.locator("#location").fill("Solenzara");
    await page.locator("#propertyArea").fill("Private area");
    await page.evaluate(() => (window as unknown as { __journeySolve: () => void }).__journeySolve());
    await page.locator("#submit-contact").click();
    await expect(page.locator("#form-status")).toHaveAttribute("data-state", "success");
    expect(payload?.journey).toMatchObject({ consent: true, page: "home", placement: "pricing", locale });
    const lead = (await events(page)).filter(item => item[1] === "generate_lead");
    expect(lead).toHaveLength(1);
    expect(lead[0]?.[2]).toMatchObject({ service: "gestion", origin_page: "home", contact_placement: "pricing", origin_locale: locale });
    expect(JSON.stringify(await events(page))).not.toMatch(/Private|private@example|requestId|journey-/);
    expect((await events(page)).filter(item => item[1] === "conversion")).toHaveLength(0);
    await page.locator("#ads-consent-settings").click();
    await page.locator('[data-ads-choice="reject"]').click();
    expect(await page.evaluate(k => sessionStorage.getItem(k), key)).toBeNull();
  });
}

test("refusal, unproven referrers and expired origins never attribute a CTA", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-ads-choice="reject"]').click();
  await page.locator(".hero-actions .button").click();
  await page.locator("#firstName").fill("PrivateName");
  expect(await events(page)).toEqual([]);
  expect(await page.evaluate(k => sessionStorage.getItem(k), key)).toBeNull();
  await page.locator("#ads-consent-settings").click();
  await page.locator("#consent-analytics").check();
  await page.locator('[data-ads-choice="save"]').click();
  for (const age of [0, 31 * 60 * 1000]) {
    await page.evaluate(({ k, age }) => sessionStorage.setItem(k, JSON.stringify({ consent: true, version: "journey-2026-09-21-v1", page: "home", placement: "hero", locale: "fr", at: Date.now() - age })), { k: key, age });
    await page.goto("/contact?intent=audit");
    await page.locator("#firstName").fill("PrivateName");
    expect((await events(page)).find(item => item[1] === "form_start")?.[2]).toMatchObject({ service: "audit", contact_placement: "direct", origin_page: "contact" });
    expect(await page.evaluate(k => sessionStorage.getItem(k), key)).toBeNull();
  }
});

test("changing the form language preserves the original CTA and expires its storage", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await consent(page);
  await page.locator("#tarifs .button").click();
  await page.locator('.site-header .language-link').click();
  await expect(page).toHaveURL(`${base.origin}/en/contact?intent=gestion`);
  await page.locator("#firstName").fill("PrivateName");
  expect((await events(page)).find(item => item[1] === "form_start")?.[2]).toMatchObject({
    service: "gestion", origin_page: "home", origin_locale: "fr", contact_placement: "pricing",
  });
  expect((await events(page)).filter(item => item[1] === "contact_click")).toHaveLength(0);
  await page.clock.fastForward(30 * 60 * 1000);
  expect(await page.evaluate(k => sessionStorage.getItem(k), key)).toBeNull();
});
