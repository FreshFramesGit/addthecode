// Loading environment variables from .env files
import { loadEnv } from "vite";
const env = loadEnv(import.meta.env.MODE, process.cwd(), "");

const {
  PUBLIC_SANITY_STUDIO_PROJECT_ID,
  PUBLIC_SANITY_STUDIO_DATASET,
  PUBLIC_SANITY_PROJECT_ID,
  PUBLIC_SANITY_DATASET,
  PUBLIC_SANITY_STUDIO_URL,
} = env;

import { defineConfig } from "astro/config";

const cleanEnv = (value) => value?.trim() || undefined;
const site = cleanEnv(
  env.PUBLIC_SITE_URL ||
    env.SITE_URL ||
    process.env.PUBLIC_SITE_URL ||
    process.env.SITE_URL,
);
const projectId = cleanEnv(
  PUBLIC_SANITY_STUDIO_PROJECT_ID ||
    PUBLIC_SANITY_PROJECT_ID ||
    process.env.PUBLIC_SANITY_STUDIO_PROJECT_ID ||
    process.env.PUBLIC_SANITY_PROJECT_ID,
);
const dataset = cleanEnv(
  PUBLIC_SANITY_STUDIO_DATASET ||
    PUBLIC_SANITY_DATASET ||
    process.env.PUBLIC_SANITY_STUDIO_DATASET ||
    process.env.PUBLIC_SANITY_DATASET,
);

if (!projectId) {
  throw new Error(
    "Missing Sanity projectId. Configure the Sanity env vars before building or deploying.",
  );
}

if (!dataset) {
  throw new Error(
    "Missing Sanity dataset. Configure the Sanity env vars before building or deploying.",
  );
}

import sanity from "@sanity/astro";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  ...(site ? { site } : {}),
  output: "server",
  trailingSlash: "never",
  adapter: vercel(),
  // Enable Astro i18n only when the project actually needs multi-language routes.
  // Use Astro's built-in helpers instead of hand-building "/en" URLs in components.
  // i18n: {
  //   defaultLocale: "nl",
  //   locales: ["nl", "en"],
  //   routing: {
  //     prefixDefaultLocale: false,
  //   },
  // },
  integrations: [
    sanity({
      projectId,
      dataset,
      useCdn: false,
      apiVersion: "2026-03-29",
      stega: {
        studioUrl:
          cleanEnv(PUBLIC_SANITY_STUDIO_URL || process.env.PUBLIC_SANITY_STUDIO_URL) ||
          "http://localhost:3333",
      },
    }),
    react(),
    // Sitemap is generated dynamically via /sitemap.xml.ts (queries Sanity at runtime)
    // Do NOT add @astrojs/sitemap — it misses SSR dynamic routes
  ],

  // Vite optimizeDeps — nodig voor @sanity/visual-editing hydration in dev
  vite: {
    optimizeDeps: {
      include: [
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react/compiler-runtime",
        "lodash/isObject.js",
        "lodash/groupBy.js",
        "lodash/keyBy.js",
        "lodash/partition.js",
        "lodash/sortedIndex.js",
      ],
    },
  },

  // 301 Redirects — voeg projectspecifieke redirects toe
  redirects: {},
});
