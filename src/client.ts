import "./styles.css";
import { initContact } from "./contact.ts";

const toggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
const menu = document.querySelector<HTMLElement>("#mobile-menu");
const main = document.querySelector<HTMLElement>("main");
const footer = document.querySelector<HTMLElement>(".site-footer");

function closeMenu(returnFocus = false): void {
  if (!toggle || !menu) return;
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", toggle.dataset.openLabel ?? "Menu");
  menu.hidden = true;
  document.body.classList.remove("menu-open");
  if (main) main.inert = false;
  if (footer) footer.inert = false;
  if (returnFocus) toggle.focus();
}

toggle?.addEventListener("click", () => {
  if (!menu || !toggle) return;
  if (!menu.hidden) {
    closeMenu(true);
    return;
  }
  menu.hidden = false;
  toggle.setAttribute("aria-expanded", "true");
  toggle.setAttribute("aria-label", toggle.dataset.closeLabel ?? "Close menu");
  document.body.classList.add("menu-open");
  if (main) main.inert = true;
  if (footer) footer.inert = true;
  menu.querySelector<HTMLAnchorElement>("a")?.focus();
});

menu?.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest<HTMLAnchorElement>("a");
  if (!link) return;
  closeMenu();
  const url = new URL(link.href);
  if (url.pathname === location.pathname && url.hash) {
    const destination = document.getElementById(url.hash.slice(1));
    destination?.setAttribute("tabindex", "-1");
    destination?.focus({ preventScroll: true });
  }
});

document.addEventListener("keydown", (event) => {
  if (menu?.hidden !== false) return;
  if (event.key === "Escape") {
    closeMenu(true);
    return;
  }
  if (event.key !== "Tab") return;
  const links = Array.from(
    document.querySelectorAll<HTMLElement>(
      ".site-header a, .site-header button",
    ),
  ).filter((element) => element.getClientRects().length > 0);
  const first = links[0];
  const last = links.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
});

matchMedia("(min-width:1024px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});
initContact();
