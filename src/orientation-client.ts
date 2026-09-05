/** Enhance the optional guide without changing the always-visible comparison. */
export function initOrientation(): void {
  document
    .querySelectorAll<HTMLDetailsElement>("[data-orientation-guide]")
    .forEach((guide) => {
      if (guide.dataset.orientationReady === "true") return;
      const choices = Array.from(
        guide.querySelectorAll<HTMLInputElement>("[data-orientation-choice]"),
      );
      const reset = guide.querySelector<HTMLButtonElement>(
        "[data-orientation-reset]",
      );
      const neutral = guide.querySelector<HTMLElement>(
        "[data-orientation-neutral]",
      );
      const results = Array.from(
        guide.querySelectorAll<HTMLElement>("[data-orientation-result]"),
      );
      if (choices.length === 0 || !reset || !neutral || results.length === 0)
        return;

      const update = (): void => {
        const value = choices.find((choice) => choice.checked)?.value;
        const selected = results.find(
          (result) => result.dataset.orientationResult === value,
        );
        results.forEach((result) => {
          result.hidden = result !== selected;
        });
        neutral.hidden = !!selected;
      };
      choices.forEach((choice) => choice.addEventListener("change", update));
      reset.addEventListener("click", () => {
        choices.forEach((choice) => {
          choice.checked = false;
        });
        update();
      });
      // Browser-restored radio state must agree with the displayed suggestion.
      window.addEventListener("pageshow", update);
      update();
      guide.dataset.orientationReady = "true";
      guide.hidden = false;
    });
}
