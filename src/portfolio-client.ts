export function initPortfolio(): void {
  const viewer = document.querySelector<HTMLDialogElement>("#property-viewer");
  if (!viewer || typeof viewer.showModal !== "function" || viewer.dataset.initialized) return;
  const media = viewer.querySelector<HTMLElement>(".property-viewer-media");
  const title = viewer.querySelector<HTMLElement>("#property-viewer-title");
  const location = viewer.querySelector<HTMLElement>("#property-viewer-location");
  const closeButton = viewer.querySelector<HTMLButtonElement>(".property-viewer-close");
  if (!media || !title || !location || !closeButton) return;
  viewer.dataset.initialized = "true";
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".property-link[data-property]"));
  const entryKey = `portfolio-${Date.now()}`;
  let current = "";
  let closingRequested = false;
  let returnFocus: HTMLElement | null = null;

  function close(): void {
    if (!viewer?.open) return;
    viewer.close();
    document.body.classList.remove("property-view-open");
    media?.replaceChildren();
    current = "";
    closingRequested = false;
    returnFocus?.focus({ preventScroll: true });
    // History traversal can focus the destination fragment after popstate.
    requestAnimationFrame(() => {
      if (!viewer?.open) returnFocus?.focus({ preventScroll: true });
    });
  }

  function open(link: HTMLAnchorElement): void {
    const key = link.dataset.property;
    const template = document.getElementById(`property-photo-${key}`);
    if (!key || !(template instanceof HTMLTemplateElement) || !viewer || !media || !title || !location) return;
    if (current === key && viewer.open) return;
    if (!viewer.open) returnFocus = link;
    media.replaceChildren(template.content.cloneNode(true));
    title.textContent = link.dataset.propertyName ?? "";
    location.textContent = link.dataset.propertyLocation ?? "";
    current = key;
    if (!viewer.open) viewer.showModal();
    document.body.classList.add("property-view-open");
  }

  function sync(): void {
    const link = links.find((item) => window.location.hash === `#maison-${item.dataset.property}`);
    if (link) open(link);
    else close();
  }

  function requestClose(): void {
    if (!viewer?.open || closingRequested) return;
    if (history.state?.inastiaPropertyViewer === entryKey) {
      closingRequested = true;
      history.back();
    }
    else {
      close();
      const url = new URL(window.location.href);
      url.hash = "";
      history.replaceState(history.state, "", url);
    }
  }

  for (const link of links) {
    link.addEventListener("click", (event) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      event.preventDefault();
      const hash = `#maison-${link.dataset.property}`;
      if (window.location.hash !== hash) history.pushState({ ...history.state, inastiaPropertyViewer: entryKey }, "", hash);
      open(link);
    });
  }
  closeButton.addEventListener("click", requestClose);
  viewer.addEventListener("cancel", (event) => {
    event.preventDefault();
    requestClose();
  });
  window.addEventListener("popstate", sync);
  window.addEventListener("hashchange", sync);
  sync();
}
