import {
  test,
  expect,
  chromium,
  type Page,
  type Locator,
} from "@playwright/test";

type ProbeWindow = Window & {
  __atlasEntries: number;
  __documentId: string;
  __restored: boolean;
  __preferenceChanged: boolean;
};
const selectors = [
  ".service-art-1 .orbit-one",
  ".service-art-2 .listing-front",
  ".service-art-3 .art-key-spark",
];
async function snapshot(element: Locator) {
  return element.evaluate((node) => ({
    transform: getComputedStyle(node).transform,
    animations: node.getAnimations().map((animation) => ({
      name:
        animation instanceof CSSAnimation
          ? animation.animationName
          : animation.id,
      state: animation.playState,
      time: animation.currentTime,
    })),
  }));
}
async function moving(element: Locator): Promise<void> {
  await expect
    .poll(async () =>
      (await snapshot(element)).animations.some(
        (animation) => animation.state === "running",
      ),
    )
    .toBe(true);
  const first = await snapshot(element);
  await expect
    .poll(async () => (await snapshot(element)).transform)
    .not.toBe(first.transform);
}
async function frozen(element: Locator, page: Page): Promise<void> {
  await expect
    .poll(async () =>
      (await snapshot(element)).animations.some(
        (animation) => animation.state === "running",
      ),
    )
    .toBe(false);
  await page.waitForTimeout(60);
  const first = await snapshot(element);
  expect(first.animations.length).toBeGreaterThan(0);
  await page.waitForTimeout(160);
  expect(await snapshot(element)).toEqual(first);
}

test("Atlas enters once without hiding essential text or loading an animation library", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const expensive: string[] = [];
  const workers: string[] = [];
  page.on("request", (request) => {
    if (/gsap|ScrollTrigger|\.(glb|gltf)(?:[?#]|$)/i.test(request.url()))
      expensive.push(request.url());
  });
  page.on("worker", (worker) => workers.push(worker.url()));
  await page.addInitScript(() => {
    (window as unknown as ProbeWindow).__atlasEntries = 0;
    document.addEventListener("animationstart", (event) => {
      if (event.animationName === "atlas-enter")
        (window as unknown as ProbeWindow).__atlasEntries++;
    });
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("h1")).toHaveCSS("opacity", "1");
  await expect(page.locator(".hero-actions .button")).toBeVisible();
  const atlas = page.locator(".frontier-hero .atlas-silhouette");
  await expect(atlas).toBeVisible();
  await expect(atlas).toHaveAttribute("data-motion-entry", "done");
  await expect
    .poll(() =>
      page.evaluate(() => (window as unknown as ProbeWindow).__atlasEntries),
    )
    .toBe(1);
  await page.locator("#services").scrollIntoViewIfNeeded();
  await atlas.scrollIntoViewIfNeeded();
  expect(
    await page.evaluate(
      () => (window as unknown as ProbeWindow).__atlasEntries,
    ),
  ).toBe(1);
  expect(expensive).toEqual([]);
  expect(workers).toEqual([]);
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("service CSS motion is visible, keyboard pausable and phase-preserving", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const art = selectors.map((selector) => page.locator(selector));
  for (const element of art) {
    await element.locator("..").scrollIntoViewIfNeeded();
    await moving(element);
  }
  const toggle = page.locator("#motion-toggle");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  for (const element of art) await frozen(element, page);
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  for (const element of art) {
    await element.locator("..").scrollIntoViewIfNeeded();
    await moving(element);
  }
});

test("reduced motion starts complete, explicit play works and preference changes pause again", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const atlas = page.locator(".frontier-hero .atlas-silhouette");
  await expect(atlas).toHaveAttribute("data-motion-entry", "done");
  expect((await snapshot(atlas)).animations).toEqual([]);
  const element = page.locator(selectors[0]!);
  await element.locator("..").scrollIntoViewIfNeeded();
  await frozen(element, page);
  await page.locator("#motion-toggle").click();
  await element.locator("..").scrollIntoViewIfNeeded();
  await moving(element);
  // Wait for the browser's first media change event before changing it again;
  // consecutive protocol updates can otherwise coalesce into no change.
  await page.evaluate(() => {
    (window as unknown as ProbeWindow).__preferenceChanged = false;
    matchMedia("(prefers-reduced-motion: reduce)").addEventListener(
      "change",
      () => { (window as unknown as ProbeWindow).__preferenceChanged = true; },
      { once: true },
    );
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect.poll(() => page.evaluate(
    () => (window as unknown as ProbeWindow).__preferenceChanged,
  )).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await frozen(element, page);
});

test("offscreen and simulated document hiding suspend every service group", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const art = selectors.map((selector) => page.locator(selector));
  for (const element of art) {
    await element.locator("..").scrollIntoViewIfNeeded();
    await moving(element);
  }
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  for (const element of art) await frozen(element, page);
  await page.evaluate(() => {
    Reflect.deleteProperty(document, "hidden");
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await moving(art[2]!);
  await page.locator(".site-footer").scrollIntoViewIfNeeded();
  for (const element of art) await frozen(element, page);
  await art[0]!.locator("..").scrollIntoViewIfNeeded();
  await moving(art[0]!);
});

test("rapid scroll and resize leave revealed text readable and focus stops its movement", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  for (const width of [390, 1024, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() =>
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "instant",
      }),
    );
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  }
  const blocks = page.locator("[data-reveal]");
  for (const block of await blocks.all()) {
    await block.scrollIntoViewIfNeeded();
    await expect(block).toBeVisible();
    await expect(block).toHaveCSS("opacity", "1");
    await expect(block).toHaveAttribute("data-motion-revealed", "true");
  }
  const link = page.locator(".service-card a").first();
  await link.focus();
  const card = page.locator(".service-card").first();
  await expect(card).toHaveAttribute("data-motion-entry", "done");
  await expect(card).toHaveCSS("transform", "none");
});

test("without JavaScript Atlas, services and the contact route remain usable", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 1000 },
    baseURL,
  });
  try {
    const page = await context.newPage();
    await page.goto("/");
    await expect(
      page.locator(".frontier-hero .atlas-silhouette"),
    ).toBeVisible();
    await expect(page.locator("h1")).toHaveCSS("opacity", "1");
    await expect(page.locator("#motion-toggle")).toBeHidden();
    for (const selector of selectors) {
      const element = page.locator(selector);
      await element.locator("..").scrollIntoViewIfNeeded();
      await expect(element).toBeVisible();
      await frozen(element, page);
    }
    await page
      .locator('main a[href="/gestion-airbnb-corse-du-sud"]:visible')
      .first()
      .click();
    await page
      .locator('main a[href="/contact?intent=gestion"]:visible')
      .first()
      .click();
    await expect(page.locator("#contact-form")).toBeVisible();
    await expect(
      page.locator('noscript a[href="mailto:contact@inastia.fr"]'),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});

test("real BFCache restore retains the same document and working pause controls", async ({
  baseURL,
}) => {
  const browser = await chromium.launch({
    channel: "chrome",
    ignoreDefaultArgs: ["--disable-back-forward-cache"],
  });
  try {
    const page = await browser.newPage({
      baseURL,
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "no-preference",
    });
    await page.addInitScript(() => {
      const probe = window as unknown as ProbeWindow;
      probe.__documentId = crypto.randomUUID();
      probe.__restored = false;
      window.addEventListener("pageshow", (event) => {
        if (event.persisted) probe.__restored = true;
      });
    });
    await page.goto("/");
    const documentId = await page.evaluate(
      () => (window as unknown as ProbeWindow).__documentId,
    );
    const art = page.locator(selectors[0]!);
    await art.locator("..").scrollIntoViewIfNeeded();
    await moving(art);
    await page
      .locator('main a[href="/gestion-airbnb-corse-du-sud"]:visible')
      .first()
      .click();
    await page.goBack({ waitUntil: "commit" });
    await expect
      .poll(() =>
        page.evaluate(() => (window as unknown as ProbeWindow).__restored),
      )
      .toBe(true);
    expect(
      await page.evaluate(
        () => (window as unknown as ProbeWindow).__documentId,
      ),
    ).toBe(documentId);
    await art.locator("..").scrollIntoViewIfNeeded();
    await moving(art);
    await page.locator("#motion-toggle").click();
    await frozen(art, page);
    await page.locator("#motion-toggle").focus();
    await page.keyboard.press("Enter");
    await art.locator("..").scrollIntoViewIfNeeded();
    await moving(art);
  } finally {
    await browser.close();
  }
});
