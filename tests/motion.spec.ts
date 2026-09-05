import { test, expect, chromium } from "@playwright/test";
import type { Page, Locator } from "@playwright/test";
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const screenshotDirectory = ".codex-work/screenshots";
mkdirSync(screenshotDirectory, { recursive: true });

type HistoryProbeWindow = typeof window & {
  __inastiaHistoryProbe: {
    documentId: string;
    restoredFromCache: boolean;
  };
};

async function sceneFrame(scene: Locator): Promise<number> {
  const value = await scene.getAttribute("data-scene-frame");
  expect(value, "The scene exposes an actual rendered frame count").toMatch(
    /^\d+$/,
  );
  return Number(value);
}

async function hasWebGL(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const context = document.createElement("canvas").getContext("webgl2");
    const supported = context !== null;
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return supported;
  });
}

async function expectStaticFrames(scene: Locator, page: Page): Promise<void> {
  // Let any frame already queued at the time of the action settle, then sample
  // across several normal rendering intervals. Waiting is necessary here:
  // an immediate equality assertion would not detect a running animation loop.
  await page.waitForTimeout(120);
  const first = await sceneFrame(scene);
  await page.waitForTimeout(450);
  expect(await sceneFrame(scene)).toBe(first);
}

test("desktop scene renders a visible nonblank canvas when WebGL is available", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const scene = page.locator("[data-villa-scene]");
  await expect(scene).toBeVisible();
  if (!(await hasWebGL(page))) {
    await expect(scene).toHaveAttribute("data-scene-state", "fallback");
    testInfo.annotations.push({
      type: "environment",
      description:
        "Browser has no WebGL2; fallback checked. Live rendering is covered only on WebGL2-capable runs.",
    });
    await expect(page.locator("h1")).toBeVisible();
    return;
  }
  await expect(scene).toHaveAttribute("data-scene-state", "ready");
  const canvas = scene.locator("canvas");
  await expect(canvas).toHaveCount(1);
  await expect(canvas).toBeVisible();
  const first = await sceneFrame(scene);
  await expect.poll(() => sceneFrame(scene)).toBeGreaterThan(first);
  const dimensions = await canvas.evaluate((element) => ({
    width: (element as HTMLCanvasElement).width,
    height: (element as HTMLCanvasElement).height,
  }));
  expect(dimensions.width).toBeGreaterThan(100);
  expect(dimensions.height).toBeGreaterThan(100);
  // Inspect a browser screenshot, rather than readPixels after the WebGL buffer
  // was cleared. This works without enabling preserveDrawingBuffer in the app.
  const screenshot = await canvas.screenshot({
    path: `${screenshotDirectory}/motion-scene-desktop.png`,
  });
  const stats = await sharp(screenshot).removeAlpha().stats();
  expect(
    Math.max(...stats.channels.map((channel) => channel.stdev)),
    "The canvas must contain visibly varied pixels, not a blank solid surface",
  ).toBeGreaterThan(5);
  await testInfo.attach("rendered-scene", {
    body: screenshot,
    contentType: "image/png",
  });
});

test("motion button pauses actual rendering and resumes it with the keyboard", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const scene = page.locator("[data-villa-scene]");
  const toggle = page.locator("#motion-toggle");
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "running");
  const webgl = await hasWebGL(page);
  await expect(scene).toHaveAttribute(
    "data-scene-state",
    webgl ? "ready" : "fallback",
  );
  if (webgl) {
    const initial = await sceneFrame(scene);
    await expect.poll(() => sceneFrame(scene)).toBeGreaterThan(initial);
  } else {
    testInfo.annotations.push({
      type: "environment",
      description:
        "No WebGL2: pause/resume UI checked, rendering-loop assertions unavailable.",
    });
  }
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  if (webgl) await expectStaticFrames(scene, page);
  const runningAnimations = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter(
          (animation) =>
            animation.playState === "running" &&
            animation.effect?.getTiming().iterations === Infinity,
        ).length,
  );
  expect(
    runningAnimations,
    "Pause must also stop continuous CSS or Web Animations",
  ).toBe(0);
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "running");
  await scene.scrollIntoViewIfNeeded();
  if (webgl) {
    const paused = await sceneFrame(scene);
    await expect.poll(() => sceneFrame(scene)).toBeGreaterThan(paused);
  }
});

test("reduced-motion starts without a rendering loop and leaves content visible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const scene = page.locator("[data-villa-scene]");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await expect(page.locator("#motion-toggle")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(scene).toHaveAttribute("data-scene-state", /^(ready|fallback)$/);
  if ((await scene.getAttribute("data-scene-state")) === "ready")
    await expectStaticFrames(scene, page);
  await expect(page.locator("h1")).toBeVisible();
  for (const section of await page.locator("[data-reveal]").all()) {
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveCSS("opacity", "1");
    await expect(section).toHaveCSS("visibility", "visible");
  }
  const toggle = page.locator("#motion-toggle");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "running");
  await scene.scrollIntoViewIfNeeded();
  if ((await scene.getAttribute("data-scene-state")) === "ready") {
    const beforeResume = await sceneFrame(scene);
    await expect.poll(() => sceneFrame(scene)).toBeGreaterThan(beforeResume);
  }
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  if ((await scene.getAttribute("data-scene-state")) === "ready")
    await expectStaticFrames(scene, page);
});

test("missing OffscreenCanvas transfer support preserves the fallback and navigation", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(
      HTMLCanvasElement.prototype,
      "transferControlToOffscreen",
      {
        configurable: true,
        value: undefined,
      },
    );
  });
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("/");
  await expect(page.locator("[data-villa-scene]")).toHaveAttribute(
    "data-scene-state",
    "fallback",
  );
  await expect(page.locator("h1")).toBeVisible();
  const fallback = page.locator("[data-villa-scene] .scene-fallback");
  await expect(fallback).toBeVisible();
  await expect(fallback).toHaveAttribute("aria-hidden", "true");
  expect(
    await fallback
      .locator("path, rect, polygon, line, circle, ellipse")
      .count(),
  ).toBeGreaterThan(0);
  await page.locator('main a[href="/contact"]').first().click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator("#contact-form")).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test("WebGL context failure inside the scene worker preserves the fallback and navigation", async ({
  page,
}) => {
  let interceptedWorker = false;
  await page.route("**/scene.worker-*.js", async (route) => {
    const response = await route.fetch();
    expect(response.ok()).toBe(true);
    // A main-window HTMLCanvasElement override cannot affect an OffscreenCanvas
    // inside a worker. Inject the failed capability into the actual worker scope.
    const failure = `const originalContext = OffscreenCanvas.prototype.getContext;
OffscreenCanvas.prototype.getContext = function (type, ...args) {
  if (["webgl", "webgl2", "experimental-webgl"].includes(type)) return null;
  return originalContext.call(this, type, ...args);
};\n`;
    interceptedWorker = true;
    await route.fulfill({ response, body: failure + (await response.text()) });
  });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const scene = page.locator("[data-villa-scene]");
  await expect(scene).toHaveAttribute("data-scene-state", "fallback");
  expect(
    interceptedWorker,
    "The real compiled worker must have received the failed WebGL context",
  ).toBe(true);
  await expect(scene.locator(".scene-fallback")).toBeVisible();
  await expect(scene.locator("canvas")).toHaveCount(0);
  await expect(page.locator("h1")).toBeVisible();
  await page.locator('main a[href="/contact"]').first().click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator("#contact-form")).toBeVisible();
  expect(errors).toEqual([]);
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

test("BFCache history return resumes scene rendering and preserves pause controls", async ({
  baseURL,
}, testInfo) => {
  // The standard Playwright Chromium launch disables BFCache. A separate
  // browser without that flag is required to test an actual persisted return.
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
        if (event.persisted) {
          probeWindow.__inastiaHistoryProbe.restoredFromCache = true;
        }
      });
    });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    const scene = page.locator("[data-villa-scene]");
    await expect(scene).toHaveAttribute("data-scene-state", "ready");
    const initialFrame = await sceneFrame(scene);
    await expect.poll(() => sceneFrame(scene)).toBeGreaterThan(initialFrame);
    const documentId = await page.evaluate(
      () => (window as HistoryProbeWindow).__inastiaHistoryProbe.documentId,
    );

    await page
      .locator('main a[href="/gestion-airbnb-corse-du-sud"]')
      .first()
      .click();
    await expect(page).toHaveURL(/\/gestion-airbnb-corse-du-sud$/);
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
    await expect(scene).toHaveAttribute("data-scene-state", "ready");
    const returnedFrame = await sceneFrame(scene);
    await expect.poll(() => sceneFrame(scene)).toBeGreaterThan(returnedFrame);

    const toggle = page.locator("#motion-toggle");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
    await expectStaticFrames(scene, page);
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator("html")).toHaveAttribute(
      "data-motion",
      "running",
    );
    await scene.scrollIntoViewIfNeeded();
    const pausedFrame = await sceneFrame(scene);
    await expect.poll(() => sceneFrame(scene)).toBeGreaterThan(pausedFrame);
    expect(errors).toEqual([]);
    await testInfo.attach("bfcache-restoration", {
      body: JSON.stringify({
        ...restored,
        returnedFrame,
        pausedFrame,
        resumedFrame: await sceneFrame(scene),
      }),
      contentType: "application/json",
    });
  } finally {
    await browser.close();
  }
});
