import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

const historicalOffers = ["pack-lancement-airbnb", "menage-airbnb-corse-du-sud"];

test("historical standalone offers have permanent redirects to full management", () => {
  const config = JSON.parse(readFileSync("vercel.json", "utf8"));
  for (const prefix of ["", "/en"]) {
    for (const slug of historicalOffers) {
      expect(config.redirects).toContainEqual({
        source: `${prefix}/${slug}`,
        destination: `${prefix}/gestion-airbnb-corse-du-sud`,
        permanent: true,
      });
    }
  }
});

for (const locale of ["fr", "en"] as const) {
  const prefix = locale === "en" ? "/en" : "";

  test(`historical offer navigation reaches the single management page (${locale})`, async ({ page }) => {
    for (const slug of historicalOffers) {
      await page.goto(`${prefix}/${slug}`);
      await expect(page).toHaveURL(new RegExp(`${prefix}/gestion-airbnb-corse-du-sud$`));
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://inastia.fr${prefix}/gestion-airbnb-corse-du-sud`);
      await expect(page.locator(".page-hero-copy .button")).toHaveAttribute("href", `${prefix}/contact?intent=gestion`);
    }
  });

  test(`three illustrated components belong to one complete management offer (${locale})`, async ({ page }) => {
    await page.goto(`${prefix}/`);
    const services = page.locator("#services");
    await expect(services).toContainText(locale === "fr" ? /gestion complète/i : /full management/i);
    const components = services.locator(".service-card");
    await expect(components).toHaveCount(3);
    for (const [index, component] of (await components.all()).entries()) {
      await component.scrollIntoViewIfNeeded();
      await expect(component.locator("h3")).toBeVisible();
      await expect(component.locator(`.service-art-${[2, 3, 1][index]}`)).toBeVisible();
    }
    const copy = await services.innerText();
    expect(copy).toMatch(locale === "fr" ? /annonce|réservation/i : /listing|booking/i);
    expect(copy).toMatch(locale === "fr" ? /voyageur|accueil/i : /guest|welcome/i);
    expect(copy).toMatch(locale === "fr" ? /ménage|linge|maison/i : /cleaning|linen|home/i);
    await expect(services.locator(`a[href^="${prefix}/gestion-airbnb-corse-du-sud#section-"]`).first()).toBeVisible();
    await expect(services.locator('a[href*="pack-lancement"], a[href*="menage-airbnb"], a[href*="intent=annonce"], a[href*="intent=rotation"]')).toHaveCount(0);
    expect(copy).not.toMatch(/trois offres|three offers|prestations convenues séparément|unless separate services are agreed/i);
  });

  test(`original hospitality hero, property identities and contact facts remain (${locale})`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${prefix}/`);
    await expect(page.locator(".home-hero")).toBeVisible();
    await expect(page.locator(".hero-main")).toHaveCSS("display", "grid");
    await expect(page.locator(".hero-copy h1")).toHaveCSS("font-size", "72px");
    await expect(page.locator(".hero-accent")).toHaveCSS("color", "rgb(39, 127, 168)");
    await expect(page.locator(".home-hero")).toHaveCSS("background-color", "rgb(248, 243, 233)");
    await expect(page.locator("[data-hospitality-scene] svg.hospitality-illustration")).toBeVisible();
    await expect(page.locator(".hero-actions .button")).toHaveAttribute("href", `${prefix}/contact?intent=gestion`);
    await expect(page.locator(".territory-note")).toContainText(/Ghisonaccia.*Porto-Vecchio/);
    const properties = page.locator(".property-row");
    await expect(properties).toHaveCount(3);
    for (const [index, [name, location, image]] of [
      ["Villa d’Amichi", "Pinarello · Zonza", "villa_amichi"],
      ["Casa Verde", "Pinarello · Zonza", "casa_verde"],
      ["Cala Lova", "Cala d’Oro · Solenzara", "villa_lova"],
    ].entries()) {
      const property = properties.nth(index);
      await expect(property).toContainText(name!);
      await expect(property).toContainText(location!);
      await expect(property.locator("img")).toHaveAttribute("src", new RegExp(`/images/${image}-`));
    }
    await expect(page.locator('.site-footer a[href="tel:+33613812550"]')).toBeVisible();
    await expect(page.locator('.site-footer a[href="mailto:contact@inastia.fr"]')).toBeVisible();
  });
}
