import type { SceneMessage, SceneReply } from "./scene.worker";

/** DOM bridge only. Blender/Three rendering and parsing live in a dedicated worker. */
export function initVillaScene(): void {
  const host = document.querySelector<HTMLElement>("[data-villa-scene]");
  if (
    !host ||
    host.dataset.sceneInitialized ||
    ["ready", "fallback"].includes(host.dataset.sceneState ?? "")
  )
    return;
  host.dataset.sceneInitialized = "true";
  host.dataset.sceneState = "loading";
  host.setAttribute("aria-hidden", "true");
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "display:block;width:100%;height:100%;pointer-events:none";
  if (!canvas.transferControlToOffscreen || typeof Worker === "undefined") {
    host.dataset.sceneState = "fallback";
    return;
  }
  let worker: Worker;
  let offscreen: OffscreenCanvas;
  try {
    offscreen = canvas.transferControlToOffscreen();
    worker = new Worker(new URL("./scene.worker.ts", import.meta.url), {
      type: "module",
    });
  } catch {
    host.dataset.sceneState = "fallback";
    return;
  }
  host.append(canvas);
  const compact = window.matchMedia("(max-width: 767px)");
  let paused = document.documentElement.dataset.motion === "paused";
  let visible = true;
  let suspended = false;
  let disposed = false;
  const watchdog = window.setTimeout(fallback, 30000);
  function active(): boolean {
    return !paused && visible && !document.hidden && !suspended;
  }
  function send(message: SceneMessage): void {
    if (!disposed) worker.postMessage(message);
  }
  function sync(): void {
    send({ type: "active", active: active() });
  }
  function resize(): void {
    if (disposed || suspended) return;
    const { width, height } = host!.getBoundingClientRect();
    if (width > 0 && height > 0)
      send({ type: "resize", width, height, compact: compact.matches });
  }
  function pointer(event: PointerEvent): void {
    if (!active()) return;
    const bounds = host!.getBoundingClientRect();
    send({
      type: "pointer",
      x: Math.max(
        -0.5,
        Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5),
      ),
      y: Math.max(
        -0.5,
        Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5),
      ),
    });
  }
  function leave(): void {
    send({ type: "pointer", x: 0, y: 0 });
  }
  function motion(event: Event): void {
    paused =
      (event as CustomEvent<{ paused?: boolean }>).detail?.paused ??
      document.documentElement.dataset.motion === "paused";
    sync();
  }
  const resizeObserver = new ResizeObserver(resize);
  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries[0]?.isIntersecting ?? false;
      sync();
    },
    { threshold: 0 },
  );
  function pageHide(event: PageTransitionEvent): void {
    if (event.persisted) {
      suspended = true;
      sync();
    } else dispose();
  }
  function pageShow(event: PageTransitionEvent): void {
    if (!event.persisted || disposed) return;
    suspended = false;
    resize();
    sync();
  }
  function receive(event: MessageEvent<SceneReply>): void {
    if (disposed) return;
    if (event.data.type === "fallback") {
      fallback();
      return;
    }
    window.clearTimeout(watchdog);
    host!.dataset.sceneState = "ready";
    host!.dataset.sceneFrame = String(event.data.frame);
  }
  function workerError(event: ErrorEvent): void {
    event.preventDefault();
    fallback();
  }
  function dispose(): void {
    if (disposed) return;
    send({ type: "dispose" });
    disposed = true;
    worker.terminate();
    window.clearTimeout(watchdog);
    resizeObserver.disconnect();
    observer.disconnect();
    host!.removeEventListener("pointermove", pointer);
    host!.removeEventListener("pointerleave", leave);
    window.removeEventListener("inastia:motion", motion);
    window.removeEventListener("pagehide", pageHide);
    window.removeEventListener("pageshow", pageShow);
    document.removeEventListener("visibilitychange", sync);
    worker.removeEventListener("message", receive);
    worker.removeEventListener("error", workerError);
  }
  function fallback(): void {
    dispose();
    canvas.remove();
    host!.dataset.sceneState = "fallback";
  }
  worker.addEventListener("message", receive);
  worker.addEventListener("error", workerError);
  host.addEventListener("pointermove", pointer, { passive: true });
  host.addEventListener("pointerleave", leave);
  window.addEventListener("inastia:motion", motion);
  window.addEventListener("pagehide", pageHide);
  window.addEventListener("pageshow", pageShow);
  document.addEventListener("visibilitychange", sync);
  const { width, height } = host.getBoundingClientRect();
  worker.postMessage(
    {
      type: "init",
      canvas: offscreen,
      width,
      height,
      pixelRatio: Math.min(window.devicePixelRatio, 1.5),
      compact: compact.matches,
      active: active(),
      url: new URL("/models/inastia-villa.glb", window.location.href).href,
    } satisfies SceneMessage,
    [offscreen],
  );
  resizeObserver.observe(host);
  observer.observe(host);
}
