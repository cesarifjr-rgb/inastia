import { test, expect, chromium, type Page, type Locator } from "@playwright/test";

async function snapshot(house: Locator) {
  return house.evaluate(element => ({ transform: getComputedStyle(element).transform, animations: element.getAnimations().map(animation => ({ name: animation instanceof CSSAnimation ? animation.animationName : animation.id, state: animation.playState, time: animation.currentTime })) }));
}
async function moving(house: Locator) {
  await expect.poll(async () => (await snapshot(house)).animations.some(animation => animation.state === "running")).toBe(true);
  const before = await snapshot(house);
  await expect.poll(async () => (await snapshot(house)).transform).not.toBe(before.transform);
}
async function paused(house: Locator, page: Page) {
  await expect.poll(async () => (await snapshot(house)).animations.every(animation => animation.state === "paused")).toBe(true);
  await page.waitForTimeout(80);
  const before = await snapshot(house);
  expect(before.animations).toHaveLength(1);
  await page.waitForTimeout(180);
  expect(await snapshot(house)).toEqual(before);
}

for (const locale of ["fr", "en"]) for (const width of [390, 1440]) {
  test(`house three choices work by keyboard and keep explanatory text visible (${locale}, ${width})`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(locale === "fr" ? "/" : "/en/");
    const art = page.locator("[data-management-art]");
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
    }
    await expect(art.locator("figcaption")).toContainText(locale === "fr" ? "ne représente pas un bien du portfolio" : "does not represent a portfolio property");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

for (const preference of ["no-preference", "reduce"] as const) {
  test(`house pause preserves phase and explicit keyboard resume works (${preference})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: preference });
    await page.goto("/");
    const house = page.locator(".management-art-house");
    await house.scrollIntoViewIfNeeded();
    if (preference === "reduce") await paused(house, page);
    else {
      await moving(house);
      await page.locator("#motion-toggle").click();
      await paused(house, page);
    }
    await page.locator("#motion-toggle").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#motion-toggle")).toHaveAttribute("aria-pressed", "false");
    await house.scrollIntoViewIfNeeded();
    await moving(house);
    if (preference === "no-preference") {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
      await paused(house, page);
    }
  });
}

test("house suspends offscreen and when document visibility is simulated hidden", async ({ page }) => {
  await page.goto("/");
  const house = page.locator(".management-art-house");
  await house.scrollIntoViewIfNeeded();
  await moving(house);
  await page.locator(".site-footer").scrollIntoViewIfNeeded();
  await paused(house, page);
  await house.scrollIntoViewIfNeeded();
  await moving(house);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await paused(house, page);
  await page.evaluate(() => { Reflect.deleteProperty(document, "hidden"); document.dispatchEvent(new Event("visibilitychange")); });
  await moving(house);
});

test("house choices remain usable without JavaScript and movement stays static", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto("/");
    const house = page.locator(".management-art-house");
    await house.scrollIntoViewIfNeeded();
    await expect(house).toBeVisible();
    await paused(house, page);
    await page.locator('[data-management-art] input[value="listing"]').focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator('[data-management-art] input[value="guests"]')).toBeChecked();
    await expect(page.locator('[data-management-copy="guests"]')).toHaveCSS("border-left-color", "rgb(28, 98, 133)");
    await expect(page.locator("[data-management-copy]:visible")).toHaveCount(3);
  } finally { await context.close(); }
});

test("house restores actual BFCache with working pause controls", async ({ baseURL }) => {
  const browser = await chromium.launch({ channel: "chrome", ignoreDefaultArgs: ["--disable-back-forward-cache"] });
  try {
    const page = await browser.newPage({ baseURL });
    await page.addInitScript(() => {
      Object.assign(window, { houseDocumentId: crypto.randomUUID(), houseRestored: false });
      window.addEventListener("pageshow", event => { if (event.persisted) Object.assign(window, { houseRestored: true }); });
    });
    await page.goto("/");
    const original = await page.evaluate(() => Reflect.get(window, "houseDocumentId"));
    const house = page.locator(".management-art-house");
    await house.scrollIntoViewIfNeeded();
    await moving(house);
    await page.locator('.site-footer a[href="/about"]').click();
    await page.goBack({ waitUntil: "commit" });
    await expect.poll(() => page.evaluate(() => Reflect.get(window, "houseRestored"))).toBe(true);
    expect(await page.evaluate(() => Reflect.get(window, "houseDocumentId"))).toBe(original);
    await house.scrollIntoViewIfNeeded();
    await moving(house);
    await page.locator("#motion-toggle").click();
    await paused(house, page);
  } finally { await browser.close(); }
});
