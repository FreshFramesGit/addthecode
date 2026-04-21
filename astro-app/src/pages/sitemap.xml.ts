import type { APIRoute } from "astro";
import { getSitemapEntries, getSiteSettings } from "../utils/sanity";
import { getBaseUrl, getRequestOrigin } from "../utils/site-url";

/**
 * Dynamic sitemap generated from Sanity content at runtime.
 *
 * Replaces @astrojs/sitemap for SSR sites. Queries Sanity for all
 * routable documents and generates standard sitemap XML. New CMS items
 * appear automatically without a rebuild.
 *
 * Customization per project:
 * - Update STATIC_ROUTES with overview pages that aren't Sanity documents
 * - Update LANGUAGES if the project has different localization
 * - Add new CMS collections in getSitemapEntries() GROQ query (sanity.ts)
 */

/** Static routes that don't come from Sanity documents */
const STATIC_ROUTES: string[] = [
  // TODO: add project-specific overview pages, e.g. "/cases", "/faq", "/blog"
];

/** Languages to generate URLs for (empty string = default lang) */
const LANGUAGES = [""]; // TODO: add "/en" etc. if multilingual

export const GET: APIRoute = async ({ request }) => {
  const settings = (await getSiteSettings()) as any;
  const baseUrl = getRequestOrigin(request, getBaseUrl(settings));

  try {
    const entries = await getSitemapEntries();
    const urls: { loc: string; lastmod?: string }[] = [];

    // Sanity-driven URLs × each language
    for (const entry of entries) {
      for (const langPrefix of LANGUAGES) {
        urls.push({
          loc: `${baseUrl}${langPrefix}${entry.href}`,
          lastmod: entry.lastmod,
        });
      }
    }

    // Static routes (overview pages without Sanity documents)
    for (const route of STATIC_ROUTES) {
      for (const langPrefix of LANGUAGES) {
        const fullPath = `${langPrefix}${route}`;
        if (!urls.some((u) => u.loc.endsWith(fullPath))) {
          urls.push({ loc: `${baseUrl}${fullPath}` });
        }
      }
    }

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls.map(
        (u) =>
          `  <url><loc>${escapeXml(u.loc)}</loc>${
            u.lastmod
              ? `<lastmod>${new Date(u.lastmod).toISOString().split("T")[0]}</lastmod>`
              : ""
          }</url>`,
      ),
      "</urlset>",
    ].join("\n");

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
      {
        status: 500,
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      },
    );
  }
};

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
