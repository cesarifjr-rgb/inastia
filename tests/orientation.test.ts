import { describe, expect, it } from "vitest";
import { delegationGuide, recommendationFor } from "../src/orientation.ts";

describe("declaration-based delegation guidance", () => {
  it.each([
    ["large", "gestion", "gestion-airbnb-corse-du-sud"],
    ["listing", "annonce", "pack-lancement-airbnb"],
    ["local", "rotation", "menage-airbnb-corse-du-sud"],
    ["unsure", "audit", "audit-gratuit-potentiel-locatif"],
  ])("maps %s only to the documented offer", (need, intent, slug) => {
    expect(recommendationFor(need)).toEqual({ intent, slug });
  });

  it.each([
    "",
    "unknown",
    "constructor",
    "__proto__",
    "toString",
    null,
    undefined,
    0,
    {},
    ["large"],
  ])(
    "does not infer an offer from an absent or unsupported input: %s",
    (input) => expect(recommendationFor(input)).toBeNull(),
  );

  it("cannot change future recommendations through a returned object", () => {
    const suggestion = recommendationFor("large")!;
    suggestion.intent = "audit";
    expect(recommendationFor("large")?.intent).toBe("gestion");
  });

  it.each(["fr", "en"] as const)(
    "keeps the %s static comparison accessible and every contact intent explicit",
    (locale) => {
      const html = delegationGuide(locale);
      const prefix = locale === "en" ? "/en" : "";
      expect(html).toContain('href="#comparaison"');
      expect(html).toContain("data-orientation-guide hidden");
      expect(html).toContain('role="status"');
      expect(
        html.match(/data-orientation-result="[^"]+" hidden/g),
      ).toHaveLength(4);
      for (const need of ["large", "listing", "local", "unsure"]) {
        const suggestion = recommendationFor(need)!;
        expect(html).toContain(
          `href="${prefix}/contact?intent=${suggestion.intent}"`,
        );
        expect(html).toContain(`href="${prefix}/${suggestion.slug}"`);
      }
      expect(html).not.toMatch(/\bid="|<form\b|type="submit"|<script\b/);
      expect(html).toContain('<fieldset class="orientation-options"><legend>');
      expect(html.match(/type="radio"/g)).toHaveLength(4);
      expect(html.match(/class="orientation-choice-text"/g)).toHaveLength(4);
      expect(html).not.toMatch(/<select\b|\bchecked\b/);
    },
  );

  it("keeps radio choices grouped within each independent guide", () => {
    const groupNames = [delegationGuide("fr"), delegationGuide("fr")].map(
      (html) =>
        [...html.matchAll(/type="radio" name="([^"]+)"/g)].map(
          (match) => match[1],
        ),
    );
    for (const names of groupNames) {
      expect(names).toHaveLength(4);
      expect(new Set(names).size).toBe(1);
    }
    expect(groupNames[0]![0]).not.toBe(groupNames[1]![0]);
  });
});
