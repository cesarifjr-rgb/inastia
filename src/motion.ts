export function initMotion(): void {
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const toggle = document.querySelector<HTMLButtonElement>("#motion-toggle");
  const hero = document.querySelector(".hero-copy");
  let paused = reduced.matches;
  let cleanup: (() => void) | undefined;
  let generation = 0;
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

  async function update(): Promise<void> {
    const current = ++generation;
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
    try {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (current !== generation || paused) return;
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        // The first impression opens like a composition; no scrolling is intercepted.
        if (hero && window.scrollY < 30) {
          gsap.fromTo(
            ".hero-copy h1 > span",
            { y: 48, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.05,
              stagger: 0.1,
              ease: "power3.out",
              clearProps: "all",
            },
          );
          gsap.fromTo(
            ".hero-visual",
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.4,
              delay: 0.1,
              ease: "power2.out",
              clearProps: "all",
            },
          );
        }
        targets.forEach((element) => {
          // Already visible content is never hidden on a pause/resume transition.
          if (element.classList.contains("is-visible")) return;
          gsap.fromTo(
            element,
            { y: 35, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: element, start: "top 94%", once: true },
              onStart: () => element.classList.add("is-visible"),
              clearProps: "transform,opacity",
            },
          );
        });
        if (document.querySelector(".manifesto-orb")) {
          gsap.to(".manifesto-orb", {
            y: 120,
            rotation: -8,
            ease: "none",
            scrollTrigger: {
              trigger: ".manifesto-section",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
          gsap.to(".manifesto-section h2 span", {
            color: "#1c6285",
            ease: "none",
            scrollTrigger: {
              trigger: ".manifesto-section",
              start: "top 70%",
              end: "center 50%",
              scrub: 1,
            },
          });
          gsap.to(".presence-art svg", {
            x: 100,
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: ".presence-section",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        }
      });
      const onFocus = (event: FocusEvent): void => {
        if (!(event.target instanceof HTMLElement)) return;
        const block = event.target.closest<HTMLElement>("[data-reveal]");
        if (block) {
          gsap.killTweensOf(block);
          gsap.set(block, { clearProps: "transform,opacity" });
          block.classList.add("is-visible");
        }
      };
      document.addEventListener("focusin", onFocus);
      cleanup = () => {
        context.revert();
        document.removeEventListener("focusin", onFocus);
      };
    } catch {
      // Static HTML remains the functional fallback if an optional animation fails to load.
      targets.forEach((element) => element.classList.add("is-visible"));
    }
  }
  toggle?.addEventListener("click", () => {
    paused = !paused;
    void update();
  });
  reduced.addEventListener("change", () => {
    paused = reduced.matches;
    void update();
  });
  void update();
  window.addEventListener("pagehide", (event) => {
    suspended = true;
    updateIllustration();
    if (!event.persisted) {
      illustrationObserver?.disconnect();
      document.removeEventListener("visibilitychange", updateIllustration);
    }
    generation++;
    cleanup?.();
    cleanup = undefined;
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      suspended = false;
      updateIllustration();
      void update();
    }
  });
}
