import { test, expect } from "@playwright/test";
import { ANALYTICS_ID } from "../src/analytics.ts";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:4100");
test.skip(!["localhost", "127.0.0.1", "[::1]"].includes(base.hostname), "Contact clicks and Analytics are simulated locally.");

test.beforeEach(async ({ page }) => {
  await page.route("**/*", route => new URL(route.request().url()).origin === base.origin
    ? route.continue() : route.fulfill({ contentType: "application/javascript", body: "" }));
  await page.addInitScript(() => document.addEventListener("click", event => {
    if (event.target instanceof Element && event.target.closest('a[href^="mailto:"], a[href^="tel:"]')) event.preventDefault();
  }));
});

for (const locale of ["fr", "en"]) {
  const route = `${locale === "en" ? "/en" : ""}/partenaires`;

  test(`${locale}: partner clicks require Analytics consent and never mean a received lead`, async ({ page }) => {
    await page.goto(`${route}?email=private@example.invalid`);
    const events = async () => page.evaluate(() => (window.dataLayer || []).map(item => Array.from(item)).filter(item => item[0] === "event"));
    await page.locator('.partners-hero [data-contact-placement="hero"]').click();
    expect(await events()).toEqual([]);
    await page.locator(".consent-preferences summary").click();
    await page.locator("#consent-advertising").check();
    await page.locator('[data-ads-choice="save"]').click();
    await page.locator('.partner-profile [data-partner-profile="immobilier"]').click();
    expect(await events()).toEqual([]);
    await page.locator("#ads-consent-settings").click();
    await page.locator("#consent-advertising").uncheck();
    await page.locator("#consent-analytics").check();
    await page.locator('[data-ads-choice="save"]').click();
    for (const profile of ["immobilier", "prestataire", "recommandation"]) {
      await page.locator(`.partner-profile [data-partner-profile="${profile}"]`).click();
      expect((await events()).at(-1)).toEqual(["event", "contact_click", {
        send_to: ANALYTICS_ID, contact_method: "email", service: "partenariat", partner_profile: profile, contact_placement: "profile",
      }]);
    }
    await page.locator('[data-contact-placement="phone"]').click();
    expect((await events()).at(-1)?.[2]).toMatchObject({ contact_method: "phone", partner_profile: "general", contact_placement: "phone" });
    await page.locator('.partners-hero [data-contact-placement="hero"]').evaluate(element => {
      (element as HTMLElement).dataset.partnerProfile = "private@example.invalid";
      (element as HTMLElement).dataset.contactPlacement = "Confidential message";
    });
    await page.locator('.partners-hero .button').click();
    expect((await events()).at(-1)?.[2]).toMatchObject({ partner_profile: "general", contact_placement: "direct" });
    expect(JSON.stringify(await events())).not.toMatch(/private|Confidential|mailto:|body=|generate_lead|conversion/);
    const count = (await events()).length;
    await page.locator("#ads-consent-settings").click();
    await page.locator('[data-ads-choice="reject"]').click();
    await page.locator('.partner-profile [data-partner-profile="prestataire"]').click();
    expect(await events()).toHaveLength(count);
  });

  test(`${locale}: contact drafts preserve qualification and contextual intention`, async ({ page }) => {
    await page.goto(route);
    const drafts = await page.locator('.partners-page a[href^="mailto:"][href*="subject="]').evaluateAll(links => links.map(link => ({
      href: (link as HTMLAnchorElement).href, profile: (link as HTMLElement).dataset.partnerProfile,
    })));
    expect(drafts).toHaveLength(5);
    for (const draft of drafts) {
      const url = new URL(draft.href);
      expect(url.pathname).toBe("contact@inastia.fr");
      const body = url.searchParams.get("body")!;
      const labels = locale === "fr" ? ["Nom et structure", "Activité :", "Secteur géographique concerné", "Collaboration envisagée :"]
        : ["Name and business", "Activity:", "Relevant area", "Proposed collaboration:"];
      labels.forEach(label => expect(body).toContain(label));
      expect(body).not.toContain("\\n");
      if (draft.profile !== "general") expect(body.split(locale === "fr" ? "Collaboration envisagée : " : "Proposed collaboration: ")[1]!.split("\n")[0]!.length).toBeGreaterThan(25);
    }
    const order = await page.locator('.partners-faq, .partners-contact').evaluateAll(elements => elements.map(element => element.className));
    expect(order[0]).toContain("partners-faq");
    expect(order[1]).toContain("partners-contact");
    await expect(page.locator('.partners-page a[href*="/contact"]')).toHaveCount(0);
  });

  test(`${locale}: links to partner conditions reveal the answer on mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await page.locator('[data-ads-choice="reject"]').click();
    for (const id of ["conditions-prestations", "conditions-recommandation"]) {
      await page.locator(`a[href="#${id}"]`).click();
      await expect(page.locator(`#${id}`)).toHaveAttribute("open", "");
      await expect(page.locator(`#${id} .faq-answer`)).toBeVisible();
    }
    await page.goto(`${route}#role-partenaire`);
    await expect(page.locator("#role-partenaire")).toHaveAttribute("open", "");
    await page.locator('.menu-toggle').click();
    await page.locator('#mobile-menu .button').click();
    await expect(page.locator('#mobile-menu')).toBeHidden();
  });
}
