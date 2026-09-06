import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const routes = [
  ...readFileSync("public/sitemap.xml", "utf8").matchAll(/<loc>(.*?)<\/loc>/g),
].map((match) => new URL(match[1]!).pathname);
const legalRoutes = ["/mentions-legales", "/privacy", "/cgv"];
const screenshotDirectory = ".codex-work/screenshots";
mkdirSync(screenshotDirectory, { recursive: true });

async function loadImages(page: Page): Promise<void> {
  for (const image of await page.locator("img").all()) {
    await image.evaluate(element => (element.closest(".management-art-scene") ?? element).scrollIntoView({ block: "center", behavior: "instant" }));
    await expect(image).toHaveJSProperty("complete", true);
    expect(
      await image.evaluate(
        (element) => (element as HTMLImageElement).naturalWidth,
      ),
    ).toBeGreaterThan(0);
    const decorative = await image.evaluate(element =>
      Boolean(element.parentElement?.closest('[aria-hidden="true"]')),
    );
    await expect(image).toHaveAttribute("alt", decorative ? /.*/ : /.+/);
  }
  // A full-page capture must include sections revealed by actual scrolling.
  for (const section of await page.locator("[data-reveal]").all()) {
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveClass(/\bis-visible\b/);
    await expect(section).toHaveCSS("opacity", "1");
  }
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
}

async function noOverflow(page: Page): Promise<void> {
  const measurements = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(
    measurements.document,
    JSON.stringify(measurements),
  ).toBeLessThanOrEqual(measurements.viewport + 1);
  expect(measurements.body, JSON.stringify(measurements)).toBeLessThanOrEqual(
    measurements.viewport + 1,
  );
}

test("sitemap has 23 distinct published routes and excludes redirected offers", () => {
  expect(routes).toHaveLength(23);
  expect(new Set(routes).size).toBe(23);
  for (const prefix of ["", "/en"]) {
    expect(routes).not.toContain(`${prefix}/pack-lancement-airbnb`);
    expect(routes).not.toContain(`${prefix}/menage-airbnb-corse-du-sud`);
  }
});

for (const route of routes) {
  test(`published route ${route}: metadata, images and runtime`, async ({
    page,
    request,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("requestfailed", (request) => {
      const failure = request.failure()?.errorText ?? "Unknown failure";
      if (!failure.includes("net::ERR_ABORTED"))
        errors.push(`${request.url()}: ${failure}`);
    });
    page.on("response", (response) => {
      if (response.status() >= 400)
        errors.push(`${response.status()}: ${response.url()}`);
    });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    const title = await page.title();
    expect(title.length).toBeGreaterThan(15);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.{50,}/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://inastia.fr${route}`,
    );
    await expect(page.locator("html")).toHaveAttribute(
      "lang",
      route.startsWith("/en/") ? "en" : "fr",
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      title,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      `https://inastia.fr${route}`,
    );
    if (legalRoutes.includes(route)) {
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        "index, follow",
      );
      await expect(page.locator("link[hreflang]")).toHaveCount(0);
    } else {
      const frenchRoute = route.replace(/^\/en\//, "/");
      await expect(page.locator('link[hreflang="fr"]')).toHaveAttribute(
        "href",
        `https://inastia.fr${frenchRoute}`,
      );
      await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
        "href",
        `https://inastia.fr/en${frenchRoute}`,
      );
      await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
        "href",
        `https://inastia.fr${frenchRoute}`,
      );
    }
    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect(ogImage).toMatch(/^https:\/\/inastia\.fr\//);
    const imageResponse = await request.get(new URL(ogImage!).pathname);
    expect(imageResponse.status()).toBe(200);
    expect(imageResponse.headers()["content-type"]).toMatch(/^image\//);
    // Every published page must lead to the single management offer; historical
    // standalone slugs remain redirects only and are not advertised in the UI.
    await expect(page.locator('a[href*="/pack-lancement-airbnb"], a[href*="/menage-airbnb-corse-du-sud"], a[href*="intent=annonce"], a[href*="intent=rotation"]')).toHaveCount(0);
    await loadImages(page);
    await noOverflow(page);
    const name =
      route === "/"
        ? "fr-home"
        : route === "/en/"
          ? "en-home"
          : route.slice(1).replaceAll("/", "-");
    await page.screenshot({
      path: `${screenshotDirectory}/route-${name}.png`,
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });
}

test("all internal links and fragments resolve, and page titles are distinct", async ({
  page,
  request,
  baseURL,
}) => {
  test.setTimeout(60_000);
  const cache = new Map<
    string,
    { ids: string[]; hrefs: string[]; title: string }
  >();
  const links = new Set<string>();
  const titles = new Set<string>();
  async function inspect(pathname: string) {
    const cached = cache.get(pathname);
    if (cached) return cached;
    const response = await request.get(pathname);
    expect(response.status(), pathname).toBe(200);
    const html = await response.text();
    const documentData = await page.evaluate((html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return {
        ids: [...doc.querySelectorAll("[id]")].map((element) => element.id),
        hrefs: [...doc.querySelectorAll("a[href]")].map((element) =>
          element.getAttribute("href")!,
        ),
        title: doc.title,
      };
    }, html);
    cache.set(pathname, documentData);
    return documentData;
  }
  for (const route of routes) {
    const content = await inspect(route);
    expect(titles.has(content.title), `Duplicate title: ${content.title}`).toBe(
      false,
    );
    titles.add(content.title);
    for (const href of content.hrefs) {
      const target = new URL(href, `${baseURL}${route}`);
      if (
        target.origin === new URL(baseURL!).origin ||
        target.hostname === "inastia.fr"
      ) {
        links.add(target.pathname + target.search + target.hash);
      }
    }
  }
  for (const link of links) {
    const url = new URL(link, baseURL);
    // Attachments are checked as resources, not parsed as HTML.
    if (/\.(pdf|png|jpe?g|webp|svg)$/i.test(url.pathname)) {
      expect((await request.get(url.pathname)).status(), link).toBe(200);
      continue;
    }
    const target = await inspect(url.pathname + url.search);
    expect(target.title.length, `HTML destination for ${link}`).toBeGreaterThan(
      0,
    );
    if (url.hash)
      expect(target.ids, `Missing fragment ${link}`).toContain(
        decodeURIComponent(url.hash.slice(1)),
      );
  }
});

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`homepage layout and screenshot at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await loadImages(page);
    await noOverflow(page);
    await page.screenshot({
      path: `${screenshotDirectory}/home-${width}.png`,
      fullPage: true,
    });
  });
}

const representatives = [
  ["home", "/"],
  ["contact", "/contact"],
  ["about", "/about"],
  ["service", "/gestion-airbnb-corse-du-sud"],
  ["location", "/conciergerie-airbnb-zonza-pinarello"],
  ["legal", "/cgv"],
] as const;

for (const width of [375, 1440]) {
  for (const [name, route] of representatives) {
    test(`WCAG and template screenshot: ${name} at ${width}px`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(route);
      await loadImages(page);
      await noOverflow(page);
      const report = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      writeFileSync(
        `.codex-work/axe-${name}-${width}.json`,
        JSON.stringify(report, null, 2),
      );
      await testInfo.attach("axe-report", {
        body: JSON.stringify(report, null, 2),
        contentType: "application/json",
      });
      await page.screenshot({
        path: `${screenshotDirectory}/${name}-${width}.png`,
        fullPage: true,
      });
      expect(report.violations).toEqual([]);
    });
  }
}

test("mobile menu supports focus, keyboard dismissal and in-page navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const toggle = page.locator(".menu-toggle");
  const menu = page.locator("#mobile-menu");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(menu).toBeVisible();
  await expect(menu.locator("a").first()).toBeFocused();
  await expect(page.locator("main")).toHaveJSProperty("inert", true);
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();
  await expect(page.locator("main")).toHaveJSProperty("inert", false);
  await toggle.click();
  await menu.locator('a[href="/#services"]').click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/#services$/);
  await expect(page.locator("#services")).toBeFocused();
});

test("FAQ opens and closes with keyboard controls", async ({ page }) => {
  await page.goto("/");
  const item = page.locator(".faq-list details").first();
  await item.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(item).toHaveAttribute("open", "");
  await expect(item.locator(".faq-answer")).toBeVisible();
  await page.keyboard.press("Space");
  await expect(item).not.toHaveAttribute("open");
});

test("language switch preserves the current translated page", async ({
  page,
}) => {
  await page.goto("/gestion-airbnb-corse-du-sud");
  const frenchHeading = await page.locator("h1").innerText();
  await page.locator(".language-link").click();
  await expect(page).toHaveURL(/\/en\/gestion-airbnb-corse-du-sud$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("h1")).toBeVisible();
  expect((await page.locator("h1").innerText()).trim()).not.toBe("");
  expect(await page.locator("h1").innerText()).not.toBe(frenchHeading);
  await page.locator(".language-link").click();
  await expect(page).toHaveURL(/\/gestion-airbnb-corse-du-sud$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.locator("h1")).toHaveText(frenchHeading);
});

test("reduced-motion preference disables decorative movement and smooth scrolling", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const motion = await page.evaluate(() => ({
    smooth: getComputedStyle(document.documentElement).scrollBehavior,
    moving: document
      .getAnimations()
      .filter((animation) => animation.playState === "running")
      .map((animation) =>
        animation instanceof CSSAnimation
          ? animation.animationName
          : animation.id,
      ),
    transitions: [...document.querySelectorAll("*")]
      .filter((element) => {
        const style = getComputedStyle(element);
        return style.transitionDuration
          .split(",")
          .some((value) => parseFloat(value) > 0);
      })
      .map((element) => element.tagName),
  }));
  expect(motion.smooth).toBe("auto");
  expect(motion.moving).toEqual([]);
  expect(motion.transitions).toEqual([]);
});

test("without JavaScript, content, navigation, FAQs and direct contact remain usable", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
    baseURL,
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(
    page.locator("[data-hospitality-scene] svg.hospitality-illustration"),
  ).toBeVisible();
  await expect(page.locator("#motion-toggle")).toBeHidden();
  for (const section of await page.locator("[data-reveal]").all()) {
    await expect(section).toBeVisible();
    await expect(section).toHaveCSS("opacity", "1");
    await expect(section).toHaveCSS("visibility", "visible");
  }
  const faq = page.locator(".faq-list details").first();
  await faq.locator("summary").click();
  await expect(faq.locator(".faq-answer")).toBeVisible();
  await page.locator('.site-footer a[href="/about"]').click();
  await expect(page).toHaveURL(/\/about$/);
  await page.locator('.site-footer a[href="/contact"]').click();
  await expect(page.locator("noscript")).toBeVisible();
  await expect(
    page.locator('noscript a[href="mailto:contact@inastia.fr"]'),
  ).toBeVisible();
  await expect(
    page.locator('.contact-direct a[href="tel:+33613812550"]'),
  ).toBeVisible();
  await context.close();
});
