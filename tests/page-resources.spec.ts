import { test, expect } from "@playwright/test";

// Cold-page budgets include every same-origin script and stylesheet fetched by the browser.
// Exercise both preferences so animation dependencies cannot escape the page budgets.

const pages = [
  { slug: "", js: 21_000, css: 68_000 },
  { slug: "contact", js: 32_000, css: 50_000 },
  { slug: "gestion-airbnb-corse-du-sud", js: 21_000, css: 68_000 },
  { slug: "premiere-mise-en-location-corse", js: 18_000, css: 64_000 },
  { slug: "intendance-residence-secondaire-corse", js: 18_000, css: 63_000 },
  { slug: "partenaires", js: 18_000, css: 63_000 },
  { slug: "audit-gratuit-potentiel-locatif", js: 18_000, css: 50_000 },
];
const routes = [
  ...["", "/en"].flatMap(prefix => pages.map(page => ({ ...page, route: `${prefix}/${page.slug}` }))),
  { route: "/privacy", js: 18_000, css: 50_000 },
];

const animatedRoutes = ["/", "/en/", "/premiere-mise-en-location-corse", "/en/premiere-mise-en-location-corse",
  "/intendance-residence-secondaire-corse", "/en/intendance-residence-secondaire-corse",
  "/audit-gratuit-potentiel-locatif", "/en/audit-gratuit-potentiel-locatif"];
const cases = [
  ...routes.map(route => ({ ...route, reducedMotion: "reduce" as const })),
  ...routes.filter(({ route }) => animatedRoutes.includes(route)).map(route => ({ ...route, reducedMotion: "no-preference" as const })),
];

for (const { route, js, css, reducedMotion } of cases) {
  test(`${route} (${reducedMotion}): only necessary page resources fit the cold-load budget`, async ({ page, baseURL }) => {
    await page.emulateMedia({ reducedMotion });
    const assets = new Map<string, number>();
    const pending: Promise<void>[] = [];
    page.on("response", response => {
      const url = new URL(response.url());
      if (url.origin !== new URL(baseURL!).origin || !/\.(js|css)$/.test(url.pathname)) return;
      pending.push((async () => {
        expect(response.ok(), url.pathname).toBe(true);
        assets.set(url.pathname, (await response.body()).length);
      })());
    });
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForLoadState("networkidle");
    await Promise.all(pending);

    for (const [extension, budget] of [[".js", js], [".css", css]] as const) {
      const resources = [...assets].filter(([path]) => path.endsWith(extension));
      expect(resources.length).toBeGreaterThan(0);
      const bytes = resources.reduce((sum, [, size]) => sum + size, 0);
      expect(bytes, JSON.stringify(resources)).toBeLessThanOrEqual(budget);
    }
  });
}
