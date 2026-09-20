export function initFirstRental(): void {
  const checklist = document.querySelector<HTMLElement>("[data-first-checklist]");
  if (!checklist) return;
  const inputs = Array.from(checklist.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'));
  const progress = checklist.querySelector<HTMLProgressElement>("progress");
  const status = checklist.querySelector<HTMLElement>('[role="status"]');
  const panel = checklist.querySelector<HTMLElement>(".first-checklist-progress");
  if (!progress || !status || !panel) return;
  const update = (): void => {
    const count = inputs.filter(input => input.checked).length;
    progress.max = inputs.length;
    progress.value = count;
    status.textContent = `${count} / ${inputs.length} ${status.dataset.countLabel ?? ""}`;
  };
  update();
  panel.hidden = false;
  checklist.addEventListener("change", update);
  window.addEventListener("pageshow", update);
}
