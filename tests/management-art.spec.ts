import { test, expect, chromium, type Page, type Locator } from "@playwright/test";

async function expectNotebookArtwork(art: Locator) {
  await art.locator(".management-art-scene").evaluate(element => element.scrollIntoView({ block: "center", behavior: "instant" }));
  const illustration = art.locator("svg.management-art-illustration");
  await expect(illustration).toBeVisible();
  await expect(illustration.locator(".management-art-notebook")).toBeVisible();
  await expect(art.locator("img, picture")).toHaveCount(0);
  for (const value of ["listing", "guests", "home"]) {
    await expect(illustration.locator(`[data-management-diagram="${value}"]`)).toBeVisible();
  }
}

async function snapshot(notebook: Locator) {
  return notebook.evaluate(element => ({ transform: getComputedStyle(element).transform, animations: element.getAnimations().map(animation => ({ name: animation instanceof CSSAnimation ? animation.animationName : animation.id, state: animation.playState, time: animation.currentTime })) }));
}
async function moving(notebook: Locator) {
  await expect.poll(async () => (await snapshot(notebook)).animations.some(animation => animation.state === "running")).toBe(true);
  const before = await snapshot(notebook);
  await expect.poll(async () => (await snapshot(notebook)).transform).not.toBe(before.transform);
}
async function paused(notebook: Locator, page: Page) {
  await expect.poll(async () => (await snapshot(notebook)).animations.every(animation => animation.state === "paused")).toBe(true);
  await page.waitForTimeout(80);
  const before = await snapshot(notebook);
  expect(before.animations).toHaveLength(1);
  await page.waitForTimeout(180);
  expect(await snapshot(notebook)).toEqual(before);
}


async function pausedScene(page: Page) {
  for (const element of await page.locator(".management-art-notebook, .management-diagram-motion").all()) await paused(element, page);
}
async function movingScene(page: Page) {
  await moving(page.locator(".management-art-notebook"));
  const value = await page.locator('[data-management-art] input:checked').inputValue();
  await moving(page.locator(`[data-management-motion="${value}"]`));
}

for (const locale of ["fr", "en"]) for (const width of [390, 1440]) {
  test(`notebook three choices work by keyboard and keep explanatory text visible (${locale}, ${width})`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(locale === "fr" ? "/" : "/en/");
    const art = page.locator("[data-management-art]");
    await expectNotebookArtwork(art);
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
    await expect(art.locator("figcaption")).toHaveText(locale === "fr" ? "Un carnet, trois volets : l’annonce, les voyageurs et la maison." : "One journal, three parts: the listing, the guests and the home.");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

for (const preference of ["no-preference", "reduce"] as const) {
  test(`notebook pause preserves phase and explicit keyboard resume works (${preference})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: preference });
    await page.goto("/");
    const notebook = page.locator(".management-art-notebook");
    await notebook.evaluate(element => element.closest(".management-art-scene")?.scrollIntoView({ block: "center", behavior: "instant" }));
    if (preference === "reduce") await pausedScene(page);
    else {
      await movingScene(page);
      await page.locator("#motion-toggle").click();
      await pausedScene(page);
    }
    await page.locator("#motion-toggle").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#motion-toggle")).toHaveAttribute("aria-pressed", "false");
    await notebook.evaluate(element => element.closest(".management-art-scene")?.scrollIntoView({ block: "center", behavior: "instant" }));
    await movingScene(page);
    if (preference === "no-preference") {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
      await pausedScene(page);
    }
  });
}

test("notebook suspends offscreen and when document visibility is simulated hidden", async ({ page }) => {
  await page.goto("/");
  const notebook = page.locator(".management-art-notebook");
  await notebook.evaluate(element => element.closest(".management-art-scene")?.scrollIntoView({ block: "center", behavior: "instant" }));
  await movingScene(page);
  await page.locator(".site-footer").scrollIntoViewIfNeeded();
  await pausedScene(page);
  await notebook.evaluate(element => element.closest(".management-art-scene")?.scrollIntoView({ block: "center", behavior: "instant" }));
  await movingScene(page);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await pausedScene(page);
  await page.evaluate(() => { Reflect.deleteProperty(document, "hidden"); document.dispatchEvent(new Event("visibilitychange")); });
  await movingScene(page);
});

test("notebook choices remain usable without JavaScript and movement stays static", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto("/");
    const notebook = page.locator(".management-art-notebook");
    await notebook.evaluate(element => element.closest(".management-art-scene")?.scrollIntoView({ block: "center", behavior: "instant" }));
    await expect(notebook).toBeVisible();
    await expectNotebookArtwork(page.locator("[data-management-art]"));
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

test("notebook restores actual BFCache with working pause controls", async ({ baseURL }) => {
  const browser = await chromium.launch({ channel: "chrome", ignoreDefaultArgs: ["--disable-back-forward-cache"] });
  try {
    const page = await browser.newPage({ baseURL });
    await page.addInitScript(() => {
      Object.assign(window, { notebookDocumentId: crypto.randomUUID(), notebookRestored: false });
      window.addEventListener("pageshow", event => { if (event.persisted) Object.assign(window, { notebookRestored: true }); });
    });
    await page.goto("/");
    const original = await page.evaluate(() => Reflect.get(window, "notebookDocumentId"));
    const notebook = page.locator(".management-art-notebook");
    await notebook.evaluate(element => element.closest(".management-art-scene")?.scrollIntoView({ block: "center", behavior: "instant" }));
    await movingScene(page);
    await page.locator('.site-footer a[href="/about"]').click();
    await page.goBack({ waitUntil: "commit" });
    await expect.poll(() => page.evaluate(() => Reflect.get(window, "notebookRestored"))).toBe(true);
    expect(await page.evaluate(() => Reflect.get(window, "notebookDocumentId"))).toBe(original);
    await notebook.evaluate(element => element.closest(".management-art-scene")?.scrollIntoView({ block: "center", behavior: "instant" }));
    await movingScene(page);
    await page.locator("#motion-toggle").click();
    await pausedScene(page);
  } finally { await browser.close(); }
});
