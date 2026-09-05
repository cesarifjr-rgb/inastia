import { mkdir, writeFile, rm } from "node:fs/promises";
import { pages } from "../src/content/pages.ts";
import type { Locale } from "../src/content/pages.ts";
import { document, secondary, legal, contact } from "../src/templates.ts";
import { home } from "../src/home.ts";
import { path, t } from "../src/lib.ts";

// Remove only obsolete generated offer files; Vercel preserves their URLs as redirects.
for (const prefix of ["", "/en"]) {
  for (const slug of ["pack-lancement-airbnb", "menage-airbnb-corse-du-sud"]) {
    await rm(`.generated${prefix}/${slug}.html`, { force: true });
  }
}
const urls: string[] = [];
async function output(
  locale: Locale,
  slug: string,
  title: string,
  description: string,
  content: string,
  translated = true,
  noindex = false,
): Promise<void> {
  const folder = `.generated${locale === "en" ? "/en" : ""}`;
  await mkdir(folder, { recursive: true });
  await writeFile(
    `${folder}/${slug || "index"}.html`,
    document({
      locale,
      slug,
      title,
      description,
      content,
      translated,
      noindex,
    }),
  );
  if (!noindex) urls.push(`https://inastia.fr${path(locale, slug)}`);
}
for (const locale of ["fr", "en"] as const) {
  await output(
    locale,
    "",
    t(
      locale,
      "Inastia — Votre location en Corse. Un relais sur place.",
      "Inastia — Your rental in Corsica. Local property care.",
    ),
    t(
      locale,
      "Gestion complète de votre location en Corse, de Ghisonaccia à Porto-Vecchio. Une conciergerie familiale pour votre annonce, vos voyageurs et le suivi sur place.",
      "Full management of your holiday rental in Corsica, from Ghisonaccia to Porto-Vecchio. A family-run service for your listing, guests and local care.",
    ),
    home(locale),
  );
  for (const page of pages[locale])
    await output(
      locale,
      page.slug,
      page.title,
      page.description,
      secondary(locale, page),
    );
  await output(
    locale,
    "contact",
    t(
      locale,
      "Parlons de votre bien — Contact & audit gratuit | Inastia",
      "Tell us about your home — Contact & free review | Inastia",
    ),
    t(
      locale,
      "Décrivez votre maison et votre projet à Inastia. Audit gratuit de votre location saisonnière en Corse. Contact : +33 6 13 81 25 50, contact@inastia.fr.",
      "Tell Inastia about your home and plans. A free review of your holiday rental in Corsica. Contact: +33 6 13 81 25 50, contact@inastia.fr.",
    ),
    contact(locale),
  );
}
for (const [slug, title, description] of [
  [
    "mentions-legales",
    "Mentions légales — Inastia",
    "Identité de l’éditeur, hébergement et informations légales du site Inastia, conciergerie de locations saisonnières en Corse.",
  ],
  [
    "privacy",
    "Politique de confidentialité — Inastia",
    "Comment Inastia traite vos données de contact, protège vos informations et vous permet d’exercer vos droits.",
  ],
  [
    "cgv",
    "Conditions générales de vente — Inastia",
    "Conditions générales des prestations de conciergerie Inastia : services, contrat, obligations, tarification et modalités.",
  ],
] as const)
  await output("fr", slug, title, description, legal(slug), false);
await output(
  "fr",
  "404",
  "Page introuvable — Inastia",
  "Cette page n’existe pas ou a changé d’adresse.",
  `<section class="not-found"><p class="eyebrow">ERREUR 404</p><h1>Un détour imprévu.</h1><p>Cette page n’existe pas ou a changé d’adresse.<br>Retrouvons le chemin de votre projet.</p><a class="button" href="/">Retour à l’accueil →</a></section>`,
  false,
  true,
);
await writeFile(
  "public/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}\n</urlset>\n`,
);
await writeFile(
  "public/robots.txt",
  "User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: https://inastia.fr/sitemap.xml\n",
);
console.log(`Generated ${urls.length} indexable pages + 404.`);
