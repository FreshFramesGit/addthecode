import type { APIRoute } from "astro";
import { getSiteSettings } from "../utils/sanity";
import { getBaseUrl, getRequestOrigin } from "../utils/site-url";

export const GET: APIRoute = async ({ request }) => {
  const settings = await getSiteSettings() as any;
  const siteUrl = getRequestOrigin(request, getBaseUrl(settings));
  const extraDirectives = settings?.robotsDirectives?.trim() ?? "";

  const robotsTxt = [
    "User-agent: *",
    "Allow: /",
    "",
    ...(extraDirectives ? [extraDirectives, ""] : []),
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ].join("\n");

  return new Response(robotsTxt, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
