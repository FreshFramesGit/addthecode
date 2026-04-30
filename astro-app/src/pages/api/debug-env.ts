import type { APIRoute } from "astro";

/**
 * TIJDELIJKE debug endpoint — toont welke env-vars present zijn.
 * Geen waarden leaken, alleen present/absent + lengtes.
 *
 * VERWIJDER NA PHASE 4 LAUNCH.
 */
export const prerender = false;

const KEYS = [
  "PUBLIC_SANITY_PROJECT_ID",
  "PUBLIC_SANITY_DATASET",
  "PUBLIC_SANITY_STUDIO_PROJECT_ID",
  "PUBLIC_SANITY_STUDIO_DATASET",
  "PUBLIC_SANITY_STUDIO_URL",
  "PUBLIC_SITE_URL",
  "PUBLIC_GTM_CONTAINER_ID",
  "PUBLIC_TURNSTILE_SITE_KEY",
  "SANITY_API_READ_TOKEN",
  "SANITY_API_WRITE_TOKEN",
  "TURNSTILE_SECRET_KEY",
];

export const GET: APIRoute = () => {
  const summary = KEYS.reduce<Record<string, { present: boolean; length: number; preview: string }>>(
    (acc, key) => {
      const value =
        (import.meta as any).env?.[key] ??
        (typeof process !== "undefined" ? process.env?.[key] : undefined);
      const present = Boolean(value);
      const length = value ? String(value).length : 0;
      const preview = value
        ? key.startsWith("PUBLIC_")
          ? String(value).slice(0, 30)
          : `${String(value).slice(0, 4)}...${String(value).slice(-4)}`
        : "";
      acc[key] = { present, length, preview };
      return acc;
    },
    {},
  );

  return new Response(JSON.stringify(summary, null, 2), {
    headers: { "content-type": "application/json" },
  });
};
