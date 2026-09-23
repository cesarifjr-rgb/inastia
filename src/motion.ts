export function initMotion(): void {
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const toggle = document.querySelector<HTMLButtonElement>("#motion-toggle");
  const hero = document.querySelector(".hero-copy");
  let paused = reduced.matches;
  let cleanup: (() => void) | undefined;
  const illustration = document.querySelector<HTMLElement>(
    "[data-hospitality-scene]",
  );
  let illustrationVisible = false;
  let suspended = false;
  function updateIllustration(): void {
    if (illustration) {
      illustration.dataset.illustrationActive = String(
        illustrationVisible && !document.hidden && !suspended,
      );
    }
  }
  const illustrationObserver = illustration
    ? new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          illustrationVisible =
            !!entry?.isIntersecting && entry.intersectionRatio > 0;
          updateIllustration();
        },
        { threshold: 0.001 },
      )
    : undefined;
  if (illustration) {
    updateIllustration();
    illustrationObserver?.observe(illustration);
    document.addEventListener("visibilitychange", updateIllustration);
  }

  function update(): void {
    cleanup?.();
    cleanup = undefined;
    root.dataset.motion = paused ? "paused" : "running";
    toggle?.setAttribute("aria-pressed", String(paused));
    toggle?.setAttribute(
      "aria-label",
      (paused ? toggle.dataset.play : toggle.dataset.pause) ?? "Animations",
    );
    const icon = toggle?.querySelector(".motion-icon");
    if (icon) icon.textContent = paused ? "▷" : "Ⅱ";
    window.dispatchEvent(
      new CustomEvent("inastia:motion", { detail: { paused } }),
    );
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (paused) {
      targets.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    if (!hero && targets.length === 0) return;
    const animations = new Map<Element, Animation>();
    function enter(element: Element, easing: string): void {
      // Content is always readable, including when Web Animations is unavailable.
      if (typeof element.animate !== "function") return;
      const animation = element.animate(
        [{ transform: "translateY(12px)" }, { transform: "translateY(0)" }],
        { duration: 220, easing },
      );
      animations.set(element, animation);
      animation.addEventListener("finish", () => animations.delete(element), { once: true });
    }
    const visual = document.querySelector(".hero-visual");
    if (hero && visual && window.scrollY < 30) enter(visual, "cubic-bezier(0.215, 0.61, 0.355, 1)");
    const observer = new IntersectionObserver(entries => {
      if (paused || suspended) return;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (entry.target.classList.contains("is-visible")) continue;
        entry.target.classList.add("is-visible");
        enter(entry.target, "cubic-bezier(0.165, 0.84, 0.44, 1)");
      }
    }, { rootMargin: "0px 0px -6% 0px" });
    targets.forEach(element => {
      if (!element.classList.contains("is-visible")) observer.observe(element);
    });
    const onFocus = (event: FocusEvent): void => {
      if (!(event.target instanceof HTMLElement)) return;
      const block = event.target.closest<HTMLElement>("[data-reveal]");
      if (!block) return;
      observer.unobserve(block);
      animations.get(block)?.cancel();
      animations.delete(block);
      block.classList.add("is-visible");
    };
    document.addEventListener("focusin", onFocus);
    cleanup = () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      document.removeEventListener("focusin", onFocus);
    };
  }
  toggle?.addEventListener("click", () => {
    paused = !paused;
    update();
  });
  reduced.addEventListener("change", () => {
    paused = reduced.matches;
    update();
  });
  update();
  window.addEventListener("pagehide", (event) => {
    suspended = true;
    updateIllustration();
    if (!event.persisted) {
      illustrationObserver?.disconnect();
      document.removeEventListener("visibilitychange", updateIllustration);
    }
    cleanup?.();
    cleanup = undefined;
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      suspended = false;
      updateIllustration();
      update();
    }
  });
}
