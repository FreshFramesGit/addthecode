type CanonicalSettings = {
  globalCanonicalUrl?: string | null;
} | null | undefined;

const LOCALHOST_FALLBACK = "http://localhost:4321";

function cleanValue(value: string | null | undefined): string | undefined {
  const normalized = (value ?? "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
    .replace(/\r?\n/g, "")
    .trim();

  return normalized ? normalized : undefined;
}

export function stripTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

export function getConfiguredSiteUrl(): string | undefined {
  return cleanValue(
    import.meta.env.PUBLIC_SITE_URL ||
      import.meta.env.SITE_URL ||
      (typeof process !== "undefined"
        ? process.env.PUBLIC_SITE_URL || process.env.SITE_URL
        : undefined) ||
      import.meta.env.SITE,
  );
}

export function getBaseUrl(
  settings?: CanonicalSettings,
  fallback = getConfiguredSiteUrl() ?? LOCALHOST_FALLBACK,
): string {
  return stripTrailingSlash(
    cleanValue(settings?.globalCanonicalUrl) ?? cleanValue(fallback) ?? LOCALHOST_FALLBACK,
  );
}

export function toAbsoluteUrl(pathOrUrl: string, baseUrl: string): string {
  if (!pathOrUrl) return baseUrl;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl, `${stripTrailingSlash(baseUrl)}/`).toString();
}

export function getRequestOrigin(
  request: Request,
  fallbackBaseUrl = getConfiguredSiteUrl() ?? LOCALHOST_FALLBACK,
): string {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host")?.trim();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();

  if (host) {
    const protocol =
      forwardedProto ??
      (host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

    return `${protocol}://${host}`;
  }

  const requestUrl = new URL(request.url);
  const isLocalhost =
    requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1";

  return isLocalhost ? stripTrailingSlash(fallbackBaseUrl) : requestUrl.origin;
}
