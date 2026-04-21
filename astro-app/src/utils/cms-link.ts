type RouteDocumentType =
  // Template singletons
  | "homePage"
  | "page"
  | "thankYouPage"
  | "notFoundPage"
  // Add the Code pagina-singletons
  | "workIndexPage"
  | "teamPage"
  | "approachPage"
  | "serviceDesignPage"
  | "serviceBuildPage"
  | "serviceAutomatePage"
  | "academyIndexPage"
  | "contactPage"
  // Add the Code utility singletons
  | "errorPage"
  | "offlinePage"
  // Add the Code collections (slug-driven)
  | "case"
  | "essay";

export interface CmsLinkTarget {
  _type?: RouteDocumentType | string | null;
  slug?: string | null;
  href?: string | null;
}

export interface CmsLinkObject {
  linkKind?: "internalPage" | "pageSection" | "external" | null;
  internalPage?: CmsLinkTarget | null;
  pageSectionPage?: CmsLinkTarget | null;
  anchorId?: string | null;
  externalUrl?: string | null;
  openInNewTab?: boolean | null;
  blank?: boolean | null;
  href?: string | null;
  url?: string | null;
  legacyUrl?: string | null;
  isExternal?: boolean | null;
}

export type CmsLinkInput = string | CmsLinkObject | null | undefined;

export interface ResolvedCmsHref {
  href: string | null;
  isExternal: boolean;
  openInNewTab: boolean;
}

const HTTP_SCHEME_RE = /^https?:/i;
const ABSOLUTE_SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;
const UNSAFE_SCHEME_RE = /^(?:javascript|data|vbscript|file):/i;

function normalizeAnchorId(value: string | null | undefined): string | null {
  const anchorId = value?.trim().replace(/^#+/, "") ?? "";
  if (!anchorId) return null;
  if (!/^[A-Za-z0-9][A-Za-z0-9:_-]*$/.test(anchorId)) return null;
  return anchorId;
}

function joinPathAndAnchor(pathname: string, anchorId: string): string {
  return `${pathname}#${anchorId}`;
}

function normalizeInternalPath(rawValue: string): string {
  const input = rawValue.startsWith("/") ? rawValue : `/${rawValue}`;
  const url = new URL(input, "https://localhost");
  const pathname = url.pathname || "/";
  return `${pathname}${url.search}${url.hash}`;
}

function resolveDocumentPath(target: CmsLinkTarget | null | undefined): string | null {
  if (!target) return null;
  if (target.href) return normalizeInternalPath(target.href);

  switch (target._type) {
    // Template singletons
    case "homePage":
      return "/";
    case "page":
      return target.slug ? `/${target.slug}` : null;
    case "thankYouPage":
      return "/thank-you";
    case "notFoundPage":
      return "/404";

    // Add the Code pagina-singletons
    case "workIndexPage":
      return "/work";
    case "teamPage":
      return "/team";
    case "approachPage":
      return "/approach";
    case "serviceDesignPage":
      return "/services/design";
    case "serviceBuildPage":
      return "/services/build";
    case "serviceAutomatePage":
      return "/services/automate";
    case "academyIndexPage":
      return "/academy";
    case "contactPage":
      return "/contact";

    // Add the Code utility singletons
    case "errorPage":
      return "/500";
    case "offlinePage":
      return "/offline";

    // Add the Code collections (require slug)
    case "case":
      return target.slug ? `/work/${target.slug}` : null;
    case "essay":
      return target.slug ? `/academy/${target.slug}` : null;

    default:
      return null;
  }
}

function resolveExplicitLinkHref(link: CmsLinkObject | null | undefined): string | null {
  if (!link?.linkKind) return null;

  switch (link.linkKind) {
    case "internalPage":
      return resolveDocumentPath(link.internalPage);
    case "pageSection": {
      const anchorId = normalizeAnchorId(link.anchorId);
      const pagePath = resolveDocumentPath(link.pageSectionPage);
      if (!anchorId || !pagePath) return null;
      return joinPathAndAnchor(pagePath, anchorId);
    }
    case "external":
      return link.externalUrl?.trim() || null;
    default:
      return null;
  }
}

function getRawHref(link: CmsLinkInput): string | null {
  if (typeof link === "string") return link.trim() || null;
  if (!link) return null;

  return (
    resolveExplicitLinkHref(link) ??
    link.legacyUrl?.trim() ??
    link.url?.trim() ??
    link.href?.trim() ??
    null
  );
}

export function resolveCmsHref(link: CmsLinkInput): ResolvedCmsHref {
  const openInNewTab = Boolean(
    typeof link === "object" && link && (link.openInNewTab || link.blank),
  );
  const rawHref = getRawHref(link);

  if (!rawHref) {
    return { href: null, isExternal: false, openInNewTab };
  }

  const normalizedSchemeProbe = rawHref.replace(/\s+/g, "").toLowerCase();
  if (UNSAFE_SCHEME_RE.test(normalizedSchemeProbe)) {
    return { href: null, isExternal: false, openInNewTab: false };
  }

  if (rawHref.startsWith("#")) {
    const anchorId = normalizeAnchorId(rawHref);
    return {
      href: anchorId ? `#${anchorId}` : null,
      isExternal: false,
      openInNewTab: false,
    };
  }

  if (rawHref.startsWith("/#")) {
    const anchorId = normalizeAnchorId(rawHref.slice(2));
    return {
      href: anchorId ? joinPathAndAnchor("/", anchorId) : "/",
      isExternal: false,
      openInNewTab: false,
    };
  }

  if (rawHref.startsWith("//")) {
    return { href: rawHref, isExternal: true, openInNewTab };
  }

  if (ABSOLUTE_SCHEME_RE.test(rawHref)) {
    if (/^mailto:/i.test(rawHref) || /^tel:/i.test(rawHref)) {
      return { href: rawHref, isExternal: false, openInNewTab: false };
    }

    if (HTTP_SCHEME_RE.test(rawHref)) {
      return { href: rawHref, isExternal: true, openInNewTab };
    }

    return { href: null, isExternal: false, openInNewTab: false };
  }

  return {
    href: normalizeInternalPath(rawHref),
    isExternal: false,
    openInNewTab,
  };
}
