export function initMobileContact(): void {
  const main = document.querySelector("main");
  const primary = main?.querySelector<HTMLAnchorElement>(
    '.home-hero .button[href*="/contact?"], .page-hero .button[href*="/contact?"], .intendance-hero .button[href*="/contact?"], .first-hero .button[href*="/contact?"]',
  );
  if (!main || !primary || !("IntersectionObserver" in window)) return;

  // Reuse the page's actual wording and intention, including audit and home care.
  const reminder = document.createElement("div");
  reminder.className = "mobile-contact";
  reminder.hidden = true;
  const link = document.createElement("a");
  link.className = "button";
  link.href = primary.getAttribute("href") ?? primary.href;
  link.innerHTML = primary.innerHTML;
  link.dataset.contactPlacement = "mobile_sticky";
  reminder.append(link);
  main.append(reminder);

  const mobile = matchMedia("(max-width: 699px)");
  const consent = document.getElementById("ads-consent");
  const footer = document.querySelector(".site-footer");
  const alternatives = [...main.querySelectorAll<HTMLAnchorElement>('.button[href*="/contact?"]')]
    .filter(button => button !== link);
  const visible = new Set<Element>();
  const update = (): void => {
    const editing = document.activeElement?.matches('input, textarea, select, [contenteditable="true"]');
    const keyboard = window.visualViewport && window.visualViewport.height < window.innerHeight * 0.8;
    reminder.hidden = !mobile.matches || primary.getBoundingClientRect().bottom > 0
      || visible.size > 0 || consent?.hidden === false || document.body.classList.contains("menu-open")
      || Boolean(editing || keyboard);
  };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    update();
  });
  for (const element of [...alternatives, ...(footer ? [footer] : [])]) observer.observe(element);
  const overlays = new MutationObserver(update);
  if (consent) overlays.observe(consent, { attributes: true, attributeFilter: ["hidden"] });
  overlays.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  mobile.addEventListener("change", update);
  document.addEventListener("focusin", update);
  document.addEventListener("focusout", () => requestAnimationFrame(update));
  window.visualViewport?.addEventListener("resize", update);
  window.addEventListener("pageshow", update);
}
