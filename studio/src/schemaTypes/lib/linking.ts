import { defineField } from "sanity";

export const routeDocumentReferences = [
  { type: "homePage" },
  { type: "page" },
  { type: "thankYouPage" },
  { type: "notFoundPage" },
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
