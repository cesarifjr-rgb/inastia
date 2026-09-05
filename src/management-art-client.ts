let disposeArt: (() => void) | undefined;

export function initManagementArt(): () => void {
  if (disposeArt) return disposeArt;
  const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-management-art]"));
  if (!scenes.length || typeof IntersectionObserver === "undefined") return () => {};
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const visible = new Set<HTMLElement>();
  let suspended = false;
  const update = (): void => {
    const motion = document.documentElement.dataset.motion;
    const allowed = !suspended && !document.hidden && motion !== "paused" && (motion === "running" || !preference.matches);
    scenes.forEach((scene) => { scene.dataset.artRunning = String(allowed && visible.has(scene)); });
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const scene = entry.target.closest<HTMLElement>("[data-management-art]");
      if (!scene) return;
      if (entry.isIntersecting) visible.add(scene);
      else visible.delete(scene);
    });
    update();
  }, { threshold: 0 });
  scenes.forEach((scene) => {
    const drawing = scene.querySelector(".management-art-scene");
    if (drawing) observer.observe(drawing);
  });
  const mutation = new MutationObserver(update);
  mutation.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
  const show = (): void => { suspended = false; update(); };
  const hide = (event: PageTransitionEvent): void => {
    suspended = true;
    update();
    if (!event.persisted) disposeArt?.();
  };
  document.addEventListener("visibilitychange", update);
  preference.addEventListener("change", update);
  window.addEventListener("pageshow", show);
  window.addEventListener("pagehide", hide);
  disposeArt = () => {
    observer.disconnect();
    mutation.disconnect();
    document.removeEventListener("visibilitychange", update);
    preference.removeEventListener("change", update);
    window.removeEventListener("pageshow", show);
    window.removeEventListener("pagehide", hide);
    scenes.forEach((scene) => { scene.dataset.artRunning = "false"; });
    disposeArt = undefined;
  };
  update();
  return disposeArt;
}
