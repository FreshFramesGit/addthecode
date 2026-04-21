import { defineQuery } from "groq";
import { loadQuery } from "./load-query";

// ─── Reusable GROQ Fragments ──────────────────────────────

/** Image with LQIP, dimensions, alt, hotspot, crop */
export const IMAGE_FRAGMENT = /* groq */ `{
  asset->{ _id, url, metadata { lqip, dimensions { width, height } } },
  alt,
  caption,
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

/** Period object (case.period) */
export const PERIOD_FRAGMENT = /* groq */ `{
  start,
  end,
  isOngoing
}`;

/** Metric object */
export const METRIC_FRAGMENT = /* groq */ `{
  label,
  value,
  source,
  verifiedByAlex
}`;

/** Quote attribution */
export const QUOTE_ATTRIBUTION_FRAGMENT = /* groq */ `{
  quote,
  name,
  role,
  company,
  "portrait": portrait ${IMAGE_FRAGMENT}
}`;

/** Slug as string */
const SLUG = /* groq */ `"slug": slug.current`;

// ─── Site Settings ──────────────────────────────────────────

const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    siteName,
    siteDescription,
    tagline,
    languageCode,
    timeZone,
    phone, email, address, whatsapp,
    studioAddress {
      addressLine1,
      postalCode,
      city,
      country,
      openingHours,
      visitingNote,
      mapUrl
    },
    "defaultSeo": defaultSeo { title, description, "ogImageUrl": ogImage.asset->url, noIndex },
    "faviconUrl": favicon.asset->url,
    "webclipUrl": webclip.asset->url,
    globalCanonicalUrl,
    googleSiteVerificationId,
    enableSitemap,
    robotsDirectives,
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
    },
    ctaRefreins[] {
      _key,
      key,
      statement,
      helperLine,
      buttonLabel,
      "buttonLink": buttonLink ${CMS_LINK_FRAGMENT}
    },
    newsletter {
      intro,
      placeholder,
      buttonLabel,
      buttonLabelSubmitting,
      helperLine,
      consentLabel,
      successMessage,
      errorMessage
    },
    expectationSteps {
      heading,
      steps[] {
        _key,
        stepNumber,
        label,
        description
      }
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

// ─── Page settings + Page Builder ──────────────────────────

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

/**
 * Shared pageBuilder content fragment — alle Add the Code blocks.
 *
 * Filter `enabled != false` op query-niveau verwijdert uitgeschakelde secties.
 * Astro PageBuilder doet dezelfde check defensief vóór render (Universal Rule #4).
 *
 * Per-block sub-fragmenten: alleen public-facing velden, hotspot/asset via IMAGE_FRAGMENT.
 */
const PAGE_BUILDER_FRAGMENT = /* groq */ `content[enabled != false] {
  _type,
  _key,
  enabled,
  anchorId,
  tone,

  // ─── Hero's ───
  _type == "heroHomeBlock" => {
    preClaim,
    headlineParts,
    subClaim,
    bodyText,
    ctas[] {
      _key,
      label,
      variant,
      "link": link ${CMS_LINK_FRAGMENT}
    },
    showThinkingRing
  },
  _type == "heroStandardBlock" => {
    preClaim,
    heading,
    subheading,
    layoutVariant,
    "artifact": artifact ${IMAGE_FRAGMENT},
    ctas[] {
      _key,
      label,
      variant,
      "link": link ${CMS_LINK_FRAGMENT}
    }
  },

  // ─── Sections ───
  _type == "pitchOpeningBlock" => {
    preClaim,
    body,
    maxWidth
  },
  _type == "serviceTriptychBlock" => {
    preClaim,
    heading,
    intro,
    tiles[] {
      _key,
      title,
      tagline,
      description,
      ctaLabel,
      "ctaLink": ctaLink ${CMS_LINK_FRAGMENT},
      icon
    }
  },
  _type == "quoteClusterBlock" => {
    preClaim,
    heading,
    "primaryQuote": primaryQuote ${QUOTE_ATTRIBUTION_FRAGMENT},
    "secondaryQuotes": secondaryQuotes[] ${QUOTE_ATTRIBUTION_FRAGMENT}
  },
  _type == "ctaRefreinBlock" => {
    pageKey,
    overrideStatement,
    overrideButtonLabel,
    "overrideButtonLink": overrideButtonLink ${CMS_LINK_FRAGMENT}
  },
  _type == "heritageStripBlock" => {
    preClaim,
    heading,
    items
  },
  _type == "projectGridBlock" => {
    preClaim,
    heading,
    intro,
    layerFilter,
    maxItems,
    showFilterChips,
    cardLayoutVariant
  },
  _type == "essayGridBlock" => {
    preClaim,
    heading,
    intro,
    categoryFilter,
    maxItems,
    showFeaturedFirst,
    showFilterChips
  },
  _type == "teamGridBlock" => {
    preClaim,
    heading,
    coreOnly,
    showQuotes
  },
  _type == "timelineBlock" => {
    preClaim,
    heading,
    intro,
    items[] {
      _key,
      year,
      label,
      description,
      highlight
    },
    orientation
  },

  // ─── Case-detail blocks ───
  _type == "decisionBlock" => {
    preClaim,
    question,
    options[] {
      _key,
      label,
      pros,
      cons,
      chosen
    },
    conclusion
  },
  _type == "phaseBlock" => {
    phaseNumber,
    phaseName,
    oneLiner,
    body,
    aiRole,
    humanResponsibility,
    deliverables,
    duration
  },
  _type == "metaBlock" => {
    heading,
    items[] {
      _key,
      label,
      value,
      "href": href ${CMS_LINK_FRAGMENT}
    }
  },
  _type == "artifactGalleryBlock" => {
    preClaim,
    heading,
    intro,
    items[] {
      _key,
      "image": image ${IMAGE_FRAGMENT},
      title,
      caption
    },
    layoutVariant
  },
  _type == "metricsStripBlock" => {
    preClaim,
    heading,
    "metrics": metrics[] ${METRIC_FRAGMENT},
    sourceNote
  },
  _type == "nextCaseBlock" => {
    preClaim,
    heading,
    "recommendedCase": recommendedCase->{
      _id, title, ${SLUG}, layer, subtitle,
      "heroArtifact": heroArtifact ${IMAGE_FRAGMENT}
    },
    recommendationReason,
    "alternativeCase": alternativeCase->{
      _id, title, ${SLUG}, layer, subtitle,
      "heroArtifact": heroArtifact ${IMAGE_FRAGMENT}
    }
  },
  _type == "ndaExplainerBlock" => {
    preClaim,
    heading,
    body,
    expectedReleaseDate,
    contactCta {
      label,
      "link": link ${CMS_LINK_FRAGMENT}
    }
  },

  // ─── Forms + utility ───
  _type == "contactFormBlock" => {
    preClaim,
    heading,
    intro,
    topicOptions,
    requireCompany,
    submitLabel,
    successMessage,
    errorMessage
  },
  _type == "newsletterFormBlock" => {
    preClaim,
    overrideIntro,
    overrideHelperLine,
    source
  },
  _type == "faqBlock" => {
    preClaim,
    heading,
    items[] {
      _key,
      question,
      answer
    },
    enableJsonLd
  },
  _type == "directChannelsBlock" => {
    preClaim,
    heading,
    channels[] {
      _key,
      kind,
      label,
      value,
      helperLine
    },
    layoutVariant
  },
  _type == "expectationStepsBlock" => {
    overrideHeading,
    overrideSteps[] {
      _key,
      stepNumber,
      label,
      description
    }
  },
  _type == "calloutBlock" => {
    kind,
    body,
    attribution
  },
  _type == "tagStripBlock" => {
    preClaim,
    tags,
    showAsLinks
  },
  _type == "preClaimBlock" => {
    text,
    showThinkingRing
  },

  // ─── Legacy template blocks (backwards-compat) ───
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

// ─── Page Singletons ────────────────────────────────────────

/** Generic helper: bouw een query voor een pagina-singleton met SEO + content. */
function singletonPageQuery(typeName: string) {
  return defineQuery(`
    *[_type == "${typeName}" && _id == "${typeName}"][0] {
      "seo": seo ${PAGE_SEO_FRAGMENT},
      ${PAGE_BUILDER_FRAGMENT}
    }
  `);
}

const HOME_PAGE_QUERY = singletonPageQuery('homePage');
const WORK_INDEX_PAGE_QUERY = singletonPageQuery('workIndexPage');
const TEAM_PAGE_QUERY = singletonPageQuery('teamPage');
const APPROACH_PAGE_QUERY = singletonPageQuery('approachPage');
const SERVICE_DESIGN_PAGE_QUERY = singletonPageQuery('serviceDesignPage');
const SERVICE_BUILD_PAGE_QUERY = singletonPageQuery('serviceBuildPage');
const SERVICE_AUTOMATE_PAGE_QUERY = singletonPageQuery('serviceAutomatePage');
const ACADEMY_INDEX_PAGE_QUERY = singletonPageQuery('academyIndexPage');
const CONTACT_PAGE_QUERY = singletonPageQuery('contactPage');

export async function getHomePage() {
  const { data } = await loadQuery({ query: HOME_PAGE_QUERY });
  return data;
}
export async function getWorkIndexPage() {
  const { data } = await loadQuery({ query: WORK_INDEX_PAGE_QUERY });
  return data;
}
export async function getTeamPage() {
  const { data } = await loadQuery({ query: TEAM_PAGE_QUERY });
  return data;
}
export async function getApproachPage() {
  const { data } = await loadQuery({ query: APPROACH_PAGE_QUERY });
  return data;
}
export async function getServiceDesignPage() {
  const { data } = await loadQuery({ query: SERVICE_DESIGN_PAGE_QUERY });
  return data;
}
export async function getServiceBuildPage() {
  const { data } = await loadQuery({ query: SERVICE_BUILD_PAGE_QUERY });
  return data;
}
export async function getServiceAutomatePage() {
  const { data } = await loadQuery({ query: SERVICE_AUTOMATE_PAGE_QUERY });
  return data;
}
export async function getAcademyIndexPage() {
  const { data } = await loadQuery({ query: ACADEMY_INDEX_PAGE_QUERY });
  return data;
}
export async function getContactPage() {
  const { data } = await loadQuery({ query: CONTACT_PAGE_QUERY });
  return data;
}

// ─── Generic Pages (free pages) ────────────────────────────

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

// ─── Utility pages (404 / 500 / offline / thank-you) ───────

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

const ERROR_PAGE_QUERY = defineQuery(`
  *[_type == "errorPage" && _id == "errorPage"][0] {
    heading,
    body[],
    ctaLabel,
    "ctaLink": ctaLink ${CMS_LINK_FRAGMENT},
    "seo": seo ${PAGE_SEO_FRAGMENT}
  }
`);

export async function getErrorPage() {
  const { data } = await loadQuery({ query: ERROR_PAGE_QUERY });
  return data;
}

const OFFLINE_PAGE_QUERY = defineQuery(`
  *[_type == "offlinePage" && _id == "offlinePage"][0] {
    heading,
    body[],
    ctaLabel,
    "ctaLink": ctaLink ${CMS_LINK_FRAGMENT},
    "seo": seo ${PAGE_SEO_FRAGMENT}
  }
`);

export async function getOfflinePage() {
  const { data } = await loadQuery({ query: OFFLINE_PAGE_QUERY });
  return data;
}

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

// ─── Cases (collection) ────────────────────────────────────

/** Card-shape voor projectGridBlock — alleen velden voor de card-render. */
const CASE_CARD_FRAGMENT = /* groq */ `{
  _id,
  _updatedAt,
  title,
  ${SLUG},
  layer,
  ndaStatus,
  status,
  client,
  "period": period ${PERIOD_FRAGMENT},
  preClaim,
  subtitle,
  tags,
  stack,
  "heroArtifact": heroArtifact ${IMAGE_FRAGMENT},
  liveUrl
}`;

/** Volledige case-detail shape. */
const CASE_DETAIL_FRAGMENT = /* groq */ `{
  _id,
  _updatedAt,
  language,
  title,
  ${SLUG},
  layer,
  ndaStatus,
  status,
  client,
  role,
  "period": period ${PERIOD_FRAGMENT},
  preClaim,
  subtitle,
  tags,
  stack,
  liveUrl,
  "heroArtifact": heroArtifact ${IMAGE_FRAGMENT},
  "seo": seo ${PAGE_SEO_FRAGMENT},
  ${PAGE_BUILDER_FRAGMENT}
}`;

const CASES_BY_LAYER_QUERY = defineQuery(`
  *[_type == "case" && status == "live" && ($layer == "all" || layer == $layer)] | order(period.start desc) ${CASE_CARD_FRAGMENT}
`);

export async function getCasesByLayer(layer: 'launch' | 'in-flight' | 'heritage' | 'all' = 'all') {
  const { data } = await loadQuery({ query: CASES_BY_LAYER_QUERY, params: { layer } });
  return data ?? [];
}

const CASE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "case" && slug.current == $slug][0] ${CASE_DETAIL_FRAGMENT}
`);

export async function getCaseBySlug(slug: string) {
  const { data } = await loadQuery({ query: CASE_BY_SLUG_QUERY, params: { slug } });
  return data;
}

const ALL_CASE_SLUGS_QUERY = defineQuery(`
  *[_type == "case" && status == "live" && defined(slug.current)] {
    "slug": slug.current
  }
`);

export async function getAllCaseSlugs() {
  const { data } = await loadQuery({ query: ALL_CASE_SLUGS_QUERY });
  return data ?? [];
}

// ─── Essays (collection) ───────────────────────────────────

/** Card-shape voor essayGridBlock. */
const ESSAY_CARD_FRAGMENT = /* groq */ `{
  _id,
  _updatedAt,
  title,
  ${SLUG},
  category,
  featured,
  publishedAt,
  readTime,
  preClaim,
  dek,
  "author": author->{ name, ${SLUG}, role },
  "featuredImage": featuredImage ${IMAGE_FRAGMENT}
}`;

/** Volledige essay-detail shape. */
const ESSAY_DETAIL_FRAGMENT = /* groq */ `{
  _id,
  _updatedAt,
  language,
  title,
  ${SLUG},
  category,
  status,
  featured,
  publishedAt,
  readTime,
  preClaim,
  dek,
  tags,
  "featuredImage": featuredImage ${IMAGE_FRAGMENT},
  "author": author->{ name, ${SLUG}, role, "portrait": portrait ${IMAGE_FRAGMENT} },
  "relatedEssays": relatedEssays[]-> ${ESSAY_CARD_FRAGMENT},
  body,
  "seo": seo ${PAGE_SEO_FRAGMENT}
}`;

const ESSAYS_QUERY = defineQuery(`
  *[_type == "essay" && status == "live" && ($category == "all" || category == $category)] | order(publishedAt desc) ${ESSAY_CARD_FRAGMENT}
`);

export async function getEssays(category: 'all' | 'principle' | 'practice' | 'analyse' = 'all') {
  const { data } = await loadQuery({ query: ESSAYS_QUERY, params: { category } });
  return data ?? [];
}

const FEATURED_ESSAYS_QUERY = defineQuery(`
  *[_type == "essay" && status == "live" && featured == true] | order(publishedAt desc) ${ESSAY_CARD_FRAGMENT}
`);

export async function getFeaturedEssays() {
  const { data } = await loadQuery({ query: FEATURED_ESSAYS_QUERY });
  return data ?? [];
}

const ESSAY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "essay" && slug.current == $slug][0] ${ESSAY_DETAIL_FRAGMENT}
`);

export async function getEssayBySlug(slug: string) {
  const { data } = await loadQuery({ query: ESSAY_BY_SLUG_QUERY, params: { slug } });
  return data;
}

const ALL_ESSAY_SLUGS_QUERY = defineQuery(`
  *[_type == "essay" && status == "live" && defined(slug.current)] {
    "slug": slug.current
  }
`);

export async function getAllEssaySlugs() {
  const { data } = await loadQuery({ query: ALL_ESSAY_SLUGS_QUERY });
  return data ?? [];
}

// ─── Team Members (collection) ─────────────────────────────

const TEAM_MEMBER_FRAGMENT = /* groq */ `{
  _id,
  name,
  ${SLUG},
  role,
  bio,
  email,
  isCore,
  displayOrder,
  quote,
  "portrait": portrait ${IMAGE_FRAGMENT},
  links[] { _key, platform, url }
}`;

const TEAM_MEMBERS_QUERY = defineQuery(`
  *[_type == "teamMember" && ($coreOnly == false || isCore == true)] | order(displayOrder asc) ${TEAM_MEMBER_FRAGMENT}
`);

export async function getTeamMembers(coreOnly: boolean = false) {
  const { data } = await loadQuery({ query: TEAM_MEMBERS_QUERY, params: { coreOnly } });
  return data ?? [];
}

const TEAM_MEMBER_BY_SLUG_QUERY = defineQuery(`
  *[_type == "teamMember" && slug.current == $slug][0] ${TEAM_MEMBER_FRAGMENT}
`);

export async function getTeamMemberBySlug(slug: string) {
  const { data } = await loadQuery({ query: TEAM_MEMBER_BY_SLUG_QUERY, params: { slug } });
  return data;
}

// ─── Recognition (collection) ──────────────────────────────

const RECOGNITION_QUERY = defineQuery(`
  *[_type == "recognition" && ($category == "all" || category == $category)] | order(year desc, displayOrder asc) {
    _id,
    category,
    title,
    year,
    description,
    url,
    displayOrder,
    "image": image ${IMAGE_FRAGMENT}
  }
`);

export async function getRecognition(
  category: 'all' | 'award' | 'talk' | 'partner' | 'client' = 'all'
) {
  const { data } = await loadQuery({ query: RECOGNITION_QUERY, params: { category } });
  return data ?? [];
}

// ─── Sitemap ───────────────────────────────────────────────

/**
 * Fetch all routable URLs from Sanity for dynamic sitemap generation.
 *
 * Singletons + free pages + cases + essays. Documents met seo.noIndex == true
 * worden automatisch uitgesloten.
 */
const SITEMAP_QUERY = defineQuery(`{
  "singletons": *[
    _type in [
      "homePage",
      "workIndexPage",
      "teamPage",
      "approachPage",
      "serviceDesignPage",
      "serviceBuildPage",
      "serviceAutomatePage",
      "academyIndexPage",
      "contactPage"
    ] && seo.noIndex != true
  ] {
    _type,
    _updatedAt,
    "href": select(
      _type == "homePage" => "/",
      _type == "workIndexPage" => "/work",
      _type == "teamPage" => "/team",
      _type == "approachPage" => "/approach",
      _type == "serviceDesignPage" => "/services/design",
      _type == "serviceBuildPage" => "/services/build",
      _type == "serviceAutomatePage" => "/services/automate",
      _type == "academyIndexPage" => "/academy",
      _type == "contactPage" => "/contact"
    )
  },
  "pages": *[_type == "page" && defined(slug.current) && seo.noIndex != true] {
    _updatedAt,
    "href": "/" + slug.current
  },
  "cases": *[_type == "case" && status == "live" && defined(slug.current) && seo.noIndex != true] {
    _updatedAt,
    "href": "/work/" + slug.current
  },
  "essays": *[_type == "essay" && status == "live" && defined(slug.current) && seo.noIndex != true] {
    _updatedAt,
    "href": "/academy/" + slug.current
  }
}`);

export async function getSitemapEntries() {
  const { data } = await loadQuery<any>({ query: SITEMAP_QUERY });
  if (!data) return [];

  const all = [
    ...(data.singletons ?? []),
    ...(data.pages ?? []),
    ...(data.cases ?? []),
    ...(data.essays ?? []),
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
