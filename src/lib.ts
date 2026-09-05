import type { Locale } from "./content/pages.ts";

export const escape = (value: string): string =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ] ?? char,
  );
export const path = (locale: Locale, slug = ""): string =>
  `${locale === "en" ? "/en/" : "/"}${slug}`;
export type ContactIntent = "audit" | "gestion";
export const contactPath = (locale: Locale, intent?: ContactIntent): string =>
  `${path(locale, "contact")}${intent ? `?intent=${intent}` : ""}`;
export const t = (locale: Locale, fr: string, en: string): string =>
  locale === "fr" ? fr : en;
export const arrow =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" stroke-width="1.5"/></svg>';
export function picture(
  name: string,
  alt: string,
  className = "",
  priority = false,
): string {
  const sizes =
    className === "property-thumb"
      ? "(min-width:1024px) 160px, (min-width:700px) 120px, 77px"
      : "95px";
  return `<picture class="${className}"><source type="image/avif" srcset="/images/${name}-240.avif 240w, /images/${name}-480.avif 480w, /images/${name}-800.avif 800w, /images/${name}-1200.avif 1200w" sizes="${sizes}"><img src="/images/${name}-240.webp" srcset="/images/${name}-240.webp 240w, /images/${name}-480.webp 480w, /images/${name}-800.webp 800w, /images/${name}-1200.webp 1200w" sizes="${sizes}" alt="${escape(alt)}" width="1200" height="805" ${priority ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async"></picture>`;
}
