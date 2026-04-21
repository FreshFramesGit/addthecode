import { LinkIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { defineAnchorIdField, routeDocumentReferences } from "../lib/linking";

type LinkParent = {
  linkKind?: "internalPage" | "pageSection" | "external";
};

export const cmsLink = defineType({
  name: "cmsLink",
  title: "Link",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "linkKind",
      title: "Link type",
      type: "string",
      options: {
        list: [
          { title: "Internal page", value: "internalPage" },
          { title: "Page section", value: "pageSection" },
          { title: "External", value: "external" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "internalPage",
      title: "Internal page",
      type: "reference",
      to: routeDocumentReferences,
      hidden: ({ parent }: { parent?: LinkParent }) =>
        parent?.linkKind !== "internalPage",
      validation: (rule: any) =>
        rule.custom((value: unknown, context: { parent?: LinkParent }) => {
          if (context.parent?.linkKind !== "internalPage") return true;
          return value ? true : "Choose an internal page.";
        }),
    }),
    defineField({
      name: "pageSectionPage",
      title: "Target page",
      type: "reference",
      to: routeDocumentReferences,
      hidden: ({ parent }: { parent?: LinkParent }) =>
        parent?.linkKind !== "pageSection",
      validation: (rule: any) =>
        rule.custom((value: unknown, context: { parent?: LinkParent }) => {
          if (context.parent?.linkKind !== "pageSection") return true;
          return value ? true : "Choose the page this section is on.";
        }),
    }),
    defineAnchorIdField({
      hidden: ({ parent }: { parent?: LinkParent }) =>
        parent?.linkKind !== "pageSection",
      validation: (rule: any) =>
        rule.custom((value: string | undefined, context: { parent?: LinkParent }) => {
          if (context.parent?.linkKind !== "pageSection") return true;
          if (!value) return "Enter an anchor ID, e.g. faq or intake.";
          return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
            ? true
            : "Use lowercase letters, numbers, and hyphens, e.g. faq or intake.";
        }),
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "url",
      hidden: ({ parent }: { parent?: LinkParent }) =>
        parent?.linkKind !== "external",
      validation: (rule: any) =>
        rule.custom((value: unknown, context: { parent?: LinkParent }) => {
          if (context.parent?.linkKind !== "external") return true;
          return value ? true : "Enter an external URL.";
        }),
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in new tab",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      linkKind: "linkKind",
      externalUrl: "externalUrl",
      anchorId: "anchorId",
      internalPageSlug: "internalPage.slug.current",
      pageSectionSlug: "pageSectionPage.slug.current",
    },
    prepare({ linkKind, externalUrl, anchorId, internalPageSlug, pageSectionSlug }) {
      if (linkKind === "internalPage") {
        return {
          title: "Internal page",
          subtitle: internalPageSlug ? `/${internalPageSlug}` : "/",
        };
      }

      if (linkKind === "pageSection") {
        const route = pageSectionSlug ? `/${pageSectionSlug}` : "/";
        return {
          title: "Page section",
          subtitle: `${route}#${anchorId ?? "anchor"}`,
        };
      }

      return {
        title: "External link",
        subtitle: externalUrl ?? "Incomplete",
      };
    },
  },
});
