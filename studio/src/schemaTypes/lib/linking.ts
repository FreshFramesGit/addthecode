import { defineField } from "sanity";

/**
 * Document-types die als interne link-target gekozen mogen worden in cmsLink.
 *
 * Bevat alle Add the Code pagina-singletons + content-collections die hun
 * eigen route hebben. Astro-side mapping van _type → URL staat in
 * `astro-app/src/utils/cms-link.ts` (resolveDocumentPath).
 */
export const routeDocumentReferences = [
  // ─── Template singletons ───
  { type: "homePage" },
  { type: "page" },
  { type: "thankYouPage" },
  { type: "notFoundPage" },

  // ─── Add the Code pagina-singletons ───
  { type: "workIndexPage" },
  { type: "teamPage" },
  { type: "approachPage" },
  { type: "serviceDesignPage" },
  { type: "serviceBuildPage" },
  { type: "serviceAutomatePage" },
  { type: "academyIndexPage" },
  { type: "contactPage" },

  // ─── Add the Code utility singletons ───
  { type: "errorPage" },
  { type: "offlinePage" },

  // ─── Add the Code collections (slug-driven routes) ───
  { type: "case" },
  { type: "essay" },
];

export function anchorIdValidation(rule: any) {
  return rule.custom((value: string | undefined) => {
    if (!value) return true;
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
      ? true
      : "Use lowercase letters, numbers, and hyphens, e.g. faq or intake.";
  });
}

export function defineAnchorIdField(overrides: Record<string, any> = {}) {
  return defineField({
    name: "anchorId",
    title: "Anchor ID",
    type: "string",
    description:
      "Public section ID for deep links. Use lowercase letters, numbers, and hyphens.",
    validation: anchorIdValidation,
    ...overrides,
  });
}
