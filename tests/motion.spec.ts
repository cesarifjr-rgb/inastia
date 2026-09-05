import { test, expect, chromium } from "@playwright/test";
import type { Page, Locator } from "@playwright/test";
import { mkdirSync } from "node:fs";

const screenshotDirectory = ".codex-work/screenshots";
mkdirSync(screenshotDirectory, { recursive: true });

type HistoryProbeWindow = typeof window & {
  __inastiaHistoryProbe: {
    documentId: string;
    restoredFromCache: boolean;
  };
};

async function keySnapshot(key: Locator) {
  return key.evaluate((element) => ({
    transform: getComputedStyle(element).transform,
    animations: element.getAnimations().map((animation) => ({
      name:
        animation instanceof CSSAnimation
          ? animation.animationName
          : animation.id,
      css: animation instanceof CSSAnimation,
      state: animation.playState,
      time:
        typeof animation.currentTime === "number"
          ? animation.currentTime
          : null,
      continuous: animation.effect?.getTiming().iterations === Infinity,
    })),
  }));
}

async function expectKeyMoving(key: Locator): Promise<void> {
  await expect
    .poll(async () => {
      const snapshot = await keySnapshot(key);
      return snapshot.animations.some(
        (animation) =>
          animation.css &&
          animation.continuous &&
          animation.state === "running" &&
          animation.time !== null,
      );
    })
    .toBe(true);
  const first = await keySnapshot(key);
  const running = first.animations.find(
    (animation) =>
      animation.css && animation.continuous && animation.state === "running",
  );
  expect(running).toBeDefined();
  await expect
    .poll(async () => {
      const next = await keySnapshot(key);
      return (
        next.animations.find((animation) => animation.name === running!.name)
          ?.time ?? 0
      );
    })
    .toBeGreaterThan((running!.time ?? 0) + 50);
  await expect
    .poll(async () => (await keySnapshot(key)).transform)
    .not.toBe(first.transform);
}

async function expectKeyPaused(key: Locator, page: Page): Promise<void> {
  await expect
    .poll(
      async () =>
        (await keySnapshot(key)).animations.filter(
          (animation) => animation.state === "running",
        ).length,
    )
    .toBe(0);
  // The browser may finish an already queued frame while CSS receives the new
  // state. Sampling over multiple rendering intervals detects a surviving loop.
  await page.waitForTimeout(100);
  const before = await keySnapshot(key);
  expect(
    before.animations.length,
    "Pause must preserve the native CSS animation",
  ).toBeGreaterThan(0);
  await page.waitForTimeout(350);
  const after = await keySnapshot(key);
  expect(after.transform).toBe(before.transform);
  expect(after.animations).toEqual(before.animations);
}

test("all three service illustrations move, stop with pause and respect reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const artwork = [
    page.locator(".service-card .service-art-1 .orbit-one"),
    page.locator(".service-card .service-art-2 .listing-front"),
    page.locator(".service-card .service-art-3 .art-key-spark"),
  ];
  for (const element of artwork) {
    await element.locator("..").scrollIntoViewIfNeeded();
    await expect(element).toBeVisible();
    await expectKeyMoving(element);
  }
  const toggle = page.locator("#motion-toggle");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  for (const element of artwork) await expectKeyPaused(element, page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  for (const element of artwork) {
    await element.scrollIntoViewIfNeeded();
    await expect(element).toBeVisible();
    await expectKeyPaused(element, page);
  }
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  for (const element of artwork) await expectKeyMoving(element);
});

test("hospitality SVG visibly animates with CSS and makes no canvas, worker or model requests", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const workers: string[] = [];
  const modelRequests: string[] = [];
  const errors: string[] = [];
  page.on("worker", (worker) => workers.push(worker.url()));
  page.on("request", (request) => {
    if (/\.(glb|gltf)(?:[?#]|$)|scene\.worker/i.test(request.url()))
      modelRequests.push(request.url());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const scene = page.locator("[data-hospitality-scene]");
  const illustration = scene.locator("svg.hospitality-illustration");
  await expect(illustration).toBeVisible();
  expect(
    await illustration
      .locator("path, rect, circle, ellipse, polygon, line")
      .count(),
  ).toBeGreaterThan(0);
  await expect(scene).toHaveAttribute("data-illustration-active", "true");
  await expectKeyMoving(scene.locator(".welcome-key").first());
  await expect(page.locator("canvas")).toHaveCount(0);
  expect(workers).toEqual([]);
  expect(modelRequests).toEqual([]);
  expect(errors).toEqual([]);
  await page.evaluate(() => document.fonts.ready);
  const screenshot = await illustration.screenshot({
    path: `${screenshotDirectory}/motion-hospitality-desktop.png`,
  });
  await testInfo.attach("hospitality-illustration", {
    body: screenshot,
    contentType: "image/png",
  });
});

test("motion button freezes the actual CSS animation and resumes it with the keyboard", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const scene = page.locator("[data-hospitality-scene]");
  const key = scene.locator(".welcome-key").first();
  const toggle = page.locator("#motion-toggle");
  await expect(scene).toHaveAttribute("data-illustration-active", "true");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expectKeyMoving(key);
  const beforePause = await keySnapshot(key);
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expectKeyPaused(key, page);
  const paused = await keySnapshot(key);
  expect(paused.animations.map((animation) => animation.name)).toEqual(
    beforePause.animations.map((animation) => animation.name),
  );
  expect(paused.animations[0]!.time).toBeGreaterThanOrEqual(
    beforePause.animations[0]!.time!,
  );
  const runningContinuousAnimations = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter(
          (animation) =>
            animation.playState === "running" &&
            animation.effect?.getTiming().iterations === Infinity,
        ).length,
  );
  expect(runningContinuousAnimations).toBe(0);
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "running");
  await scene.scrollIntoViewIfNeeded();
  await expectKeyMoving(key);
});

test("reduced-motion starts static, permits explicit CSS motion and pauses again", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const scene = page.locator("[data-hospitality-scene]");
  const key = scene.locator(".welcome-key").first();
  const toggle = page.locator("#motion-toggle");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expectKeyPaused(key, page);
  await expect(page.locator("h1")).toBeVisible();
  for (const section of await page.locator("[data-reveal]").all()) {
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveCSS("opacity", "1");
    await expect(section).toHaveCSS("visibility", "visible");
  }
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "running");
  await scene.scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute("data-illustration-active", "true");
  await expectKeyMoving(key);
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await expectKeyPaused(key, page);
});

test("without JavaScript the hospitality SVG remains visible and service/contact navigation works", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
    baseURL,
  });
  try {
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    const scene = page.locator("[data-hospitality-scene]");
    await expect(scene.locator("svg.hospitality-illustration")).toBeVisible();
    await expect(scene.locator(".welcome-key").first()).toBeVisible();
    await expectKeyPaused(scene.locator(".welcome-key").first(), page);
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.locator("#motion-toggle")).toBeHidden();
    for (const selector of [
      ".service-art-1 .orbit-one",
      ".service-art-2 .listing-front",
      ".service-art-3 .art-key-spark",
    ]) {
      const artwork = page.locator(`.service-card ${selector}`);
      await artwork.scrollIntoViewIfNeeded();
      await expect(artwork).toBeVisible();
      await expectKeyPaused(artwork, page);
    }
    await page
      .locator('main a[href^="/gestion-airbnb-corse-du-sud#section-"]')
      .first()
      .click();
    await expect(page).toHaveURL(/\/gestion-airbnb-corse-du-sud#section-\d$/);
    await expect(page.locator("h1")).toBeVisible();
    await page.locator('main a[href="/contact?intent=gestion"]').first().focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/contact\?intent=gestion$/);
    await expect(page.locator("#contact-form")).toBeVisible();
    await expect(
      page.locator('noscript a[href="mailto:contact@inastia.fr"]'),
    ).toBeVisible();
    expect(errors).toEqual([]);
  } finally {
    await context.close();
  }
});

test("hospitality animation suspends outside the viewport and resumes on return", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const scene = page.locator("[data-hospitality-scene]");
  const key = scene.locator(".welcome-key").first();
  await scene.scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute("data-illustration-active", "true");
  await expectKeyMoving(key);
  await page.locator(".site-footer").scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute("data-illustration-active", "false");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "running");
  await expectKeyPaused(key, page);
  await scene.scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute("data-illustration-active", "true");
  await expectKeyMoving(key);
});

test("scrolling reveals editorial sections instead of leaving hidden content", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const sections = page.locator("[data-reveal]");
  expect(await sections.count()).toBeGreaterThan(0);
  const deferred = await sections.evaluateAll(
    (elements) =>
      elements.filter(
        (element) =>
          !element.classList.contains("is-visible") &&
          element.getBoundingClientRect().top > innerHeight,
      ).length,
  );
  expect(
    deferred,
    "Some offscreen content should be waiting for the scroll reveal",
  ).toBeGreaterThan(0);
  for (const section of await sections.all()) {
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveClass(/\bis-visible\b/);
    await expect(section).toHaveCSS("opacity", "1");
    await expect(section).toHaveCSS("visibility", "visible");
  }
});

test("BFCache history return resumes native CSS animation and preserves pause controls", async ({
  baseURL,
}, testInfo) => {
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
      const probeWindow = window as HistoryProbeWindow;
      probeWindow.__inastiaHistoryProbe = {
        documentId: crypto.randomUUID(),
        restoredFromCache: false,
      };
      window.addEventListener("pageshow", (event) => {
        if (event.persisted)
          probeWindow.__inastiaHistoryProbe.restoredFromCache = true;
      });
    });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    const scene = page.locator("[data-hospitality-scene]");
    const key = scene.locator(".welcome-key").first();
    await expect(scene).toHaveAttribute("data-illustration-active", "true");
    await expectKeyMoving(key);
    const documentId = await page.evaluate(
      () => (window as HistoryProbeWindow).__inastiaHistoryProbe.documentId,
    );
    await page
      .locator('main a[href^="/gestion-airbnb-corse-du-sud#section-"]')
      .first()
      .click();
    await expect(page).toHaveURL(/\/gestion-airbnb-corse-du-sud#section-\d$/);
    await expect(page.locator("h1")).toBeVisible();
    await page.goBack({ waitUntil: "commit" });
    await expect(page).toHaveURL(new URL("/", baseURL).href);
    await scene.scrollIntoViewIfNeeded();
    const restored = await page.evaluate(
      () => (window as HistoryProbeWindow).__inastiaHistoryProbe,
    );
    expect(restored.documentId, "History must restore the same document").toBe(
      documentId,
    );
    expect(
      restored.restoredFromCache,
      "pageshow.persisted must confirm a real BFCache restoration",
    ).toBe(true);
    await expect(scene).toHaveAttribute("data-illustration-active", "true");
    await expectKeyMoving(key);
    const returned = await keySnapshot(key);
    const toggle = page.locator("#motion-toggle");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
    await expectKeyPaused(key, page);
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator("html")).toHaveAttribute(
      "data-motion",
      "running",
    );
    await scene.scrollIntoViewIfNeeded();
    await expectKeyMoving(key);
    expect(errors).toEqual([]);
    await testInfo.attach("bfcache-restoration", {
      body: JSON.stringify({
        ...restored,
        returned,
        resumed: await keySnapshot(key),
      }),
      contentType: "application/json",
    });
  } finally {
    await browser.close();
  }
});
