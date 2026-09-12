import { mkdir, writeFile, rm } from "node:fs/promises";
import { pages } from "../src/content/pages.ts";
import type { Locale } from "../src/content/pages.ts";
import { document, secondary, legal, contact } from "../src/templates.ts";
import { home } from "../src/home.ts";
import { intendance } from "../src/intendance.ts";
import { intendanceSlug } from "../src/content/intendance.ts";
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
      "Conciergerie en Corse : gestion saisonnière | Inastia",
      "Holiday rental management in Corsica | Inastia",
    ),
    t(
      locale,
      "Votre location en Corse gérée de A à Z : annonces, prix, voyageurs, ménage, linge et assistance 24h/24, 7j/7. De Ghisonaccia à Porto-Vecchio.",
      "Complete holiday rental management in Corsica: listings, pricing, guests, cleaning, linen and 24/7 assistance. From Ghisonaccia to Porto-Vecchio.",
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
    intendanceSlug,
    t(locale, "Intendance de résidence secondaire en Corse | Inastia", "Second-home care in Corsica | Inastia"),
    t(locale, "Visites, comptes rendus photo et préparation de votre résidence secondaire en Corse. Dès 89 € TTC/mois, mise en place 120 €. De Ghisonaccia à Porto-Vecchio.", "Visits, photo reports and preparation for your second home in Corsica. From €89/month including VAT, €120 setup. From Ghisonaccia to Porto-Vecchio."),
    intendance(locale),
  );
  await output(
    locale,
    "contact",
    t(
      locale,
      "Gestion locative et intendance — Contact | Inastia",
      "Rental management and home care — Contact | Inastia",
    ),
    t(
      locale,
      "Parlons de votre maison en Corse : gestion locative complète ou intendance de résidence secondaire. Présentez votre bien pour préparer une proposition détaillée.",
      "Discuss your home in Corsica: full rental management or second-home care. Tell us about your property to prepare a detailed proposal.",
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
