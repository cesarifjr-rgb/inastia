export function initMotion(): void {
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const toggle = document.querySelector<HTMLButtonElement>("#motion-toggle");
  const hero = document.querySelector<SVGElement>(
    ".frontier-hero .atlas-silhouette",
  );
  const illustrations: (HTMLElement | SVGElement)[] = [
    ...document.querySelectorAll<HTMLElement>(".service-art"),
    ...(hero ? [hero] : []),
  ];
  const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
  const visible = new Set<Element>();
  const lifecycle = new AbortController();
  let paused = reduced.matches;
  let suspended = false;

  function updateIllustrations(): void {
    const documentActive = !document.hidden && !suspended;
    root.dataset.motionActive = String(documentActive && !paused);
    for (const illustration of illustrations) {
      illustration.dataset.illustrationActive = String(
        visible.has(illustration) && documentActive && !paused,
      );
    }
    if (
      hero &&
      visible.has(hero) &&
      documentActive &&
      !hero.dataset.motionEntry
    ) {
      // A reduced-motion or history-restored first view is already complete.
      hero.dataset.motionEntry =
        paused || window.scrollY > 30 ? "done" : "running";
    }
  }

  const illustrationObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting && entry.intersectionRatio > 0)
                visible.add(entry.target);
              else visible.delete(entry.target);
            }
            updateIllustrations();
          },
          { threshold: 0.001 },
        )
      : undefined;

  function reveal(element: HTMLElement, animate: boolean): void {
    if (element.dataset.motionRevealed) return;
    element.dataset.motionRevealed = "true";
    element.dataset.motionEntry = animate ? "running" : "done";
    element.classList.add("is-visible");
  }

  const revealObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting || entry.intersectionRatio <= 0)
                continue;
              reveal(
                entry.target as HTMLElement,
                !paused && !document.hidden && !suspended,
              );
              revealObserver?.unobserve(entry.target);
            }
          },
          { rootMargin: "0px 0px -6% 0px", threshold: 0 },
        )
      : undefined;

  function update(): void {
    root.dataset.motion = paused ? "paused" : "running";
    toggle?.setAttribute("aria-pressed", String(paused));
    toggle?.setAttribute(
      "aria-label",
      (paused ? toggle.dataset.play : toggle.dataset.pause) ?? "Animations",
    );
    const icon = toggle?.querySelector(".motion-icon");
    if (icon) icon.textContent = paused ? "▷" : "Ⅱ";
    updateIllustrations();
    window.dispatchEvent(
      new CustomEvent("inastia:motion", { detail: { paused } }),
    );
  }

  for (const illustration of illustrations) {
    illustration.dataset.illustrationActive = "false";
    illustrationObserver?.observe(illustration);
  }
  for (const target of targets) {
    if (revealObserver) revealObserver.observe(target);
    else reveal(target, false);
    target.addEventListener(
      "animationend",
      (event) => {
        if (
          event.target === target &&
          event.animationName === "frontier-reveal"
        ) {
          target.dataset.motionEntry = "done";
        }
      },
      { signal: lifecycle.signal },
    );
  }
  hero?.addEventListener(
    "animationend",
    (event) => {
      if (event.animationName !== "atlas-enter") return;
      hero.dataset.motionEntry = "done";
      hero.dataset.illustrationActive = "false";
      visible.delete(hero);
      illustrationObserver?.unobserve(hero);
    },
    { signal: lifecycle.signal },
  );

  document.addEventListener(
    "focusin",
    (event) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>("[data-reveal]");
      if (!target) return;
      reveal(target, false);
      target.dataset.motionEntry = "done";
      revealObserver?.unobserve(target);
    },
    { signal: lifecycle.signal },
  );
  document.addEventListener("visibilitychange", updateIllustrations, {
    signal: lifecycle.signal,
  });
  toggle?.addEventListener(
    "click",
    () => {
      paused = !paused;
      update();
    },
    { signal: lifecycle.signal },
  );
  reduced.addEventListener(
    "change",
    () => {
      paused = reduced.matches;
      update();
    },
    { signal: lifecycle.signal },
  );
  window.addEventListener(
    "pagehide",
    (event) => {
      suspended = true;
      updateIllustrations();
      if (!event.persisted) {
        illustrationObserver?.disconnect();
        revealObserver?.disconnect();
        lifecycle.abort();
      }
    },
    { signal: lifecycle.signal },
  );
  window.addEventListener(
    "pageshow",
    (event) => {
      if (!event.persisted) return;
      suspended = false;
      update();
    },
    { signal: lifecycle.signal },
  );
  update();
}
