import { defineQuery } from "groq";
import { loadQuery } from "./load-query";

// ─── Reusable GROQ Fragments ──────────────────────────────

/** Image with LQIP, dimensions, alt, hotspot, crop */
export const IMAGE_FRAGMENT = /* groq */ `{
  asset->{ _id, url, metadata { lqip, dimensions { width, height } } },
  alt,
  hotspot,
  crop
}`;

/** SEO object */
export const SEO_FRAGMENT = /* groq */ `{
  title,
  description,
  "ogImageUrl": ogImage.asset->url,
  noIndex
}`;

/** Centralized link object */
export const CMS_LINK_FRAGMENT = /* groq */ `{
  linkKind,
  openInNewTab,
  externalUrl,
  anchorId,
  "internalPage": internalPage->{ _type, "slug": slug.current },
  "pageSectionPage": pageSectionPage->{ _type, "slug": slug.current }
}`;

/** Slug as string */
const SLUG = /* groq */ `"slug": slug.current`;

// ─── Site Settings ──────────────────────────────────────────

const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    siteName,
    siteDescription,
    languageCode,
    phone, email, address,
    "defaultSeo": defaultSeo { title, description, "ogImageUrl": ogImage.asset->url, noIndex },
    "faviconUrl": favicon.asset->url,
    "webclipUrl": webclip.asset->url,
    globalCanonicalUrl,
    googleSiteVerificationId,
    llmsTxt,
    socialLinks[] { _key, platform, url },
    "logo": logo ${IMAGE_FRAGMENT}
  }
`);

export async function getSiteSettings() {
  const { data } = await loadQuery({ query: SITE_SETTINGS_QUERY });
  return data;
}

// ─── Component Defaults ─────────────────────────────────────

const COMPONENT_DEFAULTS_QUERY = defineQuery(`
  *[_type == "componentDefaults"][0] {
    cta {
      heading, description, contactName, contactPhone, contactEmail,
      buttonLabel,
      "buttonLink": buttonLink ${CMS_LINK_FRAGMENT},
      "photo": photo ${IMAGE_FRAGMENT}
    }
  }
`);

export async function getComponentDefaults() {
  const { data } = await loadQuery({ query: COMPONENT_DEFAULTS_QUERY });
  return data;
}

// ─── Navigation ─────────────────────────────────────────────

const NAVIGATION_QUERY = defineQuery(`
  *[_type == "navigation"][0] {
    mainNav[] {
      _key,
      label,
      "link": link ${CMS_LINK_FRAGMENT},
      children[] {
        _key,
        label,
        "link": link ${CMS_LINK_FRAGMENT}
      }
    },
    footerNav[] {
      _key,
      label,
      "link": link ${CMS_LINK_FRAGMENT}
    }
  }
`);

export async function getNavigation() {
  const { data } = await loadQuery({ query: NAVIGATION_QUERY });
  return data;
}

// ─── Page Singletons (pageBuilder) ─────────────────────────

/** Shared SEO fragment with OG fallback logic */
const PAGE_SEO_FRAGMENT = /* groq */ `{
  title,
  description,
  "ogImageUrl": ogImage.asset->url,
  ogTitleMode,
  ogTitle,
  ogDescriptionMode,
  ogDescription,
  canonicalUrl,
  noIndex,
  structuredData
}`;

/** Shared pageBuilder content fragment — 5 starter blocks
 *  Add project-specific blocks here when you create them in studio/src/schemaTypes/blocks/
 */
const PAGE_BUILDER_FRAGMENT = /* groq */ `content[enabled != false] {
  _type,
  _key,
  _type == "heroBlock" => {
    heading, subheading,
    mediaType, videoUrl, overlay,
    "image": image ${IMAGE_FRAGMENT},
    "posterImage": posterImage ${IMAGE_FRAGMENT},
    ctaLabel,
    "ctaLink": ctaLink ${CMS_LINK_FRAGMENT}
  },
  _type == "textBlock" => {
    heading, body, maxWidth, dividerLine, backgroundStyle
  },
  _type == "imageBlock" => {
    layout, caption,
    "image": image ${IMAGE_FRAGMENT}
  },
  _type == "ctaBlock" => {
    heading, description, contactName, contactPhone, contactEmail,
    buttonLabel,
    "buttonLink": buttonLink ${CMS_LINK_FRAGMENT},
    backgroundStyle,
    "photo": photo ${IMAGE_FRAGMENT}
  },
  _type == "contactBlock" => {
    heading, description[], showContactInfo, ctaLabel,
    "ctaLink": ctaLink ${CMS_LINK_FRAGMENT},
    "officeImage": officeImage ${IMAGE_FRAGMENT}
  }
}`;

// ─── Home Page ──────────────────────────────────────────────

const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage" && _id == "homePage"][0] {
    "seo": seo ${PAGE_SEO_FRAGMENT},
    ${PAGE_BUILDER_FRAGMENT}
  }
`);

export async function getHomePage() {
  const { data } = await loadQuery({ query: HOME_PAGE_QUERY });
  return data;
}

// ─── Generic Pages ──────────────────────────────────────────

const PAGE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    _id, title, ${SLUG},
    "seo": seo ${PAGE_SEO_FRAGMENT},
    ${PAGE_BUILDER_FRAGMENT}
  }
`);

export async function getPageBySlug(slug: string) {
  const { data } = await loadQuery({ query: PAGE_BY_SLUG_QUERY, params: { slug } });
  return data;
}

// ─── Not Found Page ────────────────────────────────────────

const NOT_FOUND_PAGE_QUERY = defineQuery(`
  *[_type == "notFoundPage" && _id == "notFoundPage"][0] {
    heading,
    body[],
    ctaLabel,
    "ctaLink": ctaLink ${CMS_LINK_FRAGMENT},
    "seo": seo ${PAGE_SEO_FRAGMENT}
  }
`);

export async function getNotFoundPage() {
  const { data } = await loadQuery({ query: NOT_FOUND_PAGE_QUERY });
  return data;
}

// ─── Thank You Page ────────────────────────────────────────

const THANK_YOU_PAGE_QUERY = defineQuery(`
  *[_type == "thankYouPage" && _id == "thankYouPage"][0] {
    heading,
    body[],
    ctaLabel,
    "ctaLink": ctaLink ${CMS_LINK_FRAGMENT},
    "seo": seo ${PAGE_SEO_FRAGMENT}
  }
`);

export async function getThankYouPage() {
  const { data } = await loadQuery({ query: THANK_YOU_PAGE_QUERY });
  return data;
}

// ─── Sitemap ───────────────────────────────────────────────

/**
 * Fetch all routable URLs from Sanity for dynamic sitemap generation.
 *
 * TODO: Add new document types here when they get their own pages.
 * Each array needs: _updatedAt and "href" with the correct route prefix.
 * Documents with seo.noIndex == true are automatically excluded.
 */
const SITEMAP_QUERY = defineQuery(`{
  "singletons": *[_type in ["homePage"] && seo.noIndex != true] {
    _type,
    _updatedAt,
    "href": select(
      _type == "homePage" => "/"
    )
  },
  "pages": *[_type == "page" && defined(slug.current) && seo.noIndex != true] {
    _updatedAt,
    "href": "/" + slug.current
  }
}`);

export async function getSitemapEntries() {
  const { data } = await loadQuery<any>({ query: SITEMAP_QUERY });
  if (!data) return [];

  const all = [
    ...(data.singletons ?? []),
    ...(data.pages ?? []),
    // TODO: add CMS collections here, e.g. ...(data.caseStudies ?? []),
  ];

  return all
    .filter((entry: any) => entry.href)
    .map((entry: any) => ({
      href: entry.href,
      lastmod: entry._updatedAt,
    }));
}

// ─── Re-export image helper ─────────────────────────────────
export { urlFor } from "./image";
