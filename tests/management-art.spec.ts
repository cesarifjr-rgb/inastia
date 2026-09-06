import { test, expect, chromium, type Page, type Locator } from "@playwright/test";

async function expectWelcomeArtwork(art: Locator) {
  await art.locator(".management-art-scene").evaluate(element => element.scrollIntoView({ block: "center", behavior: "instant" }));
  const welcome = art.locator("picture.management-art-welcome");
  const image = welcome.locator("img");
  await expect(welcome).toBeVisible();
  await expect(image).toBeVisible();
  await expect(image).toHaveJSProperty("complete", true);
  expect(await image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await expect(image).toHaveAttribute("alt", "");
  await expect(art.locator(".management-art-notebook")).toHaveCount(0);
  const diagrams = art.locator("svg.management-art-diagrams");
  await expect(diagrams).toBeVisible();
  for (const value of ["listing", "guests", "home"]) {
    await expect(diagrams.locator(`[data-management-diagram="${value}"]`)).toBeVisible();
  }
}

async function snapshot(welcome: Locator) {
  return welcome.evaluate(element => ({ transform: getComputedStyle(element).transform, animations: element.getAnimations().map(animation => ({ name: animation instanceof CSSAnimation ? animation.animationName : animation.id, state: animation.playState, time: animation.currentTime })) }));
}
async function moving(welcome: Locator) {
  await expect.poll(async () => (await snapshot(welcome)).animations.some(animation => animation.state === "running")).toBe(true);
  const before = await snapshot(welcome);
  await expect.poll(async () => (await snapshot(welcome)).transform).not.toBe(before.transform);
}
async function paused(welcome: Locator, page: Page) {
  await expect.poll(async () => (await snapshot(welcome)).animations.every(animation => animation.state === "paused")).toBe(true);
  await page.waitForTimeout(80);
  const before = await snapshot(welcome);
  expect(before.animations).toHaveLength(1);
  await page.waitForTimeout(180);
  expect(await snapshot(welcome)).toEqual(before);
}


async function pausedScene(page: Page) {
  for (const element of await page.locator(".management-art-welcome, .management-diagram-motion").all()) await paused(element, page);
}
async function movingScene(page: Page) {
  await moving(page.locator(".management-art-welcome"));
  const value = await page.locator('[data-management-art] input:checked').inputValue();
  await moving(page.locator(`[data-management-motion="${value}"]`));
}

for (const locale of ["fr", "en"]) for (const width of [390, 1440]) {
  test(`welcome three choices work by keyboard and keep explanatory text visible (${locale}, ${width})`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(locale === "fr" ? "/" : "/en/");
    const art = page.locator("[data-management-art]");
    await expectWelcomeArtwork(art);
    const first = art.locator('input[value="listing"]');
    await first.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    for (const [index, value] of ["listing", "guests", "home"].entries()) {
      if (index) await page.keyboard.press("ArrowRight");
      await expect(art.locator(`input[value="${value}"]`)).toBeChecked();
      await expect(art.locator(`input[value="${value}"]`)).toBeFocused();
      await expect(art.locator(`input[value="${value}"] + span`)).toHaveCSS("outline-style", "solid");
      await expect(art.locator(`[data-management-copy="${value}"]`)).toHaveCSS("border-left-color", "rgb(28, 98, 133)");
      for (const copy of await art.locator("[data-management-copy]").all()) await expect(copy).toBeVisible();
      await art.locator(".management-art-scene").evaluate(element => element.scrollIntoView({ block: "center", behavior: "instant" }));
      await expect(art.locator("[data-management-diagram]:visible")).toHaveCount(3);
      for (const detail of await art.locator("[data-management-motion]").all()) {
        if (await detail.getAttribute("data-management-motion") === value) await moving(detail);
        else await paused(detail, page);
      }
    }
    await expect(art.locator("figcaption")).toHaveText(locale === "fr" ? "Illustration de l’accueil — maison et personnages imaginaires." : "Welcome illustration — an imaginary house and characters.");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

for (const preference of ["no-preference", "reduce"] as const) {
  test(`welcome pause preserves phase and explicit keyboard resume works (${preference})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: preference });
    await page.goto("/");
    const welcome = page.locator(".management-art-welcome");
    await welcome.evaluate(element => element.closest(".management-art-scene")?.scrollIntoView({ block: "center", behavior: "instant" }));
    if (preference === "reduce") await pausedScene(page);
    else {
      await movingScene(page);
      await page.locator("#motion-toggle").click();
      await pausedScene(page);
    }
    await page.locator("#motion-toggle").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#motion-toggle")).toHaveAttribute("aria-pressed", "false");
    await welcome.evaluate(element => element.closest(".management-art-scene")?.scrollIntoView({ block: "center", behavior: "instant" }));
    await movingScene(page);
    if (preference === "no-preference") {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
      await pausedScene(page);
    }
  });
}

test("welcome suspends offscreen and when document visibility is simulated hidden", async ({ page }) => {
  await page.goto("/");
  const welcome = page.locator(".management-art-welcome");
  await welcome.evaluate(element => element.closest(".management-art-scene")?.scrollIntoView({ block: "center", behavior: "instant" }));
  await movingScene(page);
  await page.locator(".site-footer").scrollIntoViewIfNeeded();
  await pausedScene(page);
  await welcome.evaluate(element => element.closest(".management-art-scene")?.scrollIntoView({ block: "center", behavior: "instant" }));
  await movingScene(page);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await pausedScene(page);
  await page.evaluate(() => { Reflect.deleteProperty(document, "hidden"); document.dispatchEvent(new Event("visibilitychange")); });
  await movingScene(page);
});

test("welcome choices remain usable without JavaScript and movement stays static", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto("/");
    const welcome = page.locator(".management-art-welcome");
    await welcome.evaluate(element => element.closest(".management-art-scene")?.scrollIntoView({ block: "center", behavior: "instant" }));
    await expect(welcome).toBeVisible();
    await expectWelcomeArtwork(page.locator("[data-management-art]"));
    await expect(page.locator("[data-management-diagram]:visible")).toHaveCount(3);
    await pausedScene(page);
    await page.locator('[data-management-art] input[value="listing"]').focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator('[data-management-art] input[value="guests"]')).toBeChecked();
    await expect(page.locator('[data-management-copy="guests"]')).toHaveCSS("border-left-color", "rgb(28, 98, 133)");
    await expect(page.locator("[data-management-copy]:visible")).toHaveCount(3);
    await pausedScene(page);
  } finally { await context.close(); }
});

test("welcome restores actual BFCache with working pause controls", async ({ baseURL }) => {
  const browser = await chromium.launch({ channel: "chrome", ignoreDefaultArgs: ["--disable-back-forward-cache"] });
  try {
    const page = await browser.newPage({ baseURL });
    await page.addInitScript(() => {
      Object.assign(window, { welcomeDocumentId: crypto.randomUUID(), welcomeRestored: false });
      window.addEventListener("pageshow", event => { if (event.persisted) Object.assign(window, { welcomeRestored: true }); });
    });
    await page.goto("/");
    const original = await page.evaluate(() => Reflect.get(window, "welcomeDocumentId"));
    const welcome = page.locator(".management-art-welcome");
    await welcome.evaluate(element => element.closest(".management-art-scene")?.scrollIntoView({ block: "center", behavior: "instant" }));
    await movingScene(page);
    await page.locator('.site-footer a[href="/about"]').click();
    await page.goBack({ waitUntil: "commit" });
    await expect.poll(() => page.evaluate(() => Reflect.get(window, "welcomeRestored"))).toBe(true);
    expect(await page.evaluate(() => Reflect.get(window, "welcomeDocumentId"))).toBe(original);
    await welcome.evaluate(element => element.closest(".management-art-scene")?.scrollIntoView({ block: "center", behavior: "instant" }));
    await movingScene(page);
    await page.locator("#motion-toggle").click();
    await pausedScene(page);
  } finally { await browser.close(); }
});
